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

/**
 * This callback is called by box2d.b2World::QueryAABB. We find
 * all the fixtures that overlap an AABB. Of those, we use
 * b2TestOverlap to determine which fixtures overlap a circle.
 * Up to 4 overlapped fixtures will be highlighted with a yellow
 * border.
 */
export class PolyShapesCallback extends box2d.b2QueryCallback {
  public static readonly e_maxCount = 4;

  public m_circle = new box2d.b2CircleShape();
  public m_transform = new box2d.b2Transform();
  public m_count = 0;

  public ReportFixture(fixture: box2d.b2Fixture) {
    if (this.m_count === PolyShapesCallback.e_maxCount) {
      return false;
    }

    const body = fixture.GetBody();
    const shape = fixture.GetShape();

    const overlap = box2d.b2TestOverlapShape(shape, 0, this.m_circle, 0, body.GetTransform(), this.m_transform);

    if (overlap) {
      this.DrawFixture(fixture);
      ++this.m_count;
    }

    return true;
  }

  public DrawFixture(fixture: box2d.b2Fixture) {
    const color = new box2d.b2Color(0.95, 0.95, 0.6);
    const xf = fixture.GetBody().GetTransform();

    switch (fixture.GetType()) {
      case box2d.b2ShapeType.e_circleShape:
        {
          //const circle = ((shape instanceof box2d.b2CircleShape ? shape : null));
          const circle: box2d.b2CircleShape = fixture.GetShape() as box2d.b2CircleShape;

          const center = box2d.b2Transform.MulXV(xf, circle.m_p, new box2d.b2Vec2());
          const radius = circle.m_radius;

          testbed.g_debugDraw.DrawCircle(center, radius, color);
        }
        break;

      case box2d.b2ShapeType.e_polygonShape:
        {
          //const poly = ((shape instanceof box2d.b2PolygonShape ? shape : null));
          const poly: box2d.b2PolygonShape = fixture.GetShape() as box2d.b2PolygonShape;
          const vertexCount = poly.m_count;
          const vertices = [];

          for (let i = 0; i < vertexCount; ++i) {
            vertices[i] = box2d.b2Transform.MulXV(xf, poly.m_vertices[i], new box2d.b2Vec2());
          }

          testbed.g_debugDraw.DrawPolygon(vertices, vertexCount, color);
        }
        break;

      default:
        break;
    }
  }
}

export class PolyShapes extends testbed.Test {
  public static readonly e_maxBodies = 256;

  public m_bodyIndex = 0;
  public m_bodies = new Array(PolyShapes.e_maxBodies);
  public m_polygons = box2d.b2MakeArray(4, () => new box2d.b2PolygonShape());
  public m_circle = new box2d.b2CircleShape();

  constructor() {
    super();

    // Ground body
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
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

    for (let i = 0; i < PolyShapes.e_maxBodies; ++i) {
      this.m_bodies[i] = null;
    }
  }

  public CreateBody(index: number) {
    if (this.m_bodies[this.m_bodyIndex] !== null) {
      this.m_world.DestroyBody(this.m_bodies[this.m_bodyIndex]);
      this.m_bodies[this.m_bodyIndex] = null;
    }

    const bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;

    const x = box2d.b2RandomRange(-2.0, 2.0);
    bd.position.Set(x, 10.0);
    bd.angle = box2d.b2RandomRange(-box2d.b2_pi, box2d.b2_pi);

    if (index === 4) {
      bd.angularDamping = 0.02;
    }

    this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);

    if (index < 4) {
      const fd = new box2d.b2FixtureDef();
      fd.shape = this.m_polygons[index];
      fd.density = 1.0;
      fd.friction = 0.3;
      this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
    } else {
      const fd = new box2d.b2FixtureDef();
      fd.shape = this.m_circle;
      fd.density = 1.0;
      fd.friction = 0.3;

      this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
    }

    this.m_bodyIndex = (this.m_bodyIndex + 1) % PolyShapes.e_maxBodies;
  }

  public DestroyBody() {
    for (let i = 0; i < PolyShapes.e_maxBodies; ++i) {
      if (this.m_bodies[i] !== null) {
        this.m_world.DestroyBody(this.m_bodies[i]);
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
        for (let i = 0; i < PolyShapes.e_maxBodies; i += 2) {
          if (this.m_bodies[i]) {
            const active = this.m_bodies[i].IsActive();
            this.m_bodies[i].SetActive(!active);
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

    const callback = new PolyShapesCallback();
    callback.m_circle.m_radius = 2.0;
    callback.m_circle.m_p.Set(0.0, 1.1);
    callback.m_transform.SetIdentity();

    const aabb = new box2d.b2AABB();
    callback.m_circle.ComputeAABB(aabb, callback.m_transform, 0);

    this.m_world.QueryAABB(callback, aabb);

    const color = new box2d.b2Color(0.4, 0.7, 0.8);
    testbed.g_debugDraw.DrawCircle(callback.m_circle.m_p, callback.m_circle.m_radius, color);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to (de)activate some bodies");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'd' to destroy a body");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new PolyShapes();
  }
}
