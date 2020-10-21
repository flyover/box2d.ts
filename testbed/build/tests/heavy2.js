// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Heavy2, testIndex;
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
            Heavy2 = class Heavy2 extends testbed.Test {
                constructor() {
                    super();
                    this.m_heavy = null;
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Set(0.0, 2.5);
                    let body = this.m_world.CreateBody(bd);
                    const shape = new b2.CircleShape();
                    shape.m_radius = 0.5;
                    body.CreateFixture(shape, 10.0);
                    bd.position.Set(0.0, 3.5);
                    body = this.m_world.CreateBody(bd);
                    body.CreateFixture(shape, 10.0);
                }
                ToggleHeavy() {
                    if (this.m_heavy !== null) {
                        this.m_world.DestroyBody(this.m_heavy);
                        this.m_heavy = null;
                    }
                    else {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 9.0);
                        this.m_heavy = this.m_world.CreateBody(bd);
                        const shape = new b2.CircleShape();
                        shape.m_radius = 5.0;
                        this.m_heavy.CreateFixture(shape, 10.0);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "h":
                            this.ToggleHeavy();
                            break;
                    }
                }
                static Create() {
                    return new Heavy2();
                }
            };
            exports_1("Heavy2", Heavy2);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Solver", "Heavy 2", Heavy2.Create));
        }
    };
});
//# sourceMappingURL=heavy2.js.map