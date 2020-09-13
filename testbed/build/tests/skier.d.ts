import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Skier extends testbed.Test {
    m_platform_width: number;
    m_skier: box2d.b2Body;
    m_fixed_camera: boolean;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=skier.d.ts.map