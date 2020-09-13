import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ParticleContactDisabler extends box2d.b2ContactFilter {
    m_enableFixtureParticleCollisions: boolean;
    m_enableParticleParticleCollisions: boolean;
    ShouldCollideFixtureParticle(): boolean;
    ShouldCollideParticleParticle(): boolean;
}
export declare class ParticleCollisionFilter extends testbed.Test {
    constructor();
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    ToggleFixtureCollisions(): void;
    ToggleParticleCollisions(): void;
    m_contactDisabler: ParticleContactDisabler;
    m_particleGroup: box2d.b2ParticleGroup;
    static readonly kBoxSize = 10;
    static readonly kBoxSizeHalf: number;
    static readonly kOffset = 20;
    static readonly kParticlesContainerSize: number;
    static readonly kSpeedup = 8;
    static Create(): ParticleCollisionFilter;
}
//# sourceMappingURL=particle_collision_filter.d.ts.map