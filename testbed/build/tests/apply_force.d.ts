import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ApplyForce extends testbed.Test {
    m_body: box2d.b2Body;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=apply_force.d.ts.map