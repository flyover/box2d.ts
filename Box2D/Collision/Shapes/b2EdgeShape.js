/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
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
System.register(["../../Common/b2Settings.js", "../../Common/b2Math.js", "./b2Shape.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Shape_js_1, b2EdgeShape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Shape_js_1_1) {
                b2Shape_js_1 = b2Shape_js_1_1;
            }
        ],
        execute: function () {
            /// A line segment (edge) shape. These can be connected in chains or loops
            /// to other edge shapes. The connectivity information is used to ensure
            /// correct contact normals.
            b2EdgeShape = class b2EdgeShape extends b2Shape_js_1.b2Shape {
                constructor() {
                    super(b2Shape_js_1.b2ShapeType.e_edgeShape, b2Settings_js_1.b2_polygonRadius);
                    this.m_vertex1 = new b2Math_js_1.b2Vec2();
                    this.m_vertex2 = new b2Math_js_1.b2Vec2();
                    this.m_vertex0 = new b2Math_js_1.b2Vec2();
                    this.m_vertex3 = new b2Math_js_1.b2Vec2();
                    this.m_hasVertex0 = false;
                    this.m_hasVertex3 = false;
                }
                /// Set this as an isolated edge.
                Set(v1, v2) {
                    this.m_vertex1.Copy(v1);
                    this.m_vertex2.Copy(v2);
                    this.m_hasVertex0 = false;
                    this.m_hasVertex3 = false;
                    return this;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2EdgeShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    // DEBUG: b2Assert(other instanceof b2EdgeShape);
                    this.m_vertex1.Copy(other.m_vertex1);
                    this.m_vertex2.Copy(other.m_vertex2);
                    this.m_vertex0.Copy(other.m_vertex0);
                    this.m_vertex3.Copy(other.m_vertex3);
                    this.m_hasVertex0 = other.m_hasVertex0;
                    this.m_hasVertex3 = other.m_hasVertex3;
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                /// @see b2Shape::TestPoint
                TestPoint(xf, p) {
                    return false;
                }
                ComputeDistance(xf, p, normal, childIndex) {
                    const v1 = b2Math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeDistance_s_v1);
                    const v2 = b2Math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeDistance_s_v2);
                    const d = b2Math_js_1.b2Vec2.SubVV(p, v1, b2EdgeShape.ComputeDistance_s_d);
                    const s = b2Math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.ComputeDistance_s_s);
                    const ds = b2Math_js_1.b2Vec2.DotVV(d, s);
                    if (ds > 0) {
                        const s2 = b2Math_js_1.b2Vec2.DotVV(s, s);
                        if (ds > s2) {
                            b2Math_js_1.b2Vec2.SubVV(p, v2, d);
                        }
                        else {
                            d.SelfMulSub(ds / s2, s);
                        }
                    }
                    normal.Copy(d);
                    return normal.Normalize();
                }
                RayCast(output, input, xf, childIndex) {
                    // Put the ray into the edge's frame of reference.
                    const p1 = b2Math_js_1.b2Transform.MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
                    const p2 = b2Math_js_1.b2Transform.MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
                    const d = b2Math_js_1.b2Vec2.SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
                    const v1 = this.m_vertex1;
                    const v2 = this.m_vertex2;
                    const e = b2Math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
                    const normal = output.normal.Set(e.y, -e.x).SelfNormalize();
                    // q = p1 + t * d
                    // dot(normal, q - v1) = 0
                    // dot(normal, p1 - v1) + t * dot(normal, d) = 0
                    const numerator = b2Math_js_1.b2Vec2.DotVV(normal, b2Math_js_1.b2Vec2.SubVV(v1, p1, b2Math_js_1.b2Vec2.s_t0));
                    const denominator = b2Math_js_1.b2Vec2.DotVV(normal, d);
                    if (denominator === 0) {
                        return false;
                    }
                    const t = numerator / denominator;
                    if (t < 0 || input.maxFraction < t) {
                        return false;
                    }
                    const q = b2Math_js_1.b2Vec2.AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
                    // q = v1 + s * r
                    // s = dot(q - v1, r) / dot(r, r)
                    const r = b2Math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
                    const rr = b2Math_js_1.b2Vec2.DotVV(r, r);
                    if (rr === 0) {
                        return false;
                    }
                    const s = b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(q, v1, b2Math_js_1.b2Vec2.s_t0), r) / rr;
                    if (s < 0 || 1 < s) {
                        return false;
                    }
                    output.fraction = t;
                    b2Math_js_1.b2Rot.MulRV(xf.q, output.normal, output.normal);
                    if (numerator > 0) {
                        output.normal.SelfNeg();
                    }
                    return true;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const v1 = b2Math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
                    const v2 = b2Math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
                    b2Math_js_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_js_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                    const r = this.m_radius;
                    aabb.lowerBound.SelfSubXY(r, r);
                    aabb.upperBound.SelfAddXY(r, r);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    b2Math_js_1.b2Vec2.MidVV(this.m_vertex1, this.m_vertex2, massData.center);
                    massData.I = 0;
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = proxy.m_buffer;
                    proxy.m_vertices[0].Copy(this.m_vertex1);
                    proxy.m_vertices[1].Copy(this.m_vertex2);
                    proxy.m_count = 2;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    c.SetZero();
                    return 0;
                }
                Dump(log) {
                    log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
                    log("    shape.m_radius = %.15f;\n", this.m_radius);
                    log("    shape.m_vertex0.Set(%.15f, %.15f);\n", this.m_vertex0.x, this.m_vertex0.y);
                    log("    shape.m_vertex1.Set(%.15f, %.15f);\n", this.m_vertex1.x, this.m_vertex1.y);
                    log("    shape.m_vertex2.Set(%.15f, %.15f);\n", this.m_vertex2.x, this.m_vertex2.y);
                    log("    shape.m_vertex3.Set(%.15f, %.15f);\n", this.m_vertex3.x, this.m_vertex3.y);
                    log("    shape.m_hasVertex0 = %s;\n", this.m_hasVertex0);
                    log("    shape.m_hasVertex3 = %s;\n", this.m_hasVertex3);
                }
            };
            exports_1("b2EdgeShape", b2EdgeShape);
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2EdgeShape.ComputeDistance_s_v1 = new b2Math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_v2 = new b2Math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_d = new b2Math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_s = new b2Math_js_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            // p = p1 + t * d
            // v = v1 + s * e
            // p1 + t * d = v1 + s * e
            // s * e - t * d = p1 - v1
            b2EdgeShape.RayCast_s_p1 = new b2Math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_p2 = new b2Math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_d = new b2Math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_e = new b2Math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_q = new b2Math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_r = new b2Math_js_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2EdgeShape.ComputeAABB_s_v1 = new b2Math_js_1.b2Vec2();
            b2EdgeShape.ComputeAABB_s_v2 = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJFZGdlU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkVkZ2VTaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEVBQTBFO1lBQzFFLHdFQUF3RTtZQUN4RSw0QkFBNEI7WUFDNUIsY0FBQSxNQUFhLFdBQVksU0FBUSxvQkFBTztnQkFRdEM7b0JBQ0UsS0FBSyxDQUFDLHdCQUFXLENBQUMsV0FBVyxFQUFFLGdDQUFnQixDQUFDLENBQUM7b0JBUm5DLGNBQVMsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDakMsY0FBUyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUNqQyxjQUFTLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQ2pDLGNBQVMsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDMUMsaUJBQVksR0FBWSxLQUFLLENBQUM7b0JBQzlCLGlCQUFZLEdBQVksS0FBSyxDQUFDO2dCQUlyQyxDQUFDO2dCQUVELGlDQUFpQztnQkFDMUIsR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFNO29CQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO29CQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztvQkFDMUIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxzQkFBc0I7Z0JBQ2YsS0FBSztvQkFDVixPQUFPLElBQUksV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxDQUFDO2dCQUVNLElBQUksQ0FBQyxLQUFrQjtvQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFL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