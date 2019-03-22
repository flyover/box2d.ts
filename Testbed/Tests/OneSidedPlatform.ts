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

export class OneSidedPlatform extends testbed.Test {
  public m_radius = 0.0;
  public m_top = 0.0;
  public m_bottom = 0.0;
  public m_state = OneSidedPlatform_State.e_unknown;
  public m_platform: box2d.b2Fixture;
  public m_character: box2d.b2Fixture;

  constructor() {
    super();

    // Ground
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Platform
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(3.0, 0.5);
      this.m_platform = body.CreateFixture(shape, 0.0);

      this.m_bottom = 10.0 - 0.5;
      this.m_top = 10.0 + 0.5;
    }

    // Actor
    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 12.0);
      const body = this.m_world.CreateBody(bd);

      this.m_radius = 0.5;
      const shape = new box2d.b2CircleShape();
      shape.m_radius = this.m_radius;
      this.m_character = body.CreateFixture(shape, 20.0);

      body.SetLinearVelocity(new box2d.b2Vec2(0.0, -50.0));

      this.m_state = OneSidedPlatform_State.e_unknown;
    }
  }

  public PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold) {
    super.PreSolve(contact, oldManifold);

    const fixtureA = contact.GetFixtureA();
    const fixtureB = contact.GetFixtureB();

    if (fixtureA !== this.m_platform && fixtureA !== this.m_character) {
      return;
    }

    if (fixtureB !== this.m_platform && fixtureB !== this.m_character) {
      return;
    }

    const position = this.m_character.GetBody().GetPosition();

    if (position.y < this.m_top + this.m_radius - 3.0 * box2d.b2_linearSlop) {
      contact.SetEnabled(false);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new OneSidedPlatform();
  }
}

export enum OneSidedPlatform_State {
  e_unknown = 0,
  e_above = 1,
  e_below = 2,
}
