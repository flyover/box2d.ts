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

export class CompoundShapes extends testbed.Test {
  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(50.0, 0.0), new b2.Vec2(-50.0, 0.0));

      body.CreateFixture(shape, 0.0);
    }

    {
      const circle1 = new b2.CircleShape();
      circle1.m_radius = 0.5;
      circle1.m_p.Set(-0.5, 0.5);

      const circle2 = new b2.CircleShape();
      circle2.m_radius = 0.5;
      circle2.m_p.Set(0.5, 0.5);

      for (let i = 0; i < 10; ++i) {
        const x = b2.RandomRange(-0.1, 0.1);
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(x + 5.0, 1.05 + 2.5 * i);
        bd.angle = b2.RandomRange(-b2.pi, b2.pi);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(circle1, 2.0);
        body.CreateFixture(circle2, 0.0);
      }
    }

    {
      const polygon1 = new b2.PolygonShape();
      polygon1.SetAsBox(0.25, 0.5);

      const polygon2 = new b2.PolygonShape();
      polygon2.SetAsBox(0.25, 0.5, new b2.Vec2(0.0, -0.5), 0.5 * b2.pi);

      for (let i = 0; i < 10; ++i) {
        const x = b2.RandomRange(-0.1, 0.1);
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(x - 5.0, 1.05 + 2.5 * i);
        bd.angle = b2.RandomRange(-b2.pi, b2.pi);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(polygon1, 2.0);
        body.CreateFixture(polygon2, 2.0);
      }
    }

    {
      const xf1 = new b2.Transform();
      xf1.q.SetAngle(0.3524 * b2.pi);
      xf1.p.Copy(b2.Rot.MulRV(xf1.q, new b2.Vec2(1.0, 0.0), new b2.Vec2()));

      const vertices = new Array();

      const triangle1 = new b2.PolygonShape();
      vertices[0] = b2.Transform.MulXV(xf1, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf1, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf1, new b2.Vec2(0.0, 0.5), new b2.Vec2());
      triangle1.Set(vertices, 3);

      const xf2 = new b2.Transform();
      xf2.q.SetAngle(-0.3524 * b2.pi);
      xf2.p.Copy(b2.Rot.MulRV(xf2.q, new b2.Vec2(-1.0, 0.0), new b2.Vec2()));

      const triangle2 = new b2.PolygonShape();
      vertices[0] = b2.Transform.MulXV(xf2, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf2, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf2, new b2.Vec2(0.0, 0.5), new b2.Vec2());
      triangle2.Set(vertices, 3);

      for (let i = 0; i < 10; ++i) {
        const x = b2.RandomRange(-0.1, 0.1);
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(x, 2.05 + 2.5 * i);
        bd.angle = 0;
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(triangle1, 2.0);
        body.CreateFixture(triangle2, 2.0);
      }
    }

    {
      const bottom = new b2.PolygonShape();
      bottom.SetAsBox(1.5, 0.15);

      const left = new b2.PolygonShape();
      left.SetAsBox(0.15, 2.7, new b2.Vec2(-1.45, 2.35), 0.2);

      const right = new b2.PolygonShape();
      right.SetAsBox(0.15, 2.7, new b2.Vec2(1.45, 2.35), -0.2);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 2.0);
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(bottom, 4.0);
      body.CreateFixture(left, 4.0);
      body.CreateFixture(right, 4.0);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new CompoundShapes();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Compound Shapes", CompoundShapes.Create);
