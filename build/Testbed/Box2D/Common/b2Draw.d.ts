import { b2Vec2, b2Transform } from "./b2Math";
export declare class b2Color {
    static RED: b2Color;
    static GREEN: b2Color;
    static BLUE: b2Color;
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(rr?: number, gg?: number, bb?: number, aa?: number);
    Clone(): b2Color;
    Copy(other: b2Color): b2Color;
    IsEqual(color: b2Color): boolean;
    IsZero(): boolean;
    GetColor(out: b2Color): b2Color;
    SetColor(color: b2Color): void;
    Set(a0: number | b2Color, a1?: number, a2?: number, a3?: number): void;
    SetRGB(rr: number, gg: number, bb: number): b2Color;
    SetRGBA(rr: number, gg: number, bb: number, aa: number): b2Color;
    SelfAdd(color: b2Color): b2Color;
    Add(color: b2Color, out: b2Color): b2Color;
    SelfSub(color: b2Color): b2Color;
    Sub(color: b2Color, out: b2Color): b2Color;
    SelfMul_0_1(s: number): b2Color;
    Mul_0_1(s: number, out: b2Color): b2Color;
    Mix(mixColor: b2Color, strength: number): void;
    static MixColors(colorA: b2Color, colorB: b2Color, strength: number): void;
    MakeStyleString(alpha?: number): string;
    static MakeStyleString(r: number, g: number, b: number, a?: number): string;
}
export declare const enum b2DrawFlags {
    e_none = 0,
    e_shapeBit = 1,
    e_jointBit = 2,
    e_aabbBit = 4,
    e_pairBit = 8,
    e_centerOfMassBit = 16,
    e_particleBit = 32,
    e_controllerBit = 64,
    e_all = 63,
}
export declare class b2Draw {
    m_drawFlags: b2DrawFlags;
    SetFlags(flags: b2DrawFlags): void;
    GetFlags(): b2DrawFlags;
    AppendFlags(flags: b2DrawFlags): void;
    ClearFlags(flags: b2DrawFlags): void;
    PushTransform(xf: b2Transform): void;
    PopTransform(xf: b2Transform): void;
    DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
    DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
    DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
    DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
    DrawParticles(centers: b2Vec2[], radius: number, colors: b2Color[], count: number): void;
    DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
    DrawTransform(xf: b2Transform): void;
}
