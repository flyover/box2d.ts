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
    var box2d, testbed, TestCCD;
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
            TestCCD = class TestCCD extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const vertices = [];
                        vertices[0] = new box2d.b2Vec2(-30.0, 0.0);
                        vertices[1] = new box2d.b2Vec2(30.0, 0.0);
                        vertices[2] = new box2d.b2Vec2(30.0, 40.0);
                        vertices[3] = new box2d.b2Vec2(-30.0, 40.0);
                        const shape = new box2d.b2ChainShape();
                        shape.CreateLoop(vertices);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Always on, even if default is off
                    this.m_world.SetContinuousPhysics(true);
                    const fd = new box2d.b2FixtureDef();
                    // These values are used for all the parts of the 'basket'
                    fd.density = 4.0;
                    fd.restitution = 1.4;
                    // Create 'basket'
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.bullet = true;
                        bd.position.Set(15.0, 5.0);
                        const body = this.m_world.CreateBody(bd);
                        const sd_bottom = new box2d.b2PolygonShape();
                        sd_bottom.SetAsBox(4.5, 0.45);
                        fd.shape = sd_bottom;
                        body.CreateFixture(fd);
                        const sd_left = new box2d.b2PolygonShape();
                        sd_left.SetAsBox(0.45, 8.1, new box2d.b2Vec2(-4.35, 7.05), 0.2);
                        fd.shape = sd_left;
                        body.CreateFixture(fd);
                        const sd_right = new box2d.b2PolygonShape();
                        sd_right.SetAsBox(0.45, 8.1, new box2d.b2Vec2(4.35, 7.05), -0.2);
                        fd.shape = sd_right;
                        body.CreateFixture(fd);
                    }
                    // add some small circles for effect
                    for (let i = 0; i < 5; i++) {
                        const cd = new box2d.b2CircleShape((Math.random() * 1.0 + 0.5));
                        fd.shape = cd;
                        fd.friction = 0.3;
                        fd.density = 1.0;
                        fd.restitution = 1.1;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.bullet = true;
                        bd.position.Set((Math.random() * 30.0 - 25.0), (Math.random() * 32.0 + 2.0));
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(fd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new TestCCD();
                }
            };
            exports_1("TestCCD", TestCCD);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdENDRC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvVGVzdENDRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsVUFBQSxhQUFxQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUN2QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQzt3QkFDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVELG9DQUFvQztvQkFDcEMsSUFBSSxDQUFD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