import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class SensorTest extends testbed.Test {
    static readonly e_count = 7;
    m_sensor: box2d.b2Fixture;
    m_bodies: box2d.b2Body[];
    m_touching: boolean[][];
    constructor();
    BeginContact(contact: box2d.b2Contact): void;
    EndContact(contact: box2d.b2Contact): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=sensor_test.d.ts.map