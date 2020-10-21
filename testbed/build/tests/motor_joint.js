// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, MotorJoint, testIndex;
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
            /// This test shows how to use a motor joint. A motor joint
            /// can be used to animate a dynamic body. With finite motor forces
            /// the body can be blocked by collision with other bodies.
            MotorJoint = class MotorJoint extends testbed.Test {
                constructor() {
                    super();
                    this.m_time = 0;
                    this.m_go = false;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        ground.CreateFixture(fd);
                    }
                    // Define motorized body
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 8.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(2.0, 0.5);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        body.CreateFixture(fd);
                        const mjd = new b2.MotorJointDef();
                        mjd.Initialize(ground, body);
                        mjd.maxForce = 1000.0;
                        mjd.maxTorque = 1000.0;
                        this.m_joint = this.m_world.CreateJoint(mjd);
                    }
                    this.m_go = false;
                    this.m_time = 0.0;
                }
                Keyboard(key) {
                    switch (key) {
                        case "s":
                            this.m_go = !this.m_go;
                            break;
                    }
                }
                Step(settings) {
                    if (this.m_go && settings.m_hertz > 0.0) {
                        this.m_time += 1.0 / settings.m_hertz;
                    }
                    const linearOffset = new b2.Vec2();
                    linearOffset.x = 6.0 * b2.Sin(2.0 * this.m_time);
                    linearOffset.y = 8.0 + 4.0 * b2.Sin(1.0 * this.m_time);
                    const angularOffset = 4.0 * this.m_time;
                    this.m_joint.SetLinearOffset(linearOffset);
                    this.m_joint.SetAngularOffset(angularOffset);
                    testbed.g_debugDraw.DrawPoint(linearOffset, 4.0, new b2.Color(0.9, 0.9, 0.9));
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (s) pause");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new MotorJoint();
                }
            };
            exports_1("MotorJoint", MotorJoint);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Motor Joint", MotorJoint.Create));
        }
    };
});
//# sourceMappingURL=motor_joint.js.map