import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class OneSidedPlatform extends testbed.Test {
    m_radius: number;
    m_top: number;
    m_bottom: number;
    m_state: OneSidedPlatform_State;
    m_platform: box2d.b2Fixture;
    m_character: box2d.b2Fixture;
    constructor();
    PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare enum OneSidedPlatform_State {
    e_unknown = 0,
    e_above = 1,
    e_below = 2
}
//# sourceMappingURL=one_sided_platform.d.ts.map