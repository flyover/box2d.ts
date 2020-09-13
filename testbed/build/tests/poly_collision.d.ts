import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class PolyCollision extends testbed.Test {
    m_polygonA: box2d.b2PolygonShape;
    m_polygonB: box2d.b2PolygonShape;
    m_transformA: box2d.b2Transform;
    m_transformB: box2d.b2Transform;
    m_positionB: box2d.b2Vec2;
    m_angleB: number;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=poly_collision.d.ts.map