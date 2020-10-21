// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ShapeCast, testIndex;
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
            ShapeCast = class ShapeCast extends testbed.Test {
                constructor() {
                    super();
                    this.m_vAs = [];
                    this.m_countA = 0;
                    this.m_radiusA = 0;
                    this.m_vBs = [];
                    this.m_countB = 0;
                    this.m_radiusB = 0;
                    // #if 1
                    this.m_vAs[0] = new b2.Vec2(-0.5, 1.0);
                    this.m_vAs[1] = new b2.Vec2(0.5, 1.0);
                    this.m_vAs[2] = new b2.Vec2(0.0, 0.0);
                    this.m_countA = 3;
                    this.m_radiusA = b2.polygonRadius;
                    this.m_vBs[0] = new b2.Vec2(-0.5, -0.5);
                    this.m_vBs[1] = new b2.Vec2(0.5, -0.5);
                    this.m_vBs[2] = new b2.Vec2(0.5, 0.5);
                    this.m_vBs[3] = new b2.Vec2(-0.5, 0.5);
                    this.m_countB = 4;
                    this.m_radiusB = b2.polygonRadius;
                    // #else
                    // this.m_vAs[0] = new b2.Vec2(0.0, 0.0);
                    // this.m_countA = 1;
                    // this.m_radiusA = 0.5;
                    // this.m_vBs[0] = new b2.Vec2(0.0, 0.0);
                    // this.m_countB = 1;
                    // this.m_radiusB = 0.5;
                    // #endif
                }
                Step(settings) {
                    super.Step(settings);
                    const transformA = new b2.Transform();
                    transformA.p.Set(0.0, 0.25);
                    transformA.q.SetIdentity();
                    const transformB = new b2.Transform();
                    transformB.SetIdentity();
                    const input = new b2.ShapeCastInput();
                    input.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    input.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    input.transformA.Copy(transformA);
                    input.transformB.Copy(transformB);
                    input.translationB.Set(8.0, 0.0);
                    const output = new b2.ShapeCastOutput();
                    const hit = b2.ShapeCast(output, input);
                    const transformB2 = new b2.Transform();
                    transformB2.q.Copy(transformB.q);
                    // transformB2.p = transformB.p + output.lambda * input.translationB;
                    transformB2.p.Copy(transformB.p).SelfMulAdd(output.lambda, input.translationB);
                    const distanceInput = new b2.DistanceInput();
                    distanceInput.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    distanceInput.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    distanceInput.transformA.Copy(transformA);
                    distanceInput.transformB.Copy(transformB2);
                    distanceInput.useRadii = false;
                    const simplexCache = new b2.SimplexCache();
                    simplexCache.count = 0;
                    const distanceOutput = new b2.DistanceOutput();
                    b2.Distance(distanceOutput, simplexCache, distanceInput);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.PushTransform(transformA);
                    // testbed.g_debugDraw.DrawCircle(this.m_vAs[0], this.m_radiusA, new b2.Color(0.9, 0.9, 0.9));
                    testbed.g_debugDraw.DrawPolygon(this.m_vAs, this.m_countA, new b2.Color(0.9, 0.9, 0.9));
                    testbed.g_debugDraw.PopTransform(transformA);
                    testbed.g_debugDraw.PushTransform(transformB);
                    // testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2.Color(0.5, 0.9, 0.5));
                    testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2.Color(0.5, 0.9, 0.5));
                    testbed.g_debugDraw.PopTransform(transformB);
                    testbed.g_debugDraw.PushTransform(transformB2);
                    // testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2.Color(0.5, 0.7, 0.9));
                    testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2.Color(0.5, 0.7, 0.9));
                    testbed.g_debugDraw.PopTransform(transformB2);
                    if (hit) {
                        const p1 = output.point;
                        testbed.g_debugDraw.DrawPoint(p1, 10.0, new b2.Color(0.9, 0.3, 0.3));
                        // b2Vec2 p2 = p1 + output.normal;
                        const p2 = b2.Vec2.AddVV(p1, output.normal, new b2.Vec2());
                        testbed.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.3, 0.3));
                    }
                }
                static Create() {
                    return new ShapeCast();
                }
            };
            exports_1("ShapeCast", ShapeCast);
            ShapeCast.e_vertexCount = 8;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Collision", "Shape Cast", ShapeCast.Create));
        }
    };
});
//# sourceMappingURL=shape_cast.js.map