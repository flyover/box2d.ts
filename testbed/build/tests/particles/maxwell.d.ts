import * as b2 from "@box2d";
import * as testbed from "@testbed";
/**
 * Game which adds some fun to Maxwell's demon.
 *
 * http://en.wikipedia.org/wiki/Maxwell's_demon
 *
 * The user's goal is to try to catch as many particles as
 * possible in the bottom half of the container by splitting the
 * container using a barrier with the 'a' key.
 *
 * See Maxwell::Keyboard() for other controls.
 */
export declare class Maxwell extends testbed.Test {
    m_density: number;
    m_position: number;
    m_temperature: number;
    m_barrierBody: b2.Body | null;
    m_particleGroup: b2.ParticleGroup | null;
    static readonly k_containerWidth = 2;
    static readonly k_containerHeight = 4;
    static readonly k_containerHalfWidth: number;
    static readonly k_containerHalfHeight: number;
    static readonly k_barrierHeight: number;
    static readonly k_barrierMovementIncrement: number;
    static readonly k_densityStep = 1.25;
    static readonly k_densityMin = 0.01;
    static readonly k_densityMax = 0.8;
    static readonly k_densityDefault = 0.25;
    static readonly k_temperatureStep = 0.2;
    static readonly k_temperatureMin = 0.4;
    static readonly k_temperatureMax = 10;
    static readonly k_temperatureDefault = 5;
    constructor();
    /**
     * Disable the barrier.
     */
    DisableBarrier(): void;
    /**
     * Enable the barrier.
     */
    EnableBarrier(): void;
    /**
     * Enable / disable the barrier.
     */
    ToggleBarrier(): void;
    /**
     * Destroy and recreate all particles.
     */
    ResetParticles(): void;
    Keyboard(key: string): void;
    /**
     * Determine whether a point is in the container.
     */
    InContainer(p: b2.Vec2): boolean;
    MouseDown(p: b2.Vec2): void;
    MouseUp(p: b2.Vec2): void;
    Step(settings: testbed.Settings): void;
    /**
     * Reset the particles and the barrier.
     */
    Reset(): void;
    /**
     * Move the divider / barrier.
     */
    MoveDivider(newPosition: number): void;
    GetDefaultViewZoom(): number;
    static Create(): Maxwell;
}
export declare const testIndex: number;
