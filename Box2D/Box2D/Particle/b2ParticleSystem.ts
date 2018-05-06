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

import { b2_linearSlop, b2_maxFloat, b2_maxParticleIndex, b2_invalidParticleIndex, b2_minParticleSystemBufferCapacity, b2_maxTriadDistanceSquared, b2_barrierCollisionTime, b2MakeArray } from "../Common/b2Settings";
import { b2_maxParticlePressure, b2_minParticleWeight, b2_maxParticleForce, b2_particleStride } from "../Common/b2Settings";
import { b2Clamp, b2InvSqrt, b2Vec2, b2Rot, b2Transform } from "../Common/b2Math";
import { b2Color } from "../Common/b2Draw";
import { b2AABB, b2RayCastInput, b2RayCastOutput } from "../Collision/b2Collision";
import { b2ShapeType, b2Shape, b2MassData } from "../Collision/Shapes/b2Shape";
import { b2EdgeShape } from "../Collision/Shapes/b2EdgeShape";
import { b2ChainShape } from "../Collision/Shapes/b2ChainShape";
import { b2TimeStep } from "../Dynamics/b2TimeStep";
import { b2Fixture } from "../Dynamics/b2Fixture";
import { b2Body } from "../Dynamics/b2Body";
import { b2World } from "../Dynamics/b2World";
import { b2ContactFilter, b2ContactListener, b2QueryCallback, b2RayCastCallback } from "../Dynamics/b2WorldCallbacks";
import { b2ParticleFlag, b2ParticleDef, b2ParticleHandle } from "./b2Particle";
import { b2ParticleGroupFlag, b2ParticleGroupDef, b2ParticleGroup } from "./b2ParticleGroup";
import { b2VoronoiDiagram } from "./b2VoronoiDiagram";
import { b2DistanceProxy } from "../Collision/b2Distance";

function b2Assert(condition: boolean) {}

function std_iter_swap(array: any[], a: number, b: number): void {
  const tmp = array[a];
  array[a] = array[b];
  array[b] = tmp;
}

function default_compare(a: number, b: number): boolean { return a < b; }

function std_sort(array: any[], first: number = 0, len: number = array.length - first, cmp: (a: any, b: any) => boolean = default_compare): any[] {
  let left = first;
  let stack: any[] = [];
  let pos = 0;

  for (; ; ) { /* outer loop */
    for (; left + 1 < len; len++) { /* sort left to len-1 */
      let pivot = array[left + Math.floor(Math.random() * (len - left))]; /* pick random pivot */
      stack[pos++] = len; /* sort right part later */
      for (let right = left - 1; ; ) { /* inner loop: partitioning */
        while (cmp(array[++right], pivot)) {} /* look for greater element */
        while (cmp(pivot, array[--len])) {} /* look for smaller element */
        if (right >= len)
          break; /* partition point found? */
        std_iter_swap(array, right, len); /* the only swap */
      } /* partitioned, continue left part */
    }
    if (pos === 0)
      break; /* stack empty? */
    left = len; /* left to right is sorted */
    len = stack[--pos]; /* get next range to sort */
  }

  return array;
};

function std_stable_sort(array: any[], first: number = 0, len: number = array.length - first, cmp: (a: any, b: any) => boolean = default_compare): any[] {
  return std_sort(array, first, len, cmp);
};

function std_remove_if(array: any[], predicate: (value: any) => boolean, length: number = array.length) {
  let l = 0;

  for (let c = 0; c < length; ++c) {
    // if we can be collapsed, keep l where it is.
    if (predicate(array[c]))
      continue;

    // this node can't be collapsed; push it back as far as we can.
    if (c === l) {
      ++l;
      continue; // quick exit if we're already in the right spot
    }

    // array[l++] = array[c];
    std_iter_swap(array, l++, c);
  }

  return l;
};

function std_lower_bound(array: any[], first: number, last: number, val: any, cmp: (a: any, b: any) => boolean = default_compare): number {
  let count = last - first;
  while (count > 0) {
    let step = Math.floor(count / 2);
    let it = first + step;

    if (cmp(array[it], val)) {
      first = ++it;
      count -= step + 1;
    } else
      count = step;
  }
  return first;
};

function std_upper_bound(array: any[], first: number, last: number, val: any, cmp: (a: any, b: any) => boolean = default_compare): number {
  let count = last - first;
  while (count > 0) {
    let step = Math.floor(count / 2);
    let it = first + step;

    if (!cmp(val, array[it])) {
      first = ++it;
      count -= step + 1;
    } else
      count = step;
  }
  return first;
};

function std_rotate(array: any[], first: number, n_first: number, last: number): void {
  let next = n_first;
  while (first !== next) {
    std_iter_swap(array, first++, next++);
    if (next === last)
      next = n_first;
    else if (first === n_first)
      n_first = next;
  }
}

function std_unique(array: any[], first: number, last: number, cmp: (a: any, b: any) => boolean): number {
  if (first === last) {
    return last;
  }
  let result = first;
  while (++first !== last) {
    if (!cmp(array[result], array[first])) {
      ///array[++result] = array[first];
      std_iter_swap(array, ++result, first);
    }
  }
  return ++result;
}

export class b2GrowableBuffer<T> {
  data: T[] = [];
  count: number = 0;
  capacity: number = 0;
  allocator: () => T;

  constructor(allocator: () => T) {
    this.allocator = allocator;
  }

  Append(): number {
    if (this.count >= this.capacity) {
      this.Grow();
    }
    return this.count++;
  }

  Reserve(newCapacity: number): void {
    if (this.capacity >= newCapacity)
      return;

    b2Assert(this.capacity === this.data.length);
    for (let i = this.capacity; i < newCapacity; ++i) {
      this.data[i] = this.allocator();
    }
    this.capacity = newCapacity;
  }

  Grow(): void {
    // Double the capacity.
    let newCapacity = this.capacity ? 2 * this.capacity : b2_minParticleSystemBufferCapacity;
    b2Assert(newCapacity > this.capacity);
    this.Reserve(newCapacity);
  }

  Free(): void {
    if (this.data.length === 0) {
      return;
    }

    this.data = [];
    this.capacity = 0;
    this.count = 0;
  }

  Shorten(newEnd: number): void {
    b2Assert(false);
  }

  Data(): T[] {
    return this.data;
  }

  GetCount(): number {
    return this.count;
  }

  SetCount(newCount: number): void {
    ///b2Assert(0 <= newCount && newCount <= this.capacity);
    this.count = newCount;
  }

  GetCapacity(): number {
    return this.capacity;
  }

  RemoveIf(pred: (t: T) => boolean): void {
    let count = 0;
    for (let i = 0; i < this.count; ++i) {
      if (!pred(this.data[i])) {
        count++;
      }
    }

    this.count = std_remove_if(this.data, pred, this.count);

    b2Assert(count === this.count);
  }

  Unique(pred: (a: T, b: T) => boolean): void {
    this.count = std_unique(this.data, 0, this.count, pred);
  }
}

export type b2ParticleIndex = number;

export class b2FixtureParticleQueryCallback extends b2QueryCallback {
  m_system: b2ParticleSystem;
  constructor(system: b2ParticleSystem) {
    super();
    this.m_system = system;
  }
  ShouldQueryParticleSystem(system: b2ParticleSystem): boolean {
    // Skip reporting particles.
    return false;
  }
  ReportFixture(fixture: b2Fixture): boolean {
    if (fixture.IsSensor()) {
      return true;
    }
    const shape = fixture.GetShape();
    const childCount = shape.GetChildCount();
    for (let childIndex = 0; childIndex < childCount; childIndex++) {
      const aabb = fixture.GetAABB(childIndex);
      const enumerator = this.m_system.GetInsideBoundsEnumerator(aabb);
      let index: number;
      while ((index = enumerator.GetNext()) >= 0) {
        this.ReportFixtureAndParticle(fixture, childIndex, index);
      }
    }
    return true;
  }
  ReportParticle(system: b2ParticleSystem, index: number): boolean {
    return false;
  }
  ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, index: number): void {
    b2Assert(false); // pure virtual
  }
}

export class b2ParticleContact {
  indexA: number = 0;
  indexB: number = 0;
  weight: number = 0;
  normal: b2Vec2 = new b2Vec2();
  flags: b2ParticleFlag = 0;

  SetIndices(a: number, b: number): void {
    b2Assert(a <= b2_maxParticleIndex && b <= b2_maxParticleIndex);
    this.indexA = a;
    this.indexB = b;
  }

  SetWeight(w: number): void {
    this.weight = w;
  }

  SetNormal(n: b2Vec2): void {
    this.normal.Copy(n);
  }

  SetFlags(f: b2ParticleFlag): void {
    this.flags = f;
  }

  GetIndexA(): number {
    return this.indexA;
  }

  GetIndexB(): number {
    return this.indexB;
  }

  GetWeight(): number {
    return this.weight;
  }

  GetNormal(): b2Vec2 {
    return this.normal;
  }

  GetFlags(): b2ParticleFlag {
    return this.flags;
  }

  IsEqual(rhs: b2ParticleContact): boolean {
    return this.indexA === rhs.indexA && this.indexB === rhs.indexB && this.flags === rhs.flags && this.weight === rhs.weight && this.normal.x === rhs.normal.x && this.normal.y === rhs.normal.y;
  }

  IsNotEqual(rhs: b2ParticleContact): boolean {
    return !this.IsEqual(rhs);
  }

  ApproximatelyEqual(rhs: b2ParticleContact): boolean {
    const MAX_WEIGHT_DIFF = 0.01; // Weight 0 ~ 1, so about 1%
    const MAX_NORMAL_DIFF_SQ = 0.01 * 0.01; // Normal length = 1, so 1%
    return this.indexA === rhs.indexA && this.indexB === rhs.indexB && this.flags === rhs.flags && Math.abs(this.weight - rhs.weight) < MAX_WEIGHT_DIFF && b2Vec2.DistanceSquaredVV(this.normal, rhs.normal) < MAX_NORMAL_DIFF_SQ;
  }
}

export class b2ParticleBodyContact {
  index: number = 0; // Index of the particle making contact.
  body: b2Body = null; // The body making contact.
  fixture: b2Fixture = null; // The specific fixture making contact
  weight: number = 0.0; // Weight of the contact. A value between 0.0f and 1.0f.
  normal: b2Vec2 = new b2Vec2(); // The normalized direction from the particle to the body.
  mass: number = 0.0; // The effective mass used in calculating force.
}

export class b2ParticlePair {
  indexA: number = 0; // Indices of the respective particles making pair.
  indexB: number = 0;
  flags: b2ParticleFlag = 0; // The logical sum of the particle flags. See the b2ParticleFlag enum.
  strength: number = 0.0; // The strength of cohesion among the particles.
  distance: number = 0.0; // The initial distance of the particles.
}

export class b2ParticleTriad {
  indexA: number = 0; // Indices of the respective particles making triad.
  indexB: number = 0;
  indexC: number = 0;
  flags: b2ParticleFlag = 0; // The logical sum of the particle flags. See the b2ParticleFlag enum.
  strength: number = 0.0; // The strength of cohesion among the particles.
  pa: b2Vec2 = new b2Vec2(0.0, 0.0); // Values used for calculation.
  pb: b2Vec2 = new b2Vec2(0.0, 0.0);
  pc: b2Vec2 = new b2Vec2(0.0, 0.0);
  ka: number = 0.0;
  kb: number = 0.0;
  kc: number = 0.0;
  s: number = 0.0;
}

export class b2ParticleSystemDef {
  // Initialize physical coefficients to the maximum values that
  // maintain numerical stability.

  /**
   * Enable strict Particle/Body contact check.
   * See SetStrictContactCheck for details.
   */
  strictContactCheck: boolean = false;

  /**
   * Set the particle density.
   * See SetDensity for details.
   */
  density: number = 1.0;

  /**
   * Change the particle gravity scale. Adjusts the effect of the
   * global gravity vector on particles. Default value is 1.0f.
   */
  gravityScale: number = 1.0;

  /**
   * Particles behave as circles with this radius. In Box2D units.
   */
  radius: number = 1.0;

  /**
   * Set the maximum number of particles.
   * By default, there is no maximum. The particle buffers can
   * continue to grow while b2World's block allocator still has
   * memory.
   * See SetMaxParticleCount for details.
   */
  maxCount: number = 0;

  /**
   * Increases pressure in response to compression
   * Smaller values allow more compression
   */
  pressureStrength: number = 0.005;

  /**
   * Reduces velocity along the collision normal
   * Smaller value reduces less
   */
  dampingStrength: number = 1.0;

  /**
   * Restores shape of elastic particle groups
   * Larger values increase elastic particle velocity
   */
  elasticStrength: number = 0.25;

  /**
   * Restores length of spring particle groups
   * Larger values increase spring particle velocity
   */
  springStrength: number = 0.25;

  /**
   * Reduces relative velocity of viscous particles
   * Larger values slow down viscous particles more
   */
  viscousStrength: number = 0.25;

  /**
   * Produces pressure on tensile particles
   * 0~0.2. Larger values increase the amount of surface tension.
   */
  surfaceTensionPressureStrength: number = 0.2;

  /**
   * Smoothes outline of tensile particles
   * 0~0.2. Larger values result in rounder, smoother,
   * water-drop-like clusters of particles.
   */
  surfaceTensionNormalStrength: number = 0.2;

  /**
   * Produces additional pressure on repulsive particles
   * Larger values repulse more
   * Negative values mean attraction. The range where particles
   * behave stably is about -0.2 to 2.0.
   */
  repulsiveStrength: number = 1.0;

  /**
   * Produces repulsion between powder particles
   * Larger values repulse more
   */
  powderStrength: number = 0.5;

  /**
   * Pushes particles out of solid particle group
   * Larger values repulse more
   */
  ejectionStrength: number = 0.5;

  /**
   * Produces static pressure
   * Larger values increase the pressure on neighboring partilces
   * For a description of static pressure, see
   * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
   */
  staticPressureStrength: number = 0.2;

  /**
   * Reduces instability in static pressure calculation
   * Larger values make stabilize static pressure with fewer
   * iterations
   */
  staticPressureRelaxation: number = 0.2;

  /**
   * Computes static pressure more precisely
   * See SetStaticPressureIterations for details
   */
  staticPressureIterations: number = 8;

  /**
   * Determines how fast colors are mixed
   * 1.0f ==> mixed immediately
   * 0.5f ==> mixed half way each simulation step (see
   * b2World::Step())
   */
  colorMixingStrength: number = 0.5;

  /**
   * Whether to destroy particles by age when no more particles
   * can be created.  See #b2ParticleSystem::SetDestructionByAge()
   * for more information.
   */
  destroyByAge: boolean = true;

  /**
   * Granularity of particle lifetimes in seconds.  By default
   * this is set to (1.0f / 60.0f) seconds.  b2ParticleSystem uses
   * a 32-bit signed value to track particle lifetimes so the
   * maximum lifetime of a particle is (2^32 - 1) / (1.0f /
   * lifetimeGranularity) seconds. With the value set to 1/60 the
   * maximum lifetime or age of a particle is 2.27 years.
   */
  lifetimeGranularity: number = 1.0 / 60.0;

  Copy(def: b2ParticleSystemDef): b2ParticleSystemDef {
    this.strictContactCheck = def.strictContactCheck;
    this.density = def.density;
    this.gravityScale = def.gravityScale;
    this.radius = def.radius;
    this.maxCount = def.maxCount;
    this.pressureStrength = def.pressureStrength;
    this.dampingStrength = def.dampingStrength;
    this.elasticStrength = def.elasticStrength;
    this.springStrength = def.springStrength;
    this.viscousStrength = def.viscousStrength;
    this.surfaceTensionPressureStrength = def.surfaceTensionPressureStrength;
    this.surfaceTensionNormalStrength = def.surfaceTensionNormalStrength;
    this.repulsiveStrength = def.repulsiveStrength;
    this.powderStrength = def.powderStrength;
    this.ejectionStrength = def.ejectionStrength;
    this.staticPressureStrength = def.staticPressureStrength;
    this.staticPressureRelaxation = def.staticPressureRelaxation;
    this.staticPressureIterations = def.staticPressureIterations;
    this.colorMixingStrength = def.colorMixingStrength;
    this.destroyByAge = def.destroyByAge;
    this.lifetimeGranularity = def.lifetimeGranularity;
    return this;
  }

  Clone(): b2ParticleSystemDef {
    return new b2ParticleSystemDef().Copy(this);
  }
}

export class b2ParticleSystem {
  m_paused: boolean = false;
  m_timestamp: number = 0;
  m_allParticleFlags: b2ParticleFlag = 0;
  m_needsUpdateAllParticleFlags: boolean = false;
  m_allGroupFlags: b2ParticleGroupFlag = 0;
  m_needsUpdateAllGroupFlags: boolean = false;
  m_hasForce: boolean = false;
  m_iterationIndex: number = 0;
  m_inverseDensity: number = 0.0;
  m_particleDiameter: number = 0.0;
  m_inverseDiameter: number = 0.0;
  m_squaredDiameter: number = 0.0;
  m_count: number = 0;
  m_internalAllocatedCapacity: number = 0;
  /**
   * Allocator for b2ParticleHandle instances.
   */
  ///m_handleAllocator: any = null;
  /**
   * Maps particle indicies to handles.
   */
  m_handleIndexBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleHandle> = new b2ParticleSystem.UserOverridableBuffer<b2ParticleHandle>();
  m_flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag> = new b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>();
  m_positionBuffer: b2ParticleSystem.UserOverridableBuffer<b2Vec2> = new b2ParticleSystem.UserOverridableBuffer<b2Vec2>();
  m_velocityBuffer: b2ParticleSystem.UserOverridableBuffer<b2Vec2> = new b2ParticleSystem.UserOverridableBuffer<b2Vec2>();
  m_forceBuffer: b2Vec2[] = [];
  /**
   * this.m_weightBuffer is populated in ComputeWeight and used in
   * ComputeDepth(), SolveStaticPressure() and SolvePressure().
   */
  m_weightBuffer: number[] = [];
  /**
   * When any particles have the flag b2_staticPressureParticle,
   * this.m_staticPressureBuffer is first allocated and used in
   * SolveStaticPressure() and SolvePressure().  It will be
   * reallocated on subsequent CreateParticle() calls.
   */
  m_staticPressureBuffer: number[] = [];
  /**
   * this.m_accumulationBuffer is used in many functions as a temporary
   * buffer for scalar values.
   */
  m_accumulationBuffer: number[] = [];
  /**
   * When any particles have the flag b2_tensileParticle,
   * this.m_accumulation2Buffer is first allocated and used in
   * SolveTensile() as a temporary buffer for vector values.  It
   * will be reallocated on subsequent CreateParticle() calls.
   */
  m_accumulation2Buffer: b2Vec2[] = [];
  /**
   * When any particle groups have the flag b2_solidParticleGroup,
   * this.m_depthBuffer is first allocated and populated in
   * ComputeDepth() and used in SolveSolid(). It will be
   * reallocated on subsequent CreateParticle() calls.
   */
  m_depthBuffer: number[] = [];
  m_colorBuffer: b2ParticleSystem.UserOverridableBuffer<b2Color> = new b2ParticleSystem.UserOverridableBuffer<b2Color>();
  m_groupBuffer: b2ParticleGroup[] = [];
  m_userDataBuffer: b2ParticleSystem.UserOverridableBuffer<any> = new b2ParticleSystem.UserOverridableBuffer();
  /**
   * Stuck particle detection parameters and record keeping
   */
  m_stuckThreshold: number = 0;
  m_lastBodyContactStepBuffer: b2ParticleSystem.UserOverridableBuffer<number> = new b2ParticleSystem.UserOverridableBuffer<number>();
  m_bodyContactCountBuffer: b2ParticleSystem.UserOverridableBuffer<number> = new b2ParticleSystem.UserOverridableBuffer<number>();
  m_consecutiveContactStepsBuffer: b2ParticleSystem.UserOverridableBuffer<number> = new b2ParticleSystem.UserOverridableBuffer<number>();
  m_stuckParticleBuffer: b2GrowableBuffer<number> = new b2GrowableBuffer<number>(function() { return 0; });
  m_proxyBuffer: b2GrowableBuffer<b2ParticleSystem.Proxy> = new b2GrowableBuffer<b2ParticleSystem.Proxy>(function() { return new b2ParticleSystem.Proxy(); });
  m_contactBuffer: b2GrowableBuffer<b2ParticleContact> = new b2GrowableBuffer<b2ParticleContact>(function() { return new b2ParticleContact(); });
  m_bodyContactBuffer: b2GrowableBuffer<b2ParticleBodyContact> = new b2GrowableBuffer<b2ParticleBodyContact>(function() { return new b2ParticleBodyContact(); });
  m_pairBuffer: b2GrowableBuffer<b2ParticlePair> = new b2GrowableBuffer<b2ParticlePair>(function() { return new b2ParticlePair(); });
  m_triadBuffer: b2GrowableBuffer<b2ParticleTriad> = new b2GrowableBuffer<b2ParticleTriad>(function() { return new b2ParticleTriad(); });
  /**
   * Time each particle should be destroyed relative to the last
   * time this.m_timeElapsed was initialized.  Each unit of time
   * corresponds to b2ParticleSystemDef::lifetimeGranularity
   * seconds.
   */
  m_expirationTimeBuffer: b2ParticleSystem.UserOverridableBuffer<number> = new b2ParticleSystem.UserOverridableBuffer<number>();
  /**
   * List of particle indices sorted by expiration time.
   */
  m_indexByExpirationTimeBuffer: b2ParticleSystem.UserOverridableBuffer<number> = new b2ParticleSystem.UserOverridableBuffer<number>();
  /**
   * Time elapsed in 32:32 fixed point.  Each non-fractional unit
   * of time corresponds to
   * b2ParticleSystemDef::lifetimeGranularity seconds.
   */
  m_timeElapsed: number = 0;
  /**
   * Whether the expiration time buffer has been modified and
   * needs to be resorted.
   */
  m_expirationTimeBufferRequiresSorting: boolean = false;
  m_groupCount: number = 0;
  m_groupList: b2ParticleGroup = null;
  m_def: b2ParticleSystemDef = new b2ParticleSystemDef();
  m_world: b2World = null;
  m_prev: b2ParticleSystem = null;
  m_next: b2ParticleSystem = null;

  static xTruncBits: number = 12;
  static yTruncBits: number = 12;
  static tagBits: number = 8 * 4; // 8u * sizeof(uint32);
  static yOffset: number = 1 << (b2ParticleSystem.yTruncBits - 1);
  static yShift: number = b2ParticleSystem.tagBits - b2ParticleSystem.yTruncBits;
  static xShift: number = b2ParticleSystem.tagBits - b2ParticleSystem.yTruncBits - b2ParticleSystem.xTruncBits;
  static xScale: number = 1 << b2ParticleSystem.xShift;
  static xOffset: number = b2ParticleSystem.xScale * (1 << (b2ParticleSystem.xTruncBits - 1));
  static yMask: number = ((1 << b2ParticleSystem.yTruncBits) - 1) << b2ParticleSystem.yShift;
  static xMask: number = ~b2ParticleSystem.yMask;

  static computeTag(x: number, y: number): number {
    ///return ((uint32)(y + yOffset) << yShift) + (uint32)(xScale * x + xOffset);
    return ((((y + b2ParticleSystem.yOffset) >>> 0) << b2ParticleSystem.yShift) + ((b2ParticleSystem.xScale * x + b2ParticleSystem.xOffset) >>> 0)) >>> 0;
  }

  static computeRelativeTag(tag: number, x: number, y: number): number {
    ///return tag + (y << yShift) + (x << xShift);
    return (tag + (y << b2ParticleSystem.yShift) + (x << b2ParticleSystem.xShift)) >>> 0;
  }

  constructor(def: b2ParticleSystemDef, world: b2World) {
    this.SetStrictContactCheck(def.strictContactCheck);
    this.SetDensity(def.density);
    this.SetGravityScale(def.gravityScale);
    this.SetRadius(def.radius);
    this.SetMaxParticleCount(def.maxCount);
    b2Assert(def.lifetimeGranularity > 0.0);
    this.m_def = def.Clone();
    this.m_world = world;
    this.SetDestructionByAge(this.m_def.destroyByAge);
  }

  Drop(): void {
    while (this.m_groupList) {
      this.DestroyParticleGroup(this.m_groupList);
    }

    this.FreeUserOverridableBuffer(this.m_handleIndexBuffer);
    this.FreeUserOverridableBuffer(this.m_flagsBuffer);
    this.FreeUserOverridableBuffer(this.m_lastBodyContactStepBuffer);
    this.FreeUserOverridableBuffer(this.m_bodyContactCountBuffer);
    this.FreeUserOverridableBuffer(this.m_consecutiveContactStepsBuffer);
    this.FreeUserOverridableBuffer(this.m_positionBuffer);
    this.FreeUserOverridableBuffer(this.m_velocityBuffer);
    this.FreeUserOverridableBuffer(this.m_colorBuffer);
    this.FreeUserOverridableBuffer(this.m_userDataBuffer);
    this.FreeUserOverridableBuffer(this.m_expirationTimeBuffer);
    this.FreeUserOverridableBuffer(this.m_indexByExpirationTimeBuffer);
    this.FreeBuffer(this.m_forceBuffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_weightBuffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_staticPressureBuffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_accumulationBuffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_accumulation2Buffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_depthBuffer, this.m_internalAllocatedCapacity);
    this.FreeBuffer(this.m_groupBuffer, this.m_internalAllocatedCapacity);
  }

