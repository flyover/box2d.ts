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

export class Platformer extends testbed.Test {
  public m_radius = 0.0;
  public m_top = 0.0;
  public m_bottom = 0.0;
  public m_state = Platformer_State.e_unknown;
  public m_platform: b2.Fixture;
  public m_character: b2.Fixture;

  constructor() {
    super();

    // Ground
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Platform
    {
      const bd = new b2.BodyDef();
      bd.position.Set(0.0, 10.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(3.0, 0.5);
      this.m_platform = body.CreateFixture(shape, 0.0);

      this.m_bottom = 10.0 - 0.5;
      this.m_top = 10.0 + 0.5;
    }

    // Actor
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 12.0);
      const body = this.m_world.CreateBody(bd);

      this.m_radius = 0.5;
      const shape = new b2.CircleShape();
      shape.m_radius = this.m_radius;
      this.m_character = body.CreateFixture(shape, 20.0);

      body.SetLinearVelocity(new b2.Vec2(0.0, -50.0));

      this.m_state = Platformer_State.e_unknown;
    }
  }

  public PreSolve(contact: b2.Contact, oldManifold: b2.Manifold) {
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

    if (position.y < this.m_top + this.m_radius - 3.0 * b2.linearSlop) {
      contact.SetEnabled(false);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const v = this.m_character.GetBody().GetLinearVelocity();
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Character Linear Velocity: ${v.y}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Platformer();
  }
}

export enum Platformer_State {
  e_unknown = 0,
  e_above = 1,
  e_below = 2,
}

export const testIndex: number = testbed.RegisterTest("Examples", "Platformer", Platformer.Create);
