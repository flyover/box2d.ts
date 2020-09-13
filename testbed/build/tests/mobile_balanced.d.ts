import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class MobileBalanced extends testbed.Test {
    static readonly e_depth = 4;
    constructor();
    AddNode(parent: box2d.b2Body, localAnchor: box2d.b2Vec2, depth: number, offset: number, a: number): box2d.b2Body;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=mobile_balanced.d.ts.map