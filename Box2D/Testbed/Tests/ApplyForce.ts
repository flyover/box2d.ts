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

export class ApplyForce extends testbed.Test {
  public m_body: box2d.b2Body;

  constructor() {
    super();

    this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));

    /*float32*/
    const k_restitution = 0.4;

    /*box2d.b2Body*/
    let ground = null;
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.position.Set(0.0, 20.0);
      ground = this.m_world.CreateBody(bd);

      /*box2d.b2EdgeShape*/
      const shape = new box2d.b2EdgeShape();

      /*box2d.b2FixtureDef*/
      const sd = new box2d.b2FixtureDef();
      sd.shape = shape;
      sd.density = 0.0;
      sd.restitution = k_restitution;

      // Left vertical
      shape.Set(new box2d.b2Vec2(-20.0, -20.0), new box2d.b2Vec2(-20.0, 20.0));
      ground.CreateFixture(sd);

      // Right vertical
      shape.Set(new box2d.b2Vec2(20.0, -20.0), new box2d.b2Vec2(20.0, 20.0));
      ground.CreateFixture(sd);

      // Top horizontal
      shape.Set(new box2d.b2Vec2(-20.0, 20.0), new box2d.b2Vec2(20.0, 20.0));
      ground.CreateFixture(sd);

      // Bottom horizontal
      shape.Set(new box2d.b2Vec2(-20.0, -20.0), new box2d.b2Vec2(20.0, -20.0));
      ground.CreateFixture(sd);
    }

    {
      /*box2d.b2Transform*/
      const xf1 = new box2d.b2Transform();
      xf1.q.SetAngle(0.3524 * box2d.b2_pi);
      xf1.p.Copy(box2d.b2Rot.MulRV(xf1.q, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2()));

      /*box2d.b2Vec2[]*/
      const vertices = new Array();
      vertices[0] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2());
      vertices[1] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2());
      vertices[2] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(0.0, 0.5), new box2d.b2Vec2());

      /*box2d.b2PolygonShape*/
      const poly1 = new box2d.b2PolygonShape();
      poly1.Set(vertices, 3);

      /*box2d.b2FixtureDef*/
      const sd1 = new box2d.b2FixtureDef();
      sd1.shape = poly1;
      sd1.density = 4.0;

      /*box2d.b2Transform*/
      const xf2 = new box2d.b2Transform();
      xf2.q.SetAngle(-0.3524 * box2d.b2_pi);
      xf2.p.Copy(box2d.b2Rot.MulRV(xf2.q, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2()));

      vertices[0] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2());
      vertices[1] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2());
      vertices[2] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(0.0, 0.5), new box2d.b2Vec2());

      /*box2d.b2PolygonShape*/
      const poly2 = new box2d.b2PolygonShape();
      poly2.Set(vertices, 3);

      /*box2d.b2FixtureDef*/
      const sd2 = new box2d.b2FixtureDef();
      sd2.shape = poly2;
      sd2.density = 2.0;

      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.angularDamping = 2.0;
      bd.linearDamping = 0.5;

      bd.position.Set(0.0, 2.0);
      bd.angle = box2d.b2_pi;
      bd.allowSleep = false;
      this.m_body = this.m_world.CreateBody(bd);
      this.m_body.CreateFixture(sd1);
      this.m_body.CreateFixture(sd2);
    }

    {
      /*box2d.b2PolygonShape*/
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for ( /*int*/ let i = 0; i < 10; ++i) {
        /*box2d.b2BodyDef*/
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;

        bd.position.Set(0.0, 5.0 + 1.54 * i);
        /*box2d.b2Body*/
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
        const radius = box2d.b2Sqrt(2.0 * I / mass);

        /*box2d.b2FrictionJointDef*/
        const jd = new box2d.b2FrictionJointDef();
        jd.localAnchorA.SetZero();
        jd.localAnchorB.SetZero();
        jd.bodyA = ground;
        jd.bodyB = body;
        jd.collideConnected = true;
        jd.maxForce = mass * gravity;
        jd.maxTorque = mass * radius * gravity;

        this.m_world.CreateJoint(jd);
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "w":
        {
          /*box2d.b2Vec2*/
          const f = this.m_body.GetWorldVector(new box2d.b2Vec2(0.0, -200.0), new box2d.b2Vec2());
          /*box2d.b2Vec2*/
          const p = this.m_body.GetWorldPoint(new box2d.b2Vec2(0.0, 2.0), new box2d.b2Vec2());
          this.m_body.ApplyForce(f, p);
        }
        break;

      case "a":
        {
          this.m_body.ApplyTorque(50.0);
        }
        break;

      case "d":
        {
          this.m_body.ApplyTorque(-50.0);
        }
        break;
    }

    super.Keyboard(key);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new ApplyForce();
  }
}
