/*
* Copyright (c) 2015 Google, Inc.
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

// Optionally disables particle / fixture and particle / particle contacts.
export class ParticleContactDisabler extends box2d.b2ContactFilter {
  public m_enableFixtureParticleCollisions = true;
  public m_enableParticleParticleCollisions = true;

  // Blindly enable / disable collisions between fixtures and particles.
  public ShouldCollideFixtureParticle(): boolean {
    return this.m_enableFixtureParticleCollisions;
  }

  // Blindly enable / disable collisions between particles.
  public ShouldCollideParticleParticle(): boolean {
    return this.m_enableParticleParticleCollisions;
  }
}

export class ParticleCollisionFilter extends testbed.Test {
  constructor() {
    super();

    // must also set b2_particleContactFilterParticle and
    // b2_fixtureContactFilterParticle flags for particle group
    this.m_world.SetContactFilter(this.m_contactDisabler);

    this.m_world.SetGravity(new box2d.b2Vec2(0, 0));

    // Create the container.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);
      const shape = new box2d.b2ChainShape();
      const vertices: box2d.b2Vec2[] = [
        new box2d.b2Vec2(-ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
        new box2d.b2Vec2(ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
        new box2d.b2Vec2(ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
        new box2d.b2Vec2(-ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
      ];
      shape.CreateLoop(vertices);
      const def = new box2d.b2FixtureDef();
      def.shape = shape;
      def.density = 0;
      def.density = 0;
      def.restitution = 1.0;
      ground.CreateFixture(def);
    }

    // create the particles
    this.m_particleSystem.SetRadius(0.5);
    {
      // b2PolygonShape shape;
      const shape = new box2d.b2PolygonShape();
      // shape.SetAsBox(1.5f, 1.5f, b2Vec2(kBoxSizeHalf, kBoxSizeHalf + kOffset), 0.0f);
      shape.SetAsBox(1.5, 1.5, new box2d.b2Vec2(ParticleCollisionFilter.kBoxSizeHalf, ParticleCollisionFilter.kBoxSizeHalf + ParticleCollisionFilter.kOffset), 0.0);
      // b2ParticleGroupDef pd;
      const pd = new box2d.b2ParticleGroupDef();
      // pd.shape = &shape;
      pd.shape = shape;
      // pd.flags = b2_powderParticle
      // 		| b2_particleContactFilterParticle
      // 		| b2_fixtureContactFilterParticle;
      pd.flags = box2d.b2ParticleFlag.b2_powderParticle
        | box2d.b2ParticleFlag.b2_particleContactFilterParticle
        | box2d.b2ParticleFlag.b2_fixtureContactFilterParticle;
      // m_particleGroup =
      // 	m_particleSystem.CreateParticleGroup(pd);
      this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);

      // b2Vec2* velocities =
      // 	m_particleSystem.GetVelocityBuffer() +
      // 	m_particleGroup.GetBufferIndex();
      const velocities: box2d.b2Vec2[] = this.m_particleSystem.GetVelocityBuffer();
      const index: number = this.m_particleGroup.GetBufferIndex();
      // for (int i = 0; i < m_particleGroup.GetParticleCount(); ++i) {
      // 	b2Vec2& v = *(velocities + i);
      // 	v.Set(RandomFloat(), RandomFloat());
      // 	v.Normalize();
      // 	v *= kSpeedup;
      // }
      for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
        const v: box2d.b2Vec2 = velocities[index + i];
        v.Set(testbed.RandomFloat(), testbed.RandomFloat());
        v.SelfNormalize();
        v.SelfMul(ParticleCollisionFilter.kSpeedup);
      }
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    // const int32 index = m_particleGroup.GetBufferIndex();
    const index: number = this.m_particleGroup.GetBufferIndex();
    // b2Vec2* const velocities =
    // 	m_particleSystem.GetVelocityBuffer() + index;
    const velocities: box2d.b2Vec2[] = this.m_particleSystem.GetVelocityBuffer();
    // for (int32 i = 0; i < m_particleGroup.GetParticleCount(); i++) {
    // 	// Add energy to particles based upon the temperature.
    // 	b2Vec2& v = velocities[i];
    // 	v.Normalize();
    // 	v *= kSpeedup;
    // }
    for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
      const v: box2d.b2Vec2 = velocities[index + i];
      v.SelfNormalize();
      v.SelfMul(ParticleCollisionFilter.kSpeedup);
    }

    // key help
    {
      const k_keys: string[] = [
        "Keys: (a) toggle Fixture collisions",
        "      (s) toggle particle collisions",
      ];
      for (let i = 0; i < k_keys.length; ++i) {
        testbed.g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        this.ToggleFixtureCollisions();
        break;
      case "s":
        this.ToggleParticleCollisions();
        break;
      default:
        super.Keyboard(key);
        break;
    }
  }

  public ToggleFixtureCollisions(): void {
    this.m_contactDisabler.m_enableFixtureParticleCollisions = !this.m_contactDisabler.m_enableFixtureParticleCollisions;
  }

  public ToggleParticleCollisions(): void {
    this.m_contactDisabler.m_enableParticleParticleCollisions = !this.m_contactDisabler.m_enableParticleParticleCollisions;
  }

  public m_contactDisabler: ParticleContactDisabler = new ParticleContactDisabler();
  public m_particleGroup: box2d.b2ParticleGroup;

  public static readonly kBoxSize = 10.0;
  public static readonly kBoxSizeHalf = ParticleCollisionFilter.kBoxSize / 2;
  public static readonly kOffset = 20.0;
  public static readonly kParticlesContainerSize = ParticleCollisionFilter.kOffset + 0.5;
  public static readonly kSpeedup = 8.0;

  public static Create() {
    return new ParticleCollisionFilter();
  }
}

// #endif
