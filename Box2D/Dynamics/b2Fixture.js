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
                    this._treeNode = null;
                    this.fixture = fixture;
                    this.childIndex = childIndex;
                }
                get treeNode() {
                    if (this._treeNode === null) {
                        throw new Error();
                    }
                    return this._treeNode;
                }
                set treeNode(value) {
                    if (this._treeNode !== null) {
                        throw new Error();
                    }
                    this._treeNode = value;
                }
                Reset() {
                    this._treeNode = null;
                }
            };
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
                    this.m_proxyCount = 0;
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
                CreateProxies(xf) {
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    // DEBUG: b2Assert(this.m_proxyCount === 0);
                    // Create proxies in the broad-phase.
                    this.m_proxyCount = this.m_shape.GetChildCount();
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i] = new b2FixtureProxy(this, i);
                        this.m_shape.ComputeAABB(proxy.aabb, xf, i);
                        proxy.treeNode = broadPhase.CreateProxy(proxy.aabb, proxy);
                    }
                }
                DestroyProxies() {
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    // Destroy proxies in the broad-phase.
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        proxy.treeNode.Reset();
                        broadPhase.DestroyProxy(proxy.treeNode);
                        proxy.Reset();
                    }
                    this.m_proxyCount = 0;
                }
                TouchProxies() {
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    const proxyCount = this.m_proxyCount;
                    for (let i = 0; i < proxyCount; ++i) {
                        broadPhase.TouchProxy(this.m_proxies[i].treeNode);
                    }
                }
                Synchronize(transform1, transform2) {
                    if (this.m_proxyCount === 0) {
                        return;
                    }
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        // Compute an AABB that covers the swept shape (may miss some rotation effect).
                        const aabb1 = b2Fixture.Synchronize_s_aabb1;
                        const aabb2 = b2Fixture.Synchronize_s_aabb2;
                        this.m_shape.ComputeAABB(aabb1, transform1, i);
                        this.m_shape.ComputeAABB(aabb2, transform2, i);
                        proxy.aabb.Combine2(aabb1, aabb2);
                        const displacement = b2Math_1.b2Vec2.SubVV(transform2.p, transform1.p, b2Fixture.Synchronize_s_displacement);
                        broadPhase.MoveProxy(proxy.treeNode, proxy.aabb, displacement);
                    }
                }
            };
            b2Fixture.Synchronize_s_aabb1 = new b2Collision_1.b2AABB();
            b2Fixture.Synchronize_s_aabb2 = new b2Collision_1.b2AABB();
            b2Fixture.Synchronize_s_displacement = new b2Math_1.b2Vec2();
            exports_1("b2Fixture", b2Fixture);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJGaXh0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJGaXh0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUEwQkYsc0NBQXNDO1lBQ3RDLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFHRSxxRUFBcUU7b0JBQzlELGlCQUFZLEdBQVcsTUFBTSxDQUFDO29CQUVyQyxpRUFBaUU7b0JBQ2pFLHFDQUFxQztvQkFDOUIsYUFBUSxHQUFXLE1BQU0sQ0FBQztvQkFFakMsaUZBQWlGO29CQUNqRiwrRUFBK0U7b0JBQy9FLGdEQUFnRDtvQkFDekMsZUFBVSxHQUFXLENBQUMsQ0FBQztnQkFhaEMsQ0FBQztnQkFYUSxLQUFLO29CQUNWLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQWdCO29CQUMxQixtQ0FBbUM7b0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztvQkFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO29CQUN4QyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTtZQXpCd0IsZ0JBQU8sR0FBdUIsSUFBSSxRQUFRLEVBQUUsQ0FBQzs7WUFzRHRFLDJFQUEyRTtZQUMzRSwwRUFBMEU7WUFDMUUsZUFBQSxNQUFhLFlBQVk7Z0JBQXpCO29CQUtFLHdEQUF3RDtvQkFDakQsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFFNUIseURBQXlEO29CQUNsRCxhQUFRLEdBQVcsR0FBRyxDQUFDO29CQUU5Qiw0REFBNEQ7b0JBQ3JELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUUvQixt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