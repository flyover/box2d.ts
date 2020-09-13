import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Web extends testbed.Test {
    m_bodies: Array<box2d.b2Body | null>;
    m_joints: Array<box2d.b2Joint | null>;
    constructor();
    JointDestroyed(joint: box2d.b2Joint): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=web.d.ts.map