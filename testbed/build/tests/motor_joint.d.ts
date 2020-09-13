import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class MotorJoint extends testbed.Test {
    m_joint: box2d.b2MotorJoint;
    m_time: number;
    m_go: boolean;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=motor_joint.d.ts.map