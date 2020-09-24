import * as testbed from "../testbed.js";
export declare class Chain extends testbed.Test {
    static readonly e_count = 30;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
