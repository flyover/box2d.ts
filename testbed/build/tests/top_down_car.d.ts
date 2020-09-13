import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
/**
 * a class to allow subclassing of different fixture user data
 */
export declare class FixtureUserData {
    m_type: number;
    constructor(type: number);
    getType(): number;
}
/**
 * class to allow marking a fixture as a car tire
 */
export declare class CarTireFUD extends FixtureUserData {
    constructor();
}
export declare class GroundAreaFUD extends FixtureUserData {
    frictionModifier: number;
    outOfCourse: boolean;
    constructor(fm: number, ooc: boolean);
}
export declare class TDTire {
    m_groundAreas: GroundAreaFUD[];
    m_body: box2d.b2Body;
    m_currentTraction: number;
    m_maxForwardSpeed: number;
    m_maxBackwardSpeed: number;
    m_maxDriveForce: number;
    m_maxLateralImpulse: number;
    constructor(world: box2d.b2World);
    setCharacteristics(maxForwardSpeed: number, maxBackwardSpeed: number, maxDriveForce: number, maxLateralImpulse: number): void;
    addGroundArea(ga: GroundAreaFUD): void;
    removeGroundArea(ga: GroundAreaFUD): void;
    updateTraction(): void;
    getLateralVelocity(): box2d.b2Vec2;
    getForwardVelocity(): box2d.b2Vec2;
    updateFriction(): void;
    updateDrive(controlState: number): void;
    updateTurn(controlState: number): void;
}
export declare class TDCar {
    m_tires: TDTire[];
    m_body: box2d.b2Body;
    flJoint: box2d.b2RevoluteJoint;
    frJoint: box2d.b2RevoluteJoint;
    constructor(world: box2d.b2World);
    update(controlState: number): void;
}
export declare class MyDestructionListener extends testbed.DestructionListener {
    SayGoodbyeFixture(fixture: box2d.b2Fixture): void;
    /**
     * (unused but must implement all pure virtual functions)
     */
    SayGoodbyeJoint(joint: box2d.b2Joint): void;
}
export declare class TopdownCar extends testbed.Test {
    m_car: TDCar;
    m_controlState: number;
    constructor();
    Keyboard(key: string): void;
    KeyboardUp(key: string): void;
    static handleContact(contact: box2d.b2Contact, began: boolean): void;
    BeginContact(contact: box2d.b2Contact): void;
    EndContact(contact: box2d.b2Contact): void;
    static tire_vs_groundArea(tireFixture: box2d.b2Fixture, groundAreaFixture: box2d.b2Fixture, began: boolean): void;
    Step(settings: testbed.Settings): void;
    static Create(): TopdownCar;
}
//# sourceMappingURL=top_down_car.d.ts.map