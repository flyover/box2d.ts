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

/// This is a test of typical character collision scenarios. This does not
/// show how you should implement a character in your application.
/// Instead this is used to test smooth collision on edge chains.
export class CharacterCollision extends testbed.Test {
  public m_character: b2.Body;

  constructor() {
    super();

    // Ground body
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Collinear edges with no adjacency information.
    // This shows the problematic case where a box shape can hit
    // an internal vertex.
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-8.0, 1.0), new b2.Vec2(-6.0, 1.0));
      ground.CreateFixture(shape, 0.0);
      shape.SetTwoSided(new b2.Vec2(-6.0, 1.0), new b2.Vec2(-4.0, 1.0));
      ground.CreateFixture(shape, 0.0);
      shape.SetTwoSided(new b2.Vec2(-4.0, 1.0), new b2.Vec2(-2.0, 1.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Chain shape
    {
      const bd = new b2.BodyDef();
      bd.angle = 0.25 * b2.pi;
      const ground = this.m_world.CreateBody(bd);

      const vs = b2.Vec2.MakeArray(4);
      vs[0].Set(5.0, 7.0);
      vs[1].Set(6.0, 8.0);
      vs[2].Set(7.0, 8.0);
      vs[3].Set(8.0, 7.0);
      const shape = new b2.ChainShape();
      shape.CreateLoop(vs);
      ground.CreateFixture(shape, 0.0);
    }

    // Square tiles. This shows that adjacency shapes may
    // have non-smooth collision. There is no solution
    // to this problem.
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(1.0, 1.0, new b2.Vec2(4.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
      shape.SetAsBox(1.0, 1.0, new b2.Vec2(6.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
      shape.SetAsBox(1.0, 1.0, new b2.Vec2(8.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
    }

    // Square made from an edge loop. Collision should be smooth.
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const vs = b2.Vec2.MakeArray(4);
      vs[0].Set(-1.0, 3.0);
      vs[1].Set(1.0, 3.0);
      vs[2].Set(1.0, 5.0);
      vs[3].Set(-1.0, 5.0);
      const shape = new b2.ChainShape();
      shape.CreateLoop(vs);
      ground.CreateFixture(shape, 0.0);
    }

    // Edge loop. Collision should be smooth.
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-10.0, 4.0);
      const ground = this.m_world.CreateBody(bd);

      const vs = b2.Vec2.MakeArray(10);
      vs[0].Set(0.0, 0.0);
      vs[1].Set(6.0, 0.0);
      vs[2].Set(6.0, 2.0);
      vs[3].Set(4.0, 1.0);
      vs[4].Set(2.0, 2.0);
      vs[5].Set(0.0, 2.0);
      vs[6].Set(-2.0, 2.0);
      vs[7].Set(-4.0, 3.0);
      vs[8].Set(-6.0, 2.0);
      vs[9].Set(-6.0, 0.0);
      const shape = new b2.ChainShape();
      shape.CreateLoop(vs);
      ground.CreateFixture(shape, 0.0);
    }

    // Square character 1
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-3.0, 8.0);
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Square character 2
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-5.0, 5.0);
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.25, 0.25);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Hexagon character
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-5.0, 8.0);
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      let angle = 0.0;
      const delta = b2.pi / 3.0;
      const vertices = b2.Vec2.MakeArray(6);
      for (let i = 0; i < 6; ++i) {
        vertices[i].Set(0.5 * b2.Cos(angle), 0.5 * b2.Sin(angle));
        angle += delta;
      }

      const shape = new b2.PolygonShape();
      shape.Set(vertices, 6);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Circle character
    {
      const bd = new b2.BodyDef();
      bd.position.Set(3.0, 5.0);
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 0.5;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Circle character
    {
      const bd = new b2.BodyDef();
      bd.position.Set(-7.0, 6.0);
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.allowSleep = false;

      this.m_character = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 0.25;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      fd.friction = 1.0;
      this.m_character.CreateFixture(fd);
    }
  }

  public Step(settings: testbed.Settings): void {
    const v = this.m_character.GetLinearVelocity().Clone();
    v.x = -5.0;
    this.m_character.SetLinearVelocity(v);

    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "This tests various character collision shapes");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Limitation: square and hexagon can snag on aligned boxes.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Feature: edge chains have smooth collision inside and out.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new CharacterCollision();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Character Collision", CharacterCollision.Create);