  /**
   * Create a particle whose properties have been defined.
   *
   * No reference to the definition is retained.
   *
   * A simulation step must occur before it's possible to interact
   * with a newly created particle.  For example,
   * DestroyParticleInShape() will not destroy a particle until
   * b2World::Step() has been called.
   *
   * warning: This function is locked during callbacks.
   */
  CreateParticle(def: b2ParticleDef): number {
    b2Assert(this.m_world.IsLocked() === false);
    if (this.m_world.IsLocked()) {
      return 0;
    }

    if (this.m_count >= this.m_internalAllocatedCapacity) {
      // Double the particle capacity.
      let capacity = this.m_count ? 2 * this.m_count : b2_minParticleSystemBufferCapacity;
      this.ReallocateInternalAllocatedBuffers(capacity);
    }
    if (this.m_count >= this.m_internalAllocatedCapacity) {
      // If the oldest particle should be destroyed...
      if (this.m_def.destroyByAge) {
        this.DestroyOldestParticle(0, false);
        // Need to destroy this particle *now* so that it's possible to
        // create a new particle.
        this.SolveZombie();
      } else {
        return b2_invalidParticleIndex;
      }
    }
    let index = this.m_count++;
    this.m_flagsBuffer.data[index] = 0;
    if (this.m_lastBodyContactStepBuffer.data) {
      this.m_lastBodyContactStepBuffer.data[index] = 0;
    }
    if (this.m_bodyContactCountBuffer.data) {
      this.m_bodyContactCountBuffer.data[index] = 0;
    }
    if (this.m_consecutiveContactStepsBuffer.data) {
      this.m_consecutiveContactStepsBuffer.data[index] = 0;
    }
    this.m_positionBuffer.data[index] = (this.m_positionBuffer.data[index] || new b2Vec2()).Copy(def.position);
    this.m_velocityBuffer.data[index] = (this.m_velocityBuffer.data[index] || new b2Vec2()).Copy(def.velocity);
    this.m_weightBuffer[index] = 0;
    this.m_forceBuffer[index] = (this.m_forceBuffer[index] || new b2Vec2()).SetZero();
    if (this.m_staticPressureBuffer) {
      this.m_staticPressureBuffer[index] = 0;
    }
    if (this.m_depthBuffer) {
      this.m_depthBuffer[index] = 0;
    }
    if (this.m_colorBuffer.data || !def.color.IsZero()) {
      this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
      this.m_colorBuffer.data[index] = (this.m_colorBuffer.data[index] || new b2Color()).Copy(def.color);
    }
    if (this.m_userDataBuffer.data || def.userData) {
      this.m_userDataBuffer.data = this.RequestBuffer(this.m_userDataBuffer.data);
      this.m_userDataBuffer.data[index] = def.userData;
    }
    if (this.m_handleIndexBuffer.data) {
      this.m_handleIndexBuffer.data[index] = null;
    }
    ///Proxy& proxy = m_proxyBuffer.Append();
    let proxy = this.m_proxyBuffer.data[this.m_proxyBuffer.Append()];

    // If particle lifetimes are enabled or the lifetime is set in the particle
    // definition, initialize the lifetime.
    let finiteLifetime = def.lifetime > 0.0;
    if (this.m_expirationTimeBuffer.data || finiteLifetime) {
      this.SetParticleLifetime(index, finiteLifetime ? def.lifetime :
        this.ExpirationTimeToLifetime(-this.GetQuantizedTimeElapsed()));
      // Add a reference to the newly added particle to the end of the
      // queue.
      this.m_indexByExpirationTimeBuffer.data[index] = index;
    }

    proxy.index = index;
    let group = def.group;
    this.m_groupBuffer[index] = group;
    if (group) {
      if (group.m_firstIndex < group.m_lastIndex) {
        // Move particles in the group just before the new particle.
        this.RotateBuffer(group.m_firstIndex, group.m_lastIndex, index);
        b2Assert(group.m_lastIndex === index);
        // Update the index range of the group to contain the new particle.
        group.m_lastIndex = index + 1;
      } else {
        // If the group is empty, reset the index range to contain only the
        // new particle.
        group.m_firstIndex = index;
        group.m_lastIndex = index + 1;
      }
    }
    this.SetParticleFlags(index, def.flags);
    return index;
  }

  /**
   * Retrieve a handle to the particle at the specified index.
   *
   * Please see #b2ParticleHandle for why you might want a handle.
   */
  GetParticleHandleFromIndex(index: number): b2ParticleHandle {
    b2Assert(index >= 0 && index < this.GetParticleCount() && index !== b2_invalidParticleIndex);
    this.m_handleIndexBuffer.data = this.RequestBuffer(this.m_handleIndexBuffer.data);
    let handle = this.m_handleIndexBuffer.data[index];
    if (handle) {
      return handle;
    }
    // Create a handle.
    ///handle = m_handleAllocator.Allocate();
    handle = new b2ParticleHandle();
    b2Assert(handle !== null);
    handle.SetIndex(index);
    this.m_handleIndexBuffer.data[index] = handle;
    return handle;
  }

  /**
   * Destroy a particle.
   *
   * The particle is removed after the next simulation step (see
   * b2World::Step()).
   *
   * @param index Index of the particle to destroy.
   * @param callDestructionListener Whether to call the
   *      destruction listener just before the particle is
   *      destroyed.
   */
  DestroyParticle(index: number, callDestructionListener: boolean = false): void {
    let flags = b2ParticleFlag.b2_zombieParticle;
    if (callDestructionListener) {
      flags |= b2ParticleFlag.b2_destructionListenerParticle;
    }
    this.SetParticleFlags(index, this.m_flagsBuffer.data[index] | flags);
  }

  /**
   * Destroy the Nth oldest particle in the system.
   *
   * The particle is removed after the next b2World::Step().
   *
   * @param index Index of the Nth oldest particle to
   *      destroy, 0 will destroy the oldest particle in the
   *      system, 1 will destroy the next oldest particle etc.
   * @param callDestructionListener Whether to call the
   *      destruction listener just before the particle is
   *      destroyed.
   */
  DestroyOldestParticle(index: number, callDestructionListener: boolean = false): void {
    const particleCount = this.GetParticleCount();
    b2Assert(index >= 0 && index < particleCount);
    // Make sure particle lifetime tracking is enabled.
    b2Assert(this.m_indexByExpirationTimeBuffer.data !== null);
    // Destroy the oldest particle (preferring to destroy finite
    // lifetime particles first) to free a slot in the buffer.
    const oldestFiniteLifetimeParticle =
      this.m_indexByExpirationTimeBuffer.data[particleCount - (index + 1)];
    const oldestInfiniteLifetimeParticle =
      this.m_indexByExpirationTimeBuffer.data[index];
    this.DestroyParticle(
      this.m_expirationTimeBuffer.data[oldestFiniteLifetimeParticle] > 0.0 ?
      oldestFiniteLifetimeParticle : oldestInfiniteLifetimeParticle,
      callDestructionListener);
  }

  /**
   * Destroy particles inside a shape.
   *
   * warning: This function is locked during callbacks.
   *
   * In addition, this function immediately destroys particles in
   * the shape in constrast to DestroyParticle() which defers the
   * destruction until the next simulation step.
   *
   * @return Number of particles destroyed.
   * @param shape Shape which encloses particles
   *      that should be destroyed.
   * @param xf Transform applied to the shape.
   * @param callDestructionListener Whether to call the
   *      world b2DestructionListener for each particle
   *      destroyed.
   */
  DestroyParticlesInShape(shape: b2Shape, xf: b2Transform, callDestructionListener: boolean = false): number {
    const s_aabb = b2ParticleSystem.DestroyParticlesInShape_s_aabb;
    b2Assert(this.m_world.IsLocked() === false);
    if (this.m_world.IsLocked()) {
      return 0;
    }

    const callback = new b2ParticleSystem.DestroyParticlesInShapeCallback(this, shape, xf, callDestructionListener);

    const aabb = s_aabb;
    shape.ComputeAABB(aabb, xf, 0);
    this.m_world.QueryAABB(callback, aabb);
    return callback.Destroyed();
  }
  static DestroyParticlesInShape_s_aabb = new b2AABB();

  /**
   * Create a particle group whose properties have been defined.
   *
   * No reference to the definition is retained.
   *
   * warning: This function is locked during callbacks.
   */
  CreateParticleGroup(groupDef: b2ParticleGroupDef): b2ParticleGroup {
    let s_transform = b2ParticleSystem.CreateParticleGroup_s_transform;

    b2Assert(this.m_world.IsLocked() === false);
    if (this.m_world.IsLocked()) {
      return null;
    }

    let transform = s_transform;
    transform.SetPositionAngle(groupDef.position, groupDef.angle);
    let firstIndex = this.m_count;
    if (groupDef.shape) {
      this.CreateParticlesWithShapeForGroup(groupDef.shape, groupDef, transform);
    }
    if (groupDef.shapes) {
      this.CreateParticlesWithShapesForGroup(groupDef.shapes, groupDef.shapeCount, groupDef, transform);
    }
    if (groupDef.particleCount) {
      b2Assert(groupDef.positionData !== null);
      for (let i = 0; i < groupDef.particleCount; i++) {
        let p = groupDef.positionData[i];
        this.CreateParticleForGroup(groupDef, transform, p);
      }
    }
    let lastIndex = this.m_count;

    let group = new b2ParticleGroup();
    group.m_system = this;
    group.m_firstIndex = firstIndex;
    group.m_lastIndex = lastIndex;
    group.m_strength = groupDef.strength;
    group.m_userData = groupDef.userData;
    group.m_transform.Copy(transform);
    group.m_prev = null;
    group.m_next = this.m_groupList;
    if (this.m_groupList) {
      this.m_groupList.m_prev = group;
    }
    this.m_groupList = group;
    ++this.m_groupCount;
    for (let i = firstIndex; i < lastIndex; i++) {
      this.m_groupBuffer[i] = group;
    }
    this.SetGroupFlags(group, groupDef.groupFlags);

    // Create pairs and triads between particles in the group.
    let filter = new b2ParticleSystem.ConnectionFilter();
    this.UpdateContacts(true);
    this.UpdatePairsAndTriads(firstIndex, lastIndex, filter);

    if (groupDef.group) {
      this.JoinParticleGroups(groupDef.group, group);
      group = groupDef.group;
    }

    return group;
  }
  static CreateParticleGroup_s_transform = new b2Transform();

  /**
   * Join two particle groups.
   *
   * warning: This function is locked during callbacks.
   *
   * @param groupA the first group. Expands to encompass the second group.
   * @param groupB the second group. It is destroyed.
   */
  JoinParticleGroups(groupA: b2ParticleGroup, groupB: b2ParticleGroup): void {
    b2Assert(this.m_world.IsLocked() === false);
    if (this.m_world.IsLocked()) {
      return;
    }

    b2Assert(groupA !== groupB);
    this.RotateBuffer(groupB.m_firstIndex, groupB.m_lastIndex, this.m_count);
    b2Assert(groupB.m_lastIndex === this.m_count);
    this.RotateBuffer(groupA.m_firstIndex, groupA.m_lastIndex, groupB.m_firstIndex);
    b2Assert(groupA.m_lastIndex === groupB.m_firstIndex);

    // Create pairs and triads connecting groupA and groupB.
    let filter = new b2ParticleSystem.JoinParticleGroupsFilter(groupB.m_firstIndex);
    this.UpdateContacts(true);
    this.UpdatePairsAndTriads(groupA.m_firstIndex, groupB.m_lastIndex, filter);

    for (let i = groupB.m_firstIndex; i < groupB.m_lastIndex; i++) {
      this.m_groupBuffer[i] = groupA;
    }
    let groupFlags = groupA.m_groupFlags | groupB.m_groupFlags;
    this.SetGroupFlags(groupA, groupFlags);
    groupA.m_lastIndex = groupB.m_lastIndex;
    groupB.m_firstIndex = groupB.m_lastIndex;
    this.DestroyParticleGroup(groupB);
  }

  /**
   * Split particle group into multiple disconnected groups.
   *
   * warning: This function is locked during callbacks.
   *
   * @param group the group to be split.
   */
  SplitParticleGroup(group: b2ParticleGroup): void {
    this.UpdateContacts(true);
    let particleCount = group.GetParticleCount();
    // We create several linked lists. Each list represents a set of connected particles.
    ///ParticleListNode* nodeBuffer = (ParticleListNode*) m_world.m_stackAllocator.Allocate(sizeof(ParticleListNode) * particleCount);
    let nodeBuffer = b2MakeArray(particleCount, function(index) {
      return new b2ParticleSystem.ParticleListNode();
    });
    b2ParticleSystem.InitializeParticleLists(group, nodeBuffer);
    this.MergeParticleListsInContact(group, nodeBuffer);
    let survivingList = b2ParticleSystem.FindLongestParticleList(group, nodeBuffer);
    this.MergeZombieParticleListNodes(group, nodeBuffer, survivingList);
    this.CreateParticleGroupsFromParticleList(group, nodeBuffer, survivingList);
    this.UpdatePairsAndTriadsWithParticleList(group, nodeBuffer);
    ///this.m_world.m_stackAllocator.Free(nodeBuffer);
  }

  /**
   * Get the world particle group list. With the returned group,
   * use b2ParticleGroup::GetNext to get the next group in the
   * world list.
   *
   * A null group indicates the end of the list.
   *
   * @return the head of the world particle group list.
   */
  GetParticleGroupList(): b2ParticleGroup {
    return this.m_groupList;
  }

  /**
   * Get the number of particle groups.
   */
  GetParticleGroupCount(): number {
    return this.m_groupCount;
  }

  /**
   * Get the number of particles.
   */
  GetParticleCount(): number {
    return this.m_count;
  }

  /**
   * Get the maximum number of particles.
   */
  GetMaxParticleCount(): number {
    return this.m_def.maxCount;
  }

  /**
   * Set the maximum number of particles.
   *
   * A value of 0 means there is no maximum. The particle buffers
   * can continue to grow while b2World's block allocator still
   * has memory.
   *
   * Note: If you try to CreateParticle() with more than this
   * count, b2_invalidParticleIndex is returned unless
   * SetDestructionByAge() is used to enable the destruction of
   * the oldest particles in the system.
   */
  SetMaxParticleCount(count: number): void {
    b2Assert(this.m_count <= count);
    this.m_def.maxCount = count;
  }

  /**
   * Get all existing particle flags.
   */
  GetAllParticleFlags(): b2ParticleFlag {
    return this.m_allParticleFlags;
  }

  /**
   * Get all existing particle group flags.
   */
  GetAllGroupFlags(): b2ParticleGroupFlag {
    return this.m_allGroupFlags;
  }

  /**
   * Pause or unpause the particle system. When paused,
   * b2World::Step() skips over this particle system. All
   * b2ParticleSystem function calls still work.
   *
   * @param paused paused is true to pause, false to un-pause.
   */
  SetPaused(paused: boolean): void {
    this.m_paused = paused;
  }

  /**
   * Initially, true, then, the last value passed into
   * SetPaused().
   *
   * @return true if the particle system is being updated in b2World::Step().
   */
  GetPaused(): boolean {
    return this.m_paused;
  }

  /**
   * Change the particle density.
   *
   * Particle density affects the mass of the particles, which in
   * turn affects how the particles interact with b2Bodies. Note
   * that the density does not affect how the particles interact
   * with each other.
   */
  SetDensity(density: number): void {
    this.m_def.density = density;
    this.m_inverseDensity = 1 / this.m_def.density;
  }

  /**
   * Get the particle density.
   */
  GetDensity(): number {
    return this.m_def.density;
  }

  /**
   * Change the particle gravity scale. Adjusts the effect of the
   * global gravity vector on particles.
   */
  SetGravityScale(gravityScale: number): void {
    this.m_def.gravityScale = gravityScale;
  }


  /**
   * Get the particle gravity scale.
   */
  GetGravityScale(): number {
    return this.m_def.gravityScale;
  }

  /**
   * Damping is used to reduce the velocity of particles. The
   * damping parameter can be larger than 1.0f but the damping
   * effect becomes sensitive to the time step when the damping
   * parameter is large.
   */
  SetDamping(damping: number): void {
    this.m_def.dampingStrength = damping;
  }

  /**
   * Get damping for particles
   */
  GetDamping(): number {
    return this.m_def.dampingStrength;
  }

  /**
   * Change the number of iterations when calculating the static
   * pressure of particles. By default, 8 iterations. You can
   * reduce the number of iterations down to 1 in some situations,
   * but this may cause instabilities when many particles come
   * together. If you see particles popping away from each other
   * like popcorn, you may have to increase the number of
   * iterations.
   *
   * For a description of static pressure, see
   * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
   */
  SetStaticPressureIterations(iterations: number): void {
    this.m_def.staticPressureIterations = iterations;
  }

  /**
   * Get the number of iterations for static pressure of
   * particles.
   */
  GetStaticPressureIterations(): number {
    return this.m_def.staticPressureIterations;
  }

  /**
   * Change the particle radius.
   *
   * You should set this only once, on world start.
   * If you change the radius during execution, existing particles
   * may explode, shrink, or behave unexpectedly.
   */
  SetRadius(radius: number): void {
    this.m_particleDiameter = 2 * radius;
    this.m_squaredDiameter = this.m_particleDiameter * this.m_particleDiameter;
    this.m_inverseDiameter = 1 / this.m_particleDiameter;
  }

  /**
   * Get the particle radius.
   */
  GetRadius(): number {
    return this.m_particleDiameter / 2;
  }

  /**
   * Get the position of each particle
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle positions array.
   */
  GetPositionBuffer(): b2Vec2[] {
    return this.m_positionBuffer.data;
  }

  /**
   * Get the velocity of each particle
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle velocities array.
   */
  GetVelocityBuffer(): b2Vec2[] {
    return this.m_velocityBuffer.data;
  }

  /**
   * Get the color of each particle
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle colors array.
   */
  GetColorBuffer(): b2Color[] {
    this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
    return this.m_colorBuffer.data;
  }

  /**
   * Get the particle-group of each particle.
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle group array.
   */
  GetGroupBuffer(): b2ParticleGroup[] {
    return this.m_groupBuffer;
  }

  /**
   * Get the weight of each particle
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle positions array.
   */
  GetWeightBuffer(): number[] {
    return this.m_weightBuffer;
  }

  /**
   * Get the user-specified data of each particle.
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle user-data array.
   */
  GetUserDataBuffer(): any[] {
    this.m_userDataBuffer.data = this.RequestBuffer(this.m_userDataBuffer.data);
    return this.m_userDataBuffer.data;
  }

  /**
   * Get the flags for each particle. See the b2ParticleFlag enum.
   *
   * Array is length GetParticleCount()
   *
   * @return the pointer to the head of the particle-flags array.
   */
  GetFlagsBuffer(): b2ParticleFlag[] {
    return this.m_flagsBuffer.data;
  }

  /**
   * Set flags for a particle. See the b2ParticleFlag enum.
   */
  SetParticleFlags(index: number, newFlags: b2ParticleFlag): void {
    let oldFlags = this.m_flagsBuffer.data[index];
    if (oldFlags & ~newFlags) {
      // If any flags might be removed
      this.m_needsUpdateAllParticleFlags = true;
    }
    if (~this.m_allParticleFlags & newFlags) {
      // If any flags were added
      if (newFlags & b2ParticleFlag.b2_tensileParticle) {
        this.m_accumulation2Buffer = this.RequestBuffer(this.m_accumulation2Buffer);
      }
      if (newFlags & b2ParticleFlag.b2_colorMixingParticle) {
        this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
      }
      this.m_allParticleFlags |= newFlags;
    }
    this.m_flagsBuffer.data[index] = newFlags;
  }

  /**
   * Get flags for a particle. See the b2ParticleFlag enum.
   */
  GetParticleFlags(index: number): b2ParticleFlag {
    return this.m_flagsBuffer.data[index];
  }

  /**
   * Set an external buffer for particle data.
   *
   * Normally, the b2World's block allocator is used for particle
   * data. However, sometimes you may have an OpenGL or Java
   * buffer for particle data. To avoid data duplication, you may
   * supply this external buffer.
   *
   * Note that, when b2World's block allocator is used, the
   * particle data buffers can grow as required. However, when
   * external buffers are used, the maximum number of particles is
   * clamped to the size of the smallest external buffer.
   *
   * @param buffer a pointer to a block of memory.
   * @param capacity the number of values in the block.
   */
  SetFlagsBuffer(buffer: b2ParticleFlag[], capacity: number): void {
    this.SetUserOverridableBuffer(this.m_flagsBuffer, buffer, capacity);
  }

  SetPositionBuffer(buffer: b2Vec2[], capacity: number): void {
    ///if (buffer instanceof Float32Array) {
    ///let array = [];
    ///for (let i = 0; i < capacity; ++i) {
    ///  array[i] = new b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
    ///}
    ///this.SetUserOverridableBuffer(this.m_positionBuffer, array, capacity);
    ///} else {
      this.SetUserOverridableBuffer(this.m_positionBuffer, buffer, capacity);
    ///}
  }

  SetVelocityBuffer(buffer: b2Vec2[], capacity: number): void {
    ///if (buffer instanceof Float32Array) {
    ///let array = [];
    ///for (let i = 0; i < capacity; ++i) {
    ///  array[i] = new b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
    ///}
    ///this.SetUserOverridableBuffer(this.m_velocityBuffer, array, capacity);
    ///} else {
      this.SetUserOverridableBuffer(this.m_velocityBuffer, buffer, capacity);
    ///}
  }

  SetColorBuffer(buffer: b2Color[], capacity: number): void {
    ///if (buffer instanceof Uint8Array) {
    ///let array: b2Color[] = [];
    ///for (let i = 0; i < capacity; ++i) {
    ///  array[i] = new b2Color(buffer.subarray(i * 4, i * 4 + 4));
    ///}
    ///this.SetUserOverridableBuffer(this.m_colorBuffer, array, capacity);
    ///} else {
      this.SetUserOverridableBuffer(this.m_colorBuffer, buffer, capacity);
    ///}
  }

  SetUserDataBuffer(buffer: any[], capacity: number): void {
    this.SetUserOverridableBuffer(this.m_userDataBuffer, buffer, capacity);
  }

  /**
   * Get contacts between particles
   * Contact data can be used for many reasons, for example to
   * trigger rendering or audio effects.
   */
  GetContacts(): b2ParticleContact[] {
    return this.m_contactBuffer.data;
  }

  GetContactCount(): number {
    return this.m_contactBuffer.count;
  }

  /**
   * Get contacts between particles and bodies
   *
   * Contact data can be used for many reasons, for example to
   * trigger rendering or audio effects.
   */
  GetBodyContacts(): b2ParticleBodyContact[] {
    return this.m_bodyContactBuffer.data;
  }

  GetBodyContactCount(): number {
    return this.m_bodyContactBuffer.count;
  }

  /**
   * Get array of particle pairs. The particles in a pair:
   *   (1) are contacting,
   *   (2) are in the same particle group,
   *   (3) are part of a rigid particle group, or are spring, elastic,
   *       or wall particles.
   *   (4) have at least one particle that is a spring or barrier
   *       particle (i.e. one of the types in k_pairFlags),
   *   (5) have at least one particle that returns true for
   *       ConnectionFilter::IsNecessary,
   *   (6) are not zombie particles.
   *
   * Essentially, this is an array of spring or barrier particles
   * that are interacting. The array is sorted by b2ParticlePair's
   * indexA, and then indexB. There are no duplicate entries.
   */
  GetPairs(): b2ParticlePair[] {
    return this.m_pairBuffer.data;
  }

  GetPairCount(): number {
    return this.m_pairBuffer.count;
  }

  /**
   * Get array of particle triads. The particles in a triad:
   *   (1) are in the same particle group,
   *   (2) are in a Voronoi triangle together,
   *   (3) are within b2_maxTriadDistance particle diameters of each
   *       other,
   *   (4) return true for ConnectionFilter::ShouldCreateTriad
   *   (5) have at least one particle of type elastic (i.e. one of the
   *       types in k_triadFlags),
   *   (6) are part of a rigid particle group, or are spring, elastic,
   *       or wall particles.
   *   (7) are not zombie particles.
   *
   * Essentially, this is an array of elastic particles that are
   * interacting. The array is sorted by b2ParticleTriad's indexA,
   * then indexB, then indexC. There are no duplicate entries.
   */
  GetTriads(): b2ParticleTriad[] {
    return this.m_triadBuffer.data;
  }

  GetTriadCount(): number {
    return this.m_triadBuffer.count;
  }

  /**
   * Set an optional threshold for the maximum number of
   * consecutive particle iterations that a particle may contact
   * multiple bodies before it is considered a candidate for being
   * "stuck". Setting to zero or less disables.
   */
  SetStuckThreshold(steps: number): void {
    this.m_stuckThreshold = steps;

    if (steps > 0) {
      this.m_lastBodyContactStepBuffer.data = this.RequestBuffer(this.m_lastBodyContactStepBuffer.data);
      this.m_bodyContactCountBuffer.data = this.RequestBuffer(this.m_bodyContactCountBuffer.data);
      this.m_consecutiveContactStepsBuffer.data = this.RequestBuffer(this.m_consecutiveContactStepsBuffer.data);
    }
  }

  /**
   * Get potentially stuck particles from the last step; the user
   * must decide if they are stuck or not, and if so, delete or
   * move them
   */
  GetStuckCandidates(): number[] {
    ///return m_stuckParticleBuffer.Data();
    return this.m_stuckParticleBuffer.Data();
  }

  /**
   * Get the number of stuck particle candidates from the last
   * step.
   */
  GetStuckCandidateCount(): number {
    ///return m_stuckParticleBuffer.GetCount();
    return this.m_stuckParticleBuffer.GetCount();
  }

