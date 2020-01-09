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
System.register(["../../Common/b2Settings.js", "../../Common/b2Math.js", "./b2Shape.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Shape_js_1, b2CircleShape;
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
            /// A circle shape.
            b2CircleShape = class b2CircleShape extends b2Shape_js_1.b2Shape {
                constructor(radius = 0) {
                    super(b2Shape_js_1.b2ShapeType.e_circleShape, radius);
                    this.m_p = new b2Math_js_1.b2Vec2();
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
                    const center = b2Math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.TestPoint_s_center);
                    const d = b2Math_js_1.b2Vec2.SubVV(p, center, b2CircleShape.TestPoint_s_d);
                    return b2Math_js_1.b2Vec2.DotVV(d, d) <= b2Math_js_1.b2Sq(this.m_radius);
                }
                ComputeDistance(xf, p, normal, childIndex) {
                    const center = b2Math_js_1.b2Transform.MulXV(xf, this.m_p, b2CircleShape.ComputeDistance_s_center);
                    b2Math_js_1.b2Vec2.SubVV(p, center, normal);
                    return normal.Normalize() - this.m_radius;
                }
                RayCast(output, input, transform, childIndex) {
                    const position = b2Math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.RayCast_s_position);
                    const s = b2Math_js_1.b2Vec2.SubVV(input.p1, position, b2CircleShape.RayCast_s_s);
                    const b = b2Math_js_1.b2Vec2.DotVV(s, s) - b2Math_js_1.b2Sq(this.m_radius);
                    // Solve quadratic equation.
                    const r = b2Math_js_1.b2Vec2.SubVV(input.p2, input.p1, b2CircleShape.RayCast_s_r);
                    const c = b2Math_js_1.b2Vec2.DotVV(s, r);
                    const rr = b2Math_js_1.b2Vec2.DotVV(r, r);
                    const sigma = c * c - rr * b;
                    // Check for negative discriminant and short segment.
                    if (sigma < 0 || rr < b2Settings_js_1.b2_epsilon) {
                        return false;
                    }
                    // Find the point of intersection of the line with the circle.
                    let a = (-(c + b2Math_js_1.b2Sqrt(sigma)));
                    // Is the intersection point on the segment?
                    if (0 <= a && a <= input.maxFraction * rr) {
                        a /= rr;
                        output.fraction = a;
                        b2Math_js_1.b2Vec2.AddVMulSV(s, a, r, output.normal).SelfNormalize();
                        return true;
                    }
                    return false;
                }
                ComputeAABB(aabb, transform, childIndex) {
                    const p = b2Math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.ComputeAABB_s_p);
                    aabb.lowerBound.Set(p.x - this.m_radius, p.y - this.m_radius);
                    aabb.upperBound.Set(p.x + this.m_radius, p.y + this.m_radius);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    const radius_sq = b2Math_js_1.b2Sq(this.m_radius);
                    massData.mass = density * b2Settings_js_1.b2_pi * radius_sq;
                    massData.center.Copy(this.m_p);
                    // inertia about the local origin
                    massData.I = massData.mass * (0.5 * radius_sq + b2Math_js_1.b2Vec2.DotVV(this.m_p, this.m_p));
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = proxy.m_buffer;
                    proxy.m_vertices[0].Copy(this.m_p);
                    proxy.m_count = 1;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    const p = b2Math_js_1.b2Transform.MulXV(xf, this.m_p, new b2Math_js_1.b2Vec2());
                    const l = (-(b2Math_js_1.b2Vec2.DotVV(normal, p) - offset));
                    if (l < (-this.m_radius) + b2Settings_js_1.b2_epsilon) {
                        // Completely dry
                        return 0;
                    }
                    if (l > this.m_radius) {
                        // Completely wet
                        c.Copy(p);
                        return b2Settings_js_1.b2_pi * this.m_radius * this.m_radius;
                    }
                    // Magic
                    const r2 = this.m_radius * this.m_radius;
                    const l2 = l * l;
                    const area = r2 * (b2Math_js_1.b2Asin(l / this.m_radius) + b2Settings_js_1.b2_pi / 2) + l * b2Math_js_1.b2Sqrt(r2 - l2);
                    const com = (-2 / 3 * b2Math_js_1.b2Pow(r2 - l2, 1.5) / area);
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
            exports_1("b2CircleShape", b2CircleShape);
            /// Implement b2Shape.
            b2CircleShape.TestPoint_s_center = new b2Math_js_1.b2Vec2();
            b2CircleShape.TestPoint_s_d = new b2Math_js_1.b2Vec2();
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2CircleShape.ComputeDistance_s_center = new b2Math_js_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            // Collision Detection in Interactive 3D Environments by Gino van den Bergen
            // From Section 3.1.2
            // x = s + a * r
            // norm(x) = radius
            b2CircleShape.RayCast_s_position = new b2Math_js_1.b2Vec2();
            b2CircleShape.RayCast_s_s = new b2Math_js_1.b2Vec2();
            b2CircleShape.RayCast_s_r = new b2Math_js_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2CircleShape.ComputeAABB_s_p = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaXJjbGVTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ2lyY2xlU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVGLG1CQUFtQjtZQUNuQixnQkFBQSxNQUFhLGFBQWMsU0FBUSxvQkFBTztnQkFHeEMsWUFBWSxTQUFpQixDQUFDO29CQUM1QixLQUFLLENBQUMsd0JBQVcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBSDNCLFFBQUcsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztnQkFJM0MsQ0FBQztnQkFFTSxHQUFHLENBQUMsUUFBWSxFQUFFLFNBQWlCLElBQUksQ0FBQyxRQUFRO29CQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsc0JBQXNCO2dCQUNmLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBb0I7b0JBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRWxCLG1EQUFtRDtvQkFFbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELCtCQUErQjtnQkFDeEIsYUFBYTtvQkFDbEIsT0FBTyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFLTSxTQUFTLENBQUMsU0FBc0IsRUFBRSxDQUFLO29CQUM1QyxNQUFNLE1BQU0sR0FBVyx1QkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUs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