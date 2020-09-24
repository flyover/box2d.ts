import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class TimeOfImpact extends testbed.Test {
    m_shapeA: b2.PolygonShape;
    m_shapeB: b2.PolygonShape;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
