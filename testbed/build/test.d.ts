import * as b2 from "@box2d";
import { Settings } from "./settings.js";
import { FullScreenUI } from "./fullscreen_ui.js";
import { ParticleParameter, ParticleParameterValue, ParticleParameterDefinition } from "./particle_parameter.js";
export declare const DRAW_STRING_NEW_LINE: number;
export declare function RandomFloat(lo?: number, hi?: number): number;
export declare class TestEntry {
    category: string;
    name: string;
    createFcn: () => Test;
    constructor(category: string, name: string, createFcn: () => Test);
}
export declare const g_testEntries: TestEntry[];
export declare function RegisterTest(category: string, name: string, fcn: () => Test): number;
export declare class DestructionListener extends b2.DestructionListener {
    test: Test;
    constructor(test: Test);
    SayGoodbyeJoint(joint: b2.Joint): void;
    SayGoodbyeFixture(fixture: b2.Fixture): void;
    SayGoodbyeParticleGroup(group: b2.ParticleGroup): void;
}
export declare class ContactPoint {
    fixtureA: b2.Fixture;
    fixtureB: b2.Fixture;
    readonly normal: b2.Vec2;
    readonly position: b2.Vec2;
    state: b2.PointState;
    normalImpulse: number;
    tangentImpulse: number;
    separation: number;
}
export declare class Test extends b2.ContactListener {
    static readonly fullscreenUI: FullScreenUI;
    static readonly particleParameter: ParticleParameter;
    static readonly k_maxContactPoints: number;
    m_world: b2.World;
    m_particleSystem: b2.ParticleSystem;
    m_bomb: b2.Body | null;
    m_textLine: number;
    m_mouseJoint: b2.MouseJoint | null;
    readonly m_points: ContactPoint[];
    m_pointCount: number;
    m_destructionListener: DestructionListener;
    readonly m_bombSpawnPoint: b2.Vec2;
    m_bombSpawning: boolean;
    readonly m_mouseWorld: b2.Vec2;
    m_mouseTracing: boolean;
    readonly m_mouseTracerPosition: b2.Vec2;
    readonly m_mouseTracerVelocity: b2.Vec2;
    m_stepCount: number;
    readonly m_maxProfile: b2.Profile;
    readonly m_totalProfile: b2.Profile;
    m_groundBody: b2.Body;
    m_particleParameters: ParticleParameterValue[] | null;
    m_particleParameterDef: ParticleParameterDefinition | null;
    constructor();
    JointDestroyed(joint: b2.Joint): void;
    ParticleGroupDestroyed(group: b2.ParticleGroup): void;
    BeginContact(contact: b2.Contact): void;
    EndContact(contact: b2.Contact): void;
    private static PreSolve_s_state1;
    private static PreSolve_s_state2;
    private static PreSolve_s_worldManifold;
    PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void;
    PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse): void;
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    SetTextLine(line: number): void;
    DrawTitle(title: string): void;
    MouseDown(p: b2.Vec2): void;
    SpawnBomb(worldPt: b2.Vec2): void;
    CompleteBombSpawn(p: b2.Vec2): void;
    ShiftMouseDown(p: b2.Vec2): void;
    MouseUp(p: b2.Vec2): void;
    MouseMove(p: b2.Vec2): void;
    LaunchBomb(): void;
    LaunchBombAt(position: b2.Vec2, velocity: b2.Vec2): void;
    Step(settings: Settings): void;
    ShiftOrigin(newOrigin: b2.Vec2): void;
    GetDefaultViewZoom(): number;
    static readonly k_ParticleColors: b2.Color[];
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
    ColorParticleGroup(group: b2.ParticleGroup, particlesPerColor: number): void;
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