  /**
   * Compute the kinetic energy that can be lost by damping force
   */
  ComputeCollisionEnergy(): number {
    let s_v = b2ParticleSystem.ComputeCollisionEnergy_s_v;
    let vel_data = this.m_velocityBuffer.data;
    let sum_v2 = 0;
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let n = contact.normal;
      ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
      let v = b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
      let vn = b2Vec2.DotVV(v, n);
      if (vn < 0) {
        sum_v2 += vn * vn;
      }
    }
    return 0.5 * this.GetParticleMass() * sum_v2;
  }
  static ComputeCollisionEnergy_s_v = new b2Vec2();

  /**
   * Set strict Particle/Body contact check.
   *
   * This is an option that will help ensure correct behavior if
   * there are corners in the world model where Particle/Body
   * contact is ambiguous. This option scales at n*log(n) of the
   * number of Particle/Body contacts, so it is best to only
   * enable if it is necessary for your geometry. Enable if you
   * see strange particle behavior around b2Body intersections.
   */
  SetStrictContactCheck(enabled: boolean): void {
    this.m_def.strictContactCheck = enabled;
  }

  /**
   * Get the status of the strict contact check.
   */
  GetStrictContactCheck(): boolean {
    return this.m_def.strictContactCheck;
  }

  /**
   * Set the lifetime (in seconds) of a particle relative to the
   * current time.  A lifetime of less than or equal to 0.0f
   * results in the particle living forever until it's manually
   * destroyed by the application.
   */
  SetParticleLifetime(index: number, lifetime: number): void {
    b2Assert(this.ValidateParticleIndex(index));
    let initializeExpirationTimes = this.m_indexByExpirationTimeBuffer.data === null;
    this.m_expirationTimeBuffer.data = this.RequestBuffer(this.m_expirationTimeBuffer.data);
    this.m_indexByExpirationTimeBuffer.data = this.RequestBuffer(this.m_indexByExpirationTimeBuffer.data);

    // Initialize the inverse mapping buffer.
    if (initializeExpirationTimes) {
      let particleCount = this.GetParticleCount();
      for (let i = 0; i < particleCount; ++i) {
        this.m_indexByExpirationTimeBuffer.data[i] = i;
      }
    }
    ///const int32 quantizedLifetime = (int32)(lifetime / m_def.lifetimeGranularity);
    let quantizedLifetime = lifetime / this.m_def.lifetimeGranularity;
    // Use a negative lifetime so that it's possible to track which
    // of the infinite lifetime particles are older.
    let newExpirationTime = quantizedLifetime > 0.0 ? this.GetQuantizedTimeElapsed() + quantizedLifetime : quantizedLifetime;
    if (newExpirationTime !== this.m_expirationTimeBuffer.data[index]) {
      this.m_expirationTimeBuffer.data[index] = newExpirationTime;
      this.m_expirationTimeBufferRequiresSorting = true;
    }
  }

  /**
   * Get the lifetime (in seconds) of a particle relative to the
   * current time.  A value > 0.0f is returned if the particle is
   * scheduled to be destroyed in the future, values <= 0.0f
   * indicate the particle has an infinite lifetime.
   */
  GetParticleLifetime(index: number): number {
    b2Assert(this.ValidateParticleIndex(index));
    return this.ExpirationTimeToLifetime(this.GetExpirationTimeBuffer()[index]);
  }

  /**
   * Enable / disable destruction of particles in CreateParticle()
   * when no more particles can be created due to a prior call to
   * SetMaxParticleCount().  When this is enabled, the oldest
   * particle is destroyed in CreateParticle() favoring the
   * destruction of particles with a finite lifetime over
   * particles with infinite lifetimes. This feature is enabled by
   * default when particle lifetimes are tracked.  Explicitly
   * enabling this feature using this function enables particle
   * lifetime tracking.
   */
  SetDestructionByAge(enable: boolean): void {
    if (enable) {
      this.GetExpirationTimeBuffer();
    }
    this.m_def.destroyByAge = enable;
  }

  /**
   * Get whether the oldest particle will be destroyed in
   * CreateParticle() when the maximum number of particles are
   * present in the system.
   */
  GetDestructionByAge(): boolean {
    return this.m_def.destroyByAge;
  }

  /**
   * Get the array of particle expiration times indexed by
   * particle index.
   *
   * GetParticleCount() items are in the returned array.
   */
  GetExpirationTimeBuffer(): number[] {
    this.m_expirationTimeBuffer.data = this.RequestBuffer(this.m_expirationTimeBuffer.data);
    return this.m_expirationTimeBuffer.data;
  }

  /**
   * Convert a expiration time value in returned by
   * GetExpirationTimeBuffer() to a time in seconds relative to
   * the current simulation time.
   */
  ExpirationTimeToLifetime(expirationTime: number): number {
    return (expirationTime > 0 ?
      expirationTime - this.GetQuantizedTimeElapsed() :
      expirationTime) * this.m_def.lifetimeGranularity;
  }

  /**
   * Get the array of particle indices ordered by reverse
   * lifetime. The oldest particle indexes are at the end of the
   * array with the newest at the start.  Particles with infinite
   * lifetimes (i.e expiration times less than or equal to 0) are
   * placed at the start of the array.
   * ExpirationTimeToLifetime(GetExpirationTimeBuffer()[index]) is
   * equivalent to GetParticleLifetime(index).
   *
   * GetParticleCount() items are in the returned array.
   */
  GetIndexByExpirationTimeBuffer(): number[] {
    // If particles are present, initialize / reinitialize the lifetime buffer.
    if (this.GetParticleCount()) {
      this.SetParticleLifetime(0, this.GetParticleLifetime(0));
    } else {
      this.m_indexByExpirationTimeBuffer.data = this.RequestBuffer(this.m_indexByExpirationTimeBuffer.data);
    }
    return this.m_indexByExpirationTimeBuffer.data;
  }

  /**
   * Apply an impulse to one particle. This immediately modifies
   * the velocity. Similar to b2Body::ApplyLinearImpulse.
   *
   * @param index the particle that will be modified.
   * @param impulse impulse the world impulse vector, usually in N-seconds or kg-m/s.
   */
  ParticleApplyLinearImpulse(index: number, impulse: b2Vec2): void {
    this.ApplyLinearImpulse(index, index + 1, impulse);
  }

  /**
   * Apply an impulse to all particles between 'firstIndex' and
   * 'lastIndex'. This immediately modifies the velocity. Note
   * that the impulse is applied to the total mass of all
   * particles. So, calling ParticleApplyLinearImpulse(0, impulse)
   * and ParticleApplyLinearImpulse(1, impulse) will impart twice
   * as much velocity as calling just ApplyLinearImpulse(0, 1,
   * impulse).
   *
   * @param firstIndex the first particle to be modified.
   * @param lastIndex the last particle to be modified.
   * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
   */
  ApplyLinearImpulse(firstIndex: number, lastIndex: number, impulse: b2Vec2): void {
    let vel_data = this.m_velocityBuffer.data;
    let numParticles = (lastIndex - firstIndex);
    let totalMass = numParticles * this.GetParticleMass();
    ///const b2Vec2 velocityDelta = impulse / totalMass;
    let velocityDelta = impulse.Clone().SelfMul(1 / totalMass);
    for (let i = firstIndex; i < lastIndex; i++) {
      ///m_velocityBuffer.data[i] += velocityDelta;
      vel_data[i].SelfAdd(velocityDelta);
    }
  }

  static IsSignificantForce(force: b2Vec2): boolean {
    return force.x !== 0 || force.y !== 0;
  }

  /**
   * Apply a force to the center of a particle.
   *
   * @param index the particle that will be modified.
   * @param force the world force vector, usually in Newtons (N).
   */
  ParticleApplyForce(index: number, force: b2Vec2): void {
    if (b2ParticleSystem.IsSignificantForce(force) &&
      this.ForceCanBeApplied(this.m_flagsBuffer.data[index])) {
      this.PrepareForceBuffer();
      ///m_forceBuffer[index] += force;
      this.m_forceBuffer[index].SelfAdd(force);
    }
  }

  /**
   * Distribute a force across several particles. The particles
   * must not be wall particles. Note that the force is
   * distributed across all the particles, so calling this
   * function for indices 0..N is not the same as calling
   * ParticleApplyForce(i, force) for i in 0..N.
   *
   * @param firstIndex the first particle to be modified.
   * @param lastIndex the last particle to be modified.
   * @param force the world force vector, usually in Newtons (N).
   */
  ApplyForce(firstIndex: number, lastIndex: number, force: b2Vec2): void {
    // Ensure we're not trying to apply force to particles that can't move,
    // such as wall particles.
    ///#if B2_ASSERT_ENABLED
    ///let flags = 0;
    ///for (let i = firstIndex; i < lastIndex; i++) {
    ///flags |= this.m_flagsBuffer.data[i];
    ///}
    ///b2Assert(this.ForceCanBeApplied(flags));
    ///#endif

    // Early out if force does nothing (optimization).
    ///const b2Vec2 distributedForce = force / (float32)(lastIndex - firstIndex);
    let distributedForce = force.Clone().SelfMul(1 / (lastIndex - firstIndex));
    if (b2ParticleSystem.IsSignificantForce(distributedForce)) {
      this.PrepareForceBuffer();

      // Distribute the force over all the particles.
      for (let i = firstIndex; i < lastIndex; i++) {
        ///m_forceBuffer[i] += distributedForce;
        this.m_forceBuffer[i].SelfAdd(distributedForce);
      }
    }
  }

  /**
   * Get the next particle-system in the world's particle-system
   * list.
   */
  GetNext(): b2ParticleSystem {
    return this.m_next;
  }

  /**
   * Query the particle system for all particles that potentially
   * overlap the provided AABB.
   * b2QueryCallback::ShouldQueryParticleSystem is ignored.
   *
   * @param callback a user implemented callback class.
   * @param aabb the query box.
   */
  QueryAABB(callback: b2QueryCallback, aabb: b2AABB): void {
    if (this.m_proxyBuffer.count === 0) {
      return;
    }
    let beginProxy = 0;
    let endProxy = this.m_proxyBuffer.count;
    let firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy,
      b2ParticleSystem.computeTag(
        this.m_inverseDiameter * aabb.lowerBound.x,
        this.m_inverseDiameter * aabb.lowerBound.y),
      b2ParticleSystem.Proxy.CompareProxyTag);
    let lastProxy = std_upper_bound(this.m_proxyBuffer.data, firstProxy, endProxy,
      b2ParticleSystem.computeTag(
        this.m_inverseDiameter * aabb.upperBound.x,
        this.m_inverseDiameter * aabb.upperBound.y),
      b2ParticleSystem.Proxy.CompareTagProxy);
    let pos_data = this.m_positionBuffer.data;
    for (let k = firstProxy; k < lastProxy; ++k) {
      let proxy = this.m_proxyBuffer.data[k];
      let i = proxy.index;
      let p = pos_data[i];
      if (aabb.lowerBound.x < p.x && p.x < aabb.upperBound.x &&
        aabb.lowerBound.y < p.y && p.y < aabb.upperBound.y) {
        if (!callback.ReportParticle(this, i)) {
          break;
        }
      }
    }
  }

  /**
   * Query the particle system for all particles that potentially
   * overlap the provided shape's AABB. Calls QueryAABB
   * internally. b2QueryCallback::ShouldQueryParticleSystem is
   * ignored.
   *
   * @param callback a user implemented callback class.
   * @param shape the query shape
   * @param xf the transform of the AABB
   * @param childIndex
   */
  QueryShapeAABB(callback: b2QueryCallback, shape: b2Shape, xf: b2Transform, childIndex: number = 0): void {
    let s_aabb = b2ParticleSystem.QueryShapeAABB_s_aabb;
    let aabb = s_aabb;
    shape.ComputeAABB(aabb, xf, childIndex);
    this.QueryAABB(callback, aabb);
  }
  static QueryShapeAABB_s_aabb = new b2AABB();

  QueryPointAABB(callback: b2QueryCallback, point: b2Vec2, slop: number = b2_linearSlop): void {
    let s_aabb = b2ParticleSystem.QueryPointAABB_s_aabb;
    let aabb = s_aabb;
    aabb.lowerBound.Set(point.x - slop, point.y - slop);
    aabb.upperBound.Set(point.x + slop, point.y + slop);
    this.QueryAABB(callback, aabb);
  }
  static QueryPointAABB_s_aabb = new b2AABB();

  /**
   * Ray-cast the particle system for all particles in the path of
   * the ray. Your callback controls whether you get the closest
   * point, any point, or n-points. The ray-cast ignores particles
   * that contain the starting point.
   * b2RayCastCallback::ShouldQueryParticleSystem is ignored.
   *
   * @export
   * @return {void}
   * @param {b2RayCastCallback} callback a user implemented
   *      callback class.
   * @param {b2Vec2} point1 the ray starting point
   * @param {b2Vec2} point2 the ray ending point
   */
  RayCast(callback: b2RayCastCallback, point1: b2Vec2, point2: b2Vec2): void {
    let s_aabb = b2ParticleSystem.RayCast_s_aabb;
    let s_p = b2ParticleSystem.RayCast_s_p;
    let s_v = b2ParticleSystem.RayCast_s_v;
    let s_n = b2ParticleSystem.RayCast_s_n;
    let s_point = b2ParticleSystem.RayCast_s_point;
    if (this.m_proxyBuffer.count === 0) {
      return;
    }
    let pos_data = this.m_positionBuffer.data;
    let aabb = s_aabb;
    b2Vec2.MinV(point1, point2, aabb.lowerBound);
    b2Vec2.MaxV(point1, point2, aabb.upperBound);
    let fraction = 1;
    // solving the following equation:
    // ((1-t)*point1+t*point2-position)^2=diameter^2
    // where t is a potential fraction
    ///b2Vec2 v = point2 - point1;
    let v = b2Vec2.SubVV(point2, point1, s_v);
    let v2 = b2Vec2.DotVV(v, v);
    let enumerator = this.GetInsideBoundsEnumerator(aabb);

    let i: number;
    while ((i = enumerator.GetNext()) >= 0) {
      ///b2Vec2 p = point1 - m_positionBuffer.data[i];
      let p = b2Vec2.SubVV(point1, pos_data[i], s_p);
      let pv = b2Vec2.DotVV(p, v);
      let p2 = b2Vec2.DotVV(p, p);
      let determinant = pv * pv - v2 * (p2 - this.m_squaredDiameter);
      if (determinant >= 0) {
        let sqrtDeterminant = Math.sqrt(determinant);
        // find a solution between 0 and fraction
        let t = (-pv - sqrtDeterminant) / v2;
        if (t > fraction) {
          continue;
        }
        if (t < 0) {
          t = (-pv + sqrtDeterminant) / v2;
          if (t < 0 || t > fraction) {
            continue;
          }
        }
        ///b2Vec2 n = p + t * v;
        let n = b2Vec2.AddVMulSV(p, t, v, s_n);
        n.Normalize();
        ///float32 f = callback.ReportParticle(this, i, point1 + t * v, n, t);
        let f = callback.ReportParticle(this, i, b2Vec2.AddVMulSV(point1, t, v, s_point), n, t);
        fraction = Math.min(fraction, f);
        if (fraction <= 0) {
          break;
        }
      }
    }
  }
  static RayCast_s_aabb = new b2AABB();
  static RayCast_s_p = new b2Vec2();
  static RayCast_s_v = new b2Vec2();
  static RayCast_s_n = new b2Vec2();
  static RayCast_s_point = new b2Vec2();

  /**
   * Compute the axis-aligned bounding box for all particles
   * contained within this particle system.
   *
   * @export
   * @return {void}
   * @param {b2AABB} aabb Returns the axis-aligned bounding
   *      box of the system.
   */
  ComputeAABB(aabb: b2AABB): void {
    let particleCount = this.GetParticleCount();
    b2Assert(aabb !== null);
    aabb.lowerBound.x = +b2_maxFloat;
    aabb.lowerBound.y = +b2_maxFloat;
    aabb.upperBound.x = -b2_maxFloat;
    aabb.upperBound.y = -b2_maxFloat;

    let pos_data = this.m_positionBuffer.data;
    for (let i = 0; i < particleCount; i++) {
      let p = pos_data[i];
      b2Vec2.MinV(aabb.lowerBound, p, aabb.lowerBound);
      b2Vec2.MaxV(aabb.upperBound, p, aabb.upperBound);
    }
    aabb.lowerBound.x -= this.m_particleDiameter;
    aabb.lowerBound.y -= this.m_particleDiameter;
    aabb.upperBound.x += this.m_particleDiameter;
    aabb.upperBound.y += this.m_particleDiameter;
  }

  /**
   * All particle types that require creating pairs
   */
  static k_pairFlags: number = b2ParticleFlag.b2_springParticle;

  /**
   * All particle types that require creating triads
   *
   * @type {number}
   */
  static k_triadFlags = b2ParticleFlag.b2_elasticParticle;

  /**
   * All particle types that do not produce dynamic pressure
   *
   * @type {number}
   */
  static k_noPressureFlags = b2ParticleFlag.b2_powderParticle | b2ParticleFlag.b2_tensileParticle;

  /**
   * All particle types that apply extra damping force with bodies
   *
   * @type {number}
   */
  static k_extraDampingFlags = b2ParticleFlag.b2_staticPressureParticle;

  /**
   * @type {number}
   */
  static k_barrierWallFlags = b2ParticleFlag.b2_barrierParticle | b2ParticleFlag.b2_wallParticle;

  FreeBuffer(b: any, capacity: number): void {
    if (b === null) {
      return;
    }
    b.length = 0;
  }

  FreeUserOverridableBuffer(b: b2ParticleSystem.UserOverridableBuffer<any>): void {
    if (b.userSuppliedCapacity === 0) {
      this.FreeBuffer(b.data, this.m_internalAllocatedCapacity);
    }
  }

  /**
   * Reallocate a buffer
   */
  ReallocateBuffer3(oldBuffer: any[], oldCapacity: number, newCapacity: number): any[] {
    b2Assert(newCapacity > oldCapacity);
    let newBuffer = (oldBuffer) ? oldBuffer.slice() : [];
    newBuffer.length = newCapacity;
    return newBuffer;
  }

  /**
   * Reallocate a buffer
   */
  ReallocateBuffer5(buffer: any[], userSuppliedCapacity: number, oldCapacity: number, newCapacity: number, deferred: boolean): any[] {
    b2Assert(newCapacity > oldCapacity);
    // A 'deferred' buffer is reallocated only if it is not NULL.
    // If 'userSuppliedCapacity' is not zero, buffer is user supplied and must
    // be kept.
    b2Assert(!userSuppliedCapacity || newCapacity <= userSuppliedCapacity);
    if ((!deferred || buffer) && !userSuppliedCapacity) {
      buffer = this.ReallocateBuffer3(buffer, oldCapacity, newCapacity);
    }
    return buffer;
  }

  /**
   * Reallocate a buffer
   */
  ReallocateBuffer4(buffer: b2ParticleSystem.UserOverridableBuffer<any>, oldCapacity: number, newCapacity: number, deferred: boolean): any[] {
    b2Assert(newCapacity > oldCapacity);
    return this.ReallocateBuffer5(buffer.data, buffer.userSuppliedCapacity, oldCapacity, newCapacity, deferred);
  }

  RequestBuffer(buffer: any[]): any[] {
    if (!buffer) {
      if (this.m_internalAllocatedCapacity === 0) {
        this.ReallocateInternalAllocatedBuffers(b2_minParticleSystemBufferCapacity);
      }

      buffer = [];
      buffer.length = this.m_internalAllocatedCapacity;
    }
    return buffer;
  }

  /**
   * Reallocate the handle / index map and schedule the allocation
   * of a new pool for handle allocation.
   */
  ReallocateHandleBuffers(newCapacity: number): void {
    b2Assert(newCapacity > this.m_internalAllocatedCapacity);
    // Reallocate a new handle / index map buffer, copying old handle pointers
    // is fine since they're kept around.
    this.m_handleIndexBuffer.data = this.ReallocateBuffer4(this.m_handleIndexBuffer, this.m_internalAllocatedCapacity, newCapacity, true);
    // Set the size of the next handle allocation.
    ///this.m_handleAllocator.SetItemsPerSlab(newCapacity - this.m_internalAllocatedCapacity);
  }

  ReallocateInternalAllocatedBuffers(capacity: number): void {
    function LimitCapacity(capacity: number, maxCount: number): number {
      return maxCount && capacity > maxCount ? maxCount : capacity;
    }

    // Don't increase capacity beyond the smallest user-supplied buffer size.
    capacity = LimitCapacity(capacity, this.m_def.maxCount);
    capacity = LimitCapacity(capacity, this.m_flagsBuffer.userSuppliedCapacity);
    capacity = LimitCapacity(capacity, this.m_positionBuffer.userSuppliedCapacity);
    capacity = LimitCapacity(capacity, this.m_velocityBuffer.userSuppliedCapacity);
    capacity = LimitCapacity(capacity, this.m_colorBuffer.userSuppliedCapacity);
    capacity = LimitCapacity(capacity, this.m_userDataBuffer.userSuppliedCapacity);
    if (this.m_internalAllocatedCapacity < capacity) {
      this.ReallocateHandleBuffers(capacity);
      this.m_flagsBuffer.data = this.ReallocateBuffer4(this.m_flagsBuffer, this.m_internalAllocatedCapacity, capacity, false);

      // Conditionally defer these as they are optional if the feature is
      // not enabled.
      let stuck = this.m_stuckThreshold > 0;
      this.m_lastBodyContactStepBuffer.data = this.ReallocateBuffer4(this.m_lastBodyContactStepBuffer, this.m_internalAllocatedCapacity, capacity, stuck);
      this.m_bodyContactCountBuffer.data = this.ReallocateBuffer4(this.m_bodyContactCountBuffer, this.m_internalAllocatedCapacity, capacity, stuck);
      this.m_consecutiveContactStepsBuffer.data = this.ReallocateBuffer4(this.m_consecutiveContactStepsBuffer, this.m_internalAllocatedCapacity, capacity, stuck);
      this.m_positionBuffer.data = this.ReallocateBuffer4(this.m_positionBuffer, this.m_internalAllocatedCapacity, capacity, false);
      this.m_velocityBuffer.data = this.ReallocateBuffer4(this.m_velocityBuffer, this.m_internalAllocatedCapacity, capacity, false);
      this.m_forceBuffer = this.ReallocateBuffer5(this.m_forceBuffer, 0, this.m_internalAllocatedCapacity, capacity, false);
      this.m_weightBuffer = this.ReallocateBuffer5(this.m_weightBuffer, 0, this.m_internalAllocatedCapacity, capacity, false);
      this.m_staticPressureBuffer = this.ReallocateBuffer5(this.m_staticPressureBuffer, 0, this.m_internalAllocatedCapacity, capacity, true);
      this.m_accumulationBuffer = this.ReallocateBuffer5(this.m_accumulationBuffer, 0, this.m_internalAllocatedCapacity, capacity, false);
      this.m_accumulation2Buffer = this.ReallocateBuffer5(this.m_accumulation2Buffer, 0, this.m_internalAllocatedCapacity, capacity, true);
      this.m_depthBuffer = this.ReallocateBuffer5(this.m_depthBuffer, 0, this.m_internalAllocatedCapacity, capacity, true);
      this.m_colorBuffer.data = this.ReallocateBuffer4(this.m_colorBuffer, this.m_internalAllocatedCapacity, capacity, true);
      this.m_groupBuffer = this.ReallocateBuffer5(this.m_groupBuffer, 0, this.m_internalAllocatedCapacity, capacity, false);
      this.m_userDataBuffer.data = this.ReallocateBuffer4(this.m_userDataBuffer, this.m_internalAllocatedCapacity, capacity, true);
      this.m_expirationTimeBuffer.data = this.ReallocateBuffer4(this.m_expirationTimeBuffer, this.m_internalAllocatedCapacity, capacity, true);
      this.m_indexByExpirationTimeBuffer.data = this.ReallocateBuffer4(this.m_indexByExpirationTimeBuffer, this.m_internalAllocatedCapacity, capacity, false);
      this.m_internalAllocatedCapacity = capacity;
    }
  }

  CreateParticleForGroup(groupDef: b2ParticleGroupDef, xf: b2Transform, p: b2Vec2): void {
    let particleDef = new b2ParticleDef();
    particleDef.flags = groupDef.flags;
    ///particleDef.position = b2Mul(xf, p);
    b2Transform.MulXV(xf, p, particleDef.position);
    ///particleDef.velocity =
    ///  groupDef.linearVelocity +
    ///  b2Cross(groupDef.angularVelocity,
    ///      particleDef.position - groupDef.position);
    b2Vec2.AddVV(
      groupDef.linearVelocity,
      b2Vec2.CrossSV(
        groupDef.angularVelocity,
        b2Vec2.SubVV(
          particleDef.position,
          groupDef.position,
          b2Vec2.s_t0
        ),
        b2Vec2.s_t0
      ),
      particleDef.velocity
    );
    particleDef.color.Copy(groupDef.color);
    particleDef.lifetime = groupDef.lifetime;
    particleDef.userData = groupDef.userData;
    this.CreateParticle(particleDef);
  }

  CreateParticlesStrokeShapeForGroup(shape: b2Shape, groupDef: b2ParticleGroupDef, xf: b2Transform): void {
    let s_edge = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_edge;
    let s_d = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_d;
    let s_p = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_p;
    let stride = groupDef.stride;
    if (stride === 0) {
      stride = this.GetParticleStride();
    }
    let positionOnEdge = 0;
    let childCount = shape.GetChildCount();
    for (let childIndex = 0; childIndex < childCount; childIndex++) {
      let edge: b2EdgeShape = null;
      if (shape.GetType() === b2ShapeType.e_edgeShape) {
        edge = <b2EdgeShape> shape;
      } else {
        b2Assert(shape.GetType() === b2ShapeType.e_chainShape);
        edge = s_edge;
        (shape as b2ChainShape).GetChildEdge(edge, childIndex);
      }
      let d = b2Vec2.SubVV(edge.m_vertex2, edge.m_vertex1, s_d);
      let edgeLength = d.Length();

      while (positionOnEdge < edgeLength) {
        ///b2Vec2 p = edge.m_vertex1 + positionOnEdge / edgeLength * d;
        let p = b2Vec2.AddVMulSV(edge.m_vertex1, positionOnEdge / edgeLength, d, s_p);
        this.CreateParticleForGroup(groupDef, xf, p);
        positionOnEdge += stride;
      }
      positionOnEdge -= edgeLength;
    }
  }
  static CreateParticlesStrokeShapeForGroup_s_edge = new b2EdgeShape();
  static CreateParticlesStrokeShapeForGroup_s_d = new b2Vec2();
  static CreateParticlesStrokeShapeForGroup_s_p = new b2Vec2();

  CreateParticlesFillShapeForGroup(shape: b2Shape, groupDef: b2ParticleGroupDef, xf: b2Transform): void {
    let s_aabb = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb;
    let s_p = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p;
    let stride = groupDef.stride;
    if (stride === 0) {
      stride = this.GetParticleStride();
    }
    ///b2Transform identity;
    /// identity.SetIdentity();
    let identity = b2Transform.IDENTITY;
    let aabb = s_aabb;
    b2Assert(shape.GetChildCount() === 1);
    shape.ComputeAABB(aabb, identity, 0);
    for (let y = Math.floor(aabb.lowerBound.y / stride) * stride; y < aabb.upperBound.y; y += stride) {
      for (let x = Math.floor(aabb.lowerBound.x / stride) * stride; x < aabb.upperBound.x; x += stride) {
        let p = s_p.Set(x, y);
        if (shape.TestPoint(identity, p)) {
          this.CreateParticleForGroup(groupDef, xf, p);
        }
      }
    }
  }
  static CreateParticlesFillShapeForGroup_s_aabb = new b2AABB();
  static CreateParticlesFillShapeForGroup_s_p = new b2Vec2();

  CreateParticlesWithShapeForGroup(shape: b2Shape, groupDef: b2ParticleGroupDef, xf: b2Transform): void {
    switch (shape.GetType()) {
      case b2ShapeType.e_edgeShape:
      case b2ShapeType.e_chainShape:
        this.CreateParticlesStrokeShapeForGroup(shape, groupDef, xf);
        break;
      case b2ShapeType.e_polygonShape:
      case b2ShapeType.e_circleShape:
        this.CreateParticlesFillShapeForGroup(shape, groupDef, xf);
        break;
      default:
        b2Assert(false);
        break;
    }
  }

  CreateParticlesWithShapesForGroup(shapes: b2Shape[], shapeCount: number, groupDef: b2ParticleGroupDef, xf: b2Transform): void {
    let compositeShape = new b2ParticleSystem.CompositeShape(shapes, shapeCount);
    this.CreateParticlesFillShapeForGroup(compositeShape, groupDef, xf);
  }

  CloneParticle(oldIndex: number, group: b2ParticleGroup): number {
    let def = new b2ParticleDef();
    def.flags = this.m_flagsBuffer.data[oldIndex];
    def.position.Copy(this.m_positionBuffer.data[oldIndex]);
    def.velocity.Copy(this.m_velocityBuffer.data[oldIndex]);
    if (this.m_colorBuffer.data) {
      def.color.Copy(this.m_colorBuffer.data[oldIndex]);
    }
    if (this.m_userDataBuffer.data) {
      def.userData = this.m_userDataBuffer.data[oldIndex];
    }
    def.group = group;
    let newIndex = this.CreateParticle(def);
    if (this.m_handleIndexBuffer.data) {
      let handle = this.m_handleIndexBuffer.data[oldIndex];
      if (handle) handle.SetIndex(newIndex);
      this.m_handleIndexBuffer.data[newIndex] = handle;
      this.m_handleIndexBuffer.data[oldIndex] = null;
    }
    if (this.m_lastBodyContactStepBuffer.data) {
      this.m_lastBodyContactStepBuffer.data[newIndex] =
        this.m_lastBodyContactStepBuffer.data[oldIndex];
    }
    if (this.m_bodyContactCountBuffer.data) {
      this.m_bodyContactCountBuffer.data[newIndex] =
        this.m_bodyContactCountBuffer.data[oldIndex];
    }
    if (this.m_consecutiveContactStepsBuffer.data) {
      this.m_consecutiveContactStepsBuffer.data[newIndex] =
        this.m_consecutiveContactStepsBuffer.data[oldIndex];
    }
    if (this.m_hasForce) {
      this.m_forceBuffer[newIndex].Copy(this.m_forceBuffer[oldIndex]);
    }
    if (this.m_staticPressureBuffer) {
      this.m_staticPressureBuffer[newIndex] = this.m_staticPressureBuffer[oldIndex];
    }
    if (this.m_depthBuffer) {
      this.m_depthBuffer[newIndex] = this.m_depthBuffer[oldIndex];
    }
    if (this.m_expirationTimeBuffer.data) {
      this.m_expirationTimeBuffer.data[newIndex] =
        this.m_expirationTimeBuffer.data[oldIndex];
    }
    return newIndex;
  }

  DestroyParticlesInGroup(group: b2ParticleGroup, callDestructionListener: boolean = false): void {
    for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
      this.DestroyParticle(i, callDestructionListener);
    }
  }

  DestroyParticleGroup(group: b2ParticleGroup): void {
    b2Assert(this.m_groupCount > 0);
    b2Assert(group !== null);

    if (this.m_world.m_destructionListener) {
      this.m_world.m_destructionListener.SayGoodbyeParticleGroup(group);
    }

    this.SetGroupFlags(group, 0);
    for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
      this.m_groupBuffer[i] = null;
    }

    if (group.m_prev) {
      group.m_prev.m_next = group.m_next;
    }
    if (group.m_next) {
      group.m_next.m_prev = group.m_prev;
    }
    if (group === this.m_groupList) {
      this.m_groupList = group.m_next;
    }

    --this.m_groupCount;
  }

  static ParticleCanBeConnected(flags: b2ParticleFlag, group: b2ParticleGroup): boolean {
    return ((flags & (b2ParticleFlag.b2_wallParticle | b2ParticleFlag.b2_springParticle | b2ParticleFlag.b2_elasticParticle)) !== 0) ||
      ((group !== null) && ((group.GetGroupFlags() & b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0));
  }

  UpdatePairsAndTriads(firstIndex: number, lastIndex: number, filter: b2ParticleSystem.ConnectionFilter): void {
    let s_dab = b2ParticleSystem.UpdatePairsAndTriads_s_dab;
    let s_dbc = b2ParticleSystem.UpdatePairsAndTriads_s_dbc;
    let s_dca = b2ParticleSystem.UpdatePairsAndTriads_s_dca;
    let pos_data = this.m_positionBuffer.data;
    // Create pairs or triads.
    // All particles in each pair/triad should satisfy the following:
    // * firstIndex <= index < lastIndex
    // * don't have b2_zombieParticle
    // * ParticleCanBeConnected returns true
    // * ShouldCreatePair/ShouldCreateTriad returns true
    // Any particles in each pair/triad should satisfy the following:
    // * filter.IsNeeded returns true
    // * have one of k_pairFlags/k_triadsFlags
    b2Assert(firstIndex <= lastIndex);
    let particleFlags = 0;
    for (let i = firstIndex; i < lastIndex; i++) {
      particleFlags |= this.m_flagsBuffer.data[i];
    }
    if (particleFlags & b2ParticleSystem.k_pairFlags) {
      for (let k = 0; k < this.m_contactBuffer.count; k++) {
        let contact = this.m_contactBuffer.data[k];
        let a = contact.indexA;
        let b = contact.indexB;
        let af = this.m_flagsBuffer.data[a];
        let bf = this.m_flagsBuffer.data[b];
        let groupA = this.m_groupBuffer[a];
        let groupB = this.m_groupBuffer[b];
        if (a >= firstIndex && a < lastIndex &&
          b >= firstIndex && b < lastIndex &&
          !((af | bf) & b2ParticleFlag.b2_zombieParticle) &&
          ((af | bf) & b2ParticleSystem.k_pairFlags) &&
          (filter.IsNecessary(a) || filter.IsNecessary(b)) &&
          b2ParticleSystem.ParticleCanBeConnected(af, groupA) &&
          b2ParticleSystem.ParticleCanBeConnected(bf, groupB) &&
          filter.ShouldCreatePair(a, b)) {
          ///b2ParticlePair& pair = m_pairBuffer.Append();
          let pair = this.m_pairBuffer.data[this.m_pairBuffer.Append()];
          pair.indexA = a;
          pair.indexB = b;
          pair.flags = contact.flags;
          pair.strength = Math.min(
            groupA ? groupA.m_strength : 1,
            groupB ? groupB.m_strength : 1);
          ///pair.distance = b2Distance(pos_data[a], pos_data[b]); // TODO: this was wrong!
          pair.distance = b2Vec2.DistanceVV(pos_data[a], pos_data[b]);
        }
        ///std::stable_sort(m_pairBuffer.Begin(), m_pairBuffer.End(), ComparePairIndices);
        std_stable_sort(this.m_pairBuffer.data, 0, this.m_pairBuffer.count, b2ParticleSystem.ComparePairIndices);
        ///m_pairBuffer.Unique(MatchPairIndices);
        this.m_pairBuffer.Unique(b2ParticleSystem.MatchPairIndices);
      }
    }
    if (particleFlags & b2ParticleSystem.k_triadFlags) {
      let diagram = new b2VoronoiDiagram(lastIndex - firstIndex);
      ///let necessary_count = 0;
      for (let i = firstIndex; i < lastIndex; i++) {
        let flags = this.m_flagsBuffer.data[i];
        let group = this.m_groupBuffer[i];
        if (!(flags & b2ParticleFlag.b2_zombieParticle) &&
          b2ParticleSystem.ParticleCanBeConnected(flags, group)) {
          ///if (filter.IsNecessary(i)) {
          ///++necessary_count;
          ///}
          diagram.AddGenerator(pos_data[i], i, filter.IsNecessary(i));
        }
      }
      ///if (necessary_count === 0) {
      /////debugger;
      ///for (let i = firstIndex; i < lastIndex; i++) {
      ///  filter.IsNecessary(i);
      ///}
      ///}
      let stride = this.GetParticleStride();
      diagram.Generate(stride / 2, stride * 2);
      let system = this;
      let callback = function UpdateTriadsCallback(a: number, b: number, c: number): void {
        let af = system.m_flagsBuffer.data[a];
        let bf = system.m_flagsBuffer.data[b];
        let cf = system.m_flagsBuffer.data[c];
        if (((af | bf | cf) & b2ParticleSystem.k_triadFlags) &&
          filter.ShouldCreateTriad(a, b, c)) {
          let pa = pos_data[a];
          let pb = pos_data[b];
          let pc = pos_data[c];
          let dab = b2Vec2.SubVV(pa, pb, s_dab);
          let dbc = b2Vec2.SubVV(pb, pc, s_dbc);
          let dca = b2Vec2.SubVV(pc, pa, s_dca);
          let maxDistanceSquared = b2_maxTriadDistanceSquared * system.m_squaredDiameter;
          if (b2Vec2.DotVV(dab, dab) > maxDistanceSquared ||
            b2Vec2.DotVV(dbc, dbc) > maxDistanceSquared ||
            b2Vec2.DotVV(dca, dca) > maxDistanceSquared) {
            return;
          }
          let groupA = system.m_groupBuffer[a];
          let groupB = system.m_groupBuffer[b];
          let groupC = system.m_groupBuffer[c];
          ///b2ParticleTriad& triad = m_system.m_triadBuffer.Append();
          let triad = system.m_triadBuffer.data[system.m_triadBuffer.Append()];
          triad.indexA = a;
          triad.indexB = b;
          triad.indexC = c;
          triad.flags = af | bf | cf;
          triad.strength = Math.min(Math.min(
              groupA ? groupA.m_strength : 1,
              groupB ? groupB.m_strength : 1),
            groupC ? groupC.m_strength : 1);
          ///let midPoint = b2Vec2.MulSV(1.0 / 3.0, b2Vec2.AddVV(pa, b2Vec2.AddVV(pb, pc, new b2Vec2()), new b2Vec2()), new b2Vec2());
          let midPoint_x = (pa.x + pb.x + pc.x) / 3.0;
          let midPoint_y = (pa.y + pb.y + pc.y) / 3.0;
          ///triad.pa = b2Vec2.SubVV(pa, midPoint, new b2Vec2());
          triad.pa.x = pa.x - midPoint_x;
          triad.pa.y = pa.y - midPoint_y;
          ///triad.pb = b2Vec2.SubVV(pb, midPoint, new b2Vec2());
          triad.pb.x = pb.x - midPoint_x;
          triad.pb.y = pb.y - midPoint_y;
          ///triad.pc = b2Vec2.SubVV(pc, midPoint, new b2Vec2());
          triad.pc.x = pc.x - midPoint_x;
          triad.pc.y = pc.y - midPoint_y;
          triad.ka = -b2Vec2.DotVV(dca, dab);
          triad.kb = -b2Vec2.DotVV(dab, dbc);
          triad.kc = -b2Vec2.DotVV(dbc, dca);
          triad.s = b2Vec2.CrossVV(pa, pb) + b2Vec2.CrossVV(pb, pc) + b2Vec2.CrossVV(pc, pa);
        }
      };
      diagram.GetNodes(callback);
      ///std::stable_sort(m_triadBuffer.Begin(), m_triadBuffer.End(), CompareTriadIndices);
      std_stable_sort(this.m_triadBuffer.data, 0, this.m_triadBuffer.count, b2ParticleSystem.CompareTriadIndices);
      ///m_triadBuffer.Unique(MatchTriadIndices);
      this.m_triadBuffer.Unique(b2ParticleSystem.MatchTriadIndices);
    }
  }
  private static UpdatePairsAndTriads_s_dab = new b2Vec2();
  private static UpdatePairsAndTriads_s_dbc = new b2Vec2();
  private static UpdatePairsAndTriads_s_dca = new b2Vec2();

  UpdatePairsAndTriadsWithReactiveParticles(): void {
    let filter = new b2ParticleSystem.ReactiveFilter(this.m_flagsBuffer);
    this.UpdatePairsAndTriads(0, this.m_count, filter);

    for (let i = 0; i < this.m_count; i++) {
      this.m_flagsBuffer.data[i] &= ~b2ParticleFlag.b2_reactiveParticle;
    }
    this.m_allParticleFlags &= ~b2ParticleFlag.b2_reactiveParticle;
  }

  static ComparePairIndices(a: b2ParticlePair, b: b2ParticlePair): boolean {
    let diffA = a.indexA - b.indexA;
    if (diffA !== 0) return diffA < 0;
    return a.indexB < b.indexB;
  }

  static MatchPairIndices(a: b2ParticlePair, b: b2ParticlePair): boolean {
    return a.indexA === b.indexA && a.indexB === b.indexB;
  }

  static CompareTriadIndices(a: b2ParticleTriad, b: b2ParticleTriad): boolean {
    let diffA = a.indexA - b.indexA;
    if (diffA !== 0) return diffA < 0;
    let diffB = a.indexB - b.indexB;
    if (diffB !== 0) return diffB < 0;
    return a.indexC < b.indexC;
  }

  static MatchTriadIndices(a: b2ParticleTriad, b: b2ParticleTriad): boolean {
    return a.indexA === b.indexA && a.indexB === b.indexB && a.indexC === b.indexC;
  }

  static InitializeParticleLists(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void {
    let bufferIndex = group.GetBufferIndex();
    let particleCount = group.GetParticleCount();
    for (let i = 0; i < particleCount; i++) {
      /*ParticleListNode**/
      let node = nodeBuffer[i];
      node.list = node;
      node.next = null;
      node.count = 1;
      node.index = i + bufferIndex;
    }
  }

  MergeParticleListsInContact(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void {
    let bufferIndex = group.GetBufferIndex();
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      /*const b2ParticleContact&*/
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      if (!group.ContainsParticle(a) || !group.ContainsParticle(b)) {
        continue;
      }
      /*ParticleListNode**/
      let listA = nodeBuffer[a - bufferIndex].list;
      /*ParticleListNode**/
      let listB = nodeBuffer[b - bufferIndex].list;
      if (listA === listB) {
        continue;
      }
      // To minimize the cost of insertion, make sure listA is longer than
      // listB.
      if (listA.count < listB.count) {
        let _tmp = listA;
        listA = listB;
        listB = _tmp; ///b2Swap(listA, listB);
      }
      b2Assert(listA.count >= listB.count);
      b2ParticleSystem.MergeParticleLists(listA, listB);
    }
  }

  static MergeParticleLists(listA: b2ParticleSystem.ParticleListNode, listB: b2ParticleSystem.ParticleListNode): void {
    // Insert listB between index 0 and 1 of listA
    // Example:
    //     listA => a1 => a2 => a3 => null
    //     listB => b1 => b2 => null
    // to
    //     listA => listB => b1 => b2 => a1 => a2 => a3 => null
    b2Assert(listA !== listB);
    for ( /*ParticleListNode**/ let b = listB; ; ) {
      b.list = listA;
      /*ParticleListNode**/
      let nextB = b.next;
      if (nextB) {
        b = nextB;
      } else {
        b.next = listA.next;
        break;
      }
    }
    listA.next = listB;
    listA.count += listB.count;
    listB.count = 0;
  }

  static FindLongestParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): b2ParticleSystem.ParticleListNode {
    let particleCount = group.GetParticleCount();
    /*ParticleListNode**/
    let result = nodeBuffer[0];
    for (let i = 0; i < particleCount; i++) {
      /*ParticleListNode**/
      let node = nodeBuffer[i];
      if (result.count < node.count) {
        result = node;
      }
    }
    return result;
  }

  MergeZombieParticleListNodes(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[], survivingList: b2ParticleSystem.ParticleListNode): void {
    let particleCount = group.GetParticleCount();
    for (let i = 0; i < particleCount; i++) {
      /*ParticleListNode**/
      let node = nodeBuffer[i];
      if (node !== survivingList &&
        (this.m_flagsBuffer.data[node.index] & b2ParticleFlag.b2_zombieParticle)) {
        b2ParticleSystem.MergeParticleListAndNode(survivingList, node);
      }
    }
  }

  static MergeParticleListAndNode(list: b2ParticleSystem.ParticleListNode, node: b2ParticleSystem.ParticleListNode): void {
    // Insert node between index 0 and 1 of list
    // Example:
    //     list => a1 => a2 => a3 => null
    //     node => null
    // to
    //     list => node => a1 => a2 => a3 => null
    b2Assert(node !== list);
    b2Assert(node.list === node);
    b2Assert(node.count === 1);
    node.list = list;
    node.next = list.next;
    list.next = node;
    list.count++;
    node.count = 0;
  }

  CreateParticleGroupsFromParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[], survivingList: b2ParticleSystem.ParticleListNode): void {
    let particleCount = group.GetParticleCount();
    let def = new b2ParticleGroupDef();
    def.groupFlags = group.GetGroupFlags();
    def.userData = group.GetUserData();
    for (let i = 0; i < particleCount; i++) {
      /*ParticleListNode**/
      let list = nodeBuffer[i];
      if (!list.count || list === survivingList) {
        continue;
      }
      b2Assert(list.list === list);
      /*b2ParticleGroup**/
      let newGroup = this.CreateParticleGroup(def);
      for ( /*ParticleListNode**/ let node = list; node; node = node.next) {
        let oldIndex = node.index;
        let flags = this.m_flagsBuffer.data[oldIndex];
        b2Assert(!(flags & b2ParticleFlag.b2_zombieParticle));
        let newIndex = this.CloneParticle(oldIndex, newGroup);
        this.m_flagsBuffer.data[oldIndex] |= b2ParticleFlag.b2_zombieParticle;
        node.index = newIndex;
      }
    }
  }

  UpdatePairsAndTriadsWithParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void {
    let bufferIndex = group.GetBufferIndex();
    // Update indices in pairs and triads. If an index belongs to the group,
    // replace it with the corresponding value in nodeBuffer.
    // Note that nodeBuffer is allocated only for the group and the index should
    // be shifted by bufferIndex.
    for (let k = 0; k < this.m_pairBuffer.count; k++) {
      let pair = this.m_pairBuffer.data[k];
      let a = pair.indexA;
      let b = pair.indexB;
      if (group.ContainsParticle(a)) {
        pair.indexA = nodeBuffer[a - bufferIndex].index;
      }
      if (group.ContainsParticle(b)) {
        pair.indexB = nodeBuffer[b - bufferIndex].index;
      }
    }
    for (let k = 0; k < this.m_triadBuffer.count; k++) {
      let triad = this.m_triadBuffer.data[k];
      let a = triad.indexA;
      let b = triad.indexB;
      let c = triad.indexC;
      if (group.ContainsParticle(a)) {
        triad.indexA = nodeBuffer[a - bufferIndex].index;
      }
      if (group.ContainsParticle(b)) {
        triad.indexB = nodeBuffer[b - bufferIndex].index;
      }
      if (group.ContainsParticle(c)) {
        triad.indexC = nodeBuffer[c - bufferIndex].index;
      }
    }
  }

  ComputeDepth(): void {
    ///b2ParticleContact* contactGroups = (b2ParticleContact*) this.m_world.m_stackAllocator.Allocate(sizeof(b2ParticleContact) * this.m_contactBuffer.GetCount());
    let contactGroups: b2ParticleContact[] = []; // TODO: static
    let contactGroupsCount = 0;
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let groupA = this.m_groupBuffer[a];
      let groupB = this.m_groupBuffer[b];
      if (groupA && groupA === groupB &&
        (groupA.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth)) {
        contactGroups[contactGroupsCount++] = contact;
      }
    }
    ///b2ParticleGroup** groupsToUpdate = (b2ParticleGroup**) this.m_world.m_stackAllocator.Allocate(sizeof(b2ParticleGroup*) * this.m_groupCount);
    let groupsToUpdate: b2ParticleGroup[] = []; // TODO: static
    let groupsToUpdateCount = 0;
    for (let group = this.m_groupList; group; group = group.GetNext()) {
      if (group.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
        groupsToUpdate[groupsToUpdateCount++] = group;
        this.SetGroupFlags(group,
          group.m_groupFlags &
          ~b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
        for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
          this.m_accumulationBuffer[i] = 0;
        }
      }
    }
    // Compute sum of weight of contacts except between different groups.
    for (let k = 0; k < contactGroupsCount; k++) {
      let contact = contactGroups[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let w = contact.weight;
      this.m_accumulationBuffer[a] += w;
      this.m_accumulationBuffer[b] += w;
    }

    b2Assert(this.m_depthBuffer !== null);
    for (let i = 0; i < groupsToUpdateCount; i++) {
      let group = groupsToUpdate[i];
      for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
        let w = this.m_accumulationBuffer[i];
        this.m_depthBuffer[i] = w < 0.8 ? 0 : b2_maxFloat;
      }
    }
    // The number of iterations is equal to particle number from the deepest
    // particle to the nearest surface particle, and in general it is smaller
    // than sqrt of total particle number.
    ///int32 iterationCount = (int32)Math.sqrt((float)m_count);
    let iterationCount = Math.sqrt(this.m_count) >> 0;
    for (let t = 0; t < iterationCount; t++) {
      let updated = false;
      for (let k = 0; k < contactGroupsCount; k++) {
        let contact = contactGroups[k];
        let a = contact.indexA;
        let b = contact.indexB;
        let r = 1 - contact.weight;
        ///float32& ap0 = m_depthBuffer[a];
        let ap0 = this.m_depthBuffer[a];
        ///float32& bp0 = m_depthBuffer[b];
        let bp0 = this.m_depthBuffer[b];
        let ap1 = bp0 + r;
        let bp1 = ap0 + r;
        if (ap0 > ap1) {
          ///ap0 = ap1;
          this.m_depthBuffer[a] = ap1;
          updated = true;
        }
        if (bp0 > bp1) {
          ///bp0 = bp1;
          this.m_depthBuffer[b] = bp1;
          updated = true;
        }
      }
      if (!updated) {
        break;
      }
    }
    for (let i = 0; i < groupsToUpdateCount; i++) {
      let group = groupsToUpdate[i];
      for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
        if (this.m_depthBuffer[i] < b2_maxFloat) {
          this.m_depthBuffer[i] *= this.m_particleDiameter;
        } else {
          this.m_depthBuffer[i] = 0;
        }
      }
    }
    ///this.m_world.m_stackAllocator.Free(groupsToUpdate);
    ///this.m_world.m_stackAllocator.Free(contactGroups);
  }

  GetInsideBoundsEnumerator(aabb: b2AABB): b2ParticleSystem.InsideBoundsEnumerator {
    let lowerTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x - 1,
      this.m_inverseDiameter * aabb.lowerBound.y - 1);
    let upperTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x + 1,
      this.m_inverseDiameter * aabb.upperBound.y + 1);
    ///const Proxy* beginProxy = m_proxyBuffer.Begin();
    let beginProxy = 0;
    ///const Proxy* endProxy = m_proxyBuffer.End();
    let endProxy = this.m_proxyBuffer.count;
    ///const Proxy* firstProxy = std::lower_bound(beginProxy, endProxy, lowerTag);
    let firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, lowerTag, b2ParticleSystem.Proxy.CompareProxyTag);
    ///const Proxy* lastProxy = std::upper_bound(firstProxy, endProxy, upperTag);
    let lastProxy = std_upper_bound(this.m_proxyBuffer.data, beginProxy, endProxy, upperTag, b2ParticleSystem.Proxy.CompareTagProxy);

    b2Assert(beginProxy <= firstProxy);
    b2Assert(firstProxy <= lastProxy);
    b2Assert(lastProxy <= endProxy);

    return new b2ParticleSystem.InsideBoundsEnumerator(this, lowerTag, upperTag, firstProxy, lastProxy);
  }

  UpdateAllParticleFlags(): void {
    this.m_allParticleFlags = 0;
    for (let i = 0; i < this.m_count; i++) {
      this.m_allParticleFlags |= this.m_flagsBuffer.data[i];
    }
    this.m_needsUpdateAllParticleFlags = false;
  }

  UpdateAllGroupFlags(): void {
    this.m_allGroupFlags = 0;
    for (let group = this.m_groupList; group; group = group.GetNext()) {
      this.m_allGroupFlags |= group.m_groupFlags;
    }
    this.m_needsUpdateAllGroupFlags = false;
  }

  AddContact(a: number, b: number, contacts: b2GrowableBuffer<b2ParticleContact>): void {
    let s_d = b2ParticleSystem.AddContact_s_d;
    let pos_data = this.m_positionBuffer.data;
    b2Assert(contacts === this.m_contactBuffer);
    ///b2Vec2 d = m_positionBuffer.data[b] - m_positionBuffer.data[a];
    let d = b2Vec2.SubVV(pos_data[b], pos_data[a], s_d);
    let distBtParticlesSq = b2Vec2.DotVV(d, d);
    if (distBtParticlesSq < this.m_squaredDiameter) {
      let invD = b2InvSqrt(distBtParticlesSq);
      if (!isFinite(invD)) {
        invD = 1.98177537e+019;
      }
      ///b2ParticleContact& contact = contacts.Append();
      let contact = this.m_contactBuffer.data[this.m_contactBuffer.Append()];
      contact.indexA = a;
      contact.indexB = b;
      contact.flags = this.m_flagsBuffer.data[a] | this.m_flagsBuffer.data[b];
      contact.weight = 1 - distBtParticlesSq * invD * this.m_inverseDiameter;
      ///contact.SetNormal(invD * d);
      b2Vec2.MulSV(invD, d, contact.normal);
    }
  }
  static AddContact_s_d = new b2Vec2();

  FindContacts_Reference(contacts: b2GrowableBuffer<b2ParticleContact>): void {
    b2Assert(contacts === this.m_contactBuffer);
    let beginProxy = 0;
    let endProxy = this.m_proxyBuffer.count;

    this.m_contactBuffer.count = 0;
    for (let a = beginProxy, c = beginProxy; a < endProxy; a++) {
      let rightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 0);
      for (let b = a + 1; b < endProxy; b++) {
        if (rightTag < this.m_proxyBuffer.data[b].tag) break;
        this.AddContact(this.m_proxyBuffer.data[a].index, this.m_proxyBuffer.data[b].index, this.m_contactBuffer);
      }
      let bottomLeftTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, -1, 1);
      for (; c < endProxy; c++) {
        if (bottomLeftTag <= this.m_proxyBuffer.data[c].tag) break;
      }
      let bottomRightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 1);
      for (let b = c; b < endProxy; b++) {
        if (bottomRightTag < this.m_proxyBuffer.data[b].tag) break;
        this.AddContact(this.m_proxyBuffer.data[a].index, this.m_proxyBuffer.data[b].index, this.m_contactBuffer);
      }
    }
  }

  ///void ReorderForFindContact(FindContactInput* reordered, int alignedCount) const;
  ///void GatherChecksOneParticle(const uint32 bound, const int startIndex, const int particleIndex, int* nextUncheckedIndex, b2GrowableBuffer<FindContactCheck>& checks) const;
  ///void GatherChecks(b2GrowableBuffer<FindContactCheck>& checks) const;
  ///void FindContacts_Simd(b2GrowableBuffer<b2ParticleContact>& contacts) const;

  FindContacts(contacts: b2GrowableBuffer<b2ParticleContact>): void {
    this.FindContacts_Reference(contacts);
  }

  ///static void UpdateProxyTags(const uint32* const tags, b2GrowableBuffer<Proxy>& proxies);
  ///static bool ProxyBufferHasIndex(int32 index, const Proxy* const a, int count);
  ///static int NumProxiesWithSameTag(const Proxy* const a, const Proxy* const b, int count);
  ///static bool AreProxyBuffersTheSame(const b2GrowableBuffer<Proxy>& a, const b2GrowableBuffer<Proxy>& b);

  UpdateProxies_Reference(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void {
    b2Assert(proxies === this.m_proxyBuffer);
    let pos_data = this.m_positionBuffer.data;
    let inv_diam = this.m_inverseDiameter;
    for (let k = 0; k < this.m_proxyBuffer.count; ++k) {
      let proxy = this.m_proxyBuffer.data[k];
      let i = proxy.index;
      let p = pos_data[i];
      proxy.tag = b2ParticleSystem.computeTag(inv_diam * p.x, inv_diam * p.y);
    }
  }

  ///void UpdateProxies_Simd(b2GrowableBuffer<Proxy>& proxies) const;

  UpdateProxies(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void {
    this.UpdateProxies_Reference(proxies);
  }

  SortProxies(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void {
    b2Assert(proxies === this.m_proxyBuffer);

    ///std::sort(proxies.Begin(), proxies.End());
    std_sort(this.m_proxyBuffer.data, 0, this.m_proxyBuffer.count, b2ParticleSystem.Proxy.CompareProxyProxy);
  }

  FilterContacts(contacts: b2GrowableBuffer<b2ParticleContact>): void {
    // Optionally filter the contact.
    let contactFilter = this.GetParticleContactFilter();
    if (contactFilter === null)
      return;

    /// contacts.RemoveIf(b2ParticleContactRemovePredicate(this, contactFilter));
    b2Assert(contacts === this.m_contactBuffer);
    let system = this;
    let predicate = function(contact: b2ParticleContact): boolean {
      return (contact.flags & b2ParticleFlag.b2_particleContactFilterParticle) && !contactFilter.ShouldCollideParticleParticle(system, contact.indexA, contact.indexB);
    };
    this.m_contactBuffer.RemoveIf(predicate);
  }

  NotifyContactListenerPreContact(particlePairs: b2ParticleSystem.b2ParticlePairSet): void {
    let contactListener = this.GetParticleContactListener();
    if (contactListener === null)
      return;

    ///particlePairs.Initialize(m_contactBuffer.Begin(), m_contactBuffer.GetCount(), GetFlagsBuffer());
    particlePairs.Initialize(this.m_contactBuffer, this.m_flagsBuffer);

    throw new Error(); // TODO: notify
  }

  NotifyContactListenerPostContact(particlePairs: b2ParticleSystem.b2ParticlePairSet): void {
    let contactListener = this.GetParticleContactListener();
    if (contactListener === null)
      return;

    // Loop through all new contacts, reporting any new ones, and
    // "invalidating" the ones that still exist.
    ///const b2ParticleContact* const endContact = m_contactBuffer.End();
    ///for (b2ParticleContact* contact = m_contactBuffer.Begin(); contact < endContact; ++contact)
    for (let k = 0; k < this.m_contactBuffer.count; ++k) {
      let contact = this.m_contactBuffer.data[k];
      ///ParticlePair pair;
      ///pair.first = contact.GetIndexA();
      ///pair.second = contact.GetIndexB();
      ///const int32 itemIndex = particlePairs.Find(pair);
      let itemIndex = -1; // TODO
      if (itemIndex >= 0) {
        // Already touching, ignore this contact.
        particlePairs.Invalidate(itemIndex);
      } else {
        // Just started touching, inform the listener.
        contactListener.BeginContactParticleParticle(this, contact);
      }
    }

    // Report particles that are no longer touching.
    // That is, any pairs that were not invalidated above.
    ///const int32 pairCount = particlePairs.GetCount();
    ///const ParticlePair* const pairs = particlePairs.GetBuffer();
    ///const int8* const valid = particlePairs.GetValidBuffer();
    ///for (int32 i = 0; i < pairCount; ++i)
    ///{
    ///  if (valid[i])
    ///  {
    ///    contactListener.EndContactParticleParticle(this, pairs[i].first, pairs[i].second);
    ///  }
    ///}

    throw new Error(); // TODO: notify
  }

  static b2ParticleContactIsZombie(contact: b2ParticleContact): boolean {
    return (contact.flags & b2ParticleFlag.b2_zombieParticle) === b2ParticleFlag.b2_zombieParticle;
  }

  UpdateContacts(exceptZombie: boolean): void {
    this.UpdateProxies(this.m_proxyBuffer);
    this.SortProxies(this.m_proxyBuffer);

    ///b2ParticlePairSet particlePairs(&this.m_world.m_stackAllocator);
    let particlePairs = new b2ParticleSystem.b2ParticlePairSet(); // TODO: static
    this.NotifyContactListenerPreContact(particlePairs);

    this.FindContacts(this.m_contactBuffer);
    this.FilterContacts(this.m_contactBuffer);

    this.NotifyContactListenerPostContact(particlePairs);

    if (exceptZombie) {
      this.m_contactBuffer.RemoveIf(b2ParticleSystem.b2ParticleContactIsZombie);
    }
  }

  NotifyBodyContactListenerPreContact(fixtureSet: b2ParticleSystem.FixtureParticleSet): void {
    let contactListener = this.GetFixtureContactListener();
    if (contactListener === null)
      return;

    ///fixtureSet.Initialize(m_bodyContactBuffer.Begin(), m_bodyContactBuffer.GetCount(), GetFlagsBuffer());
    fixtureSet.Initialize(this.m_bodyContactBuffer, this.m_flagsBuffer);

    throw new Error(); // TODO: notify
  }

  NotifyBodyContactListenerPostContact(fixtureSet: b2ParticleSystem.FixtureParticleSet): void {
    let contactListener = this.GetFixtureContactListener();
    if (contactListener === null)
      return;

    // Loop through all new contacts, reporting any new ones, and
    // "invalidating" the ones that still exist.
    ///for (b2ParticleBodyContact* contact = m_bodyContactBuffer.Begin(); contact !== m_bodyContactBuffer.End(); ++contact)
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      b2Assert(contact !== null);
      ///FixtureParticle fixtureParticleToFind;
      ///fixtureParticleToFind.first = contact.fixture;
      ///fixtureParticleToFind.second = contact.index;
      ///const int32 index = fixtureSet.Find(fixtureParticleToFind);
      let index = -1; // TODO
      if (index >= 0) {
        // Already touching remove this from the set.
        fixtureSet.Invalidate(index);
      } else {
        // Just started touching, report it!
        contactListener.BeginContactFixtureParticle(this, contact);
      }
    }

    // If the contact listener is enabled, report all fixtures that are no
    // longer in contact with particles.
    ///const FixtureParticle* const fixtureParticles = fixtureSet.GetBuffer();
    ///const int8* const fixtureParticlesValid = fixtureSet.GetValidBuffer();
    ///const int32 fixtureParticleCount = fixtureSet.GetCount();
    ///for (int32 i = 0; i < fixtureParticleCount; ++i)
    ///{
    ///  if (fixtureParticlesValid[i])
    ///  {
    ///    const FixtureParticle* const fixtureParticle = &fixtureParticles[i];
    ///    contactListener.EndContactFixtureParticle(fixtureParticle.first, this, fixtureParticle.second);
    ///  }
    ///}

    throw new Error(); // TODO: notify
  }

  UpdateBodyContacts(): void {
    let s_aabb = b2ParticleSystem.UpdateBodyContacts_s_aabb;

    // If the particle contact listener is enabled, generate a set of
    // fixture / particle contacts.
    ///FixtureParticleSet fixtureSet(&m_world.m_stackAllocator);
    let fixtureSet = new b2ParticleSystem.FixtureParticleSet(); // TODO: static
    this.NotifyBodyContactListenerPreContact(fixtureSet);

    if (this.m_stuckThreshold > 0) {
      let particleCount = this.GetParticleCount();
      for (let i = 0; i < particleCount; i++) {
        // Detect stuck particles, see comment in
        // b2ParticleSystem::DetectStuckParticle()
        this.m_bodyContactCountBuffer.data[i] = 0;
        if (this.m_timestamp > (this.m_lastBodyContactStepBuffer.data[i] + 1)) {
          this.m_consecutiveContactStepsBuffer.data[i] = 0;
        }
      }
    }
    this.m_bodyContactBuffer.SetCount(0);
    this.m_stuckParticleBuffer.SetCount(0);

    let aabb = s_aabb;
    this.ComputeAABB(aabb);

    let callback = new b2ParticleSystem.UpdateBodyContactsCallback(this, this.GetFixtureContactFilter());
    this.m_world.QueryAABB(callback, aabb);

    if (this.m_def.strictContactCheck) {
      this.RemoveSpuriousBodyContacts();
    }

    this.NotifyBodyContactListenerPostContact(fixtureSet);
  }
  static UpdateBodyContacts_s_aabb = new b2AABB();

  Solve(step: b2TimeStep): void {
    let s_subStep = b2ParticleSystem.Solve_s_subStep;
    if (this.m_count === 0) {
      return;
    }
    // If particle lifetimes are enabled, destroy particles that are too old.
    if (this.m_expirationTimeBuffer.data) {
      this.SolveLifetimes(step);
    }
    if (this.m_allParticleFlags & b2ParticleFlag.b2_zombieParticle) {
      this.SolveZombie();
    }
    if (this.m_needsUpdateAllParticleFlags) {
      this.UpdateAllParticleFlags();
    }
    if (this.m_needsUpdateAllGroupFlags) {
      this.UpdateAllGroupFlags();
    }
    if (this.m_paused) {
      return;
    }
    for (this.m_iterationIndex = 0; this.m_iterationIndex < step.particleIterations; this.m_iterationIndex++) {
      ++this.m_timestamp;
      let subStep = s_subStep.Copy(step);
      subStep.dt /= step.particleIterations;
      subStep.inv_dt *= step.particleIterations;
      this.UpdateContacts(false);
      this.UpdateBodyContacts();
      this.ComputeWeight();
      if (this.m_allGroupFlags & b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
        this.ComputeDepth();
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_reactiveParticle) {
        this.UpdatePairsAndTriadsWithReactiveParticles();
      }
      if (this.m_hasForce) {
        this.SolveForce(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_viscousParticle) {
        this.SolveViscous();
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_repulsiveParticle) {
        this.SolveRepulsive(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_powderParticle) {
        this.SolvePowder(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_tensileParticle) {
        this.SolveTensile(subStep);
      }
      if (this.m_allGroupFlags & b2ParticleGroupFlag.b2_solidParticleGroup) {
        this.SolveSolid(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_colorMixingParticle) {
        this.SolveColorMixing();
      }
      this.SolveGravity(subStep);
      if (this.m_allParticleFlags & b2ParticleFlag.b2_staticPressureParticle) {
        this.SolveStaticPressure(subStep);
      }
      this.SolvePressure(subStep);
      this.SolveDamping(subStep);
      if (this.m_allParticleFlags & b2ParticleSystem.k_extraDampingFlags) {
        this.SolveExtraDamping();
      }
      // SolveElastic and SolveSpring refer the current velocities for
      // numerical stability, they should be called as late as possible.
      if (this.m_allParticleFlags & b2ParticleFlag.b2_elasticParticle) {
        this.SolveElastic(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_springParticle) {
        this.SolveSpring(subStep);
      }
      this.LimitVelocity(subStep);
      if (this.m_allGroupFlags & b2ParticleGroupFlag.b2_rigidParticleGroup) {
        this.SolveRigidDamping();
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_barrierParticle) {
        this.SolveBarrier(subStep);
      }
      // SolveCollision, SolveRigid and SolveWall should be called after
      // other force functions because they may require particles to have
      // specific velocities.
      this.SolveCollision(subStep);
      if (this.m_allGroupFlags & b2ParticleGroupFlag.b2_rigidParticleGroup) {
        this.SolveRigid(subStep);
      }
      if (this.m_allParticleFlags & b2ParticleFlag.b2_wallParticle) {
        this.SolveWall();
      }
      // The particle positions can be updated only at the end of substep.
      for (let i = 0; i < this.m_count; i++) {
        ///m_positionBuffer.data[i] += subStep.dt * m_velocityBuffer.data[i];
        this.m_positionBuffer.data[i].SelfMulAdd(subStep.dt, this.m_velocityBuffer.data[i]);
      }
    }
  }
  static Solve_s_subStep = new b2TimeStep();

  SolveCollision(step: b2TimeStep): void {
    let s_aabb = b2ParticleSystem.SolveCollision_s_aabb;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;

    // This function detects particles which are crossing boundary of bodies
    // and modifies velocities of them so that they will move just in front of
    // boundary. This function function also applies the reaction force to
    // bodies as precisely as the numerical stability is kept.
    let aabb = s_aabb;
    aabb.lowerBound.x = +b2_maxFloat;
    aabb.lowerBound.y = +b2_maxFloat;
    aabb.upperBound.x = -b2_maxFloat;
    aabb.upperBound.y = -b2_maxFloat;
    for (let i = 0; i < this.m_count; i++) {
      let v = vel_data[i];
      let p1 = pos_data[i];
      ///let p2 = p1 + step.dt * v;
      let p2_x = p1.x + step.dt * v.x;
      let p2_y = p1.y + step.dt * v.y;
      ///aabb.lowerBound = Math.min(aabb.lowerBound, Math.min(p1, p2));
      aabb.lowerBound.x = Math.min(aabb.lowerBound.x, Math.min(p1.x, p2_x));
      aabb.lowerBound.y = Math.min(aabb.lowerBound.y, Math.min(p1.y, p2_y));
      ///aabb.upperBound = Math.max(aabb.upperBound, Math.max(p1, p2));
      aabb.upperBound.x = Math.max(aabb.upperBound.x, Math.max(p1.x, p2_x));
      aabb.upperBound.y = Math.max(aabb.upperBound.y, Math.max(p1.y, p2_y));
    }
    let callback = new b2ParticleSystem.SolveCollisionCallback(this, step);
    this.m_world.QueryAABB(callback, aabb);
  }
  static SolveCollision_s_aabb = new b2AABB();

  LimitVelocity(step: b2TimeStep): void {
    let vel_data = this.m_velocityBuffer.data;
    let criticalVelocitySquared = this.GetCriticalVelocitySquared(step);
    for (let i = 0; i < this.m_count; i++) {
      let v = vel_data[i];
      let v2 = b2Vec2.DotVV(v, v);
      if (v2 > criticalVelocitySquared) {
        ///v *= Math.sqrt(criticalVelocitySquared / v2);
        v.SelfMul(Math.sqrt(criticalVelocitySquared / v2));
      }
    }
  }

  SolveGravity(step: b2TimeStep): void {
    let s_gravity = b2ParticleSystem.SolveGravity_s_gravity;
    let vel_data = this.m_velocityBuffer.data;
    ///b2Vec2 gravity = step.dt * m_def.gravityScale * m_world.GetGravity();
    let gravity = b2Vec2.MulSV(step.dt * this.m_def.gravityScale, this.m_world.GetGravity(), s_gravity);
    for (let i = 0; i < this.m_count; i++) {
      vel_data[i].SelfAdd(gravity);
    }
  }
  static SolveGravity_s_gravity = new b2Vec2();

  SolveBarrier(step: b2TimeStep): void {
    let s_aabb = b2ParticleSystem.SolveBarrier_s_aabb;
    let s_va = b2ParticleSystem.SolveBarrier_s_va;
    let s_vb = b2ParticleSystem.SolveBarrier_s_vb;
    let s_pba = b2ParticleSystem.SolveBarrier_s_pba;
    let s_vba = b2ParticleSystem.SolveBarrier_s_vba;
    let s_vc = b2ParticleSystem.SolveBarrier_s_vc;
    let s_pca = b2ParticleSystem.SolveBarrier_s_pca;
    let s_vca = b2ParticleSystem.SolveBarrier_s_vca;
    let s_qba = b2ParticleSystem.SolveBarrier_s_qba;
    let s_qca = b2ParticleSystem.SolveBarrier_s_qca;
    let s_dv = b2ParticleSystem.SolveBarrier_s_dv;
    let s_f = b2ParticleSystem.SolveBarrier_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    // If a particle is passing between paired barrier particles,
    // its velocity will be decelerated to avoid passing.
    for (let i = 0; i < this.m_count; i++) {
      let flags = this.m_flagsBuffer.data[i];
      ///if ((flags & b2ParticleSystem.k_barrierWallFlags) === b2ParticleSystem.k_barrierWallFlags)
      if ((flags & b2ParticleSystem.k_barrierWallFlags) !== 0) {
        vel_data[i].SetZero();
      }
    }
    let tmax = b2_barrierCollisionTime * step.dt;
    let mass = this.GetParticleMass();
    for (let k = 0; k < this.m_pairBuffer.count; k++) {
      let pair = this.m_pairBuffer.data[k];
      if (pair.flags & b2ParticleFlag.b2_barrierParticle) {
        let a = pair.indexA;
        let b = pair.indexB;
        let pa = pos_data[a];
        let pb = pos_data[b];
        /// b2AABB aabb;
        let aabb = s_aabb;
        ///aabb.lowerBound = Math.min(pa, pb);
        b2Vec2.MinV(pa, pb, aabb.lowerBound);
        ///aabb.upperBound = Math.max(pa, pb);
        b2Vec2.MaxV(pa, pb, aabb.upperBound);
        let aGroup = this.m_groupBuffer[a];
        let bGroup = this.m_groupBuffer[b];
        ///b2Vec2 va = GetLinearVelocity(aGroup, a, pa);
        let va = this.GetLinearVelocity(aGroup, a, pa, s_va);
        ///b2Vec2 vb = GetLinearVelocity(bGroup, b, pb);
        let vb = this.GetLinearVelocity(bGroup, b, pb, s_vb);
        ///b2Vec2 pba = pb - pa;
        let pba = b2Vec2.SubVV(pb, pa, s_pba);
        ///b2Vec2 vba = vb - va;
        let vba = b2Vec2.SubVV(vb, va, s_vba);
        ///InsideBoundsEnumerator enumerator = GetInsideBoundsEnumerator(aabb);
        let enumerator = this.GetInsideBoundsEnumerator(aabb);
        let c: number;
        while ((c = enumerator.GetNext()) >= 0) {
          let pc = pos_data[c];
          let cGroup = this.m_groupBuffer[c];
          if (aGroup !== cGroup && bGroup !== cGroup) {
            ///b2Vec2 vc = GetLinearVelocity(cGroup, c, pc);
            let vc = this.GetLinearVelocity(cGroup, c, pc, s_vc);
            // Solve the equation below:
            //   (1-s)*(pa+t*va)+s*(pb+t*vb) = pc+t*vc
            // which expresses that the particle c will pass a line
            // connecting the particles a and b at the time of t.
            // if s is between 0 and 1, c will pass between a and b.
            ///b2Vec2 pca = pc - pa;
            let pca = b2Vec2.SubVV(pc, pa, s_pca);
            ///b2Vec2 vca = vc - va;
            let vca = b2Vec2.SubVV(vc, va, s_vca);
            let e2 = b2Vec2.CrossVV(vba, vca);
            let e1 = b2Vec2.CrossVV(pba, vca) - b2Vec2.CrossVV(pca, vba);
            let e0 = b2Vec2.CrossVV(pba, pca);
            let s: number, t: number;
            ///b2Vec2 qba, qca;
            let qba = s_qba,
              qca = s_qca;
            if (e2 === 0) {
              if (e1 === 0) continue;
              t = -e0 / e1;
              if (!(t >= 0 && t < tmax)) continue;
              ///qba = pba + t * vba;
              b2Vec2.AddVMulSV(pba, t, vba, qba);
              ///qca = pca + t * vca;
              b2Vec2.AddVMulSV(pca, t, vca, qca);
              s = b2Vec2.DotVV(qba, qca) / b2Vec2.DotVV(qba, qba);
              if (!(s >= 0 && s <= 1)) continue;
            } else {
              let det = e1 * e1 - 4 * e0 * e2;
              if (det < 0) continue;
              let sqrtDet = Math.sqrt(det);
              let t1 = (-e1 - sqrtDet) / (2 * e2);
              let t2 = (-e1 + sqrtDet) / (2 * e2);
              ///if (t1 > t2) b2Swap(t1, t2);
              if (t1 > t2) {
                let tmp = t1;
                t1 = t2;
                t2 = tmp;
              }
              t = t1;
              ///qba = pba + t * vba;
              b2Vec2.AddVMulSV(pba, t, vba, qba);
              ///qca = pca + t * vca;
              b2Vec2.AddVMulSV(pca, t, vca, qca);
              ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
              s = b2Vec2.DotVV(qba, qca) / b2Vec2.DotVV(qba, qba);
              if (!(t >= 0 && t < tmax && s >= 0 && s <= 1)) {
                t = t2;
                if (!(t >= 0 && t < tmax)) continue;
                ///qba = pba + t * vba;
                b2Vec2.AddVMulSV(pba, t, vba, qba);
                ///qca = pca + t * vca;
                b2Vec2.AddVMulSV(pca, t, vca, qca);
                ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                s = b2Vec2.DotVV(qba, qca) / b2Vec2.DotVV(qba, qba);
                if (!(s >= 0 && s <= 1)) continue;
              }
            }
            // Apply a force to particle c so that it will have the
            // interpolated velocity at the collision point on line ab.
            ///b2Vec2 dv = va + s * vba - vc;
            let dv = s_dv;
            dv.x = va.x + s * vba.x - vc.x;
            dv.y = va.y + s * vba.y - vc.y;
            ///b2Vec2 f = GetParticleMass() * dv;
            let f = b2Vec2.MulSV(mass, dv, s_f);
            if (this.IsRigidGroup(cGroup)) {
              // If c belongs to a rigid group, the force will be
              // distributed in the group.
              let mass = cGroup.GetMass();
              let inertia = cGroup.GetInertia();
              if (mass > 0) {
                ///cGroup.m_linearVelocity += 1 / mass * f;
                cGroup.m_linearVelocity.SelfMulAdd(1 / mass, f);
              }
              if (inertia > 0) {
                ///cGroup.m_angularVelocity += b2Cross(pc - cGroup.GetCenter(), f) / inertia;
                cGroup.m_angularVelocity += b2Vec2.CrossVV(
                  b2Vec2.SubVV(pc, cGroup.GetCenter(), b2Vec2.s_t0),
                  f) / inertia;
              }
            } else {
              ///m_velocityBuffer.data[c] += dv;
              vel_data[c].SelfAdd(dv);
            }
            // Apply a reversed force to particle c after particle
            // movement so that momentum will be preserved.
            ///ParticleApplyForce(c, -step.inv_dt * f);
            this.ParticleApplyForce(c, f.SelfMul(-step.inv_dt));
          }
        }
      }
    }
  }
  static SolveBarrier_s_aabb = new b2AABB();
  static SolveBarrier_s_va = new b2Vec2();
  static SolveBarrier_s_vb = new b2Vec2();
  static SolveBarrier_s_pba = new b2Vec2();
  static SolveBarrier_s_vba = new b2Vec2();
  static SolveBarrier_s_vc = new b2Vec2();
  static SolveBarrier_s_pca = new b2Vec2();
  static SolveBarrier_s_vca = new b2Vec2();
  static SolveBarrier_s_qba = new b2Vec2();
  static SolveBarrier_s_qca = new b2Vec2();
  static SolveBarrier_s_dv = new b2Vec2();
  static SolveBarrier_s_f = new b2Vec2();

  SolveStaticPressure(step: b2TimeStep): void {
    this.m_staticPressureBuffer = this.RequestBuffer(this.m_staticPressureBuffer);
    let criticalPressure = this.GetCriticalPressure(step);
    let pressurePerWeight = this.m_def.staticPressureStrength * criticalPressure;
    let maxPressure = b2_maxParticlePressure * criticalPressure;
    let relaxation = this.m_def.staticPressureRelaxation;
    /// Compute pressure satisfying the modified Poisson equation:
    ///   Sum_for_j((p_i - p_j) * w_ij) + relaxation * p_i =
    ///   pressurePerWeight * (w_i - b2_minParticleWeight)
    /// by iterating the calculation:
    ///   p_i = (Sum_for_j(p_j * w_ij) + pressurePerWeight *
    ///         (w_i - b2_minParticleWeight)) / (w_i + relaxation)
    /// where
    ///   p_i and p_j are static pressure of particle i and j
    ///   w_ij is contact weight between particle i and j
    ///   w_i is sum of contact weight of particle i
    for (let t = 0; t < this.m_def.staticPressureIterations; t++) {
      ///memset(m_accumulationBuffer, 0, sizeof(*m_accumulationBuffer) * m_count);
      for (let i = 0; i < this.m_count; i++) {
        this.m_accumulationBuffer[i] = 0;
      }
      for (let k = 0; k < this.m_contactBuffer.count; k++) {
        let contact = this.m_contactBuffer.data[k];
        if (contact.flags & b2ParticleFlag.b2_staticPressureParticle) {
          let a = contact.indexA;
          let b = contact.indexB;
          let w = contact.weight;
          this.m_accumulationBuffer[a] += w * this.m_staticPressureBuffer[b]; // a <- b
          this.m_accumulationBuffer[b] += w * this.m_staticPressureBuffer[a]; // b <- a
        }
      }
      for (let i = 0; i < this.m_count; i++) {
        let w = this.m_weightBuffer[i];
        if (this.m_flagsBuffer.data[i] & b2ParticleFlag.b2_staticPressureParticle) {
          let wh = this.m_accumulationBuffer[i];
          let h =
            (wh + pressurePerWeight * (w - b2_minParticleWeight)) /
            (w + relaxation);
          this.m_staticPressureBuffer[i] = b2Clamp(h, 0.0, maxPressure);
        } else {
          this.m_staticPressureBuffer[i] = 0;
        }
      }
    }
  }

  ComputeWeight(): void {
    // calculates the sum of contact-weights for each particle
    // that means dimensionless density
    ///memset(m_weightBuffer, 0, sizeof(*m_weightBuffer) * m_count);
    for (let k = 0; k < this.m_count; k++) {
      this.m_weightBuffer[k] = 0;
    }
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      let w = contact.weight;
      this.m_weightBuffer[a] += w;
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let w = contact.weight;
      this.m_weightBuffer[a] += w;
      this.m_weightBuffer[b] += w;
    }
  }

  SolvePressure(step: b2TimeStep): void {
    let s_f = b2ParticleSystem.SolvePressure_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    // calculates pressure as a linear function of density
    let criticalPressure = this.GetCriticalPressure(step);
    let pressurePerWeight = this.m_def.pressureStrength * criticalPressure;
    let maxPressure = b2_maxParticlePressure * criticalPressure;
    for (let i = 0; i < this.m_count; i++) {
      let w = this.m_weightBuffer[i];
      let h = pressurePerWeight * Math.max(0.0, w - b2_minParticleWeight);
      this.m_accumulationBuffer[i] = Math.min(h, maxPressure);
    }
    // ignores particles which have their own repulsive force
    if (this.m_allParticleFlags & b2ParticleSystem.k_noPressureFlags) {
      for (let i = 0; i < this.m_count; i++) {
        if (this.m_flagsBuffer.data[i] & b2ParticleSystem.k_noPressureFlags) {
          this.m_accumulationBuffer[i] = 0;
        }
      }
    }
    // static pressure
    if (this.m_allParticleFlags & b2ParticleFlag.b2_staticPressureParticle) {
      b2Assert(this.m_staticPressureBuffer !== null);
      for (let i = 0; i < this.m_count; i++) {
        if (this.m_flagsBuffer.data[i] & b2ParticleFlag.b2_staticPressureParticle) {
          this.m_accumulationBuffer[i] += this.m_staticPressureBuffer[i];
        }
      }
    }
    // applies pressure between each particles in contact
    let velocityPerPressure = step.dt / (this.m_def.density * this.m_particleDiameter);
    let inv_mass = this.GetParticleInvMass();
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      let b = contact.body;
      let w = contact.weight;
      let m = contact.mass;
      let n = contact.normal;
      let p = pos_data[a];
      let h = this.m_accumulationBuffer[a] + pressurePerWeight * w;
      ///b2Vec2 f = velocityPerPressure * w * m * h * n;
      let f = b2Vec2.MulSV(velocityPerPressure * w * m * h, n, s_f);
      ///m_velocityBuffer.data[a] -= GetParticleInvMass() * f;
      vel_data[a].SelfMulSub(inv_mass, f);
      b.ApplyLinearImpulse(f, p, true);
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let w = contact.weight;
      let n = contact.normal;
      let h = this.m_accumulationBuffer[a] + this.m_accumulationBuffer[b];
      ///b2Vec2 f = velocityPerPressure * w * h * n;
      let f = b2Vec2.MulSV(velocityPerPressure * w * h, n, s_f);
      ///m_velocityBuffer.data[a] -= f;
      vel_data[a].SelfSub(f);
      ///m_velocityBuffer.data[b] += f;
      vel_data[b].SelfAdd(f);
    }
  }
  static SolvePressure_s_f = new b2Vec2();

  SolveDamping(step: b2TimeStep): void {
    let s_v = b2ParticleSystem.SolveDamping_s_v;
    let s_f = b2ParticleSystem.SolveDamping_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    // reduces normal velocity of each contact
    let linearDamping = this.m_def.dampingStrength;
    let quadraticDamping = 1 / this.GetCriticalVelocity(step);
    let inv_mass = this.GetParticleInvMass();
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      let b = contact.body;
      let w = contact.weight;
      let m = contact.mass;
      let n = contact.normal;
      let p = pos_data[a];
      ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
      let v = b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Vec2.s_t0), vel_data[a], s_v);
      let vn = b2Vec2.DotVV(v, n);
      if (vn < 0) {
        let damping = Math.max(linearDamping * w, Math.min(-quadraticDamping * vn, 0.5));
        ///b2Vec2 f = damping * m * vn * n;
        let f = b2Vec2.MulSV(damping * m * vn, n, s_f);
        ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
        vel_data[a].SelfMulAdd(inv_mass, f);
        ///b.ApplyLinearImpulse(-f, p, true);
        b.ApplyLinearImpulse(f.SelfNeg(), p, true);
      }
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let w = contact.weight;
      let n = contact.normal;
      ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
      let v = b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
      let vn = b2Vec2.DotVV(v, n);
      if (vn < 0) {
        ///float32 damping = Math.max(linearDamping * w, Math.min(- quadraticDamping * vn, 0.5f));
        let damping = Math.max(linearDamping * w, Math.min(-quadraticDamping * vn, 0.5));
        ///b2Vec2 f = damping * vn * n;
        let f = b2Vec2.MulSV(damping * vn, n, s_f);
        ///this.m_velocityBuffer.data[a] += f;
        vel_data[a].SelfAdd(f);
        ///this.m_velocityBuffer.data[b] -= f;
        vel_data[b].SelfSub(f);
      }
    }
  }
  static SolveDamping_s_v = new b2Vec2();
  static SolveDamping_s_f = new b2Vec2();

  SolveRigidDamping(): void {
    let s_t0 = b2ParticleSystem.SolveRigidDamping_s_t0;
    let s_t1 = b2ParticleSystem.SolveRigidDamping_s_t1;
    let s_p = b2ParticleSystem.SolveRigidDamping_s_p;
    let s_v = b2ParticleSystem.SolveRigidDamping_s_v;
    let invMassA = [0.0],
      invInertiaA = [0.0],
      tangentDistanceA = [0.0]; // TODO: static
    let invMassB = [0.0],
      invInertiaB = [0.0],
      tangentDistanceB = [0.0]; // TODO: static
    // Apply impulse to rigid particle groups colliding with other objects
    // to reduce relative velocity at the colliding point.
    let pos_data = this.m_positionBuffer.data;
    let damping = this.m_def.dampingStrength;
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      let aGroup = this.m_groupBuffer[a];
      if (this.IsRigidGroup(aGroup)) {
        let b = contact.body;
        let n = contact.normal;
        let w = contact.weight;
        let p = pos_data[a];
        ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - aGroup.GetLinearVelocityFromWorldPoint(p);
        let v = b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, s_t0), aGroup.GetLinearVelocityFromWorldPoint(p, s_t1), s_v);
        let vn = b2Vec2.DotVV(v, n);
        if (vn < 0) {
          // The group's average velocity at particle position 'p' is pushing
          // the particle into the body.
          ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, true, aGroup, a, p, n);
          this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, p, n);
          // Calculate b.m_I from public functions of b2Body.
          ///this.InitDampingParameter(&invMassB, &invInertiaB, &tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
          this.InitDampingParameter(invMassB, invInertiaB, tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
          ///float32 f = damping * Math.min(w, 1.0) * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
          let f = damping * Math.min(w, 1.0) * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
          ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, f, n);
          this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], true, aGroup, a, f, n);
          ///b.ApplyLinearImpulse(-f * n, p, true);
          b.ApplyLinearImpulse(b2Vec2.MulSV(-f, n, b2Vec2.s_t0), p, true);
        }
      }
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      let n = contact.normal;
      let w = contact.weight;
      let aGroup = this.m_groupBuffer[a];
      let bGroup = this.m_groupBuffer[b];
      let aRigid = this.IsRigidGroup(aGroup);
      let bRigid = this.IsRigidGroup(bGroup);
      if (aGroup !== bGroup && (aRigid || bRigid)) {
        ///b2Vec2 p = 0.5f * (this.m_positionBuffer.data[a] + this.m_positionBuffer.data[b]);
        let p = b2Vec2.MidVV(pos_data[a], pos_data[b], s_p);
        ///b2Vec2 v = GetLinearVelocity(bGroup, b, p) - GetLinearVelocity(aGroup, a, p);
        let v = b2Vec2.SubVV(this.GetLinearVelocity(bGroup, b, p, s_t0), this.GetLinearVelocity(aGroup, a, p, s_t1), s_v);
        let vn = b2Vec2.DotVV(v, n);
        if (vn < 0) {
          ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, aRigid, aGroup, a, p, n);
          this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, aRigid, aGroup, a, p, n);
          ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassB, &invInertiaB, &tangentDistanceB, bRigid, bGroup, b, p, n);
          this.InitDampingParameterWithRigidGroupOrParticle(invMassB, invInertiaB, tangentDistanceB, bRigid, bGroup, b, p, n);
          ///float32 f = damping * w * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
          let f = damping * w * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
          ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, aRigid, aGroup, a, f, n);
          this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], aRigid, aGroup, a, f, n);
          ///this.ApplyDamping(invMassB, invInertiaB, tangentDistanceB, bRigid, bGroup, b, -f, n);
          this.ApplyDamping(invMassB[0], invInertiaB[0], tangentDistanceB[0], bRigid, bGroup, b, -f, n);
        }
      }
    }
  }
  static SolveRigidDamping_s_t0 = new b2Vec2();
  static SolveRigidDamping_s_t1 = new b2Vec2();
  static SolveRigidDamping_s_p = new b2Vec2();
  static SolveRigidDamping_s_v = new b2Vec2();

  SolveExtraDamping(): void {
    let s_v = b2ParticleSystem.SolveExtraDamping_s_v;
    let s_f = b2ParticleSystem.SolveExtraDamping_s_f;
    let vel_data = this.m_velocityBuffer.data;
    // Applies additional damping force between bodies and particles which can
    // produce strong repulsive force. Applying damping force multiple times
    // is effective in suppressing vibration.
    let pos_data = this.m_positionBuffer.data;
    let inv_mass = this.GetParticleInvMass();
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      if (this.m_flagsBuffer.data[a] & b2ParticleSystem.k_extraDampingFlags) {
        let b = contact.body;
        let m = contact.mass;
        let n = contact.normal;
        let p = pos_data[a];
        ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
        let v = b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Vec2.s_t0), vel_data[a], s_v);
        ///float32 vn = b2Dot(v, n);
        let vn = b2Vec2.DotVV(v, n);
        if (vn < 0) {
          ///b2Vec2 f = 0.5f * m * vn * n;
          let f = b2Vec2.MulSV(0.5 * m * vn, n, s_f);
          ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
          vel_data[a].SelfMulAdd(inv_mass, f);
          ///b.ApplyLinearImpulse(-f, p, true);
          b.ApplyLinearImpulse(f.SelfNeg(), p, true);
        }
      }
    }
  }
  static SolveExtraDamping_s_v = new b2Vec2();
  static SolveExtraDamping_s_f = new b2Vec2();

  SolveWall(): void {
    let vel_data = this.m_velocityBuffer.data;
    for (let i = 0; i < this.m_count; i++) {
      if (this.m_flagsBuffer.data[i] & b2ParticleFlag.b2_wallParticle) {
        vel_data[i].SetZero();
      }
    }
  }

  SolveRigid(step: b2TimeStep): void {
    let s_position = b2ParticleSystem.SolveRigid_s_position;
    let s_rotation = b2ParticleSystem.SolveRigid_s_rotation;
    let s_transform = b2ParticleSystem.SolveRigid_s_transform;
    let s_velocityTransform = b2ParticleSystem.SolveRigid_s_velocityTransform;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    for (let group = this.m_groupList; group; group = group.GetNext()) {
      if (group.m_groupFlags & b2ParticleGroupFlag.b2_rigidParticleGroup) {
        group.UpdateStatistics();
        ///b2Rot rotation(step.dt * group.m_angularVelocity);
        let rotation = s_rotation;
        rotation.SetAngle(step.dt * group.m_angularVelocity);
        ///b2Transform transform(group.m_center + step.dt * group.m_linearVelocity - b2Mul(rotation, group.m_center), rotation);
        let position = b2Vec2.AddVV(
          group.m_center,
          b2Vec2.SubVV(
            b2Vec2.MulSV(step.dt, group.m_linearVelocity, b2Vec2.s_t0),
            b2Rot.MulRV(rotation, group.m_center, b2Vec2.s_t1),
            b2Vec2.s_t0),
          s_position);
        let transform = s_transform;
        transform.SetPositionRotation(position, rotation);
        ///group.m_transform = b2Mul(transform, group.m_transform);
        b2Transform.MulXX(transform, group.m_transform, group.m_transform);
        let velocityTransform = s_velocityTransform;
        velocityTransform.p.x = step.inv_dt * transform.p.x;
        velocityTransform.p.y = step.inv_dt * transform.p.y;
        velocityTransform.q.s = step.inv_dt * transform.q.s;
        velocityTransform.q.c = step.inv_dt * (transform.q.c - 1);
        for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
          ///m_velocityBuffer.data[i] = b2Mul(velocityTransform, m_positionBuffer.data[i]);
          b2Transform.MulXV(velocityTransform, pos_data[i], vel_data[i]);
        }
      }
    }
  }
  static SolveRigid_s_position = new b2Vec2();
  static SolveRigid_s_rotation = new b2Rot();
  static SolveRigid_s_transform = new b2Transform();
  static SolveRigid_s_velocityTransform = new b2Transform();

  SolveElastic(step: b2TimeStep): void {
    let s_pa = b2ParticleSystem.SolveElastic_s_pa;
    let s_pb = b2ParticleSystem.SolveElastic_s_pb;
    let s_pc = b2ParticleSystem.SolveElastic_s_pc;
    let s_r = b2ParticleSystem.SolveElastic_s_r;
    let s_t0 = b2ParticleSystem.SolveElastic_s_t0;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    let elasticStrength = step.inv_dt * this.m_def.elasticStrength;
    for (let k = 0; k < this.m_triadBuffer.count; k++) {
      let triad = this.m_triadBuffer.data[k];
      if (triad.flags & b2ParticleFlag.b2_elasticParticle) {
        let a = triad.indexA;
        let b = triad.indexB;
        let c = triad.indexC;
        let oa = triad.pa;
        let ob = triad.pb;
        let oc = triad.pc;
        ///b2Vec2 pa = m_positionBuffer.data[a];
        let pa = s_pa.Copy(pos_data[a]);
        ///b2Vec2 pb = m_positionBuffer.data[b];
        let pb = s_pb.Copy(pos_data[b]);
        ///b2Vec2 pc = m_positionBuffer.data[c];
        let pc = s_pc.Copy(pos_data[c]);
        let va = vel_data[a];
        let vb = vel_data[b];
        let vc = vel_data[c];
        ///pa += step.dt * va;
        pa.SelfMulAdd(step.dt, va);
        ///pb += step.dt * vb;
        pb.SelfMulAdd(step.dt, vb);
        ///pc += step.dt * vc;
        pc.SelfMulAdd(step.dt, vc);
        ///b2Vec2 midPoint = (float32) 1 / 3 * (pa + pb + pc);
        let midPoint_x = (pa.x + pb.x + pc.x) / 3.0;
        let midPoint_y = (pa.y + pb.y + pc.y) / 3.0;
        ///pa -= midPoint;
        pa.x -= midPoint_x;
        pa.y -= midPoint_y;
        ///pb -= midPoint;
        pb.x -= midPoint_x;
        pb.y -= midPoint_y;
        ///pc -= midPoint;
        pc.x -= midPoint_x;
        pc.y -= midPoint_y;
        ///b2Rot r;
        let r = s_r;
        r.s = b2Vec2.CrossVV(oa, pa) + b2Vec2.CrossVV(ob, pb) + b2Vec2.CrossVV(oc, pc);
        r.c = b2Vec2.DotVV(oa, pa) + b2Vec2.DotVV(ob, pb) + b2Vec2.DotVV(oc, pc);
        let r2 = r.s * r.s + r.c * r.c;
        let invR = b2InvSqrt(r2);
        if (!isFinite(invR)) {
          invR = 1.98177537e+019;
        }
        r.s *= invR;
        r.c *= invR;
        ///r.angle = Math.atan2(r.s, r.c); // TODO: optimize
        let strength = elasticStrength * triad.strength;
        ///va += strength * (b2Mul(r, oa) - pa);
        b2Rot.MulRV(r, oa, s_t0);
        b2Vec2.SubVV(s_t0, pa, s_t0);
        b2Vec2.MulSV(strength, s_t0, s_t0);
        va.SelfAdd(s_t0);
        ///vb += strength * (b2Mul(r, ob) - pb);
        b2Rot.MulRV(r, ob, s_t0);
        b2Vec2.SubVV(s_t0, pb, s_t0);
        b2Vec2.MulSV(strength, s_t0, s_t0);
        vb.SelfAdd(s_t0);
        ///vc += strength * (b2Mul(r, oc) - pc);
        b2Rot.MulRV(r, oc, s_t0);
        b2Vec2.SubVV(s_t0, pc, s_t0);
        b2Vec2.MulSV(strength, s_t0, s_t0);
        vc.SelfAdd(s_t0);
      }
    }
  }
  static SolveElastic_s_pa = new b2Vec2();
  static SolveElastic_s_pb = new b2Vec2();
  static SolveElastic_s_pc = new b2Vec2();
  static SolveElastic_s_r = new b2Rot();
  static SolveElastic_s_t0 = new b2Vec2();

  SolveSpring(step: b2TimeStep): void {
    let s_pa = b2ParticleSystem.SolveSpring_s_pa;
    let s_pb = b2ParticleSystem.SolveSpring_s_pb;
    let s_d = b2ParticleSystem.SolveSpring_s_d;
    let s_f = b2ParticleSystem.SolveSpring_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    let springStrength = step.inv_dt * this.m_def.springStrength;
    for (let k = 0; k < this.m_pairBuffer.count; k++) {
      let pair = this.m_pairBuffer.data[k];
      if (pair.flags & b2ParticleFlag.b2_springParticle) {
        ///int32 a = pair.indexA;
        let a = pair.indexA;
        ///int32 b = pair.indexB;
        let b = pair.indexB;
        ///b2Vec2 pa = m_positionBuffer.data[a];
        let pa = s_pa.Copy(pos_data[a]);
        ///b2Vec2 pb = m_positionBuffer.data[b];
        let pb = s_pb.Copy(pos_data[b]);
        ///b2Vec2& va = m_velocityBuffer.data[a];
        let va = vel_data[a];
        ///b2Vec2& vb = m_velocityBuffer.data[b];
        let vb = vel_data[b];
        ///pa += step.dt * va;
        pa.SelfMulAdd(step.dt, va);
        ///pb += step.dt * vb;
        pb.SelfMulAdd(step.dt, vb);
        ///b2Vec2 d = pb - pa;
        let d = b2Vec2.SubVV(pb, pa, s_d);
        ///float32 r0 = pair.distance;
        let r0 = pair.distance;
        ///float32 r1 = d.Length();
        let r1 = d.Length();
        ///float32 strength = springStrength * pair.strength;
        let strength = springStrength * pair.strength;
        ///b2Vec2 f = strength * (r0 - r1) / r1 * d;
        let f = b2Vec2.MulSV(strength * (r0 - r1) / r1, d, s_f);
        ///va -= f;
        va.SelfSub(f);
        ///vb += f;
        vb.SelfAdd(f);
      }
    }
  }
  static SolveSpring_s_pa = new b2Vec2();
  static SolveSpring_s_pb = new b2Vec2();
  static SolveSpring_s_d = new b2Vec2();
  static SolveSpring_s_f = new b2Vec2();

  SolveTensile(step: b2TimeStep): void {
    let s_weightedNormal = b2ParticleSystem.SolveTensile_s_weightedNormal;
    let s_s = b2ParticleSystem.SolveTensile_s_s;
    let s_f = b2ParticleSystem.SolveTensile_s_f;
    let vel_data = this.m_velocityBuffer.data;
    b2Assert(this.m_accumulation2Buffer !== null);
    for (let i = 0; i < this.m_count; i++) {
      this.m_accumulation2Buffer[i] = new b2Vec2();
      this.m_accumulation2Buffer[i].SetZero();
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      if (contact.flags & b2ParticleFlag.b2_tensileParticle) {
        let a = contact.indexA;
        let b = contact.indexB;
        let w = contact.weight;
        let n = contact.normal;
        ///b2Vec2 weightedNormal = (1 - w) * w * n;
        let weightedNormal = b2Vec2.MulSV((1 - w) * w, n, s_weightedNormal);
        ///m_accumulation2Buffer[a] -= weightedNormal;
        this.m_accumulation2Buffer[a].SelfSub(weightedNormal);
        ///m_accumulation2Buffer[b] += weightedNormal;
        this.m_accumulation2Buffer[b].SelfAdd(weightedNormal);
      }
    }
    let criticalVelocity = this.GetCriticalVelocity(step);
    let pressureStrength = this.m_def.surfaceTensionPressureStrength * criticalVelocity;
    let normalStrength = this.m_def.surfaceTensionNormalStrength * criticalVelocity;
    let maxVelocityVariation = b2_maxParticleForce * criticalVelocity;
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      if (contact.flags & b2ParticleFlag.b2_tensileParticle) {
        let a = contact.indexA;
        let b = contact.indexB;
        let w = contact.weight;
        let n = contact.normal;
        let h = this.m_weightBuffer[a] + this.m_weightBuffer[b];
        ///b2Vec2 s = m_accumulation2Buffer[b] - m_accumulation2Buffer[a];
        let s = b2Vec2.SubVV(this.m_accumulation2Buffer[b], this.m_accumulation2Buffer[a], s_s);
        let fn = Math.min(
          pressureStrength * (h - 2) + normalStrength * b2Vec2.DotVV(s, n),
          maxVelocityVariation) * w;
        ///b2Vec2 f = fn * n;
        let f = b2Vec2.MulSV(fn, n, s_f);
        ///m_velocityBuffer.data[a] -= f;
        vel_data[a].SelfSub(f);
        ///m_velocityBuffer.data[b] += f;
        vel_data[b].SelfAdd(f);
      }
    }
  }
  static SolveTensile_s_weightedNormal = new b2Vec2();
  static SolveTensile_s_s = new b2Vec2();
  static SolveTensile_s_f = new b2Vec2();

  SolveViscous(): void {
    let s_v = b2ParticleSystem.SolveViscous_s_v;
    let s_f = b2ParticleSystem.SolveViscous_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    let viscousStrength = this.m_def.viscousStrength;
    let inv_mass = this.GetParticleInvMass();
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      if (this.m_flagsBuffer.data[a] & b2ParticleFlag.b2_viscousParticle) {
        let b = contact.body;
        let w = contact.weight;
        let m = contact.mass;
        let p = pos_data[a];
        ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
        let v = b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Vec2.s_t0), vel_data[a], s_v);
        ///b2Vec2 f = viscousStrength * m * w * v;
        let f = b2Vec2.MulSV(viscousStrength * m * w, v, s_f);
        ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
        vel_data[a].SelfMulAdd(inv_mass, f);
        ///b.ApplyLinearImpulse(-f, p, true);
        b.ApplyLinearImpulse(f.SelfNeg(), p, true);
      }
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      if (contact.flags & b2ParticleFlag.b2_viscousParticle) {
        let a = contact.indexA;
        let b = contact.indexB;
        let w = contact.weight;
        ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
        let v = b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
        ///b2Vec2 f = viscousStrength * w * v;
        let f = b2Vec2.MulSV(viscousStrength * w, v, s_f);
        ///m_velocityBuffer.data[a] += f;
        vel_data[a].SelfAdd(f);
        ///m_velocityBuffer.data[b] -= f;
        vel_data[b].SelfSub(f);
      }
    }
  }
  static SolveViscous_s_v = new b2Vec2();
  static SolveViscous_s_f = new b2Vec2();

  SolveRepulsive(step: b2TimeStep): void {
    let s_f = b2ParticleSystem.SolveRepulsive_s_f;
    let vel_data = this.m_velocityBuffer.data;
    let repulsiveStrength = this.m_def.repulsiveStrength * this.GetCriticalVelocity(step);
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      if (contact.flags & b2ParticleFlag.b2_repulsiveParticle) {
        let a = contact.indexA;
        let b = contact.indexB;
        if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
          let w = contact.weight;
          let n = contact.normal;
          ///b2Vec2 f = repulsiveStrength * w * n;
          let f = b2Vec2.MulSV(repulsiveStrength * w, n, s_f);
          ///m_velocityBuffer.data[a] -= f;
          vel_data[a].SelfSub(f);
          ///m_velocityBuffer.data[b] += f;
          vel_data[b].SelfAdd(f);
        }
      }
    }
  }
  static SolveRepulsive_s_f = new b2Vec2();

  SolvePowder(step: b2TimeStep): void {
    let s_f = b2ParticleSystem.SolvePowder_s_f;
    let pos_data = this.m_positionBuffer.data;
    let vel_data = this.m_velocityBuffer.data;
    let powderStrength = this.m_def.powderStrength * this.GetCriticalVelocity(step);
    let minWeight = 1.0 - b2_particleStride;
    let inv_mass = this.GetParticleInvMass();
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      let a = contact.index;
      if (this.m_flagsBuffer.data[a] & b2ParticleFlag.b2_powderParticle) {
        let w = contact.weight;
        if (w > minWeight) {
          let b = contact.body;
          let m = contact.mass;
          let p = pos_data[a];
          let n = contact.normal;
          let f = b2Vec2.MulSV(powderStrength * m * (w - minWeight), n, s_f);
          vel_data[a].SelfMulSub(inv_mass, f);
          b.ApplyLinearImpulse(f, p, true);
        }
      }
    }
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      if (contact.flags & b2ParticleFlag.b2_powderParticle) {
        let w = contact.weight;
        if (w > minWeight) {
          let a = contact.indexA;
          let b = contact.indexB;
          let n = contact.normal;
          let f = b2Vec2.MulSV(powderStrength * (w - minWeight), n, s_f);
          vel_data[a].SelfSub(f);
          vel_data[b].SelfAdd(f);
        }
      }
    }
  }
  static SolvePowder_s_f = new b2Vec2();

  SolveSolid(step: b2TimeStep): void {
    let s_f = b2ParticleSystem.SolveSolid_s_f;
    let vel_data = this.m_velocityBuffer.data;
    // applies extra repulsive force from solid particle groups
    this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer);
    let ejectionStrength = step.inv_dt * this.m_def.ejectionStrength;
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      let a = contact.indexA;
      let b = contact.indexB;
      if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
        let w = contact.weight;
        let n = contact.normal;
        let h = this.m_depthBuffer[a] + this.m_depthBuffer[b];
        let f = b2Vec2.MulSV(ejectionStrength * h * w, n, s_f);
        vel_data[a].SelfSub(f);
        vel_data[b].SelfAdd(f);
      }
    }
  }
  static SolveSolid_s_f = new b2Vec2();

  SolveForce(step: b2TimeStep): void {
    let vel_data = this.m_velocityBuffer.data;
    let velocityPerForce = step.dt * this.GetParticleInvMass();
    for (let i = 0; i < this.m_count; i++) {
      ///m_velocityBuffer.data[i] += velocityPerForce * m_forceBuffer[i];
      vel_data[i].SelfMulAdd(velocityPerForce, this.m_forceBuffer[i]);
    }
    this.m_hasForce = false;
  }

  SolveColorMixing(): void {
    // mixes color between contacting particles
    b2Assert(this.m_colorBuffer.data !== null);
    const colorMixing = 0.5 * this.m_def.colorMixingStrength;
    if (colorMixing) {
      for (let k = 0; k < this.m_contactBuffer.count; k++) {
        let contact = this.m_contactBuffer.data[k];
        let a = contact.indexA;
        let b = contact.indexB;
        if (this.m_flagsBuffer.data[a] & this.m_flagsBuffer.data[b] &
          b2ParticleFlag.b2_colorMixingParticle) {
          let colorA = this.m_colorBuffer.data[a];
          let colorB = this.m_colorBuffer.data[b];
          // Use the static method to ensure certain compilers inline
          // this correctly.
          b2Color.MixColors(colorA, colorB, colorMixing);
        }
      }
    }
  }

  SolveZombie(): void {
    // removes particles with zombie flag
    let newCount = 0;
    ///int32* newIndices = (int32*) this.m_world.m_stackAllocator.Allocate(sizeof(int32) * this.m_count);
    let newIndices: number[] = []; // TODO: static
    for (let i = 0; i < this.m_count; i++) {
      newIndices[i] = b2_invalidParticleIndex;
    }
    b2Assert(newIndices.length === this.m_count);
    let allParticleFlags = 0;
    for (let i = 0; i < this.m_count; i++) {
      let flags = this.m_flagsBuffer.data[i];
      if (flags & b2ParticleFlag.b2_zombieParticle) {
        let destructionListener = this.m_world.m_destructionListener;
        if ((flags & b2ParticleFlag.b2_destructionListenerParticle) && destructionListener) {
          destructionListener.SayGoodbyeParticle(this, i);
        }
        // Destroy particle handle.
        if (this.m_handleIndexBuffer.data) {
          let handle = this.m_handleIndexBuffer.data[i];
          if (handle) {
            handle.SetIndex(b2_invalidParticleIndex);
            this.m_handleIndexBuffer.data[i] = null;
            ///m_handleAllocator.Free(handle);
          }
        }
        newIndices[i] = b2_invalidParticleIndex;
      } else {
        newIndices[i] = newCount;
        if (i !== newCount) {
          // Update handle to reference new particle index.
          if (this.m_handleIndexBuffer.data) {
            let handle = this.m_handleIndexBuffer.data[i];
            if (handle) handle.SetIndex(newCount);
            this.m_handleIndexBuffer.data[newCount] = handle;
          }
          this.m_flagsBuffer.data[newCount] = this.m_flagsBuffer.data[i];
          if (this.m_lastBodyContactStepBuffer.data) {
            this.m_lastBodyContactStepBuffer.data[newCount] = this.m_lastBodyContactStepBuffer.data[i];
          }
          if (this.m_bodyContactCountBuffer.data) {
            this.m_bodyContactCountBuffer.data[newCount] = this.m_bodyContactCountBuffer.data[i];
          }
          if (this.m_consecutiveContactStepsBuffer.data) {
            this.m_consecutiveContactStepsBuffer.data[newCount] = this.m_consecutiveContactStepsBuffer.data[i];
          }
          this.m_positionBuffer.data[newCount].Copy(this.m_positionBuffer.data[i]);
          this.m_velocityBuffer.data[newCount].Copy(this.m_velocityBuffer.data[i]);
          this.m_groupBuffer[newCount] = this.m_groupBuffer[i];
          if (this.m_hasForce) {
            this.m_forceBuffer[newCount].Copy(this.m_forceBuffer[i]);
          }
          if (this.m_staticPressureBuffer) {
            this.m_staticPressureBuffer[newCount] = this.m_staticPressureBuffer[i];
          }
          if (this.m_depthBuffer) {
            this.m_depthBuffer[newCount] = this.m_depthBuffer[i];
          }
          if (this.m_colorBuffer.data) {
            this.m_colorBuffer.data[newCount].Copy(this.m_colorBuffer.data[i]);
          }
          if (this.m_userDataBuffer.data) {
            this.m_userDataBuffer.data[newCount] = this.m_userDataBuffer.data[i];
          }
          if (this.m_expirationTimeBuffer.data) {
            this.m_expirationTimeBuffer.data[newCount] = this.m_expirationTimeBuffer.data[i];
          }
        }
        newCount++;
        allParticleFlags |= flags;
      }
    }

    // predicate functions
    let Test = {
      ///static bool IsProxyInvalid(const Proxy& proxy)
      IsProxyInvalid: function(proxy: b2ParticleSystem.Proxy) {
        return proxy.index < 0;
      },
      ///static bool IsContactInvalid(const b2ParticleContact& contact)
      IsContactInvalid: function(contact: b2ParticleContact) {
        return contact.indexA < 0 || contact.indexB < 0;
      },
      ///static bool IsBodyContactInvalid(const b2ParticleBodyContact& contact)
      IsBodyContactInvalid: function(contact: b2ParticleBodyContact) {
        return contact.index < 0;
      },
      ///static bool IsPairInvalid(const b2ParticlePair& pair)
      IsPairInvalid: function(pair: b2ParticlePair) {
        return pair.indexA < 0 || pair.indexB < 0;
      },
      ///static bool IsTriadInvalid(const b2ParticleTriad& triad)
      IsTriadInvalid: function(triad: b2ParticleTriad) {
        return triad.indexA < 0 || triad.indexB < 0 || triad.indexC < 0;
      }
    };

    // update proxies
    for (let k = 0; k < this.m_proxyBuffer.count; k++) {
      let proxy = this.m_proxyBuffer.data[k];
      proxy.index = newIndices[proxy.index];
    }
    this.m_proxyBuffer.RemoveIf(Test.IsProxyInvalid);

    // update contacts
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      contact.indexA = newIndices[contact.indexA];
      contact.indexB = newIndices[contact.indexB];
    }
    this.m_contactBuffer.RemoveIf(Test.IsContactInvalid);

    // update particle-body contacts
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      contact.index = newIndices[contact.index];
    }
    this.m_bodyContactBuffer.RemoveIf(Test.IsBodyContactInvalid);

    // update pairs
    for (let k = 0; k < this.m_pairBuffer.count; k++) {
      let pair = this.m_pairBuffer.data[k];
      pair.indexA = newIndices[pair.indexA];
      pair.indexB = newIndices[pair.indexB];
    }
    this.m_pairBuffer.RemoveIf(Test.IsPairInvalid);

    // update triads
    for (let k = 0; k < this.m_triadBuffer.count; k++) {
      let triad = this.m_triadBuffer.data[k];
      triad.indexA = newIndices[triad.indexA];
      triad.indexB = newIndices[triad.indexB];
      triad.indexC = newIndices[triad.indexC];
    }
    this.m_triadBuffer.RemoveIf(Test.IsTriadInvalid);

    // Update lifetime indices.
    if (this.m_indexByExpirationTimeBuffer.data) {
      let writeOffset = 0;
      for (let readOffset = 0; readOffset < this.m_count; readOffset++) {
        let newIndex = newIndices[this.m_indexByExpirationTimeBuffer.data[readOffset]];
        if (newIndex !== b2_invalidParticleIndex) {
          this.m_indexByExpirationTimeBuffer.data[writeOffset++] = newIndex;
        }
      }
    }

    // update groups
    for (let group = this.m_groupList; group; group = group.GetNext()) {
      let firstIndex = newCount;
      let lastIndex = 0;
      let modified = false;
      for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
        let j = newIndices[i];
        if (j >= 0) {
          firstIndex = Math.min(firstIndex, j);
          lastIndex = Math.max(lastIndex, j + 1);
        } else {
          modified = true;
        }
      }
      if (firstIndex < lastIndex) {
        group.m_firstIndex = firstIndex;
        group.m_lastIndex = lastIndex;
        if (modified) {
          if (group.m_groupFlags & b2ParticleGroupFlag.b2_solidParticleGroup) {
            this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
          }
        }
      } else {
        group.m_firstIndex = 0;
        group.m_lastIndex = 0;
        if (!(group.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupCanBeEmpty)) {
          this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed);
        }
      }
    }

    // update particle count
    this.m_count = newCount;
    ///m_world.m_stackAllocator.Free(newIndices);
    this.m_allParticleFlags = allParticleFlags;
    this.m_needsUpdateAllParticleFlags = false;

    // destroy bodies with no particles
    for (let group = this.m_groupList; group; ) {
      let next = group.GetNext();
      if (group.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed) {
        this.DestroyParticleGroup(group);
      }
      group = next;
    }
  }

  /**
   * Destroy all particles which have outlived their lifetimes set
   * by SetParticleLifetime().
   */
  SolveLifetimes(step: b2TimeStep): void {
    b2Assert(this.m_expirationTimeBuffer.data !== null);
    b2Assert(this.m_indexByExpirationTimeBuffer.data !== null);
    // Update the time elapsed.
    this.m_timeElapsed = this.LifetimeToExpirationTime(step.dt);
    // Get the floor (non-fractional component) of the elapsed time.
    let quantizedTimeElapsed = this.GetQuantizedTimeElapsed();

    let expirationTimes = this.m_expirationTimeBuffer.data;
    let expirationTimeIndices = this.m_indexByExpirationTimeBuffer.data;
    let particleCount = this.GetParticleCount();
    // Sort the lifetime buffer if it's required.
    if (this.m_expirationTimeBufferRequiresSorting) {
      ///const ExpirationTimeComparator expirationTimeComparator(expirationTimes);
      ///std::sort(expirationTimeIndices, expirationTimeIndices + particleCount, expirationTimeComparator);

      /**
       * Compare the lifetime of particleIndexA and particleIndexB
       * returning true if the lifetime of A is greater than B for
       * particles that will expire.  If either particle's lifetime is
       * infinite (<= 0.0f) this function return true if the lifetime
       * of A is lesser than B. When used with std::sort() this
       * results in an array of particle indicies sorted in reverse
       * order by particle lifetime.
       *
       * For example, the set of lifetimes
       * (1.0, 0.7, 0.3, 0.0, -1.0, 2.0)
       * would be sorted as
       * (0.0, 1.0, -2.0, 1.0, 0.7, 0.3)
       */
      let ExpirationTimeComparator = function(particleIndexA: number, particleIndexB: number): boolean {
        let expirationTimeA = expirationTimes[particleIndexA];
        let expirationTimeB = expirationTimes[particleIndexB];
        let infiniteExpirationTimeA = expirationTimeA <= 0.0;
        let infiniteExpirationTimeB = expirationTimeB <= 0.0;
        return infiniteExpirationTimeA === infiniteExpirationTimeB ?
          expirationTimeA > expirationTimeB : infiniteExpirationTimeA;
      };

      std_sort(expirationTimeIndices, 0, particleCount, ExpirationTimeComparator);

      this.m_expirationTimeBufferRequiresSorting = false;
    }

    // Destroy particles which have expired.
    for (let i = particleCount - 1; i >= 0; --i) {
      let particleIndex = expirationTimeIndices[i];
      let expirationTime = expirationTimes[particleIndex];
      // If no particles need to be destroyed, skip this.
      if (quantizedTimeElapsed < expirationTime || expirationTime <= 0) {
        break;
      }
      // Destroy this particle.
      this.DestroyParticle(particleIndex);
    }
  }

  RotateBuffer(start: number, mid: number, end: number): void {
    // move the particles assigned to the given group toward the end of array
    if (start === mid || mid === end) {
      return;
    }
    b2Assert(mid >= start && mid <= end);

    function newIndices(i: number): number {
      if (i < start) {
        return i;
      } else if (i < mid) {
        return i + end - mid;
      } else if (i < end) {
        return i + start - mid;
      } else {
        return i;
      }
    }

    ///std::rotate(m_flagsBuffer.data + start, m_flagsBuffer.data + mid, m_flagsBuffer.data + end);
    std_rotate(this.m_flagsBuffer.data, start, mid, end);
    if (this.m_lastBodyContactStepBuffer.data) {
      ///std::rotate(m_lastBodyContactStepBuffer.data + start, m_lastBodyContactStepBuffer.data + mid, m_lastBodyContactStepBuffer.data + end);
      std_rotate(this.m_lastBodyContactStepBuffer.data, start, mid, end);
    }
    if (this.m_bodyContactCountBuffer.data) {
      ///std::rotate(m_bodyContactCountBuffer.data + start, m_bodyContactCountBuffer.data + mid, m_bodyContactCountBuffer.data + end);
      std_rotate(this.m_bodyContactCountBuffer.data, start, mid, end);
    }
    if (this.m_consecutiveContactStepsBuffer.data) {
      ///std::rotate(m_consecutiveContactStepsBuffer.data + start, m_consecutiveContactStepsBuffer.data + mid, m_consecutiveContactStepsBuffer.data + end);
      std_rotate(this.m_consecutiveContactStepsBuffer.data, start, mid, end);
    }
    ///std::rotate(m_positionBuffer.data + start, m_positionBuffer.data + mid, m_positionBuffer.data + end);
    std_rotate(this.m_positionBuffer.data, start, mid, end);
    ///std::rotate(m_velocityBuffer.data + start, m_velocityBuffer.data + mid, m_velocityBuffer.data + end);
    std_rotate(this.m_velocityBuffer.data, start, mid, end);
    ///std::rotate(m_groupBuffer + start, m_groupBuffer + mid, m_groupBuffer + end);
    std_rotate(this.m_groupBuffer, start, mid, end);
    if (this.m_hasForce) {
      ///std::rotate(m_forceBuffer + start, m_forceBuffer + mid, m_forceBuffer + end);
      std_rotate(this.m_forceBuffer, start, mid, end);
    }
    if (this.m_staticPressureBuffer) {
      ///std::rotate(m_staticPressureBuffer + start, m_staticPressureBuffer + mid, m_staticPressureBuffer + end);
      std_rotate(this.m_staticPressureBuffer, start, mid, end);
    }
    if (this.m_depthBuffer) {
      ///std::rotate(m_depthBuffer + start, m_depthBuffer + mid, m_depthBuffer + end);
      std_rotate(this.m_depthBuffer, start, mid, end);
    }
    if (this.m_colorBuffer.data) {
      ///std::rotate(m_colorBuffer.data + start, m_colorBuffer.data + mid, m_colorBuffer.data + end);
      std_rotate(this.m_colorBuffer.data, start, mid, end);
    }
    if (this.m_userDataBuffer.data) {
      ///std::rotate(m_userDataBuffer.data + start, m_userDataBuffer.data + mid, m_userDataBuffer.data + end);
      std_rotate(this.m_userDataBuffer.data, start, mid, end);
    }

    // Update handle indices.
    if (this.m_handleIndexBuffer.data) {
      ///std::rotate(m_handleIndexBuffer.data + start, m_handleIndexBuffer.data + mid, m_handleIndexBuffer.data + end);
      std_rotate(this.m_handleIndexBuffer.data, start, mid, end);
      for (let i = start; i < end; ++i) {
        let handle = this.m_handleIndexBuffer.data[i];
        if (handle) handle.SetIndex(newIndices(handle.GetIndex()));
      }
    }

    if (this.m_expirationTimeBuffer.data) {
      ///std::rotate(m_expirationTimeBuffer.data + start, m_expirationTimeBuffer.data + mid, m_expirationTimeBuffer.data + end);
      std_rotate(this.m_expirationTimeBuffer.data, start, mid, end);
      // Update expiration time buffer indices.
      let particleCount = this.GetParticleCount();
      let indexByExpirationTime = this.m_indexByExpirationTimeBuffer.data;
      for (let i = 0; i < particleCount; ++i) {
        indexByExpirationTime[i] = newIndices(indexByExpirationTime[i]);
      }
    }

    // update proxies
    for (let k = 0; k < this.m_proxyBuffer.count; k++) {
      let proxy = this.m_proxyBuffer.data[k];
      proxy.index = newIndices(proxy.index);
    }

    // update contacts
    for (let k = 0; k < this.m_contactBuffer.count; k++) {
      let contact = this.m_contactBuffer.data[k];
      contact.indexA = newIndices(contact.indexA);
      contact.indexB = newIndices(contact.indexB);
    }

    // update particle-body contacts
    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
      let contact = this.m_bodyContactBuffer.data[k];
      contact.index = newIndices(contact.index);
    }

    // update pairs
    for (let k = 0; k < this.m_pairBuffer.count; k++) {
      let pair = this.m_pairBuffer.data[k];
      pair.indexA = newIndices(pair.indexA);
      pair.indexB = newIndices(pair.indexB);
    }

    // update triads
    for (let k = 0; k < this.m_triadBuffer.count; k++) {
      let triad = this.m_triadBuffer.data[k];
      triad.indexA = newIndices(triad.indexA);
      triad.indexB = newIndices(triad.indexB);
      triad.indexC = newIndices(triad.indexC);
    }

    // update groups
    for (let group = this.m_groupList; group; group = group.GetNext()) {
      group.m_firstIndex = newIndices(group.m_firstIndex);
      group.m_lastIndex = newIndices(group.m_lastIndex - 1) + 1;
    }
  }

  GetCriticalVelocity(step: b2TimeStep): number {
    return this.m_particleDiameter * step.inv_dt;
  }

  GetCriticalVelocitySquared(step: b2TimeStep): number {
    let velocity = this.GetCriticalVelocity(step);
    return velocity * velocity;
  }

  GetCriticalPressure(step: b2TimeStep): number {
    return this.m_def.density * this.GetCriticalVelocitySquared(step);
  }

  GetParticleStride(): number {
    return b2_particleStride * this.m_particleDiameter;
  }

  GetParticleMass(): number {
    let stride = this.GetParticleStride();
    return this.m_def.density * stride * stride;
  }

  GetParticleInvMass(): number {
    ///return 1.777777 * this.m_inverseDensity * this.m_inverseDiameter * this.m_inverseDiameter;
    // mass = density * stride^2, so we take the inverse of this.
    let inverseStride = this.m_inverseDiameter * (1.0 / b2_particleStride);
    return this.m_inverseDensity * inverseStride * inverseStride;
  }

  /**
   * Get the world's contact filter if any particles with the
   * b2_contactFilterParticle flag are present in the system.
   */
  GetFixtureContactFilter(): b2ContactFilter {
    return (this.m_allParticleFlags & b2ParticleFlag.b2_fixtureContactFilterParticle) ?
      this.m_world.m_contactManager.m_contactFilter : null;
  }

  /**
   * Get the world's contact filter if any particles with the
   * b2_particleContactFilterParticle flag are present in the
   * system.
   */
  GetParticleContactFilter(): b2ContactFilter {
    return (this.m_allParticleFlags & b2ParticleFlag.b2_particleContactFilterParticle) ?
      this.m_world.m_contactManager.m_contactFilter : null;
  }

  /**
   * Get the world's contact listener if any particles with the
   * b2_fixtureContactListenerParticle flag are present in the
   * system.
   */
  GetFixtureContactListener(): b2ContactListener {
    return (this.m_allParticleFlags & b2ParticleFlag.b2_fixtureContactListenerParticle) ?
      this.m_world.m_contactManager.m_contactListener : null;
  }

  /**
   * Get the world's contact listener if any particles with the
   * b2_particleContactListenerParticle flag are present in the
   * system.
   */
  GetParticleContactListener(): b2ContactListener {
    return (this.m_allParticleFlags & b2ParticleFlag.b2_particleContactListenerParticle) ?
      this.m_world.m_contactManager.m_contactListener : null;
  }

  SetUserOverridableBuffer(buffer: b2ParticleSystem.UserOverridableBuffer<any>, newData: any[], newCapacity: number): void {
    b2Assert(((newData !== null) && (newCapacity > 0)) || ((newData === null) && (newCapacity === 0)));
    ///if (!buffer.userSuppliedCapacity)
    ///{
    ///this.m_world.m_blockAllocator.Free(buffer.data, sizeof(T) * m_internalAllocatedCapacity);
    ///}
    buffer.data = newData;
    buffer.userSuppliedCapacity = newCapacity;
  }

  SetGroupFlags(group: b2ParticleGroup, newFlags: b2ParticleGroupFlag): void {
    let oldFlags = group.m_groupFlags;
    if ((oldFlags ^ newFlags) & b2ParticleGroupFlag.b2_solidParticleGroup) {
      // If the b2_solidParticleGroup flag changed schedule depth update.
      newFlags |= b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth;
    }
    if (oldFlags & ~newFlags) {
      // If any flags might be removed
      this.m_needsUpdateAllGroupFlags = true;
    }
    if (~this.m_allGroupFlags & newFlags) {
      // If any flags were added
      if (newFlags & b2ParticleGroupFlag.b2_solidParticleGroup) {
        this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer);
      }
      this.m_allGroupFlags |= newFlags;
    }
    group.m_groupFlags = newFlags;
  }

  static BodyContactCompare(lhs: b2ParticleBodyContact, rhs: b2ParticleBodyContact): boolean {
    if (lhs.index === rhs.index) {
      // Subsort by weight, decreasing.
      return lhs.weight > rhs.weight;
    }
    return lhs.index < rhs.index;
  }

  RemoveSpuriousBodyContacts(): void {
    // At this point we have a list of contact candidates based on AABB
    // overlap.The AABB query that  generated this returns all collidable
    // fixtures overlapping particle bounding boxes.  This breaks down around
    // vertices where two shapes intersect, such as a "ground" surface made
    // of multiple b2PolygonShapes; it potentially applies a lot of spurious
    // impulses from normals that should not actually contribute.  See the
    // Ramp example in Testbed.
    //
    // To correct for this, we apply this algorithm:
    //   * sort contacts by particle and subsort by weight (nearest to farthest)
    //   * for each contact per particle:
    //      - project a point at the contact distance along the inverse of the
    //        contact normal
    //      - if this intersects the fixture that generated the contact, apply
    //         it, otherwise discard as impossible
    //      - repeat for up to n nearest contacts, currently we get good results
    //        from n=3.
    ///std::sort(m_bodyContactBuffer.Begin(), m_bodyContactBuffer.End(), b2ParticleSystem::BodyContactCompare);
    std_sort(this.m_bodyContactBuffer.data, 0, this.m_bodyContactBuffer.count, b2ParticleSystem.BodyContactCompare);

    ///int32 discarded = 0;
    ///std::remove_if(m_bodyContactBuffer.Begin(), m_bodyContactBuffer.End(), b2ParticleBodyContactRemovePredicate(this, &discarded));
    ///
    ///m_bodyContactBuffer.SetCount(m_bodyContactBuffer.GetCount() - discarded);

    let s_n = b2ParticleSystem.RemoveSpuriousBodyContacts_s_n;
    let s_pos = b2ParticleSystem.RemoveSpuriousBodyContacts_s_pos;
    let s_normal = b2ParticleSystem.RemoveSpuriousBodyContacts_s_normal;

    // Max number of contacts processed per particle, from nearest to farthest.
    // This must be at least 2 for correctness with concave shapes; 3 was
    // experimentally arrived at as looking reasonable.
    let k_maxContactsPerPoint = 3;
    let system = this;
    // Index of last particle processed.
    let lastIndex = -1;
    // Number of contacts processed for the current particle.
    let currentContacts = 0;
    // Output the number of discarded contacts.
    // let discarded = 0;
    let b2ParticleBodyContactRemovePredicate = function(contact: b2ParticleBodyContact): boolean {
      // This implements the selection criteria described in
      // RemoveSpuriousBodyContacts().
      // This functor is iterating through a list of Body contacts per
      // Particle, ordered from near to far.  For up to the maximum number of
      // contacts we allow per point per step, we verify that the contact
      // normal of the Body that genenerated the contact makes physical sense
      // by projecting a point back along that normal and seeing if it
      // intersects the fixture generating the contact.

      if (contact.index !== lastIndex) {
        currentContacts = 0;
        lastIndex = contact.index;
      }

      if (currentContacts++ > k_maxContactsPerPoint) {
        // ++discarded;
        return true;
      }

      // Project along inverse normal (as returned in the contact) to get the
      // point to check.
      ///b2Vec2 n = contact.normal;
      let n = s_n.Copy(contact.normal);
      // weight is 1-(inv(diameter) * distance)
      ///n *= system.m_particleDiameter * (1 - contact.weight);
      n.SelfMul(system.m_particleDiameter * (1 - contact.weight));
      ///b2Vec2 pos = system.m_positionBuffer.data[contact.index] + n;
      let pos = b2Vec2.AddVV(system.m_positionBuffer.data[contact.index], n, s_pos);

      // pos is now a point projected back along the contact normal to the
      // contact distance. If the surface makes sense for a contact, pos will
      // now lie on or in the fixture generating
      if (!contact.fixture.TestPoint(pos)) {
        let childCount = contact.fixture.GetShape().GetChildCount();
        for (let childIndex = 0; childIndex < childCount; childIndex++) {
          let normal = s_normal;
          let distance = contact.fixture.ComputeDistance(pos, normal, childIndex);
          if (distance < b2_linearSlop) {
            return false;
          }
        }
        // ++discarded;
        return true;
      }

      return false;
    };
    this.m_bodyContactBuffer.count = std_remove_if(this.m_bodyContactBuffer.data, b2ParticleBodyContactRemovePredicate, this.m_bodyContactBuffer.count);
  }
  private static RemoveSpuriousBodyContacts_s_n = new b2Vec2();
  private static RemoveSpuriousBodyContacts_s_pos = new b2Vec2();
  private static RemoveSpuriousBodyContacts_s_normal = new b2Vec2();

  DetectStuckParticle(particle: number): void {
    // Detect stuck particles
    //
    // The basic algorithm is to allow the user to specify an optional
    // threshold where we detect whenever a particle is contacting
    // more than one fixture for more than threshold consecutive
    // steps. This is considered to be "stuck", and these are put
    // in a list the user can query per step, if enabled, to deal with
    // such particles.

    if (this.m_stuckThreshold <= 0) {
      return;
    }

    // Get the state variables for this particle.
    ///int32 * const consecutiveCount = &m_consecutiveContactStepsBuffer.data[particle];
    ///int32 * const lastStep = &m_lastBodyContactStepBuffer.data[particle];
    ///int32 * const bodyCount = &m_bodyContactCountBuffer.data[particle];

    // This is only called when there is a body contact for this particle.
    ///++(*bodyCount);
    ++this.m_bodyContactCountBuffer.data[particle];

    // We want to only trigger detection once per step, the first time we
    // contact more than one fixture in a step for a given particle.
    ///if (*bodyCount === 2)
    if (this.m_bodyContactCountBuffer.data[particle] === 2) {
      ///++(*consecutiveCount);
      ++this.m_consecutiveContactStepsBuffer.data[particle];
      ///if (*consecutiveCount > m_stuckThreshold)
      if (this.m_consecutiveContactStepsBuffer.data[particle] > this.m_stuckThreshold) {
        ///int32& newStuckParticle = m_stuckParticleBuffer.Append();
        ///newStuckParticle = particle;
        this.m_stuckParticleBuffer.data[this.m_stuckParticleBuffer.Append()] = particle;
      }
    }
    ///*lastStep = m_timestamp;
    this.m_lastBodyContactStepBuffer.data[particle] = this.m_timestamp;
  }

  /**
   * Determine whether a particle index is valid.
   */
  ValidateParticleIndex(index: number): boolean {
    return index >= 0 && index < this.GetParticleCount() &&
      index !== b2_invalidParticleIndex;
  }

  /**
   * Get the time elapsed in
   * b2ParticleSystemDef::lifetimeGranularity.
   */
  GetQuantizedTimeElapsed(): number {
    ///return (int32)(m_timeElapsed >> 32);
    return Math.floor(this.m_timeElapsed / 0x100000000);
  }

  /**
   * Convert a lifetime in seconds to an expiration time.
   */
  LifetimeToExpirationTime(lifetime: number): number {
    ///return m_timeElapsed + (int64)((lifetime / m_def.lifetimeGranularity) * (float32)(1LL << 32));
    return this.m_timeElapsed + Math.floor(((lifetime / this.m_def.lifetimeGranularity) * 0x100000000));
  }

  ForceCanBeApplied(flags: b2ParticleFlag): boolean {
    return !(flags & b2ParticleFlag.b2_wallParticle);
  }

  PrepareForceBuffer(): void {
    if (!this.m_hasForce) {
      ///memset(m_forceBuffer, 0, sizeof(*m_forceBuffer) * m_count);
      for (let i = 0; i < this.m_count; i++) {
        this.m_forceBuffer[i].SetZero();
      }
      this.m_hasForce = true;
    }
  }

  IsRigidGroup(group: b2ParticleGroup): boolean {
    return (group !== null) && ((group.m_groupFlags & b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0);
  }

  GetLinearVelocity(group: b2ParticleGroup, particleIndex: number, point: b2Vec2, out: b2Vec2): b2Vec2 {
    if (this.IsRigidGroup(group)) {
      return group.GetLinearVelocityFromWorldPoint(point, out);
    } else {
      ///return m_velocityBuffer.data[particleIndex];
      return out.Copy(this.m_velocityBuffer.data[particleIndex]);
    }
  }

  InitDampingParameter(invMass: number[], invInertia: number[], tangentDistance: number[], mass: number, inertia: number, center: b2Vec2, point: b2Vec2, normal: b2Vec2): void {
    ///*invMass = mass > 0 ? 1 / mass : 0;
    invMass[0] = mass > 0 ? 1 / mass : 0;
    ///*invInertia = inertia > 0 ? 1 / inertia : 0;
    invInertia[0] = inertia > 0 ? 1 / inertia : 0;
    ///*tangentDistance = b2Cross(point - center, normal);
    tangentDistance[0] = b2Vec2.CrossVV(b2Vec2.SubVV(point, center, b2Vec2.s_t0), normal);
  }

  InitDampingParameterWithRigidGroupOrParticle(invMass: number[], invInertia: number[], tangentDistance: number[], isRigidGroup: boolean, group: b2ParticleGroup, particleIndex: number, point: b2Vec2, normal: b2Vec2): void {
    if (isRigidGroup) {
      this.InitDampingParameter(invMass, invInertia, tangentDistance, group.GetMass(), group.GetInertia(), group.GetCenter(), point, normal);
    } else {
      let flags = this.m_flagsBuffer.data[particleIndex];
      this.InitDampingParameter(invMass, invInertia, tangentDistance, flags & b2ParticleFlag.b2_wallParticle ? 0 : this.GetParticleMass(), 0, point, point, normal);
    }
  }

  ComputeDampingImpulse(invMassA: number, invInertiaA: number, tangentDistanceA: number, invMassB: number, invInertiaB: number, tangentDistanceB: number, normalVelocity: number): number {
    let invMass =
      invMassA + invInertiaA * tangentDistanceA * tangentDistanceA +
      invMassB + invInertiaB * tangentDistanceB * tangentDistanceB;
    return invMass > 0 ? normalVelocity / invMass : 0;
  }

  ApplyDamping(invMass: number, invInertia: number, tangentDistance: number, isRigidGroup: boolean, group: b2ParticleGroup, particleIndex: number, impulse: number, normal: b2Vec2): void {
    if (isRigidGroup) {
      ///group.m_linearVelocity += impulse * invMass * normal;
      group.m_linearVelocity.SelfMulAdd(impulse * invMass, normal);
      ///group.m_angularVelocity += impulse * tangentDistance * invInertia;
      group.m_angularVelocity += impulse * tangentDistance * invInertia;
    } else {
      ///m_velocityBuffer.data[particleIndex] += impulse * invMass * normal;
      this.m_velocityBuffer.data[particleIndex].SelfMulAdd(impulse * invMass, normal);
    }
  }
}

