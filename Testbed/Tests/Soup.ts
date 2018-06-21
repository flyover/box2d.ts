/*
 * Copyright (c) 2013 Google, Inc.
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

// #if B2_ENABLE_PARTICLE

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class Soup extends testbed.Test {
  public m_ground: box2d.b2Body;

  constructor() {
    super();

    // Disable the selection of wall and barrier particles for this test.
    this.InitializeParticleParameters(box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_barrierParticle);

    {
      const bd = new box2d.b2BodyDef();
      this.m_ground = this.m_world.CreateBody(bd);

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-4, -1),
          new box2d.b2Vec2(4, -1),
          new box2d.b2Vec2(4, 0),
          new box2d.b2Vec2(-4, 0),
        ];
        shape.Set(vertices, 4);
        this.m_ground.CreateFixture(shape, 0.0);
      }

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-4, -0.1),
          new box2d.b2Vec2(-2, -0.1),
          new box2d.b2Vec2(-2, 2),
          new box2d.b2Vec2(-4, 3),
        ];
        shape.Set(vertices, 4);
        this.m_ground.CreateFixture(shape, 0.0);
      }

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(2, -0.1),
          new box2d.b2Vec2(4, -0.1),
          new box2d.b2Vec2(4, 3),
          new box2d.b2Vec2(2, 2),
        ];
        shape.Set(vertices, 4);
        this.m_ground.CreateFixture(shape, 0.0);
      }
    }

    this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(2, 1, new box2d.b2Vec2(0, 1), 0);
      const pd = new box2d.b2ParticleGroupDef();
      pd.shape = shape;
      pd.flags = testbed.Test.GetParticleParameterValue();
      const group = this.m_particleSystem.CreateParticleGroup(pd);
      if (pd.flags & box2d.b2ParticleFlag.b2_colorMixingParticle) {
        this.ColorParticleGroup(group, 0);
      }
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2CircleShape();
      shape.m_p.Set(0, 0.5);
      shape.m_radius = 0.1;
      body.CreateFixture(shape, 0.1);
      this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.1, 0.1, new box2d.b2Vec2(-1, 0.5), 0);
      body.CreateFixture(shape, 0.1);
      this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.1, 0.1, new box2d.b2Vec2(1, 0.5), 0.5);
      body.CreateFixture(shape, 0.1);
      this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(0, 2), new box2d.b2Vec2(0.1, 2.1));
      body.CreateFixture(shape, 1);
      ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
      const massData = new box2d.b2MassData();
      massData.mass = 0.1;
      massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
      massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
      massData.I = 0.0;
      body.SetMassData(massData);
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(0.3, 2.0), new box2d.b2Vec2(0.4, 2.1));
      body.CreateFixture(shape, 1);
      ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
      const massData = new box2d.b2MassData();
      massData.mass = 0.1;
      massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
      massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
      massData.I = 0.0;
      body.SetMassData(massData);
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-0.3, 2.1), new box2d.b2Vec2(-0.2, 2.0));
      body.CreateFixture(shape, 1);
      ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
      const massData = new box2d.b2MassData();
      massData.mass = 0.1;
      massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
      massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
      massData.I = 0.0;
      body.SetMassData(massData);
    }
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new Soup();
  }
}

// #endif
