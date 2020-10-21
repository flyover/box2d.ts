import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class SliderCrank2 extends testbed.Test {
    static readonly e_count = 30;
    m_joint1: b2.RevoluteJoint;
    m_joint2: b2.PrismaticJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
