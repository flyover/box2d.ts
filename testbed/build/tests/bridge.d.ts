import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Bridge extends testbed.Test {
    static readonly e_count = 30;
    m_middle: box2d.b2Body;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=bridge.d.ts.map