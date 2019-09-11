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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "../../Collision/b2Collision", "../../Collision/b2TimeOfImpact"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2TimeOfImpact_1, b2ContactEdge, b2Contact;
    var __moduleName = context_1 && context_1.id;
    /// Friction mixing law. The idea is to allow either fixture to drive the friction to zero.
    /// For example, anything slides on ice.
    function b2MixFriction(friction1, friction2) {
        return b2Math_1.b2Sqrt(friction1 * friction2);
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
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
                b2Collision_2 = b2Collision_1_1;
            },
            function (b2TimeOfImpact_1_1) {
                b2TimeOfImpact_1 = b2TimeOfImpact_1_1;
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
                    this.m_manifold = new b2Collision_1.b2Manifold(); // TODO: readonly
                    this.m_toiCount = 0;
                    this.m_toi = 0;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_tangentSpeed = 0;
                    this.m_oldManifold = new b2Collision_1.b2Manifold(); // TODO: readonly
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
                        touching = b2Collision_2.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
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
                    input.tMax = b2Settings_1.b2_linearSlop;
                    const output = b2Contact.ComputeTOI_s_output;
                    b2TimeOfImpact_1.b2TimeOfImpact(output, input);
                    return output.t;
                }
            };
            exports_1("b2Contact", b2Contact);
            b2Contact.ComputeTOI_s_input = new b2TimeOfImpact_1.b2TOIInput();
            b2Contact.ComputeTOI_s_output = new b2TimeOfImpact_1.b2TOIOutput();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQVlGLDJGQUEyRjtJQUMzRix3Q0FBd0M7SUFDeEMsU0FBZ0IsYUFBYSxDQUFDLFNBQWlCLEVBQUUsU0FBaUI7UUFDaEUsT0FBTyxlQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O0lBRUQsOEZBQThGO0lBQzlGLGlEQUFpRDtJQUNqRCxTQUFnQixnQkFBZ0IsQ0FBQyxZQUFvQixFQUFFLFlBQW9CO1FBQ3pFLE9BQU8sWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDbkUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUVELGdCQUFBLE1BQWEsYUFBYTtnQkFheEIsWUFBWSxPQUFrQjtvQkFadEIsV0FBTSxHQUFrQixJQUFJLENBQUMsQ0FBQyxzREFBc0Q7b0JBVXJGLFNBQUksR0FBeUIsSUFBSSxDQUFDLENBQUMseURBQXlEO29CQUM1RixTQUFJLEdBQXlCLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtvQkFFN0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ3pCLENBQUM7Z0JBYkQsSUFBVyxLQUFLO29CQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUNoRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsSUFBVyxLQUFLLENBQUMsS0FBYTtvQkFDNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FB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