import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class EyeCandy extends testbed.Test {
    m_mover: b2.Body;
    m_joint: b2.RevoluteJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): EyeCandy;
}
//# sourceMappingURL=eye_candy.d.ts.map