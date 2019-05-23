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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Collision/b2Collision", "../Collision/Shapes/b2Shape"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Shape_1, b2Filter, b2FixtureDef, b2FixtureProxy, b2Fixture;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            }
        ],
        execute: function () {
            /// This holds contact filtering data.
            b2Filter = class b2Filter {
                constructor() {
                    /// The collision category bits. Normally you would just set one bit.
                    this.categoryBits = 0x0001;
                    /// The collision mask bits. This states the categories that this
                    /// shape would accept for collision.
                    this.maskBits = 0xFFFF;
                    /// Collision groups allow a certain group of objects to never collide (negative)
                    /// or always collide (positive). Zero means no collision group. Non-zero group
                    /// filtering always wins against the mask bits.
                    this.groupIndex = 0;
                }
                Clone() {
                    return new b2Filter().Copy(this);
                }
                Copy(other) {
                    // DEBUG: b2Assert(this !== other);
                    this.categoryBits = other.categoryBits;
                    this.maskBits = other.maskBits;
                    this.groupIndex = other.groupIndex || 0;
                    return this;
                }
            };
            b2Filter.DEFAULT = new b2Filter();
            exports_1("b2Filter", b2Filter);
            /// A fixture definition is used to create a fixture. This class defines an
            /// abstract fixture definition. You can reuse fixture definitions safely.
            b2FixtureDef = class b2FixtureDef {
                constructor() {
                    /// Use this to store application specific fixture data.
                    this.userData = null;
                    /// The friction coefficient, usually in the range [0,1].
                    this.friction = 0.2;
                    /// The restitution (elasticity) usually in the range [0,1].
                    this.restitution = 0;
                    /// The density, usually in kg/m^2.
                    this.density = 0;
                    /// A sensor shape collects contact information but never generates a collision
                    /// response.
                    this.isSensor = false;
                    /// Contact filtering data.
                    this.filter = new b2Filter();
                }
            };
            exports_1("b2FixtureDef", b2FixtureDef);
            /// This proxy is used internally to connect fixtures to the broad-phase.
            b2FixtureProxy = class b2FixtureProxy {
                constructor(fixture, childIndex) {
                    this.aabb = new b2Collision_1.b2AABB();
                    this.childIndex = 0;
                    this.fixture = fixture;
                    this.childIndex = childIndex;
                    this.fixture.m_shape.ComputeAABB(this.aabb, this.fixture.m_body.GetTransform(), childIndex);
                    this.treeNode = this.fixture.m_body.m_world.m_contactManager.m_broadPhase.CreateProxy(this.aabb, this);
                }
                Reset() {
                    this.fixture.m_body.m_world.m_contactManager.m_broadPhase.DestroyProxy(this.treeNode);
                }
                Touch() {
                    this.fixture.m_body.m_world.m_contactManager.m_broadPhase.TouchProxy(this.treeNode);
                }
                Synchronize(transform1, transform2) {
                    const displacement = b2Math_1.b2Vec2.SubVV(transform2.p, transform1.p, b2FixtureProxy.Synchronize_s_displacement);
                    if (transform1 === transform2) {
                        this.fixture.m_shape.ComputeAABB(this.aabb, transform1, this.childIndex);
                        this.fixture.m_body.m_world.m_contactManager.m_broadPhase.MoveProxy(this.treeNode, this.aabb, displacement);
                    }
                    else {
                        // Compute an AABB that covers the swept shape (may miss some rotation effect).
                        const aabb1 = b2FixtureProxy.Synchronize_s_aabb1;
                        const aabb2 = b2FixtureProxy.Synchronize_s_aabb2;
                        this.fixture.m_shape.ComputeAABB(aabb1, transform1, this.childIndex);
                        this.fixture.m_shape.ComputeAABB(aabb2, transform2, this.childIndex);
                        this.aabb.Combine2(aabb1, aabb2);
                        this.fixture.m_body.m_world.m_contactManager.m_broadPhase.MoveProxy(this.treeNode, this.aabb, displacement);
                    }
                }
            };
            b2FixtureProxy.Synchronize_s_displacement = new b2Math_1.b2Vec2();
            b2FixtureProxy.Synchronize_s_aabb1 = new b2Collision_1.b2AABB();
            b2FixtureProxy.Synchronize_s_aabb2 = new b2Collision_1.b2AABB();
            exports_1("b2FixtureProxy", b2FixtureProxy);
            /// A fixture is used to attach a shape to a body for collision detection. A fixture
            /// inherits its transform from its parent. Fixtures hold additional non-geometric data
            /// such as friction, collision filters, etc.
            /// Fixtures are created via b2Body::CreateFixture.
            /// @warning you cannot reuse fixtures.
            b2Fixture = class b2Fixture {
                constructor(body, def) {
                    this.m_density = 0;
                    this.m_next = null;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_proxies = [];
                    this.m_filter = new b2Filter();
                    this.m_isSensor = false;
                    this.m_userData = null;
                    this.m_body = body;
                    this.m_shape = def.shape.Clone();
                    this.m_userData = b2Settings_1.b2Maybe(def.userData, null);
                    this.m_friction = b2Settings_1.b2Maybe(def.friction, 0.2);
                    this.m_restitution = b2Settings_1.b2Maybe(def.restitution, 0);
                    this.m_filter.Copy(b2Settings_1.b2Maybe(def.filter, b2Filter.DEFAULT));
                    this.m_isSensor = b2Settings_1.b2Maybe(def.isSensor, false);
                    this.m_density = b2Settings_1.b2Maybe(def.density, 0);
                }
                get m_proxyCount() { return this.m_proxies.length; }
                Reset() {
                    // The proxies must be destroyed before calling this.
                    // DEBUG: b2Assert(this.m_proxyCount === 0);
                }
                /// Get the type of the child shape. You can use this to down cast to the concrete shape.
                /// @return the shape type.
                GetType() {
                    return this.m_shape.GetType();
                }
                /// Get the child shape. You can modify the child shape, however you should not change the
                /// number of vertices because this will crash some collision caching mechanisms.
                /// Manipulating the shape may lead to non-physical behavior.
                GetShape() {
                    return this.m_shape;
                }
                /// Set if this fixture is a sensor.
                SetSensor(sensor) {
                    if (sensor !== this.m_isSensor) {
                        this.m_body.SetAwake(true);
                        this.m_isSensor = sensor;
                    }
                }
                /// Is this fixture a sensor (non-solid)?
                /// @return the true if the shape is a sensor.
                IsSensor() {
                    return this.m_isSensor;
                }
                /// Set the contact filtering data. This will not update contacts until the next time
                /// step when either parent body is active and awake.
                /// This automatically calls Refilter.
                SetFilterData(filter) {
                    this.m_filter.Copy(filter);
                    this.Refilter();
                }
                /// Get the contact filtering data.
                GetFilterData() {
                    return this.m_filter;
                }
                /// Call this if you want to establish collision that was previously disabled by b2ContactFilter::ShouldCollide.
                Refilter() {
                    // Flag associated contacts for filtering.
                    let edge = this.m_body.GetContactList();
                    while (edge) {
                        const contact = edge.contact;
                        const fixtureA = contact.GetFixtureA();
                        const fixtureB = contact.GetFixtureB();
                        if (fixtureA === this || fixtureB === this) {
                            contact.FlagForFiltering();
                        }
                        edge = edge.next;
                    }
                    // Touch each proxy so that new pairs may be created
                    this.TouchProxies();
                }
                /// Get the parent body of this fixture. This is NULL if the fixture is not attached.
                /// @return the parent body.
                GetBody() {
                    return this.m_body;
                }
                /// Get the next fixture in the parent body's fixture list.
                /// @return the next shape.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data that was assigned in the fixture definition. Use this to
                /// store your application specific data.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data. Use this to store your application specific data.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Test a point for containment in this fixture.
                /// @param p a point in world coordinates.
                TestPoint(p) {
                    return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
                }
                // #if B2_ENABLE_PARTICLE
                ComputeDistance(p, normal, childIndex) {
                    return this.m_shape.ComputeDistance(this.m_body.GetTransform(), p, normal, childIndex);
                }
                // #endif
                /// Cast a ray against this shape.
                /// @param output the ray-cast results.
                /// @param input the ray-cast input parameters.
                RayCast(output, input, childIndex) {
                    return this.m_shape.RayCast(output, input, this.m_body.GetTransform(), childIndex);
                }
                /// Get the mass data for this fixture. The mass data is based on the density and
                /// the shape. The rotational inertia is about the shape's origin. This operation
                /// may be expensive.
                GetMassData(massData = new b2Shape_1.b2MassData()) {
                    this.m_shape.ComputeMass(massData, this.m_density);
                    return massData;
                }
                /// Set the density of this fixture. This will _not_ automatically adjust the mass
                /// of the body. You must call b2Body::ResetMassData to update the body's mass.
                SetDensity(density) {
                    this.m_density = density;
                }
                /// Get the density of this fixture.
                GetDensity() {
                    return this.m_density;
                }
                /// Get the coefficient of friction.
                GetFriction() {
                    return this.m_friction;
                }
                /// Set the coefficient of friction. This will _not_ change the friction of
                /// existing contacts.
                SetFriction(friction) {
                    this.m_friction = friction;
                }
                /// Get the coefficient of restitution.
                GetRestitution() {
                    return this.m_restitution;
                }
                /// Set the coefficient of restitution. This will _not_ change the restitution of
                /// existing contacts.
                SetRestitution(restitution) {
                    this.m_restitution = restitution;
                }
                /// Get the fixture's AABB. This AABB may be enlarge and/or stale.
                /// If you need a more accurate AABB, compute it using the shape and
                /// the body transform.
                GetAABB(childIndex) {
                    // DEBUG: b2Assert(0 <= childIndex && childIndex < this.m_proxyCount);
                    return this.m_proxies[childIndex].aabb;
                }
                /// Dump this fixture to the log file.
                Dump(log, bodyIndex) {
                    log("    const fd: b2FixtureDef = new b2FixtureDef();\n");
                    log("    fd.friction = %.15f;\n", this.m_friction);
                    log("    fd.restitution = %.15f;\n", this.m_restitution);
                    log("    fd.density = %.15f;\n", this.m_density);
                    log("    fd.isSensor = %s;\n", (this.m_isSensor) ? ("true") : ("false"));
                    log("    fd.filter.categoryBits = %d;\n", this.m_filter.categoryBits);
                    log("    fd.filter.maskBits = %d;\n", this.m_filter.maskBits);
                    log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex);
                    this.m_shape.Dump(log);
                    log("\n");
                    log("    fd.shape = shape;\n");
                    log("\n");
                    log("    bodies[%d].CreateFixture(fd);\n", bodyIndex);
                }
                // These support body activation/deactivation.
                CreateProxies() {
                    if (this.m_proxies.length !== 0) {
                        throw new Error();
                    }
                    // Create proxies in the broad-phase.
                    for (let i = 0; i < this.m_shape.GetChildCount(); ++i) {
                        this.m_proxies[i] = new b2FixtureProxy(this, i);
                    }
                }
                DestroyProxies() {
                    // Destroy proxies in the broad-phase.
                    for (const proxy of this.m_proxies) {
                        proxy.Reset();
                    }
                    this.m_proxies.length = 0;
                }
                TouchProxies() {
                    for (const proxy of this.m_proxies) {
                        proxy.Touch();
                    }
                }
                SynchronizeProxies(transform1, transform2) {
                    for (const proxy of this.m_proxies) {
                        proxy.Synchronize(transform1, transform2);
                    }
                }
            };
            exports_1("b2Fixture", b2Fixture);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJGaXh0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJGaXh0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUF5QkYsc0NBQXNDO1lBQ3RDLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFHRSxxRUFBcUU7b0JBQzlELGlCQUFZLEdBQVcsTUFBTSxDQUFDO29CQUVyQyxpRUFBaUU7b0JBQ2pFLHFDQUFxQztvQkFDOUIsYUFBUSxHQUFXLE1BQU0sQ0FBQztvQkFFakMsaUZBQWlGO29CQUNqRiwrRUFBK0U7b0JBQy9FLGdEQUFnRDtvQkFDekMsZUFBVSxHQUFXLENBQUMsQ0FBQztnQkFhaEMsQ0FBQztnQkFYUSxLQUFLO29CQUNWLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQWdCO29CQUMxQixtQ0FBbUM7b0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztvQkFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO29CQUN4QyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTtZQXpCd0IsZ0JBQU8sR0FBdUIsSUFBSSxRQUFRLEVBQUUsQ0FBQzs7WUFzRHRFLDJFQUEyRTtZQUMzRSwwRUFBMEU7WUFDMUUsZUFBQSxNQUFhLFlBQVk7Z0JBQXpCO29CQUtFLHdEQUF3RDtvQkFDakQsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFFNUIseURBQXlEO29CQUNsRCxhQUFRLEdBQVcsR0FBRyxDQUFDO29CQUU5Qiw0REFBNEQ7b0JBQ3JELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUUvQixt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