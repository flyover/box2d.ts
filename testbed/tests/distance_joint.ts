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

// This tests distance joints, body destruction, and joint destruction.
export class DistanceJoint extends testbed.Test {
  public m_joint: b2.DistanceJoint;
  public m_length: number;
  public m_minLength: number;
  public m_maxLength: number;
  public m_hertz: number;
  public m_dampingRatio: number;

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
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.angularDamping = 0.1;

      bd.position.Set(0.0, 5.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);
      body.CreateFixture(shape, 5.0);

      this.m_hertz = 1.0;
      this.m_dampingRatio = 0.7;

      const jd = new b2.DistanceJointDef();
      jd.Initialize(ground, body, new b2.Vec2(0.0, 15.0), bd.position);
      jd.collideConnected = true;
      this.m_length = jd.length;
      this.m_minLength = jd.minLength = jd.length - 3;
      this.m_maxLength = jd.maxLength = jd.length + 3;
      b2.LinearStiffness(jd, this.m_hertz, this.m_dampingRatio, jd.bodyA, jd.bodyB);
      this.m_joint = this.m_world.CreateJoint(jd);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "l":
        // this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
        break;

      case "m":
        // this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
        break;

      case "s":
        // this.m_joint.SetMotorSpeed(-this.m_joint.GetMotorSpeed());
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    // testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    // const force = this.m_joint.GetMotorForce(settings.m_hertz);
    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new DistanceJoint();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "DistanceJoint", DistanceJoint.Create);
