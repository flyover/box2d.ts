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

///#if B2_ENABLE_PARTICLE

import { b2_invalidParticleIndex } from "../Common/b2Settings";
import { b2Clamp, b2Vec2 } from "../Common/b2Math";
import { b2Color } from "../Common/b2Draw";
import { b2ParticleGroup } from "./b2ParticleGroup";

/**
 * The particle type. Can be combined with the | operator.
 */
export const enum b2ParticleFlag {
  /// Water particle.
  b2_waterParticle = 0,
  /// Removed after next simulation step.
  b2_zombieParticle = 1 << 1,
  /// Zero velocity.
  b2_wallParticle = 1 << 2,
  /// With restitution from stretching.
  b2_springParticle = 1 << 3,
  /// With restitution from deformation.
  b2_elasticParticle = 1 << 4,
  /// With viscosity.
  b2_viscousParticle = 1 << 5,
  /// Without isotropic pressure.
  b2_powderParticle = 1 << 6,
  /// With surface tension.
  b2_tensileParticle = 1 << 7,
  /// Mix color between contacting particles.
  b2_colorMixingParticle = 1 << 8,
  /// Call b2DestructionListener on destruction.
  b2_destructionListenerParticle = 1 << 9,
  /// Prevents other particles from leaking.
  b2_barrierParticle = 1 << 10,
  /// Less compressibility.
  b2_staticPressureParticle = 1 << 11,
  /// Makes pairs or triads with other particles.
  b2_reactiveParticle = 1 << 12,
  /// With high repulsive force.
  b2_repulsiveParticle = 1 << 13,
  /// Call b2ContactListener when this particle is about to interact with
  /// a rigid body or stops interacting with a rigid body.
  /// This results in an expensive operation compared to using
  /// b2_fixtureContactFilterParticle to detect collisions between
  /// particles.
  b2_fixtureContactListenerParticle = 1 << 14,
  /// Call b2ContactListener when this particle is about to interact with
  /// another particle or stops interacting with another particle.
  /// This results in an expensive operation compared to using
  /// b2_particleContactFilterParticle to detect collisions between
  /// particles.
  b2_particleContactListenerParticle = 1 << 15,
  /// Call b2ContactFilter when this particle interacts with rigid bodies.
  b2_fixtureContactFilterParticle = 1 << 16,
  /// Call b2ContactFilter when this particle interacts with other
  /// particles.
  b2_particleContactFilterParticle = 1 << 17
};

export const B2PARTICLECOLOR_BITS_PER_COMPONENT = (1 << 3);

export const B2PARTICLECOLOR_MAX_VALUE = ((1 << B2PARTICLECOLOR_BITS_PER_COMPONENT) - 1);

export class b2ParticleColor {

  public r: number;
  public g: number;
  public b: number;
  public a: number;

  static k_maxValue = +B2PARTICLECOLOR_MAX_VALUE;
  static k_inverseMaxValue = 1.0 / +B2PARTICLECOLOR_MAX_VALUE;
  static k_bitsPerComponent = B2PARTICLECOLOR_BITS_PER_COMPONENT;

  constructor(a0: number | b2Color = 0x7f, a1: number = 0x7f, a2: number = 0x7f, a3: number = 0xff) {
    if (a0 instanceof b2Color) {
      this.r = 0 | (255 * a0.r);
      this.g = 0 | (255 * a0.g);
      this.b = 0 | (255 * a0.b);
      this.a = 0 | (255 * a0.a);
    } else {
      this.r = 0 | a0;
      this.g = 0 | a1;
      this.b = 0 | a2;
      this.a = 0 | a3;
    }
  }

  public IsZero(): boolean {
    return (this.r === 0) && (this.g === 0) && (this.b === 0) && (this.a === 0);
  }

  public GetColor(out: b2Color): b2Color {
    out.r = this.r / 255.0;
    out.g = this.g / 255.0;
    out.b = this.b / 255.0;
    out.a = this.a / 255.0;
    return out;
  }

  public Set(a0: number | b2Color, a1?: number, a2?: number, a3?: number): void {
    if (a0 instanceof b2Color) {
      this.SetColor(a0);
    } else if (arguments.length >= 3) {
      this.SetRGBA(a0 || 0, a1 || 0, a2 || 0, a3);
    } else {
      throw new Error();
    }
  }

  public SetRGBA(r: number, g: number, b: number, a: number = 255): void {
    this.r = 0 | r;
    this.g = 0 | g;
    this.b = 0 | b;
    this.a = 0 | a;
  }

