/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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

export class TimeOfImpact extends testbed.Test {
  public m_shapeA: box2d.b2PolygonShape = new box2d.b2PolygonShape();
  public m_shapeB: box2d.b2PolygonShape = new box2d.b2PolygonShape();

  constructor() {
    super();

    this.m_shapeA.SetAsBox(25.0, 5.0);
    this.m_shapeB.SetAsBox(2.5, 2.5);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const sweepA = new box2d.b2Sweep();
    sweepA.c0.Set(0.0, 20.0 + 8.0 * Math.cos(Date.now() / 1000)); // (24.0, -60.0);
    sweepA.a0 = 2.95;
    sweepA.c.Copy(sweepA.c0);
    sweepA.a = sweepA.a0;
    sweepA.localCenter.SetZero();

    const sweepB = new box2d.b2Sweep();
    sweepB.c0.Set(20.0, 40.0); // (53.474274, -50.252514);
    sweepB.a0 = 0.1; // 513.36676; // - 162.0 * box2d.b2_pi;
    sweepB.c.Set(-20.0, 0.0); // (54.595478, -51.083473);
    sweepB.a = 3.1; // 513.62781; //  - 162.0 * box2d.b2_pi;
    sweepB.localCenter.SetZero();

    //sweepB.a0 -= 300.0 * box2d.b2_pi;
    //sweepB.a -= 300.0 * box2d.b2_pi;

    const input = new box2d.b2TOIInput();
    input.proxyA.SetShape(this.m_shapeA, 0);
    input.proxyB.SetShape(this.m_shapeB, 0);
    input.sweepA.Copy(sweepA);
    input.sweepB.Copy(sweepB);
    input.tMax = 1.0;

    const output = new box2d.b2TOIOutput();

    box2d.b2TimeOfImpact(output, input);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi = ${output.t.toFixed(3)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `max toi iters = ${box2d.b2_toiMaxIters}, max root iters = ${box2d.b2_toiMaxRootIters}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    const vertices = [];

    const transformA = new box2d.b2Transform();
    sweepA.GetTransform(transformA, 0.0);
    for (let i = 0; i < this.m_shapeA.m_count; ++i) {
      vertices[i] = box2d.b2Transform.MulXV(transformA, this.m_shapeA.m_vertices[i], new box2d.b2Vec2());
    }
    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeA.m_count, new box2d.b2Color(0.9, 0.9, 0.9));

    const transformB = new box2d.b2Transform();
    sweepB.GetTransform(transformB, 0.0);

    //box2d.b2Vec2 localPoint(2.0f, -0.1f);

    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
      vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
    }
    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.5, 0.9, 0.5));
    testbed.g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${(0.0).toFixed(1)}`);

    sweepB.GetTransform(transformB, output.t);
    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
      vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
    }
    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.5, 0.7, 0.9));
    testbed.g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${output.t.toFixed(3)}`);

    sweepB.GetTransform(transformB, 1.0);
    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
      vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
    }
    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.9, 0.5, 0.5));
    testbed.g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${(1.0).toFixed(1)}`);

    // #if 0
    for (let t = 0.0; t < 1.0; t += 0.1) {
      sweepB.GetTransform(transformB, t);
      for (let i = 0; i < this.m_shapeB.m_count; ++i) {
        vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
      }
      testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.5, 0.5, 0.5));
      testbed.g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${t.toFixed(1)}`);
    }
    // #endif
  }

  public static Create(): testbed.Test {
    return new TimeOfImpact();
  }
}
