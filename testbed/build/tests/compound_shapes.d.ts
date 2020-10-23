import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class CompoundShapes extends testbed.Test {
    m_table1: b2.Body;
    m_table2: b2.Body;
    m_ship1: b2.Body;
    m_ship2: b2.Body;
    constructor();
    Spawn(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
