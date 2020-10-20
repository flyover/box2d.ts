import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class Rope extends testbed.Test {
    readonly m_rope1: b2.Rope;
    readonly m_rope2: b2.Rope;
    readonly m_tuning1: b2.RopeTuning;
    readonly m_tuning2: b2.RopeTuning;
    m_iterations1: number;
    m_iterations2: number;
    readonly m_position1: b2.Vec2;
    readonly m_position2: b2.Vec2;
    m_speed: number;
    constructor();
    m_move_x: number;
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
