import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Gears extends testbed.Test {
    m_joint1: box2d.b2RevoluteJoint;
    m_joint2: box2d.b2RevoluteJoint;
    m_joint3: box2d.b2PrismaticJoint;
    m_joint4: box2d.b2GearJoint;
    m_joint5: box2d.b2GearJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=gears.d.ts.map