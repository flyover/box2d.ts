import * as b2 from "@box2d";
import * as testbed from "@testbed";
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
    m_lastGroup: b2.ParticleGroup | null;
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
    MouseMove(p: b2.Vec2): void;
    MouseUp(p: b2.Vec2): void;
    ParticleGroupDestroyed(group: b2.ParticleGroup): void;
    SplitParticleGroups(): void;
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): DrawingParticles;
}
export declare const testIndex: number;