export namespace b2ParticleSystem {

export class UserOverridableBuffer<T> {
  data: T[] = null;
  userSuppliedCapacity: number = 0;
}

export class Proxy {
  index: number = b2_invalidParticleIndex;
  tag: number = 0;
  static CompareProxyProxy(a: Proxy, b: Proxy): boolean {
    return a.tag < b.tag;
  }
  static CompareTagProxy(a: number, b: Proxy): boolean {
    return a < b.tag;
  }
  static CompareProxyTag(a: Proxy, b: number): boolean {
    return a.tag < b;
  }
}

export class InsideBoundsEnumerator {
  m_system: b2ParticleSystem;
  m_xLower: number;
  m_xUpper: number;
  m_yLower: number;
  m_yUpper: number;
  m_first: number;
  m_last: number;
  /**
   * InsideBoundsEnumerator enumerates all particles inside the
   * given bounds.
   *
   * Construct an enumerator with bounds of tags and a range of
   * proxies.
   */
  constructor(system: b2ParticleSystem, lower: number, upper: number, first: number, last: number) {
    this.m_system = system;
    this.m_xLower = (lower & b2ParticleSystem.xMask) >>> 0;
    this.m_xUpper = (upper & b2ParticleSystem.xMask) >>> 0;
    this.m_yLower = (lower & b2ParticleSystem.yMask) >>> 0;
    this.m_yUpper = (upper & b2ParticleSystem.yMask) >>> 0;
    this.m_first = first;
    this.m_last = last;
    b2Assert(this.m_first <= this.m_last);
  }

