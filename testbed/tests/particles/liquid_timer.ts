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

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class LiquidTimer extends testbed.Test {
  public static readonly k_paramValues = [
    new testbed.ParticleParameterValue(b2.ParticleFlag.b2_tensileParticle | b2.ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile + viscous"),
  ];
  public static readonly k_paramDef = [
    new testbed.ParticleParameterDefinition(LiquidTimer.k_paramValues),
    new testbed.ParticleParameterDefinition(testbed.ParticleParameter.k_particleTypes),
  ];
  public static readonly k_paramDefCount = LiquidTimer.k_paramDef.length;

  constructor() {
    super();

    // Setup particle parameters.
    testbed.Test.SetParticleParameters(LiquidTimer.k_paramDef, LiquidTimer.k_paramDefCount);

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.ChainShape();
      const vertices = [
        new b2.Vec2(-2, 0),
        new b2.Vec2(2, 0),
        new b2.Vec2(2, 4),
        new b2.Vec2(-2, 4),
      ];
      shape.CreateLoop(vertices);
      ground.CreateFixture(shape, 0.0);

    }

    this.m_particleSystem.SetRadius(0.025); {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(2, 0.4, new b2.Vec2(0, 3.6), 0);
      const pd = new b2.ParticleGroupDef();
      pd.flags = testbed.Test.GetParticleParameterValue();
      pd.shape = shape;
      const group = this.m_particleSystem.CreateParticleGroup(pd);
      if (pd.flags & b2.ParticleFlag.b2_colorMixingParticle) {
        this.ColorParticleGroup(group, 0);
      }
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-2, 3.2), new b2.Vec2(-1.2, 3.2));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-1.1, 3.2), new b2.Vec2(2, 3.2));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-1.2, 3.2), new b2.Vec2(-1.2, 2.8));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-1.1, 3.2), new b2.Vec2(-1.1, 2.8));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-1.6, 2.4), new b2.Vec2(0.8, 2));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(1.6, 1.6), new b2.Vec2(-0.8, 1.2));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-1.2, 0.8), new b2.Vec2(-1.2, 0));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-0.4, 0.8), new b2.Vec2(-0.4, 0));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(0.4, 0.8), new b2.Vec2(0.4, 0));
      body.CreateFixture(shape, 0.1);
    }

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);
      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(1.2, 0.8), new b2.Vec2(1.2, 0));
      body.CreateFixture(shape, 0.1);
    }
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new LiquidTimer();
  }
}

export const testIndex: number = testbed.RegisterTest("Particles", "Liquid Timer", LiquidTimer.Create);

// #endif
