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
    var b2Settings_1, b2Settings_2, b2Math_1, b2Draw_1, b2Collision_1, b2Shape_1, b2EdgeShape_1, b2TimeStep_1, b2WorldCallbacks_1, b2Particle_1, b2ParticleGroup_1, b2VoronoiDiagram_1, b2GrowableBuffer, b2FixtureParticleQueryCallback, b2ParticleContact, b2ParticleBodyContact, b2ParticlePair, b2ParticleTriad, b2ParticleSystemDef, b2ParticleSystem, b2ParticleSystem_UserOverridableBuffer, b2ParticleSystem_Proxy, b2ParticleSystem_InsideBoundsEnumerator, b2ParticleSystem_ParticleListNode, b2ParticleSystem_FixedSetAllocator, b2ParticleSystem_FixtureParticle, b2ParticleSystem_FixtureParticleSet, b2ParticleSystem_ParticlePair, b2ParticlePairSet, b2ParticleSystem_ConnectionFilter, b2ParticleSystem_DestroyParticlesInShapeCallback, b2ParticleSystem_JoinParticleGroupsFilter, b2ParticleSystem_CompositeShape, b2ParticleSystem_ReactiveFilter, b2ParticleSystem_UpdateBodyContactsCallback, b2ParticleSystem_SolveCollisionCallback;
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
    function std_lower_bound(array, first, last, val, cmp) {
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
    function std_upper_bound(array, first, last, val, cmp) {
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
                    this.m_handleIndexBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_flagsBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_positionBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_velocityBuffer = new b2ParticleSystem_UserOverridableBuffer();
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
                    this.m_colorBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_groupBuffer = [];
                    this.m_userDataBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    /**
                     * Stuck particle detection parameters and record keeping
                     */
                    this.m_stuckThreshold = 0;
                    this.m_lastBodyContactStepBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_bodyContactCountBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_consecutiveContactStepsBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    this.m_stuckParticleBuffer = new b2GrowableBuffer(() => 0);
                    this.m_proxyBuffer = new b2GrowableBuffer(() => new b2ParticleSystem_Proxy());
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
                    this.m_expirationTimeBuffer = new b2ParticleSystem_UserOverridableBuffer();
                    /**
                     * List of particle indices sorted by expiration time.
                     */
                    this.m_indexByExpirationTimeBuffer = new b2ParticleSystem_UserOverridableBuffer();
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
                    const callback = new b2ParticleSystem_DestroyParticlesInShapeCallback(this, shape, xf, callDestructionListener);
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
                    const filter = new b2ParticleSystem_ConnectionFilter();
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
                    const filter = new b2ParticleSystem_JoinParticleGroupsFilter(groupB.m_firstIndex);
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
                    const nodeBuffer = b2Settings_1.b2MakeArray(particleCount, (index) => new b2ParticleSystem_ParticleListNode());
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
                    if (buffer instanceof Float32Array) {
                        const array = [];
                        for (let i = 0; i < capacity; ++i) {
                            array[i] = new b2Math_1.b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_positionBuffer, buffer, capacity);
                }
                SetVelocityBuffer(buffer, capacity) {
                    if (buffer instanceof Float32Array) {
                        const array = [];
                        for (let i = 0; i < capacity; ++i) {
                            array[i] = new b2Math_1.b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_velocityBuffer, buffer, capacity);
                }
                SetColorBuffer(buffer, capacity) {
                    if (buffer instanceof Float32Array) {
                        const array = [];
                        for (let i = 0; i < capacity; ++i) {
                            array[i] = new b2Draw_1.b2Color(buffer.subarray(i * 4, i * 4 + 4));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_colorBuffer, buffer, capacity);
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
                    const firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.lowerBound.x, this.m_inverseDiameter * aabb.lowerBound.y), b2ParticleSystem_Proxy.CompareProxyTag);
                    const lastProxy = std_upper_bound(this.m_proxyBuffer.data, firstProxy, endProxy, b2ParticleSystem.computeTag(this.m_inverseDiameter * aabb.upperBound.x, this.m_inverseDiameter * aabb.upperBound.y), b2ParticleSystem_Proxy.CompareTagProxy);
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
                    const compositeShape = new b2ParticleSystem_CompositeShape(shapes, shapeCount);
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
                    const filter = new b2ParticleSystem_ReactiveFilter(this.m_flagsBuffer);
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
                    const firstProxy = std_lower_bound(this.m_proxyBuffer.data, beginProxy, endProxy, lowerTag, b2ParticleSystem_Proxy.CompareProxyTag);
                    ///const Proxy* lastProxy = std::upper_bound(firstProxy, endProxy, upperTag);
                    const lastProxy = std_upper_bound(this.m_proxyBuffer.data, beginProxy, endProxy, upperTag, b2ParticleSystem_Proxy.CompareTagProxy);
                    // DEBUG: b2Assert(beginProxy <= firstProxy);
                    // DEBUG: b2Assert(firstProxy <= lastProxy);
                    // DEBUG: b2Assert(lastProxy <= endProxy);
                    return new b2ParticleSystem_InsideBoundsEnumerator(this, lowerTag, upperTag, firstProxy, lastProxy);
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
                    std_sort(this.m_proxyBuffer.data, 0, this.m_proxyBuffer.count, b2ParticleSystem_Proxy.CompareProxyProxy);
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
                    const particlePairs = new b2ParticlePairSet(); // TODO: static
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
                    const fixtureSet = new b2ParticleSystem_FixtureParticleSet(); // TODO: static
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
                    const callback = new b2ParticleSystem_UpdateBodyContactsCallback(this, this.GetFixtureContactFilter());
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
                    const callback = new b2ParticleSystem_SolveCollisionCallback(this, step);
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
            b2ParticleSystem_UserOverridableBuffer = class b2ParticleSystem_UserOverridableBuffer {
                constructor() {
                    this.data = null;
                    this.userSuppliedCapacity = 0;
                }
            };
            exports_1("b2ParticleSystem_UserOverridableBuffer", b2ParticleSystem_UserOverridableBuffer);
            b2ParticleSystem_Proxy = class b2ParticleSystem_Proxy {
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
            };
            exports_1("b2ParticleSystem_Proxy", b2ParticleSystem_Proxy);
            b2ParticleSystem_InsideBoundsEnumerator = class b2ParticleSystem_InsideBoundsEnumerator {
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
                        // DEBUG: const yTag = (this.m_system.m_proxyBuffer.data[this.m_first].tag & b2ParticleSystem_yMask) >>> 0;
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
            };
            exports_1("b2ParticleSystem_InsideBoundsEnumerator", b2ParticleSystem_InsideBoundsEnumerator);
            b2ParticleSystem_ParticleListNode = class b2ParticleSystem_ParticleListNode {
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
            };
            exports_1("b2ParticleSystem_ParticleListNode", b2ParticleSystem_ParticleListNode);
            /**
             * @constructor
             */
            b2ParticleSystem_FixedSetAllocator = class b2ParticleSystem_FixedSetAllocator {
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
            };
            exports_1("b2ParticleSystem_FixedSetAllocator", b2ParticleSystem_FixedSetAllocator);
            b2ParticleSystem_FixtureParticle = class b2ParticleSystem_FixtureParticle {
                constructor(fixture, particle) {
                    this.second = b2Settings_1.b2_invalidParticleIndex;
                    this.first = fixture;
                    this.second = particle;
                }
            };
            exports_1("b2ParticleSystem_FixtureParticle", b2ParticleSystem_FixtureParticle);
            b2ParticleSystem_FixtureParticleSet = class b2ParticleSystem_FixtureParticleSet extends b2ParticleSystem_FixedSetAllocator {
                Initialize(bodyContactBuffer, flagsBuffer) {
                    // TODO
                }
                Find(pair) {
                    // TODO
                    return b2Settings_1.b2_invalidParticleIndex;
                }
            };
            exports_1("b2ParticleSystem_FixtureParticleSet", b2ParticleSystem_FixtureParticleSet);
            b2ParticleSystem_ParticlePair = class b2ParticleSystem_ParticlePair {
                constructor(particleA, particleB) {
                    this.first = b2Settings_1.b2_invalidParticleIndex;
                    this.second = b2Settings_1.b2_invalidParticleIndex;
                    this.first = particleA;
                    this.second = particleB;
                }
            };
            exports_1("b2ParticleSystem_ParticlePair", b2ParticleSystem_ParticlePair);
            b2ParticlePairSet = class b2ParticlePairSet extends b2ParticleSystem_FixedSetAllocator {
                Initialize(contactBuffer, flagsBuffer) {
                    // TODO
                }
                Find(pair) {
                    // TODO
                    return b2Settings_1.b2_invalidParticleIndex;
                }
            };
            exports_1("b2ParticlePairSet", b2ParticlePairSet);
            b2ParticleSystem_ConnectionFilter = class b2ParticleSystem_ConnectionFilter {
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
            };
            exports_1("b2ParticleSystem_ConnectionFilter", b2ParticleSystem_ConnectionFilter);
            b2ParticleSystem_DestroyParticlesInShapeCallback = class b2ParticleSystem_DestroyParticlesInShapeCallback extends b2WorldCallbacks_1.b2QueryCallback {
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
            };
            exports_1("b2ParticleSystem_DestroyParticlesInShapeCallback", b2ParticleSystem_DestroyParticlesInShapeCallback);
            b2ParticleSystem_JoinParticleGroupsFilter = class b2ParticleSystem_JoinParticleGroupsFilter extends b2ParticleSystem_ConnectionFilter {
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
            };
            exports_1("b2ParticleSystem_JoinParticleGroupsFilter", b2ParticleSystem_JoinParticleGroupsFilter);
            b2ParticleSystem_CompositeShape = class b2ParticleSystem_CompositeShape extends b2Shape_1.b2Shape {
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
            };
            exports_1("b2ParticleSystem_CompositeShape", b2ParticleSystem_CompositeShape);
            b2ParticleSystem_ReactiveFilter = class b2ParticleSystem_ReactiveFilter extends b2ParticleSystem_ConnectionFilter {
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
            };
            exports_1("b2ParticleSystem_ReactiveFilter", b2ParticleSystem_ReactiveFilter);
            b2ParticleSystem_UpdateBodyContactsCallback = class b2ParticleSystem_UpdateBodyContactsCallback extends b2FixtureParticleQueryCallback {
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
                    const s_n = b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n;
                    const s_rp = b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp;
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
            };
            b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n = new b2Math_1.b2Vec2();
            b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp = new b2Math_1.b2Vec2();
            exports_1("b2ParticleSystem_UpdateBodyContactsCallback", b2ParticleSystem_UpdateBodyContactsCallback);
            b2ParticleSystem_SolveCollisionCallback = class b2ParticleSystem_SolveCollisionCallback extends b2FixtureParticleQueryCallback {
                constructor(system, step) {
                    super(system); // base class constructor
                    this.m_step = step;
                }
                ReportFixtureAndParticle(fixture, childIndex, a) {
                    const s_p1 = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p1;
                    const s_output = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_output;
                    const s_input = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_input;
                    const s_p = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p;
                    const s_v = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_v;
                    const s_f = b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_f;
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
            };
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p1 = new b2Math_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_output = new b2Collision_1.b2RayCastOutput();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_input = new b2Collision_1.b2RayCastInput();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p = new b2Math_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_v = new b2Math_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_f = new b2Math_1.b2Vec2();
            exports_1("b2ParticleSystem_SolveCollisionCallback", b2ParticleSystem_SolveCollisionCallback);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZVN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUGFydGljbGVTeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7O0lBdUJILFNBQVMsYUFBYSxDQUFJLEtBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUN4RCxNQUFNLEdBQUcsR0FBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTLGVBQWUsQ0FBSSxDQUFJLEVBQUUsQ0FBSSxJQUFhLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEUsU0FBUyxRQUFRLENBQUksS0FBVSxFQUFFLFFBQWdCLENBQUMsRUFBRSxNQUFjLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQStCLGVBQWU7UUFDcEksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFWixTQUFXLEVBQUUsZ0JBQWdCO1lBQzNCLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSx3QkFBd0I7Z0JBQ3RELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO2dCQUM3RixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQywyQkFBMkI7Z0JBQy9D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