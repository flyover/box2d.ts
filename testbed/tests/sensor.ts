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

// This shows how to use sensor shapes. Sensors don't have collision, but report overlap events.
export class Sensors extends testbed.Test {
  public static readonly e_count = 7;

  public m_sensor: b2.Fixture;
  public m_bodies: b2.Body[];
  public m_touching: boolean[][];

  constructor() {
    super();

    this.m_bodies = new Array(Sensors.e_count);
    this.m_touching = new Array(Sensors.e_count);
    for (let i = 0; i < Sensors.e_count; ++i) {
      this.m_touching[i] = new Array(1);
    }

    const bd = new b2.BodyDef();
    const ground = this.m_world.CreateBody(bd);

    {
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    /*
    {
      const sd = new b2.FixtureDef();
      sd.SetAsBox(10.0, 2.0, new b2.Vec2(0.0, 20.0), 0.0);
      sd.isSensor = true;
      this.m_sensor = ground.CreateFixture(sd);
    }
    */
    {
      const shape = new b2.CircleShape();
      shape.m_radius = 5.0;
      shape.m_p.Set(0.0, 10.0);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.isSensor = true;
      this.m_sensor = ground.CreateFixture(fd);
    }

    {
      const shape = new b2.CircleShape();
      shape.m_radius = 1.0;

      for (let i = 0; i < Sensors.e_count; ++i) {
        //const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-10.0 + 3.0 * i, 20.0);
        bd.userData = this.m_touching[i];

        this.m_touching[i][0] = false;
        this.m_bodies[i] = this.m_world.CreateBody(bd);

        this.m_bodies[i].CreateFixture(shape, 1.0);
      }
    }
  }

  public BeginContact(contact: b2.Contact) {
    const fixtureA = contact.GetFixtureA();
    const fixtureB = contact.GetFixtureB();

    if (fixtureA === this.m_sensor) {
      const userData = fixtureB.GetBody().GetUserData();
      if (userData) {
        const touching = userData;
        touching[0] = true;
      }
    }

    if (fixtureB === this.m_sensor) {
      const userData = fixtureA.GetBody().GetUserData();
      if (userData) {
        const touching = userData;
        touching[0] = true;
      }
    }
  }

  public EndContact(contact: b2.Contact) {
    const fixtureA = contact.GetFixtureA();
    const fixtureB = contact.GetFixtureB();

    if (fixtureA === this.m_sensor) {
      const userData = fixtureB.GetBody().GetUserData();
      if (userData) {
        const touching = userData;
        touching[0] = false;
      }
    }

    if (fixtureB === this.m_sensor) {
      const userData = fixtureA.GetBody().GetUserData();
      if (userData) {
        const touching = userData;
        touching[0] = false;
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    // Traverse the contact results. Apply a force on shapes
    // that overlap the sensor.
    for (let i = 0; i < Sensors.e_count; ++i) {
      if (!this.m_touching[i][0]) {
        continue;
      }

      const body = this.m_bodies[i];
      const ground = this.m_sensor.GetBody();

      const circle = this.m_sensor.GetShape() as b2.CircleShape;
      const center = ground.GetWorldPoint(circle.m_p, new b2.Vec2());

      const position = body.GetPosition();

      const d = b2.Vec2.SubVV(center, position, new b2.Vec2());
      if (d.LengthSquared() < b2.epsilon_sq) {
        continue;
      }

      d.Normalize();
      const F = b2.Vec2.MulSV(100.0, d, new b2.Vec2());
      body.ApplyForce(F, position);
    }
  }

  public static Create(): testbed.Test {
    return new Sensors();
  }
}

export const testIndex: number = testbed.RegisterTest("Collision", "Sensors", Sensors.Create);
