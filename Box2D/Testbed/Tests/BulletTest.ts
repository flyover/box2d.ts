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

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class BulletTest extends testbed.Test {
  public m_body: box2d.b2Body;
  public m_bullet: box2d.b2Body;
  public m_x: number = 0;

  constructor() {
    super();

    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.position.Set(0.0, 0.0);
      /*box2d.b2Body*/
      const body = this.m_world.CreateBody(bd);

      /*box2d.b2EdgeShape*/
      const edge = new box2d.b2EdgeShape();

      edge.Set(new box2d.b2Vec2(-10.0, 0.0), new box2d.b2Vec2(10.0, 0.0));
      body.CreateFixture(edge, 0.0);

      /*box2d.b2PolygonShape*/
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.2, 1.0, new box2d.b2Vec2(0.5, 1.0), 0.0);
      body.CreateFixture(shape, 0.0);
    }

    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 4.0);

      /*box2d.b2PolygonShape*/
      const box = new box2d.b2PolygonShape();
      box.SetAsBox(2.0, 0.1);

      this.m_body = this.m_world.CreateBody(bd);
      this.m_body.CreateFixture(box, 1.0);

      box.SetAsBox(0.25, 0.25);

      //this.m_x = box2d.b2RandomRange(-1.0, 1.0);
      this.m_x = 0.20352793;
      bd.position.Set(this.m_x, 10.0);
      bd.bullet = true;

      this.m_bullet = this.m_world.CreateBody(bd);
      this.m_bullet.CreateFixture(box, 100.0);

      this.m_bullet.SetLinearVelocity(new box2d.b2Vec2(0.0, -50.0));
    }
  }

  public Launch() {
    this.m_body.SetTransformVec(new box2d.b2Vec2(0.0, 4.0), 0.0);
    this.m_body.SetLinearVelocity(box2d.b2Vec2_zero);
    this.m_body.SetAngularVelocity(0.0);

    this.m_x = box2d.b2RandomRange(-1.0, 1.0);
    this.m_bullet.SetTransformVec(new box2d.b2Vec2(this.m_x, 10.0), 0.0);
    this.m_bullet.SetLinearVelocity(new box2d.b2Vec2(0.0, -50.0));
    this.m_bullet.SetAngularVelocity(0.0);

    //  extern int32 box2d.b2_gjkCalls, box2d.b2_gjkIters, box2d.b2_gjkMaxIters;
    //  extern int32 box2d.b2_toiCalls, box2d.b2_toiIters, box2d.b2_toiMaxIters;
    //  extern int32 box2d.b2_toiRootIters, box2d.b2_toiMaxRootIters;

    // box2d.b2_gjkCalls = 0;
    // box2d.b2_gjkIters = 0;
    // box2d.b2_gjkMaxIters = 0;
    box2d.b2_gjk_reset();

    // box2d.b2_toiCalls = 0;
    // box2d.b2_toiIters = 0;
    // box2d.b2_toiMaxIters = 0;
    // box2d.b2_toiRootIters = 0;
    // box2d.b2_toiMaxRootIters = 0;
    box2d.b2_toi_reset();
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    if (box2d.b2_gjkCalls > 0) {
      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${box2d.b2_gjkCalls.toFixed(0)}, ave gjk iters = ${(box2d.b2_gjkIters / box2d.b2_gjkCalls).toFixed(1)}, max gjk iters = ${box2d.b2_gjkMaxIters.toFixed(0)}`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    }

    if (box2d.b2_toiCalls > 0) {
      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi calls = %d, ave toi iters = %3.1f, max toi iters = %d",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi calls = ${box2d.b2_toiCalls}, ave toi iters = ${(box2d.b2_toiIters / box2d.b2_toiCalls).toFixed(1)}, max toi iters = ${box2d.b2_toiMaxRootIters}`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

      // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave toi root iters = %3.1f, max toi root iters = %d",
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave toi root iters = ${(box2d.b2_toiRootIters / box2d.b2_toiCalls).toFixed(1)}, max toi root iters = ${box2d.b2_toiMaxRootIters}`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    }

    if (this.m_stepCount % 60 === 0) {
      this.Launch();
    }
  }

  public static Create(): testbed.Test {
    return new BulletTest();
  }
}
