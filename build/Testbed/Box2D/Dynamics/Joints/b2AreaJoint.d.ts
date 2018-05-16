import { b2Vec2 } from "../../Common/b2Math";
import { b2Joint, b2JointDef } from "./b2Joint";
import { b2DistanceJoint } from "./b2DistanceJoint";
import { b2SolverData } from "../b2TimeStep";
import { b2Body } from "../b2Body";
import { b2World } from "../b2World";
export declare class b2AreaJointDef extends b2JointDef {
    world: b2World;
    bodies: b2Body[];
    frequencyHz: number;
    dampingRatio: number;
    constructor();
    AddBody(body: b2Body): void;
}
export declare class b2AreaJoint extends b2Joint {
    m_bodies: b2Body[];
    m_frequencyHz: number;
    m_dampingRatio: number;
    m_impulse: number;
    m_targetLengths: number[];
    m_targetArea: number;
    m_normals: b2Vec2[];
    m_joints: b2DistanceJoint[];
    m_deltas: b2Vec2[];
    m_delta: b2Vec2;
    constructor(def: b2AreaJointDef);
    GetAnchorA(out: b2Vec2): b2Vec2;
    GetAnchorB(out: b2Vec2): b2Vec2;
    GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
    GetReactionTorque(inv_dt: number): number;
    SetFrequency(hz: number): void;
    GetFrequency(): number;
    SetDampingRatio(ratio: number): void;
    GetDampingRatio(): number;
    Dump(log: (format: string, ...args: any[]) => void): void;
    InitVelocityConstraints(data: b2SolverData): void;
    SolveVelocityConstraints(data: b2SolverData): void;
    SolvePositionConstraints(data: b2SolverData): boolean;
}
