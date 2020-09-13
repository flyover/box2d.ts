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
import * as testbed from "../testbed.js";

export class ContinuousTest extends testbed.Test {
  public m_body: b2.Body;
  public m_angularVelocity = 0.0;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      bd.position.Set(0.0, 0.0);
      const body = this.m_world.CreateBody(bd);

      const edge = new b2.EdgeShape();

      edge.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(10.0, 0.0));
      body.CreateFixture(edge, 0.0);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.2, 1.0, new b2.Vec2(0.5, 1.0), 0.0);
      body.CreateFixture(shape, 0.0);
    }

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 20.0);
      //bd.angle = 0.1;

      const shape = new b2.PolygonShape();
      shape.SetAsBox(2.0, 0.1);

      this.m_body = this.m_world.CreateBody(bd);
      this.m_body.CreateFixture(shape, 1.0);

      this.m_angularVelocity = b2.RandomRange(-50.0, 50.0);
      //this.m_angularVelocity = 46.661274;
      this.m_body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
      this.m_body.SetAngularVelocity(this.m_angularVelocity);
    }
    /*
    else
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 2.0);
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.CircleShape();
      shape.m_p.SetZero();
      shape.m_radius = 0.5;
      body.CreateFixture(shape, 1.0);
      bd.bullet = true;
      bd.position.Set(0.0, 10.0);
      body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 1.0);
      body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
    }
    */

    // b2.gjkCalls = 0;
    // b2.gjkIters = 0;
    // b2.gjkMaxIters = 0;
    b2.gjk_reset();
    // b2.toiCalls = 0;
    // b2.toiIters = 0;
    // b2.toiRootIters = 0;
    // b2.toiMaxRootIters = 0;
    // b2.toiTime = 0.0;
    // b2.toiMaxTime = 0.0;
    b2.toi_reset();
  }

  public Launch() {
    // b2.gjkCalls = 0;
    // b2.gjkIters = 0;
    // b2.gjkMaxIters = 0;
    b2.gjk_reset();
    // b2.toiCalls = 0;
    // b2.toiIters = 0;
    // b2.toiRootIters = 0;
    // b2.toiMaxRootIters = 0;
    // b2.toiTime = 0.0;
    // b2.toiMaxTime = 0.0;
    b2.toi_reset();

    this.m_body.SetTransformVec(new b2.Vec2(0.0, 20.0), 0.0);
    this.m_angularVelocity = b2.RandomRange(-50.0, 50.0);
    this.m_body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
    this.m_body.SetAngularVelocity(this.m_angularVelocity);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    if (b2.gjkCalls > 0) {
      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${b2.gjkCalls.toFixed(0)}, ave gjk iters = ${(b2.gjkIters / b2.gjkCalls).toFixed(1)}, max gjk iters = ${b2.gjkMaxIters.toFixed(0)}`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    }

    if (b2.toiCalls > 0) {
      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi [max] calls = %d, ave toi iters = %3.1f [%d]",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi [max] calls = ${b2.toiCalls}, ave toi iters = ${(b2.toiIters / b2.toiCalls).toFixed(1)} [${b2.toiMaxRootIters}]`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi root iters = %3.1f [%d]",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi root iters = ${(b2.toiRootIters / b2.toiCalls).toFixed(1)} [${b2.toiMaxRootIters.toFixed(0)}]`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi time = %.1f [%.1f] (microseconds)",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi time = ${(1000.0 * b2.toiTime / b2.toiCalls).toFixed(1)} [${(1000.0 * b2.toiMaxTime).toFixed(1)}] (microseconds)`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    }

    if (this.m_stepCount % 60 === 0) {
      this.Launch();
    }
  }

  public static Create(): testbed.Test {
    return new ContinuousTest();
  }
}
