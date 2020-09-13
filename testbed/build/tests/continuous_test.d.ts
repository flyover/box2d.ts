import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ContinuousTest extends testbed.Test {
    m_body: box2d.b2Body;
    m_angularVelocity: number;
    constructor();
    Launch(): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=continuous_test.d.ts.map