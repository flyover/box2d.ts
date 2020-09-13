import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Pulleys extends testbed.Test {
    m_joint1: box2d.b2PulleyJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=pulleys.d.ts.map