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
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Shape_1, b2Shape_2, b2PolygonShape;
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
        execute: function () {/*
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
            /// A convex polygon. It is assumed that the interior of the polygon is to
            /// the left of each edge.
            /// Polygons have a maximum number of vertices equal to b2_maxPolygonVertices.
            /// In most cases you should not need many vertices for a convex polygon.
            b2PolygonShape = class b2PolygonShape extends b2Shape_2.b2Shape {
                constructor() {
                    super(2 /* e_polygonShape */, b2Settings_1.b2_polygonRadius);
                    this.m_centroid = new b2Math_1.b2Vec2(0, 0);
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxPolygonVertices);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxPolygonVertices);
                    this.m_count = 0;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2PolygonShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    ///b2Assert(other instanceof b2PolygonShape);
                    this.m_centroid.Copy(other.m_centroid);
                    this.m_count = other.m_count;
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
                    ///b2Assert(3 <= count && count <= b2_maxPolygonVertices);
                    if (count < 3) {
                        return this.SetAsBox(1, 1);
                    }
                    let n = b2Math_1.b2Min(count, b2Settings_1.b2_maxPolygonVertices);
                    // Perform welding and copy vertices into local buffer.
                    const ps = b2PolygonShape.Set_s_ps;
                    let tempCount = 0;
                    for (let i = 0; i < n; ++i) {
                        const /*b2Vec2*/ v = vertices[start + i];
                        let /*bool*/ unique = true;
                        for (let /*int32*/ j = 0; j < tempCount; ++j) {
                            if (b2Math_1.b2Vec2.DistanceSquaredVV(v, ps[j]) < ((0.5 * b2Settings_1.b2_linearSlop) * (0.5 * b2Settings_1.b2_linearSlop))) {
                                unique = false;
                                break;
                            }
                        }
                        if (unique) {
                            ps[tempCount++].Copy(v); // ps[tempCount++] = v;
                        }
                    }
                    n = tempCount;
                    if (n < 3) {
                        // Polygon is degenerate.
                        ///b2Assert(false);
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
                    const hull = b2PolygonShape.Set_s_hull;
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
                    // Copy vertices.
                    for (let i = 0; i < m; ++i) {
                        this.m_vertices[i].Copy(ps[hull[i]]);
                    }
                    // Compute normals. Ensure the edges have non-zero length.
                    for (let i = 0; i < m; ++i) {
                        const vertexi1 = this.m_vertices[i];
                        const vertexi2 = this.m_vertices[(i + 1) % m];
                        const edge = b2Math_1.b2Vec2.SubVV(vertexi2, vertexi1, b2Math_1.b2Vec2.s_t0); // edge uses s_t0
                        ///b2Assert(edge.LengthSquared() > b2_epsilon_sq);
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
                    this.m_vertices[0].Set((-hx), (-hy));
                    this.m_vertices[1].Set(hx, (-hy));
                    this.m_vertices[2].Set(hx, hy);
                    this.m_vertices[3].Set((-hx), hy);
                    this.m_normals[0].Set(0, (-1));
                    this.m_normals[1].Set(1, 0);
                    this.m_normals[2].Set(0, 1);
                    this.m_normals[3].Set((-1), 0);
                    this.m_centroid.SetZero();
                    if (center instanceof b2Math_1.b2Vec2) {
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
                    ///b2Assert(0 <= lower && lower <= input.maxFraction);
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
                    ///b2Assert(this.m_count >= 3);
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
                    ///b2Assert(area > b2_epsilon);
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
                    const depths = b2PolygonShape.ComputeSubmergedArea_s_depths;
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
                        if (i === outoIndex2)
                            p3 = outoVec;
                        else
                            p3 = this.m_vertices[i];
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
                    log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2Settings_1.b2_maxPolygonVertices);
                    for (let i = 0; i < this.m_count; ++i) {
                        log("    vs[%d].Set(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    log("    shape.Set(vs, %d);\n", this.m_count);
                }
                static ComputeCentroid(vs, count, out) {
                    ///b2Assert(count >= 3);
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
                    ///b2Assert(area > b2_epsilon);
                    c.SelfMul(1 / area);
                    return c;
                }
            };
            /// Create a convex hull from the given array of points.
            /// The count must be in the range [3, b2_maxPolygonVertices].
            /// @warning the points may be re-ordered, even if they form a convex polygon
            /// @warning collinear points are handled but not removed. Collinear points
            /// may lead to poor stacking behavior.
            b2PolygonShape.Set_s_ps = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxPolygonVertices);
            b2PolygonShape.Set_s_hull = b2Settings_1.b2MakeNumberArray(b2Settings_1.b2_maxPolygonVertices);
            b2PolygonShape.Set_s_r = new b2Math_1.b2Vec2();
            b2PolygonShape.Set_s_v = new b2Math_1.b2Vec2();
            /// @see b2Shape::TestPoint
            b2PolygonShape.TestPoint_s_pLocal = new b2Math_1.b2Vec2();
            ///#if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2PolygonShape.ComputeDistance_s_pLocal = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_normalForMaxDistance = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_minDistance = new b2Math_1.b2Vec2();
            b2PolygonShape.ComputeDistance_s_distance = new b2Math_1.b2Vec2();
            ///#endif
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
            b2PolygonShape.ComputeSubmergedArea_s_depths = b2Settings_1.b2MakeNumberArray(b2Settings_1.b2_maxPolygonVertices);
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
