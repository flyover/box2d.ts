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

export class ConveyorBelt extends testbed.Test {
  public m_platform: b2.Fixture;

  constructor() {
    super();

    // Ground
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Platform
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-5.0, 5.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(10.0, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.8;
      this.m_platform = body.CreateFixture(fd);
    }

    // Boxes
    for (let i = 0; i < 5; ++i) {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-10.0 + 2.0 * i, 7.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);
      body.CreateFixture(shape, 20.0);
    }
  }

  public PreSolve(contact: b2.Contact, oldManifold: b2.Manifold) {
    super.PreSolve(contact, oldManifold);

    const fixtureA = contact.GetFixtureA();
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

export const testIndex: number = testbed.RegisterTest("Examples", "Conveyor Belt", ConveyorBelt.Create);
