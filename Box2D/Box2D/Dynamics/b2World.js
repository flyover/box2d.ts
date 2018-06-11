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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Timer", "../Common/b2Draw", "../Collision/b2Collision", "../Collision/b2TimeOfImpact", "../Collision/Shapes/b2Shape", "./Joints/b2Joint", "./Joints/b2JointFactory", "./b2Body", "./b2ContactManager", "./b2Island", "./b2TimeStep", "../Particle/b2Particle", "../Particle/b2ParticleSystem"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Timer_1, b2Draw_1, b2Collision_1, b2TimeOfImpact_1, b2Shape_1, b2Joint_1, b2JointFactory_1, b2Body_1, b2ContactManager_1, b2Island_1, b2TimeStep_1, b2Settings_2, b2Particle_1, b2ParticleSystem_1, b2World;
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
            function (b2JointFactory_1_1) {
                b2JointFactory_1 = b2JointFactory_1_1;
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
                    // b2BlockAllocator m_blockAllocator;
                    // b2StackAllocator m_stackAllocator;
                    this.m_newFixture = false;
                    this.m_locked = false;
                    this.m_clearForces = true;
                    this.m_contactManager = new b2ContactManager_1.b2ContactManager();
                    this.m_bodyList = new Set();
                    this.m_jointList = new Set();
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystemList = new Set();
                    // #endif
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
                    this.m_controllerList = new Set();
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
                    this.m_bodyList.add(b);
                    return b;
                }
                /// Destroy a rigid body given a definition. No reference to the definition
                /// is retained. This function is locked during callbacks.
                /// @warning This automatically deletes all associated shapes and joints.
                /// @warning This function is locked during callbacks.
                DestroyBody(b) {
                    // DEBUG: b2Assert(this.m_bodyList.size > 0);
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    // Delete the attached joints.
                    for (const joint of b.GetJointList()) {
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeJoint(joint);
                        }
                        this.DestroyJoint(joint);
                    }
                    b.GetJointList().clear();
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    for (const controller of b.GetControllerList()) {
                        controller.RemoveBody(b);
                    }
                    // #endif
                    // Delete the attached contacts.
                    for (const contact of b.GetContactList()) {
                        this.m_contactManager.Destroy(contact);
                    }
                    b.GetContactList().clear();
                    // Delete the attached fixtures. This destroys broad-phase proxies.
                    for (const f of b.GetFixtureList()) {
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeFixture(f);
                        }
                        f.DestroyProxies(this.m_contactManager.m_broadPhase);
                        f.Destroy();
                    }
                    b.GetFixtureList().clear();
                    // Remove world body list.
                    this.m_bodyList.delete(b);
                }
                /// Create a joint to constrain bodies together. No reference to the definition
                /// is retained. This may cause the connected bodies to cease colliding.
                /// @warning This function is locked during callbacks.
                CreateJoint(def) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    const j = b2JointFactory_1.b2JointFactory.Create(def, null);
                    // Connect to the world list.
                    this.m_jointList.add(j);
                    // Connect to the bodies' doubly linked lists.
                    j.m_bodyA.GetJointList().add(j);
                    j.m_bodyB.GetJointList().add(j);
                    const bodyA = def.bodyA;
                    const bodyB = def.bodyB;
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (!def.collideConnected) {
                        for (const contact of bodyB.GetContactList()) {
                            if (contact.GetOtherBody(bodyB) === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                contact.FlagForFiltering();
                            }
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
                    const collideConnected = j.m_collideConnected;
                    // Remove from the doubly linked list.
                    this.m_jointList.delete(j);
                    // Disconnect from island graph.
                    const bodyA = j.m_bodyA;
                    const bodyB = j.m_bodyB;
                    // Wake up connected bodies.
                    bodyA.SetAwake(true);
                    bodyB.SetAwake(true);
                    // Remove from body 1.
                    bodyA.GetJointList().delete(j);
                    // Remove from body 2
                    bodyB.GetJointList().delete(j);
                    b2JointFactory_1.b2JointFactory.Destroy(j, null);
                    // DEBUG: b2Assert(this.m_jointList.size > 0);
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (!collideConnected) {
                        for (const contact of bodyB.GetContactList()) {
                            if (contact.GetOtherBody(bodyB) === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                contact.FlagForFiltering();
                            }
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
                    this.m_particleSystemList.add(p);
                    return p;
                }
                DestroyParticleSystem(p) {
                    if (this.IsLocked()) {
                        throw new Error();
                    }
                    // Remove world particleSystem list.
                    this.m_particleSystemList.delete(p);
                }
                CalculateReasonableParticleIterations(timeStep) {
                    if (this.m_particleSystemList.size === 0) {
                        return 1;
                    }
                    function GetSmallestRadius(world) {
                        let smallestRadius = b2Settings_2.b2_maxFloat;
                        for (const system of world.GetParticleSystemList()) {
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
                        for (const p of this.m_particleSystemList) {
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
                    for (const body of this.m_bodyList) {
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
                        for (const b of this.m_bodyList) {
                            const xf = b.m_xf;
                            this.m_debugDraw.PushTransform(xf);
                            for (const f of b.GetFixtureList()) {
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
                        for (const p of this.m_particleSystemList) {
                            this.DrawParticleSystem(p);
                        }
                    }
                    // #endif
                    if (flags & b2Draw_1.b2DrawFlags.e_jointBit) {
                        for (const j of this.m_jointList) {
                            this.DrawJoint(j);
                        }
                    }
                    // /*
                    if (flags & b2Draw_1.b2DrawFlags.e_pairBit) {
                        color.SetRGB(0.3, 0.9, 0.9);
                        for (const contact of this.m_contactManager.m_contactList) {
                            const fixtureA = contact.GetFixtureA();
                            const fixtureB = contact.GetFixtureB();
                            const cA = fixtureA.GetAABB(contact.m_indexA).GetCenter();
                            const cB = fixtureB.GetAABB(contact.m_indexB).GetCenter();
                            this.m_debugDraw.DrawSegment(cA, cB, color);
                        }
                    }
                    // */
                    if (flags & b2Draw_1.b2DrawFlags.e_aabbBit) {
                        color.SetRGB(0.9, 0.3, 0.9);
                        const bp = this.m_contactManager.m_broadPhase;
                        const vs = b2World.DrawDebugData_s_vs;
                        for (const b of this.m_bodyList) {
                            if (!b.IsActive()) {
                                continue;
                            }
                            for (const f of b.GetFixtureList()) {
                                for (let i = 0; i < f.m_proxyCount; ++i) {
                                    const proxy = f.m_proxies[i];
                                    const aabb = bp.GetFatAABB(proxy.treeNode);
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
                        for (const b of this.m_bodyList) {
                            const xf = b2World.DrawDebugData_s_xf;
                            xf.q.Copy(b.m_xf.q);
                            xf.p.Copy(b.GetWorldCenter());
                            this.m_debugDraw.DrawTransform(xf);
                        }
                    }
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    if (flags & b2Draw_1.b2DrawFlags.e_controllerBit) {
                        for (const c of this.m_controllerList) {
                            c.Draw(this.m_debugDraw);
                        }
                    }
                    // #endif
                }
                /// Query the world for all fixtures that potentially overlap the
                /// provided AABB.
                /// @param callback a user implemented callback class.
                /// @param aabb the query box.
                QueryAABB(callback, aabb, fn) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    broadPhase.Query(aabb, (proxy) => {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
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
                    if (callback) {
                        for (const p of this.m_particleSystemList) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryAABB(callback, aabb);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllAABB(aabb, out = []) {
                    this.QueryAABB(null, aabb, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                /// Query the world for all fixtures that potentially overlap the
                /// provided point.
                /// @param callback a user implemented callback class.
                /// @param point the query point.
                QueryPointAABB(callback, point, fn) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    broadPhase.QueryPoint(point, (proxy) => {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
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
                    if (callback) {
                        for (const p of this.m_particleSystemList) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryPointAABB(callback, point);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllPointAABB(point, out = []) {
                    this.QueryPointAABB(null, point, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                QueryFixtureShape(callback, shape, index, transform, fn) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const aabb = b2World.QueryFixtureShape_s_aabb;
                    shape.ComputeAABB(aabb, transform, index);
                    broadPhase.Query(aabb, (proxy) => {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
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
                    if (callback) {
                        for (const p of this.m_particleSystemList) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryAABB(callback, aabb);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllFixtureShape(shape, index, transform, out = []) {
                    this.QueryFixtureShape(null, shape, index, transform, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                QueryFixturePoint(callback, point, fn) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    broadPhase.QueryPoint(point, (proxy) => {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
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
                        for (const p of this.m_particleSystemList) {
                            if (callback.ShouldQueryParticleSystem(p)) {
                                p.QueryPointAABB(callback, point);
                            }
                        }
                    }
                    // #endif
                }
                QueryAllFixturePoint(point, out = []) {
                    this.QueryFixturePoint(null, point, (fixture) => { out.push(fixture); return true; });
                    return out;
                }
                RayCast(callback, point1, point2, fn) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const input = b2World.RayCast_s_input;
                    input.maxFraction = 1;
                    input.p1.Copy(point1);
                    input.p2.Copy(point2);
                    broadPhase.RayCast(input, (input, proxy) => {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
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
                        for (const p of this.m_particleSystemList) {
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
                    this.RayCast(null, point1, point2, (fixture, point, normal, fraction) => {
                        if (fraction < min_fraction) {
                            min_fraction = fraction;
                            result = fixture;
                        }
                        return min_fraction;
                    });
                    return result;
                }
                RayCastAll(point1, point2, out = []) {
                    this.RayCast(null, point1, point2, (fixture, point, normal, fraction) => {
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
                        for (const b of this.m_bodyList) {
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
                    return this.m_bodyList.size;
                }
                /// Get the number of joints.
                GetJointCount() {
                    return this.m_jointList.size;
                }
                /// Get the number of contacts (each may have 0 or more contact points).
                GetContactCount() {
                    return this.m_contactManager.m_contactList.size;
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
                            for (const b of this.m_bodyList) {
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
                    for (const b of this.m_bodyList) {
                        b.m_xf.p.SelfSub(newOrigin);
                        b.m_sweep.c0.SelfSub(newOrigin);
                        b.m_sweep.c.SelfSub(newOrigin);
                    }
                    for (const j of this.m_jointList) {
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
                    for (const b of this.m_bodyList) {
                        b.m_islandIndex = i;
                        b.Dump(log);
                        ++i;
                    }
                    i = 0;
                    for (const j of this.m_jointList) {
                        j.m_index = i;
                        ++i;
                    }
                    // First pass on joints, skip gear joints.
                    for (const j of this.m_jointList) {
                        if (j.m_type === b2Joint_1.b2JointType.e_gearJoint) {
                            continue;
                        }
                        log("{\n");
                        j.Dump(log);
                        log("}\n");
                    }
                    // Second pass on joints, only gear joints.
                    for (const j of this.m_jointList) {
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
                        case b2Joint_1.b2JointType.e_pulleyJoint:
                            {
                                const pulley = joint;
                                const s1 = pulley.GetGroundAnchorA();
                                const s2 = pulley.GetGroundAnchorB();
                                this.m_debugDraw.DrawSegment(s1, p1, color);
                                this.m_debugDraw.DrawSegment(s2, p2, color);
                                this.m_debugDraw.DrawSegment(s1, s2, color);
                            }
                            break;
                        case b2Joint_1.b2JointType.e_mouseJoint:
                            // don't draw this
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            break;
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
                        case b2Shape_1.b2ShapeType.e_circleShape:
                            {
                                const circle = shape;
                                const center = circle.m_p;
                                const radius = circle.m_radius;
                                const axis = b2Math_1.b2Vec2.UNITX;
                                this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                            }
                            break;
                        case b2Shape_1.b2ShapeType.e_edgeShape:
                            {
                                const edge = shape;
                                const v1 = edge.m_vertex1;
                                const v2 = edge.m_vertex2;
                                this.m_debugDraw.DrawSegment(v1, v2, color);
                            }
                            break;
                        case b2Shape_1.b2ShapeType.e_chainShape:
                            {
                                const chain = shape;
                                const count = chain.m_count;
                                const vertices = chain.m_vertices;
                                let v1 = vertices[0];
                                this.m_debugDraw.DrawCircle(v1, 0.05, color);
                                for (let i = 1; i < count; ++i) {
                                    const v2 = vertices[i];
                                    this.m_debugDraw.DrawSegment(v1, v2, color);
                                    this.m_debugDraw.DrawCircle(v2, 0.05, color);
                                    v1 = v2;
                                }
                            }
                            break;
                        case b2Shape_1.b2ShapeType.e_polygonShape:
                            {
                                const poly = shape;
                                const vertexCount = poly.m_count;
                                const vertices = poly.m_vertices;
                                this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                            }
                            break;
                    }
                }
                Solve(step) {
                    // #if B2_ENABLE_PARTICLE
                    // update previous transforms
                    for (const b of this.m_bodyList) {
                        b.m_xf0.Copy(b.m_xf);
                    }
                    // #endif
                    // #if B2_ENABLE_CONTROLLER
                    // @see b2Controller list
                    for (const controller of this.m_controllerList) {
                        controller.Step(step);
                    }
                    // #endif
                    this.m_profile.solveInit = 0;
                    this.m_profile.solveVelocity = 0;
                    this.m_profile.solvePosition = 0;
                    // Size the island for the worst case.
                    const island = this.m_island;
                    island.Initialize(this.m_bodyList.size, this.m_contactManager.m_contactList.size, this.m_jointList.size, null, // this.m_stackAllocator,
                    this.m_contactManager.m_contactListener);
                    // Clear all the island flags.
                    for (const b of this.m_bodyList) {
                        b.m_islandFlag = false;
                    }
                    for (const c of this.m_contactManager.m_contactList) {
                        c.m_islandFlag = false;
                    }
                    for (const j of this.m_jointList) {
                        j.m_islandFlag = false;
                    }
                    // Build and simulate all awake islands.
                    // DEBUG: const stackSize: number = this.m_bodyList.size;
                    const stack = this.s_stack;
                    for (const seed of this.m_bodyList) {
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
                            // Make sure the body is awake.
                            b.SetAwake(true);
                            // To keep islands as small as possible, we don't
                            // propagate islands across static bodies.
                            if (b.GetType() === b2Body_1.b2BodyType.b2_staticBody) {
                                continue;
                            }
                            // Search all contacts connected to this body.
                            for (const contact of b.GetContactList()) {
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
                                const other = contact.GetOtherBody(b);
                                // Was the other body already added to this island?
                                if (other.m_islandFlag) {
                                    continue;
                                }
                                // DEBUG: b2Assert(stackCount < stackSize);
                                stack[stackCount++] = other;
                                other.m_islandFlag = true;
                            }
                            // Search all joints connect to this body.
                            for (const joint of b.GetJointList()) {
                                if (joint.m_islandFlag) {
                                    continue;
                                }
                                const other = joint.GetOtherBody(b);
                                // Don't simulate joints connected to inactive bodies.
                                if (!other.IsActive()) {
                                    continue;
                                }
                                island.AddJoint(joint);
                                joint.m_islandFlag = true;
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
                    for (const b of this.m_bodyList) {
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
                    // b2Island island(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, &m_stackAllocator, m_contactManager.m_contactListener);
                    const island = this.m_island;
                    island.Initialize(2 * b2Settings_1.b2_maxTOIContacts, b2Settings_1.b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);
                    if (this.m_stepComplete) {
                        for (const b of this.m_bodyList) {
                            b.m_islandFlag = false;
                            b.m_sweep.alpha0 = 0;
                        }
                        for (const c of this.m_contactManager.m_contactList) {
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
                        for (const c of this.m_contactManager.m_contactList) {
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
                                for (const contact of body.GetContactList()) {
                                    if (island.m_bodyCount === island.m_bodyCapacity) {
                                        break;
                                    }
                                    if (island.m_contactCount === island.m_contactCapacity) {
                                        break;
                                    }
                                    // Has this contact already been added to the island?
                                    if (contact.m_islandFlag) {
                                        continue;
                                    }
                                    // Only add static, kinematic, or bullet bodies.
                                    const other = contact.GetOtherBody(body);
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
                            for (const contact of body.GetContactList()) {
                                contact.m_toiFlag = false;
                                contact.m_islandFlag = false;
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
                    this.m_controllerList.add(controller);
                    return controller;
                }
                RemoveController(controller) {
                    // b2Assert(controller.m_world === this, "Controller is not a member of this world");
                    this.m_controllerList.delete(controller);
                    // delete controller.m_world; // = null;
                    return controller;
                }
            };
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
            /// Ray-cast the world for all fixtures in the path of the ray. Your callback
            /// controls whether you get the closest point, any point, or n-points.
            /// The ray-cast ignores shapes that contain the starting point.
            /// @param callback a user implemented callback class.
            /// @param point1 the ray starting point
            /// @param point2 the ray ending point
            b2World.RayCast_s_input = new b2Collision_1.b2RayCastInput();
            b2World.RayCast_s_output = new b2Collision_1.b2RayCastOutput();
            b2World.RayCast_s_point = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_p1 = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_p2 = new b2Math_1.b2Vec2();
            b2World.DrawJoint_s_color = new b2Draw_1.b2Color(0.5, 0.8, 0.8);
            b2World.SolveTOI_s_subStep = new b2TimeStep_1.b2TimeStep();
            b2World.SolveTOI_s_backup = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_backup1 = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_backup2 = new b2Math_1.b2Sweep();
            b2World.SolveTOI_s_toi_input = new b2TimeOfImpact_1.b2TOIInput();
            b2World.SolveTOI_s_toi_output = new b2TimeOfImpact_1.b2TOIOutput();
            exports_1("b2World", b2World);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJXb3JsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyV29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFxQ0YsU0FBUztZQUVULHFFQUFxRTtZQUNyRSxzRUFBc0U7WUFDdEUsMEJBQTBCO1lBQzFCLFVBQUE7Z0JBMENFLFNBQVM7Z0JBRVQsNkJBQTZCO2dCQUM3Qiw0Q0FBNEM7Z0JBQzVDLFlBQVksT0FBVztvQkE3Q3ZCLHFDQUFxQztvQkFDckMscUNBQXFDO29CQUU5QixpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsYUFBUSxHQUFZLEtBQUssQ0FBQztvQkFDMUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7b0JBRXJCLHFCQUFnQixHQUFxQixJQUFJLG1DQUFnQixFQUFFLENBQUM7b0JBRTVELGVBQVUsR0FBZ0IsSUFBSSxHQUFHLEVBQVUsQ0FBQztvQkFDNUMsZ0JBQVcsR0FBaUIsSUFBSSxHQUFHLEVBQVcsQ0FBQztvQkFFL0QseUJBQXlCO29CQUNULHlCQUFvQixHQUEwQixJQUFJLEdBQUcsRUFBb0IsQ0FBQztvQkFDMUYsU0FBUztvQkFFTyxjQUFTLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDMUMsaUJBQVksR0FBWSxJQUFJLENBQUM7b0JBRTdCLDBCQUFxQixHQUFpQyxJQUFJLENBQUM7b0JBQzNELGdCQUFXLEdBQWtCLElBQUksQ0FBQztvQkFFekMsaURBQWlEO29CQUNqRCxnQ0FBZ0M7b0JBQ3pCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRTdCLHNDQUFzQztvQkFDL0IsbUJBQWMsR0FBWSxJQUFJLENBQUM7b0JBQy9CLHdCQUFtQixHQUFZLElBQUksQ0FBQztvQkFDcEMsa0JBQWEsR0FBWSxLQUFLLENBQUM7b0JBRS9CLG1CQUFjLEdBQVksSUFBSSxDQUFDO29CQUV0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