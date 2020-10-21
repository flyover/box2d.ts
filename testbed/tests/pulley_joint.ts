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

export class PulleyJoint extends testbed.Test {
  public m_joint1: b2.PulleyJoint;

  constructor() {
    super();

    const y = 16.0;
    const L = 12.0;
    const a = 1.0;
    const b = 2.0;

    let ground = null;
    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const circle = new b2.CircleShape();
      circle.m_radius = 2.0;

      circle.m_p.Set(-10.0, y + b + L);
      ground.CreateFixture(circle, 0.0);

      circle.m_p.Set(10.0, y + b + L);
      ground.CreateFixture(circle, 0.0);
    }

    {

      const shape = new b2.PolygonShape();
      shape.SetAsBox(a, b);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;

      //bd.fixedRotation = true;
      bd.position.Set(-10.0, y);
      const body1 = this.m_world.CreateBody(bd);
      body1.CreateFixture(shape, 5.0);

      bd.position.Set(10.0, y);
      const body2 = this.m_world.CreateBody(bd);
      body2.CreateFixture(shape, 5.0);

      const pulleyDef = new b2.PulleyJointDef();
      const anchor1 = new b2.Vec2(-10.0, y + b);
      const anchor2 = new b2.Vec2(10.0, y + b);
      const groundAnchor1 = new b2.Vec2(-10.0, y + b + L);
      const groundAnchor2 = new b2.Vec2(10.0, y + b + L);
      pulleyDef.Initialize(body1, body2, groundAnchor1, groundAnchor2, anchor1, anchor2, 1.5);

      this.m_joint1 = this.m_world.CreateJoint(pulleyDef);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    const ratio = this.m_joint1.GetRatio();
    const L = this.m_joint1.GetCurrentLengthA() + ratio * this.m_joint1.GetCurrentLengthB();
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `L1 + ${ratio.toFixed(2)} * L2 = ${L.toFixed(2)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new PulleyJoint();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Pulley", PulleyJoint.Create);
