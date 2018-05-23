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
    var __moduleName = context_1 && context_1.id;
    /// Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
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
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2TimeOfImpact_1, b2ContactEdge, b2Contact;
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
                constructor() {
                    this.other = null; ///< provides quick access to the other body attached.
                    this.contact = null; ///< the contact
                    this.prev = null; ///< the previous contact edge in the body's contact list
                    this.next = null; ///< the next contact edge in the body's contact list
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
                    this.m_nodeA = new b2ContactEdge();
                    this.m_nodeB = new b2ContactEdge();
                    this.m_fixtureA = null;
                    this.m_fixtureB = null;
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_manifold = new b2Collision_1.b2Manifold();
                    this.m_toiCount = 0;
                    this.m_toi = 0;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_tangentSpeed = 0;
                    this.m_oldManifold = new b2Collision_1.b2Manifold();
                }
                GetManifold() {
                    return this.m_manifold;
                }
                GetWorldManifold(worldManifold) {
                    const bodyA = this.m_fixtureA.GetBody();
                    const bodyB = this.m_fixtureB.GetBody();
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
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
                GetFixtureB() {
                    return this.m_fixtureB;
                }
                GetChildIndexB() {
                    return this.m_indexB;
                }
                Evaluate(manifold, xfA, xfB) {
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
                    this.m_nodeA.contact = null;
                    this.m_nodeA.prev = null;
                    this.m_nodeA.next = null;
                    this.m_nodeA.other = null;
                    this.m_nodeB.contact = null;
                    this.m_nodeB.prev = null;
                    this.m_nodeB.next = null;
                    this.m_nodeB.other = null;
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
                    ///const aabbOverlap = b2TestOverlapAABB(this.m_fixtureA.GetAABB(0), this.m_fixtureB.GetAABB(0));
                    // Is this contact a sensor?
                    if (sensor) {
                        ///if (aabbOverlap)
                        ///{
                        const shapeA = this.m_fixtureA.GetShape();
                        const shapeB = this.m_fixtureB.GetShape();
                        touching = b2Collision_2.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
                        ///}
                        // Sensors don't generate manifolds.
                        this.m_manifold.pointCount = 0;
                    }
                    else {
                        ///if (aabbOverlap)
                        ///{
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
                        ///}
                        ///else
                        ///{
                        ///  this.m_manifold.pointCount = 0;
                        ///}
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
                    input.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
                    input.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
                    input.sweepA.Copy(sweepA);
                    input.sweepB.Copy(sweepB);
                    input.tMax = b2Settings_1.b2_linearSlop;
                    const output = b2Contact.ComputeTOI_s_output;
                    b2TimeOfImpact_1.b2TimeOfImpact(output, input);
                    return output.t;
                }
            };
            b2Contact.ComputeTOI_s_input = new b2TimeOfImpact_1.b2TOIInput();
            b2Contact.ComputeTOI_s_output = new b2TimeOfImpact_1.b2TOIOutput();
            exports_1("b2Contact", b2Contact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7O0lBWUYsOEZBQThGO0lBQzlGLHdDQUF3QztJQUN4Qyx1QkFBOEIsU0FBaUIsRUFBRSxTQUFpQjtRQUNoRSxPQUFPLGVBQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7SUFFRCw4RkFBOEY7SUFDOUYsaURBQWlEO0lBQ2pELDBCQUFpQyxZQUFvQixFQUFFLFlBQW9CO1FBQ3pFLE9BQU8sWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDbkUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRCxnQkFBQTtnQkFBQTtvQkFDUyxVQUFLLEdBQWdCLElBQUksQ0FBQyxDQUFDLHNEQUFzRDtvQkFDakYsWUFBTyxHQUFtQixJQUFJLENBQUMsQ0FBQyxnQkFBZ0I7b0JBQ2hELFNBQUksR0FBdUIsSUFBSSxDQUFDLENBQUMseURBQXlEO29CQUMxRixTQUFJLEdBQXVCLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtnQkFDL0YsQ0FBQzthQUFBLENBQUE7O1lBRUQsWUFBQTtnQkFBQTtvQkFDUyxpQkFBWSxHQUFZLEtBQUssQ0FBQyxDQUFDLDBEQUEwRDtvQkFDekYsbUJBQWMsR0FBWSxLQUFLLENBQUMsQ0FBQyxxQ0FBcUM7b0JBQ3RFLGtCQUFhLEdBQVksS0FBSyxDQUFDLENBQUMsMENBQTBDO29CQUMxRSxpQkFBWSxHQUFZLEtBQUssQ0FBQyxDQUFDLHNFQUFzRTtvQkFDckcsb0JBQWUsR0FBWSxLQUFLLENBQUMsQ0FBQyx1Q0FBdUM7b0JBQ3pFLGNBQVMsR0FBWSxLQUFLLENBQUMsQ0FBQyx5Q0FBeUM7b0JBRXJFLFdBQU0sR0FBbUIsSUFBSSxDQUFDO29CQUM5QixXQUFNLEdBQW1CLElB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