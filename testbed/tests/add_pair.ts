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

export class AddPair extends testbed.Test {
  constructor() {
    super();

    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
    {
      const shape = new b2.CircleShape();
      shape.m_p.SetZero();
      shape.m_radius = 0.1;

      const minX = -6.0;
      const maxX = 0.0;
      const minY = 4.0;
      const maxY = 6.0;

      for (let i = 0; i < 400; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(b2.RandomRange(minX, maxX), b2.RandomRange(minY, maxY));
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 0.01);
      }
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(1.5, 1.5);
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-40.0, 5.0);
      bd.bullet = true;
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 1.0);
      body.SetLinearVelocity(new b2.Vec2(10.0, 0.0));
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new AddPair();
  }
}

export const testIndex: number = testbed.RegisterTest("Benchmark", "Add Pair", AddPair.Create);
