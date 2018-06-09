/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
System.register([], function (exports_1, context_1) {
    "use strict";
    var b2List, b2_maxFloat, b2_epsilon, b2_epsilon_sq, b2_pi, b2_maxManifoldPoints, b2_maxPolygonVertices, b2_aabbExtension, b2_aabbMultiplier, b2_linearSlop, b2_angularSlop, b2_polygonRadius, b2_maxSubSteps, b2_maxTOIContacts, b2_velocityThreshold, b2_maxLinearCorrection, b2_maxAngularCorrection, b2_maxTranslation, b2_maxTranslationSquared, b2_maxRotation, b2_maxRotationSquared, b2_baumgarte, b2_toiBaumgarte, b2_invalidParticleIndex, b2_maxParticleIndex, b2_particleStride, b2_minParticleWeight, b2_maxParticlePressure, b2_maxParticleForce, b2_maxTriadDistance, b2_maxTriadDistanceSquared, b2_minParticleSystemBufferCapacity, b2_barrierCollisionTime, b2_timeToSleep, b2_linearSleepTolerance, b2_angularSleepTolerance, b2Version, b2_version, b2_changelist;
    var __moduleName = context_1 && context_1.id;
    function b2Assert(condition, ...args) {
        if (!condition) {
            // debugger;
            throw new Error(...args);
        }
    }
    exports_1("b2Assert", b2Assert);
    function b2Maybe(value, def) {
        return value !== undefined ? value : def;
    }
    exports_1("b2Maybe", b2Maybe);
    // Memory Allocation
    /// Implement this function to use your own memory allocator.
    function b2Alloc(size) {
        return null;
    }
    exports_1("b2Alloc", b2Alloc);
    /// If you implement b2Alloc, you should also implement this function.
    function b2Free(mem) {
    }
    exports_1("b2Free", b2Free);
    /// Logging function.
    function b2Log(message, ...args) {
        // console.log(message, ...args);
    }
    exports_1("b2Log", b2Log);
    function b2ParseInt(v) {
        return parseInt(v, 10);
    }
    exports_1("b2ParseInt", b2ParseInt);
    function b2ParseUInt(v) {
        return Math.abs(parseInt(v, 10));
    }
    exports_1("b2ParseUInt", b2ParseUInt);
    function b2MakeArray(length, init) {
        const a = [];
        for (let i = 0; i < length; ++i) {
            a.push(init(i));
        }
        return a;
    }
    exports_1("b2MakeArray", b2MakeArray);
    function b2MakeNullArray(length) {
        const a = [];
        for (let i = 0; i < length; ++i) {
            a.push(null);
        }
        return a;
    }
    exports_1("b2MakeNullArray", b2MakeNullArray);
    function b2MakeNumberArray(length, init = 0) {
        const a = [];
        for (let i = 0; i < length; ++i) {
            a.push(init);
        }
        return a;
    }
    exports_1("b2MakeNumberArray", b2MakeNumberArray);
    return {
        setters: [],
        execute: function () {
            // export class b2List<T> extends Set<T> {}
            b2List = class b2List {
                constructor() {
                    this.m_array = [];
                }
                get size() { return this.m_array.length; }
                clear() { this.m_array.length = 0; }
                add(value) {
                    const index = this.m_array.indexOf(value);
                    if (index !== -1) {
                        throw new Error();
                    }
                    this.m_array.unshift(value); // add to front of array
                }
                delete(value) {
                    const index = this.m_array.indexOf(value);
                    if (index === -1) {
                        throw new Error();
                    }
                    this.m_array.splice(index, 1);
                }
                *[Symbol.iterator]() {
                    const array = this.m_array.slice();
                    for (let index = 0; index < array.length; ++index) {
                        yield array[index];
                    }
                }
            };
            exports_1("b2List", b2List);
            exports_1("b2_maxFloat", b2_maxFloat = 1E+37); // FLT_MAX instead of Number.MAX_VALUE;
            exports_1("b2_epsilon", b2_epsilon = 1E-5); // FLT_EPSILON instead of Number.MIN_VALUE;
            exports_1("b2_epsilon_sq", b2_epsilon_sq = (b2_epsilon * b2_epsilon));
            exports_1("b2_pi", b2_pi = 3.14159265359); // Math.PI;
            /// @file
            /// Global tuning constants based on meters-kilograms-seconds (MKS) units.
            ///
            // Collision
            /// The maximum number of contact points between two convex shapes. Do
            /// not change this value.
            exports_1("b2_maxManifoldPoints", b2_maxManifoldPoints = 2);
            /// The maximum number of vertices on a convex polygon. You cannot increase
            /// this too much because b2BlockAllocator has a maximum object size.
            exports_1("b2_maxPolygonVertices", b2_maxPolygonVertices = 8);
            /// This is used to fatten AABBs in the dynamic tree. This allows proxies
            /// to move by a small amount without triggering a tree adjustment.
            /// This is in meters.
            exports_1("b2_aabbExtension", b2_aabbExtension = 0.1);
            /// This is used to fatten AABBs in the dynamic tree. This is used to predict
            /// the future position based on the current displacement.
            /// This is a dimensionless multiplier.
            exports_1("b2_aabbMultiplier", b2_aabbMultiplier = 2);
            /// A small length used as a collision and constraint tolerance. Usually it is
            /// chosen to be numerically significant, but visually insignificant.
            exports_1("b2_linearSlop", b2_linearSlop = 0.008); // 0.005;
            /// A small angle used as a collision and constraint tolerance. Usually it is
            /// chosen to be numerically significant, but visually insignificant.
            exports_1("b2_angularSlop", b2_angularSlop = 2 / 180 * b2_pi);
            /// The radius of the polygon/edge shape skin. This should not be modified. Making
            /// this smaller means polygons will have an insufficient buffer for continuous collision.
            /// Making it larger may create artifacts for vertex collision.
            exports_1("b2_polygonRadius", b2_polygonRadius = 2 * b2_linearSlop);
            /// Maximum number of sub-steps per contact in continuous physics simulation.
            exports_1("b2_maxSubSteps", b2_maxSubSteps = 8);
            // Dynamics
            /// Maximum number of contacts to be handled to solve a TOI impact.
            exports_1("b2_maxTOIContacts", b2_maxTOIContacts = 32);
            /// A velocity threshold for elastic collisions. Any collision with a relative linear
            /// velocity below this threshold will be treated as inelastic.
            exports_1("b2_velocityThreshold", b2_velocityThreshold = 1);
            /// The maximum linear position correction used when solving constraints. This helps to
            /// prevent overshoot.
            exports_1("b2_maxLinearCorrection", b2_maxLinearCorrection = 0.2);
            /// The maximum angular position correction used when solving constraints. This helps to
            /// prevent overshoot.
            exports_1("b2_maxAngularCorrection", b2_maxAngularCorrection = 8 / 180 * b2_pi);
            /// The maximum linear velocity of a body. This limit is very large and is used
            /// to prevent numerical problems. You shouldn't need to adjust this.
            exports_1("b2_maxTranslation", b2_maxTranslation = 2);
            exports_1("b2_maxTranslationSquared", b2_maxTranslationSquared = b2_maxTranslation * b2_maxTranslation);
            /// The maximum angular velocity of a body. This limit is very large and is used
            /// to prevent numerical problems. You shouldn't need to adjust this.
            exports_1("b2_maxRotation", b2_maxRotation = 0.5 * b2_pi);
            exports_1("b2_maxRotationSquared", b2_maxRotationSquared = b2_maxRotation * b2_maxRotation);
            /// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
            /// that overlap is removed in one time step. However using values close to 1 often lead
            /// to overshoot.
            exports_1("b2_baumgarte", b2_baumgarte = 0.2);
            exports_1("b2_toiBaumgarte", b2_toiBaumgarte = 0.75);
            // #if B2_ENABLE_PARTICLE
            // Particle
            /// A symbolic constant that stands for particle allocation error.
            exports_1("b2_invalidParticleIndex", b2_invalidParticleIndex = -1);
            exports_1("b2_maxParticleIndex", b2_maxParticleIndex = 0x7FFFFFFF);
            /// The default distance between particles, multiplied by the particle diameter.
            exports_1("b2_particleStride", b2_particleStride = 0.75);
            /// The minimum particle weight that produces pressure.
            exports_1("b2_minParticleWeight", b2_minParticleWeight = 1.0);
            /// The upper limit for particle pressure.
            exports_1("b2_maxParticlePressure", b2_maxParticlePressure = 0.25);
            /// The upper limit for force between particles.
            exports_1("b2_maxParticleForce", b2_maxParticleForce = 0.5);
            /// The maximum distance between particles in a triad, multiplied by the particle diameter.
            exports_1("b2_maxTriadDistance", b2_maxTriadDistance = 2.0);
            exports_1("b2_maxTriadDistanceSquared", b2_maxTriadDistanceSquared = (b2_maxTriadDistance * b2_maxTriadDistance));
            /// The initial size of particle data buffers.
            exports_1("b2_minParticleSystemBufferCapacity", b2_minParticleSystemBufferCapacity = 256);
            /// The time into the future that collisions against barrier particles will be detected.
            exports_1("b2_barrierCollisionTime", b2_barrierCollisionTime = 2.5);
            // #endif
            // Sleep
            /// The time that a body must be still before it will go to sleep.
            exports_1("b2_timeToSleep", b2_timeToSleep = 0.5);
            /// A body cannot sleep if its linear velocity is above this tolerance.
            exports_1("b2_linearSleepTolerance", b2_linearSleepTolerance = 0.01);
            /// A body cannot sleep if its angular velocity is above this tolerance.
            exports_1("b2_angularSleepTolerance", b2_angularSleepTolerance = 2 / 180 * b2_pi);
            /// Version numbering scheme.
            /// See http://en.wikipedia.org/wiki/Software_versioning
            b2Version = class b2Version {
                constructor(major = 0, minor = 0, revision = 0) {
                    this.major = 0; ///< significant changes
                    this.minor = 0; ///< incremental changes
                    this.revision = 0; ///< bug fixes
                    this.major = major;
                    this.minor = minor;
                    this.revision = revision;
                }
                toString() {
                    return this.major + "." + this.minor + "." + this.revision;
                }
            };
            exports_1("b2Version", b2Version);
            /// Current version.
            exports_1("b2_version", b2_version = new b2Version(2, 3, 2));
            exports_1("b2_changelist", b2_changelist = 313);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBRUYsa0JBQXlCLFNBQWtCLEVBQUUsR0FBRyxJQUFXO1FBQ3pELElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxZQUFZO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQzs7SUFFRCxpQkFBMkIsS0FBb0IsRUFBRSxHQUFNO1FBQ3JELE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDM0MsQ0FBQzs7SUFtSkQsb0JBQW9CO0lBRXBCLDZEQUE2RDtJQUM3RCxpQkFBd0IsSUFBWTtRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O0lBRUQsc0VBQXNFO0lBQ3RFLGdCQUF1QixHQUFRO0lBQy9CLENBQUM7O0lBRUQscUJBQXFCO0lBQ3JCLGVBQXNCLE9BQWUsRUFBRSxHQUFHLElBQVc7UUFDbkQsaUNBQWlDO0lBQ25DLENBQUM7O0lBeUJELG9CQUEyQixDQUFTO1FBQ2xDLE9BQU8sUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDOztJQUVELHFCQUE0QixDQUFTO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7SUFFRCxxQkFBK0IsTUFBYyxFQUFFLElBQXNCO1FBQ25FLE1BQU0sQ0FBQyxHQUFRLEVBQUUsQ0FBQztRQUNsQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxD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