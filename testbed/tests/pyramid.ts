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

export class Pyramid extends testbed.Test {
  public static readonly e_count = 20;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const a = 0.5;
      const shape = new b2.PolygonShape();
      shape.SetAsBox(a, a);

      const x = new b2.Vec2(-7.0, 0.75);
      const y = new b2.Vec2(0.0, 0.0);
      const deltaX = new b2.Vec2(0.5625, 1.25);
      const deltaY = new b2.Vec2(1.125, 0.0);

      for (let i = 0; i < Pyramid.e_count; ++i) {
        y.Copy(x);

        for (let j = i; j < Pyramid.e_count; ++j) {
          const bd = new b2.BodyDef();
          bd.type = b2.BodyType.b2_dynamicBody;
          bd.position.Copy(y);
          const body = this.m_world.CreateBody(bd);
          body.CreateFixture(shape, 5.0);

          y.SelfAdd(deltaY);
        }

        x.SelfAdd(deltaX);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    // b2.DynamicTree* tree = &m_world.m_contactManager.m_broadPhase.m_tree;

    // if (m_stepCount === 400) {
    //   tree.RebuildBottomUp();
    // }
  }

  public static Create(): testbed.Test {
    return new Pyramid();
  }
}

export const testIndex: number = testbed.RegisterTest("Stacking", "Pyramid", Pyramid.Create);
