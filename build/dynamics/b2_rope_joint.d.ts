import { b2Vec2, b2Rot, XY } from "../common/b2_math.js";
import { b2Joint, b2JointDef, b2IJointDef } from "./b2_joint.js";
import { b2SolverData } from "./b2_time_step.js";
export interface b2IRopeJointDef extends b2IJointDef {
    localAnchorA?: XY;
    localAnchorB?: XY;
    maxLength?: number;
}
export declare class b2RopeJointDef extends b2JointDef implements b2IRopeJointDef {
    readonly localAnchorA: b2Vec2;
    readonly localAnchorB: b2Vec2;
    maxLength: number;
    constructor();
}
export declare class b2RopeJoint extends b2Joint {
    readonly m_localAnchorA: b2Vec2;
    readonly m_localAnchorB: b2Vec2;
    m_maxLength: number;
    m_length: number;
    m_impulse: number;
    m_indexA: number;
    m_indexB: number;
    readonly m_u: b2Vec2;
    readonly m_rA: b2Vec2;
    readonly m_rB: b2Vec2;
    readonly m_localCenterA: b2Vec2;
    readonly m_localCenterB: b2Vec2;
    m_invMassA: number;
    m_invMassB: number;
    m_invIA: number;
    m_invIB: number;
    m_mass: number;
    readonly m_qA: b2Rot;
    readonly m_qB: b2Rot;
    readonly m_lalcA: b2Vec2;
    readonly m_lalcB: b2Vec2;
    constructor(def: b2IRopeJointDef);
    private static InitVelocityConstraints_s_P;
    InitVelocityConstraints(data: b2SolverData): void;
    private static SolveVelocityConstraints_s_vpA;
    private static SolveVelocityConstraints_s_vpB;
    private static SolveVelocityConstraints_s_P;
    SolveVelocityConstraints(data: b2SolverData): void;
    private static SolvePositionConstraints_s_P;
    SolvePositionConstraints(data: b2SolverData): boolean;
    GetAnchorA<T extends XY>(out: T): T;
    GetAnchorB<T extends XY>(out: T): T;
    GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
    GetReactionTorque(inv_dt: number): number;
    GetLocalAnchorA(): Readonly<b2Vec2>;
    GetLocalAnchorB(): Readonly<b2Vec2>;
    SetMaxLength(length: number): void;
    GetMaxLength(): number;
    GetLength(): number;
    Dump(log: (format: string, ...args: any[]) => void): void;
}
//# sourceMappingURL=b2_rope_joint.d.ts.map