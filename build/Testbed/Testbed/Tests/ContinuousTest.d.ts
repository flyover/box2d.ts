import * as testbed from "../Testbed";
export declare class ContinuousTest extends testbed.Test {
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
