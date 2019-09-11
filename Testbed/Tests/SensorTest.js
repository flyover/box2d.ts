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
    var box2d, testbed, SensorTest;
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
            SensorTest = class SensorTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodies = new Array(SensorTest.e_count);
                    this.m_touching = new Array(SensorTest.e_count);
                    for (let i = 0; i < SensorTest.e_count; ++i) {
                        this.m_touching[i] = new Array(1);
                    }
                    const bd = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    /*
                    {
                      const sd = new box2d.b2FixtureDef();
                      sd.SetAsBox(10.0, 2.0, new box2d.b2Vec2(0.0, 20.0), 0.0);
                      sd.isSensor = true;
                      this.m_sensor = ground.CreateFixture(sd);
                    }
                    */
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 5.0;
                        shape.m_p.Set(0.0, 10.0);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.isSensor = true;
                        this.m_sensor = ground.CreateFixture(fd);
                    }
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 1.0;
                        for (let i = 0; i < SensorTest.e_count; ++i) {
                            //const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(-10.0 + 3.0 * i, 20.0);
                            bd.userData = this.m_touching[i];
                            this.m_touching[i][0] = false;
                            this.m_bodies[i] = this.m_world.CreateBody(bd);
                            this.m_bodies[i].CreateFixture(shape, 1.0);
                        }
                    }
                }
                BeginContact(contact) {
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA === this.m_sensor) {
                        const userData = fixtureB.GetBody().GetUserData();
                        if (userData) {
                            const touching = userData;
                            touching[0] = true;
                        }
                    }
                    if (fixtureB === this.m_sensor) {
                        const userData = fixtureA.GetBody().GetUserData();
                        if (userData) {
                            const touching = userData;
                            touching[0] = true;
                        }
                    }
                }
                EndContact(contact) {
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA === this.m_sensor) {
                        const userData = fixtureB.GetBody().GetUserData();
                        if (userData) {
                            const touching = userData;
                            touching[0] = false;
                        }
                    }
                    if (fixtureB === this.m_sensor) {
                        const userData = fixtureA.GetBody().GetUserData();
                        if (userData) {
                            const touching = userData;
                            touching[0] = false;
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // Traverse the contact results. Apply a force on shapes
                    // that overlap the sensor.
                    for (let i = 0; i < SensorTest.e_count; ++i) {
                        if (!this.m_touching[i][0]) {
                            continue;
                        }
                        const body = this.m_bodies[i];
                        const ground = this.m_sensor.GetBody();
                        const circle = this.m_sensor.GetShape();
                        const center = ground.GetWorldPoint(circle.m_p, new box2d.b2Vec2());
                        const position = body.GetPosition();
                        const d = box2d.b2Vec2.SubVV(center, position, new box2d.b2Vec2());
                        if (d.LengthSquared() < box2d.b2_epsilon_sq) {
                            continue;
                        }
                        d.Normalize();
                        const F = box2d.b2Vec2.MulSV(100.0, d, new box2d.b2Vec2());
                        body.ApplyForce(F, position);
                    }
                }
                static Create() {
                    return new SensorTest();
                }
            };
            exports_1("SensorTest", SensorTest);
            SensorTest.e_count = 7;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vuc29yVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlNlbnNvclRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGFBQUEsTUFBYSxVQUFXLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBTzFDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25DO29CQUVELE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFM0M7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVEOzs7Ozs7O3NCQU9FO29CQUNG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