import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class BodyTypes extends testbed.Test {
    m_attachment: box2d.b2Body;
    m_platform: box2d.b2Body;
    m_speed: number;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=body_types.d.ts.map