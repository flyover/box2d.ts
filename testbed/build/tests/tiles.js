// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Tiles, testIndex;
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
            /// This stress tests the dynamic tree broad-phase. This also shows that tile
            /// based collision is _not_ smooth due to Box2D not knowing about adjacency.
            Tiles = class Tiles extends testbed.Test {
                constructor() {
                    super();
                    this.m_fixtureCount = 0;
                    this.m_createTime = 0.0;
                    this.m_fixtureCount = 0;
                    const timer = new b2.Timer();
                    {
                        const a = 0.5;
                        const bd = new b2.BodyDef();
                        bd.position.y = -a;
                        const ground = this.m_world.CreateBody(bd);
                        {
                            const N = 200;
                            const M = 10;
                            const position = new b2.Vec2();
                            position.y = 0.0;
                            for (let j = 0; j < M; ++j) {
                                position.x = -N * a;
                                for (let i = 0; i < N; ++i) {
                                    const shape = new b2.PolygonShape();
                                    shape.SetAsBox(a, a, position, 0.0);
                                    ground.CreateFixture(shape, 0.0);
                                    ++this.m_fixtureCount;
                                    position.x += 2.0 * a;
                                }
                                position.y -= 2.0 * a;
                            }
                        }
                        //    else
                        //    {
                        //     const N = 200;
                        //     const M = 10;
                        //      const position = new b2.Vec2();
                        //      position.x = -N * a;
                        //      for (let i = 0; i < N; ++i)
                        //      {
                        //        position.y = 0.0;
                        //        for (let j = 0; j < M; ++j)
                        //        {
                        //          const shape = new b2.PolygonShape();
                        //          shape.SetAsBox(a, a, position, 0.0);
                        //          ground.CreateFixture(shape, 0.0);
                        //          position.y -= 2.0 * a;
                        //        }
                        //        position.x += 2.0 * a;
                        //      }
                        //    }
                    }
                    {
                        const a = 0.5;
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(a, a);
                        const x = new b2.Vec2(-7.0, 0.75);
                        const y = new b2.Vec2();
                        const deltaX = new b2.Vec2(0.5625, 1.25);
                        const deltaY = new b2.Vec2(1.125, 0.0);
                        for (let i = 0; i < Tiles.e_count; ++i) {
                            y.Copy(x);
                            for (let j = i; j < Tiles.e_count; ++j) {
                                const bd = new b2.BodyDef();
                                bd.type = b2.BodyType.b2_dynamicBody;
                                bd.position.Copy(y);
                                //if (i === 0 && j === 0)
                                //{
                                //  bd.allowSleep = false;
                                //}
                                //else
                                //{
                                //  bd.allowSleep = true;
                                //}
                                const body = this.m_world.CreateBody(bd);
                                body.CreateFixture(shape, 5.0);
                                ++this.m_fixtureCount;
                                y.SelfAdd(deltaY);
                            }
                            x.SelfAdd(deltaX);
                        }
                    }
                    this.m_createTime = timer.GetMilliseconds();
                }
                Step(settings) {
                    const cm = this.m_world.GetContactManager();
                    const height = cm.m_broadPhase.GetTreeHeight();
                    const leafCount = cm.m_broadPhase.GetProxyCount();
                    const minimumNodeCount = 2 * leafCount - 1;
                    const minimumHeight = Math.ceil(Math.log(minimumNodeCount) / Math.log(2.0));
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}, min = ${minimumHeight}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `create time = ${this.m_createTime.toFixed(2)} ms, fixture count = ${this.m_fixtureCount}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    //b2.DynamicTree* tree = this.m_world.this.m_contactManager.m_broadPhase.m_tree;
                    //if (this.m_stepCount === 400)
                    //{
                    //  tree.RebuildBottomUp();
                    //}
                }
                static Create() {
                    return new Tiles();
                }
            };
            exports_1("Tiles", Tiles);
            Tiles.e_count = 20;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Benchmark", "Tiles", Tiles.Create));
        }
    };
});
//# sourceMappingURL=tiles.js.map