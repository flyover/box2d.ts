// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Pinball, testIndex;
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
            /// This tests bullet collision and provides an example of a gameplay scenario.
            /// This also uses a loop shape.
            Pinball = class Pinball extends testbed.Test {
                constructor() {
                    super();
                    this.m_button = false;
                    // Ground body
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const vs = b2.Vec2.MakeArray(5);
                        vs[0].Set(-8.0, 6.0);
                        vs[1].Set(-8.0, 20.0);
                        vs[2].Set(8.0, 20.0);
                        vs[3].Set(8.0, 6.0);
                        vs[4].Set(0.0, -2.0);
                        const loop = new b2.ChainShape();
                        loop.CreateLoop(vs, 5);
                        const fd = new b2.FixtureDef();
                        fd.shape = loop;
                        fd.density = 0.0;
                        ground.CreateFixture(fd);
                    }
                    // Flippers
                    {
                        const p1 = new b2.Vec2(-2.0, 0.0), p2 = new b2.Vec2(2.0, 0.0);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Copy(p1);
                        const leftFlipper = this.m_world.CreateBody(bd);
                        bd.position.Copy(p2);
                        const rightFlipper = this.m_world.CreateBody(bd);
                        const box = new b2.PolygonShape();
                        box.SetAsBox(1.75, 0.1);
                        const fd = new b2.FixtureDef();
                        fd.shape = box;
                        fd.density = 1.0;
                        leftFlipper.CreateFixture(fd);
                        rightFlipper.CreateFixture(fd);
                        const jd = new b2.RevoluteJointDef();
                        jd.bodyA = ground;
                        jd.localAnchorB.SetZero();
                        jd.enableMotor = true;
                        jd.maxMotorTorque = 1000.0;
                        jd.enableLimit = true;
                        jd.motorSpeed = 0.0;
                        jd.localAnchorA.Copy(p1);
                        jd.bodyB = leftFlipper;
                        jd.lowerAngle = -30.0 * b2.pi / 180.0;
                        jd.upperAngle = 5.0 * b2.pi / 180.0;
                        this.m_leftJoint = this.m_world.CreateJoint(jd);
                        jd.motorSpeed = 0.0;
                        jd.localAnchorA.Copy(p2);
                        jd.bodyB = rightFlipper;
                        jd.lowerAngle = -5.0 * b2.pi / 180.0;
                        jd.upperAngle = 30.0 * b2.pi / 180.0;
                        this.m_rightJoint = this.m_world.CreateJoint(jd);
                    }
                    // Circle character
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(1.0, 15.0);
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.bullet = true;
                        this.m_ball = this.m_world.CreateBody(bd);
                        const shape = new b2.CircleShape();
                        shape.m_radius = 0.2;
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        this.m_ball.CreateFixture(fd);
                    }
                    this.m_button = false;
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_button = true;
                            break;
                    }
                }
                KeyboardUp(key) {
                    switch (key) {
                        case "a":
                            this.m_button = false;
                            break;
                    }
                }
                Step(settings) {
                    if (this.m_button) {
                        this.m_leftJoint.SetMotorSpeed(20.0);
                        this.m_rightJoint.SetMotorSpeed(-20.0);
                    }
                    else {
                        this.m_leftJoint.SetMotorSpeed(-10.0);
                        this.m_rightJoint.SetMotorSpeed(10.0);
                    }
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to control the flippers");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Pinball();
                }
            };
            exports_1("Pinball", Pinball);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Pinball", Pinball.Create));
        }
    };
});
//# sourceMappingURL=pinball.js.map