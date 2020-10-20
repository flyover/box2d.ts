import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class Prismatic extends testbed.Test {
    m_joint: b2.PrismaticJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
