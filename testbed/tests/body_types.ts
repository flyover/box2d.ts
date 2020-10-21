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

export class BodyTypes extends testbed.Test {
  public m_attachment: b2.Body;
  public m_platform: b2.Body;
  public m_speed = 0;

  constructor() {
    super();

    const bd = new b2.BodyDef();
    const ground = this.m_world.CreateBody(bd);

    const shape = new b2.EdgeShape();
    shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));

    const fd = new b2.FixtureDef();
    fd.shape = shape;

    ground.CreateFixture(fd);

    // Define attachment
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 3.0);
      this.m_attachment = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 2.0);
      this.m_attachment.CreateFixture(shape, 2.0);
    }

    // Define platform
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-4.0, 5.0);
      this.m_platform = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 4.0, new b2.Vec2(4.0, 0.0), 0.5 * b2.pi);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      this.m_platform.CreateFixture(fd);

      const rjd = new b2.RevoluteJointDef();
      rjd.Initialize(this.m_attachment, this.m_platform, new b2.Vec2(0.0, 5.0));
      rjd.maxMotorTorque = 50.0;
      rjd.enableMotor = true;
      this.m_world.CreateJoint(rjd);

      const pjd = new b2.PrismaticJointDef();
      pjd.Initialize(ground, this.m_platform, new b2.Vec2(0.0, 5.0), new b2.Vec2(1.0, 0.0));

      pjd.maxMotorForce = 1000.0;
      pjd.enableMotor = true;
      pjd.lowerTranslation = -10.0;
      pjd.upperTranslation = 10.0;
      pjd.enableLimit = true;

      this.m_world.CreateJoint(pjd);

      this.m_speed = 3.0;
    }

    // Create a payload
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 8.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.75, 0.75);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;

      body.CreateFixture(fd);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "d":
        this.m_platform.SetType(b2.BodyType.b2_dynamicBody);
        break;

      case "s":
        this.m_platform.SetType(b2.BodyType.b2_staticBody);
        break;

      case "k":
        this.m_platform.SetType(b2.BodyType.b2_kinematicBody);
        this.m_platform.SetLinearVelocity(new b2.Vec2(-this.m_speed, 0.0));
        this.m_platform.SetAngularVelocity(0.0);
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    // Drive the kinematic body.
    if (this.m_platform.GetType() === b2.BodyType.b2_kinematicBody) {
      const p = this.m_platform.GetTransform().p;
      const v = this.m_platform.GetLinearVelocity();

      if ((p.x < -10.0 && v.x < 0.0) ||
        (p.x > 10.0 && v.x > 0.0)) {
        this.m_platform.SetLinearVelocity(new b2.Vec2(-v.x, v.y));
      }
    }

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (d) dynamic, (s) static, (k) kinematic");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new BodyTypes();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Body Types", BodyTypes.Create);
