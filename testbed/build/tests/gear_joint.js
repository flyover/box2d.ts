// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, GearJoint, testIndex;
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
            GearJoint = class GearJoint extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-50.0, 0.0), new b2.Vec2(50.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const circle1 = new b2.CircleShape();
                        circle1.m_radius = 1.0;
                        const box = new b2.PolygonShape();
                        box.SetAsBox(0.5, 5.0);
                        const circle2 = new b2.CircleShape();
                        circle2.m_radius = 2.0;
                        const bd1 = new b2.BodyDef();
                        bd1.type = b2.BodyType.b2_staticBody;
                        bd1.position.Set(10.0, 9.0);
                        const body1 = this.m_world.CreateBody(bd1);
                        body1.CreateFixture(circle1, 5.0);
                        const bd2 = new b2.BodyDef();
                        bd2.type = b2.BodyType.b2_dynamicBody;
                        bd2.position.Set(10.0, 8.0);
                        const body2 = this.m_world.CreateBody(bd2);
                        body2.CreateFixture(box, 5.0);
                        const bd3 = new b2.BodyDef();
                        bd3.type = b2.BodyType.b2_dynamicBody;
                        bd3.position.Set(10.0, 6.0);
                        const body3 = this.m_world.CreateBody(bd3);
                        body3.CreateFixture(circle2, 5.0);
                        const jd1 = new b2.RevoluteJointDef();
                        jd1.Initialize(body1, body2, bd1.position);
                        const joint1 = this.m_world.CreateJoint(jd1);
                        const jd2 = new b2.RevoluteJointDef();
                        jd2.Initialize(body2, body3, bd3.position);
                        const joint2 = this.m_world.CreateJoint(jd2);
                        const jd4 = new b2.GearJointDef();
                        jd4.bodyA = body1;
                        jd4.bodyB = body3;
                        jd4.joint1 = joint1;
                        jd4.joint2 = joint2;
                        jd4.ratio = circle2.m_radius / circle1.m_radius;
                        this.m_world.CreateJoint(jd4);
                    }
                    {
                        const circle1 = new b2.CircleShape();
                        circle1.m_radius = 1.0;
                        const circle2 = new b2.CircleShape();
                        circle2.m_radius = 2.0;
                        const box = new b2.PolygonShape();
                        box.SetAsBox(0.5, 5.0);
                        const bd1 = new b2.BodyDef();
                        bd1.type = b2.BodyType.b2_dynamicBody;
                        bd1.position.Set(-3.0, 12.0);
                        const body1 = this.m_world.CreateBody(bd1);
                        body1.CreateFixture(circle1, 5.0);
                        const jd1 = new b2.RevoluteJointDef();
                        jd1.bodyA = ground;
                        jd1.bodyB = body1;
                        ground.GetLocalPoint(bd1.position, jd1.localAnchorA);
                        body1.GetLocalPoint(bd1.position, jd1.localAnchorB);
                        jd1.referenceAngle = body1.GetAngle() - ground.GetAngle();
                        this.m_joint1 = this.m_world.CreateJoint(jd1);
                        const bd2 = new b2.BodyDef();
                        bd2.type = b2.BodyType.b2_dynamicBody;
                        bd2.position.Set(0.0, 12.0);
                        const body2 = this.m_world.CreateBody(bd2);
                        body2.CreateFixture(circle2, 5.0);
                        const jd2 = new b2.RevoluteJointDef();
                        jd2.Initialize(ground, body2, bd2.position);
                        this.m_joint2 = this.m_world.CreateJoint(jd2);
                        const bd3 = new b2.BodyDef();
                        bd3.type = b2.BodyType.b2_dynamicBody;
                        bd3.position.Set(2.5, 12.0);
                        const body3 = this.m_world.CreateBody(bd3);
                        body3.CreateFixture(box, 5.0);
                        const jd3 = new b2.PrismaticJointDef();
                        jd3.Initialize(ground, body3, bd3.position, new b2.Vec2(0.0, 1.0));
                        jd3.lowerTranslation = -5.0;
                        jd3.upperTranslation = 5.0;
                        jd3.enableLimit = true;
                        this.m_joint3 = this.m_world.CreateJoint(jd3);
                        const jd4 = new b2.GearJointDef();
                        jd4.bodyA = body1;
                        jd4.bodyB = body2;
                        jd4.joint1 = this.m_joint1;
                        jd4.joint2 = this.m_joint2;
                        jd4.ratio = circle2.m_radius / circle1.m_radius;
                        this.m_joint4 = this.m_world.CreateJoint(jd4);
                        const jd5 = new b2.GearJointDef();
                        jd5.bodyA = body2;
                        jd5.bodyB = body3;
                        jd5.joint1 = this.m_joint2;
                        jd5.joint2 = this.m_joint3;
                        jd5.ratio = -1.0 / circle2.m_radius;
                        this.m_joint5 = this.m_world.CreateJoint(jd5);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // float ratio, value;
                    let ratio;
                    let value;
                    ratio = this.m_joint4.GetRatio();
                    value = this.m_joint1.GetJointAngle() + ratio * this.m_joint2.GetJointAngle();
                    // g_debugDraw.DrawString(5, m_textLine, "theta1 + %4.2f * theta2 = %4.2f", (float) ratio, (float) value);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `theta1 + ${ratio.toFixed(2)} * theta2 = ${value.toFixed(2)}`);
                    // m_textLine += m_textIncrement;
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    ratio = this.m_joint5.GetRatio();
                    value = this.m_joint2.GetJointAngle() + ratio * this.m_joint3.GetJointTranslation();
                    // g_debugDraw.DrawString(5, m_textLine, "theta2 + %4.2f * delta = %4.2f", (float) ratio, (float) value);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `theta2 + ${ratio.toFixed(2)} * delta = ${value.toFixed(2)}`);
                    // m_textLine += m_textIncrement;
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new GearJoint();
                }
            };
            exports_1("GearJoint", GearJoint);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Gear", GearJoint.Create));
        }
    };
});
//# sourceMappingURL=gear_joint.js.map