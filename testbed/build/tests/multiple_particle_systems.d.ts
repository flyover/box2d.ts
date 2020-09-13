import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class MultipleParticleSystems extends testbed.Test {
    m_particleSystem2: box2d.b2ParticleSystem;
    m_emitters: testbed.RadialEmitter[];
    /**
     * Maximum number of particles per system.
     */
    static readonly k_maxParticleCount = 500;
    /**
     * Size of the box which is pushed around by particles.
     */
    static readonly k_dynamicBoxSize: box2d.b2Vec2;
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
    static readonly k_emitterPosition: box2d.b2Vec2;
    /**
     * Starting velocity of particles from the left emitter (the
     * velocity of particles from the right emitter are mirrored
     * along the y-axis).
     */
    static readonly k_emitterVelocity: box2d.b2Vec2;
    /**
     * Size of particle emitters.
     */
    static readonly k_emitterSize: box2d.b2Vec2;
    /**
     * Color of the left emitter's particles.
     */
    static readonly k_leftEmitterColor: box2d.b2Color;
    /**
     * Color of the right emitter's particles.
     */
    static readonly k_rightEmitterColor: box2d.b2Color;
    constructor();
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): MultipleParticleSystems;
}
//# sourceMappingURL=multiple_particle_systems.d.ts.map