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

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class ApplyForce extends testbed.Test {
  public m_body: b2.Body;

  constructor() {
    super();

    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));

    /*float32*/
    const k_restitution = 0.4;

    /*b2.Body*/
    let ground = null;
    {
      /*b2.BodyDef*/
      const bd = new b2.BodyDef();
      bd.position.Set(0.0, 20.0);
      ground = this.m_world.CreateBody(bd);

      /*b2.EdgeShape*/
      const shape = new b2.EdgeShape();

      /*b2.FixtureDef*/
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
      /*b2.Transform*/
      const xf1 = new b2.Transform();
      xf1.q.SetAngle(0.3524 * b2.pi);
      xf1.p.Copy(b2.Rot.MulRV(xf1.q, new b2.Vec2(1.0, 0.0), new b2.Vec2()));

      /*b2.Vec2[]*/
      const vertices = new Array();
      vertices[0] = b2.Transform.MulXV(xf1, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf1, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf1, new b2.Vec2(0.0, 0.5), new b2.Vec2());

      /*b2.PolygonShape*/
      const poly1 = new b2.PolygonShape();
      poly1.Set(vertices, 3);

      /*b2.FixtureDef*/
      const sd1 = new b2.FixtureDef();
      sd1.shape = poly1;
      sd1.density = 2.0;

      /*b2.Transform*/
      const xf2 = new b2.Transform();
      xf2.q.SetAngle(-0.3524 * b2.pi);
      xf2.p.Copy(b2.Rot.MulRV(xf2.q, new b2.Vec2(-1.0, 0.0), new b2.Vec2()));

      vertices[0] = b2.Transform.MulXV(xf2, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
      vertices[1] = b2.Transform.MulXV(xf2, new b2.Vec2(1.0, 0.0), new b2.Vec2());
      vertices[2] = b2.Transform.MulXV(xf2, new b2.Vec2(0.0, 0.5), new b2.Vec2());

      /*b2.PolygonShape*/
      const poly2 = new b2.PolygonShape();
      poly2.Set(vertices, 3);

      /*b2.FixtureDef*/
      const sd2 = new b2.FixtureDef();
      sd2.shape = poly2;
      sd2.density = 2.0;

      /*b2.BodyDef*/
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

      // b2FrictionJointDef jd;
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
      /*b2.PolygonShape*/
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      /*b2.FixtureDef*/
      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for ( /*int*/ let i = 0; i < 10; ++i) {
        /*b2.BodyDef*/
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;

        bd.position.Set(0.0, 7.0 + 1.54 * i);
        /*b2.Body*/
        const body = this.m_world.CreateBody(bd);

        body.CreateFixture(fd);

        /*float32*/
        const gravity = 10.0;
        /*float32*/
        const I = body.GetInertia();
        /*float32*/
        const mass = body.GetMass();

        // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
        /*float32*/
        const radius = b2.Sqrt(2.0 * I / mass);

        /*b2.FrictionJointDef*/
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
          /*b2.Vec2*/
          const f = this.m_body.GetWorldVector(new b2.Vec2(0.0, -50.0), new b2.Vec2());
          /*b2.Vec2*/
          const p = this.m_body.GetWorldPoint(new b2.Vec2(0.0, 3.0), new b2.Vec2());
          this.m_body.ApplyForce(f, p);
        }
        break;

      case "a":
        {
          this.m_body.ApplyTorque(10.0);
        }
        break;

      case "d":
        {
          this.m_body.ApplyTorque(-10.0);
        }
        break;
    }

    super.Keyboard(key);
  }

  public Step(settings: testbed.Settings): void {
		// g_debugDraw.DrawString(5, m_textLine, "Forward (W), Turn (A) and (D)");
		// m_textLine += m_textIncrement;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Forward (W), Turn (A) and (D)`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new ApplyForce();
  }
}

export const testIndex: number = testbed.RegisterTest("Forces", "Apply Force", ApplyForce.Create);
