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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Collision/Shapes/b2Shape", "./b2Fixture"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Shape_1, b2Fixture_1, b2BodyType, b2BodyDef, b2Body;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            },
            function (b2Fixture_1_1) {
                b2Fixture_1 = b2Fixture_1_1;
            }
        ],
        execute: function () {
            // #endif
            /// The body type.
            /// static: zero mass, zero velocity, may be manually moved
            /// kinematic: zero mass, non-zero velocity set by user, moved by solver
            /// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
            (function (b2BodyType) {
                b2BodyType[b2BodyType["b2_unknown"] = -1] = "b2_unknown";
                b2BodyType[b2BodyType["b2_staticBody"] = 0] = "b2_staticBody";
                b2BodyType[b2BodyType["b2_kinematicBody"] = 1] = "b2_kinematicBody";
                b2BodyType[b2BodyType["b2_dynamicBody"] = 2] = "b2_dynamicBody";
                // TODO_ERIN
                // b2_bulletBody = 3
            })(b2BodyType || (b2BodyType = {}));
            exports_1("b2BodyType", b2BodyType);
            /// A body definition holds all the data needed to construct a rigid body.
            /// You can safely re-use body definitions. Shapes are added to a body after construction.
            b2BodyDef = class b2BodyDef {
                constructor() {
                    /// The body type: static, kinematic, or dynamic.
                    /// Note: if a dynamic body would have zero mass, the mass is set to one.
                    this.type = b2BodyType.b2_staticBody;
                    /// The world position of the body. Avoid creating bodies at the origin
                    /// since this can lead to many overlapping shapes.
                    this.position = new b2Math_1.b2Vec2(0, 0);
                    /// The world angle of the body in radians.
                    this.angle = 0;
                    /// The linear velocity of the body's origin in world co-ordinates.
                    this.linearVelocity = new b2Math_1.b2Vec2(0, 0);
                    /// The angular velocity of the body.
                    this.angularVelocity = 0;
                    /// Linear damping is use to reduce the linear velocity. The damping parameter
                    /// can be larger than 1.0f but the damping effect becomes sensitive to the
                    /// time step when the damping parameter is large.
                    this.linearDamping = 0;
                    /// Angular damping is use to reduce the angular velocity. The damping parameter
                    /// can be larger than 1.0f but the damping effect becomes sensitive to the
                    /// time step when the damping parameter is large.
                    this.angularDamping = 0;
                    /// Set this flag to false if this body should never fall asleep. Note that
                    /// this increases CPU usage.
                    this.allowSleep = true;
                    /// Is this body initially awake or sleeping?
                    this.awake = true;
                    /// Should this body be prevented from rotating? Useful for characters.
                    this.fixedRotation = false;
                    /// Is this a fast moving body that should be prevented from tunneling through
                    /// other moving bodies? Note that all bodies are prevented from tunneling through
                    /// kinematic and static bodies. This setting is only considered on dynamic bodies.
                    /// @warning You should use this flag sparingly since it increases processing time.
                    this.bullet = false;
                    /// Does this body start out active?
                    this.active = true;
                    /// Use this to store application specific body data.
                    this.userData = null;
                    /// Scale the gravity applied to this body.
                    this.gravityScale = 1;
                }
            };
            exports_1("b2BodyDef", b2BodyDef);
            /// A rigid body. These are created via b2World::CreateBody.
            b2Body = class b2Body {
                // #endif
                constructor(bd, world) {
                    this.m_type = b2BodyType.b2_staticBody;
                    this.m_islandFlag = false;
                    this.m_awakeFlag = false;
                    this.m_autoSleepFlag = false;
                    this.m_bulletFlag = false;
                    this.m_fixedRotationFlag = false;
                    this.m_activeFlag = false;
                    this.m_toiFlag = false;
                    this.m_islandIndex = 0;
                    this.m_xf = new b2Math_1.b2Transform(); // the body origin transform
                    // #if B2_ENABLE_PARTICLE
                    this.m_xf0 = new b2Math_1.b2Transform();
                    // #endif
                    this.m_sweep = new b2Math_1.b2Sweep(); // the swept motion for CCD
                    this.m_linearVelocity = new b2Math_1.b2Vec2();
                    this.m_angularVelocity = 0;
                    this.m_force = new b2Math_1.b2Vec2();
                    this.m_torque = 0;
                    this.m_fixtureList = new Set();
                    this.m_jointList = new Set();
                    this.m_contactList = new Set();
                    this.m_mass = 1;
                    this.m_invMass = 1;
                    // Rotational inertia about the center of mass.
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_linearDamping = 0;
                    this.m_angularDamping = 0;
                    this.m_gravityScale = 1;
                    this.m_sleepTime = 0;
                    this.m_userData = null;
                    // #if B2_ENABLE_CONTROLLER
                    this.m_controllerList = new Set();
                    this.m_bulletFlag = b2Settings_1.b2Maybe(bd.bullet, false);
                    this.m_fixedRotationFlag = b2Settings_1.b2Maybe(bd.fixedRotation, false);
                    this.m_autoSleepFlag = b2Settings_1.b2Maybe(bd.allowSleep, true);
                    this.m_awakeFlag = b2Settings_1.b2Maybe(bd.awake, true);
                    this.m_activeFlag = b2Settings_1.b2Maybe(bd.active, true);
                    this.m_world = world;
                    this.m_xf.p.Copy(b2Settings_1.b2Maybe(bd.position, b2Math_1.b2Vec2.ZERO));
                    // DEBUG: b2Assert(this.m_xf.p.IsValid());
                    this.m_xf.q.SetAngle(b2Settings_1.b2Maybe(bd.angle, 0));
                    // DEBUG: b2Assert(b2IsValid(this.m_xf.q.GetAngle()));
                    // #if B2_ENABLE_PARTICLE
                    this.m_xf0.Copy(this.m_xf);
                    // #endif
                    this.m_sweep.localCenter.SetZero();
                    this.m_sweep.c0.Copy(this.m_xf.p);
                    this.m_sweep.c.Copy(this.m_xf.p);
                    this.m_sweep.a0 = this.m_sweep.a = this.m_xf.q.GetAngle();
                    this.m_sweep.alpha0 = 0;
                    this.m_linearVelocity.Copy(b2Settings_1.b2Maybe(bd.linearVelocity, b2Math_1.b2Vec2.ZERO));
                    // DEBUG: b2Assert(this.m_linearVelocity.IsValid());
                    this.m_angularVelocity = b2Settings_1.b2Maybe(bd.angularVelocity, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_angularVelocity));
                    this.m_linearDamping = b2Settings_1.b2Maybe(bd.linearDamping, 0);
                    this.m_angularDamping = b2Settings_1.b2Maybe(bd.angularDamping, 0);
                    this.m_gravityScale = b2Settings_1.b2Maybe(bd.gravityScale, 1);
                    // DEBUG: b2Assert(b2IsValid(this.m_gravityScale) && this.m_gravityScale >= 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_angularDamping) && this.m_angularDamping >= 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_linearDamping) && this.m_linearDamping >= 0);
                    this.m_force.SetZero();
                    this.m_torque = 0;
                    this.m_sleepTime = 0;
                    this.m_type = b2Settings_1.b2Maybe(bd.type, b2BodyType.b2_staticBody);
                    if (bd.type === b2BodyType.b2_dynamicBody) {
                        this.m_mass = 1;
                        this.m_invMass = 1;
                    }
                    else {
                        this.m_mass = 0;
                        this.m_invMass = 0;
                    }
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_userData = bd.userData;
                }
                CreateFixture(a, b = 0) {
                    if (a instanceof b2Shape_1.b2Shape) {
                        return this.CreateFixtureShapeDensity(a, b);
                    }
                    else {
                        return this.CreateFixtureDef(a);
                    }
                }
                /// Creates a fixture and attach it to this body. Use this function if you need
                /// to set some fixture parameters, like friction. Otherwise you can create the
                /// fixture directly from a shape.
                /// If the density is non-zero, this function automatically updates the mass of the body.
                /// Contacts are not created until the next time step.
                /// @param def the fixture definition.
                /// @warning This function is locked during callbacks.
                CreateFixtureDef(def) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    const fixture = new b2Fixture_1.b2Fixture(def, this);
                    fixture.Create(def);
                    if (this.m_activeFlag) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.CreateProxies(broadPhase, this.m_xf);
                    }
                    this.m_fixtureList.add(fixture);
                    // fixture.m_body = this;
                    // Adjust mass properties if needed.
                    if (fixture.m_density > 0) {
                        this.ResetMassData();
                    }
                    // Let the world know we have a new fixture. This will cause new contacts
                    // to be created at the beginning of the next time step.
                    this.m_world.m_newFixture = true;
                    return fixture;
                }
                CreateFixtureShapeDensity(shape, density = 0) {
                    const def = b2Body.CreateFixtureShapeDensity_s_def;
                    def.shape = shape;
                    def.density = density;
                    return this.CreateFixtureDef(def);
                }
                /// Destroy a fixture. This removes the fixture from the broad-phase and
                /// destroys all contacts associated with this fixture. This will
                /// automatically adjust the mass of the body if the body is dynamic and the
                /// fixture has positive density.
                /// All fixtures attached to a body are implicitly destroyed when the body is destroyed.
                /// @param fixture the fixture to be removed.
                /// @warning This function is locked during callbacks.
                DestroyFixture(fixture) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    // DEBUG: b2Assert(fixture.m_body === this);
                    // Remove the fixture from this body's singly linked list.
                    // DEBUG: b2Assert(this.m_fixtureList.size > 0);
                    // DEBUG: let found: boolean = false;
                    // DEBUG: const found: boolean =
                    this.m_fixtureList.delete(fixture);
                    // You tried to remove a shape that is not attached to this body.
                    // DEBUG: b2Assert(found);
                    // Destroy any contacts associated with the fixture.
                    for (const contact of this.m_contactList) {
                        const fixtureA = contact.GetFixtureA();
                        const fixtureB = contact.GetFixtureB();
                        if (fixture === fixtureA || fixture === fixtureB) {
                            // This destroys the contact and removes it from
                            // this body's contact list.
                            this.m_world.m_contactManager.Destroy(contact);
                        }
                    }
                    if (this.m_activeFlag) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.DestroyProxies(broadPhase);
                    }
                    fixture.Destroy();
                    // Reset the mass data.
                    this.ResetMassData();
                }
                /// Set the position of the body's origin and rotation.
                /// This breaks any contacts and wakes the other bodies.
                /// Manipulating a body's transform may cause non-physical behavior.
                /// @param position the world position of the body's local origin.
                /// @param angle the world rotation in radians.
                SetTransformVec(position, angle) {
                    this.SetTransformXY(position.x, position.y, angle);
                }
                SetTransformXY(x, y, angle) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    this.m_xf.q.SetAngle(angle);
                    this.m_xf.p.Set(x, y);
                    // #if B2_ENABLE_PARTICLE
                    this.m_xf0.Copy(this.m_xf);
                    // #endif
                    b2Math_1.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.a = angle;
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    this.m_sweep.a0 = angle;
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (const f of this.m_fixtureList) {
                        f.Synchronize(broadPhase, this.m_xf, this.m_xf);
                    }
                    this.m_world.m_contactManager.FindNewContacts();
                }
                SetTransform(xf) {
                    this.SetTransformVec(xf.p, xf.GetAngle());
                }
                /// Get the body transform for the body's origin.
                /// @return the world transform of the body's origin.
                GetTransform() {
                    return this.m_xf;
                }
                /// Get the world body origin position.
                /// @return the world position of the body's origin.
                GetPosition() {
                    return this.m_xf.p;
                }
                SetPosition(position) {
                    this.SetTransformVec(position, this.GetAngle());
                }
                SetPositionXY(x, y) {
                    this.SetTransformXY(x, y, this.GetAngle());
                }
                /// Get the angle in radians.
                /// @return the current world rotation angle in radians.
                GetAngle() {
                    return this.m_sweep.a;
                }
                SetAngle(angle) {
                    this.SetTransformVec(this.GetPosition(), angle);
                }
                /// Get the world position of the center of mass.
                GetWorldCenter() {
                    return this.m_sweep.c;
                }
                /// Get the local position of the center of mass.
                GetLocalCenter() {
                    return this.m_sweep.localCenter;
                }
                /// Set the linear velocity of the center of mass.
                /// @param v the new linear velocity of the center of mass.
                SetLinearVelocity(v) {
                    if (this.m_type === b2BodyType.b2_staticBody) {
                        return;
                    }
                    if (b2Math_1.b2Vec2.DotVV(v, v) > 0) {
                        this.SetAwake(true);
                    }
                    this.m_linearVelocity.Copy(v);
                }
                /// Get the linear velocity of the center of mass.
                /// @return the linear velocity of the center of mass.
                GetLinearVelocity() {
                    return this.m_linearVelocity;
                }
                /// Set the angular velocity.
                /// @param omega the new angular velocity in radians/second.
                SetAngularVelocity(w) {
                    if (this.m_type === b2BodyType.b2_staticBody) {
                        return;
                    }
                    if (w * w > 0) {
                        this.SetAwake(true);
                    }
                    this.m_angularVelocity = w;
                }
                /// Get the angular velocity.
                /// @return the angular velocity in radians/second.
                GetAngularVelocity() {
                    return this.m_angularVelocity;
                }
                GetDefinition(bd) {
                    bd.type = this.GetType();
                    bd.allowSleep = this.m_autoSleepFlag;
                    bd.angle = this.GetAngle();
                    bd.angularDamping = this.m_angularDamping;
                    bd.gravityScale = this.m_gravityScale;
                    bd.angularVelocity = this.m_angularVelocity;
                    bd.fixedRotation = this.m_fixedRotationFlag;
                    bd.bullet = this.m_bulletFlag;
                    bd.awake = this.m_awakeFlag;
                    bd.linearDamping = this.m_linearDamping;
                    bd.linearVelocity.Copy(this.GetLinearVelocity());
                    bd.position.Copy(this.GetPosition());
                    bd.userData = this.GetUserData();
                    return bd;
                }
                /// Apply a force at a world point. If the force is not
                /// applied at the center of mass, it will generate a torque and
                /// affect the angular velocity. This wakes up the body.
                /// @param force the world force vector, usually in Newtons (N).
                /// @param point the world position of the point of application.
                /// @param wake also wake up the body
                ApplyForce(force, point, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_force.x += force.x;
                        this.m_force.y += force.y;
                        this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
                    }
                }
                /// Apply a force to the center of mass. This wakes up the body.
                /// @param force the world force vector, usually in Newtons (N).
                /// @param wake also wake up the body
                ApplyForceToCenter(force, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_force.x += force.x;
                        this.m_force.y += force.y;
                    }
                }
                /// Apply a torque. This affects the angular velocity
                /// without affecting the linear velocity of the center of mass.
                /// This wakes up the body.
                /// @param torque about the z-axis (out of the screen), usually in N-m.
                /// @param wake also wake up the body
                ApplyTorque(torque, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_torque += torque;
                    }
                }
                /// Apply an impulse at a point. This immediately modifies the velocity.
                /// It also modifies the angular velocity if the point of application
                /// is not at the center of mass. This wakes up the body.
                /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
                /// @param point the world position of the point of application.
                /// @param wake also wake up the body
                ApplyLinearImpulse(impulse, point, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_linearVelocity.x += this.m_invMass * impulse.x;
                        this.m_linearVelocity.y += this.m_invMass * impulse.y;
                        this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
                    }
                }
                /// Apply an impulse at the center of gravity. This immediately modifies the velocity.
                /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
                /// @param wake also wake up the body
                ApplyLinearImpulseToCenter(impulse, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_linearVelocity.x += this.m_invMass * impulse.x;
                        this.m_linearVelocity.y += this.m_invMass * impulse.y;
                    }
                }
                /// Apply an angular impulse.
                /// @param impulse the angular impulse in units of kg*m*m/s
                /// @param wake also wake up the body
                ApplyAngularImpulse(impulse, wake = true) {
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    if (wake && !this.m_awakeFlag) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_awakeFlag) {
                        this.m_angularVelocity += this.m_invI * impulse;
                    }
                }
                /// Get the total mass of the body.
                /// @return the mass, usually in kilograms (kg).
                GetMass() {
                    return this.m_mass;
                }
                /// Get the rotational inertia of the body about the local origin.
                /// @return the rotational inertia, usually in kg-m^2.
                GetInertia() {
                    return this.m_I + this.m_mass * b2Math_1.b2Vec2.DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
                }
                /// Get the mass data of the body.
                /// @return a struct containing the mass, inertia and center of the body.
                GetMassData(data) {
                    data.mass = this.m_mass;
                    data.I = this.m_I + this.m_mass * b2Math_1.b2Vec2.DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
                    data.center.Copy(this.m_sweep.localCenter);
                    return data;
                }
                SetMassData(massData) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    if (this.m_type !== b2BodyType.b2_dynamicBody) {
                        return;
                    }
                    this.m_invMass = 0;
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_mass = massData.mass;
                    if (this.m_mass <= 0) {
                        this.m_mass = 1;
                    }
                    this.m_invMass = 1 / this.m_mass;
                    if (massData.I > 0 && !this.m_fixedRotationFlag) {
                        this.m_I = massData.I - this.m_mass * b2Math_1.b2Vec2.DotVV(massData.center, massData.center);
                        // DEBUG: b2Assert(this.m_I > 0);
                        this.m_invI = 1 / this.m_I;
                    }
                    // Move center of mass.
                    const oldCenter = b2Body.SetMassData_s_oldCenter.Copy(this.m_sweep.c);
                    this.m_sweep.localCenter.Copy(massData.center);
                    b2Math_1.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    // Update center of mass velocity.
                    b2Math_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_1.b2Vec2.SubVV(this.m_sweep.c, oldCenter, b2Math_1.b2Vec2.s_t0), this.m_linearVelocity);
                }
                ResetMassData() {
                    // Compute mass data from shapes. Each shape has its own density.
                    this.m_mass = 0;
                    this.m_invMass = 0;
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_sweep.localCenter.SetZero();
                    // Static and kinematic bodies have zero mass.
                    if (this.m_type === b2BodyType.b2_staticBody || this.m_type === b2BodyType.b2_kinematicBody) {
                        this.m_sweep.c0.Copy(this.m_xf.p);
                        this.m_sweep.c.Copy(this.m_xf.p);
                        this.m_sweep.a0 = this.m_sweep.a;
                        return;
                    }
                    // DEBUG: b2Assert(this.m_type === b2BodyType.b2_dynamicBody);
                    // Accumulate mass over all fixtures.
                    const localCenter = b2Body.ResetMassData_s_localCenter.SetZero();
                    for (const f of this.m_fixtureList) {
                        if (f.m_density === 0) {
                            continue;
                        }
                        const massData = f.GetMassData(b2Body.ResetMassData_s_massData);
                        this.m_mass += massData.mass;
                        localCenter.x += massData.center.x * massData.mass;
                        localCenter.y += massData.center.y * massData.mass;
                        this.m_I += massData.I;
                    }
                    // Compute center of mass.
                    if (this.m_mass > 0) {
                        this.m_invMass = 1 / this.m_mass;
                        localCenter.x *= this.m_invMass;
                        localCenter.y *= this.m_invMass;
                    }
                    else {
                        // Force all dynamic bodies to have a positive mass.
                        this.m_mass = 1;
                        this.m_invMass = 1;
                    }
                    if (this.m_I > 0 && !this.m_fixedRotationFlag) {
                        // Center the inertia about the center of mass.
                        this.m_I -= this.m_mass * b2Math_1.b2Vec2.DotVV(localCenter, localCenter);
                        // DEBUG: b2Assert(this.m_I > 0);
                        this.m_invI = 1 / this.m_I;
                    }
                    else {
                        this.m_I = 0;
                        this.m_invI = 0;
                    }
                    // Move center of mass.
                    const oldCenter = b2Body.ResetMassData_s_oldCenter.Copy(this.m_sweep.c);
                    this.m_sweep.localCenter.Copy(localCenter);
                    b2Math_1.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    // Update center of mass velocity.
                    b2Math_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_1.b2Vec2.SubVV(this.m_sweep.c, oldCenter, b2Math_1.b2Vec2.s_t0), this.m_linearVelocity);
                }
                /// Get the world coordinates of a point given the local coordinates.
                /// @param localPoint a point on the body measured relative the the body's origin.
                /// @return the same point expressed in world coordinates.
                GetWorldPoint(localPoint, out) {
                    return b2Math_1.b2Transform.MulXV(this.m_xf, localPoint, out);
                }
                /// Get the world coordinates of a vector given the local coordinates.
                /// @param localVector a vector fixed in the body.
                /// @return the same vector expressed in world coordinates.
                GetWorldVector(localVector, out) {
                    return b2Math_1.b2Rot.MulRV(this.m_xf.q, localVector, out);
                }
                /// Gets a local point relative to the body's origin given a world point.
                /// @param a point in world coordinates.
                /// @return the corresponding local point relative to the body's origin.
                GetLocalPoint(worldPoint, out) {
                    return b2Math_1.b2Transform.MulTXV(this.m_xf, worldPoint, out);
                }
                /// Gets a local vector given a world vector.
                /// @param a vector in world coordinates.
                /// @return the corresponding local vector.
                GetLocalVector(worldVector, out) {
                    return b2Math_1.b2Rot.MulTRV(this.m_xf.q, worldVector, out);
                }
                /// Get the world linear velocity of a world point attached to this body.
                /// @param a point in world coordinates.
                /// @return the world velocity of a point.
                GetLinearVelocityFromWorldPoint(worldPoint, out) {
                    return b2Math_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_1.b2Vec2.SubVV(worldPoint, this.m_sweep.c, b2Math_1.b2Vec2.s_t0), out);
                }
                /// Get the world velocity of a local point.
                /// @param a point in local coordinates.
                /// @return the world velocity of a point.
                GetLinearVelocityFromLocalPoint(localPoint, out) {
                    return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint, out), out);
                }
                /// Get the linear damping of the body.
                GetLinearDamping() {
                    return this.m_linearDamping;
                }
                /// Set the linear damping of the body.
                SetLinearDamping(linearDamping) {
                    this.m_linearDamping = linearDamping;
                }
                /// Get the angular damping of the body.
                GetAngularDamping() {
                    return this.m_angularDamping;
                }
                /// Set the angular damping of the body.
                SetAngularDamping(angularDamping) {
                    this.m_angularDamping = angularDamping;
                }
                /// Get the gravity scale of the body.
                GetGravityScale() {
                    return this.m_gravityScale;
                }
                /// Set the gravity scale of the body.
                SetGravityScale(scale) {
                    this.m_gravityScale = scale;
                }
                /// Set the type of this body. This may alter the mass and velocity.
                SetType(type) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    if (this.m_type === type) {
                        return;
                    }
                    this.m_type = type;
                    this.ResetMassData();
                    if (this.m_type === b2BodyType.b2_staticBody) {
                        this.m_linearVelocity.SetZero();
                        this.m_angularVelocity = 0;
                        this.m_sweep.a0 = this.m_sweep.a;
                        this.m_sweep.c0.Copy(this.m_sweep.c);
                        this.SynchronizeFixtures();
                    }
                    this.SetAwake(true);
                    this.m_force.SetZero();
                    this.m_torque = 0;
                    // Delete the attached contacts.
                    for (const contact of this.m_contactList) {
                        this.m_world.m_contactManager.Destroy(contact);
                    }
                    this.m_contactList.clear();
                    // Touch the proxies so that new contacts will be created (when appropriate)
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (const f of this.m_fixtureList) {
                        const proxyCount = f.m_proxyCount;
                        for (let i = 0; i < proxyCount; ++i) {
                            broadPhase.TouchProxy(f.m_proxies[i].treeNode);
                        }
                    }
                }
                /// Get the type of this body.
                GetType() {
                    return this.m_type;
                }
                /// Should this body be treated like a bullet for continuous collision detection?
                SetBullet(flag) {
                    this.m_bulletFlag = flag;
                }
                /// Is this body treated like a bullet for continuous collision detection?
                IsBullet() {
                    return this.m_bulletFlag;
                }
                /// You can disable sleeping on this body. If you disable sleeping, the
                /// body will be woken.
                SetSleepingAllowed(flag) {
                    this.m_autoSleepFlag = flag;
                    if (!flag) {
                        this.SetAwake(true);
                    }
                }
                /// Is this body allowed to sleep
                IsSleepingAllowed() {
                    return this.m_autoSleepFlag;
                }
                /// Set the sleep state of the body. A sleeping body has very
                /// low CPU cost.
                /// @param flag set to true to wake the body, false to put it to sleep.
                SetAwake(flag) {
                    if (flag) {
                        if (!this.m_awakeFlag) {
                            this.m_awakeFlag = true;
                            this.m_sleepTime = 0;
                        }
                    }
                    else {
                        this.m_awakeFlag = false;
                        this.m_sleepTime = 0;
                        this.m_linearVelocity.SetZero();
                        this.m_angularVelocity = 0;
                        this.m_force.SetZero();
                        this.m_torque = 0;
                    }
                }
                /// Get the sleeping state of this body.
                /// @return true if the body is sleeping.
                IsAwake() {
                    return this.m_awakeFlag;
                }
                /// Set the active state of the body. An inactive body is not
                /// simulated and cannot be collided with or woken up.
                /// If you pass a flag of true, all fixtures will be added to the
                /// broad-phase.
                /// If you pass a flag of false, all fixtures will be removed from
                /// the broad-phase and all contacts will be destroyed.
                /// Fixtures and joints are otherwise unaffected. You may continue
                /// to create/destroy fixtures and joints on inactive bodies.
                /// Fixtures on an inactive body are implicitly inactive and will
                /// not participate in collisions, ray-casts, or queries.
                /// Joints connected to an inactive body are implicitly inactive.
                /// An inactive body is still owned by a b2World object and remains
                /// in the body list.
                SetActive(flag) {
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    if (flag === this.IsActive()) {
                        return;
                    }
                    this.m_activeFlag = flag;
                    if (flag) {
                        // Create all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (const f of this.m_fixtureList) {
                            f.CreateProxies(broadPhase, this.m_xf);
                        }
                        // Contacts are created the next time step.
                    }
                    else {
                        // Destroy all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (const f of this.m_fixtureList) {
                            f.DestroyProxies(broadPhase);
                        }
                        // Destroy the attached contacts.
                        for (const contact of this.m_contactList) {
                            this.m_world.m_contactManager.Destroy(contact);
                        }
                        this.m_contactList.clear();
                    }
                }
                /// Get the active state of the body.
                IsActive() {
                    return this.m_activeFlag;
                }
                /// Set this body to have fixed rotation. This causes the mass
                /// to be reset.
                SetFixedRotation(flag) {
                    if (this.m_fixedRotationFlag === flag) {
                        return;
                    }
                    this.m_fixedRotationFlag = flag;
                    this.m_angularVelocity = 0;
                    this.ResetMassData();
                }
                /// Does this body have fixed rotation?
                IsFixedRotation() {
                    return this.m_fixedRotationFlag;
                }
                /// Get the list of all fixtures attached to this body.
                GetFixtureList() {
                    return this.m_fixtureList;
                }
                /// Get the list of all joints attached to this body.
                GetJointList() {
                    return this.m_jointList;
                }
                /// Get the list of all contacts attached to this body.
                /// @warning this list changes during the time step and you may
                /// miss some collisions if you don't use b2ContactListener.
                GetContactList() {
                    return this.m_contactList;
                }
                /// Get the user data pointer that was provided in the body definition.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data. Use this to store your application specific data.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Get the parent world of this body.
                GetWorld() {
                    return this.m_world;
                }
                /// Dump this body to a log file
                Dump(log) {
                    const bodyIndex = this.m_islandIndex;
                    log("{\n");
                    log("  const bd: b2BodyDef = new b2BodyDef();\n");
                    let type_str = "";
                    switch (this.m_type) {
                        case b2BodyType.b2_staticBody:
                            type_str = "b2BodyType.b2_staticBody";
                            break;
                        case b2BodyType.b2_kinematicBody:
                            type_str = "b2BodyType.b2_kinematicBody";
                            break;
                        case b2BodyType.b2_dynamicBody:
                            type_str = "b2BodyType.b2_dynamicBody";
                            break;
                        default:
                            // DEBUG: b2Assert(false);
                            break;
                    }
                    log("  bd.type = %s;\n", type_str);
                    log("  bd.position.Set(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
                    log("  bd.angle = %.15f;\n", this.m_sweep.a);
                    log("  bd.linearVelocity.Set(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
                    log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
                    log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
                    log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
                    log("  bd.allowSleep = %s;\n", (this.m_autoSleepFlag) ? ("true") : ("false"));
                    log("  bd.awake = %s;\n", (this.m_awakeFlag) ? ("true") : ("false"));
                    log("  bd.fixedRotation = %s;\n", (this.m_fixedRotationFlag) ? ("true") : ("false"));
                    log("  bd.bullet = %s;\n", (this.m_bulletFlag) ? ("true") : ("false"));
                    log("  bd.active = %s;\n", (this.m_activeFlag) ? ("true") : ("false"));
                    log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
                    log("\n");
                    log("  bodies[%d] = this.m_world.CreateBody(bd);\n", this.m_islandIndex);
                    log("\n");
                    for (const f of this.m_fixtureList) {
                        log("  {\n");
                        f.Dump(log, bodyIndex);
                        log("  }\n");
                    }
                    log("}\n");
                }
                SynchronizeFixtures() {
                    const xf1 = b2Body.SynchronizeFixtures_s_xf1;
                    xf1.q.SetAngle(this.m_sweep.a0);
                    b2Math_1.b2Rot.MulRV(xf1.q, this.m_sweep.localCenter, xf1.p);
                    b2Math_1.b2Vec2.SubVV(this.m_sweep.c0, xf1.p, xf1.p);
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (const f of this.m_fixtureList) {
                        f.Synchronize(broadPhase, xf1, this.m_xf);
                    }
                }
                SynchronizeTransform() {
                    this.m_xf.q.SetAngle(this.m_sweep.a);
                    b2Math_1.b2Rot.MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
                    b2Math_1.b2Vec2.SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
                }
                // This is used to prevent connected bodies from colliding.
                // It may lie, depending on the collideConnected flag.
                ShouldCollide(other) {
                    // At least one body should be dynamic or kinematic.
                    if (this.m_type === b2BodyType.b2_staticBody && other.m_type === b2BodyType.b2_staticBody) {
                        return false;
                    }
                    return this.ShouldCollideConnected(other);
                }
                ShouldCollideConnected(other) {
                    // Does a joint prevent collision?
                    for (const joint of this.m_jointList) {
                        if (joint.GetOtherBody(this) === other) {
                            if (!joint.m_collideConnected) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                Advance(alpha) {
                    // Advance to the new safe time. This doesn't sync the broad-phase.
                    this.m_sweep.Advance(alpha);
                    this.m_sweep.c.Copy(this.m_sweep.c0);
                    this.m_sweep.a = this.m_sweep.a0;
                    this.m_xf.q.SetAngle(this.m_sweep.a);
                    b2Math_1.b2Rot.MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
                    b2Math_1.b2Vec2.SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
                }
                // #if B2_ENABLE_CONTROLLER
                GetControllerList() {
                    return this.m_controllerList;
                }
                GetControllerCount() {
                    return this.m_controllerList.size;
                }
            };
            /// Creates a fixture from a shape and attach it to this body.
            /// This is a convenience function. Use b2FixtureDef if you need to set parameters
            /// like friction, restitution, user data, or filtering.
            /// If the density is non-zero, this function automatically updates the mass of the body.
            /// @param shape the shape to be cloned.
            /// @param density the shape density (set to zero for static bodies).
            /// @warning This function is locked during callbacks.
            b2Body.CreateFixtureShapeDensity_s_def = new b2Fixture_1.b2FixtureDef();
            /// Set the mass properties to override the mass properties of the fixtures.
            /// Note that this changes the center of mass position.
            /// Note that creating or destroying fixtures can also alter the mass.
            /// This function has no effect if the body isn't dynamic.
            /// @param massData the mass properties.
            b2Body.SetMassData_s_oldCenter = new b2Math_1.b2Vec2();
            /// This resets the mass properties to the sum of the mass properties of the fixtures.
            /// This normally does not need to be called unless you called SetMassData to override
            /// the mass and you later want to reset the mass.
            b2Body.ResetMassData_s_localCenter = new b2Math_1.b2Vec2();
            b2Body.ResetMassData_s_oldCenter = new b2Math_1.b2Vec2();
            b2Body.ResetMassData_s_massData = new b2Shape_1.b2MassData();
            b2Body.SynchronizeFixtures_s_xf1 = new b2Math_1.b2Transform();
            exports_1("b2Body", b2Body);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCb2R5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCb2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFjRixTQUFTO1lBRVQsa0JBQWtCO1lBQ2xCLDJEQUEyRDtZQUMzRCx3RUFBd0U7WUFDeEUsbUZBQW1GO1lBQ25GLFdBQVksVUFBVTtnQkFDcEIsd0RBQWUsQ0FBQTtnQkFDZiw2REFBaUIsQ0FBQTtnQkFDakIsbUVBQW9CLENBQUE7Z0JBQ3BCLCtEQUFrQixDQUFBO2dCQUVsQixZQUFZO2dCQUNaLG9CQUFvQjtZQUN0QixDQUFDLEVBUlcsVUFBVSxLQUFWLFVBQVUsUUFRckI7O1lBd0RELDBFQUEwRTtZQUMxRSwwRkFBMEY7WUFDMUYsWUFBQTtnQkFBQTtvQkFDRSxpREFBaUQ7b0JBQ2pELHlFQUF5RTtvQkFDbEUsU0FBSSxHQUFlLFVBQVUsQ0FBQyxhQUFhLENBQUM7b0JBRW5ELHVFQUF1RTtvQkFDdkUsbURBQW1EO29CQUNuQyxhQUFRLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVwRCwyQ0FBMkM7b0JBQ3BDLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBRXpCLG1FQUFtRTtvQkFDbkQsbUJBQWMsR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRTFELHFDQUFxQztvQkFDOUIsb0JBQWUsR0FBVyxDQUFDLENBQUM7b0JBRW5DLDhFQUE4RTtvQkFDOUUsMkVBQTJFO29CQUMzRSxrREFBa0Q7b0JBQzNDLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUVqQyxnRkFBZ0Y7b0JBQ2hGLDJFQUEyRTtvQkFDM0Usa0RBQWtEO29CQUMzQyxtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFFbEMsMkVBQTJFO29CQUMzRSw2QkFBNkI7b0JBQ3RCLGVBQVUsR0FBWSxJQUFJLENBQUM7b0JBRWxDLDZDQUE2QztvQkFDdEMsVUFBSyxHQUFZLElBQUksQ0FBQztvQkFFN0IsdUVBQXVFO29CQUNoRSxrQkFBYSxHQUFZLEtBQUssQ0FBQztvQkFFdEMsOEVBQThFO29CQUM5RSxrRkFBa0Y7b0JBQ2xGLG1GQUFtRjtvQkFDbkYsbUZBQW1GO29CQUM1RSxXQUFNLEdBQVksS0FBSyxDQUFDO29CQUUvQixvQ0FBb0M7b0JBQzdCLFdBQU0sR0FBWSxJQUFJLENBQUM7b0JBRTlCLHFEQUFxRDtvQkFDOUMsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFFNUIsMkNBQTJDO29CQUNwQyxpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFDbEMsQ0FBQzthQUFBLENBQUE7O1lBRUQsNERBQTREO1lBQzVELFNBQUE7Z0JBaURFLFNBQVM7Z0JBRVQsWUFBWSxFQUFjLEVBQUUsS0FBYztvQkFsRG5DLFdBQU0sR0FBZSxVQUFVLENBQUMsYUFBYSxDQUFDO29CQUU5QyxpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7b0JBQzdCLG9CQUFlLEdBQVksS0FBSyxDQUFDO29CQUNqQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsd0JBQW1CLEdBQVksS0FBSyxDQUFDO29CQUNyQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsY0FBUyxHQUFZLEtBQUssQ0FBQztvQkFFM0Isa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBRWpCLFNBQUksR0FBZ0IsSUFBSSxvQkFBVyxFQUFFLENBQUMsQ0FBRSw0QkFBNEI7b0JBQ3BGLHlCQUF5QjtvQkFDVCxVQUFLLEdBQWdCLElBQUksb0JBQVcsRUFBRSxDQUFDO29CQUN2RCxTQUFTO29CQUNPLFlBQU8sR0FBWSxJQUFJLGdCQUFPLEVBQUUsQ0FBQyxDQUFJLDJCQUEyQjtvQkFFaEUscUJBQWdCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDakQsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO29CQUVyQixZQUFPLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDeEMsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFJWixrQkFBYSxHQUFtQixJQUFJLEdBQUcsRUFBYSxDQUFDO29CQUVyRCxnQkFBVyxHQUFpQixJQUFJLEdBQUcsRUFBVyxDQUFDO29CQUMvQyxrQkFBYSxHQUFtQixJQUFJLEdBQUcsRUFBYSxDQUFDO29CQUU5RCxXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUNuQixjQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUU3QiwrQ0FBK0M7b0JBQ3hDLFFBQUcsR0FBVyxDQUFDLENBQUM7b0JBQ2hCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBRW5CLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO29CQUM1QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7b0JBQzdCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUUzQixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFFeEIsZUFBVSxHQUFRLElBQUksQ0FBQztvQkFFOUIsMkJBQTJCO29CQUNYLHFCQUFnQixHQUFzQixJQUFJLEdBQUcsRUFBZ0IsQ0FBQztvQkFJNUUsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzlDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxvQkFBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzVELElBQUksQ0FBQyxlQUFlLEdBQUcsb0JBQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUMsV0FBVyxHQUFHLG9CQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRTdDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUVyQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwRCwwQ0FBMEM7b0JBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0Msc0RBQXNEO29CQUN0RCx5QkFBeUI7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDM0IsU0FBUztvQkFFVCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUV4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLG9CQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDcEUsb0RBQW9EO29CQUNwRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsb0JBQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxzREFBc0Q7b0JBRXRELElBQUksQ0FBQyxlQUFlLEdBQUcsb0JBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsb0JBQU8sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN0RCxJQUFJLENBQUMsY0FBYyxHQUFHLG9CQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsK0VBQStFO29CQUMvRSxtRkFBbUY7b0JBQ25GLGlGQUFpRjtvQkFFakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBRWxCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFPLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRXpELElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsY0FBYyxFQUFFO3dCQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7cUJBQ3BCO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztxQkFDcEI7b0JBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBRWhCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDaEMsQ0FBQztnQkFFTSxhQUFhLENBQUMsQ0FBMEIsRUFBRSxJQUFZLENBQUM7b0JBQzVELElBQUksQ0FBQyxZQUFZLGlCQUFPLEVBQUU7d0JBQ3hCLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDN0M7eUJBQU07d0JBQ0wsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2pDO2dCQUNILENBQUM7Z0JBRUQsK0VBQStFO2dCQUMvRSwrRUFBK0U7Z0JBQy9FLGtDQUFrQztnQkFDbEMseUZBQXlGO2dCQUN6RixzREFBc0Q7Z0JBQ3RELHNDQUFzQztnQkFDdEMsc0RBQXNEO2dCQUMvQyxnQkFBZ0IsQ0FBQyxHQUFrQjtvQkFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFbkQsTUFBTSxPQUFPLEdBQWMsSUFBSSxxQkFBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFcEIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO3dCQUNyQixNQUFNLFVBQVUsR0FBaUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7d0JBQzVFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDOUM7b0JBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWhDLHlCQUF5QjtvQkFFekIsb0NBQW9DO29CQUNwQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO3dCQUN6QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7cUJBQ3RCO29CQUVELHlFQUF5RTtvQkFDekUsd0RBQXdEO29CQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBRWpDLE9BQU8sT0FBTyxDQUFDO2dCQUNqQixDQUFDO2dCQVVNLHlCQUF5QixDQUFDLEtBQWMsRUFBRSxVQUFrQixDQUFDO29CQUNsRSxNQUFNLEdBQUcsR0FBaUIsTUFBTSxDQUFDLCtCQUErQixDQUFDO29CQUNqRSxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ3RCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO2dCQUVELHdFQUF3RTtnQkFDeEUsaUVBQWlFO2dCQUNqRSw0RUFBNEU7Z0JBQzVFLGlDQUFpQztnQkFDakMsd0ZBQXdGO2dCQUN4Riw2Q0FBNkM7Z0JBQzdDLHNEQUFzRDtnQkFDL0MsY0FBYyxDQUFDLE9BQWtCO29CQUN0QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUVuRCw0Q0FBNEM7b0JBRTVDLDBEQUEwRDtvQkFDMUQsZ0RBQWdEO29CQUNoRCxxQ0FBcUM7b0JBQ3JDLGdDQUFnQztvQkFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRW5DLGlFQUFpRTtvQkFDakUsMEJBQTBCO29CQUUxQixvREFBb0Q7b0JBQ3BELEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDeEMsTUFBTSxRQUFRLEdBQWMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUNsRCxNQUFNLFFBQVEsR0FBYyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBRWxELElBQUksT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFOzRCQUNoRCxnREFBZ0Q7NEJBQ2hELDRCQUE0Qjs0QkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ2hEO3FCQUNGO29CQUVELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTt3QkFDckIsTUFBTSxVQUFVLEdBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO3dCQUM1RSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUNwQztvQkFFRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWxCLHVCQUF1QjtvQkFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN2QixDQUFDO2dCQUVELHVEQUF1RDtnQkFDdkQsd0RBQXdEO2dCQUN4RCxvRUFBb0U7Z0JBQ3BFLGtFQUFrRTtnQkFDbEUsK0NBQStDO2dCQUN4QyxlQUFlLENBQUMsUUFBWSxFQUFFLEtBQWE7b0JBQ2hELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUVNLGNBQWMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWE7b0JBQ3ZELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBRW5ELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDdEIseUJBQXlCO29CQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLFNBQVM7b0JBRVQsb0JBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBRXZCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7b0JBRXhCLE1BQU0sVUFBVSxHQUFpQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQztvQkFDNUUsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNsQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDakQ7b0JBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDbEQsQ0FBQztnQkFFTSxZQUFZLENBQUMsRUFBZTtvQkFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUVELGlEQUFpRDtnQkFDakQscURBQXFEO2dCQUM5QyxZQUFZO29CQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7Z0JBRUQsdUNBQXVDO2dCQUN2QyxvREFBb0Q7Z0JBQzdDLFdBQVc7b0JBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sV0FBVyxDQUFDLFFBQVk7b0JBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUVNLGFBQWEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztvQkFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUVELDZCQUE2QjtnQkFDN0Isd0RBQXdEO2dCQUNqRCxRQUFRO29CQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRU0sUUFBUSxDQUFDLEtBQWE7b0JBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUVELGlEQUFpRDtnQkFDMUMsY0FBYztvQkFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztnQkFFRCxpREFBaUQ7Z0JBQzFDLGNBQWM7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQsa0RBQWtEO2dCQUNsRCwyREFBMkQ7Z0JBQ3BELGlCQUFpQixDQUFDLENBQUs7b0JBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsYUFBYSxFQUFFO3dCQUM1QyxPQUFPO3FCQUNSO29CQUVELElBQUksZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNyQjtvQkFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUVELGtEQUFrRDtnQkFDbEQsc0RBQXNEO2dCQUMvQyxpQkFBaUI7b0JBQ3RCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUMvQixDQUFDO2dCQUVELDZCQUE2QjtnQkFDN0IsNERBQTREO2dCQUNyRCxrQkFBa0IsQ0FBQyxDQUFTO29CQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGFBQWEsRUFBRTt3QkFDNUMsT0FBTztxQkFDUjtvQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3JCO29CQUVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBRUQsNkJBQTZCO2dCQUM3QixtREFBbUQ7Z0JBQzVDLGtCQUFrQjtvQkFDdkIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2hDLENBQUM7Z0JBRU0sYUFBYSxDQUFDLEVBQWE7b0JBQ2hDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN6QixFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7b0JBQ3JDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMzQixFQUFFLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDMUMsRUFBRSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO29CQUN0QyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7b0JBQzVDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDOUIsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUM1QixFQUFFLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7b0JBQ3hDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7b0JBQ2pELEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO29CQUNyQyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDakMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQztnQkFFRCx1REFBdUQ7Z0JBQ3ZELGdFQUFnRTtnQkFDaEUsd0RBQXdEO2dCQUN4RCxnRUFBZ0U7Z0JBQ2hFLGdFQUFnRTtnQkFDaEUscUNBQXFDO2dCQUM5QixVQUFVLENBQUMsS0FBUyxFQUFFLEtBQVMsRUFBRSxPQUFnQixJQUFJO29CQUMxRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGNBQWMsRUFBRTt3QkFDN0MsT0FBTztxQkFDUjtvQkFFRCxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3JCO29CQUVELG9EQUFvRDtvQkFDcEQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEc7Z0JBQ0gsQ0FBQztnQkFFRCxnRUFBZ0U7Z0JBQ2hFLGdFQUFnRTtnQkFDaEUscUNBQXFDO2dCQUM5QixrQkFBa0IsQ0FBQyxLQUFTLEVBQUUsT0FBZ0IsSUFBSTtvQkFDdkQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxjQUFjLEVBQUU7d0JBQzdDLE9BQU87cUJBQ1I7b0JBRUQsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNyQjtvQkFFRCxvREFBb0Q7b0JBQ3BELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDM0I7Z0JBQ0gsQ0FBQztnQkFFRCxxREFBcUQ7Z0JBQ3JELGdFQUFnRTtnQkFDaEUsMkJBQTJCO2dCQUMzQix1RUFBdUU7Z0JBQ3ZFLHFDQUFxQztnQkFDOUIsV0FBVyxDQUFDLE1BQWMsRUFBRSxPQUFnQixJQUFJO29CQUNyRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGNBQWMsRUFBRTt3QkFDN0MsT0FBTztxQkFDUjtvQkFFRCxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3JCO29CQUVELG9EQUFvRDtvQkFDcEQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixJQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztxQkFDekI7Z0JBQ0gsQ0FBQztnQkFFRCx3RUFBd0U7Z0JBQ3hFLHFFQUFxRTtnQkFDckUseURBQXlEO2dCQUN6RCw0RUFBNEU7Z0JBQzVFLGdFQUFnRTtnQkFDaEUscUNBQXFDO2dCQUM5QixrQkFBa0IsQ0FBQyxPQUFXLEVBQUUsS0FBUyxFQUFFLE9BQWdCLElBQUk7b0JBQ3BFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsY0FBYyxFQUFFO3dCQUM3QyxPQUFPO3FCQUNSO29CQUVELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDckI7b0JBRUQsb0RBQW9EO29CQUNwRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvSDtnQkFDSCxDQUFDO2dCQUVELHNGQUFzRjtnQkFDdEYsNEVBQTRFO2dCQUM1RSxxQ0FBcUM7Z0JBQzlCLDBCQUEwQixDQUFDLE9BQVcsRUFBRSxPQUFnQixJQUFJO29CQUNqRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGNBQWMsRUFBRTt3QkFDN0MsT0FBTztxQkFDUjtvQkFFRCxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3JCO29CQUVELG9EQUFvRDtvQkFDcEQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUJBQ3ZEO2dCQUNILENBQUM7Z0JBRUQsNkJBQTZCO2dCQUM3QiwyREFBMkQ7Z0JBQzNELHFDQUFxQztnQkFDOUIsbUJBQW1CLENBQUMsT0FBZSxFQUFFLE9BQWdCLElBQUk7b0JBQzlELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsY0FBYyxFQUFFO3dCQUM3QyxPQUFPO3FCQUNSO29CQUVELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDckI7b0JBRUQsb0RBQW9EO29CQUNwRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztxQkFDakQ7Z0JBQ0gsQ0FBQztnQkFFRCxtQ0FBbUM7Z0JBQ25DLGdEQUFnRDtnQkFDekMsT0FBTztvQkFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQsa0VBQWtFO2dCQUNsRSxzREFBc0Q7Z0JBQy9DLFVBQVU7b0JBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRyxDQUFDO2dCQUVELGtDQUFrQztnQkFDbEMseUVBQXlFO2dCQUNsRSxXQUFXLENBQUMsSUFBZ0I7b0JBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDeEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNuRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQVFNLFdBQVcsQ0FBQyxRQUFvQjtvQkFDckMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxjQUFjLEVBQUU7d0JBQzdDLE9BQU87cUJBQ1I7b0JBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUVoQixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUNqQjtvQkFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUVqQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO3dCQUMvQyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNyRixpQ0FBaUM7d0JBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQzVCO29CQUVELHVCQUF1QjtvQkFDdkIsTUFBTSxTQUFTLEdBQVcsTUFBTSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMvQyxvQkFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVyQyxrQ0FBa0M7b0JBQ2xDLGVBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2pKLENBQUM7Z0JBUU0sYUFBYTtvQkFDbEIsaUVBQWlFO29CQUNqRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFbkMsOENBQThDO29CQUM5QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDM0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDakMsT0FBTztxQkFDUjtvQkFFRCw4REFBOEQ7b0JBRTlELHFDQUFxQztvQkFDckMsTUFBTSxXQUFXLEdBQVcsTUFBTSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN6RSxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ2xDLElBQUksQ0FBQyxDQUFDLFNBQVMsS0FBSyxDQUFDLEVBQUU7NEJBQ3JCLFNBQVM7eUJBQ1Y7d0JBRUQsTUFBTSxRQUFRLEdBQWUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQzt3QkFDNUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUM3QixXQUFXLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ25ELFdBQVcsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDbkQsSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO3FCQUN4QjtvQkFFRCwwQkFBMEI7b0JBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQ2pDLFdBQVcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDaEMsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO3FCQUNqQzt5QkFBTTt3QkFDTCxvREFBb0Q7d0JBQ3BELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztxQkFDcEI7b0JBRUQsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTt3QkFDN0MsK0NBQStDO3dCQUMvQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7d0JBQ2pFLGlDQUFpQzt3QkFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFDNUI7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7cUJBQ2pCO29CQUVELHVCQUF1QjtvQkFDdkIsTUFBTSxTQUFTLEdBQVcsTUFBTSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzNDLG9CQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXJDLGtDQUFrQztvQkFDbEMsZUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDakosQ0FBQztnQkFFRCxxRUFBcUU7Z0JBQ3JFLGtGQUFrRjtnQkFDbEYsMERBQTBEO2dCQUNuRCxhQUFhLENBQWUsVUFBYyxFQUFFLEdBQU07b0JBQ3ZELE9BQU8sb0JBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZELENBQUM7Z0JBRUQsc0VBQXNFO2dCQUN0RSxrREFBa0Q7Z0JBQ2xELDJEQUEyRDtnQkFDcEQsY0FBYyxDQUFlLFdBQWUsRUFBRSxHQUFNO29CQUN6RCxPQUFPLGNBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO2dCQUVELHlFQUF5RTtnQkFDekUsd0NBQXdDO2dCQUN4Qyx3RUFBd0U7Z0JBQ2pFLGFBQWEsQ0FBZSxVQUFjLEVBQUUsR0FBTTtvQkFDdkQsT0FBTyxvQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFFRCw2Q0FBNkM7Z0JBQzdDLHlDQUF5QztnQkFDekMsMkNBQTJDO2dCQUNwQyxjQUFjLENBQWUsV0FBZSxFQUFFLEdBQU07b0JBQ3pELE9BQU8sY0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBRUQseUVBQXlFO2dCQUN6RSx3Q0FBd0M7Z0JBQ3hDLDBDQUEwQztnQkFDbkMsK0JBQStCLENBQWUsVUFBYyxFQUFFLEdBQU07b0JBQ3pFLE9BQU8sZUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdkksQ0FBQztnQkFFRCw0Q0FBNEM7Z0JBQzVDLHdDQUF3QztnQkFDeEMsMENBQTBDO2dCQUNuQywrQkFBK0IsQ0FBZSxVQUFjLEVBQUUsR0FBTTtvQkFDekUsT0FBTyxJQUFJLENBQUMsK0JBQStCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hGLENBQUM7Z0JBRUQsdUNBQXVDO2dCQUNoQyxnQkFBZ0I7b0JBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDOUIsQ0FBQztnQkFFRCx1Q0FBdUM7Z0JBQ2hDLGdCQUFnQixDQUFDLGFBQXFCO29CQUMzQyxJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQztnQkFDdkMsQ0FBQztnQkFFRCx3Q0FBd0M7Z0JBQ2pDLGlCQUFpQjtvQkFDdEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQy9CLENBQUM7Z0JBRUQsd0NBQXdDO2dCQUNqQyxpQkFBaUIsQ0FBQyxjQUFzQjtvQkFDN0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztnQkFDekMsQ0FBQztnQkFFRCxzQ0FBc0M7Z0JBQy9CLGVBQWU7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDN0IsQ0FBQztnQkFFRCxzQ0FBc0M7Z0JBQy9CLGVBQWUsQ0FBQyxLQUFhO29CQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztnQkFDOUIsQ0FBQztnQkFFRCxvRUFBb0U7Z0JBQzdELE9BQU8sQ0FBQyxJQUFnQjtvQkFDN0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTt3QkFDeEIsT0FBTztxQkFDUjtvQkFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFFbkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUVyQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLGFBQWEsRUFBRTt3QkFDNUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3FCQUM1QjtvQkFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVwQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFFbEIsZ0NBQWdDO29CQUNoQyxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNoRDtvQkFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUUzQiw0RUFBNEU7b0JBQzVFLE1BQU0sVUFBVSxHQUFpQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQztvQkFDNUUsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNsQyxNQUFNLFVBQVUsR0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDO3dCQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFOzRCQUMzQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQ2hEO3FCQUNGO2dCQUNILENBQUM7Z0JBRUQsOEJBQThCO2dCQUN2QixPQUFPO29CQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxpRkFBaUY7Z0JBQzFFLFNBQVMsQ0FBQyxJQUFhO29CQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDM0IsQ0FBQztnQkFFRCwwRUFBMEU7Z0JBQ25FLFFBQVE7b0JBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUMzQixDQUFDO2dCQUVELHVFQUF1RTtnQkFDdkUsdUJBQXVCO2dCQUNoQixrQkFBa0IsQ0FBQyxJQUFhO29CQUNyQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDNUIsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNyQjtnQkFDSCxDQUFDO2dCQUVELGlDQUFpQztnQkFDMUIsaUJBQWlCO29CQUN0QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBQzlCLENBQUM7Z0JBRUQsNkRBQTZEO2dCQUM3RCxpQkFBaUI7Z0JBQ2pCLHVFQUF1RTtnQkFDaEUsUUFBUSxDQUFDLElBQWE7b0JBQzNCLElBQUksSUFBSSxFQUFFO3dCQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFOzRCQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs0QkFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7eUJBQ3RCO3FCQUNGO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO3dCQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztxQkFDbkI7Z0JBQ0gsQ0FBQztnQkFFRCx3Q0FBd0M7Z0JBQ3hDLHlDQUF5QztnQkFDbEMsT0FBTztvQkFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsNkRBQTZEO2dCQUM3RCxzREFBc0Q7Z0JBQ3RELGlFQUFpRTtnQkFDakUsZ0JBQWdCO2dCQUNoQixrRUFBa0U7Z0JBQ2xFLHVEQUF1RDtnQkFDdkQsa0VBQWtFO2dCQUNsRSw2REFBNkQ7Z0JBQzdELGlFQUFpRTtnQkFDakUseURBQXlEO2dCQUN6RCxpRUFBaUU7Z0JBQ2pFLG1FQUFtRTtnQkFDbkUscUJBQXFCO2dCQUNkLFNBQVMsQ0FBQyxJQUFhO29CQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUVuRCxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQzVCLE9BQU87cUJBQ1I7b0JBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBRXpCLElBQUksSUFBSSxFQUFFO3dCQUNSLHNCQUFzQjt3QkFDdEIsTUFBTSxVQUFVLEdBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO3dCQUM1RSxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7NEJBQ2xDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDeEM7d0JBQ0QsMkNBQTJDO3FCQUM1Qzt5QkFBTTt3QkFDTCx1QkFBdUI7d0JBQ3ZCLE1BQU0sVUFBVSxHQUFpQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQzt3QkFDNUUsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFOzRCQUNsQyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3lCQUM5Qjt3QkFDRCxpQ0FBaUM7d0JBQ2pDLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTs0QkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ2hEO3dCQUNELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQzVCO2dCQUNILENBQUM7Z0JBRUQscUNBQXFDO2dCQUM5QixRQUFRO29CQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDM0IsQ0FBQztnQkFFRCw4REFBOEQ7Z0JBQzlELGdCQUFnQjtnQkFDVCxnQkFBZ0IsQ0FBQyxJQUFhO29CQUNuQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7d0JBQ3JDLE9BQU87cUJBQ1I7b0JBRUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztvQkFFaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztvQkFFM0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN2QixDQUFDO2dCQUVELHVDQUF1QztnQkFDaEMsZUFBZTtvQkFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQsdURBQXVEO2dCQUNoRCxjQUFjO29CQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQzVCLENBQUM7Z0JBRUQscURBQXFEO2dCQUM5QyxZQUFZO29CQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsdURBQXVEO2dCQUN2RCwrREFBK0Q7Z0JBQy9ELDREQUE0RDtnQkFDckQsY0FBYztvQkFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUM1QixDQUFDO2dCQUVELHVFQUF1RTtnQkFDaEUsV0FBVztvQkFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUN6QixDQUFDO2dCQUVELHdFQUF3RTtnQkFDakUsV0FBVyxDQUFDLElBQVM7b0JBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixDQUFDO2dCQUVELHNDQUFzQztnQkFDL0IsUUFBUTtvQkFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsZ0NBQWdDO2dCQUN6QixJQUFJLENBQUMsR0FBNkM7b0JBQ3ZELE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUM7b0JBRTdDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDWCxHQUFHLENBQUMsNENBQTRDLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO29CQUMxQixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLEtBQUssVUFBVSxDQUFDLGFBQWE7NEJBQzNCLFFBQVEsR0FBRywwQkFBMEIsQ0FBQzs0QkFDdEMsTUFBTTt3QkFDUixLQUFLLFVBQVUsQ0FBQyxnQkFBZ0I7NEJBQzlCLFFBQVEsR0FBRyw2QkFBNkIsQ0FBQzs0QkFDekMsTUFBTTt3QkFDUixLQUFLLFVBQVUsQ0FBQyxjQUFjOzRCQUM1QixRQUFRLEdBQUcsMkJBQTJCLENBQUM7NEJBQ3ZDLE1BQU07d0JBQ1I7NEJBQ0UsMEJBQTBCOzRCQUMxQixNQUFNO3FCQUNQO29CQUNELEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDbkMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEUsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEcsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUMvRCxHQUFHLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUMzRCxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQzdELEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDckUsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDckYsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZFLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN2RSxHQUFHLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN6RCxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1YsR0FBRyxDQUFDLCtDQUErQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDekUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNWLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDaEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUN2QixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ2Q7b0JBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBR00sbUJBQW1CO29CQUN4QixNQUFNLEdBQUcsR0FBZ0IsTUFBTSxDQUFDLHlCQUF5QixDQUFDO29CQUMxRCxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNoQyxjQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1QyxNQUFNLFVBQVUsR0FBaUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7b0JBQzVFLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDbEMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDM0M7Z0JBQ0gsQ0FBQztnQkFFTSxvQkFBb0I7b0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxjQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsQ0FBQztnQkFFRCwyREFBMkQ7Z0JBQzNELHNEQUFzRDtnQkFDL0MsYUFBYSxDQUFDLEtBQWE7b0JBQ2hDLG9EQUFvRDtvQkFDcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsYUFBYSxFQUFFO3dCQUN6RixPQUFPLEtBQUssQ0FBQztxQkFDZDtvQkFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFFTSxzQkFBc0IsQ0FBQyxLQUFhO29CQUN6QyxrQ0FBa0M7b0JBQ2xDLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDcEMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTs0QkFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtnQ0FDN0IsT0FBTyxLQUFLLENBQUM7NkJBQ2Q7eUJBQ0Y7cUJBQ0Y7b0JBRUQsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxPQUFPLENBQUMsS0FBYTtvQkFDMUIsbUVBQW1FO29CQUNuRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckMsY0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELENBQUM7Z0JBRUQsMkJBQTJCO2dCQUNwQixpQkFBaUI7b0JBQ3RCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUMvQixDQUFDO2dCQUVNLGtCQUFrQjtvQkFDdkIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxDQUFDO2FBRUYsQ0FBQTtZQWh6QkMsOERBQThEO1lBQzlELGtGQUFrRjtZQUNsRix3REFBd0Q7WUFDeEQseUZBQXlGO1lBQ3pGLHdDQUF3QztZQUN4QyxxRUFBcUU7WUFDckUsc0RBQXNEO1lBQ3ZDLHNDQUErQixHQUFpQixJQUFJLHdCQUFZLEVBQUUsQ0FBQztZQXdVbEYsNEVBQTRFO1lBQzVFLHVEQUF1RDtZQUN2RCxzRUFBc0U7WUFDdEUsMERBQTBEO1lBQzFELHdDQUF3QztZQUN6Qiw4QkFBdUIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBbUM5RCxzRkFBc0Y7WUFDdEYsc0ZBQXNGO1lBQ3RGLGtEQUFrRDtZQUNuQyxrQ0FBMkIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ25ELGdDQUF5QixHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7WUFDakQsK0JBQXdCLEdBQWUsSUFBSSxvQkFBVSxFQUFFLENBQUM7WUF1WHhELGdDQUF5QixHQUFnQixJQUFJLG9CQUFXLEVBQUUsQ0FBQyJ9