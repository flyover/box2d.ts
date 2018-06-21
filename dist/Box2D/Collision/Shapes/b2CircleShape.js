/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
    var b2Settings_1, b2Math_1, b2Shape_1, b2CircleShape;
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
            /// A circle shape.
            b2CircleShape = class b2CircleShape extends b2Shape_1.b2Shape {
                constructor(radius = 0) {
                    super(b2Shape_1.b2ShapeType.e_circleShape, radius);
                    this.m_p = new b2Math_1.b2Vec2();
                }
                Set(position, radius = this.m_radius) {
                    this.m_p.Copy(position);
                    this.m_radius = radius;
                    return this;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2CircleShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    // DEBUG: b2Assert(other instanceof b2CircleShape);
                    this.m_p.Copy(other.m_p);
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                TestPoint(transform, p) {
                    const center = b2Math_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.TestPoint_s_center);
                    const d = b2Math_1.b2Vec2.SubVV(p, center, b2CircleShape.TestPoint_s_d);
                    return b2Math_1.b2Vec2.DotVV(d, d) <= b2Math_1.b2Sq(this.m_radius);
                }
                ComputeDistance(xf, p, normal, childIndex) {
                    const center = b2Math_1.b2Transform.MulXV(xf, this.m_p, b2CircleShape.ComputeDistance_s_center);
                    b2Math_1.b2Vec2.SubVV(p, center, normal);
                    return normal.Normalize() - this.m_radius;
                }
                RayCast(output, input, transform, childIndex) {
                    const position = b2Math_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.RayCast_s_position);
                    const s = b2Math_1.b2Vec2.SubVV(input.p1, position, b2CircleShape.RayCast_s_s);
                    const b = b2Math_1.b2Vec2.DotVV(s, s) - b2Math_1.b2Sq(this.m_radius);
                    // Solve quadratic equation.
                    const r = b2Math_1.b2Vec2.SubVV(input.p2, input.p1, b2CircleShape.RayCast_s_r);
                    const c = b2Math_1.b2Vec2.DotVV(s, r);
                    const rr = b2Math_1.b2Vec2.DotVV(r, r);
                    const sigma = c * c - rr * b;
                    // Check for negative discriminant and short segment.
                    if (sigma < 0 || rr < b2Settings_1.b2_epsilon) {
                        return false;
                    }
                    // Find the point of intersection of the line with the circle.
                    let a = (-(c + b2Math_1.b2Sqrt(sigma)));
                    // Is the intersection point on the segment?
                    if (0 <= a && a <= input.maxFraction * rr) {
                        a /= rr;
                        output.fraction = a;
                        b2Math_1.b2Vec2.AddVMulSV(s, a, r, output.normal).SelfNormalize();
                        return true;
                    }
                    return false;
                }
                ComputeAABB(aabb, transform, childIndex) {
                    const p = b2Math_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.ComputeAABB_s_p);
                    aabb.lowerBound.Set(p.x - this.m_radius, p.y - this.m_radius);
                    aabb.upperBound.Set(p.x + this.m_radius, p.y + this.m_radius);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    const radius_sq = b2Math_1.b2Sq(this.m_radius);
                    massData.mass = density * b2Settings_1.b2_pi * radius_sq;
                    massData.center.Copy(this.m_p);
                    // inertia about the local origin
                    massData.I = massData.mass * (0.5 * radius_sq + b2Math_1.b2Vec2.DotVV(this.m_p, this.m_p));
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = proxy.m_buffer;
                    proxy.m_vertices[0].Copy(this.m_p);
                    proxy.m_count = 1;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    const p = b2Math_1.b2Transform.MulXV(xf, this.m_p, new b2Math_1.b2Vec2());
                    const l = (-(b2Math_1.b2Vec2.DotVV(normal, p) - offset));
                    if (l < (-this.m_radius) + b2Settings_1.b2_epsilon) {
                        // Completely dry
                        return 0;
                    }
                    if (l > this.m_radius) {
                        // Completely wet
                        c.Copy(p);
                        return b2Settings_1.b2_pi * this.m_radius * this.m_radius;
                    }
                    // Magic
                    const r2 = this.m_radius * this.m_radius;
                    const l2 = l * l;
                    const area = r2 * (b2Math_1.b2Asin(l / this.m_radius) + b2Settings_1.b2_pi / 2) + l * b2Math_1.b2Sqrt(r2 - l2);
                    const com = (-2 / 3 * b2Math_1.b2Pow(r2 - l2, 1.5) / area);
                    c.x = p.x + normal.x * com;
                    c.y = p.y + normal.y * com;
                    return area;
                }
                Dump(log) {
                    log("    const shape: b2CircleShape = new b2CircleShape();\n");
                    log("    shape.m_radius = %.15f;\n", this.m_radius);
                    log("    shape.m_p.Set(%.15f, %.15f);\n", this.m_p.x, this.m_p.y);
                }
            };
            /// Implement b2Shape.
            b2CircleShape.TestPoint_s_center = new b2Math_1.b2Vec2();
            b2CircleShape.TestPoint_s_d = new b2Math_1.b2Vec2();
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2CircleShape.ComputeDistance_s_center = new b2Math_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            // Collision Detection in Interactive 3D Environments by Gino van den Bergen
            // From Section 3.1.2
            // x = s + a * r
            // norm(x) = radius
            b2CircleShape.RayCast_s_position = new b2Math_1.b2Vec2();
            b2CircleShape.RayCast_s_s = new b2Math_1.b2Vec2();
            b2CircleShape.RayCast_s_r = new b2Math_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2CircleShape.ComputeAABB_s_p = new b2Math_1.b2Vec2();
            exports_1("b2CircleShape", b2CircleShape);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaXJjbGVTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9TaGFwZXMvYjJDaXJjbGVTaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsbUJBQW1CO1lBQ25CLGdCQUFBLG1CQUEyQixTQUFRLGlCQUFPO2dCQUd4QyxZQUFZLFNBQWlCLENBQUM7b0JBQzVCLEtBQUssQ0FBQyxxQkFBVyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFIM0IsUUFBRyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7Z0JBSTNDLENBQUM7Z0JBRU0sR0FBRyxDQUFDLFFBQVksRUFBRSxTQUFpQixJQUFJLENBQUMsUUFBUTtvQkFDckQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO29CQUN2QixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELHNCQUFzQjtnQkFDZixLQUFLO29CQUNWLE9BQU8sSUFBSSxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQW9CO29CQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUVsQixtREFBbUQ7b0JBRW5ELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCwrQkFBK0I7Z0JBQ3hCLGFBQWE7b0JBQ2xCLE9BQU8sQ0FBQyxDQUFDO2dCQUNYLENBQUM7Z0JBS00sU0FBUyxDQUFDLFNBQXNCLEVBQUUsQ0FBSztvQkFDNUMsTUFBTSxNQUFNLEdBQVcs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