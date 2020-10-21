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

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class WreckingBall extends testbed.Test {
  public m_distanceJointDef = new b2.DistanceJointDef();
  public m_distanceJoint: b2.DistanceJoint | null = null;

  constructor() {
    super();

    /*b2.Body*/
    let ground = null;
    {
      /*b2.BodyDef*/
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      /*b2.EdgeShape*/
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      /*b2.PolygonShape*/
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.125);

      /*b2.FixtureDef*/
      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      fd.friction = 0.2;
      fd.filter.categoryBits = 0x0001;
      fd.filter.maskBits = 0xFFFF & ~0x0002;

      /*b2.RevoluteJointDef*/
      const jd = new b2.RevoluteJointDef();
      jd.collideConnected = false;

      /*const int32*/
      const N = 10;
      /*const float32*/
      const y = 15.0;
      this.m_distanceJointDef.localAnchorA.Set(0.0, y);

      /*b2.Body*/
      let prevBody = ground;
      for ( /*int32*/ let i = 0; i < N; ++i) {
        /*b2.BodyDef*/
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(0.5 + 1.0 * i, y);
        if (i === N - 1) {
          bd.position.Set(1.0 * i, y);
          bd.angularDamping = 0.4;
        }

        /*b2.Body*/
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

        /*b2.Vec2*/
        const anchor = new b2.Vec2(i, y);
        jd.Initialize(prevBody, body, anchor);
        this.m_world.CreateJoint(jd);

        prevBody = body;
      }

      this.m_distanceJointDef.localAnchorB.SetZero();

      /*float32*/
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
