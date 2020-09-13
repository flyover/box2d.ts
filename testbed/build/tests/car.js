/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
    var b2, testbed, Car;
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
            // This is a fun demo that shows off the wheel joint
            Car = class Car extends testbed.Test {
                constructor() {
                    super();
                    this.m_speed = 0.0;
                    this.m_speed = 50.0;
                    let ground;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 0.0;
                        fd.friction = 0.6;
                        shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
                        ground.CreateFixture(fd);
                        const hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0];
                        let x = 20.0, y1 = 0.0;
                        const dx = 5.0;
                        for (let i = 0; i < 10; ++i) {
                            const y2 = hs[i];
                            shape.SetTwoSided(new b2.Vec2(x, y1), new b2.Vec2(x + dx, y2));
                            ground.CreateFixture(fd);
                            y1 = y2;
                            x += dx;
                        }
                        for (let i = 0; i < 10; ++i) {
                            const y2 = hs[i];
                            shape.SetTwoSided(new b2.Vec2(x, y1), new b2.Vec2(x + dx, y2));
                            ground.CreateFixture(fd);
                            y1 = y2;
                            x += dx;
                        }
                        shape.SetTwoSided(new b2.Vec2(x, 0.0), new b2.Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 80.0;
                        shape.SetTwoSided(new b2.Vec2(x, 0.0), new b2.Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 40.0;
                        shape.SetTwoSided(new b2.Vec2(x, 0.0), new b2.Vec2(x + 10.0, 5.0));
                        ground.CreateFixture(fd);
                        x += 20.0;
                        shape.SetTwoSided(new b2.Vec2(x, 0.0), new b2.Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 40.0;
                        shape.SetTwoSided(new b2.Vec2(x, 0.0), new b2.Vec2(x, 20.0));
                        ground.CreateFixture(fd);
                    }
                    // Teeter
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(140.0, 1.0);
                        bd.type = b2.BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const box = new b2.PolygonShape();
                        box.SetAsBox(10.0, 0.25);
                        body.CreateFixture(box, 1.0);
                        const jd = new b2.RevoluteJointDef();
                        jd.Initialize(ground, body, body.GetPosition());
                        jd.lowerAngle = -8.0 * b2.pi / 180.0;
                        jd.upperAngle = 8.0 * b2.pi / 180.0;
                        jd.enableLimit = true;
                        this.m_world.CreateJoint(jd);
                        body.ApplyAngularImpulse(100.0);
                    }
                    // Bridge
                    {
                        const N = 20;
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(1.0, 0.125);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.6;
                        const jd = new b2.RevoluteJointDef();
                        let prevBody = ground;
                        for (let i = 0; i < N; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(161.0 + 2.0 * i, -0.125);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            const anchor = new b2.Vec2(160.0 + 2.0 * i, -0.125);
                            jd.Initialize(prevBody, body, anchor);
                            this.m_world.CreateJoint(jd);
                            prevBody = body;
                        }
                        const anchor = new b2.Vec2(160.0 + 2.0 * N, -0.125);
                        jd.Initialize(prevBody, ground, anchor);
                        this.m_world.CreateJoint(jd);
                    }
                    // Boxes
                    {
                        const box = new b2.PolygonShape();
                        box.SetAsBox(0.5, 0.5);
                        let body;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(230.0, 0.5);
                        body = this.m_world.CreateBody(bd);
                        body.CreateFixture(box, 0.5);
                        bd.position.Set(230.0, 1.5);
                        body = this.m_world.CreateBody(bd);
                        body.CreateFixture(box, 0.5);
                        bd.position.Set(230.0, 2.5);
                        body = this.m_world.CreateBody(bd);
                        body.CreateFixture(box, 0.5);
                        bd.position.Set(230.0, 3.5);
                        body = this.m_world.CreateBody(bd);
                        body.CreateFixture(box, 0.5);
                        bd.position.Set(230.0, 4.5);
                        body = this.m_world.CreateBody(bd);
                        body.CreateFixture(box, 0.5);
                    }
                    // Car
                    {
                        const chassis = new b2.PolygonShape();
                        const vertices = b2.Vec2.MakeArray(8);
                        vertices[0].Set(-1.5, -0.5);
                        vertices[1].Set(1.5, -0.5);
                        vertices[2].Set(1.5, 0.0);
                        vertices[3].Set(0.0, 0.9);
                        vertices[4].Set(-1.15, 0.9);
                        vertices[5].Set(-1.5, 0.2);
                        chassis.Set(vertices, 6);
                        const circle = new b2.CircleShape();
                        circle.m_radius = 0.4;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 1.0);
                        this.m_car = this.m_world.CreateBody(bd);
                        this.m_car.CreateFixture(chassis, 1.0);
                        const fd = new b2.FixtureDef();
                        fd.shape = circle;
                        fd.density = 1.0;
                        fd.friction = 0.9;
                        bd.position.Set(-1.0, 0.35);
                        this.m_wheel1 = this.m_world.CreateBody(bd);
                        this.m_wheel1.CreateFixture(fd);
                        bd.position.Set(1.0, 0.4);
                        this.m_wheel2 = this.m_world.CreateBody(bd);
                        this.m_wheel2.CreateFixture(fd);
                        const jd = new b2.WheelJointDef();
                        const axis = new b2.Vec2(0.0, 1.0);
                        const mass1 = this.m_wheel1.GetMass();
                        const mass2 = this.m_wheel2.GetMass();
                        const hertz = 4.0;
                        const dampingRatio = 0.7;
                        const omega = 2.0 * b2.pi * hertz;
                        jd.Initialize(this.m_car, this.m_wheel1, this.m_wheel1.GetPosition(), axis);
                        jd.motorSpeed = 0.0;
                        jd.maxMotorTorque = 20.0;
                        jd.enableMotor = true;
                        jd.stiffness = mass1 * omega * omega;
                        jd.damping = 2.0 * mass1 * dampingRatio * omega;
                        jd.lowerTranslation = -0.25;
                        jd.upperTranslation = 0.25;
                        jd.enableLimit = true;
                        this.m_spring1 = this.m_world.CreateJoint(jd);
                        jd.Initialize(this.m_car, this.m_wheel2, this.m_wheel2.GetPosition(), axis);
                        jd.motorSpeed = 0.0;
                        jd.maxMotorTorque = 10.0;
                        jd.enableMotor = false;
                        jd.stiffness = mass2 * omega * omega;
                        jd.damping = 2.0 * mass2 * dampingRatio * omega;
                        jd.lowerTranslation = -0.25;
                        jd.upperTranslation = 0.25;
                        jd.enableLimit = true;
                        this.m_spring2 = this.m_world.CreateJoint(jd);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_spring1.SetMotorSpeed(this.m_speed);
                            break;
                        case "s":
                            this.m_spring1.SetMotorSpeed(0.0);
                            break;
                        case "d":
                            this.m_spring1.SetMotorSpeed(-this.m_speed);
                            break;
                    }
                }
                Step(settings) {
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, hz down = q, hz up = e");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_camera.m_center.x = this.m_car.GetPosition().x;
                    super.Step(settings);
                }
                static Create() {
                    return new Car();
                }
            };
            exports_1("Car", Car);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvY2FyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixvREFBb0Q7WUFDcEQsTUFBQSxNQUFhLEdBQUksU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFRbkM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBTEgsWUFBTyxHQUFXLEdBQUcsQ0FBQztvQkFPM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBRXBCLElBQUksTUFBZSxDQUFDO29CQUNwQjt3QkFDRSxNQUFNLEVBQUUsR0FBZSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVyQyxNQUFNLEtBQUssR0FBaUIsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBRS9DLE1BQU0sRUFBRSxHQUFrQixJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDOUMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO3dCQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFbEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNuRSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUV6QixNQUFNLEVBQUUsR0FBYSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTlFLElBQUksQ0FBQyxHQUFXLElBQUksRUFBRSxFQUFFLEdBQVcsR0FBRyxDQUFDO3dCQUN2QyxNQUFNLEVBQUUsR0FBVyxHQUFHLENBQUM7d0JBRXZCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ25DLE1BQU0sRUFBRSxHQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDekIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQy9ELE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3pCLEVBQUUsR0FBRyxFQUFFLENBQUM7NEJBQ1IsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDVDt3QkFFRCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFOzRCQUNuQyxNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3pCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUMvRCxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUN6QixFQUFFLEdBQUcsRUFBRSxDQUFDOzRCQUNSLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ1Q7d0JBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLENBQUMsSUFBSSxJQUFJLENBQUM7d0JBQ1YsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLENBQUMsSUFBSSxJQUFJLENBQUM7d0JBQ1YsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLENBQUMsSUFBSSxJQUFJLENBQUM7d0JBQ1YsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLENBQUMsSUFBSSxJQUFJLENBQUM7d0JBQ1YsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDN0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDMUI7b0JBRUQsU0FBUztvQkFDVDt3QkFDRSxNQUFNLEVBQUUsR0FBZSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDeEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM1QixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUNyQyxNQUFNLElBQUksR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFbEQsTUFBTSxHQUFHLEdBQW9CLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNuRCxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTdCLE1BQU0sRUFBRSxHQUF3QixJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3dCQUMxRCxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7d0JBQ2hELEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7d0JBQ3JDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO3dCQUNwQyxFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTdCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDakM7b0JBRUQsU0FBUztvQkFDVDt3QkFDRSxNQUFNLENBQUMsR0FBVyxFQUFFLENBQUM7d0JBQ3JCLE1BQU0sS0FBSyxHQUFvQixJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDckQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBRTNCLE1BQU0sRUFBRSxHQUFrQixJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDOUMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO3dCQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFbEIsTUFBTSxFQUFFLEdBQXdCLElBQUksRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7d0JBRTFELElBQUksUUFBUSxHQUFZLE1BQU0sQ0FBQzt3QkFDL0IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDbEMsTUFBTSxFQUFFLEdBQWUsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQ3hDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7NEJBQ3JDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3pDLE1BQU0sSUFBSSxHQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUV2QixNQUFNLE1BQU0sR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDN0QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFN0IsUUFBUSxHQUFHLElBQUksQ0FBQzt5QkFDakI7d0JBRUQsTUFBTSxNQUFNLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzdELEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzlCO29CQUVELFFBQVE7b0JBQ1I7d0JBQ0UsTUFBTSxHQUFHLEdBQW9CLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNuRCxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFdkIsSUFBSSxJQUFhLENBQUM7d0JBQ2xCLE1BQU0sRUFBRSxHQUFlLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN4QyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUVyQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzVCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFN0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM1QixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUU3QixFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzVCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDOUI7b0JBRUQsTUFBTTtvQkFDTjt3QkFDRSxNQUFNLE9BQU8sR0FBb0IsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3ZELE1BQU0sUUFBUSxHQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzVCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzNCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDNUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRXpCLE1BQU0sTUFBTSxHQUFtQixJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDcEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRXRCLE1BQU0sRUFBRSxHQUFlLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN4QyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUNyQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFdkMsTUFBTSxFQUFFLEdBQWtCLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUM5QyxFQUFFLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQzt3QkFDbEIsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUVsQixFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRWhDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRWhDLE1BQU0sRUFBRSxHQUFxQixJQUFJLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFDcEQsTUFBTSxJQUFJLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFL0MsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDOUMsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFFOUMsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFDO3dCQUMxQixNQUFNLFlBQVksR0FBVyxHQUFHLENBQUM7d0JBQ2pDLE1BQU0sS0FBSyxHQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQzt3QkFFdkMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDNUUsRUFBRSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7d0JBQ3BCLEVBQUUsQ0FBQyxjQUFjLEdB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