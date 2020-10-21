import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class PulleyJoint extends testbed.Test {
    m_joint1: b2.PulleyJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
