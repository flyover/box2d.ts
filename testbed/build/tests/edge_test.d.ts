import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class EdgeTest extends testbed.Test {
    readonly m_offset1: box2d.b2Vec2;
    readonly m_offset2: box2d.b2Vec2;
    m_body1: box2d.b2Body | null;
    m_body2: box2d.b2Body | null;
    m_boxes: boolean;
    constructor();
    CreateBoxes(): void;
    CreateCircles(): void;
    UpdateUI(): void;
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=edge_test.d.ts.map