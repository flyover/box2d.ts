import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class RopeJoint extends testbed.Test {
    m_ropeDef: b2.RopeJointDef;
    m_rope: b2.RopeJoint | null;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
