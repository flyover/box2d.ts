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

/**
 * This stress tests the dynamic tree broad-phase. This also
 * shows that tile based collision is _not_ smooth due to Box2D
 * not knowing about adjacency.
 */

export class Tiles extends testbed.Test {
  public static readonly e_count = 20;

  public m_fixtureCount = 0;
  public m_createTime = 0.0;

  constructor() {
    super();

    this.m_fixtureCount = 0;
    /*box2d.b2Timer*/
    const timer = new box2d.b2Timer();

    {
      /*float32*/
      const a = 0.5;
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.position.y = -a;
      /*box2d.b2Body*/
      const ground = this.m_world.CreateBody(bd);

      {
        /*int32*/
        const N = 200;
        /*int32*/
        const M = 10;
        /*box2d.b2Vec2*/
        const position = new box2d.b2Vec2();
        position.y = 0.0;
        for ( /*int32*/ let j = 0; j < M; ++j) {
          position.x = -N * a;
          for ( /*int32*/ let i = 0; i < N; ++i) {
            /*box2d.b2PolygonShape*/
            const shape = new box2d.b2PolygonShape();
            shape.SetAsBox(a, a, position, 0.0);
            ground.CreateFixture(shape, 0.0);
            ++this.m_fixtureCount;
            position.x += 2.0 * a;
          }
          position.y -= 2.0 * a;
        }
      }
      //    else
      //    {
      //      /*int32*/ const N = 200;
      //      /*int32*/ const M = 10;
      //      /*box2d.b2Vec2*/ const position = new box2d.b2Vec2();
      //      position.x = -N * a;
      //      for (/*int32*/ let i = 0; i < N; ++i)
      //      {
      //        position.y = 0.0;
      //        for (/*int32*/ let j = 0; j < M; ++j)
      //        {
      //          /*box2d.b2PolygonShape*/ const shape = new box2d.b2PolygonShape();
      //          shape.SetAsBox(a, a, position, 0.0);
      //          ground.CreateFixture(shape, 0.0);
      //          position.y -= 2.0 * a;
      //        }
      //        position.x += 2.0 * a;
      //      }
      //    }
    }

    {
      /*float32*/
      const a = 0.5;
      /*box2d.b2PolygonShape*/
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(a, a);

      /*box2d.b2Vec2*/
      const x = new box2d.b2Vec2(-7.0, 0.75);
      /*box2d.b2Vec2*/
      const y = new box2d.b2Vec2();
      /*box2d.b2Vec2*/
      const deltaX = new box2d.b2Vec2(0.5625, 1.25);
      /*box2d.b2Vec2*/
      const deltaY = new box2d.b2Vec2(1.125, 0.0);

      for ( /*int32*/ let i = 0; i < Tiles.e_count; ++i) {
        y.Copy(x);

        for ( /*int32*/ let j = i; j < Tiles.e_count; ++j) {
          /*box2d.b2BodyDef*/
          const bd = new box2d.b2BodyDef();
          bd.type = box2d.b2BodyType.b2_dynamicBody;
          bd.position.Copy(y);

          //if (i === 0 && j === 0)
          //{
          //  bd.allowSleep = false;
          //}
          //else
          //{
          //  bd.allowSleep = true;
          //}

          /*box2d.b2Body*/
          const body = this.m_world.CreateBody(bd);
          body.CreateFixture(shape, 5.0);
          ++this.m_fixtureCount;
          y.SelfAdd(deltaY);
        }

        x.SelfAdd(deltaX);
      }
    }

    this.m_createTime = timer.GetMilliseconds();
  }

  public Step(settings: testbed.Settings): void {
    /*const box2d.b2ContactManager*/
    const cm = this.m_world.GetContactManager();
    /*int32*/
    const height = cm.m_broadPhase.GetTreeHeight();
    /*int32*/
    const leafCount = cm.m_broadPhase.GetProxyCount();
    /*int32*/
    const minimumNodeCount = 2 * leafCount - 1;
    /*float32*/
    const minimumHeight = Math.ceil(Math.log(minimumNodeCount) / Math.log(2.0));
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}, min = ${minimumHeight}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    super.Step(settings);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `create time = ${this.m_createTime.toFixed(2)} ms, fixture count = ${this.m_fixtureCount}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    //box2d.b2DynamicTree* tree = this.m_world.this.m_contactManager.m_broadPhase.m_tree;

    //if (this.m_stepCount === 400)
    //{
    //  tree.RebuildBottomUp();
    //}
  }

  public static Create(): testbed.Test {
    return new Tiles();
  }
}
