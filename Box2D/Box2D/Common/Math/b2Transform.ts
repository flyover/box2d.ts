/// A transform contains translation and rotation. It is used to represent
/// the position and orientation of rigid frames.

import { b2Vec2 } from "./b2Vec2";
import { b2Rot } from "./b2Rot";

export class b2Transform {
    public static IDENTITY = new b2Transform();

    public p: b2Vec2 = new b2Vec2();
    public q: b2Rot = new b2Rot();

    public Clone(): b2Transform {
        return new b2Transform().Copy(this);
    }

    public Copy(other: b2Transform): b2Transform {
        ///b2Assert(this !== other);
        this.p.Copy(other.p);
        this.q.Copy(other.q);
        return this;
    }

    public SetIdentity(): b2Transform {
        this.p.SetZero();
        this.q.SetIdentity();
        return this;
    }

    public SetPositionRotation(position: b2Vec2, q: b2Rot): b2Transform {
        this.p.Copy(position);
        this.q.Copy(q);
        return this;
    }

    public SetPositionAngle(pos: b2Vec2, a: number): b2Transform {
        this.p.Copy(pos);
        this.q.SetAngle(a);
        return this;
    }

    public SetPosition(position: b2Vec2): b2Transform {
        this.p.Copy(position);
        return this;
    }

    public SetPositionXY(x: number, y: number): b2Transform {
        this.p.Set(x, y);
        return this;
    }

    public SetRotation(rotation: b2Rot): b2Transform {
        this.q.Copy(rotation);
        return this;
    }

    public SetRotationAngle(radians: number): b2Transform {
        this.q.SetAngle(radians);
        return this;
    }

    public GetPosition(): b2Vec2 {
        return this.p;
    }

    public GetRotation(): b2Rot {
        return this.q;
    }

    public GetRotationAngle(): number {
        return this.q.GetAngle();
    }

    public GetAngle(): number {
        return this.q.GetAngle();
    }

    public static MulXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2 {
        //  float32 x = (T.q.c * v.x - T.q.s * v.y) + T.p.x;
        //  float32 y = (T.q.s * v.x + T.q.c * v.y) + T.p.y;
        //
        //  return b2Vec2(x, y);
        const T_q_c: number = T.q.c, T_q_s: number = T.q.s;
        const v_x: number = v.x, v_y: number = v.y;
        out.x = (T_q_c * v_x - T_q_s * v_y) + T.p.x;
        out.y = (T_q_s * v_x + T_q_c * v_y) + T.p.y;
        return out;
    }
    public static MulTXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2 {
        //  float32 px = v.x - T.p.x;
        //  float32 py = v.y - T.p.y;
        //  float32 x = (T.q.c * px + T.q.s * py);
        //  float32 y = (-T.q.s * px + T.q.c * py);
        //
        //  return b2Vec2(x, y);
        const T_q_c: number = T.q.c, T_q_s: number = T.q.s;
        const p_x: number = v.x - T.p.x;
        const p_y: number = v.y - T.p.y;
        out.x = (T_q_c * p_x + T_q_s * p_y);
        out.y = (-T_q_s * p_x + T_q_c * p_y);
        return out;
    }

    public static MulXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform {
        b2Rot.MulRR(A.q, B.q, out.q);
        b2Vec2.AddVV(b2Rot.MulRV(A.q, B.p, out.p), A.p, out.p);
        return out;
    }

    public static MulTXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform {
        b2Rot.MulTRR(A.q, B.q, out.q);
        b2Rot.MulTRV(A.q, b2Vec2.SubVV(B.p, A.p, out.p), out.p);
        return out;
    }
}
