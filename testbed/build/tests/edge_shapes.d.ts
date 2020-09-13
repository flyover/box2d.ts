import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class EdgeShapesCallback extends box2d.b2RayCastCallback {
    m_fixture: box2d.b2Fixture | null;
    m_point: box2d.b2Vec2;
    m_normal: box2d.b2Vec2;
    ReportFixture(fixture: box2d.b2Fixture, point: box2d.b2Vec2, normal: box2d.b2Vec2, fraction: number): number;
}
export declare class EdgeShapes extends testbed.Test {
    static readonly e_maxBodies = 256;
    m_bodyIndex: number;
    m_bodies: Array<box2d.b2Body | null>;
    m_polygons: box2d.b2PolygonShape[];
    m_circle: box2d.b2CircleShape;
    m_angle: number;
    constructor();
    CreateBody(index: number): void;
    DestroyBody(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=edge_shapes.d.ts.map