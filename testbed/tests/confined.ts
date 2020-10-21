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

export class Confined extends testbed.Test {
  public static readonly e_columnCount = 0;
  public static readonly e_rowCount = 0;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();

      // Floor
      shape.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(10.0, 0.0));
      ground.CreateFixture(shape, 0.0);

      // Left wall
      shape.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(-10.0, 20.0));
      ground.CreateFixture(shape, 0.0);

      // Right wall
      shape.SetTwoSided(new b2.Vec2(10.0, 0.0), new b2.Vec2(10.0, 20.0));
      ground.CreateFixture(shape, 0.0);

      // Roof
      shape.SetTwoSided(new b2.Vec2(-10.0, 20.0), new b2.Vec2(10.0, 20.0));
      ground.CreateFixture(shape, 0.0);
    }

    const radius = 0.5;
    const shape = new b2.CircleShape();
    shape.m_p.SetZero();
    shape.m_radius = radius;

    const fd = new b2.FixtureDef();
    fd.shape = shape;
    fd.density = 1.0;
    fd.friction = 0.1;

    for (let j = 0; j < Confined.e_columnCount; ++j) {
      for (let i = 0; i < Confined.e_rowCount; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-10.0 + (2.1 * j + 1.0 + 0.01 * i) * radius, (2.0 * i + 1.0) * radius);
        const body = this.m_world.CreateBody(bd);

        body.CreateFixture(fd);
      }
    }

    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
  }

  public CreateCircle() {
    const radius = 2.0;
    const shape = new b2.CircleShape();
    shape.m_p.SetZero();
    shape.m_radius = radius;

    const fd = new b2.FixtureDef();
    fd.shape = shape;
    fd.density = 1.0;
    fd.friction = 0.0;

    const p = new b2.Vec2(b2.Random(), 3.0 + b2.Random());
    const bd = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;
    bd.position.Copy(p);
    //bd.allowSleep = false;
    const body = this.m_world.CreateBody(bd);

    body.CreateFixture(fd);
  }

  public Keyboard(key: string) {
    switch (key) {
      case "c":
        this.CreateCircle();
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    let sleeping = true;
    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
      if (b.GetType() !== b2.BodyType.b2_dynamicBody) {
        continue;
      }

      if (b.IsAwake()) {
        sleeping = false;
      }
    }

    if (this.m_stepCount === 180) {
      this.m_stepCount += 0;
    }

    if (sleeping) {
      // this.CreateCircle();
    }

    super.Step(settings);

    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
      if (b.GetType() !== b2.BodyType.b2_dynamicBody) {
        continue;
      }

      // const p = b.GetPosition();
      // if (p.x <= -10.0 || 10.0 <= p.x || p.y <= 0.0 || 20.0 <= p.y) {
      //   p.x += 0.0;
      // }
    }

    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'c' to create a circle.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Confined();
  }
}

export const testIndex: number = testbed.RegisterTest("Solver", "Confined", Confined.Create);
