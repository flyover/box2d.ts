import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class EdgeTest extends testbed.Test {
    readonly m_offset1: b2.Vec2;
    readonly m_offset2: b2.Vec2;
    m_body1: b2.Body | null;
    m_body2: b2.Body | null;
    m_boxes: boolean;
    constructor();
    CreateBoxes(): void;
    CreateCircles(): void;
    UpdateUI(): void;
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
