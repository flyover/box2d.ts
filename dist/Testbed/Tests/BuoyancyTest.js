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
    var box2d, testbed, BuoyancyTest;
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
            BuoyancyTest = class BuoyancyTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodies = new Array();
                    const bc = new box2d.b2BuoyancyController();
                    this.m_controller = bc;
                    bc.normal.Set(0.0, 1.0);
                    bc.offset = 20.0;
                    bc.density = 2.0;
                    bc.linearDrag = 5.0;
                    bc.angularDrag = 2.0;
                    const ground = this.m_world.CreateBody(new box2d.b2BodyDef());
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(-40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(40.0, 0.0), new box2d.b2Vec2(40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Spawn in a bunch of crap
                    {
                        for (let i = 0; i < 5; i++) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            const body = this.m_world.CreateBody(bd);
                            const fd = new box2d.b2FixtureDef();
                            fd.density = 1.0;
                            // Override the default friction.
                            fd.friction = 0.3;
                            fd.restitution = 0.1;
                            const polygon = new box2d.b2PolygonShape();
                            fd.shape = polygon;
                            polygon.SetAsBox(Math.random() * 0.5 + 1.0, Math.random() * 0.5 + 1.0);
                            body.CreateFixture(fd);
                            this.m_bodies.push(body);
                        }
                    }
                    {
                        for (let i = 0; i < 5; i++) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            const body = this.m_world.CreateBody(bd);
                            const fd = new box2d.b2FixtureDef();
                            fd.density = 1.0;
                            // Override the default friction.
                            fd.friction = 0.3;
                            fd.restitution = 0.1;
                            fd.shape = new box2d.b2CircleShape(Math.random() * 0.5 + 1.0);
                            body.CreateFixture(fd);
                            this.m_bodies.push(body);
                        }
                    }
                    {
                        for (let i = 0; i < 15; i++) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            const body = this.m_world.CreateBody(bd);
                            const fd = new box2d.b2FixtureDef();
                            fd.density = 1.0;
                            fd.friction = 0.3;
                            fd.restitution = 0.1;
                            const polygon = new box2d.b2PolygonShape();
                            fd.shape = polygon;
                            if (Math.random() > 0.66) {
                                polygon.Set([
                                    new box2d.b2Vec2(-1.0 - Math.random() * 1.0, 1.0 + Math.random() * 1.0),
                                    new box2d.b2Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                                    new box2d.b2Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                                    new box2d.b2Vec2(1.0 + Math.random() * 1.0, 1.0 + Math.random() * 1.0),
                                ]);
                            }
                            else if (Math.random() > 0.5) {
                                const array = [];
                                array[0] = new box2d.b2Vec2(0.0, 1.0 + Math.random() * 1.0);
                                array[2] = new box2d.b2Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0);
                                array[3] = new box2d.b2Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0);
                                array[1] = new box2d.b2Vec2((array[0].x + array[2].x), (array[0].y + array[2].y));
                                array[1].SelfMul(Math.random() / 2 + 0.8);
                                array[4] = new box2d.b2Vec2((array[3].x + array[0].x), (array[3].y + array[0].y));
                                array[4].SelfMul(Math.random() / 2 + 0.8);
                                polygon.Set(array);
                            }
                            else {
                                polygon.Set([
                                    new box2d.b2Vec2(0.0, 1.0 + Math.random() * 1.0),
                                    new box2d.b2Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                                    new box2d.b2Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                                ]);
                            }
                            body.CreateFixture(fd);
                            this.m_bodies.push(body);
                        }
                    }
                    //Add some exciting bath toys
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 40.0);
                        bd.angle = 0;
                        const body = this.m_world.CreateBody(bd);
                        const fd = new box2d.b2FixtureDef();
                        fd.density = 3.0;
                        const polygon = new box2d.b2PolygonShape();
                        fd.shape = polygon;
                        polygon.SetAsBox(4.0, 1.0);
                        body.CreateFixture(fd);
                        this.m_bodies.push(body);
                    }
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 30.0);
                        const body = this.m_world.CreateBody(bd);
                        const fd = new box2d.b2FixtureDef();
                        fd.density = 2.0;
                        const circle = new box2d.b2CircleShape(0.7);
                        fd.shape = circle;
                        circle.m_p.Set(3.0, 0.0);
                        body.CreateFixture(fd);
                        circle.m_p.Set(-3.0, 0.0);
                        body.CreateFixture(fd);
                        circle.m_p.Set(0.0, 3.0);
                        body.CreateFixture(fd);
                        circle.m_p.Set(0.0, -3.0);
                        body.CreateFixture(fd);
                        fd.density = 2.0;
                        const polygon = new box2d.b2PolygonShape();
                        fd.shape = polygon;
                        polygon.SetAsBox(3.0, 0.2);
                        body.CreateFixture(fd);
                        polygon.SetAsBox(0.2, 3.0);
                        body.CreateFixture(fd);
                        this.m_bodies.push(body);
                    }
                    // if (box2d.DEBUG) {
                    //   for (let body_i = 0; i < this.m_bodies.length; ++i)
                    //     this.m_controller.AddBody(this.m_bodies[body_i]);
                    //   for (let body_i = 0; i < this.m_bodies.length; ++i)
                    //     this.m_controller.RemoveBody(this.m_bodies[body_i]);
                    // }
                    for (let body_i = 0; body_i < this.m_bodies.length; ++body_i) {
                        this.m_controller.AddBody(this.m_bodies[body_i]);
                    }
                    // if (box2d.DEBUG) {
                    //   this.m_world.AddController(this.m_controller);
                    //   this.m_world.RemoveController(this.m_controller);
                    // }
                    this.m_world.AddController(this.m_controller);
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new BuoyancyTest();
                }
            };
            exports_1("BuoyancyTest", BuoyancyTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVveWFuY3lUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9CdW95YW5jeVRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGVBQUEsa0JBQTBCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBSTVDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztvQkFFNUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7b0JBRXZCLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDeEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2pCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUNqQixFQUFFLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsRUFBRSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7b0JBRXJCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBRTlEO3dCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFF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LEdBQUcsRUFBRTtnQ0FDOUIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dDQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dDQUM1RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dDQUNwRixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQ0FDbkYsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbEYsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dDQUMxQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMs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