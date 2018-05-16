"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
function b2Assert(condition, ...args) {
    if (!condition) {
        debugger;
    }
}
exports.b2Assert = b2Assert;
exports.b2_maxFloat = 1E+37; // FLT_MAX instead of Number.MAX_VALUE;
exports.b2_epsilon = 1E-5; // FLT_EPSILON instead of Number.MIN_VALUE;
exports.b2_epsilon_sq = (exports.b2_epsilon * exports.b2_epsilon);
exports.b2_pi = 3.14159265359; // Math.PI;
/// @file
/// Global tuning constants based on meters-kilograms-seconds (MKS) units.
///
// Collision
/// The maximum number of contact points between two convex shapes. Do
/// not change this value.
exports.b2_maxManifoldPoints = 2;
/// The maximum number of vertices on a convex polygon. You cannot increase
/// this too much because b2BlockAllocator has a maximum object size.
exports.b2_maxPolygonVertices = 8;
/// This is used to fatten AABBs in the dynamic tree. This allows proxies
/// to move by a small amount without triggering a tree adjustment.
/// This is in meters.
exports.b2_aabbExtension = 0.1;
/// This is used to fatten AABBs in the dynamic tree. This is used to predict
/// the future position based on the current displacement.
/// This is a dimensionless multiplier.
exports.b2_aabbMultiplier = 2;
/// A small length used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
exports.b2_linearSlop = 0.008; // 0.005;
/// A small angle used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
exports.b2_angularSlop = 2 / 180 * exports.b2_pi;
/// The radius of the polygon/edge shape skin. This should not be modified. Making
/// this smaller means polygons will have an insufficient buffer for continuous collision.
/// Making it larger may create artifacts for vertex collision.
exports.b2_polygonRadius = 2 * exports.b2_linearSlop;
/// Maximum number of sub-steps per contact in continuous physics simulation.
exports.b2_maxSubSteps = 8;
// Dynamics
/// Maximum number of contacts to be handled to solve a TOI impact.
exports.b2_maxTOIContacts = 32;
/// A velocity threshold for elastic collisions. Any collision with a relative linear
/// velocity below this threshold will be treated as inelastic.
exports.b2_velocityThreshold = 1;
/// The maximum linear position correction used when solving constraints. This helps to
/// prevent overshoot.
exports.b2_maxLinearCorrection = 0.2;
/// The maximum angular position correction used when solving constraints. This helps to
/// prevent overshoot.
exports.b2_maxAngularCorrection = 8 / 180 * exports.b2_pi;
/// The maximum linear velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
exports.b2_maxTranslation = 2;
exports.b2_maxTranslationSquared = exports.b2_maxTranslation * exports.b2_maxTranslation;
/// The maximum angular velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
exports.b2_maxRotation = 0.5 * exports.b2_pi;
exports.b2_maxRotationSquared = exports.b2_maxRotation * exports.b2_maxRotation;
/// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
/// that overlap is removed in one time step. However using values close to 1 often lead
/// to overshoot.
exports.b2_baumgarte = 0.2;
exports.b2_toiBaumgarte = 0.75;
///#if B2_ENABLE_PARTICLE
// Particle
/// A symbolic constant that stands for particle allocation error.
exports.b2_invalidParticleIndex = -1;
exports.b2_maxParticleIndex = 0x7FFFFFFF;
/// The default distance between particles, multiplied by the particle diameter.
exports.b2_particleStride = 0.75;
/// The minimum particle weight that produces pressure.
exports.b2_minParticleWeight = 1.0;
/// The upper limit for particle pressure.
exports.b2_maxParticlePressure = 0.25;
/// The upper limit for force between particles.
exports.b2_maxParticleForce = 0.5;
/// The maximum distance between particles in a triad, multiplied by the particle diameter.
exports.b2_maxTriadDistance = 2.0;
exports.b2_maxTriadDistanceSquared = (exports.b2_maxTriadDistance * exports.b2_maxTriadDistance);
/// The initial size of particle data buffers.
exports.b2_minParticleSystemBufferCapacity = 256;
/// The time into the future that collisions against barrier particles will be detected.
exports.b2_barrierCollisionTime = 2.5;
///#endif
// Sleep
/// The time that a body must be still before it will go to sleep.
exports.b2_timeToSleep = 0.5;
/// A body cannot sleep if its linear velocity is above this tolerance.
exports.b2_linearSleepTolerance = 0.01;
/// A body cannot sleep if its angular velocity is above this tolerance.
exports.b2_angularSleepTolerance = 2 / 180 * exports.b2_pi;
// Memory Allocation
/// Implement this function to use your own memory allocator.
function b2Alloc(size) {
    return null;
}
exports.b2Alloc = b2Alloc;
/// If you implement b2Alloc, you should also implement this function.
function b2Free(mem) {
}
exports.b2Free = b2Free;
/// Logging function.
function b2Log(message, ...args) {
    // const args = Array.prototype.slice.call(arguments);
    // const str = goog.string.format.apply(null, args.slice(0));
    // console.log(message);
}
exports.b2Log = b2Log;
/// Version numbering scheme.
/// See http://en.wikipedia.org/wiki/Software_versioning
class b2Version {
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
}
exports.b2Version = b2Version;
/// Current version.
exports.b2_version = new b2Version(2, 3, 2);
exports.b2_changelist = 313;
function b2ParseInt(v) {
    return parseInt(v, 10);
}
exports.b2ParseInt = b2ParseInt;
function b2ParseUInt(v) {
    return Math.abs(parseInt(v, 10));
}
exports.b2ParseUInt = b2ParseUInt;
function b2MakeArray(length, init) {
    let a = [];
    for (let i = 0; i < length; ++i) {
        a.push(init(i));
    }
    return a;
}
exports.b2MakeArray = b2MakeArray;
function b2MakeNullArray(length) {
    const a = [];
    for (let i = 0; i < length; ++i) {
        a.push(null);
    }
    return a;
}
exports.b2MakeNullArray = b2MakeNullArray;
function b2MakeNumberArray(length, init = 0) {
    const a = [];
    for (let i = 0; i < length; ++i) {
        a.push(init);
    }
    return a;
}
exports.b2MakeNumberArray = b2MakeNumberArray;
//# sourceMappingURL=b2Settings.js.map