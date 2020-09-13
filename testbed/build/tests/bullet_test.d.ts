import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class BulletTest extends testbed.Test {
    m_body: box2d.b2Body;
    m_bullet: box2d.b2Body;
    m_x: number;
    constructor();
    Launch(): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=bullet_test.d.ts.map