  /**
   * Get index of the next particle. Returns
   * b2_invalidParticleIndex if there are no more particles.
   */
  GetNext(): number {
    while (this.m_first < this.m_last) {
      let xTag = (this.m_system.m_proxyBuffer.data[this.m_first].tag & b2ParticleSystem.xMask) >>> 0;
      ///#if B2_ASSERT_ENABLED
      ///let yTag = (this.m_system.m_proxyBuffer.data[this.m_first].tag & b2ParticleSystem.yMask) >>> 0;
      ///b2Assert(yTag >= this.m_yLower);
      ///b2Assert(yTag <= this.m_yUpper);
      ///#endif
      if (xTag >= this.m_xLower && xTag <= this.m_xUpper) {
        return (this.m_system.m_proxyBuffer.data[this.m_first++]).index;
      }
      this.m_first++;
    }
    return b2_invalidParticleIndex;
  }
}

export class ParticleListNode {
  /**
   * The head of the list.
   */
  list: b2ParticleSystem.ParticleListNode = null;
  /**
   * The next node in the list.
   */
  next: b2ParticleSystem.ParticleListNode = null;
  /**
   * Number of entries in the list. Valid only for the node at the
   * head of the list.
   */
  count: number = 0;
  /**
   * Particle index.
   */
  index: number = 0;
}

/**
 * @constructor
 */
export class FixedSetAllocator {
  Allocate(itemSize: number, count: number): number {
    // TODO
    return count;
  }

