import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Prismatic extends testbed.Test {
    m_joint: box2d.b2PrismaticJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=prismatic.d.ts.map