import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class DistanceJoint extends testbed.Test {
    m_joint: b2.DistanceJoint;
    m_length: number;
    m_minLength: number;
    m_maxLength: number;
    m_hertz: number;
    m_dampingRatio: number;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
