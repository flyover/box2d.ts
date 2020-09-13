import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class TimeOfImpact extends testbed.Test {
    m_shapeA: box2d.b2PolygonShape;
    m_shapeB: box2d.b2PolygonShape;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=time_of_impact.d.ts.map