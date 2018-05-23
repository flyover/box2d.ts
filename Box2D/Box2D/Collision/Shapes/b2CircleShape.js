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
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Shape_1, b2CircleShape;
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
                    super(0 /* e_circleShape */, radius);
                    this.m_p = new b2Math_1.b2Vec2();
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2CircleShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    ///b2Assert(other instanceof b2CircleShape);
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
            ///#if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2CircleShape.ComputeDistance_s_center = new b2Math_1.b2Vec2();
            ///#endif
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaXJjbGVTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ2lyY2xlU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVNGLG1CQUFtQjtZQUNuQixnQkFBQSxtQkFBMkIsU0FBUSxpQkFBTztnQkFHeEMsWUFBWSxTQUFpQixDQUFDO29CQUM1QixLQUFLLHdCQUE0QixNQUFNLENBQUMsQ0FBQztvQkFIcEMsUUFBRyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7Z0JBSWxDLENBQUM7Z0JBRUQsc0JBQXNCO2dCQUNmLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBb0I7b0JBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRWxCLDRDQUE0QztvQkFFNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELCtCQUErQjtnQkFDeEIsYUFBYTtvQkFDbEIsT0FBTyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFLTSxTQUFTLENBQUMsU0FBc0IsRUFBRSxDQUFTO29CQUNoRCxNQUFNLE1BQU0sR0FBVyxvQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDaEcsTUFBTSxDQUFDLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDdkUsT0FBTyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxh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