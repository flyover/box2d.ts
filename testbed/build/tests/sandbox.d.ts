import * as b2 from "@box2d";
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
export declare class SpecialParticleTracker extends b2.DestructionListener {
    /**
     * Set of particle handles used to track special particles.
     */
    m_particles: b2.ParticleHandle[];
    /**
     * Pointer to the world used to enable / disable this class as a
     * destruction listener.
     */
    m_world: b2.World;
    /**
     * Pointer to the particle system used to retrieve particle
     * handles.
     */
    m_particleSystem: b2.ParticleSystem;
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
    constructor(world: b2.World, system: b2.ParticleSystem);
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
    SayGoodbyeJoint(joint: b2.Joint): void;
    SayGoodbyeFixture(fixture: b2.Fixture): void;
    SayGoodbyeParticleGroup(group: b2.ParticleGroup): void;
    /**
     * When a particle is about to be destroyed, remove it from the
     * list of special particles as the handle will become invalid.
     */
    SayGoodbyeParticle(particleSystem: b2.ParticleSystem, index: number): void;
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
    readonly m_pumpForce: b2.Vec2;
    /**
     * The shape we will use for the killfield
     */
    m_killFieldShape: b2.PolygonShape;
    /**
     * Transform for the killfield shape
     */
    m_killFieldTransform: b2.Transform;
    /**
     * Pumps and emitters
     */
    readonly m_pumps: Array<b2.Body | null>;
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
    CreateBody(center: b2.Vec2, shape: b2.Shape, type: b2.BodyType): void;
    AddPump(center: b2.Vec2): void;
    AddFaucetEmitter(center: b2.Vec2, color: b2.Color): void;
    JointDestroyed(joint: b2.Joint): void;
    ParticleGroupDestroyed(group: b2.ParticleGroup): void;
    BeginContact(contact: b2.Contact): void;
    EndContact(contact: b2.Contact): void;
    PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void;
    PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse): void;
    /**
     * Allows you to set particle flags on devices with keyboards
     */
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    MouseDown(p: b2.Vec2): void;
    MouseUp(p: b2.Vec2): void;
    MouseMove(p: b2.Vec2): void;
    /**
     * Per-frame step updater overridden from Test
     */
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): Sandbox;
}
