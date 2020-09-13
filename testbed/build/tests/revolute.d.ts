import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Revolute extends testbed.Test {
    m_ball: b2.Body;
    m_joint: b2.RevoluteJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=revolute.d.ts.map