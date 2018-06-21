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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJJc2xhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9Cb3gyRC9EeW5hbWljcy9iMklzbGFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBaUJGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQTZFRTtZQUVGOzs7Ozs7Ozs7Ozs7OztjQWNFO1lBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQXFCRTtZQUVGLFdBQUE7Z0JBQUE7b0JBQ1MsZ0JBQVcsR0FBUSxJQUFJLENBQUM7b0JBR3hCLGFBQVEsR0FBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO29CQUNwRCxlQUFVLEdBQWdCLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBQ3pELGFBQVEsR0FBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO29CQUVyRCxnQkFBVyxHQUFpQix1QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtvQkFDM0UsaUJBQVksR0FBaUIsdUJBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBRTVFLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFDekIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRTNCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUMzQixzQkFBaUIsR0FBVyxDQUFDLENBQUM7b0JBQzlCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO2dCQThZckMsQ0FBQztnQkE1WVEsVUFBVSxDQUFDLFlBQW9CLEVBQUUsZUFBdUIsRUFBRSxhQUFxQixFQUFFLFNBQWMsRUFBRSxRQUEyQjtvQkFD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