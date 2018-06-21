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
                    this.prev = null; ///< the previous contact edge in the body's contact list
                    this.next = null; ///< the next contact edge in the body's contact list
                    this.contact = contact;
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
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_manifold = new b2Collision_1.b2Manifold(); // TODO: readonly
                    this.m_toiCount = 0;
                    this.m_toi = 0;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_tangentSpeed = 0;
                    this.m_oldManifold = new b2Collision_1.b2Manifold(); // TODO: readonly
                    this.m_nodeA = new b2ContactEdge(this);
                    this.m_nodeB = new b2ContactEdge(this);
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
                    delete this.m_nodeA.contact; // = null;
                    this.m_nodeA.prev = null;
                    this.m_nodeA.next = null;
                    delete this.m_nodeA.other; // = null;
                    delete this.m_nodeB.contact; // = null;
                    this.m_nodeB.prev = null;
                    this.m_nodeB.next = null;
                    delete this.m_nodeB.other; // = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvQ29udGFjdHMvYjJDb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQVlGLDJGQUEyRjtJQUMzRix3Q0FBd0M7SUFDeEMsdUJBQThCLFNBQWlCLEVBQUUsU0FBaUI7UUFDaEUsT0FBTyxlQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O0lBRUQsOEZBQThGO0lBQzlGLGlEQUFpRDtJQUNqRCwwQkFBaUMsWUFBb0IsRUFBRSxZQUFvQjtRQUN6RSxPQUFPLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0lBQ25FLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRCxnQkFBQTtnQkFLRSxZQUFZLE9BQWtCO29CQUZ2QixTQUFJLEdBQXlCLElBQUksQ0FBQyxDQUFDLHlEQUF5RDtvQkFDNUYsU0FBSSxHQUF5QixJQUFJLENBQUMsQ0FBQyxxREFBcUQ7b0JBRTdGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUN6QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxZQUFBO2dCQWdDRTtvQkEvQk8saUJBQVksR0FBWSxLQUFLLENBQUMsQ0FBQywwREFBMEQ7b0JBQ3pGLG1CQUFjLEdBQVksS0FBSyxDQUFDLENBQUMscUNBQXFDO29CQUN0RSxrQkFBYSxHQUFZLEtBQUssQ0FBQyxDQUFDLDBDQUEwQztvQkFDMUUsaUJBQVksR0FBWSxLQUFLLENBQUMsQ0FBQyxzRUFBc0U7b0JBQ3JHLG9CQUFlLEdBQVksS0FBSyxDQUFDLENBQUMsdUNBQXVDO29CQUN6RSxjQUFTLEdBQVksS0FBSyxDQUFDLENBQUMseUNBQXlDO29CQUVyRSxXQUFNLEdBQXFCLElBQUksQ0FBQztvQkFDaEMsV0FBTSxH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