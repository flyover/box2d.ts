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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Car;
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
            // This is a fun demo that shows off the wheel joint
            Car = class Car extends testbed.Test {
                constructor() {
                    super();
                    this.m_hz = 0.0;
                    this.m_zeta = 0.0;
                    this.m_speed = 0.0;
                    this.m_hz = 4.0;
                    this.m_zeta = 0.7;
                    this.m_speed = 50.0;
                    let ground;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 0.0;
                        fd.friction = 0.6;
                        shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));
                        ground.CreateFixture(fd);
                        const hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0];
                        let x = 20.0, y1 = 0.0;
                        const dx = 5.0;
                        for (let i = 0; i < 10; ++i) {
                            const y2 = hs[i];
                            shape.Set(new box2d.b2Vec2(x, y1), new box2d.b2Vec2(x + dx, y2));
                            ground.CreateFixture(fd);
                            y1 = y2;
                            x += dx;
                        }
                        for (let i = 0; i < 10; ++i) {
                            const y2 = hs[i];
                            shape.Set(new box2d.b2Vec2(x, y1), new box2d.b2Vec2(x + dx, y2));
                            ground.CreateFixture(fd);
                            y1 = y2;
                            x += dx;
                        }
                        shape.Set(new box2d.b2Vec2(x, 0.0), new box2d.b2Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 80.0;
                        shape.Set(new box2d.b2Vec2(x, 0.0), new box2d.b2Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 40.0;
                        shape.Set(new box2d.b2Vec2(x, 0.0), new box2d.b2Vec2(x + 10.0, 5.0));
                        ground.CreateFixture(fd);
                        x += 20.0;
                        shape.Set(new box2d.b2Vec2(x, 0.0), new box2d.b2Vec2(x + 40.0, 0.0));
                        ground.CreateFixture(fd);
                        x += 40.0;
                        shape.Set(new box2d.b2Vec2(x, 0.0), new box2d.b2Vec2(x, 20.0));
                        ground.CreateFixture(fd);
                    }
                    // Teeter
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(140.0, 1.0);
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const box = new box2d.b2PolygonShape();
                        box.SetAsBox(10.0, 0.25);
                        body.CreateFixture(box, 1.0);
                        const jd = new box2d.b2RevoluteJointDef();
                        jd.Initialize(ground, body, body.GetPosition());
                        jd.lowerAngle = -8.0 * box2d.b2_pi / 180.0;
                        jd.upperAngle = 8.0 * box2d.b2_pi / 180.0;
                        jd.enableLimit = true;
                        this.m_world.CreateJoint(jd);
                        body.ApplyAngularImpulse(100.0);
                    }
                    // Bridge
                    {
                        const N = 20;
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(1.0, 0.125);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.6;
                        const jd = new box2d.b2RevoluteJointDef();
                        let prevBody = ground;
                        for (let i = 0; i < N; ++i) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(161.0 + 2.0 * i, -0.125);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            const anchor = new box2d.b2Vec2(160.0 + 2.0 * i, -0.125);
                            jd.Initialize(prevBody, body, anchor);
                            this.m_world.CreateJoint(jd);
                            prevBody = body;
                        }
                        const anchor = new box2d.b2Vec2(160.0 + 2.0 * N, -0.125);
                        jd.Initialize(prevBody, ground, anchor);
                        this.m_world.CreateJoint(jd);
                    }
                    // Boxes
                    {
                        const box = new box2d.b2PolygonShape();
                        box.SetAsBox(0.5, 0.5);
                        let body;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
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
                        const chassis = new box2d.b2PolygonShape();
                        const vertices = box2d.b2Vec2.MakeArray(8);
                        vertices[0].Set(-1.5, -0.5);
                        vertices[1].Set(1.5, -0.5);
                        vertices[2].Set(1.5, 0.0);
                        vertices[3].Set(0.0, 0.9);
                        vertices[4].Set(-1.15, 0.9);
                        vertices[5].Set(-1.5, 0.2);
                        chassis.Set(vertices, 6);
                        const circle = new box2d.b2CircleShape();
                        circle.m_radius = 0.4;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 1.0);
                        this.m_car = this.m_world.CreateBody(bd);
                        this.m_car.CreateFixture(chassis, 1.0);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = circle;
                        fd.density = 1.0;
                        fd.friction = 0.9;
                        bd.position.Set(-1.0, 0.35);
                        this.m_wheel1 = this.m_world.CreateBody(bd);
                        this.m_wheel1.CreateFixture(fd);
                        bd.position.Set(1.0, 0.4);
                        this.m_wheel2 = this.m_world.CreateBody(bd);
                        this.m_wheel2.CreateFixture(fd);
                        const jd = new box2d.b2WheelJointDef();
                        const axis = new box2d.b2Vec2(0.0, 1.0);
                        jd.Initialize(this.m_car, this.m_wheel1, this.m_wheel1.GetPosition(), axis);
                        jd.motorSpeed = 0.0;
                        jd.maxMotorTorque = 20.0;
                        jd.enableMotor = true;
                        jd.frequencyHz = this.m_hz;
                        jd.dampingRatio = this.m_zeta;
                        this.m_spring1 = this.m_world.CreateJoint(jd);
                        jd.Initialize(this.m_car, this.m_wheel2, this.m_wheel2.GetPosition(), axis);
                        jd.motorSpeed = 0.0;
                        jd.maxMotorTorque = 10.0;
                        jd.enableMotor = false;
                        jd.frequencyHz = this.m_hz;
                        jd.dampingRatio = this.m_zeta;
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
                        case "q":
                            this.m_hz = box2d.b2Max(0.0, this.m_hz - 1.0);
                            this.m_spring1.SetSpringFrequencyHz(this.m_hz);
                            this.m_spring2.SetSpringFrequencyHz(this.m_hz);
                            break;
                        case "e":
                            this.m_hz += 1.0;
                            this.m_spring1.SetSpringFrequencyHz(this.m_hz);
                            this.m_spring2.SetSpringFrequencyHz(this.m_hz);
                            break;
                    }
                }
                Step(settings) {
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, hz down = q, hz up = e");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "frequency = " + this.m_hz.toFixed(2) + " hz, damping ratio = " + this.m_zeta.toFixed(2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9DYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLG9EQUFvRDtZQUNwRCxNQUFBLFNBQWlCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBVW5DO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQVBILFNBQUksR0FBVyxHQUFHLENBQUM7b0JBQ25CLFdBQU0sR0FBVyxHQUFHLENBQUM7b0JBQ3JCLFlBQU8sR0FBVyxHQUFHLENBQUM7b0JBTzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO29CQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBRXBCLElBQUksTUFBb0IsQ0FBQztvQkFDekI7d0JBQ0UsTUFBTSxFQUFFLEdBQW9CLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNsRCxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLE1BQU0sS0FBSyxHQUFzQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFFekQsTUFBTSxFQUFFLEdBQXVCLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUN4RCxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUVsQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLE1BQU0sRUFBRSxHQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFOUUsSUFBSSxDQUFDLEdBQVcsSUFBSSxFQUFFLEVBQUUsR0FBVyxHQUFHLENBQUM7d0JBQ3ZDLE1BQU0sRUFBRSxHQUFXLEdBQUcsQ0FBQzt3QkFFdkIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDbkMsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN6QixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDakUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDekIsRUFBRSxHQUFHLEVBQUUsQ0FBQzs0QkFDUixDQUFDLElBQUksRUFBRSxDQUFDO3lCQUNUO3dCQUVELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ25DLE1BQU0sRUFBRSxHQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDekIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2pFLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3pCLEVBQUUsR0FBRyxFQUFFLENBQUM7NEJBQ1IsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDVDt3QkFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekIsQ0FBQyxJQUFJLElBQUksQ0FBQzt3QkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekIsQ0FBQyxJQUFJLElBQUksQ0FBQzt3QkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekIsQ0FBQyxJQUFJLElBQUksQ0FBQzt3QkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFB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