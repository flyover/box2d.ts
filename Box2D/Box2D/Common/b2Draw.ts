/*
* Copyright (c) 2011 Erin Catto http://box2d.org
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

import { b2Vec2, b2Transform } from "./b2Math";

/// Color for debug drawing. Each value has the range [0,1].
export class b2Color {
  public static RED: b2Color = new b2Color(1, 0, 0);
  public static GREEN: b2Color = new b2Color(0, 1, 0);
  public static BLUE: b2Color = new b2Color(0, 0, 1);

  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(rr: number = 0.5, gg: number = 0.5, bb: number = 0.5, aa: number = 1.0) {
    this.r = rr;
    this.g = gg;
    this.b = bb;
    this.a = aa;
  }

  public Clone(): b2Color {
    return new b2Color().Copy(this);
  }

  public Copy(other: b2Color): b2Color {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;
    return this;
  }

  public IsEqual(color: b2Color): boolean {
    return (this.r === color.r) && (this.g === color.g) && (this.b === color.b) && (this.a === color.a);
  }

  public IsZero(): boolean {
    return (this.r === 0) && (this.g === 0) && (this.b === 0) && (this.a === 0);
  }

  public GetColor(out: b2Color): b2Color {
    out.Copy(this);
    return out;
  }

  public SetColor(color: b2Color): void {
    this.Copy(color);
  }

  public Set(a0: number | b2Color, a1?: number, a2?: number, a3: number = 1.0): void {
    if (a0 instanceof b2Color) {
      this.Copy(a0);
    } else {
      this.SetRGBA(a0, a1, a2, a3);
    }
  }

  public SetRGB(rr: number, gg: number, bb: number): b2Color {
    this.r = rr;
    this.g = gg;
    this.b = bb;
    return this;
  }

  public SetRGBA(rr: number, gg: number, bb: number, aa: number): b2Color {
    this.r = rr;
    this.g = gg;
    this.b = bb;
    this.a = aa;
    return this;
  }

  public SelfAdd(color: b2Color): b2Color {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    this.a += color.a;
    return this;
  }

  public Add(color: b2Color, out: b2Color): b2Color {
    out.r = this.r + color.r;
    out.g = this.g + color.g;
    out.b = this.b + color.b;
    out.a = this.a + color.a;
    return out;
  }

  public SelfSub(color: b2Color): b2Color {
    this.r -= color.r;
    this.g -= color.g;
    this.b -= color.b;
    this.a -= color.a;
    return this;
  }

  public Sub(color: b2Color, out: b2Color): b2Color {
    out.r = this.r - color.r;
    out.g = this.g - color.g;
    out.b = this.b - color.b;
    out.a = this.a - color.a;
    return out;
  }

  public SelfMul_0_1(s: number): b2Color {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    this.a *= s;
    return this;
  }

  public Mul_0_1(s: number, out: b2Color): b2Color {
    out.r = this.r * s;
    out.g = this.g * s;
    out.b = this.b * s;
    out.a = this.a * s;
    return this;
  }

  public Mix(mixColor: b2Color, strength: number): void {
    b2Color.MixColors(this, mixColor, strength);
  }

  public static MixColors(colorA: b2Color, colorB: b2Color, strength: number): void {
    const dr = (strength * (colorB.r - colorA.r));
    const dg = (strength * (colorB.g - colorA.g));
    const db = (strength * (colorB.b - colorA.b));
    const da = (strength * (colorB.a - colorA.a));
    colorA.r += dr;
    colorA.g += dg;
    colorA.b += db;
    colorA.a += da;
    colorB.r -= dr;
    colorB.g -= dg;
    colorB.b -= db;
    colorB.a -= da;
  }

  public MakeStyleString(alpha: number = this.a): string {
    return b2Color.MakeStyleString(this.r, this.g, this.b, alpha);
  }

  public static MakeStyleString(r: number, g: number, b: number, a: number = 1.0): string {
    r = Math.round(Math.max(0, Math.min(255, r * 255)));
    g = Math.round(Math.max(0, Math.min(255, g * 255)));
    b = Math.round(Math.max(0, Math.min(255, b * 255)));
    a = Math.max(0, Math.min(1, a));
    if (a < 1.0) {
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  }
}

export const enum b2DrawFlags {
  e_none = 0,
  e_shapeBit = 0x0001, ///< draw shapes
  e_jointBit = 0x0002, ///< draw joint connections
  e_aabbBit = 0x0004, ///< draw axis aligned bounding boxes
  e_pairBit = 0x0008, ///< draw broad-phase pairs
  e_centerOfMassBit = 0x0010, ///< draw center of mass frame
  ///#if B2_ENABLE_PARTICLE
  e_particleBit = 0x0020, ///< draw particles
  ///#endif
  e_controllerBit = 0x0040, /// @see b2Controller list
  e_all = 0x003f
}

/// Implement and register this class with a b2World to provide debug drawing of physics
/// entities in your game.
export class b2Draw {
  public m_drawFlags: b2DrawFlags = 0;

  public SetFlags(flags: b2DrawFlags): void {
    this.m_drawFlags = flags;
  }

  public GetFlags(): b2DrawFlags {
    return this.m_drawFlags;
  }

  public AppendFlags(flags: b2DrawFlags): void {
    this.m_drawFlags |= flags;
  }

  public ClearFlags(flags: b2DrawFlags): void {
    this.m_drawFlags &= ~flags;
  }

  public PushTransform(xf: b2Transform): void {}

  public PopTransform(xf: b2Transform): void {}

  public DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void {}

  public DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void {}

  public DrawCircle(center: b2Vec2, radius: number, color: b2Color): void {}

  public DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void {}

  ///#if B2_ENABLE_PARTICLE
  public DrawParticles(centers: b2Vec2[], radius: number, colors: b2Color[], count: number): void {}
  ///#endif

  public DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void {}

  public DrawTransform(xf: b2Transform): void {}
}
