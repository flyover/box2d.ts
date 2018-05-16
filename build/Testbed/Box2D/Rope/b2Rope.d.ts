import { b2Vec2 } from "../Common/b2Math";
import { b2Draw } from "../Common/b2Draw";
export declare class b2RopeDef {
    vertices: b2Vec2[];
    count: number;
    masses: number[];
    gravity: b2Vec2;
    damping: number;
    k2: number;
    k3: number;
}
export declare class b2Rope {
    m_count: number;
    m_ps: b2Vec2[];
    m_p0s: b2Vec2[];
    m_vs: b2Vec2[];
    m_ims: number[];
    m_Ls: number[];
    m_as: number[];
    m_gravity: b2Vec2;
    m_damping: number;
    m_k2: number;
    m_k3: number;
    GetVertexCount(): number;
    GetVertices(): b2Vec2[];
    Initialize(def: b2RopeDef): void;
    Step(h: number, iterations: number): void;
    private static s_d;
    SolveC2(): void;
    SetAngle(angle: number): void;
    private static s_d1;
    private static s_d2;
    private static s_Jd1;
    private static s_Jd2;
    private static s_J1;
    private static s_J2;
    SolveC3(): void;
    Draw(draw: b2Draw): void;
}
