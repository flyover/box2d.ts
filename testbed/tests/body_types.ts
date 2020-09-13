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
import * as testbed from "../testbed.js";

export class BodyTypes extends testbed.Test {
  public m_attachment: b2.Body;
  public m_platform: b2.Body;
  public m_speed = 0;

  constructor() {
    super();

    /*b2.BodyDef*/
    const bd = new b2.BodyDef();
    const ground = this.m_world.CreateBody(bd);

    /*b2.EdgeShape*/
    const shape = new b2.EdgeShape();
    shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));

    /*b2.FixtureDef*/
    const fd = new b2.FixtureDef();
    fd.shape = shape;

    ground.CreateFixture(fd);

    // Define attachment
    {
      /*b2.BodyDef*/
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 3.0);
      this.m_attachment = this.m_world.CreateBody(bd);

      /*b2.PolygonShape*/
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 2.0);
      this.m_attachment.CreateFixture(shape, 2.0);
    }

    // Define platform
    {
      /*b2.BodyDef*/
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-4.0, 5.0);
      this.m_platform = this.m_world.CreateBody(bd);

      /*b2.PolygonShape*/
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 4.0, new b2.Vec2(4.0, 0.0), 0.5 * b2.pi);

      /*b2.FixtureDef*/
      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      this.m_platform.CreateFixture(fd);

      /*b2.RevoluteJointDef*/
      const rjd = new b2.RevoluteJointDef();
      rjd.Initialize(this.m_attachment, this.m_platform, new b2.Vec2(0.0, 5.0));
      rjd.maxMotorTorque = 50.0;
      rjd.enableMotor = true;
      this.m_world.CreateJoint(rjd);

      /*b2.PrismaticJointDef*/
      const pjd = new b2.PrismaticJointDef();
      pjd.Initialize(ground, this.m_platform, new b2.Vec2(0.0, 5.0), new b2.Vec2(1.0, 0.0));

      pjd.maxMotorForce = 1000.0;
      pjd.enableMotor = true;
      pjd.lowerTranslation = -10.0;
      pjd.upperTranslation = 10.0;
      pjd.enableLimit = true;

      this.m_world.CreateJoint(pjd);

      this.m_speed = 3.0;
    }

    // Create a payload
    {
      /*b2.BodyDef*/
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 8.0);
      /*b2.Body*/
      const body = this.m_world.CreateBody(bd);

      /*b2.PolygonShape*/
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.75, 0.75);

      /*b2.FixtureDef*/
      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;

      body.CreateFixture(fd);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "d":
        this.m_platform.SetType(b2.BodyType.b2_dynamicBody);
        break;

      case "s":
        this.m_platform.SetType(b2.BodyType.b2_staticBody);
        break;

      case "k":
        this.m_platform.SetType(b2.BodyType.b2_kinematicBody);
        this.m_platform.SetLinearVelocity(new b2.Vec2(-this.m_speed, 0.0));
        this.m_platform.SetAngularVelocity(0.0);
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    // Drive the kinematic body.
    if (this.m_platform.GetType() === b2.BodyType.b2_kinematicBody) {
      /*b2.Vec2*/
      const p = this.m_platform.GetTransform().p;
      /*b2.Vec2*/
      const v = this.m_platform.GetLinearVelocity();

      if ((p.x < -10.0 && v.x < 0.0) ||
        (p.x > 10.0 && v.x > 0.0)) {
        this.m_platform.SetLinearVelocity(new b2.Vec2(-v.x, v.y));
      }
    }

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (d) dynamic, (s) static, (k) kinematic");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new BodyTypes();
  }
}
