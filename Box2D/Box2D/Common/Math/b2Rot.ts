/// Rotation

import { b2Vec2 } from "./b2Vec2";

export class b2Rot {
    public static IDENTITY = new b2Rot();

    public s: number = 0;
    public c: number = 1;

    constructor(angle: number = 0) {
        if (angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
        }
    }

    public Clone(): b2Rot {
        return new b2Rot().Copy(this);
    }

    public Copy(other: b2Rot): b2Rot {
        this.s = other.s;
        this.c = other.c;
        return this;
    }

    public SetAngle(angle: number): b2Rot {
        this.s = Math.sin(angle);
        this.c = Math.cos(angle);
        return this;
    }

    public SetIdentity(): b2Rot {
        this.s = 0;
        this.c = 1;
        return this;
    }

    public GetAngle(): number {
        return Math.atan2(this.s, this.c);
    }

    public GetXAxis(out: b2Vec2): b2Vec2 {
        out.x = this.c;
        out.y = this.s;
        return out;
    }

    public GetYAxis(out: b2Vec2): b2Vec2 {
        out.x = -this.s;
        out.y = this.c;
        return out;
    }

    public static MulRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot {
        // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
        // [qs  qc]   [rs  rc]   [qs*rc+qc*rs -qs*rs+qc*rc]
        // s = qs * rc + qc * rs
        // c = qc * rc - qs * rs
        const q_c: number = q.c, q_s: number = q.s;
        const r_c: number = r.c, r_s: number = r.s;
        out.s = q_s * r_c + q_c * r_s;
        out.c = q_c * r_c - q_s * r_s;
        return out;
    }

    public static MulTRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot {
        // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
        // [-qs qc]   [rs  rc]   [-qs*rc+qc*rs qs*rs+qc*rc]
        // s = qc * rs - qs * rc
        // c = qc * rc + qs * rs
        const q_c: number = q.c, q_s: number = q.s;
        const r_c: number = r.c, r_s: number = r.s;
        out.s = q_c * r_s - q_s * r_c;
        out.c = q_c * r_c + q_s * r_s;
        return out;
    }

    public static MulRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2 {
        const q_c: number = q.c, q_s: number = q.s;
        const v_x: number = v.x, v_y: number = v.y;
        out.x = q_c * v_x - q_s * v_y;
        out.y = q_s * v_x + q_c * v_y;
        return out;
    }

    public static MulTRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2 {
        const q_c: number = q.c, q_s: number = q.s;
        const v_x: number = v.x, v_y: number = v.y;
        out.x = q_c * v_x + q_s * v_y;
        out.y = -q_s * v_x + q_c * v_y;
        return out;
    }

}
