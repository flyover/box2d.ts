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

export class Chain extends testbed.Test {
  public static readonly e_count = 30;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.6, 0.125);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      fd.friction = 0.2;

      const jd = new box2d.b2RevoluteJointDef();
      jd.collideConnected = false;

      const y = 25.0;
      let prevBody = ground;
      for (let i = 0; i < Chain.e_count; ++i) {
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(0.5 + i, y);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);

        const anchor = new box2d.b2Vec2(i, y);
        jd.Initialize(prevBody, body, anchor);
        this.m_world.CreateJoint(jd);

        prevBody = body;
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Chain();
  }
}
