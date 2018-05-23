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
    var __moduleName = context_1 && context_1.id;
    var b2Color, b2DrawFlags, b2Draw;
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
            };
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
                ///#if B2_ENABLE_PARTICLE
                b2DrawFlags[b2DrawFlags["e_particleBit"] = 32] = "e_particleBit";
                ///#endif
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
            };
            exports_1("b2Draw", b2Draw);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJEcmF3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7OztZQUlGLDREQUE0RDtZQUM1RCxVQUFBO2dCQVVFLFlBQVksS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHLEVBQUUsS0FBYSxHQUFHO29CQUNoRixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBYztvQkFDeEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNqQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLE9BQU8sQ0FBQyxLQUFjO29CQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RHLENBQUM7Z0JBRU0sTUFBTTtvQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDOUUsQ0FBQztnQkFFTSxRQUFRLENBQUMsR0FBWTtvQkFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDZixPQUFPLEdBQUcsQ0FBQztnQkFDYixDQUFDO2dCQUVNLFFBQVEsQ0FBQyxLQUFjO29CQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixDQUFDO2dCQUVNLEdBQUcsQ0FBQyxFQUFvQixFQUFFLEVBQVcsRUFBRSxFQUFXLEVBQUUsS0FBYSxHQUFHO29CQUN6RSxJQUFJLEVBQUUsWUFBWSxPQUFPLEVBQUU7d0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ2Y7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDOUI7Z0JBQ0gsQ0FBQztnQkFFTSxNQUFNLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO29CQUM5QyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLE9BQU8sQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO29CQUMzRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLE9BQU8sQ0FBQyxLQUFjO29CQUMzQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sR0FBRyxDQUFDLEtBQWMsRUFBRSxHQUFZO29CQUNyQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDekIsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFTSxPQUFPLENBQUMsS0FBYztvQkFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNsQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEdBQUcsQ0FBQyxLQUFjLEVBQUUsR0FBWTtvQkFDckMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBRU0sV0FBVyxDQUFDLENBQVM7b0JBQzFCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNaLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sT0FBTyxDQUFDLENBQVMsRUFBRSxHQUFZO29CQUNwQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEdBQUcsQ0FBQyxRQUFpQixFQUFFLFFBQWdCO29CQUM1QyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlDLENBQUM7Z0JBRU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFlLEVBQUUsTUFBZSxFQUFFLFFBQWdCO29CQUN4RSxNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVNLGVBQWUsQ0FBQyxRQUFnQixJQUFJLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRSxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxHQUFHO29CQUM1RSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO3dCQUNYLE9BQU8sT0FBTyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7cUJBQ3hEO3lCQUFNO3dCQUNMLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO3FCQUM3QztnQkFDSCxDQUFDO2FBQ0YsQ0FBQTtZQXRKZSxXQUFHLEdBQVksSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxhQUFLLEdBQVksSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0QyxZQUFJLEdBQVksSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7WUFzSnJELFdBQWtCLFdBQVc7Z0JBQzNCLGlEQUFVLENBQUE7Z0JBQ1YseURBQW1CLENBQUE7Z0JBQ25CLHlEQUFtQixDQUFBO2dCQUNuQix1REFBa0IsQ0FBQTtnQkFDbEIsdURBQWtCLENBQUE7Z0JBQ2xCLHdFQUEwQixDQUFBO2dCQUMxQix5QkFBeUI7Z0JBQ3pCLGdFQUFzQixDQUFBO2dCQUN0QixTQUFTO2dCQUNULG9FQUF3QixDQUFBO2dCQUN4QixnREFBYyxDQUFBO1lBQ2hCLENBQUMsRUFaaUIsV0FBVyxLQUFYLFdBQVcsUUFZNUI7O1lBRUQsd0ZBQXdGO1lBQ3hGLDBCQUEwQjtZQUMxQixTQUFBO2dCQUFBO29CQUNTLGdCQUFXLEdBQWdCLENBQUMsQ0FBQztnQkFxQ3RDLENBQUM7Z0JBbkNRLFFBQVEsQ0FBQyxLQUFrQjtvQkFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQzNCLENBQUM7Z0JBRU0sUUFBUTtvQkFDYixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLENBQUM7Z0JBRU0sV0FBVyxDQUFDLEtBQWtCO29CQUNuQyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQztnQkFDNUIsQ0FBQztnQkFFTSxVQUFVLENBQUMsS0FBa0I7b0JBQ2xDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU0sYUFBYSxDQUFDLEVBQWUsSUFBUyxDQUFDO2dCQUV2QyxZQUFZLENBQUMsRUFBZSxJQUFTLENBQUM7Z0JBRXRDLFdBQVcsQ0FBQyxRQUFrQixFQUFFLFdBQW1CLEVBQUUsS0FBYyxJQUFTLENBQUM7Z0JBRTdFLGdCQUFnQixDQUFDLFFBQWtCLEVBQUUsV0FBbUIsRUFBRSxLQUFjLElBQVMsQ0FBQztnQkFFbEYsVUFBVSxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsS0FBYyxJQUFTLENBQUM7Z0JBRW5FLGVBQWUsQ0FBQyxNQUFjLEVBQUUsTUFBYyxFQUFFLElBQVksRUFBRSxLQUFjLElBQVMsQ0FBQztnQkFFN0YseUJBQXlCO2dCQUNsQixhQUFhLENBQUMsT0FBaUIsRUFBRSxNQUFjLEVBQUUsTUFBaUIsRUFBRSxLQUFhLElBQVMsQ0FBQztnQkFDbEcsU0FBUztnQkFFRixXQUFXLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxLQUFjLElBQVMsQ0FBQztnQkFFNUQsYUFBYSxDQUFDLEVBQWUsSUFBUyxDQUFDO2FBQy9DLENBQUEifQ==