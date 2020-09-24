import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Gears extends testbed.Test {
    m_joint1: b2.RevoluteJoint;
    m_joint2: b2.RevoluteJoint;
    m_joint3: b2.PrismaticJoint;
    m_joint4: b2.GearJoint;
    m_joint5: b2.GearJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
