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

export class Particles extends testbed.Test {
  constructor() {
    super();
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-4, -1),
          new box2d.b2Vec2(4, -1),
          new box2d.b2Vec2(4, 0),
          new box2d.b2Vec2(-4, 0),
        ];
        shape.Set(vertices, 4);
        ground.CreateFixture(shape, 0.0);
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
        ground.CreateFixture(shape, 0.0);
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
        ground.CreateFixture(shape, 0.0);
      }
    }

    this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
    const particleType = testbed.Test.GetParticleParameterValue();
    this.m_particleSystem.SetDamping(0.2);

    {
      const shape = new box2d.b2CircleShape();
      shape.m_p.Set(0, 3);
      shape.m_radius = 2;
      const pd = new box2d.b2ParticleGroupDef();
      pd.flags = particleType;
      pd.shape = shape;
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
      shape.m_p.Set(0, 8);
      shape.m_radius = 0.5;
      body.CreateFixture(shape, 0.5);
    }
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new Particles();
  }
}

// #endif
