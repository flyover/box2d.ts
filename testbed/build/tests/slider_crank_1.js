// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, SliderCrank1, testIndex;
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
            SliderCrank1 = class SliderCrank1 extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 17.0);
                        ground = this.m_world.CreateBody(bd);
                    }
                    {
                        let prevBody = ground;
                        // Define crank.
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(4.0, 1.0);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(-8.0, 20.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(-12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define connecting rod
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(8.0, 1.0);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(4.0, 20.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(-4.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define piston
                        {
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(3.0, 3.0);
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.fixedRotation = true;
                            bd.position.Set(12.0, 20.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            const pjd = new b2.PrismaticJointDef();
                            pjd.Initialize(ground, body, new b2.Vec2(12.0, 17.0), new b2.Vec2(1.0, 0.0));
                            this.m_world.CreateJoint(pjd);
                        }
                    }
                }
                static Create() {
                    return new SliderCrank1();
                }
            };
            exports_1("SliderCrank1", SliderCrank1);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Slider Crank 1", SliderCrank1.Create));
        }
    };
});
//# sourceMappingURL=slider_crank_1.js.map