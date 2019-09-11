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
            exports_1("ShapeCast", ShapeCast);
            ShapeCast.e_vertexCount = 8;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcGVDYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2hhcGVDYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixZQUFBLE1BQWEsU0FBVSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVd6QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFUSCxVQUFLLEdBQW1CLEVBQUUsQ0FBQztvQkFDM0IsYUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUVkLFVBQUssR0FBbUIsRUFBRSxDQUFDO29CQUMzQixhQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7b0JBS25CLFFBQVE7b0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7b0JBRXhDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFL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