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

/// This tests stacking. It also shows how to use b2World::Query
/// and b2TestOverlap.

/// This callback is called by b2World::QueryAABB. We find all the fixtures
/// that overlap an AABB. Of those, we use b2TestOverlap to determine which fixtures
/// overlap a circle. Up to 4 overlapped fixtures will be highlighted with a yellow border.
export class PolygonShapesCallback extends b2.QueryCallback {
  public static readonly e_maxCount = 4;

  public m_circle = new b2.CircleShape();
  public m_transform = new b2.Transform();
  public m_count = 0;

  /// Called for each fixture found in the query AABB.
  /// @return false to terminate the query.
  public ReportFixture(fixture: b2.Fixture) {
    if (this.m_count === PolygonShapesCallback.e_maxCount) {
      return false;
    }

    const body = fixture.GetBody();
    const shape = fixture.GetShape();

    const overlap = b2.TestOverlapShape(shape, 0, this.m_circle, 0, body.GetTransform(), this.m_transform);

    if (overlap) {
      const color = new b2.Color(0.95, 0.95, 0.6);
      const center = body.GetWorldCenter();
      testbed.g_debugDraw.DrawPoint(center, 5.0, color);
      ++this.m_count;
    }

    return true;
  }
}

export class PolygonShapes extends testbed.Test {
  public static readonly e_maxBodies = 256;

  public m_bodyIndex = 0;
  public m_bodies: Array<b2.Body | null> = b2.MakeArray(PolygonShapes.e_maxBodies, () => null);
  public m_polygons = b2.MakeArray(4, () => new b2.PolygonShape());
  public m_circle = new b2.CircleShape();

  constructor() {
    super();

    // Ground body
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const vertices = new Array(3);
      vertices[0] = new b2.Vec2(-0.5, 0.0);
      vertices[1] = new b2.Vec2(0.5, 0.0);
      vertices[2] = new b2.Vec2(0.0, 1.5);
      this.m_polygons[0].Set(vertices, 3);
    }

    {
      const vertices = new Array(3);
      vertices[0] = new b2.Vec2(-0.1, 0.0);
      vertices[1] = new b2.Vec2(0.1, 0.0);
      vertices[2] = new b2.Vec2(0.0, 1.5);
      this.m_polygons[1].Set(vertices, 3);
    }

    {
      const w = 1.0;
      const b = w / (2.0 + b2.Sqrt(2.0));
      const s = b2.Sqrt(2.0) * b;

      const vertices = new Array(8);
      vertices[0] = new b2.Vec2(0.5 * s, 0.0);
      vertices[1] = new b2.Vec2(0.5 * w, b);
      vertices[2] = new b2.Vec2(0.5 * w, b + s);
      vertices[3] = new b2.Vec2(0.5 * s, w);
      vertices[4] = new b2.Vec2(-0.5 * s, w);
      vertices[5] = new b2.Vec2(-0.5 * w, b + s);
      vertices[6] = new b2.Vec2(-0.5 * w, b);
      vertices[7] = new b2.Vec2(-0.5 * s, 0.0);

      this.m_polygons[2].Set(vertices, 8);
    }

    {
      this.m_polygons[3].SetAsBox(0.5, 0.5);
    }

    {
      this.m_circle.m_radius = 0.5;
    }

    for (let i = 0; i < PolygonShapes.e_maxBodies; ++i) {
      this.m_bodies[i] = null;
    }
  }

  public CreateBody(index: number) {
    if (this.m_bodies[this.m_bodyIndex] !== null) {
      this.m_world.DestroyBody(this.m_bodies[this.m_bodyIndex]!);
      this.m_bodies[this.m_bodyIndex] = null;
    }

    const bd = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;

    const x = b2.RandomRange(-2.0, 2.0);
    bd.position.Set(x, 10.0);
    bd.angle = b2.RandomRange(-b2.pi, b2.pi);

    if (index === 4) {
      bd.angularDamping = 0.02;
    }

    this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);

    if (index < 4) {
      const fd = new b2.FixtureDef();
      fd.shape = this.m_polygons[index];
      fd.density = 1.0;
      fd.friction = 0.3;
      this.m_bodies[this.m_bodyIndex]!.CreateFixture(fd);
    } else {
      const fd = new b2.FixtureDef();
      fd.shape = this.m_circle;
      fd.density = 1.0;
      fd.friction = 0.3;

      this.m_bodies[this.m_bodyIndex]!.CreateFixture(fd);
    }

    this.m_bodyIndex = (this.m_bodyIndex + 1) % PolygonShapes.e_maxBodies;
  }

  public DestroyBody() {
    for (let i = 0; i < PolygonShapes.e_maxBodies; ++i) {
      if (this.m_bodies[i] !== null) {
        this.m_world.DestroyBody(this.m_bodies[i]!);
        this.m_bodies[i] = null;
        return;
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        this.CreateBody(key.charCodeAt(0) - "1".charCodeAt(0));
        break;

      case "a":
        for (let i = 0; i < PolygonShapes.e_maxBodies; i += 2) {
          if (this.m_bodies[i] !== null) {
            const enabled = this.m_bodies[i]!.IsEnabled();
            this.m_bodies[i]!.SetEnabled(!enabled);
          }
        }
        break;

      case "d":
        this.DestroyBody();
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const callback = new PolygonShapesCallback();
    callback.m_circle.m_radius = 2.0;
    callback.m_circle.m_p.Set(0.0, 1.1);
    callback.m_transform.SetIdentity();

    const aabb = new b2.AABB();
    callback.m_circle.ComputeAABB(aabb, callback.m_transform, 0);

    this.m_world.QueryAABB(callback, aabb);

    const color = new b2.Color(0.4, 0.7, 0.8);
    testbed.g_debugDraw.DrawCircle(callback.m_circle.m_p, callback.m_circle.m_radius, color);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Press 1-5 to drop stuff, maximum of ${PolygonShapesCallback.e_maxCount} overlaps detected`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to enable/disable some bodies");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'd' to destroy a body");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new PolygonShapes();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Polygon Shapes", PolygonShapes.Create);
