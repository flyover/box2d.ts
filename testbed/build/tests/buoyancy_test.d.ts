import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class BuoyancyTest extends testbed.Test {
    m_bodies: box2d.b2Body[];
    m_controller: box2d.b2BuoyancyController;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=buoyancy_test.d.ts.map