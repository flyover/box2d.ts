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
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Revolute, testIndex;
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
            Revolute = class Revolute extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        /*b2.FixtureDef*/
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        //fd.filter.categoryBits = 2;
                        ground.CreateFixture(fd);
                    }
                    {
                        const shape = new b2.CircleShape();
                        shape.m_radius = 0.5;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        const rjd = new b2.RevoluteJointDef();
                        bd.position.Set(-10.0, 20.0);
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 5.0);
                        const w = 100.0;
                        body.SetAngularVelocity(w);
                        body.SetLinearVelocity(new b2.Vec2(-8.0 * w, 0.0));
                        rjd.Initialize(ground, body, new b2.Vec2(-10.0, 12.0));
                        rjd.motorSpeed = 1.0 * b2.pi;
                        rjd.maxMotorTorque = 10000.0;
                        rjd.enableMotor = false;
                        rjd.lowerAngle = -0.25 * b2.pi;
                        rjd.upperAngle = 0.5 * b2.pi;
                        rjd.enableLimit = true;
                        rjd.collideConnected = true;
                        this.m_joint = this.m_world.CreateJoint(rjd);
                    }
                    {
                        /*b2.CircleShape*/
                        const circle_shape = new b2.CircleShape();
                        circle_shape.m_radius = 3.0;
                        const circle_bd = new b2.BodyDef();
                        circle_bd.type = b2.BodyType.b2_dynamicBody;
                        circle_bd.position.Set(5.0, 30.0);
                        /*b2.FixtureDef*/
                        const fd = new b2.FixtureDef();
                        fd.density = 5.0;
                        fd.filter.maskBits = 1;
                        fd.shape = circle_shape;
                        this.m_ball = this.m_world.CreateBody(circle_bd);
                        this.m_ball.CreateFixture(fd);
                        /*b2.PolygonShape*/
                        const polygon_shape = new b2.PolygonShape();
                        polygon_shape.SetAsBox(10.0, 0.2, new b2.Vec2(-10.0, 0.0), 0.0);
                        const polygon_bd = new b2.BodyDef();
                        polygon_bd.position.Set(20.0, 10.0);
                        polygon_bd.type = b2.BodyType.b2_dynamicBody;
                        polygon_bd.bullet = true;
                        /*b2.Body*/
                        const polygon_body = this.m_world.CreateBody(polygon_bd);
                        polygon_body.CreateFixture(polygon_shape, 2.0);
                        const rjd = new b2.RevoluteJointDef();
                        rjd.Initialize(ground, polygon_body, new b2.Vec2(20.0, 10.0));
                        rjd.lowerAngle = -0.25 * b2.pi;
                        rjd.upperAngle = 0.0 * b2.pi;
                        rjd.enableLimit = true;
                        this.m_world.CreateJoint(rjd);
                    }
                    // Tests mass computation of a small object far from the origin
                    {
                        const bodyDef = new b2.BodyDef();
                        bodyDef.type = b2.BodyType.b2_dynamicBody;
                        /*b2.Body*/
                        const body = this.m_world.CreateBody(bodyDef);
                        /*b2.PolygonShape*/
                        const polyShape = new b2.PolygonShape();
                        /*b2.Vec2*/
                        const verts = b2.Vec2.MakeArray(3);
                        verts[0].Set(17.63, 36.31);
                        verts[1].Set(17.52, 36.69);
                        verts[2].Set(17.19, 36.36);
                        polyShape.Set(verts, 3);
                        /*b2.FixtureDef*/
                        const polyFixtureDef = new b2.FixtureDef();
                        polyFixtureDef.shape = polyShape;
                        polyFixtureDef.density = 1;
                        body.CreateFixture(polyFixtureDef); //assertion hits inside here
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "l":
                            this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
                            break;
                        case "m":
                            this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motor");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // if (this.m_stepCount === 360) {
                    //   this.m_ball.SetTransformVec(new b2.Vec2(0.0, 0.5), 0.0);
                    // }
                    // const torque1 = this.m_joint.GetMotorTorque(settings.hz);
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque1.toFixed(0)}, ${torque2.toFixed(0)} : Motor Force = ${force3.toFixed(0)}`);
                    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Revolute();
                }
            };
            exports_1("Revolute", Revolute);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Revolute", Revolute.Create));
        }
    };
});
//# sourceMappingURL=revolute_joint.js.map