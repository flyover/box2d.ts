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
System.register(["../Common/b2Settings.js", "../Common/b2Math.js", "../Common/b2Draw.js", "../Collision/b2Collision.js", "../Collision/Shapes/b2Shape.js", "../Collision/Shapes/b2EdgeShape.js", "../Dynamics/b2TimeStep.js", "../Dynamics/b2WorldCallbacks.js", "./b2Particle.js", "./b2ParticleGroup.js", "./b2VoronoiDiagram.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Settings_js_2, b2Math_js_1, b2Draw_js_1, b2Collision_js_1, b2Shape_js_1, b2EdgeShape_js_1, b2TimeStep_js_1, b2WorldCallbacks_js_1, b2Particle_js_1, b2ParticleGroup_js_1, b2VoronoiDiagram_js_1, b2GrowableBuffer, b2FixtureParticleQueryCallback, b2ParticleContact, b2ParticleBodyContact, b2ParticlePair, b2ParticleTriad, b2ParticleSystemDef, b2ParticleSystem, b2ParticleSystem_UserOverridableBuffer, b2ParticleSystem_Proxy, b2ParticleSystem_InsideBoundsEnumerator, b2ParticleSystem_ParticleListNode, b2ParticleSystem_FixedSetAllocator, b2ParticleSystem_FixtureParticle, b2ParticleSystem_FixtureParticleSet, b2ParticleSystem_ParticlePair, b2ParticlePairSet, b2ParticleSystem_ConnectionFilter, b2ParticleSystem_DestroyParticlesInShapeCallback, b2ParticleSystem_JoinParticleGroupsFilter, b2ParticleSystem_CompositeShape, b2ParticleSystem_ReactiveFilter, b2ParticleSystem_UpdateBodyContactsCallback, b2ParticleSystem_SolveCollisionCallback;
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
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
                b2Settings_js_2 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Draw_js_1_1) {
                b2Draw_js_1 = b2Draw_js_1_1;
            },
            function (b2Collision_js_1_1) {
                b2Collision_js_1 = b2Collision_js_1_1;
            },
            function (b2Shape_js_1_1) {
                b2Shape_js_1 = b2Shape_js_1_1;
            },
            function (b2EdgeShape_js_1_1) {
                b2EdgeShape_js_1 = b2EdgeShape_js_1_1;
            },
            function (b2TimeStep_js_1_1) {
                b2TimeStep_js_1 = b2TimeStep_js_1_1;
            },
            function (b2WorldCallbacks_js_1_1) {
                b2WorldCallbacks_js_1 = b2WorldCallbacks_js_1_1;
            },
            function (b2Particle_js_1_1) {
                b2Particle_js_1 = b2Particle_js_1_1;
            },
            function (b2ParticleGroup_js_1_1) {
                b2ParticleGroup_js_1 = b2ParticleGroup_js_1_1;
            },
            function (b2VoronoiDiagram_js_1_1) {
                b2VoronoiDiagram_js_1 = b2VoronoiDiagram_js_1_1;
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
                    const newCapacity = this.capacity ? 2 * this.capacity : b2Settings_js_1.b2_minParticleSystemBufferCapacity;
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
            b2FixtureParticleQueryCallback = class b2FixtureParticleQueryCallback extends b2WorldCallbacks_js_1.b2QueryCallback {
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
                    this.normal = new b2Math_js_1.b2Vec2();
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
                    return this.indexA === rhs.indexA && this.indexB === rhs.indexB && this.flags === rhs.flags && b2Math_js_1.b2Abs(this.weight - rhs.weight) < MAX_WEIGHT_DIFF && b2Math_js_1.b2Vec2.DistanceSquaredVV(this.normal, rhs.normal) < MAX_NORMAL_DIFF_SQ;
                }
            };
            exports_1("b2ParticleContact", b2ParticleContact);
            b2ParticleBodyContact = class b2ParticleBodyContact {
                constructor() {
                    this.index = 0; // Index of the particle making contact.
                    this.weight = 0.0; // Weight of the contact. A value between 0.0f and 1.0f.
                    this.normal = new b2Math_js_1.b2Vec2(); // The normalized direction from the particle to the body.
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
                    this.pa = new b2Math_js_1.b2Vec2(0.0, 0.0); // Values used for calculation.
                    this.pb = new b2Math_js_1.b2Vec2(0.0, 0.0);
                    this.pc = new b2Math_js_1.b2Vec2(0.0, 0.0);
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
                    this.UpdateBodyContacts_callback = null;
                    this.SolveCollision_callback = null;
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
                        const capacity = this.m_count ? 2 * this.m_count : b2Settings_js_1.b2_minParticleSystemBufferCapacity;
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
                            return b2Settings_js_1.b2_invalidParticleIndex;
                        }
                    }
                    const index = this.m_count++;
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
                    this.m_positionBuffer.data[index] = (this.m_positionBuffer.data[index] || new b2Math_js_1.b2Vec2()).Copy(b2Settings_js_1.b2Maybe(def.position, b2Math_js_1.b2Vec2.ZERO));
                    this.m_velocityBuffer.data[index] = (this.m_velocityBuffer.data[index] || new b2Math_js_1.b2Vec2()).Copy(b2Settings_js_1.b2Maybe(def.velocity, b2Math_js_1.b2Vec2.ZERO));
                    this.m_weightBuffer[index] = 0;
                    this.m_forceBuffer[index] = (this.m_forceBuffer[index] || new b2Math_js_1.b2Vec2()).SetZero();
                    if (this.m_staticPressureBuffer) {
                        this.m_staticPressureBuffer[index] = 0;
                    }
                    if (this.m_depthBuffer) {
                        this.m_depthBuffer[index] = 0;
                    }
                    const color = new b2Draw_js_1.b2Color().Copy(b2Settings_js_1.b2Maybe(def.color, b2Draw_js_1.b2Color.ZERO));
                    if (this.m_colorBuffer.data || !color.IsZero()) {
                        this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
                        this.m_colorBuffer.data[index] = (this.m_colorBuffer.data[index] || new b2Draw_js_1.b2Color()).Copy(color);
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
                    const lifetime = b2Settings_js_1.b2Maybe(def.lifetime, 0.0);
                    const finiteLifetime = lifetime > 0.0;
                    if (this.m_expirationTimeBuffer.data || finiteLifetime) {
                        this.SetParticleLifetime(index, finiteLifetime ? lifetime :
                            this.ExpirationTimeToLifetime(-this.GetQuantizedTimeElapsed()));
                        // Add a reference to the newly added particle to the end of the
                        // queue.
                        this.m_indexByExpirationTimeBuffer.data[index] = index;
                    }
                    proxy.index = index;
                    const group = b2Settings_js_1.b2Maybe(def.group, null);
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
                    this.SetParticleFlags(index, b2Settings_js_1.b2Maybe(def.flags, 0));
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
                    handle = new b2Particle_js_1.b2ParticleHandle();
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
                    let flags = b2Particle_js_1.b2ParticleFlag.b2_zombieParticle;
                    if (callDestructionListener) {
                        flags |= b2Particle_js_1.b2ParticleFlag.b2_destructionListenerParticle;
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
                    transform.SetPositionAngle(b2Settings_js_1.b2Maybe(groupDef.position, b2Math_js_1.b2Vec2.ZERO), b2Settings_js_1.b2Maybe(groupDef.angle, 0));
                    const firstIndex = this.m_count;
                    if (groupDef.shape) {
                        this.CreateParticlesWithShapeForGroup(groupDef.shape, groupDef, transform);
                    }
                    if (groupDef.shapes) {
                        this.CreateParticlesWithShapesForGroup(groupDef.shapes, b2Settings_js_1.b2Maybe(groupDef.shapeCount, groupDef.shapes.length), groupDef, transform);
                    }
                    if (groupDef.positionData) {
                        const count = b2Settings_js_1.b2Maybe(groupDef.particleCount, groupDef.positionData.length);
                        for (let i = 0; i < count; i++) {
                            const p = groupDef.positionData[i];
                            this.CreateParticleForGroup(groupDef, transform, p);
                        }
                    }
                    const lastIndex = this.m_count;
                    let group = new b2ParticleGroup_js_1.b2ParticleGroup(this);
                    group.m_firstIndex = firstIndex;
                    group.m_lastIndex = lastIndex;
                    group.m_strength = b2Settings_js_1.b2Maybe(groupDef.strength, 1);
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
                    this.SetGroupFlags(group, b2Settings_js_1.b2Maybe(groupDef.groupFlags, 0));
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
                    const nodeBuffer = b2Settings_js_1.b2MakeArray(particleCount, (index) => new b2ParticleSystem_ParticleListNode());
                    b2ParticleSystem.InitializeParticleLists(group, nodeBuffer);
                    this.MergeParticleListsInContact(group, nodeBuffer);
                    const survivingList = b2ParticleSystem.FindLongestParticleList(group, nodeBuffer);
                    this.MergeZombieParticleListNodes(group, nodeBuffer, survivingList);
                    this.CreateParticleGroupsFromParticleList(group, nodeBuffer, survivingList);
                    this.UpdatePairsAndTriadsWithParticleList(group, nodeBuffer);
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
                    const oldFlags = this.m_flagsBuffer.data[index];
                    if (oldFlags & ~newFlags) {
                        // If any flags might be removed
                        this.m_needsUpdateAllParticleFlags = true;
                    }
                    if (~this.m_allParticleFlags & newFlags) {
                        // If any flags were added
                        if (newFlags & b2Particle_js_1.b2ParticleFlag.b2_tensileParticle) {
                            this.m_accumulation2Buffer = this.RequestBuffer(this.m_accumulation2Buffer);
                        }
                        if (newFlags & b2Particle_js_1.b2ParticleFlag.b2_colorMixingParticle) {
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
                SetFlagsBuffer(buffer) {
                    this.SetUserOverridableBuffer(this.m_flagsBuffer, buffer);
                }
                SetPositionBuffer(buffer) {
                    if (buffer instanceof Float32Array) {
                        if (buffer.length % 2 !== 0) {
                            throw new Error();
                        }
                        const count = buffer.length / 2;
                        const array = new Array(count);
                        for (let i = 0; i < count; ++i) {
                            array[i] = new b2Math_js_1.b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_positionBuffer, buffer);
                }
                SetVelocityBuffer(buffer) {
                    if (buffer instanceof Float32Array) {
                        if (buffer.length % 2 !== 0) {
                            throw new Error();
                        }
                        const count = buffer.length / 2;
                        const array = new Array(count);
                        for (let i = 0; i < count; ++i) {
                            array[i] = new b2Math_js_1.b2Vec2(buffer.subarray(i * 2, i * 2 + 2));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_velocityBuffer, buffer);
                }
                SetColorBuffer(buffer) {
                    if (buffer instanceof Float32Array) {
                        if (buffer.length % 4 !== 0) {
                            throw new Error();
                        }
                        const count = buffer.length / 4;
                        const array = new Array(count);
                        for (let i = 0; i < count; ++i) {
                            array[i] = new b2Draw_js_1.b2Color(buffer.subarray(i * 4, i * 4 + 4));
                        }
                        buffer = array;
                    }
                    this.SetUserOverridableBuffer(this.m_colorBuffer, buffer);
                }
                SetUserDataBuffer(buffer) {
                    this.SetUserOverridableBuffer(this.m_userDataBuffer, buffer);
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
                    const s_v = b2ParticleSystem.ComputeCollisionEnergy_s_v;
                    const vel_data = this.m_velocityBuffer.data;
                    let sum_v2 = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const n = contact.normal;
                        ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                        const v = b2Math_js_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
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
                    const vel_data = this.m_velocityBuffer.data;
                    const numParticles = (lastIndex - firstIndex);
                    const totalMass = numParticles * this.GetParticleMass();
                    ///const b2Vec2 velocityDelta = impulse / totalMass;
                    const velocityDelta = new b2Math_js_1.b2Vec2().Copy(impulse).SelfMul(1 / totalMass);
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
                    // DEBUG: let flags = 0;
                    // DEBUG: for (let i = firstIndex; i < lastIndex; i++) {
                    // DEBUG:   flags |= this.m_flagsBuffer.data[i];
                    // DEBUG: }
                    // DEBUG: b2Assert(this.ForceCanBeApplied(flags));
                    // Early out if force does nothing (optimization).
                    ///const b2Vec2 distributedForce = force / (float32)(lastIndex - firstIndex);
                    const distributedForce = new b2Math_js_1.b2Vec2().Copy(force).SelfMul(1 / (lastIndex - firstIndex));
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
                QueryPointAABB(callback, point, slop = b2Settings_js_1.b2_linearSlop) {
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
                    const pos_data = this.m_positionBuffer.data;
                    const aabb = s_aabb;
                    b2Math_js_1.b2Vec2.MinV(point1, point2, aabb.lowerBound);
                    b2Math_js_1.b2Vec2.MaxV(point1, point2, aabb.upperBound);
                    let fraction = 1;
                    // solving the following equation:
                    // ((1-t)*point1+t*point2-position)^2=diameter^2
                    // where t is a potential fraction
                    ///b2Vec2 v = point2 - point1;
                    const v = b2Math_js_1.b2Vec2.SubVV(point2, point1, s_v);
                    const v2 = b2Math_js_1.b2Vec2.DotVV(v, v);
                    const enumerator = this.GetInsideBoundsEnumerator(aabb);
                    let i;
                    while ((i = enumerator.GetNext()) >= 0) {
                        ///b2Vec2 p = point1 - m_positionBuffer.data[i];
                        const p = b2Math_js_1.b2Vec2.SubVV(point1, pos_data[i], s_p);
                        const pv = b2Math_js_1.b2Vec2.DotVV(p, v);
                        const p2 = b2Math_js_1.b2Vec2.DotVV(p, p);
                        const determinant = pv * pv - v2 * (p2 - this.m_squaredDiameter);
                        if (determinant >= 0) {
                            const sqrtDeterminant = b2Math_js_1.b2Sqrt(determinant);
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
                            const n = b2Math_js_1.b2Vec2.AddVMulSV(p, t, v, s_n);
                            n.Normalize();
                            ///float32 f = callback.ReportParticle(this, i, point1 + t * v, n, t);
                            const f = callback.ReportParticle(this, i, b2Math_js_1.b2Vec2.AddVMulSV(point1, t, v, s_point), n, t);
                            fraction = b2Math_js_1.b2Min(fraction, f);
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
                    aabb.lowerBound.x = +b2Settings_js_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_js_1.b2_maxFloat;
                    const pos_data = this.m_positionBuffer.data;
                    for (let i = 0; i < particleCount; i++) {
                        const p = pos_data[i];
                        b2Math_js_1.b2Vec2.MinV(aabb.lowerBound, p, aabb.lowerBound);
                        b2Math_js_1.b2Vec2.MaxV(aabb.upperBound, p, aabb.upperBound);
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
                            this.ReallocateInternalAllocatedBuffers(b2Settings_js_1.b2_minParticleSystemBufferCapacity);
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
                    const particleDef = new b2Particle_js_1.b2ParticleDef();
                    particleDef.flags = b2Settings_js_1.b2Maybe(groupDef.flags, 0);
                    ///particleDef.position = b2Mul(xf, p);
                    b2Math_js_1.b2Transform.MulXV(xf, p, particleDef.position);
                    ///particleDef.velocity =
                    ///  groupDef.linearVelocity +
                    ///  b2Cross(groupDef.angularVelocity,
                    ///      particleDef.position - groupDef.position);
                    b2Math_js_1.b2Vec2.AddVV(b2Settings_js_1.b2Maybe(groupDef.linearVelocity, b2Math_js_1.b2Vec2.ZERO), b2Math_js_1.b2Vec2.CrossSV(b2Settings_js_1.b2Maybe(groupDef.angularVelocity, 0), b2Math_js_1.b2Vec2.SubVV(particleDef.position, b2Settings_js_1.b2Maybe(groupDef.position, b2Math_js_1.b2Vec2.ZERO), b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.s_t0), particleDef.velocity);
                    particleDef.color.Copy(b2Settings_js_1.b2Maybe(groupDef.color, b2Draw_js_1.b2Color.ZERO));
                    particleDef.lifetime = b2Settings_js_1.b2Maybe(groupDef.lifetime, 0);
                    particleDef.userData = groupDef.userData;
                    this.CreateParticle(particleDef);
                }
                CreateParticlesStrokeShapeForGroup(shape, groupDef, xf) {
                    const s_edge = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_edge;
                    const s_d = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_d;
                    const s_p = b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_p;
                    let stride = b2Settings_js_1.b2Maybe(groupDef.stride, 0);
                    if (stride === 0) {
                        stride = this.GetParticleStride();
                    }
                    let positionOnEdge = 0;
                    const childCount = shape.GetChildCount();
                    for (let childIndex = 0; childIndex < childCount; childIndex++) {
                        let edge = null;
                        if (shape.GetType() === b2Shape_js_1.b2ShapeType.e_edgeShape) {
                            edge = shape;
                        }
                        else {
                            // DEBUG: b2Assert(shape.GetType() === b2ShapeType.e_chainShape);
                            edge = s_edge;
                            shape.GetChildEdge(edge, childIndex);
                        }
                        const d = b2Math_js_1.b2Vec2.SubVV(edge.m_vertex2, edge.m_vertex1, s_d);
                        const edgeLength = d.Length();
                        while (positionOnEdge < edgeLength) {
                            ///b2Vec2 p = edge.m_vertex1 + positionOnEdge / edgeLength * d;
                            const p = b2Math_js_1.b2Vec2.AddVMulSV(edge.m_vertex1, positionOnEdge / edgeLength, d, s_p);
                            this.CreateParticleForGroup(groupDef, xf, p);
                            positionOnEdge += stride;
                        }
                        positionOnEdge -= edgeLength;
                    }
                }
                CreateParticlesFillShapeForGroup(shape, groupDef, xf) {
                    const s_aabb = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb;
                    const s_p = b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p;
                    let stride = b2Settings_js_1.b2Maybe(groupDef.stride, 0);
                    if (stride === 0) {
                        stride = this.GetParticleStride();
                    }
                    ///b2Transform identity;
                    /// identity.SetIdentity();
                    const identity = b2Math_js_1.b2Transform.IDENTITY;
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
                        case b2Shape_js_1.b2ShapeType.e_edgeShape:
                        case b2Shape_js_1.b2ShapeType.e_chainShape:
                            this.CreateParticlesStrokeShapeForGroup(shape, groupDef, xf);
                            break;
                        case b2Shape_js_1.b2ShapeType.e_polygonShape:
                        case b2Shape_js_1.b2ShapeType.e_circleShape:
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
                    const def = new b2Particle_js_1.b2ParticleDef();
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
                    return ((flags & (b2Particle_js_1.b2ParticleFlag.b2_wallParticle | b2Particle_js_1.b2ParticleFlag.b2_springParticle | b2Particle_js_1.b2ParticleFlag.b2_elasticParticle)) !== 0) ||
                        ((group !== null) && ((group.GetGroupFlags() & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0));
                }
                UpdatePairsAndTriads(firstIndex, lastIndex, filter) {
                    const s_dab = b2ParticleSystem.UpdatePairsAndTriads_s_dab;
                    const s_dbc = b2ParticleSystem.UpdatePairsAndTriads_s_dbc;
                    const s_dca = b2ParticleSystem.UpdatePairsAndTriads_s_dca;
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
                                !((af | bf) & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle) &&
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
                                pair.strength = b2Math_js_1.b2Min(groupA ? groupA.m_strength : 1, groupB ? groupB.m_strength : 1);
                                ///pair.distance = b2Distance(pos_data[a], pos_data[b]); // TODO: this was wrong!
                                pair.distance = b2Math_js_1.b2Vec2.DistanceVV(pos_data[a], pos_data[b]);
                            }
                            ///std::stable_sort(m_pairBuffer.Begin(), m_pairBuffer.End(), ComparePairIndices);
                            std_stable_sort(this.m_pairBuffer.data, 0, this.m_pairBuffer.count, b2ParticleSystem.ComparePairIndices);
                            ///m_pairBuffer.Unique(MatchPairIndices);
                            this.m_pairBuffer.Unique(b2ParticleSystem.MatchPairIndices);
                        }
                    }
                    if (particleFlags & b2ParticleSystem.k_triadFlags) {
                        const diagram = new b2VoronoiDiagram_js_1.b2VoronoiDiagram(lastIndex - firstIndex);
                        ///let necessary_count = 0;
                        for (let i = firstIndex; i < lastIndex; i++) {
                            const flags = this.m_flagsBuffer.data[i];
                            const group = this.m_groupBuffer[i];
                            if (!(flags & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle) &&
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
                            const af = system.m_flagsBuffer.data[a];
                            const bf = system.m_flagsBuffer.data[b];
                            const cf = system.m_flagsBuffer.data[c];
                            if (((af | bf | cf) & b2ParticleSystem.k_triadFlags) &&
                                filter.ShouldCreateTriad(a, b, c)) {
                                const pa = pos_data[a];
                                const pb = pos_data[b];
                                const pc = pos_data[c];
                                const dab = b2Math_js_1.b2Vec2.SubVV(pa, pb, s_dab);
                                const dbc = b2Math_js_1.b2Vec2.SubVV(pb, pc, s_dbc);
                                const dca = b2Math_js_1.b2Vec2.SubVV(pc, pa, s_dca);
                                const maxDistanceSquared = b2Settings_js_1.b2_maxTriadDistanceSquared * system.m_squaredDiameter;
                                if (b2Math_js_1.b2Vec2.DotVV(dab, dab) > maxDistanceSquared ||
                                    b2Math_js_1.b2Vec2.DotVV(dbc, dbc) > maxDistanceSquared ||
                                    b2Math_js_1.b2Vec2.DotVV(dca, dca) > maxDistanceSquared) {
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
                                triad.strength = b2Math_js_1.b2Min(b2Math_js_1.b2Min(groupA ? groupA.m_strength : 1, groupB ? groupB.m_strength : 1), groupC ? groupC.m_strength : 1);
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
                                triad.ka = -b2Math_js_1.b2Vec2.DotVV(dca, dab);
                                triad.kb = -b2Math_js_1.b2Vec2.DotVV(dab, dbc);
                                triad.kc = -b2Math_js_1.b2Vec2.DotVV(dbc, dca);
                                triad.s = b2Math_js_1.b2Vec2.CrossVV(pa, pb) + b2Math_js_1.b2Vec2.CrossVV(pb, pc) + b2Math_js_1.b2Vec2.CrossVV(pc, pa);
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
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_flagsBuffer.data[i] &= ~b2Particle_js_1.b2ParticleFlag.b2_reactiveParticle;
                    }
                    this.m_allParticleFlags &= ~b2Particle_js_1.b2ParticleFlag.b2_reactiveParticle;
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
                    const particleCount = group.GetParticleCount();
                    for (let i = 0; i < particleCount; i++) {
                        const node = nodeBuffer[i];
                        if (node !== survivingList &&
                            (this.m_flagsBuffer.data[node.index] & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle)) {
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
                    const particleCount = group.GetParticleCount();
                    const def = new b2ParticleGroup_js_1.b2ParticleGroupDef();
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
                            this.m_flagsBuffer.data[oldIndex] |= b2Particle_js_1.b2ParticleFlag.b2_zombieParticle;
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
                    const contactGroups = []; // TODO: static
                    let contactGroupsCount = 0;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        const a = contact.indexA;
                        const b = contact.indexB;
                        const groupA = this.m_groupBuffer[a];
                        const groupB = this.m_groupBuffer[b];
                        if (groupA && groupA === groupB &&
                            (groupA.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth)) {
                            contactGroups[contactGroupsCount++] = contact;
                        }
                    }
                    const groupsToUpdate = []; // TODO: static
                    let groupsToUpdateCount = 0;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        if (group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
                            groupsToUpdate[groupsToUpdateCount++] = group;
                            this.SetGroupFlags(group, group.m_groupFlags &
                                ~b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
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
                            this.m_depthBuffer[i] = w < 0.8 ? 0 : b2Settings_js_1.b2_maxFloat;
                        }
                    }
                    // The number of iterations is equal to particle number from the deepest
                    // particle to the nearest surface particle, and in general it is smaller
                    // than sqrt of total particle number.
                    ///int32 iterationCount = (int32)b2Sqrt((float)m_count);
                    const iterationCount = b2Math_js_1.b2Sqrt(this.m_count) >> 0;
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
                            if (this.m_depthBuffer[i] < b2Settings_js_1.b2_maxFloat) {
                                this.m_depthBuffer[i] *= this.m_particleDiameter;
                            }
                            else {
                                this.m_depthBuffer[i] = 0;
                            }
                        }
                    }
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
                    // DEBUG: b2Assert(contacts === this.m_contactBuffer);
                    const flags_data = this.m_flagsBuffer.data;
                    const pos_data = this.m_positionBuffer.data;
                    ///b2Vec2 d = m_positionBuffer.data[b] - m_positionBuffer.data[a];
                    const d = b2Math_js_1.b2Vec2.SubVV(pos_data[b], pos_data[a], b2ParticleSystem.AddContact_s_d);
                    const distBtParticlesSq = b2Math_js_1.b2Vec2.DotVV(d, d);
                    if (0 < distBtParticlesSq && distBtParticlesSq < this.m_squaredDiameter) {
                        let invD = b2Math_js_1.b2InvSqrt(distBtParticlesSq);
                        ///b2ParticleContact& contact = contacts.Append();
                        const contact = this.m_contactBuffer.data[this.m_contactBuffer.Append()];
                        contact.indexA = a;
                        contact.indexB = b;
                        contact.flags = flags_data[a] | flags_data[b];
                        contact.weight = 1 - distBtParticlesSq * invD * this.m_inverseDiameter;
                        contact.normal.x = invD * d.x;
                        contact.normal.y = invD * d.y;
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
                        return ((contact.flags & b2Particle_js_1.b2ParticleFlag.b2_particleContactFilterParticle) !== 0) && !contactFilter.ShouldCollideParticleParticle(system, contact.indexA, contact.indexB);
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
                    return (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle) === b2Particle_js_1.b2ParticleFlag.b2_zombieParticle;
                }
                UpdateContacts(exceptZombie) {
                    this.UpdateProxies(this.m_proxyBuffer);
                    this.SortProxies(this.m_proxyBuffer);
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
                    const fixtureSet = new b2ParticleSystem_FixtureParticleSet(); // TODO: static
                    this.NotifyBodyContactListenerPreContact(fixtureSet);
                    if (this.m_stuckThreshold > 0) {
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
                    if (this.UpdateBodyContacts_callback === null) {
                        this.UpdateBodyContacts_callback = new b2ParticleSystem_UpdateBodyContactsCallback(this);
                    }
                    const callback = this.UpdateBodyContacts_callback;
                    callback.m_contactFilter = this.GetFixtureContactFilter();
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
                    if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle) {
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
                        if (this.m_allGroupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth) {
                            this.ComputeDepth();
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_reactiveParticle) {
                            this.UpdatePairsAndTriadsWithReactiveParticles();
                        }
                        if (this.m_hasForce) {
                            this.SolveForce(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_viscousParticle) {
                            this.SolveViscous();
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_repulsiveParticle) {
                            this.SolveRepulsive(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_powderParticle) {
                            this.SolvePowder(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_tensileParticle) {
                            this.SolveTensile(subStep);
                        }
                        if (this.m_allGroupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                            this.SolveSolid(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_colorMixingParticle) {
                            this.SolveColorMixing();
                        }
                        this.SolveGravity(subStep);
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle) {
                            this.SolveStaticPressure(subStep);
                        }
                        this.SolvePressure(subStep);
                        this.SolveDamping(subStep);
                        if (this.m_allParticleFlags & b2ParticleSystem.k_extraDampingFlags) {
                            this.SolveExtraDamping();
                        }
                        // SolveElastic and SolveSpring refer the current velocities for
                        // numerical stability, they should be called as late as possible.
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_elasticParticle) {
                            this.SolveElastic(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_springParticle) {
                            this.SolveSpring(subStep);
                        }
                        this.LimitVelocity(subStep);
                        if (this.m_allGroupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            this.SolveRigidDamping();
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_barrierParticle) {
                            this.SolveBarrier(subStep);
                        }
                        // SolveCollision, SolveRigid and SolveWall should be called after
                        // other force functions because they may require particles to have
                        // specific velocities.
                        this.SolveCollision(subStep);
                        if (this.m_allGroupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            this.SolveRigid(subStep);
                        }
                        if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_wallParticle) {
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
                    const s_aabb = b2ParticleSystem.SolveCollision_s_aabb;
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // This function detects particles which are crossing boundary of bodies
                    // and modifies velocities of them so that they will move just in front of
                    // boundary. This function function also applies the reaction force to
                    // bodies as precisely as the numerical stability is kept.
                    const aabb = s_aabb;
                    aabb.lowerBound.x = +b2Settings_js_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_js_1.b2_maxFloat;
                    for (let i = 0; i < this.m_count; i++) {
                        const v = vel_data[i];
                        const p1 = pos_data[i];
                        ///let p2 = p1 + step.dt * v;
                        const p2_x = p1.x + step.dt * v.x;
                        const p2_y = p1.y + step.dt * v.y;
                        ///aabb.lowerBound = b2Min(aabb.lowerBound, b2Min(p1, p2));
                        aabb.lowerBound.x = b2Math_js_1.b2Min(aabb.lowerBound.x, b2Math_js_1.b2Min(p1.x, p2_x));
                        aabb.lowerBound.y = b2Math_js_1.b2Min(aabb.lowerBound.y, b2Math_js_1.b2Min(p1.y, p2_y));
                        ///aabb.upperBound = b2Max(aabb.upperBound, b2Max(p1, p2));
                        aabb.upperBound.x = b2Math_js_1.b2Max(aabb.upperBound.x, b2Math_js_1.b2Max(p1.x, p2_x));
                        aabb.upperBound.y = b2Math_js_1.b2Max(aabb.upperBound.y, b2Math_js_1.b2Max(p1.y, p2_y));
                    }
                    if (this.SolveCollision_callback === null) {
                        this.SolveCollision_callback = new b2ParticleSystem_SolveCollisionCallback(this, step);
                    }
                    const callback = this.SolveCollision_callback;
                    callback.m_step = step;
                    this.m_world.QueryAABB(callback, aabb);
                }
                LimitVelocity(step) {
                    const vel_data = this.m_velocityBuffer.data;
                    const criticalVelocitySquared = this.GetCriticalVelocitySquared(step);
                    for (let i = 0; i < this.m_count; i++) {
                        const v = vel_data[i];
                        const v2 = b2Math_js_1.b2Vec2.DotVV(v, v);
                        if (v2 > criticalVelocitySquared) {
                            ///v *= b2Sqrt(criticalVelocitySquared / v2);
                            v.SelfMul(b2Math_js_1.b2Sqrt(criticalVelocitySquared / v2));
                        }
                    }
                }
                SolveGravity(step) {
                    const s_gravity = b2ParticleSystem.SolveGravity_s_gravity;
                    const vel_data = this.m_velocityBuffer.data;
                    ///b2Vec2 gravity = step.dt * m_def.gravityScale * m_world.GetGravity();
                    const gravity = b2Math_js_1.b2Vec2.MulSV(step.dt * this.m_def.gravityScale, this.m_world.GetGravity(), s_gravity);
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
                    const tmax = b2Settings_js_1.b2_barrierCollisionTime * step.dt;
                    const mass = this.GetParticleMass();
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_js_1.b2ParticleFlag.b2_barrierParticle) {
                            const a = pair.indexA;
                            const b = pair.indexB;
                            const pa = pos_data[a];
                            const pb = pos_data[b];
                            /// b2AABB aabb;
                            const aabb = s_aabb;
                            ///aabb.lowerBound = b2Min(pa, pb);
                            b2Math_js_1.b2Vec2.MinV(pa, pb, aabb.lowerBound);
                            ///aabb.upperBound = b2Max(pa, pb);
                            b2Math_js_1.b2Vec2.MaxV(pa, pb, aabb.upperBound);
                            const aGroup = this.m_groupBuffer[a];
                            const bGroup = this.m_groupBuffer[b];
                            ///b2Vec2 va = GetLinearVelocity(aGroup, a, pa);
                            const va = this.GetLinearVelocity(aGroup, a, pa, s_va);
                            ///b2Vec2 vb = GetLinearVelocity(bGroup, b, pb);
                            const vb = this.GetLinearVelocity(bGroup, b, pb, s_vb);
                            ///b2Vec2 pba = pb - pa;
                            const pba = b2Math_js_1.b2Vec2.SubVV(pb, pa, s_pba);
                            ///b2Vec2 vba = vb - va;
                            const vba = b2Math_js_1.b2Vec2.SubVV(vb, va, s_vba);
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
                                    const pca = b2Math_js_1.b2Vec2.SubVV(pc, pa, s_pca);
                                    ///b2Vec2 vca = vc - va;
                                    const vca = b2Math_js_1.b2Vec2.SubVV(vc, va, s_vca);
                                    const e2 = b2Math_js_1.b2Vec2.CrossVV(vba, vca);
                                    const e1 = b2Math_js_1.b2Vec2.CrossVV(pba, vca) - b2Math_js_1.b2Vec2.CrossVV(pca, vba);
                                    const e0 = b2Math_js_1.b2Vec2.CrossVV(pba, pca);
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
                                        b2Math_js_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                        ///qca = pca + t * vca;
                                        b2Math_js_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                        s = b2Math_js_1.b2Vec2.DotVV(qba, qca) / b2Math_js_1.b2Vec2.DotVV(qba, qba);
                                        if (!(s >= 0 && s <= 1)) {
                                            continue;
                                        }
                                    }
                                    else {
                                        const det = e1 * e1 - 4 * e0 * e2;
                                        if (det < 0) {
                                            continue;
                                        }
                                        const sqrtDet = b2Math_js_1.b2Sqrt(det);
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
                                        b2Math_js_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                        ///qca = pca + t * vca;
                                        b2Math_js_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                        ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                                        s = b2Math_js_1.b2Vec2.DotVV(qba, qca) / b2Math_js_1.b2Vec2.DotVV(qba, qba);
                                        if (!(t >= 0 && t < tmax && s >= 0 && s <= 1)) {
                                            t = t2;
                                            if (!(t >= 0 && t < tmax)) {
                                                continue;
                                            }
                                            ///qba = pba + t * vba;
                                            b2Math_js_1.b2Vec2.AddVMulSV(pba, t, vba, qba);
                                            ///qca = pca + t * vca;
                                            b2Math_js_1.b2Vec2.AddVMulSV(pca, t, vca, qca);
                                            ///s = b2Dot(qba, qca) / b2Dot(qba, qba);
                                            s = b2Math_js_1.b2Vec2.DotVV(qba, qca) / b2Math_js_1.b2Vec2.DotVV(qba, qba);
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
                                    const f = b2Math_js_1.b2Vec2.MulSV(mass, dv, s_f);
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
                                            cGroup.m_angularVelocity += b2Math_js_1.b2Vec2.CrossVV(b2Math_js_1.b2Vec2.SubVV(pc, cGroup.GetCenter(), b2Math_js_1.b2Vec2.s_t0), f) / inertia;
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
                    const criticalPressure = this.GetCriticalPressure(step);
                    const pressurePerWeight = this.m_def.staticPressureStrength * criticalPressure;
                    const maxPressure = b2Settings_js_2.b2_maxParticlePressure * criticalPressure;
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
                            if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle) {
                                const a = contact.indexA;
                                const b = contact.indexB;
                                const w = contact.weight;
                                this.m_accumulationBuffer[a] += w * this.m_staticPressureBuffer[b]; // a <- b
                                this.m_accumulationBuffer[b] += w * this.m_staticPressureBuffer[a]; // b <- a
                            }
                        }
                        for (let i = 0; i < this.m_count; i++) {
                            const w = this.m_weightBuffer[i];
                            if (this.m_flagsBuffer.data[i] & b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle) {
                                const wh = this.m_accumulationBuffer[i];
                                const h = (wh + pressurePerWeight * (w - b2Settings_js_2.b2_minParticleWeight)) /
                                    (w + relaxation);
                                this.m_staticPressureBuffer[i] = b2Math_js_1.b2Clamp(h, 0.0, maxPressure);
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
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    // calculates pressure as a linear function of density
                    const criticalPressure = this.GetCriticalPressure(step);
                    const pressurePerWeight = this.m_def.pressureStrength * criticalPressure;
                    const maxPressure = b2Settings_js_2.b2_maxParticlePressure * criticalPressure;
                    for (let i = 0; i < this.m_count; i++) {
                        const w = this.m_weightBuffer[i];
                        const h = pressurePerWeight * b2Math_js_1.b2Max(0.0, w - b2Settings_js_2.b2_minParticleWeight);
                        this.m_accumulationBuffer[i] = b2Math_js_1.b2Min(h, maxPressure);
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
                    if (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle) {
                        // DEBUG: b2Assert(this.m_staticPressureBuffer !== null);
                        for (let i = 0; i < this.m_count; i++) {
                            if (this.m_flagsBuffer.data[i] & b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle) {
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
                        const f = b2Math_js_1.b2Vec2.MulSV(velocityPerPressure * w * m * h, n, s_f);
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
                        const f = b2Math_js_1.b2Vec2.MulSV(velocityPerPressure * w * h, n, s_f);
                        ///m_velocityBuffer.data[a] -= f;
                        vel_data[a].SelfSub(f);
                        ///m_velocityBuffer.data[b] += f;
                        vel_data[b].SelfAdd(f);
                    }
                }
                SolveDamping(step) {
                    const s_v = b2ParticleSystem.SolveDamping_s_v;
                    const s_f = b2ParticleSystem.SolveDamping_s_f;
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
                        const v = b2Math_js_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_js_1.b2Vec2.s_t0), vel_data[a], s_v);
                        const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            const damping = b2Math_js_1.b2Max(linearDamping * w, b2Math_js_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * m * vn * n;
                            const f = b2Math_js_1.b2Vec2.MulSV(damping * m * vn, n, s_f);
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
                        const v = b2Math_js_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                        const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
                        if (vn < 0) {
                            ///float32 damping = b2Max(linearDamping * w, b2Min(- quadraticDamping * vn, 0.5f));
                            const damping = b2Math_js_1.b2Max(linearDamping * w, b2Math_js_1.b2Min(-quadraticDamping * vn, 0.5));
                            ///b2Vec2 f = damping * vn * n;
                            const f = b2Math_js_1.b2Vec2.MulSV(damping * vn, n, s_f);
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
                            const v = b2Math_js_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, s_t0), aGroup.GetLinearVelocityFromWorldPoint(p, s_t1), s_v);
                            const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                // The group's average velocity at particle position 'p' is pushing
                                // the particle into the body.
                                ///this.InitDampingParameterWithRigidGroupOrParticle(&invMassA, &invInertiaA, &tangentDistanceA, true, aGroup, a, p, n);
                                this.InitDampingParameterWithRigidGroupOrParticle(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, p, n);
                                // Calculate b.m_I from public functions of b2Body.
                                ///this.InitDampingParameter(&invMassB, &invInertiaB, &tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                this.InitDampingParameter(invMassB, invInertiaB, tangentDistanceB, b.GetMass(), b.GetInertia() - b.GetMass() * b.GetLocalCenter().LengthSquared(), b.GetWorldCenter(), p, n);
                                ///float32 f = damping * b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA, invInertiaA, tangentDistanceA, invMassB, invInertiaB, tangentDistanceB, vn);
                                const f = damping * b2Math_js_1.b2Min(w, 1.0) * this.ComputeDampingImpulse(invMassA[0], invInertiaA[0], tangentDistanceA[0], invMassB[0], invInertiaB[0], tangentDistanceB[0], vn);
                                ///this.ApplyDamping(invMassA, invInertiaA, tangentDistanceA, true, aGroup, a, f, n);
                                this.ApplyDamping(invMassA[0], invInertiaA[0], tangentDistanceA[0], true, aGroup, a, f, n);
                                ///b.ApplyLinearImpulse(-f * n, p, true);
                                b.ApplyLinearImpulse(b2Math_js_1.b2Vec2.MulSV(-f, n, b2Math_js_1.b2Vec2.s_t0), p, true);
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
                            const p = b2Math_js_1.b2Vec2.MidVV(pos_data[a], pos_data[b], s_p);
                            ///b2Vec2 v = GetLinearVelocity(bGroup, b, p) - GetLinearVelocity(aGroup, a, p);
                            const v = b2Math_js_1.b2Vec2.SubVV(this.GetLinearVelocity(bGroup, b, p, s_t0), this.GetLinearVelocity(aGroup, a, p, s_t1), s_v);
                            const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
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
                            const v = b2Math_js_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_js_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///float32 vn = b2Dot(v, n);
                            const vn = b2Math_js_1.b2Vec2.DotVV(v, n);
                            if (vn < 0) {
                                ///b2Vec2 f = 0.5f * m * vn * n;
                                const f = b2Math_js_1.b2Vec2.MulSV(0.5 * m * vn, n, s_f);
                                ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                                vel_data[a].SelfMulAdd(inv_mass, f);
                                ///b.ApplyLinearImpulse(-f, p, true);
                                b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                            }
                        }
                    }
                }
                SolveWall() {
                    const vel_data = this.m_velocityBuffer.data;
                    for (let i = 0; i < this.m_count; i++) {
                        if (this.m_flagsBuffer.data[i] & b2Particle_js_1.b2ParticleFlag.b2_wallParticle) {
                            vel_data[i].SetZero();
                        }
                    }
                }
                SolveRigid(step) {
                    const s_position = b2ParticleSystem.SolveRigid_s_position;
                    const s_rotation = b2ParticleSystem.SolveRigid_s_rotation;
                    const s_transform = b2ParticleSystem.SolveRigid_s_transform;
                    const s_velocityTransform = b2ParticleSystem.SolveRigid_s_velocityTransform;
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    for (let group = this.m_groupList; group; group = group.GetNext()) {
                        if (group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_rigidParticleGroup) {
                            group.UpdateStatistics();
                            ///b2Rot rotation(step.dt * group.m_angularVelocity);
                            const rotation = s_rotation;
                            rotation.SetAngle(step.dt * group.m_angularVelocity);
                            ///b2Transform transform(group.m_center + step.dt * group.m_linearVelocity - b2Mul(rotation, group.m_center), rotation);
                            const position = b2Math_js_1.b2Vec2.AddVV(group.m_center, b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.MulSV(step.dt, group.m_linearVelocity, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Rot.MulRV(rotation, group.m_center, b2Math_js_1.b2Vec2.s_t1), b2Math_js_1.b2Vec2.s_t0), s_position);
                            const transform = s_transform;
                            transform.SetPositionRotation(position, rotation);
                            ///group.m_transform = b2Mul(transform, group.m_transform);
                            b2Math_js_1.b2Transform.MulXX(transform, group.m_transform, group.m_transform);
                            const velocityTransform = s_velocityTransform;
                            velocityTransform.p.x = step.inv_dt * transform.p.x;
                            velocityTransform.p.y = step.inv_dt * transform.p.y;
                            velocityTransform.q.s = step.inv_dt * transform.q.s;
                            velocityTransform.q.c = step.inv_dt * (transform.q.c - 1);
                            for (let i = group.m_firstIndex; i < group.m_lastIndex; i++) {
                                ///m_velocityBuffer.data[i] = b2Mul(velocityTransform, m_positionBuffer.data[i]);
                                b2Math_js_1.b2Transform.MulXV(velocityTransform, pos_data[i], vel_data[i]);
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
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const elasticStrength = step.inv_dt * this.m_def.elasticStrength;
                    for (let k = 0; k < this.m_triadBuffer.count; k++) {
                        const triad = this.m_triadBuffer.data[k];
                        if (triad.flags & b2Particle_js_1.b2ParticleFlag.b2_elasticParticle) {
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
                            r.s = b2Math_js_1.b2Vec2.CrossVV(oa, pa) + b2Math_js_1.b2Vec2.CrossVV(ob, pb) + b2Math_js_1.b2Vec2.CrossVV(oc, pc);
                            r.c = b2Math_js_1.b2Vec2.DotVV(oa, pa) + b2Math_js_1.b2Vec2.DotVV(ob, pb) + b2Math_js_1.b2Vec2.DotVV(oc, pc);
                            const r2 = r.s * r.s + r.c * r.c;
                            let invR = b2Math_js_1.b2InvSqrt(r2);
                            if (!isFinite(invR)) {
                                invR = 1.98177537e+019;
                            }
                            r.s *= invR;
                            r.c *= invR;
                            ///r.angle = Math.atan2(r.s, r.c); // TODO: optimize
                            const strength = elasticStrength * triad.strength;
                            ///va += strength * (b2Mul(r, oa) - pa);
                            b2Math_js_1.b2Rot.MulRV(r, oa, s_t0);
                            b2Math_js_1.b2Vec2.SubVV(s_t0, pa, s_t0);
                            b2Math_js_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            va.SelfAdd(s_t0);
                            ///vb += strength * (b2Mul(r, ob) - pb);
                            b2Math_js_1.b2Rot.MulRV(r, ob, s_t0);
                            b2Math_js_1.b2Vec2.SubVV(s_t0, pb, s_t0);
                            b2Math_js_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            vb.SelfAdd(s_t0);
                            ///vc += strength * (b2Mul(r, oc) - pc);
                            b2Math_js_1.b2Rot.MulRV(r, oc, s_t0);
                            b2Math_js_1.b2Vec2.SubVV(s_t0, pc, s_t0);
                            b2Math_js_1.b2Vec2.MulSV(strength, s_t0, s_t0);
                            vc.SelfAdd(s_t0);
                        }
                    }
                }
                SolveSpring(step) {
                    const s_pa = b2ParticleSystem.SolveSpring_s_pa;
                    const s_pb = b2ParticleSystem.SolveSpring_s_pb;
                    const s_d = b2ParticleSystem.SolveSpring_s_d;
                    const s_f = b2ParticleSystem.SolveSpring_s_f;
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const springStrength = step.inv_dt * this.m_def.springStrength;
                    for (let k = 0; k < this.m_pairBuffer.count; k++) {
                        const pair = this.m_pairBuffer.data[k];
                        if (pair.flags & b2Particle_js_1.b2ParticleFlag.b2_springParticle) {
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
                            const d = b2Math_js_1.b2Vec2.SubVV(pb, pa, s_d);
                            ///float32 r0 = pair.distance;
                            const r0 = pair.distance;
                            ///float32 r1 = d.Length();
                            const r1 = d.Length();
                            ///float32 strength = springStrength * pair.strength;
                            const strength = springStrength * pair.strength;
                            ///b2Vec2 f = strength * (r0 - r1) / r1 * d;
                            const f = b2Math_js_1.b2Vec2.MulSV(strength * (r0 - r1) / r1, d, s_f);
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
                    const vel_data = this.m_velocityBuffer.data;
                    // DEBUG: b2Assert(this.m_accumulation2Buffer !== null);
                    for (let i = 0; i < this.m_count; i++) {
                        this.m_accumulation2Buffer[i] = new b2Math_js_1.b2Vec2();
                        this.m_accumulation2Buffer[i].SetZero();
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_tensileParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            const n = contact.normal;
                            ///b2Vec2 weightedNormal = (1 - w) * w * n;
                            const weightedNormal = b2Math_js_1.b2Vec2.MulSV((1 - w) * w, n, s_weightedNormal);
                            ///m_accumulation2Buffer[a] -= weightedNormal;
                            this.m_accumulation2Buffer[a].SelfSub(weightedNormal);
                            ///m_accumulation2Buffer[b] += weightedNormal;
                            this.m_accumulation2Buffer[b].SelfAdd(weightedNormal);
                        }
                    }
                    const criticalVelocity = this.GetCriticalVelocity(step);
                    const pressureStrength = this.m_def.surfaceTensionPressureStrength * criticalVelocity;
                    const normalStrength = this.m_def.surfaceTensionNormalStrength * criticalVelocity;
                    const maxVelocityVariation = b2Settings_js_2.b2_maxParticleForce * criticalVelocity;
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_tensileParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            const n = contact.normal;
                            const h = this.m_weightBuffer[a] + this.m_weightBuffer[b];
                            ///b2Vec2 s = m_accumulation2Buffer[b] - m_accumulation2Buffer[a];
                            const s = b2Math_js_1.b2Vec2.SubVV(this.m_accumulation2Buffer[b], this.m_accumulation2Buffer[a], s_s);
                            const fn = b2Math_js_1.b2Min(pressureStrength * (h - 2) + normalStrength * b2Math_js_1.b2Vec2.DotVV(s, n), maxVelocityVariation) * w;
                            ///b2Vec2 f = fn * n;
                            const f = b2Math_js_1.b2Vec2.MulSV(fn, n, s_f);
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
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const viscousStrength = this.m_def.viscousStrength;
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_js_1.b2ParticleFlag.b2_viscousParticle) {
                            const b = contact.body;
                            const w = contact.weight;
                            const m = contact.mass;
                            const p = pos_data[a];
                            ///b2Vec2 v = b.GetLinearVelocityFromWorldPoint(p) - m_velocityBuffer.data[a];
                            const v = b2Math_js_1.b2Vec2.SubVV(b.GetLinearVelocityFromWorldPoint(p, b2Math_js_1.b2Vec2.s_t0), vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * m * w * v;
                            const f = b2Math_js_1.b2Vec2.MulSV(viscousStrength * m * w, v, s_f);
                            ///m_velocityBuffer.data[a] += GetParticleInvMass() * f;
                            vel_data[a].SelfMulAdd(inv_mass, f);
                            ///b.ApplyLinearImpulse(-f, p, true);
                            b.ApplyLinearImpulse(f.SelfNeg(), p, true);
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_viscousParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            const w = contact.weight;
                            ///b2Vec2 v = m_velocityBuffer.data[b] - m_velocityBuffer.data[a];
                            const v = b2Math_js_1.b2Vec2.SubVV(vel_data[b], vel_data[a], s_v);
                            ///b2Vec2 f = viscousStrength * w * v;
                            const f = b2Math_js_1.b2Vec2.MulSV(viscousStrength * w, v, s_f);
                            ///m_velocityBuffer.data[a] += f;
                            vel_data[a].SelfAdd(f);
                            ///m_velocityBuffer.data[b] -= f;
                            vel_data[b].SelfSub(f);
                        }
                    }
                }
                SolveRepulsive(step) {
                    const s_f = b2ParticleSystem.SolveRepulsive_s_f;
                    const vel_data = this.m_velocityBuffer.data;
                    const repulsiveStrength = this.m_def.repulsiveStrength * this.GetCriticalVelocity(step);
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_repulsiveParticle) {
                            const a = contact.indexA;
                            const b = contact.indexB;
                            if (this.m_groupBuffer[a] !== this.m_groupBuffer[b]) {
                                const w = contact.weight;
                                const n = contact.normal;
                                ///b2Vec2 f = repulsiveStrength * w * n;
                                const f = b2Math_js_1.b2Vec2.MulSV(repulsiveStrength * w, n, s_f);
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
                    const pos_data = this.m_positionBuffer.data;
                    const vel_data = this.m_velocityBuffer.data;
                    const powderStrength = this.m_def.powderStrength * this.GetCriticalVelocity(step);
                    const minWeight = 1.0 - b2Settings_js_2.b2_particleStride;
                    const inv_mass = this.GetParticleInvMass();
                    for (let k = 0; k < this.m_bodyContactBuffer.count; k++) {
                        const contact = this.m_bodyContactBuffer.data[k];
                        const a = contact.index;
                        if (this.m_flagsBuffer.data[a] & b2Particle_js_1.b2ParticleFlag.b2_powderParticle) {
                            const w = contact.weight;
                            if (w > minWeight) {
                                const b = contact.body;
                                const m = contact.mass;
                                const p = pos_data[a];
                                const n = contact.normal;
                                const f = b2Math_js_1.b2Vec2.MulSV(powderStrength * m * (w - minWeight), n, s_f);
                                vel_data[a].SelfMulSub(inv_mass, f);
                                b.ApplyLinearImpulse(f, p, true);
                            }
                        }
                    }
                    for (let k = 0; k < this.m_contactBuffer.count; k++) {
                        const contact = this.m_contactBuffer.data[k];
                        if (contact.flags & b2Particle_js_1.b2ParticleFlag.b2_powderParticle) {
                            const w = contact.weight;
                            if (w > minWeight) {
                                const a = contact.indexA;
                                const b = contact.indexB;
                                const n = contact.normal;
                                const f = b2Math_js_1.b2Vec2.MulSV(powderStrength * (w - minWeight), n, s_f);
                                vel_data[a].SelfSub(f);
                                vel_data[b].SelfAdd(f);
                            }
                        }
                    }
                }
                SolveSolid(step) {
                    const s_f = b2ParticleSystem.SolveSolid_s_f;
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
                            const f = b2Math_js_1.b2Vec2.MulSV(ejectionStrength * h * w, n, s_f);
                            vel_data[a].SelfSub(f);
                            vel_data[b].SelfAdd(f);
                        }
                    }
                }
                SolveForce(step) {
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
                    const colorMixing = 0.5 * this.m_def.colorMixingStrength;
                    if (colorMixing) {
                        for (let k = 0; k < this.m_contactBuffer.count; k++) {
                            const contact = this.m_contactBuffer.data[k];
                            const a = contact.indexA;
                            const b = contact.indexB;
                            if (this.m_flagsBuffer.data[a] & this.m_flagsBuffer.data[b] &
                                b2Particle_js_1.b2ParticleFlag.b2_colorMixingParticle) {
                                const colorA = this.m_colorBuffer.data[a];
                                const colorB = this.m_colorBuffer.data[b];
                                // Use the static method to ensure certain compilers inline
                                // this correctly.
                                b2Draw_js_1.b2Color.MixColors(colorA, colorB, colorMixing);
                            }
                        }
                    }
                }
                SolveZombie() {
                    // removes particles with zombie flag
                    let newCount = 0;
                    const newIndices = []; // TODO: static
                    for (let i = 0; i < this.m_count; i++) {
                        newIndices[i] = b2Settings_js_1.b2_invalidParticleIndex;
                    }
                    // DEBUG: b2Assert(newIndices.length === this.m_count);
                    let allParticleFlags = 0;
                    for (let i = 0; i < this.m_count; i++) {
                        const flags = this.m_flagsBuffer.data[i];
                        if (flags & b2Particle_js_1.b2ParticleFlag.b2_zombieParticle) {
                            const destructionListener = this.m_world.m_destructionListener;
                            if ((flags & b2Particle_js_1.b2ParticleFlag.b2_destructionListenerParticle) && destructionListener) {
                                destructionListener.SayGoodbyeParticle(this, i);
                            }
                            // Destroy particle handle.
                            if (this.m_handleIndexBuffer.data) {
                                const handle = this.m_handleIndexBuffer.data[i];
                                if (handle) {
                                    handle.SetIndex(b2Settings_js_1.b2_invalidParticleIndex);
                                    this.m_handleIndexBuffer.data[i] = null;
                                    ///m_handleAllocator.Free(handle);
                                }
                            }
                            newIndices[i] = b2Settings_js_1.b2_invalidParticleIndex;
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
                            if (newIndex !== b2Settings_js_1.b2_invalidParticleIndex) {
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
                                firstIndex = b2Math_js_1.b2Min(firstIndex, j);
                                lastIndex = b2Math_js_1.b2Max(lastIndex, j + 1);
                            }
                            else {
                                modified = true;
                            }
                        }
                        if (firstIndex < lastIndex) {
                            group.m_firstIndex = firstIndex;
                            group.m_lastIndex = lastIndex;
                            if (modified) {
                                if (group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                                    this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
                                }
                            }
                        }
                        else {
                            group.m_firstIndex = 0;
                            group.m_lastIndex = 0;
                            if (!(group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty)) {
                                this.SetGroupFlags(group, group.m_groupFlags | b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed);
                            }
                        }
                    }
                    // update particle count
                    this.m_count = newCount;
                    this.m_allParticleFlags = allParticleFlags;
                    this.m_needsUpdateAllParticleFlags = false;
                    // destroy bodies with no particles
                    for (let group = this.m_groupList; group;) {
                        const next = group.GetNext();
                        if (group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed) {
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
                    return b2Settings_js_2.b2_particleStride * this.m_particleDiameter;
                }
                GetParticleMass() {
                    const stride = this.GetParticleStride();
                    return this.m_def.density * stride * stride;
                }
                GetParticleInvMass() {
                    ///return 1.777777 * this.m_inverseDensity * this.m_inverseDiameter * this.m_inverseDiameter;
                    // mass = density * stride^2, so we take the inverse of this.
                    const inverseStride = this.m_inverseDiameter * (1.0 / b2Settings_js_2.b2_particleStride);
                    return this.m_inverseDensity * inverseStride * inverseStride;
                }
                /**
                 * Get the world's contact filter if any particles with the
                 * b2_contactFilterParticle flag are present in the system.
                 */
                GetFixtureContactFilter() {
                    return (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_fixtureContactFilterParticle) ?
                        this.m_world.m_contactManager.m_contactFilter : null;
                }
                /**
                 * Get the world's contact filter if any particles with the
                 * b2_particleContactFilterParticle flag are present in the
                 * system.
                 */
                GetParticleContactFilter() {
                    return (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_particleContactFilterParticle) ?
                        this.m_world.m_contactManager.m_contactFilter : null;
                }
                /**
                 * Get the world's contact listener if any particles with the
                 * b2_fixtureContactListenerParticle flag are present in the
                 * system.
                 */
                GetFixtureContactListener() {
                    return (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_fixtureContactListenerParticle) ?
                        this.m_world.m_contactManager.m_contactListener : null;
                }
                /**
                 * Get the world's contact listener if any particles with the
                 * b2_particleContactListenerParticle flag are present in the
                 * system.
                 */
                GetParticleContactListener() {
                    return (this.m_allParticleFlags & b2Particle_js_1.b2ParticleFlag.b2_particleContactListenerParticle) ?
                        this.m_world.m_contactManager.m_contactListener : null;
                }
                SetUserOverridableBuffer(buffer, data) {
                    buffer.data = data;
                    buffer.userSuppliedCapacity = data.length;
                }
                SetGroupFlags(group, newFlags) {
                    const oldFlags = group.m_groupFlags;
                    if ((oldFlags ^ newFlags) & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
                        // If the b2_solidParticleGroup flag changed schedule depth update.
                        newFlags |= b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth;
                    }
                    if (oldFlags & ~newFlags) {
                        // If any flags might be removed
                        this.m_needsUpdateAllGroupFlags = true;
                    }
                    if (~this.m_allGroupFlags & newFlags) {
                        // If any flags were added
                        if (newFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_solidParticleGroup) {
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
                        const pos = b2Math_js_1.b2Vec2.AddVV(system.m_positionBuffer.data[contact.index], n, s_pos);
                        // pos is now a point projected back along the contact normal to the
                        // contact distance. If the surface makes sense for a contact, pos will
                        // now lie on or in the fixture generating
                        if (!contact.fixture.TestPoint(pos)) {
                            const childCount = contact.fixture.GetShape().GetChildCount();
                            for (let childIndex = 0; childIndex < childCount; childIndex++) {
                                const normal = s_normal;
                                const distance = contact.fixture.ComputeDistance(pos, normal, childIndex);
                                if (distance < b2Settings_js_1.b2_linearSlop) {
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
                        index !== b2Settings_js_1.b2_invalidParticleIndex;
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
                    return !(flags & b2Particle_js_1.b2ParticleFlag.b2_wallParticle);
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
                    return (group !== null) && ((group.m_groupFlags & b2ParticleGroup_js_1.b2ParticleGroupFlag.b2_rigidParticleGroup) !== 0);
                }
                GetLinearVelocity(group, particleIndex, point, out) {
                    if (group && this.IsRigidGroup(group)) {
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
                    tangentDistance[0] = b2Math_js_1.b2Vec2.CrossVV(b2Math_js_1.b2Vec2.SubVV(point, center, b2Math_js_1.b2Vec2.s_t0), normal);
                }
                InitDampingParameterWithRigidGroupOrParticle(invMass, invInertia, tangentDistance, isRigidGroup, group, particleIndex, point, normal) {
                    if (group && isRigidGroup) {
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, group.GetMass(), group.GetInertia(), group.GetCenter(), point, normal);
                    }
                    else {
                        const flags = this.m_flagsBuffer.data[particleIndex];
                        this.InitDampingParameter(invMass, invInertia, tangentDistance, flags & b2Particle_js_1.b2ParticleFlag.b2_wallParticle ? 0 : this.GetParticleMass(), 0, point, point, normal);
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
                        ///m_velocityBuffer.data[particleIndex] += impulse * invMass * normal;
                        this.m_velocityBuffer.data[particleIndex].SelfMulAdd(impulse * invMass, normal);
                    }
                }
            };
            exports_1("b2ParticleSystem", b2ParticleSystem);
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
            b2ParticleSystem.DestroyParticlesInShape_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.CreateParticleGroup_s_transform = new b2Math_js_1.b2Transform();
            b2ParticleSystem.ComputeCollisionEnergy_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.QueryShapeAABB_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.QueryPointAABB_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.RayCast_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.RayCast_s_p = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RayCast_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RayCast_s_n = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RayCast_s_point = new b2Math_js_1.b2Vec2();
            /**
             * All particle types that require creating pairs
             */
            b2ParticleSystem.k_pairFlags = b2Particle_js_1.b2ParticleFlag.b2_springParticle;
            /**
             * All particle types that require creating triads
             */
            b2ParticleSystem.k_triadFlags = b2Particle_js_1.b2ParticleFlag.b2_elasticParticle;
            /**
             * All particle types that do not produce dynamic pressure
             */
            b2ParticleSystem.k_noPressureFlags = b2Particle_js_1.b2ParticleFlag.b2_powderParticle | b2Particle_js_1.b2ParticleFlag.b2_tensileParticle;
            /**
             * All particle types that apply extra damping force with bodies
             */
            b2ParticleSystem.k_extraDampingFlags = b2Particle_js_1.b2ParticleFlag.b2_staticPressureParticle;
            b2ParticleSystem.k_barrierWallFlags = b2Particle_js_1.b2ParticleFlag.b2_barrierParticle | b2Particle_js_1.b2ParticleFlag.b2_wallParticle;
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_edge = new b2EdgeShape_js_1.b2EdgeShape();
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_d = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.CreateParticlesStrokeShapeForGroup_s_p = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.CreateParticlesFillShapeForGroup_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.CreateParticlesFillShapeForGroup_s_p = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dab = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dbc = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.UpdatePairsAndTriads_s_dca = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.AddContact_s_d = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.UpdateBodyContacts_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.Solve_s_subStep = new b2TimeStep_js_1.b2TimeStep();
            b2ParticleSystem.SolveCollision_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.SolveGravity_s_gravity = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_aabb = new b2Collision_js_1.b2AABB();
            b2ParticleSystem.SolveBarrier_s_va = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vb = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_pba = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vba = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vc = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_pca = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_vca = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_qba = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_qca = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_dv = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveBarrier_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolvePressure_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveDamping_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveDamping_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_t0 = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_t1 = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_p = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigidDamping_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveExtraDamping_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveExtraDamping_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigid_s_position = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRigid_s_rotation = new b2Math_js_1.b2Rot();
            b2ParticleSystem.SolveRigid_s_transform = new b2Math_js_1.b2Transform();
            b2ParticleSystem.SolveRigid_s_velocityTransform = new b2Math_js_1.b2Transform();
            b2ParticleSystem.SolveElastic_s_pa = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_pb = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_pc = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveElastic_s_r = new b2Math_js_1.b2Rot();
            b2ParticleSystem.SolveElastic_s_t0 = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_pa = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_pb = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_d = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveSpring_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_weightedNormal = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_s = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveTensile_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveViscous_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveViscous_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveRepulsive_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolvePowder_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.SolveSolid_s_f = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_n = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_pos = new b2Math_js_1.b2Vec2();
            b2ParticleSystem.RemoveSpuriousBodyContacts_s_normal = new b2Math_js_1.b2Vec2();
            b2ParticleSystem_UserOverridableBuffer = class b2ParticleSystem_UserOverridableBuffer {
                constructor() {
                    this._data = null;
                    this.userSuppliedCapacity = 0;
                }
                get data() { return this._data; } // HACK: may return null
                set data(value) { this._data = value; }
            };
            exports_1("b2ParticleSystem_UserOverridableBuffer", b2ParticleSystem_UserOverridableBuffer);
            b2ParticleSystem_Proxy = class b2ParticleSystem_Proxy {
                constructor() {
                    this.index = b2Settings_js_1.b2_invalidParticleIndex;
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
                    return b2Settings_js_1.b2_invalidParticleIndex;
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
                    this.second = b2Settings_js_1.b2_invalidParticleIndex;
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
                    return b2Settings_js_1.b2_invalidParticleIndex;
                }
            };
            exports_1("b2ParticleSystem_FixtureParticleSet", b2ParticleSystem_FixtureParticleSet);
            b2ParticleSystem_ParticlePair = class b2ParticleSystem_ParticlePair {
                constructor(particleA, particleB) {
                    this.first = b2Settings_js_1.b2_invalidParticleIndex;
                    this.second = b2Settings_js_1.b2_invalidParticleIndex;
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
                    return b2Settings_js_1.b2_invalidParticleIndex;
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
            b2ParticleSystem_DestroyParticlesInShapeCallback = class b2ParticleSystem_DestroyParticlesInShapeCallback extends b2WorldCallbacks_js_1.b2QueryCallback {
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
            b2ParticleSystem_CompositeShape = class b2ParticleSystem_CompositeShape extends b2Shape_js_1.b2Shape {
                constructor(shapes, shapeCount = shapes.length) {
                    super(b2Shape_js_1.b2ShapeType.e_unknown, 0);
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
                    const s_subaabb = new b2Collision_js_1.b2AABB();
                    aabb.lowerBound.x = +b2Settings_js_1.b2_maxFloat;
                    aabb.lowerBound.y = +b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.x = -b2Settings_js_1.b2_maxFloat;
                    aabb.upperBound.y = -b2Settings_js_1.b2_maxFloat;
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
                    return (this.m_flagsBuffer.data[index] & b2Particle_js_1.b2ParticleFlag.b2_reactiveParticle) !== 0;
                }
            };
            exports_1("b2ParticleSystem_ReactiveFilter", b2ParticleSystem_ReactiveFilter);
            b2ParticleSystem_UpdateBodyContactsCallback = class b2ParticleSystem_UpdateBodyContactsCallback extends b2FixtureParticleQueryCallback {
                constructor(system, contactFilter = null) {
                    super(system); // base class constructor
                    this.m_contactFilter = null;
                    this.m_contactFilter = contactFilter;
                }
                ShouldCollideFixtureParticle(fixture, particleSystem, particleIndex) {
                    // Call the contact filter if it's set, to determine whether to
                    // filter this contact.  Returns true if contact calculations should
                    // be performed, false otherwise.
                    if (this.m_contactFilter) {
                        const flags = this.m_system.GetFlagsBuffer();
                        if (flags[particleIndex] & b2Particle_js_1.b2ParticleFlag.b2_fixtureContactFilterParticle) {
                            return this.m_contactFilter.ShouldCollideFixtureParticle(fixture, this.m_system, particleIndex);
                        }
                    }
                    return true;
                }
                ReportFixtureAndParticle(fixture, childIndex, a) {
                    const s_n = b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n;
                    const s_rp = b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp;
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
                            b2Particle_js_1.b2ParticleFlag.b2_wallParticle ? 0 : this.m_system.GetParticleInvMass();
                        ///b2Vec2 rp = ap - bp;
                        const rp = b2Math_js_1.b2Vec2.SubVV(ap, bp, s_rp);
                        const rpn = b2Math_js_1.b2Vec2.CrossVV(rp, n);
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
            exports_1("b2ParticleSystem_UpdateBodyContactsCallback", b2ParticleSystem_UpdateBodyContactsCallback);
            b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_n = new b2Math_js_1.b2Vec2();
            b2ParticleSystem_UpdateBodyContactsCallback.ReportFixtureAndParticle_s_rp = new b2Math_js_1.b2Vec2();
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
                    const ap = this.m_system.m_positionBuffer.data[a];
                    const av = this.m_system.m_velocityBuffer.data[a];
                    const output = s_output;
                    const input = s_input;
                    if (this.m_system.m_iterationIndex === 0) {
                        // Put 'ap' in the local space of the previous frame
                        ///b2Vec2 p1 = b2MulT(body.m_xf0, ap);
                        const p1 = b2Math_js_1.b2Transform.MulTXV(body.m_xf0, ap, s_p1);
                        if (fixture.GetShape().GetType() === b2Shape_js_1.b2ShapeType.e_circleShape) {
                            // Make relative to the center of the circle
                            ///p1 -= body.GetLocalCenter();
                            p1.SelfSub(body.GetLocalCenter());
                            // Re-apply rotation about the center of the circle
                            ///p1 = b2Mul(body.m_xf0.q, p1);
                            b2Math_js_1.b2Rot.MulRV(body.m_xf0.q, p1, p1);
                            // Subtract rotation of the current frame
                            ///p1 = b2MulT(body.m_xf.q, p1);
                            b2Math_js_1.b2Rot.MulTRV(body.m_xf.q, p1, p1);
                            // Return to local space
                            ///p1 += body.GetLocalCenter();
                            p1.SelfAdd(body.GetLocalCenter());
                        }
                        // Return to global space and apply rotation of current frame
                        ///input.p1 = b2Mul(body.m_xf, p1);
                        b2Math_js_1.b2Transform.MulXV(body.m_xf, p1, input.p1);
                    }
                    else {
                        ///input.p1 = ap;
                        input.p1.Copy(ap);
                    }
                    ///input.p2 = ap + m_step.dt * av;
                    b2Math_js_1.b2Vec2.AddVMulSV(ap, this.m_step.dt, av, input.p2);
                    input.maxFraction = 1;
                    if (fixture.RayCast(output, input, childIndex)) {
                        const n = output.normal;
                        ///b2Vec2 p = (1 - output.fraction) * input.p1 + output.fraction * input.p2 + b2_linearSlop * n;
                        const p = s_p;
                        p.x = (1 - output.fraction) * input.p1.x + output.fraction * input.p2.x + b2Settings_js_1.b2_linearSlop * n.x;
                        p.y = (1 - output.fraction) * input.p1.y + output.fraction * input.p2.y + b2Settings_js_1.b2_linearSlop * n.y;
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
            exports_1("b2ParticleSystem_SolveCollisionCallback", b2ParticleSystem_SolveCollisionCallback);
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p1 = new b2Math_js_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_output = new b2Collision_js_1.b2RayCastOutput();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_input = new b2Collision_js_1.b2RayCastInput();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_p = new b2Math_js_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_v = new b2Math_js_1.b2Vec2();
            b2ParticleSystem_SolveCollisionCallback.ReportFixtureAndParticle_s_f = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZVN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUGFydGljbGVTeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7O0lBdUJILFNBQVMsYUFBYSxDQUFJLEtBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUN4RCxNQUFNLEdBQUcsR0FBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTLGVBQWUsQ0FBSSxDQUFJLEVBQUUsQ0FBSSxJQUFhLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEUsU0FBUyxRQUFRLENBQUksS0FBVSxFQUFFLFFBQWdCLENBQUMsRUFBRSxNQUFjLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQStCLGVBQWU7UUFDcEksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFWixTQUFXLEVBQUUsZ0JBQWdCO1lBQzNCLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSx3QkFBd0I7Z0JBQ3RELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO2dCQUM3RixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQywyQkFBMkI7Z0JBQy9D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