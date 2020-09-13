import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
/**
 * This tests bullet collision and provides an example of a
 * gameplay scenario. This also uses a loop shape.
 */
export declare class Pinball extends testbed.Test {
    m_leftJoint: box2d.b2RevoluteJoint;
    m_rightJoint: box2d.b2RevoluteJoint;
    m_ball: box2d.b2Body;
    m_button: boolean;
    constructor();
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=pinball.d.ts.map