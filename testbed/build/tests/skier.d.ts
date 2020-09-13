import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Skier extends testbed.Test {
    m_platform_width: number;
    m_skier: b2.Body;
    m_fixed_camera: boolean;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=skier.d.ts.map