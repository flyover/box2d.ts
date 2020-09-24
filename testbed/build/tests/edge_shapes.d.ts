import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class EdgeShapesCallback extends b2.RayCastCallback {
    m_fixture: b2.Fixture | null;
    m_point: b2.Vec2;
    m_normal: b2.Vec2;
    ReportFixture(fixture: b2.Fixture, point: b2.Vec2, normal: b2.Vec2, fraction: number): number;
}
export declare class EdgeShapes extends testbed.Test {
    static readonly e_maxBodies = 256;
    m_bodyIndex: number;
    m_bodies: Array<b2.Body | null>;
    m_polygons: b2.PolygonShape[];
    m_circle: b2.CircleShape;
    m_angle: number;
    constructor();
    CreateBody(index: number): void;
    DestroyBody(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
