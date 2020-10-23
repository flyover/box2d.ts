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

// Note: even with a restitution of 1.0, there is some energy change
// due to position correction.
export class Restitution extends testbed.Test {
  constructor() {
    super();

    const threshold: number = 10.0;

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.restitutionThreshold = threshold;
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.CircleShape();
      shape.m_radius = 1.0;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;

      const restitution = [0.0, 0.1, 0.3, 0.5, 0.75, 0.9, 1.0];

      for (let i = 0; i < 7; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-10.0 + 3.0 * i, 20.0);

        const body = this.m_world.CreateBody(bd);

        fd.restitution = restitution[i];
        fd.restitutionThreshold = threshold;
        body.CreateFixture(fd);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Restitution();
  }
}

export const testIndex: number = testbed.RegisterTest("Forces", "Restitution", Restitution.Create);
