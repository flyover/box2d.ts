// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Prismatic, testIndex;
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
            // Test the prismatic joint with limits and motor options.
            Prismatic = class Prismatic extends testbed.Test {
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
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(1.0, 1.0);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 10.0);
                        bd.angle = 0.5 * b2.pi;
                        bd.allowSleep = false;
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 5.0);
                        const pjd = new b2.PrismaticJointDef();
                        // Horizontal
                        pjd.Initialize(ground, body, bd.position, new b2.Vec2(1.0, 0.0));
                        pjd.motorSpeed = 10.0;
                        pjd.maxMotorForce = 10000.0;
                        pjd.enableMotor = true;
                        pjd.lowerTranslation = -10.0;
                        pjd.upperTranslation = 10.0;
                        pjd.enableLimit = true;
                        this.m_joint = this.m_world.CreateJoint(pjd);
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
                        case "s":
                            this.m_joint.SetMotorSpeed(-this.m_joint.GetMotorSpeed());
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const force = this.m_joint.GetMotorForce(settings.m_hertz);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Prismatic();
                }
            };
            exports_1("Prismatic", Prismatic);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Prismatic", Prismatic.Create));
        }
    };
});
//# sourceMappingURL=prismatic_joint.js.map