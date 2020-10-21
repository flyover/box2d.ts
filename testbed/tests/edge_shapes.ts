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

export class EdgeShapesCallback extends b2.RayCastCallback {
  public m_fixture: b2.Fixture | null = null;
  public m_point = new b2.Vec2();
  public m_normal = new b2.Vec2();
  public ReportFixture(fixture: b2.Fixture, point: b2.Vec2, normal: b2.Vec2, fraction: number): number {
    this.m_fixture = fixture;
    this.m_point.Copy(point);
    this.m_normal.Copy(normal);
    return fraction;
  }
}

export class EdgeShapes extends testbed.Test {
  public static readonly e_maxBodies = 256;

  public m_bodyIndex = 0;
  public m_bodies: Array<b2.Body | null>;
  public m_polygons: b2.PolygonShape[];
  public m_circle: b2.CircleShape;
  public m_angle = 0.0;

  constructor() {
    super();

    this.m_bodyIndex = 0;
    this.m_bodies = new Array(EdgeShapes.e_maxBodies);
    this.m_polygons = new Array(4);
    for (let i = 0; i < 4; ++i) {
      this.m_polygons[i] = new b2.PolygonShape();
    }
    this.m_circle = new b2.CircleShape();

    this.m_angle = 0.0;

    // Ground body
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      let x1 = -20.0;
      let y1 = 2.0 * b2.Cos(x1 / 10.0 * b2.pi);
      for (let i = 0; i < 80; ++i) {
        const x2 = x1 + 0.5;
        const y2 = 2.0 * b2.Cos(x2 / 10.0 * b2.pi);

        const shape = new b2.EdgeShape();
        shape.SetTwoSided(new b2.Vec2(x1, y1), new b2.Vec2(x2, y2));
        ground.CreateFixture(shape, 0.0);

        x1 = x2;
        y1 = y2;
      }
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

    for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
      this.m_bodies[i] = null;
    }
  }

  public CreateBody(index: number) {
    const old_body = this.m_bodies[this.m_bodyIndex];
    if (old_body !== null) {
      this.m_world.DestroyBody(old_body);
      this.m_bodies[this.m_bodyIndex] = null;
    }

    const bd = new b2.BodyDef();

    const x = b2.RandomRange(-10.0, 10.0);
    const y = b2.RandomRange(10.0, 20.0);
    bd.position.Set(x, y);
    bd.angle = b2.RandomRange(-b2.pi, b2.pi);
    bd.type = b2.BodyType.b2_dynamicBody;

    if (index === 4) {
      bd.angularDamping = 0.02;
    }

    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);

    if (index < 4) {
      const fd = new b2.FixtureDef();
      fd.shape = this.m_polygons[index];
      fd.friction = 0.3;
      fd.density = 20.0;
      new_body.CreateFixture(fd);
    } else {
      const fd = new b2.FixtureDef();
      fd.shape = this.m_circle;
      fd.friction = 0.3;
      fd.density = 20.0;

      new_body.CreateFixture(fd);
    }

    this.m_bodyIndex = (this.m_bodyIndex + 1) % EdgeShapes.e_maxBodies;
  }

  public DestroyBody() {
    for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
      const body = this.m_bodies[i];
      if (body !== null) {
        this.m_world.DestroyBody(body);
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

      case "d":
        this.DestroyBody();
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    const advanceRay = !settings.m_pause || settings.m_singleStep;
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff, m to change the mode");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    const L = 25.0;
    const point1 = new b2.Vec2(0.0, 10.0);
    const d = new b2.Vec2(L * b2.Cos(this.m_angle), -L * b2.Abs(b2.Sin(this.m_angle)));
    const point2 = b2.Vec2.AddVV(point1, d, new b2.Vec2());

    const callback = new EdgeShapesCallback();
    this.m_world.RayCast(callback, point1, point2);

    if (callback.m_fixture) {
      testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2.Color(0.4, 0.9, 0.4));
      testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new b2.Color(0.8, 0.8, 0.8));
      const head = b2.Vec2.AddVV(callback.m_point, b2.Vec2.MulSV(0.5, callback.m_normal, b2.Vec2.s_t0), new b2.Vec2());
      testbed.g_debugDraw.DrawSegment(callback.m_point, head, new b2.Color(0.9, 0.9, 0.4));
    } else {
      testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
    }

    if (advanceRay) {
      this.m_angle += 0.25 * b2.pi / 180.0;
    }
  }

  public static Create(): testbed.Test {
    return new EdgeShapes();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Edge Shapes", EdgeShapes.Create);
