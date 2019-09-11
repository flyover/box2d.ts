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
            exports_1("b2EdgeShape", b2EdgeShape);
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJFZGdlU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkVkZ2VTaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEVBQTBFO1lBQzFFLHdFQUF3RTtZQUN4RSw0QkFBNEI7WUFDNUIsY0FBQSxNQUFhLFdBQVksU0FBUSxpQkFBTztnQkFRdEM7b0JBQ0UsS0FBSyxDQUFDLHFCQUFXLENBQUMsV0FBVyxFQUFFLDZCQUFnQixDQUFDLENBQUM7b0JBUm5DLGNBQVMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNqQyxjQUFTLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDakMsY0FBUyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ2pDLGNBQVMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMxQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsaUJBQVksR0FBWSxLQUFLLENBQUM7Z0JBSXJDLENBQUM7Z0JBRUQsaUNBQWlDO2dCQUMxQixHQUFHLENBQUMsRUFBTSxFQUFFLEVBQU07b0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0JBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO29CQUMxQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELHNCQUFzQjtnQkFDZixLQUFLO29CQUNWLE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQWtCO29CQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FB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