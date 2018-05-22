/// A 2D column vector.

import { b2_epsilon, b2MakeArray } from "../b2Settings";

export class b2Vec2 {
    public static ZERO = new b2Vec2(0, 0);
    public static UNITX = new b2Vec2(1, 0);
    public static UNITY = new b2Vec2(0, 1);

    public static s_t0 = new b2Vec2();
    public static s_t1 = new b2Vec2();
    public static s_t2 = new b2Vec2();
    public static s_t3 = new b2Vec2();

    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public Clone(): b2Vec2 {
        return new b2Vec2(this.x, this.y);
    }

    public SetZero(): b2Vec2 {
        this.x = 0;
        this.y = 0;
        return this;
    }

    public Set(x: number, y: number): b2Vec2 {
        this.x = x;
        this.y = y;
        return this;
    }

    public Copy(other: b2Vec2): b2Vec2 {
        ///b2Assert(this !== other);
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    public SelfAdd(v: b2Vec2): b2Vec2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    public SelfAddXY(x: number, y: number): b2Vec2 {
        this.x += x;
        this.y += y;
        return this;
    }

    public SelfSub(v: b2Vec2): b2Vec2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    public SelfSubXY(x: number, y: number): b2Vec2 {
        this.x -= x;
        this.y -= y;
        return this;
    }

    public SelfMul(s: number): b2Vec2 {
        this.x *= s;
        this.y *= s;
        return this;
    }

    public SelfMulAdd(s: number, v: b2Vec2): b2Vec2 {
        this.x += s * v.x;
        this.y += s * v.y;
        return this;
    }

    public SelfMulSub(s: number, v: b2Vec2): b2Vec2 {
        this.x -= s * v.x;
        this.y -= s * v.y;
        return this;
    }

    public Dot(v: b2Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    public Cross(v: b2Vec2): number {
        return this.x * v.y - this.y * v.x;
    }

    public Length(): number {
        const x: number = this.x, y: number = this.y;
        return Math.sqrt(x * x + y * y);
    }

    public LengthSquared(): number {
        const x: number = this.x, y: number = this.y;
        return (x * x + y * y);
    }

    public Normalize(): number {
        const length: number = this.Length();
        if (length >= b2_epsilon) {
            const inv_length: number = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return length;
    }

    public SelfNormalize(): b2Vec2 {
        const length: number = this.Length();
        if (length >= b2_epsilon) {
            const inv_length: number = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return this;
    }

    public SelfRotate(radians: number): b2Vec2 {
        const c: number = Math.cos(radians);
        const s: number = Math.sin(radians);
        const x: number = this.x;
        this.x = c * x - s * this.y;
        this.y = s * x + c * this.y;
        return this;
    }

    public IsValid(): boolean {
        return isFinite(this.x) && isFinite(this.y);
    }

    public SelfCrossVS(s: number): b2Vec2 {
        const x: number = this.x;
        this.x = s * this.y;
        this.y = -s * x;
        return this;
    }

    public SelfCrossSV(s: number): b2Vec2 {
        const x: number = this.x;
        this.x = -s * this.y;
        this.y = s * x;
        return this;
    }

    public SelfMinV(v: b2Vec2): b2Vec2 {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }

    public SelfMaxV(v: b2Vec2): b2Vec2 {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }

    public SelfAbs(): b2Vec2 {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    public SelfNeg(): b2Vec2 {
        this.x = (-this.x);
        this.y = (-this.y);
        return this;
    }

    public SelfSkew(): b2Vec2 {
        const x: number = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    }

    public static MakeArray(length: number): b2Vec2[] {
        return b2MakeArray(length, function (i: number): b2Vec2 { return new b2Vec2(); });
    }

    public static AbsV(v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = Math.abs(v.x);
        out.y = Math.abs(v.y);
        return out;
    }
    public static MinV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }
    public static MaxV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }
    public static ClampV(v: b2Vec2, lo: b2Vec2, hi: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = Math.min(Math.max(v.x, lo.x), hi.x);
        out.y = Math.min(Math.max(v.y, lo.y), hi.y);
        return out;
    }
    public static RotateV(v: b2Vec2, radians: number, out: b2Vec2): b2Vec2 {
        const v_x: number = v.x, v_y: number = v.y;
        const c: number = Math.cos(radians);
        const s: number = Math.sin(radians);
        out.x = c * v_x - s * v_y;
        out.y = s * v_x + c * v_y;
        return out;
    }
    public static DotVV(a: b2Vec2, b: b2Vec2): number {
        return a.x * b.x + a.y * b.y;
    }
    public static CrossVV(a: b2Vec2, b: b2Vec2): number {
        return a.x * b.y - a.y * b.x;
    }
    public static CrossVS(v: b2Vec2, s: number, out: b2Vec2): b2Vec2 {
        out.x = s * v.y;
        out.y = -s * v.x;
        return out;
    }
    public static CrossVOne(v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = v.y;
        out.y = -v.x;
        return out;
    }
    public static CrossSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = -s * v.y;
        out.y = s * v.x;
        return out;
    }
    public static CrossOneV(v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = -v.y;
        out.y = v.x;
        return out;
    }
    public static AddVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }
    public static SubVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }
    public static MulSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = v.x * s;
        out.y = v.y * s;
        return out;
    }
    public static MulVS(v: b2Vec2, s: number, out: b2Vec2): b2Vec2 {
        out.x = v.x * s;
        out.y = v.y * s;
        return out;
    }
    public static AddVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = a.x + (s * b.x);
        out.y = a.y + (s * b.y);
        return out;
    }
    public static SubVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = a.x - (s * b.x);
        out.y = a.y - (s * b.y);
        return out;
    }
    public static AddVCrossSV(a: b2Vec2, s: number, v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = a.x - (s * v.y);
        out.y = a.y + (s * v.x);
        return out;
    }
    public static MidVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = (a.x + b.x) * 0.5;
        out.y = (a.y + b.y) * 0.5;
        return out;
    }
    public static ExtVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = (b.x - a.x) * 0.5;
        out.y = (b.y - a.y) * 0.5;
        return out;
    }
    public static IsEqualToV(a: b2Vec2, b: b2Vec2): boolean {
        return a.x === b.x && a.y === b.y;
    }
    public static DistanceVV(a: b2Vec2, b: b2Vec2): number {
        const c_x: number = a.x - b.x;
        const c_y: number = a.y - b.y;
        return Math.sqrt(c_x * c_x + c_y * c_y);
    }
    public static DistanceSquaredVV(a: b2Vec2, b: b2Vec2): number {
        const c_x: number = a.x - b.x;
        const c_y: number = a.y - b.y;
        return (c_x * c_x + c_y * c_y);
    }
    public static NegV(v: b2Vec2, out: b2Vec2): b2Vec2 {
        out.x = -v.x; out.y = -v.y; return out;
    }
}
