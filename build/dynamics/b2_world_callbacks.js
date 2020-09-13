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
System.register(["../common/b2_settings.js", "./b2_body.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_body_js_1, b2DestructionListener, b2ContactFilter, b2ContactImpulse, b2ContactListener, b2QueryCallback, b2RayCastCallback;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_body_js_1_1) {
                b2_body_js_1 = b2_body_js_1_1;
            }
        ],
        execute: function () {
            // #endif
            /// Joints and fixtures are destroyed when their associated
            /// body is destroyed. Implement this listener so that you
            /// may nullify references to these joints and shapes.
            b2DestructionListener = class b2DestructionListener {
                /// Called when any joint is about to be destroyed due
                /// to the destruction of one of its attached bodies.
                SayGoodbyeJoint(joint) { }
                /// Called when any fixture is about to be destroyed due
                /// to the destruction of its parent body.
                SayGoodbyeFixture(fixture) { }
                // #if B2_ENABLE_PARTICLE
                /// Called when any particle group is about to be destroyed.
                SayGoodbyeParticleGroup(group) { }
                /// Called when a particle is about to be destroyed.
                /// The index can be used in conjunction with
                /// b2ParticleSystem::GetUserDataBuffer() or
                /// b2ParticleSystem::GetParticleHandleFromIndex() to determine which
                /// particle has been destroyed.
                SayGoodbyeParticle(system, index) { }
            };
            exports_1("b2DestructionListener", b2DestructionListener);
            /// Implement this class to provide collision filtering. In other words, you can implement
            /// this class if you want finer control over contact creation.
            b2ContactFilter = class b2ContactFilter {
                /// Return true if contact calculations should be performed between these two shapes.
                /// @warning for performance reasons this is only called when the AABBs begin to overlap.
                ShouldCollide(fixtureA, fixtureB) {
                    const bodyA = fixtureA.GetBody();
                    const bodyB = fixtureB.GetBody();
                    // At least one body should be dynamic or kinematic.
                    if (bodyB.GetType() === b2_body_js_1.b2BodyType.b2_staticBody && bodyA.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                        return false;
                    }
                    // Does a joint prevent collision?
                    if (!bodyB.ShouldCollideConnected(bodyA)) {
                        return false;
                    }
                    const filter1 = fixtureA.GetFilterData();
                    const filter2 = fixtureB.GetFilterData();
                    if (filter1.groupIndex === filter2.groupIndex && filter1.groupIndex !== 0) {
                        return (filter1.groupIndex > 0);
                    }
                    const collide = (((filter1.maskBits & filter2.categoryBits) !== 0) && ((filter1.categoryBits & filter2.maskBits) !== 0));
                    return collide;
                }
                // #if B2_ENABLE_PARTICLE
                ShouldCollideFixtureParticle(fixture, system, index) {
                    return true;
                }
                ShouldCollideParticleParticle(system, indexA, indexB) {
                    return true;
                }
            };
            exports_1("b2ContactFilter", b2ContactFilter);
            // #endif
            b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
            /// Contact impulses for reporting. Impulses are used instead of forces because
            /// sub-step forces may approach infinity for rigid body collisions. These
            /// match up one-to-one with the contact points in b2Manifold.
            b2ContactImpulse = class b2ContactImpulse {
                constructor() {
                    this.normalImpulses = b2_settings_js_1.b2MakeNumberArray(b2_settings_js_1.b2_maxManifoldPoints);
                    this.tangentImpulses = b2_settings_js_1.b2MakeNumberArray(b2_settings_js_1.b2_maxManifoldPoints);
                    this.count = 0;
                }
            };
            exports_1("b2ContactImpulse", b2ContactImpulse);
            /// Implement this class to get contact information. You can use these results for
            /// things like sounds and game logic. You can also get contact results by
            /// traversing the contact lists after the time step. However, you might miss
            /// some contacts because continuous physics leads to sub-stepping.
            /// Additionally you may receive multiple callbacks for the same contact in a
            /// single time step.
            /// You should strive to make your callbacks efficient because there may be
            /// many callbacks per time step.
            /// @warning You cannot create/destroy Box2D entities inside these callbacks.
            b2ContactListener = class b2ContactListener {
                /// Called when two fixtures begin to touch.
                BeginContact(contact) { }
                /// Called when two fixtures cease to touch.
                EndContact(contact) { }
                // #if B2_ENABLE_PARTICLE
                BeginContactFixtureParticle(system, contact) { }
                EndContactFixtureParticle(system, contact) { }
                BeginContactParticleParticle(system, contact) { }
                EndContactParticleParticle(system, contact) { }
                // #endif
                /// This is called after a contact is updated. This allows you to inspect a
                /// contact before it goes to the solver. If you are careful, you can modify the
                /// contact manifold (e.g. disable contact).
                /// A copy of the old manifold is provided so that you can detect changes.
                /// Note: this is called only for awake bodies.
                /// Note: this is called even when the number of contact points is zero.
                /// Note: this is not called for sensors.
                /// Note: if you set the number of contact points to zero, you will not
                /// get an EndContact callback. However, you may get a BeginContact callback
                /// the next step.
                PreSolve(contact, oldManifold) { }
                /// This lets you inspect a contact after the solver is finished. This is useful
                /// for inspecting impulses.
                /// Note: the contact manifold does not include time of impact impulses, which can be
                /// arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
                /// in a separate data structure.
                /// Note: this is only called for contacts that are touching, solid, and awake.
                PostSolve(contact, impulse) { }
            };
            exports_1("b2ContactListener", b2ContactListener);
            b2ContactListener.b2_defaultListener = new b2ContactListener();
            /// Callback class for AABB queries.
            /// See b2World::Query
            b2QueryCallback = class b2QueryCallback {
                /// Called for each fixture found in the query AABB.
                /// @return false to terminate the query.
                ReportFixture(fixture) {
                    return true;
                }
                // #if B2_ENABLE_PARTICLE
                ReportParticle(system, index) {
                    return false;
                }
                ShouldQueryParticleSystem(system) {
                    return true;
                }
            };
            exports_1("b2QueryCallback", b2QueryCallback);
            /// Callback class for ray casts.
            /// See b2World::RayCast
            b2RayCastCallback = class b2RayCastCallback {
                /// Called for each fixture found in the query. You control how the ray cast
                /// proceeds by returning a float:
                /// return -1: ignore this fixture and continue
                /// return 0: terminate the ray cast
                /// return fraction: clip the ray to this point
                /// return 1: don't clip the ray and continue
                /// @param fixture the fixture hit by the ray
                /// @param point the point of initial intersection
                /// @param normal the normal vector at the point of intersection
                /// @return -1 to filter, 0 to terminate, fraction to clip the ray for
                /// closest hit, 1 to continue
                ReportFixture(fixture, point, normal, fraction) {
                    return fraction;
                }
                // #if B2_ENABLE_PARTICLE
                ReportParticle(system, index, point, normal, fraction) {
                    return 0;
                }
                ShouldQueryParticleSystem(system) {
                    return true;
                }
            };
            exports_1("b2RayCastCallback", b2RayCastCallback);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfd29ybGRfY2FsbGJhY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX3dvcmxkX2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBWUYsU0FBUztZQUVULDJEQUEyRDtZQUMzRCwwREFBMEQ7WUFDMUQsc0RBQXNEO1lBQ3RELHdCQUFBLE1BQWEscUJBQXFCO2dCQUNoQyxzREFBc0Q7Z0JBQ3RELHFEQUFxRDtnQkFDOUMsZUFBZSxDQUFDLEtBQWMsSUFBUyxDQUFDO2dCQUUvQyx3REFBd0Q7Z0JBQ3hELDBDQUEwQztnQkFDbkMsaUJBQWlCLENBQUMsT0FBa0IsSUFBUyxDQUFDO2dCQUVyRCx5QkFBeUI7Z0JBQ3pCLDREQUE0RDtnQkFDckQsdUJBQXVCLENBQUMsS0FBc0IsSUFBUyxDQUFDO2dCQUUvRCxvREFBb0Q7Z0JBQ3BELDZDQUE2QztnQkFDN0MsNENBQTRDO2dCQUM1QyxxRUFBcUU7Z0JBQ3JFLGdDQUFnQztnQkFDekIsa0JBQWtCLENBQUMsTUFBd0IsRUFBRSxLQUFhLElBQVMsQ0FBQzthQUU1RSxDQUFBOztZQUVELDBGQUEwRjtZQUMxRiwrREFBK0Q7WUFDL0Qsa0JBQUEsTUFBYSxlQUFlO2dCQUMxQixxRkFBcUY7Z0JBQ3JGLHlGQUF5RjtnQkFDbEYsYUFBYSxDQUFDLFFBQW1CLEVBQUUsUUFBbUI7b0JBQzNELE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDekMsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUV6QyxvREFBb0Q7b0JBQ3BELElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLHVCQUFVLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyx1QkFBVSxDQUFDLGFBQWEsRUFBRTt3QkFDaEcsT0FBTyxLQUFL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