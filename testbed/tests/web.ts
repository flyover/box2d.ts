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

// Test distance joints, body destruction, and joint destruction.
export class Web extends testbed.Test {
  public m_bodies: Array<b2.Body | null>;
  public m_joints: Array<b2.Joint | null>;
  constructor() {
    super();

    this.m_bodies = new Array(4);
    this.m_joints = new Array(8);

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
      shape.SetAsBox(0.5, 0.5);

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;

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

      const jd = new b2.DistanceJointDef();
      let p1, p2, d;

      const frequencyHz: number = 2.0;
      const dampingRatio: number = 0.0;

      jd.bodyA = ground;
      jd.bodyB = body0;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(-10.0, 0.0);
      jd.localAnchorB.Set(-0.5, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[0] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body1;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(10.0, 0.0);
      jd.localAnchorB.Set(0.5, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[1] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body2;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(10.0, 20.0);
      jd.localAnchorB.Set(0.5, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[2] = this.m_world.CreateJoint(jd);

      jd.bodyA = ground;
      jd.bodyB = body3;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(-10.0, 20.0);
      jd.localAnchorB.Set(-0.5, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[3] = this.m_world.CreateJoint(jd);

      jd.bodyA = body0;
      jd.bodyB = body1;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(0.5, 0.0);
      jd.localAnchorB.Set(-0.5, 0.0);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[4] = this.m_world.CreateJoint(jd);

      jd.bodyA = body1;
      jd.bodyB = body2;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(0.0, 0.5);
      jd.localAnchorB.Set(0.0, -0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[5] = this.m_world.CreateJoint(jd);

      jd.bodyA = body2;
      jd.bodyB = body3;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(-0.5, 0.0);
      jd.localAnchorB.Set(0.5, 0.0);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[6] = this.m_world.CreateJoint(jd);

      jd.bodyA = body3;
      jd.bodyB = body0;
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
      jd.localAnchorA.Set(0.0, -0.5);
      jd.localAnchorB.Set(0.0, 0.5);
      p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2.Vec2());
      p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2.Vec2());
      d = b2.Vec2.SubVV(p2, p1, new b2.Vec2());
      jd.length = d.Length();
      this.m_joints[7] = this.m_world.CreateJoint(jd);
    }
  }

  public JointDestroyed(joint: b2.Joint) {
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
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (b) to delete a body, (j) to delete a joint");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Web();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Web", Web.Create);
