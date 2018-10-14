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
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_fixtureList = null;
                    this.m_fixtureCount = 0;
                    this.m_jointList = null;
                    this.m_contactList = null;
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
                    this.m_controllerList = null;
                    this.m_controllerCount = 0;
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
                    this.m_fixtureList = null;
                    this.m_fixtureCount = 0;
                    // #if B2_ENABLE_CONTROLLER
                    this.m_controllerList = null;
                    this.m_controllerCount = 0;
                    // #endif
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
                        fixture.CreateProxies(this.m_xf);
                    }
                    fixture.m_next = this.m_fixtureList;
                    this.m_fixtureList = fixture;
                    ++this.m_fixtureCount;
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
                    // DEBUG: b2Assert(this.m_fixtureCount > 0);
                    let node = this.m_fixtureList;
                    let ppF = null;
                    // DEBUG: let found: boolean = false;
                    while (node !== null) {
                        if (node === fixture) {
                            if (ppF) {
                                ppF.m_next = fixture.m_next;
                            }
                            else {
                                this.m_fixtureList = fixture.m_next;
                            }
                            // DEBUG: found = true;
                            break;
                        }
                        ppF = node;
                        node = node.m_next;
                    }
                    // You tried to remove a shape that is not attached to this body.
                    // DEBUG: b2Assert(found);
                    // Destroy any contacts associated with the fixture.
                    let edge = this.m_contactList;
                    while (edge) {
                        const c = edge.contact;
                        edge = edge.next;
                        const fixtureA = c.GetFixtureA();
                        const fixtureB = c.GetFixtureB();
                        if (fixture === fixtureA || fixture === fixtureB) {
                            // This destroys the contact and removes it from
                            // this body's contact list.
                            this.m_world.m_contactManager.Destroy(c);
                        }
                    }
                    if (this.m_activeFlag) {
                        fixture.DestroyProxies();
                    }
                    // fixture.m_body = null;
                    fixture.m_next = null;
                    fixture.Destroy();
                    --this.m_fixtureCount;
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
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.Synchronize(this.m_xf, this.m_xf);
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
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
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
                    let ce = this.m_contactList;
                    while (ce) {
                        const ce0 = ce;
                        ce = ce.next;
                        this.m_world.m_contactManager.Destroy(ce0.contact);
                    }
                    this.m_contactList = null;
                    // Touch the proxies so that new contacts will be created (when appropriate)
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.TouchProxies();
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
                        this.m_awakeFlag = true;
                        this.m_sleepTime = 0;
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
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.CreateProxies(this.m_xf);
                        }
                        // Contacts are created the next time step.
                    }
                    else {
                        // Destroy all proxies.
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.DestroyProxies();
                        }
                        // Destroy the attached contacts.
                        let ce = this.m_contactList;
                        while (ce) {
                            const ce0 = ce;
                            ce = ce.next;
                            this.m_world.m_contactManager.Destroy(ce0.contact);
                        }
                        this.m_contactList = null;
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
                /// Get the next body in the world's body list.
                GetNext() {
                    return this.m_next;
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
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
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
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.Synchronize(xf1, this.m_xf);
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
                    for (let jn = this.m_jointList; jn; jn = jn.next) {
                        if (jn.other === other) {
                            if (!jn.joint.m_collideConnected) {
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
                    return this.m_controllerCount;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCb2R5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvYjJCb2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFhRixTQUFTO1lBRVQsa0JBQWtCO1lBQ2xCLDJEQUEyRDtZQUMzRCx3RUFBd0U7WUFDeEUsbUZBQW1GO1lBQ25GLFdBQVksVUFBVTtnQkFDcEIsd0RBQWUsQ0FBQTtnQkFDZiw2REFBaUIsQ0FBQTtnQkFDakIsbUVBQW9CLENBQUE7Z0JBQ3BCLCtEQUFrQixDQUFBO2dCQUVsQixZQUFZO2dCQUNaLG9CQUFvQjtZQUN0QixDQUFDLEVBUlcsVUFBVSxLQUFWLFVBQVUsUUFRckI7O1lBMERELDBFQUEwRTtZQUMxRSwwRkFBMEY7WUFDMUYsWUFBQSxNQUFhLFNBQVM7Z0JBQXRCO29CQUNFLGlEQUFpRDtvQkFDakQseUVBQXlFO29CQUNsRSxTQUFJLEdBQWUsVUFBVSxDQUFDLGFBQWEsQ0FBQztvQkFFbkQsdUVBQXVFO29CQUN2RSxtREFBbUQ7b0JBQ25DLGFBQVEsR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXBELDJDQUEyQztvQkFDcEMsVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFFekIsbUVBQW1FO29CQUNuRCxtQkFBYyxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFMUQscUNBQXFDO29CQUM5QixvQkFBZSxHQUFXLENBQUMsQ0FBQztvQkFFbkMsOEVBQThFO29CQUM5RSwyRUFBMkU7b0JBQzNFLGtEQUFrRDtvQkFDM0Msa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBRWpDLGdGQUFnRjtvQkFDaEYsMkVBQTJFO29CQUMzRSxrREFBa0Q7b0JBQzNDLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUVsQywyRUFBMkU7b0JBQzNFLDZC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