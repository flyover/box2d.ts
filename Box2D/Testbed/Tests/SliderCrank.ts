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

export class SliderCrank extends testbed.Test {
  public static readonly e_count = 30;

  public m_joint1: box2d.b2RevoluteJoint;
  public m_joint2: box2d.b2PrismaticJoint;

  constructor() {
    super();

    let ground = null;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      let prevBody = ground;

      // Define crank.
      {
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(0.5, 2.0);

        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 7.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 5.0));
        rjd.motorSpeed = 1.0 * box2d.b2_pi;
        rjd.maxMotorTorque = 10000.0;
        rjd.enableMotor = true;
        this.m_joint1 = this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define follower.
      {
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(0.5, 4.0);

        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 13.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 9.0));
        rjd.enableMotor = false;
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define piston
      {
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(1.5, 1.5);

        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.fixedRotation = true;
        bd.position.Set(0.0, 17.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 17.0));
        this.m_world.CreateJoint(rjd);

        const pjd = new box2d.b2PrismaticJointDef();
        pjd.Initialize(ground, body, new box2d.b2Vec2(0.0, 17.0), new box2d.b2Vec2(0.0, 1.0));

        pjd.maxMotorForce = 1000.0;
        pjd.enableMotor = true;

        this.m_joint2 = this.m_world.CreateJoint(pjd);
      }

      // Create a payload
      {
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(1.5, 1.5);

        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 23.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "f":
        this.m_joint2.EnableMotor(!this.m_joint2.IsMotorEnabled());
        this.m_joint2.GetBodyB().SetAwake(true);
        break;

      case "m":
        this.m_joint1.EnableMotor(!this.m_joint1.IsMotorEnabled());
        this.m_joint1.GetBodyB().SetAwake(true);
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (f) toggle friction, (m) toggle motor");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    const torque = this.m_joint1.GetMotorTorque(settings.hz);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new SliderCrank();
  }
}
