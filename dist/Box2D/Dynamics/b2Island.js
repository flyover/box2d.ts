/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Timer", "./Contacts/b2ContactSolver", "./b2Body", "./b2TimeStep", "./b2WorldCallbacks"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Settings_2, b2Settings_3, b2Settings_4, b2Math_1, b2Timer_1, b2ContactSolver_1, b2Body_1, b2TimeStep_1, b2WorldCallbacks_1, b2Island;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
                b2Settings_2 = b2Settings_1_1;
                b2Settings_3 = b2Settings_1_1;
                b2Settings_4 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Timer_1_1) {
                b2Timer_1 = b2Timer_1_1;
            },
            function (b2ContactSolver_1_1) {
                b2ContactSolver_1 = b2ContactSolver_1_1;
            },
            function (b2Body_1_1) {
                b2Body_1 = b2Body_1_1;
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            },
            function (b2WorldCallbacks_1_1) {
                b2WorldCallbacks_1 = b2WorldCallbacks_1_1;
            }
        ],
        execute: function () {
            /*
            Position Correction Notes
            =========================
            I tried the several algorithms for position correction of the 2D revolute joint.
            I looked at these systems:
            - simple pendulum (1m diameter sphere on massless 5m stick) with initial angular velocity of 100 rad/s.
            - suspension bridge with 30 1m long planks of length 1m.
            - multi-link chain with 30 1m long links.
            
            Here are the algorithms:
            
            Baumgarte - A fraction of the position error is added to the velocity error. There is no
            separate position solver.
            
            Pseudo Velocities - After the velocity solver and position integration,
            the position error, Jacobian, and effective mass are recomputed. Then
            the velocity constraints are solved with pseudo velocities and a fraction
            of the position error is added to the pseudo velocity error. The pseudo
            velocities are initialized to zero and there is no warm-starting. After
            the position solver, the pseudo velocities are added to the positions.
            This is also called the First Order World method or the Position LCP method.
            
            Modified Nonlinear Gauss-Seidel (NGS) - Like Pseudo Velocities except the
            position error is re-computed for each constraint and the positions are updated
            after the constraint is solved. The radius vectors (aka Jacobians) are
            re-computed too (otherwise the algorithm has horrible instability). The pseudo
            velocity states are not needed because they are effectively zero at the beginning
            of each iteration. Since we have the current position error, we allow the
            iterations to terminate early if the error becomes smaller than b2_linearSlop.
            
            Full NGS or just NGS - Like Modified NGS except the effective mass are re-computed
            each time a constraint is solved.
            
            Here are the results:
            Baumgarte - this is the cheapest algorithm but it has some stability problems,
            especially with the bridge. The chain links separate easily close to the root
            and they jitter as they struggle to pull together. This is one of the most common
            methods in the field. The big drawback is that the position correction artificially
            affects the momentum, thus leading to instabilities and false bounce. I used a
            bias factor of 0.2. A larger bias factor makes the bridge less stable, a smaller
            factor makes joints and contacts more spongy.
            
            Pseudo Velocities - the is more stable than the Baumgarte method. The bridge is
            stable. However, joints still separate with large angular velocities. Drag the
            simple pendulum in a circle quickly and the joint will separate. The chain separates
            easily and does not recover. I used a bias factor of 0.2. A larger value lead to
            the bridge collapsing when a heavy cube drops on it.
            
            Modified NGS - this algorithm is better in some ways than Baumgarte and Pseudo
            Velocities, but in other ways it is worse. The bridge and chain are much more
            stable, but the simple pendulum goes unstable at high angular velocities.
            
            Full NGS - stable in all tests. The joints display good stiffness. The bridge
            still sags, but this is better than infinite forces.
            
            Recommendations
            Pseudo Velocities are not really worthwhile because the bridge and chain cannot
            recover from joint separation. In other cases the benefit over Baumgarte is small.
            
            Modified NGS is not a robust method for the revolute joint due to the violent
            instability seen in the simple pendulum. Perhaps it is viable with other constraint
            types, especially scalar constraints where the effective mass is a scalar.
            
            This leaves Baumgarte and Full NGS. Baumgarte has small, but manageable instabilities
            and is very fast. I don't think we can escape Baumgarte, especially in highly
            demanding cases where high constraint fidelity is not needed.
            
            Full NGS is robust and easy on the eyes. I recommend this as an option for
            higher fidelity simulation and certainly for suspension bridges and long chains.
            Full NGS might be a good choice for ragdolls, especially motorized ragdolls where
            joint separation can be problematic. The number of NGS iterations can be reduced
            for better performance without harming robustness much.
            
            Each joint in a can be handled differently in the position solver. So I recommend
            a system where the user can select the algorithm on a per joint basis. I would
            probably default to the slower Full NGS and let the user select the faster
            Baumgarte method in performance critical scenarios.
            */
            /*
            Cache Performance
            
            The Box2D solvers are dominated by cache misses. Data structures are designed
            to increase the number of cache hits. Much of misses are due to random access
            to body data. The constraint structures are iterated over linearly, which leads
            to few cache misses.
            
            The bodies are not accessed during iteration. Instead read only data, such as
            the mass values are stored with the constraints. The mutable data are the constraint
            impulses and the bodies velocities/positions. The impulses are held inside the
            constraint structures. The body velocities/positions are held in compact, temporary
            arrays to increase the number of cache hits. Linear and angular velocity are
            stored in a single array since multiple arrays lead to multiple misses.
            */
            /*
            2D Rotation
            
            R = [cos(theta) -sin(theta)]
                [sin(theta) cos(theta) ]
            
            thetaDot = omega
            
            Let q1 = cos(theta), q2 = sin(theta).
            R = [q1 -q2]
                [q2  q1]
            
            q1Dot = -thetaDot * q2
            q2Dot = thetaDot * q1
            
            q1_new = q1_old - dt * w * q2
            q2_new = q2_old + dt * w * q1
            then normalize.
            
            This might be faster than computing sin+cos.
            However, we can compute sin+cos of the same angle fast.
            */
            b2Island = class b2Island {
                constructor() {
                    this.m_allocator = null;
                    this.m_bodies = [ /*1024*/]; // TODO: b2Settings
                    this.m_contacts = [ /*1024*/]; // TODO: b2Settings
                    this.m_joints = [ /*1024*/]; // TODO: b2Settings
                    this.m_positions = b2TimeStep_1.b2Position.MakeArray(1024); // TODO: b2Settings
                    this.m_velocities = b2TimeStep_1.b2Velocity.MakeArray(1024); // TODO: b2Settings
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_contactCount = 0;
                    this.m_bodyCapacity = 0;
                    this.m_contactCapacity = 0;
                    this.m_jointCapacity = 0;
                }
                Initialize(bodyCapacity, contactCapacity, jointCapacity, allocator, listener) {
                    this.m_bodyCapacity = bodyCapacity;
                    this.m_contactCapacity = contactCapacity;
                    this.m_jointCapacity = jointCapacity;
                    this.m_bodyCount = 0;
                    this.m_contactCount = 0;
                    this.m_jointCount = 0;
                    this.m_allocator = allocator;
                    this.m_listener = listener;
                    // TODO:
                    // while (this.m_bodies.length < bodyCapacity) {
                    //   this.m_bodies[this.m_bodies.length] = null;
                    // }
                    // TODO:
                    // while (this.m_contacts.length < contactCapacity) {
                    //   this.m_contacts[this.m_contacts.length] = null;
                    // }
                    // TODO:
                    // while (this.m_joints.length < jointCapacity) {
                    //   this.m_joints[this.m_joints.length] = null;
                    // }
                    // TODO:
                    if (this.m_positions.length < bodyCapacity) {
                        const new_length = b2Math_1.b2Max(this.m_positions.length * 2, bodyCapacity);
                        while (this.m_positions.length < new_length) {
                            this.m_positions[this.m_positions.length] = new b2TimeStep_1.b2Position();
                        }
                    }
                    // TODO:
                    if (this.m_velocities.length < bodyCapacity) {
                        const new_length = b2Math_1.b2Max(this.m_velocities.length * 2, bodyCapacity);
                        while (this.m_velocities.length < new_length) {
                            this.m_velocities[this.m_velocities.length] = new b2TimeStep_1.b2Velocity();
                        }
                    }
                }
                Clear() {
                    this.m_bodyCount = 0;
                    this.m_contactCount = 0;
                    this.m_jointCount = 0;
                }
                AddBody(body) {
                    // DEBUG: b2Assert(this.m_bodyCount < this.m_bodyCapacity);
                    body.m_islandIndex = this.m_bodyCount;
                    this.m_bodies[this.m_bodyCount++] = body;
                }
                AddContact(contact) {
                    // DEBUG: b2Assert(this.m_contactCount < this.m_contactCapacity);
                    this.m_contacts[this.m_contactCount++] = contact;
                }
                AddJoint(joint) {
                    // DEBUG: b2Assert(this.m_jointCount < this.m_jointCapacity);
                    this.m_joints[this.m_jointCount++] = joint;
                }
                Solve(profile, step, gravity, allowSleep) {
                    const timer = b2Island.s_timer.Reset();
                    const h = step.dt;
                    // Integrate velocities and apply damping. Initialize the body state.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const b = this.m_bodies[i];
                        // const c: b2Vec2 =
                        this.m_positions[i].c.Copy(b.m_sweep.c);
                        const a = b.m_sweep.a;
                        const v = this.m_velocities[i].v.Copy(b.m_linearVelocity);
                        let w = b.m_angularVelocity;
                        // Store positions for continuous collision.
                        b.m_sweep.c0.Copy(b.m_sweep.c);
                        b.m_sweep.a0 = b.m_sweep.a;
                        if (b.m_type === b2Body_1.b2BodyType.b2_dynamicBody) {
                            // Integrate velocities.
                            v.x += h * (b.m_gravityScale * gravity.x + b.m_invMass * b.m_force.x);
                            v.y += h * (b.m_gravityScale * gravity.y + b.m_invMass * b.m_force.y);
                            w += h * b.m_invI * b.m_torque;
                            // Apply damping.
                            // ODE: dv/dt + c * v = 0
                            // Solution: v(t) = v0 * exp(-c * t)
                            // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
                            // v2 = exp(-c * dt) * v1
                            // Pade approximation:
                            // v2 = v1 * 1 / (1 + c * dt)
                            v.SelfMul(1.0 / (1.0 + h * b.m_linearDamping));
                            w *= 1.0 / (1.0 + h * b.m_angularDamping);
                        }
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                    }
                    timer.Reset();
                    // Solver data
                    const solverData = b2Island.s_solverData;
                    solverData.step.Copy(step);
                    solverData.positions = this.m_positions;
                    solverData.velocities = this.m_velocities;
                    // Initialize velocity constraints.
                    const contactSolverDef = b2Island.s_contactSolverDef;
                    contactSolverDef.step.Copy(step);
                    contactSolverDef.contacts = this.m_contacts;
                    contactSolverDef.count = this.m_contactCount;
                    contactSolverDef.positions = this.m_positions;
                    contactSolverDef.velocities = this.m_velocities;
                    contactSolverDef.allocator = this.m_allocator;
                    const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
                    contactSolver.InitializeVelocityConstraints();
                    if (step.warmStarting) {
                        contactSolver.WarmStart();
                    }
                    for (let i = 0; i < this.m_jointCount; ++i) {
                        this.m_joints[i].InitVelocityConstraints(solverData);
                    }
                    profile.solveInit = timer.GetMilliseconds();
                    // Solve velocity constraints.
                    timer.Reset();
                    for (let i = 0; i < step.velocityIterations; ++i) {
                        for (let j = 0; j < this.m_jointCount; ++j) {
                            this.m_joints[j].SolveVelocityConstraints(solverData);
                        }
                        contactSolver.SolveVelocityConstraints();
                    }
                    // Store impulses for warm starting
                    contactSolver.StoreImpulses();
                    profile.solveVelocity = timer.GetMilliseconds();
                    // Integrate positions.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const c = this.m_positions[i].c;
                        let a = this.m_positions[i].a;
                        const v = this.m_velocities[i].v;
                        let w = this.m_velocities[i].w;
                        // Check for large velocities
                        const translation = b2Math_1.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2Math_1.b2Vec2.DotVV(translation, translation) > b2Settings_2.b2_maxTranslationSquared) {
                            const ratio = b2Settings_2.b2_maxTranslation / translation.Length();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2Settings_3.b2_maxRotationSquared) {
                            const ratio = b2Settings_3.b2_maxRotation / b2Math_1.b2Abs(rotation);
                            w *= ratio;
                        }
                        // Integrate
                        c.x += h * v.x;
                        c.y += h * v.y;
                        a += h * w;
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                    }
                    // Solve position constraints
                    timer.Reset();
                    let positionSolved = false;
                    for (let i = 0; i < step.positionIterations; ++i) {
                        const contactsOkay = contactSolver.SolvePositionConstraints();
                        let jointsOkay = true;
                        for (let j = 0; j < this.m_jointCount; ++j) {
                            const jointOkay = this.m_joints[j].SolvePositionConstraints(solverData);
                            jointsOkay = jointsOkay && jointOkay;
                        }
                        if (contactsOkay && jointsOkay) {
                            // Exit early if the position errors are small.
                            positionSolved = true;
                            break;
                        }
                    }
                    // Copy state buffers back to the bodies
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const body = this.m_bodies[i];
                        body.m_sweep.c.Copy(this.m_positions[i].c);
                        body.m_sweep.a = this.m_positions[i].a;
                        body.m_linearVelocity.Copy(this.m_velocities[i].v);
                        body.m_angularVelocity = this.m_velocities[i].w;
                        body.SynchronizeTransform();
                    }
                    profile.solvePosition = timer.GetMilliseconds();
                    this.Report(contactSolver.m_velocityConstraints);
                    if (allowSleep) {
                        let minSleepTime = b2Settings_1.b2_maxFloat;
                        const linTolSqr = b2Settings_4.b2_linearSleepTolerance * b2Settings_4.b2_linearSleepTolerance;
                        const angTolSqr = b2Settings_4.b2_angularSleepTolerance * b2Settings_4.b2_angularSleepTolerance;
                        for (let i = 0; i < this.m_bodyCount; ++i) {
                            const b = this.m_bodies[i];
                            if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                                continue;
                            }
                            if (!b.m_autoSleepFlag ||
                                b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
                                b2Math_1.b2Vec2.DotVV(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                                b.m_sleepTime = 0;
                                minSleepTime = 0;
                            }
                            else {
                                b.m_sleepTime += h;
                                minSleepTime = b2Math_1.b2Min(minSleepTime, b.m_sleepTime);
                            }
                        }
                        if (minSleepTime >= b2Settings_1.b2_timeToSleep && positionSolved) {
                            for (let i = 0; i < this.m_bodyCount; ++i) {
                                const b = this.m_bodies[i];
                                b.SetAwake(false);
                            }
                        }
                    }
                }
                SolveTOI(subStep, toiIndexA, toiIndexB) {
                    // DEBUG: b2Assert(toiIndexA < this.m_bodyCount);
                    // DEBUG: b2Assert(toiIndexB < this.m_bodyCount);
                    // Initialize the body state.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const b = this.m_bodies[i];
                        this.m_positions[i].c.Copy(b.m_sweep.c);
                        this.m_positions[i].a = b.m_sweep.a;
                        this.m_velocities[i].v.Copy(b.m_linearVelocity);
                        this.m_velocities[i].w = b.m_angularVelocity;
                    }
                    const contactSolverDef = b2Island.s_contactSolverDef;
                    contactSolverDef.contacts = this.m_contacts;
                    contactSolverDef.count = this.m_contactCount;
                    contactSolverDef.allocator = this.m_allocator;
                    contactSolverDef.step.Copy(subStep);
                    contactSolverDef.positions = this.m_positions;
                    contactSolverDef.velocities = this.m_velocities;
                    const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
                    // Solve position constraints.
                    for (let i = 0; i < subStep.positionIterations; ++i) {
                        const contactsOkay = contactSolver.SolveTOIPositionConstraints(toiIndexA, toiIndexB);
                        if (contactsOkay) {
                            break;
                        }
                    }
                    /*
                    #if 0
                      // Is the new position really safe?
                      for (int32 i = 0; i < this.m_contactCount; ++i) {
                        b2Contact* c = this.m_contacts[i];
                        b2Fixture* fA = c.GetFixtureA();
                        b2Fixture* fB = c.GetFixtureB();
                  
                        b2Body* bA = fA.GetBody();
                        b2Body* bB = fB.GetBody();
                  
                        int32 indexA = c.GetChildIndexA();
                        int32 indexB = c.GetChildIndexB();
                  
                        b2DistanceInput input;
                        input.proxyA.Set(fA.GetShape(), indexA);
                        input.proxyB.Set(fB.GetShape(), indexB);
                        input.transformA = bA.GetTransform();
                        input.transformB = bB.GetTransform();
                        input.useRadii = false;
                  
                        b2DistanceOutput output;
                        b2SimplexCache cache;
                        cache.count = 0;
                        b2Distance(&output, &cache, &input);
                  
                        if (output.distance === 0 || cache.count === 3) {
                          cache.count += 0;
                        }
                      }
                    #endif
                    */
                    // Leap of faith to new safe state.
                    this.m_bodies[toiIndexA].m_sweep.c0.Copy(this.m_positions[toiIndexA].c);
                    this.m_bodies[toiIndexA].m_sweep.a0 = this.m_positions[toiIndexA].a;
                    this.m_bodies[toiIndexB].m_sweep.c0.Copy(this.m_positions[toiIndexB].c);
                    this.m_bodies[toiIndexB].m_sweep.a0 = this.m_positions[toiIndexB].a;
                    // No warm starting is needed for TOI events because warm
                    // starting impulses were applied in the discrete solver.
                    contactSolver.InitializeVelocityConstraints();
                    // Solve velocity constraints.
                    for (let i = 0; i < subStep.velocityIterations; ++i) {
                        contactSolver.SolveVelocityConstraints();
                    }
                    // Don't store the TOI contact forces for warm starting
                    // because they can be quite large.
                    const h = subStep.dt;
                    // Integrate positions
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const c = this.m_positions[i].c;
                        let a = this.m_positions[i].a;
                        const v = this.m_velocities[i].v;
                        let w = this.m_velocities[i].w;
                        // Check for large velocities
                        const translation = b2Math_1.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2Math_1.b2Vec2.DotVV(translation, translation) > b2Settings_2.b2_maxTranslationSquared) {
                            const ratio = b2Settings_2.b2_maxTranslation / translation.Length();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2Settings_3.b2_maxRotationSquared) {
                            const ratio = b2Settings_3.b2_maxRotation / b2Math_1.b2Abs(rotation);
                            w *= ratio;
                        }
                        // Integrate
                        c.SelfMulAdd(h, v);
                        a += h * w;
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                        // Sync bodies
                        const body = this.m_bodies[i];
                        body.m_sweep.c.Copy(c);
                        body.m_sweep.a = a;
                        body.m_linearVelocity.Copy(v);
                        body.m_angularVelocity = w;
                        body.SynchronizeTransform();
                    }
                    this.Report(contactSolver.m_velocityConstraints);
                }
                Report(constraints) {
                    if (this.m_listener === null) {
                        return;
                    }
                    for (let i = 0; i < this.m_contactCount; ++i) {
                        const c = this.m_contacts[i];
                        if (!c) {
                            continue;
                        }
                        const vc = constraints[i];
                        const impulse = b2Island.s_impulse;
                        impulse.count = vc.pointCount;
                        for (let j = 0; j < vc.pointCount; ++j) {
                            impulse.normalImpulses[j] = vc.points[j].normalImpulse;
                            impulse.tangentImpulses[j] = vc.points[j].tangentImpulse;
                        }
                        this.m_listener.PostSolve(c, impulse);
                    }
                }
            };
            b2Island.s_timer = new b2Timer_1.b2Timer();
            b2Island.s_solverData = new b2TimeStep_1.b2SolverData();
            b2Island.s_contactSolverDef = new b2ContactSolver_1.b2ContactSolverDef();
            b2Island.s_contactSolver = new b2ContactSolver_1.b2ContactSolver();
            b2Island.s_translation = new b2Math_1.b2Vec2();
            b2Island.s_impulse = new b2WorldCallbacks_1.b2ContactImpulse();
            exports_1("b2Island", b2Island);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJJc2xhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9Cb3gyRC9EeW5hbWljcy9iMklzbGFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBaUJGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQTZFRTtZQUVGOzs7Ozs7Ozs7Ozs7OztjQWNFO1lBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQXFCRTtZQUVGLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFDUyxnQkFBVyxHQUFRLElBQUksQ0FBQztvQkFHeEIsYUFBUSxHQUFhLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBQ3BELGVBQVUsR0FBZ0IsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtvQkFDekQsYUFBUSxHQUFjLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBRXJELGdCQUFXLEdBQWlCLHVCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQW1CO29CQUMzRSxpQkFBWSxHQUFpQix1QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtvQkFFNUUsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFFM0IsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLHNCQUFpQixHQUFXLENBQUMsQ0FBQztvQkFDOUIsb0JBQWUsR0FBVyxDQUFDLENBQUM7Z0JBOFlyQyxDQUFDO2dCQTVZUSxVQUFVLENBQUMsWUFBb0IsRUFBRSxlQUF1QixFQUFFLGFBQXFCLEVBQUUsU0FBYyxFQUFF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