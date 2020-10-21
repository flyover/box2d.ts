import * as testbed from "@testbed";
export declare class Tiles extends testbed.Test {
    static readonly e_count = 20;
    m_fixtureCount: number;
    m_createTime: number;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
