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

// This is a test of collision filtering.
// There is a triangle, a box, and a circle.
// There are 6 shapes. 3 large and 3 small.
// The 3 small ones always collide.
// The 3 large ones never collide.
// The boxes don't collide with triangles (except if both are small).
export class CollisionFiltering extends testbed.Test {
  public static readonly k_smallGroup = 1;
  public static readonly k_largeGroup = -1;
  public static readonly k_triangleCategory = 0x0002;
  public static readonly k_boxCategory = 0x0004;
  public static readonly k_circleCategory = 0x0008;
  public static readonly k_triangleMask = 0xFFFF;
  public static readonly k_boxMask = 0xFFFF ^ CollisionFiltering.k_triangleCategory;
  public static readonly k_circleMask = 0xFFFF;

  constructor() {
    super();

    // Ground body
    {
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));

      const sd = new b2.FixtureDef();
      sd.shape = shape;
      sd.friction = 0.3;

      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(sd);
    }

    // Small triangle
    const vertices = new Array();
    vertices[0] = new b2.Vec2(-1.0, 0.0);
    vertices[1] = new b2.Vec2(1.0, 0.0);
    vertices[2] = new b2.Vec2(0.0, 2.0);
    const polygon = new b2.PolygonShape();
    polygon.Set(vertices, 3);

    const triangleShapeDef = new b2.FixtureDef();
    triangleShapeDef.shape = polygon;
    triangleShapeDef.density = 1.0;

    triangleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
    triangleShapeDef.filter.categoryBits = CollisionFiltering.k_triangleCategory;
    triangleShapeDef.filter.maskBits = CollisionFiltering.k_triangleMask;

    const triangleBodyDef = new b2.BodyDef();
    triangleBodyDef.type = b2.BodyType.b2_dynamicBody;
    triangleBodyDef.position.Set(-5.0, 2.0);

    const body1 = this.m_world.CreateBody(triangleBodyDef);
    body1.CreateFixture(triangleShapeDef);

    // Large triangle (recycle definitions)
    vertices[0].SelfMul(2.0);
    vertices[1].SelfMul(2.0);
    vertices[2].SelfMul(2.0);
    polygon.Set(vertices, 3);
    triangleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
    triangleBodyDef.position.Set(-5.0, 6.0);
    triangleBodyDef.fixedRotation = true; // look at me!

    const body2 = this.m_world.CreateBody(triangleBodyDef);
    body2.CreateFixture(triangleShapeDef);

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-5.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const p = new b2.PolygonShape();
      p.SetAsBox(0.5, 1.0);
      body.CreateFixture(p, 1.0);

      const jd = new b2.PrismaticJointDef();
      jd.bodyA = body2;
      jd.bodyB = body;
      jd.enableLimit = true;
      jd.localAnchorA.Set(0.0, 4.0);
      jd.localAnchorB.SetZero();
      jd.localAxisA.Set(0.0, 1.0);
      jd.lowerTranslation = -1.0;
      jd.upperTranslation = 1.0;

      this.m_world.CreateJoint(jd);
    }

    // Small box
    polygon.SetAsBox(1.0, 0.5);
    const boxShapeDef = new b2.FixtureDef();
    boxShapeDef.shape = polygon;
    boxShapeDef.density = 1.0;
    boxShapeDef.restitution = 0.1;

    boxShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
    boxShapeDef.filter.categoryBits = CollisionFiltering.k_boxCategory;
    boxShapeDef.filter.maskBits = CollisionFiltering.k_boxMask;

    const boxBodyDef = new b2.BodyDef();
    boxBodyDef.type = b2.BodyType.b2_dynamicBody;
    boxBodyDef.position.Set(0.0, 2.0);

    const body3 = this.m_world.CreateBody(boxBodyDef);
    body3.CreateFixture(boxShapeDef);

    // Large box (recycle definitions)
    polygon.SetAsBox(2.0, 1.0);
    boxShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
    boxBodyDef.position.Set(0.0, 6.0);

    const body4 = this.m_world.CreateBody(boxBodyDef);
    body4.CreateFixture(boxShapeDef);

    // Small circle
    const circle = new b2.CircleShape();
    circle.m_radius = 1.0;

    const circleShapeDef = new b2.FixtureDef();
    circleShapeDef.shape = circle;
    circleShapeDef.density = 1.0;

    circleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
    circleShapeDef.filter.categoryBits = CollisionFiltering.k_circleCategory;
    circleShapeDef.filter.maskBits = CollisionFiltering.k_circleMask;

    const circleBodyDef = new b2.BodyDef();
    circleBodyDef.type = b2.BodyType.b2_dynamicBody;
    circleBodyDef.position.Set(5.0, 2.0);

    const body5 = this.m_world.CreateBody(circleBodyDef);
    body5.CreateFixture(circleShapeDef);

    // Large circle
    circle.m_radius *= 2.0;
    circleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
    circleBodyDef.position.Set(5.0, 6.0);

    const body6 = this.m_world.CreateBody(circleBodyDef);
    body6.CreateFixture(circleShapeDef);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new CollisionFiltering();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Collision Filtering", CollisionFiltering.Create);
