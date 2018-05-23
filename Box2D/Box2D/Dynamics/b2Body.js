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
                    this.type = 0 /* b2_staticBody */;
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
                    this.m_type = 0 /* b2_staticBody */;
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
                    this.m_world = null;
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
                    if (bd.type === 2 /* b2_dynamicBody */) {
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
                    const fixture = new b2Fixture_1.b2Fixture();
                    fixture.Create(this, def);
                    if (this.m_activeFlag) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.CreateProxies(broadPhase, this.m_xf);
                    }
                    fixture.m_next = this.m_fixtureList;
                    this.m_fixtureList = fixture;
                    ++this.m_fixtureCount;
                    fixture.m_body = this;
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
                    fixture.m_body = null;
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
                    if (this.m_type === 0 /* b2_staticBody */) {
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
                    if (this.m_type === 0 /* b2_staticBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
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
                    if (this.m_type === 0 /* b2_staticBody */ || this.m_type === 1 /* b2_kinematicBody */) {
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
                    if (this.m_type === 0 /* b2_staticBody */) {
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
                            broadPhase.TouchProxy(f.m_proxies[i].proxy);
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
                        case 0 /* b2_staticBody */:
                            type_str = "b2BodyType.b2_staticBody";
                            break;
                        case 1 /* b2_kinematicBody */:
                            type_str = "b2BodyType.b2_kinematicBody";
                            break;
                        case 2 /* b2_dynamicBody */:
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
                    if (this.m_type === 0 /* b2_staticBody */ && other.m_type === 0 /* b2_staticBody */) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCb2R5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCb2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVRixrQkFBa0I7WUFDbEIsMkRBQTJEO1lBQzNELHdFQUF3RTtZQUN4RSxtRkFBbUY7WUFDbkYsV0FBa0IsVUFBVTtnQkFDMUIsd0RBQWUsQ0FBQTtnQkFDZiw2REFBaUIsQ0FBQTtnQkFDakIsbUVBQW9CLENBQUE7Z0JBQ3BCLCtEQUFrQixDQUFBO2dCQUVsQixZQUFZO2dCQUNaLG9CQUFvQjtZQUN0QixDQUFDLEVBUmlCLFVBQVUsS0FBVixVQUFVLFFBUTNCOztZQUVELDBFQUEwRTtZQUMxRSwwRkFBMEY7WUFDMUYsWUFBQTtnQkFBQTtvQkFDRSxpREFBaUQ7b0JBQ2pELHlFQUF5RTtvQkFDbEUsU0FBSSx5QkFBd0M7b0JBRW5ELHVFQUF1RTtvQkFDdkUsbURBQW1EO29CQUM1QyxhQUFRLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUUzQywyQ0FBMkM7b0JBQ3BDLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBRXpCLG1FQUFtRTtvQkFDNUQsbUJBQWMsR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWpELHFDQUFxQztvQkFDOUIsb0JBQWUsR0FBVyxDQUFDLENBQUM7b0JBRW5DLDhFQUE4RTtvQkFDOUUsMkVBQTJFO29CQUMzRSxrREFBa0Q7b0JBQzNDLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUVqQyxnRkFBZ0Y7b0JBQ2hGLDJFQUEyRTtvQkFDM0Usa0RBQWtEO29CQUMzQyxtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFFbEMsMkVBQTJFO29CQUMzRSw2QkFBNkI7b0JBQ3RCLGVBQVUsR0FBWSxJQUFJLENBQUM7b0JBRWxDLDZDQUE2QztvQkFDdEMsVUFBSyxHQUFZLElB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