/// A 2-by-2 matrix. Stored in column-major order.

import { b2Vec2 } from "./b2Vec2";

export class b2Mat22 {
    public static IDENTITY = new b2Mat22();

    public ex: b2Vec2 = new b2Vec2(1, 0);
    public ey: b2Vec2 = new b2Vec2(0, 1);

    public Clone(): b2Mat22 {
        return new b2Mat22().Copy(this);
    }

    public SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22 {
        this.ex.Set(r1c1, r2c1);
        this.ey.Set(r1c2, r2c2);
        return this;
    }

    public SetVV(c1: b2Vec2, c2: b2Vec2): b2Mat22 {
        this.ex.Copy(c1);
        this.ey.Copy(c2);
        return this;
    }

    public SetAngle(radians: number): b2Mat22 {
        const c: number = Math.cos(radians);
        const s: number = Math.sin(radians);
        this.ex.Set(c, s);
        this.ey.Set(-s, c);
        return this;
    }

    public Copy(other: b2Mat22): b2Mat22 {
        ///b2Assert(this !== other);
        this.ex.Copy(other.ex);
        this.ey.Copy(other.ey);
        return this;
    }

    public SetIdentity(): b2Mat22 {
        this.ex.Set(1, 0);
        this.ey.Set(0, 1);
        return this;
    }

    public SetZero(): b2Mat22 {
        this.ex.SetZero();
        this.ey.SetZero();
        return this;
    }

    public GetAngle(): number {
        return Math.atan2(this.ex.y, this.ex.x);
    }

    public GetInverse(out: b2Mat22): b2Mat22 {
        const a: number = this.ex.x;
        const b: number = this.ey.x;
        const c: number = this.ex.y;
        const d: number = this.ey.y;
        let det: number = a * d - b * c;
        if (det !== 0) {
            det = 1 / det;
        }
        out.ex.x = det * d;
        out.ey.x = (-det * b);
        out.ex.y = (-det * c);
        out.ey.y = det * a;
        return out;
    }

    public Solve(b_x: number, b_y: number, out: b2Vec2): b2Vec2 {
        const a11: number = this.ex.x, a12 = this.ey.x;
        const a21: number = this.ex.y, a22 = this.ey.y;
        let det: number = a11 * a22 - a12 * a21;
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (a22 * b_x - a12 * b_y);
        out.y = det * (a11 * b_y - a21 * b_x);
        return out;
    }

    public SelfAbs(): b2Mat22 {
        this.ex.SelfAbs();
        this.ey.SelfAbs();
        return this;
    }

    public SelfInv(): b2Mat22 {
        return this.GetInverse(this);
    }

    public SelfAddM(M: b2Mat22): b2Mat22 {
        this.ex.SelfAdd(M.ex);
        this.ey.SelfAdd(M.ey);
        return this;
    }

    public SelfSubM(M: b2Mat22): b2Mat22 {
        this.ex.SelfSub(M.ex);
        this.ey.SelfSub(M.ey);
        return this;
    }

    public static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22 {
        return new b2Mat22().SetVV(c1, c2);
    }

    public static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22 {
        return new b2Mat22().SetSSSS(r1c1, r1c2, r2c1, r2c2);
    }

    public static FromAngle(radians: number): b2Mat22 {
        return new b2Mat22().SetAngle(radians);
    }

    public static AbsM(M: b2Mat22, out: b2Mat22): b2Mat22 {
        const M_ex: b2Vec2 = M.ex, M_ey: b2Vec2 = M.ey;
        out.ex.x = Math.abs(M_ex.x);
        out.ex.y = Math.abs(M_ex.y);
        out.ey.x = Math.abs(M_ey.x);
        out.ey.y = Math.abs(M_ey.y);
        return out;
    }

    public static MulMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2 {
        const M_ex: b2Vec2 = M.ex, M_ey: b2Vec2 = M.ey;
        const v_x: number = v.x, v_y: number = v.y;
        out.x = M_ex.x * v_x + M_ey.x * v_y;
        out.y = M_ex.y * v_x + M_ey.y * v_y;
        return out;
    }

    public static MulTMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2 {
        const M_ex: b2Vec2 = M.ex, M_ey: b2Vec2 = M.ey;
        const v_x: number = v.x, v_y: number = v.y;
        out.x = M_ex.x * v_x + M_ex.y * v_y;
        out.y = M_ey.x * v_x + M_ey.y * v_y;
        return out;
    }

    public static AddMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22 {
        const A_ex: b2Vec2 = A.ex, A_ey: b2Vec2 = A.ey;
        const B_ex: b2Vec2 = B.ex, B_ey: b2Vec2 = B.ey;
        out.ex.x = A_ex.x + B_ex.x;
        out.ex.y = A_ex.y + B_ex.y;
        out.ey.x = A_ey.x + B_ey.x;
        out.ey.y = A_ey.y + B_ey.y;
        return out;
    }

    public static MulMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22 {
        const A_ex_x: number = A.ex.x, A_ex_y: number = A.ex.y;
        const A_ey_x: number = A.ey.x, A_ey_y: number = A.ey.y;
        const B_ex_x: number = B.ex.x, B_ex_y: number = B.ex.y;
        const B_ey_x: number = B.ey.x, B_ey_y: number = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ey_x * B_ex_y;
        out.ex.y = A_ex_y * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ey_x * B_ey_y;
        out.ey.y = A_ex_y * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }

    public static MulTMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22 {
        const A_ex_x: number = A.ex.x, A_ex_y: number = A.ex.y;
        const A_ey_x: number = A.ey.x, A_ey_y: number = A.ey.y;
        const B_ex_x: number = B.ex.x, B_ex_y: number = B.ex.y;
        const B_ey_x: number = B.ey.x, B_ey_y: number = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ex_y * B_ex_y;
        out.ex.y = A_ey_x * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ex_y * B_ey_y;
        out.ey.y = A_ey_x * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }
}
