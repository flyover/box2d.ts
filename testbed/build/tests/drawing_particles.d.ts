import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class DrawingParticles extends testbed.Test {
    /**
     * Set bit 31 to distiguish these values from particle flags.
     */
    static readonly Parameters: {
        e_parameterBegin: number;
        e_parameterMove: number;
        e_parameterRigid: number;
        e_parameterRigidBarrier: number;
        e_parameterElasticBarrier: number;
        e_parameterSpringBarrier: number;
        e_parameterRepulsive: number;
    };
    m_lastGroup: box2d.b2ParticleGroup | null;
    m_drawing: boolean;
    m_particleFlags: number;
    m_groupFlags: number;
    m_colorIndex: number;
    static readonly k_paramValues: testbed.ParticleParameterValue[];
    static readonly k_paramDef: testbed.ParticleParameterDefinition[];
    static readonly k_paramDefCount: number;
    constructor();
    DetermineParticleParameter(): number;
    Keyboard(key: string): void;
    MouseMove(p: box2d.b2Vec2): void;
    MouseUp(p: box2d.b2Vec2): void;
    ParticleGroupDestroyed(group: box2d.b2ParticleGroup): void;
    SplitParticleGroups(): void;
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): DrawingParticles;
}
//# sourceMappingURL=drawing_particles.d.ts.map