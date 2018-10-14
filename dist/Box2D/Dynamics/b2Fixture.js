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
                constructor(fixture) {
                    this.aabb = new b2Collision_1.b2AABB();
                    this.childIndex = 0;
                    this.fixture = fixture;
                }
            };
            exports_1("b2FixtureProxy", b2FixtureProxy);
            /// A fixture is used to attach a shape to a body for collision detection. A fixture
            /// inherits its transform from its parent. Fixtures hold additional non-geometric data
            /// such as friction, collision filters, etc.
            /// Fixtures are created via b2Body::CreateFixture.
            /// @warning you cannot reuse fixtures.
            b2Fixture = class b2Fixture {
                constructor(def, body) {
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
                    const world = this.m_body.GetWorld();
                    if (world === null) {
                        return;
                    }
                    // Touch each proxy so that new pairs may be created
                    const broadPhase = world.m_contactManager.m_broadPhase;
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        broadPhase.TouchProxy(this.m_proxies[i].treeNode);
                    }
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
                // We need separation create/destroy functions from the constructor/destructor because
                // the destructor cannot access the allocator (no destructor arguments allowed by C++).
                Create(def) {
                    this.m_userData = def.userData;
                    this.m_friction = b2Settings_1.b2Maybe(def.friction, 0.2);
                    this.m_restitution = b2Settings_1.b2Maybe(def.restitution, 0);
                    // this.m_body = body;
                    this.m_next = null;
                    this.m_filter.Copy(b2Settings_1.b2Maybe(def.filter, b2Filter.DEFAULT));
                    this.m_isSensor = b2Settings_1.b2Maybe(def.isSensor, false);
                    // Reserve proxy space
                    // const childCount = m_shape->GetChildCount();
                    // m_proxies = (b2FixtureProxy*)allocator->Allocate(childCount * sizeof(b2FixtureProxy));
                    // for (int32 i = 0; i < childCount; ++i)
                    // {
                    //   m_proxies[i].fixture = NULL;
                    //   m_proxies[i].proxyId = b2BroadPhase::e_nullProxy;
                    // }
                    // this.m_proxies = b2FixtureProxy.MakeArray(this.m_shape.GetChildCount());
                    this.m_proxies = b2Settings_1.b2MakeArray(this.m_shape.GetChildCount(), (i) => new b2FixtureProxy(this));
                    this.m_proxyCount = 0;
                    this.m_density = b2Settings_1.b2Maybe(def.density, 0);
                }
                Destroy() {
                    // The proxies must be destroyed before calling this.
                    // DEBUG: b2Assert(this.m_proxyCount === 0);
                    // Free the proxy array.
                    // int32 childCount = m_shape->GetChildCount();
                    // allocator->Free(m_proxies, childCount * sizeof(b2FixtureProxy));
                    // m_proxies = NULL;
                    // this.m_shape = null;
                }
                // These support body activation/deactivation.
                CreateProxies(xf) {
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    // DEBUG: b2Assert(this.m_proxyCount === 0);
                    // Create proxies in the broad-phase.
                    this.m_proxyCount = this.m_shape.GetChildCount();
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i] = new b2FixtureProxy(this);
                        this.m_shape.ComputeAABB(proxy.aabb, xf, i);
                        proxy.treeNode = broadPhase.CreateProxy(proxy.aabb, proxy);
                        proxy.childIndex = i;
                    }
                }
                DestroyProxies() {
                    const broadPhase = this.m_body.m_world.m_contactManager.m_broadPhase;
                    // Destroy proxies in the broad-phase.
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        delete proxy.treeNode.userData;
                        broadPhase.DestroyProxy(proxy.treeNode);
                        delete proxy.treeNode;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJGaXh0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvYjJGaXh0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUEwQkYsc0NBQXNDO1lBQ3RDLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFHRSxxRUFBcUU7b0JBQzlELGlCQUFZLEdBQVcsTUFBTSxDQUFDO29CQUVyQyxpRUFBaUU7b0JBQ2pFLHFDQUFxQztvQkFDOUIsYUFBUSxHQUFXLE1BQU0sQ0FBQztvQkFFakMsaUZBQWlGO29CQUNqRiwrRUFBK0U7b0JBQy9FLGdEQUFnRDtvQkFDekMsZUFBVSxHQUFXLENBQUMsQ0FBQztnQkFhaEMsQ0FBQztnQkFYUSxLQUFLO29CQUNWLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQWdCO29CQUMxQixtQ0FBbUM7b0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztvQkFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO29CQUN4QyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTtZQXpCd0IsZ0JBQU8sR0FBdUIsSUFBSSxRQUFRLEVBQUUsQ0FBQzs7WUFzRHRFLDJFQUEyRTtZQUMzRSwwRUFBMEU7WUFDMUUsZUFBQSxNQUFhLFlBQVk7Z0JBQXpCO29CQUtFLHdEQUF3RDtvQkFDakQsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFFNUIseURBQXlEO29CQUNsRCxhQUFRLEdBQVcsR0FBRyxDQUFDO29CQUU5Qiw0REFBNEQ7b0JBQ3JELGdCQUFX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