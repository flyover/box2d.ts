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
            exports_1("b2CircleShape", b2CircleShape);
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaXJjbGVTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ2lyY2xlU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVGLG1CQUFtQjtZQUNuQixnQkFBQSxNQUFhLGFBQWMsU0FBUSxpQkFBTztnQkFHeEMsWUFBWSxTQUFpQixDQUFDO29CQUM1QixLQUFLLENBQUMscUJBQVcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBSDNCLFFBQUcsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO2dCQUkzQyxDQUFDO2dCQUVNLEdBQUcsQ0FBQyxRQUFZLEVBQUUsU0FBaUIsSUFBSSxDQUFDLFFBQVE7b0JBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztvQkFDdkIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxzQkFBc0I7Z0JBQ2YsS0FBSztvQkFDVixPQUFPLElBQUksYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVNLElBQUksQ0FBQyxLQUFvQjtvQkFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFbEIsbURBQW1EO29CQUVuRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsK0JBQStCO2dCQUN4QixhQUFhO29CQUNsQixPQUFPLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUtNLFNBQVMsQ0FBQyxTQUFzQixFQUFFLENBQUs7b0JBQzVDLE1BQU0sTUFBTSxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJ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