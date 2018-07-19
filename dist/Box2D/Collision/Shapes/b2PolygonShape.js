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
    var b2Settings_1, b2Math_1, b2Shape_1, b2Shape_2, b2PolygonShape;
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
                b2Shape_2 = b2Shape_1_1;
            }
        ],
        execute: function () {
            /// A convex polygon. It is assumed that the interior of the polygon is to
            /// the left of each edge.
            /// In most cases you should not need many vertices for a convex polygon.
            b2PolygonShape = class b2PolygonShape extends b2Shape_2.b2Shape {
                constructor() {
                    super(b2Shape_2.b2ShapeType.e_polygonShape, b2Settings_1.b2_polygonRadius);
                    this.m_centroid = new b2Math_1.b2Vec2(0, 0);
                    this.m_vertices = [];
                    this.m_normals = [];
                    this.m_count = 0;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2PolygonShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    // DEBUG: b2Assert(other instanceof b2PolygonShape);
                    this.m_centroid.Copy(other.m_centroid);
                    this.m_count = other.m_count;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    for (let i = 0; i < this.m_count; ++i) {
                        this.m_vertices[i].Copy(other.m_vertices[i]);
                        this.m_normals[i].Copy(other.m_normals[i]);
                    }
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                Set(vertices, count = vertices.length, start = 0) {
                    // DEBUG: b2Assert(3 <= count);
                    if (count < 3) {
                        return this.SetAsBox(1, 1);
                    }
                    let n = count;
                    // Perform welding and copy vertices into local buffer.
                    const ps = [];
                    for (let i = 0; i < n; ++i) {
                        const /*b2Vec2*/ v = vertices[start + i];
                        let /*bool*/ unique = true;
                        for (let /*int32*/ j = 0; j < ps.length; ++j) {
                            if (b2Math_1.b2Vec2.DistanceSquaredVV(v, ps[j]) < ((0.5 * b2Settings_1.b2_linearSlop) * (0.5 * b2Settings_1.b2_linearSlop))) {
                                unique = false;
                                break;
                            }
                        }
                        if (unique) {
                            ps.push(v);
                        }
                    }
                    n = ps.length;
                    if (n < 3) {
                        // Polygon is degenerate.
                        // DEBUG: b2Assert(false);
                        return this.SetAsBox(1.0, 1.0);
                    }
                    // Create the convex hull using the Gift wrapping algorithm
                    // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
                    // Find the right most point on the hull
                    let i0 = 0;
                    let x0 = ps[0].x;
                    for (let i = 1; i < n; ++i) {
                        const x = ps[i].x;
                        if (x > x0 || (x === x0 && ps[i].y < ps[i0].y)) {
                            i0 = i;
                            x0 = x;
                        }
                    }
                    const hull = [];
                    let m = 0;
                    let ih = i0;
                    for (;;) {
                        hull[m] = ih;
                        let ie = 0;
                        for (let j = 1; j < n; ++j) {
                            if (ie === ih) {
                                ie = j;
                                continue;
                            }
                            const r = b2Math_1.b2Vec2.SubVV(ps[ie], ps[hull[m]], b2PolygonShape.Set_s_r);
                            const v = b2Math_1.b2Vec2.SubVV(ps[j], ps[hull[m]], b2PolygonShape.Set_s_v);
                            const c = b2Math_1.b2Vec2.CrossVV(r, v);
                            if (c < 0) {
                                ie = j;
                            }
                            // Collinearity check
                            if (c === 0 && v.LengthSquared() > r.LengthSquared()) {
                                ie = j;
                            }
                        }
                        ++m;
                        ih = ie;
                        if (ie === i0) {
                            break;
                        }
                    }
                    this.m_count = m;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    // Copy vertices.
                    for (let i = 0; i < m; ++i) {
                        this.m_vertices[i].Copy(ps[hull[i]]);
                    }
                    // Compute normals. Ensure the edges have non-zero length.
                    for (let i = 0; i < m; ++i) {
                        const vertexi1 = this.m_vertices[i];
                        const vertexi2 = this.m_vertices[(i + 1) % m];
                        const edge = b2Math_1.b2Vec2.SubVV(vertexi2, vertexi1, b2Math_1.b2Vec2.s_t0); // edge uses s_t0
                        // DEBUG: b2Assert(edge.LengthSquared() > b2_epsilon_sq);
                        b2Math_1.b2Vec2.CrossVOne(edge, this.m_normals[i]).SelfNormalize();
                    }
                    // Compute the polygon centroid.
                    b2PolygonShape.ComputeCentroid(this.m_vertices, m, this.m_centroid);
                    return this;
                }
                SetAsArray(vertices, count = vertices.length) {
                    return this.Set(vertices, count);
                }
                /// Build vertices to represent an axis-aligned box or an oriented box.
                /// @param hx the half-width.
                /// @param hy the half-height.
                /// @param center the center of the box in local coordinates.
                /// @param angle the rotation of the box in local coordinates.
                SetAsBox(hx, hy, center, angle = 0) {
                    this.m_count = 4;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    this.m_vertices[0].Set((-hx), (-hy));
                    this.m_vertices[1].Set(hx, (-hy));
                    this.m_vertices[2].Set(hx, hy);
                    this.m_vertices[3].Set((-hx), hy);
                    this.m_normals[0].Set(0, (-1));
                    this.m_normals[1].Set(1, 0);
                    this.m_normals[2].Set(0, 1);
                    this.m_normals[3].Set((-1), 0);
                    this.m_centroid.SetZero();
                    if (center) {
                        this.m_centroid.Copy(center);
                        const xf = new b2Math_1.b2Transform();
                        xf.SetPosition(center);
                        xf.SetRotationAngle(angle);
                        // Transform vertices and normals.
                        for (let i = 0; i < this.m_count; ++i) {
                            b2Math_1.b2Transform.MulXV(xf, this.m_vertices[i], this.m_vertices[i]);
                            b2Math_1.b2Rot.MulRV(xf.q, this.m_normals[i], this.m_normals[i]);
                        }
                    }
                    return this;
                }
                TestPoint(xf, p) {
                    const pLocal = b2Math_1.b2Transform.MulTXV(xf, p, b2PolygonShape.TestPoint_s_pLocal);
                    for (let i = 0; i < this.m_count; ++i) {
                        const dot = b2Math_1.b2Vec2.DotVV(this.m_normals[i], b2Math_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2Math_1.b2Vec2.s_t0));
                        if (dot > 0) {
                            return false;
                        }
                    }
                    return true;
                }
                ComputeDistance(xf, p, normal, childIndex) {
                    const pLocal = b2Math_1.b2Transform.MulTXV(xf, p, b2PolygonShape.ComputeDistance_s_pLocal);
                    let maxDistance = -b2Settings_1.b2_maxFloat;
                    const normalForMaxDistance = b2PolygonShape.ComputeDistance_s_normalForMaxDistance.Copy(pLocal);
                    for (let i = 0; i < this.m_count; ++i) {
                        const dot = b2Math_1.b2Vec2.DotVV(this.m_normals[i], b2Math_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2Math_1.b2Vec2.s_t0));
                        if (dot > maxDistance) {
                            maxDistance = dot;
                            normalForMaxDistance.Copy(this.m_normals[i]);
                        }
                    }
                    if (maxDistance > 0) {
                        const minDistance = b2PolygonShape.ComputeDistance_s_minDistance.Copy(normalForMaxDistance);
                        let minDistance2 = maxDistance * maxDistance;
                        for (let i = 0; i < this.m_count; ++i) {
                            const distance = b2Math_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2PolygonShape.ComputeDistance_s_distance);
                            const distance2 = distance.LengthSquared();
                            if (minDistance2 > distance2) {
                                minDistance.Copy(distance);
                                minDistance2 = distance2;
                            }
                        }
                        b2Math_1.b2Rot.MulRV(xf.q, minDistance, normal);
                        normal.Normalize();
                        return Math.sqrt(minDistance2);
                    }
                    else {
                        b2Math_1.b2Rot.MulRV(xf.q, normalForMaxDistance, normal);
                        return maxDistance;
                    }
                }
                RayCast(output, input, xf, childIndex) {
                    // Put the ray into the polygon's frame of reference.
                    const p1 = b2Math_1.b2Transform.MulTXV(xf, input.p1, b2PolygonShape.RayCast_s_p1);
                    const p2 = b2Math_1.b2Transform.MulTXV(xf, input.p2, b2PolygonShape.RayCast_s_p2);
                    const d = b2Math_1.b2Vec2.SubVV(p2, p1, b2PolygonShape.RayCast_s_d);
                    let lower = 0, upper = input.maxFraction;
                    let index = -1;
                    for (let i = 0; i < this.m_count; ++i) {
                        // p = p1 + a * d
                        // dot(normal, p - v) = 0
                        // dot(normal, p1 - v) + a * dot(normal, d) = 0
                        const numerator = b2Math_1.b2Vec2.DotVV(this.m_normals[i], b2Math_1.b2Vec2.SubVV(this.m_vertices[i], p1, b2Math_1.b2Vec2.s_t0));
                        const denominator = b2Math_1.b2Vec2.DotVV(this.m_normals[i], d);
                        if (denominator === 0) {
                            if (numerator < 0) {
                                return false;
                            }
                        }
                        else {
                            // Note: we want this predicate without division:
                            // lower < numerator / denominator, where denominator < 0
                            // Since denominator < 0, we have to flip the inequality:
                            // lower < numerator / denominator <==> denominator * lower > numerator.
                            if (denominator < 0 && numerator < lower * denominator) {
                                // Increase lower.
                                // The segment enters this half-space.
                                lower = numerator / denominator;
                                index = i;
                            }
                            else if (denominator > 0 && numerator < upper * denominator) {
                                // Decrease upper.
                                // The segment exits this half-space.
                                upper = numerator / denominator;
                            }
                        }
                        // The use of epsilon here causes the assert on lower to trip
                        // in some cases. Apparently the use of epsilon was to make edge
                        // shapes work, but now those are handled separately.
                        // if (upper < lower - b2_epsilon)
                        if (upper < lower) {
                            return false;
                        }
                    }
                    // DEBUG: b2Assert(0 <= lower && lower <= input.maxFraction);
                    if (index >= 0) {
                        output.fraction = lower;
                        b2Math_1.b2Rot.MulRV(xf.q, this.m_normals[index], output.normal);
                        return true;
                    }
                    return false;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const lower = b2Math_1.b2Transform.MulXV(xf, this.m_vertices[0], aabb.lowerBound);
                    const upper = aabb.upperBound.Copy(lower);
                    for (let i = 0; i < this.m_count; ++i) {
                        const v = b2Math_1.b2Transform.MulXV(xf, this.m_vertices[i], b2PolygonShape.ComputeAABB_s_v);
                        b2Math_1.b2Vec2.MinV(v, lower, lower);
                        b2Math_1.b2Vec2.MaxV(v, upper, upper);
                    }
                    const r = this.m_radius;
                    lower.SelfSubXY(r, r);
                    upper.SelfAddXY(r, r);
                }
                ComputeMass(massData, density) {
                    // Polygon mass, centroid, and inertia.
                    // Let rho be the polygon density in mass per unit area.
                    // Then:
                    // mass = rho * int(dA)
                    // centroid.x = (1/mass) * rho * int(x * dA)
                    // centroid.y = (1/mass) * rho * int(y * dA)
                    // I = rho * int((x*x + y*y) * dA)
                    //
                    // We can compute these integrals by summing all the integrals
                    // for each triangle of the polygon. To evaluate the integral
                    // for a single triangle, we make a change of variables to
                    // the (u,v) coordinates of the triangle:
                    // x = x0 + e1x * u + e2x * v
                    // y = y0 + e1y * u + e2y * v
                    // where 0 <= u && 0 <= v && u + v <= 1.
                    //
                    // We integrate u from [0,1-v] and then v from [0,1].
                    // We also need to use the Jacobian of the transformation:
                    // D = cross(e1, e2)
                    //
                    // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
                    //
                    // The rest of the derivation is handled by computer algebra.
                    // DEBUG: b2Assert(this.m_count >= 3);
                    const center = b2PolygonShape.ComputeMass_s_center.SetZero();
                    let area = 0;
                    let I = 0;
                    // s is the reference point for forming triangles.
                    // It's location doesn't change the result (except for rounding error).
                    const s = b2PolygonShape.ComputeMass_s_s.SetZero();
                    // This code would put the reference point inside the polygon.
                    for (let i = 0; i < this.m_count; ++i) {
                        s.SelfAdd(this.m_vertices[i]);
                    }
                    s.SelfMul(1 / this.m_count);
                    const k_inv3 = 1 / 3;
                    for (let i = 0; i < this.m_count; ++i) {
                        // Triangle vertices.
                        const e1 = b2Math_1.b2Vec2.SubVV(this.m_vertices[i], s, b2PolygonShape.ComputeMass_s_e1);
                        const e2 = b2Math_1.b2Vec2.SubVV(this.m_vertices[(i + 1) % this.m_count], s, b2PolygonShape.ComputeMass_s_e2);
                        const D = b2Math_1.b2Vec2.CrossVV(e1, e2);
                        const triangleArea = 0.5 * D;
                        area += triangleArea;
                        // Area weighted centroid
                        center.SelfAdd(b2Math_1.b2Vec2.MulSV(triangleArea * k_inv3, b2Math_1.b2Vec2.AddVV(e1, e2, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t1));
                        const ex1 = e1.x;
                        const ey1 = e1.y;
                        const ex2 = e2.x;
                        const ey2 = e2.y;
                        const intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
                        const inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
                        I += (0.25 * k_inv3 * D) * (intx2 + inty2);
                    }
                    // Total mass
                    massData.mass = density * area;
                    // Center of mass
                    // DEBUG: b2Assert(area > b2_epsilon);
                    center.SelfMul(1 / area);
                    b2Math_1.b2Vec2.AddVV(center, s, massData.center);
                    // Inertia tensor relative to the local origin (point s).
                    massData.I = density * I;
                    // Shift to center of mass then to original body origin.
                    massData.I += massData.mass * (b2Math_1.b2Vec2.DotVV(massData.center, massData.center) - b2Math_1.b2Vec2.DotVV(center, center));
                }
                Validate() {
                    for (let i = 0; i < this.m_count; ++i) {
                        const i1 = i;
                        const i2 = (i + 1) % this.m_count;
                        const p = this.m_vertices[i1];
                        const e = b2Math_1.b2Vec2.SubVV(this.m_vertices[i2], p, b2PolygonShape.Validate_s_e);
                        for (let j = 0; j < this.m_count; ++j) {
                            if (j === i1 || j === i2) {
                                continue;
                            }
                            const v = b2Math_1.b2Vec2.SubVV(this.m_vertices[j], p, b2PolygonShape.Validate_s_v);
                            const c = b2Math_1.b2Vec2.CrossVV(e, v);
                            if (c < 0) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = this.m_vertices;
                    proxy.m_count = this.m_count;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    // Transform plane into shape co-ordinates
                    const normalL = b2Math_1.b2Rot.MulTRV(xf.q, normal, b2PolygonShape.ComputeSubmergedArea_s_normalL);
                    const offsetL = offset - b2Math_1.b2Vec2.DotVV(normal, xf.p);
                    const depths = [];
                    let diveCount = 0;
                    let intoIndex = -1;
                    let outoIndex = -1;
                    let lastSubmerged = false;
                    for (let i = 0; i < this.m_count; ++i) {
                        depths[i] = b2Math_1.b2Vec2.DotVV(normalL, this.m_vertices[i]) - offsetL;
                        const isSubmerged = depths[i] < (-b2Settings_1.b2_epsilon);
                        if (i > 0) {
                            if (isSubmerged) {
                                if (!lastSubmerged) {
                                    intoIndex = i - 1;
                                    diveCount++;
                                }
                            }
                            else {
                                if (lastSubmerged) {
                                    outoIndex = i - 1;
                                    diveCount++;
                                }
                            }
                        }
                        lastSubmerged = isSubmerged;
                    }
                    switch (diveCount) {
                        case 0:
                            if (lastSubmerged) {
                                // Completely submerged
                                const md = b2PolygonShape.ComputeSubmergedArea_s_md;
                                this.ComputeMass(md, 1);
                                b2Math_1.b2Transform.MulXV(xf, md.center, c);
                                return md.mass;
                            }
                            else {
                                // Completely dry
                                return 0;
                            }
                        case 1:
                            if (intoIndex === (-1)) {
                                intoIndex = this.m_count - 1;
                            }
                            else {
                                outoIndex = this.m_count - 1;
                            }
                            break;
                    }
                    const intoIndex2 = ((intoIndex + 1) % this.m_count);
                    const outoIndex2 = ((outoIndex + 1) % this.m_count);
                    const intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
                    const outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
                    const intoVec = b2PolygonShape.ComputeSubmergedArea_s_intoVec.Set(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
                    const outoVec = b2PolygonShape.ComputeSubmergedArea_s_outoVec.Set(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
                    // Initialize accumulator
                    let area = 0;
                    const center = b2PolygonShape.ComputeSubmergedArea_s_center.SetZero();
                    let p2 = this.m_vertices[intoIndex2];
                    let p3;
                    // An awkward loop from intoIndex2+1 to outIndex2
                    let i = intoIndex2;
                    while (i !== outoIndex2) {
                        i = (i + 1) % this.m_count;
                        if (i === outoIndex2) {
                            p3 = outoVec;
                        }
                        else {
                            p3 = this.m_vertices[i];
                        }
                        const triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
                        area += triangleArea;
                        // Area weighted centroid
                        center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
                        center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
                        p2 = p3;
                    }
                    // Normalize and transform centroid
                    center.SelfMul(1 / area);
                    b2Math_1.b2Transform.MulXV(xf, center, c);
                    return area;
                }
                Dump(log) {
                    log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
                    log("    const vs: b2Vec2[] = [];\n");
                    for (let i = 0; i < this.m_count; ++i) {
                        log("    vs[%d] = new b2Vec2(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    log("    shape.Set(vs, %d);\n", this.m_count);
                }
                static ComputeCentroid(vs, count, out) {
                    // DEBUG: b2Assert(count >= 3);
                    const c = out;
                    c.SetZero();
                    let area = 0;
                    // s is the reference point for forming triangles.
                    // It's location doesn't change the result (except for rounding error).
                    const pRef = b2PolygonShape.ComputeCentroid_s_pRef.SetZero();
                    /*
                #if 0
                    // This code would put the reference point inside the polygon.
                    for (let i: number = 0; i < count; ++i) {
                      pRef.SelfAdd(vs[i]);
                    }
                    pRef.SelfMul(1 / count);
                #endif
                    */
                    const inv3 = 1 / 3;
                    for (let i = 0; i < count; ++i) {
                        // Triangle vertices.
                        const p1 = pRef;
                        const p2 = vs[i];
                        const p3 = vs[(i + 1) % count];
                        const e1 = b2Math_1.b2Vec2.SubVV(p2, p1, b2PolygonShape.ComputeCentroid_s_e1);
                        const e2 = b2Math_1.b2Vec2.SubVV(p3, p1, b2PolygonShape.ComputeCentroid_s_e2);
                        const D = b2Math_1.b2Vec2.CrossVV(e1, e2);
                        const triangleArea = 0.5 * D;
                        area += triangleArea;
                        // Area weighted centroid
                        c.x += triangleArea * inv3 * (p1.x + p2.x + p3.x);
                        c.y += triangleArea * inv3 * (p1.y + p2.y + p3.y);
                    }
                    // Centroid
                    // DEBUG: b2Assert(area > b2_epsilon);
                    c.SelfMul(1 / area);
                    return c;
                }
            };
            /// Create a convex hull from the given array of points.
            /// @warning the points may be re-ordered, even if they form a convex polygon
            /// @warning collinear points are handled but not removed. Collinear points
            /// may lead to poor stacking behavior.
            b2PolygonShape.Set_s_r = new b2Math_1.b2Vec2();
            b2PolygonShape.Set_s_v = new b2Math_1.b2Vec2();
            /// @see b2Shape::TestPoint
            b2PolygonShape.TestPoint_s_pLocal = new b2Math_1.b2Vec2();
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2PolygonShape.ComputeDistance_s_pLocal = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_normalForMaxDistance = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_minDistance = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_distance = new b2Math_1.b2Vec2();
            // #endif
            /// Implement b2Shape.
            b2PolygonShape.RayCast_s_p1 = new b2Math_1.b2Vec2();
            b2PolygonShape.RayCast_s_p2 = new b2Math_1.b2Vec2();
            b2PolygonShape.RayCast_s_d = new b2Math_1.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2PolygonShape.ComputeAABB_s_v = new b2Math_1.b2Vec2();
            /// @see b2Shape::ComputeMass
            b2PolygonShape.ComputeMass_s_center = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeMass_s_s = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeMass_s_e1 = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeMass_s_e2 = new b2Math_1.b2Vec2();
            b2PolygonShape.Validate_s_e = new b2Math_1.b2Vec2();
            b2PolygonShape.Validate_s_v = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_normalL = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_md = new b2Shape_1.b2MassData();
            b2PolygonShape.ComputeSubmergedArea_s_intoVec = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_outoVec = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_center = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_pRef = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_e1 = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_e2 = new b2Math_1.b2Vec2();
            exports_1("b2PolygonShape", b2PolygonShape);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQb2x5Z29uU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9Db2xsaXNpb24vU2hhcGVzL2IyUG9seWdvblNoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEVBQTBFO1lBQzFFLDBCQUEwQjtZQUMxQix5RUFBeUU7WUFDekUsaUJBQUEsb0JBQTRCLFNBQVEsaUJBQU87Z0JBTXpDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLGNBQWMsRUFBRSw2QkFBZ0IsQ0FBQyxDQUFDO29CQU50QyxlQUFVLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxlQUFVLEdBQWEsRUFBRSxDQUFDO29CQUMxQixjQUFTLEdBQWEsRUFBRSxDQUFDO29CQUN6QixZQUFPLEdBQVcsQ0FBQyxDQUFDO2dCQUkzQixDQUFDO2dCQUVELHNCQUFzQjtnQkFDZixLQUFLO29CQUNWLE9BQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQXFCO29CQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUVsQixvREFBb0Q7b0JBRXBELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNoRCxL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