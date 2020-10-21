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

// It is difficult to make a cantilever made of links completely rigid with weld joints.
// You will have to use a high number of iterations to make them stiff.
// So why not go ahead and use soft weld joints? They behave like a revolute
// joint with a rotational spring.
export class Cantilever extends testbed.Test {
  public static readonly e_count = 8;

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

      const jd = new b2.WeldJointDef();

      let prevBody = ground;
      for (let i = 0; i < Cantilever.e_count; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-14.5 + 1.0 * i, 5.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);

        const anchor = new b2.Vec2(-15.0 + 1.0 * i, 5.0);
        jd.Initialize(prevBody, body, anchor);
        this.m_world.CreateJoint(jd);

        prevBody = body;
      }
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(1.0, 0.125);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;

      const jd = new b2.WeldJointDef();
      const frequencyHz: number = 5.0;
      const dampingRatio: number = 0.7;

      let prevBody = ground;
      for (let i = 0; i < 3; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-14.0 + 2.0 * i, 15.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);

        const anchor = new b2.Vec2(-15.0 + 2.0 * i, 15.0);
        jd.Initialize(prevBody, body, anchor);
				b2.AngularStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
        this.m_world.CreateJoint(jd);

        prevBody = body;
      }
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.125);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;

      const jd = new b2.WeldJointDef();

      let prevBody = ground;
      for (let i = 0; i < Cantilever.e_count; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-4.5 + 1.0 * i, 15.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);

        if (i > 0) {
          const anchor = new b2.Vec2(-5.0 + 1.0 * i, 15.0);
          jd.Initialize(prevBody, body, anchor);
          this.m_world.CreateJoint(jd);
        }

        prevBody = body;
      }
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.125);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;

      const jd = new b2.WeldJointDef();
      const frequencyHz: number = 8.0;
      const dampingRatio: number = 0.7;

      let prevBody = ground;
      for (let i = 0; i < Cantilever.e_count; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(5.5 + 1.0 * i, 10.0);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);

        if (i > 0) {
          const anchor = new b2.Vec2(5.0 + 1.0 * i, 10.0);
          jd.Initialize(prevBody, body, anchor);
          b2.AngularStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
          this.m_world.CreateJoint(jd);
        }

        prevBody = body;
      }
    }

    for (let i = 0; i < 2; ++i) {
      const vertices = new Array();
      vertices[0] = new b2.Vec2(-0.5, 0.0);
      vertices[1] = new b2.Vec2(0.5, 0.0);
      vertices[2] = new b2.Vec2(0.0, 1.5);

      const shape = new b2.PolygonShape();
      shape.Set(vertices);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-8.0 + 8.0 * i, 12.0);
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(fd);
    }

    for (let i = 0; i < 2; ++i) {
      const shape = new b2.CircleShape();
      shape.m_radius = 0.5;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;

      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(-6.0 + 6.0 * i, 10.0);
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(fd);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Cantilever();
  }
}

export const testIndex: number = testbed.RegisterTest("Joints", "Cantilever", Cantilever.Create);
