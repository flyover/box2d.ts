/// This describes the motion of a body/shape for TOI computation.
/// Shapes are defined with respect to the body origin, which may
/// no coincide with the center of mass. However, to support dynamics
/// we must interpolate the center of mass position.

import { b2_two_pi } from "../b2Settings";
import { b2Vec2 } from "./b2Vec2";
import { b2Rot } from "./b2Rot";
import { b2Transform } from "./b2Transform";

export class b2Sweep {
    public localCenter: b2Vec2 = new b2Vec2();
    public c0: b2Vec2 = new b2Vec2();
    public c: b2Vec2 = new b2Vec2();
    public a0: number = 0;
    public a: number = 0;
    public alpha0: number = 0;

    public Clone(): b2Sweep {
        return new b2Sweep().Copy(this);
    }

    public Copy(other: b2Sweep): b2Sweep {
        ///b2Assert(this !== other);
        this.localCenter.Copy(other.localCenter);
        this.c0.Copy(other.c0);
        this.c.Copy(other.c);
        this.a0 = other.a0;
        this.a = other.a;
        this.alpha0 = other.alpha0;
        return this;
    }

    public GetTransform(xf: b2Transform, beta: number): b2Transform {
        const one_minus_beta: number = (1 - beta);
        xf.p.x = one_minus_beta * this.c0.x + beta * this.c.x;
        xf.p.y = one_minus_beta * this.c0.y + beta * this.c.y;
        const angle: number = one_minus_beta * this.a0 + beta * this.a;
        xf.q.SetAngle(angle);

        xf.p.SelfSub(b2Rot.MulRV(xf.q, this.localCenter, b2Vec2.s_t0));
        return xf;
    }

    public Advance(alpha: number): void {
        ///b2Assert(this.alpha0 < 1);
        const beta: number = (alpha - this.alpha0) / (1 - this.alpha0);
        const one_minus_beta: number = (1 - beta);
        this.c0.x = one_minus_beta * this.c0.x + beta * this.c.x;
        this.c0.y = one_minus_beta * this.c0.y + beta * this.c.y;
        this.a0 = one_minus_beta * this.a0 + beta * this.a;
        this.alpha0 = alpha;
    }

    public Normalize(): void {
        const d: number = b2_two_pi * Math.floor(this.a0 / b2_two_pi);
        this.a0 -= d;
        this.a -= d;
    }
}
