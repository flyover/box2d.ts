import * as box2d from "@box2d";
export declare class EmittedParticleCallback {
    /**
     * Called for each created particle.
     */
    ParticleCreated(system: box2d.b2ParticleSystem, particleIndex: number): void;
}
/**
 * Emit particles from a circular region.
 */
export declare class RadialEmitter {
    /**
     * Pointer to global world
     */
    m_particleSystem: box2d.b2ParticleSystem | null;
    /**
     * Called for each created particle.
     */
    m_callback: EmittedParticleCallback | null;
    /**
     * Center of particle emitter
     */
    m_origin: box2d.b2Vec2;
    /**
     * Launch direction.
     */
    m_startingVelocity: box2d.b2Vec2;
    /**
     * Speed particles are emitted
     */
    m_speed: number;
    /**
     * Half width / height of particle emitter
     */
    m_halfSize: box2d.b2Vec2;
    /**
     * Particles per second
     */
    m_emitRate: number;
    /**
     * Initial color of particle emitted.
     */
    m_color: box2d.b2Color;
    /**
     * Number particles to emit on the next frame
     */
    m_emitRemainder: number;
    /**
     * Flags for created particles, see b2ParticleFlag.
     */
    m_flags: box2d.b2ParticleFlag;
    /**
     * Group to put newly created particles in.
     */
    m_group: box2d.b2ParticleGroup | null;
    /**
     * Calculate a random number 0.0..1.0.
     */
    static Random(): number;
    __dtor__(): void;
    /**
     * Set the center of the emitter.
     */
    SetPosition(origin: box2d.b2Vec2): void;
    /**
     * Get the center of the emitter.
     */
    GetPosition(out: box2d.b2Vec2): box2d.b2Vec2;
    /**
     * Set the size of the circle which emits particles.
     */
    SetSize(size: box2d.b2Vec2): void;
    /**
     * Get the size of the circle which emits particles.
     */
    GetSize(out: box2d.b2Vec2): box2d.b2Vec2;
    /**
     * Set the starting velocity of emitted particles.
     */
    SetVelocity(velocity: box2d.b2Vec2): void;
    /**
     * Get the starting velocity.
     */
    GetVelocity(out: box2d.b2Vec2): box2d.b2Vec2;
    /**
     * Set the speed of particles along the direction from the
     * center of the emitter.
     */
    SetSpeed(speed: number): void;
    /**
     * Get the speed of particles along the direction from the
     * center of the emitter.
     */
    GetSpeed(): number;
    /**
     * Set the flags for created particles.
     */
    SetParticleFlags(flags: box2d.b2ParticleFlag): void;
    /**
     * Get the flags for created particles.
     */
    GetParticleFlags(): box2d.b2ParticleFlag;
    /**
     * Set the color of particles.
     */
    SetColor(color: box2d.b2Color): void;
    /**
     * Get the color of particles emitter.
     */
    GetColor(out: box2d.b2Color): box2d.b2Color;
    /**
     * Set the emit rate in particles per second.
     */
    SetEmitRate(emitRate: number): void;
    /**
     * Get the current emit rate.
     */
    GetEmitRate(): number;
    /**
     * Set the particle system this emitter is adding particles to.
     */
    SetParticleSystem(particleSystem: box2d.b2ParticleSystem): void;
    /**
     * Get the particle system this emitter is adding particle to.
     */
    GetParticleSystem(): box2d.b2ParticleSystem | null;
    /**
     * Set the callback that is called on the creation of each
     * particle.
     */
    SetCallback(callback: EmittedParticleCallback): void;
    /**
     * Get the callback that is called on the creation of each
     * particle.
     */
    GetCallback(): EmittedParticleCallback | null;
    /**
     * This class sets the group flags to b2_particleGroupCanBeEmpty
     * so that it isn't destroyed and clears the
     * b2_particleGroupCanBeEmpty on the group when the emitter no
     * longer references it so that the group can potentially be
     * cleaned up.
     */
    SetGroup(group: box2d.b2ParticleGroup | null): void;
    /**
     * Get the group particles should be created within.
     */
    GetGroup(): box2d.b2ParticleGroup | null;
    /**
     * dt is seconds that have passed, particleIndices is an
     * optional pointer to an array which tracks which particles
     * have been created and particleIndicesCount is the size of the
     * particleIndices array. This function returns the number of
     * particles created during this simulation step.
     */
    Step(dt: number, particleIndices?: number[], particleIndicesCount?: number): number;
}
//# sourceMappingURL=particle_emitter.d.ts.map