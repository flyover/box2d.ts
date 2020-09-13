import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class TheoJansen extends testbed.Test {
    m_offset: b2.Vec2;
    m_chassis: b2.Body;
    m_wheel: b2.Body;
    m_motorJoint: b2.RevoluteJoint;
    m_motorOn: boolean;
    m_motorSpeed: number;
    constructor();
    CreateLeg(s: number, wheelAnchor: b2.Vec2): void;
    Construct(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=theo_jansen.d.ts.map