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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7SUFFRixrQkFBeUIsU0FBa0IsRUFBRSxHQUFHLElBQVc7UUFDekQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFFBQVEsQ0FBQztTQUNWO0lBQ0gsQ0FBQzs7SUErSEQsb0JBQW9CO0lBRXBCLDZEQUE2RDtJQUM3RCxpQkFBd0IsSUFBWTtRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O0lBRUQsc0VBQXNFO0lBQ3RFLGdCQUF1QixHQUFRO0lBQy9CLENBQUM7O0lBRUQscUJBQXFCO0lBQ3JCLGVBQXNCLE9BQWUsRUFBRSxHQUFHLElBQVc7UUFDbkQsc0RBQXNEO1FBQ3RELDZEQUE2RDtRQUM3RCx3QkFBd0I7SUFDMUIsQ0FBQzs7SUF5QkQsb0JBQTJCLENBQVM7UUFDbEMsT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7O0lBRUQscUJBQTRCLENBQVM7UUFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDOztJQUVELHFCQUE0QixNQUFjLEVBQUUsSUFBMkI7UUFDckUsSUFBSSxDQUFDLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx5QkFBZ0MsTUFBYztRQUM1QyxNQUFNLENBQUMsR0FBVSxFQUFFLENBQUM7UUFDcEIsS0FBSyxJQUFJLENB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