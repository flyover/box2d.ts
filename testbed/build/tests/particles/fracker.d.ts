import * as b2 from "@box2d";
import * as testbed from "@testbed";
/**
 * Tracks instances of RadialEmitter and destroys them after a
 * specified period of time.
 */
export declare class EmitterTracker {
    m_emitterLifetime: Array<{
        emitter: testbed.RadialEmitter;
        lifetime: number;
    }>;
    /**
     * Delete all emitters.
     */
    __dtor__(): void;
    /**
     * Add an emitter to the tracker.
     * This assumes emitter was allocated using "new" and ownership
     * of the object is handed to this class.
     */
    Add(emitter: testbed.RadialEmitter, lifetime: number): void;
    /**
     * Update all emitters destroying those who are too old.
     */
    Step(dt: number): void;
}
/**
 * Keep track of particle groups in a set, removing them when
 * they're destroyed.
 */
export declare class ParticleGroupTracker extends b2.DestructionListener {
    m_particleGroups: b2.ParticleGroup[];
    /**
     * Called when any particle group is about to be destroyed.
     */
    SayGoodbyeParticleGroup(group: b2.ParticleGroup): void;
    /**
     * Add a particle group to the tracker.
     */
    AddParticleGroup(group: b2.ParticleGroup): void;
    /**
     * Remove a particle group from the tracker.
     */
    RemoveParticleGroup(group: b2.ParticleGroup): void;
    GetParticleGroups(): b2.ParticleGroup[];
}
export declare class FrackerSettings {
    /**
     * Width and height of the world in tiles.
     */
    static readonly k_worldWidthTiles = 24;
    static readonly k_worldHeightTiles = 16;
    /**
     * Total number of tiles.
     */
    static readonly k_worldTiles: number;
    /**
     * Center of the world in world coordinates.
     */
    static readonly k_worldCenterX = 0;
    static readonly k_worldCenterY = 2;
    /**
     * Size of each tile in world units.
     */
    static readonly k_tileWidth = 0.2;
    static readonly k_tileHeight = 0.2;
    /**
     * Half width and height of tiles in world units.
     */
    static readonly k_tileHalfWidth: number;
    static readonly k_tileHalfHeight: number;
    /**
     * Half width and height of the world in world coordinates.
     */
    static readonly k_worldHalfWidth: number;
    static readonly k_worldHalfHeight: number;
    /**
     * Colors of tiles.
     */
    static readonly k_playerColor: b2.Color;
    static readonly k_playerFrackColor: b2.Color;
    static readonly k_wellColor: b2.Color;
    static readonly k_oilColor: b2.Color;
    static readonly k_waterColor: b2.Color;
    static readonly k_frackingFluidColor: b2.Color;
    /**
     * Default density of each body.
     */
    static readonly k_density = 0.1;
    /**
     * Radius of oil / water / fracking fluid particles.
     */
    static readonly k_particleRadius: number;
    /**
     * Probability (0..100%) of generating each tile (must sum to
     * 1.0).
     */
    static readonly k_dirtProbability = 80;
    static readonly k_emptyProbability = 10;
    static readonly k_oilProbability = 7;
    static readonly k_waterProbability = 3;
    /**
     * Lifetime of a fracking fluid emitter in seconds.
     */
    static readonly k_frackingFluidEmitterLifetime = 5;
    /**
     * Speed particles are sucked up the well.
     */
    static readonly k_wellSuckSpeedInside: number;
    /**
     * Speed particle are sucket towards the well bottom.
     */
    static readonly k_wellSuckSpeedOutside: number;
    /**
     * Time mouse button must be held before emitting fracking
     * fluid.
     */
    static readonly k_frackingFluidChargeTime = 1;
    /**
     * Scores.
     */
    static readonly k_scorePerOilParticle = 1;
    static readonly k_scorePerWaterParticle = -1;
    static readonly k_scorePerFrackingParticle = 0;
    static readonly k_scorePerFrackingDeployment = -10;
}
/**
 * Oil Fracking simulator.
 *
 * Dig down to move the oil (red) to the well (gray). Try not to
 * contaminate the ground water (blue). To deploy fracking fluid
 * press 'space'.  Fracking fluid can be used to push other
 * fluids to the well head and ultimately score points.
 */
