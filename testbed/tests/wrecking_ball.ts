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

/// This test shows how a distance joint can be used to stabilize a chain of
/// bodies with a heavy payload. Notice that the distance joint just prevents
/// excessive stretching and has no other effect.
/// By disabling the distance joint you can see that the Box2D solver has trouble
/// supporting heavy bodies with light bodies. Try playing around with the
/// densities, time step, and iterations to see how they affect stability.
/// This test also shows how to use contact filtering. Filtering is configured
/// so that the payload does not collide with the chain.
export class WreckingBall extends testbed.Test {
  public m_distanceJointDef = new b2.DistanceJointDef();
  public m_distanceJoint: b2.DistanceJoint | null = null;

  constructor() {
    super();

    let ground = null;
    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.125);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      fd.friction = 0.2;
      fd.filter.categoryBits = 0x0001;
      fd.filter.maskBits = 0xFFFF & ~0x0002;

      const jd = new b2.RevoluteJointDef();
      jd.collideConnected = false;

      const N = 10;
      const y = 15.0;
      this.m_distanceJointDef.localAnchorA.Set(0.0, y);

      let prevBody = ground;
      for (let i = 0; i < N; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(0.5 + 1.0 * i, y);
        if (i === N - 1) {
          bd.position.Set(1.0 * i, y);
          bd.angularDamping = 0.4;
        }

        const body = this.m_world.CreateBody(bd);

        if (i === N - 1) {
          const circleShape: b2.CircleShape = new b2.CircleShape();
          circleShape.m_radius = 1.5;
          const sfd: b2.FixtureDef = new b2.FixtureDef();
          sfd.shape = circleShape;
          sfd.density = 100.0;
          sfd.filter.categoryBits = 0x0002;
          body.CreateFixture(sfd);
        }
        else {
          body.CreateFixture(fd);
        }

        const anchor = new b2.Vec2(i, y);
        jd.Initialize(prevBody, body, anchor);
        this.m_world.CreateJoint(jd);

        prevBody = body;
      }

      this.m_distanceJointDef.localAnchorB.SetZero();

      const extraLength = 0.01;
      this.m_distanceJointDef.minLength = 0.0;
      this.m_distanceJointDef.maxLength = N - 1.0 + extraLength;
      this.m_distanceJointDef.bodyB = prevBody;
    }

    {
      this.m_distanceJointDef.bodyA = ground;
      this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "j":
        if (this.m_distanceJoint) {
          this.m_world.DestroyJoint(this.m_distanceJoint);
          this.m_distanceJoint = null;
        } else {
          this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
        }
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (j) to toggle the distance joint.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    if (this.m_distanceJoint) {
      testbed.g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint ON");
    } else {
      testbed.g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint OFF");
    }
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new WreckingBall();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Wrecking Ball", WreckingBall.Create);
