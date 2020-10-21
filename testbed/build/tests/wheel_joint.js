// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, WheelJoint, testIndex;
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
            // Test the wheel joint with motor, spring, and limit options.
            WheelJoint = class WheelJoint extends testbed.Test {
                constructor() {
                    super();
                    this.m_enableLimit = false;
                    this.m_enableMotor = false;
                    this.m_motorSpeed = 0.0;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    this.m_enableLimit = true;
                    this.m_enableMotor = false;
                    this.m_motorSpeed = 10.0;
                    {
                        const shape = new b2.CircleShape();
                        shape.m_radius = 2.0;
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Set(0.0, 10.0);
                        bd.allowSleep = false;
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 5.0);
                        const jd = new b2.WheelJointDef();
                        // Horizontal
                        jd.Initialize(ground, body, bd.position, new b2.Vec2(0.0, 1.0));
                        jd.motorSpeed = this.m_motorSpeed;
                        jd.maxMotorTorque = 10000.0;
                        jd.enableMotor = this.m_enableMotor;
                        jd.lowerTranslation = -3.0;
                        jd.upperTranslation = 3.0;
                        jd.enableLimit = this.m_enableLimit;
                        const hertz = 1.0;
                        const dampingRatio = 0.7;
                        b2.LinearStiffness(jd, hertz, dampingRatio, ground, body);
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    const torque = this.m_joint.GetMotorTorque(settings.m_hertz);
                    // g_debugDraw.DrawString(5, m_textLine, "Motor Torque = %4.0f", torque);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const F = this.m_joint.GetReactionForce(settings.m_hertz, WheelJoint.Step_s_F);
                    // g_debugDraw.DrawString(5, m_textLine, "Reaction Force = (%4.1f, %4.1f)", F.x, F.y);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Reaction Force = (${F.x.toFixed(1)}, ${F.y.toFixed(1)})`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new WheelJoint();
                }
            };
            exports_1("WheelJoint", WheelJoint);
            WheelJoint.Step_s_F = new b2.Vec2();
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Wheel", WheelJoint.Create));
        }
    };
});
//# sourceMappingURL=wheel_joint.js.map