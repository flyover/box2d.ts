// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, AddPair, testIndex;
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
            AddPair = class AddPair extends testbed.Test {
                constructor() {
                    super();
                    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
                    {
                        const shape = new b2.CircleShape();
                        shape.m_p.SetZero();
                        shape.m_radius = 0.1;
                        const minX = -6.0;
                        const maxX = 0.0;
                        const minY = 4.0;
                        const maxY = 6.0;
                        for (let i = 0; i < 400; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(b2.RandomRange(minX, maxX), b2.RandomRange(minY, maxY));
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 0.01);
                        }
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(1.5, 1.5);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-40.0, 5.0);
                        bd.bullet = true;
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 1.0);
                        body.SetLinearVelocity(new b2.Vec2(10.0, 0.0));
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new AddPair();
                }
            };
            exports_1("AddPair", AddPair);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Benchmark", "Add Pair", AddPair.Create));
        }
    };
});
//# sourceMappingURL=add_pair.js.map