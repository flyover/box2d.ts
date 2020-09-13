import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class MotorJoint2 extends testbed.Test {
    constructor();
    m_joint: box2d.b2MotorJoint;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=motor_joint2.d.ts.map