import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
/**
 * This callback is called by b2.World::QueryAABB. We find
 * all the fixtures that overlap an AABB. Of those, we use
 * b2TestOverlap to determine which fixtures overlap a circle.
 * Up to 4 overlapped fixtures will be highlighted with a yellow
 * border.
 */
export declare class PolyShapesCallback extends b2.QueryCallback {
    static readonly e_maxCount = 4;
    m_circle: b2.CircleShape;
    m_transform: b2.Transform;
    m_count: number;
    ReportFixture(fixture: b2.Fixture): boolean;
}
export declare class PolyShapes extends testbed.Test {
    static readonly e_maxBodies = 256;
    m_bodyIndex: number;
    m_bodies: Array<b2.Body | null>;
    m_polygons: b2.PolygonShape[];
    m_circle: b2.CircleShape;
    constructor();
    CreateBody(index: number): void;
    DestroyBody(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
