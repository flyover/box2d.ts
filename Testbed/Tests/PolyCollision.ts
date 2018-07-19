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

export class PolyCollision extends testbed.Test {
  public m_polygonA = new box2d.b2PolygonShape();
  public m_polygonB = new box2d.b2PolygonShape();
  public m_transformA = new box2d.b2Transform();
  public m_transformB = new box2d.b2Transform();
  public m_positionB = new box2d.b2Vec2();
  public m_angleB = 0;

  constructor() {
    super();

    {
      this.m_polygonA.SetAsBox(0.2, 0.4);
      this.m_transformA.SetPositionAngle(new box2d.b2Vec2(0.0, 0.0), 0.0);
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
        this.m_angleB += 0.1 * box2d.b2_pi;
        break;

      case "e":
        this.m_angleB -= 0.1 * box2d.b2_pi;
        break;
    }

    this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
  }

  public Step(settings: testbed.Settings): void {
    // super.Step(settings);
    const manifold = new box2d.b2Manifold();
    box2d.b2CollidePolygons(manifold, this.m_polygonA, this.m_transformA, this.m_polygonB, this.m_transformB);

    const worldManifold = new box2d.b2WorldManifold();
    worldManifold.Initialize(manifold, this.m_transformA, this.m_polygonA.m_radius, this.m_transformB, this.m_polygonB.m_radius);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `point count = ${manifold.pointCount}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    {
      const color = new box2d.b2Color(0.9, 0.9, 0.9);
      const v = [];
      for (let i = 0; i < this.m_polygonA.m_count; ++i) {
        v[i] = box2d.b2Transform.MulXV(this.m_transformA, this.m_polygonA.m_vertices[i], new box2d.b2Vec2());
      }
      testbed.g_debugDraw.DrawPolygon(v, this.m_polygonA.m_count, color);

      for (let i = 0; i < this.m_polygonB.m_count; ++i) {
        v[i] = box2d.b2Transform.MulXV(this.m_transformB, this.m_polygonB.m_vertices[i], new box2d.b2Vec2());
      }
      testbed.g_debugDraw.DrawPolygon(v, this.m_polygonB.m_count, color);
    }

    for (let i = 0; i < manifold.pointCount; ++i) {
      testbed.g_debugDraw.DrawPoint(worldManifold.points[i], 4.0, new box2d.b2Color(0.9, 0.3, 0.3));
    }
  }

  public static Create(): testbed.Test {
    return new PolyCollision();
  }
}
