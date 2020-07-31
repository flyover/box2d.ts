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
System.register(["../common/b2_settings.js", "../collision/b2_collision.js", "../collision/b2_shape.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_collision_js_1, b2_shape_js_1, b2Filter, b2FixtureDef, b2FixtureProxy, b2Fixture;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_collision_js_1_1) {
                b2_collision_js_1 = b2_collision_js_1_1;
            },
            function (b2_shape_js_1_1) {
                b2_shape_js_1 = b2_shape_js_1_1;
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
            exports_1("b2Filter", b2Filter);
            b2Filter.DEFAULT = new b2Filter();
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
                    this.aabb = new b2_collision_js_1.b2AABB();
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
                Synchronize(transform1, transform2, displacement) {
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
            exports_1("b2FixtureProxy", b2FixtureProxy);
            b2FixtureProxy.Synchronize_s_aabb1 = new b2_collision_js_1.b2AABB();
            b2FixtureProxy.Synchronize_s_aabb2 = new b2_collision_js_1.b2AABB();
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
                    this.m_userData = b2_settings_js_1.b2Maybe(def.userData, null);
                    this.m_friction = b2_settings_js_1.b2Maybe(def.friction, 0.2);
                    this.m_restitution = b2_settings_js_1.b2Maybe(def.restitution, 0);
                    this.m_filter.Copy(b2_settings_js_1.b2Maybe(def.filter, b2Filter.DEFAULT));
                    this.m_isSensor = b2_settings_js_1.b2Maybe(def.isSensor, false);
                    this.m_density = b2_settings_js_1.b2Maybe(def.density, 0);
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
                GetMassData(massData = new b2_shape_js_1.b2MassData()) {
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
                SynchronizeProxies(transform1, transform2, displacement) {
                    for (const proxy of this.m_proxies) {
                        proxy.Synchronize(transform1, transform2, displacement);
                    }
                }
            };
            exports_1("b2Fixture", b2Fixture);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZml4dHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyX2ZpeHR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXlCRixzQ0FBc0M7WUFDdEMsV0FBQSxNQUFhLFFBQVE7Z0JBQXJCO29CQUdFLHFFQUFxRTtvQkFDOUQsaUJBQVksR0FBVyxNQUFNLENBQUM7b0JBRXJDLGlFQUFpRTtvQkFDakUscUNBQXFDO29CQUM5QixhQUFRLEdBQVcsTUFBTSxDQUFDO29CQUVqQyxpRkFBaUY7b0JBQ2pGLCtFQUErRTtvQkFDL0UsZ0RBQWdEO29CQUN6QyxlQUFVLEdBQVcsQ0FBQyxDQUFDO2dCQWFoQyxDQUFDO2dCQVhRLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBZ0I7b0JBQzFCLG1DQUFtQztvQkFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO29CQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7b0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFBOztZQXpCd0IsZ0JBQU8sR0FBdUIsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQXNEdEUsMkVBQTJFO1lBQzNFLDBFQUEwRTtZQUMxRSxlQUFBLE1BQWEsWUFBWTtnQkFBekI7b0JBS0Usd0RBQXdEO29CQUNqRCxhQUFRLEdBQVEsSUFBSSxDQUFDO29CQUU1Qix5REFBeUQ7b0JBQ2xELGFBQVEsR0FBVyxHQUFHLENBQUM7b0JBRTlCLDREQUE0RDtvQkFDckQsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBRS9CLG1D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