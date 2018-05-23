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
    var __moduleName = context_1 && context_1.id;
    function b2Assert(condition, ...args) {
        if (!condition) {
            debugger;
        }
    }
    exports_1("b2Assert", b2Assert);
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
        // const args = Array.prototype.slice.call(arguments);
        // const str = goog.string.format.apply(null, args.slice(0));
        // console.log(message);
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
        let a = [];
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
    var b2_maxFloat, b2_epsilon, b2_epsilon_sq, b2_pi, b2_maxManifoldPoints, b2_maxPolygonVertices, b2_aabbExtension, b2_aabbMultiplier, b2_linearSlop, b2_angularSlop, b2_polygonRadius, b2_maxSubSteps, b2_maxTOIContacts, b2_velocityThreshold, b2_maxLinearCorrection, b2_maxAngularCorrection, b2_maxTranslation, b2_maxTranslationSquared, b2_maxRotation, b2_maxRotationSquared, b2_baumgarte, b2_toiBaumgarte, b2_invalidParticleIndex, b2_maxParticleIndex, b2_particleStride, b2_minParticleWeight, b2_maxParticlePressure, b2_maxParticleForce, b2_maxTriadDistance, b2_maxTriadDistanceSquared, b2_minParticleSystemBufferCapacity, b2_barrierCollisionTime, b2_timeToSleep, b2_linearSleepTolerance, b2_angularSleepTolerance, b2Version, b2_version, b2_changelist;
    return {
        setters: [],
        execute: function () {
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
            ///#if B2_ENABLE_PARTICLE
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
            ///#endif
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7SUFFRixrQkFBeUIsU0FBa0IsRUFBRSxHQUFHLElBQVc7UUFDekQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFFBQVEsQ0FBQztTQUNWO0lBQ0gsQ0FBQzs7SUErSEQsb0JBQW9CO0lBRXBCLDZEQUE2RDtJQUM3RCxpQkFBd0IsSUFBWTtRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O0lBRUQsc0VBQXNFO0lBQ3RFLGdCQUF1QixHQUFRO0lBQy9CLENBQUM7O0lBRUQscUJBQXFCO0lBQ3JCLGVBQXNCLE9BQWUsRUFBRSxHQUFHLElBQVc7UUFDbkQsc0RBQXNEO1FBQ3RELDZEQUE2RDtRQUM3RCx3QkFBd0I7SUFDMUIsQ0FBQzs7SUF5QkQsb0JBQTJCLENBQVM7UUFDbEMsT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7O0lBRUQscUJBQTRCLENBQVM7UUFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDOztJQUVELHFCQUErQixNQUFjLEVBQUUsSUFBeUI7UUFDdEUsSUFBSSxDQUFDLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx5QkFBbUMsTUFBYztRQUMvQyxNQUFNLENBQUMsR0FBaUIsRUFBRSxDQUFDO1FBQzNCLEtBQUssSUFBSSxD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