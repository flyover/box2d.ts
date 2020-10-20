/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class VerticalStack extends testbed.Test {
  public static readonly e_columnCount = 1;
  public static readonly e_rowCount = 15;

  public m_bullet: b2.Body | null = null;
  public m_bodies: b2.Body[];
  public m_indices: number[];

  constructor() {
    super();

    this.m_bodies = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);
    this.m_indices = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);

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

    for (let j = 0; j < VerticalStack.e_columnCount; ++j) {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for (let i = 0; i < VerticalStack.e_rowCount; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;

        const n = j * VerticalStack.e_rowCount + i;
        // DEBUG: b2.Assert(n < VerticalStack.e_rowCount * VerticalStack.e_columnCount);
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
        // b2.blockSolve = !b2.blockSolve;
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
    return new VerticalStack();
  }
}

export const testIndex: number = testbed.RegisterTest("Stacking", "Boxes", VerticalStack.Create);
