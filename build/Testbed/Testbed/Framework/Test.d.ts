import * as box2d from "../../Box2D/Box2D";
import { ParticleParameter } from "./ParticleParameter";
export declare const DRAW_STRING_NEW_LINE: number;
export declare function RandomFloat(lo?: number, hi?: number): number;
export declare class Settings {
    hz: number;
    velocityIterations: number;
    positionIterations: number;
    particleIterations: number;
    drawShapes: boolean;
    drawParticles: boolean;
    drawJoints: boolean;
    drawAABBs: boolean;
    drawContactPoints: boolean;
    drawContactNormals: boolean;
    drawContactImpulse: boolean;
    drawFrictionImpulse: boolean;
    drawCOMs: boolean;
    drawControllers: boolean;
    drawStats: boolean;
    drawProfile: boolean;
    enableWarmStarting: boolean;
    enableContinuous: boolean;
    enableSubStepping: boolean;
    enableSleep: boolean;
    pause: boolean;
    singleStep: boolean;
    strictContacts: boolean;
}
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
    SayGoodbyeParticleGroup(group: any): void;
}
export declare class ContactPoint {
    fixtureA: box2d.b2Fixture;
    fixtureB: box2d.b2Fixture;
    normal: box2d.b2Vec2;
    position: box2d.b2Vec2;
    state: box2d.b2PointState;
    normalImpulse: number;
    tangentImpulse: number;
    separation: number;
}
export declare class Test extends box2d.b2ContactListener {
    static k_maxContactPoints: number;
    m_world: box2d.b2World;
    m_particleSystem: box2d.b2ParticleSystem;
    m_bomb: box2d.b2Body;
    m_textLine: number;
    m_mouseJoint: box2d.b2MouseJoint;
    m_points: ContactPoint[];
    m_pointCount: number;
    m_destructionListener: DestructionListener;
    m_bombSpawnPoint: box2d.b2Vec2;
    m_bombSpawning: boolean;
    m_mouseWorld: box2d.b2Vec2;
    m_mouseTracing: boolean;
    m_mouseTracerPosition: box2d.b2Vec2;
    m_mouseTracerVelocity: box2d.b2Vec2;
    m_stepCount: number;
    m_maxProfile: box2d.b2Profile;
    m_totalProfile: box2d.b2Profile;
    m_groundBody: box2d.b2Body;
    m_particleParameters: ParticleParameter.Value[];
    m_particleParameterDef: ParticleParameter.Definition;
    constructor();
    JointDestroyed(joint: box2d.b2Joint): void;
    ParticleGroupDestroyed(group: any): void;
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
    static k_ParticleColors: box2d.b2Color[];
    static k_ParticleColorsCount: number;
    /**
     * Apply a preset range of colors to a particle group.
     *
     * A different color out of k_ParticleColors is applied to each
     * particlesPerColor particles in the specified group.
     *
     * If particlesPerColor is 0, the particles in the group are
     * divided into k_ParticleColorsCount equal sets of colored
     * particles.
     *
     * @export
     * @return {void}
     * @param {box2d.b2ParticleGroup} group
     * @param {number} particlesPerColor
     */
    ColorParticleGroup(group: box2d.b2ParticleGroup, particlesPerColor: number): void;
    /**
     * Remove particle parameters matching "filterMask" from the set
     * of particle parameters available for this test.
     * @export
     * @return {void}
     * @param {number} filterMask
     */
    InitializeParticleParameters(filterMask: any): void;
    /**
     * Restore default particle parameters.
     * @export
     * @return void
     */
    RestoreParticleParameters(): void;
}
