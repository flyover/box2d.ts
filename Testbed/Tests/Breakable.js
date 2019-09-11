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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Breakable;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Breakable = class Breakable extends testbed.Test {
                constructor() {
                    super();
                    this.m_velocity = new box2d.b2Vec2();
                    this.m_angularVelocity = 0;
                    this.m_shape1 = new box2d.b2PolygonShape();
                    this.m_shape2 = new box2d.b2PolygonShape();
                    this.m_broke = false;
                    this.m_break = false;
                    // Ground body
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        /*box2d.b2Body*/
                        const ground = this.m_world.CreateBody(bd);
                        /*box2d.b2EdgeShape*/
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Breakable dynamic body
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 40.0);
                        bd.angle = 0.25 * box2d.b2_pi;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        this.m_shape1 = new box2d.b2PolygonShape();
                        this.m_shape1.SetAsBox(0.5, 0.5, new box2d.b2Vec2(-0.5, 0.0), 0.0);
                        this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);
                        this.m_shape2 = new box2d.b2PolygonShape();
                        this.m_shape2.SetAsBox(0.5, 0.5, new box2d.b2Vec2(0.5, 0.0), 0.0);
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
                        maxImpulse = box2d.b2Max(maxImpulse, impulse.normalImpulses[i]);
                    }
                    if (maxImpulse > 40.0) {
                        // Flag the body for breaking.
                        this.m_break = true;
                    }
                }
                Break() {
                    // Create two bodies from one.
                    /*box2d.b2Body*/
                    const body1 = this.m_piece1.GetBody();
                    /*box2d.b2Vec2*/
                    const center = body1.GetWorldCenter();
                    body1.DestroyFixture(this.m_piece2);
                    delete this.m_piece2; // = null;
                    /*box2d.b2BodyDef*/
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    bd.position.Copy(body1.GetPosition());
                    bd.angle = body1.GetAngle();
                    /*box2d.b2Body*/
                    const body2 = this.m_world.CreateBody(bd);
                    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);
                    // Compute consistent velocities for new bodies based on
                    // cached velocity.
                    /*box2d.b2Vec2*/
                    const center1 = body1.GetWorldCenter();
                    /*box2d.b2Vec2*/
                    const center2 = body2.GetWorldCenter();
                    /*box2d.b2Vec2*/
                    const velocity1 = box2d.b2Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, box2d.b2Vec2.SubVV(center1, center, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                    /*box2d.b2Vec2*/
                    const velocity2 = box2d.b2Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, box2d.b2Vec2.SubVV(center2, center, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJlYWthYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQnJlYWthYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixZQUFBLE1BQWEsU0FBVSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQWF6QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFWTSxlQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3pDLHNCQUFpQixHQUFHLENBQUMsQ0FBQztvQkFDYixhQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3RDLGFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFHL0MsWUFBTyxHQUFHLEtBQUssQ0FBQztvQkFDaEIsWUFBTyxHQUFHLEtBQUssQ0FBQztvQkFLckIsY0FBYztvQkFDZDt3QkFDRSxtQkFBbUI7d0JBQ25CLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxnQkFBZ0I7d0JBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxxQkFBcUI7d0JBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRCx5QkFBeUI7b0JBQ3pCO3dCQUNFLG1CQUFtQjt3QkFDbkIsTUFB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