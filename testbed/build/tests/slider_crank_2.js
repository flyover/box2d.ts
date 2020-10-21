// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, SliderCrank2, testIndex;
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
            // A motor driven slider crank with joint friction.
            SliderCrank2 = class SliderCrank2 extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        let prevBody = ground;
                        // Define crank.
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(0.5, 2.0);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 7.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 5.0));
                            rjd.motorSpeed = 1.0 * b2.pi;
                            rjd.maxMotorTorque = 10000.0;
                            rjd.enableMotor = true;
                            this.m_joint1 = this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define follower.
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(0.5, 4.0);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 13.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 9.0));
                            rjd.enableMotor = false;
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define piston
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(1.5, 1.5);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.fixedRotation = true;
                            bd.position.Set(0.0, 17.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 17.0));
                            this.m_world.CreateJoint(rjd);
                            const pjd = new b2.PrismaticJointDef();
                            pjd.Initialize(ground, body, new b2.Vec2(0.0, 17.0), new b2.Vec2(0.0, 1.0));
                            pjd.maxMotorForce = 1000.0;
                            pjd.enableMotor = true;
                            this.m_joint2 = this.m_world.CreateJoint(pjd);
                        }
                        // Create a payload
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(1.5, 1.5);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 23.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "f":
                            this.m_joint2.EnableMotor(!this.m_joint2.IsMotorEnabled());
                            this.m_joint2.GetBodyB().SetAwake(true);
                            break;
                        case "m":
                            this.m_joint1.EnableMotor(!this.m_joint1.IsMotorEnabled());
                            this.m_joint1.GetBodyB().SetAwake(true);
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (f) toggle friction, (m) toggle motor");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const torque = this.m_joint1.GetMotorTorque(settings.m_hertz);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new SliderCrank2();
                }
            };
            exports_1("SliderCrank2", SliderCrank2);
            SliderCrank2.e_count = 30;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Slider Crank 2", SliderCrank2.Create));
        }
    };
});
//# sourceMappingURL=slider_crank_2.js.map