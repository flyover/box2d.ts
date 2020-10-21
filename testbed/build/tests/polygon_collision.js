// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, PolygonCollision, testIndex;
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
            PolygonCollision = class PolygonCollision extends testbed.Test {
                constructor() {
                    super();
                    this.m_polygonA = new b2.PolygonShape();
                    this.m_polygonB = new b2.PolygonShape();
                    this.m_transformA = new b2.Transform();
                    this.m_transformB = new b2.Transform();
                    this.m_positionB = new b2.Vec2();
                    this.m_angleB = 0;
                    {
                        this.m_polygonA.SetAsBox(0.2, 0.4);
                        this.m_transformA.SetPositionAngle(new b2.Vec2(0.0, 0.0), 0.0);
                    }
                    {
                        this.m_polygonB.SetAsBox(0.5, 0.5);
                        this.m_positionB.Set(19.345284, 1.5632932);
                        this.m_angleB = 1.9160721;
                        this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_positionB.x -= 0.1;
                            break;
                        case "d":
                            this.m_positionB.x += 0.1;
                            break;
                        case "s":
                            this.m_positionB.y -= 0.1;
                            break;
                        case "w":
                            this.m_positionB.y += 0.1;
                            break;
                        case "q":
                            this.m_angleB += 0.1 * b2.pi;
                            break;
                        case "e":
                            this.m_angleB -= 0.1 * b2.pi;
                            break;
                    }
                    this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
                }
                Step(settings) {
                    const manifold = new b2.Manifold();
                    b2.CollidePolygons(manifold, this.m_polygonA, this.m_transformA, this.m_polygonB, this.m_transformB);
                    const worldManifold = new b2.WorldManifold();
                    worldManifold.Initialize(manifold, this.m_transformA, this.m_polygonA.m_radius, this.m_transformB, this.m_polygonB.m_radius);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `point count = ${manifold.pointCount}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    {
                        const color = new b2.Color(0.9, 0.9, 0.9);
                        const v = [];
                        for (let i = 0; i < this.m_polygonA.m_count; ++i) {
                            v[i] = b2.Transform.MulXV(this.m_transformA, this.m_polygonA.m_vertices[i], new b2.Vec2());
                        }
                        testbed.g_debugDraw.DrawPolygon(v, this.m_polygonA.m_count, color);
                        for (let i = 0; i < this.m_polygonB.m_count; ++i) {
                            v[i] = b2.Transform.MulXV(this.m_transformB, this.m_polygonB.m_vertices[i], new b2.Vec2());
                        }
                        testbed.g_debugDraw.DrawPolygon(v, this.m_polygonB.m_count, color);
                    }
                    for (let i = 0; i < manifold.pointCount; ++i) {
                        testbed.g_debugDraw.DrawPoint(worldManifold.points[i], 4.0, new b2.Color(0.9, 0.3, 0.3));
                    }
                    super.Step(settings);
                }
                static Create() {
                    return new PolygonCollision();
                }
            };
            exports_1("PolygonCollision", PolygonCollision);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Geometry", "Polygon Collision", PolygonCollision.Create));
        }
    };
});
//# sourceMappingURL=polygon_collision.js.map