import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class HeavyOnLightTwo extends testbed.Test {
    m_heavy: box2d.b2Body | null;
    constructor();
    ToggleHeavy(): void;
    Keyboard(key: string): void;
    static Create(): HeavyOnLightTwo;
}
//# sourceMappingURL=heavy2.d.ts.map