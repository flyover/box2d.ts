import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class HeavyOnLightTwo extends testbed.Test {
    m_heavy: b2.Body | null;
    constructor();
    ToggleHeavy(): void;
    Keyboard(key: string): void;
    static Create(): HeavyOnLightTwo;
}
export declare const testIndex: number;
