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

/**
 * This tests bullet collision and provides an example of a
 * gameplay scenario. This also uses a loop shape.
 */

export class Pinball extends testbed.Test {
  public m_leftJoint: box2d.b2RevoluteJoint;
  public m_rightJoint: box2d.b2RevoluteJoint;
  public m_ball: box2d.b2Body;
  public m_button: boolean = false;

  constructor() {
    super();

    // Ground body
    /*box2d.b2Body*/
    let ground = null;
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      /*box2d.b2Vec2*/
      const vs = box2d.b2Vec2.MakeArray(5);
      vs[0].Set(0.0, -2.0);
      vs[1].Set(8.0, 6.0);
      vs[2].Set(8.0, 20.0);
      vs[3].Set(-8.0, 20.0);
      vs[4].Set(-8.0, 6.0);

      /*box2d.b2ChainShape*/
      const loop = new box2d.b2ChainShape();
      loop.CreateLoop(vs, 5);
      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.shape = loop;
      fd.density = 0.0;
      ground.CreateFixture(fd);
    }

    // Flippers
    {
      /*box2d.b2Vec2*/
      const p1 = new box2d.b2Vec2(-2.0, 0.0),
        p2 = new box2d.b2Vec2(2.0, 0.0);

      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;

      bd.position.Copy(p1);
      /*box2d.b2Body*/
      const leftFlipper = this.m_world.CreateBody(bd);

      bd.position.Copy(p2);
      /*box2d.b2Body*/
      const rightFlipper = this.m_world.CreateBody(bd);

      /*box2d.b2PolygonShape*/
      const box = new box2d.b2PolygonShape();
      box.SetAsBox(1.75, 0.1);

      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.shape = box;
      fd.density = 1.0;

      leftFlipper.CreateFixture(fd);
      rightFlipper.CreateFixture(fd);

      /*box2d.b2RevoluteJointDef*/
      const jd = new box2d.b2RevoluteJointDef();
      jd.bodyA = ground;
      jd.localAnchorB.SetZero();
      jd.enableMotor = true;
      jd.maxMotorTorque = 1000.0;
      jd.enableLimit = true;

      jd.motorSpeed = 0.0;
      jd.localAnchorA.Copy(p1);
      jd.bodyB = leftFlipper;
      jd.lowerAngle = -30.0 * box2d.b2_pi / 180.0;
      jd.upperAngle = 5.0 * box2d.b2_pi / 180.0;
      this.m_leftJoint = this.m_world.CreateJoint(jd);

      jd.motorSpeed = 0.0;
      jd.localAnchorA.Copy(p2);
      jd.bodyB = rightFlipper;
      jd.lowerAngle = -5.0 * box2d.b2_pi / 180.0;
      jd.upperAngle = 30.0 * box2d.b2_pi / 180.0;
      this.m_rightJoint = this.m_world.CreateJoint(jd);
    }

    // Circle character
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.position.Set(1.0, 15.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.bullet = true;

      this.m_ball = this.m_world.CreateBody(bd);

      /*box2d.b2CircleShape*/
      const shape = new box2d.b2CircleShape();
      shape.m_radius = 0.2;

      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      this.m_ball.CreateFixture(fd);
    }

    this.m_button = false;
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        this.m_button = true;
        break;
    }
  }

  public KeyboardUp(key: string) {
    switch (key) {
      case "a":
        this.m_button = false;
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    if (this.m_button) {
      this.m_leftJoint.SetMotorSpeed(20.0);
      this.m_rightJoint.SetMotorSpeed(-20.0);
    } else {
      this.m_leftJoint.SetMotorSpeed(-10.0);
      this.m_rightJoint.SetMotorSpeed(10.0);
    }

    super.Step(settings);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to control the flippers");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Pinball();
  }
}
