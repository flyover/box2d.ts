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

import { b2Vec2, b2Transform } from "../Common/b2Math";
import { b2Color } from "../Common/b2Draw";
import { b2Shape } from "../Collision/Shapes/b2Shape";
import { b2ParticleFlag } from "./b2Particle";
import { b2ParticleSystem } from "./b2ParticleSystem";

export const enum b2ParticleGroupFlag {
  /// Prevents overlapping or leaking.
  b2_solidParticleGroup = 1 << 0,
  /// Keeps its shape.
  b2_rigidParticleGroup = 1 << 1,
  /// Won't be destroyed if it gets empty.
  b2_particleGroupCanBeEmpty = 1 << 2,
  /// Will be destroyed on next simulation step.
  b2_particleGroupWillBeDestroyed = 1 << 3,
  /// Updates depth data on next simulation step.
  b2_particleGroupNeedsUpdateDepth = 1 << 4,

  b2_particleGroupInternalMask = b2_particleGroupWillBeDestroyed | b2_particleGroupNeedsUpdateDepth
}

export class b2ParticleGroupDef {
  flags: b2ParticleFlag = 0;
  groupFlags: b2ParticleGroupFlag = 0;
  position: b2Vec2 = new b2Vec2();
  angle: number = 0.0;
  linearVelocity: b2Vec2 = new b2Vec2();
  angularVelocity: number = 0.0;
  color: b2Color = new b2Color();
  strength: number = 1.0;
  shape: b2Shape = null;
  shapes: b2Shape[] = null;
  shapeCount: number = 0;
  stride: number = 0;
  particleCount: number = 0;
  positionData: b2Vec2[] = null;
  lifetime: number = 0;
  userData: any = null;
  group: b2ParticleGroup = null;
}

export class b2ParticleGroup {

  m_system: b2ParticleSystem = null;
  m_firstIndex: number = 0;
  m_lastIndex: number = 0;
  m_groupFlags: b2ParticleGroupFlag = 0;
  m_strength: number = 1.0;
  m_prev: b2ParticleGroup = null;
  m_next: b2ParticleGroup = null;
  m_timestamp: number = -1;
  m_mass: number = 0.0;
  m_inertia: number = 0.0;
  m_center: b2Vec2 = new b2Vec2();
  m_linearVelocity: b2Vec2 = new b2Vec2();
  m_angularVelocity: number = 0.0;
  m_transform: b2Transform = new b2Transform();
  ///m_transform.SetIdentity();
  m_userData: any = null;

  GetNext(): b2ParticleGroup {
    return this.m_next;
  }

  GetParticleSystem(): b2ParticleSystem {
    return this.m_system;
  }

  GetParticleCount(): number {
    return this.m_lastIndex - this.m_firstIndex;
  }

  GetBufferIndex(): number {
    return this.m_firstIndex;
  }

  ContainsParticle(index: number): boolean {
    return this.m_firstIndex <= index && index < this.m_lastIndex;
  }

  GetAllParticleFlags(): b2ParticleFlag {
    let flags = 0;
    for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
      flags |= this.m_system.m_flagsBuffer.data[i];
    }
    return flags;
  }

  GetGroupFlags(): b2ParticleGroupFlag {
    return this.m_groupFlags;
  }

  SetGroupFlags(flags: number): void {
    ///b2Assert((flags & b2ParticleGroupFlag.b2_particleGroupInternalMask) === 0);
    flags |= this.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupInternalMask;
    this.m_system.SetGroupFlags(this, flags);
  }

  GetMass(): number {
    this.UpdateStatistics();
    return this.m_mass;
  }

  GetInertia(): number {
    this.UpdateStatistics();
    return this.m_inertia;
  }

  GetCenter(): b2Vec2 {
    this.UpdateStatistics();
    return this.m_center;
  }

  GetLinearVelocity(): b2Vec2 {
    this.UpdateStatistics();
    return this.m_linearVelocity;
  }

  GetAngularVelocity(): number {
    this.UpdateStatistics();
    return this.m_angularVelocity;
  }

  GetTransform(): b2Transform {
    return this.m_transform;
  }

  GetPosition(): b2Vec2 {
    return this.m_transform.p;
  }

  GetAngle(): number {
    return this.m_transform.q.GetAngle();
  }

  GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2 {
    const s_t0 = b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0;
    this.UpdateStatistics();
    ///  return m_linearVelocity + b2Cross(m_angularVelocity, worldPoint - m_center);
    return b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Vec2.SubVV(worldPoint, this.m_center, s_t0), out);
  }
  static GetLinearVelocityFromWorldPoint_s_t0 = new b2Vec2();

  GetUserData(): void {
    return this.m_userData;
  }

  SetUserData(data: any): void {
    this.m_userData = data;
  }

  ApplyForce(force: b2Vec2): void {
    this.m_system.ApplyForce(this.m_firstIndex, this.m_lastIndex, force);
  }

  ApplyLinearImpulse(impulse: b2Vec2): void {
    this.m_system.ApplyLinearImpulse(this.m_firstIndex, this.m_lastIndex, impulse);
  }

  DestroyParticles(callDestructionListener: boolean): void {
    ///b2Assert(this.m_system.m_world.IsLocked() === false);
    if (this.m_system.m_world.IsLocked()) {
      return;
    }

    for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
      this.m_system.DestroyParticle(i, callDestructionListener);
    }
  }

  UpdateStatistics(): void {
    const p = new b2Vec2();
    const v = new b2Vec2();
    if (this.m_timestamp !== this.m_system.m_timestamp) {
      const m = this.m_system.GetParticleMass();
      ///  this.m_mass = 0;
      this.m_mass = m * (this.m_lastIndex - this.m_firstIndex);
      this.m_center.SetZero();
      this.m_linearVelocity.SetZero();
      for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
        ///  this.m_mass += m;
        ///  this.m_center += m * this.m_system.m_positionBuffer.data[i];
        this.m_center.SelfMulAdd(m, this.m_system.m_positionBuffer.data[i]);
        ///  this.m_linearVelocity += m * this.m_system.m_velocityBuffer.data[i];
        this.m_linearVelocity.SelfMulAdd(m, this.m_system.m_velocityBuffer.data[i]);
      }
      if (this.m_mass > 0) {
        const inv_mass = 1 / this.m_mass;
        ///this.m_center *= 1 / this.m_mass;
        this.m_center.SelfMul(inv_mass);
        ///this.m_linearVelocity *= 1 / this.m_mass;
        this.m_linearVelocity.SelfMul(inv_mass);
      }
      this.m_inertia = 0;
      this.m_angularVelocity = 0;
      for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
        ///b2Vec2 p = this.m_system.m_positionBuffer.data[i] - this.m_center;
        b2Vec2.SubVV(this.m_system.m_positionBuffer.data[i], this.m_center, p);
        ///b2Vec2 v = this.m_system.m_velocityBuffer.data[i] - this.m_linearVelocity;
        b2Vec2.SubVV(this.m_system.m_velocityBuffer.data[i], this.m_linearVelocity, v);
        this.m_inertia += m * b2Vec2.DotVV(p, p);
        this.m_angularVelocity += m * b2Vec2.CrossVV(p, v);
      }
      if (this.m_inertia > 0) {
        this.m_angularVelocity *= 1 / this.m_inertia;
      }
      this.m_timestamp = this.m_system.m_timestamp;
    }
  }
}

///#endif
