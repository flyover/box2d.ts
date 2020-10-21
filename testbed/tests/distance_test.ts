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

export class DistanceTest extends testbed.Test {
  public m_positionB = new b2.Vec2();
  public m_angleB = 0;
  public m_transformA = new b2.Transform();
  public m_transformB = new b2.Transform();
  public m_polygonA = new b2.PolygonShape();
  public m_polygonB = new b2.PolygonShape();

  constructor() {
    super();

    {
      this.m_transformA.SetIdentity();
      this.m_transformA.p.Set(0.0, -0.2);
      this.m_polygonA.SetAsBox(10.0, 0.2);
    }

    {
      this.m_positionB.Set(12.017401, 0.13678508);
      this.m_angleB = -0.0109265;
      this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);

      this.m_polygonB.SetAsBox(2.0, 0.1);
    }
  }

  public Keyboard(key: string) {
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

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const input = new b2.DistanceInput();
    input.proxyA.SetShape(this.m_polygonA, 0);
    input.proxyB.SetShape(this.m_polygonB, 0);
    input.transformA.Copy(this.m_transformA);
    input.transformB.Copy(this.m_transformB);
    input.useRadii = true;
    const cache = new b2.SimplexCache();
    cache.count = 0;
    const output = new b2.DistanceOutput();
    b2.Distance(output, cache, input);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `distance = ${output.distance.toFixed(2)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `iterations = ${output.iterations}`);
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

    const x1 = output.pointA;
    const x2 = output.pointB;

    const c1 = new b2.Color(1.0, 0.0, 0.0);
    testbed.g_debugDraw.DrawPoint(x1, 4.0, c1);

    const c2 = new b2.Color(1.0, 1.0, 0.0);
    testbed.g_debugDraw.DrawPoint(x2, 4.0, c2);
  }

  public static Create(): testbed.Test {
    return new DistanceTest();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Distance Test", DistanceTest.Create);
