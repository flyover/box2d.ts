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
                    this.m_vAs = b2.Vec2.MakeArray(b2.maxPolygonVertices);
                    this.m_countA = 0;
                    this.m_radiusA = 0;
                    this.m_vBs = b2.Vec2.MakeArray(b2.maxPolygonVertices);
                    this.m_countB = 0;
                    this.m_radiusB = 0;
                    this.m_transformA = new b2.Transform();
                    this.m_transformB = new b2.Transform();
                    this.m_translationB = new b2.Vec2();
                    // #if 1
                    this.m_vAs[0].Set(-0.5, 1.0);
                    this.m_vAs[1].Set(0.5, 1.0);
                    this.m_vAs[2].Set(0.0, 0.0);
                    this.m_countA = 3;
                    this.m_radiusA = b2.polygonRadius;
                    this.m_vBs[0].Set(-0.5, -0.5);
                    this.m_vBs[1].Set(0.5, -0.5);
                    this.m_vBs[2].Set(0.5, 0.5);
                    this.m_vBs[3].Set(-0.5, 0.5);
                    this.m_countB = 4;
                    this.m_radiusB = b2.polygonRadius;
                    this.m_transformA.p.Set(0.0, 0.25);
                    this.m_transformA.q.SetIdentity();
                    this.m_transformB.p.Set(-4.0, 0.0);
                    this.m_transformB.q.SetIdentity();
                    this.m_translationB.Set(8.0, 0.0);
                    // #elif 0
                    // this.m_vAs[0].Set(0.0, 0.0);
                    // this.m_countA = 1;
                    // this.m_radiusA = 0.5;
                    // this.m_vBs[0].Set(0.0, 0.0);
                    // this.m_countB = 1;
                    // this.m_radiusB = 0.5;
                    // this.m_transformA.p.Set(0.0, 0.25);
                    // this.m_transformA.q.SetIdentity();
                    // this.m_transformB.p.Set(-4.0, 0.0);
                    // this.m_transformB.q.SetIdentity();
                    // this.m_translationB.Set(8.0, 0.0);
                    // #else
                    // this.m_vAs[0].Set(0.0, 0.0);
                    // this.m_vAs[1].Set(2.0, 0.0);
                    // this.m_countA = 2;
                    // this.m_radiusA = b2.polygonRadius;
                    // this.m_vBs[0].Set(0.0, 0.0);
                    // this.m_countB = 1;
                    // this.m_radiusB = 0.25;
                    // // Initial overlap
                    // this.m_transformA.p.Set(0.0, 0.0);
                    // this.m_transformA.q.SetIdentity();
                    // this.m_transformB.p.Set(-0.244360745, 0.05999358);
                    // this.m_transformB.q.SetIdentity();
                    // this.m_translationB.Set(0.0, 0.0399999991);
                    // #endif
                }
                Step(settings) {
                    super.Step(settings);
                    const input = new b2.ShapeCastInput();
                    input.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    input.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    input.transformA.Copy(this.m_transformA);
                    input.transformB.Copy(this.m_transformB);
                    input.translationB.Copy(this.m_translationB);
                    const output = new b2.ShapeCastOutput();
                    const hit = b2.ShapeCast(output, input);
                    const transformB2 = new b2.Transform();
                    transformB2.q.Copy(this.m_transformB.q);
                    // transformB2.p = transformB.p + output.lambda * input.translationB;
                    transformB2.p.Copy(this.m_transformB.p).SelfMulAdd(output.lambda, input.translationB);
                    const distanceInput = new b2.DistanceInput();
                    distanceInput.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    distanceInput.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    distanceInput.transformA.Copy(this.m_transformA);
                    distanceInput.transformB.Copy(transformB2);
                    distanceInput.useRadii = false;
                    const simplexCache = new b2.SimplexCache();
                    simplexCache.count = 0;
                    const distanceOutput = new b2.DistanceOutput();
                    b2.Distance(distanceOutput, simplexCache, distanceInput);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.PushTransform(this.m_transformA);
                    if (this.m_countA === 1) {
                        testbed.g_debugDraw.DrawCircle(this.m_vAs[0], this.m_radiusA, new b2.Color(0.9, 0.9, 0.9));
                    }
                    else {
                        testbed.g_debugDraw.DrawPolygon(this.m_vAs, this.m_countA, new b2.Color(0.9, 0.9, 0.9));
                    }
                    testbed.g_debugDraw.PopTransform(this.m_transformA);
                    testbed.g_debugDraw.PushTransform(this.m_transformB);
                    if (this.m_countB === 1) {
                        testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2.Color(0.5, 0.9, 0.5));
                    }
                    else {
                        testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2.Color(0.5, 0.9, 0.5));
                    }
                    testbed.g_debugDraw.PopTransform(this.m_transformB);
                    testbed.g_debugDraw.PushTransform(transformB2);
                    if (this.m_countB === 1) {
                        testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2.Color(0.5, 0.7, 0.9));
                    }
                    else {
                        testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2.Color(0.5, 0.7, 0.9));
                    }
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