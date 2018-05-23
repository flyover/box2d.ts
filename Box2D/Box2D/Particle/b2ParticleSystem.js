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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Draw", "../Collision/b2Collision", "../Collision/Shapes/b2Shape", "../Collision/Shapes/b2EdgeShape", "../Dynamics/b2TimeStep", "../Dynamics/b2WorldCallbacks", "./b2Particle", "./b2ParticleGroup", "./b2VoronoiDiagram"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function b2Assert(condition) { }
    function std_iter_swap(array, a, b) {
        const tmp = array[a];
        array[a] = array[b];
        array[b] = tmp;
    }
    function default_compare(a, b) { return a < b; }
    function std_sort(array, first = 0, len = array.length - first, cmp = default_compare) {
        let left = first;
        let stack = [];
        let pos = 0;
        for (;;) { /* outer loop */
            for (; left + 1 < len; len++) { /* sort left to len-1 */
                let pivot = array[left + Math.floor(Math.random() * (len - left))]; /* pick random pivot */
                stack[pos++] = len; /* sort right part later */
                for (let right = left - 1;;) { /* inner loop: partitioning */
                    while (cmp(array[++right], pivot)) { } /* look for greater element */
                    while (cmp(pivot, array[--len])) { } /* look for smaller element */
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
    }
    function std_stable_sort(array, first = 0, len = array.length - first, cmp = default_compare) {
        return std_sort(array, first, len, cmp);
    }
    function std_remove_if(array, predicate, length = array.length) {
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
    }
    function std_lower_bound(array, first, last, val, cmp = default_compare) {
        let count = last - first;
        while (count > 0) {
            let step = Math.floor(count / 2);
            let it = first + step;
            if (cmp(array[it], val)) {
                first = ++it;
                count -= step + 1;
            }
            else
                count = step;
        }
        return first;
    }
    function std_upper_bound(array, first, last, val, cmp = default_compare) {
        let count = last - first;
        while (count > 0) {
            let step = Math.floor(count / 2);
            let it = first + step;
            if (!cmp(val, array[it])) {
                first = ++it;
                count -= step + 1;
            }
            else
                count = step;
        }
        return first;
    }
    function std_rotate(array, first, n_first, last) {
        let next = n_first;
        while (first !== next) {
            std_iter_swap(array, first++, next++);
            if (next === last)
                next = n_first;
            else if (first === n_first)
                n_first = next;
        }
    }
    function std_unique(array, first, last, cmp) {
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
    var b2Settings_1, b2Settings_2, b2Math_1, b2Draw_1, b2Collision_1, b2Shape_1, b2EdgeShape_1, b2TimeStep_1, b2WorldCallbacks_1, b2Particle_1, b2ParticleGroup_1, b2VoronoiDiagram_1, b2GrowableBuffer, b2FixtureParticleQueryCallback, b2ParticleContact, b2ParticleBodyContact, b2ParticlePair, b2ParticleTriad, b2ParticleSystemDef, b2ParticleSystem;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
                b2Settings_2 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            },
            function (b2EdgeShape_1_1) {
                b2EdgeShape_1 = b2EdgeShape_1_1;
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            },
            function (b2WorldCallbacks_1_1) {
                b2WorldCallbacks_1 = b2WorldCallbacks_1_1;
            },
            function (b2Particle_1_1) {
                b2Particle_1 = b2Particle_1_1;
            },
            function (b2ParticleGroup_1_1) {
                b2ParticleGroup_1 = b2ParticleGroup_1_1;
            },
            function (b2VoronoiDiagram_1_1) {
                b2VoronoiDiagram_1 = b2VoronoiDiagram_1_1;
            }
        ],
        execute: function () {
            ;
            ;
            ;
            ;
            ;
            b2GrowableBuffer = class b2GrowableBuffer {
                constructor(allocator) {
                    this.data = [];
                    this.count = 0;
                    this.capacity = 0;
                    this.allocator = allocator;
                }
                Append() {
                    if (this.count >= this.capacity) {
                        this.Grow();
                    }
                    return this.count++;
                }
                Reserve(newCapacity) {
                    if (this.capacity >= newCapacity)
                        return;
                    b2Assert(this.capacity === this.data.length);
                    for (let i = this.capacity; i < newCapacity; ++i) {
                        this.data[i] = this.allocator();
                    }
                    this.capacity = newCapacity;
                }
                Grow() {
                    // Double the capacity.
                    let newCapacity = this.capacity ? 2 * this.capacity : b2Settings_1.b2_minParticleSystemBufferCapacity;
                    b2Assert(newCapacity > this.capacity);
                    this.Reserve(newCapacity);
                }
                Free() {
                    if (this.data.length === 0) {
                        return;
                    }
                    this.data = [];
                    this.capacity = 0;
                    this.count = 0;
                }
                Shorten(newEnd) {
                    b2Assert(false);
                }
                Data() {
                    return this.data;
                }
                GetCount() {
                    return this.count;
                }
                SetCount(newCount) {
                    ///b2Assert(0 <= newCount && newCount <= this.capacity);
                    this.count = newCount;
                }
                GetCapacity() {
                    return this.capacity;
                }
                RemoveIf(pred) {
                    let count = 0;
                    for (let i = 0; i < this.count; ++i) {
                        if (!pred(this.data[i])) {
                            count++;
                        }
                    }
                    this.count = std_remove_if(this.data, pred, this.count);
                    b2Assert(count === this.count);
                }
                Unique(pred) {
                    this.count = std_unique(this.data, 0, this.count, pred);
                }
            };
            exports_1("b2GrowableBuffer", b2GrowableBuffer);
            b2FixtureParticleQueryCallback = class b2FixtureParticleQueryCallback extends b2WorldCallbacks_1.b2QueryCallback {
                constructor(system) {
                    super();
                    this.m_system = system;
                }
                ShouldQueryParticleSystem(system) {
                    // Skip reporting particles.
                    return false;
                }
                ReportFixture(fixture) {
                    if (fixture.IsSensor()) {
                        return true;
                    }
                    const shape = fixture.GetShape();
                    const childCount = shape.GetChildCount();
                    for (let childIndex = 0; childIndex < childCount; childIndex++) {
                        const aabb = fixture.GetAABB(childIndex);
                        const enumerator = this.m_system.GetInsideBoundsEnumerator(aabb);
                        let index;
                        while ((index = enumerator.GetNext()) >= 0) {
                            this.ReportFixtureAndParticle(fixture, childIndex, index);
                        }
                    }
                    return true;
                }
                ReportParticle(system, index) {
                    return false;
                }
                ReportFixtureAndParticle(fixture, childIndex, index) {
                    b2Assert(false); // pure virtual
                }
            };
            exports_1("b2FixtureParticleQueryCallback", b2FixtureParticleQueryCallback);
            b2ParticleContact = class b2ParticleContact {
                constructor() {
                    this.indexA = 0;
                    this.indexB = 0;
                    this.weight = 0;
                    this.normal = new b2Math_1.b2Vec2();
                    this.flags = 0;
                }
                SetIndices(a, b) {
                    b2Assert(a <= b2Settings_1.b2_maxParticleIndex && b <= b2Settings_1.b2_maxParticleIndex);
                    this.indexA = a;
                    this.indexB = b;
                }
                SetWeight(w) {
                    this.weight = w;
                }
                SetNormal(n) {
                    this.normal.Copy(n);
                }
                SetFlags(f) {
                    this.flags = f;
                }
                GetIndexA() {
                    return this.indexA;
                }
                GetIndexB() {
                    return this.indexB;
                }
                GetWeight() {
                    return this.weight;
                }
                GetNormal() {
                    return this.normal;
                }
                GetFlags() {
                    return this.flags;
                }
                IsEqual(rhs) {
                    return this.indexA === rhs.indexA && this.indexB === rhs.indexB && this.flags === rhs.flags && this.weight === rhs.weight && this.normal.x === rhs.normal.x && this.normal.y === rhs.normal.y;
                }
                IsNotEqual(rhs) {
                    return !this.IsEqual(rhs);
                }
                ApproximatelyEqual(rhs) {
                    const MAX_WEIGHT_DIFF = 0.01; // Weight 0 ~ 1, so about 1%
                    const MAX_NORMAL_DIFF_SQ = 0.01 * 0.01; // Normal length = 1, so 1%
                    return this.indexA === rhs.indexA && this.indexB === rhs.indexB && this.flags === rhs.flags && b2Math_1.b2Abs(this.weight - rhs.weight) < MAX_WEIGHT_DIFF && b2Math_1.b2Vec2.DistanceSquaredVV(this.normal, rhs.normal) < MAX_NORMAL_DIFF_SQ;
                }
            };
            exports_1("b2ParticleContact", b2ParticleContact);
            b2ParticleBodyContact = class b2ParticleBodyContact {
                constructor() {
                    this.index = 0; // Index of the particle making contact.
                    this.body = null; // The body making contact.
                    this.fixture = null; // The specific fixture making contact
                    this.weight = 0.0; // Weight of the contact. A value between 0.0f and 1.0f.
                    this.normal = new b2Math_1.b2Vec2(); // The normalized direction from the particle to the body.
                    this.mass = 0.0; // The effective mass used in calculating force.
                }
            };
            exports_1("b2ParticleBodyContact", b2ParticleBodyContact);
            b2ParticlePair = class b2ParticlePair {
                constructor() {
                    this.indexA = 0; // Indices of the respective particles making pair.
                    this.indexB = 0;
                    this.flags = 0; // The logical sum of the particle flags. See the b2ParticleFlag enum.
                    this.strength = 0.0; // The strength of cohesion among the particles.
                    this.distance = 0.0; // The initial distance of the particles.
                }
            };
            exports_1("b2ParticlePair", b2ParticlePair);
            b2ParticleTriad = class b2ParticleTriad {
                constructor() {
                    this.indexA = 0; // Indices of the respective particles making triad.
                    this.indexB = 0;
                    this.indexC = 0;
                    this.flags = 0; // The logical sum of the particle flags. See the b2ParticleFlag enum.
                    this.strength = 0.0; // The strength of cohesion among the particles.
                    this.pa = new b2Math_1.b2Vec2(0.0, 0.0); // Values used for calculation.
                    this.pb = new b2Math_1.b2Vec2(0.0, 0.0);
                    this.pc = new b2Math_1.b2Vec2(0.0, 0.0);
                    this.ka = 0.0;
                    this.kb = 0.0;
                    this.kc = 0.0;
                    this.s = 0.0;
                }
            };
            exports_1("b2ParticleTriad", b2ParticleTriad);
            b2ParticleSystemDef = class b2ParticleSystemDef {
                constructor() {
                    // Initialize physical coefficients to the maximum values that
                    // maintain numerical stability.
                    /**
                     * Enable strict Particle/Body contact check.
                     * See SetStrictContactCheck for details.
                     */
                    this.strictContactCheck = false;
                    /**
                     * Set the particle density.
                     * See SetDensity for details.
                     */
                    this.density = 1.0;
                    /**
                     * Change the particle gravity scale. Adjusts the effect of the
                     * global gravity vector on particles. Default value is 1.0f.
                     */
                    this.gravityScale = 1.0;
                    /**
                     * Particles behave as circles with this radius. In Box2D units.
                     */
                    this.radius = 1.0;
                    /**
                     * Set the maximum number of particles.
                     * By default, there is no maximum. The particle buffers can
                     * continue to grow while b2World's block allocator still has
                     * memory.
                     * See SetMaxParticleCount for details.
                     */
                    this.maxCount = 0;
                    /**
                     * Increases pressure in response to compression
                     * Smaller values allow more compression
                     */
                    this.pressureStrength = 0.005;
                    /**
                     * Reduces velocity along the collision normal
                     * Smaller value reduces less
                     */
                    this.dampingStrength = 1.0;
                    /**
                     * Restores shape of elastic particle groups
                     * Larger values increase elastic particle velocity
                     */
                    this.elasticStrength = 0.25;
                    /**
                     * Restores length of spring particle groups
                     * Larger values increase spring particle velocity
                     */
                    this.springStrength = 0.25;
                    /**
                     * Reduces relative velocity of viscous particles
                     * Larger values slow down viscous particles more
                     */
                    this.viscousStrength = 0.25;
                    /**
                     * Produces pressure on tensile particles
                     * 0~0.2. Larger values increase the amount of surface tension.
                     */
                    this.surfaceTensionPressureStrength = 0.2;
                    /**
                     * Smoothes outline of tensile particles
                     * 0~0.2. Larger values result in rounder, smoother,
                     * water-drop-like clusters of particles.
                     */
                    this.surfaceTensionNormalStrength = 0.2;
                    /**
                     * Produces additional pressure on repulsive particles
                     * Larger values repulse more
                     * Negative values mean attraction. The range where particles
                     * behave stably is about -0.2 to 2.0.
                     */
                    this.repulsiveStrength = 1.0;
                    /**
                     * Produces repulsion between powder particles
                     * Larger values repulse more
                     */
                    this.powderStrength = 0.5;
                    /**
                     * Pushes particles out of solid particle group
                     * Larger values repulse more
                     */
                    this.ejectionStrength = 0.5;
                    /**
                     * Produces static pressure
                     * Larger values increase the pressure on neighboring partilces
                     * For a description of static pressure, see
                     * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
                     */
                    this.staticPressureStrength = 0.2;
                    /**
                     * Reduces instability in static pressure calculation
                     * Larger values make stabilize static pressure with fewer
                     * iterations
                     */
                    this.staticPressureRelaxation = 0.2;
                    /**
                     * Computes static pressure more precisely
                     * See SetStaticPressureIterations for details
                     */
                    this.staticPressureIterations = 8;
                    /**
                     * Determines how fast colors are mixed
                     * 1.0f ==> mixed immediately
                     * 0.5f ==> mixed half way each simulation step (see
                     * b2World::Step())
                     */
                    this.colorMixingStrength = 0.5;
                    /**
                     * Whether to destroy particles by age when no more particles
                     * can be created.  See #b2ParticleSystem::SetDestructionByAge()
                     * for more information.
                     */
                    this.destroyByAge = true;
                    /**
                     * Granularity of particle lifetimes in seconds.  By default
                     * this is set to (1.0f / 60.0f) seconds.  b2ParticleSystem uses
                     * a 32-bit signed value to track particle lifetimes so the
                     * maximum lifetime of a particle is (2^32 - 1) / (1.0f /
                     * lifetimeGranularity) seconds. With the value set to 1/60 the
                     * maximum lifetime or age of a particle is 2.27 years.
                     */
                    this.lifetimeGranularity = 1.0 / 60.0;
                }
                Copy(def) {
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
                Clone() {
                    return new b2ParticleSystemDef().Copy(this);
                }
            };
            exports_1("b2ParticleSystemDef", b2ParticleSystemDef);
            b2ParticleSystem = class b2ParticleSystem {
                constructor(def, world) {
                    this.m_paused = false;
                    this.m_timestamp = 0;
                    this.m_allParticleFlags = 0;
                    this.m_needsUpdateAllParticleFlags = false;
                    this.m_allGroupFlags = 0;
                    this.m_needsUpdateAllGroupFlags = false;
                    this.m_hasForce = false;
                    this.m_iterationIndex = 0;
                    this.m_inverseDensity = 0.0;
                    this.m_particleDiameter = 0.0;
                    this.m_inverseDiameter = 0.0;
                    this.m_squaredDiameter = 0.0;
                    this.m_count = 0;
                    this.m_internalAllocatedCapacity = 0;
                    /**
                     * Allocator for b2ParticleHandle instances.
                     */
                    ///m_handleAllocator: any = null;
                    /**
                     * Maps particle indicies to handles.
                     */
                    this.m_handleIndexBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_flagsBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_positionBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_velocityBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_forceBuffer = [];
                    /**
                     * this.m_weightBuffer is populated in ComputeWeight and used in
                     * ComputeDepth(), SolveStaticPressure() and SolvePressure().
                     */
                    this.m_weightBuffer = [];
                    /**
                     * When any particles have the flag b2_staticPressureParticle,
                     * this.m_staticPressureBuffer is first allocated and used in
                     * SolveStaticPressure() and SolvePressure().  It will be
                     * reallocated on subsequent CreateParticle() calls.
                     */
                    this.m_staticPressureBuffer = [];
                    /**
                     * this.m_accumulationBuffer is used in many functions as a temporary
                     * buffer for scalar values.
                     */
                    this.m_accumulationBuffer = [];
                    /**
                     * When any particles have the flag b2_tensileParticle,
                     * this.m_accumulation2Buffer is first allocated and used in
                     * SolveTensile() as a temporary buffer for vector values.  It
                     * will be reallocated on subsequent CreateParticle() calls.
                     */
                    this.m_accumulation2Buffer = [];
                    /**
                     * When any particle groups have the flag b2_solidParticleGroup,
                     * this.m_depthBuffer is first allocated and populated in
                     * ComputeDepth() and used in SolveSolid(). It will be
                     * reallocated on subsequent CreateParticle() calls.
                     */
                    this.m_depthBuffer = [];
                    this.m_colorBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_groupBuffer = [];
                    this.m_userDataBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    /**
                     * Stuck particle detection parameters and record keeping
                     */
                    this.m_stuckThreshold = 0;
                    this.m_lastBodyContactStepBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_bodyContactCountBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_consecutiveContactStepsBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    this.m_stuckParticleBuffer = new b2GrowableBuffer(function () { return 0; });
                    this.m_proxyBuffer = new b2GrowableBuffer(function () { return new b2ParticleSystem.Proxy(); });
                    this.m_contactBuffer = new b2GrowableBuffer(function () { return new b2ParticleContact(); });
                    this.m_bodyContactBuffer = new b2GrowableBuffer(function () { return new b2ParticleBodyContact(); });
                    this.m_pairBuffer = new b2GrowableBuffer(function () { return new b2ParticlePair(); });
                    this.m_triadBuffer = new b2GrowableBuffer(function () { return new b2ParticleTriad(); });
                    /**
                     * Time each particle should be destroyed relative to the last
                     * time this.m_timeElapsed was initialized.  Each unit of time
                     * corresponds to b2ParticleSystemDef::lifetimeGranularity
                     * seconds.
                     */
                    this.m_expirationTimeBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    /**
                     * List of particle indices sorted by expiration time.
                     */
                    this.m_indexByExpirationTimeBuffer = new b2ParticleSystem.UserOverridableBuffer();
                    /**
                     * Time elapsed in 32:32 fixed point.  Each non-fractional unit
                     * of time corresponds to
                     * b2ParticleSystemDef::lifetimeGranularity seconds.
                     */
                    this.m_timeElapsed = 0;
                    /**
                     * Whether the expiration time buffer has been modified and
                     * needs to be resorted.
                     */
                    this.m_expirationTimeBufferRequiresSorting = false;
                    this.m_groupCount = 0;
                    this.m_groupList = null;
                    this.m_def = new b2ParticleSystemDef();
                    this.m_world = null;
                    this.m_prev = null;
                    this.m_next = null;
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
                static computeTag(x, y) {
                    ///return ((uint32)(y + yOffset) << yShift) + (uint32)(xScale * x + xOffset);
                    return ((((y + b2ParticleSystem.yOffset) >>> 0) << b2ParticleSystem.yShift) + ((b2ParticleSystem.xScale * x + b2ParticleSystem.xOffset) >>> 0)) >>> 0;
                }
                static computeRelativeTag(tag, x, y) {
                    ///return tag + (y << yShift) + (x << xShift);
                    return (tag + (y << b2ParticleSystem.yShift) + (x << b2ParticleSystem.xShift)) >>> 0;
                }
                Drop() {
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
                CreateParticle(def) {
                    b2Assert(this.m_world.IsLocked() === false);
                    if (this.m_world.IsLocked()) {
                        return 0;
                    }
                    if (this.m_count >= this.m_internalAllocatedCapacity) {
                        // Double the particle capacity.
                        let capacity = this.m_count ? 2 * this.m_count : b2Settings_1.b2_minParticleSystemBufferCapacity;
                        this.ReallocateInternalAllocatedBuffers(capacity);
                    }
                    if (this.m_count >= this.m_internalAllocatedCapacity) {
                        // If the oldest particle should be destroyed...
                        if (this.m_def.destroyByAge) {
                            this.DestroyOldestParticle(0, false);
                            // Need to destroy this particle *now* so that it's possible to
                            // create a new particle.
                            this.SolveZombie();
                        }
                        else {
                            return b2Settings_1.b2_invalidParticleIndex;
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
                    this.m_positionBuffer.data[index] = (this.m_positionBuffer.data[index] || new b2Math_1.b2Vec2()).Copy(def.position);
                    this.m_velocityBuffer.data[index] = (this.m_velocityBuffer.data[index] || new b2Math_1.b2Vec2()).Copy(def.velocity);
                    this.m_weightBuffer[index] = 0;
                    this.m_forceBuffer[index] = (this.m_forceBuffer[index] || new b2Math_1.b2Vec2()).SetZero();
                    if (this.m_staticPressureBuffer) {
                        this.m_staticPressureBuffer[index] = 0;
                    }
                    if (this.m_depthBuffer) {
                        this.m_depthBuffer[index] = 0;
                    }
                    if (this.m_colorBuffer.data || !def.color.IsZero()) {
                        this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
                        this.m_colorBuffer.data[index] = (this.m_colorBuffer.data[index] || new b2Draw_1.b2Color()).Copy(def.color);
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
                        }
                        else {
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
                GetParticleHandleFromIndex(index) {
                    b2Assert(index >= 0 && index < this.GetParticleCount() && index !== b2Settings_1.b2_invalidParticleIndex);
                    this.m_handleIndexBuffer.data = this.RequestBuffer(this.m_handleIndexBuffer.data);
                    let handle = this.m_handleIndexBuffer.data[index];
                    if (handle) {
                        return handle;
                    }
                    // Create a handle.
                    ///handle = m_handleAllocator.Allocate();
                    handle = new b2Particle_1.b2ParticleHandle();
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
                DestroyParticle(index, callDestructionListener = false) {
                    let flags = b2Particle_1.b2ParticleFlag.b2_zombieParticle;
                    if (callDestructionListener) {
                        flags |= b2Particle_1.b2ParticleFlag.b2_destructionListenerParticle;
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
                DestroyOldestParticle(index, callDestructionListener = false) {
                    const particleCount = this.GetParticleCount();
                    b2Assert(index >= 0 && index < particleCount);
                    // Make sure particle lifetime tracking is enabled.
                    b2Assert(this.m_indexByExpirationTimeBuffer.data !== null);
                    // Destroy the oldest particle (preferring to destroy finite
                    // lifetime particles first) to free a slot in the buffer.
                    const oldestFiniteLifetimeParticle = this.m_indexByExpirationTimeBuffer.data[particleCount - (index + 1)];
                    const oldestInfiniteLifetimeParticle = this.m_indexByExpirationTimeBuffer.data[index];
                    this.DestroyParticle(this.m_expirationTimeBuffer.data[oldestFiniteLifetimeParticle] > 0.0 ?
                        oldestFiniteLifetimeParticle : oldestInfiniteLifetimeParticle, callDestructionListener);
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
                DestroyParticlesInShape(shape, xf, callDestructionListener = false) {
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
                /**
                 * Create a particle group whose properties have been defined.
                 *
                 * No reference to the definition is retained.
                 *
                 * warning: This function is locked during callbacks.
                 */
                CreateParticleGroup(groupDef) {
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
                    let group = new b2ParticleGroup_1.b2ParticleGroup();
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
                /**
                 * Join two particle groups.
                 *
                 * warning: This function is locked during callbacks.
                 *
                 * @param groupA the first group. Expands to encompass the second group.
                 * @param groupB the second group. It is destroyed.
                 */
                JoinParticleGroups(groupA, groupB) {
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
                SplitParticleGroup(group) {
                    this.UpdateContacts(true);
                    let particleCount = group.GetParticleCount();
                    // We create several linked lists. Each list represents a set of connected particles.
                    ///ParticleListNode* nodeBuffer = (ParticleListNode*) m_world.m_stackAllocator.Allocate(sizeof(ParticleListNode) * particleCount);
                    let nodeBuffer = b2Settings_1.b2MakeArray(particleCount, function (index) {
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
                GetParticleGroupList() {
                    return this.m_groupList;
                }
                /**
                 * Get the number of particle groups.
                 */
                GetParticleGroupCount() {
                    return this.m_groupCount;
                }
                /**
                 * Get the number of particles.
                 */
                GetParticleCount() {
                    return this.m_count;
                }
                /**
                 * Get the maximum number of particles.
                 */
                GetMaxParticleCount() {
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
                SetMaxParticleCount(count) {
                    b2Assert(this.m_count <= count);
                    this.m_def.maxCount = count;
                }
                /**
                 * Get all existing particle flags.
                 */
                GetAllParticleFlags() {
                    return this.m_allParticleFlags;
                }
                /**
                 * Get all existing particle group flags.
                 */
                GetAllGroupFlags() {
                    return this.m_allGroupFlags;
                }
                /**
                 * Pause or unpause the particle system. When paused,
                 * b2World::Step() skips over this particle system. All
                 * b2ParticleSystem function calls still work.
                 *
                 * @param paused paused is true to pause, false to un-pause.
                 */
                SetPaused(paused) {
                    this.m_paused = paused;
                }
                /**
                 * Initially, true, then, the last value passed into
                 * SetPaused().
                 *
                 * @return true if the particle system is being updated in b2World::Step().
                 */
                GetPaused() {
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
                SetDensity(density) {
                    this.m_def.density = density;
                    this.m_inverseDensity = 1 / this.m_def.density;
                }
                /**
                 * Get the particle density.
                 */
                GetDensity() {
                    return this.m_def.density;
                }
                /**
                 * Change the particle gravity scale. Adjusts the effect of the
                 * global gravity vector on particles.
                 */
                SetGravityScale(gravityScale) {
                    this.m_def.gravityScale = gravityScale;
                }
                /**
                 * Get the particle gravity scale.
                 */
                GetGravityScale() {
                    return this.m_def.gravityScale;
                }
                /**
                 * Damping is used to reduce the velocity of particles. The
                 * damping parameter can be larger than 1.0f but the damping
                 * effect becomes sensitive to the time step when the damping
                 * parameter is large.
                 */
                SetDamping(damping) {
                    this.m_def.dampingStrength = damping;
                }
                /**
                 * Get damping for particles
                 */
                GetDamping() {
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
                SetStaticPressureIterations(iterations) {
                    this.m_def.staticPressureIterations = iterations;
                }
                /**
                 * Get the number of iterations for static pressure of
                 * particles.
                 */
                GetStaticPressureIterations() {
                    return this.m_def.staticPressureIterations;
                }
                /**
                 * Change the particle radius.
                 *
                 * You should set this only once, on world start.
                 * If you change the radius during execution, existing particles
                 * may explode, shrink, or behave unexpectedly.
                 */
                SetRadius(radius) {
                    this.m_particleDiameter = 2 * radius;
                    this.m_squaredDiameter = this.m_particleDiameter * this.m_particleDiameter;
                    this.m_inverseDiameter = 1 / this.m_particleDiameter;
                }
                /**
                 * Get the particle radius.
                 */
                GetRadius() {
                    return this.m_particleDiameter / 2;
                }
                /**
                 * Get the position of each particle
                 *
                 * Array is length GetParticleCount()
                 *
                 * @return the pointer to the head of the particle positions array.
                 */
                GetPositionBuffer() {
                    return this.m_positionBuffer.data;
                }
                /**
                 * Get the velocity of each particle
                 *
                 * Array is length GetParticleCount()
                 *
                 * @return the pointer to the head of the particle velocities array.
                 */
                GetVelocityBuffer() {
                    return this.m_velocityBuffer.data;
                }
                /**
                 * Get the color of each particle
                 *
                 * Array is length GetParticleCount()
                 *
                 * @return the pointer to the head of the particle colors array.
                 */
                GetColorBuffer() {
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
                GetGroupBuffer() {
                    return this.m_groupBuffer;
                }
                /**
                 * Get the weight of each particle
                 *
                 * Array is length GetParticleCount()
                 *
                 * @return the pointer to the head of the particle positions array.
                 */
                GetWeightBuffer() {
                    return this.m_weightBuffer;
                }
                /**
                 * Get the user-specified data of each particle.
                 *
                 * Array is length GetParticleCount()
                 *
                 * @return the pointer to the head of the particle user-data array.
                 */
                GetUserDataBuffer() {
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
                GetFlagsBuffer() {
                    return this.m_flagsBuffer.data;
                }
                /**
                 * Set flags for a particle. See the b2ParticleFlag enum.
                 */
                SetParticleFlags(index, newFlags) {
                    let oldFlags = this.m_flagsBuffer.data[index];
                    if (oldFlags & ~newFlags) {
                        // If any flags might be removed
                        this.m_needsUpdateAllParticleFlags = true;
                    }
                    if (~this.m_allParticleFlags & newFlags) {
                        // If any flags were added
                        if (newFlags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            this.m_accumulation2Buffer = this.RequestBuffer(this.m_accumulation2Buffer);
                        }
                        if (newFlags & b2Particle_1.b2ParticleFlag.b2_colorMixingParticle) {
                            this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
                        }
                        this.m_allParticleFlags |= newFlags;
                    }
                    this.m_flagsBuffer.data[index] = newFlags;
                }
                /**
                 * Get flags for a particle. See the b2ParticleFlag enum.
                 */
                GetParticleFlags(index) {
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
                SetFlagsBuffer(buffer, capacity) {
                    this.SetUserOverridableBuffer(this.m_flagsBuffer, buffer, capacity);
                }
                SetPositionBuffer(buffer, capacity) {
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
                SetVelocityBuffer(buffer, capacity) {
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
                SetColorBuffer(buffer, capacity) {
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
                SetUserDataBuffer(buffer, capacity) {
                    this.SetUserOverridableBuffer(this.m_userDataBuffer, buffer, capacity);
                }
                /**
                 * Get contacts between particles
                 * Contact data can be used for many reasons, for example to
                 * trigger rendering or audio effects.
                 */
                GetContacts() {
                    return this.m_contactBuffer.data;
                }
                GetContactCount() {
                    return this.m_contactBuffer.count;
                }
                /**
                 * Get contacts between particles and bodies
                 *
                 * Contact data can be used for many reasons, for example to
                 * trigger rendering or audio effects.
                 */
                GetBodyContacts() {
                    return this.m_bodyContactBuffer.data;
                }
                GetBodyContactCount() {
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
                GetPairs() {
                    return this.m_pairBuffer.data;
                }
                GetPairCount() {
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
                GetTriads() {
                    return this.m_triadBuffer.data;
                }
                GetTriadCount() {
                    return this.m_triadBuffer.count;
                }
                /**
                 * Set an optional threshold for the maximum number of
                 * consecutive particle iterations that a particle may contact
                 * multiple bodies before it is considered a candidate for being
                 * "stuck". Setting to zero or less disables.
                 */
                SetStuckThreshold(steps) {
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
                GetStuckCandidates() {
                    ///return m_stuckParticleBuffer.Data();
                    return this.m_stuckParticleBuffer.Data();
                }
                /**
                 * Get the number of stuck particle candidates from the last
                 * step.
                 */
                GetStuckCandidateCount() {
                    ///return m_stuckParticleBuffer.GetCount();
                    return this.m_stuckParticleBuffer.GetCount();
                }
                /**
                 * Compute the kinetic energy that can be lost by damping force
                 */
                ComputeCollisionEnergy() {
                    let s_v = b2ParticleSystem.ComputeCollisionEnergy_s_v;
                    let vel_data = this.m_velocityBuffer.data;
                    let sum_v2 = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        let a = contact.indexA;
                        let b = contact.indexB;
                        let n = contact.normal;
                        ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                        let v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        let vn = b2Math_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            sum_v2 += vn * vn;
                        }
                    }
                    return 0.5 * this.GetParticleMass() * sum_v2;
                }
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
                SetStrictContactCheck(enabled) {
                    this.m_def.strictContactCheck = enabled;
                }
                /**
                 * Get the status of the strict contact check.
                 */
                GetStrictContactCheck() {
                    return this.m_def.strictContactCheck;
                }
                /**
                 * Set the lifetime (in seconds) of a particle relative to the
                 * current time.  A lifetime of less than or equal to 0.0f
                 * results in the particle living forever until it's manually
                 * destroyed by the application.
                 */
                SetParticleLifetime(index, lifetime) {
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
                GetParticleLifetime(index) {
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
                SetDestructionByAge(enable) {
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
                GetDestructionByAge() {
                    return this.m_def.destroyByAge;
                }
                /**
                 * Get the array of particle expiration times indexed by
                 * particle index.
                 *
                 * GetParticleCount() items are in the returned array.
                 */
                GetExpirationTimeBuffer() {
                    this.m_expirationTimeBuffer.data = this.RequestBuffer(this.m_expirationTimeBuffer.data);
                    return this.m_expirationTimeBuffer.data;
                }
                /**
                 * Convert a expiration time value in returned by
                 * GetExpirationTimeBuffer() to a time in seconds relative to
                 * the current simulation time.
                 */
                ExpirationTimeToLifetime(expirationTime) {
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
                GetIndexByExpirationTimeBuffer() {
                    // If particles are present, initialize / reinitialize the lifetime buffer.
                    if (this.GetParticleCount()) {
                        this.SetParticleLifetime(0, this.GetParticleLifetime(0));
                    }
                    else {
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
                ParticleApplyLinearImpulse(index, impulse) {
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
                ApplyLinearImpulse(firstIndex, lastIndex, impulse) {
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
                static IsSignificantForce(force) {
                    return force.x !== 0 || force.y !== 0;
                }
                /**
                 * Apply a force to the center of a particle.
                 *
                 * @param index the particle that will be modified.
                 * @param force the world force vector, usually in Newtons (N).
                 */
                ParticleApplyForce(index, force) {
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
                ApplyForce(firstIndex, lastIndex, force) {
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
                GetNext() {
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
                QueryAABB(callback, aabb) {
                    if (this.m_proxyBuffer.count === 0) {
                        return;
                    }
                    let beginProxy = 0;
                    let endProxy = this.m_proxyBuffer.count;
                    let firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x, this.m_inverseDiameter * aabb.lowerBound.y), b2ParticleSystem.Proxy.CompareProxyTag);
                    let lastProxy = std_upper_bound(this.m_proxyBuffer.data, firstProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x, this.m_inverseDiameter * aabb.upperBound.y), b2ParticleSystem.Proxy.CompareTagProxy);
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
                QueryShapeAABB(callback, shape, xf, childIndex = 0) {
                    let s_aabb = b2ParticleSystem.QueryShapeAABB_s_aabb;
                    let aabb = s_aabb;
                    shape.ComputeAABB(aabb, xf, childIndex);
                    this.QueryAABB(callback, aabb);
                }
                QueryPointAABB(callback, point, slop = b2Settings_1.b2_linearSlop) {
                    let s_aabb = b2ParticleSystem.QueryPointAABB_s_aabb;
                    let aabb = s_aabb;
                    aabb.lowerBound.Set(point.x - slop, point.y - slop);
                    aabb.upperBound.Set(point.x + slop, point.y + slop);
                    this.QueryAABB(callback, aabb);
                }
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
                RayCast(callback, point1, point2) {
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
                    b2Math_1.b2Vec2.MinV(point1, point2, aabb.lowerBound);
                    b2Math_1.b2Vec2.MaxV(point1, point2, aabb.upperBound);
                    let fraction = 1;
                    // solving the following equation:
                    // ((1-t)*point1+t*point2-position)^2=diameter^2
                    // where t is a potential fraction
                    ///b2Vec2 v = point2 - point1;
                    let v = b2Math_1.b2Vec2.SubVV(point2, point1, s_v);
                    let v2 = b2Math_1.b2Vec2.DotVV(v, v);
                    let enumerator = this.GetInsideBoundsEnumerator(aabb);
                    let i;
                    while ((i = enumerator.GetNext()) >= 0) {
                        ///b2Vec2 p = point1 - m_positionBuffer.data[i];
                        let p = b2Math_1.b2Vec2.SubVV(point1, pos_data[i], s_p);
                        let pv = b2Math_1.b2Vec2.DotVV(p, v);
                        let p2 = b2Math_1.b2Vec2.DotVV(p, p);
                        let determinant = pv * pv - v2 * (p2 - this.m_squaredDiameter);
                        if (determinant >= 0) {
                            let sqrtDeterminant = b2Math_1.b2Sqrt(determinant);
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
                            let n = b2Math_1.b2Vec2.AddVMulSV(p, t, v, s_n);
                            n.Normalize();
                            ///float32 f = callback.ReportParticle(this, i, point1 + t * v, n, t);
                            let f = callback.ReportParticle(this, i, b2Math_1.b2Vec2.AddVMulSV(point1, t, v, s_point), n, t);
                            fraction = b2Math_1.b2Min(fraction, f);
                            if (fraction <= 0) {
                                break;
                            }
                        }
                    }
                }
                /**
                 * Compute the axis-aligned bounding box for all particles
                 * contained within this particle system.
                 *
                 * @export
                 * @return {void}
                 * @param {b2AABB} aabb Returns the axis-aligned bounding
                 *      box of the system.
                 */
                ComputeAABB(aabb) {
                    let particleCount = this.GetParticleCount();
                    b2Assert(aabb !== null);
                    aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
                    let pos_data = this.m_positionBuffer.data;
                    for (let i = 0; i < particleCount; i++) {
                        let p = pos_data[i];
                        b2Math_1.b2Vec2.MinV(aabb.lowerBound, p, aabb.lowerBound);
                        b2Math_1.b2Vec2.MaxV(aabb.upperBound, p, aabb.upperBound);
                    }
                    aabb.lowerBound.x -= this.m_particleDiameter;
                    aabb.lowerBound.y -= this.m_particleDiameter;
                    aabb.upperBound.x += this.m_particleDiameter;
                    aabb.upperBound.y += this.m_particleDiameter;
                }
                FreeBuffer(b, capacity) {
                    if (b === null) {
                        return;
                    }
                    b.length = 0;
                }
                FreeUserOverridableBuffer(b) {
                    if (b.userSuppliedCapacity === 0) {
                        this.FreeBuffer(b.data, this.m_internalAllocatedCapacity);
                    }
                }
                /**
                 * Reallocate a buffer
                 */
                ReallocateBuffer3(oldBuffer, oldCapacity, newCapacity) {
                    b2Assert(newCapacity > oldCapacity);
                    let newBuffer = (oldBuffer) ? oldBuffer.slice() : [];
                    newBuffer.length = newCapacity;
                    return newBuffer;
                }
                /**
                 * Reallocate a buffer
                 */
                ReallocateBuffer5(buffer, userSuppliedCapacity, oldCapacity, newCapacity, deferred) {
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
                ReallocateBuffer4(buffer, oldCapacity, newCapacity, deferred) {
                    b2Assert(newCapacity > oldCapacity);
                    return this.ReallocateBuffer5(buffer.data, buffer.userSuppliedCapacity, oldCapacity, newCapacity, deferred);
                }
                RequestBuffer(buffer) {
                    if (!buffer) {
                        if (this.m_internalAllocatedCapacity === 0) {
                            this.ReallocateInternalAllocatedBuffers(b2Settings_1.b2_minParticleSystemBufferCapacity);
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
                ReallocateHandleBuffers(newCapacity) {
                    b2Assert(newCapacity > this.m_internalAllocatedCapacity);
                    // Reallocate a new handle / index map buffer, copying old handle pointers
                    // is fine since they're kept around.
                    this.m_handleIndexBuffer.data = this.ReallocateBuffer4(this.m_handleIndexBuffer, this.m_internalAllocatedCapacity, newCapacity, true);
                    // Set the size of the next handle allocation.
                    ///this.m_handleAllocator.SetItemsPerSlab(newCapacity - this.m_internalAllocatedCapacity);
                }
                ReallocateInternalAllocatedBuffers(capacity) {
                    function LimitCapacity(capacity, maxCount) {
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
                CreateParticleForGroup(groupDef, xf, p) {
                    let particleDef = new b2Particle_1.b2ParticleDef();
                    particleDef.flags = groupDef.flags;
                    ///particleDef.position = b2Mul(xf, p);
                    b2Math_1.b2Transform.MulXV(xf, p, particleDef.position);
                    ///particleDef.velocity =
                    ///  groupDef.linearVelocity +
                    ///  b2Cross(groupDef.angularVelocity,
                    ///      particleDef.position - groupDef.position);
                    b2Math_1.b2Vec2.AddVV(groupDef.linearVelocity, b2Math_1.b2Vec2.CrossSV(groupDef.angularVelocity, b2Math_1.b2Vec2.SubVV(particleDef.position, groupDef.position, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), particleDef.velocity);
                    particleDef.color.Copy(groupDef.color);
                    particleDef.lifetime = groupDef.lifetime;
                    particleDef.userData = groupDef.userData;
                    this.CreateParticle(particleDef);
                }
                CreateParticlesStrokeShapeForGroup(shape, groupDef, xf) {
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
                        let edge = null;
                        if (shape.GetType() === b2Shape_1.b2ShapeType.e_edgeShape) {
                            edge = shape;
                        }
                        else {
                            b2Assert(shape.GetType() === b2Shape_1.b2ShapeType.e_chainShape);
                            edge = s_edge;
                            shape.GetChildEdge(edge, childIndex);
                        }
                        let d = b2Math_1.b2Vec2.SubVV(edge.m_vertex2, edge.m_vertex1, s_d);
                        let edgeLength = d.Length();
                        while (positionOnEdge < edgeLength) {
                            ///b2Vec2 p = edge.m_vertex1 + positionOnEdge / edgeLength * d;
                            let p = b2Math_1.b2Vec2.AddVMulSV(edge.m_vertex1, positionOnEdge / edgeLength, d, s_p);
                            this.CreateParticleForGroup(groupDef, xf, p);
                            positionOnEdge += stride;
                        }
                        positionOnEdge -= edgeLength;
                    }
                }
                CreateParticlesFillShapeForGroup(shape, groupDef, xf) {
                    let s_aabb = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb;
                    let s_p = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p;
                    let stride = groupDef.stride;
                    if (stride === 0) {
                        stride = this.GetParticleStride();
                    }
                    ///b2Transform identity;
                    /// identity.SetIdentity();
                    let identity = b2Math_1.b2Transform.IDENTITY;
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
                CreateParticlesWithShapeForGroup(shape, groupDef, xf) {
                    switch (shape.GetType()) {
                        case b2Shape_1.b2ShapeType.e_edgeShape:
                        case b2Shape_1.b2ShapeType.e_chainShape:
                            this.CreateParticlesStrokeShapeForGroup(shape, groupDef, xf);
                            break;
                        case b2Shape_1.b2ShapeType.e_polygonShape:
                        case b2Shape_1.b2ShapeType.e_circleShape:
                            this.CreateParticlesFillShapeForGroup(shape, groupDef, xf);
                            break;
                        default:
                            b2Assert(false);
                            break;
                    }
                }
                CreateParticlesWithShapesForGroup(shapes, shapeCount, groupDef, xf) {
                    let compositeShape = new b2ParticleSystem.CompositeShape(shapes, shapeCount);
                    this.CreateParticlesFillShapeForGroup(compositeShape, groupDef, xf);
                }
                CloneParticle(oldIndex, group) {
                    let def = new b2Particle_1.b2ParticleDef();
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
                        if (handle)
                            handle.SetIndex(newIndex);
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
                DestroyParticlesInGroup(group, callDestructionListener = false) {
                    for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
                        this.DestroyParticle(i, callDestructionListener);
                    }
                }
                DestroyParticleGroup(group) {
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
                static ParticleCanBeConnected(flags, group) {
                    return ((flags & (b2Particle_1.b2ParticleFlag.b2_wallParticle | b2Particle_1.b2ParticleFlag.b2_springParticle | b2Particle_1.b2ParticleFlag.b2_elasticParticle)) !== 0) ||
                        ((group !== null) && ((group.GetGroupFlags() & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0));
                }
                UpdatePairsAndTriads(firstIndex, lastIndex, filter) {
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
                                !((af | bf) & b2Particle_1.b2ParticleFlag.b2_zombieParticle) &&
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
                                pair.strength = b2Math_1.b2Min(groupA ? groupA.m_strength : 1, groupB ? groupB.m_strength : 1);
                                ///pair.distance = b2Distance(pos_data[a], pos_data[b]); // TODO: this was wrong!
                                pair.distance = b2Math_1.b2Vec2.DistanceVV(pos_data[a], pos_data[b]);
                            }
                            ///std::stable_sort(m_pairBuffer.Begin(), m_pairBuffer.End(), ComparePairIndices);
                            std_stable_sort(this.m_pairBuffer.data, 0, this.m_pairBuffer.count, b2ParticleSystem.ComparePairIndices);
                            ///m_pairBuffer.Unique(MatchPairIndices);
                            this.m_pairBuffer.Unique(b2ParticleSystem.MatchPairIndices);
                        }
                    }
                    if (particleFlags & b2ParticleSystem.k_triadFlags) {
                        let diagram = new b2VoronoiDiagram_1.b2VoronoiDiagram(lastIndex - firstIndex);
                        ///let necessary_count = 0;
                        for (let i = firstIndex; i < lastIndex; i++) {
                            let flags = this.m_flagsBuffer.data[i];
                            let group = this.m_groupBuffer[i];
                            if (!(flags & b2Particle_1.b2ParticleFlag.b2_zombieParticle) &&
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
                        let callback = function UpdateTriadsCallback(a, b, c) {
                            let af = system.m_flagsBuffer.data[a];
                            let bf = system.m_flagsBuffer.data[b];
                            let cf = system.m_flagsBuffer.data[c];
                            if (((af | bf | cf) & b2ParticleSystem.k_triadFlags) &&
                                filter.ShouldCreateTriad(a, b, c)) {
                                let pa = pos_data[a];
                                let pb = pos_data[b];
                                let pc = pos_data[c];
                                let dab = b2Math_1.b2Vec2.SubVV(pa, pb, s_dab);
                                let dbc = b2Math_1.b2Vec2.SubVV(pb, pc, s_dbc);
                                let dca = b2Math_1.b2Vec2.SubVV(pc, pa, s_dca);
                                let maxDistanceSquared = b2Settings_1.b2_maxTriadDistanceSquared * system.m_squaredDiameter;
                                if (b2Math_1.b2Vec2.DotVV(dab, dab) > maxDistanceSquared ||
                                    b2Math_1.b2Vec2.DotVV(dbc, dbc) > maxDistanceSquared ||
                                    b2Math_1.b2Vec2.DotVV(dca, dca) > maxDistanceSquared) {
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
                                triad.strength = b2Math_1.b2Min(b2Math_1.b2Min(groupA ? groupA.m_strength : 1, groupB ? groupB.m_strength : 1), groupC ? groupC.m_strength : 1);
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
                                triad.ka = -b2Math_1.b2Vec2.DotVV(dca, dab);
                                triad.kb = -b2Math_1.b2Vec2.DotVV(dab, dbc);
                                triad.kc = -b2Math_1.b2Vec2.DotVV(dbc, dca);
                                triad.s = b2Math_1.b2Vec2.CrossVV(pa, pb) + b2Math_1.b2Vec2.CrossVV(pb, pc) + b2Math_1.b2Vec2.CrossVV(pc, pa);
                            }
                        };
                        diagram.GetNodes(callback);
                        ///std::stable_sort(m_triadBuffer.Begin(), m_triadBuffer.End(), CompareTriadIndices);
                        std_stable_sort(this.m_triadBuffer.data, 0, this.m_triadBuffer.count, b2ParticleSystem.CompareTriadIndices);
                        ///m_triadBuffer.Unique(MatchTriadIndices);
                        this.m_triadBuffer.Unique(b2ParticleSystem.MatchTriadIndices);
                    }
                }
                UpdatePairsAndTriadsWithReactiveParticles() {
                    let filter = new b2ParticleSystem.ReactiveFilter(this.m_flagsBuffer);
                    this.UpdatePairsAndTriads(0, this.m_count, filter);
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_flagsBuffer.data[i] &= ~b2Particle_1.b2ParticleFlag.b2_reactiveParticle;
                    }
                    this.m_allParticleFlags &= ~b2Particle_1.b2ParticleFlag.b2_reactiveParticle;
                }
                static ComparePairIndices(a, b) {
                    let diffA = a.indexA - b.indexA;
                    if (diffA !== 0)
                        return diffA < 0;
                    return a.indexB < b.indexB;
                }
                static MatchPairIndices(a, b) {
                    return a.indexA === b.indexA && a.indexB === b.indexB;
                }
                static CompareTriadIndices(a, b) {
                    let diffA = a.indexA - b.indexA;
                    if (diffA !== 0)
                        return diffA < 0;
                    let diffB = a.indexB - b.indexB;
                    if (diffB !== 0)
                        return diffB < 0;
                    return a.indexC < b.indexC;
                }
                static MatchTriadIndices(a, b) {
                    return a.indexA === b.indexA && a.indexB === b.indexB && a.indexC === b.indexC;
                }
                static InitializeParticleLists(group, nodeBuffer) {
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
                MergeParticleListsInContact(group, nodeBuffer) {
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
                static MergeParticleLists(listA, listB) {
                    // Insert listB between index 0 and 1 of listA
                    // Example:
                    //     listA => a1 => a2 => a3 => null
                    //     listB => b1 => b2 => null
                    // to
                    //     listA => listB => b1 => b2 => a1 => a2 => a3 => null
                    b2Assert(listA !== listB);
                    for ( /*ParticleListNode**/let b = listB;;) {
                        b.list = listA;
                        /*ParticleListNode**/
                        let nextB = b.next;
                        if (nextB) {
                            b = nextB;
                        }
                        else {
                            b.next = listA.next;
                            break;
                        }
                    }
                    listA.next = listB;
                    listA.count += listB.count;
                    listB.count = 0;
                }
                static FindLongestParticleList(group, nodeBuffer) {
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
                MergeZombieParticleListNodes(group, nodeBuffer, survivingList) {
                    let particleCount = group.GetParticleCount();
                    for (let i = 0; i < particleCount; i++) {
                        /*ParticleListNode**/
                        let node = nodeBuffer[i];
                        if (node !== survivingList &&
                            (this.m_flagsBuffer.data[node.index] & b2Particle_1.b2ParticleFlag.b2_zombieParticle)) {
                            b2ParticleSystem.MergeParticleListAndNode(survivingList, node);
                        }
                    }
                }
                static MergeParticleListAndNode(list, node) {
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
                CreateParticleGroupsFromParticleList(group, nodeBuffer, survivingList) {
                    let particleCount = group.GetParticleCount();
                    let def = new b2ParticleGroup_1.b2ParticleGroupDef();
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
                        for ( /*ParticleListNode**/let node = list; node; node = node.next) {
                            let oldIndex = node.index;
                            let flags = this.m_flagsBuffer.data[oldIndex];
                            b2Assert(!(flags & b2Particle_1.b2ParticleFlag.b2_zombieParticle));
                            let newIndex = this.CloneParticle(oldIndex, newGroup);
                            this.m_flagsBuffer.data[oldIndex] |= b2Particle_1.b2ParticleFlag.b2_zombieParticle;
                            node.index = newIndex;
                        }
                    }
                }
                UpdatePairsAndTriadsWithParticleList(group, nodeBuffer) {
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
                ComputeDepth() {
                    ///b2ParticleContact* contactGroups = (b2ParticleContact*) this.m_world.m_stackAllocator.Allocate(sizeof(b2ParticleContact) * this.m_contactBuffer.GetCount());
                    let contactGroups = []; // TODO: static
                    let contactGroupsCount = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        let a = contact.indexA;
                        let b = contact.indexB;
                        let groupA = this.m_groupBuffer[a];
                        let groupB = this.m_groupBuffer[b];
                        if (groupA && groupA === groupB &&
                            (groupA.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth)) {
                            contactGroups[contactGroupsCount++] = contact;
                        }
                    }
                    ///b2ParticleGroup** groupsToUpdate = (b2ParticleGroup**) this.m_world.m_stackAllocator.Allocate(sizeof(b2ParticleGroup*) * this.m_groupCount);
                    let groupsToUpdate = []; // TODO: static
                    let groupsToUpdateCount = 0;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        if (group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
                            groupsToUpdate[groupsToUpdateCount++] = group;
                            this.SetGroupFlags(group, group.m_groupFlags &
                                ~b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
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
                            this.m_depthBuffer[i] = w < 0.8 ? 0 : b2Settings_1.b2_maxFloat;
                        }
                    }
                    // The number of iterations is equal to particle number from the deepest
                    // particle to the nearest surface particle, and in general it is smaller
                    // than sqrt of total particle number.
                    ///int32 iterationCount = (int32)b2Sqrt((float)m_count);
                    let iterationCount = b2Math_1.b2Sqrt(this.m_count) >> 0;
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
                            if (this.m_depthBuffer[i] < b2Settings_1.b2_maxFloat) {
                                this.m_depthBuffer[i] *= this.m_particleDiameter;
                            }
                            else {
                                this.m_depthBuffer[i] = 0;
                            }
                        }
                    }
                    ///this.m_world.m_stackAllocator.Free(groupsToUpdate);
                    ///this.m_world.m_stackAllocator.Free(contactGroups);
                }
                GetInsideBoundsEnumerator(aabb) {
                    let lowerTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x - 1, this.m_inverseDiameter * aabb.lowerBound.y - 1);
                    let upperTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x + 1, this.m_inverseDiameter * aabb.upperBound.y + 1);
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
                UpdateAllParticleFlags() {
                    this.m_allParticleFlags = 0;
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_allParticleFlags |= this.m_flagsBuffer.data[i];
                    }
                    this.m_needsUpdateAllParticleFlags = false;
                }
                UpdateAllGroupFlags() {
                    this.m_allGroupFlags = 0;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        this.m_allGroupFlags |= group.m_groupFlags;
                    }
                    this.m_needsUpdateAllGroupFlags = false;
                }
                AddContact(a, b, contacts) {
                    let s_d = b2ParticleSystem.AddContact_s_d;
                    let pos_data = this.m_positionBuffer.data;
                    b2Assert(contacts === this.m_contactBuffer);
                    ///b2Vec2 d = m_positionBuffer.data[b] - m_positionBuffer.data[a];
                    let d = b2Math_1.b2Vec2.SubVV(pos_data[b], pos_data[a], s_d);
                    let distBtParticlesSq = b2Math_1.b2Vec2.DotVV(d, d);
                    if (distBtParticlesSq < this.m_squaredDiameter) {
                        let invD = b2Math_1.b2InvSqrt(distBtParticlesSq);
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
                        b2Math_1.b2Vec2.MulSV(invD, d, contact.normal);
                    }
                }
                FindContacts_Reference(contacts) {
                    b2Assert(contacts === this.m_contactBuffer);
                    let beginProxy = 0;
                    let endProxy = this.m_proxyBuffer.count;
                    this.m_contactBuffer.count = 0;
                    for (let a = beginProxy, c = beginProxy; a < endProxy; a++) {
                        let rightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 0);
                        for (let b = a + 1; b < endProxy; b++) {
                            if (rightTag < this.m_proxyBuffer.data[b].tag)
                                break;
                            this.AddContact(this.m_proxyBuffer.data[a].index, this.m_proxyBuffer.data[b].index, this.m_contactBuffer);
                        }
                        let bottomLeftTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, -1, 1);
                        for (; c < endProxy; c++) {
                            if (bottomLeftTag <= this.m_proxyBuffer.data[c].tag)
                                break;
                        }
                        let bottomRightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 1);
                        for (let b = c; b < endProxy; b++) {
                            if (bottomRightTag < this.m_proxyBuffer.data[b].tag)
                                break;
                            this.AddContact(this.m_proxyBuffer.data[a].index, this.m_proxyBuffer.data[b].index, this.m_contactBuffer);
                        }
                    }
                }
                ///void ReorderForFindContact(FindContactInput* reordered, int alignedCount) const;
                ///void GatherChecksOneParticle(const uint32 bound, const int startIndex, const int particleIndex, int* nextUncheckedIndex, b2GrowableBuffer<FindContactCheck>& checks) const;
                ///void GatherChecks(b2GrowableBuffer<FindContactCheck>& checks) const;
                ///void FindContacts_Simd(b2GrowableBuffer<b2ParticleContact>& contacts) const;
                FindContacts(contacts) {
                    this.FindContacts_Reference(contacts);
                }
                ///static void UpdateProxyTags(const uint32* const tags, b2GrowableBuffer<Proxy>& proxies);
                ///static bool ProxyBufferHasIndex(int32 index, const Proxy* const a, int count);
                ///static int NumProxiesWithSameTag(const Proxy* const a, const Proxy* const b, int count);
                ///static bool AreProxyBuffersTheSame(const b2GrowableBuffer<Proxy>& a, const b2GrowableBuffer<Proxy>& b);
                UpdateProxies_Reference(proxies) {
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
                UpdateProxies(proxies) {
                    this.UpdateProxies_Reference(proxies);
                }
                SortProxies(proxies) {
                    b2Assert(proxies === this.m_proxyBuffer);
                    ///std::sort(proxies.Begin(), proxies.End());
                    std_sort(this.m_proxyBuffer.data, 0, this.m_proxyBuffer.count, b2ParticleSystem.Proxy.CompareProxyProxy);
                }
                FilterContacts(contacts) {
                    // Optionally filter the contact.
                    let contactFilter = this.GetParticleContactFilter();
                    if (contactFilter === null)
                        return;
                    /// contacts.RemoveIf(b2ParticleContactRemovePredicate(this, contactFilter));
                    b2Assert(contacts === this.m_contactBuffer);
                    let system = this;
                    let predicate = function (contact) {
                        return (contact.flags & b2Particle_1.b2ParticleFlag.b2_particleContactFilterParticle) && !contactFilter.ShouldCollideParticleParticle(system, contact.indexA, contact.indexB);
                    };
                    this.m_contactBuffer.RemoveIf(predicate);
                }
                NotifyContactListenerPreContact(particlePairs) {
                    let contactListener = this.GetParticleContactListener();
                    if (contactListener === null)
                        return;
                    ///particlePairs.Initialize(m_contactBuffer.Begin(), m_contactBuffer.GetCount(), GetFlagsBuffer());
                    particlePairs.Initialize(this.m_contactBuffer, this.m_flagsBuffer);
                    throw new Error(); // TODO: notify
                }
                NotifyContactListenerPostContact(particlePairs) {
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
                        }
                        else {
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
                static b2ParticleContactIsZombie(contact) {
                    return (contact.flags & b2Particle_1.b2ParticleFlag.b2_zombieParticle) === b2Particle_1.b2ParticleFlag.b2_zombieParticle;
                }
                UpdateContacts(exceptZombie) {
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
                NotifyBodyContactListenerPreContact(fixtureSet) {
                    let contactListener = this.GetFixtureContactListener();
                    if (contactListener === null)
                        return;
                    ///fixtureSet.Initialize(m_bodyContactBuffer.Begin(), m_bodyContactBuffer.GetCount(), GetFlagsBuffer());
                    fixtureSet.Initialize(this.m_bodyContactBuffer, this.m_flagsBuffer);
                    throw new Error(); // TODO: notify
                }
                NotifyBodyContactListenerPostContact(fixtureSet) {
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
                        }
                        else {
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
                UpdateBodyContacts() {
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
                Solve(step) {
                    let s_subStep = b2ParticleSystem.Solve_s_subStep;
                    if (this.m_count === 0) {
                        return;
                    }
                    // If particle lifetimes are enabled, destroy particles that are too old.
                    if (this.m_expirationTimeBuffer.data) {
                        this.SolveLifetimes(step);
                    }
                    if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_zombieParticle) {
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
                        if (this.m_allGroupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
                            this.ComputeDepth();
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_reactiveParticle) {
                            this.UpdatePairsAndTriadsWithReactiveParticles();
                        }
                        if (this.m_hasForce) {
                            this.SolveForce(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_viscousParticle) {
                            this.SolveViscous();
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_repulsiveParticle) {
                            this.SolveRepulsive(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_powderParticle) {
                            this.SolvePowder(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            this.SolveTensile(subStep);
                        }
                        if (this.m_allGroupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                            this.SolveSolid(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_colorMixingParticle) {
                            this.SolveColorMixing();
                        }
                        this.SolveGravity(subStep);
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                            this.SolveStaticPressure(subStep);
                        }
                        this.SolvePressure(subStep);
                        this.SolveDamping(subStep);
                        if (this.m_allParticleFlags & b2ParticleSystem.k_extraDampingFlags) {
                            this.SolveExtraDamping();
                        }
                        // SolveElastic and SolveSpring refer the current velocities for
                        // numerical stability, they should be called as late as possible.
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_elasticParticle) {
                            this.SolveElastic(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_springParticle) {
                            this.SolveSpring(subStep);
                        }
                        this.LimitVelocity(subStep);
                        if (this.m_allGroupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            this.SolveRigidDamping();
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_barrierParticle) {
                            this.SolveBarrier(subStep);
                        }
                        // SolveCollision, SolveRigid and SolveWall should be called after
                        // other force functions because they may require particles to have
                        // specific velocities.
                        this.SolveCollision(subStep);
                        if (this.m_allGroupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            this.SolveRigid(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_wallParticle) {
                            this.SolveWall();
                        }
                        // The particle positions can be updated only at the end of substep.
                        for (let i = 0; i < this.m_count; i++) {
                            ///m_positionBuffer.data[i] += subStep.dt * m_velocityBuffer.data[i];
                            this.m_positionBuffer.data[i].SelfMulAdd(subStep.dt, this.m_velocityBuffer.data[i]);
                        }
                    }
                }
                SolveCollision(step) {
                    let s_aabb = b2ParticleSystem.SolveCollision_s_aabb;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    // This function detects particles which are crossing boundary of bodies
                    // and modifies velocities of them so that they will move just in front of
                    // boundary. This function function also applies the reaction force to
                    // bodies as precisely as the numerical stability is kept.
                    let aabb = s_aabb;
                    aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
                    for (let i = 0; i < this.m_count; i++) {
                        let v = vel_data[i];
                        let p1 = pos_data[i];
                        ///let p2 = p1 + step.dt * v;
                        let p2_x = p1.x + step.dt * v.x;
                        let p2_y = p1.y + step.dt * v.y;
                        ///aabb.lowerBound = b2Min(aabb.lowerBound, b2Min(p1, p2));
                        aabb.lowerBound.x = b2Math_1.b2Min(aabb.lowerBound.x, b2Math_1.b2Min(p1.x, p2_x));
                        aabb.lowerBound.y = b2Math_1.b2Min(aabb.lowerBound.y, b2Math_1.b2Min(p1.y, p2_y));
                        ///aabb.upperBound = b2Max(aabb.upperBound, b2Max(p1, p2));
                        aabb.upperBound.x = b2Math_1.b2Max(aabb.upperBound.x, b2Math_1.b2Max(p1.x, p2_x));
                        aabb.upperBound.y = b2Math_1.b2Max(aabb.upperBound.y, b2Math_1.b2Max(p1.y, p2_y));
                    }
                    let callback = new b2ParticleSystem.SolveCollisionCallback(this, step);
                    this.m_world.QueryAABB(callback, aabb);
                }
                LimitVelocity(step) {
                    let vel_data = this.m_velocityBuffer.data;
                    let criticalVelocitySquared = this.GetCriticalVelocitySquared(step);
                    for (let i = 0; i < this.m_count; i++) {
                        let v = vel_data[i];
                        let v2 = b2Math_1.b2Vec2.DotVV(v, v);
                        if (v2 > criticalVelocitySquared) {
                            ///v *= b2Sqrt(criticalVelocitySquared / v2);
                            v.SelfMul(b2Math_1.b2Sqrt(criticalVelocitySquared / v2));
                        }
                    }
                }
                SolveGravity(step) {
                    let s_gravity = b2ParticleSystem.SolveGravity_s_gravity;
                    let vel_data = this.m_velocityBuffer.data;
                    ///b2Vec2 gravity = step.dt * m_def.gravityScale * m_world.GetGravity();
                    let gravity = b2Math_1.b2Vec2.MulSV(step.dt * this.m_def.gravityScale, this.m_world.GetGravity(), s_gravity);
                    for (let i = 0; i < this.m_count; i++) {
                        vel_data[i].SelfAdd(gravity);
                    }
                }
                SolveBarrier(step) {
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
                    let tmax = b2Settings_1.b2_barrierCollisionTime * step.dt;
                    let mass = this.GetParticleMass();
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        let pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_1.b2ParticleFlag.b2_barrierParticle) {
                            let a = pair.indexA;
                            let b = pair.indexB;
                            let pa = pos_data[a];
                            let pb = pos_data[b];
                            /// b2AABB aabb;
                            let aabb = s_aabb;
                            ///aabb.lowerBound = b2Min(pa, pb);
                            b2Math_1.b2Vec2.MinV(pa, pb, aabb.lowerBound);
                            ///aabb.upperBound = b2Max(pa, pb);
                            b2Math_1.b2Vec2.MaxV(pa, pb, aabb.upperBound);
                            let aGroup = this.m_groupBuffer[a];
                            let bGroup = this.m_groupBuffer[b];
                            ///b2Vec2 va = GetLinearVelocity(aGroup, a, pa);
                            let va = this.GetLinearVelocity(aGroup, a, pa, s_va);
                            ///b2Vec2 vb = GetLinearVelocity(bGroup, b, pb);
                            let vb = this.GetLinearVelocity(bGroup, b, pb, s_vb);
                            ///b2Vec2 pba = pb - pa;
                            let pba = b2Math_1.b2Vec2.SubVV(pb, pa, s_pba);
                            ///b2Vec2 vba = vb - va;
                            let vba = b2Math_1.b2Vec2.SubVV(vb, va, s_vba);
                            ///InsideBoundsEnumerator enumerator = GetInsideBoundsEnumerator(aabb);
                            let enumerator = this.GetInsideBoundsEnumerator(aabb);
                            let c;
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
                                    let pca = b2Math_1.b2Vec2.SubVV(pc, pa, s_pca);
                                    ///b2Vec2 vca = vc - va;
                                    let vca = b2Math_1.b2Vec2.SubVV(vc, va, s_vca);
                                    let e2 = b2Math_1.b2Vec2.CrossVV(vba, vca);
                                    let e1 = b2Math_1.b2Vec2.CrossVV(pba, vca) - b2Math_1.b2Vec2.CrossVV(pca, vba);
                                    let e0 = b2Math_1.b2Vec2.CrossVV(pba, pca);
                                    let s, t;
                                    ///b2Vec2 qba, qca;
                                    let qba = s_qba, qca = s_qca;
                                    if (e2 === 0) {
                                        if (e1 === 0)
                                            continue;
                                        t = -e0 / e1;
                                        if (!(t >= 0 && t < tmax))
                                            continue;
                                        ///qba = pba + t * vba;
                                        b2Math_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                        ///qca = pca + t * vca;
                                        b2Math_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                        s = b2Math_1.b2Vec2.DotVV(qba, qca) / b2Math_1.b2Vec2.DotVV(qba, qba);
                                        if (!(s >= 0 && s <= 1))
                                            continue;
                                    }
                                    else {
                                        let det = e1 * e1 - 4 * e0 * e2;
                                        if (det < 0)
                                            continue;
                                        let sqrtDet = b2Math_1.b2Sqrt(det);
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
                                        b2Math_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                        ///qca = pca + t * vca;
                                        b2Math_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                        ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                                        s = b2Math_1.b2Vec2.DotVV(qba, qca) / b2Math_1.b2Vec2.DotVV(qba, qba);
                                        if (!(t >= 0 && t < tmax && s >= 0 && s <= 1)) {
                                            t = t2;
                                            if (!(t >= 0 && t < tmax))
                                                continue;
                                            ///qba = pba + t * vba;
                                            b2Math_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                            ///qca = pca + t * vca;
                                            b2Math_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                            ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                                            s = b2Math_1.b2Vec2.DotVV(qba, qca) / b2Math_1.b2Vec2.DotVV(qba, qba);
                                            if (!(s >= 0 && s <= 1))
                                                continue;
                                        }
                                    }
                                    // Apply a force to particle c so that it will have the
                                    // interpolated velocity at the collision point on line ab.
                                    ///b2Vec2 dv = va + s * vba - vc;
                                    let dv = s_dv;
                                    dv.x = va.x + s * vba.x - vc.x;
                                    dv.y = va.y + s * vba.y - vc.y;
                                    ///b2Vec2 f = GetParticleMass() * dv;
                                    let f = b2Math_1.b2Vec2.MulSV(mass, dv, s_f);
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
                                            cGroup.m_angularVelocity += b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.SubVV(pc, cGroup.GetCenter(), b2Math_1.b2Vec2.s_t0), f) / inertia;
                                        }
                                    }
                                    else {
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
                SolveStaticPressure(step) {
                    this.m_staticPressureBuffer = this.RequestBuffer(this.m_staticPressureBuffer);
                    let criticalPressure = this.GetCriticalPressure(step);
                    let pressurePerWeight = this.m_def.staticPressureStrength * criticalPressure;
                    let maxPressure = b2Settings_2.b2_maxParticlePressure * criticalPressure;
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
                            if (contact.flags & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                                let a = contact.indexA;
                                let b = contact.indexB;
                                let w = contact.weight;
                                this.m_accumulationBuffer[a] += w * this.m_staticPressureBuffer[b]; // a <- b
                                this.m_accumulationBuffer[b] += w * this.m_staticPressureBuffer[a]; // b <- a
                            }
                        }
                        for (let i = 0; i < this.m_count; i++) {
                            let w = this.m_weightBuffer[i];
                            if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                                let wh = this.m_accumulationBuffer[i];
                                let h = (wh + pressurePerWeight * (w - b2Settings_2.b2_minParticleWeight)) /
                                    (w + relaxation);
                                this.m_staticPressureBuffer[i] = b2Math_1.b2Clamp(h, 0.0, maxPressure);
                            }
                            else {
                                this.m_staticPressureBuffer[i] = 0;
                            }
                        }
                    }
                }
                ComputeWeight() {
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
                SolvePressure(step) {
                    let s_f = b2ParticleSystem.SolvePressure_s_f;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    // calculates pressure as a linear function of density
                    let criticalPressure = this.GetCriticalPressure(step);
                    let pressurePerWeight = this.m_def.pressureStrength * criticalPressure;
                    let maxPressure = b2Settings_2.b2_maxParticlePressure * criticalPressure;
                    for (let i = 0; i < this.m_count; i++) {
                        let w = this.m_weightBuffer[i];
                        let h = pressurePerWeight * b2Math_1.b2Max(0.0, w - b2Settings_2.b2_minParticleWeight);
                        this.m_accumulationBuffer[i] = b2Math_1.b2Min(h, maxPressure);
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
                    if (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                        b2Assert(this.m_staticPressureBuffer !== null);
                        for (let i = 0; i < this.m_count; i++) {
                            if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
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
                        let f = b2Math_1.b2Vec2.MulSV(velocityPerPressure * w * m * h, n, s_f);
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
                        let f = b2Math_1.b2Vec2.MulSV(velocityPerPressure * w * h, n, s_f);
                        ///m_velocityBuffer.data[a] -= f;
                        vel_data[a].SelfSub(f);
                        ///m_velocityBuffer.data[b] += f;
                        vel_data[b].SelfAdd(f);
                    }
                }
                SolveDamping(step) {
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
                        let v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                        let vn = b2Math_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            let damping = b2Math_1.b2Max(linearDamping * w, b2Math_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * m * vn * n;
                            let f = b2Math_1.b2Vec2.MulSV(damping * m * vn, n, s_f);
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
                        let v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        let vn = b2Math_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            ///float32 damping = b2Max(linearDamping * w, b2Min(- quadraticDamping * vn, 0.5f));
                            let damping = b2Math_1.b2Max(linearDamping * w, b2Math_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * vn * n;
                            let f = b2Math_1.b2Vec2.MulSV(damping * vn, n, s_f);
                            ///this.m_velocityBuffer.data[a] += f;
                            vel_data[a].SelfAdd(f);
                            ///this.m_velocityBuffer.data[b] -= f;
                            vel_data[b].SelfSub(f);
                        }
                    }
                }
                SolveRigidDamping() {
                    let s_t0 = b2ParticleSystem.SolveRigidDamping_s_t0;
                    let s_t1 = b2ParticleSystem.SolveRigidDamping_s_t1;
                    let s_p = b2ParticleSystem.SolveRigidDamping_s_p;
                    let s_v = b2ParticleSystem.SolveRigidDamping_s_v;
                    let invMassA = [0.0], invInertiaA = [0.0], tangentDistanceA = [0.0]; // TODO: static
                    let invMassB = [0.0], invInertiaB = [0.0], tangentDistanceB = [0.0]; // TODO: static
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
                            let v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, s_t0), aGroup.GetLinearVelocityFromWorldPoint(p, s_t1), s_v);
                            let vn = b2Math_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                // The group's average velocity at particle position 'p' is pushing
                                // the particle into the body.
                                ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, true, aGroup, a, p, n);
                                this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, p, n);
                                // Calculate b.m_I from public functions of b2Body.
                                ///this.InitDampingParameter(&invMassB, &invInertiaB, &tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                this.InitDampingParameter(invMassB, invInertiaB, tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                ///float32 f = damping * b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
                                let f = damping * b2Math_1.b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
                                ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, f, n);
                                this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], true, aGroup, a, f, n);
                                ///b.ApplyLinearImpulse(-f * n, p, true);
                                b.ApplyLinearImpulse(b2Math_1.b2Vec2.MulSV(-f, n, b2Math_1.b2Vec2.s_t0), p, true);
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
                            let p = b2Math_1.b2Vec2.MidVV(pos_data[a], pos_data[b], s_p);
                            ///b2Vec2 v = GetLinearVelocity(bGroup, b, p) - GetLinearVelocity(aGroup, a, p);
                            let v = b2Math_1.b2Vec2.SubVV(this.GetLinearVelocity(bGroup, b, p, s_t0), this.GetLinearVelocity(aGroup, a, p, s_t1), s_v);
                            let vn = b2Math_1.b2Vec2.DotVV(v, n);
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
                SolveExtraDamping() {
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
                            let v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///float32 vn = b2Dot(v, n);
                            let vn = b2Math_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                ///b2Vec2 f = 0.5f * m * vn * n;
                                let f = b2Math_1.b2Vec2.MulSV(0.5 * m * vn, n, s_f);
                                ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                                vel_data[a].SelfMulAdd(inv_mass, f);
                                ///b.ApplyLinearImpulse(-f, p, true);
                                b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                            }
                        }
                    }
                }
                SolveWall() {
                    let vel_data = this.m_velocityBuffer.data;
                    for (let i = 0; i < this.m_count; i++) {
                        if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_wallParticle) {
                            vel_data[i].SetZero();
                        }
                    }
                }
                SolveRigid(step) {
                    let s_position = b2ParticleSystem.SolveRigid_s_position;
                    let s_rotation = b2ParticleSystem.SolveRigid_s_rotation;
                    let s_transform = b2ParticleSystem.SolveRigid_s_transform;
                    let s_velocityTransform = b2ParticleSystem.SolveRigid_s_velocityTransform;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        if (group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            group.UpdateStatistics();
                            ///b2Rot rotation(step.dt * group.m_angularVelocity);
                            let rotation = s_rotation;
                            rotation.SetAngle(step.dt * group.m_angularVelocity);
                            ///b2Transform transform(group.m_center + step.dt * group.m_linearVelocity - b2Mul(rotation, group.m_center), rotation);
                            let position = b2Math_1.b2Vec2.AddVV(group.m_center, b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.MulSV(step.dt, group.m_linearVelocity, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Rot.MulRV(rotation, group.m_center, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0), s_position);
                            let transform = s_transform;
                            transform.SetPositionRotation(position, rotation);
                            ///group.m_transform = b2Mul(transform, group.m_transform);
                            b2Math_1.b2Transform.MulXX(transform, group.m_transform, group.m_transform);
                            let velocityTransform = s_velocityTransform;
                            velocityTransform.p.x = step.inv_dt * transform.p.x;
                            velocityTransform.p.y = step.inv_dt * transform.p.y;
                            velocityTransform.q.s = step.inv_dt * transform.q.s;
                            velocityTransform.q.c = step.inv_dt * (transform.q.c - 1);
                            for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
                                ///m_velocityBuffer.data[i] = b2Mul(velocityTransform, m_positionBuffer.data[i]);
                                b2Math_1.b2Transform.MulXV(velocityTransform, pos_data[i], vel_data[i]);
                            }
                        }
                    }
                }
                SolveElastic(step) {
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
                        if (triad.flags & b2Particle_1.b2ParticleFlag.b2_elasticParticle) {
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
                            r.s = b2Math_1.b2Vec2.CrossVV(oa, pa) + b2Math_1.b2Vec2.CrossVV(ob, pb) + b2Math_1.b2Vec2.CrossVV(oc, pc);
                            r.c = b2Math_1.b2Vec2.DotVV(oa, pa) + b2Math_1.b2Vec2.DotVV(ob, pb) + b2Math_1.b2Vec2.DotVV(oc, pc);
                            let r2 = r.s * r.s + r.c * r.c;
                            let invR = b2Math_1.b2InvSqrt(r2);
                            if (!isFinite(invR)) {
                                invR = 1.98177537e+019;
                            }
                            r.s *= invR;
                            r.c *= invR;
                            ///r.angle = Math.atan2(r.s, r.c); // TODO: optimize
                            let strength = elasticStrength * triad.strength;
                            ///va += strength * (b2Mul(r, oa) - pa);
                            b2Math_1.b2Rot.MulRV(r, oa, s_t0);
                            b2Math_1.b2Vec2.SubVV(s_t0, pa, s_t0);
                            b2Math_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            va.SelfAdd(s_t0);
                            ///vb += strength * (b2Mul(r, ob) - pb);
                            b2Math_1.b2Rot.MulRV(r, ob, s_t0);
                            b2Math_1.b2Vec2.SubVV(s_t0, pb, s_t0);
                            b2Math_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            vb.SelfAdd(s_t0);
                            ///vc += strength * (b2Mul(r, oc) - pc);
                            b2Math_1.b2Rot.MulRV(r, oc, s_t0);
                            b2Math_1.b2Vec2.SubVV(s_t0, pc, s_t0);
                            b2Math_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            vc.SelfAdd(s_t0);
                        }
                    }
                }
                SolveSpring(step) {
                    let s_pa = b2ParticleSystem.SolveSpring_s_pa;
                    let s_pb = b2ParticleSystem.SolveSpring_s_pb;
                    let s_d = b2ParticleSystem.SolveSpring_s_d;
                    let s_f = b2ParticleSystem.SolveSpring_s_f;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    let springStrength = step.inv_dt * this.m_def.springStrength;
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        let pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_1.b2ParticleFlag.b2_springParticle) {
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
                            let d = b2Math_1.b2Vec2.SubVV(pb, pa, s_d);
                            ///float32 r0 = pair.distance;
                            let r0 = pair.distance;
                            ///float32 r1 = d.Length();
                            let r1 = d.Length();
                            ///float32 strength = springStrength * pair.strength;
                            let strength = springStrength * pair.strength;
                            ///b2Vec2 f = strength * (r0 - r1) / r1 * d;
                            let f = b2Math_1.b2Vec2.MulSV(strength * (r0 - r1) / r1, d, s_f);
                            ///va -= f;
                            va.SelfSub(f);
                            ///vb += f;
                            vb.SelfAdd(f);
                        }
                    }
                }
                SolveTensile(step) {
                    let s_weightedNormal = b2ParticleSystem.SolveTensile_s_weightedNormal;
                    let s_s = b2ParticleSystem.SolveTensile_s_s;
                    let s_f = b2ParticleSystem.SolveTensile_s_f;
                    let vel_data = this.m_velocityBuffer.data;
                    b2Assert(this.m_accumulation2Buffer !== null);
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_accumulation2Buffer[i] = new b2Math_1.b2Vec2();
                        this.m_accumulation2Buffer[i].SetZero();
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            let a = contact.indexA;
                            let b = contact.indexB;
                            let w = contact.weight;
                            let n = contact.normal;
                            ///b2Vec2 weightedNormal = (1 - w) * w * n;
                            let weightedNormal = b2Math_1.b2Vec2.MulSV((1 - w) * w, n, s_weightedNormal);
                            ///m_accumulation2Buffer[a] -= weightedNormal;
                            this.m_accumulation2Buffer[a].SelfSub(weightedNormal);
                            ///m_accumulation2Buffer[b] += weightedNormal;
                            this.m_accumulation2Buffer[b].SelfAdd(weightedNormal);
                        }
                    }
                    let criticalVelocity = this.GetCriticalVelocity(step);
                    let pressureStrength = this.m_def.surfaceTensionPressureStrength * criticalVelocity;
                    let normalStrength = this.m_def.surfaceTensionNormalStrength * criticalVelocity;
                    let maxVelocityVariation = b2Settings_2.b2_maxParticleForce * criticalVelocity;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            let a = contact.indexA;
                            let b = contact.indexB;
                            let w = contact.weight;
                            let n = contact.normal;
                            let h = this.m_weightBuffer[a] + this.m_weightBuffer[b];
                            ///b2Vec2 s = m_accumulation2Buffer[b] - m_accumulation2Buffer[a];
                            let s = b2Math_1.b2Vec2.SubVV(this.m_accumulation2Buffer[b], this.m_accumulation2Buffer[a], s_s);
                            let fn = b2Math_1.b2Min(pressureStrength * (h - 2) + normalStrength * b2Math_1.b2Vec2.DotVV(s, n), maxVelocityVariation) * w;
                            ///b2Vec2 f = fn * n;
                            let f = b2Math_1.b2Vec2.MulSV(fn, n, s_f);
                            ///m_velocityBuffer.data[a] -= f;
                            vel_data[a].SelfSub(f);
                            ///m_velocityBuffer.data[b] += f;
                            vel_data[b].SelfAdd(f);
                        }
                    }
                }
                SolveViscous() {
                    let s_v = b2ParticleSystem.SolveViscous_s_v;
                    let s_f = b2ParticleSystem.SolveViscous_s_f;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    let viscousStrength = this.m_def.viscousStrength;
                    let inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        let contact = this.m_bodyContactBuffer.data[k];
                        let a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_1.b2ParticleFlag.b2_viscousParticle) {
                            let b = contact.body;
                            let w = contact.weight;
                            let m = contact.mass;
                            let p = pos_data[a];
                            ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
                            let v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * m * w * v;
                            let f = b2Math_1.b2Vec2.MulSV(viscousStrength * m * w, v, s_f);
                            ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                            vel_data[a].SelfMulAdd(inv_mass, f);
                            ///b.ApplyLinearImpulse(-f, p, true);
                            b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_viscousParticle) {
                            let a = contact.indexA;
                            let b = contact.indexB;
                            let w = contact.weight;
                            ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                            let v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * w * v;
                            let f = b2Math_1.b2Vec2.MulSV(viscousStrength * w, v, s_f);
                            ///m_velocityBuffer.data[a] += f;
                            vel_data[a].SelfAdd(f);
                            ///m_velocityBuffer.data[b] -= f;
                            vel_data[b].SelfSub(f);
                        }
                    }
                }
                SolveRepulsive(step) {
                    let s_f = b2ParticleSystem.SolveRepulsive_s_f;
                    let vel_data = this.m_velocityBuffer.data;
                    let repulsiveStrength = this.m_def.repulsiveStrength * this.GetCriticalVelocity(step);
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_repulsiveParticle) {
                            let a = contact.indexA;
                            let b = contact.indexB;
                            if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
                                let w = contact.weight;
                                let n = contact.normal;
                                ///b2Vec2 f = repulsiveStrength * w * n;
                                let f = b2Math_1.b2Vec2.MulSV(repulsiveStrength * w, n, s_f);
                                ///m_velocityBuffer.data[a] -= f;
                                vel_data[a].SelfSub(f);
                                ///m_velocityBuffer.data[b] += f;
                                vel_data[b].SelfAdd(f);
                            }
                        }
                    }
                }
                SolvePowder(step) {
                    let s_f = b2ParticleSystem.SolvePowder_s_f;
                    let pos_data = this.m_positionBuffer.data;
                    let vel_data = this.m_velocityBuffer.data;
                    let powderStrength = this.m_def.powderStrength * this.GetCriticalVelocity(step);
                    let minWeight = 1.0 - b2Settings_2.b2_particleStride;
                    let inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        let contact = this.m_bodyContactBuffer.data[k];
                        let a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_1.b2ParticleFlag.b2_powderParticle) {
                            let w = contact.weight;
                            if (w > minWeight) {
                                let b = contact.body;
                                let m = contact.mass;
                                let p = pos_data[a];
                                let n = contact.normal;
                                let f = b2Math_1.b2Vec2.MulSV(powderStrength * m * (w - minWeight), n, s_f);
                                vel_data[a].SelfMulSub(inv_mass, f);
                                b.ApplyLinearImpulse(f, p, true);
                            }
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        let contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_powderParticle) {
                            let w = contact.weight;
                            if (w > minWeight) {
                                let a = contact.indexA;
                                let b = contact.indexB;
                                let n = contact.normal;
                                let f = b2Math_1.b2Vec2.MulSV(powderStrength * (w - minWeight), n, s_f);
                                vel_data[a].SelfSub(f);
                                vel_data[b].SelfAdd(f);
                            }
                        }
                    }
                }
                SolveSolid(step) {
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
                            let f = b2Math_1.b2Vec2.MulSV(ejectionStrength * h * w, n, s_f);
                            vel_data[a].SelfSub(f);
                            vel_data[b].SelfAdd(f);
                        }
                    }
                }
                SolveForce(step) {
                    let vel_data = this.m_velocityBuffer.data;
                    let velocityPerForce = step.dt * this.GetParticleInvMass();
                    for (let i = 0; i < this.m_count; i++) {
                        ///m_velocityBuffer.data[i] += velocityPerForce * m_forceBuffer[i];
                        vel_data[i].SelfMulAdd(velocityPerForce, this.m_forceBuffer[i]);
                    }
                    this.m_hasForce = false;
                }
                SolveColorMixing() {
                    // mixes color between contacting particles
                    b2Assert(this.m_colorBuffer.data !== null);
                    const colorMixing = 0.5 * this.m_def.colorMixingStrength;
                    if (colorMixing) {
                        for (let k = 0; k < this.m_contactBuffer.count; k++) {
                            let contact = this.m_contactBuffer.data[k];
                            let a = contact.indexA;
                            let b = contact.indexB;
                            if (this.m_flagsBuffer.data[a] & this.m_flagsBuffer.data[b] &
                                b2Particle_1.b2ParticleFlag.b2_colorMixingParticle) {
                                let colorA = this.m_colorBuffer.data[a];
                                let colorB = this.m_colorBuffer.data[b];
                                // Use the static method to ensure certain compilers inline
                                // this correctly.
                                b2Draw_1.b2Color.MixColors(colorA, colorB, colorMixing);
                            }
                        }
                    }
                }
                SolveZombie() {
                    // removes particles with zombie flag
                    let newCount = 0;
                    ///int32* newIndices = (int32*) this.m_world.m_stackAllocator.Allocate(sizeof(int32) * this.m_count);
                    let newIndices = []; // TODO: static
                    for (let i = 0; i < this.m_count; i++) {
                        newIndices[i] = b2Settings_1.b2_invalidParticleIndex;
                    }
                    b2Assert(newIndices.length === this.m_count);
                    let allParticleFlags = 0;
                    for (let i = 0; i < this.m_count; i++) {
                        let flags = this.m_flagsBuffer.data[i];
                        if (flags & b2Particle_1.b2ParticleFlag.b2_zombieParticle) {
                            let destructionListener = this.m_world.m_destructionListener;
                            if ((flags & b2Particle_1.b2ParticleFlag.b2_destructionListenerParticle) && destructionListener) {
                                destructionListener.SayGoodbyeParticle(this, i);
                            }
                            // Destroy particle handle.
                            if (this.m_handleIndexBuffer.data) {
                                let handle = this.m_handleIndexBuffer.data[i];
                                if (handle) {
                                    handle.SetIndex(b2Settings_1.b2_invalidParticleIndex);
                                    this.m_handleIndexBuffer.data[i] = null;
                                    ///m_handleAllocator.Free(handle);
                                }
                            }
                            newIndices[i] = b2Settings_1.b2_invalidParticleIndex;
                        }
                        else {
                            newIndices[i] = newCount;
                            if (i !== newCount) {
                                // Update handle to reference new particle index.
                                if (this.m_handleIndexBuffer.data) {
                                    let handle = this.m_handleIndexBuffer.data[i];
                                    if (handle)
                                        handle.SetIndex(newCount);
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
                        IsProxyInvalid: function (proxy) {
                            return proxy.index < 0;
                        },
                        ///static bool IsContactInvalid(const b2ParticleContact& contact)
                        IsContactInvalid: function (contact) {
                            return contact.indexA < 0 || contact.indexB < 0;
                        },
                        ///static bool IsBodyContactInvalid(const b2ParticleBodyContact& contact)
                        IsBodyContactInvalid: function (contact) {
                            return contact.index < 0;
                        },
                        ///static bool IsPairInvalid(const b2ParticlePair& pair)
                        IsPairInvalid: function (pair) {
                            return pair.indexA < 0 || pair.indexB < 0;
                        },
                        ///static bool IsTriadInvalid(const b2ParticleTriad& triad)
                        IsTriadInvalid: function (triad) {
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
                            if (newIndex !== b2Settings_1.b2_invalidParticleIndex) {
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
                                firstIndex = b2Math_1.b2Min(firstIndex, j);
                                lastIndex = b2Math_1.b2Max(lastIndex, j + 1);
                            }
                            else {
                                modified = true;
                            }
                        }
                        if (firstIndex < lastIndex) {
                            group.m_firstIndex = firstIndex;
                            group.m_lastIndex = lastIndex;
                            if (modified) {
                                if (group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                                    this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
                                }
                            }
                        }
                        else {
                            group.m_firstIndex = 0;
                            group.m_lastIndex = 0;
                            if (!(group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty)) {
                                this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed);
                            }
                        }
                    }
                    // update particle count
                    this.m_count = newCount;
                    ///m_world.m_stackAllocator.Free(newIndices);
                    this.m_allParticleFlags = allParticleFlags;
                    this.m_needsUpdateAllParticleFlags = false;
                    // destroy bodies with no particles
                    for (let group = this.m_groupList; group;) {
                        let next = group.GetNext();
                        if (group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed) {
                            this.DestroyParticleGroup(group);
                        }
                        group = next;
                    }
                }
                /**
                 * Destroy all particles which have outlived their lifetimes set
                 * by SetParticleLifetime().
                 */
                SolveLifetimes(step) {
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
                        let ExpirationTimeComparator = function (particleIndexA, particleIndexB) {
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
                RotateBuffer(start, mid, end) {
                    // move the particles assigned to the given group toward the end of array
                    if (start === mid || mid === end) {
                        return;
                    }
                    b2Assert(mid >= start && mid <= end);
                    function newIndices(i) {
                        if (i < start) {
                            return i;
                        }
                        else if (i < mid) {
                            return i + end - mid;
                        }
                        else if (i < end) {
                            return i + start - mid;
                        }
                        else {
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
                            if (handle)
                                handle.SetIndex(newIndices(handle.GetIndex()));
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
                GetCriticalVelocity(step) {
                    return this.m_particleDiameter * step.inv_dt;
                }
                GetCriticalVelocitySquared(step) {
                    let velocity = this.GetCriticalVelocity(step);
                    return velocity * velocity;
                }
                GetCriticalPressure(step) {
                    return this.m_def.density * this.GetCriticalVelocitySquared(step);
                }
                GetParticleStride() {
                    return b2Settings_2.b2_particleStride * this.m_particleDiameter;
                }
                GetParticleMass() {
                    let stride = this.GetParticleStride();
                    return this.m_def.density * stride * stride;
                }
                GetParticleInvMass() {
                    ///return 1.777777 * this.m_inverseDensity * this.m_inverseDiameter * this.m_inverseDiameter;
                    // mass = density * stride^2, so we take the inverse of this.
                    let inverseStride = this.m_inverseDiameter * (1.0 / b2Settings_2.b2_particleStride);
                    return this.m_inverseDensity * inverseStride * inverseStride;
                }
                /**
                 * Get the world's contact filter if any particles with the
                 * b2_contactFilterParticle flag are present in the system.
                 */
                GetFixtureContactFilter() {
                    return (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_fixtureContactFilterParticle) ?
                        this.m_world.m_contactManager.m_contactFilter : null;
                }
                /**
                 * Get the world's contact filter if any particles with the
                 * b2_particleContactFilterParticle flag are present in the
                 * system.
                 */
                GetParticleContactFilter() {
                    return (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_particleContactFilterParticle) ?
                        this.m_world.m_contactManager.m_contactFilter : null;
                }
                /**
                 * Get the world's contact listener if any particles with the
                 * b2_fixtureContactListenerParticle flag are present in the
                 * system.
                 */
                GetFixtureContactListener() {
                    return (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_fixtureContactListenerParticle) ?
                        this.m_world.m_contactManager.m_contactListener : null;
                }
                /**
                 * Get the world's contact listener if any particles with the
                 * b2_particleContactListenerParticle flag are present in the
                 * system.
                 */
                GetParticleContactListener() {
                    return (this.m_allParticleFlags & b2Particle_1.b2ParticleFlag.b2_particleContactListenerParticle) ?
                        this.m_world.m_contactManager.m_contactListener : null;
                }
                SetUserOverridableBuffer(buffer, newData, newCapacity) {
                    b2Assert(((newData !== null) && (newCapacity > 0)) || ((newData === null) && (newCapacity === 0)));
                    ///if (!buffer.userSuppliedCapacity)
                    ///{
                    ///this.m_world.m_blockAllocator.Free(buffer.data, sizeof(T) * m_internalAllocatedCapacity);
                    ///}
                    buffer.data = newData;
                    buffer.userSuppliedCapacity = newCapacity;
                }
                SetGroupFlags(group, newFlags) {
                    let oldFlags = group.m_groupFlags;
                    if ((oldFlags ^ newFlags) & b2ParticleGroup_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                        // If the b2_solidParticleGroup flag changed schedule depth update.
                        newFlags |= b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth;
                    }
                    if (oldFlags & ~newFlags) {
                        // If any flags might be removed
                        this.m_needsUpdateAllGroupFlags = true;
                    }
                    if (~this.m_allGroupFlags & newFlags) {
                        // If any flags were added
                        if (newFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                            this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer);
                        }
                        this.m_allGroupFlags |= newFlags;
                    }
                    group.m_groupFlags = newFlags;
                }
                static BodyContactCompare(lhs, rhs) {
                    if (lhs.index === rhs.index) {
                        // Subsort by weight, decreasing.
                        return lhs.weight > rhs.weight;
                    }
                    return lhs.index < rhs.index;
                }
                RemoveSpuriousBodyContacts() {
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
                    let b2ParticleBodyContactRemovePredicate = function (contact) {
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
                        let pos = b2Math_1.b2Vec2.AddVV(system.m_positionBuffer.data[contact.index], n, s_pos);
                        // pos is now a point projected back along the contact normal to the
                        // contact distance. If the surface makes sense for a contact, pos will
                        // now lie on or in the fixture generating
                        if (!contact.fixture.TestPoint(pos)) {
                            let childCount = contact.fixture.GetShape().GetChildCount();
                            for (let childIndex = 0; childIndex < childCount; childIndex++) {
                                let normal = s_normal;
                                let distance = contact.fixture.ComputeDistance(pos, normal, childIndex);
                                if (distance < b2Settings_1.b2_linearSlop) {
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
                DetectStuckParticle(particle) {
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
                ValidateParticleIndex(index) {
                    return index >= 0 && index < this.GetParticleCount() &&
                        index !== b2Settings_1.b2_invalidParticleIndex;
                }
                /**
                 * Get the time elapsed in
                 * b2ParticleSystemDef::lifetimeGranularity.
                 */
                GetQuantizedTimeElapsed() {
                    ///return (int32)(m_timeElapsed >> 32);
                    return Math.floor(this.m_timeElapsed / 0x100000000);
                }
                /**
                 * Convert a lifetime in seconds to an expiration time.
                 */
                LifetimeToExpirationTime(lifetime) {
                    ///return m_timeElapsed + (int64)((lifetime / m_def.lifetimeGranularity) * (float32)(1LL << 32));
                    return this.m_timeElapsed + Math.floor(((lifetime / this.m_def.lifetimeGranularity) * 0x100000000));
                }
                ForceCanBeApplied(flags) {
                    return !(flags & b2Particle_1.b2ParticleFlag.b2_wallParticle);
                }
                PrepareForceBuffer() {
                    if (!this.m_hasForce) {
                        ///memset(m_forceBuffer, 0, sizeof(*m_forceBuffer) * m_count);
                        for (let i = 0; i < this.m_count; i++) {
                            this.m_forceBuffer[i].SetZero();
                        }
                        this.m_hasForce = true;
                    }
                }
                IsRigidGroup(group) {
                    return (group !== null) && ((group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0);
                }
                GetLinearVelocity(group, particleIndex, point, out) {
                    if (this.IsRigidGroup(group)) {
                        return group.GetLinearVelocityFromWorldPoint(point, out);
                    }
                    else {
                        ///return m_velocityBuffer.data[particleIndex];
                        return out.Copy(this.m_velocityBuffer.data[particleIndex]);
                    }
                }
                InitDampingParameter(invMass, invInertia, tangentDistance, mass, inertia, center, point, normal) {
                    ///*invMass = mass > 0 ? 1 / mass : 0;
                    invMass[0] = mass > 0 ? 1 / mass : 0;
                    ///*invInertia = inertia > 0 ? 1 / inertia : 0;
                    invInertia[0] = inertia > 0 ? 1 / inertia : 0;
                    ///*tangentDistance = b2Cross(point - center, normal);
                    tangentDistance[0] = b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.SubVV(point, center, b2Math_1.b2Vec2.s_t0), normal);
                }
                InitDampingParameterWithRigidGroupOrParticle(invMass, invInertia, tangentDistance, isRigidGroup, group, particleIndex, point, normal) {
                    if (isRigidGroup) {
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, group.GetMass(), group.GetInertia(), group.GetCenter(), point, normal);
                    }
                    else {
                        let flags = this.m_flagsBuffer.data[particleIndex];
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, flags & b2Particle_1.b2ParticleFlag.b2_wallParticle ? 0 : this.GetParticleMass(), 0, point, point, normal);
                    }
                }
                ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, normalVelocity) {
                    let invMass = invMassA + invInertiaA * tangentDistanceA * tangentDistanceA +
                        invMassB + invInertiaB * tangentDistanceB * tangentDistanceB;
                    return invMass > 0 ? normalVelocity / invMass : 0;
                }
                ApplyDamping(invMass, invInertia, tangentDistance, isRigidGroup, group, particleIndex, impulse, normal) {
                    if (isRigidGroup) {
                        ///group.m_linearVelocity += impulse * invMass * normal;
                        group.m_linearVelocity.SelfMulAdd(impulse * invMass, normal);
                        ///group.m_angularVelocity += impulse * tangentDistance * invInertia;
                        group.m_angularVelocity += impulse * tangentDistance * invInertia;
                    }
                    else {
                        ///m_velocityBuffer.data[particleIndex] += impulse * invMass * normal;
                        this.m_velocityBuffer.data[particleIndex].SelfMulAdd(impulse * invMass, normal);
                    }
                }
            };
            b2ParticleSystem.xTruncBits = 12;
            b2ParticleSystem.yTruncBits = 12;
            b2ParticleSystem.tagBits = 8 * 4; // 8u * sizeof(uint32);
            b2ParticleSystem.yOffset = 1 << (b2ParticleSystem.yTruncBits - 1);
            b2ParticleSystem.yShift = b2ParticleSystem.tagBits - b2ParticleSystem.yTruncBits;
            b2ParticleSystem.xShift = b2ParticleSystem.tagBits - b2ParticleSystem.yTruncBits - b2ParticleSystem.xTruncBits;
            b2ParticleSystem.xScale = 1 << b2ParticleSystem.xShift;
            b2ParticleSystem.xOffset = b2ParticleSystem.xScale * (1 << (b2ParticleSystem.xTruncBits - 1));
            b2ParticleSystem.yMask = ((1 << b2ParticleSystem.yTruncBits) - 1) << b2ParticleSystem.yShift;
            b2ParticleSystem.xMask = ~b2ParticleSystem.yMask;
            b2ParticleSystem.DestroyParticlesInShape_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.CreateParticleGroup_s_transform = new b2Math_1.b2Transform();
            b2ParticleSystem.ComputeCollisionEnergy_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.QueryShapeAABB_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.QueryPointAABB_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.RayCast_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.RayCast_s_p = new b2Math_1.b2Vec2();
            b2ParticleSystem.RayCast_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.RayCast_s_n = new b2Math_1.b2Vec2();
            b2ParticleSystem.RayCast_s_point = new b2Math_1.b2Vec2();
            /**
             * All particle types that require creating pairs
             */
            b2ParticleSystem.k_pairFlags = b2Particle_1.b2ParticleFlag.b2_springParticle;
            /**
             * All particle types that require creating triads
             *
             * @type {number}
             */
            b2ParticleSystem.k_triadFlags = b2Particle_1.b2ParticleFlag.b2_elasticParticle;
            /**
             * All particle types that do not produce dynamic pressure
             *
             * @type {number}
             */
            b2ParticleSystem.k_noPressureFlags = b2Particle_1.b2ParticleFlag.b2_powderParticle | b2Particle_1.b2ParticleFlag.b2_tensileParticle;
            /**
             * All particle types that apply extra damping force with bodies
             *
             * @type {number}
             */
            b2ParticleSystem.k_extraDampingFlags = b2Particle_1.b2ParticleFlag.b2_staticPressureParticle;
            /**
             * @type {number}
             */
            b2ParticleSystem.k_barrierWallFlags = b2Particle_1.b2ParticleFlag.b2_barrierParticle | b2Particle_1.b2ParticleFlag.b2_wallParticle;
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_edge = new b2EdgeShape_1.b2EdgeShape();
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_d = new b2Math_1.b2Vec2();
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_p = new b2Math_1.b2Vec2();
            b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p = new b2Math_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dab = new b2Math_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dbc = new b2Math_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dca = new b2Math_1.b2Vec2();
            b2ParticleSystem.AddContact_s_d = new b2Math_1.b2Vec2();
            b2ParticleSystem.UpdateBodyContacts_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.Solve_s_subStep = new b2TimeStep_1.b2TimeStep();
            b2ParticleSystem.SolveCollision_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.SolveGravity_s_gravity = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_aabb = new b2Collision_1.b2AABB();
            b2ParticleSystem.SolveBarrier_s_va = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vb = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_pba = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vba = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vc = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_pca = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vca = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_qba = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_qca = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_dv = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolvePressure_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveDamping_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveDamping_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_t0 = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_t1 = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_p = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveExtraDamping_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveExtraDamping_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigid_s_position = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRigid_s_rotation = new b2Math_1.b2Rot();
            b2ParticleSystem.SolveRigid_s_transform = new b2Math_1.b2Transform();
            b2ParticleSystem.SolveRigid_s_velocityTransform = new b2Math_1.b2Transform();
            b2ParticleSystem.SolveElastic_s_pa = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_pb = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_pc = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_r = new b2Math_1.b2Rot();
            b2ParticleSystem.SolveElastic_s_t0 = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_pa = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_pb = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_d = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_weightedNormal = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_s = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveViscous_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveViscous_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveRepulsive_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolvePowder_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.SolveSolid_s_f = new b2Math_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_n = new b2Math_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_pos = new b2Math_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_normal = new b2Math_1.b2Vec2();
            exports_1("b2ParticleSystem", b2ParticleSystem);
            (function (b2ParticleSystem) {
                class UserOverridableBuffer {
                    constructor() {
                        this.data = null;
                        this.userSuppliedCapacity = 0;
                    }
                }
                b2ParticleSystem.UserOverridableBuffer = UserOverridableBuffer;
                class Proxy {
                    constructor() {
                        this.index = b2Settings_1.b2_invalidParticleIndex;
                        this.tag = 0;
                    }
                    static CompareProxyProxy(a, b) {
                        return a.tag < b.tag;
                    }
                    static CompareTagProxy(a, b) {
                        return a < b.tag;
                    }
                    static CompareProxyTag(a, b) {
                        return a.tag < b;
                    }
                }
                b2ParticleSystem.Proxy = Proxy;
                class InsideBoundsEnumerator {
                    /**
                     * InsideBoundsEnumerator enumerates all particles inside the
                     * given bounds.
                     *
                     * Construct an enumerator with bounds of tags and a range of
                     * proxies.
                     */
                    constructor(system, lower, upper, first, last) {
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
                    GetNext() {
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
                        return b2Settings_1.b2_invalidParticleIndex;
                    }
                }
                b2ParticleSystem.InsideBoundsEnumerator = InsideBoundsEnumerator;
                class ParticleListNode {
                    constructor() {
                        /**
                         * The head of the list.
                         */
                        this.list = null;
                        /**
                         * The next node in the list.
                         */
                        this.next = null;
                        /**
                         * Number of entries in the list. Valid only for the node at the
                         * head of the list.
                         */
                        this.count = 0;
                        /**
                         * Particle index.
                         */
                        this.index = 0;
                    }
                }
                b2ParticleSystem.ParticleListNode = ParticleListNode;
                /**
                 * @constructor
                 */
                class FixedSetAllocator {
                    Allocate(itemSize, count) {
                        // TODO
                        return count;
                    }
                    Clear() {
                        // TODO
                    }
                    GetCount() {
                        // TODO
                        return 0;
                    }
                    Invalidate(itemIndex) {
                        // TODO
                    }
                    GetValidBuffer() {
                        // TODO
                        return [];
                    }
                    GetBuffer() {
                        // TODO
                        return [];
                    }
                    SetCount(count) {
                        // TODO
                    }
                }
                b2ParticleSystem.FixedSetAllocator = FixedSetAllocator;
                class FixtureParticle {
                    constructor(fixture, particle) {
                        this.first = null;
                        this.second = b2Settings_1.b2_invalidParticleIndex;
                        this.first = fixture;
                        this.second = particle;
                    }
                }
                b2ParticleSystem.FixtureParticle = FixtureParticle;
                class FixtureParticleSet extends b2ParticleSystem.FixedSetAllocator {
                    Initialize(bodyContactBuffer, flagsBuffer) {
                        // TODO
                    }
                    Find(pair) {
                        // TODO
                        return b2Settings_1.b2_invalidParticleIndex;
                    }
                }
                b2ParticleSystem.FixtureParticleSet = FixtureParticleSet;
                class ParticlePair {
                    constructor(particleA, particleB) {
                        this.first = b2Settings_1.b2_invalidParticleIndex;
                        this.second = b2Settings_1.b2_invalidParticleIndex;
                        this.first = particleA;
                        this.second = particleB;
                    }
                }
                b2ParticleSystem.ParticlePair = ParticlePair;
                class b2ParticlePairSet extends b2ParticleSystem.FixedSetAllocator {
                    Initialize(contactBuffer, flagsBuffer) {
                        // TODO
                    }
                    /**
                     * @return {number}
                     * @param {b2ParticleSystem.ParticlePair} pair
                     */
                    Find(pair) {
                        // TODO
                        return b2Settings_1.b2_invalidParticleIndex;
                    }
                }
                b2ParticleSystem.b2ParticlePairSet = b2ParticlePairSet;
                class ConnectionFilter {
                    /**
                     * Is the particle necessary for connection?
                     * A pair or a triad should contain at least one 'necessary'
                     * particle.
                     */
                    IsNecessary(index) {
                        return true;
                    }
                    /**
                     * An additional condition for creating a pair.
                     */
                    ShouldCreatePair(a, b) {
                        return true;
                    }
                    /**
                     * An additional condition for creating a triad.
                     */
                    ShouldCreateTriad(a, b, c) {
                        return true;
                    }
                }
                b2ParticleSystem.ConnectionFilter = ConnectionFilter;
                class DestroyParticlesInShapeCallback extends b2WorldCallbacks_1.b2QueryCallback {
                    constructor(system, shape, xf, callDestructionListener) {
                        super();
                        this.m_system = null;
                        this.m_shape = null;
                        this.m_xf = null;
                        this.m_callDestructionListener = false;
                        this.m_destroyed = 0;
                        this.m_system = system;
                        this.m_shape = shape;
                        this.m_xf = xf;
                        this.m_callDestructionListener = callDestructionListener;
                        this.m_destroyed = 0;
                    }
                    ReportFixture(fixture) {
                        return false;
                    }
                    ReportParticle(particleSystem, index) {
                        if (particleSystem !== this.m_system)
                            return false;
                        b2Assert(index >= 0 && index < this.m_system.m_count);
                        if (this.m_shape.TestPoint(this.m_xf, this.m_system.m_positionBuffer.data[index])) {
                            this.m_system.DestroyParticle(index, this.m_callDestructionListener);
                            this.m_destroyed++;
                        }
                        return true;
                    }
                    Destroyed() {
                        return this.m_destroyed;
                    }
                }
                b2ParticleSystem.DestroyParticlesInShapeCallback = DestroyParticlesInShapeCallback;
                class JoinParticleGroupsFilter extends b2ParticleSystem.ConnectionFilter {
                    constructor(threshold) {
                        super();
                        this.m_threshold = 0;
                        this.m_threshold = threshold;
                    }
                    /**
                     * An additional condition for creating a pair.
                     */
                    ShouldCreatePair(a, b) {
                        return (a < this.m_threshold && this.m_threshold <= b) ||
                            (b < this.m_threshold && this.m_threshold <= a);
                    }
                    /**
                     * An additional condition for creating a triad.
                     */
                    ShouldCreateTriad(a, b, c) {
                        return (a < this.m_threshold || b < this.m_threshold || c < this.m_threshold) &&
                            (this.m_threshold <= a || this.m_threshold <= b || this.m_threshold <= c);
                    }
                }
                b2ParticleSystem.JoinParticleGroupsFilter = JoinParticleGroupsFilter;
                class CompositeShape extends b2Shape_1.b2Shape {
                    constructor(shapes, shapeCount) {
                        super(b2Shape_1.b2ShapeType.e_unknown, 0);
                        this.m_shapes = null;
                        this.m_shapeCount = 0;
                        this.m_shapes = shapes;
                        this.m_shapeCount = shapeCount;
                    }
                    Clone() {
                        b2Assert(false);
                        return null;
                    }
                    GetChildCount() {
                        return 1;
                    }
                    /**
                     * @see b2Shape::TestPoint
                     */
                    TestPoint(xf, p) {
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
                    ComputeDistance(xf, p, normal, childIndex) {
                        b2Assert(false);
                        return 0;
                    }
                    /**
                     * Implement b2Shape.
                     */
                    RayCast(output, input, xf, childIndex) {
                        b2Assert(false);
                        return false;
                    }
                    /**
                     * @see b2Shape::ComputeAABB
                     */
                    ComputeAABB(aabb, xf, childIndex) {
                        let s_subaabb = new b2Collision_1.b2AABB();
                        aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                        aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                        aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                        aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
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
                    ComputeMass(massData, density) {
                        b2Assert(false);
                    }
                    SetupDistanceProxy(proxy, index) {
                        b2Assert(false);
                    }
                    ComputeSubmergedArea(normal, offset, xf, c) {
                        b2Assert(false);
                        return 0;
                    }
                    Dump(log) {
                        b2Assert(false);
                    }
                }
                b2ParticleSystem.CompositeShape = CompositeShape;
                class ReactiveFilter extends b2ParticleSystem.ConnectionFilter {
                    constructor(flagsBuffer) {
                        super();
                        this.m_flagsBuffer = null;
                        this.m_flagsBuffer = flagsBuffer;
                    }
                    IsNecessary(index) {
                        return (this.m_flagsBuffer.data[index] & b2Particle_1.b2ParticleFlag.b2_reactiveParticle) !== 0;
                    }
                }
                b2ParticleSystem.ReactiveFilter = ReactiveFilter;
                class UpdateBodyContactsCallback extends b2FixtureParticleQueryCallback {
                    constructor(system, contactFilter) {
                        super(system); // base class constructor
                        this.m_contactFilter = contactFilter;
                    }
                    ShouldCollideFixtureParticle(fixture, particleSystem, particleIndex) {
                        // Call the contact filter if it's set, to determine whether to
                        // filter this contact.  Returns true if contact calculations should
                        // be performed, false otherwise.
                        if (this.m_contactFilter) {
                            let flags = this.m_system.GetFlagsBuffer();
                            if (flags[particleIndex] & b2Particle_1.b2ParticleFlag.b2_fixtureContactFilterParticle) {
                                return this.m_contactFilter.ShouldCollideFixtureParticle(fixture, this.m_system, particleIndex);
                            }
                        }
                        return true;
                    }
                    ReportFixtureAndParticle(fixture, childIndex, a) {
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
                            let invAm = this.m_system.m_flagsBuffer.data[a] &
                                b2Particle_1.b2ParticleFlag.b2_wallParticle ? 0 : this.m_system.GetParticleInvMass();
                            ///b2Vec2 rp = ap - bp;
                            let rp = b2Math_1.b2Vec2.SubVV(ap, bp, s_rp);
                            let rpn = b2Math_1.b2Vec2.CrossVV(rp, n);
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
                }
                UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n = new b2Math_1.b2Vec2();
                UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp = new b2Math_1.b2Vec2();
                b2ParticleSystem.UpdateBodyContactsCallback = UpdateBodyContactsCallback;
                class SolveCollisionCallback extends b2FixtureParticleQueryCallback {
                    constructor(system, step) {
                        super(system); // base class constructor
                        this.m_step = step;
                    }
                    ReportFixtureAndParticle(fixture, childIndex, a) {
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
                            let p1 = b2Math_1.b2Transform.MulTXV(body.m_xf0, ap, s_p1);
                            if (fixture.GetShape().GetType() === b2Shape_1.b2ShapeType.e_circleShape) {
                                // Make relative to the center of the circle
                                ///p1 -= body.GetLocalCenter();
                                p1.SelfSub(body.GetLocalCenter());
                                // Re-apply rotation about the center of the circle
                                ///p1 = b2Mul(body.m_xf0.q, p1);
                                b2Math_1.b2Rot.MulRV(body.m_xf0.q, p1, p1);
                                // Subtract rotation of the current frame
                                ///p1 = b2MulT(body.m_xf.q, p1);
                                b2Math_1.b2Rot.MulTRV(body.m_xf.q, p1, p1);
                                // Return to local space
                                ///p1 += body.GetLocalCenter();
                                p1.SelfAdd(body.GetLocalCenter());
                            }
                            // Return to global space and apply rotation of current frame
                            ///input.p1 = b2Mul(body.m_xf, p1);
                            b2Math_1.b2Transform.MulXV(body.m_xf, p1, input.p1);
                        }
                        else {
                            ///input.p1 = ap;
                            input.p1.Copy(ap);
                        }
                        ///input.p2 = ap + m_step.dt * av;
                        b2Math_1.b2Vec2.AddVMulSV(ap, this.m_step.dt, av, input.p2);
                        input.maxFraction = 1;
                        if (fixture.RayCast(output, input, childIndex)) {
                            let n = output.normal;
                            ///b2Vec2 p = (1 - output.fraction) * input.p1 + output.fraction * input.p2 + b2_linearSlop * n;
                            let p = s_p;
                            p.x = (1 - output.fraction) * input.p1.x + output.fraction * input.p2.x + b2Settings_1.b2_linearSlop * n.x;
                            p.y = (1 - output.fraction) * input.p1.y + output.fraction * input.p2.y + b2Settings_1.b2_linearSlop * n.y;
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
                    /**
                     * @export
                     * @return {boolean}
                     * @param {b2ParticleSystem} system
                     * @param {number} index
                     */
                    ReportParticle(system, index) {
                        return false;
                    }
                }
                SolveCollisionCallback.ReportFixtureAndParticle_s_p1 = new b2Math_1.b2Vec2();
                SolveCollisionCallback.ReportFixtureAndParticle_s_output = new b2Collision_1.b2RayCastOutput();
                SolveCollisionCallback.ReportFixtureAndParticle_s_input = new b2Collision_1.b2RayCastInput();
                SolveCollisionCallback.ReportFixtureAndParticle_s_p = new b2Math_1.b2Vec2();
                SolveCollisionCallback.ReportFixtureAndParticle_s_v = new b2Math_1.b2Vec2();
                SolveCollisionCallback.ReportFixtureAndParticle_s_f = new b2Math_1.b2Vec2();
                b2ParticleSystem.SolveCollisionCallback = SolveCollisionCallback;
            })(b2ParticleSystem || (b2ParticleSystem = {}));
            exports_1("b2ParticleSystem", b2ParticleSystem);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZVN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUGFydGljbGVTeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7SUFzQkgsa0JBQWtCLFNBQWtCLElBQUcsQ0FBQztJQUV4Qyx1QkFBMEIsS0FBVSxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3hELE1BQU0sR0FBRyxHQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELHlCQUE0QixDQUFJLEVBQUUsQ0FBSSxJQUFhLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEUsa0JBQXFCLEtBQVUsRUFBRSxRQUFnQixDQUFDLEVBQUUsTUFBYyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRSxNQUErQixlQUFlO1FBQ3BJLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDekIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRVosU0FBVyxFQUFFLGdCQUFnQjtZQUMzQixPQUFPLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsd0JBQXdCO2dCQUN0RCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QjtnQkFDM0YsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsMkJBQTJCO2dC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QUssQ0FBQyxFQUFFLENBQUM7NEJBQ2xCLHdDQUF3Qzs0QkFDeEMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsd0NBQXdDOzRCQUN4QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoQyx3Q0FBd0M7NEJBQ3hDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2hDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckIsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyQixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLHNCQUFzQjs0QkFDdEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRCQUMzQixzQkFBc0I7NEJBQ3RCLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDM0Isc0JBQXNCOzRCQUN0QixFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7NEJBQzNCLHNEQUFzRDs0QkFDdEQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs0QkFDNUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs0QkFDNUMsa0JBQWtCOzRCQUNsQixFQUFFLENBQUMsQ0FBQyxJ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