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
                    const fixture = new b2Fixture_1.b2Fixture(this, def);
                    if (this.m_activeFlag) {
                        fixture.CreateProxies();
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
                    fixture.Reset();
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
                        f.SynchronizeProxies(this.m_xf, this.m_xf, b2Math_1.b2Vec2.ZERO);
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
                            f.CreateProxies();
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
                    // const displacement: b2Vec2 = b2Vec2.SubVV(this.m_xf.p, xf1.p, b2Body.SynchronizeFixtures_s_displacement);
                    const displacement = b2Math_1.b2Vec2.SubVV(this.m_sweep.c, this.m_sweep.c0, b2Body.SynchronizeFixtures_s_displacement);
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.SynchronizeProxies(xf1, this.m_xf, displacement);
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
            exports_1("b2Body", b2Body);
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
            b2Body.SynchronizeFixtures_s_displacement = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCb2R5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCb2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFhRixTQUFTO1lBRVQsa0JBQWtCO1lBQ2xCLDJEQUEyRDtZQUMzRCx3RUFBd0U7WUFDeEUsbUZBQW1GO1lBQ25GLFdBQVksVUFBVTtnQkFDcEIsd0RBQWUsQ0FBQTtnQkFDZiw2REFBaUIsQ0FBQTtnQkFDakIsbUVBQW9CLENBQUE7Z0JBQ3BCLCtEQUFrQixDQUFBO2dCQUVsQixZQUFZO2dCQUNaLG9CQUFvQjtZQUN0QixDQUFDLEVBUlcsVUFBVSxLQUFWLFVBQVUsUUFRckI7O1lBMERELDBFQUEwRTtZQUMxRSwwRkFBMEY7WUFDMUYsWUFBQSxNQUFhLFNBQVM7Z0JBQXRCO29CQUNFLGlEQUFpRDtvQkFDakQseUVBQXlFO29CQUNsRSxTQUFJLEdBQWUsVUFBVSxDQUFDLGFBQWEsQ0FBQztvQkFFbkQsdUVBQXVFO29CQUN2RSxtREFBbUQ7b0JBQ25DLGFBQVEsR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXBELDJDQUEyQztvQkFDcEMsVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFFekIsbUVBQW1FO29CQUNuRCxtQkFBYyxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFMUQscUNBQXFDO29CQUM5QixvQkFBZSxHQUFXLENBQUMsQ0FBQztvQkFFbkMsOEVBQThFO29CQUM5RSwyRUFBMkU7b0JBQzNFLGtEQUFrRDtvQkFDM0Msa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBRWpDLGdGQUFnRjtvQkFDaEYsMkVBQTJFO29CQUMzRSxrREFBa0Q7b0JBQzNDLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUVsQywyRUFBMkU7b0JBQzNFLDZCQUE2QjtvQkFDdEIsZUFBVSxHQUFZLElB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