  Clear(): void {
    // TODO
  }

  GetCount(): number {
    // TODO
    return 0;
  }

  Invalidate(itemIndex: number): void {
    // TODO
  }

  GetValidBuffer(): boolean[] {
    // TODO
    return [];
  }

  GetBuffer(): any[] {
    // TODO
    return [];
  }

  SetCount(count: number): void {
    // TODO
  }
}

export class FixtureParticle {
  first: b2Fixture = null;
  second: number = b2_invalidParticleIndex;
  constructor(fixture: b2Fixture, particle: number) {
    this.first = fixture;
    this.second = particle;
  }
}

export class FixtureParticleSet extends b2ParticleSystem.FixedSetAllocator {
  Initialize(bodyContactBuffer: b2GrowableBuffer<b2ParticleBodyContact>, flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>): void {
    // TODO
  }
  Find(pair: b2ParticleSystem.FixtureParticle): number {
    // TODO
    return b2_invalidParticleIndex;
  }
}

export class ParticlePair {
  first: number = b2_invalidParticleIndex;
  second: number = b2_invalidParticleIndex;
  constructor(particleA: number, particleB: number) {
    this.first = particleA;
    this.second = particleB;
  }
}

export class b2ParticlePairSet extends b2ParticleSystem.FixedSetAllocator {
  Initialize(contactBuffer: b2GrowableBuffer<b2ParticleContact>, flagsBuffer: UserOverridableBuffer<b2ParticleFlag>): void {
    // TODO
  }

