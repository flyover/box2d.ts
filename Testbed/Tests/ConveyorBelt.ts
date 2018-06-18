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

export class ConveyorBelt extends testbed.Test {
  public m_platform: box2d.b2Fixture;

  constructor() {
    super();

    // Ground
    {
      const bd = new box2d.b2BodyDef();
      /*b2Body*/
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Platform
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-5.0, 5.0);
      /*b2Body*/
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(10.0, 0.5);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.friction = 0.8;
      this.m_platform = body.CreateFixture(fd);
    }

    // Boxes
    for ( /*int*/ let i = 0; i < 5; ++i) {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(-10.0 + 2.0 * i, 7.0);
      /*b2Body*/
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 0.5);
      body.CreateFixture(shape, 20.0);
    }
  }

  public PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold) {
    super.PreSolve(contact, oldManifold);

    /*b2Fixture*/
    const fixtureA = contact.GetFixtureA();
    /*b2Fixture*/
    const fixtureB = contact.GetFixtureB();

    if (fixtureA === this.m_platform) {
      contact.SetTangentSpeed(5.0);
    }

    if (fixtureB === this.m_platform) {
      contact.SetTangentSpeed(-5.0);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new ConveyorBelt();
  }
}
