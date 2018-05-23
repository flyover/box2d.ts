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
System.register(["../Common/b2Math", "../Collision/Shapes/b2Shape", "./b2Fixture"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Math_1, b2Shape_1, b2Fixture_1, b2BodyType, b2BodyDef, b2Body;
    return {
        setters: [
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
                // public m_controllerList: b2ControllerEdge = null;
                // public m_controllerCount: number = 0;
                constructor(bd, world) {
                    ///b2Assert(bd.position.IsValid());
                    ///b2Assert(bd.linearVelocity.IsValid());
                    ///b2Assert(b2IsValid(bd.angle));
                    ///b2Assert(b2IsValid(bd.angularVelocity));
                    ///b2Assert(b2IsValid(bd.gravityScale) && bd.gravityScale >= 0);
                    ///b2Assert(b2IsValid(bd.angularDamping) && bd.angularDamping >= 0);
                    ///b2Assert(b2IsValid(bd.linearDamping) && bd.linearDamping >= 0);
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
                    ///#if B2_ENABLE_PARTICLE
                    this.m_xf0 = new b2Math_1.b2Transform();
                    ///#endif
                    this.m_sweep = new b2Math_1.b2Sweep(); // the swept motion for CCD
                    this.m_linearVelocity = new b2Math_1.b2Vec2();
                    this.m_angularVelocity = 0;
                    this.m_force = new b2Math_1.b2Vec2;
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
                    if (bd.bullet) {
                        this.m_bulletFlag = true;
                    }
                    if (bd.fixedRotation) {
                        this.m_fixedRotationFlag = true;
                    }
                    if (bd.allowSleep) {
                        this.m_autoSleepFlag = true;
                    }
                    if (bd.awake) {
                        this.m_awakeFlag = true;
                    }
                    if (bd.active) {
                        this.m_activeFlag = true;
                    }
                    this.m_world = world;
                    this.m_xf.p.Copy(bd.position);
                    this.m_xf.q.SetAngle(bd.angle);
                    ///#if B2_ENABLE_PARTICLE
                    this.m_xf0.Copy(this.m_xf);
                    ///#endif
                    this.m_sweep.localCenter.SetZero();
                    this.m_sweep.c0.Copy(this.m_xf.p);
                    this.m_sweep.c.Copy(this.m_xf.p);
                    this.m_sweep.a0 = bd.angle;
                    this.m_sweep.a = bd.angle;
                    this.m_sweep.alpha0 = 0;
                    this.m_linearVelocity.Copy(bd.linearVelocity);
                    this.m_angularVelocity = bd.angularVelocity;
                    this.m_linearDamping = bd.linearDamping;
                    this.m_angularDamping = bd.angularDamping;
                    this.m_gravityScale = bd.gravityScale;
                    this.m_force.SetZero();
                    this.m_torque = 0;
                    this.m_sleepTime = 0;
                    this.m_type = bd.type;
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
                    // this.m_controllerList = null;
                    // this.m_controllerCount = 0;
                }
                CreateFixture(a, b) {
                    if (a instanceof b2Fixture_1.b2FixtureDef) {
                        return this.CreateFixtureDef(a);
                    }
                    else if ((a instanceof b2Shape_1.b2Shape) && (typeof (b) === "number")) {
                        return this.CreateFixtureShapeDensity(a, b);
                    }
                    else {
                        throw new Error();
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (this.m_world.IsLocked()) {
                        return null;
                    }
                    const fixture = new b2Fixture_1.b2Fixture(def, this);
                    fixture.Create(/*this,*/ def);
                    if (this.m_activeFlag) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.CreateProxies(broadPhase, this.m_xf);
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (this.m_world.IsLocked()) {
                        return;
                    }
                    ///b2Assert(fixture.m_body === this);
                    // Remove the fixture from this body's singly linked list.
                    ///b2Assert(this.m_fixtureCount > 0);
                    let node = this.m_fixtureList;
                    let ppF = null;
                    // let found: boolean = false;
                    while (node !== null) {
                        if (node === fixture) {
                            if (ppF)
                                ppF.m_next = fixture.m_next;
                            else
                                this.m_fixtureList = fixture.m_next;
                            // found = true;
                            break;
                        }
                        ppF = node;
                        node = node.m_next;
                    }
                    // You tried to remove a shape that is not attached to this body.
                    ///b2Assert(found);
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
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.DestroyProxies(broadPhase);
                    }
                    fixture.Destroy();
                    // fixture.m_body = null;
                    fixture.m_next = null;
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (this.m_world.IsLocked()) {
                        return;
                    }
                    this.m_xf.q.SetAngle(angle);
                    this.m_xf.p.Set(x, y);
                    ///#if B2_ENABLE_PARTICLE
                    this.m_xf0.Copy(this.m_xf);
                    ///#endif
                    b2Math_1.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.a = angle;
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    this.m_sweep.a0 = angle;
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (this.m_world.IsLocked()) {
                        return;
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
                        ///b2Assert(this.m_I > 0);
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
                    ///b2Assert(this.m_type === b2BodyType.b2_dynamicBody);
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
                        ///b2Assert(this.m_I > 0);
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (this.m_world.IsLocked()) {
                        return;
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
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
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
                    ///b2Assert(!this.m_world.IsLocked());
                    if (flag === this.IsActive()) {
                        return;
                    }
                    this.m_activeFlag = flag;
                    if (flag) {
                        // Create all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.CreateProxies(broadPhase, this.m_xf);
                        }
                        // Contacts are created the next time step.
                    }
                    else {
                        // Destroy all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.DestroyProxies(broadPhase);
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
                            ///b2Assert(false);
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
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCb2R5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCb2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVRixrQkFBa0I7WUFDbEIsMkRBQTJEO1lBQzNELHdFQUF3RTtZQUN4RSxtRkFBbUY7WUFDbkYsV0FBWSxVQUFVO2dCQUNwQix3REFBZSxDQUFBO2dCQUNmLDZEQUFpQixDQUFBO2dCQUNqQixtRUFBb0IsQ0FBQTtnQkFDcEIsK0RBQWtCLENBQUE7Z0JBRWxCLFlBQVk7Z0JBQ1osb0JBQW9CO1lBQ3RCLENBQUMsRUFSVyxVQUFVLEtBQVYsVUFBVSxRQVFyQjs7WUFFRCwwRUFBMEU7WUFDMUUsMEZBQTBGO1lBQzFGLFlBQUE7Z0JBQUE7b0JBQ0UsaURBQWlEO29CQUNqRCx5RUFBeUU7b0JBQ2xFLFNBQUksR0FBZSxVQUFVLENBQUMsYUFBYSxDQUFDO29CQUVuRCx1RUFBdUU7b0JBQ3ZFLG1EQUFtRDtvQkFDNUMsYUFBUSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFM0MsMkNBQTJDO29CQUNwQyxVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUV6QixtRUFBbUU7b0JBQzVELG1CQUFjLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVqRCxxQ0FBcUM7b0JBQzlCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO29CQUVuQyw4RUFBOEU7b0JBQzlFLDJFQUEyRTtvQkFDM0Usa0RBQWtEO29CQUMzQyxrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFFakMsZ0ZBQWdGO29CQUNoRiwyRUFBMkU7b0JBQzNFLGtEQUFrRDtvQkFDM0MsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRWxDLDJFQUEyRTtvQkFDM0UsNkJBQTZCO29CQUN0QixlQUFVLEdBQVksSUFBSSxDQUFDO29CQUVsQyw2Q0FBNkM7b0JB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