  public SetColor(color: b2Color): void {
    this.r = 0 | (255 * color.r);
    this.g = 0 | (255 * color.g);
    this.b = 0 | (255 * color.b);
    this.a = 0 | (255 * color.a);
  }

  public Copy(color: b2ParticleColor): b2ParticleColor {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
    return this;
  }

  public Clone(): b2ParticleColor {
    return new b2ParticleColor().Copy(this);
  }

  public SelfMul_0_1(s: number): b2ParticleColor {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    this.a *= s;
    return this;
  }

  public SelfMul_0_255(s: number): b2ParticleColor {
    // 1..256 to maintain the complete dynamic range.
    const scale = s + 1;
    this.r = (this.r * scale) >> b2ParticleColor.k_bitsPerComponent;
    this.g = (this.g * scale) >> b2ParticleColor.k_bitsPerComponent;
    this.b = (this.b * scale) >> b2ParticleColor.k_bitsPerComponent;
    this.a = (this.a * scale) >> b2ParticleColor.k_bitsPerComponent;
    return this;
  }

  public Mul_0_1(s: number, out: b2ParticleColor): b2ParticleColor {
    return out.Copy(this).SelfMul_0_1(s);
  }

  public Mul_0_255(s: number, out: b2ParticleColor): b2ParticleColor {
    return out.Copy(this).SelfMul_0_255(s);
  }

  public SelfAdd(color: b2ParticleColor): b2ParticleColor {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    this.a += color.a;
    return this;
  }

  public Add(color: b2ParticleColor, out: b2ParticleColor): b2ParticleColor {
    out.r = this.r + color.r;
    out.g = this.g + color.g;
    out.b = this.b + color.b;
    out.a = this.a + color.a;
    return out;
  }

  public SelfSub(color: b2ParticleColor): b2ParticleColor {
    this.r -= color.r;
    this.g -= color.g;
    this.b -= color.b;
    this.a -= color.a;
    return this;
  }

  public Sub(color: b2ParticleColor, out: b2ParticleColor): b2ParticleColor {
    out.r = this.r - color.r;
    out.g = this.g - color.g;
    out.b = this.b - color.b;
    out.a = this.a - color.a;
    return out;
  }

  public IsEqual(color: b2ParticleColor): boolean {
    return (this.r === color.r) && (this.g === color.g) && (this.b === color.b) && (this.a === color.a);
  }

  public Mix(mixColor: b2ParticleColor, strength: number): void {
    b2ParticleColor.MixColors(this, mixColor, strength);
  }

  public static MixColors(colorA: b2ParticleColor, colorB: b2ParticleColor, strength: number): void {
    const dr = (strength * (colorB.r - colorA.r)) >> b2ParticleColor.k_bitsPerComponent;
    const dg = (strength * (colorB.g - colorA.g)) >> b2ParticleColor.k_bitsPerComponent;
    const db = (strength * (colorB.b - colorA.b)) >> b2ParticleColor.k_bitsPerComponent;
    const da = (strength * (colorB.a - colorA.a)) >> b2ParticleColor.k_bitsPerComponent;
    colorA.r += dr;
    colorA.g += dg;
    colorA.b += db;
    colorA.a += da;
    colorB.r -= dr;
    colorB.g -= dg;
    colorB.b -= db;
    colorB.a -= da;
  }
}

export const b2ParticleColor_zero = new b2ParticleColor();

export class b2ParticleDef {
  flags: b2ParticleFlag = 0;
  position: b2Vec2 = new b2Vec2();
  velocity: b2Vec2 = new b2Vec2();
  color: b2ParticleColor = new b2ParticleColor();
  lifetime: number = 0.0;
  userData: any = null;
  group: b2ParticleGroup = null;
}

export function b2CalculateParticleIterations(gravity: number, radius: number, timeStep: number): number {
  // In some situations you may want more particle iterations than this,
  // but to avoid excessive cycle cost, don't recommend more than this.
  const B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS = 8;
  const B2_RADIUS_THRESHOLD = 0.01;
  const iterations = Math.ceil(Math.sqrt(gravity / (B2_RADIUS_THRESHOLD * radius)) * timeStep);
  return b2Clamp(iterations, 1, B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS);
}

export class b2ParticleHandle {
  public m_index: number = b2_invalidParticleIndex;
  public GetIndex(): number { return this.m_index; }
  public SetIndex(index: number): void { this.m_index = index; }
}

///#endif
