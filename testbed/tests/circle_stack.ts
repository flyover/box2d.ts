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

export class CircleStack extends testbed.Test {
  public static readonly e_count: number = 10;

  public m_bodies: b2.Body[] = [];

  constructor() {
    super();

    {
      const bd: b2.BodyDef = new b2.BodyDef();
      const ground: b2.Body = this.m_world.CreateBody(bd);

      const shape: b2.EdgeShape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape: b2.CircleShape = new b2.CircleShape();
      shape.m_radius = 1.0;

      for (let i: number = 0; i < CircleStack.e_count; ++i) {
        const bd: b2.BodyDef = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(0.0, 4.0 + 3.0 * i);

        this.m_bodies[i] = this.m_world.CreateBody(bd);

        this.m_bodies[i].CreateFixture(shape, 1.0);

        this.m_bodies[i].SetLinearVelocity(new b2.Vec2(0.0, -50.0));
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    // for (let i: number = 0; i < CircleStack.e_count; ++i)
    // {
    //   printf("%g ", this.m_bodies[i].GetWorldCenter().y);
    // }

    // for (let i: number = 0; i < CircleStack.e_count; ++i)
    // {
    //   printf("%g ", this.m_bodies[i].GetLinearVelocity().y);
    // }

    // printf("\n");
  }

  public static Create(): testbed.Test {
    return new CircleStack();
  }
}

export const testIndex: number = testbed.RegisterTest("Stacking", "Circles", CircleStack.Create);
