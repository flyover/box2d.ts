import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Web extends testbed.Test {
    m_bodies: Array<b2.Body | null>;
    m_joints: Array<b2.Joint | null>;
    constructor();
    JointDestroyed(joint: b2.Joint): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=web.d.ts.map