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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "../common/b2_timer.js", "./b2_contact_solver.js", "./b2_body.js", "./b2_time_step.js", "./b2_world_callbacks.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_settings_js_2, b2_settings_js_3, b2_settings_js_4, b2_math_js_1, b2_timer_js_1, b2_contact_solver_js_1, b2_body_js_1, b2_time_step_js_1, b2_world_callbacks_js_1, b2Island;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
                b2_settings_js_2 = b2_settings_js_1_1;
                b2_settings_js_3 = b2_settings_js_1_1;
                b2_settings_js_4 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_timer_js_1_1) {
                b2_timer_js_1 = b2_timer_js_1_1;
            },
            function (b2_contact_solver_js_1_1) {
                b2_contact_solver_js_1 = b2_contact_solver_js_1_1;
            },
            function (b2_body_js_1_1) {
                b2_body_js_1 = b2_body_js_1_1;
            },
            function (b2_time_step_js_1_1) {
                b2_time_step_js_1 = b2_time_step_js_1_1;
            },
            function (b2_world_callbacks_js_1_1) {
                b2_world_callbacks_js_1 = b2_world_callbacks_js_1_1;
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
                    this.m_bodies = [ /*1024*/]; // TODO: b2Settings
                    this.m_contacts = [ /*1024*/]; // TODO: b2Settings
                    this.m_joints = [ /*1024*/]; // TODO: b2Settings
                    this.m_positions = b2_time_step_js_1.b2Position.MakeArray(1024); // TODO: b2Settings
                    this.m_velocities = b2_time_step_js_1.b2Velocity.MakeArray(1024); // TODO: b2Settings
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_contactCount = 0;
                    this.m_bodyCapacity = 0;
                    this.m_contactCapacity = 0;
                    this.m_jointCapacity = 0;
                }
                Initialize(bodyCapacity, contactCapacity, jointCapacity, listener) {
                    this.m_bodyCapacity = bodyCapacity;
                    this.m_contactCapacity = contactCapacity;
                    this.m_jointCapacity = jointCapacity;
                    this.m_bodyCount = 0;
                    this.m_contactCount = 0;
                    this.m_jointCount = 0;
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
                        const new_length = b2_math_js_1.b2Max(this.m_positions.length * 2, bodyCapacity);
                        while (this.m_positions.length < new_length) {
                            this.m_positions[this.m_positions.length] = new b2_time_step_js_1.b2Position();
                        }
                    }
                    // TODO:
                    if (this.m_velocities.length < bodyCapacity) {
                        const new_length = b2_math_js_1.b2Max(this.m_velocities.length * 2, bodyCapacity);
                        while (this.m_velocities.length < new_length) {
                            this.m_velocities[this.m_velocities.length] = new b2_time_step_js_1.b2Velocity();
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
                        if (b.m_type === b2_body_js_1.b2BodyType.b2_dynamicBody) {
                            // Integrate velocities.
                            // v += h * b->m_invMass * (b->m_gravityScale * b->m_mass * gravity + b->m_force);
                            v.x += h * b.m_invMass * (b.m_gravityScale * b.m_mass * gravity.x + b.m_force.x);
                            v.y += h * b.m_invMass * (b.m_gravityScale * b.m_mass * gravity.y + b.m_force.y);
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
                        const translation = b2_math_js_1.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2_math_js_1.b2Vec2.DotVV(translation, translation) > b2_settings_js_2.b2_maxTranslationSquared) {
                            const ratio = b2_settings_js_2.b2_maxTranslation / translation.Length();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2_settings_js_3.b2_maxRotationSquared) {
                            const ratio = b2_settings_js_3.b2_maxRotation / b2_math_js_1.b2Abs(rotation);
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
                        let minSleepTime = b2_settings_js_1.b2_maxFloat;
                        const linTolSqr = b2_settings_js_4.b2_linearSleepTolerance * b2_settings_js_4.b2_linearSleepTolerance;
                        const angTolSqr = b2_settings_js_4.b2_angularSleepTolerance * b2_settings_js_4.b2_angularSleepTolerance;
                        for (let i = 0; i < this.m_bodyCount; ++i) {
                            const b = this.m_bodies[i];
                            if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                                continue;
                            }
                            if (!b.m_autoSleepFlag ||
                                b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
                                b2_math_js_1.b2Vec2.DotVV(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                                b.m_sleepTime = 0;
                                minSleepTime = 0;
                            }
                            else {
                                b.m_sleepTime += h;
                                minSleepTime = b2_math_js_1.b2Min(minSleepTime, b.m_sleepTime);
                            }
                        }
                        if (minSleepTime >= b2_settings_js_1.b2_timeToSleep && positionSolved) {
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
                        const translation = b2_math_js_1.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2_math_js_1.b2Vec2.DotVV(translation, translation) > b2_settings_js_2.b2_maxTranslationSquared) {
                            const ratio = b2_settings_js_2.b2_maxTranslation / translation.Length();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2_settings_js_3.b2_maxRotationSquared) {
                            const ratio = b2_settings_js_3.b2_maxRotation / b2_math_js_1.b2Abs(rotation);
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
            exports_1("b2Island", b2Island);
            b2Island.s_timer = new b2_timer_js_1.b2Timer();
            b2Island.s_solverData = new b2_time_step_js_1.b2SolverData();
            b2Island.s_contactSolverDef = new b2_contact_solver_js_1.b2ContactSolverDef();
            b2Island.s_contactSolver = new b2_contact_solver_js_1.b2ContactSolver();
            b2Island.s_translation = new b2_math_js_1.b2Vec2();
            b2Island.s_impulse = new b2_world_callbacks_js_1.b2ContactImpulse();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfaXNsYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX2lzbGFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBaUJGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQTZFRTtZQUVGOzs7Ozs7Ozs7Ozs7OztjQWNFO1lBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQXFCRTtZQUVGLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFHa0IsYUFBUSxHQUFhLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBQ3BELGVBQVUsR0FBZ0IsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtvQkFDekQsYUFBUSxHQUFjLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBRXJELGdCQUFXLEdBQWlCLDRCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQW1CO29CQUMzRSxpQkFBWSxHQUFpQiw0QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtvQkFFckYsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFFM0IsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLHNCQUFpQixHQUFXLENBQUMsQ0FBQztvQkFDOUIsb0JBQWUsR0FBVyxDQUFDLENBQUM7Z0JBNFlyQyxDQUFDO2dCQTFZUSxVQUFVLENBQUMsWUFBb0IsRUFBRSxlQUF1QixFQUFFLGFBQXFCLEVBQUUsUUFBMkI7b0JBQ2pILElBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxD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