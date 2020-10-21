import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class Heavy2 extends testbed.Test {
    m_heavy: b2.Body | null;
    constructor();
    ToggleHeavy(): void;
    Keyboard(key: string): void;
    static Create(): Heavy2;
}
export declare const testIndex: number;
