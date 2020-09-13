import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class MotorJoint2 extends testbed.Test {
    constructor();
    m_joint: b2.MotorJoint;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=motor_joint2.d.ts.map