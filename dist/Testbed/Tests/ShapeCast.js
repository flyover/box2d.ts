/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, ShapeCast;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
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
                    this.m_vAs[0] = new box2d.b2Vec2(-0.5, 1.0);
                    this.m_vAs[1] = new box2d.b2Vec2(0.5, 1.0);
                    this.m_vAs[2] = new box2d.b2Vec2(0.0, 0.0);
                    this.m_countA = 3;
                    this.m_radiusA = box2d.b2_polygonRadius;
                    this.m_vBs[0] = new box2d.b2Vec2(-0.5, -0.5);
                    this.m_vBs[1] = new box2d.b2Vec2(0.5, -0.5);
                    this.m_vBs[2] = new box2d.b2Vec2(0.5, 0.5);
                    this.m_vBs[3] = new box2d.b2Vec2(-0.5, 0.5);
                    this.m_countB = 4;
                    this.m_radiusB = box2d.b2_polygonRadius;
                    // #else
                    // this.m_vAs[0] = new box2d.b2Vec2(0.0, 0.0);
                    // this.m_countA = 1;
                    // this.m_radiusA = 0.5;
                    // this.m_vBs[0] = new box2d.b2Vec2(0.0, 0.0);
                    // this.m_countB = 1;
                    // this.m_radiusB = 0.5;
                    // #endif
                }
                Step(settings) {
                    super.Step(settings);
                    const transformA = new box2d.b2Transform();
                    transformA.p.Set(0.0, 0.25);
                    transformA.q.SetIdentity();
                    const transformB = new box2d.b2Transform();
                    transformB.SetIdentity();
                    const input = new box2d.b2ShapeCastInput();
                    input.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    input.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    input.transformA.Copy(transformA);
                    input.transformB.Copy(transformB);
                    input.translationB.Set(8.0, 0.0);
                    const output = new box2d.b2ShapeCastOutput();
                    const hit = box2d.b2ShapeCast(output, input);
                    const transformB2 = new box2d.b2Transform();
                    transformB2.q.Copy(transformB.q);
                    // transformB2.p = transformB.p + output.lambda * input.translationB;
                    transformB2.p.Copy(transformB.p).SelfMulAdd(output.lambda, input.translationB);
                    const distanceInput = new box2d.b2DistanceInput();
                    distanceInput.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
                    distanceInput.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
                    distanceInput.transformA.Copy(transformA);
                    distanceInput.transformB.Copy(transformB2);
                    distanceInput.useRadii = false;
                    const simplexCache = new box2d.b2SimplexCache();
                    simplexCache.count = 0;
                    const distanceOutput = new box2d.b2DistanceOutput();
                    box2d.b2Distance(distanceOutput, simplexCache, distanceInput);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.PushTransform(transformA);
                    // testbed.g_debugDraw.DrawCircle(this.m_vAs[0], this.m_radiusA, new box2d.b2Color(0.9, 0.9, 0.9));
                    testbed.g_debugDraw.DrawPolygon(this.m_vAs, this.m_countA, new box2d.b2Color(0.9, 0.9, 0.9));
                    testbed.g_debugDraw.PopTransform(transformA);
                    testbed.g_debugDraw.PushTransform(transformB);
                    // testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new box2d.b2Color(0.5, 0.9, 0.5));
                    testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new box2d.b2Color(0.5, 0.9, 0.5));
                    testbed.g_debugDraw.PopTransform(transformB);
                    testbed.g_debugDraw.PushTransform(transformB2);
                    // testbed.g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new box2d.b2Color(0.5, 0.7, 0.9));
                    testbed.g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new box2d.b2Color(0.5, 0.7, 0.9));
                    testbed.g_debugDraw.PopTransform(transformB2);
                    if (hit) {
                        const p1 = output.point;
                        testbed.g_debugDraw.DrawPoint(p1, 10.0, new box2d.b2Color(0.9, 0.3, 0.3));
                        // b2Vec2 p2 = p1 + output.normal;
                        const p2 = box2d.b2Vec2.AddVV(p1, output.normal, new box2d.b2Vec2());
                        testbed.g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.3, 0.3));
                    }
                }
                static Create() {
                    return new ShapeCast();
                }
            };
            ShapeCast.e_vertexCount = 8;
            exports_1("ShapeCast", ShapeCast);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcGVDYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9TaGFwZUNhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsZUFBdUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFXekM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBVEgsVUFBSyxHQUFtQixFQUFFLENBQUM7b0JBQzNCLGFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2IsY0FBUyxHQUFHLENBQUMsQ0FBQztvQkFFZCxVQUFLLEdBQW1CLEVBQUUsQ0FBQztvQkFDM0IsYUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUtuQixRQUFRO29CQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDO29CQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMs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