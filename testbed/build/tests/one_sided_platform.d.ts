import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class OneSidedPlatform extends testbed.Test {
    m_radius: number;
    m_top: number;
    m_bottom: number;
    m_state: OneSidedPlatform_State;
    m_platform: b2.Fixture;
    m_character: b2.Fixture;
    constructor();
    PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare enum OneSidedPlatform_State {
    e_unknown = 0,
    e_above = 1,
    e_below = 2
}
//# sourceMappingURL=one_sided_platform.d.ts.map