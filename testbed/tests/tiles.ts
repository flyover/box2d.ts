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

/// This stress tests the dynamic tree broad-phase. This also shows that tile
/// based collision is _not_ smooth due to Box2D not knowing about adjacency.
export class Tiles extends testbed.Test {
  public static readonly e_count = 20;

  public m_fixtureCount = 0;
  public m_createTime = 0.0;

  constructor() {
    super();

    this.m_fixtureCount = 0;
    const timer = new b2.Timer();

    {
      const a = 0.5;
      const bd = new b2.BodyDef();
      bd.position.y = -a;
      const ground = this.m_world.CreateBody(bd);

      {
        const N = 200;
        const M = 10;
        const position = new b2.Vec2();
        position.y = 0.0;
        for (let j = 0; j < M; ++j) {
          position.x = -N * a;
          for (let i = 0; i < N; ++i) {
            const shape = new b2.PolygonShape();
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
      //     const N = 200;
      //     const M = 10;
      //      const position = new b2.Vec2();
      //      position.x = -N * a;
      //      for (let i = 0; i < N; ++i)
      //      {
      //        position.y = 0.0;
      //        for (let j = 0; j < M; ++j)
      //        {
      //          const shape = new b2.PolygonShape();
      //          shape.SetAsBox(a, a, position, 0.0);
      //          ground.CreateFixture(shape, 0.0);
      //          position.y -= 2.0 * a;
      //        }
      //        position.x += 2.0 * a;
      //      }
      //    }
    }

    {
      const a = 0.5;
      const shape = new b2.PolygonShape();
      shape.SetAsBox(a, a);

      const x = new b2.Vec2(-7.0, 0.75);
      const y = new b2.Vec2();
      const deltaX = new b2.Vec2(0.5625, 1.25);
      const deltaY = new b2.Vec2(1.125, 0.0);

      for (let i = 0; i < Tiles.e_count; ++i) {
        y.Copy(x);

        for (let j = i; j < Tiles.e_count; ++j) {
          const bd = new b2.BodyDef();
          bd.type = b2.BodyType.b2_dynamicBody;
          bd.position.Copy(y);

          //if (i === 0 && j === 0)
          //{
          //  bd.allowSleep = false;
          //}
          //else
          //{
          //  bd.allowSleep = true;
          //}

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
    const cm = this.m_world.GetContactManager();
    const height = cm.m_broadPhase.GetTreeHeight();
    const leafCount = cm.m_broadPhase.GetProxyCount();
    const minimumNodeCount = 2 * leafCount - 1;
    const minimumHeight = Math.ceil(Math.log(minimumNodeCount) / Math.log(2.0));
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}, min = ${minimumHeight}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    super.Step(settings);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, `create time = ${this.m_createTime.toFixed(2)} ms, fixture count = ${this.m_fixtureCount}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    //b2.DynamicTree* tree = this.m_world.this.m_contactManager.m_broadPhase.m_tree;

    //if (this.m_stepCount === 400)
    //{
    //  tree.RebuildBottomUp();
    //}
  }

  public static Create(): testbed.Test {
    return new Tiles();
  }
}

export const testIndex: number = testbed.RegisterTest("Benchmark", "Tiles", Tiles.Create);
