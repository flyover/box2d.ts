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

// This test demonstrates how to use the world ray-cast feature.
// NOTE: we are intentionally filtering one of the polygons, therefore
// the ray will always miss one type of polygon.

// This callback finds the closest hit. Polygon 0 is filtered.
class RayCastClosestCallback extends b2.RayCastCallback {
  public m_hit: boolean = false;
  public readonly m_point: b2.Vec2 = new b2.Vec2();
  public readonly m_normal: b2.Vec2 = new b2.Vec2();
  constructor() {
    super();
  }
  public ReportFixture(fixture: b2.Fixture, point: b2.Vec2, normal: b2.Vec2, fraction: number): number {
    const body: b2.Body = fixture.GetBody();
    const userData: any = body.GetUserData();
    if (userData) {
      const index: number = userData.index;
      if (index === 0) {
        // By returning -1, we instruct the calling code to ignore this fixture
        // and continue the ray-cast to the next fixture.
        return -1;
      }
    }

    this.m_hit = true;
    this.m_point.Copy(point);
    this.m_normal.Copy(normal);

    // By returning the current fraction, we instruct the calling code to clip the ray and
    // continue the ray-cast to the next fixture. WARNING: do not assume that fixtures
    // are reported in order. However, by clipping, we can always get the closest fixture.
    return fraction;
  }
}

// This callback finds any hit. Polygon 0 is filtered. For this type of query we are usually
// just checking for obstruction, so the actual fixture and hit point are irrelevant. 
class RayCastAnyCallback extends b2.RayCastCallback {
  public m_hit: boolean = false;
  public readonly m_point: b2.Vec2 = new b2.Vec2();
  public readonly m_normal: b2.Vec2 = new b2.Vec2();
  constructor() {
    super();
  }
  public ReportFixture(fixture: b2.Fixture, point: b2.Vec2, normal: b2.Vec2, fraction: number): number {
    const body: b2.Body = fixture.GetBody();
    const userData: any = body.GetUserData();
    if (userData) {
      const index: number = userData.index;
      if (index === 0) {
        // By returning -1, we instruct the calling code to ignore this fixture
        // and continue the ray-cast to the next fixture.
        return -1;
      }
    }

    this.m_hit = true;
    this.m_point.Copy(point);
    this.m_normal.Copy(normal);

    // At this point we have a hit, so we know the ray is obstructed.
    // By returning 0, we instruct the calling code to terminate the ray-cast.
    return 0;
  }
}

// This ray cast collects multiple hits along the ray. Polygon 0 is filtered.
// The fixtures are not necessary reported in order, so we might not capture
// the closest fixture.
class RayCastMultipleCallback extends b2.RayCastCallback {
  private static e_maxCount: number = 3;
  public m_points: b2.Vec2[] = b2.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
  public m_normals: b2.Vec2[] = b2.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
  public m_count: number = 0;
  constructor() {
    super();
  }
  public ReportFixture(fixture: b2.Fixture, point: b2.Vec2, normal: b2.Vec2, fraction: number): number {
    const body: b2.Body = fixture.GetBody();
    const userData: any = body.GetUserData();
    if (userData) {
      const index: number = userData.index;
      if (index === 0) {
        // By returning -1, we instruct the calling code to ignore this fixture
        // and continue the ray-cast to the next fixture.
        return -1;
      }
    }

    // DEBUG: b2.Assert(this.m_count < RayCastMultipleCallback.e_maxCount);

    this.m_points[this.m_count].Copy(point);
    this.m_normals[this.m_count].Copy(normal);
    ++this.m_count;

    if (this.m_count === RayCastMultipleCallback.e_maxCount) {
      // At this point the buffer is full.
      // By returning 0, we instruct the calling code to terminate the ray-cast.
      return 0;
    }

    // By returning 1, we instruct the caller to continue without clipping the ray.
    return 1;
  }
}

enum RayCastMode {
  e_closest,
  e_any,
  e_multiple,
}

export class RayCast extends testbed.Test {
  private static e_maxBodies: number = 256;

  private m_bodyIndex: number = 0;
  private m_bodies: Array<b2.Body | null> = [];
  private m_polygons: b2.PolygonShape[] = [];
  private m_circle: b2.CircleShape = new b2.CircleShape();
  private m_edge: b2.EdgeShape = new b2.EdgeShape();

