import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Car extends testbed.Test {
    m_car: box2d.b2Body;
    m_wheel1: box2d.b2Body;
    m_wheel2: box2d.b2Body;
    m_speed: number;
    m_spring1: box2d.b2WheelJoint;
    m_spring2: box2d.b2WheelJoint;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=car.d.ts.map