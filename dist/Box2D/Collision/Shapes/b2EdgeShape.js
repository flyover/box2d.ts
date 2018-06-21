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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Shape"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Shape_1, b2EdgeShape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            }
        ],
        execute: function () {
            /// A line segment (edge) shape. These can be connected in chains or loops
            /// to other edge shapes. The connectivity information is used to ensure
            /// correct contact normals.
            b2EdgeShape = class b2EdgeShape extends b2Shape_1.b2Shape {
                constructor() {
                    super(b2Shape_1.b2ShapeType.e_edgeShape, b2Settings_1.b2_polygonRadius);
                    this.m_vertex1 = new b2Math_1.b2Vec2();
                    this.m_vertex2 = new b2Math_1.b2Vec2();
                    this.m_vertex0 = new b2Math_1.b2Vec2();
                    this.m_vertex3 = new b2Math_1.b2Vec2();
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
                    const v1 = b2Math_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeDistance_s_v1);
                    const v2 = b2Math_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeDistance_s_v2);
                    const d = b2Math_1.b2Vec2.SubVV(p, v1, b2EdgeShape.ComputeDistance_s_d);
                    const s = b2Math_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.ComputeDistance_s_s);
                    const ds = b2Math_1.b2Vec2.DotVV(d, s);
                    if (ds > 0) {
                        const s2 = b2Math_1.b2Vec2.DotVV(s, s);
                        if (ds > s2) {
                            b2Math_1.b2Vec2.SubVV(p, v2, d);
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
                    const p1 = b2Math_1.b2Transform.MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
                    const p2 = b2Math_1.b2Transform.MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
                    const d = b2Math_1.b2Vec2.SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
                    const v1 = this.m_vertex1;
                    const v2 = this.m_vertex2;
                    const e = b2Math_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
                    const normal = output.normal.Set(e.y, -e.x).SelfNormalize();
                    // q = p1 + t * d
                    // dot(normal, q - v1) = 0
                    // dot(normal, p1 - v1) + t * dot(normal, d) = 0
                    const numerator = b2Math_1.b2Vec2.DotVV(normal, b2Math_1.b2Vec2.SubVV(v1, p1, b2Math_1.b2Vec2.s_t0));
                    const denominator = b2Math_1.b2Vec2.DotVV(normal, d);
                    if (denominator === 0) {
                        return false;
                    }
                    const t = numerator / denominator;
                    if (t < 0 || input.maxFraction < t) {
                        return false;
                    }
                    const q = b2Math_1.b2Vec2.AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
                    // q = v1 + s * r
                    // s = dot(q - v1, r) / dot(r, r)
                    const r = b2Math_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
                    const rr = b2Math_1.b2Vec2.DotVV(r, r);
                    if (rr === 0) {
                        return false;
                    }
                    const s = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(q, v1, b2Math_1.b2Vec2.s_t0), r) / rr;
                    if (s < 0 || 1 < s) {
                        return false;
                    }
                    output.fraction = t;
                    b2Math_1.b2Rot.MulRV(xf.q, output.normal, output.normal);
                    if (numerator > 0) {
                        output.normal.SelfNeg();
                    }
                    return true;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const v1 = b2Math_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
                    const v2 = b2Math_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
                    b2Math_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                    const r = this.m_radius;
                    aabb.lowerBound.SelfSubXY(r, r);
                    aabb.upperBound.SelfAddXY(r, r);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    b2Math_1.b2Vec2.MidVV(this.m_vertex1, this.m_vertex2, massData.center);
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
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2EdgeShape.ComputeDistance_s_v1 = new b2Math_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_v2 = new b2Math_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_d = new b2Math_1.b2Vec2();
            b2EdgeShape.ComputeDistance_s_s = new b2Math_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            // p = p1 + t * d
            // v = v1 + s * e
            // p1 + t * d = v1 + s * e
            // s * e - t * d = p1 - v1
            b2EdgeShape.RayCast_s_p1 = new b2Math_1.b2Vec2();
            b2EdgeShape.RayCast_s_p2 = new b2Math_1.b2Vec2();
            b2EdgeShape.RayCast_s_d = new b2Math_1.b2Vec2();
            b2EdgeShape.RayCast_s_e = new b2Math_1.b2Vec2();
            b2EdgeShape.RayCast_s_q = new b2Math_1.b2Vec2();
            b2EdgeShape.RayCast_s_r = new b2Math_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2EdgeShape.ComputeAABB_s_v1 = new b2Math_1.b2Vec2();
            b2EdgeShape.ComputeAABB_s_v2 = new b2Math_1.b2Vec2();
            exports_1("b2EdgeShape", b2EdgeShape);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJFZGdlU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9Db2xsaXNpb24vU2hhcGVzL2IyRWRnZVNoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVRiwwRUFBMEU7WUFDMUUsd0VBQXdFO1lBQ3hFLDRCQUE0QjtZQUM1QixjQUFBLGlCQUF5QixTQUFRLGlCQUFPO2dCQVF0QztvQkFDRSxLQUFLLENBQUMscUJBQVcsQ0FBQyxXQUFXLEVBQUUsNkJBQWdCLENBQUMsQ0FBQztvQkFSbkMsY0FBUyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ2pDLGNBQVMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNqQyxjQUFTLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDakMsY0FBUyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzFDLGlCQUFZLEdBQVksS0FBSyxDQUFDO29CQUM5QixpQkFBWSxHQUFZLEtBQUssQ0FBQztnQkFJckMsQ0FBQztnQkFFRCxpQ0FBaUM7Z0JBQzFCLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBTTtvQkFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0JBQzFCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsc0JBQXNCO2dCQUNmLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBa0I7b0JB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