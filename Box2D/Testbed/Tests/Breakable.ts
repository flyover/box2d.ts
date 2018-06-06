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

export class Breakable extends testbed.Test {
  public static readonly e_count = 7;

  public readonly m_body1: box2d.b2Body;
  public readonly m_velocity = new box2d.b2Vec2();
  public m_angularVelocity = 0;
  public readonly m_shape1 = new box2d.b2PolygonShape();
  public readonly m_shape2 = new box2d.b2PolygonShape();
  public m_piece1: box2d.b2Fixture;
  public m_piece2: box2d.b2Fixture;
  public m_broke = false;
  public m_break = false;

  constructor() {
    super();

    // Ground body
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      /*box2d.b2Body*/
      const ground = this.m_world.CreateBody(bd);

      /*box2d.b2EdgeShape*/
      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Breakable dynamic body
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 40.0);
      bd.angle = 0.25 * box2d.b2_pi;
      this.m_body1 = this.m_world.CreateBody(bd);

      this.m_shape1 = new box2d.b2PolygonShape();
      this.m_shape1.SetAsBox(0.5, 0.5, new box2d.b2Vec2(-0.5, 0.0), 0.0);
      this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);

      this.m_shape2 = new box2d.b2PolygonShape();
      this.m_shape2.SetAsBox(0.5, 0.5, new box2d.b2Vec2(0.5, 0.0), 0.0);
      this.m_piece2 = this.m_body1.CreateFixture(this.m_shape2, 1.0);
    }
  }

  public PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse) {
    if (this.m_broke) {
      // The body already broke.
      return;
    }

    // Should the body break?
    /*int*/
    const count = contact.GetManifold().pointCount;

    /*float32*/
    let maxImpulse = 0.0;
    for (let i = 0; i < count; ++i) {
      maxImpulse = box2d.b2Max(maxImpulse, impulse.normalImpulses[i]);
    }

    if (maxImpulse > 40.0) {
      // Flag the body for breaking.
      this.m_break = true;
    }
  }

  public Break() {
    // Create two bodies from one.
    /*box2d.b2Body*/
    const body1 = this.m_piece1.GetBody();
    /*box2d.b2Vec2*/
    const center = body1.GetWorldCenter();

    body1.DestroyFixture(this.m_piece2);
    delete this.m_piece2; // = null;

    /*box2d.b2BodyDef*/
    const bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.Copy(body1.GetPosition());
    bd.angle = body1.GetAngle();

    /*box2d.b2Body*/
    const body2 = this.m_world.CreateBody(bd);
    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);

    // Compute consistent velocities for new bodies based on
    // cached velocity.
    /*box2d.b2Vec2*/
    const center1 = body1.GetWorldCenter();
    /*box2d.b2Vec2*/
    const center2 = body2.GetWorldCenter();

    /*box2d.b2Vec2*/
    const velocity1 = box2d.b2Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, box2d.b2Vec2.SubVV(center1, center, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
    /*box2d.b2Vec2*/
    const velocity2 = box2d.b2Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, box2d.b2Vec2.SubVV(center2, center, box2d.b2Vec2.s_t0), new box2d.b2Vec2());

    body1.SetAngularVelocity(this.m_angularVelocity);
    body1.SetLinearVelocity(velocity1);

    body2.SetAngularVelocity(this.m_angularVelocity);
    body2.SetLinearVelocity(velocity2);
  }

  public Step(settings: testbed.Settings): void {
    if (this.m_break) {
      this.Break();
      this.m_broke = true;
      this.m_break = false;
    }

    // Cache velocities to improve movement on breakage.
    if (!this.m_broke) {
      this.m_velocity.Copy(this.m_body1.GetLinearVelocity());
      this.m_angularVelocity = this.m_body1.GetAngularVelocity();
    }

    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Breakable();
  }
}
