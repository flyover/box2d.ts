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

export class EdgeShapesCallback extends box2d.b2RayCastCallback {
  public m_fixture: box2d.b2Fixture | null = null;
  public m_point = new box2d.b2Vec2();
  public m_normal = new box2d.b2Vec2();
  public ReportFixture(fixture: box2d.b2Fixture, point: box2d.b2Vec2, normal: box2d.b2Vec2, fraction: number): number {
    this.m_fixture = fixture;
    this.m_point.Copy(point);
    this.m_normal.Copy(normal);
    return fraction;
  }
}

export class EdgeShapes extends testbed.Test {
  public static readonly e_maxBodies = 256;

  public m_bodyIndex = 0;
  public m_bodies: Array<box2d.b2Body | null>;
  public m_polygons: box2d.b2PolygonShape[];
  public m_circle: box2d.b2CircleShape;
  public m_angle = 0.0;

  constructor() {
    super();

    this.m_bodyIndex = 0;
    this.m_bodies = new Array(EdgeShapes.e_maxBodies);
    this.m_polygons = new Array(4);
    for (let i = 0; i < 4; ++i) {
      this.m_polygons[i] = new box2d.b2PolygonShape();
    }
    this.m_circle = new box2d.b2CircleShape();

    this.m_angle = 0.0;

    // Ground body
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      let x1 = -20.0;
      let y1 = 2.0 * box2d.b2Cos(x1 / 10.0 * box2d.b2_pi);
      for (let i = 0; i < 80; ++i) {
        const x2 = x1 + 0.5;
        const y2 = 2.0 * box2d.b2Cos(x2 / 10.0 * box2d.b2_pi);

        const shape = new box2d.b2EdgeShape();
        shape.Set(new box2d.b2Vec2(x1, y1), new box2d.b2Vec2(x2, y2));
        ground.CreateFixture(shape, 0.0);

        x1 = x2;
        y1 = y2;
      }
    }

    {
      const vertices = new Array(3);
      vertices[0] = new box2d.b2Vec2(-0.5, 0.0);
      vertices[1] = new box2d.b2Vec2(0.5, 0.0);
      vertices[2] = new box2d.b2Vec2(0.0, 1.5);
      this.m_polygons[0].Set(vertices, 3);
    }

    {
      const vertices = new Array(3);
      vertices[0] = new box2d.b2Vec2(-0.1, 0.0);
      vertices[1] = new box2d.b2Vec2(0.1, 0.0);
      vertices[2] = new box2d.b2Vec2(0.0, 1.5);
      this.m_polygons[1].Set(vertices, 3);
    }

    {
      const w = 1.0;
      const b = w / (2.0 + box2d.b2Sqrt(2.0));
      const s = box2d.b2Sqrt(2.0) * b;

      const vertices = new Array(8);
      vertices[0] = new box2d.b2Vec2(0.5 * s, 0.0);
      vertices[1] = new box2d.b2Vec2(0.5 * w, b);
      vertices[2] = new box2d.b2Vec2(0.5 * w, b + s);
      vertices[3] = new box2d.b2Vec2(0.5 * s, w);
      vertices[4] = new box2d.b2Vec2(-0.5 * s, w);
      vertices[5] = new box2d.b2Vec2(-0.5 * w, b + s);
      vertices[6] = new box2d.b2Vec2(-0.5 * w, b);
      vertices[7] = new box2d.b2Vec2(-0.5 * s, 0.0);

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

    const bd = new box2d.b2BodyDef();

    const x = box2d.b2RandomRange(-10.0, 10.0);
    const y = box2d.b2RandomRange(10.0, 20.0);
    bd.position.Set(x, y);
    bd.angle = box2d.b2RandomRange(-box2d.b2_pi, box2d.b2_pi);
    bd.type = box2d.b2BodyType.b2_dynamicBody;

    if (index === 4) {
      bd.angularDamping = 0.02;
    }

    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);

    if (index < 4) {
      const fd = new box2d.b2FixtureDef();
      fd.shape = this.m_polygons[index];
      fd.friction = 0.3;
      fd.density = 20.0;
      new_body.CreateFixture(fd);
    } else {
      const fd = new box2d.b2FixtureDef();
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
    const advanceRay = !settings.pause || settings.singleStep;
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff, m to change the mode");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    const L = 25.0;
    const point1 = new box2d.b2Vec2(0.0, 10.0);
    const d = new box2d.b2Vec2(L * box2d.b2Cos(this.m_angle), -L * box2d.b2Abs(box2d.b2Sin(this.m_angle)));
    const point2 = box2d.b2Vec2.AddVV(point1, d, new box2d.b2Vec2());

    const callback = new EdgeShapesCallback();
    this.m_world.RayCast(callback, point1, point2);

    if (callback.m_fixture) {
      testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new box2d.b2Color(0.4, 0.9, 0.4));
      testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new box2d.b2Color(0.8, 0.8, 0.8));
      const head = box2d.b2Vec2.AddVV(callback.m_point, box2d.b2Vec2.MulSV(0.5, callback.m_normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
      testbed.g_debugDraw.DrawSegment(callback.m_point, head, new box2d.b2Color(0.9, 0.9, 0.4));
    } else {
      testbed.g_debugDraw.DrawSegment(point1, point2, new box2d.b2Color(0.8, 0.8, 0.8));
    }

    if (advanceRay) {
      this.m_angle += 0.25 * box2d.b2_pi / 180.0;
    }
  }

  public static Create(): testbed.Test {
    return new EdgeShapes();
  }
}
