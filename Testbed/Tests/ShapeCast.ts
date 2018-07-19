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

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class ShapeCast extends testbed.Test {
  public static e_vertexCount = 8;

  public m_vAs: box2d.b2Vec2[] = [];
  public m_countA = 0;
  public m_radiusA = 0;

  public m_vBs: box2d.b2Vec2[] = [];
  public m_countB = 0;
  public m_radiusB = 0;

  constructor() {
    super();

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

  public Step(settings: testbed.Settings): void {
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

    testbed.g_debugDraw.DrawString(5, this.m_textLine,
      `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
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

  public static Create(): testbed.Test {
    return new ShapeCast();
  }
}