  private m_angle: number = 0;

  private m_mode: RayCastMode = RayCastMode.e_closest;

  constructor() {
    super();

    for (let i = 0; i < 4; ++i) {
      this.m_polygons[i] = new b2.PolygonShape();
    }

    // Ground body
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const vertices: b2.Vec2[] = [/*3*/];
      vertices[0] = new b2.Vec2(-0.5, 0.0);
      vertices[1] = new b2.Vec2(0.5, 0.0);
      vertices[2] = new b2.Vec2(0.0, 1.5);
      this.m_polygons[0].Set(vertices, 3);
    }

    {
      const vertices: b2.Vec2[] = [/*3*/];
      vertices[0] = new b2.Vec2(-0.1, 0.0);
      vertices[1] = new b2.Vec2(0.1, 0.0);
      vertices[2] = new b2.Vec2(0.0, 1.5);
      this.m_polygons[1].Set(vertices, 3);
    }

    {
      const w = 1.0;
      const b = w / (2.0 + b2.Sqrt(2.0));
      const s = b2.Sqrt(2.0) * b;

      const vertices: b2.Vec2[] = [/*8*/];
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

    {
      this.m_edge.SetTwoSided(new b2.Vec2(-1, 0), new b2.Vec2(1, 0));
    }

    this.m_bodyIndex = 0;
    for (let i = 0; i < RayCast.e_maxBodies; ++i) {
      this.m_bodies[i] = null;
    }

    this.m_angle = 0;

    this.m_mode = RayCastMode.e_closest;
  }

  public CreateBody(index: number): void {
    const old_body = this.m_bodies[this.m_bodyIndex];
    if (old_body !== null) {
      this.m_world.DestroyBody(old_body);
      this.m_bodies[this.m_bodyIndex] = null;
    }

    const bd: b2.BodyDef = new b2.BodyDef();

    const x: number = b2.RandomRange(-10.0, 10.0);
    const y: number = b2.RandomRange(0.0, 20.0);
    bd.position.Set(x, y);
    bd.angle = b2.RandomRange(-b2.pi, b2.pi);

    bd.userData = {};
    bd.userData.index = index;

    if (index === 4) {
      bd.angularDamping = 0.02;
    }

    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);

    if (index < 4) {
      const fd: b2.FixtureDef = new b2.FixtureDef();
      fd.shape = this.m_polygons[index];
      fd.friction = 0.3;
      new_body.CreateFixture(fd);
    } else if (index < 5) {
      const fd: b2.FixtureDef = new b2.FixtureDef();
      fd.shape = this.m_circle;
      fd.friction = 0.3;
      new_body.CreateFixture(fd);
    } else {
      const fd: b2.FixtureDef = new b2.FixtureDef();
      fd.shape = this.m_edge;
      fd.friction = 0.3;
      new_body.CreateFixture(fd);
    }

