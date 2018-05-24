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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, BuoyancyTest;
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
                // m_controller: box2d.b2BuoyancyController;
                constructor() {
                    super();
                    this.m_bodies = new Array();
                    // var bc = new box2d.b2BuoyancyController();
                    // this.m_controller = bc;
                    // bc.normal.Set(0.0, 1.0);
                    // bc.offset = 20.0;
                    // bc.density = 2.0;
                    // bc.linearDrag = 5.0;
                    // bc.angularDrag = 2.0;
                    var ground = this.m_world.CreateBody(new box2d.b2BodyDef());
                    {
                        var shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(-40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(40.0, 0.0), new box2d.b2Vec2(40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Spawn in a bunch of crap
                    {
                        for (var i = 0; i < 5; i++) {
                            var bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            var body = this.m_world.CreateBody(bd);
                            var fd = new box2d.b2FixtureDef();
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
                        for (var i = 0; i < 5; i++) {
                            var bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            var body = this.m_world.CreateBody(bd);
                            var fd = new box2d.b2FixtureDef();
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
                        for (var i = 0; i < 15; i++) {
                            var bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            //bd.isBullet = true;
                            bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                            bd.angle = Math.random() * Math.PI;
                            var body = this.m_world.CreateBody(bd);
                            var fd = new box2d.b2FixtureDef();
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
                                    new box2d.b2Vec2(1.0 + Math.random() * 1.0, 1.0 + Math.random() * 1.0)
                                ]);
                            }
                            else if (Math.random() > 0.5) {
                                var array = [];
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
                                    new box2d.b2Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0)
                                ]);
                            }
                            body.CreateFixture(fd);
                            this.m_bodies.push(body);
                        }
                    }
                    //Add some exciting bath toys
                    {
                        var bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 40.0);
                        bd.angle = 0;
                        var body = this.m_world.CreateBody(bd);
                        var fd = new box2d.b2FixtureDef();
                        fd.density = 3.0;
                        const polygon = new box2d.b2PolygonShape();
                        fd.shape = polygon;
                        polygon.SetAsBox(4.0, 1.0);
                        body.CreateFixture(fd);
                        this.m_bodies.push(body);
                    }
                    {
                        var bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 30.0);
                        var body = this.m_world.CreateBody(bd);
                        var fd = new box2d.b2FixtureDef();
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
                    //   for (var body_i = 0; i < this.m_bodies.length; ++i)
                    //     this.m_controller.AddBody(this.m_bodies[body_i]);
                    //   for (var body_i = 0; i < this.m_bodies.length; ++i)
                    //     this.m_controller.RemoveBody(this.m_bodies[body_i]);
                    // }
                    // for (var body_i = 0; i < this.m_bodies.length; ++i)
                    //   this.m_controller.AddBody(this.m_bodies[body_i]);
                    // if (box2d.DEBUG) {
                    //   this.m_world.AddController(this.m_controller);
                    //   this.m_world.RemoveController(this.m_controller);
                    // }
                    // this.m_world.AddController(this.m_controller);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVveWFuY3lUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQnVveWFuY3lUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixlQUFBLGtCQUEwQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUU1Qyw0Q0FBNEM7Z0JBRTVDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztvQkFFNUIsNkNBQTZDO29CQUM3QywwQkFBMEI7b0JBRTFCLDJCQUEyQjtvQkFDM0Isb0JBQW9CO29CQUNwQixvQkFBb0I7b0JBQ3BCLHVCQUF1QjtvQkFDdkIsd0JBQXdCO29CQUV4QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO29CQUU1RDt3QkFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDcEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3ZFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dC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QUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dDQUNwRixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQ0FDbkYsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbEYsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dDQUMxQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNsRixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0NBQzFD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