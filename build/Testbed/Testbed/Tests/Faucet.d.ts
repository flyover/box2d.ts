import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";
import { ParticleParameter } from "../Framework/ParticleParameter";
import { EmittedParticleCallback, RadialEmitter } from "../Framework/ParticleEmitter";
export declare class ParticleLifetimeRandomizer extends EmittedParticleCallback {
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
    m_emitter: RadialEmitter;
    /**
     * Callback which sets the lifetime of emitted particles.
     */
    m_lifetimeRandomizer: ParticleLifetimeRandomizer;
    /**
     * Minimum lifetime of particles in seconds.
     */
    static k_particleLifetimeMin: number;
    /**
     * Maximum lifetime of particles in seconds.
     */
    static k_particleLifetimeMax: number;
    /**
     * Height of the container.
     */
    static k_containerHeight: number;
    /**
     * Width of the container.
     */
    static k_containerWidth: number;
    /**
     * Thickness of the container's walls and bottom.
     */
    static k_containerThickness: number;
    /**
     * Width of the faucet relative to the container width.
     */
    static k_faucetWidth: number;
    /**
     * Height of the faucet relative to the base as a fraction of
     * the container height.
     */
    static k_faucetHeight: number;
    /**
     * Length of the faucet as a fraction of the particle diameter.
     */
    static k_faucetLength: number;
    /**
     * Spout height as a fraction of the faucet length.  This should
     * be greater than 1.0f).
     */
    static k_spoutLength: number;
    /**
     * Spout width as a fraction of the *faucet* width.  This should
     * be greater than 1.0).
     */
    static k_spoutWidth: number;
    /**
     * Maximum number of particles in the system.
     */
    static k_maxParticleCount: number;
    /**
     * Factor that is used to increase / decrease the emit rate.
     * This should be greater than 1.0.
     */
    static k_emitRateChangeFactor: number;
    /**
     * Minimum emit rate of the faucet in particles per second.
     */
    static k_emitRateMin: number;
    /**
     * Maximum emit rate of the faucet in particles per second.
     */
    static k_emitRateMax: number;
    /**
     * Selection of particle types for this test.
     */
    static k_paramValues: ParticleParameter.Value[];
    static k_paramDef: ParticleParameter.Definition[];
    static k_paramDefCount: number;
    constructor();
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    GetDefaultViewZoom(): number;
    /**
     * Create the faucet test.
     */
    static Create(): Faucet;
}
