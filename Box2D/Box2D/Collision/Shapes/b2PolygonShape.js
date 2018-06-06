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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQb2x5Z29uU2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMlBvbHlnb25TaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVGLDBFQUEwRTtZQUMxRSwwQkFBMEI7WUFDMUIsOEVBQThFO1lBQzlFLHlFQUF5RTtZQUN6RSxpQkFBQSxvQkFBNEIsU0FBUSxpQkFBTztnQkFNekM7b0JBQ0UsS0FBSyxDQUFDLHFCQUFXLENBQUMsY0FBYyxFQUFFLDZCQUFnQixDQUFDLENBQUM7b0JBTnRDLGVBQVUsR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLGVBQVUsR0FBYSxFQUFFLENBQUMsQ0FBQywyQ0FBMkM7b0JBQ3RFLGNBQVMsR0FBYSxFQUFFLENBQUMsQ0FBQywyQ0FBMkM7b0JBQ3JFLFlBQU8sR0FBVyxDQUFDLENBQUM7Z0JBSTNCLENBQUM7Z0JBRUQsc0JBQXNCO2dCQUNmLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFFTSxJQUFJLENBQUMsS0FBcUI7b0JBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRWxCLG9EQUFvRDtvQkFFcEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hE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