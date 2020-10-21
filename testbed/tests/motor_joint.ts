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

/// This test shows how to use a motor joint. A motor joint
/// can be used to animate a dynamic body. With finite motor forces
/// the body can be blocked by collision with other bodies.
export class MotorJoint extends testbed.Test {
  public m_joint: b2.MotorJoint;
  public m_time = 0;
  public m_go = false;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));

      const fd = new b2.FixtureDef();
      fd.shape = shape;

      ground.CreateFixture(fd);
    }

    // Define motorized body
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 8.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(2.0, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body.CreateFixture(fd);

      const mjd = new b2.MotorJointDef();
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
    if (this.m_go && settings.m_hertz > 0.0) {
      this.m_time += 1.0 / settings.m_hertz;
    }

    const linearOffset = new b2.Vec2();
    linearOffset.x = 6.0 * b2.Sin(2.0 * this.m_time);
    linearOffset.y = 8.0 + 4.0 * b2.Sin(1.0 * this.m_time);

    const angularOffset = 4.0 * this.m_time;

    this.m_joint.SetLinearOffset(linearOffset);
    this.m_joint.SetAngularOffset(angularOffset);

    testbed.g_debugDraw.DrawPoint(linearOffset, 4.0, new b2.Color(0.9, 0.9, 0.9));

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (s) pause");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new MotorJoint();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Motor Joint", MotorJoint.Create);
