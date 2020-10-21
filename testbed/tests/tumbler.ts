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

export class Tumbler extends testbed.Test {
  public static readonly e_count = 800;

  public m_joint: b2.RevoluteJoint;
  public m_count = 0;

  constructor() {
    super();

    const ground = this.m_world.CreateBody(new b2.BodyDef());

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.allowSleep = false;
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 10.0, new b2.Vec2(10.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(0.5, 10.0, new b2.Vec2(-10.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(10.0, 0.5, new b2.Vec2(0.0, 10.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(10.0, 0.5, new b2.Vec2(0.0, -10.0), 0.0);
      body.CreateFixture(shape, 5.0);

      const jd = new b2.RevoluteJointDef();
      jd.bodyA = ground;
      jd.bodyB = body;
      jd.localAnchorA.Set(0.0, 10.0);
      jd.localAnchorB.Set(0.0, 0.0);
      jd.referenceAngle = 0.0;
      jd.motorSpeed = 0.05 * b2.pi;
      jd.maxMotorTorque = 1e8;
      jd.enableMotor = true;
      this.m_joint = this.m_world.CreateJoint(jd);
    }

    this.m_count = 0;
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    if (this.m_count < Tumbler.e_count) {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.125, 0.125);
      body.CreateFixture(shape, 1.0);

      ++this.m_count;
    }
  }

  public static Create(): testbed.Test {
    return new Tumbler();
  }
}

export const testIndex: number = testbed.RegisterTest("Benchmark", "Tumbler", Tumbler.Create);
