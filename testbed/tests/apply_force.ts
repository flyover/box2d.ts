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

// This test shows how to apply forces and torques to a body.
// It also shows how to use the friction joint that can be useful
// for overhead games.
export class ApplyForce extends testbed.Test {
  public m_body: b2.Body;

  constructor() {
    super();

    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));

    const k_restitution = 0.4;

    let ground = null;
    {
      const bd = new b2.BodyDef();
      bd.position.Set(0.0, 20.0);
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();

      const sd = new b2.FixtureDef();
      sd.shape = shape;
      sd.density = 0.0;
      sd.restitution = k_restitution;

      // Left vertical
      shape.SetTwoSided(new b2.Vec2(-20.0, -20.0), new b2.Vec2(-20.0, 20.0));
      ground.CreateFixture(sd);

      // Right vertical
      shape.SetTwoSided(new b2.Vec2(20.0, -20.0), new b2.Vec2(20.0, 20.0));
      ground.CreateFixture(sd);

      // Top horizontal
      shape.SetTwoSided(new b2.Vec2(-20.0, 20.0), new b2.Vec2(20.0, 20.0));
      ground.CreateFixture(sd);

      // Bottom horizontal
      shape.SetTwoSided(new b2.Vec2(-20.0, -20.0), new b2.Vec2(20.0, -20.0));
      ground.CreateFixture(sd);
    }

    {
      const xf1 = new b2.Transform();
      xf1.q.SetAngle(0.3524 * b2.pi);
      xf1.p.Copy(b2.Rot.MulRV(xf1.q, new b2.Vec2(1.0, 0.0), new b2.Vec2()));

      const vertices = new Array();
      vertices[0] = b2.Transform.MulXV(xf1, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf1, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf1, new b2.Vec2(0.0, 0.5), new b2.Vec2());

      const poly1 = new b2.PolygonShape();
      poly1.Set(vertices, 3);

      const sd1 = new b2.FixtureDef();
      sd1.shape = poly1;
      sd1.density = 2.0;

      const xf2 = new b2.Transform();
      xf2.q.SetAngle(-0.3524 * b2.pi);
      xf2.p.Copy(b2.Rot.MulRV(xf2.q, new b2.Vec2(-1.0, 0.0), new b2.Vec2()));

      vertices[0] = b2.Transform.MulXV(xf2, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf2, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf2, new b2.Vec2(0.0, 0.5), new b2.Vec2());

      const poly2 = new b2.PolygonShape();
      poly2.Set(vertices, 3);

      const sd2 = new b2.FixtureDef();
      sd2.shape = poly2;
      sd2.density = 2.0;

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;

      bd.position.Set(0.0, 3.0);
      bd.angle = b2.pi;
      bd.allowSleep = false;
      this.m_body = this.m_world.CreateBody(bd);
      this.m_body.CreateFixture(sd1);
      this.m_body.CreateFixture(sd2);

      const gravity: number = 10.0;
      const I: number = this.m_body.GetInertia();
      const mass: number = this.m_body.GetMass();

      // Compute an effective radius that can be used to
      // set the max torque for a friction joint
      // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
      const radius: number = b2.Sqrt(2.0 * I / mass);

      const jd = new b2.FrictionJointDef();
      jd.bodyA = ground;
      jd.bodyB = this.m_body;
      jd.localAnchorA.SetZero();
      jd.localAnchorB.Copy(this.m_body.GetLocalCenter());
      jd.collideConnected = true;
      jd.maxForce = 0.5 * mass * gravity;
      jd.maxTorque = 0.2 * mass * radius * gravity;

      this.m_world.CreateJoint(jd);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for (let i = 0; i < 10; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;

        bd.position.Set(0.0, 7.0 + 1.54 * i);
        const body = this.m_world.CreateBody(bd);

        body.CreateFixture(fd);

        const gravity = 10.0;
        const I = body.GetInertia();
        const mass = body.GetMass();

        // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
        const radius = b2.Sqrt(2.0 * I / mass);

        const jd = new b2.FrictionJointDef();
        jd.localAnchorA.SetZero();
        jd.localAnchorB.SetZero();
        jd.bodyA = ground;
        jd.bodyB = body;
        jd.collideConnected = true;
        jd.maxForce = mass * gravity;
        jd.maxTorque = 0.1 * mass * radius * gravity;

        this.m_world.CreateJoint(jd);
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "w":
        {
          const f = this.m_body.GetWorldVector(new b2.Vec2(0.0, -50.0), new b2.Vec2());
          const p = this.m_body.GetWorldPoint(new b2.Vec2(0.0, 3.0), new b2.Vec2());
          this.m_body.ApplyForce(f, p, true);
        }
        break;

      case "a":
        {
          this.m_body.ApplyTorque(10.0, true);
        }
        break;

      case "d":
        {
          this.m_body.ApplyTorque(-10.0, true);
        }
        break;
    }

    super.Keyboard(key);
  }

  public Step(settings: testbed.Settings): void {
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Forward (W), Turn (A) and (D)`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new ApplyForce();
  }
}

export const testIndex: number = testbed.RegisterTest("Forces", "Apply Force", ApplyForce.Create);
