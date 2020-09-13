/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Breakable;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Breakable = class Breakable extends testbed.Test {
                constructor() {
                    super();
                    this.m_velocity = new b2.Vec2();
                    this.m_angularVelocity = 0;
                    this.m_shape1 = new b2.PolygonShape();
                    this.m_shape2 = new b2.PolygonShape();
                    this.m_piece1 = null;
                    this.m_piece2 = null;
                    this.m_broke = false;
                    this.m_break = false;
                    // Ground body
                    {
                        /*b2.BodyDef*/
                        const bd = new b2.BodyDef();
                        /*b2.Body*/
                        const ground = this.m_world.CreateBody(bd);
                        /*b2.EdgeShape*/
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Breakable dynamic body
                    {
                        /*b2.BodyDef*/
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 40.0);
                        bd.angle = 0.25 * b2.pi;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        this.m_shape1 = new b2.PolygonShape();
                        this.m_shape1.SetAsBox(0.5, 0.5, new b2.Vec2(-0.5, 0.0), 0.0);
                        this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);
                        this.m_shape2 = new b2.PolygonShape();
                        this.m_shape2.SetAsBox(0.5, 0.5, new b2.Vec2(0.5, 0.0), 0.0);
                        this.m_piece2 = this.m_body1.CreateFixture(this.m_shape2, 1.0);
                    }
                }
                PostSolve(contact, impulse) {
                    if (this.m_broke) {
                        // The body already broke.
                        return;
                    }
                    // Should the body break?
                    /*int*/
                    const count = contact.GetManifold().pointCount;
                    /*float32*/
                    let maxImpulse = 0.0;
                    for (let i = 0; i < count; ++i) {
                        maxImpulse = b2.Max(maxImpulse, impulse.normalImpulses[i]);
                    }
                    if (maxImpulse > 40.0) {
                        // Flag the body for breaking.
                        this.m_break = true;
                    }
                }
                Break() {
                    if (this.m_piece1 === null) {
                        return;
                    }
                    if (this.m_piece2 === null) {
                        return;
                    }
                    // Create two bodies from one.
                    const body1 = this.m_piece1.GetBody();
                    const center = body1.GetWorldCenter();
                    body1.DestroyFixture(this.m_piece2);
                    this.m_piece2 = null;
                    /*b2.BodyDef*/
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(body1.GetPosition());
                    bd.angle = body1.GetAngle();
                    /*b2.Body*/
                    const body2 = this.m_world.CreateBody(bd);
                    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);
                    // Compute consistent velocities for new bodies based on
                    // cached velocity.
                    /*b2.Vec2*/
                    const center1 = body1.GetWorldCenter();
                    /*b2.Vec2*/
                    const center2 = body2.GetWorldCenter();
                    /*b2.Vec2*/
                    const velocity1 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center1, center, b2.Vec2.s_t0), new b2.Vec2());
                    /*b2.Vec2*/
                    const velocity2 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center2, center, b2.Vec2.s_t0), new b2.Vec2());
                    body1.SetAngularVelocity(this.m_angularVelocity);
                    body1.SetLinearVelocity(velocity1);
                    body2.SetAngularVelocity(this.m_angularVelocity);
                    body2.SetLinearVelocity(velocity2);
                }
                Step(settings) {
                    if (this.m_break) {
                        this.Break();
                        this.m_broke = true;
                        this.m_break = false;
                    }
                    // Cache velocities to improve movement on breakage.
                    if (!this.m_broke) {
                        this.m_velocity.Copy(this.m_body1.GetLinearVelocity());
                        this.m_angularVelocity = this.m_body1.GetAngularVelocity();
                    }
                    super.Step(settings);
                }
                static Create() {
                    return new Breakable();
                }
            };
            exports_1("Breakable", Breakable);
            Breakable.e_count = 7;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWthYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvYnJlYWthYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixZQUFBLE1BQWEsU0FBVSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQWF6QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFWTSxlQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BDLHNCQUFpQixHQUFHLENBQUMsQ0FBQztvQkFDYixhQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ2pDLGFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUMsYUFBUSxHQUFzQixJQUFJLENBQUM7b0JBQ25DLGFBQVEsR0FBc0IsSUFBSSxDQUFDO29CQUNuQyxZQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNoQixZQUFPLEdBQUcsS0FBSyxDQUFDO29CQUtyQixjQUFjO29CQUNkO3dCQUNFLGNBQWM7d0JBQ2QsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQzVCLFdBQVc7d0JBQ1gsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLGdCQUFnQjt3QkFDaEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FB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