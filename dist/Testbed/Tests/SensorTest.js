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
            SensorTest.e_count = 7;
            exports_1("SensorTest", SensorTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vuc29yVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvU2Vuc29yVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsYUFBQSxnQkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFPMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkM7b0JBRUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUUzQzt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JB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