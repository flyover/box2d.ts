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

export class Gears extends testbed.Test {
  public m_joint1: box2d.b2RevoluteJoint;
  public m_joint2: box2d.b2RevoluteJoint;
  public m_joint3: box2d.b2PrismaticJoint;
  public m_joint4: box2d.b2GearJoint;
  public m_joint5: box2d.b2GearJoint;

  constructor() {
    super();

    let ground = null;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(50.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const circle1 = new box2d.b2CircleShape();
      circle1.m_radius = 1.0;

      const box = new box2d.b2PolygonShape();
      box.SetAsBox(0.5, 5.0);

      const circle2 = new box2d.b2CircleShape();
      circle2.m_radius = 2.0;

      const bd1 = new box2d.b2BodyDef();
      bd1.type = box2d.b2BodyType.b2_staticBody;
      bd1.position.Set(10.0, 9.0);
      const body1 = this.m_world.CreateBody(bd1);
      body1.CreateFixture(circle1, 5.0);

      const bd2 = new box2d.b2BodyDef();
      bd2.type = box2d.b2BodyType.b2_dynamicBody;
      bd2.position.Set(10.0, 8.0);
      const body2 = this.m_world.CreateBody(bd2);
      body2.CreateFixture(box, 5.0);

      const bd3 = new box2d.b2BodyDef();
      bd3.type = box2d.b2BodyType.b2_dynamicBody;
      bd3.position.Set(10.0, 6.0);
      const body3 = this.m_world.CreateBody(bd3);
      body3.CreateFixture(circle2, 5.0);

      const jd1 = new box2d.b2RevoluteJointDef();
      jd1.Initialize(body2, body1, bd1.position);
      const joint1: box2d.b2RevoluteJoint = this.m_world.CreateJoint(jd1);

      const jd2 = new box2d.b2RevoluteJointDef();
      jd2.Initialize(body2, body3, bd3.position);
      const joint2: box2d.b2RevoluteJoint = this.m_world.CreateJoint(jd2);

      const jd4 = new box2d.b2GearJointDef();
      jd4.bodyA = body1;
      jd4.bodyB = body3;
      jd4.joint1 = joint1;
      jd4.joint2 = joint2;
      jd4.ratio = circle2.m_radius / circle1.m_radius;
      this.m_world.CreateJoint(jd4);
    }

    {
      const circle1 = new box2d.b2CircleShape();
      circle1.m_radius = 1.0;

      const circle2 = new box2d.b2CircleShape();
      circle2.m_radius = 2.0;

      const box = new box2d.b2PolygonShape();
      box.SetAsBox(0.5, 5.0);

      const bd1 = new box2d.b2BodyDef();
      bd1.type = box2d.b2BodyType.b2_dynamicBody;
      bd1.position.Set(-3.0, 12.0);
      const body1 = this.m_world.CreateBody(bd1);
      body1.CreateFixture(circle1, 5.0);

      const jd1 = new box2d.b2RevoluteJointDef();
      jd1.bodyA = ground;
      jd1.bodyB = body1;
      ground.GetLocalPoint(bd1.position, jd1.localAnchorA);
      body1.GetLocalPoint(bd1.position, jd1.localAnchorB);
      jd1.referenceAngle = body1.GetAngle() - ground.GetAngle();
      this.m_joint1 = this.m_world.CreateJoint(jd1);

      const bd2 = new box2d.b2BodyDef();
      bd2.type = box2d.b2BodyType.b2_dynamicBody;
      bd2.position.Set(0.0, 12.0);
      const body2 = this.m_world.CreateBody(bd2);
      body2.CreateFixture(circle2, 5.0);

      const jd2 = new box2d.b2RevoluteJointDef();
      jd2.Initialize(ground, body2, bd2.position);
      this.m_joint2 = this.m_world.CreateJoint(jd2);

      const bd3 = new box2d.b2BodyDef();
      bd3.type = box2d.b2BodyType.b2_dynamicBody;
      bd3.position.Set(2.5, 12.0);
      const body3 = this.m_world.CreateBody(bd3);
      body3.CreateFixture(box, 5.0);

      const jd3 = new box2d.b2PrismaticJointDef();
      jd3.Initialize(ground, body3, bd3.position, new box2d.b2Vec2(0.0, 1.0));
      jd3.lowerTranslation = -5.0;
      jd3.upperTranslation = 5.0;
      jd3.enableLimit = true;

      this.m_joint3 = this.m_world.CreateJoint(jd3);

      const jd4 = new box2d.b2GearJointDef();
      jd4.bodyA = body1;
      jd4.bodyB = body2;
      jd4.joint1 = this.m_joint1;
      jd4.joint2 = this.m_joint2;
      jd4.ratio = circle2.m_radius / circle1.m_radius;
      this.m_joint4 = this.m_world.CreateJoint(jd4);

      const jd5 = new box2d.b2GearJointDef();
      jd5.bodyA = body2;
      jd5.bodyB = body3;
      jd5.joint1 = this.m_joint2;
      jd5.joint2 = this.m_joint3;
      jd5.ratio = -1.0 / circle2.m_radius;
      this.m_joint5 = this.m_world.CreateJoint(jd5);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Gears();
  }
}
