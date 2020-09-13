import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class SphereStack extends testbed.Test {
    static readonly e_count: number;
    m_bodies: box2d.b2Body[];
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=sphere_stack.d.ts.map