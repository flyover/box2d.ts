import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class ShapeCast extends testbed.Test {
    static e_vertexCount: number;
    readonly m_vAs: b2.Vec2[];
    m_countA: number;
    m_radiusA: number;
    readonly m_vBs: b2.Vec2[];
    m_countB: number;
    m_radiusB: number;
    readonly m_transformA: b2.Transform;
    readonly m_transformB: b2.Transform;
    readonly m_translationB: b2.Vec2;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
