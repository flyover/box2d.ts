import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Revolute extends testbed.Test {
    m_ball: box2d.b2Body;
    m_joint: box2d.b2RevoluteJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=revolute.d.ts.map