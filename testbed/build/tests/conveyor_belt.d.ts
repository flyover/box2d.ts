import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ConveyorBelt extends testbed.Test {
    m_platform: box2d.b2Fixture;
    constructor();
    PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=conveyor_belt.d.ts.map