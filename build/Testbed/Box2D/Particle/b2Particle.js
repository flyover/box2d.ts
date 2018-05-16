"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
///#if B2_ENABLE_PARTICLE
const b2Settings_1 = require("../Common/b2Settings");
const b2Math_1 = require("../Common/b2Math");
const b2Draw_1 = require("../Common/b2Draw");
class b2ParticleDef {
    constructor() {
        this.flags = 0;
        this.position = new b2Math_1.b2Vec2();
        this.velocity = new b2Math_1.b2Vec2();
        this.color = new b2Draw_1.b2Color();
        this.lifetime = 0.0;
        this.userData = null;
        this.group = null;
    }
}
exports.b2ParticleDef = b2ParticleDef;
function b2CalculateParticleIterations(gravity, radius, timeStep) {
    // In some situations you may want more particle iterations than this,
    // but to avoid excessive cycle cost, don't recommend more than this.
    const B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS = 8;
    const B2_RADIUS_THRESHOLD = 0.01;
    const iterations = Math.ceil(Math.sqrt(gravity / (B2_RADIUS_THRESHOLD * radius)) * timeStep);
    return b2Math_1.b2Clamp(iterations, 1, B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS);
}
exports.b2CalculateParticleIterations = b2CalculateParticleIterations;
class b2ParticleHandle {
    constructor() {
        this.m_index = b2Settings_1.b2_invalidParticleIndex;
    }
    GetIndex() { return this.m_index; }
    SetIndex(index) { this.m_index = index; }
}
exports.b2ParticleHandle = b2ParticleHandle;
///#endif
//# sourceMappingURL=b2Particle.js.map