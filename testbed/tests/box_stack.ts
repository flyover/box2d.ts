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

export class BoxStack extends testbed.Test {
  public static readonly e_columnCount = 1;
  public static readonly e_rowCount = 15;

  public m_bullet: b2.Body | null = null;
  public m_bodies: b2.Body[];
  public m_indices: number[];

  constructor() {
    super();

    this.m_bodies = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
    this.m_indices = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(new b2.Vec2(20.0, 0.0), new b2.Vec2(20.0, 20.0));
      ground.CreateFixture(shape, 0.0);
    }

    const xs = [0.0, -10.0, -5.0, 5.0, 10.0];

    for (let j = 0; j < BoxStack.e_columnCount; ++j) {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for (let i = 0; i < BoxStack.e_rowCount; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;

        const n = j * BoxStack.e_rowCount + i;
        // DEBUG: b2.Assert(n < BoxStack.e_rowCount * BoxStack.e_columnCount);
        this.m_indices[n] = n;
        bd.userData = this.m_indices[n];

        const x = 0.0;
        //const x = b2.RandomRange(-0.02, 0.02);
        //const x = i % 2 === 0 ? -0.01 : 0.01;
        bd.position.Set(xs[j] + x, 0.55 + 1.1 * i);
        const body = this.m_world.CreateBody(bd);

        this.m_bodies[n] = body;

        body.CreateFixture(fd);
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case ",":
        if (this.m_bullet) {
          this.m_world.DestroyBody(this.m_bullet);
          this.m_bullet = null;
        }

        {
          const shape = new b2.CircleShape();
          shape.m_radius = 0.25;

          const fd = new b2.FixtureDef();
          fd.shape = shape;
          fd.density = 20.0;
          fd.restitution = 0.05;

          const bd = new b2.BodyDef();
          bd.type = b2.BodyType.b2_dynamicBody;
          bd.bullet = true;
          bd.position.Set(-31.0, 5.0);

          this.m_bullet = this.m_world.CreateBody(bd);
          this.m_bullet.CreateFixture(fd);

          this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
        }
        break;
      case "b":
        b2.set_g_blockSolve(!b2.get_g_blockSolve());
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(b2.blockSolve) ? (1) : (0)}`);
    //if (this.m_stepCount === 300)
    //{
    //  if (this.m_bullet !== null)
    //  {
    //    this.m_world.DestroyBody(this.m_bullet);
    //    this.m_bullet = null;
    //  }

    //  {
    //    const shape = new b2.CircleShape();
    //    shape.m_radius = 0.25;

    //    const fd = new b2.FixtureDef();
    //    fd.shape = shape;
    //    fd.density = 20.0;
    //    fd.restitution = 0.05;

    //    const bd = new b2.BodyDef();
    //    bd.type = b2.BodyType.b2_dynamicBody;
    //    bd.bullet = true;
    //    bd.position.Set(-31.0, 5.0);

    //    this.m_bullet = this.m_world.CreateBody(bd);
    //    this.m_bullet.CreateFixture(fd);

    //    this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
    //  }
    //}
  }

  public static Create(): testbed.Test {
    return new BoxStack();
  }
}

export const testIndex: number = testbed.RegisterTest("Stacking", "Boxes", BoxStack.Create);
