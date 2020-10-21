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

export class PolygonCollision extends testbed.Test {
  public m_polygonA = new b2.PolygonShape();
  public m_polygonB = new b2.PolygonShape();
  public m_transformA = new b2.Transform();
  public m_transformB = new b2.Transform();
  public m_positionB = new b2.Vec2();
  public m_angleB = 0;

  constructor() {
    super();

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

  public static Create(): testbed.Test {
    return new PolygonCollision();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Polygon Collision", PolygonCollision.Create);
