// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Pyramid, testIndex;
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
            Pyramid = class Pyramid extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const a = 0.5;
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(a, a);
                        const x = new b2.Vec2(-7.0, 0.75);
                        const y = new b2.Vec2(0.0, 0.0);
                        const deltaX = new b2.Vec2(0.5625, 1.25);
                        const deltaY = new b2.Vec2(1.125, 0.0);
                        for (let i = 0; i < Pyramid.e_count; ++i) {
                            y.Copy(x);
                            for (let j = i; j < Pyramid.e_count; ++j) {
                                const bd = new b2.BodyDef();
                                bd.type = b2.BodyType.b2_dynamicBody;
                                bd.position.Copy(y);
                                const body = this.m_world.CreateBody(bd);
                                body.CreateFixture(shape, 5.0);
                                y.SelfAdd(deltaY);
                            }
                            x.SelfAdd(deltaX);
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // b2.DynamicTree* tree = &m_world.m_contactManager.m_broadPhase.m_tree;
                    // if (m_stepCount === 400) {
                    //   tree.RebuildBottomUp();
                    // }
                }
                static Create() {
                    return new Pyramid();
                }
            };
            exports_1("Pyramid", Pyramid);
            Pyramid.e_count = 20;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Stacking", "Pyramid", Pyramid.Create));
        }
    };
});
//# sourceMappingURL=pyramid.js.map