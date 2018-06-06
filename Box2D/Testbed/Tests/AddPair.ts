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

export class AddPair extends testbed.Test {
  constructor() {
    super();

    this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));
    {
      // const a = 0.1;

      const shape = new box2d.b2CircleShape();
      shape.m_p.SetZero();
      shape.m_radius = 0.1;

      const minX = -6.0;
      const maxX = 0.0;
      const minY = 4.0;
      const maxY = 6.0;

      for (let i = 0; i < 400; ++i) {
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(box2d.b2RandomRange(minX, maxX), box2d.b2RandomRange(minY, maxY));
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 0.01);
      }
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(1.5, 1.5);
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(-40.0, 5.0);
      bd.bullet = true;
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 1.0);
      body.SetLinearVelocity(new box2d.b2Vec2(150.0, 0.0));
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new AddPair();
  }
}
