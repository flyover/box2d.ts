export declare enum ParticleParameterOptions {
    OptionStrictContacts = 1,
    OptionDrawShapes = 2,
    OptionDrawParticles = 4,
    OptionDrawJoints = 8,
    OptionDrawAABBs = 16,
    OptionDrawContactPoints = 32,
    OptionDrawContactNormals = 64,
    OptionDrawContactImpulse = 128,
    OptionDrawFrictionImpulse = 256,
    OptionDrawCOMs = 512,
    OptionDrawStats = 1024,
    OptionDrawProfile = 2048,
}
export declare class ParticleParameterValue {
    /**
     * ParticleParameterValue of a particle parameter.
     */
    constructor(value: number, options: ParticleParameterOptions, name: string);
    /**
     * ParticleParameterValue associated with the parameter.
     */
    value: number;
    /**
     * Any global (non particle-specific) options associated with
     * this parameter
     */
    options: ParticleParameterOptions;
    /**
     * Name to display when this parameter is selected.
     */
    name: string;
}
export declare class ParticleParameterDefinition {
    /**
     * Particle parameter definition.
     */
    constructor(values: ParticleParameterValue[], numValues?: number);
    values: ParticleParameterValue[];
    numValues: number;
    CalculateValueMask(): number;
}
export declare class ParticleParameter {
    static k_DefaultOptions: ParticleParameterOptions;
    static k_particleTypes: ParticleParameterValue[];
    static k_defaultDefinition: ParticleParameterDefinition[];
    m_index: number;
    m_changed: boolean;
    m_restartOnChange: boolean;
    m_value: ParticleParameterValue;
    m_definition: ParticleParameterDefinition[];
    m_definitionCount: number;
    m_valueCount: number;
    constructor();
    Reset(): void;
    SetDefinition(definition: ParticleParameterDefinition[], definitionCount?: number): void;
    Get(): number;
    Set(index: number): void;
    Increment(): void;
    Decrement(): void;
    Changed(restart: boolean[]): boolean;
    GetValue(): number;
    GetName(): string;
    GetOptions(): ParticleParameterOptions;
    SetRestartOnChange(enable: boolean): void;
    GetRestartOnChange(): boolean;
    FindIndexByValue(value: number): number;
    FindParticleParameterValue(): ParticleParameterValue;
}
export declare namespace ParticleParameter {
    const Options: typeof ParticleParameterOptions;
    class Value extends ParticleParameterValue {
    }
    class Definition extends ParticleParameterDefinition {
    }
}
