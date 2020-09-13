import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class RopeJoint extends testbed.Test {
    m_ropeDef: box2d.b2RopeJointDef;
    m_rope: box2d.b2RopeJoint | null;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=rope_joint.d.ts.map