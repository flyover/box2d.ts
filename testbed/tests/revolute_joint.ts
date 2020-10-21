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

export class Revolute extends testbed.Test {
  public m_ball: b2.Body;
  public m_joint: b2.RevoluteJoint;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      //fd.filter.categoryBits = 2;

      ground.CreateFixture(fd);
    }

    {
      const shape = new b2.CircleShape();
      shape.m_radius = 0.5;

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;

      const rjd = new b2.RevoluteJointDef();

      bd.position.Set(-10.0, 20.0);
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 5.0);

      const w = 100.0;
      body.SetAngularVelocity(w);
      body.SetLinearVelocity(new b2.Vec2(-8.0 * w, 0.0));

      rjd.Initialize(ground, body, new b2.Vec2(-10.0, 12.0));
      rjd.motorSpeed = 1.0 * b2.pi;
      rjd.maxMotorTorque = 10000.0;
      rjd.enableMotor = false;
      rjd.lowerAngle = -0.25 * b2.pi;
      rjd.upperAngle = 0.5 * b2.pi;
      rjd.enableLimit = true;
      rjd.collideConnected = true;

      this.m_joint = this.m_world.CreateJoint(rjd);
    }

    {
      const circle_shape = new b2.CircleShape();
      circle_shape.m_radius = 3.0;

      const circle_bd = new b2.BodyDef();
      circle_bd.type = b2.BodyType.b2_dynamicBody;
      circle_bd.position.Set(5.0, 30.0);

      const fd = new b2.FixtureDef();
      fd.density = 5.0;
      fd.filter.maskBits = 1;
      fd.shape = circle_shape;

      this.m_ball = this.m_world.CreateBody(circle_bd);
      this.m_ball.CreateFixture(fd);

      const polygon_shape = new b2.PolygonShape();
      polygon_shape.SetAsBox(10.0, 0.2, new b2.Vec2(-10.0, 0.0), 0.0);

      const polygon_bd = new b2.BodyDef();
      polygon_bd.position.Set(20.0, 10.0);
      polygon_bd.type = b2.BodyType.b2_dynamicBody;
      polygon_bd.bullet = true;
      const polygon_body = this.m_world.CreateBody(polygon_bd);
      polygon_body.CreateFixture(polygon_shape, 2.0);

      const rjd = new b2.RevoluteJointDef();
      rjd.Initialize(ground, polygon_body, new b2.Vec2(20.0, 10.0));
      rjd.lowerAngle = -0.25 * b2.pi;
      rjd.upperAngle = 0.0 * b2.pi;
      rjd.enableLimit = true;
      this.m_world.CreateJoint(rjd);
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
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motor");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    // if (this.m_stepCount === 360) {
    //   this.m_ball.SetTransformVec(new b2.Vec2(0.0, 0.5), 0.0);
    // }

    // const torque1 = this.m_joint.GetMotorTorque(settings.hz);
    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque1.toFixed(0)}, ${torque2.toFixed(0)} : Motor Force = ${force3.toFixed(0)}`);
    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Revolute();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Revolute", Revolute.Create);
