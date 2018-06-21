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
    var b2Settings_1, b2Settings_2, b2Math_1, b2Draw_1, b2Collision_1, b2Shape_1, b2EdgeShape_1, b2TimeStep_1, b2WorldCallbacks_1, b2Particle_1, b2ParticleGroup_1, b2VoronoiDiagram_1, b2GrowableBuffer, b2FixtureParticleQueryCallback, b2ParticleContact, b2ParticleBodyContact, b2ParticlePair, b2ParticleTriad, b2ParticleSystemDef, b2ParticleSystem;
    var __moduleName = context_1 && context_1.id;
    function std_iter_swap(array, a, b) {
        const tmp = array[a];
        array[a] = array[b];
        array[b] = tmp;
    }
    function default_compare(a, b) { return a < b; }
    function std_sort(array, first = 0, len = array.length - first, cmp = default_compare) {
        let left = first;
        const stack = [];
        let pos = 0;
        for (;;) { /* outer loop */
            for (; left + 1 < len; len++) { /* sort left to len-1 */
                const pivot = array[left + Math.floor(Math.random() * (len - left))]; /* pick random pivot */
                stack[pos++] = len; /* sort right part later */
                for (let right = left - 1;;) { /* inner loop: partitioning */
                    while (cmp(array[++right], pivot)) { } /* look for greater element */
                    while (cmp(pivot, array[--len])) { } /* look for smaller element */
                    if (right >= len) {
                        break;
                    } /* partition point found? */
                    std_iter_swap(array, right, len); /* the only swap */
                } /* partitioned, continue left part */
            }
            if (pos === 0) {
                break;
            } /* stack empty? */
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
            if (predicate(array[c])) {
                continue;
            }
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
            const step = Math.floor(count / 2);
            let it = first + step;
            if (cmp(array[it], val)) {
                first = ++it;
                count -= step + 1;
            }
            else {
                count = step;
            }
        }
        return first;
    }
    function std_upper_bound(array, first, last, val, cmp = default_compare) {
        let count = last - first;
        while (count > 0) {
            const step = Math.floor(count / 2);
            let it = first + step;
            if (!cmp(val, array[it])) {
                first = ++it;
                count -= step + 1;
            }
            else {
                count = step;
            }
        }
        return first;
    }
    function std_rotate(array, first, n_first, last) {
        let next = n_first;
        while (first !== next) {
            std_iter_swap(array, first++, next++);
            if (next === last) {
                next = n_first;
            }
            else if (first === n_first) {
                n_first = next;
            }
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
                    if (this.capacity >= newCapacity) {
                        return;
                    }
                    // DEBUG: b2Assert(this.capacity === this.data.length);
                    for (let i = this.capacity; i < newCapacity; ++i) {
                        this.data[i] = this.allocator();
                    }
                    this.capacity = newCapacity;
                }
                Grow() {
                    // Double the capacity.
                    const newCapacity = this.capacity ? 2 * this.capacity : b2Settings_1.b2_minParticleSystemBufferCapacity;
                    // DEBUG: b2Assert(newCapacity > this.capacity);
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
                    // DEBUG: b2Assert(false);
                }
                Data() {
                    return this.data;
                }
                GetCount() {
                    return this.count;
                }
                SetCount(newCount) {
                    // DEBUG: b2Assert(0 <= newCount && newCount <= this.capacity);
                    this.count = newCount;
                }
                GetCapacity() {
                    return this.capacity;
                }
                RemoveIf(pred) {
                    // DEBUG: let count = 0;
                    // DEBUG: for (let i = 0; i < this.count; ++i) {
                    // DEBUG:   if (!pred(this.data[i])) {
                    // DEBUG:     count++;
                    // DEBUG:   }
                    // DEBUG: }
                    this.count = std_remove_if(this.data, pred, this.count);
                    // DEBUG: b2Assert(count === this.count);
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
                    // DEBUG: b2Assert(false); // pure virtual
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
                    // DEBUG: b2Assert(a <= b2_maxParticleIndex && b <= b2_maxParticleIndex);
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
                    this.m_stuckParticleBuffer = new b2GrowableBuffer(() => 0);
                    this.m_proxyBuffer = new b2GrowableBuffer(() => new b2ParticleSystem.Proxy());
                    this.m_contactBuffer = new b2GrowableBuffer(() => new b2ParticleContact());
                    this.m_bodyContactBuffer = new b2GrowableBuffer(() => new b2ParticleBodyContact());
                    this.m_pairBuffer = new b2GrowableBuffer(() => new b2ParticlePair());
                    this.m_triadBuffer = new b2GrowableBuffer(() => new b2ParticleTriad());
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
                    this.m_prev = null;
                    this.m_next = null;
                    this.SetStrictContactCheck(def.strictContactCheck);
                    this.SetDensity(def.density);
                    this.SetGravityScale(def.gravityScale);
                    this.SetRadius(def.radius);
                    this.SetMaxParticleCount(def.maxCount);
                    // DEBUG: b2Assert(def.lifetimeGranularity > 0.0);
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
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    if (this.m_count >= this.m_internalAllocatedCapacity) {
                        // Double the particle capacity.
                        const capacity = this.m_count ? 2 * this.m_count : b2Settings_1.b2_minParticleSystemBufferCapacity;
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
                    const index = this.m_count++;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
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
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    this.m_positionBuffer.data[index] = (this.m_positionBuffer.data[index] || new b2Math_1.b2Vec2()).Copy(b2Settings_1.b2Maybe(def.position, b2Math_1.b2Vec2.ZERO));
                    this.m_velocityBuffer.data[index] = (this.m_velocityBuffer.data[index] || new b2Math_1.b2Vec2()).Copy(b2Settings_1.b2Maybe(def.velocity, b2Math_1.b2Vec2.ZERO));
                    this.m_weightBuffer[index] = 0;
                    this.m_forceBuffer[index] = (this.m_forceBuffer[index] || new b2Math_1.b2Vec2()).SetZero();
                    if (this.m_staticPressureBuffer) {
                        this.m_staticPressureBuffer[index] = 0;
                    }
                    if (this.m_depthBuffer) {
                        this.m_depthBuffer[index] = 0;
                    }
                    const color = new b2Draw_1.b2Color().Copy(b2Settings_1.b2Maybe(def.color, b2Draw_1.b2Color.ZERO));
                    if (this.m_colorBuffer.data || !color.IsZero()) {
                        this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
                        this.m_colorBuffer.data[index] = (this.m_colorBuffer.data[index] || new b2Draw_1.b2Color()).Copy(color);
                    }
                    if (this.m_userDataBuffer.data || def.userData) {
                        this.m_userDataBuffer.data = this.RequestBuffer(this.m_userDataBuffer.data);
                        this.m_userDataBuffer.data[index] = def.userData;
                    }
                    if (this.m_handleIndexBuffer.data) {
                        this.m_handleIndexBuffer.data[index] = null;
                    }
                    ///Proxy& proxy = m_proxyBuffer.Append();
                    const proxy = this.m_proxyBuffer.data[this.m_proxyBuffer.Append()];
                    // If particle lifetimes are enabled or the lifetime is set in the particle
                    // definition, initialize the lifetime.
                    const lifetime = b2Settings_1.b2Maybe(def.lifetime, 0.0);
                    const finiteLifetime = lifetime > 0.0;
                    if (this.m_expirationTimeBuffer.data || finiteLifetime) {
                        this.SetParticleLifetime(index, finiteLifetime ? lifetime :
                            this.ExpirationTimeToLifetime(-this.GetQuantizedTimeElapsed()));
                        // Add a reference to the newly added particle to the end of the
                        // queue.
                        if (!this.m_indexByExpirationTimeBuffer.data) {
                            throw new Error();
                        }
                        this.m_indexByExpirationTimeBuffer.data[index] = index;
                    }
                    proxy.index = index;
                    const group = b2Settings_1.b2Maybe(def.group, null);
                    this.m_groupBuffer[index] = group;
                    if (group) {
                        if (group.m_firstIndex < group.m_lastIndex) {
                            // Move particles in the group just before the new particle.
                            this.RotateBuffer(group.m_firstIndex, group.m_lastIndex, index);
                            // DEBUG: b2Assert(group.m_lastIndex === index);
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
                    this.SetParticleFlags(index, b2Settings_1.b2Maybe(def.flags, 0));
                    return index;
                }
                /**
                 * Retrieve a handle to the particle at the specified index.
                 *
                 * Please see #b2ParticleHandle for why you might want a handle.
                 */
                GetParticleHandleFromIndex(index) {
                    // DEBUG: b2Assert(index >= 0 && index < this.GetParticleCount() && index !== b2_invalidParticleIndex);
                    this.m_handleIndexBuffer.data = this.RequestBuffer(this.m_handleIndexBuffer.data);
                    let handle = this.m_handleIndexBuffer.data[index];
                    if (handle) {
                        return handle;
                    }
                    // Create a handle.
                    ///handle = m_handleAllocator.Allocate();
                    handle = new b2Particle_1.b2ParticleHandle();
                    // DEBUG: b2Assert(handle !== null);
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
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
                    // DEBUG: b2Assert(index >= 0 && index < particleCount);
                    // Make sure particle lifetime tracking is enabled.
                    // DEBUG: b2Assert(this.m_indexByExpirationTimeBuffer.data !== null);
                    if (!this.m_indexByExpirationTimeBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_expirationTimeBuffer.data) {
                        throw new Error();
                    }
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
                    if (this.m_world.IsLocked()) {
                        throw new Error();
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
                    const s_transform = b2ParticleSystem.CreateParticleGroup_s_transform;
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    const transform = s_transform;
                    transform.SetPositionAngle(b2Settings_1.b2Maybe(groupDef.position, b2Math_1.b2Vec2.ZERO), b2Settings_1.b2Maybe(groupDef.angle, 0));
                    const firstIndex = this.m_count;
                    if (groupDef.shape) {
                        this.CreateParticlesWithShapeForGroup(groupDef.shape, groupDef, transform);
                    }
                    if (groupDef.shapes) {
                        this.CreateParticlesWithShapesForGroup(groupDef.shapes, b2Settings_1.b2Maybe(groupDef.shapeCount, groupDef.shapes.length), groupDef, transform);
                    }
                    if (groupDef.positionData) {
                        const count = b2Settings_1.b2Maybe(groupDef.particleCount, groupDef.positionData.length);
                        for (let i = 0; i < count; i++) {
                            const p = groupDef.positionData[i];
                            this.CreateParticleForGroup(groupDef, transform, p);
                        }
                    }
                    const lastIndex = this.m_count;
                    let group = new b2ParticleGroup_1.b2ParticleGroup(this);
                    group.m_firstIndex = firstIndex;
                    group.m_lastIndex = lastIndex;
                    group.m_strength = b2Settings_1.b2Maybe(groupDef.strength, 1);
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
                    this.SetGroupFlags(group, b2Settings_1.b2Maybe(groupDef.groupFlags, 0));
                    // Create pairs and triads between particles in the group.
                    const filter = new b2ParticleSystem.ConnectionFilter();
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
                    if (this.m_world.IsLocked()) {
                        throw new Error();
                    }
                    // DEBUG: b2Assert(groupA !== groupB);
                    this.RotateBuffer(groupB.m_firstIndex, groupB.m_lastIndex, this.m_count);
                    // DEBUG: b2Assert(groupB.m_lastIndex === this.m_count);
                    this.RotateBuffer(groupA.m_firstIndex, groupA.m_lastIndex, groupB.m_firstIndex);
                    // DEBUG: b2Assert(groupA.m_lastIndex === groupB.m_firstIndex);
                    // Create pairs and triads connecting groupA and groupB.
                    const filter = new b2ParticleSystem.JoinParticleGroupsFilter(groupB.m_firstIndex);
                    this.UpdateContacts(true);
                    this.UpdatePairsAndTriads(groupA.m_firstIndex, groupB.m_lastIndex, filter);
                    for (let i = groupB.m_firstIndex; i < groupB.m_lastIndex; i++) {
                        this.m_groupBuffer[i] = groupA;
                    }
                    const groupFlags = groupA.m_groupFlags | groupB.m_groupFlags;
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
                    const particleCount = group.GetParticleCount();
                    // We create several linked lists. Each list represents a set of connected particles.
                    ///ParticleListNode* nodeBuffer = (ParticleListNode*) m_world.m_stackAllocator.Allocate(sizeof(ParticleListNode) * particleCount);
                    const nodeBuffer = b2Settings_1.b2MakeArray(particleCount, (index) => new b2ParticleSystem.ParticleListNode());
                    b2ParticleSystem.InitializeParticleLists(group, nodeBuffer);
                    this.MergeParticleListsInContact(group, nodeBuffer);
                    const survivingList = b2ParticleSystem.FindLongestParticleList(group, nodeBuffer);
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
                    // DEBUG: b2Assert(this.m_count <= count);
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
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
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
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    return this.m_flagsBuffer.data;
                }
                /**
                 * Set flags for a particle. See the b2ParticleFlag enum.
                 */
                SetParticleFlags(index, newFlags) {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    const oldFlags = this.m_flagsBuffer.data[index];
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
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
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const s_v = b2ParticleSystem.ComputeCollisionEnergy_s_v;
                    const vel_data = this.m_velocityBuffer.data;
                    let sum_v2 = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const n = contact.normal;
                        ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                        const v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        const vn = b2Math_1.b2Vec2.DotVV(v, n);
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
                    // DEBUG: b2Assert(this.ValidateParticleIndex(index));
                    const initializeExpirationTimes = this.m_indexByExpirationTimeBuffer.data === null;
                    this.m_expirationTimeBuffer.data = this.RequestBuffer(this.m_expirationTimeBuffer.data);
                    this.m_indexByExpirationTimeBuffer.data = this.RequestBuffer(this.m_indexByExpirationTimeBuffer.data);
                    // Initialize the inverse mapping buffer.
                    if (initializeExpirationTimes) {
                        const particleCount = this.GetParticleCount();
                        for (let i = 0; i < particleCount; ++i) {
                            this.m_indexByExpirationTimeBuffer.data[i] = i;
                        }
                    }
                    ///const int32 quantizedLifetime = (int32)(lifetime / m_def.lifetimeGranularity);
                    const quantizedLifetime = lifetime / this.m_def.lifetimeGranularity;
                    // Use a negative lifetime so that it's possible to track which
                    // of the infinite lifetime particles are older.
                    const newExpirationTime = quantizedLifetime > 0.0 ? this.GetQuantizedTimeElapsed() + quantizedLifetime : quantizedLifetime;
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
                    // DEBUG: b2Assert(this.ValidateParticleIndex(index));
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
                    if (!this.m_indexByExpirationTimeBuffer.data) {
                        throw new Error();
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
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    const numParticles = (lastIndex - firstIndex);
                    const totalMass = numParticles * this.GetParticleMass();
                    ///const b2Vec2 velocityDelta = impulse / totalMass;
                    const velocityDelta = new b2Math_1.b2Vec2().Copy(impulse).SelfMul(1 / totalMass);
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
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
                    // DEBUG: if (!this.m_flagsBuffer.data) { throw new Error(); }
                    // DEBUG: let flags = 0;
                    // DEBUG: for (let i = firstIndex; i < lastIndex; i++) {
                    // DEBUG:   flags |= this.m_flagsBuffer.data[i];
                    // DEBUG: }
                    // DEBUG: b2Assert(this.ForceCanBeApplied(flags));
                    // Early out if force does nothing (optimization).
                    ///const b2Vec2 distributedForce = force / (float32)(lastIndex - firstIndex);
                    const distributedForce = new b2Math_1.b2Vec2().Copy(force).SelfMul(1 / (lastIndex - firstIndex));
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
                    const beginProxy = 0;
                    const endProxy = this.m_proxyBuffer.count;
                    const firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x, this.m_inverseDiameter * aabb.lowerBound.y), b2ParticleSystem.Proxy.CompareProxyTag);
                    const lastProxy = std_upper_bound(this.m_proxyBuffer.data, firstProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x, this.m_inverseDiameter * aabb.upperBound.y), b2ParticleSystem.Proxy.CompareTagProxy);
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    for (let k = firstProxy; k < lastProxy; ++k) {
                        const proxy = this.m_proxyBuffer.data[k];
                        const i = proxy.index;
                        const p = pos_data[i];
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
                    const s_aabb = b2ParticleSystem.QueryShapeAABB_s_aabb;
                    const aabb = s_aabb;
                    shape.ComputeAABB(aabb, xf, childIndex);
                    this.QueryAABB(callback, aabb);
                }
                QueryPointAABB(callback, point, slop = b2Settings_1.b2_linearSlop) {
                    const s_aabb = b2ParticleSystem.QueryPointAABB_s_aabb;
                    const aabb = s_aabb;
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
                 * @param callback a user implemented callback class.
                 * @param point1 the ray starting point
                 * @param point2 the ray ending point
                 */
                RayCast(callback, point1, point2) {
                    const s_aabb = b2ParticleSystem.RayCast_s_aabb;
                    const s_p = b2ParticleSystem.RayCast_s_p;
                    const s_v = b2ParticleSystem.RayCast_s_v;
                    const s_n = b2ParticleSystem.RayCast_s_n;
                    const s_point = b2ParticleSystem.RayCast_s_point;
                    if (this.m_proxyBuffer.count === 0) {
                        return;
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const aabb = s_aabb;
                    b2Math_1.b2Vec2.MinV(point1, point2, aabb.lowerBound);
                    b2Math_1.b2Vec2.MaxV(point1, point2, aabb.upperBound);
                    let fraction = 1;
                    // solving the following equation:
                    // ((1-t)*point1+t*point2-position)^2=diameter^2
                    // where t is a potential fraction
                    ///b2Vec2 v = point2 - point1;
                    const v = b2Math_1.b2Vec2.SubVV(point2, point1, s_v);
                    const v2 = b2Math_1.b2Vec2.DotVV(v, v);
                    const enumerator = this.GetInsideBoundsEnumerator(aabb);
                    let i;
                    while ((i = enumerator.GetNext()) >= 0) {
                        ///b2Vec2 p = point1 - m_positionBuffer.data[i];
                        const p = b2Math_1.b2Vec2.SubVV(point1, pos_data[i], s_p);
                        const pv = b2Math_1.b2Vec2.DotVV(p, v);
                        const p2 = b2Math_1.b2Vec2.DotVV(p, p);
                        const determinant = pv * pv - v2 * (p2 - this.m_squaredDiameter);
                        if (determinant >= 0) {
                            const sqrtDeterminant = b2Math_1.b2Sqrt(determinant);
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
                            const n = b2Math_1.b2Vec2.AddVMulSV(p, t, v, s_n);
                            n.Normalize();
                            ///float32 f = callback.ReportParticle(this, i, point1 + t * v, n, t);
                            const f = callback.ReportParticle(this, i, b2Math_1.b2Vec2.AddVMulSV(point1, t, v, s_point), n, t);
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
                 * @param aabb Returns the axis-aligned bounding box of the system.
                 */
                ComputeAABB(aabb) {
                    const particleCount = this.GetParticleCount();
                    // DEBUG: b2Assert(aabb !== null);
                    aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    for (let i = 0; i < particleCount; i++) {
                        const p = pos_data[i];
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
                    // b2Assert(newCapacity > oldCapacity);
                    if (newCapacity <= oldCapacity) {
                        throw new Error();
                    }
                    const newBuffer = (oldBuffer) ? oldBuffer.slice() : [];
                    newBuffer.length = newCapacity;
                    return newBuffer;
                }
                /**
                 * Reallocate a buffer
                 */
                ReallocateBuffer5(buffer, userSuppliedCapacity, oldCapacity, newCapacity, deferred) {
                    // b2Assert(newCapacity > oldCapacity);
                    if (newCapacity <= oldCapacity) {
                        throw new Error();
                    }
                    // A 'deferred' buffer is reallocated only if it is not NULL.
                    // If 'userSuppliedCapacity' is not zero, buffer is user supplied and must
                    // be kept.
                    // b2Assert(!userSuppliedCapacity || newCapacity <= userSuppliedCapacity);
                    if (!(!userSuppliedCapacity || newCapacity <= userSuppliedCapacity)) {
                        throw new Error();
                    }
                    if ((!deferred || buffer) && !userSuppliedCapacity) {
                        buffer = this.ReallocateBuffer3(buffer, oldCapacity, newCapacity);
                    }
                    return buffer; // TODO: fix this
                }
                /**
                 * Reallocate a buffer
                 */
                ReallocateBuffer4(buffer, oldCapacity, newCapacity, deferred) {
                    // DEBUG: b2Assert(newCapacity > oldCapacity);
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
                    // DEBUG: b2Assert(newCapacity > this.m_internalAllocatedCapacity);
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
                        const stuck = this.m_stuckThreshold > 0;
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
                    const particleDef = new b2Particle_1.b2ParticleDef();
                    particleDef.flags = b2Settings_1.b2Maybe(groupDef.flags, 0);
                    ///particleDef.position = b2Mul(xf, p);
                    b2Math_1.b2Transform.MulXV(xf, p, particleDef.position);
                    ///particleDef.velocity =
                    ///  groupDef.linearVelocity +
                    ///  b2Cross(groupDef.angularVelocity,
                    ///      particleDef.position - groupDef.position);
                    b2Math_1.b2Vec2.AddVV(b2Settings_1.b2Maybe(groupDef.linearVelocity, b2Math_1.b2Vec2.ZERO), b2Math_1.b2Vec2.CrossSV(b2Settings_1.b2Maybe(groupDef.angularVelocity, 0), b2Math_1.b2Vec2.SubVV(particleDef.position, b2Settings_1.b2Maybe(groupDef.position, b2Math_1.b2Vec2.ZERO), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), particleDef.velocity);
                    particleDef.color.Copy(b2Settings_1.b2Maybe(groupDef.color, b2Draw_1.b2Color.ZERO));
                    particleDef.lifetime = b2Settings_1.b2Maybe(groupDef.lifetime, 0);
                    particleDef.userData = groupDef.userData;
                    this.CreateParticle(particleDef);
                }
                CreateParticlesStrokeShapeForGroup(shape, groupDef, xf) {
                    const s_edge = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_edge;
                    const s_d = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_d;
                    const s_p = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_p;
                    let stride = b2Settings_1.b2Maybe(groupDef.stride, 0);
                    if (stride === 0) {
                        stride = this.GetParticleStride();
                    }
                    let positionOnEdge = 0;
                    const childCount = shape.GetChildCount();
                    for (let childIndex = 0; childIndex < childCount; childIndex++) {
                        let edge = null;
                        if (shape.GetType() === b2Shape_1.b2ShapeType.e_edgeShape) {
                            edge = shape;
                        }
                        else {
                            // DEBUG: b2Assert(shape.GetType() === b2ShapeType.e_chainShape);
                            edge = s_edge;
                            shape.GetChildEdge(edge, childIndex);
                        }
                        const d = b2Math_1.b2Vec2.SubVV(edge.m_vertex2, edge.m_vertex1, s_d);
                        const edgeLength = d.Length();
                        while (positionOnEdge < edgeLength) {
                            ///b2Vec2 p = edge.m_vertex1 + positionOnEdge / edgeLength * d;
                            const p = b2Math_1.b2Vec2.AddVMulSV(edge.m_vertex1, positionOnEdge / edgeLength, d, s_p);
                            this.CreateParticleForGroup(groupDef, xf, p);
                            positionOnEdge += stride;
                        }
                        positionOnEdge -= edgeLength;
                    }
                }
                CreateParticlesFillShapeForGroup(shape, groupDef, xf) {
                    const s_aabb = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb;
                    const s_p = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p;
                    let stride = b2Settings_1.b2Maybe(groupDef.stride, 0);
                    if (stride === 0) {
                        stride = this.GetParticleStride();
                    }
                    ///b2Transform identity;
                    /// identity.SetIdentity();
                    const identity = b2Math_1.b2Transform.IDENTITY;
                    const aabb = s_aabb;
                    // DEBUG: b2Assert(shape.GetChildCount() === 1);
                    shape.ComputeAABB(aabb, identity, 0);
                    for (let y = Math.floor(aabb.lowerBound.y / stride) * stride; y < aabb.upperBound.y; y += stride) {
                        for (let x = Math.floor(aabb.lowerBound.x / stride) * stride; x < aabb.upperBound.x; x += stride) {
                            const p = s_p.Set(x, y);
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
                            // DEBUG: b2Assert(false);
                            break;
                    }
                }
                CreateParticlesWithShapesForGroup(shapes, shapeCount, groupDef, xf) {
                    const compositeShape = new b2ParticleSystem.CompositeShape(shapes, shapeCount);
                    this.CreateParticlesFillShapeForGroup(compositeShape, groupDef, xf);
                }
                CloneParticle(oldIndex, group) {
                    const def = new b2Particle_1.b2ParticleDef();
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
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
                    const newIndex = this.CreateParticle(def);
                    if (this.m_handleIndexBuffer.data) {
                        const handle = this.m_handleIndexBuffer.data[oldIndex];
                        if (handle) {
                            handle.SetIndex(newIndex);
                        }
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
                    // DEBUG: b2Assert(this.m_groupCount > 0);
                    // DEBUG: b2Assert(group !== null);
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
                    const s_dab = b2ParticleSystem.UpdatePairsAndTriads_s_dab;
                    const s_dbc = b2ParticleSystem.UpdatePairsAndTriads_s_dbc;
                    const s_dca = b2ParticleSystem.UpdatePairsAndTriads_s_dca;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    // Create pairs or triads.
                    // All particles in each pair/triad should satisfy the following:
                    // * firstIndex <= index < lastIndex
                    // * don't have b2_zombieParticle
                    // * ParticleCanBeConnected returns true
                    // * ShouldCreatePair/ShouldCreateTriad returns true
                    // Any particles in each pair/triad should satisfy the following:
                    // * filter.IsNeeded returns true
                    // * have one of k_pairFlags/k_triadsFlags
                    // DEBUG: b2Assert(firstIndex <= lastIndex);
                    let particleFlags = 0;
                    for (let i = firstIndex; i < lastIndex; i++) {
                        particleFlags |= this.m_flagsBuffer.data[i];
                    }
                    if (particleFlags & b2ParticleSystem.k_pairFlags) {
                        for (let k = 0; k < this.m_contactBuffer.count; k++) {
                            const contact = this.m_contactBuffer.data[k];
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const af = this.m_flagsBuffer.data[a];
                            const bf = this.m_flagsBuffer.data[b];
                            const groupA = this.m_groupBuffer[a];
                            const groupB = this.m_groupBuffer[b];
                            if (a >= firstIndex && a < lastIndex &&
                                b >= firstIndex && b < lastIndex &&
                                !((af | bf) & b2Particle_1.b2ParticleFlag.b2_zombieParticle) &&
                                ((af | bf) & b2ParticleSystem.k_pairFlags) &&
                                (filter.IsNecessary(a) || filter.IsNecessary(b)) &&
                                b2ParticleSystem.ParticleCanBeConnected(af, groupA) &&
                                b2ParticleSystem.ParticleCanBeConnected(bf, groupB) &&
                                filter.ShouldCreatePair(a, b)) {
                                ///b2ParticlePair& pair = m_pairBuffer.Append();
                                const pair = this.m_pairBuffer.data[this.m_pairBuffer.Append()];
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
                        const diagram = new b2VoronoiDiagram_1.b2VoronoiDiagram(lastIndex - firstIndex);
                        ///let necessary_count = 0;
                        for (let i = firstIndex; i < lastIndex; i++) {
                            const flags = this.m_flagsBuffer.data[i];
                            const group = this.m_groupBuffer[i];
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
                        const stride = this.GetParticleStride();
                        diagram.Generate(stride / 2, stride * 2);
                        const system = this;
                        const callback = /*UpdateTriadsCallback*/ (a, b, c) => {
                            if (!system.m_flagsBuffer.data) {
                                throw new Error();
                            }
                            const af = system.m_flagsBuffer.data[a];
                            const bf = system.m_flagsBuffer.data[b];
                            const cf = system.m_flagsBuffer.data[c];
                            if (((af | bf | cf) & b2ParticleSystem.k_triadFlags) &&
                                filter.ShouldCreateTriad(a, b, c)) {
                                const pa = pos_data[a];
                                const pb = pos_data[b];
                                const pc = pos_data[c];
                                const dab = b2Math_1.b2Vec2.SubVV(pa, pb, s_dab);
                                const dbc = b2Math_1.b2Vec2.SubVV(pb, pc, s_dbc);
                                const dca = b2Math_1.b2Vec2.SubVV(pc, pa, s_dca);
                                const maxDistanceSquared = b2Settings_1.b2_maxTriadDistanceSquared * system.m_squaredDiameter;
                                if (b2Math_1.b2Vec2.DotVV(dab, dab) > maxDistanceSquared ||
                                    b2Math_1.b2Vec2.DotVV(dbc, dbc) > maxDistanceSquared ||
                                    b2Math_1.b2Vec2.DotVV(dca, dca) > maxDistanceSquared) {
                                    return;
                                }
                                const groupA = system.m_groupBuffer[a];
                                const groupB = system.m_groupBuffer[b];
                                const groupC = system.m_groupBuffer[c];
                                ///b2ParticleTriad& triad = m_system.m_triadBuffer.Append();
                                const triad = system.m_triadBuffer.data[system.m_triadBuffer.Append()];
                                triad.indexA = a;
                                triad.indexB = b;
                                triad.indexC = c;
                                triad.flags = af | bf | cf;
                                triad.strength = b2Math_1.b2Min(b2Math_1.b2Min(groupA ? groupA.m_strength : 1, groupB ? groupB.m_strength : 1), groupC ? groupC.m_strength : 1);
                                ///let midPoint = b2Vec2.MulSV(1.0 / 3.0, b2Vec2.AddVV(pa, b2Vec2.AddVV(pb, pc, new b2Vec2()), new b2Vec2()), new b2Vec2());
                                const midPoint_x = (pa.x + pb.x + pc.x) / 3.0;
                                const midPoint_y = (pa.y + pb.y + pc.y) / 3.0;
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
                    const filter = new b2ParticleSystem.ReactiveFilter(this.m_flagsBuffer);
                    this.UpdatePairsAndTriads(0, this.m_count, filter);
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_flagsBuffer.data[i] &= ~b2Particle_1.b2ParticleFlag.b2_reactiveParticle;
                    }
                    this.m_allParticleFlags &= ~b2Particle_1.b2ParticleFlag.b2_reactiveParticle;
                }
                static ComparePairIndices(a, b) {
                    const diffA = a.indexA - b.indexA;
                    if (diffA !== 0) {
                        return diffA < 0;
                    }
                    return a.indexB < b.indexB;
                }
                static MatchPairIndices(a, b) {
                    return a.indexA === b.indexA && a.indexB === b.indexB;
                }
                static CompareTriadIndices(a, b) {
                    const diffA = a.indexA - b.indexA;
                    if (diffA !== 0) {
                        return diffA < 0;
                    }
                    const diffB = a.indexB - b.indexB;
                    if (diffB !== 0) {
                        return diffB < 0;
                    }
                    return a.indexC < b.indexC;
                }
                static MatchTriadIndices(a, b) {
                    return a.indexA === b.indexA && a.indexB === b.indexB && a.indexC === b.indexC;
                }
                static InitializeParticleLists(group, nodeBuffer) {
                    const bufferIndex = group.GetBufferIndex();
                    const particleCount = group.GetParticleCount();
                    for (let i = 0; i < particleCount; i++) {
                        const node = nodeBuffer[i];
                        node.list = node;
                        node.next = null;
                        node.count = 1;
                        node.index = i + bufferIndex;
                    }
                }
                MergeParticleListsInContact(group, nodeBuffer) {
                    const bufferIndex = group.GetBufferIndex();
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        /*const b2ParticleContact&*/
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        if (!group.ContainsParticle(a) || !group.ContainsParticle(b)) {
                            continue;
                        }
                        let listA = nodeBuffer[a - bufferIndex].list;
                        let listB = nodeBuffer[b - bufferIndex].list;
                        if (listA === listB) {
                            continue;
                        }
                        // To minimize the cost of insertion, make sure listA is longer than
                        // listB.
                        if (listA.count < listB.count) {
                            const _tmp = listA;
                            listA = listB;
                            listB = _tmp; ///b2Swap(listA, listB);
                        }
                        // DEBUG: b2Assert(listA.count >= listB.count);
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
                    // DEBUG: b2Assert(listA !== listB);
                    for (let b = listB;;) {
                        b.list = listA;
                        const nextB = b.next;
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
                    const particleCount = group.GetParticleCount();
                    let result = nodeBuffer[0];
                    for (let i = 0; i < particleCount; i++) {
                        const node = nodeBuffer[i];
                        if (result.count < node.count) {
                            result = node;
                        }
                    }
                    return result;
                }
                MergeZombieParticleListNodes(group, nodeBuffer, survivingList) {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    const particleCount = group.GetParticleCount();
                    for (let i = 0; i < particleCount; i++) {
                        const node = nodeBuffer[i];
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
                    // DEBUG: b2Assert(node !== list);
                    // DEBUG: b2Assert(node.list === node);
                    // DEBUG: b2Assert(node.count === 1);
                    node.list = list;
                    node.next = list.next;
                    list.next = node;
                    list.count++;
                    node.count = 0;
                }
                CreateParticleGroupsFromParticleList(group, nodeBuffer, survivingList) {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    const particleCount = group.GetParticleCount();
                    const def = new b2ParticleGroup_1.b2ParticleGroupDef();
                    def.groupFlags = group.GetGroupFlags();
                    def.userData = group.GetUserData();
                    for (let i = 0; i < particleCount; i++) {
                        const list = nodeBuffer[i];
                        if (!list.count || list === survivingList) {
                            continue;
                        }
                        // DEBUG: b2Assert(list.list === list);
                        const newGroup = this.CreateParticleGroup(def);
                        for (let node = list; node; node = node.next) {
                            const oldIndex = node.index;
                            // DEBUG: const flags = this.m_flagsBuffer.data[oldIndex];
                            // DEBUG: b2Assert(!(flags & b2ParticleFlag.b2_zombieParticle));
                            const newIndex = this.CloneParticle(oldIndex, newGroup);
                            this.m_flagsBuffer.data[oldIndex] |= b2Particle_1.b2ParticleFlag.b2_zombieParticle;
                            node.index = newIndex;
                        }
                    }
                }
                UpdatePairsAndTriadsWithParticleList(group, nodeBuffer) {
                    const bufferIndex = group.GetBufferIndex();
                    // Update indices in pairs and triads. If an index belongs to the group,
                    // replace it with the corresponding value in nodeBuffer.
                    // Note that nodeBuffer is allocated only for the group and the index should
                    // be shifted by bufferIndex.
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        const a = pair.indexA;
                        const b = pair.indexB;
                        if (group.ContainsParticle(a)) {
                            pair.indexA = nodeBuffer[a - bufferIndex].index;
                        }
                        if (group.ContainsParticle(b)) {
                            pair.indexB = nodeBuffer[b - bufferIndex].index;
                        }
                    }
                    for (let k = 0; k < this.m_triadBuffer.count; k++) {
                        const triad = this.m_triadBuffer.data[k];
                        const a = triad.indexA;
                        const b = triad.indexB;
                        const c = triad.indexC;
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
                    const contactGroups = []; // TODO: static
                    let contactGroupsCount = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const groupA = this.m_groupBuffer[a];
                        const groupB = this.m_groupBuffer[b];
                        if (groupA && groupA === groupB &&
                            (groupA.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth)) {
                            contactGroups[contactGroupsCount++] = contact;
                        }
                    }
                    ///b2ParticleGroup** groupsToUpdate = (b2ParticleGroup**) this.m_world.m_stackAllocator.Allocate(sizeof(b2ParticleGroup*) * this.m_groupCount);
                    const groupsToUpdate = []; // TODO: static
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
                        const contact = contactGroups[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const w = contact.weight;
                        this.m_accumulationBuffer[a] += w;
                        this.m_accumulationBuffer[b] += w;
                    }
                    // DEBUG: b2Assert(this.m_depthBuffer !== null);
                    for (let i = 0; i < groupsToUpdateCount; i++) {
                        const group = groupsToUpdate[i];
                        for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
                            const w = this.m_accumulationBuffer[i];
                            this.m_depthBuffer[i] = w < 0.8 ? 0 : b2Settings_1.b2_maxFloat;
                        }
                    }
                    // The number of iterations is equal to particle number from the deepest
                    // particle to the nearest surface particle, and in general it is smaller
                    // than sqrt of total particle number.
                    ///int32 iterationCount = (int32)b2Sqrt((float)m_count);
                    const iterationCount = b2Math_1.b2Sqrt(this.m_count) >> 0;
                    for (let t = 0; t < iterationCount; t++) {
                        let updated = false;
                        for (let k = 0; k < contactGroupsCount; k++) {
                            const contact = contactGroups[k];
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const r = 1 - contact.weight;
                            ///float32& ap0 = m_depthBuffer[a];
                            const ap0 = this.m_depthBuffer[a];
                            ///float32& bp0 = m_depthBuffer[b];
                            const bp0 = this.m_depthBuffer[b];
                            const ap1 = bp0 + r;
                            const bp1 = ap0 + r;
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
                        const group = groupsToUpdate[i];
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
                    const lowerTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x - 1, this.m_inverseDiameter * aabb.lowerBound.y - 1);
                    const upperTag = b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x + 1, this.m_inverseDiameter * aabb.upperBound.y + 1);
                    ///const Proxy* beginProxy = m_proxyBuffer.Begin();
                    const beginProxy = 0;
                    ///const Proxy* endProxy = m_proxyBuffer.End();
                    const endProxy = this.m_proxyBuffer.count;
                    ///const Proxy* firstProxy = std::lower_bound(beginProxy, endProxy, lowerTag);
                    const firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, lowerTag, b2ParticleSystem.Proxy.CompareProxyTag);
                    ///const Proxy* lastProxy = std::upper_bound(firstProxy, endProxy, upperTag);
                    const lastProxy = std_upper_bound(this.m_proxyBuffer.data, beginProxy, endProxy, upperTag, b2ParticleSystem.Proxy.CompareTagProxy);
                    // DEBUG: b2Assert(beginProxy <= firstProxy);
                    // DEBUG: b2Assert(firstProxy <= lastProxy);
                    // DEBUG: b2Assert(lastProxy <= endProxy);
                    return new b2ParticleSystem.InsideBoundsEnumerator(this, lowerTag, upperTag, firstProxy, lastProxy);
                }
                UpdateAllParticleFlags() {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const s_d = b2ParticleSystem.AddContact_s_d;
                    const pos_data = this.m_positionBuffer.data;
                    // DEBUG: b2Assert(contacts === this.m_contactBuffer);
                    ///b2Vec2 d = m_positionBuffer.data[b] - m_positionBuffer.data[a];
                    const d = b2Math_1.b2Vec2.SubVV(pos_data[b], pos_data[a], s_d);
                    const distBtParticlesSq = b2Math_1.b2Vec2.DotVV(d, d);
                    if (distBtParticlesSq < this.m_squaredDiameter) {
                        let invD = b2Math_1.b2InvSqrt(distBtParticlesSq);
                        if (!isFinite(invD)) {
                            invD = 1.98177537e+019;
                        }
                        ///b2ParticleContact& contact = contacts.Append();
                        const contact = this.m_contactBuffer.data[this.m_contactBuffer.Append()];
                        contact.indexA = a;
                        contact.indexB = b;
                        contact.flags = this.m_flagsBuffer.data[a] | this.m_flagsBuffer.data[b];
                        contact.weight = 1 - distBtParticlesSq * invD * this.m_inverseDiameter;
                        ///contact.SetNormal(invD * d);
                        b2Math_1.b2Vec2.MulSV(invD, d, contact.normal);
                    }
                }
                FindContacts_Reference(contacts) {
                    // DEBUG: b2Assert(contacts === this.m_contactBuffer);
                    const beginProxy = 0;
                    const endProxy = this.m_proxyBuffer.count;
                    this.m_contactBuffer.count = 0;
                    for (let a = beginProxy, c = beginProxy; a < endProxy; a++) {
                        const rightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 0);
                        for (let b = a + 1; b < endProxy; b++) {
                            if (rightTag < this.m_proxyBuffer.data[b].tag) {
                                break;
                            }
                            this.AddContact(this.m_proxyBuffer.data[a].index, this.m_proxyBuffer.data[b].index, this.m_contactBuffer);
                        }
                        const bottomLeftTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, -1, 1);
                        for (; c < endProxy; c++) {
                            if (bottomLeftTag <= this.m_proxyBuffer.data[c].tag) {
                                break;
                            }
                        }
                        const bottomRightTag = b2ParticleSystem.computeRelativeTag(this.m_proxyBuffer.data[a].tag, 1, 1);
                        for (let b = c; b < endProxy; b++) {
                            if (bottomRightTag < this.m_proxyBuffer.data[b].tag) {
                                break;
                            }
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
                    // DEBUG: b2Assert(proxies === this.m_proxyBuffer);
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const inv_diam = this.m_inverseDiameter;
                    for (let k = 0; k < this.m_proxyBuffer.count; ++k) {
                        const proxy = this.m_proxyBuffer.data[k];
                        const i = proxy.index;
                        const p = pos_data[i];
                        proxy.tag = b2ParticleSystem.computeTag(inv_diam * p.x, inv_diam * p.y);
                    }
                }
                ///void UpdateProxies_Simd(b2GrowableBuffer<Proxy>& proxies) const;
                UpdateProxies(proxies) {
                    this.UpdateProxies_Reference(proxies);
                }
                SortProxies(proxies) {
                    // DEBUG: b2Assert(proxies === this.m_proxyBuffer);
                    ///std::sort(proxies.Begin(), proxies.End());
                    std_sort(this.m_proxyBuffer.data, 0, this.m_proxyBuffer.count, b2ParticleSystem.Proxy.CompareProxyProxy);
                }
                FilterContacts(contacts) {
                    // Optionally filter the contact.
                    const contactFilter = this.GetParticleContactFilter();
                    if (contactFilter === null) {
                        return;
                    }
                    /// contacts.RemoveIf(b2ParticleContactRemovePredicate(this, contactFilter));
                    // DEBUG: b2Assert(contacts === this.m_contactBuffer);
                    const system = this;
                    const predicate = (contact) => {
                        return ((contact.flags & b2Particle_1.b2ParticleFlag.b2_particleContactFilterParticle) !== 0) && !contactFilter.ShouldCollideParticleParticle(system, contact.indexA, contact.indexB);
                    };
                    this.m_contactBuffer.RemoveIf(predicate);
                }
                NotifyContactListenerPreContact(particlePairs) {
                    const contactListener = this.GetParticleContactListener();
                    if (contactListener === null) {
                        return;
                    }
                    ///particlePairs.Initialize(m_contactBuffer.Begin(), m_contactBuffer.GetCount(), GetFlagsBuffer());
                    particlePairs.Initialize(this.m_contactBuffer, this.m_flagsBuffer);
                    throw new Error(); // TODO: notify
                }
                NotifyContactListenerPostContact(particlePairs) {
                    const contactListener = this.GetParticleContactListener();
                    if (contactListener === null) {
                        return;
                    }
                    // Loop through all new contacts, reporting any new ones, and
                    // "invalidating" the ones that still exist.
                    ///const b2ParticleContact* const endContact = m_contactBuffer.End();
                    ///for (b2ParticleContact* contact = m_contactBuffer.Begin(); contact < endContact; ++contact)
                    for (let k = 0; k < this.m_contactBuffer.count; ++k) {
                        const contact = this.m_contactBuffer.data[k];
                        ///ParticlePair pair;
                        ///pair.first = contact.GetIndexA();
                        ///pair.second = contact.GetIndexB();
                        ///const int32 itemIndex = particlePairs.Find(pair);
                        const itemIndex = -1; // TODO
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
                    const particlePairs = new b2ParticleSystem.b2ParticlePairSet(); // TODO: static
                    this.NotifyContactListenerPreContact(particlePairs);
                    this.FindContacts(this.m_contactBuffer);
                    this.FilterContacts(this.m_contactBuffer);
                    this.NotifyContactListenerPostContact(particlePairs);
                    if (exceptZombie) {
                        this.m_contactBuffer.RemoveIf(b2ParticleSystem.b2ParticleContactIsZombie);
                    }
                }
                NotifyBodyContactListenerPreContact(fixtureSet) {
                    const contactListener = this.GetFixtureContactListener();
                    if (contactListener === null) {
                        return;
                    }
                    ///fixtureSet.Initialize(m_bodyContactBuffer.Begin(), m_bodyContactBuffer.GetCount(), GetFlagsBuffer());
                    fixtureSet.Initialize(this.m_bodyContactBuffer, this.m_flagsBuffer);
                    throw new Error(); // TODO: notify
                }
                NotifyBodyContactListenerPostContact(fixtureSet) {
                    const contactListener = this.GetFixtureContactListener();
                    if (contactListener === null) {
                        return;
                    }
                    // Loop through all new contacts, reporting any new ones, and
                    // "invalidating" the ones that still exist.
                    ///for (b2ParticleBodyContact* contact = m_bodyContactBuffer.Begin(); contact !== m_bodyContactBuffer.End(); ++contact)
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        // DEBUG: b2Assert(contact !== null);
                        ///FixtureParticle fixtureParticleToFind;
                        ///fixtureParticleToFind.first = contact.fixture;
                        ///fixtureParticleToFind.second = contact.index;
                        ///const int32 index = fixtureSet.Find(fixtureParticleToFind);
                        const index = -1; // TODO
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
                    const s_aabb = b2ParticleSystem.UpdateBodyContacts_s_aabb;
                    // If the particle contact listener is enabled, generate a set of
                    // fixture / particle contacts.
                    ///FixtureParticleSet fixtureSet(&m_world.m_stackAllocator);
                    const fixtureSet = new b2ParticleSystem.FixtureParticleSet(); // TODO: static
                    this.NotifyBodyContactListenerPreContact(fixtureSet);
                    if (this.m_stuckThreshold > 0) {
                        if (!this.m_bodyContactCountBuffer.data) {
                            throw new Error();
                        }
                        if (!this.m_lastBodyContactStepBuffer.data) {
                            throw new Error();
                        }
                        if (!this.m_consecutiveContactStepsBuffer.data) {
                            throw new Error();
                        }
                        const particleCount = this.GetParticleCount();
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
                    const aabb = s_aabb;
                    this.ComputeAABB(aabb);
                    const callback = new b2ParticleSystem.UpdateBodyContactsCallback(this, this.GetFixtureContactFilter());
                    this.m_world.QueryAABB(callback, aabb);
                    if (this.m_def.strictContactCheck) {
                        this.RemoveSpuriousBodyContacts();
                    }
                    this.NotifyBodyContactListenerPostContact(fixtureSet);
                }
                Solve(step) {
                    const s_subStep = b2ParticleSystem.Solve_s_subStep;
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
                        const subStep = s_subStep.Copy(step);
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
                        if (!this.m_positionBuffer.data) {
                            throw new Error();
                        }
                        if (!this.m_velocityBuffer.data) {
                            throw new Error();
                        }
                        for (let i = 0; i < this.m_count; i++) {
                            ///m_positionBuffer.data[i] += subStep.dt * m_velocityBuffer.data[i];
                            this.m_positionBuffer.data[i].SelfMulAdd(subStep.dt, this.m_velocityBuffer.data[i]);
                        }
                    }
                }
                SolveCollision(step) {
                    const s_aabb = b2ParticleSystem.SolveCollision_s_aabb;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // This function detects particles which are crossing boundary of bodies
                    // and modifies velocities of them so that they will move just in front of
                    // boundary. This function function also applies the reaction force to
                    // bodies as precisely as the numerical stability is kept.
                    const aabb = s_aabb;
                    aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
                    for (let i = 0; i < this.m_count; i++) {
                        const v = vel_data[i];
                        const p1 = pos_data[i];
                        ///let p2 = p1 + step.dt * v;
                        const p2_x = p1.x + step.dt * v.x;
                        const p2_y = p1.y + step.dt * v.y;
                        ///aabb.lowerBound = b2Min(aabb.lowerBound, b2Min(p1, p2));
                        aabb.lowerBound.x = b2Math_1.b2Min(aabb.lowerBound.x, b2Math_1.b2Min(p1.x, p2_x));
                        aabb.lowerBound.y = b2Math_1.b2Min(aabb.lowerBound.y, b2Math_1.b2Min(p1.y, p2_y));
                        ///aabb.upperBound = b2Max(aabb.upperBound, b2Max(p1, p2));
                        aabb.upperBound.x = b2Math_1.b2Max(aabb.upperBound.x, b2Math_1.b2Max(p1.x, p2_x));
                        aabb.upperBound.y = b2Math_1.b2Max(aabb.upperBound.y, b2Math_1.b2Max(p1.y, p2_y));
                    }
                    const callback = new b2ParticleSystem.SolveCollisionCallback(this, step);
                    this.m_world.QueryAABB(callback, aabb);
                }
                LimitVelocity(step) {
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    const criticalVelocitySquared = this.GetCriticalVelocitySquared(step);
                    for (let i = 0; i < this.m_count; i++) {
                        const v = vel_data[i];
                        const v2 = b2Math_1.b2Vec2.DotVV(v, v);
                        if (v2 > criticalVelocitySquared) {
                            ///v *= b2Sqrt(criticalVelocitySquared / v2);
                            v.SelfMul(b2Math_1.b2Sqrt(criticalVelocitySquared / v2));
                        }
                    }
                }
                SolveGravity(step) {
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const s_gravity = b2ParticleSystem.SolveGravity_s_gravity;
                    const vel_data = this.m_velocityBuffer.data;
                    ///b2Vec2 gravity = step.dt * m_def.gravityScale * m_world.GetGravity();
                    const gravity = b2Math_1.b2Vec2.MulSV(step.dt * this.m_def.gravityScale, this.m_world.GetGravity(), s_gravity);
                    for (let i = 0; i < this.m_count; i++) {
                        vel_data[i].SelfAdd(gravity);
                    }
                }
                SolveBarrier(step) {
                    const s_aabb = b2ParticleSystem.SolveBarrier_s_aabb;
                    const s_va = b2ParticleSystem.SolveBarrier_s_va;
                    const s_vb = b2ParticleSystem.SolveBarrier_s_vb;
                    const s_pba = b2ParticleSystem.SolveBarrier_s_pba;
                    const s_vba = b2ParticleSystem.SolveBarrier_s_vba;
                    const s_vc = b2ParticleSystem.SolveBarrier_s_vc;
                    const s_pca = b2ParticleSystem.SolveBarrier_s_pca;
                    const s_vca = b2ParticleSystem.SolveBarrier_s_vca;
                    const s_qba = b2ParticleSystem.SolveBarrier_s_qba;
                    const s_qca = b2ParticleSystem.SolveBarrier_s_qca;
                    const s_dv = b2ParticleSystem.SolveBarrier_s_dv;
                    const s_f = b2ParticleSystem.SolveBarrier_s_f;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // If a particle is passing between paired barrier particles,
                    // its velocity will be decelerated to avoid passing.
                    for (let i = 0; i < this.m_count; i++) {
                        const flags = this.m_flagsBuffer.data[i];
                        ///if ((flags & b2ParticleSystem.k_barrierWallFlags) === b2ParticleSystem.k_barrierWallFlags)
                        if ((flags & b2ParticleSystem.k_barrierWallFlags) !== 0) {
                            vel_data[i].SetZero();
                        }
                    }
                    const tmax = b2Settings_1.b2_barrierCollisionTime * step.dt;
                    const mass = this.GetParticleMass();
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_1.b2ParticleFlag.b2_barrierParticle) {
                            const a = pair.indexA;
                            const b = pair.indexB;
                            const pa = pos_data[a];
                            const pb = pos_data[b];
                            /// b2AABB aabb;
                            const aabb = s_aabb;
                            ///aabb.lowerBound = b2Min(pa, pb);
                            b2Math_1.b2Vec2.MinV(pa, pb, aabb.lowerBound);
                            ///aabb.upperBound = b2Max(pa, pb);
                            b2Math_1.b2Vec2.MaxV(pa, pb, aabb.upperBound);
                            const aGroup = this.m_groupBuffer[a];
                            const bGroup = this.m_groupBuffer[b];
                            ///b2Vec2 va = GetLinearVelocity(aGroup, a, pa);
                            const va = this.GetLinearVelocity(aGroup, a, pa, s_va);
                            ///b2Vec2 vb = GetLinearVelocity(bGroup, b, pb);
                            const vb = this.GetLinearVelocity(bGroup, b, pb, s_vb);
                            ///b2Vec2 pba = pb - pa;
                            const pba = b2Math_1.b2Vec2.SubVV(pb, pa, s_pba);
                            ///b2Vec2 vba = vb - va;
                            const vba = b2Math_1.b2Vec2.SubVV(vb, va, s_vba);
                            ///InsideBoundsEnumerator enumerator = GetInsideBoundsEnumerator(aabb);
                            const enumerator = this.GetInsideBoundsEnumerator(aabb);
                            let c;
                            while ((c = enumerator.GetNext()) >= 0) {
                                const pc = pos_data[c];
                                const cGroup = this.m_groupBuffer[c];
                                if (aGroup !== cGroup && bGroup !== cGroup) {
                                    ///b2Vec2 vc = GetLinearVelocity(cGroup, c, pc);
                                    const vc = this.GetLinearVelocity(cGroup, c, pc, s_vc);
                                    // Solve the equation below:
                                    //   (1-s)*(pa+t*va)+s*(pb+t*vb) = pc+t*vc
                                    // which expresses that the particle c will pass a line
                                    // connecting the particles a and b at the time of t.
                                    // if s is between 0 and 1, c will pass between a and b.
                                    ///b2Vec2 pca = pc - pa;
                                    const pca = b2Math_1.b2Vec2.SubVV(pc, pa, s_pca);
                                    ///b2Vec2 vca = vc - va;
                                    const vca = b2Math_1.b2Vec2.SubVV(vc, va, s_vca);
                                    const e2 = b2Math_1.b2Vec2.CrossVV(vba, vca);
                                    const e1 = b2Math_1.b2Vec2.CrossVV(pba, vca) - b2Math_1.b2Vec2.CrossVV(pca, vba);
                                    const e0 = b2Math_1.b2Vec2.CrossVV(pba, pca);
                                    let s, t;
                                    ///b2Vec2 qba, qca;
                                    const qba = s_qba, qca = s_qca;
                                    if (e2 === 0) {
                                        if (e1 === 0) {
                                            continue;
                                        }
                                        t = -e0 / e1;
                                        if (!(t >= 0 && t < tmax)) {
                                            continue;
                                        }
                                        ///qba = pba + t * vba;
                                        b2Math_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                        ///qca = pca + t * vca;
                                        b2Math_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                        s = b2Math_1.b2Vec2.DotVV(qba, qca) / b2Math_1.b2Vec2.DotVV(qba, qba);
                                        if (!(s >= 0 && s <= 1)) {
                                            continue;
                                        }
                                    }
                                    else {
                                        const det = e1 * e1 - 4 * e0 * e2;
                                        if (det < 0) {
                                            continue;
                                        }
                                        const sqrtDet = b2Math_1.b2Sqrt(det);
                                        let t1 = (-e1 - sqrtDet) / (2 * e2);
                                        let t2 = (-e1 + sqrtDet) / (2 * e2);
                                        ///if (t1 > t2) b2Swap(t1, t2);
                                        if (t1 > t2) {
                                            const tmp = t1;
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
                                            if (!(t >= 0 && t < tmax)) {
                                                continue;
                                            }
                                            ///qba = pba + t * vba;
                                            b2Math_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                            ///qca = pca + t * vca;
                                            b2Math_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                            ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                                            s = b2Math_1.b2Vec2.DotVV(qba, qca) / b2Math_1.b2Vec2.DotVV(qba, qba);
                                            if (!(s >= 0 && s <= 1)) {
                                                continue;
                                            }
                                        }
                                    }
                                    // Apply a force to particle c so that it will have the
                                    // interpolated velocity at the collision point on line ab.
                                    ///b2Vec2 dv = va + s * vba - vc;
                                    const dv = s_dv;
                                    dv.x = va.x + s * vba.x - vc.x;
                                    dv.y = va.y + s * vba.y - vc.y;
                                    ///b2Vec2 f = GetParticleMass() * dv;
                                    const f = b2Math_1.b2Vec2.MulSV(mass, dv, s_f);
                                    if (cGroup && this.IsRigidGroup(cGroup)) {
                                        // If c belongs to a rigid group, the force will be
                                        // distributed in the group.
                                        const mass = cGroup.GetMass();
                                        const inertia = cGroup.GetInertia();
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    this.m_staticPressureBuffer = this.RequestBuffer(this.m_staticPressureBuffer);
                    const criticalPressure = this.GetCriticalPressure(step);
                    const pressurePerWeight = this.m_def.staticPressureStrength * criticalPressure;
                    const maxPressure = b2Settings_2.b2_maxParticlePressure * criticalPressure;
                    const relaxation = this.m_def.staticPressureRelaxation;
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
                            const contact = this.m_contactBuffer.data[k];
                            if (contact.flags & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                                const a = contact.indexA;
                                const b = contact.indexB;
                                const w = contact.weight;
                                this.m_accumulationBuffer[a] += w * this.m_staticPressureBuffer[b]; // a <- b
                                this.m_accumulationBuffer[b] += w * this.m_staticPressureBuffer[a]; // b <- a
                            }
                        }
                        for (let i = 0; i < this.m_count; i++) {
                            const w = this.m_weightBuffer[i];
                            if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                                const wh = this.m_accumulationBuffer[i];
                                const h = (wh + pressurePerWeight * (w - b2Settings_2.b2_minParticleWeight)) /
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
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        const w = contact.weight;
                        this.m_weightBuffer[a] += w;
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const w = contact.weight;
                        this.m_weightBuffer[a] += w;
                        this.m_weightBuffer[b] += w;
                    }
                }
                SolvePressure(step) {
                    const s_f = b2ParticleSystem.SolvePressure_s_f;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // calculates pressure as a linear function of density
                    const criticalPressure = this.GetCriticalPressure(step);
                    const pressurePerWeight = this.m_def.pressureStrength * criticalPressure;
                    const maxPressure = b2Settings_2.b2_maxParticlePressure * criticalPressure;
                    for (let i = 0; i < this.m_count; i++) {
                        const w = this.m_weightBuffer[i];
                        const h = pressurePerWeight * b2Math_1.b2Max(0.0, w - b2Settings_2.b2_minParticleWeight);
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
                        // DEBUG: b2Assert(this.m_staticPressureBuffer !== null);
                        for (let i = 0; i < this.m_count; i++) {
                            if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_staticPressureParticle) {
                                this.m_accumulationBuffer[i] += this.m_staticPressureBuffer[i];
                            }
                        }
                    }
                    // applies pressure between each particles in contact
                    const velocityPerPressure = step.dt / (this.m_def.density * this.m_particleDiameter);
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        const b = contact.body;
                        const w = contact.weight;
                        const m = contact.mass;
                        const n = contact.normal;
                        const p = pos_data[a];
                        const h = this.m_accumulationBuffer[a] + pressurePerWeight * w;
                        ///b2Vec2 f = velocityPerPressure * w * m * h * n;
                        const f = b2Math_1.b2Vec2.MulSV(velocityPerPressure * w * m * h, n, s_f);
                        ///m_velocityBuffer.data[a] -= GetParticleInvMass() * f;
                        vel_data[a].SelfMulSub(inv_mass, f);
                        b.ApplyLinearImpulse(f, p, true);
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const w = contact.weight;
                        const n = contact.normal;
                        const h = this.m_accumulationBuffer[a] + this.m_accumulationBuffer[b];
                        ///b2Vec2 f = velocityPerPressure * w * h * n;
                        const f = b2Math_1.b2Vec2.MulSV(velocityPerPressure * w * h, n, s_f);
                        ///m_velocityBuffer.data[a] -= f;
                        vel_data[a].SelfSub(f);
                        ///m_velocityBuffer.data[b] += f;
                        vel_data[b].SelfAdd(f);
                    }
                }
                SolveDamping(step) {
                    const s_v = b2ParticleSystem.SolveDamping_s_v;
                    const s_f = b2ParticleSystem.SolveDamping_s_f;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // reduces normal velocity of each contact
                    const linearDamping = this.m_def.dampingStrength;
                    const quadraticDamping = 1 / this.GetCriticalVelocity(step);
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        const b = contact.body;
                        const w = contact.weight;
                        const m = contact.mass;
                        const n = contact.normal;
                        const p = pos_data[a];
                        ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
                        const v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                        const vn = b2Math_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            const damping = b2Math_1.b2Max(linearDamping * w, b2Math_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * m * vn * n;
                            const f = b2Math_1.b2Vec2.MulSV(damping * m * vn, n, s_f);
                            ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                            vel_data[a].SelfMulAdd(inv_mass, f);
                            ///b.ApplyLinearImpulse(-f, p, true);
                            b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const w = contact.weight;
                        const n = contact.normal;
                        ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                        const v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        const vn = b2Math_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            ///float32 damping = b2Max(linearDamping * w, b2Min(- quadraticDamping * vn, 0.5f));
                            const damping = b2Math_1.b2Max(linearDamping * w, b2Math_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * vn * n;
                            const f = b2Math_1.b2Vec2.MulSV(damping * vn, n, s_f);
                            ///this.m_velocityBuffer.data[a] += f;
                            vel_data[a].SelfAdd(f);
                            ///this.m_velocityBuffer.data[b] -= f;
                            vel_data[b].SelfSub(f);
                        }
                    }
                }
                SolveRigidDamping() {
                    const s_t0 = b2ParticleSystem.SolveRigidDamping_s_t0;
                    const s_t1 = b2ParticleSystem.SolveRigidDamping_s_t1;
                    const s_p = b2ParticleSystem.SolveRigidDamping_s_p;
                    const s_v = b2ParticleSystem.SolveRigidDamping_s_v;
                    const invMassA = [0.0], invInertiaA = [0.0], tangentDistanceA = [0.0]; // TODO: static
                    const invMassB = [0.0], invInertiaB = [0.0], tangentDistanceB = [0.0]; // TODO: static
                    // Apply impulse to rigid particle groups colliding with other objects
                    // to reduce relative velocity at the colliding point.
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const damping = this.m_def.dampingStrength;
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        const aGroup = this.m_groupBuffer[a];
                        if (aGroup && this.IsRigidGroup(aGroup)) {
                            const b = contact.body;
                            const n = contact.normal;
                            const w = contact.weight;
                            const p = pos_data[a];
                            ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - aGroup.GetLinearVelocityFromWorldPoint(p);
                            const v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, s_t0), aGroup.GetLinearVelocityFromWorldPoint(p, s_t1), s_v);
                            const vn = b2Math_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                // The group's average velocity at particle position 'p' is pushing
                                // the particle into the body.
                                ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, true, aGroup, a, p, n);
                                this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, p, n);
                                // Calculate b.m_I from public functions of b2Body.
                                ///this.InitDampingParameter(&invMassB, &invInertiaB, &tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                this.InitDampingParameter(invMassB, invInertiaB, tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                ///float32 f = damping * b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
                                const f = damping * b2Math_1.b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
                                ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, f, n);
                                this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], true, aGroup, a, f, n);
                                ///b.ApplyLinearImpulse(-f * n, p, true);
                                b.ApplyLinearImpulse(b2Math_1.b2Vec2.MulSV(-f, n, b2Math_1.b2Vec2.s_t0), p, true);
                            }
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const n = contact.normal;
                        const w = contact.weight;
                        const aGroup = this.m_groupBuffer[a];
                        const bGroup = this.m_groupBuffer[b];
                        const aRigid = this.IsRigidGroup(aGroup);
                        const bRigid = this.IsRigidGroup(bGroup);
                        if (aGroup !== bGroup && (aRigid || bRigid)) {
                            ///b2Vec2 p = 0.5f * (this.m_positionBuffer.data[a] + this.m_positionBuffer.data[b]);
                            const p = b2Math_1.b2Vec2.MidVV(pos_data[a], pos_data[b], s_p);
                            ///b2Vec2 v = GetLinearVelocity(bGroup, b, p) - GetLinearVelocity(aGroup, a, p);
                            const v = b2Math_1.b2Vec2.SubVV(this.GetLinearVelocity(bGroup, b, p, s_t0), this.GetLinearVelocity(aGroup, a, p, s_t1), s_v);
                            const vn = b2Math_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, aRigid, aGroup, a, p, n);
                                this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, aRigid, aGroup, a, p, n);
                                ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassB, &invInertiaB, &tangentDistanceB, bRigid, bGroup, b, p, n);
                                this.InitDampingParameterWithRigidGroupOrParticle(invMassB, invInertiaB, tangentDistanceB, bRigid, bGroup, b, p, n);
                                ///float32 f = damping * w * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
                                const f = damping * w * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
                                ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, aRigid, aGroup, a, f, n);
                                this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], aRigid, aGroup, a, f, n);
                                ///this.ApplyDamping(invMassB, invInertiaB, tangentDistanceB, bRigid, bGroup, b, -f, n);
                                this.ApplyDamping(invMassB[0], invInertiaB[0], tangentDistanceB[0], bRigid, bGroup, b, -f, n);
                            }
                        }
                    }
                }
                SolveExtraDamping() {
                    const s_v = b2ParticleSystem.SolveExtraDamping_s_v;
                    const s_f = b2ParticleSystem.SolveExtraDamping_s_f;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    // Applies additional damping force between bodies and particles which can
                    // produce strong repulsive force. Applying damping force multiple times
                    // is effective in suppressing vibration.
                    const pos_data = this.m_positionBuffer.data;
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2ParticleSystem.k_extraDampingFlags) {
                            const b = contact.body;
                            const m = contact.mass;
                            const n = contact.normal;
                            const p = pos_data[a];
                            ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
                            const v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///float32 vn = b2Dot(v, n);
                            const vn = b2Math_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                ///b2Vec2 f = 0.5f * m * vn * n;
                                const f = b2Math_1.b2Vec2.MulSV(0.5 * m * vn, n, s_f);
                                ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                                vel_data[a].SelfMulAdd(inv_mass, f);
                                ///b.ApplyLinearImpulse(-f, p, true);
                                b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                            }
                        }
                    }
                }
                SolveWall() {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    for (let i = 0; i < this.m_count; i++) {
                        if (this.m_flagsBuffer.data[i] & b2Particle_1.b2ParticleFlag.b2_wallParticle) {
                            vel_data[i].SetZero();
                        }
                    }
                }
                SolveRigid(step) {
                    const s_position = b2ParticleSystem.SolveRigid_s_position;
                    const s_rotation = b2ParticleSystem.SolveRigid_s_rotation;
                    const s_transform = b2ParticleSystem.SolveRigid_s_transform;
                    const s_velocityTransform = b2ParticleSystem.SolveRigid_s_velocityTransform;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        if (group.m_groupFlags & b2ParticleGroup_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            group.UpdateStatistics();
                            ///b2Rot rotation(step.dt * group.m_angularVelocity);
                            const rotation = s_rotation;
                            rotation.SetAngle(step.dt * group.m_angularVelocity);
                            ///b2Transform transform(group.m_center + step.dt * group.m_linearVelocity - b2Mul(rotation, group.m_center), rotation);
                            const position = b2Math_1.b2Vec2.AddVV(group.m_center, b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.MulSV(step.dt, group.m_linearVelocity, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Rot.MulRV(rotation, group.m_center, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0), s_position);
                            const transform = s_transform;
                            transform.SetPositionRotation(position, rotation);
                            ///group.m_transform = b2Mul(transform, group.m_transform);
                            b2Math_1.b2Transform.MulXX(transform, group.m_transform, group.m_transform);
                            const velocityTransform = s_velocityTransform;
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
                    const s_pa = b2ParticleSystem.SolveElastic_s_pa;
                    const s_pb = b2ParticleSystem.SolveElastic_s_pb;
                    const s_pc = b2ParticleSystem.SolveElastic_s_pc;
                    const s_r = b2ParticleSystem.SolveElastic_s_r;
                    const s_t0 = b2ParticleSystem.SolveElastic_s_t0;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const elasticStrength = step.inv_dt * this.m_def.elasticStrength;
                    for (let k = 0; k < this.m_triadBuffer.count; k++) {
                        const triad = this.m_triadBuffer.data[k];
                        if (triad.flags & b2Particle_1.b2ParticleFlag.b2_elasticParticle) {
                            const a = triad.indexA;
                            const b = triad.indexB;
                            const c = triad.indexC;
                            const oa = triad.pa;
                            const ob = triad.pb;
                            const oc = triad.pc;
                            ///b2Vec2 pa = m_positionBuffer.data[a];
                            const pa = s_pa.Copy(pos_data[a]);
                            ///b2Vec2 pb = m_positionBuffer.data[b];
                            const pb = s_pb.Copy(pos_data[b]);
                            ///b2Vec2 pc = m_positionBuffer.data[c];
                            const pc = s_pc.Copy(pos_data[c]);
                            const va = vel_data[a];
                            const vb = vel_data[b];
                            const vc = vel_data[c];
                            ///pa += step.dt * va;
                            pa.SelfMulAdd(step.dt, va);
                            ///pb += step.dt * vb;
                            pb.SelfMulAdd(step.dt, vb);
                            ///pc += step.dt * vc;
                            pc.SelfMulAdd(step.dt, vc);
                            ///b2Vec2 midPoint = (float32) 1 / 3 * (pa + pb + pc);
                            const midPoint_x = (pa.x + pb.x + pc.x) / 3.0;
                            const midPoint_y = (pa.y + pb.y + pc.y) / 3.0;
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
                            const r = s_r;
                            r.s = b2Math_1.b2Vec2.CrossVV(oa, pa) + b2Math_1.b2Vec2.CrossVV(ob, pb) + b2Math_1.b2Vec2.CrossVV(oc, pc);
                            r.c = b2Math_1.b2Vec2.DotVV(oa, pa) + b2Math_1.b2Vec2.DotVV(ob, pb) + b2Math_1.b2Vec2.DotVV(oc, pc);
                            const r2 = r.s * r.s + r.c * r.c;
                            let invR = b2Math_1.b2InvSqrt(r2);
                            if (!isFinite(invR)) {
                                invR = 1.98177537e+019;
                            }
                            r.s *= invR;
                            r.c *= invR;
                            ///r.angle = Math.atan2(r.s, r.c); // TODO: optimize
                            const strength = elasticStrength * triad.strength;
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
                    const s_pa = b2ParticleSystem.SolveSpring_s_pa;
                    const s_pb = b2ParticleSystem.SolveSpring_s_pb;
                    const s_d = b2ParticleSystem.SolveSpring_s_d;
                    const s_f = b2ParticleSystem.SolveSpring_s_f;
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const springStrength = step.inv_dt * this.m_def.springStrength;
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_1.b2ParticleFlag.b2_springParticle) {
                            ///int32 a = pair.indexA;
                            const a = pair.indexA;
                            ///int32 b = pair.indexB;
                            const b = pair.indexB;
                            ///b2Vec2 pa = m_positionBuffer.data[a];
                            const pa = s_pa.Copy(pos_data[a]);
                            ///b2Vec2 pb = m_positionBuffer.data[b];
                            const pb = s_pb.Copy(pos_data[b]);
                            ///b2Vec2& va = m_velocityBuffer.data[a];
                            const va = vel_data[a];
                            ///b2Vec2& vb = m_velocityBuffer.data[b];
                            const vb = vel_data[b];
                            ///pa += step.dt * va;
                            pa.SelfMulAdd(step.dt, va);
                            ///pb += step.dt * vb;
                            pb.SelfMulAdd(step.dt, vb);
                            ///b2Vec2 d = pb - pa;
                            const d = b2Math_1.b2Vec2.SubVV(pb, pa, s_d);
                            ///float32 r0 = pair.distance;
                            const r0 = pair.distance;
                            ///float32 r1 = d.Length();
                            const r1 = d.Length();
                            ///float32 strength = springStrength * pair.strength;
                            const strength = springStrength * pair.strength;
                            ///b2Vec2 f = strength * (r0 - r1) / r1 * d;
                            const f = b2Math_1.b2Vec2.MulSV(strength * (r0 - r1) / r1, d, s_f);
                            ///va -= f;
                            va.SelfSub(f);
                            ///vb += f;
                            vb.SelfAdd(f);
                        }
                    }
                }
                SolveTensile(step) {
                    const s_weightedNormal = b2ParticleSystem.SolveTensile_s_weightedNormal;
                    const s_s = b2ParticleSystem.SolveTensile_s_s;
                    const s_f = b2ParticleSystem.SolveTensile_s_f;
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    // DEBUG: b2Assert(this.m_accumulation2Buffer !== null);
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_accumulation2Buffer[i] = new b2Math_1.b2Vec2();
                        this.m_accumulation2Buffer[i].SetZero();
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            const n = contact.normal;
                            ///b2Vec2 weightedNormal = (1 - w) * w * n;
                            const weightedNormal = b2Math_1.b2Vec2.MulSV((1 - w) * w, n, s_weightedNormal);
                            ///m_accumulation2Buffer[a] -= weightedNormal;
                            this.m_accumulation2Buffer[a].SelfSub(weightedNormal);
                            ///m_accumulation2Buffer[b] += weightedNormal;
                            this.m_accumulation2Buffer[b].SelfAdd(weightedNormal);
                        }
                    }
                    const criticalVelocity = this.GetCriticalVelocity(step);
                    const pressureStrength = this.m_def.surfaceTensionPressureStrength * criticalVelocity;
                    const normalStrength = this.m_def.surfaceTensionNormalStrength * criticalVelocity;
                    const maxVelocityVariation = b2Settings_2.b2_maxParticleForce * criticalVelocity;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_tensileParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            const n = contact.normal;
                            const h = this.m_weightBuffer[a] + this.m_weightBuffer[b];
                            ///b2Vec2 s = m_accumulation2Buffer[b] - m_accumulation2Buffer[a];
                            const s = b2Math_1.b2Vec2.SubVV(this.m_accumulation2Buffer[b], this.m_accumulation2Buffer[a], s_s);
                            const fn = b2Math_1.b2Min(pressureStrength * (h - 2) + normalStrength * b2Math_1.b2Vec2.DotVV(s, n), maxVelocityVariation) * w;
                            ///b2Vec2 f = fn * n;
                            const f = b2Math_1.b2Vec2.MulSV(fn, n, s_f);
                            ///m_velocityBuffer.data[a] -= f;
                            vel_data[a].SelfSub(f);
                            ///m_velocityBuffer.data[b] += f;
                            vel_data[b].SelfAdd(f);
                        }
                    }
                }
                SolveViscous() {
                    const s_v = b2ParticleSystem.SolveViscous_s_v;
                    const s_f = b2ParticleSystem.SolveViscous_s_f;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const viscousStrength = this.m_def.viscousStrength;
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_1.b2ParticleFlag.b2_viscousParticle) {
                            const b = contact.body;
                            const w = contact.weight;
                            const m = contact.mass;
                            const p = pos_data[a];
                            ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
                            const v = b2Math_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * m * w * v;
                            const f = b2Math_1.b2Vec2.MulSV(viscousStrength * m * w, v, s_f);
                            ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                            vel_data[a].SelfMulAdd(inv_mass, f);
                            ///b.ApplyLinearImpulse(-f, p, true);
                            b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_viscousParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                            const v = b2Math_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * w * v;
                            const f = b2Math_1.b2Vec2.MulSV(viscousStrength * w, v, s_f);
                            ///m_velocityBuffer.data[a] += f;
                            vel_data[a].SelfAdd(f);
                            ///m_velocityBuffer.data[b] -= f;
                            vel_data[b].SelfSub(f);
                        }
                    }
                }
                SolveRepulsive(step) {
                    const s_f = b2ParticleSystem.SolveRepulsive_s_f;
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    const repulsiveStrength = this.m_def.repulsiveStrength * this.GetCriticalVelocity(step);
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_repulsiveParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
                                const w = contact.weight;
                                const n = contact.normal;
                                ///b2Vec2 f = repulsiveStrength * w * n;
                                const f = b2Math_1.b2Vec2.MulSV(repulsiveStrength * w, n, s_f);
                                ///m_velocityBuffer.data[a] -= f;
                                vel_data[a].SelfSub(f);
                                ///m_velocityBuffer.data[b] += f;
                                vel_data[b].SelfAdd(f);
                            }
                        }
                    }
                }
                SolvePowder(step) {
                    const s_f = b2ParticleSystem.SolvePowder_s_f;
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const powderStrength = this.m_def.powderStrength * this.GetCriticalVelocity(step);
                    const minWeight = 1.0 - b2Settings_2.b2_particleStride;
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_1.b2ParticleFlag.b2_powderParticle) {
                            const w = contact.weight;
                            if (w > minWeight) {
                                const b = contact.body;
                                const m = contact.mass;
                                const p = pos_data[a];
                                const n = contact.normal;
                                const f = b2Math_1.b2Vec2.MulSV(powderStrength * m * (w - minWeight), n, s_f);
                                vel_data[a].SelfMulSub(inv_mass, f);
                                b.ApplyLinearImpulse(f, p, true);
                            }
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_1.b2ParticleFlag.b2_powderParticle) {
                            const w = contact.weight;
                            if (w > minWeight) {
                                const a = contact.indexA;
                                const b = contact.indexB;
                                const n = contact.normal;
                                const f = b2Math_1.b2Vec2.MulSV(powderStrength * (w - minWeight), n, s_f);
                                vel_data[a].SelfSub(f);
                                vel_data[b].SelfAdd(f);
                            }
                        }
                    }
                }
                SolveSolid(step) {
                    const s_f = b2ParticleSystem.SolveSolid_s_f;
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    // applies extra repulsive force from solid particle groups
                    this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer);
                    const ejectionStrength = step.inv_dt * this.m_def.ejectionStrength;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
                            const w = contact.weight;
                            const n = contact.normal;
                            const h = this.m_depthBuffer[a] + this.m_depthBuffer[b];
                            const f = b2Math_1.b2Vec2.MulSV(ejectionStrength * h * w, n, s_f);
                            vel_data[a].SelfSub(f);
                            vel_data[b].SelfAdd(f);
                        }
                    }
                }
                SolveForce(step) {
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const vel_data = this.m_velocityBuffer.data;
                    const velocityPerForce = step.dt * this.GetParticleInvMass();
                    for (let i = 0; i < this.m_count; i++) {
                        ///m_velocityBuffer.data[i] += velocityPerForce * m_forceBuffer[i];
                        vel_data[i].SelfMulAdd(velocityPerForce, this.m_forceBuffer[i]);
                    }
                    this.m_hasForce = false;
                }
                SolveColorMixing() {
                    // mixes color between contacting particles
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_colorBuffer.data) {
                        throw new Error();
                    }
                    const colorMixing = 0.5 * this.m_def.colorMixingStrength;
                    if (colorMixing) {
                        for (let k = 0; k < this.m_contactBuffer.count; k++) {
                            const contact = this.m_contactBuffer.data[k];
                            const a = contact.indexA;
                            const b = contact.indexB;
                            if (this.m_flagsBuffer.data[a] & this.m_flagsBuffer.data[b] &
                                b2Particle_1.b2ParticleFlag.b2_colorMixingParticle) {
                                const colorA = this.m_colorBuffer.data[a];
                                const colorB = this.m_colorBuffer.data[b];
                                // Use the static method to ensure certain compilers inline
                                // this correctly.
                                b2Draw_1.b2Color.MixColors(colorA, colorB, colorMixing);
                            }
                        }
                    }
                }
                SolveZombie() {
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    // removes particles with zombie flag
                    let newCount = 0;
                    ///int32* newIndices = (int32*) this.m_world.m_stackAllocator.Allocate(sizeof(int32) * this.m_count);
                    const newIndices = []; // TODO: static
                    for (let i = 0; i < this.m_count; i++) {
                        newIndices[i] = b2Settings_1.b2_invalidParticleIndex;
                    }
                    // DEBUG: b2Assert(newIndices.length === this.m_count);
                    let allParticleFlags = 0;
                    for (let i = 0; i < this.m_count; i++) {
                        const flags = this.m_flagsBuffer.data[i];
                        if (flags & b2Particle_1.b2ParticleFlag.b2_zombieParticle) {
                            const destructionListener = this.m_world.m_destructionListener;
                            if ((flags & b2Particle_1.b2ParticleFlag.b2_destructionListenerParticle) && destructionListener) {
                                destructionListener.SayGoodbyeParticle(this, i);
                            }
                            // Destroy particle handle.
                            if (this.m_handleIndexBuffer.data) {
                                const handle = this.m_handleIndexBuffer.data[i];
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
                                    const handle = this.m_handleIndexBuffer.data[i];
                                    if (handle) {
                                        handle.SetIndex(newCount);
                                    }
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
                    const Test = {
                        ///static bool IsProxyInvalid(const Proxy& proxy)
                        IsProxyInvalid: (proxy) => {
                            return proxy.index < 0;
                        },
                        ///static bool IsContactInvalid(const b2ParticleContact& contact)
                        IsContactInvalid: (contact) => {
                            return contact.indexA < 0 || contact.indexB < 0;
                        },
                        ///static bool IsBodyContactInvalid(const b2ParticleBodyContact& contact)
                        IsBodyContactInvalid: (contact) => {
                            return contact.index < 0;
                        },
                        ///static bool IsPairInvalid(const b2ParticlePair& pair)
                        IsPairInvalid: (pair) => {
                            return pair.indexA < 0 || pair.indexB < 0;
                        },
                        ///static bool IsTriadInvalid(const b2ParticleTriad& triad)
                        IsTriadInvalid: (triad) => {
                            return triad.indexA < 0 || triad.indexB < 0 || triad.indexC < 0;
                        },
                    };
                    // update proxies
                    for (let k = 0; k < this.m_proxyBuffer.count; k++) {
                        const proxy = this.m_proxyBuffer.data[k];
                        proxy.index = newIndices[proxy.index];
                    }
                    this.m_proxyBuffer.RemoveIf(Test.IsProxyInvalid);
                    // update contacts
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        contact.indexA = newIndices[contact.indexA];
                        contact.indexB = newIndices[contact.indexB];
                    }
                    this.m_contactBuffer.RemoveIf(Test.IsContactInvalid);
                    // update particle-body contacts
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        contact.index = newIndices[contact.index];
                    }
                    this.m_bodyContactBuffer.RemoveIf(Test.IsBodyContactInvalid);
                    // update pairs
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        pair.indexA = newIndices[pair.indexA];
                        pair.indexB = newIndices[pair.indexB];
                    }
                    this.m_pairBuffer.RemoveIf(Test.IsPairInvalid);
                    // update triads
                    for (let k = 0; k < this.m_triadBuffer.count; k++) {
                        const triad = this.m_triadBuffer.data[k];
                        triad.indexA = newIndices[triad.indexA];
                        triad.indexB = newIndices[triad.indexB];
                        triad.indexC = newIndices[triad.indexC];
                    }
                    this.m_triadBuffer.RemoveIf(Test.IsTriadInvalid);
                    // Update lifetime indices.
                    if (this.m_indexByExpirationTimeBuffer.data) {
                        let writeOffset = 0;
                        for (let readOffset = 0; readOffset < this.m_count; readOffset++) {
                            const newIndex = newIndices[this.m_indexByExpirationTimeBuffer.data[readOffset]];
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
                            const j = newIndices[i];
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
                        const next = group.GetNext();
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
                    if (!this.m_expirationTimeBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_indexByExpirationTimeBuffer.data) {
                        throw new Error();
                    }
                    // Update the time elapsed.
                    this.m_timeElapsed = this.LifetimeToExpirationTime(step.dt);
                    // Get the floor (non-fractional component) of the elapsed time.
                    const quantizedTimeElapsed = this.GetQuantizedTimeElapsed();
                    const expirationTimes = this.m_expirationTimeBuffer.data;
                    const expirationTimeIndices = this.m_indexByExpirationTimeBuffer.data;
                    const particleCount = this.GetParticleCount();
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
                        const ExpirationTimeComparator = (particleIndexA, particleIndexB) => {
                            const expirationTimeA = expirationTimes[particleIndexA];
                            const expirationTimeB = expirationTimes[particleIndexB];
                            const infiniteExpirationTimeA = expirationTimeA <= 0.0;
                            const infiniteExpirationTimeB = expirationTimeB <= 0.0;
                            return infiniteExpirationTimeA === infiniteExpirationTimeB ?
                                expirationTimeA > expirationTimeB : infiniteExpirationTimeA;
                        };
                        std_sort(expirationTimeIndices, 0, particleCount, ExpirationTimeComparator);
                        this.m_expirationTimeBufferRequiresSorting = false;
                    }
                    // Destroy particles which have expired.
                    for (let i = particleCount - 1; i >= 0; --i) {
                        const particleIndex = expirationTimeIndices[i];
                        const expirationTime = expirationTimes[particleIndex];
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
                    // DEBUG: b2Assert(mid >= start && mid <= end);
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
                    if (!this.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_velocityBuffer.data) {
                        throw new Error();
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
                            const handle = this.m_handleIndexBuffer.data[i];
                            if (handle) {
                                handle.SetIndex(newIndices(handle.GetIndex()));
                            }
                        }
                    }
                    if (this.m_expirationTimeBuffer.data) {
                        ///std::rotate(m_expirationTimeBuffer.data + start, m_expirationTimeBuffer.data + mid, m_expirationTimeBuffer.data + end);
                        std_rotate(this.m_expirationTimeBuffer.data, start, mid, end);
                        // Update expiration time buffer indices.
                        const particleCount = this.GetParticleCount();
                        if (!this.m_indexByExpirationTimeBuffer.data) {
                            throw new Error();
                        }
                        const indexByExpirationTime = this.m_indexByExpirationTimeBuffer.data;
                        for (let i = 0; i < particleCount; ++i) {
                            indexByExpirationTime[i] = newIndices(indexByExpirationTime[i]);
                        }
                    }
                    // update proxies
                    for (let k = 0; k < this.m_proxyBuffer.count; k++) {
                        const proxy = this.m_proxyBuffer.data[k];
                        proxy.index = newIndices(proxy.index);
                    }
                    // update contacts
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        contact.indexA = newIndices(contact.indexA);
                        contact.indexB = newIndices(contact.indexB);
                    }
                    // update particle-body contacts
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        contact.index = newIndices(contact.index);
                    }
                    // update pairs
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        pair.indexA = newIndices(pair.indexA);
                        pair.indexB = newIndices(pair.indexB);
                    }
                    // update triads
                    for (let k = 0; k < this.m_triadBuffer.count; k++) {
                        const triad = this.m_triadBuffer.data[k];
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
                    const velocity = this.GetCriticalVelocity(step);
                    return velocity * velocity;
                }
                GetCriticalPressure(step) {
                    return this.m_def.density * this.GetCriticalVelocitySquared(step);
                }
                GetParticleStride() {
                    return b2Settings_2.b2_particleStride * this.m_particleDiameter;
                }
                GetParticleMass() {
                    const stride = this.GetParticleStride();
                    return this.m_def.density * stride * stride;
                }
                GetParticleInvMass() {
                    ///return 1.777777 * this.m_inverseDensity * this.m_inverseDiameter * this.m_inverseDiameter;
                    // mass = density * stride^2, so we take the inverse of this.
                    const inverseStride = this.m_inverseDiameter * (1.0 / b2Settings_2.b2_particleStride);
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
                    // DEBUG: b2Assert(((newData !== null) && (newCapacity > 0)) || ((newData === null) && (newCapacity === 0)));
                    ///if (!buffer.userSuppliedCapacity)
                    ///{
                    ///this.m_world.m_blockAllocator.Free(buffer.data, sizeof(T) * m_internalAllocatedCapacity);
                    ///}
                    buffer.data = newData;
                    buffer.userSuppliedCapacity = newCapacity;
                }
                SetGroupFlags(group, newFlags) {
                    const oldFlags = group.m_groupFlags;
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
                    const s_n = b2ParticleSystem.RemoveSpuriousBodyContacts_s_n;
                    const s_pos = b2ParticleSystem.RemoveSpuriousBodyContacts_s_pos;
                    const s_normal = b2ParticleSystem.RemoveSpuriousBodyContacts_s_normal;
                    // Max number of contacts processed per particle, from nearest to farthest.
                    // This must be at least 2 for correctness with concave shapes; 3 was
                    // experimentally arrived at as looking reasonable.
                    const k_maxContactsPerPoint = 3;
                    const system = this;
                    // Index of last particle processed.
                    let lastIndex = -1;
                    // Number of contacts processed for the current particle.
                    let currentContacts = 0;
                    // Output the number of discarded contacts.
                    // let discarded = 0;
                    const b2ParticleBodyContactRemovePredicate = (contact) => {
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
                        const n = s_n.Copy(contact.normal);
                        // weight is 1-(inv(diameter) * distance)
                        ///n *= system.m_particleDiameter * (1 - contact.weight);
                        n.SelfMul(system.m_particleDiameter * (1 - contact.weight));
                        ///b2Vec2 pos = system.m_positionBuffer.data[contact.index] + n;
                        if (!system.m_positionBuffer.data) {
                            throw new Error();
                        }
                        const pos = b2Math_1.b2Vec2.AddVV(system.m_positionBuffer.data[contact.index], n, s_pos);
                        // pos is now a point projected back along the contact normal to the
                        // contact distance. If the surface makes sense for a contact, pos will
                        // now lie on or in the fixture generating
                        if (!contact.fixture.TestPoint(pos)) {
                            const childCount = contact.fixture.GetShape().GetChildCount();
                            for (let childIndex = 0; childIndex < childCount; childIndex++) {
                                const normal = s_normal;
                                const distance = contact.fixture.ComputeDistance(pos, normal, childIndex);
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
                    if (!this.m_bodyContactCountBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_consecutiveContactStepsBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_lastBodyContactStepBuffer.data) {
                        throw new Error();
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
                    if (group && this.IsRigidGroup(group)) {
                        return group.GetLinearVelocityFromWorldPoint(point, out);
                    }
                    else {
                        if (!this.m_velocityBuffer.data) {
                            throw new Error();
                        }
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
                    if (group && isRigidGroup) {
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, group.GetMass(), group.GetInertia(), group.GetCenter(), point, normal);
                    }
                    else {
                        if (!this.m_flagsBuffer.data) {
                            throw new Error();
                        }
                        const flags = this.m_flagsBuffer.data[particleIndex];
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, flags & b2Particle_1.b2ParticleFlag.b2_wallParticle ? 0 : this.GetParticleMass(), 0, point, point, normal);
                    }
                }
                ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, normalVelocity) {
                    const invMass = invMassA + invInertiaA * tangentDistanceA * tangentDistanceA +
                        invMassB + invInertiaB * tangentDistanceB * tangentDistanceB;
                    return invMass > 0 ? normalVelocity / invMass : 0;
                }
                ApplyDamping(invMass, invInertia, tangentDistance, isRigidGroup, group, particleIndex, impulse, normal) {
                    if (group && isRigidGroup) {
                        ///group.m_linearVelocity += impulse * invMass * normal;
                        group.m_linearVelocity.SelfMulAdd(impulse * invMass, normal);
                        ///group.m_angularVelocity += impulse * tangentDistance * invInertia;
                        group.m_angularVelocity += impulse * tangentDistance * invInertia;
                    }
                    else {
                        if (!this.m_velocityBuffer.data) {
                            throw new Error();
                        }
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
             */
            b2ParticleSystem.k_triadFlags = b2Particle_1.b2ParticleFlag.b2_elasticParticle;
            /**
             * All particle types that do not produce dynamic pressure
             */
            b2ParticleSystem.k_noPressureFlags = b2Particle_1.b2ParticleFlag.b2_powderParticle | b2Particle_1.b2ParticleFlag.b2_tensileParticle;
            /**
             * All particle types that apply extra damping force with bodies
             */
            b2ParticleSystem.k_extraDampingFlags = b2Particle_1.b2ParticleFlag.b2_staticPressureParticle;
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
                        // DEBUG: b2Assert(this.m_first <= this.m_last);
                    }
                    /**
                     * Get index of the next particle. Returns
                     * b2_invalidParticleIndex if there are no more particles.
                     */
                    GetNext() {
                        while (this.m_first < this.m_last) {
                            const xTag = (this.m_system.m_proxyBuffer.data[this.m_first].tag & b2ParticleSystem.xMask) >>> 0;
                            // #if B2_ASSERT_ENABLED
                            // DEBUG: const yTag = (this.m_system.m_proxyBuffer.data[this.m_first].tag & b2ParticleSystem.yMask) >>> 0;
                            // DEBUG: b2Assert(yTag >= this.m_yLower);
                            // DEBUG: b2Assert(yTag <= this.m_yUpper);
                            // #endif
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
                        if (particleSystem !== this.m_system) {
                            return false;
                        }
                        // DEBUG: b2Assert(index >= 0 && index < this.m_system.m_count);
                        if (!this.m_system.m_positionBuffer.data) {
                            throw new Error();
                        }
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
                    constructor(shapes, shapeCount = shapes.length) {
                        super(b2Shape_1.b2ShapeType.e_unknown, 0);
                        this.m_shapeCount = 0;
                        this.m_shapes = shapes;
                        this.m_shapeCount = shapeCount;
                    }
                    Clone() {
                        // DEBUG: b2Assert(false);
                        throw new Error();
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
                        // DEBUG: b2Assert(false);
                        return 0;
                    }
                    /**
                     * Implement b2Shape.
                     */
                    RayCast(output, input, xf, childIndex) {
                        // DEBUG: b2Assert(false);
                        return false;
                    }
                    /**
                     * @see b2Shape::ComputeAABB
                     */
                    ComputeAABB(aabb, xf, childIndex) {
                        const s_subaabb = new b2Collision_1.b2AABB();
                        aabb.lowerBound.x = +b2Settings_1.b2_maxFloat;
                        aabb.lowerBound.y = +b2Settings_1.b2_maxFloat;
                        aabb.upperBound.x = -b2Settings_1.b2_maxFloat;
                        aabb.upperBound.y = -b2Settings_1.b2_maxFloat;
                        // DEBUG: b2Assert(childIndex === 0);
                        for (let i = 0; i < this.m_shapeCount; i++) {
                            const childCount = this.m_shapes[i].GetChildCount();
                            for (let j = 0; j < childCount; j++) {
                                const subaabb = s_subaabb;
                                this.m_shapes[i].ComputeAABB(subaabb, xf, j);
                                aabb.Combine1(subaabb);
                            }
                        }
                    }
                    /**
                     * @see b2Shape::ComputeMass
                     */
                    ComputeMass(massData, density) {
                        // DEBUG: b2Assert(false);
                    }
                    SetupDistanceProxy(proxy, index) {
                        // DEBUG: b2Assert(false);
                    }
                    ComputeSubmergedArea(normal, offset, xf, c) {
                        // DEBUG: b2Assert(false);
                        return 0;
                    }
                    Dump(log) {
                        // DEBUG: b2Assert(false);
                    }
                }
                b2ParticleSystem.CompositeShape = CompositeShape;
                class ReactiveFilter extends b2ParticleSystem.ConnectionFilter {
                    constructor(flagsBuffer) {
                        super();
                        this.m_flagsBuffer = flagsBuffer;
                    }
                    IsNecessary(index) {
                        if (!this.m_flagsBuffer.data) {
                            throw new Error();
                        }
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
                            const flags = this.m_system.GetFlagsBuffer();
                            if (flags[particleIndex] & b2Particle_1.b2ParticleFlag.b2_fixtureContactFilterParticle) {
                                return this.m_contactFilter.ShouldCollideFixtureParticle(fixture, this.m_system, particleIndex);
                            }
                        }
                        return true;
                    }
                    ReportFixtureAndParticle(fixture, childIndex, a) {
                        const s_n = b2ParticleSystem.UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n;
                        const s_rp = b2ParticleSystem.UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp;
                        if (!this.m_system.m_flagsBuffer.data) {
                            throw new Error();
                        }
                        if (!this.m_system.m_positionBuffer.data) {
                            throw new Error();
                        }
                        const ap = this.m_system.m_positionBuffer.data[a];
                        const n = s_n;
                        const d = fixture.ComputeDistance(ap, n, childIndex);
                        if (d < this.m_system.m_particleDiameter && this.ShouldCollideFixtureParticle(fixture, this.m_system, a)) {
                            const b = fixture.GetBody();
                            const bp = b.GetWorldCenter();
                            const bm = b.GetMass();
                            const bI = b.GetInertia() - bm * b.GetLocalCenter().LengthSquared();
                            const invBm = bm > 0 ? 1 / bm : 0;
                            const invBI = bI > 0 ? 1 / bI : 0;
                            const invAm = this.m_system.m_flagsBuffer.data[a] &
                                b2Particle_1.b2ParticleFlag.b2_wallParticle ? 0 : this.m_system.GetParticleInvMass();
                            ///b2Vec2 rp = ap - bp;
                            const rp = b2Math_1.b2Vec2.SubVV(ap, bp, s_rp);
                            const rpn = b2Math_1.b2Vec2.CrossVV(rp, n);
                            const invM = invAm + invBm + invBI * rpn * rpn;
                            ///b2ParticleBodyContact& contact = m_system.m_bodyContactBuffer.Append();
                            const contact = this.m_system.m_bodyContactBuffer.data[this.m_system.m_bodyContactBuffer.Append()];
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
                        const s_p1 = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_p1;
                        const s_output = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_output;
                        const s_input = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_input;
                        const s_p = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_p;
                        const s_v = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_v;
                        const s_f = b2ParticleSystem.SolveCollisionCallback.ReportFixtureAndParticle_s_f;
                        const body = fixture.GetBody();
                        if (!this.m_system.m_positionBuffer.data) {
                            throw new Error();
                        }
                        if (!this.m_system.m_velocityBuffer.data) {
                            throw new Error();
                        }
                        const ap = this.m_system.m_positionBuffer.data[a];
                        const av = this.m_system.m_velocityBuffer.data[a];
                        const output = s_output;
                        const input = s_input;
                        if (this.m_system.m_iterationIndex === 0) {
                            // Put 'ap' in the local space of the previous frame
                            ///b2Vec2 p1 = b2MulT(body.m_xf0, ap);
                            const p1 = b2Math_1.b2Transform.MulTXV(body.m_xf0, ap, s_p1);
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
                            const n = output.normal;
                            ///b2Vec2 p = (1 - output.fraction) * input.p1 + output.fraction * input.p2 + b2_linearSlop * n;
                            const p = s_p;
                            p.x = (1 - output.fraction) * input.p1.x + output.fraction * input.p2.x + b2Settings_1.b2_linearSlop * n.x;
                            p.y = (1 - output.fraction) * input.p1.y + output.fraction * input.p2.y + b2Settings_1.b2_linearSlop * n.y;
                            ///b2Vec2 v = m_step.inv_dt * (p - ap);
                            const v = s_v;
                            v.x = this.m_step.inv_dt * (p.x - ap.x);
                            v.y = this.m_step.inv_dt * (p.y - ap.y);
                            ///m_system.m_velocityBuffer.data[a] = v;
                            this.m_system.m_velocityBuffer.data[a].Copy(v);
                            ///b2Vec2 f = m_step.inv_dt * m_system.GetParticleMass() * (av - v);
                            const f = s_f;
                            f.x = this.m_step.inv_dt * this.m_system.GetParticleMass() * (av.x - v.x);
                            f.y = this.m_step.inv_dt * this.m_system.GetParticleMass() * (av.y - v.y);
                            this.m_system.ParticleApplyForce(a, f);
                        }
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZVN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL1BhcnRpY2xlL2IyUGFydGljbGVTeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7O0lBdUJILHVCQUEwQixLQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDeEQsTUFBTSxHQUFHLEdBQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQseUJBQTRCLENBQUksRUFBRSxDQUFJLElBQWEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRSxrQkFBcUIsS0FBVSxFQUFFLFFBQWdCLENBQUMsRUFBRSxNQUFjLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQStCLGVBQWU7UUFDcEksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFWixTQUFXLEVBQUUsZ0JBQWdCO1lBQzNCLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSx3QkFBd0I7Z0JBQ3RELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO2dCQUM3RixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQywyQkFBMkI7Z0JBQy9D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