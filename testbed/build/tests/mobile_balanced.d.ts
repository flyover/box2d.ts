import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class MobileBalanced extends testbed.Test {
    static readonly e_depth = 4;
    constructor();
    AddNode(parent: b2.Body, localAnchor: b2.Vec2, depth: number, offset: number, a: number): b2.Body;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
