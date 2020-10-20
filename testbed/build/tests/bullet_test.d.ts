import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class BulletTest extends testbed.Test {
    m_body: b2.Body;
    m_bullet: b2.Body;
    m_x: number;
    constructor();
    Launch(): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
