import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class ApplyForce extends testbed.Test {
    m_body: b2.Body;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
