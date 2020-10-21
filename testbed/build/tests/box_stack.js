// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, BoxStack, testIndex;
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
            BoxStack = class BoxStack extends testbed.Test {
                constructor() {
                    super();
                    this.m_bullet = null;
                    this.m_bodies = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
                    this.m_indices = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new b2.Vec2(20.0, 0.0), new b2.Vec2(20.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const xs = [0.0, -10.0, -5.0, 5.0, 10.0];
                    for (let j = 0; j < BoxStack.e_columnCount; ++j) {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        for (let i = 0; i < BoxStack.e_rowCount; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            const n = j * BoxStack.e_rowCount + i;
                            // DEBUG: b2.Assert(n < BoxStack.e_rowCount * BoxStack.e_columnCount);
                            this.m_indices[n] = n;
                            bd.userData = this.m_indices[n];
                            const x = 0.0;
                            //const x = b2.RandomRange(-0.02, 0.02);
                            //const x = i % 2 === 0 ? -0.01 : 0.01;
                            bd.position.Set(xs[j] + x, 0.55 + 1.1 * i);
                            const body = this.m_world.CreateBody(bd);
                            this.m_bodies[n] = body;
                            body.CreateFixture(fd);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case ",":
                            if (this.m_bullet) {
                                this.m_world.DestroyBody(this.m_bullet);
                                this.m_bullet = null;
                            }
                            {
                                const shape = new b2.CircleShape();
                                shape.m_radius = 0.25;
                                const fd = new b2.FixtureDef();
                                fd.shape = shape;
                                fd.density = 20.0;
                                fd.restitution = 0.05;
                                const bd = new b2.BodyDef();
                                bd.type = b2.BodyType.b2_dynamicBody;
                                bd.bullet = true;
                                bd.position.Set(-31.0, 5.0);
                                this.m_bullet = this.m_world.CreateBody(bd);
                                this.m_bullet.CreateFixture(fd);
                                this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
                            }
                            break;
                        case "b":
                            b2.set_g_blockSolve(!b2.get_g_blockSolve());
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(b2.blockSolve) ? (1) : (0)}`);
                    //if (this.m_stepCount === 300)
                    //{
                    //  if (this.m_bullet !== null)
                    //  {
                    //    this.m_world.DestroyBody(this.m_bullet);
                    //    this.m_bullet = null;
                    //  }
                    //  {
                    //    const shape = new b2.CircleShape();
                    //    shape.m_radius = 0.25;
                    //    const fd = new b2.FixtureDef();
                    //    fd.shape = shape;
                    //    fd.density = 20.0;
                    //    fd.restitution = 0.05;
                    //    const bd = new b2.BodyDef();
                    //    bd.type = b2.BodyType.b2_dynamicBody;
                    //    bd.bullet = true;
                    //    bd.position.Set(-31.0, 5.0);
                    //    this.m_bullet = this.m_world.CreateBody(bd);
                    //    this.m_bullet.CreateFixture(fd);
                    //    this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
                    //  }
                    //}
                }
                static Create() {
                    return new BoxStack();
                }
            };
            exports_1("BoxStack", BoxStack);
            BoxStack.e_columnCount = 1;
            BoxStack.e_rowCount = 15;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Stacking", "Boxes", BoxStack.Create));
        }
    };
});
//# sourceMappingURL=box_stack.js.map