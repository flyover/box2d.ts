/// A 3-by-3 matrix. Stored in column-major order.

import { b2Vec2 } from "./b2Vec2";
import { b2Vec3 } from "./b2Vec3";

export class b2Mat33 {
    public static IDENTITY = new b2Mat33();

    public ex: b2Vec3 = new b2Vec3(1, 0, 0);
    public ey: b2Vec3 = new b2Vec3(0, 1, 0);
    public ez: b2Vec3 = new b2Vec3(0, 0, 1);

    public Clone(): b2Mat33 {
        return new b2Mat33().Copy(this);
    }

    public SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): b2Mat33 {
        this.ex.Copy(c1);
        this.ey.Copy(c2);
        this.ez.Copy(c3);
        return this;
    }

    public Copy(other: b2Mat33): b2Mat33 {
        ///b2Assert(this !== other);
        this.ex.Copy(other.ex);
        this.ey.Copy(other.ey);
        this.ez.Copy(other.ez);
        return this;
    }

    public SetIdentity(): b2Mat33 {
        this.ex.SetXYZ(1, 0, 0);
        this.ey.SetXYZ(0, 1, 0);
        this.ez.SetXYZ(0, 0, 1);
        return this;
    }

    public SetZero(): b2Mat33 {
        this.ex.SetZero();
        this.ey.SetZero();
        this.ez.SetZero();
        return this;
    }

    public SelfAddM(M: b2Mat33): b2Mat33 {
        this.ex.SelfAdd(M.ex);
        this.ey.SelfAdd(M.ey);
        this.ez.SelfAdd(M.ez);
        return this;
    }

    public Solve33(b_x: number, b_y: number, b_z: number, out: b2Vec3): b2Vec3 {
        const a11: number = this.ex.x, a21: number = this.ex.y, a31: number = this.ex.z;
        const a12: number = this.ey.x, a22: number = this.ey.y, a32: number = this.ey.z;
        const a13: number = this.ez.x, a23: number = this.ez.y, a33: number = this.ez.z;
        let det: number = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (b_x * (a22 * a33 - a32 * a23) + b_y * (a32 * a13 - a12 * a33) + b_z * (a12 * a23 - a22 * a13));
        out.y = det * (a11 * (b_y * a33 - b_z * a23) + a21 * (b_z * a13 - b_x * a33) + a31 * (b_x * a23 - b_y * a13));
        out.z = det * (a11 * (a22 * b_z - a32 * b_y) + a21 * (a32 * b_x - a12 * b_z) + a31 * (a12 * b_y - a22 * b_x));
        return out;
    }

    public Solve22(b_x: number, b_y: number, out: b2Vec2): b2Vec2 {
        const a11: number = this.ex.x, a12: number = this.ey.x;
        const a21: number = this.ex.y, a22: number = this.ey.y;
        let det: number = a11 * a22 - a12 * a21;
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (a22 * b_x - a12 * b_y);
        out.y = det * (a11 * b_y - a21 * b_x);
        return out;
    }

    public GetInverse22(M: b2Mat33): void {
        const a: number = this.ex.x, b: number = this.ey.x, c: number = this.ex.y, d: number = this.ey.y;
        let det: number = a * d - b * c;
        if (det !== 0) {
            det = 1 / det;
        }

        M.ex.x = det * d; M.ey.x = -det * b; M.ex.z = 0;
        M.ex.y = -det * c; M.ey.y = det * a; M.ey.z = 0;
        M.ez.x = 0; M.ez.y = 0; M.ez.z = 0;
    }

    public GetSymInverse33(M: b2Mat33): void {
        let det: number = b2Vec3.DotV3V3(this.ex, b2Vec3.CrossV3V3(this.ey, this.ez, b2Vec3.s_t0));
        if (det !== 0) {
            det = 1 / det;
        }

        const a11: number = this.ex.x, a12: number = this.ey.x, a13: number = this.ez.x;
        const a22: number = this.ey.y, a23: number = this.ez.y;
        const a33: number = this.ez.z;

        M.ex.x = det * (a22 * a33 - a23 * a23);
        M.ex.y = det * (a13 * a23 - a12 * a33);
        M.ex.z = det * (a12 * a23 - a13 * a22);

        M.ey.x = M.ex.y;
        M.ey.y = det * (a11 * a33 - a13 * a13);
        M.ey.z = det * (a13 * a12 - a11 * a23);

        M.ez.x = M.ex.z;
        M.ez.y = M.ey.z;
        M.ez.z = det * (a11 * a22 - a12 * a12);
    }

    public static MulM33V3(A: b2Mat33, v: b2Vec3, out: b2Vec3): b2Vec3 {
        const A_ex: b2Vec3 = A.ex, A_ey: b2Vec3 = A.ey, A_ez: b2Vec3 = A.ez;
        const v_x: number = v.x, v_y: number = v.y, v_z: number = v.z;
        out.x = A_ex.x * v_x + A_ey.x * v_y + A_ez.x * v_z;
        out.y = A_ex.y * v_x + A_ey.y * v_y + A_ez.y * v_z;
        out.z = A_ex.z * v_x + A_ey.z * v_y + A_ez.z * v_z;
        return out;
    }

    public static MulM33XYZ(A: b2Mat33, x: number, y: number, z: number, out: b2Vec3): b2Vec3 {
        const A_ex: b2Vec3 = A.ex, A_ey: b2Vec3 = A.ey, A_ez: b2Vec3 = A.ez;
        out.x = A_ex.x * x + A_ey.x * y + A_ez.x * z;
        out.y = A_ex.y * x + A_ey.y * y + A_ez.y * z;
        out.z = A_ex.z * x + A_ey.z * y + A_ez.z * z;
        return out;
    }

    public static MulM33V2(A: b2Mat33, v: b2Vec2, out: b2Vec2): b2Vec2 {
        const v_x: number = v.x, v_y: number = v.y;
        out.x = A.ex.x * v_x + A.ey.x * v_y;
        out.y = A.ex.y * v_x + A.ey.y * v_y;
        return out;
    }

    public static MulM33XY(A: b2Mat33, x: number, y: number, out: b2Vec2): b2Vec2 {
        out.x = A.ex.x * x + A.ey.x * y;
        out.y = A.ex.y * x + A.ey.y * y;
        return out;
    }
}

