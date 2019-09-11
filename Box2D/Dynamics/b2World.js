/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Timer", "../Common/b2Draw", "../Collision/b2Collision", "../Collision/b2TimeOfImpact", "../Collision/Shapes/b2Shape", "./Joints/b2Joint", "./Joints/b2AreaJoint", "./Joints/b2DistanceJoint", "./Joints/b2FrictionJoint", "./Joints/b2GearJoint", "./Joints/b2MotorJoint", "./Joints/b2MouseJoint", "./Joints/b2PrismaticJoint", "./Joints/b2PulleyJoint", "./Joints/b2RevoluteJoint", "./Joints/b2RopeJoint", "./Joints/b2WeldJoint", "./Joints/b2WheelJoint", "./b2Body", "./b2ContactManager", "./b2Island", "./b2TimeStep", "./b2WorldCallbacks", "../Particle/b2Particle", "../Particle/b2ParticleSystem"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Timer_1, b2Draw_1, b2Collision_1, b2TimeOfImpact_1, b2Shape_1, b2Joint_1, b2AreaJoint_1, b2DistanceJoint_1, b2FrictionJoint_1, b2GearJoint_1, b2MotorJoint_1, b2MouseJoint_1, b2PrismaticJoint_1, b2PulleyJoint_1, b2RevoluteJoint_1, b2RopeJoint_1, b2WeldJoint_1, b2WheelJoint_1, b2Body_1, b2ContactManager_1, b2Island_1, b2TimeStep_1, b2WorldCallbacks_1, b2WorldCallbacks_2, b2Settings_2, b2Particle_1, b2ParticleSystem_1, b2World;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
                b2Settings_2 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Timer_1_1) {
                b2Timer_1 = b2Timer_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            },
            function (b2TimeOfImpact_1_1) {
                b2TimeOfImpact_1 = b2TimeOfImpact_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            },
            function (b2Joint_1_1) {
                b2Joint_1 = b2Joint_1_1;
            },
            function (b2AreaJoint_1_1) {
                b2AreaJoint_1 = b2AreaJoint_1_1;
            },
            function (b2DistanceJoint_1_1) {
                b2DistanceJoint_1 = b2DistanceJoint_1_1;
            },
            function (b2FrictionJoint_1_1) {
                b2FrictionJoint_1 = b2FrictionJoint_1_1;
            },
            function (b2GearJoint_1_1) {
                b2GearJoint_1 = b2GearJoint_1_1;
            },
            function (b2MotorJoint_1_1) {
                b2MotorJoint_1 = b2MotorJoint_1_1;
            },
            function (b2MouseJoint_1_1) {
                b2MouseJoint_1 = b2MouseJoint_1_1;
            },
            function (b2PrismaticJoint_1_1) {
                b2PrismaticJoint_1 = b2PrismaticJoint_1_1;
            },
            function (b2PulleyJoint_1_1) {
                b2PulleyJoint_1 = b2PulleyJoint_1_1;
            },
            function (b2RevoluteJoint_1_1) {
                b2RevoluteJoint_1 = b2RevoluteJoint_1_1;
            },
            function (b2RopeJoint_1_1) {
                b2RopeJoint_1 = b2RopeJoint_1_1;
            },
            function (b2WeldJoint_1_1) {
                b2WeldJoint_1 = b2WeldJoint_1_1;
            },
            function (b2WheelJoint_1_1) {
                b2WheelJoint_1 = b2WheelJoint_1_1;
            },
            function (b2Body_1_1) {
                b2Body_1 = b2Body_1_1;
            },
            function (b2ContactManager_1_1) {
                b2ContactManager_1 = b2ContactManager_1_1;
            },
            function (b2Island_1_1) {
                b2Island_1 = b2Island_1_1;
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            },
            function (b2WorldCallbacks_1_1) {
                b2WorldCallbacks_1 = b2WorldCallbacks_1_1;
                b2WorldCallbacks_2 = b2WorldCallbacks_1_1;
            },
            function (b2Particle_1_1) {
                b2Particle_1 = b2Particle_1_1;
            },
            function (b2ParticleSystem_1_1) {
                b2ParticleSystem_1 = b2ParticleSystem_1_1;
            }
        ],
        execute: function () {
            // #endif
            /// The world class manages all physics entities, dynamic simulation,
            /// and asynchronous queries. The world also contains efficient memory
            /// management facilities.
            b2World = class b2World {
                // #endif
                /// Construct a world object.
                /// @param gravity the world gravity vector.
                constructor(gravity) {
                    this.m_newFixture = false;
                    this.m_locked = false;
                    this.m_clearForces = true;
                    this.m_contactManager = new b2ContactManager_1.b2ContactManager();
                    this.m_bodyList = null;
                    this.m_jointList = null;
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystemList = null;
                    // #endif
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_gravity = new b2Math_1.b2Vec2();
                    this.m_allowSleep = true;
                    this.m_destructionListener = null;
                    this.m_debugDraw = null;
                    // This is used to compute the time step ratio to
                    // support a variable time step.
                    this.m_inv_dt0 = 0;
                    // These are for debugging the solver.
                    this.m_warmStarting = true;
                    this.m_continuousPhysics = true;
                    this.m_subStepping = false;
                    this.m_stepComplete = true;
                    this.m_profile = new b2TimeStep_1.b2Profile();
                    this.m_island = new b2Island_1.b2Island();
                    this.s_stack = [];
                    // #if B2_ENABLE_CONTROLLER
                    this.m_controllerList = null;
                    this.m_controllerCount = 0;
                    this.m_gravity.Copy(gravity);
                }
                /// Register a destruction listener. The listener is owned by you and must
                /// remain in scope.
                SetDestructionListener(listener) {
                    this.m_destructionListener = listener;
                }
                /// Register a contact filter to provide specific control over collision.
                /// Otherwise the default filter is used (b2_defaultFilter). The listener is
                /// owned by you and must remain in scope.
                SetContactFilter(filter) {
                    this.m_contactManager.m_contactFilter = filter;
                }
                /// Register a contact event listener. The listener is owned by you and must
                /// remain in scope.
                SetContactListener(listener) {
                    this.m_contactManager.m_contactListener = listener;
                }
                /// Register a routine for debug drawing. The debug draw functions are called
                /// inside with b2World::DrawDebugData method. The debug draw object is owned
                /// by you and must remain in scope.
                SetDebugDraw(debugDraw) {
                    this.m_debugDraw = debugDraw;
                }
                /// Create a rigid body given a definition. No reference to the definition
                /// is retained.
                /// @warning This function is locked during callbacks.
                CreateBody(def = {}) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    const b = new b2Body_1.b2Body(def, this);
                    // Add to world doubly linked list.
                    b.m_prev = null;
                    b.m_next = this.m_bodyList;
                    if (this.m_bodyList) {
                        this.m_bodyList.m_prev = b;
                    }
                    this.m_bodyList = b;
                    ++this.m_bodyCount;
                    return b;
                }
                /// Destroy a rigid body given a definition. No reference to the definition
                /// is retained. This function is locked during callbacks.
                /// @warning This automatically deletes all associated shapes and joints.
                /// @warning This function is locked during callbacks.
                DestroyBody(b) {
                    // DEBUG: b2Assert(this.m_bodyCount > 0);
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    // Delete the attached joints.
                    let je = b.m_jointList;
                    while (je) {
                        const je0 = je;
                        je = je.next;
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeJoint(je0.joint);
                        }
                        this.DestroyJoint(je0.joint);
                        b.m_jointList = je;
                    }
                    b.m_jointList = null;
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    let coe = b.m_controllerList;
                    while (coe) {
                        const coe0 = coe;
                        coe = coe.nextController;
                        coe0.controller.RemoveBody(b);
                    }
                    // #endif
                    // Delete the attached contacts.
                    let ce = b.m_contactList;
                    while (ce) {
                        const ce0 = ce;
                        ce = ce.next;
                        this.m_contactManager.Destroy(ce0.contact);
                    }
                    b.m_contactList = null;
                    // Delete the attached fixtures. This destroys broad-phase proxies.
                    let f = b.m_fixtureList;
                    while (f) {
                        const f0 = f;
                        f = f.m_next;
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeFixture(f0);
                        }
                        f0.DestroyProxies();
                        f0.Reset();
                        b.m_fixtureList = f;
                        b.m_fixtureCount -= 1;
                    }
                    b.m_fixtureList = null;
                    b.m_fixtureCount = 0;
                    // Remove world body list.
                    if (b.m_prev) {
                        b.m_prev.m_next = b.m_next;
                    }
                    if (b.m_next) {
                        b.m_next.m_prev = b.m_prev;
                    }
                    if (b === this.m_bodyList) {
                        this.m_bodyList = b.m_next;
                    }
                    --this.m_bodyCount;
                }
                static _Joint_Create(def) {
                    switch (def.type) {
                        case b2Joint_1.b2JointType.e_distanceJoint: return new b2DistanceJoint_1.b2DistanceJoint(def);
                        case b2Joint_1.b2JointType.e_mouseJoint: return new b2MouseJoint_1.b2MouseJoint(def);
                        case b2Joint_1.b2JointType.e_prismaticJoint: return new b2PrismaticJoint_1.b2PrismaticJoint(def);
                        case b2Joint_1.b2JointType.e_revoluteJoint: return new b2RevoluteJoint_1.b2RevoluteJoint(def);
                        case b2Joint_1.b2JointType.e_pulleyJoint: return new b2PulleyJoint_1.b2PulleyJoint(def);
                        case b2Joint_1.b2JointType.e_gearJoint: return new b2GearJoint_1.b2GearJoint(def);
                        case b2Joint_1.b2JointType.e_wheelJoint: return new b2WheelJoint_1.b2WheelJoint(def);
                        case b2Joint_1.b2JointType.e_weldJoint: return new b2WeldJoint_1.b2WeldJoint(def);
                        case b2Joint_1.b2JointType.e_frictionJoint: return new b2FrictionJoint_1.b2FrictionJoint(def);
                        case b2Joint_1.b2JointType.e_ropeJoint: return new b2RopeJoint_1.b2RopeJoint(def);
                        case b2Joint_1.b2JointType.e_motorJoint: return new b2MotorJoint_1.b2MotorJoint(def);
                        case b2Joint_1.b2JointType.e_areaJoint: return new b2AreaJoint_1.b2AreaJoint(def);
                    }
                    throw new Error();
                }
                static _Joint_Destroy(joint) {
                }
                CreateJoint(def) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    const j = b2World._Joint_Create(def);
                    // Connect to the world list.
                    j.m_prev = null;
                    j.m_next = this.m_jointList;
                    if (this.m_jointList) {
                        this.m_jointList.m_prev = j;
                    }
                    this.m_jointList = j;
                    ++this.m_jointCount;
                    // Connect to the bodies' doubly linked lists.
                    // j.m_edgeA.other = j.m_bodyB; // done in b2Joint constructor
                    j.m_edgeA.prev = null;
                    j.m_edgeA.next = j.m_bodyA.m_jointList;
                    if (j.m_bodyA.m_jointList) {
                        j.m_bodyA.m_jointList.prev = j.m_edgeA;
                    }
                    j.m_bodyA.m_jointList = j.m_edgeA;
                    // j.m_edgeB.other = j.m_bodyA; // done in b2Joint constructor
                    j.m_edgeB.prev = null;
                    j.m_edgeB.next = j.m_bodyB.m_jointList;
                    if (j.m_bodyB.m_jointList) {
                        j.m_bodyB.m_jointList.prev = j.m_edgeB;
                    }
                    j.m_bodyB.m_jointList = j.m_edgeB;
                    const bodyA = j.m_bodyA;
                    const bodyB = j.m_bodyB;
                    const collideConnected = j.m_collideConnected;
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (!collideConnected) {
                        let edge = bodyB.GetContactList();
                        while (edge) {
                            if (edge.other === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                edge.contact.FlagForFiltering();
                            }
                            edge = edge.next;
                        }
                    }
                    // Note: creating a joint doesn't wake the bodies.
                    return j;
                }
                /// Destroy a joint. This may cause the connected bodies to begin colliding.
                /// @warning This function is locked during callbacks.
                DestroyJoint(j) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    // Remove from the doubly linked list.
                    if (j.m_prev) {
                        j.m_prev.m_next = j.m_next;
                    }
                    if (j.m_next) {
                        j.m_next.m_prev = j.m_prev;
                    }
                    if (j === this.m_jointList) {
                        this.m_jointList = j.m_next;
                    }
                    // Disconnect from island graph.
                    const bodyA = j.m_bodyA;
                    const bodyB = j.m_bodyB;
                    const collideConnected = j.m_collideConnected;
                    // Wake up connected bodies.
                    bodyA.SetAwake(true);
                    bodyB.SetAwake(true);
                    // Remove from body 1.
                    if (j.m_edgeA.prev) {
                        j.m_edgeA.prev.next = j.m_edgeA.next;
                    }
                    if (j.m_edgeA.next) {
                        j.m_edgeA.next.prev = j.m_edgeA.prev;
                    }
                    if (j.m_edgeA === bodyA.m_jointList) {
                        bodyA.m_jointList = j.m_edgeA.next;
                    }
                    j.m_edgeA.Reset();
                    // Remove from body 2
                    if (j.m_edgeB.prev) {
                        j.m_edgeB.prev.next = j.m_edgeB.next;
                    }
                    if (j.m_edgeB.next) {
                        j.m_edgeB.next.prev = j.m_edgeB.prev;
                    }
                    if (j.m_edgeB === bodyB.m_jointList) {
                        bodyB.m_jointList = j.m_edgeB.next;
                    }
                    j.m_edgeB.Reset();
                    b2World._Joint_Destroy(j);
                    // DEBUG: b2Assert(this.m_jointCount > 0);
                    --this.m_jointCount;
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (!collideConnected) {
                        let edge = bodyB.GetContactList();
                        while (edge) {
                            if (edge.other === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                edge.contact.FlagForFiltering();
                            }
                            edge = edge.next;
                        }
                    }
                }
                // #if B2_ENABLE_PARTICLE
                CreateParticleSystem(def) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    const p = new b2ParticleSystem_1.b2ParticleSystem(def, this);
                    // Add to world doubly linked list.
                    p.m_prev = null;
                    p.m_next = this.m_particleSystemList;
                    if (this.m_particleSystemList) {
                        this.m_particleSystemList.m_prev = p;
                    }
                    this.m_particleSystemList = p;
                    return p;
                }
                DestroyParticleSystem(p) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    // Remove world particleSystem list.
                    if (p.m_prev) {
                        p.m_prev.m_next = p.m_next;
                    }
                    if (p.m_next) {
                        p.m_next.m_prev = p.m_prev;
                    }
                    if (p === this.m_particleSystemList) {
                        this.m_particleSystemList = p.m_next;
                    }
                }
                CalculateReasonableParticleIterations(timeStep) {
                    if (this.m_particleSystemList === null) {
                        return 1;
                    }
                    function GetSmallestRadius(world) {
                        let smallestRadius = b2Settings_2.b2_maxFloat;
                        for (let system = world.GetParticleSystemList(); system !== null; system = system.m_next) {
                            smallestRadius = b2Math_1.b2Min(smallestRadius, system.GetRadius());
                        }
                        return smallestRadius;
                    }
                    // Use the smallest radius, since that represents the worst-case.
                    return b2Particle_1.b2CalculateParticleIterations(this.m_gravity.Length(), GetSmallestRadius(this), timeStep);
                }
                // #if B2_ENABLE_PARTICLE
                Step(dt, velocityIterations, positionIterations, particleIterations = this.CalculateReasonableParticleIterations(dt)) {
                    // #else
                    // public Step(dt: number, velocityIterations: number, positionIterations: number): void {
                    // #endif
                    const stepTimer = b2World.Step_s_stepTimer.Reset();
                    // If new fixtures were added, we need to find the new contacts.
                    if (this.m_newFixture) {
                        this.m_contactManager.FindNewContacts();
                        this.m_newFixture = false;
                    }
                    this.m_locked = true;
                    const step = b2World.Step_s_step;
                    step.dt = dt;
                    step.velocityIterations = velocityIterations;
                    step.positionIterations = positionIterations;
                    // #if B2_ENABLE_PARTICLE
                    step.particleIterations = particleIterations;
                    // #endif
                    if (dt > 0) {
                        step.inv_dt = 1 / dt;
                    }
                    else {
                        step.inv_dt = 0;
                    }
                    step.dtRatio = this.m_inv_dt0 * dt;
                    step.warmStarting = this.m_warmStarting;
                    // Update contacts. This is where some contacts are destroyed.
                    const timer = b2World.Step_s_timer.Reset();
                    this.m_contactManager.Collide();
                    this.m_profile.collide = timer.GetMilliseconds();
                    // Integrate velocities, solve velocity constraints, and integrate positions.
                    if (this.m_stepComplete && step.dt > 0) {
                        const timer = b2World.Step_s_timer.Reset();
                        // #if B2_ENABLE_PARTICLE
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            p.Solve(step); // Particle Simulation
                        }
                        // #endif
                        this.Solve(step);
                        this.m_profile.solve = timer.GetMilliseconds();
                    }
                    // Handle TOI events.
                    if (this.m_continuousPhysics && step.dt > 0) {
                        const timer = b2World.Step_s_timer.Reset();
                        this.SolveTOI(step);
                        this.m_profile.solveTOI = timer.GetMilliseconds();
                    }
                    if (step.dt > 0) {
                        this.m_inv_dt0 = step.inv_dt;
                    }
                    if (this.m_clearForces) {
                        this.ClearForces();
                    }
                    this.m_locked = false;
                    this.m_profile.step = stepTimer.GetMilliseconds();
                }
                /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
                /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
                /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
                /// a fixed sized time step under a variable frame-rate.
                /// When you perform sub-stepping you will disable auto clearing of forces and instead call
                /// ClearForces after all sub-steps are complete in one pass of your game loop.
                /// @see SetAutoClearForces
                ClearForces() {
                    for (let body = this.m_bodyList; body; body = body.m_next) {
                        body.m_force.SetZero();
                        body.m_torque = 0;
                    }
                }
                // #if B2_ENABLE_PARTICLE
                DrawParticleSystem(system) {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const particleCount = system.GetParticleCount();
                    if (particleCount) {
                        const radius = system.GetRadius();
                        const positionBuffer = system.GetPositionBuffer();
                        if (system.m_colorBuffer.data) {
                            const colorBuffer = system.GetColorBuffer();
                            this.m_debugDraw.DrawParticles(positionBuffer, radius, colorBuffer, particleCount);
                        }
                        else {
                            this.m_debugDraw.DrawParticles(positionBuffer, radius, null, particleCount);
                        }
                    }
                }
                DrawDebugData() {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const flags = this.m_debugDraw.GetFlags();
                    const color = b2World.DrawDebugData_s_color.SetRGB(0, 0, 0);
                    if (flags & b2Draw_1.b2DrawFlags.e_shapeBit) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b.m_xf;
                            this.m_debugDraw.PushTransform(xf);
                            for (let f = b.GetFixtureList(); f; f = f.m_next) {
                                if (!b.IsActive()) {
                                    color.SetRGB(0.5, 0.5, 0.3);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                                    color.SetRGB(0.5, 0.9, 0.5);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === b2Body_1.b2BodyType.b2_kinematicBody) {
                                    color.SetRGB(0.5, 0.5, 0.9);
                                    this.DrawShape(f, color);
                                }
                                else if (!b.IsAwake()) {
                                    color.SetRGB(0.6, 0.6, 0.6);
                                    this.DrawShape(f, color);
                                }
                                else {
                                    color.SetRGB(0.9, 0.7, 0.7);
                                    this.DrawShape(f, color);
                                }
                            }
                            this.m_debugDraw.PopTransform(xf);
                        }
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (flags & b2Draw_1.b2DrawFlags.e_particleBit) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            this.DrawParticleSystem(p);
                        }
                    }
                    // #endif
                    if (flags & b2Draw_1.b2DrawFlags.e_jointBit) {
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            this.DrawJoint(j);
                        }
                    }
                    /*
                    if (flags & b2DrawFlags.e_pairBit) {
                      color.SetRGB(0.3, 0.9, 0.9);
                      for (let contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next) {
                        const fixtureA = contact.GetFixtureA();
                        const fixtureB = contact.GetFixtureB();
                
                        const cA = fixtureA.GetAABB().GetCenter();
                        const cB = fixtureB.GetAABB().GetCenter();
                
                        this.m_debugDraw.DrawSegment(cA, cB, color);
                      }
                    }
                    */
                    if (flags & b2Draw_1.b2DrawFlags.e_aabbBit) {
                        color.SetRGB(0.9, 0.3, 0.9);
                        const vs = b2World.DrawDebugData_s_vs;
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            if (!b.IsActive()) {
                                continue;
                            }
                            for (let f = b.GetFixtureList(); f; f = f.m_next) {
                                for (let i = 0; i < f.m_proxyCount; ++i) {
                                    const proxy = f.m_proxies[i];
                                    const aabb = proxy.treeNode.aabb;
                                    vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
                                    vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
                                    vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
                                    vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
                                    this.m_debugDraw.DrawPolygon(vs, 4, color);
                                }
                            }
                        }
                    }
                    if (flags & b2Draw_1.b2DrawFlags.e_centerOfMassBit) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b2World.DrawDebugData_s_xf;
                            xf.q.Copy(b.m_xf.q);
                            xf.p.Copy(b.GetWorldCenter());
                            this.m_debugDraw.DrawTransform(xf);
                        }
                    }
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    if (flags & b2Draw_1.b2DrawFlags.e_controllerBit) {
                        for (let c = this.m_controllerList; c; c = c.m_next) {
                            c.Draw(this.m_debugDraw);
                        }
                    }
                    // #endif
                }
                QueryAABB(...args) {
                    if (args[0] instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        this._QueryAABB(args[0], args[1]);
                    }
                    else {
                        this._QueryAABB(null, args[0], args[1]);
                    }
                }
                _QueryAABB(callback, aabb, fn) {
                    this.m_contactManager.m_broadPhase.Query(aabb, (proxy) => {
                        const fixture_proxy = proxy.userData;
                        // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
                        const fixture = fixture_proxy.fixture;
                        if (callback) {
                            return callback.ReportFixture(fixture);
                        }
                        else if (fn) {
                            return fn(fixture);
                        }
                        return true;
                    });
                    // #if B2_ENABLE_PARTICLE
                    if (callback instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryAABB(callback, aabb);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllAABB(aabb, out = []) {
                    this.QueryAABB(aabb, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                QueryPointAABB(...args) {
                    if (args[0] instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        this._QueryPointAABB(args[0], args[1]);
                    }
                    else {
                        this._QueryPointAABB(null, args[0], args[1]);
                    }
                }
                _QueryPointAABB(callback, point, fn) {
                    this.m_contactManager.m_broadPhase.QueryPoint(point, (proxy) => {
                        const fixture_proxy = proxy.userData;
                        // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
                        const fixture = fixture_proxy.fixture;
                        if (callback) {
                            return callback.ReportFixture(fixture);
                        }
                        else if (fn) {
                            return fn(fixture);
                        }
                        return true;
                    });
                    // #if B2_ENABLE_PARTICLE
                    if (callback instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryPointAABB(callback, point);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllPointAABB(point, out = []) {
                    this.QueryPointAABB(point, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                QueryFixtureShape(...args) {
                    if (args[0] instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        this._QueryFixtureShape(args[0], args[1], args[2], args[3]);
                    }
                    else {
                        this._QueryFixtureShape(null, args[0], args[1], args[2], args[3]);
                    }
                }
                _QueryFixtureShape(callback, shape, index, transform, fn) {
                    const aabb = b2World.QueryFixtureShape_s_aabb;
                    shape.ComputeAABB(aabb, transform, index);
                    this.m_contactManager.m_broadPhase.Query(aabb, (proxy) => {
                        const fixture_proxy = proxy.userData;
                        // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
                        const fixture = fixture_proxy.fixture;
                        if (b2Collision_1.b2TestOverlapShape(shape, index, fixture.GetShape(), fixture_proxy.childIndex, transform, fixture.GetBody().GetTransform())) {
                            if (callback) {
                                return callback.ReportFixture(fixture);
                            }
                            else if (fn) {
                                return fn(fixture);
                            }
                        }
                        return true;
                    });
                    // #if B2_ENABLE_PARTICLE
                    if (callback instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryAABB(callback, aabb);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllFixtureShape(shape, index, transform, out = []) {
                    this.QueryFixtureShape(shape, index, transform, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                QueryFixturePoint(...args) {
                    if (args[0] instanceof b2WorldCallbacks_1.b2QueryCallback) {
                        this._QueryFixturePoint(args[0], args[1]);
                    }
                    else {
                        this._QueryFixturePoint(null, args[0], args[1]);
                    }
                }
                _QueryFixturePoint(callback, point, fn) {
                    this.m_contactManager.m_broadPhase.QueryPoint(point, (proxy) => {
                        const fixture_proxy = proxy.userData;
                        // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
                        const fixture = fixture_proxy.fixture;
                        if (fixture.TestPoint(point)) {
                            if (callback) {
                                return callback.ReportFixture(fixture);
                            }
                            else if (fn) {
                                return fn(fixture);
                            }
                        }
                        return true;
                    });
                    // #if B2_ENABLE_PARTICLE
                    if (callback) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryPointAABB(callback, point);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllFixturePoint(point, out = []) {
                    this.QueryFixturePoint(point, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                RayCast(...args) {
                    if (args[0] instanceof b2WorldCallbacks_2.b2RayCastCallback) {
                        this._RayCast(args[0], args[1], args[2]);
                    }
                    else {
                        this._RayCast(null, args[0], args[1], args[2]);
                    }
                }
                _RayCast(callback, point1, point2, fn) {
                    const input = b2World.RayCast_s_input;
                    input.maxFraction = 1;
                    input.p1.Copy(point1);
                    input.p2.Copy(point2);
                    this.m_contactManager.m_broadPhase.RayCast(input, (input, proxy) => {
                        const fixture_proxy = proxy.userData;
                        // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
                        const fixture = fixture_proxy.fixture;
                        const index = fixture_proxy.childIndex;
                        const output = b2World.RayCast_s_output;
                        const hit = fixture.RayCast(output, input, index);
                        if (hit) {
                            const fraction = output.fraction;
                            const point = b2World.RayCast_s_point;
                            point.Set((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
                            if (callback) {
                                return callback.ReportFixture(fixture, point, output.normal, fraction);
                            }
                            else if (fn) {
                                return fn(fixture, point, output.normal, fraction);
                            }
                        }
                        return input.maxFraction;
                    });
                    // #if B2_ENABLE_PARTICLE
                    if (callback) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.RayCast(callback, point1, point2);
                            }
                        }
                    }
                    // #endif
                }
                RayCastOne(point1, point2) {
                    let result = null;
                    let min_fraction = 1;
                    this.RayCast(point1, point2, (fixture, point, normal, fraction) => {
                        if (fraction < min_fraction) {
                            min_fraction = fraction;
                            result = fixture;
                        }
                        return min_fraction;
                    });
                    return result;
                }
                RayCastAll(point1, point2, out = []) {
                    this.RayCast(point1, point2, (fixture, point, normal, fraction) => {
                        out.push(fixture);
                        return 1;
                    });
                    return out;
                }
                /// Get the world body list. With the returned body, use b2Body::GetNext to get
                /// the next body in the world list. A NULL body indicates the end of the list.
                /// @return the head of the world body list.
                GetBodyList() {
                    return this.m_bodyList;
                }
                /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
                /// the next joint in the world list. A NULL joint indicates the end of the list.
                /// @return the head of the world joint list.
                GetJointList() {
                    return this.m_jointList;
                }
                // #if B2_ENABLE_PARTICLE
                GetParticleSystemList() {
                    return this.m_particleSystemList;
                }
                // #endif
                /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
                /// the next contact in the world list. A NULL contact indicates the end of the list.
                /// @return the head of the world contact list.
                /// @warning contacts are created and destroyed in the middle of a time step.
                /// Use b2ContactListener to avoid missing contacts.
                GetContactList() {
                    return this.m_contactManager.m_contactList;
                }
                /// Enable/disable sleep.
                SetAllowSleeping(flag) {
                    if (flag === this.m_allowSleep) {
                        return;
                    }
                    this.m_allowSleep = flag;
                    if (!this.m_allowSleep) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            b.SetAwake(true);
                        }
                    }
                }
                GetAllowSleeping() {
                    return this.m_allowSleep;
                }
                /// Enable/disable warm starting. For testing.
                SetWarmStarting(flag) {
                    this.m_warmStarting = flag;
                }
                GetWarmStarting() {
                    return this.m_warmStarting;
                }
                /// Enable/disable continuous physics. For testing.
                SetContinuousPhysics(flag) {
                    this.m_continuousPhysics = flag;
                }
                GetContinuousPhysics() {
                    return this.m_continuousPhysics;
                }
                /// Enable/disable single stepped continuous physics. For testing.
                SetSubStepping(flag) {
                    this.m_subStepping = flag;
                }
                GetSubStepping() {
                    return this.m_subStepping;
                }
                /// Get the number of broad-phase proxies.
                GetProxyCount() {
                    return this.m_contactManager.m_broadPhase.GetProxyCount();
                }
                /// Get the number of bodies.
                GetBodyCount() {
                    return this.m_bodyCount;
                }
                /// Get the number of joints.
                GetJointCount() {
                    return this.m_jointCount;
                }
                /// Get the number of contacts (each may have 0 or more contact points).
                GetContactCount() {
                    return this.m_contactManager.m_contactCount;
                }
                /// Get the height of the dynamic tree.
                GetTreeHeight() {
                    return this.m_contactManager.m_broadPhase.GetTreeHeight();
                }
                /// Get the balance of the dynamic tree.
                GetTreeBalance() {
                    return this.m_contactManager.m_broadPhase.GetTreeBalance();
                }
                /// Get the quality metric of the dynamic tree. The smaller the better.
                /// The minimum is 1.
                GetTreeQuality() {
                    return this.m_contactManager.m_broadPhase.GetTreeQuality();
                }
                /// Change the global gravity vector.
                SetGravity(gravity, wake = true) {
                    if (!b2Math_1.b2Vec2.IsEqualToV(this.m_gravity, gravity)) {
                        this.m_gravity.Copy(gravity);
                        if (wake) {
                            for (let b = this.m_bodyList; b; b = b.m_next) {
                                b.SetAwake(true);
                            }
                        }
                    }
                }
                /// Get the global gravity vector.
                GetGravity() {
                    return this.m_gravity;
                }
                /// Is the world locked (in the middle of a time step).
                IsLocked() {
                    return this.m_locked;
                }
                /// Set flag to control automatic clearing of forces after each time step.
                SetAutoClearForces(flag) {
                    this.m_clearForces = flag;
                }
                /// Get the flag that controls automatic clearing of forces after each time step.
                GetAutoClearForces() {
                    return this.m_clearForces;
                }
                /// Shift the world origin. Useful for large worlds.
                /// The body shift formula is: position -= newOrigin
                /// @param newOrigin the new origin with respect to the old origin
                ShiftOrigin(newOrigin) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_xf.p.SelfSub(newOrigin);
                        b.m_sweep.c0.SelfSub(newOrigin);
                        b.m_sweep.c.SelfSub(newOrigin);
                    }
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        j.ShiftOrigin(newOrigin);
                    }
                    this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
                }
                /// Get the contact manager for testing.
                GetContactManager() {
                    return this.m_contactManager;
                }
                /// Get the current profile.
                GetProfile() {
                    return this.m_profile;
                }
                /// Dump the world into the log file.
                /// @warning this should be called outside of a time step.
                Dump(log) {
                    if (this.m_locked) {
                        return;
                    }
                    log("const g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
                    log("this.m_world.SetGravity(g);\n");
                    log("const bodies: b2Body[] = [];\n");
                    log("const joints: b2Joint[] = [];\n");
                    let i = 0;
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_islandIndex = i;
                        b.Dump(log);
                        ++i;
                    }
                    i = 0;
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        j.m_index = i;
                        ++i;
                    }
                    // First pass on joints, skip gear joints.
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        if (j.m_type === b2Joint_1.b2JointType.e_gearJoint) {
                            continue;
                        }
                        log("{\n");
                        j.Dump(log);
                        log("}\n");
                    }
                    // Second pass on joints, only gear joints.
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        if (j.m_type !== b2Joint_1.b2JointType.e_gearJoint) {
                            continue;
                        }
                        log("{\n");
                        j.Dump(log);
                        log("}\n");
                    }
                }
                DrawJoint(joint) {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const bodyA = joint.GetBodyA();
                    const bodyB = joint.GetBodyB();
                    const xf1 = bodyA.m_xf;
                    const xf2 = bodyB.m_xf;
                    const x1 = xf1.p;
                    const x2 = xf2.p;
                    const p1 = joint.GetAnchorA(b2World.DrawJoint_s_p1);
                    const p2 = joint.GetAnchorB(b2World.DrawJoint_s_p2);
                    const color = b2World.DrawJoint_s_color.SetRGB(0.5, 0.8, 0.8);
                    switch (joint.m_type) {
                        case b2Joint_1.b2JointType.e_distanceJoint:
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            break;
                        case b2Joint_1.b2JointType.e_pulleyJoint: {
                            const pulley = joint;
                            const s1 = pulley.GetGroundAnchorA();
                            const s2 = pulley.GetGroundAnchorB();
                            this.m_debugDraw.DrawSegment(s1, p1, color);
                            this.m_debugDraw.DrawSegment(s2, p2, color);
                            this.m_debugDraw.DrawSegment(s1, s2, color);
                            break;
                        }
                        case b2Joint_1.b2JointType.e_mouseJoint: {
                            const c = b2World.DrawJoint_s_c;
                            c.Set(0.0, 1.0, 0.0);
                            this.m_debugDraw.DrawPoint(p1, 4.0, c);
                            this.m_debugDraw.DrawPoint(p2, 4.0, c);
                            c.Set(0.8, 0.8, 0.8);
                            this.m_debugDraw.DrawSegment(p1, p2, c);
                            break;
                        }
                        default:
                            this.m_debugDraw.DrawSegment(x1, p1, color);
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            this.m_debugDraw.DrawSegment(x2, p2, color);
                    }
                }
                DrawShape(fixture, color) {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const shape = fixture.GetShape();
                    switch (shape.m_type) {
                        case b2Shape_1.b2ShapeType.e_circleShape: {
                            const circle = shape;
                            const center = circle.m_p;
                            const radius = circle.m_radius;
                            const axis = b2Math_1.b2Vec2.UNITX;
                            this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                            break;
                        }
                        case b2Shape_1.b2ShapeType.e_edgeShape: {
                            const edge = shape;
                            const v1 = edge.m_vertex1;
                            const v2 = edge.m_vertex2;
                            this.m_debugDraw.DrawSegment(v1, v2, color);
                            break;
                        }
                        case b2Shape_1.b2ShapeType.e_chainShape: {
                            const chain = shape;
                            const count = chain.m_count;
                            const vertices = chain.m_vertices;
                            const ghostColor = b2World.DrawShape_s_ghostColor.SetRGBA(0.75 * color.r, 0.75 * color.g, 0.75 * color.b, color.a);
                            let v1 = vertices[0];
                            this.m_debugDraw.DrawPoint(v1, 4.0, color);
                            if (chain.m_hasPrevVertex) {
                                const vp = chain.m_prevVertex;
                                this.m_debugDraw.DrawSegment(vp, v1, ghostColor);
                                this.m_debugDraw.DrawCircle(vp, 0.1, ghostColor);
                            }
                            for (let i = 1; i < count; ++i) {
                                const v2 = vertices[i];
                                this.m_debugDraw.DrawSegment(v1, v2, color);
                                this.m_debugDraw.DrawPoint(v2, 4.0, color);
                                v1 = v2;
                            }
                            if (chain.m_hasNextVertex) {
                                const vn = chain.m_nextVertex;
                                this.m_debugDraw.DrawSegment(vn, v1, ghostColor);
                                this.m_debugDraw.DrawCircle(vn, 0.1, ghostColor);
                            }
                            break;
                        }
                        case b2Shape_1.b2ShapeType.e_polygonShape: {
                            const poly = shape;
                            const vertexCount = poly.m_count;
                            const vertices = poly.m_vertices;
                            this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                            break;
                        }
                    }
                }
                Solve(step) {
                    // #if B2_ENABLE_PARTICLE
                    // update previous transforms
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_xf0.Copy(b.m_xf);
                    }
                    // #endif
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    for (let controller = this.m_controllerList; controller; controller = controller.m_next) {
                        controller.Step(step);
                    }
                    // #endif
                    this.m_profile.solveInit = 0;
                    this.m_profile.solveVelocity = 0;
                    this.m_profile.solvePosition = 0;
                    // Size the island for the worst case.
                    const island = this.m_island;
                    island.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, this.m_contactManager.m_contactListener);
                    // Clear all the island flags.
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_islandFlag = false;
                    }
                    for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                        c.m_islandFlag = false;
                    }
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        j.m_islandFlag = false;
                    }
                    // Build and simulate all awake islands.
                    // DEBUG: const stackSize: number = this.m_bodyCount;
                    const stack = this.s_stack;
                    for (let seed = this.m_bodyList; seed; seed = seed.m_next) {
                        if (seed.m_islandFlag) {
                            continue;
                        }
                        if (!seed.IsAwake() || !seed.IsActive()) {
                            continue;
                        }
                        // The seed can be dynamic or kinematic.
                        if (seed.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                            continue;
                        }
                        // Reset island and stack.
                        island.Clear();
                        let stackCount = 0;
                        stack[stackCount++] = seed;
                        seed.m_islandFlag = true;
                        // Perform a depth first search (DFS) on the constraint graph.
                        while (stackCount > 0) {
                            // Grab the next body off the stack and add it to the island.
                            const b = stack[--stackCount];
                            if (!b) {
                                throw new Error();
                            }
                            // DEBUG: b2Assert(b.IsActive());
                            island.AddBody(b);
                            // Make sure the body is awake. (without resetting sleep timer).
                            b.m_awakeFlag = true;
                            // To keep islands as small as possible, we don't
                            // propagate islands across static bodies.
                            if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                                continue;
                            }
                            // Search all contacts connected to this body.
                            for (let ce = b.m_contactList; ce; ce = ce.next) {
                                const contact = ce.contact;
                                // Has this contact already been added to an island?
                                if (contact.m_islandFlag) {
                                    continue;
                                }
                                // Is this contact solid and touching?
                                if (!contact.IsEnabled() || !contact.IsTouching()) {
                                    continue;
                                }
                                // Skip sensors.
                                const sensorA = contact.m_fixtureA.m_isSensor;
                                const sensorB = contact.m_fixtureB.m_isSensor;
                                if (sensorA || sensorB) {
                                    continue;
                                }
                                island.AddContact(contact);
                                contact.m_islandFlag = true;
                                const other = ce.other;
                                // Was the other body already added to this island?
                                if (other.m_islandFlag) {
                                    continue;
                                }
                                // DEBUG: b2Assert(stackCount < stackSize);
                                stack[stackCount++] = other;
                                other.m_islandFlag = true;
                            }
                            // Search all joints connect to this body.
                            for (let je = b.m_jointList; je; je = je.next) {
                                if (je.joint.m_islandFlag) {
                                    continue;
                                }
                                const other = je.other;
                                // Don't simulate joints connected to inactive bodies.
                                if (!other.IsActive()) {
                                    continue;
                                }
                                island.AddJoint(je.joint);
                                je.joint.m_islandFlag = true;
                                if (other.m_islandFlag) {
                                    continue;
                                }
                                // DEBUG: b2Assert(stackCount < stackSize);
                                stack[stackCount++] = other;
                                other.m_islandFlag = true;
                            }
                        }
                        const profile = new b2TimeStep_1.b2Profile();
                        island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
                        this.m_profile.solveInit += profile.solveInit;
                        this.m_profile.solveVelocity += profile.solveVelocity;
                        this.m_profile.solvePosition += profile.solvePosition;
                        // Post solve cleanup.
                        for (let i = 0; i < island.m_bodyCount; ++i) {
                            // Allow static bodies to participate in other islands.
                            const b = island.m_bodies[i];
                            if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                                b.m_islandFlag = false;
                            }
                        }
                    }
                    for (let i = 0; i < stack.length; ++i) {
                        if (!stack[i]) {
                            break;
                        }
                        stack[i] = null;
                    }
                    const timer = new b2Timer_1.b2Timer();
                    // Synchronize fixtures, check for out of range bodies.
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        // If a body was not in an island then it did not move.
                        if (!b.m_islandFlag) {
                            continue;
                        }
                        if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                            continue;
                        }
                        // Update fixtures (for broad-phase).
                        b.SynchronizeFixtures();
                    }
                    // Look for new contacts.
                    this.m_contactManager.FindNewContacts();
                    this.m_profile.broadphase = timer.GetMilliseconds();
                }
                SolveTOI(step) {
                    const island = this.m_island;
                    island.Initialize(2 * b2Settings_1.b2_maxTOIContacts, b2Settings_1.b2_maxTOIContacts, 0, this.m_contactManager.m_contactListener);
                    if (this.m_stepComplete) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            b.m_islandFlag = false;
                            b.m_sweep.alpha0 = 0;
                        }
                        for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                            // Invalidate TOI
                            c.m_toiFlag = false;
                            c.m_islandFlag = false;
                            c.m_toiCount = 0;
                            c.m_toi = 1;
                        }
                    }
                    // Find TOI events and solve them.
                    for (;;) {
                        // Find the first TOI.
                        let minContact = null;
                        let minAlpha = 1;
                        for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                            // Is this contact disabled?
                            if (!c.IsEnabled()) {
                                continue;
                            }
                            // Prevent excessive sub-stepping.
                            if (c.m_toiCount > b2Settings_1.b2_maxSubSteps) {
                                continue;
                            }
                            let alpha = 1;
                            if (c.m_toiFlag) {
                                // This contact has a valid cached TOI.
                                alpha = c.m_toi;
                            }
                            else {
                                const fA = c.GetFixtureA();
                                const fB = c.GetFixtureB();
                                // Is there a sensor?
                                if (fA.IsSensor() || fB.IsSensor()) {
                                    continue;
                                }
                                const bA = fA.GetBody();
                                const bB = fB.GetBody();
                                const typeA = bA.m_type;
                                const typeB = bB.m_type;
                                // DEBUG: b2Assert(typeA !== b2BodyType.b2_staticBody || typeB !== b2BodyType.b2_staticBody);
                                const activeA = bA.IsAwake() && typeA !== b2Body_1.b2BodyType.b2_staticBody;
                                const activeB = bB.IsAwake() && typeB !== b2Body_1.b2BodyType.b2_staticBody;
                                // Is at least one body active (awake and dynamic or kinematic)?
                                if (!activeA && !activeB) {
                                    continue;
                                }
                                const collideA = bA.IsBullet() || typeA !== b2Body_1.b2BodyType.b2_dynamicBody;
                                const collideB = bB.IsBullet() || typeB !== b2Body_1.b2BodyType.b2_dynamicBody;
                                // Are these two non-bullet dynamic bodies?
                                if (!collideA && !collideB) {
                                    continue;
                                }
                                // Compute the TOI for this contact.
                                // Put the sweeps onto the same time interval.
                                let alpha0 = bA.m_sweep.alpha0;
                                if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0) {
                                    alpha0 = bB.m_sweep.alpha0;
                                    bA.m_sweep.Advance(alpha0);
                                }
                                else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0) {
                                    alpha0 = bA.m_sweep.alpha0;
                                    bB.m_sweep.Advance(alpha0);
                                }
                                // DEBUG: b2Assert(alpha0 < 1);
                                const indexA = c.GetChildIndexA();
                                const indexB = c.GetChildIndexB();
                                // Compute the time of impact in interval [0, minTOI]
                                const input = b2World.SolveTOI_s_toi_input;
                                input.proxyA.SetShape(fA.GetShape(), indexA);
                                input.proxyB.SetShape(fB.GetShape(), indexB);
                                input.sweepA.Copy(bA.m_sweep);
                                input.sweepB.Copy(bB.m_sweep);
                                input.tMax = 1;
                                const output = b2World.SolveTOI_s_toi_output;
                                b2TimeOfImpact_1.b2TimeOfImpact(output, input);
                                // Beta is the fraction of the remaining portion of the .
                                const beta = output.t;
                                if (output.state === b2TimeOfImpact_1.b2TOIOutputState.e_touching) {
                                    alpha = b2Math_1.b2Min(alpha0 + (1 - alpha0) * beta, 1);
                                }
                                else {
                                    alpha = 1;
                                }
                                c.m_toi = alpha;
                                c.m_toiFlag = true;
                            }
                            if (alpha < minAlpha) {
                                // This is the minimum TOI found so far.
                                minContact = c;
                                minAlpha = alpha;
                            }
                        }
                        if (minContact === null || 1 - 10 * b2Settings_1.b2_epsilon < minAlpha) {
                            // No more TOI events. Done!
                            this.m_stepComplete = true;
                            break;
                        }
                        // Advance the bodies to the TOI.
                        const fA = minContact.GetFixtureA();
                        const fB = minContact.GetFixtureB();
                        const bA = fA.GetBody();
                        const bB = fB.GetBody();
                        const backup1 = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
                        const backup2 = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);
                        bA.Advance(minAlpha);
                        bB.Advance(minAlpha);
                        // The TOI contact likely has some new contact points.
                        minContact.Update(this.m_contactManager.m_contactListener);
                        minContact.m_toiFlag = false;
                        ++minContact.m_toiCount;
                        // Is the contact solid?
                        if (!minContact.IsEnabled() || !minContact.IsTouching()) {
                            // Restore the sweeps.
                            minContact.SetEnabled(false);
                            bA.m_sweep.Copy(backup1);
                            bB.m_sweep.Copy(backup2);
                            bA.SynchronizeTransform();
                            bB.SynchronizeTransform();
                            continue;
                        }
                        bA.SetAwake(true);
                        bB.SetAwake(true);
                        // Build the island
                        island.Clear();
                        island.AddBody(bA);
                        island.AddBody(bB);
                        island.AddContact(minContact);
                        bA.m_islandFlag = true;
                        bB.m_islandFlag = true;
                        minContact.m_islandFlag = true;
                        // Get contacts on bodyA and bodyB.
                        // const bodies: b2Body[] = [bA, bB];
                        for (let i = 0; i < 2; ++i) {
                            const body = (i === 0) ? (bA) : (bB); // bodies[i];
                            if (body.m_type === b2Body_1.b2BodyType.b2_dynamicBody) {
                                for (let ce = body.m_contactList; ce; ce = ce.next) {
                                    if (island.m_bodyCount === island.m_bodyCapacity) {
                                        break;
                                    }
                                    if (island.m_contactCount === island.m_contactCapacity) {
                                        break;
                                    }
                                    const contact = ce.contact;
                                    // Has this contact already been added to the island?
                                    if (contact.m_islandFlag) {
                                        continue;
                                    }
                                    // Only add static, kinematic, or bullet bodies.
                                    const other = ce.other;
                                    if (other.m_type === b2Body_1.b2BodyType.b2_dynamicBody &&
                                        !body.IsBullet() && !other.IsBullet()) {
                                        continue;
                                    }
                                    // Skip sensors.
                                    const sensorA = contact.m_fixtureA.m_isSensor;
                                    const sensorB = contact.m_fixtureB.m_isSensor;
                                    if (sensorA || sensorB) {
                                        continue;
                                    }
                                    // Tentatively advance the body to the TOI.
                                    const backup = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
                                    if (!other.m_islandFlag) {
                                        other.Advance(minAlpha);
                                    }
                                    // Update the contact points
                                    contact.Update(this.m_contactManager.m_contactListener);
                                    // Was the contact disabled by the user?
                                    if (!contact.IsEnabled()) {
                                        other.m_sweep.Copy(backup);
                                        other.SynchronizeTransform();
                                        continue;
                                    }
                                    // Are there contact points?
                                    if (!contact.IsTouching()) {
                                        other.m_sweep.Copy(backup);
                                        other.SynchronizeTransform();
                                        continue;
                                    }
                                    // Add the contact to the island
                                    contact.m_islandFlag = true;
                                    island.AddContact(contact);
                                    // Has the other body already been added to the island?
                                    if (other.m_islandFlag) {
                                        continue;
                                    }
                                    // Add the other body to the island.
                                    other.m_islandFlag = true;
                                    if (other.m_type !== b2Body_1.b2BodyType.b2_staticBody) {
                                        other.SetAwake(true);
                                    }
                                    island.AddBody(other);
                                }
                            }
                        }
                        const subStep = b2World.SolveTOI_s_subStep;
                        subStep.dt = (1 - minAlpha) * step.dt;
                        subStep.inv_dt = 1 / subStep.dt;
                        subStep.dtRatio = 1;
                        subStep.positionIterations = 20;
                        subStep.velocityIterations = step.velocityIterations;
                        // #if B2_ENABLE_PARTICLE
                        subStep.particleIterations = step.particleIterations;
                        // #endif
                        subStep.warmStarting = false;
                        island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);
                        // Reset island flags and synchronize broad-phase proxies.
                        for (let i = 0; i < island.m_bodyCount; ++i) {
                            const body = island.m_bodies[i];
                            body.m_islandFlag = false;
                            if (body.m_type !== b2Body_1.b2BodyType.b2_dynamicBody) {
                                continue;
                            }
                            body.SynchronizeFixtures();
                            // Invalidate all contact TOIs on this displaced body.
                            for (let ce = body.m_contactList; ce; ce = ce.next) {
                                ce.contact.m_toiFlag = false;
                                ce.contact.m_islandFlag = false;
                            }
                        }
                        // Commit fixture proxy movements to the broad-phase so that new contacts are created.
                        // Also, some contacts can be destroyed.
                        this.m_contactManager.FindNewContacts();
                        if (this.m_subStepping) {
                            this.m_stepComplete = false;
                            break;
                        }
                    }
                }
                // #if B2_ENABLE_CONTROLLER
                AddController(controller) {
                    // b2Assert(controller.m_world === null, "Controller can only be a member of one world");
                    // controller.m_world = this;
                    controller.m_next = this.m_controllerList;
                    controller.m_prev = null;
                    if (this.m_controllerList) {
                        this.m_controllerList.m_prev = controller;
                    }
                    this.m_controllerList = controller;
                    ++this.m_controllerCount;
                    return controller;
                }
                RemoveController(controller) {
                    // b2Assert(controller.m_world === this, "Controller is not a member of this world");
                    if (controller.m_prev) {
                        controller.m_prev.m_next = controller.m_next;
                    }
                    if (controller.m_next) {
                        controller.m_next.m_prev = controller.m_prev;
                    }
                    if (this.m_controllerList === controller) {
                        this.m_controllerList = controller.m_next;
                    }
                    --this.m_controllerCount;
                    controller.m_prev = null;
                    controller.m_next = null;
                    // delete controller.m_world; // = null;
                    return controller;
                }
            };
            exports_1("b2World", b2World);
            // #endif
            /// Take a time step. This performs collision detection, integration,
            /// and constraint solution.
            /// @param timeStep the amount of time to simulate, this should not vary.
            /// @param velocityIterations for the velocity constraint solver.
            /// @param positionIterations for the position constraint solver.
            b2World.Step_s_step = new b2TimeStep_1.b2TimeStep();
            b2World.Step_s_stepTimer = new b2Timer_1.b2Timer();
            b2World.Step_s_timer = new b2Timer_1.b2Timer();
            // #endif
            /// Call this to draw shapes and other debug draw data.
            b2World.DrawDebugData_s_color = new b2Draw_1.b2Color(0, 0, 0);
            b2World.DrawDebugData_s_vs = b2Math_1.b2Vec2.MakeArray(4);
            b2World.DrawDebugData_s_xf = new b2Math_1.b2Transform();
            b2World.QueryFixtureShape_s_aabb = new b2Collision_1.b2AABB();
            b2World.RayCast_s_input = new b2Collision_1.b2RayCastInput();
            b2World.RayCast_s_output = new b2Collision_1.b2RayCastOutput();
            b2World.RayCast_s_point = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_p1 = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_p2 = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_color = new b2Draw_1.b2Color(0.5, 0.8, 0.8);
            b2World.DrawJoint_s_c = new b2Draw_1.b2Color();
            b2World.DrawShape_s_ghostColor = new b2Draw_1.b2Color();
            b2World.SolveTOI_s_subStep = new b2TimeStep_1.b2TimeStep();
            b2World.SolveTOI_s_backup = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_backup1 = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_backup2 = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_toi_input = new b2TimeOfImpact_1.b2TOIInput();
            b2World.SolveTOI_s_toi_output = new b2TimeOfImpact_1.b2TOIOutput();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJXb3JsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyV29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBOENGLFNBQVM7WUFFVCxxRUFBcUU7WUFDckUsc0VBQXNFO1lBQ3RFLDBCQUEwQjtZQUMxQixVQUFBLE1BQWEsT0FBTztnQkEyQ2xCLFNBQVM7Z0JBRVQsNkJBQTZCO2dCQUM3Qiw0Q0FBNEM7Z0JBQzVDLFlBQVksT0FBVztvQkE5Q2hCLGlCQUFZLEdBQVksS0FBSyxDQUFDO29CQUM5QixhQUFRLEdBQVksS0FBSyxDQUFDO29CQUMxQixrQkFBYSxHQUFZLElBQUksQ0FBQztvQkFFckIscUJBQWdCLEdBQXFCLElBQUksbUNBQWdCLEVBQUUsQ0FBQztvQkFFckUsZUFBVSxHQUFrQixJQUFJLENBQUM7b0JBQ2pDLGdCQUFXLEdBQW1CLElBQUksQ0FBQztvQkFFMUMseUJBQXlCO29CQUNsQix5QkFBb0IsR0FBNEIsSUFBSSxDQUFDO29CQUM1RCxTQUFTO29CQUVGLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFFaEIsY0FBUyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzFDLGlCQUFZLEdBQVksSUFBSSxDQUFDO29CQUU3QiwwQkFBcUIsR0FBaUMsSUFBSSxDQUFDO29CQUMzRCxnQkFBVyxHQUFrQixJQUFJLENBQUM7b0JBRXpDLGlEQUFpRDtvQkFDakQsZ0NBQWdDO29CQUN6QixjQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUU3QixzQ0FBc0M7b0JBQy9CLG1CQUFjLEdBQVksSUFBSSxDQUFDO29CQUMvQix3QkFBbUIsR0FBWSxJQUFJLENBQUM7b0JBQ3BDLGtCQUFhLEdB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