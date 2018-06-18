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

export class CharacterCollision extends testbed.Test {
  public m_character: box2d.b2Body;

  constructor() {
    super();

    // Ground body
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Collinear edges with no adjacency information.
    // This shows the problematic case where a box shape can hit
    // an internal vertex.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-8.0, 1.0), new box2d.b2Vec2(-6.0, 1.0));
      ground.CreateFixture(shape, 0.0);
      shape.Set(new box2d.b2Vec2(-6.0, 1.0), new box2d.b2Vec2(-4.0, 1.0));
      ground.CreateFixture(shape, 0.0);
      shape.Set(new box2d.b2Vec2(-4.0, 1.0), new box2d.b2Vec2(-2.0, 1.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Chain shape
    {
      const bd = new box2d.b2BodyDef();
      bd.angle = 0.25 * box2d.b2_pi;
      const ground = this.m_world.CreateBody(bd);

      /*box2d.b2Vec2[]*/
      const vs = box2d.b2Vec2.MakeArray(4);
      vs[0].Set(5.0, 7.0);
      vs[1].Set(6.0, 8.0);
      vs[2].Set(7.0, 8.0);
      vs[3].Set(8.0, 7.0);
      /*box2d.b2ChainShape*/
      const shape = new box2d.b2ChainShape();
      shape.CreateChain(vs, 4);
      ground.CreateFixture(shape, 0.0);
    }

    // Square tiles. This shows that adjacency shapes may
    // have non-smooth collision. There is no solution
    // to this problem.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(1.0, 1.0, new box2d.b2Vec2(4.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
      shape.SetAsBox(1.0, 1.0, new box2d.b2Vec2(6.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
      shape.SetAsBox(1.0, 1.0, new box2d.b2Vec2(8.0, 3.0), 0.0);
      ground.CreateFixture(shape, 0.0);
    }

    // Square made from an edge loop. Collision should be smooth.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      /*box2d.b2Vec2[]*/
      const vs = box2d.b2Vec2.MakeArray(4);
      vs[0].Set(-1.0, 3.0);
      vs[1].Set(1.0, 3.0);
      vs[2].Set(1.0, 5.0);
      vs[3].Set(-1.0, 5.0);
      /*box2d.b2ChainShape*/
      const shape = new box2d.b2ChainShape();
      shape.CreateChain(vs, 4);
      ground.CreateFixture(shape, 0.0);
    }

    // Edge loop. Collision should be smooth.
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-10.0, 4.0);
      const ground = this.m_world.CreateBody(bd);

      /*box2d.b2Vec2[]*/
      const vs = box2d.b2Vec2.MakeArray(10);
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
      /*box2d.b2ChainShape*/
      const shape = new box2d.b2ChainShape();
      shape.CreateChain(vs, 10);
      ground.CreateFixture(shape, 0.0);
    }

    // Square character 1
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-3.0, 8.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Square character 2
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-5.0, 5.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.25, 0.25);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Hexagon character
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-5.0, 8.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      let angle = 0.0;
      const delta = box2d.b2_pi / 3.0;
      const vertices = box2d.b2Vec2.MakeArray(6);
      for (let i = 0; i < 6; ++i) {
        vertices[i].Set(0.5 * box2d.b2Cos(angle), 0.5 * box2d.b2Sin(angle));
        angle += delta;
      }

      const shape = new box2d.b2PolygonShape();
      shape.Set(vertices, 6);

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Circle character
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(3.0, 5.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.fixedRotation = true;
      bd.allowSleep = false;

      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2CircleShape();
      shape.m_radius = 0.5;

      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      fd.density = 20.0;
      body.CreateFixture(fd);
    }

    // Circle character
    {
      const bd = new box2d.b2BodyDef();
      bd.position.Set(-7.0, 6.0);
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.allowSleep = false;

      this.m_character = this.m_world.CreateBody(bd);

      const shape = new box2d.b2CircleShape();
      shape.m_radius = 0.25;

      const fd = new box2d.b2FixtureDef();
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
