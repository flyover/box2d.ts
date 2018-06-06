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

export class TestStack extends testbed.Test {
  constructor() {
    super();

    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const vertices = [];
      vertices[0] = new box2d.b2Vec2(-30.0, 0.0);
      vertices[1] = new box2d.b2Vec2(30.0, 0.0);
      vertices[2] = new box2d.b2Vec2(30.0, 40.0);
      vertices[3] = new box2d.b2Vec2(-30.0, 40.0);
      const shape = new box2d.b2ChainShape();
      shape.CreateLoop(vertices);
      ground.CreateFixture(shape, 0.0);
    }

    // Add bodies
    const bd = new box2d.b2BodyDef();
    const fd = new box2d.b2FixtureDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    //bd.isBullet = true;
    const polygon = new box2d.b2PolygonShape();
    fd.shape = polygon;
    fd.density = 1.0;
    fd.friction = 0.5;
    fd.restitution = 0.1;
    polygon.SetAsBox(1.0, 1.0);
    // Create 3 stacks
    for (let i = 0; i < 10; ++i) {
      bd.position.Set((0.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
      this.m_world.CreateBody(bd).CreateFixture(fd);
    }
    for (let i = 0; i < 10; ++i) {
      bd.position.Set((10.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
      this.m_world.CreateBody(bd).CreateFixture(fd);
    }
    for (let i = 0; i < 10; ++i) {
      bd.position.Set((20.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
      this.m_world.CreateBody(bd).CreateFixture(fd);
    }
    // Create ramp
    bd.type = box2d.b2BodyType.b2_staticBody;
    bd.position.Set(0.0, 0.0);
    const vxs = [
      new box2d.b2Vec2(-30.0, 0.0),
      new box2d.b2Vec2(-10.0, 0.0),
      new box2d.b2Vec2(-30.0, 10.0),
    ];
    polygon.Set(vxs, vxs.length);
    fd.density = 0;
    this.m_world.CreateBody(bd).CreateFixture(fd);

    // Create ball
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.Set(-25.0, 20.0);
    fd.shape = new box2d.b2CircleShape(4.0);
    fd.density = 2;
    fd.restitution = 0.2;
    fd.friction = 0.5;
    this.m_world.CreateBody(bd).CreateFixture(fd);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new TestStack();
  }
}
