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

// Adapted from MotorJoint.h

export class MotorJoint2 extends testbed.Test {
  constructor() {
    super();

    let ground: box2d.b2Body;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;

      ground.CreateFixture(fd);
    }

    // b2Body * body1 = NULL;
    let body1: box2d.b2Body;
    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 4.0);
      body1 = this.m_world.CreateBody(bd);

      const shape = new box2d.b2CircleShape();
      shape.m_radius = 1.0;

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body1.CreateFixture(fd);
    }

    // b2Body * body2 = NULL;
    let body2: box2d.b2Body;
    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(4.0, 8.0);
      body2 = this.m_world.CreateBody(bd);

      const shape = new box2d.b2CircleShape();
      shape.m_radius = 1.0;

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body2.CreateFixture(fd);
    }

    {
      const mjd = new box2d.b2MotorJointDef();
      mjd.Initialize(body1, body2);
      mjd.maxForce = 1000.0;
      mjd.maxTorque = 1000.0;
      this.m_joint = this.m_world.CreateJoint(mjd) as box2d.b2MotorJoint;
    }
  }

  // b2MotorJoint* m_joint;
  public m_joint: box2d.b2MotorJoint;

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new MotorJoint2();
  }
}
