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
System.register(["../common/b2_settings.js", "../common/b2_math.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2DistanceProxy, b2SimplexCache, b2DistanceInput, b2DistanceOutput, b2ShapeCastInput, b2ShapeCastOutput, b2_gjkCalls, b2_gjkIters, b2_gjkMaxIters, b2SimplexVertex, b2Simplex, b2Distance_s_simplex, b2Distance_s_saveA, b2Distance_s_saveB, b2Distance_s_p, b2Distance_s_d, b2Distance_s_normal, b2Distance_s_supportA, b2Distance_s_supportB, b2ShapeCast_s_n, b2ShapeCast_s_simplex, b2ShapeCast_s_wA, b2ShapeCast_s_wB, b2ShapeCast_s_v, b2ShapeCast_s_p, b2ShapeCast_s_pointA, b2ShapeCast_s_pointB;
    var __moduleName = context_1 && context_1.id;
    function b2_gjk_reset() {
        exports_1("b2_gjkCalls", b2_gjkCalls = 0);
        exports_1("b2_gjkIters", b2_gjkIters = 0);
        exports_1("b2_gjkMaxIters", b2_gjkMaxIters = 0);
    }
    exports_1("b2_gjk_reset", b2_gjk_reset);
    function b2Distance(output, cache, input) {
        exports_1("b2_gjkCalls", ++b2_gjkCalls);
        const proxyA = input.proxyA;
        const proxyB = input.proxyB;
        const transformA = input.transformA;
        const transformB = input.transformB;
        // Initialize the simplex.
        const simplex = b2Distance_s_simplex;
        simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
        // Get simplex vertices as an array.
        const vertices = simplex.m_vertices;
        const k_maxIters = 20;
        // These store the vertices of the last simplex so that we
        // can check for duplicates and prevent cycling.
        const saveA = b2Distance_s_saveA;
        const saveB = b2Distance_s_saveB;
        let saveCount = 0;
        // Main iteration loop.
        let iter = 0;
        while (iter < k_maxIters) {
            // Copy simplex so we can identify duplicates.
            saveCount = simplex.m_count;
            for (let i = 0; i < saveCount; ++i) {
                saveA[i] = vertices[i].indexA;
                saveB[i] = vertices[i].indexB;
            }
            switch (simplex.m_count) {
                case 1:
                    break;
                case 2:
                    simplex.Solve2();
                    break;
                case 3:
                    simplex.Solve3();
                    break;
                default:
                    // DEBUG: b2Assert(false);
                    break;
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count === 3) {
                break;
            }
            // Get search direction.
            const d = simplex.GetSearchDirection(b2Distance_s_d);
            // Ensure the search direction is numerically fit.
            if (d.LengthSquared() < b2_settings_js_1.b2_epsilon_sq) {
                // The origin is probably contained by a line segment
                // or triangle. Thus the shapes are overlapped.
                // We can't return zero here even though there may be overlap.
                // In case the simplex is a point, segment, or triangle it is difficult
                // to determine if the origin is contained in the CSO or very close to it.
                break;
            }
            // Compute a tentative new simplex vertex using support points.
            const vertex = vertices[simplex.m_count];
            vertex.indexA = proxyA.GetSupport(b2_math_js_1.b2Rot.MulTRV(transformA.q, b2_math_js_1.b2Vec2.NegV(d, b2_math_js_1.b2Vec2.s_t0), b2Distance_s_supportA));
            b2_math_js_1.b2Transform.MulXV(transformA, proxyA.GetVertex(vertex.indexA), vertex.wA);
            vertex.indexB = proxyB.GetSupport(b2_math_js_1.b2Rot.MulTRV(transformB.q, d, b2Distance_s_supportB));
            b2_math_js_1.b2Transform.MulXV(transformB, proxyB.GetVertex(vertex.indexB), vertex.wB);
            b2_math_js_1.b2Vec2.SubVV(vertex.wB, vertex.wA, vertex.w);
            // Iteration count is equated to the number of support point calls.
            ++iter;
            exports_1("b2_gjkIters", ++b2_gjkIters);
            // Check for duplicate support points. This is the main termination criteria.
            let duplicate = false;
            for (let i = 0; i < saveCount; ++i) {
                if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i]) {
                    duplicate = true;
                    break;
                }
            }
            // If we found a duplicate support point we must exit to avoid cycling.
            if (duplicate) {
                break;
            }
            // New vertex is ok and needed.
            ++simplex.m_count;
        }
        exports_1("b2_gjkMaxIters", b2_gjkMaxIters = b2_math_js_1.b2Max(b2_gjkMaxIters, iter));
        // Prepare output.
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = b2_math_js_1.b2Vec2.DistanceVV(output.pointA, output.pointB);
        output.iterations = iter;
        // Cache the simplex.
        simplex.WriteCache(cache);
        // Apply radii if requested.
        if (input.useRadii) {
            const rA = proxyA.m_radius;
            const rB = proxyB.m_radius;
            if (output.distance > (rA + rB) && output.distance > b2_settings_js_1.b2_epsilon) {
                // Shapes are still no overlapped.
                // Move the witness points to the outer surface.
                output.distance -= rA + rB;
                const normal = b2_math_js_1.b2Vec2.SubVV(output.pointB, output.pointA, b2Distance_s_normal);
                normal.Normalize();
                output.pointA.SelfMulAdd(rA, normal);
                output.pointB.SelfMulSub(rB, normal);
            }
            else {
                // Shapes are overlapped when radii are considered.
                // Move the witness points to the middle.
                const p = b2_math_js_1.b2Vec2.MidVV(output.pointA, output.pointB, b2Distance_s_p);
                output.pointA.Copy(p);
                output.pointB.Copy(p);
                output.distance = 0;
            }
        }
    }
    exports_1("b2Distance", b2Distance);
    function b2ShapeCast(output, input) {
        output.iterations = 0;
        output.lambda = 1.0;
        output.normal.SetZero();
        output.point.SetZero();
        // const b2DistanceProxy* proxyA = &input.proxyA;
        const proxyA = input.proxyA;
        // const b2DistanceProxy* proxyB = &input.proxyB;
        const proxyB = input.proxyB;
        // float32 radiusA = b2Max(proxyA.m_radius, b2_polygonRadius);
        const radiusA = b2_math_js_1.b2Max(proxyA.m_radius, b2_settings_js_1.b2_polygonRadius);
        // float32 radiusB = b2Max(proxyB.m_radius, b2_polygonRadius);
        const radiusB = b2_math_js_1.b2Max(proxyB.m_radius, b2_settings_js_1.b2_polygonRadius);
        // float32 radius = radiusA + radiusB;
        const radius = radiusA + radiusB;
        // b2Transform xfA = input.transformA;
        const xfA = input.transformA;
        // b2Transform xfB = input.transformB;
        const xfB = input.transformB;
        // b2Vec2 r = input.translationB;
        const r = input.translationB;
        // b2Vec2 n(0.0f, 0.0f);
        const n = b2ShapeCast_s_n.Set(0.0, 0.0);
        // float32 lambda = 0.0f;
        let lambda = 0.0;
        // Initial simplex
        const simplex = b2ShapeCast_s_simplex;
        simplex.m_count = 0;
        // Get simplex vertices as an array.
        // b2SimplexVertex* vertices = &simplex.m_v1;
        const vertices = simplex.m_vertices;
        // Get support point in -r direction
        // int32 indexA = proxyA.GetSupport(b2MulT(xfA.q, -r));
        let indexA = proxyA.GetSupport(b2_math_js_1.b2Rot.MulTRV(xfA.q, b2_math_js_1.b2Vec2.NegV(r, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t0));
        // b2Vec2 wA = b2Mul(xfA, proxyA.GetVertex(indexA));
        let wA = b2_math_js_1.b2Transform.MulXV(xfA, proxyA.GetVertex(indexA), b2ShapeCast_s_wA);
        // int32 indexB = proxyB.GetSupport(b2MulT(xfB.q, r));
        let indexB = proxyB.GetSupport(b2_math_js_1.b2Rot.MulTRV(xfB.q, r, b2_math_js_1.b2Vec2.s_t0));
        // b2Vec2 wB = b2Mul(xfB, proxyB.GetVertex(indexB));
        let wB = b2_math_js_1.b2Transform.MulXV(xfB, proxyB.GetVertex(indexB), b2ShapeCast_s_wB);
        // b2Vec2 v = wA - wB;
        const v = b2_math_js_1.b2Vec2.SubVV(wA, wB, b2ShapeCast_s_v);
        // Sigma is the target distance between polygons
        // float32 sigma = b2Max(b2_polygonRadius, radius - b2_polygonRadius);
        const sigma = b2_math_js_1.b2Max(b2_settings_js_1.b2_polygonRadius, radius - b2_settings_js_1.b2_polygonRadius);
        // const float32 tolerance = 0.5f * b2_linearSlop;
        const tolerance = 0.5 * b2_settings_js_1.b2_linearSlop;
        // Main iteration loop.
        // const int32 k_maxIters = 20;
        const k_maxIters = 20;
        // int32 iter = 0;
        let iter = 0;
        // while (iter < k_maxIters && b2Abs(v.Length() - sigma) > tolerance)
        while (iter < k_maxIters && b2_math_js_1.b2Abs(v.Length() - sigma) > tolerance) {
            // DEBUG: b2Assert(simplex.m_count < 3);
            output.iterations += 1;
            // Support in direction -v (A - B)
            // indexA = proxyA.GetSupport(b2MulT(xfA.q, -v));
            indexA = proxyA.GetSupport(b2_math_js_1.b2Rot.MulTRV(xfA.q, b2_math_js_1.b2Vec2.NegV(v, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t0));
            // wA = b2Mul(xfA, proxyA.GetVertex(indexA));
            wA = b2_math_js_1.b2Transform.MulXV(xfA, proxyA.GetVertex(indexA), b2ShapeCast_s_wA);
            // indexB = proxyB.GetSupport(b2MulT(xfB.q, v));
            indexB = proxyB.GetSupport(b2_math_js_1.b2Rot.MulTRV(xfB.q, v, b2_math_js_1.b2Vec2.s_t0));
            // wB = b2Mul(xfB, proxyB.GetVertex(indexB));
            wB = b2_math_js_1.b2Transform.MulXV(xfB, proxyB.GetVertex(indexB), b2ShapeCast_s_wB);
            // b2Vec2 p = wA - wB;
            const p = b2_math_js_1.b2Vec2.SubVV(wA, wB, b2ShapeCast_s_p);
            // -v is a normal at p
            v.Normalize();
            // Intersect ray with plane
            const vp = b2_math_js_1.b2Vec2.DotVV(v, p);
            const vr = b2_math_js_1.b2Vec2.DotVV(v, r);
            if (vp - sigma > lambda * vr) {
                if (vr <= 0.0) {
                    return false;
                }
                lambda = (vp - sigma) / vr;
                if (lambda > 1.0) {
                    return false;
                }
                // n = -v;
                n.Copy(v).SelfNeg();
                simplex.m_count = 0;
            }
            // Reverse simplex since it works with B - A.
            // Shift by lambda * r because we want the closest point to the current clip point.
            // Note that the support point p is not shifted because we want the plane equation
            // to be formed in unshifted space.
            // b2SimplexVertex* vertex = vertices + simplex.m_count;
            const vertex = vertices[simplex.m_count];
            vertex.indexA = indexB;
            // vertex.wA = wB + lambda * r;
            vertex.wA.Copy(wB).SelfMulAdd(lambda, r);
            vertex.indexB = indexA;
            // vertex.wB = wA;
            vertex.wB.Copy(wA);
            // vertex.w = vertex.wB - vertex.wA;
            vertex.w.Copy(vertex.wB).SelfSub(vertex.wA);
            vertex.a = 1.0;
            simplex.m_count += 1;
            switch (simplex.m_count) {
                case 1:
                    break;
                case 2:
                    simplex.Solve2();
                    break;
                case 3:
                    simplex.Solve3();
                    break;
                default:
                // DEBUG: b2Assert(false);
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count === 3) {
                // Overlap
                return false;
            }
            // Get search direction.
            // v = simplex.GetClosestPoint();
            simplex.GetClosestPoint(v);
            // Iteration count is equated to the number of support point calls.
            ++iter;
        }
        // Prepare output.
        const pointA = b2ShapeCast_s_pointA;
        const pointB = b2ShapeCast_s_pointB;
        simplex.GetWitnessPoints(pointA, pointB);
        if (v.LengthSquared() > 0.0) {
            // n = -v;
            n.Copy(v).SelfNeg();
            n.Normalize();
        }
        // output.point = pointA + radiusA * n;
        output.normal.Copy(n);
        output.lambda = lambda;
        output.iterations = iter;
        return true;
    }
    exports_1("b2ShapeCast", b2ShapeCast);
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            }
        ],
        execute: function () {
            /// A distance proxy is used by the GJK algorithm.
            /// It encapsulates any shape.
            b2DistanceProxy = class b2DistanceProxy {
                constructor() {
                    this.m_buffer = b2_math_js_1.b2Vec2.MakeArray(2);
                    this.m_vertices = this.m_buffer;
                    this.m_count = 0;
                    this.m_radius = 0;
                }
                Copy(other) {
                    if (other.m_vertices === other.m_buffer) {
                        this.m_vertices = this.m_buffer;
                        this.m_buffer[0].Copy(other.m_buffer[0]);
                        this.m_buffer[1].Copy(other.m_buffer[1]);
                    }
                    else {
                        this.m_vertices = other.m_vertices;
                    }
                    this.m_count = other.m_count;
                    this.m_radius = other.m_radius;
                    return this;
                }
                Reset() {
                    this.m_vertices = this.m_buffer;
                    this.m_count = 0;
                    this.m_radius = 0;
                    return this;
                }
                SetShape(shape, index) {
                    shape.SetupDistanceProxy(this, index);
                }
                SetVerticesRadius(vertices, count, radius) {
                    this.m_vertices = vertices;
                    this.m_count = count;
                    this.m_radius = radius;
                }
                GetSupport(d) {
                    let bestIndex = 0;
                    let bestValue = b2_math_js_1.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2_math_js_1.b2Vec2.DotVV(this.m_vertices[i], d);
                        if (value > bestValue) {
                            bestIndex = i;
                            bestValue = value;
                        }
                    }
                    return bestIndex;
                }
                GetSupportVertex(d) {
                    let bestIndex = 0;
                    let bestValue = b2_math_js_1.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2_math_js_1.b2Vec2.DotVV(this.m_vertices[i], d);
                        if (value > bestValue) {
                            bestIndex = i;
                            bestValue = value;
                        }
                    }
                    return this.m_vertices[bestIndex];
                }
                GetVertexCount() {
                    return this.m_count;
                }
                GetVertex(index) {
                    // DEBUG: b2Assert(0 <= index && index < this.m_count);
                    return this.m_vertices[index];
                }
            };
            exports_1("b2DistanceProxy", b2DistanceProxy);
            b2SimplexCache = class b2SimplexCache {
                constructor() {
                    this.metric = 0;
                    this.count = 0;
                    this.indexA = [0, 0, 0];
                    this.indexB = [0, 0, 0];
                }
                Reset() {
                    this.metric = 0;
                    this.count = 0;
                    return this;
                }
            };
            exports_1("b2SimplexCache", b2SimplexCache);
            b2DistanceInput = class b2DistanceInput {
                constructor() {
                    this.proxyA = new b2DistanceProxy();
                    this.proxyB = new b2DistanceProxy();
                    this.transformA = new b2_math_js_1.b2Transform();
                    this.transformB = new b2_math_js_1.b2Transform();
                    this.useRadii = false;
                }
                Reset() {
                    this.proxyA.Reset();
                    this.proxyB.Reset();
                    this.transformA.SetIdentity();
                    this.transformB.SetIdentity();
                    this.useRadii = false;
                    return this;
                }
            };
            exports_1("b2DistanceInput", b2DistanceInput);
            b2DistanceOutput = class b2DistanceOutput {
                constructor() {
                    this.pointA = new b2_math_js_1.b2Vec2();
                    this.pointB = new b2_math_js_1.b2Vec2();
                    this.distance = 0;
                    this.iterations = 0; ///< number of GJK iterations used
                }
                Reset() {
                    this.pointA.SetZero();
                    this.pointB.SetZero();
                    this.distance = 0;
                    this.iterations = 0;
                    return this;
                }
            };
            exports_1("b2DistanceOutput", b2DistanceOutput);
            /// Input parameters for b2ShapeCast
            b2ShapeCastInput = class b2ShapeCastInput {
                constructor() {
                    this.proxyA = new b2DistanceProxy();
                    this.proxyB = new b2DistanceProxy();
                    this.transformA = new b2_math_js_1.b2Transform();
                    this.transformB = new b2_math_js_1.b2Transform();
                    this.translationB = new b2_math_js_1.b2Vec2();
                }
            };
            exports_1("b2ShapeCastInput", b2ShapeCastInput);
            /// Output results for b2ShapeCast
            b2ShapeCastOutput = class b2ShapeCastOutput {
                constructor() {
                    this.point = new b2_math_js_1.b2Vec2();
                    this.normal = new b2_math_js_1.b2Vec2();
                    this.lambda = 0.0;
                    this.iterations = 0;
                }
            };
            exports_1("b2ShapeCastOutput", b2ShapeCastOutput);
            exports_1("b2_gjkCalls", b2_gjkCalls = 0);
            exports_1("b2_gjkIters", b2_gjkIters = 0);
            exports_1("b2_gjkMaxIters", b2_gjkMaxIters = 0);
            b2SimplexVertex = class b2SimplexVertex {
                constructor() {
                    this.wA = new b2_math_js_1.b2Vec2(); // support point in proxyA
                    this.wB = new b2_math_js_1.b2Vec2(); // support point in proxyB
                    this.w = new b2_math_js_1.b2Vec2(); // wB - wA
                    this.a = 0; // barycentric coordinate for closest point
                    this.indexA = 0; // wA index
                    this.indexB = 0; // wB index
                }
                Copy(other) {
                    this.wA.Copy(other.wA); // support point in proxyA
                    this.wB.Copy(other.wB); // support point in proxyB
                    this.w.Copy(other.w); // wB - wA
                    this.a = other.a; // barycentric coordinate for closest point
                    this.indexA = other.indexA; // wA index
                    this.indexB = other.indexB; // wB index
                    return this;
                }
            };
            exports_1("b2SimplexVertex", b2SimplexVertex);
            b2Simplex = class b2Simplex {
                constructor() {
                    this.m_v1 = new b2SimplexVertex();
                    this.m_v2 = new b2SimplexVertex();
                    this.m_v3 = new b2SimplexVertex();
                    this.m_vertices = [ /*3*/];
                    this.m_count = 0;
                    this.m_vertices[0] = this.m_v1;
                    this.m_vertices[1] = this.m_v2;
                    this.m_vertices[2] = this.m_v3;
                }
                ReadCache(cache, proxyA, transformA, proxyB, transformB) {
                    // DEBUG: b2Assert(0 <= cache.count && cache.count <= 3);
                    // Copy data from cache.
                    this.m_count = cache.count;
                    const vertices = this.m_vertices;
                    for (let i = 0; i < this.m_count; ++i) {
                        const v = vertices[i];
                        v.indexA = cache.indexA[i];
                        v.indexB = cache.indexB[i];
                        const wALocal = proxyA.GetVertex(v.indexA);
                        const wBLocal = proxyB.GetVertex(v.indexB);
                        b2_math_js_1.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2_math_js_1.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2_math_js_1.b2Vec2.SubVV(v.wB, v.wA, v.w);
                        v.a = 0;
                    }
                    // Compute the new simplex metric, if it is substantially different than
                    // old metric then flush the simplex.
                    if (this.m_count > 1) {
                        const metric1 = cache.metric;
                        const metric2 = this.GetMetric();
                        if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < b2_settings_js_1.b2_epsilon) {
                            // Reset the simplex.
                            this.m_count = 0;
                        }
                    }
                    // If the cache is empty or invalid ...
                    if (this.m_count === 0) {
                        const v = vertices[0];
                        v.indexA = 0;
                        v.indexB = 0;
                        const wALocal = proxyA.GetVertex(0);
                        const wBLocal = proxyB.GetVertex(0);
                        b2_math_js_1.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2_math_js_1.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2_math_js_1.b2Vec2.SubVV(v.wB, v.wA, v.w);
                        v.a = 1;
                        this.m_count = 1;
                    }
                }
                WriteCache(cache) {
                    cache.metric = this.GetMetric();
                    cache.count = this.m_count;
                    const vertices = this.m_vertices;
                    for (let i = 0; i < this.m_count; ++i) {
                        cache.indexA[i] = vertices[i].indexA;
                        cache.indexB[i] = vertices[i].indexB;
                    }
                }
                GetSearchDirection(out) {
                    switch (this.m_count) {
                        case 1:
                            return b2_math_js_1.b2Vec2.NegV(this.m_v1.w, out);
                        case 2: {
                            const e12 = b2_math_js_1.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, out);
                            const sgn = b2_math_js_1.b2Vec2.CrossVV(e12, b2_math_js_1.b2Vec2.NegV(this.m_v1.w, b2_math_js_1.b2Vec2.s_t0));
                            if (sgn > 0) {
                                // Origin is left of e12.
                                return b2_math_js_1.b2Vec2.CrossOneV(e12, out);
                            }
                            else {
                                // Origin is right of e12.
                                return b2_math_js_1.b2Vec2.CrossVOne(e12, out);
                            }
                        }
                        default:
                            // DEBUG: b2Assert(false);
                            return out.SetZero();
                    }
                }
                GetClosestPoint(out) {
                    switch (this.m_count) {
                        case 0:
                            // DEBUG: b2Assert(false);
                            return out.SetZero();
                        case 1:
                            return out.Copy(this.m_v1.w);
                        case 2:
                            return out.Set(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
                        case 3:
                            return out.SetZero();
                        default:
                            // DEBUG: b2Assert(false);
                            return out.SetZero();
                    }
                }
                GetWitnessPoints(pA, pB) {
                    switch (this.m_count) {
                        case 0:
                            // DEBUG: b2Assert(false);
                            break;
                        case 1:
                            pA.Copy(this.m_v1.wA);
                            pB.Copy(this.m_v1.wB);
                            break;
                        case 2:
                            pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
                            pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
                            pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
                            pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
                            break;
                        case 3:
                            pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
                            pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
                            break;
                        default:
                            // DEBUG: b2Assert(false);
                            break;
                    }
                }
                GetMetric() {
                    switch (this.m_count) {
                        case 0:
                            // DEBUG: b2Assert(false);
                            return 0;
                        case 1:
                            return 0;
                        case 2:
                            return b2_math_js_1.b2Vec2.DistanceVV(this.m_v1.w, this.m_v2.w);
                        case 3:
                            return b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(this.m_v3.w, this.m_v1.w, b2_math_js_1.b2Vec2.s_t1));
                        default:
                            // DEBUG: b2Assert(false);
                            return 0;
                    }
                }
                Solve2() {
                    const w1 = this.m_v1.w;
                    const w2 = this.m_v2.w;
                    const e12 = b2_math_js_1.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    // w1 region
                    const d12_2 = (-b2_math_js_1.b2Vec2.DotVV(w1, e12));
                    if (d12_2 <= 0) {
                        // a2 <= 0, so we clamp it to 0
                        this.m_v1.a = 1;
                        this.m_count = 1;
                        return;
                    }
                    // w2 region
                    const d12_1 = b2_math_js_1.b2Vec2.DotVV(w2, e12);
                    if (d12_1 <= 0) {
                        // a1 <= 0, so we clamp it to 0
                        this.m_v2.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v2);
                        return;
                    }
                    // Must be in e12 region.
                    const inv_d12 = 1 / (d12_1 + d12_2);
                    this.m_v1.a = d12_1 * inv_d12;
                    this.m_v2.a = d12_2 * inv_d12;
                    this.m_count = 2;
                }
                Solve3() {
                    const w1 = this.m_v1.w;
                    const w2 = this.m_v2.w;
                    const w3 = this.m_v3.w;
                    // Edge12
                    // [1      1     ][a1] = [1]
                    // [w1.e12 w2.e12][a2] = [0]
                    // a3 = 0
                    const e12 = b2_math_js_1.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    const w1e12 = b2_math_js_1.b2Vec2.DotVV(w1, e12);
                    const w2e12 = b2_math_js_1.b2Vec2.DotVV(w2, e12);
                    const d12_1 = w2e12;
                    const d12_2 = (-w1e12);
                    // Edge13
                    // [1      1     ][a1] = [1]
                    // [w1.e13 w3.e13][a3] = [0]
                    // a2 = 0
                    const e13 = b2_math_js_1.b2Vec2.SubVV(w3, w1, b2Simplex.s_e13);
                    const w1e13 = b2_math_js_1.b2Vec2.DotVV(w1, e13);
                    const w3e13 = b2_math_js_1.b2Vec2.DotVV(w3, e13);
                    const d13_1 = w3e13;
                    const d13_2 = (-w1e13);
                    // Edge23
                    // [1      1     ][a2] = [1]
                    // [w2.e23 w3.e23][a3] = [0]
                    // a1 = 0
                    const e23 = b2_math_js_1.b2Vec2.SubVV(w3, w2, b2Simplex.s_e23);
                    const w2e23 = b2_math_js_1.b2Vec2.DotVV(w2, e23);
                    const w3e23 = b2_math_js_1.b2Vec2.DotVV(w3, e23);
                    const d23_1 = w3e23;
                    const d23_2 = (-w2e23);
                    // Triangle123
                    const n123 = b2_math_js_1.b2Vec2.CrossVV(e12, e13);
                    const d123_1 = n123 * b2_math_js_1.b2Vec2.CrossVV(w2, w3);
                    const d123_2 = n123 * b2_math_js_1.b2Vec2.CrossVV(w3, w1);
                    const d123_3 = n123 * b2_math_js_1.b2Vec2.CrossVV(w1, w2);
                    // w1 region
                    if (d12_2 <= 0 && d13_2 <= 0) {
                        this.m_v1.a = 1;
                        this.m_count = 1;
                        return;
                    }
                    // e12
                    if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
                        const inv_d12 = 1 / (d12_1 + d12_2);
                        this.m_v1.a = d12_1 * inv_d12;
                        this.m_v2.a = d12_2 * inv_d12;
                        this.m_count = 2;
                        return;
                    }
                    // e13
                    if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
                        const inv_d13 = 1 / (d13_1 + d13_2);
                        this.m_v1.a = d13_1 * inv_d13;
                        this.m_v3.a = d13_2 * inv_d13;
                        this.m_count = 2;
                        this.m_v2.Copy(this.m_v3);
                        return;
                    }
                    // w2 region
                    if (d12_1 <= 0 && d23_2 <= 0) {
                        this.m_v2.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v2);
                        return;
                    }
                    // w3 region
                    if (d13_1 <= 0 && d23_1 <= 0) {
                        this.m_v3.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v3);
                        return;
                    }
                    // e23
                    if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
                        const inv_d23 = 1 / (d23_1 + d23_2);
                        this.m_v2.a = d23_1 * inv_d23;
                        this.m_v3.a = d23_2 * inv_d23;
                        this.m_count = 2;
                        this.m_v1.Copy(this.m_v3);
                        return;
                    }
                    // Must be in triangle123
                    const inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
                    this.m_v1.a = d123_1 * inv_d123;
                    this.m_v2.a = d123_2 * inv_d123;
                    this.m_v3.a = d123_3 * inv_d123;
                    this.m_count = 3;
                }
            };
            exports_1("b2Simplex", b2Simplex);
            b2Simplex.s_e12 = new b2_math_js_1.b2Vec2();
            b2Simplex.s_e13 = new b2_math_js_1.b2Vec2();
            b2Simplex.s_e23 = new b2_math_js_1.b2Vec2();
            b2Distance_s_simplex = new b2Simplex();
            b2Distance_s_saveA = [0, 0, 0];
            b2Distance_s_saveB = [0, 0, 0];
            b2Distance_s_p = new b2_math_js_1.b2Vec2();
            b2Distance_s_d = new b2_math_js_1.b2Vec2();
            b2Distance_s_normal = new b2_math_js_1.b2Vec2();
            b2Distance_s_supportA = new b2_math_js_1.b2Vec2();
            b2Distance_s_supportB = new b2_math_js_1.b2Vec2();
            /// Perform a linear shape cast of shape B moving and shape A fixed. Determines the hit point, normal, and translation fraction.
            // GJK-raycast
            // Algorithm by Gino van den Bergen.
            // "Smooth Mesh Contacts with GJK" in Game Physics Pearls. 2010
            // bool b2ShapeCast(b2ShapeCastOutput* output, const b2ShapeCastInput* input);
            b2ShapeCast_s_n = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_simplex = new b2Simplex();
            b2ShapeCast_s_wA = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_wB = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_v = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_p = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_pointA = new b2_math_js_1.b2Vec2();
            b2ShapeCast_s_pointB = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZGlzdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29sbGlzaW9uL2IyX2Rpc3RhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQW9KRixTQUFnQixZQUFZO1FBQzFCLHlCQUFBLFdBQVcsR0FBRyxDQUFDLEVBQUM7UUFDaEIseUJBQUEsV0FBVyxHQUFHLENBQUMsRUFBQztRQUNoQiw0QkFBQSxjQUFjLEdBQUcsQ0FBQyxFQUFDO0lBQ3JCLENBQUM7O0lBeVVELFNBQWdCLFVBQVUsQ0FBQyxNQUF3QixFQUFFLEtBQXFCLEVBQUUsS0FBc0I7UUFDaEcseUJBQUEsRUFBRSxXQUFXLEVBQUM7UUFFZCxNQUFNLE1BQU0sR0FBb0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBb0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUU3QyxNQUFNLFVBQVUsR0FBZ0IsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNqRCxNQUFNLFVBQVUsR0FBZ0IsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVqRCwwQkFBMEI7UUFDMUIsTUFBTSxPQUFPLEdBQWMsb0JBQW9CLENBQUM7UUFDaEQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFakUsb0NBQW9DO1FBQ3BDLE1BQU0sUUFBUSxHQUFzQixPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3ZELE1BQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQztRQUU5QiwwREFBMEQ7UUFDMUQsZ0RBQWdEO1FBQ2hELE1BQU0sS0FBSyxHQUE2QixrQkFBa0IsQ0FBQztRQUMzRCxNQUFNLEtBQUssR0FBNkIsa0JBQWtCLENBQUM7UUFDM0QsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLHVCQUF1QjtRQUN2QixJQUFJLElBQUksR0FBVyxDQUFD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QUMsQ0FBQztvQkFDNUMsTUFBTSxLQUFLLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEtBQUssR0FBVyxLQUFLLENBQUM7b0JBQzVCLE1BQU0sS0FBSyxHQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFL0IsU0FBUztvQkFDVCw0QkFBNEI7b0JBQzVCLDRCQUE0QjtvQkFDNUIsU0FBUztvQkFDVCxNQUFNLEdBQUcsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxLQUFLLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFXLEtBQUssQ0FBQztvQkFDNUIsTUFBTSxLQUFLLEdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUUvQixTQUFTO29CQUNULDRCQUE0QjtvQkFDNUIsNEJBQTRCO29CQUM1QixTQUFTO29CQUNULE1BQU0sR0FBRyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxRCxNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxLQUFLLEdBQVcsS0FBSyxDQUFDO29CQUM1QixNQUFNLEtBQUssR0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRS9CLGNBQWM7b0JBQ2QsTUFBTSxJQUFJLEdBQVcsbUJBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUU5QyxNQUFNLE1BQU0sR0FBVyxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLE1BQU0sR0FBVyxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLE1BQU0sR0FBVyxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUVyRCxZQUFZO29CQUNaLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO3dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixPQUFPO3FCQUNSO29CQUVELE1BQU07b0JBQ04sSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTt3QkFDekMsTUFBTSxPQUFPLEdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO3dCQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO3dCQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsT0FBTztxQkFDUjtvQkFFRCxNQUFNO29CQUNOLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ3pDLE1BQU0sT0FBTyxHQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQzt3QkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQzt3QkFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDMUIsT0FBTztxQkFDUjtvQkFFRCxZQUFZO29CQUNaLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO3dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLE9BQU87cUJBQ1I7b0JBRUQsWUFBWTtvQkFDWixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixPQUFPO3FCQUNSO29CQUVELE1BQU07b0JBQ04sSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTt3QkFDekMsTUFBTSxPQUFPLEdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO3dCQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO3dCQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixPQUFPO3FCQUNSO29CQUVELHlCQUF5QjtvQkFDekIsTUFBTSxRQUFRLEdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUM7YUFJRixDQUFBOztZQUhnQixlQUFLLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7WUFDN0IsZUFBSyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQzdCLGVBQUssR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztZQUd4QyxvQkFBb0IsR0FBYyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2xELGtCQUFrQixHQUE2QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7WUFDM0Qsa0JBQWtCLEdBQTZCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztZQUMzRCxjQUFjLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7WUFDdEMsY0FBYyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQ3RDLG1CQUFtQixHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQzNDLHFCQUFxQixHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQzdDLHFCQUFxQixHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBc0luRCxnSUFBZ0k7WUFFaEksY0FBYztZQUNkLG9DQUFvQztZQUNwQywrREFBK0Q7WUFDL0QsOEVBQThFO1lBQ3hFLGVBQWUsR0FBRyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztZQUMvQixxQkFBcUIsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3hDLGdCQUFnQixHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQ2hDLGdCQUFnQixHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO1lBQ2hDLGVBQWUsR0FBRyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztZQUMvQixlQUFlLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUM7WUFDL0Isb0JBQW9CLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUM7WUFDcEMsb0JBQW9CLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUMifQ==