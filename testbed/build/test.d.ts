import * as box2d from "@box2d";
import { Settings } from "./settings.js";
import { FullScreenUI } from "./fullscreen_ui.js";
import { ParticleParameter, ParticleParameterValue, ParticleParameterDefinition } from "./particle_parameter.js";
export declare const DRAW_STRING_NEW_LINE: number;
export declare function RandomFloat(lo?: number, hi?: number): number;
export declare class TestEntry {
    name: string;
    createFcn: () => Test;
    constructor(name: string, createFcn: () => Test);
}
export declare class DestructionListener extends box2d.b2DestructionListener {
    test: Test;
    constructor(test: Test);
    SayGoodbyeJoint(joint: box2d.b2Joint): void;
    SayGoodbyeFixture(fixture: box2d.b2Fixture): void;
    SayGoodbyeParticleGroup(group: box2d.b2ParticleGroup): void;
}
export declare class ContactPoint {
    fixtureA: box2d.b2Fixture;
    fixtureB: box2d.b2Fixture;
    readonly normal: box2d.b2Vec2;
    readonly position: box2d.b2Vec2;
    state: box2d.b2PointState;
    normalImpulse: number;
    tangentImpulse: number;
    separation: number;
}
export declare class Test extends box2d.b2ContactListener {
    static readonly fullscreenUI: FullScreenUI;
    static readonly particleParameter: ParticleParameter;
    static readonly k_maxContactPoints: number;
    m_world: box2d.b2World;
    m_particleSystem: box2d.b2ParticleSystem;
    m_bomb: box2d.b2Body | null;
    m_textLine: number;
    m_mouseJoint: box2d.b2MouseJoint | null;
    readonly m_points: ContactPoint[];
    m_pointCount: number;
    m_destructionListener: DestructionListener;
    readonly m_bombSpawnPoint: box2d.b2Vec2;
    m_bombSpawning: boolean;
    readonly m_mouseWorld: box2d.b2Vec2;
    m_mouseTracing: boolean;
    readonly m_mouseTracerPosition: box2d.b2Vec2;
    readonly m_mouseTracerVelocity: box2d.b2Vec2;
    m_stepCount: number;
    readonly m_maxProfile: box2d.b2Profile;
    readonly m_totalProfile: box2d.b2Profile;
    m_groundBody: box2d.b2Body;
    m_particleParameters: ParticleParameterValue[] | null;
    m_particleParameterDef: ParticleParameterDefinition | null;
    constructor();
    JointDestroyed(joint: box2d.b2Joint): void;
    ParticleGroupDestroyed(group: box2d.b2ParticleGroup): void;
    BeginContact(contact: box2d.b2Contact): void;
    EndContact(contact: box2d.b2Contact): void;
    private static PreSolve_s_state1;
    private static PreSolve_s_state2;
    private static PreSolve_s_worldManifold;
    PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void;
    PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void;
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    SetTextLine(line: number): void;
    DrawTitle(title: string): void;
    MouseDown(p: box2d.b2Vec2): void;
    SpawnBomb(worldPt: box2d.b2Vec2): void;
    CompleteBombSpawn(p: box2d.b2Vec2): void;
    ShiftMouseDown(p: box2d.b2Vec2): void;
    MouseUp(p: box2d.b2Vec2): void;
    MouseMove(p: box2d.b2Vec2): void;
    LaunchBomb(): void;
    LaunchBombAt(position: box2d.b2Vec2, velocity: box2d.b2Vec2): void;
    Step(settings: Settings): void;
    ShiftOrigin(newOrigin: box2d.b2Vec2): void;
    GetDefaultViewZoom(): number;
    static readonly k_ParticleColors: box2d.b2Color[];
    static readonly k_ParticleColorsCount: number;
    /**
     * Apply a preset range of colors to a particle group.
     *
     * A different color out of k_ParticleColors is applied to each
     * particlesPerColor particles in the specified group.
     *
     * If particlesPerColor is 0, the particles in the group are
     * divided into k_ParticleColorsCount equal sets of colored
     * particles.
     */
    ColorParticleGroup(group: box2d.b2ParticleGroup, particlesPerColor: number): void;
    /**
     * Remove particle parameters matching "filterMask" from the set
     * of particle parameters available for this test.
     */
    InitializeParticleParameters(filterMask: number): void;
    /**
     * Restore default particle parameters.
     */
    RestoreParticleParameters(): void;
    /**
     * Set whether to restart the test on particle parameter
     * changes. This parameter is re-enabled when the test changes.
     */
    static SetRestartOnParticleParameterChange(enable: boolean): void;
    /**
     * Set the currently selected particle parameter value.  This
     * value must match one of the values in
     * Main::k_particleTypes or one of the values referenced by
     * particleParameterDef passed to SetParticleParameters().
     */
    static SetParticleParameterValue(value: number): number;
    /**
     * Get the currently selected particle parameter value and
     * enable particle parameter selection arrows on Android.
     */
    static GetParticleParameterValue(): number;
    /**
     * Override the default particle parameters for the test.
     */
    static SetParticleParameters(particleParameterDef: ParticleParameterDefinition[], particleParameterDefCount?: number): void;
}
//# sourceMappingURL=test.d.ts.map