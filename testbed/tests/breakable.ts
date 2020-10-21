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

// This is used to test sensor shapes.
export class Breakable extends testbed.Test {
  public static readonly e_count = 7;

  public readonly m_body1: b2.Body;
  public readonly m_velocity = new b2.Vec2();
  public m_angularVelocity = 0;
  public readonly m_shape1 = new b2.PolygonShape();
  public readonly m_shape2 = new b2.PolygonShape();
  public m_piece1: b2.Fixture | null = null;
  public m_piece2: b2.Fixture | null = null;
  public m_broke = false;
  public m_break = false;

  constructor() {
    super();

    // Ground body
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Breakable dynamic body
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 40.0);
      bd.angle = 0.25 * b2.pi;
      this.m_body1 = this.m_world.CreateBody(bd);

      this.m_shape1 = new b2.PolygonShape();
      this.m_shape1.SetAsBox(0.5, 0.5, new b2.Vec2(-0.5, 0.0), 0.0);
      this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);

      this.m_shape2 = new b2.PolygonShape();
      this.m_shape2.SetAsBox(0.5, 0.5, new b2.Vec2(0.5, 0.0), 0.0);
      this.m_piece2 = this.m_body1.CreateFixture(this.m_shape2, 1.0);
    }
  }

  public PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse) {
    if (this.m_broke) {
      // The body already broke.
      return;
    }

    // Should the body break?
    const count = contact.GetManifold().pointCount;

    let maxImpulse = 0.0;
    for (let i = 0; i < count; ++i) {
      maxImpulse = b2.Max(maxImpulse, impulse.normalImpulses[i]);
    }

    if (maxImpulse > 40.0) {
      // Flag the body for breaking.
      this.m_break = true;
    }
  }

  public Break() {
    if (this.m_piece1 === null) { return; }
    if (this.m_piece2 === null) { return; }
    // Create two bodies from one.
    const body1 = this.m_piece1.GetBody();
    const center = body1.GetWorldCenter();

    body1.DestroyFixture(this.m_piece2);
    this.m_piece2 = null;

    const bd = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;
    bd.position.Copy(body1.GetPosition());
    bd.angle = body1.GetAngle();

    const body2 = this.m_world.CreateBody(bd);
    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);

    // Compute consistent velocities for new bodies based on
    // cached velocity.
    const center1 = body1.GetWorldCenter();
    const center2 = body2.GetWorldCenter();

    const velocity1 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center1, center, b2.Vec2.s_t0), new b2.Vec2());
    const velocity2 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center2, center, b2.Vec2.s_t0), new b2.Vec2());

    body1.SetAngularVelocity(this.m_angularVelocity);
    body1.SetLinearVelocity(velocity1);

    body2.SetAngularVelocity(this.m_angularVelocity);
    body2.SetLinearVelocity(velocity2);
  }

  public Step(settings: testbed.Settings): void {
    if (this.m_break) {
      this.Break();
      this.m_broke = true;
      this.m_break = false;
    }

    // Cache velocities to improve movement on breakage.
    if (!this.m_broke) {
      this.m_velocity.Copy(this.m_body1.GetLinearVelocity());
      this.m_angularVelocity = this.m_body1.GetAngularVelocity();
    }

    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Breakable();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Breakable", Breakable.Create);
