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
System.register([], function (exports_1, context_1) {
    "use strict";
    var b2Color, b2DrawFlags, b2Draw;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /// Color for debug drawing. Each value has the range [0,1].
            b2Color = class b2Color {
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
                Set(r, g, b, a = this.a) {
                    this.SetRGBA(r, g, b, a);
                }
                SetByteRGB(r, g, b) {
                    this.r = r / 0xff;
                    this.g = g / 0xff;
                    this.b = b / 0xff;
                    return this;
                }
                SetByteRGBA(r, g, b, a) {
                    this.r = r / 0xff;
                    this.g = g / 0xff;
                    this.b = b / 0xff;
                    this.a = a / 0xff;
                    return this;
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
                SelfMul(s) {
                    this.r *= s;
                    this.g *= s;
                    this.b *= s;
                    this.a *= s;
                    return this;
                }
                Mul(s, out) {
                    out.r = this.r * s;
                    out.g = this.g * s;
                    out.b = this.b * s;
                    out.a = this.a * s;
                    return out;
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
                    // function clamp(x: number, lo: number, hi: number) { return x < lo ? lo : hi < x ? hi : x; }
                    r *= 255; // r = clamp(r, 0, 255);
                    g *= 255; // g = clamp(g, 0, 255);
                    b *= 255; // b = clamp(b, 0, 255);
                    // a = clamp(a, 0, 1);
                    if (a < 1) {
                        return `rgba(${r},${g},${b},${a})`;
                    }
                    else {
                        return `rgb(${r},${g},${b})`;
                    }
                }
            };
            b2Color.ZERO = new b2Color(0, 0, 0, 0);
            b2Color.RED = new b2Color(1, 0, 0);
            b2Color.GREEN = new b2Color(0, 1, 0);
            b2Color.BLUE = new b2Color(0, 0, 1);
            exports_1("b2Color", b2Color);
            (function (b2DrawFlags) {
                b2DrawFlags[b2DrawFlags["e_none"] = 0] = "e_none";
                b2DrawFlags[b2DrawFlags["e_shapeBit"] = 1] = "e_shapeBit";
                b2DrawFlags[b2DrawFlags["e_jointBit"] = 2] = "e_jointBit";
                b2DrawFlags[b2DrawFlags["e_aabbBit"] = 4] = "e_aabbBit";
                b2DrawFlags[b2DrawFlags["e_pairBit"] = 8] = "e_pairBit";
                b2DrawFlags[b2DrawFlags["e_centerOfMassBit"] = 16] = "e_centerOfMassBit";
                // #if B2_ENABLE_PARTICLE
                b2DrawFlags[b2DrawFlags["e_particleBit"] = 32] = "e_particleBit";
                // #endif
                b2DrawFlags[b2DrawFlags["e_controllerBit"] = 64] = "e_controllerBit";
                b2DrawFlags[b2DrawFlags["e_all"] = 63] = "e_all";
            })(b2DrawFlags || (b2DrawFlags = {}));
            exports_1("b2DrawFlags", b2DrawFlags);
            /// Implement and register this class with a b2World to provide debug drawing of physics
            /// entities in your game.
            b2Draw = class b2Draw {
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
            };
            exports_1("b2Draw", b2Draw);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvQ29tbW9uL2IyRHJhdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7WUFjRiw0REFBNEQ7WUFDNUQsVUFBQSxNQUFhLE9BQU87Z0JBWWxCLFlBQVksS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHO29CQUNoRixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBVztvQkFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNqQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLE9BQU8sQ0FBQyxLQUFXO29CQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMs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