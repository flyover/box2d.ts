import * as testbed from "../testbed.js";
export declare class Cantilever extends testbed.Test {
    static readonly e_count = 8;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
