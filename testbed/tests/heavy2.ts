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

export class Heavy2 extends testbed.Test {
  public m_heavy: b2.Body | null = null;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    const bd = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;
    bd.position.Set(0.0, 2.5);
    let body = this.m_world.CreateBody(bd);

    const shape = new b2.CircleShape();
    shape.m_radius = 0.5;
    body.CreateFixture(shape, 10.0);

    bd.position.Set(0.0, 3.5);
    body = this.m_world.CreateBody(bd);
    body.CreateFixture(shape, 10.0);
  }

  public ToggleHeavy() {
    if (this.m_heavy !== null) {
      this.m_world.DestroyBody(this.m_heavy);
      this.m_heavy = null;
    } else {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 9.0);
      this.m_heavy = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 5.0;
      this.m_heavy.CreateFixture(shape, 10.0);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "h":
        this.ToggleHeavy();
        break;
    }
  }

  public static Create() {
    return new Heavy2();
  }
}

export const testIndex: number = testbed.RegisterTest("Solver", "Heavy 2", Heavy2.Create);
