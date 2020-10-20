import * as b2 from "@box2d";
import * as testbed from "@testbed";
/**
 * This tests bullet collision and provides an example of a
 * gameplay scenario. This also uses a loop shape.
 */
export declare class Pinball extends testbed.Test {
    m_leftJoint: b2.RevoluteJoint;
    m_rightJoint: b2.RevoluteJoint;
    m_ball: b2.Body;
    m_button: boolean;
    constructor();
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
