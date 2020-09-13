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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "../common/b2_timer.js", "../common/b2_draw.js", "../collision/b2_collision.js", "../collision/b2_time_of_impact.js", "../collision/b2_shape.js", "./b2_joint.js", "./b2_area_joint.js", "./b2_distance_joint.js", "./b2_friction_joint.js", "./b2_gear_joint.js", "./b2_motor_joint.js", "./b2_mouse_joint.js", "./b2_prismatic_joint.js", "./b2_pulley_joint.js", "./b2_revolute_joint.js", "./b2_rope_joint.js", "./b2_weld_joint.js", "./b2_wheel_joint.js", "./b2_body.js", "./b2_contact_manager.js", "./b2_island.js", "./b2_time_step.js", "./b2_world_callbacks.js", "../particle/b2_particle.js", "../particle/b2_particle_system.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_timer_js_1, b2_draw_js_1, b2_collision_js_1, b2_time_of_impact_js_1, b2_shape_js_1, b2_joint_js_1, b2_area_joint_js_1, b2_distance_joint_js_1, b2_friction_joint_js_1, b2_gear_joint_js_1, b2_motor_joint_js_1, b2_mouse_joint_js_1, b2_prismatic_joint_js_1, b2_pulley_joint_js_1, b2_revolute_joint_js_1, b2_rope_joint_js_1, b2_weld_joint_js_1, b2_wheel_joint_js_1, b2_body_js_1, b2_contact_manager_js_1, b2_island_js_1, b2_time_step_js_1, b2_world_callbacks_js_1, b2_world_callbacks_js_2, b2_settings_js_2, b2_particle_js_1, b2_particle_system_js_1, b2World;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
                b2_settings_js_2 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_timer_js_1_1) {
                b2_timer_js_1 = b2_timer_js_1_1;
            },
            function (b2_draw_js_1_1) {
                b2_draw_js_1 = b2_draw_js_1_1;
            },
            function (b2_collision_js_1_1) {
                b2_collision_js_1 = b2_collision_js_1_1;
            },
            function (b2_time_of_impact_js_1_1) {
                b2_time_of_impact_js_1 = b2_time_of_impact_js_1_1;
            },
            function (b2_shape_js_1_1) {
                b2_shape_js_1 = b2_shape_js_1_1;
            },
            function (b2_joint_js_1_1) {
                b2_joint_js_1 = b2_joint_js_1_1;
            },
            function (b2_area_joint_js_1_1) {
                b2_area_joint_js_1 = b2_area_joint_js_1_1;
            },
            function (b2_distance_joint_js_1_1) {
                b2_distance_joint_js_1 = b2_distance_joint_js_1_1;
            },
            function (b2_friction_joint_js_1_1) {
                b2_friction_joint_js_1 = b2_friction_joint_js_1_1;
            },
            function (b2_gear_joint_js_1_1) {
                b2_gear_joint_js_1 = b2_gear_joint_js_1_1;
            },
            function (b2_motor_joint_js_1_1) {
                b2_motor_joint_js_1 = b2_motor_joint_js_1_1;
            },
            function (b2_mouse_joint_js_1_1) {
                b2_mouse_joint_js_1 = b2_mouse_joint_js_1_1;
            },
            function (b2_prismatic_joint_js_1_1) {
                b2_prismatic_joint_js_1 = b2_prismatic_joint_js_1_1;
            },
            function (b2_pulley_joint_js_1_1) {
                b2_pulley_joint_js_1 = b2_pulley_joint_js_1_1;
            },
            function (b2_revolute_joint_js_1_1) {
                b2_revolute_joint_js_1 = b2_revolute_joint_js_1_1;
            },
            function (b2_rope_joint_js_1_1) {
                b2_rope_joint_js_1 = b2_rope_joint_js_1_1;
            },
            function (b2_weld_joint_js_1_1) {
                b2_weld_joint_js_1 = b2_weld_joint_js_1_1;
            },
            function (b2_wheel_joint_js_1_1) {
                b2_wheel_joint_js_1 = b2_wheel_joint_js_1_1;
            },
            function (b2_body_js_1_1) {
                b2_body_js_1 = b2_body_js_1_1;
            },
            function (b2_contact_manager_js_1_1) {
                b2_contact_manager_js_1 = b2_contact_manager_js_1_1;
            },
            function (b2_island_js_1_1) {
                b2_island_js_1 = b2_island_js_1_1;
            },
            function (b2_time_step_js_1_1) {
                b2_time_step_js_1 = b2_time_step_js_1_1;
            },
            function (b2_world_callbacks_js_1_1) {
                b2_world_callbacks_js_1 = b2_world_callbacks_js_1_1;
                b2_world_callbacks_js_2 = b2_world_callbacks_js_1_1;
            },
            function (b2_particle_js_1_1) {
                b2_particle_js_1 = b2_particle_js_1_1;
            },
            function (b2_particle_system_js_1_1) {
                b2_particle_system_js_1 = b2_particle_system_js_1_1;
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
                    this.m_contactManager = new b2_contact_manager_js_1.b2ContactManager();
                    this.m_bodyList = null;
                    this.m_jointList = null;
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystemList = null;
                    // #endif
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_gravity = new b2_math_js_1.b2Vec2();
                    this.m_allowSleep = true;
                    this.m_destructionListener = null;
                    this.m_debugDraw = null;
                    // This is used to compute the time step ratio to
                    // support a variable time step.
                    this.m_inv_dt0 = 0;
                    this.m_newContacts = false;
                    this.m_locked = false;
                    this.m_clearForces = true;
                    // These are for debugging the solver.
                    this.m_warmStarting = true;
                    this.m_continuousPhysics = true;
                    this.m_subStepping = false;
                    this.m_stepComplete = true;
                    this.m_profile = new b2_time_step_js_1.b2Profile();
                    this.m_island = new b2_island_js_1.b2Island();
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
                /// inside with b2World::DebugDraw method. The debug draw object is owned
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
                    const b = new b2_body_js_1.b2Body(def, this);
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
                        case b2_joint_js_1.b2JointType.e_distanceJoint: return new b2_distance_joint_js_1.b2DistanceJoint(def);
                        case b2_joint_js_1.b2JointType.e_mouseJoint: return new b2_mouse_joint_js_1.b2MouseJoint(def);
                        case b2_joint_js_1.b2JointType.e_prismaticJoint: return new b2_prismatic_joint_js_1.b2PrismaticJoint(def);
                        case b2_joint_js_1.b2JointType.e_revoluteJoint: return new b2_revolute_joint_js_1.b2RevoluteJoint(def);
                        case b2_joint_js_1.b2JointType.e_pulleyJoint: return new b2_pulley_joint_js_1.b2PulleyJoint(def);
                        case b2_joint_js_1.b2JointType.e_gearJoint: return new b2_gear_joint_js_1.b2GearJoint(def);
                        case b2_joint_js_1.b2JointType.e_wheelJoint: return new b2_wheel_joint_js_1.b2WheelJoint(def);
                        case b2_joint_js_1.b2JointType.e_weldJoint: return new b2_weld_joint_js_1.b2WeldJoint(def);
                        case b2_joint_js_1.b2JointType.e_frictionJoint: return new b2_friction_joint_js_1.b2FrictionJoint(def);
                        case b2_joint_js_1.b2JointType.e_ropeJoint: return new b2_rope_joint_js_1.b2RopeJoint(def);
                        case b2_joint_js_1.b2JointType.e_motorJoint: return new b2_motor_joint_js_1.b2MotorJoint(def);
                        case b2_joint_js_1.b2JointType.e_areaJoint: return new b2_area_joint_js_1.b2AreaJoint(def);
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
                    const p = new b2_particle_system_js_1.b2ParticleSystem(def, this);
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
                        let smallestRadius = b2_settings_js_2.b2_maxFloat;
                        for (let system = world.GetParticleSystemList(); system !== null; system = system.m_next) {
                            smallestRadius = b2_math_js_1.b2Min(smallestRadius, system.GetRadius());
                        }
                        return smallestRadius;
                    }
                    // Use the smallest radius, since that represents the worst-case.
                    return b2_particle_js_1.b2CalculateParticleIterations(this.m_gravity.Length(), GetSmallestRadius(this), timeStep);
                }
                // #if B2_ENABLE_PARTICLE
                Step(dt, velocityIterations, positionIterations, particleIterations = this.CalculateReasonableParticleIterations(dt)) {
                    // #else
                    // public Step(dt: number, velocityIterations: number, positionIterations: number): void {
                    // #endif
                    const stepTimer = b2World.Step_s_stepTimer.Reset();
                    // If new fixtures were added, we need to find the new contacts.
                    if (this.m_newContacts) {
                        this.m_contactManager.FindNewContacts();
                        this.m_newContacts = false;
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
                DebugDraw() {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const flags = this.m_debugDraw.GetFlags();
                    const color = b2World.DebugDraw_s_color.SetRGB(0, 0, 0);
                    if (flags & b2_draw_js_1.b2DrawFlags.e_shapeBit) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b.m_xf;
                            this.m_debugDraw.PushTransform(xf);
                            for (let f = b.GetFixtureList(); f; f = f.m_next) {
                                if (b.GetType() === b2_body_js_1.b2BodyType.b2_dynamicBody && b.m_mass === 0.0) {
                                    // Bad body
                                    this.DrawShape(f, new b2_draw_js_1.b2Color(1.0, 0.0, 0.0));
                                }
                                else if (!b.IsEnabled()) {
                                    color.SetRGB(0.5, 0.5, 0.3);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                                    color.SetRGB(0.5, 0.9, 0.5);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === b2_body_js_1.b2BodyType.b2_kinematicBody) {
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
                    if (flags & b2_draw_js_1.b2DrawFlags.e_particleBit) {
                        for (let p = this.m_particleSystemList; p; p = p.m_next) {
                            this.DrawParticleSystem(p);
                        }
                    }
                    // #endif
                    if (flags & b2_draw_js_1.b2DrawFlags.e_jointBit) {
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            j.Draw(this.m_debugDraw);
                        }
                    }
                    if (flags & b2_draw_js_1.b2DrawFlags.e_pairBit) {
                        color.SetRGB(0.3, 0.9, 0.9);
                        for (let contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next) {
                            const fixtureA = contact.GetFixtureA();
                            const fixtureB = contact.GetFixtureB();
                            const indexA = contact.GetChildIndexA();
                            const indexB = contact.GetChildIndexB();
                            const cA = fixtureA.GetAABB(indexA).GetCenter();
                            const cB = fixtureB.GetAABB(indexB).GetCenter();
                            this.m_debugDraw.DrawSegment(cA, cB, color);
                        }
                    }
                    if (flags & b2_draw_js_1.b2DrawFlags.e_aabbBit) {
                        color.SetRGB(0.9, 0.3, 0.9);
                        const vs = b2World.DebugDraw_s_vs;
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            if (!b.IsEnabled()) {
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
                    if (flags & b2_draw_js_1.b2DrawFlags.e_centerOfMassBit) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b2World.DebugDraw_s_xf;
                            xf.q.Copy(b.m_xf.q);
                            xf.p.Copy(b.GetWorldCenter());
                            this.m_debugDraw.DrawTransform(xf);
                        }
                    }
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    if (flags & b2_draw_js_1.b2DrawFlags.e_controllerBit) {
                        for (let c = this.m_controllerList; c; c = c.m_next) {
                            c.Draw(this.m_debugDraw);
                        }
                    }
                    // #endif
                }
                QueryAABB(...args) {
                    if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                        if (b2_collision_js_1.b2TestOverlapShape(shape, index, fixture.GetShape(), fixture_proxy.childIndex, transform, fixture.GetBody().GetTransform())) {
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
                    if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
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
                    if (args[0] instanceof b2_world_callbacks_js_2.b2RayCastCallback) {
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
                    if (!b2_math_js_1.b2Vec2.IsEqualToV(this.m_gravity, gravity)) {
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
                    // b2OpenDump("box2d_dump.inl");
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
                        if (j.m_type === b2_joint_js_1.b2JointType.e_gearJoint) {
                            continue;
                        }
                        log("{\n");
                        j.Dump(log);
                        log("}\n");
                    }
                    // Second pass on joints, only gear joints.
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        if (j.m_type !== b2_joint_js_1.b2JointType.e_gearJoint) {
                            continue;
                        }
                        log("{\n");
                        j.Dump(log);
                        log("}\n");
                    }
                    // b2CloseDump();
                }
                DrawShape(fixture, color) {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const shape = fixture.GetShape();
                    switch (shape.m_type) {
                        case b2_shape_js_1.b2ShapeType.e_circleShape: {
                            const circle = shape;
                            const center = circle.m_p;
                            const radius = circle.m_radius;
                            const axis = b2_math_js_1.b2Vec2.UNITX;
                            this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                            break;
                        }
                        case b2_shape_js_1.b2ShapeType.e_edgeShape: {
                            const edge = shape;
                            const v1 = edge.m_vertex1;
                            const v2 = edge.m_vertex2;
                            this.m_debugDraw.DrawSegment(v1, v2, color);
                            if (edge.m_oneSided === false) {
                                this.m_debugDraw.DrawPoint(v1, 4.0, color);
                                this.m_debugDraw.DrawPoint(v2, 4.0, color);
                            }
                            break;
                        }
                        case b2_shape_js_1.b2ShapeType.e_chainShape: {
                            const chain = shape;
                            const count = chain.m_count;
                            const vertices = chain.m_vertices;
                            let v1 = vertices[0];
                            for (let i = 1; i < count; ++i) {
                                const v2 = vertices[i];
                                this.m_debugDraw.DrawSegment(v1, v2, color);
                                v1 = v2;
                            }
                            break;
                        }
                        case b2_shape_js_1.b2ShapeType.e_polygonShape: {
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
                        if (!seed.IsAwake() || !seed.IsEnabled()) {
                            continue;
                        }
                        // The seed can be dynamic or kinematic.
                        if (seed.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
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
                            // DEBUG: b2Assert(b.IsEnabled());
                            island.AddBody(b);
                            // To keep islands as small as possible, we don't
                            // propagate islands across static bodies.
                            if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                                continue;
                            }
                            // Make sure the body is awake. (without resetting sleep timer).
                            b.m_awakeFlag = true;
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
                                // Don't simulate joints connected to disabled bodies.
                                if (!other.IsEnabled()) {
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
                        const profile = new b2_time_step_js_1.b2Profile();
                        island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
                        this.m_profile.solveInit += profile.solveInit;
                        this.m_profile.solveVelocity += profile.solveVelocity;
                        this.m_profile.solvePosition += profile.solvePosition;
                        // Post solve cleanup.
                        for (let i = 0; i < island.m_bodyCount; ++i) {
                            // Allow static bodies to participate in other islands.
                            const b = island.m_bodies[i];
                            if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
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
                    const timer = new b2_timer_js_1.b2Timer();
                    // Synchronize fixtures, check for out of range bodies.
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        // If a body was not in an island then it did not move.
                        if (!b.m_islandFlag) {
                            continue;
                        }
                        if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
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
                    island.Initialize(2 * b2_settings_js_1.b2_maxTOIContacts, b2_settings_js_1.b2_maxTOIContacts, 0, this.m_contactManager.m_contactListener);
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
                            if (c.m_toiCount > b2_settings_js_1.b2_maxSubSteps) {
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
                                const activeA = bA.IsAwake() && typeA !== b2_body_js_1.b2BodyType.b2_staticBody;
                                const activeB = bB.IsAwake() && typeB !== b2_body_js_1.b2BodyType.b2_staticBody;
                                // Is at least one body active (awake and dynamic or kinematic)?
                                if (!activeA && !activeB) {
                                    continue;
                                }
                                const collideA = bA.IsBullet() || typeA !== b2_body_js_1.b2BodyType.b2_dynamicBody;
                                const collideB = bB.IsBullet() || typeB !== b2_body_js_1.b2BodyType.b2_dynamicBody;
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
                                b2_time_of_impact_js_1.b2TimeOfImpact(output, input);
                                // Beta is the fraction of the remaining portion of the .
                                const beta = output.t;
                                if (output.state === b2_time_of_impact_js_1.b2TOIOutputState.e_touching) {
                                    alpha = b2_math_js_1.b2Min(alpha0 + (1 - alpha0) * beta, 1);
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
                        if (minContact === null || 1 - 10 * b2_settings_js_1.b2_epsilon < minAlpha) {
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
                            if (body.m_type === b2_body_js_1.b2BodyType.b2_dynamicBody) {
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
                                    if (other.m_type === b2_body_js_1.b2BodyType.b2_dynamicBody &&
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
                                    if (other.m_type !== b2_body_js_1.b2BodyType.b2_staticBody) {
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
                            if (body.m_type !== b2_body_js_1.b2BodyType.b2_dynamicBody) {
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
            b2World.Step_s_step = new b2_time_step_js_1.b2TimeStep();
            b2World.Step_s_stepTimer = new b2_timer_js_1.b2Timer();
            b2World.Step_s_timer = new b2_timer_js_1.b2Timer();
            // #endif
            /// Call this to draw shapes and other debug draw data.
            b2World.DebugDraw_s_color = new b2_draw_js_1.b2Color(0, 0, 0);
            b2World.DebugDraw_s_vs = b2_math_js_1.b2Vec2.MakeArray(4);
            b2World.DebugDraw_s_xf = new b2_math_js_1.b2Transform();
            b2World.QueryFixtureShape_s_aabb = new b2_collision_js_1.b2AABB();
            b2World.RayCast_s_input = new b2_collision_js_1.b2RayCastInput();
            b2World.RayCast_s_output = new b2_collision_js_1.b2RayCastOutput();
            b2World.RayCast_s_point = new b2_math_js_1.b2Vec2();
            b2World.SolveTOI_s_subStep = new b2_time_step_js_1.b2TimeStep();
            b2World.SolveTOI_s_backup = new b2_math_js_1.b2Sweep();
            b2World.SolveTOI_s_backup1 = new b2_math_js_1.b2Sweep();
            b2World.SolveTOI_s_backup2 = new b2_math_js_1.b2Sweep();
            b2World.SolveTOI_s_toi_input = new b2_time_of_impact_js_1.b2TOIInput();
            b2World.SolveTOI_s_toi_output = new b2_time_of_impact_js_1.b2TOIOutput();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfd29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfd29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBOENGLFNBQVM7WUFFVCxxRUFBcUU7WUFDckUsc0VBQXNFO1lBQ3RFLDBCQUEwQjtZQUMxQixVQUFBLE1BQWEsT0FBTztnQkEyQ2xCLFNBQVM7Z0JBRVQsNkJBQTZCO2dCQUM3Qiw0Q0FBNEM7Z0JBQzVDLFlBQVksT0FBVztvQkE5Q1AscUJBQWdCLEdBQXFCLElBQUksd0NBQWdCLEVBQUUsQ0FBQztvQkFFckUsZUFBVSxHQUFrQixJQUFJLENBQUM7b0JBQ2pDLGdCQUFXLEdBQW1CLElBQUksQ0FBQztvQkFFMUMseUJBQXlCO29CQUNsQix5QkFBb0IsR0FBNEIsSUFBSSxDQUFDO29CQUM1RCxTQUFTO29CQUVGLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFFaEIsY0FBUyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUMxQyxpQkFBWSxHQUFZLElBQUksQ0FBQztvQkFFN0IsMEJBQXFCLEdBQWlDLElBQUksQ0FBQztvQkFDM0QsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO29CQUV6QyxpREFBaUQ7b0JBQ2pELGdDQUFnQztvQkFDekIsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFFdEIsa0JBQWEsR0FBWSxLQUFLLENBQUM7b0JBQy9CLGFBQVEsR0FBWSxLQUFLLENBQUM7b0JBQzFCLGtCQUFhLEdBQVksSUFBSSxDQUFDO29CQUVyQyxzQ0FBc0M7b0JBQy9CLG1CQUFjLEdBQVksSUFBSSxDQUFDO29CQUMvQix3QkFBbUIsR0FBWSxJQUFJ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