    this.m_bodyIndex = (this.m_bodyIndex + 1) % RayCast.e_maxBodies;
  }

  public DestroyBody(): void {
    for (let i = 0; i < RayCast.e_maxBodies; ++i) {
      const body = this.m_bodies[i];
      if (body !== null) {
        this.m_world.DestroyBody(body);
        this.m_bodies[i] = null;
        return;
      }
    }
  }

  public Keyboard(key: string): void {
    switch (key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        this.CreateBody(parseInt(key, 10) - 1);
        break;

      case "d":
        this.DestroyBody();
        break;

      case "m":
        if (this.m_mode === RayCastMode.e_closest) {
          this.m_mode = RayCastMode.e_any;
        } else if (this.m_mode === RayCastMode.e_any) {
          this.m_mode = RayCastMode.e_multiple;
        } else if (this.m_mode === RayCastMode.e_multiple) {
          this.m_mode = RayCastMode.e_closest;
        }
    }
  }

  public Step(settings: testbed.Settings): void {
    const advanceRay: boolean = !settings.m_pause || settings.m_singleStep;

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-6 to drop stuff, m to change the mode");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    switch (this.m_mode) {
      case RayCastMode.e_closest:
        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: closest - find closest fixture along the ray");
        break;

      case RayCastMode.e_any:
        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: any - check for obstruction");
        break;

      case RayCastMode.e_multiple:
        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: multiple - gather multiple fixtures");
        break;
    }

    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    const L = 11.0;
    const point1 = new b2.Vec2(0.0, 10.0);
    const d = new b2.Vec2(L * b2.Cos(this.m_angle), L * b2.Sin(this.m_angle));
    const point2 = b2.Vec2.AddVV(point1, d, new b2.Vec2());

    if (this.m_mode === RayCastMode.e_closest) {
      const callback = new RayCastClosestCallback();
      this.m_world.RayCast(callback, point1, point2);

      if (callback.m_hit) {
        testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2.Color(0.4, 0.9, 0.4));
        testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new b2.Color(0.8, 0.8, 0.8));
        const head = b2.Vec2.AddVV(callback.m_point, b2.Vec2.MulSV(0.5, callback.m_normal, b2.Vec2.s_t0), new b2.Vec2());
        testbed.g_debugDraw.DrawSegment(callback.m_point, head, new b2.Color(0.9, 0.9, 0.4));
      } else {
        testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
      }
    } else if (this.m_mode === RayCastMode.e_any) {
      const callback = new RayCastAnyCallback();
      this.m_world.RayCast(callback, point1, point2);

      if (callback.m_hit) {
        testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2.Color(0.4, 0.9, 0.4));
        testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new b2.Color(0.8, 0.8, 0.8));
        const head = b2.Vec2.AddVV(callback.m_point, b2.Vec2.MulSV(0.5, callback.m_normal, b2.Vec2.s_t0), new b2.Vec2());
        testbed.g_debugDraw.DrawSegment(callback.m_point, head, new b2.Color(0.9, 0.9, 0.4));
      } else {
        testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
      }
    } else if (this.m_mode === RayCastMode.e_multiple) {
      const callback = new RayCastMultipleCallback();
      this.m_world.RayCast(callback, point1, point2);
      testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));

      for (let i = 0; i < callback.m_count; ++i) {
        const p = callback.m_points[i];
        const n = callback.m_normals[i];
        testbed.g_debugDraw.DrawPoint(p, 5.0, new b2.Color(0.4, 0.9, 0.4));
        testbed.g_debugDraw.DrawSegment(point1, p, new b2.Color(0.8, 0.8, 0.8));
        const head = b2.Vec2.AddVV(p, b2.Vec2.MulSV(0.5, n, b2.Vec2.s_t0), new b2.Vec2());
        testbed.g_debugDraw.DrawSegment(p, head, new b2.Color(0.9, 0.9, 0.4));
      }
    }

    if (advanceRay) {
      this.m_angle += 0.25 * b2.pi / 180.0;
    }

    /*
    #if 0
      // This case was failing.
      {
        b2Vec2 vertices[4];
        //vertices[0].Set(-22.875f, -3.0f);
        //vertices[1].Set(22.875f, -3.0f);
        //vertices[2].Set(22.875f, 3.0f);
        //vertices[3].Set(-22.875f, 3.0f);

        b2PolygonShape shape;
        //shape.Set(vertices, 4);
        shape.SetAsBox(22.875f, 3.0f);

        b2RayCastInput input;
        input.p1.Set(10.2725f,1.71372f);
        input.p2.Set(10.2353f,2.21807f);
        //input.maxFraction = 0.567623f;
        input.maxFraction = 0.56762173f;

        b2Transform xf;
        xf.SetIdentity();
        xf.p.Set(23.0f, 5.0f);

        b2RayCastOutput output;
        bool hit;
        hit = shape.RayCast(&output, input, xf);
        hit = false;

        b2Color color(1.0f, 1.0f, 1.0f);
        b2Vec2 vs[4];
        for (int32 i = 0; i < 4; ++i)
        {
          vs[i] = b2Mul(xf, shape.m_vertices[i]);
        }

        g_debugDraw.DrawPolygon(vs, 4, color);
        g_debugDraw.DrawSegment(input.p1, input.p2, color);
      }
    #endif
    */
  }

  public static Create(): testbed.Test {
    return new RayCast();
  }
}

export const testIndex: number = testbed.RegisterTest("Collision", "Ray Cast", RayCast.Create);
