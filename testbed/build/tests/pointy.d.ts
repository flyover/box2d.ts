import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
/**
 * Test behavior when particles fall on a convex ambigious Body
 * contact fixture junction.
 */
export declare class Pointy extends testbed.Test {
    m_killfieldShape: box2d.b2PolygonShape;
    m_killfieldTransform: box2d.b2Transform;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): Pointy;
}
//# sourceMappingURL=pointy.d.ts.map