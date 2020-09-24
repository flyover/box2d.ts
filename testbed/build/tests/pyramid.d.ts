import * as testbed from "../testbed.js";
export declare class Pyramid extends testbed.Test {
    static readonly e_count = 20;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
