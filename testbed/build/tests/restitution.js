// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Restitution, testIndex;
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
            // Note: even with a restitution of 1.0, there is some energy change
            // due to position correction.
            Restitution = class Restitution extends testbed.Test {
                constructor() {
                    super();
                    const threshold = 10.0;
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.restitutionThreshold = threshold;
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new b2.CircleShape();
                        shape.m_radius = 1.0;
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        const restitution = [0.0, 0.1, 0.3, 0.5, 0.75, 0.9, 1.0];
                        for (let i = 0; i < 7; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(-10.0 + 3.0 * i, 20.0);
                            const body = this.m_world.CreateBody(bd);
                            fd.restitution = restitution[i];
                            fd.restitutionThreshold = threshold;
                            body.CreateFixture(fd);
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new Restitution();
                }
            };
            exports_1("Restitution", Restitution);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Forces", "Restitution", Restitution.Create));
        }
    };
});
//# sourceMappingURL=restitution.js.map