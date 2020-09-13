import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Car extends testbed.Test {
    m_car: b2.Body;
    m_wheel1: b2.Body;
    m_wheel2: b2.Body;
    m_speed: number;
    m_spring1: b2.WheelJoint;
    m_spring2: b2.WheelJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=car.d.ts.map