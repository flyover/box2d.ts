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

export class Impulse extends testbed.Test {
  public static readonly kBoxLeft = -2;
  public static readonly kBoxRight = 2;
  public static readonly kBoxBottom = 0;
  public static readonly kBoxTop = 4;

  public m_useLinearImpulse = false;

  constructor() {
    super();

    // Create the containing box.
    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const box = [
        new b2.Vec2(Impulse.kBoxLeft, Impulse.kBoxBottom),
        new b2.Vec2(Impulse.kBoxRight, Impulse.kBoxBottom),
        new b2.Vec2(Impulse.kBoxRight, Impulse.kBoxTop),
        new b2.Vec2(Impulse.kBoxLeft, Impulse.kBoxTop),
      ];
      const shape = new b2.ChainShape();
      shape.CreateLoop(box);
      ground.CreateFixture(shape, 0.0);
    }

    this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
    this.m_particleSystem.SetDamping(0.2);

    // Create the particles.
    {
      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.8, 1.0, new b2.Vec2(0.0, 1.01), 0);
      const pd = new b2.ParticleGroupDef();
      pd.flags = testbed.Test.GetParticleParameterValue();
      pd.shape = shape;
      const group = this.m_particleSystem.CreateParticleGroup(pd);
      if (pd.flags & b2.ParticleFlag.b2_colorMixingParticle) {
        this.ColorParticleGroup(group, 0);
      }
    }
  }

  public MouseUp(p: b2.Vec2) {
    super.MouseUp(p);

    // Apply an impulse to the particles.
    const isInsideBox = Impulse.kBoxLeft <= p.x && p.x <= Impulse.kBoxRight &&
      Impulse.kBoxBottom <= p.y && p.y <= Impulse.kBoxTop;
    if (isInsideBox) {
      const kBoxCenter = new b2.Vec2(0.5 * (Impulse.kBoxLeft + Impulse.kBoxRight),
        0.5 * (Impulse.kBoxBottom + Impulse.kBoxTop));
      const direction = b2.Vec2.SubVV(p, kBoxCenter, new b2.Vec2());
      direction.Normalize();
      this.ApplyImpulseOrForce(direction);
    }
  }

  public Keyboard(key: string) {
    super.Keyboard(key);

    switch (key) {
      case "l":
        this.m_useLinearImpulse = true;
        break;
      case "f":
        this.m_useLinearImpulse = false;
        break;
    }
  }

  public ApplyImpulseOrForce(direction: b2.Vec2) {
    const particleSystem = this.m_world.GetParticleSystemList();
    if (!particleSystem) { throw new Error(); }
    const particleGroup = particleSystem.GetParticleGroupList();
    if (!particleGroup) { throw new Error(); }
    const numParticles = particleGroup.GetParticleCount();

    if (this.m_useLinearImpulse) {
      const kImpulseMagnitude = 0.005;
      ///  const b2Vec2 impulse = kImpulseMagnitude * direction * (float32)numParticles;
      const impulse = b2.Vec2.MulSV(kImpulseMagnitude * numParticles, direction, new b2.Vec2());
      particleGroup.ApplyLinearImpulse(impulse);
    } else {
      const kForceMagnitude = 1.0;
      ///  const b2Vec2 force = kForceMagnitude * direction * (float32)numParticles;
      const force = b2.Vec2.MulSV(kForceMagnitude * numParticles, direction, new b2.Vec2());
      particleGroup.ApplyForce(force);
    }
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new Impulse();
  }
}

export const testIndex: number = testbed.RegisterTest("Particles", "Impulse", Impulse.Create);

// #endif
