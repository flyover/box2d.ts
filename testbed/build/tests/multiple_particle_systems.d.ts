import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class MultipleParticleSystems extends testbed.Test {
    m_particleSystem2: b2.ParticleSystem;
    m_emitters: testbed.RadialEmitter[];
    /**
     * Maximum number of particles per system.
     */
    static readonly k_maxParticleCount = 500;
    /**
     * Size of the box which is pushed around by particles.
     */
    static readonly k_dynamicBoxSize: b2.Vec2;
    /**
     * Mass of the box.
     */
    static readonly k_boxMass = 1;
    /**
     * Emit rate of the emitters in particles per second.
     */
    static readonly k_emitRate = 100;
    /**
     * Location of the left emitter (the position of the right one
     * is mirrored along the y-axis).
     */
    static readonly k_emitterPosition: b2.Vec2;
    /**
     * Starting velocity of particles from the left emitter (the
     * velocity of particles from the right emitter are mirrored
     * along the y-axis).
     */
    static readonly k_emitterVelocity: b2.Vec2;
    /**
     * Size of particle emitters.
     */
    static readonly k_emitterSize: b2.Vec2;
    /**
     * Color of the left emitter's particles.
     */
    static readonly k_leftEmitterColor: b2.Color;
    /**
     * Color of the right emitter's particles.
     */
    static readonly k_rightEmitterColor: b2.Color;
    constructor();
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): MultipleParticleSystems;
}
//# sourceMappingURL=multiple_particle_systems.d.ts.map