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
    var box2d, testbed, TestStack;
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
            TestStack = class TestStack extends testbed.Test {
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
                    // Add bodies
                    const bd = new box2d.b2BodyDef();
                    const fd = new box2d.b2FixtureDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    //bd.isBullet = true;
                    const polygon = new box2d.b2PolygonShape();
                    fd.shape = polygon;
                    fd.density = 1.0;
                    fd.friction = 0.5;
                    fd.restitution = 0.1;
                    polygon.SetAsBox(1.0, 1.0);
                    // Create 3 stacks
                    for (let i = 0; i < 10; ++i) {
                        bd.position.Set((0.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
                        this.m_world.CreateBody(bd).CreateFixture(fd);
                    }
                    for (let i = 0; i < 10; ++i) {
                        bd.position.Set((10.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
                        this.m_world.CreateBody(bd).CreateFixture(fd);
                    }
                    for (let i = 0; i < 10; ++i) {
                        bd.position.Set((20.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
                        this.m_world.CreateBody(bd).CreateFixture(fd);
                    }
                    // Create ramp
                    bd.type = box2d.b2BodyType.b2_staticBody;
                    bd.position.Set(0.0, 0.0);
                    const vxs = [
                        new box2d.b2Vec2(-30.0, 0.0),
                        new box2d.b2Vec2(-10.0, 0.0),
                        new box2d.b2Vec2(-30.0, 10.0),
                    ];
                    polygon.Set(vxs, vxs.length);
                    fd.density = 0;
                    this.m_world.CreateBody(bd).CreateFixture(fd);
                    // Create ball
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    bd.position.Set(-25.0, 20.0);
                    fd.shape = new box2d.b2CircleShape(4.0);
                    fd.density = 2;
                    fd.restitution = 0.2;
                    fd.friction = 0.5;
                    this.m_world.CreateBody(bd).CreateFixture(fd);
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new TestStack();
                }
            };
            exports_1("TestStack", TestStack);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9UZXN0U3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsZUFBdUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDekM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7d0JBQ3BCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRCxhQUFhO29CQUNiLE1BQU0sRUFB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