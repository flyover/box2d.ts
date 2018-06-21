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
            /// Polygons have a maximum number of vertices equal to b2_maxPolygonVertices.
            /// In most cases you should not need many vertices for a convex polygon.
            b2PolygonShape = class b2PolygonShape extends b2Shape_2.b2Shape {
                constructor() {
                    super(b2Shape_2.b2ShapeType.e_polygonShape, b2Settings_1.b2_polygonRadius);
                    this.m_centroid = new b2Math_1.b2Vec2(0, 0);
                    this.m_vertices = []; // b2Vec2.MakeArray(b2_maxPolygonVertices);
                    this.m_normals = []; // b2Vec2.MakeArray(b2_maxPolygonVertices);
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
                    // DEBUG: b2Assert(3 <= count && count <= b2_maxPolygonVertices);
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
                    const hull = b2PolygonShape.Set_s_hull;
                    let m = 0;
                    let ih = i0;
                    for (;;) {
                        // DEBUG: b2Assert(m < b2_maxPolygonVertices);
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
                    log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2Settings_1.b2_maxPolygonVertices);
                    for (let i = 0; i < this.m_count; ++i) {
                        log("    vs[%d].Set(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQb2x5Z29uU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9Db2xsaXNpb24vU2hhcGVzL2IyUG9seWdvblNoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEVBQTBFO1lBQzFFLDBCQUEwQjtZQUMxQiw4RUFBOEU7WUFDOUUseUVBQXlFO1lBQ3pFLGlCQUFBLG9CQUE0QixTQUFRLGlCQUFPO2dCQU16QztvQkFDRSxLQUFLLENBQUMscUJBQVcsQ0FBQyxjQUFjLEVBQUUsNkJBQWdCLENBQUMsQ0FBQztvQkFOdEMsZUFBVSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDL0MsZUFBVSxHQUFhLEVBQUUsQ0FBQyxDQUFDLDJDQUEyQztvQkFDdEUsY0FBUyxHQUFhLEVBQUUsQ0FBQyxDQUFDLDJDQUEyQztvQkFDckUsWUFBTyxHQUFXLENBQUMsQ0FBQztnQkFJM0IsQ0FBQztnQkFFRCxzQkFBc0I7Z0JBQ2YsS0FBSztvQkFDVixPQUFPLElBQUksY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2dCQUVNLElBQUksQ0FBQyxLQUFxQjtvQkFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFbEIsb0RBQW9EO29CQUVwRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFNLENBQUMsU0FBUyxD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