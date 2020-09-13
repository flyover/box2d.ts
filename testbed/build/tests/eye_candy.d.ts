import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class EyeCandy extends testbed.Test {
    m_mover: box2d.b2Body;
    m_joint: box2d.b2RevoluteJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): EyeCandy;
}
//# sourceMappingURL=eye_candy.d.ts.map