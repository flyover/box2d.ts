/*
* Copyright (c) 2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

// DEBUG: import { b2Assert } from "../Common/b2Settings";
import { b2_pi, b2MakeNumberArray } from "../Common/b2Settings";
import { b2Atan2, b2Vec2 } from "../Common/b2Math";
import { b2Color, b2Draw } from "../Common/b2Draw";

///
export class b2RopeDef {
  ///
  public vertices: b2Vec2[] = [];

  ///
  public count: number = 0;

  ///
  public masses: number[] = [];

  ///
  public readonly gravity: b2Vec2 = new b2Vec2(0, 0);

  ///
  public damping: number = 0.1;

  /// Stretching stiffness
  public k2: number = 0.9;

  /// Bending stiffness. Values above 0.5 can make the simulation blow up.
  public k3: number = 0.1;
}

///
export class b2Rope {
  public m_count: number = 0;
  public m_ps: b2Vec2[] = [];
  public m_p0s: b2Vec2[] = [];
  public m_vs: b2Vec2[] = [];

  public m_ims: number[] = [];

  public m_Ls: number[] = [];
  public m_as: number[] = [];

  public readonly m_gravity: b2Vec2 = new b2Vec2();
  public m_damping: number = 0;

  public m_k2: number = 1;
  public m_k3: number = 0.1;

  public GetVertexCount(): number {
    return this.m_count;
  }

  public GetVertices(): b2Vec2[] {
    return this.m_ps;
  }

  ///
  public Initialize(def: b2RopeDef): void {
    // DEBUG: b2Assert(def.count >= 3);
    this.m_count = def.count;
    // this.m_ps = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
    this.m_ps = b2Vec2.MakeArray(this.m_count);
    // this.m_p0s = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
    this.m_p0s = b2Vec2.MakeArray(this.m_count);
    // this.m_vs = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
    this.m_vs = b2Vec2.MakeArray(this.m_count);
    // this.m_ims = (float32*)b2Alloc(this.m_count * sizeof(float32));
    this.m_ims = b2MakeNumberArray(this.m_count);

    for (let i: number = 0; i < this.m_count; ++i) {
      this.m_ps[i].Copy(def.vertices[i]);
      this.m_p0s[i].Copy(def.vertices[i]);
      this.m_vs[i].SetZero();

      const m: number = def.masses[i];
      if (m > 0) {
        this.m_ims[i] = 1 / m;
      } else {
        this.m_ims[i] = 0;
      }
    }

    const count2: number = this.m_count - 1;
    const count3: number = this.m_count - 2;
    // this.m_Ls = (float32*)be2Alloc(count2 * sizeof(float32));
    this.m_Ls = b2MakeNumberArray(count2);
    // this.m_as = (float32*)b2Alloc(count3 * sizeof(float32));
    this.m_as = b2MakeNumberArray(count3);

    for (let i: number = 0; i < count2; ++i) {
      const p1: b2Vec2 = this.m_ps[i];
      const p2: b2Vec2 = this.m_ps[i + 1];
      this.m_Ls[i] = b2Vec2.DistanceVV(p1, p2);
    }

    for (let i: number = 0; i < count3; ++i) {
      const p1: b2Vec2 = this.m_ps[i];
      const p2: b2Vec2 = this.m_ps[i + 1];
      const p3: b2Vec2 = this.m_ps[i + 2];

      const d1: b2Vec2 = b2Vec2.SubVV(p2, p1, b2Vec2.s_t0);
      const d2: b2Vec2 = b2Vec2.SubVV(p3, p2, b2Vec2.s_t1);

      const a: number = b2Vec2.CrossVV(d1, d2);
      const b: number = b2Vec2.DotVV(d1, d2);

      this.m_as[i] = b2Atan2(a, b);
    }

    this.m_gravity.Copy(def.gravity);
    this.m_damping = def.damping;
    this.m_k2 = def.k2;
    this.m_k3 = def.k3;
  }

  ///
  public Step(h: number, iterations: number): void {
    if (h === 0) {
      return;
    }

    const d: number = Math.exp(- h * this.m_damping);

    for (let i: number = 0; i < this.m_count; ++i) {
      this.m_p0s[i].Copy(this.m_ps[i]);
      if (this.m_ims[i] > 0) {
        this.m_vs[i].SelfMulAdd(h, this.m_gravity);
      }
      this.m_vs[i].SelfMul(d);
      this.m_ps[i].SelfMulAdd(h, this.m_vs[i]);
    }

    for (let i: number = 0; i < iterations; ++i) {
      this.SolveC2();
      this.SolveC3();
      this.SolveC2();
    }

    const inv_h: number = 1 / h;
    for (let i: number = 0; i < this.m_count; ++i) {
      b2Vec2.MulSV(inv_h, b2Vec2.SubVV(this.m_ps[i], this.m_p0s[i], b2Vec2.s_t0), this.m_vs[i]);
    }
  }

  ///
  private static s_d = new b2Vec2();
  public SolveC2(): void {
    const count2: number = this.m_count - 1;

    for (let i: number = 0; i < count2; ++i) {
      const p1: b2Vec2 = this.m_ps[i];
      const p2: b2Vec2 = this.m_ps[i + 1];

      const d: b2Vec2 = b2Vec2.SubVV(p2, p1, b2Rope.s_d);
      const L: number = d.Normalize();

      const im1: number = this.m_ims[i];
      const im2: number = this.m_ims[i + 1];

      if (im1 + im2 === 0) {
        continue;
      }

      const s1: number = im1 / (im1 + im2);
      const s2: number = im2 / (im1 + im2);

      p1.SelfMulSub(this.m_k2 * s1 * (this.m_Ls[i] - L), d);
      p2.SelfMulAdd(this.m_k2 * s2 * (this.m_Ls[i] - L), d);

      // this.m_ps[i] = p1;
      // this.m_ps[i + 1] = p2;
    }
  }

  public SetAngle(angle: number): void {
    const count3: number = this.m_count - 2;
    for (let i: number = 0; i < count3; ++i) {
      this.m_as[i] = angle;
    }
  }

  private static s_d1 = new b2Vec2();
  private static s_d2 = new b2Vec2();
  private static s_Jd1 = new b2Vec2();
  private static s_Jd2 = new b2Vec2();
  private static s_J1 = new b2Vec2();
  private static s_J2 = new b2Vec2();
  public SolveC3(): void {
    const count3: number = this.m_count - 2;

    for (let i: number = 0; i < count3; ++i) {
      const p1: b2Vec2 = this.m_ps[i];
      const p2: b2Vec2 = this.m_ps[i + 1];
      const p3: b2Vec2 = this.m_ps[i + 2];

      const m1: number = this.m_ims[i];
      const m2: number = this.m_ims[i + 1];
      const m3: number = this.m_ims[i + 2];

      const d1: b2Vec2 = b2Vec2.SubVV(p2, p1, b2Rope.s_d1);
      const d2: b2Vec2 = b2Vec2.SubVV(p3, p2, b2Rope.s_d2);

      const L1sqr: number = d1.LengthSquared();
      const L2sqr: number = d2.LengthSquared();

      if (L1sqr * L2sqr === 0) {
        continue;
      }

      const a: number = b2Vec2.CrossVV(d1, d2);
      const b: number = b2Vec2.DotVV(d1, d2);

      let angle: number = b2Atan2(a, b);

      const Jd1: b2Vec2 = b2Vec2.MulSV((-1 / L1sqr), d1.SelfSkew(), b2Rope.s_Jd1);
      const Jd2: b2Vec2 = b2Vec2.MulSV(( 1 / L2sqr), d2.SelfSkew(), b2Rope.s_Jd2);

      const J1: b2Vec2 = b2Vec2.NegV(Jd1, b2Rope.s_J1);
      const J2: b2Vec2 = b2Vec2.SubVV(Jd1, Jd2, b2Rope.s_J2);
      const J3: b2Vec2 = Jd2;

      let mass: number = m1 * b2Vec2.DotVV(J1, J1) + m2 * b2Vec2.DotVV(J2, J2) + m3 * b2Vec2.DotVV(J3, J3);
      if (mass === 0) {
        continue;
      }

      mass = 1 / mass;

      let C: number = angle - this.m_as[i];

      while (C > b2_pi) {
        angle -= 2 * b2_pi;
        C = angle - this.m_as[i];
      }

      while (C < -b2_pi) {
        angle += 2 * b2_pi;
        C = angle - this.m_as[i];
      }

      const impulse: number = - this.m_k3 * mass * C;

      p1.SelfMulAdd((m1 * impulse), J1);
      p2.SelfMulAdd((m2 * impulse), J2);
      p3.SelfMulAdd((m3 * impulse), J3);

      // this.m_ps[i] = p1;
      // this.m_ps[i + 1] = p2;
      // this.m_ps[i + 2] = p3;
    }
  }

  public Draw(draw: b2Draw): void {
    const c: b2Color = new b2Color(0.4, 0.5, 0.7);

    for (let i: number = 0; i < this.m_count - 1; ++i) {
      draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], c);
    }
  }
}
