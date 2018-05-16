import { b2Vec2 } from "../../Common/b2Math";
import { b2Body } from "../b2Body";
import { b2SolverData } from "../b2TimeStep";
export declare const enum b2JointType {
    e_unknownJoint = 0,
    e_revoluteJoint = 1,
    e_prismaticJoint = 2,
    e_distanceJoint = 3,
    e_pulleyJoint = 4,
    e_mouseJoint = 5,
    e_gearJoint = 6,
    e_wheelJoint = 7,
    e_weldJoint = 8,
    e_frictionJoint = 9,
    e_ropeJoint = 10,
    e_motorJoint = 11,
    e_areaJoint = 12,
}
export declare const enum b2LimitState {
    e_inactiveLimit = 0,
    e_atLowerLimit = 1,
    e_atUpperLimit = 2,
    e_equalLimits = 3,
}
export declare class b2Jacobian {
    linear: b2Vec2;
    angularA: number;
    angularB: number;
    SetZero(): b2Jacobian;
    Set(x: b2Vec2, a1: number, a2: number): b2Jacobian;
}
export declare class b2JointEdge {
    other: b2Body;
    joint: b2Joint;
    prev: b2JointEdge;
    next: b2JointEdge;
}
export declare class b2JointDef {
    type: b2JointType;
    userData: any;
    bodyA: b2Body;
    bodyB: b2Body;
    collideConnected: boolean;
    constructor(type: b2JointType);
}
export declare class b2Joint {
    m_type: b2JointType;
    m_prev: b2Joint;
    m_next: b2Joint;
    m_edgeA: b2JointEdge;
    m_edgeB: b2JointEdge;
    m_bodyA: b2Body;
    m_bodyB: b2Body;
    m_index: number;
    m_islandFlag: boolean;
    m_collideConnected: boolean;
    m_userData: any;
    constructor(def: b2JointDef);
    GetType(): b2JointType;
    GetBodyA(): b2Body;
    GetBodyB(): b2Body;
    GetAnchorA(out: b2Vec2): b2Vec2;
    GetAnchorB(out: b2Vec2): b2Vec2;
    GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
    GetReactionTorque(inv_dt: number): number;
    GetNext(): b2Joint;
    GetUserData(): any;
    SetUserData(data: any): void;
    IsActive(): boolean;
    GetCollideConnected(): boolean;
    Dump(log: (format: string, ...args: any[]) => void): void;
    ShiftOrigin(newOrigin: b2Vec2): void;
    InitVelocityConstraints(data: b2SolverData): void;
    SolveVelocityConstraints(data: b2SolverData): void;
    SolvePositionConstraints(data: b2SolverData): boolean;
}
