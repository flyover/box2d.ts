import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class SandboxParams {
    /**
     * Total possible pump squares
     */
    static readonly k_maxPumps: number;
    /**
     * Total possible emitters
     */
    static readonly k_maxEmitters: number;
    /**
     * Number of seconds to push one direction or the other on the
     * pumps
     */
    static readonly k_flipTime: number;
    /**
     * Radius of a tile
     */
    static readonly k_tileRadius: number;
    /**
     * Diameter of a tile
     */
    static readonly k_tileDiameter: number;
    /**
     * Pump radius; slightly smaller than a tile
     */
    static readonly k_pumpRadius: number;
    static readonly k_playfieldLeftEdge: number;
    static readonly k_playfieldRightEdge: number;
    static readonly k_playfieldBottomEdge: number;
    /**
     * The world size in the TILE
     */
    static readonly k_tileWidth: number;
    static readonly k_tileHeight: number;
    /**
     * Particles/second
     */
    static readonly k_defaultEmitterRate: number;
    /**
     * Fit cleanly inside one block
     */
    static readonly k_defaultEmitterSize: number;
    /**
     * How fast particles coming out of the particles should drop
     */
    static readonly k_particleExitSpeedY: number;
    /**
     * How hard the pumps can push
     */
    static readonly k_pumpForce: number;
    /**
     * Number of *special* particles.
     */
    static readonly k_numberOfSpecialParticles: number;
}
/**
 * Class which tracks a set of particles and applies a special
 * effect to them.
 */
export declare class SpecialParticleTracker extends box2d.b2DestructionListener {
    /**
     * Set of particle handles used to track special particles.
     */
    m_particles: box2d.b2ParticleHandle[];
    /**
     * Pointer to the world used to enable / disable this class as a
     * destruction listener.
     */
    m_world: box2d.b2World;
    /**
     * Pointer to the particle system used to retrieve particle
     * handles.
     */
    m_particleSystem: box2d.b2ParticleSystem;
    /**
     * Current offset into this.m_colorOscillationPeriod.
     */
    m_colorOscillationTime: number;
    /**
     * Color oscillation period in seconds.
     */
    m_colorOscillationPeriod: number;
    /**
     * Register this class as a destruction listener so that it's
     * possible to keep track of special particles.
     */
    constructor(world: box2d.b2World, system: box2d.b2ParticleSystem);
    __dtor__(): void;
    /**
     * Add as many of the specified particles to the set of special
     * particles.
     */
    Add(particleIndices: number[], numberOfParticles: number): void;
    /**
     * Apply effects to special particles.
     */
    Step(dt: number): void;
    SayGoodbyeJoint(joint: box2d.b2Joint): void;
    SayGoodbyeFixture(fixture: box2d.b2Fixture): void;
    SayGoodbyeParticleGroup(group: box2d.b2ParticleGroup): void;
    /**
     * When a particle is about to be destroyed, remove it from the
     * list of special particles as the handle will become invalid.
     */
    SayGoodbyeParticle(particleSystem: box2d.b2ParticleSystem, index: number): void;
}
/**
 * Sandbox test creates a maze of faucets, pumps, ramps,
 * circles, and blocks based on a string constant.  Please
 * modify and play with this string to make new mazes, and also
 * add new maze elements!
 */
export declare class Sandbox extends testbed.Test {
    /**
     * Count of faucets in the world
     */
    m_faucetEmitterIndex: number;
    /**
     * Count of pumps in the world
     */
    m_pumpIndex: number;
    /**
     * How long have we been pushing the pumps?
     */
    m_pumpTimer: number;
    /**
     * Particle creation flags
     */
    m_particleFlags: number;
    /**
     * Pump force
     */
    readonly m_pumpForce: box2d.b2Vec2;
    /**
     * The shape we will use for the killfield
     */
    m_killFieldShape: box2d.b2PolygonShape;
    /**
     * Transform for the killfield shape
     */
    m_killFieldTransform: box2d.b2Transform;
    /**
     * Pumps and emitters
     */
    readonly m_pumps: Array<box2d.b2Body | null>;
    readonly m_emitters: Array<testbed.RadialEmitter | null>;
    /**
     * Special particle tracker.
     */
    m_specialTracker: SpecialParticleTracker;
    static readonly k_paramValues: testbed.ParticleParameterValue[];
    static readonly k_paramDef: testbed.ParticleParameterDefinition[];
    static readonly k_paramDefCount: number;
    constructor();
    __dtor__(): void;
    SetupMaze(): void;
    CreateBody(center: box2d.b2Vec2, shape: box2d.b2Shape, type: box2d.b2BodyType): void;
    AddPump(center: box2d.b2Vec2): void;
    AddFaucetEmitter(center: box2d.b2Vec2, color: box2d.b2Color): void;
    JointDestroyed(joint: box2d.b2Joint): void;
    ParticleGroupDestroyed(group: box2d.b2ParticleGroup): void;
    BeginContact(contact: box2d.b2Contact): void;
    EndContact(contact: box2d.b2Contact): void;
    PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void;
    PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void;
    /**
     * Allows you to set particle flags on devices with keyboards
     */
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    MouseDown(p: box2d.b2Vec2): void;
    MouseUp(p: box2d.b2Vec2): void;
    MouseMove(p: box2d.b2Vec2): void;
    /**
     * Per-frame step updater overridden from Test
     */
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): Sandbox;
}
//# sourceMappingURL=sandbox.d.ts.map