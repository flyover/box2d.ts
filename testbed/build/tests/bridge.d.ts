import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class Bridge extends testbed.Test {
    static readonly e_count = 30;
    m_middle: b2.Body;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