  /**
   * @return {number}
   * @param {b2ParticleSystem.ParticlePair} pair
   */
  Find(pair: b2ParticleSystem.ParticlePair): number {
    // TODO
    return b2_invalidParticleIndex;
  }
}

export class ConnectionFilter {
  /**
   * Is the particle necessary for connection?
   * A pair or a triad should contain at least one 'necessary'
   * particle.
   */
  IsNecessary(index: number): boolean {
    return true;
  }

  /**
   * An additional condition for creating a pair.
   */
  ShouldCreatePair(a: number, b: number): boolean {
    return true;
  }

  /**
   * An additional condition for creating a triad.
   */
  ShouldCreateTriad(a: number, b: number, c: number): boolean {
    return true;
  }
}

export class DestroyParticlesInShapeCallback extends b2QueryCallback {
  m_system: b2ParticleSystem = null;
  m_shape: b2Shape = null;
  m_xf: b2Transform = null;
  m_callDestructionListener: boolean = false;
  m_destroyed: number = 0;

  constructor(system: b2ParticleSystem, shape: b2Shape, xf: b2Transform, callDestructionListener: boolean) {
    super();
    this.m_system = system;
    this.m_shape = shape;
    this.m_xf = xf;
    this.m_callDestructionListener = callDestructionListener;
    this.m_destroyed = 0;
  }

