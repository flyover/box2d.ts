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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "../collision/b2_collision.js", "../collision/b2_time_of_impact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_collision_js_1, b2_collision_js_2, b2_time_of_impact_js_1, b2ContactEdge, b2Contact;
    var __moduleName = context_1 && context_1.id;
    /// Friction mixing law. The idea is to allow either fixture to drive the friction to zero.
    /// For example, anything slides on ice.
    function b2MixFriction(friction1, friction2) {
        return b2_math_js_1.b2Sqrt(friction1 * friction2);
    }
    exports_1("b2MixFriction", b2MixFriction);
    /// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
    /// For example, a superball bounces on anything.
    function b2MixRestitution(restitution1, restitution2) {
        return restitution1 > restitution2 ? restitution1 : restitution2;
    }
    exports_1("b2MixRestitution", b2MixRestitution);
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_collision_js_1_1) {
                b2_collision_js_1 = b2_collision_js_1_1;
                b2_collision_js_2 = b2_collision_js_1_1;
            },
            function (b2_time_of_impact_js_1_1) {
                b2_time_of_impact_js_1 = b2_time_of_impact_js_1_1;
            }
        ],
        execute: function () {
            b2ContactEdge = class b2ContactEdge {
                constructor(contact) {
                    this._other = null; ///< provides quick access to the other body attached.
                    this.prev = null; ///< the previous contact edge in the body's contact list
                    this.next = null; ///< the next contact edge in the body's contact list
                    this.contact = contact;
                }
                get other() {
                    if (this._other === null) {
                        throw new Error();
                    }
                    return this._other;
                }
                set other(value) {
                    if (this._other !== null) {
                        throw new Error();
                    }
                    this._other = value;
                }
                Reset() {
                    this._other = null;
                    this.prev = null;
                    this.next = null;
                }
            };
            exports_1("b2ContactEdge", b2ContactEdge);
            b2Contact = class b2Contact {
                constructor() {
                    this.m_islandFlag = false; /// Used when crawling contact graph when forming islands.
                    this.m_touchingFlag = false; /// Set when the shapes are touching.
                    this.m_enabledFlag = false; /// This contact can be disabled (by user)
                    this.m_filterFlag = false; /// This contact needs filtering because a fixture filter was changed.
                    this.m_bulletHitFlag = false; /// This bullet contact had a TOI event
                    this.m_toiFlag = false; /// This contact has a valid TOI in m_toi
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_nodeA = new b2ContactEdge(this);
                    this.m_nodeB = new b2ContactEdge(this);
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_manifold = new b2_collision_js_1.b2Manifold(); // TODO: readonly
                    this.m_toiCount = 0;
                    this.m_toi = 0;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_tangentSpeed = 0;
                    this.m_oldManifold = new b2_collision_js_1.b2Manifold(); // TODO: readonly
                }
                GetManifold() {
                    return this.m_manifold;
                }
                GetWorldManifold(worldManifold) {
                    const bodyA = this.m_fixtureA.GetBody();
                    const bodyB = this.m_fixtureB.GetBody();
                    const shapeA = this.GetShapeA();
                    const shapeB = this.GetShapeB();
                    worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
                }
                IsTouching() {
                    return this.m_touchingFlag;
                }
                SetEnabled(flag) {
                    this.m_enabledFlag = flag;
                }
                IsEnabled() {
                    return this.m_enabledFlag;
                }
                GetNext() {
                    return this.m_next;
                }
                GetFixtureA() {
                    return this.m_fixtureA;
                }
                GetChildIndexA() {
                    return this.m_indexA;
                }
                GetShapeA() {
                    return this.m_fixtureA.GetShape();
                }
                GetFixtureB() {
                    return this.m_fixtureB;
                }
                GetChildIndexB() {
                    return this.m_indexB;
                }
                GetShapeB() {
                    return this.m_fixtureB.GetShape();
                }
                FlagForFiltering() {
                    this.m_filterFlag = true;
                }
                SetFriction(friction) {
                    this.m_friction = friction;
                }
                GetFriction() {
                    return this.m_friction;
                }
                ResetFriction() {
                    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
                }
                SetRestitution(restitution) {
                    this.m_restitution = restitution;
                }
                GetRestitution() {
                    return this.m_restitution;
                }
                ResetRestitution() {
                    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
                }
                SetTangentSpeed(speed) {
                    this.m_tangentSpeed = speed;
                }
                GetTangentSpeed() {
                    return this.m_tangentSpeed;
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    this.m_islandFlag = false;
                    this.m_touchingFlag = false;
                    this.m_enabledFlag = true;
                    this.m_filterFlag = false;
                    this.m_bulletHitFlag = false;
                    this.m_toiFlag = false;
                    this.m_fixtureA = fixtureA;
                    this.m_fixtureB = fixtureB;
                    this.m_indexA = indexA;
                    this.m_indexB = indexB;
                    this.m_manifold.pointCount = 0;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_nodeA.Reset();
                    this.m_nodeB.Reset();
                    this.m_toiCount = 0;
                    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
                    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
                }
                Update(listener) {
                    const tManifold = this.m_oldManifold;
                    this.m_oldManifold = this.m_manifold;
                    this.m_manifold = tManifold;
                    // Re-enable this contact.
                    this.m_enabledFlag = true;
                    let touching = false;
                    const wasTouching = this.m_touchingFlag;
                    const sensorA = this.m_fixtureA.IsSensor();
                    const sensorB = this.m_fixtureB.IsSensor();
                    const sensor = sensorA || sensorB;
                    const bodyA = this.m_fixtureA.GetBody();
                    const bodyB = this.m_fixtureB.GetBody();
                    const xfA = bodyA.GetTransform();
                    const xfB = bodyB.GetTransform();
                    // Is this contact a sensor?
                    if (sensor) {
                        const shapeA = this.GetShapeA();
                        const shapeB = this.GetShapeB();
                        touching = b2_collision_js_2.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
                        // Sensors don't generate manifolds.
                        this.m_manifold.pointCount = 0;
                    }
                    else {
                        this.Evaluate(this.m_manifold, xfA, xfB);
                        touching = this.m_manifold.pointCount > 0;
                        // Match old contact ids to new contact ids and copy the
                        // stored impulses to warm start the solver.
                        for (let i = 0; i < this.m_manifold.pointCount; ++i) {
                            const mp2 = this.m_manifold.points[i];
                            mp2.normalImpulse = 0;
                            mp2.tangentImpulse = 0;
                            const id2 = mp2.id;
                            for (let j = 0; j < this.m_oldManifold.pointCount; ++j) {
                                const mp1 = this.m_oldManifold.points[j];
                                if (mp1.id.key === id2.key) {
                                    mp2.normalImpulse = mp1.normalImpulse;
                                    mp2.tangentImpulse = mp1.tangentImpulse;
                                    break;
                                }
                            }
                        }
                        if (touching !== wasTouching) {
                            bodyA.SetAwake(true);
                            bodyB.SetAwake(true);
                        }
                    }
                    this.m_touchingFlag = touching;
                    if (!wasTouching && touching && listener) {
                        listener.BeginContact(this);
                    }
                    if (wasTouching && !touching && listener) {
                        listener.EndContact(this);
                    }
                    if (!sensor && touching && listener) {
                        listener.PreSolve(this, this.m_oldManifold);
                    }
                }
                ComputeTOI(sweepA, sweepB) {
                    const input = b2Contact.ComputeTOI_s_input;
                    input.proxyA.SetShape(this.GetShapeA(), this.m_indexA);
                    input.proxyB.SetShape(this.GetShapeB(), this.m_indexB);
                    input.sweepA.Copy(sweepA);
                    input.sweepB.Copy(sweepB);
                    input.tMax = b2_settings_js_1.b2_linearSlop;
                    const output = b2Contact.ComputeTOI_s_output;
                    b2_time_of_impact_js_1.b2TimeOfImpact(output, input);
                    return output.t;
                }
            };
            exports_1("b2Contact", b2Contact);
            b2Contact.ComputeTOI_s_input = new b2_time_of_impact_js_1.b2TOIInput();
            b2Contact.ComputeTOI_s_output = new b2_time_of_impact_js_1.b2TOIOutput();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9keW5hbWljcy9iMl9jb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQVlGLDJGQUEyRjtJQUMzRix3Q0FBd0M7SUFDeEMsU0FBZ0IsYUFBYSxDQUFDLFNBQWlCLEVBQUUsU0FBaUI7UUFDaEUsT0FBTyxtQkFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztJQUN2QyxDQUFDOztJQUVELDhGQUE4RjtJQUM5RixpREFBaUQ7SUFDakQsU0FBZ0IsZ0JBQWdCLENBQUMsWUFBb0IsRUFBRSxZQUFvQjtRQUN6RSxPQUFPLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0lBQ25FLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRCxnQkFBQSxNQUFhLGFBQWE7Z0JBYXhCLFlBQVksT0FBa0I7b0JBWnRCLFdBQU0sR0FBa0IsSUFBSSxDQUFDLENBQUMsc0RBQXNEO29CQVVyRixTQUFJLEdBQXlCLElBQUksQ0FBQyxDQUFDLHlEQUF5RDtvQkFDNUYsU0FBSSxHQUF5QixJQUFJLENBQUMsQ0FBQyxxREFBcUQ7b0JBRTdGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUN6QixDQUFDO2dCQWJELElBQVcsS0FBSztvQkFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFDaEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUNELElBQVcsS0FBSyxDQUFDLEtBQWE7b0JBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUNoRCxJ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