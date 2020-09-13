import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class WaveMachine extends testbed.Test {
    m_joint: box2d.b2RevoluteJoint;
    m_time: number;
    constructor();
    Step(settings: testbed.Settings): void;
    GetDefaultViewZoom(): number;
    static Create(): WaveMachine;
}
//# sourceMappingURL=wave_machine.d.ts.map