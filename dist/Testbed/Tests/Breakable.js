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
            Breakable.e_count = 7;
            exports_1("Breakable", Breakable);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJlYWthYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9CcmVha2FibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsZUFBdUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFhekM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBVk0sZUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUN6QyxzQkFBaUIsR0FBRyxDQUFDLENBQUM7b0JBQ2IsYUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN0QyxhQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBRy9DLFlBQU8sR0FBRyxLQUFLLENBQUM7b0JBQ2hCLFlBQU8sR0FBRyxLQUFLLENBQUM7b0JBS3JCLGNBQWM7b0JBQ2Q7d0JBQ0UsbUJBQW1CO3dCQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsZ0JBQWdCO3dCQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MscUJBQXFCO3dCQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQseUJBQXlCO29CQUN6Qjt3QkFD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