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

export class SliderCrank1 extends testbed.Test {
  constructor() {
    super();

    let ground = null;
    {
      const bd = new b2.BodyDef();
      bd.position.Set(0.0, 17.0);
      ground = this.m_world.CreateBody(bd);
    }

    {
      let prevBody = ground;

      // Define crank.
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(4.0, 1.0);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-8.0, 20.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(-12.0, 20.0));
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define connecting rod
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(8.0, 1.0);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(4.0, 20.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(-4.0, 20.0));
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define piston
      {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(3.0, 3.0);

        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.fixedRotation = true;
        bd.position.Set(12.0, 20.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        const rjd = new b2.RevoluteJointDef();
        rjd.Initialize(prevBody, body, new b2.Vec2(12.0, 20.0));
        this.m_world.CreateJoint(rjd);

        const pjd = new b2.PrismaticJointDef();
        pjd.Initialize(ground, body, new b2.Vec2(12.0, 17.0), new b2.Vec2(1.0, 0.0));
        this.m_world.CreateJoint(pjd);
      }
    }
  }

  public static Create() {
    return new SliderCrank1();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Slider Crank 1", SliderCrank1.Create);
