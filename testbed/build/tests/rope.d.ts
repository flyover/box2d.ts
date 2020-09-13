import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Rope extends testbed.Test {
    readonly m_rope1: box2d.b2Rope;
    readonly m_rope2: box2d.b2Rope;
    readonly m_tuning1: box2d.b2RopeTuning;
    readonly m_tuning2: box2d.b2RopeTuning;
    m_iterations1: number;
    m_iterations2: number;
    readonly m_position1: box2d.b2Vec2;
    readonly m_position2: box2d.b2Vec2;
    m_speed: number;
    constructor();
    m_move_x: number;
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=rope.d.ts.map