import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class BuoyancyTest extends testbed.Test {
    m_bodies: b2.Body[];
    m_controller: b2.BuoyancyController;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=buoyancy_test.d.ts.map