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

export class Friction extends testbed.Test {
  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new b2.BodyDef();
      bd.position.Set(-4.0, 22.0);
      bd.angle = -0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.25, 1.0);

      const bd = new b2.BodyDef();
      bd.position.Set(10.5, 19.0);

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new b2.BodyDef();
      bd.position.Set(4.0, 14.0);
      bd.angle = 0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.25, 1.0);

      const bd = new b2.BodyDef();
      bd.position.Set(-10.5, 11.0);

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(13.0, 0.25);

      const bd = new b2.BodyDef();
      bd.position.Set(-4.0, 6.0);
      bd.angle = -0.25;

      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 25.0;

      const friction = [0.75, 0.5, 0.35, 0.1, 0.0];

      for (let i = 0; i < 5; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        bd.position.Set(-15.0 + 4.0 * i, 28.0);
        const body = this.m_world.CreateBody(bd);

        fd.friction = friction[i];
        body.CreateFixture(fd);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Friction();
  }
}

export const testIndex: number = testbed.RegisterTest("Forces", "Friction", Friction.Create);
