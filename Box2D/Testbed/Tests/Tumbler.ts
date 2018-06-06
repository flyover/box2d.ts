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

export class Tumbler extends testbed.Test {
  public static readonly e_count = 800;

  public m_joint: box2d.b2RevoluteJoint;
  public m_count = 0;

  constructor() {
    super();

    const ground = this.m_world.CreateBody(new box2d.b2BodyDef());

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.allowSleep = false;
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(10.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(-10.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(10.0, 0.5, new box2d.b2Vec2(0.0, 10.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(10.0, 0.5, new box2d.b2Vec2(0.0, -10.0), 0.0);
      body.CreateFixture(shape, 5.0);

      const jd = new box2d.b2RevoluteJointDef();
      jd.bodyA = ground;
      jd.bodyB = body;
      jd.localAnchorA.Set(0.0, 10.0);
      jd.localAnchorB.Set(0.0, 0.0);
      jd.referenceAngle = 0.0;
      jd.motorSpeed = 0.05 * box2d.b2_pi;
      jd.maxMotorTorque = 1e8;
      jd.enableMotor = true;
      this.m_joint = this.m_world.CreateJoint(jd);
    }

    this.m_count = 0;
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    if (this.m_count < Tumbler.e_count) {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.125, 0.125);
      body.CreateFixture(shape, 1.0);

      ++this.m_count;
    }
  }

  public static Create(): testbed.Test {
    return new Tumbler();
  }
}
