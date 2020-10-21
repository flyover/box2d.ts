// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Tumbler, testIndex;
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
            Tumbler = class Tumbler extends testbed.Test {
                constructor() {
                    super();
                    this.m_count = 0;
                    const ground = this.m_world.CreateBody(new b2.BodyDef());
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.allowSleep = false;
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 10.0, new b2.Vec2(10.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(0.5, 10.0, new b2.Vec2(-10.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(10.0, 0.5, new b2.Vec2(0.0, 10.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(10.0, 0.5, new b2.Vec2(0.0, -10.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        const jd = new b2.RevoluteJointDef();
                        jd.bodyA = ground;
                        jd.bodyB = body;
                        jd.localAnchorA.Set(0.0, 10.0);
                        jd.localAnchorB.Set(0.0, 0.0);
                        jd.referenceAngle = 0.0;
                        jd.motorSpeed = 0.05 * b2.pi;
                        jd.maxMotorTorque = 1e8;
                        jd.enableMotor = true;
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                    this.m_count = 0;
                }
                Step(settings) {
                    super.Step(settings);
                    if (this.m_count < Tumbler.e_count) {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.125, 0.125);
                        body.CreateFixture(shape, 1.0);
                        ++this.m_count;
                    }
                }
                static Create() {
                    return new Tumbler();
                }
            };
            exports_1("Tumbler", Tumbler);
            Tumbler.e_count = 800;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Benchmark", "Tumbler", Tumbler.Create));
        }
    };
});
//# sourceMappingURL=tumbler.js.map