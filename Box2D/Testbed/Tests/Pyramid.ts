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

export class Pyramid extends testbed.Test {
  public static readonly e_count = 20;

  constructor() {
    super();

    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const a = 0.5;
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(a, a);

      const x = new box2d.b2Vec2(-7.0, 0.75);
      const y = new box2d.b2Vec2(0.0, 0.0);
      const deltaX = new box2d.b2Vec2(0.5625, 1.25);
      const deltaY = new box2d.b2Vec2(1.125, 0.0);

      for (let i = 0; i < Pyramid.e_count; ++i) {
        y.Copy(x);

        for (let j = i; j < Pyramid.e_count; ++j) {
          const bd = new box2d.b2BodyDef();
          bd.type = box2d.b2BodyType.b2_dynamicBody;
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

    // box2d.b2DynamicTree* tree = &m_world.m_contactManager.m_broadPhase.m_tree;

    // if (m_stepCount === 400) {
    //   tree.RebuildBottomUp();
    // }
  }

  public static Create(): testbed.Test {
    return new Pyramid();
  }
}
