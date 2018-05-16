import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";
export declare class MotorJoint2 extends testbed.Test {
    constructor();
    m_joint: box2d.b2MotorJoint;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
