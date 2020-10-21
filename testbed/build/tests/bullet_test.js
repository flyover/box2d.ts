// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, BulletTest, testIndex;
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
            BulletTest = class BulletTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_x = 0;
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 0.0);
                        const body = this.m_world.CreateBody(bd);
                        const edge = new b2.EdgeShape();
                        edge.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(10.0, 0.0));
                        body.CreateFixture(edge, 0.0);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.2, 1.0, new b2.Vec2(0.5, 1.0), 0.0);
                        body.CreateFixture(shape, 0.0);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 4.0);
                        const box = new b2.PolygonShape();
                        box.SetAsBox(2.0, 0.1);
                        this.m_body = this.m_world.CreateBody(bd);
                        this.m_body.CreateFixture(box, 1.0);
                        box.SetAsBox(0.25, 0.25);
                        //this.m_x = b2.RandomRange(-1.0, 1.0);
                        this.m_x = 0.20352793;
                        bd.position.Set(this.m_x, 10.0);
                        bd.bullet = true;
                        this.m_bullet = this.m_world.CreateBody(bd);
                        this.m_bullet.CreateFixture(box, 100.0);
                        this.m_bullet.SetLinearVelocity(new b2.Vec2(0.0, -50.0));
                    }
                }
                Launch() {
                    this.m_body.SetTransformVec(new b2.Vec2(0.0, 4.0), 0.0);
                    this.m_body.SetLinearVelocity(b2.Vec2_zero);
                    this.m_body.SetAngularVelocity(0.0);
                    this.m_x = b2.RandomRange(-1.0, 1.0);
                    this.m_bullet.SetTransformVec(new b2.Vec2(this.m_x, 10.0), 0.0);
                    this.m_bullet.SetLinearVelocity(new b2.Vec2(0.0, -50.0));
                    this.m_bullet.SetAngularVelocity(0.0);
                    //  extern int32 b2.gjkCalls, b2.gjkIters, b2.gjkMaxIters;
                    //  extern int32 b2.toiCalls, b2.toiIters, b2.toiMaxIters;
                    //  extern int32 b2.toiRootIters, b2.toiMaxRootIters;
                    // b2.gjkCalls = 0;
                    // b2.gjkIters = 0;
                    // b2.gjkMaxIters = 0;
                    b2.gjk_reset();
                    // b2.toiCalls = 0;
                    // b2.toiIters = 0;
                    // b2.toiMaxIters = 0;
                    // b2.toiRootIters = 0;
                    // b2.toiMaxRootIters = 0;
                    b2.toi_reset();
                }
                Step(settings) {
                    super.Step(settings);
                    if (b2.gjkCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${b2.gjkCalls.toFixed(0)}, ave gjk iters = ${(b2.gjkIters / b2.gjkCalls).toFixed(1)}, max gjk iters = ${b2.gjkMaxIters.toFixed(0)}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    if (b2.toiCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi calls = %d, ave toi iters = %3.1f, max toi iters = %d",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi calls = ${b2.toiCalls}, ave toi iters = ${(b2.toiIters / b2.toiCalls).toFixed(1)}, max toi iters = ${b2.toiMaxRootIters}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave toi root iters = %3.1f, max toi root iters = %d",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave toi root iters = ${(b2.toiRootIters / b2.toiCalls).toFixed(1)}, max toi root iters = ${b2.toiMaxRootIters}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    if (this.m_stepCount % 60 === 0) {
                        this.Launch();
                    }
                }
                static Create() {
                    return new BulletTest();
                }
            };
            exports_1("BulletTest", BulletTest);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Continuous", "Bullet Test", BulletTest.Create));
        }
    };
});
//# sourceMappingURL=bullet_test.js.map