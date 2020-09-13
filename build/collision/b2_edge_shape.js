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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_shape.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_shape_js_1, b2EdgeShape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_shape_js_1_1) {
                b2_shape_js_1 = b2_shape_js_1_1;
            }
        ],
        execute: function () {
            /// A line segment (edge) shape. These can be connected in chains or loops
            /// to other edge shapes. Edges created independently are two-sided and do
            /// no provide smooth movement across junctions.
            b2EdgeShape = class b2EdgeShape extends b2_shape_js_1.b2Shape {
                constructor() {
                    super(b2_shape_js_1.b2ShapeType.e_edgeShape, b2_settings_js_1.b2_polygonRadius);
                    this.m_vertex1 = new b2_math_js_1.b2Vec2();
                    this.m_vertex2 = new b2_math_js_1.b2Vec2();
                    this.m_vertex0 = new b2_math_js_1.b2Vec2();
                    this.m_vertex3 = new b2_math_js_1.b2Vec2();
                    /// Uses m_vertex0 and m_vertex3 to create smooth collision.
                    this.m_oneSided = false;
                }
                /// Set this as a part of a sequence. Vertex v0 precedes the edge and vertex v3
                /// follows. These extra vertices are used to provide smooth movement
                /// across junctions. This also makes the collision one-sided. The edge
                /// normal points to the right looking from v1 to v2.
                // void SetOneSided(const b2Vec2& v0, const b2Vec2& v1,const b2Vec2& v2, const b2Vec2& v3);
                SetOneSided(v0, v1, v2, v3) {
                    this.m_vertex0.Copy(v0);
                    this.m_vertex1.Copy(v1);
                    this.m_vertex2.Copy(v2);
                    this.m_vertex3.Copy(v3);
                    this.m_oneSided = true;
                    return this;
                }
                /// Set this as an isolated edge. Collision is two-sided.
                SetTwoSided(v1, v2) {
                    this.m_vertex1.Copy(v1);
                    this.m_vertex2.Copy(v2);
                    this.m_oneSided = false;
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
                    this.m_oneSided = other.m_oneSided;
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
                    const v1 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeDistance_s_v1);
                    const v2 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeDistance_s_v2);
                    const d = b2_math_js_1.b2Vec2.SubVV(p, v1, b2EdgeShape.ComputeDistance_s_d);
                    const s = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.ComputeDistance_s_s);
                    const ds = b2_math_js_1.b2Vec2.DotVV(d, s);
                    if (ds > 0) {
                        const s2 = b2_math_js_1.b2Vec2.DotVV(s, s);
                        if (ds > s2) {
                            b2_math_js_1.b2Vec2.SubVV(p, v2, d);
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
                    const p1 = b2_math_js_1.b2Transform.MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
                    const p2 = b2_math_js_1.b2Transform.MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
                    const d = b2_math_js_1.b2Vec2.SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
                    const v1 = this.m_vertex1;
                    const v2 = this.m_vertex2;
                    const e = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
                    // Normal points to the right, looking from v1 at v2
                    const normal = output.normal.Set(e.y, -e.x).SelfNormalize();
                    // q = p1 + t * d
                    // dot(normal, q - v1) = 0
                    // dot(normal, p1 - v1) + t * dot(normal, d) = 0
                    const numerator = b2_math_js_1.b2Vec2.DotVV(normal, b2_math_js_1.b2Vec2.SubVV(v1, p1, b2_math_js_1.b2Vec2.s_t0));
                    if (this.m_oneSided && numerator > 0.0) {
                        return false;
                    }
                    const denominator = b2_math_js_1.b2Vec2.DotVV(normal, d);
                    if (denominator === 0) {
                        return false;
                    }
                    const t = numerator / denominator;
                    if (t < 0 || input.maxFraction < t) {
                        return false;
                    }
                    const q = b2_math_js_1.b2Vec2.AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
                    // q = v1 + s * r
                    // s = dot(q - v1, r) / dot(r, r)
                    const r = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
                    const rr = b2_math_js_1.b2Vec2.DotVV(r, r);
                    if (rr === 0) {
                        return false;
                    }
                    const s = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(q, v1, b2_math_js_1.b2Vec2.s_t0), r) / rr;
                    if (s < 0 || 1 < s) {
                        return false;
                    }
                    output.fraction = t;
                    b2_math_js_1.b2Rot.MulRV(xf.q, output.normal, output.normal);
                    if (numerator > 0) {
                        output.normal.SelfNeg();
                    }
                    return true;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const v1 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
                    const v2 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
                    b2_math_js_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2_math_js_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                    const r = this.m_radius;
                    aabb.lowerBound.SelfSubXY(r, r);
                    aabb.upperBound.SelfAddXY(r, r);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    b2_math_js_1.b2Vec2.MidVV(this.m_vertex1, this.m_vertex2, massData.center);
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
                    log("    shape.m_oneSided = %s;\n", this.m_oneSided);
                }
            };
            exports_1("b2EdgeShape", b2EdgeShape);
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2EdgeShape.ComputeDistance_s_v1 = new b2_math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_v2 = new b2_math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_d = new b2_math_js_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_s = new b2_math_js_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            // p = p1 + t * d
            // v = v1 + s * e
            // p1 + t * d = v1 + s * e
            // s * e - t * d = p1 - v1
            b2EdgeShape.RayCast_s_p1 = new b2_math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_p2 = new b2_math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_d = new b2_math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_e = new b2_math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_q = new b2_math_js_1.b2Vec2();
            b2EdgeShape.RayCast_s_r = new b2_math_js_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2EdgeShape.ComputeAABB_s_v1 = new b2_math_js_1.b2Vec2();
            b2EdgeShape.ComputeAABB_s_v2 = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZWRnZV9zaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2xsaXNpb24vYjJfZWRnZV9zaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEVBQTBFO1lBQzFFLDBFQUEwRTtZQUMxRSxnREFBZ0Q7WUFDaEQsY0FBQSxNQUFhLFdBQVksU0FBUSxxQkFBTztnQkFTdEM7b0JBQ0UsS0FBSyxDQUFDLHlCQUFXLENBQUMsV0FBVyxFQUFFLGlDQUFnQixDQUFDLENBQUM7b0JBVG5DLGNBQVMsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDakMsY0FBUyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUNqQyxjQUFTLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7b0JBQ2pDLGNBQVMsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFFakQsNERBQTREO29CQUNyRCxlQUFVLEdBQVksS0FBSyxDQUFDO2dCQUluQyxDQUFDO2dCQUVELCtFQUErRTtnQkFDaEYscUVBQXFFO2dCQUNyRSx1RUFBdUU7Z0JBQ3ZFLHFEQUFxRDtnQkFDckQsMkZBQTJGO2dCQUNuRixXQUFXLENBQUMsRUFBTSxFQUFFLEVBQU0sRUFBRSxFQUFNLEVBQUUsRUFBTTtvQkFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN2QixPQUFPLElBQUksQ0FBQztnQkFD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