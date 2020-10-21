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

// A motor driven slider crank with joint friction.

export class SliderCrank2 extends testbed.Test {
  public static readonly e_count = 30;

  public m_joint1: b2.RevoluteJoint;
  public m_joint2: b2.PrismaticJoint;

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
      let prevBody = ground;

      // Define crank.
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(0.5, 2.0);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 7.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 5.0));
        rjd.motorSpeed = 1.0 * b2.pi;
        rjd.maxMotorTorque = 10000.0;
        rjd.enableMotor = true;
        this.m_joint1 = this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define follower.
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(0.5, 4.0);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 13.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 9.0));
        rjd.enableMotor = false;
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define piston
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(1.5, 1.5);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.fixedRotation = true;
        bd.position.Set(0.0, 17.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(0.0, 17.0));
        this.m_world.CreateJoint(rjd);

        const pjd = new b2.PrismaticJointDef();
        pjd.Initialize(ground, body, new b2.Vec2(0.0, 17.0), new b2.Vec2(0.0, 1.0));

        pjd.maxMotorForce = 1000.0;
        pjd.enableMotor = true;

        this.m_joint2 = this.m_world.CreateJoint(pjd);
      }

      // Create a payload
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(1.5, 1.5);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
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
    const torque = this.m_joint1.GetMotorTorque(settings.m_hertz);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new SliderCrank2();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Slider Crank 2", SliderCrank2.Create);
