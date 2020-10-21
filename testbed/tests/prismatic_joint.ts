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

export class Prismatic extends testbed.Test {
  public m_joint: b2.PrismaticJoint;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(1.0, 1.0);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 10.0);
      bd.angle = 0.5 * b2.pi;
      bd.allowSleep = false;
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 5.0);

      const pjd = new b2.PrismaticJointDef();

      // Horizontal
			pjd.Initialize(ground, body, bd.position, new b2.Vec2(1.0, 0.0));

      pjd.motorSpeed = 10.0;
      pjd.maxMotorForce = 10000.0;
      pjd.enableMotor = true;
      pjd.lowerTranslation = -10.0;
      pjd.upperTranslation = 10.0;
      pjd.enableLimit = true;

      this.m_joint = this.m_world.CreateJoint(pjd);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "l":
        this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
        break;

      case "m":
        this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
        break;

      case "s":
        this.m_joint.SetMotorSpeed(-this.m_joint.GetMotorSpeed());
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    const force = this.m_joint.GetMotorForce(settings.m_hertz);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Prismatic();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Prismatic", Prismatic.Create);
