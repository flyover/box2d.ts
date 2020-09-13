import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class DistanceTest extends testbed.Test {
    m_positionB: box2d.b2Vec2;
    m_angleB: number;
    m_transformA: box2d.b2Transform;
    m_transformB: box2d.b2Transform;
    m_polygonA: box2d.b2PolygonShape;
    m_polygonB: box2d.b2PolygonShape;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=distance_test.d.ts.map