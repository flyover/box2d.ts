/*
 * Copyright (c) 2014 Google, Inc.
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

/**
 * Test the behavior of particles falling onto a concave
 * ambiguous Body contact fixture junction.
 */

export class AntiPointy extends testbed.Test {
  public m_particlesToCreate = 300;

  constructor() {
    super();

    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      // Construct a valley out of many polygons to ensure there's no
      // issue with particles falling directly on an ambiguous set of
      // fixture corners.

      const step = 1.0;

      for (let i = -10.0; i < 10.0; i += step) {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(i, -10.0),
          new box2d.b2Vec2(i + step, -10.0),
          new box2d.b2Vec2(0.0, 15.0),
        ];
        shape.Set(vertices, 3);
        ground.CreateFixture(shape, 0.0);
      }
      for (let i = -10.0; i < 35.0; i += step) {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-10.0, i),
          new box2d.b2Vec2(-10.0, i + step),
          new box2d.b2Vec2(0.0, 15.0),
        ];
        shape.Set(vertices, 3);
        ground.CreateFixture(shape, 0.0);

        const vertices2 = [
          new box2d.b2Vec2(10.0, i),
          new box2d.b2Vec2(10.0, i + step),
          new box2d.b2Vec2(0.0, 15.0),
        ];
        shape.Set(vertices2, 3);
        ground.CreateFixture(shape, 0.0);
      }
    }

    // Cap the number of generated particles or we'll fill forever
    this.m_particlesToCreate = 300;

    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
    const particleType = testbed.Test.GetParticleParameterValue();
    if (particleType === box2d.b2ParticleFlag.b2_waterParticle) {
      this.m_particleSystem.SetDamping(0.2);
    }
  }

  public Step(settings: testbed.Settings) {
    super.Step(settings);

    if (this.m_particlesToCreate <= 0) {
      return;
    }

    --this.m_particlesToCreate;

    const flags = testbed.Test.GetParticleParameterValue();
    const pd = new box2d.b2ParticleDef();

    pd.position.Set(0.0, 40.0);
    pd.velocity.Set(0.0, -1.0);
    pd.flags = flags;

    if (flags & (box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_elasticParticle)) {
      const count = this.m_particleSystem.GetParticleCount();
      pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
      pd.flags |= box2d.b2ParticleFlag.b2_reactiveParticle;
    }

    this.m_particleSystem.CreateParticle(pd);
  }

  public static Create() {
    return new AntiPointy();
  }
}

// #endif