  ReportFixture(fixture: b2Fixture): boolean {
    return false;
  }

  ReportParticle(particleSystem: b2ParticleSystem, index: number): boolean {
    if (particleSystem !== this.m_system)
      return false;
    b2Assert(index >= 0 && index < this.m_system.m_count);
    if (this.m_shape.TestPoint(this.m_xf, this.m_system.m_positionBuffer.data[index])) {
      this.m_system.DestroyParticle(index, this.m_callDestructionListener);
      this.m_destroyed++;
    }
    return true;
  }

  Destroyed(): number {
    return this.m_destroyed;
  }
}

export class JoinParticleGroupsFilter extends b2ParticleSystem.ConnectionFilter {
  m_threshold: number = 0;

  constructor(threshold: number) {
    super();
    this.m_threshold = threshold;
  }

  /**
   * An additional condition for creating a pair.
   */
  ShouldCreatePair(a: number, b: number): boolean {
    return (a < this.m_threshold && this.m_threshold <= b) ||
      (b < this.m_threshold && this.m_threshold <= a);
  }

  /**
   * An additional condition for creating a triad.
   */
  ShouldCreateTriad(a: number, b: number, c: number): boolean {
    return (a < this.m_threshold || b < this.m_threshold || c < this.m_threshold) &&
      (this.m_threshold <= a || this.m_threshold <= b || this.m_threshold <= c);
  }
}

export class CompositeShape extends b2Shape {
  constructor(shapes: b2Shape[], shapeCount: number) {
    super(b2ShapeType.e_unknown, 0);
    this.m_shapes = shapes;
    this.m_shapeCount = shapeCount;
  }

  m_shapes: b2Shape[] = null;
  m_shapeCount: number = 0;

  Clone(): b2Shape {
    b2Assert(false);
    return null;
  }

  GetChildCount(): number {
    return 1;
  }

  /**
   * @see b2Shape::TestPoint
   */
  TestPoint(xf: b2Transform, p: b2Vec2): boolean {
    for (let i = 0; i < this.m_shapeCount; i++) {
      if (this.m_shapes[i].TestPoint(xf, p)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @see b2Shape::ComputeDistance
   */
  ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number {
    b2Assert(false);
    return 0;
  }

  /**
   * Implement b2Shape.
   */
  RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean {
    b2Assert(false);
    return false;
  }

  /**
   * @see b2Shape::ComputeAABB
   */
  ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void {
    let s_subaabb = new b2AABB();
    aabb.lowerBound.x = +b2_maxFloat;
    aabb.lowerBound.y = +b2_maxFloat;
    aabb.upperBound.x = -b2_maxFloat;
    aabb.upperBound.y = -b2_maxFloat;
    b2Assert(childIndex === 0);
    for (let i = 0; i < this.m_shapeCount; i++) {
      let childCount = this.m_shapes[i].GetChildCount();
      for (let j = 0; j < childCount; j++) {
        let subaabb = s_subaabb;
        this.m_shapes[i].ComputeAABB(subaabb, xf, j);
        aabb.Combine1(subaabb);
      }
    }
  }

  /**
   * @see b2Shape::ComputeMass
   */
  ComputeMass(massData: b2MassData, density: number): void {
    b2Assert(false);
  }

  public SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void {
    b2Assert(false);
  }

  public ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number {
    b2Assert(false);
    return 0;
  }

  public Dump(log: (format: string, ...args: any[]) => void): void {
    b2Assert(false);
  }
}

export class ReactiveFilter extends b2ParticleSystem.ConnectionFilter {
  m_flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag> = null;
  constructor(flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>) {
    super();
    this.m_flagsBuffer = flagsBuffer;
  }
  IsNecessary(index: number): boolean {
    return (this.m_flagsBuffer.data[index] & b2ParticleFlag.b2_reactiveParticle) !== 0;
  }
}

export class UpdateBodyContactsCallback extends b2FixtureParticleQueryCallback {
  m_contactFilter: b2ContactFilter;
  constructor(system: b2ParticleSystem, contactFilter: b2ContactFilter) {
    super(system); // base class constructor
    this.m_contactFilter = contactFilter;
  }

  ShouldCollideFixtureParticle(fixture: b2Fixture, particleSystem: b2ParticleSystem, particleIndex: number): boolean {
    // Call the contact filter if it's set, to determine whether to
    // filter this contact.  Returns true if contact calculations should
    // be performed, false otherwise.
    if (this.m_contactFilter) {
      let flags = this.m_system.GetFlagsBuffer();
      if (flags[particleIndex] & b2ParticleFlag.b2_fixtureContactFilterParticle) {
        return this.m_contactFilter.ShouldCollideFixtureParticle(fixture, this.m_system, particleIndex);
      }
    }
    return true;
  }

  ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, a: number): void {
    let s_n = b2ParticleSystem.UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n;
    let s_rp = b2ParticleSystem.UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp;
    let ap = this.m_system.m_positionBuffer.data[a];
    let n = s_n;
    let d = fixture.ComputeDistance(ap, n, childIndex);
    if (d < this.m_system.m_particleDiameter && this.ShouldCollideFixtureParticle(fixture, this.m_system, a)) {
      let b = fixture.GetBody();
      let bp = b.GetWorldCenter();
      let bm = b.GetMass();
      let bI = b.GetInertia() - bm * b.GetLocalCenter().LengthSquared();
      let invBm = bm > 0 ? 1 / bm : 0;
      let invBI = bI > 0 ? 1 / bI : 0;
      let invAm =
        this.m_system.m_flagsBuffer.data[a] &
        b2ParticleFlag.b2_wallParticle ? 0 : this.m_system.GetParticleInvMass();
      ///b2Vec2 rp = ap - bp;
      let rp = b2Vec2.SubVV(ap, bp, s_rp);
      let rpn = b2Vec2.CrossVV(rp, n);
      let invM = invAm + invBm + invBI * rpn * rpn;

      ///b2ParticleBodyContact& contact = m_system.m_bodyContactBuffer.Append();
      let contact = this.m_system.m_bodyContactBuffer.data[this.m_system.m_bodyContactBuffer.Append()];
      contact.index = a;
      contact.body = b;
      contact.fixture = fixture;
      contact.weight = 1 - d * this.m_system.m_inverseDiameter;
      ///contact.normal = -n;
      contact.normal.Copy(n.SelfNeg());
      contact.mass = invM > 0 ? 1 / invM : 0;
      this.m_system.DetectStuckParticle(a);
    }
  }
  static ReportFixtureAndParticle_s_n = new b2Vec2();
  static ReportFixtureAndParticle_s_rp = new b2Vec2();
}

export class SolveCollisionCallback extends b2FixtureParticleQueryCallback {
  m_step: b2TimeStep;
  constructor(system: b2ParticleSystem, step: b2TimeStep) {
    super(system); // base class constructor
    this.m_step = step;
  }

  ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, a: number): void {
    let s_p1 = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_p1;
    let s_output = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_output;
    let s_input = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_input;
    let s_p = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_p;
    let s_v = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_v;
    let s_f = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_f;

    let body = fixture.GetBody();
    let ap = this.m_system.m_positionBuffer.data[a];
    let av = this.m_system.m_velocityBuffer.data[a];
    let output = s_output;
    let input = s_input;
    if (this.m_system.m_iterationIndex === 0) {
      // Put 'ap' in the local space of the previous frame
      ///b2Vec2 p1 = b2MulT(body.m_xf0, ap);
      let p1 = b2Transform.MulTXV(body.m_xf0, ap, s_p1);
      if (fixture.GetShape().GetType() === b2ShapeType.e_circleShape) {
        // Make relative to the center of the circle
        ///p1 -= body.GetLocalCenter();
        p1.SelfSub(body.GetLocalCenter());
        // Re-apply rotation about the center of the circle
        ///p1 = b2Mul(body.m_xf0.q, p1);
        b2Rot.MulRV(body.m_xf0.q, p1, p1);
        // Subtract rotation of the current frame
        ///p1 = b2MulT(body.m_xf.q, p1);
        b2Rot.MulTRV(body.m_xf.q, p1, p1);
        // Return to local space
        ///p1 += body.GetLocalCenter();
        p1.SelfAdd(body.GetLocalCenter());
      }
      // Return to global space and apply rotation of current frame
      ///input.p1 = b2Mul(body.m_xf, p1);
      b2Transform.MulXV(body.m_xf, p1, input.p1);
    } else {
      ///input.p1 = ap;
      input.p1.Copy(ap);
    }
    ///input.p2 = ap + m_step.dt * av;
    b2Vec2.AddVMulSV(ap, this.m_step.dt, av, input.p2);
    input.maxFraction = 1;
    if (fixture.RayCast(output, input, childIndex)) {
      let n = output.normal;
      ///b2Vec2 p = (1 - output.fraction) * input.p1 + output.fraction * input.p2 + b2_linearSlop * n;
      let p = s_p;
      p.x = (1 - output.fraction) * input.p1.x + output.fraction * input.p2.x + b2_linearSlop * n.x;
      p.y = (1 - output.fraction) * input.p1.y + output.fraction * input.p2.y + b2_linearSlop * n.y;
      ///b2Vec2 v = m_step.inv_dt * (p - ap);
      let v = s_v;
      v.x = this.m_step.inv_dt * (p.x - ap.x);
      v.y = this.m_step.inv_dt * (p.y - ap.y);
      ///m_system.m_velocityBuffer.data[a] = v;
      this.m_system.m_velocityBuffer.data[a].Copy(v);
      ///b2Vec2 f = m_step.inv_dt * m_system.GetParticleMass() * (av - v);
      let f = s_f;
      f.x = this.m_step.inv_dt * this.m_system.GetParticleMass() * (av.x - v.x);
      f.y = this.m_step.inv_dt * this.m_system.GetParticleMass() * (av.y - v.y);
      this.m_system.ParticleApplyForce(a, f);
    }
  }
  static ReportFixtureAndParticle_s_p1 = new b2Vec2();
  static ReportFixtureAndParticle_s_output = new b2RayCastOutput();
  static ReportFixtureAndParticle_s_input = new b2RayCastInput();
  static ReportFixtureAndParticle_s_p = new b2Vec2();
  static ReportFixtureAndParticle_s_v = new b2Vec2();
  static ReportFixtureAndParticle_s_f = new b2Vec2();

  /**
   * @export
   * @return {boolean}
   * @param {b2ParticleSystem} system
   * @param {number} index
   */
  ReportParticle(system: b2ParticleSystem, index: number): boolean {
    return false;
  }
}

}

///#endif
