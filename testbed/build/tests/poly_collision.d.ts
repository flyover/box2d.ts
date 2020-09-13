import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class PolyCollision extends testbed.Test {
    m_polygonA: b2.PolygonShape;
    m_polygonB: b2.PolygonShape;
    m_transformA: b2.Transform;
    m_transformB: b2.Transform;
    m_positionB: b2.Vec2;
    m_angleB: number;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=poly_collision.d.ts.map