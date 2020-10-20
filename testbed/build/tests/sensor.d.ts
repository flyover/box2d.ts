import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class SensorTest extends testbed.Test {
    static readonly e_count = 7;
    m_sensor: b2.Fixture;
    m_bodies: b2.Body[];
    m_touching: boolean[][];
    constructor();
    BeginContact(contact: b2.Contact): void;
    EndContact(contact: b2.Contact): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
