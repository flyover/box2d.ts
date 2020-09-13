import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Segway extends testbed.Test {
    static PENDULUM_LENGTH: number;
    targetPosition: number;
    targetPositionInterval: number;
    posAvg: number;
    readonly angleController: PIDController;
    readonly positionController: PIDController;
    pendulumBody: box2d.b2Body;
    wheelBody: box2d.b2Body;
    groundBody: box2d.b2Body;
    wheelJoint: box2d.b2RevoluteJoint;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
declare class PIDController {
    gainP: number;
    gainI: number;
    gainD: number;
    currentError: number;
    previousError: number;
    integral: number;
    output: number;
    step(dt: number): void;
}
export {};
//# sourceMappingURL=segway.d.ts.map