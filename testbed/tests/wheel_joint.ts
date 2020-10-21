// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import * as testbed from "@testbed";

// Test the wheel joint with motor, spring, and limit options.
export class WheelJoint extends testbed.Test {
  public m_enableLimit = false;
  public m_enableMotor = false;
  public m_motorSpeed = 0.0;

  constructor() {
    super();

    let ground: b2.Body | null = null;
    {
      const bd: b2.BodyDef = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape: b2.EdgeShape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    this.m_enableLimit = true;
    this.m_enableMotor = false;
    this.m_motorSpeed = 10.0;

    {
      const shape: b2.CircleShape = new b2.CircleShape();
      shape.m_radius = 2.0;

      const bd: b2.BodyDef = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Set(0.0, 10.0);
      bd.allowSleep = false;
      const body: b2.Body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 5.0);

      const jd: b2.WheelJointDef = new b2.WheelJointDef();

      // Horizontal
      jd.Initialize(ground, body, bd.position, new b2.Vec2(0.0, 1.0));

      jd.motorSpeed = this.m_motorSpeed;
      jd.maxMotorTorque = 10000.0;
      jd.enableMotor = this.m_enableMotor;
      jd.lowerTranslation = -3.0;
      jd.upperTranslation = 3.0;
      jd.enableLimit = this.m_enableLimit;

      const hertz: number = 1.0;
      const dampingRatio: number = 0.7;
      b2.LinearStiffness(jd, hertz, dampingRatio, ground, body);

      this.m_joint = this.m_world.CreateJoint(jd);
    }
  }

  public m_joint: b2.WheelJoint;

  private static Step_s_F: b2.Vec2 = new b2.Vec2();
  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const torque: number = this.m_joint.GetMotorTorque(settings.m_hertz);
    // g_debugDraw.DrawString(5, m_textLine, "Motor Torque = %4.0f", torque);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    const F: b2.Vec2 = this.m_joint.GetReactionForce(settings.m_hertz, WheelJoint.Step_s_F);
    // g_debugDraw.DrawString(5, m_textLine, "Reaction Force = (%4.1f, %4.1f)", F.x, F.y);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Reaction Force = (${F.x.toFixed(1)}, ${F.y.toFixed(1)})`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new WheelJoint();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Wheel", WheelJoint.Create);
