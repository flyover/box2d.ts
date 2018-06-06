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

export class MotorJoint extends testbed.Test {
  public m_joint: box2d.b2MotorJoint;
  public m_time = 0;
  public m_go = false;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;

      ground.CreateFixture(fd);
    }

    // Define motorized body
    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 8.0);
      /*b2Body*/
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(2.0, 0.5);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body.CreateFixture(fd);

      const mjd = new box2d.b2MotorJointDef();
      mjd.Initialize(ground, body);
      mjd.maxForce = 1000.0;
      mjd.maxTorque = 1000.0;
      this.m_joint = this.m_world.CreateJoint(mjd);
    }

    this.m_go = false;
    this.m_time = 0.0;
  }

  public Keyboard(key: string) {
    switch (key) {
      case "s":
        this.m_go = !this.m_go;
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    if (this.m_go && settings.hz > 0.0) {
      this.m_time += 1.0 / settings.hz;
    }

    /*b2Vec2*/
    const linearOffset = new box2d.b2Vec2();
    linearOffset.x = 6.0 * box2d.b2Sin(2.0 * this.m_time);
    linearOffset.y = 8.0 + 4.0 * box2d.b2Sin(1.0 * this.m_time);

    /*float32*/
    const angularOffset = 4.0 * this.m_time;

    this.m_joint.SetLinearOffset(linearOffset);
    this.m_joint.SetAngularOffset(angularOffset);

    testbed.g_debugDraw.DrawPoint(linearOffset, 4.0, new box2d.b2Color(0.9, 0.9, 0.9));

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (s) pause");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new MotorJoint();
  }
}
