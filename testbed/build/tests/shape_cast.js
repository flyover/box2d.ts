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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ShapeCast;
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGVfY2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3NoYXBlX2Nhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsTUFBYSxTQUFVLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBV3pDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQVRILFVBQUssR0FBYyxFQUFFLENBQUM7b0JBQ3RCLGFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2IsY0FBUyxHQUFHLENBQUMsQ0FBQztvQkFFZCxVQUFLLEdBQWMsRUFBRSxDQUFDO29CQUN0QixhQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7b0JBS25CLFFBQVE7b0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUVsQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFH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