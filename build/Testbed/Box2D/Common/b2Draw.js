"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/// Color for debug drawing. Each value has the range [0,1].
class b2Color {
    constructor(rr = 0.5, gg = 0.5, bb = 0.5, aa = 1.0) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        this.a = aa;
    }
    Clone() {
        return new b2Color().Copy(this);
    }
    Copy(other) {
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
        this.a = other.a;
        return this;
    }
    IsEqual(color) {
        return (this.r === color.r) && (this.g === color.g) && (this.b === color.b) && (this.a === color.a);
    }
    IsZero() {
        return (this.r === 0) && (this.g === 0) && (this.b === 0) && (this.a === 0);
    }
    GetColor(out) {
        out.Copy(this);
        return out;
    }
    SetColor(color) {
        this.Copy(color);
    }
    Set(a0, a1, a2, a3 = 1.0) {
        if (a0 instanceof b2Color) {
            this.Copy(a0);
        }
        else {
            this.SetRGBA(a0, a1, a2, a3);
        }
    }
    SetRGB(rr, gg, bb) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        return this;
    }
    SetRGBA(rr, gg, bb, aa) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        this.a = aa;
        return this;
    }
    SelfAdd(color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        this.a += color.a;
        return this;
    }
    Add(color, out) {
        out.r = this.r + color.r;
        out.g = this.g + color.g;
        out.b = this.b + color.b;
        out.a = this.a + color.a;
        return out;
    }
    SelfSub(color) {
        this.r -= color.r;
        this.g -= color.g;
        this.b -= color.b;
        this.a -= color.a;
        return this;
    }
    Sub(color, out) {
        out.r = this.r - color.r;
        out.g = this.g - color.g;
        out.b = this.b - color.b;
        out.a = this.a - color.a;
        return out;
    }
    SelfMul_0_1(s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    }
    Mul_0_1(s, out) {
        out.r = this.r * s;
        out.g = this.g * s;
        out.b = this.b * s;
        out.a = this.a * s;
        return this;
    }
    Mix(mixColor, strength) {
        b2Color.MixColors(this, mixColor, strength);
    }
    static MixColors(colorA, colorB, strength) {
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
    MakeStyleString(alpha = this.a) {
        return b2Color.MakeStyleString(this.r, this.g, this.b, alpha);
    }
    static MakeStyleString(r, g, b, a = 1.0) {
        r = Math.round(Math.max(0, Math.min(255, r * 255)));
        g = Math.round(Math.max(0, Math.min(255, g * 255)));
        b = Math.round(Math.max(0, Math.min(255, b * 255)));
        a = Math.max(0, Math.min(1, a));
        if (a < 1.0) {
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        }
        else {
            return "rgb(" + r + "," + g + "," + b + ")";
        }
    }
}
b2Color.RED = new b2Color(1, 0, 0);
b2Color.GREEN = new b2Color(0, 1, 0);
b2Color.BLUE = new b2Color(0, 0, 1);
exports.b2Color = b2Color;
/// Implement and register this class with a b2World to provide debug drawing of physics
/// entities in your game.
class b2Draw {
    constructor() {
        this.m_drawFlags = 0;
    }
    SetFlags(flags) {
        this.m_drawFlags = flags;
    }
    GetFlags() {
        return this.m_drawFlags;
    }
    AppendFlags(flags) {
        this.m_drawFlags |= flags;
    }
    ClearFlags(flags) {
        this.m_drawFlags &= ~flags;
    }
    PushTransform(xf) { }
    PopTransform(xf) { }
    DrawPolygon(vertices, vertexCount, color) { }
    DrawSolidPolygon(vertices, vertexCount, color) { }
    DrawCircle(center, radius, color) { }
    DrawSolidCircle(center, radius, axis, color) { }
    ///#if B2_ENABLE_PARTICLE
    DrawParticles(centers, radius, colors, count) { }
    ///#endif
    DrawSegment(p1, p2, color) { }
    DrawTransform(xf) { }
}
exports.b2Draw = b2Draw;
//# sourceMappingURL=b2Draw.js.map