// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class ShapeCast extends testbed.Test {
  public static e_vertexCount = 8;

  public m_vAs: b2.Vec2[] = [];
  public m_countA = 0;
  public m_radiusA = 0;

  public m_vBs: b2.Vec2[] = [];
  public m_countB = 0;
  public m_radiusB = 0;

  constructor() {
    super();

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

  public Step(settings: testbed.Settings): void {
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

    testbed.g_debugDraw.DrawString(5, this.m_textLine,
      `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
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

  public static Create(): testbed.Test {
    return new ShapeCast();
  }
}

export const testIndex: number = testbed.RegisterTest("Collision", "Shape Cast", ShapeCast.Create);
