import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class ConveyorBelt extends testbed.Test {
    m_platform: b2.Fixture;
    constructor();
    PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
