import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class ShapeCast extends testbed.Test {
    static e_vertexCount: number;
    m_vAs: b2.Vec2[];
    m_countA: number;
    m_radiusA: number;
    m_vBs: b2.Vec2[];
    m_countB: number;
    m_radiusB: number;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