export declare class Fracker extends testbed.Test {
    m_player: b2.Body;
    m_wellX: number;
    m_wellTop: number;
    m_wellBottom: number;
    m_tracker: EmitterTracker;
    m_allowInput: boolean;
    m_frackingFluidChargeTime: number;
    m_material: Fracker_Material[];
    m_bodies: Array<b2.Body | null>;
    /**
     * Set of particle groups the well has influence over.
     */
    m_listener: Fracker_DestructionListener;
    constructor();
    __dtor__(): void;
    /**
     * Initialize the data structures used to track the material in
     * each tile and the bodies associated with each tile.
     */
    InitializeLayout(): void;
    /**
     * Get the material of the tile at the specified tile position.
     */
    GetMaterial(x: number, y: number): Fracker_Material;
    /**
     * Set the material of the tile at the specified tile position.
     */
    SetMaterial(x: number, y: number, material: Fracker_Material): void;
    /**
     * Get the body associated with the specified tile position.
     */
    GetBody(x: number, y: number): b2.Body | null;
    /**
     * Set the body associated with the specified tile position.
     */
    SetBody(x: number, y: number, body: b2.Body | null): void;
    /**
     * Create the player.
     */
    CreatePlayer(): void;
    /**
     * Create the geography / features of the world.
     */
    CreateGeo(): void;
    /**
     * Create the boundary of the world.
     */
    CreateGround(): void;
    /**
     * Create a dirt block at the specified world position.
     */
    CreateDirtBlock(x: number, y: number): void;
    /**
     * Create particles in a tile with resources.
     */
    CreateReservoirBlock(x: number, y: number, material: Fracker_Material): void;
    /**
     * Create a well and the region which applies negative pressure
     * to suck out fluid.
     */
    CreateWell(): void;
    /**
     * Create a fracking fluid emitter.
     */
    CreateFrackingFluidEmitter(position: b2.Vec2): void;
    /**
     * Update the player's position.
     */
    SetPlayerPosition(playerX: number, playerY: number): void;
    /**
     * Try to deploy fracking fluid at the player's position,
     * returning true if successful.
     */
    DeployFrackingFluid(): boolean;
    /**
     * Destroy all particles in the box specified by a set of tile
     * coordinates.
     */
    DestroyParticlesInTiles(startX: number, startY: number, endX: number, endY: number): void;
    JointDestroyed(joint: b2.Joint): void;
    ParticleGroupDestroyed(group: b2.ParticleGroup): void;
    BeginContact(contact: b2.Contact): void;
    EndContact(contact: b2.Contact): void;
    PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void;
    PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse): void;
    /**
     * a = left, d = right, a = up, s = down, e = deploy fracking
     * fluid.
     */
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    MouseDown(p: b2.Vec2): void;
    /**
     * Try to deploy the fracking fluid or move the player.
     */
    MouseUp(p: b2.Vec2): void;
    MouseMove(p: b2.Vec2): void;
    Step(settings: testbed.Settings): void;
    /**
     * Render the well.
     */
    DrawWell(): void;
    /**
     * Render the player / fracker.
     */
    DrawPlayer(): void;
    /**
     * Render the score and the instructions / keys.
     */
    DrawScore(): void;
    /**
     * Draw a quad at position of color that is either just an
     * outline (fill = false) or solid (fill = true).
     */
    DrawQuad(position: b2.Vec2, color: b2.Color, fill?: boolean): void;
    GetDefaultViewZoom(): number;
    static Create(): testbed.Test;
    /**
     * Get the bottom left position of the world in world units.
     */
    static GetBottomLeft(bottomLeft: b2.Vec2): void;
    /**
     * Get the extents of the world in world units.
     */
    static GetExtents(bottomLeft: b2.Vec2, topRight: b2.Vec2): void;
    static WorldToTile(position: b2.Vec2, x: [number], y: [number]): void;
    /**
     * Convert a tile position to a point  in world coordinates.
     */
    static TileToWorld(x: number, y: number, out?: b2.Vec2): b2.Vec2;
    /**
     * Calculate the offset within an array of all world tiles using
     * the specified tile coordinates.
     */
    static TileToArrayOffset(x: number, y: number): number;
    /**
     * Calculate the center of a tile position in world units.
     */
    static CenteredPosition(position: b2.Vec2, out?: b2.Vec2): b2.Vec2;
    /**
     * Interpolate between color a and b using t.
     */
    static LerpColor(a: b2.Color, b: b2.Color, t: number): b2.Color;
    /**
     * Interpolate between a and b using t.
     */
    static Lerp(a: number, b: number, t: number): number;
}
/**
 * Type of material in a tile.
 */
export declare enum Fracker_Material {
    EMPTY = 0,
    DIRT = 1,
    ROCK = 2,
    OIL = 3,
    WATER = 4,
    WELL = 5,
    PUMP = 6
}
/**
 * Keep track of particle groups which are drawn up the well and
 * tracks the score of the game.
 */
export declare class Fracker_DestructionListener extends ParticleGroupTracker {
    m_score: number;
    m_oil: number;
    m_world: b2.World;
    m_previousListener: b2.DestructionListener | null;
    /**
     * Initialize the score.
     */
    __ctor__(): void;
    /**
     * Initialize the particle system and world, setting this class
     * as a destruction listener for the world.
     */
    constructor(world: b2.World);
    __dtor__(): void;
    /**
     * Add to the current score.
     */
    AddScore(score: number): void;
    /**
     * Get the current score.
     */
    GetScore(): number;
    /**
     * Add to the remaining oil.
     */
    AddOil(oil: number): void;
    /**
     * Get the total oil.
     */
    GetOil(): number;
    /**
     * Update the score when certain particles are destroyed.
     */
    SayGoodbyeParticle(particleSystem: b2.ParticleSystem, index: number): void;
}
export declare const testIndex: number;
