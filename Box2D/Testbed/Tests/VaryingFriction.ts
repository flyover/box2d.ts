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

export class VaryingFriction extends testbed.Test {
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
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(-4.0, 22.0);
      bd.angle = -0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.25, 1.0);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(10.5, 19.0);

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(4.0, 14.0);
      bd.angle = 0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.25, 1.0);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(-10.5, 11.0);

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(-4.0, 6.0);
      bd.angle = -0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 25.0;

      const friction = [0.75, 0.5, 0.35, 0.1, 0.0];

      for (let i = 0; i < 5; ++i) {
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(-15.0 + 4.0 * i, 28.0);
        const body = this.m_world.CreateBody(bd);

        fd.friction = friction[i];
        body.CreateFixture(fd);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new VaryingFriction();
  }
}
