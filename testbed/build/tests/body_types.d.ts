import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class BodyTypes extends testbed.Test {
    m_attachment: b2.Body;
    m_platform: b2.Body;
    m_speed: number;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
