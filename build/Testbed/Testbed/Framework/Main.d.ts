import * as box2d from "../../Box2D/Box2D";
import { Settings, Test } from "./Test";
import { FullScreenUI } from "./FullscreenUI";
import { ParticleParameter } from "./ParticleParameter";
export declare class Main {
    static fullscreenUI: FullScreenUI;
    static particleParameter: ParticleParameter;
    m_time_last: number;
    m_fps_time: number;
    m_fps_frames: number;
    m_fps: number;
    m_fps_div: HTMLDivElement;
    m_debug_div: HTMLDivElement;
    m_settings: Settings;
    m_test: Test;
    m_test_index: number;
    m_test_select: HTMLSelectElement;
    m_shift: boolean;
    m_ctrl: boolean;
    m_lMouseDown: boolean;
    m_rMouseDown: boolean;
    m_projection0: box2d.b2Vec2;
    m_viewCenter0: box2d.b2Vec2;
    m_demo_mode: boolean;
    m_demo_time: number;
    m_max_demo_time: number;
    m_canvas_div: HTMLDivElement;
    m_canvas: HTMLCanvasElement;
    m_ctx: CanvasRenderingContext2D;
    m_demo_button: HTMLInputElement;
    constructor();
    HomeCamera(): void;
    MoveCamera(move: box2d.b2Vec2): void;
    ZoomCamera(zoom: number): void;
    private m_mouse;
    HandleMouseMove(e: MouseEvent): void;
    HandleMouseDown(e: MouseEvent): void;
    HandleMouseUp(e: MouseEvent): void;
    HandleTouchMove(e: TouchEvent): void;
    HandleTouchStart(e: TouchEvent): void;
    HandleTouchEnd(e: TouchEvent): void;
    HandleMouseWheel(e: MouseWheelEvent): void;
    HandleKeyDown(e: KeyboardEvent): void;
    HandleKeyUp(e: KeyboardEvent): void;
    UpdateTest(time_elapsed: number): void;
    DecrementTest(): void;
    IncrementTest(): void;
    LoadTest(restartTest?: boolean): void;
    Pause(): void;
    SingleStep(): void;
    ToggleDemo(): void;
    SimulationLoop(): void;
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
    static SetParticleParameters(particleParameterDef: ParticleParameter.Definition[], particleParameterDefCount?: number): void;
}
