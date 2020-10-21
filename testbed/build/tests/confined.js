// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Confined, testIndex;
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
            Confined = class Confined extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        // Floor
                        shape.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(10.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        // Left wall
                        shape.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(-10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                        // Right wall
                        shape.SetTwoSided(new b2.Vec2(10.0, 0.0), new b2.Vec2(10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                        // Roof
                        shape.SetTwoSided(new b2.Vec2(-10.0, 20.0), new b2.Vec2(10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const radius = 0.5;
                    const shape = new b2.CircleShape();
                    shape.m_p.SetZero();
                    shape.m_radius = radius;
                    const fd = new b2.FixtureDef();
                    fd.shape = shape;
                    fd.density = 1.0;
                    fd.friction = 0.1;
                    for (let j = 0; j < Confined.e_columnCount; ++j) {
                        for (let i = 0; i < Confined.e_rowCount; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(-10.0 + (2.1 * j + 1.0 + 0.01 * i) * radius, (2.0 * i + 1.0) * radius);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                        }
                    }
                    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
                }
                CreateCircle() {
                    const radius = 2.0;
                    const shape = new b2.CircleShape();
                    shape.m_p.SetZero();
                    shape.m_radius = radius;
                    const fd = new b2.FixtureDef();
                    fd.shape = shape;
                    fd.density = 1.0;
                    fd.friction = 0.0;
                    const p = new b2.Vec2(b2.Random(), 3.0 + b2.Random());
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(p);
                    //bd.allowSleep = false;
                    const body = this.m_world.CreateBody(bd);
                    body.CreateFixture(fd);
                }
                Keyboard(key) {
                    switch (key) {
                        case "c":
                            this.CreateCircle();
                            break;
                    }
                }
                Step(settings) {
                    let sleeping = true;
                    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
                        if (b.GetType() !== b2.BodyType.b2_dynamicBody) {
                            continue;
                        }
                        if (b.IsAwake()) {
                            sleeping = false;
                        }
                    }
                    if (this.m_stepCount === 180) {
                        this.m_stepCount += 0;
                    }
                    if (sleeping) {
                        // this.CreateCircle();
                    }
                    super.Step(settings);
                    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
                        if (b.GetType() !== b2.BodyType.b2_dynamicBody) {
                            continue;
                        }
                        // const p = b.GetPosition();
                        // if (p.x <= -10.0 || 10.0 <= p.x || p.y <= 0.0 || 20.0 <= p.y) {
                        //   p.x += 0.0;
                        // }
                    }
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'c' to create a circle.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Confined();
                }
            };
            exports_1("Confined", Confined);
            Confined.e_columnCount = 0;
            Confined.e_rowCount = 0;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Solver", "Confined", Confined.Create));
        }
    };
});
//# sourceMappingURL=confined.js.map