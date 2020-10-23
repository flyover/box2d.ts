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

export class Dominos extends testbed.Test {
  constructor() {
    super();

    let b1 = null;
    {
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));

      const bd = new b2.BodyDef();
      b1 = this.m_world.CreateBody(bd);
      b1.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(6.0, 0.25);

      const bd = new b2.BodyDef();
      bd.position.Set(-1.5, 10.0);
      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.1, 1.0);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      fd.friction = 0.1;

      for (let i = 0; i < 10; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-6.0 + 1.0 * i, 11.25);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);
      }
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(7.0, 0.25, b2.Vec2_zero, 0.3);

      const bd = new b2.BodyDef();
      bd.position.Set(1.0, 6.0);
      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    let _b2 = null;
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.25, 1.5);

      const bd = new b2.BodyDef();
      bd.position.Set(-7.0, 4.0);
      _b2 = this.m_world.CreateBody(bd);
      _b2.CreateFixture(shape, 0.0);
    }

    let b3 = null;
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(6.0, 0.125);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-0.9, 1.0);
      bd.angle = -0.15;

      b3 = this.m_world.CreateBody(bd);
      b3.CreateFixture(shape, 10.0);
    }

    const jd = new b2.RevoluteJointDef();
    const anchor = new b2.Vec2();

    anchor.Set(-2.0, 1.0);
    jd.Initialize(b1, b3, anchor);
    jd.collideConnected = true;
    this.m_world.CreateJoint(jd);

    let b4 = null;
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.25, 0.25);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-10.0, 15.0);
      b4 = this.m_world.CreateBody(bd);
      b4.CreateFixture(shape, 10.0);
    }

    anchor.Set(-7.0, 15.0);
    jd.Initialize(_b2, b4, anchor);
    this.m_world.CreateJoint(jd);

    let b5 = null;
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(6.5, 3.0);
      b5 = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      const fd = new b2.FixtureDef();

      fd.shape = shape;
      fd.density = 10.0;
      fd.friction = 0.1;

      shape.SetAsBox(1.0, 0.1, new b2.Vec2(0.0, -0.9), 0.0);
      b5.CreateFixture(fd);

      shape.SetAsBox(0.1, 1.0, new b2.Vec2(-0.9, 0.0), 0.0);
      b5.CreateFixture(fd);

      shape.SetAsBox(0.1, 1.0, new b2.Vec2(0.9, 0.0), 0.0);
      b5.CreateFixture(fd);
    }

    anchor.Set(6.0, 2.0);
    jd.Initialize(b1, b5, anchor);
    this.m_world.CreateJoint(jd);

    let b6 = null;
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(1.0, 0.1);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(6.5, 4.1);
      b6 = this.m_world.CreateBody(bd);
      b6.CreateFixture(shape, 30.0);
    }

    anchor.Set(7.5, 4.0);
    jd.Initialize(b5, b6, anchor);
    this.m_world.CreateJoint(jd);

    let b7 = null;
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.1, 1.0);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(7.4, 1.0);

      b7 = this.m_world.CreateBody(bd);
      b7.CreateFixture(shape, 10.0);
    }

    const djd = new b2.DistanceJointDef();
    djd.bodyA = b3;
    djd.bodyB = b7;
    djd.localAnchorA.Set(6.0, 0.0);
    djd.localAnchorB.Set(0.0, -1.0);
    const d = b2.Vec2.SubVV(djd.bodyB.GetWorldPoint(djd.localAnchorB, new b2.Vec2()), djd.bodyA.GetWorldPoint(djd.localAnchorA, new b2.Vec2()), new b2.Vec2());
    djd.length = d.Length();

		b2.LinearStiffness(djd, 1.0, 1.0, djd.bodyA, djd.bodyB);
    this.m_world.CreateJoint(djd);

    {
      const radius = 0.2;

      const shape = new b2.CircleShape();
      shape.m_radius = radius;

      for (let i = 0; i < 4; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(5.9 + 2.0 * radius * i, 2.4);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 10.0);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Dominos();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Dominos", Dominos.Create);
