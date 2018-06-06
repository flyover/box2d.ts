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

export class Web extends testbed.Test {
  public m_bodies: Array<box2d.b2Body | null>;
  public m_joints: Array<box2d.b2Joint | null>;
  constructor() {
    super();

    this.m_bodies = new Array(4);
    this.m_joints = new Array(8);

    let ground = null;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;

      bd.position.Set(-5.0, 5.0);
      const body0 = this.m_bodies[0] = this.m_world.CreateBody(bd);
      body0.CreateFixture(shape, 5.0);

      bd.position.Set(5.0, 5.0);
      const body1 = this.m_bodies[1] = this.m_world.CreateBody(bd);
      body1.CreateFixture(shape, 5.0);

      bd.position.Set(5.0, 15.0);
      const body2 = this.m_bodies[2] = this.m_world.CreateBody(bd);
      body2.CreateFixture(shape, 5.0);

      bd.position.Set(-5.0, 15.0);
      const body3 = this.m_bodies[3] = this.m_world.CreateBody(bd);
      body3.CreateFixture(shape, 5.0);

      const jd = new box2d.b2DistanceJointDef();
      let p1, p2, d;

      jd.frequencyHz = 2.0;
      jd.dampingRatio = 0.0;

      jd.bodyA = ground;
      jd.bodyB = body0;
      jd.localAnchorA.Set(-10.0, 0.0);
      jd.localAnchorB.Set(-0.5, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[0] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body1;
      jd.localAnchorA.Set(10.0, 0.0);
      jd.localAnchorB.Set(0.5, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[1] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body2;
      jd.localAnchorA.Set(10.0, 20.0);
      jd.localAnchorB.Set(0.5, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[2] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body3;
      jd.localAnchorA.Set(-10.0, 20.0);
      jd.localAnchorB.Set(-0.5, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[3] = this.m_world.CreateJoint(jd);

      jd.bodyA = body0;
      jd.bodyB = body1;
      jd.localAnchorA.Set(0.5, 0.0);
      jd.localAnchorB.Set(-0.5, 0.0);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[4] = this.m_world.CreateJoint(jd);

      jd.bodyA = body1;
      jd.bodyB = body2;
      jd.localAnchorA.Set(0.0, 0.5);
      jd.localAnchorB.Set(0.0, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[5] = this.m_world.CreateJoint(jd);

      jd.bodyA = body2;
      jd.bodyB = body3;
      jd.localAnchorA.Set(-0.5, 0.0);
      jd.localAnchorB.Set(0.5, 0.0);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[6] = this.m_world.CreateJoint(jd);

      jd.bodyA = body3;
      jd.bodyB = body0;
      jd.localAnchorA.Set(0.0, -0.5);
      jd.localAnchorB.Set(0.0, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new box2d.b2Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new box2d.b2Vec2());
      d = box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2());
      jd.length = d.Length();
      this.m_joints[7] = this.m_world.CreateJoint(jd);
    }
  }

  public JointDestroyed(joint: box2d.b2Joint) {
    for (let i = 0; i < 8; ++i) {
      if (this.m_joints[i] === joint) {
        this.m_joints[i] = null;
        break;
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "b":
        for (let i = 0; i < 4; ++i) {
          const body = this.m_bodies[i];
          if (body) {
            this.m_world.DestroyBody(body);
            this.m_bodies[i] = null;
            break;
          }
        }
        break;

      case "j":
        for (let i = 0; i < 8; ++i) {
          const joint = this.m_joints[i];
          if (joint) {
            this.m_world.DestroyJoint(joint);
            this.m_joints[i] = null;
            break;
          }
        }
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "This demonstrates a soft distance joint.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (b) to delete a body, (j) to delete a joint");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Web();
  }
}
