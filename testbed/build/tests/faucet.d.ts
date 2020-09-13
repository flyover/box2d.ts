import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ParticleLifetimeRandomizer extends testbed.EmittedParticleCallback {
    m_minLifetime: number;
    m_maxLifetime: number;
    constructor(minLifetime: number, maxLifetime: number);
    /**
     * Called for each created particle.
     */
    ParticleCreated(system: box2d.b2ParticleSystem, particleIndex: number): void;
}
/**
 * Faucet test creates a container from boxes and continually
 * spawning particles with finite lifetimes that pour into the
 * box.
 */
export declare class Faucet extends testbed.Test {
    /**
     * Used to cycle through particle colors.
     */
    m_particleColorOffset: number;
    /**
     * Particle emitter.
     */
    m_emitter: testbed.RadialEmitter;
    /**
     * Callback which sets the lifetime of emitted particles.
     */
    m_lifetimeRandomizer: ParticleLifetimeRandomizer;
    /**
     * Minimum lifetime of particles in seconds.
     */
    static readonly k_particleLifetimeMin = 30;
    /**
     * Maximum lifetime of particles in seconds.
     */
    static readonly k_particleLifetimeMax = 50;
    /**
     * Height of the container.
     */
    static readonly k_containerHeight = 0.2;
    /**
     * Width of the container.
     */
    static readonly k_containerWidth = 1;
    /**
     * Thickness of the container's walls and bottom.
     */
    static readonly k_containerThickness = 0.05;
    /**
     * Width of the faucet relative to the container width.
     */
    static readonly k_faucetWidth = 0.1;
    /**
     * Height of the faucet relative to the base as a fraction of
     * the container height.
     */
    static readonly k_faucetHeight = 15;
    /**
     * Length of the faucet as a fraction of the particle diameter.
     */
    static readonly k_faucetLength = 2;
    /**
     * Spout height as a fraction of the faucet length.  This should
     * be greater than 1.0f).
     */
    static readonly k_spoutLength = 2;
    /**
     * Spout width as a fraction of the *faucet* width.  This should
     * be greater than 1.0).
     */
    static readonly k_spoutWidth = 1.1;
    /**
     * Maximum number of particles in the system.
     */
    static readonly k_maxParticleCount = 1000;
    /**
     * Factor that is used to increase / decrease the emit rate.
     * This should be greater than 1.0.
     */
    static readonly k_emitRateChangeFactor = 1.05;
    /**
     * Minimum emit rate of the faucet in particles per second.
     */
    static readonly k_emitRateMin = 1;
    /**
     * Maximum emit rate of the faucet in particles per second.
     */
    static readonly k_emitRateMax = 240;
    /**
     * Selection of particle types for this test.
     */
    static readonly k_paramValues: testbed.ParticleParameterValue[];
    static readonly k_paramDef: testbed.ParticleParameterDefinition[];
    static readonly k_paramDefCount: number;
    constructor();
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    GetDefaultViewZoom(): number;
    /**
     * Create the faucet test.
     */
    static Create(): Faucet;
}
//# sourceMappingURL=faucet.d.ts.map