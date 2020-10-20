import * as testbed from "@testbed";
/**
 * Test the behavior of particles falling onto a concave
 * ambiguous Body contact fixture junction.
 */
export declare class AntiPointy extends testbed.Test {
    m_particlesToCreate: number;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): AntiPointy;
}
export declare const testIndex: number;
