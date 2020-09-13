import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
/**
 * This callback is called by box2d.b2World::QueryAABB. We find
 * all the fixtures that overlap an AABB. Of those, we use
 * b2TestOverlap to determine which fixtures overlap a circle.
 * Up to 4 overlapped fixtures will be highlighted with a yellow
 * border.
 */
export declare class PolyShapesCallback extends box2d.b2QueryCallback {
    static readonly e_maxCount = 4;
    m_circle: box2d.b2CircleShape;
    m_transform: box2d.b2Transform;
    m_count: number;
    ReportFixture(fixture: box2d.b2Fixture): boolean;
}
export declare class PolyShapes extends testbed.Test {
    static readonly e_maxBodies = 256;
    m_bodyIndex: number;
    m_bodies: Array<box2d.b2Body | null>;
    m_polygons: box2d.b2PolygonShape[];
    m_circle: box2d.b2CircleShape;
    constructor();
    CreateBody(index: number): void;
    DestroyBody(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=poly_shapes.d.ts.map