import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class SphereStack extends testbed.Test {
    static readonly e_count: number;
    m_bodies: b2.Body[];
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
