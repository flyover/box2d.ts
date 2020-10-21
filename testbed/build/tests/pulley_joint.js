// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, PulleyJoint, testIndex;
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
            PulleyJoint = class PulleyJoint extends testbed.Test {
                constructor() {
                    super();
                    const y = 16.0;
                    const L = 12.0;
                    const a = 1.0;
                    const b = 2.0;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const circle = new b2.CircleShape();
                        circle.m_radius = 2.0;
                        circle.m_p.Set(-10.0, y + b + L);
                        ground.CreateFixture(circle, 0.0);
                        circle.m_p.Set(10.0, y + b + L);
                        ground.CreateFixture(circle, 0.0);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(a, b);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        //bd.fixedRotation = true;
                        bd.position.Set(-10.0, y);
                        const body1 = this.m_world.CreateBody(bd);
                        body1.CreateFixture(shape, 5.0);
                        bd.position.Set(10.0, y);
                        const body2 = this.m_world.CreateBody(bd);
                        body2.CreateFixture(shape, 5.0);
                        const pulleyDef = new b2.PulleyJointDef();
                        const anchor1 = new b2.Vec2(-10.0, y + b);
                        const anchor2 = new b2.Vec2(10.0, y + b);
                        const groundAnchor1 = new b2.Vec2(-10.0, y + b + L);
                        const groundAnchor2 = new b2.Vec2(10.0, y + b + L);
                        pulleyDef.Initialize(body1, body2, groundAnchor1, groundAnchor2, anchor1, anchor2, 1.5);
                        this.m_joint1 = this.m_world.CreateJoint(pulleyDef);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    const ratio = this.m_joint1.GetRatio();
                    const L = this.m_joint1.GetCurrentLengthA() + ratio * this.m_joint1.GetCurrentLengthB();
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `L1 + ${ratio.toFixed(2)} * L2 = ${L.toFixed(2)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new PulleyJoint();
                }
            };
            exports_1("PulleyJoint", PulleyJoint);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Pulley", PulleyJoint.Create));
        }
    };
});
//# sourceMappingURL=pulley_joint.js.map