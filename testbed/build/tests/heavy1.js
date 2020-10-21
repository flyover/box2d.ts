// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Heavy1, testIndex;
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
            Heavy1 = class Heavy1 extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Set(0.0, 0.5);
                    let body = this.m_world.CreateBody(bd);
                    const shape = new b2.CircleShape();
                    shape.m_radius = 0.5;
                    body.CreateFixture(shape, 10.0);
                    bd.position.Set(0.0, 6.0);
                    body = this.m_world.CreateBody(bd);
                    shape.m_radius = 5.0;
                    body.CreateFixture(shape, 10.0);
                }
                static Create() {
                    return new Heavy1();
                }
            };
            exports_1("Heavy1", Heavy1);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Solver", "Heavy 1", Heavy1.Create));
        }
    };
});
//# sourceMappingURL=heavy1.js.map