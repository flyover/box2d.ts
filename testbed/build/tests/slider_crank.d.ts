import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class SliderCrank extends testbed.Test {
    static readonly e_count = 30;
    m_joint1: box2d.b2RevoluteJoint;
    m_joint2: box2d.b2PrismaticJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=slider_crank.d.ts.map