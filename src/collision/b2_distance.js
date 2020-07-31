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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZGlzdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMl9kaXN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7SUFvSkYsU0FBZ0IsWUFBWTtRQUMxQix5QkFBQSxXQUFXLEdBQUcsQ0FBQyxFQUFDO1FBQ2hCLHlCQUFBLFdBQVcsR0FBRyxDQUFDLEVBQUM7UUFDaEIsNEJBQUEsY0FBYyxHQUFHLENBQUMsRUFBQztJQUNyQixDQUFDOztJQXlVRCxTQUFnQixVQUFVLENBQUMsTUFBd0IsRUFBRSxLQUFxQixFQUFFLEtBQXNCO1FBQ2hHLHlCQUFBLEVBQUUsV0FBVyxFQUFDO1FBRWQsTUFBTSxNQUFNLEdBQW9CLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQW9CLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFN0MsTUFBTSxVQUFVLEdBQWdCLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDakQsTUFBTSxVQUFVLEdBQWdCLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFakQsMEJBQTBCO1FBQzFCLE1BQU0sT0FBTyxHQUFjLG9CQUFvQixDQUFDO1FBQ2hELE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpFLG9DQUFvQztRQUNwQyxNQUFNLFFBQVEsR0FBc0IsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUN2RCxNQUFNLFVBQVUsR0FBVyxFQUFFLENBQUM7UUFFOUIsMERBQTBEO1FBQzFELGdEQUFnRDtRQUNoRCxNQUFNLEtBQUssR0FBNkIsa0JBQWtCLENBQUM7UUFDM0QsTUFBTSxLQUFLLEdBQTZCLGtCQUFrQixDQUFDO1FBQzNELElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztRQUUxQix1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxHQUFHLFVBQVUsRUFBRTtZQUN4Qiw4Q0FBOEM7WUFDOUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDMUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQy9CO1lBRUQsUUFBUSxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUN6QixLQUFLLENBQUM7b0JBQ0osTUFBTTtnQkFFUixLQUFLLENBQUM7b0JBQ0osT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqQixNQUFNO2dCQUVSLEtBQUssQ0FBQztvQkFDSixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pCLE1BQU07Z0JBRVI7b0JBQ0UsMEJBQTBCO29CQUMxQixNQUFNO2FBQ1A7WUFFRCx5RUFBeUU7WUFDekUsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRTtnQkFDekIsTUFBTTthQUNQO1lBRUQsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxHQUFXLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU3RCxrREFBa0Q7WUFDbEQsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEdBQUcsOEJBQWEsRUFBRTtnQkFDckMscURBQXFEO2dCQUNyRCwrQ0FBK0M7Z0JBRS9DLDhEQUE4RDtnQkFDOUQsdUVBQXVFO2dCQUN2RSwwRUFBMEU7Z0JBQzFFLE1BQU07YUFDUDtZQUVELCtEQUErRDtZQUMvRCxNQUFNLE1BQU0sR0FBb0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsbUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFDbEgsd0JBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQ3hGLHdCQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUUsbUJBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3QyxtRUFBbUU7WUFDbkUsRUFBRSxJQUFJLENBQUM7WUFDUCx5QkFBQSxFQUFFLFdBQVcsRUFBQztZQUVkLDZFQUE2RTtZQUM3RSxJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDNUQsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDakIsTUFBTTtpQkFDUDthQUNGO1lBRUQsdUVBQXVFO1lBQ3ZFLElBQUksU0FBUyxFQUFFO2dCQUNiLE1BQU07YUFDUDtZQUVELCtCQUErQjtZQUMvQixFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7U0FDbkI7UUFFRCw0QkFBQSxjQUFjLEdBQUcsa0JBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUM7UUFFN0Msa0JBQWtCO1FBQ2xCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsUUFBUSxHQUFHLG1CQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXpCLHFCQUFxQjtRQUNyQixPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLDRCQUE0QjtRQUM1QixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxFQUFFLEdBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNuQyxNQUFNLEVBQUUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBRW5DLElBQUksTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLDJCQUFVLEVBQUU7Z0JBQy9ELGtDQUFrQztnQkFDbEMsZ0RBQWdEO2dCQUNoRCxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sTUFBTSxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN2RixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNMLG1EQUFtRDtnQkFDbkQseUNBQXlDO2dCQUN6QyxNQUFNLENBQUMsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQzdFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDckI7U0FDRjtJQUNILENBQUM7O0lBZ0JELFNBQWdCLFdBQVcsQ0FBQyxNQUF5QixFQUFFLEtBQXVCO1FBQzVFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV2QixpREFBaUQ7UUFDakQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixpREFBaUQ7UUFDakQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUU1Qiw4REFBOEQ7UUFDOUQsTUFBTSxPQUFPLEdBQUcsa0JBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLGlDQUFnQixDQUFDLENBQUM7UUFDekQsOERBQThEO1FBQzlELE1BQU0sT0FBTyxHQUFHLGtCQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxpQ0FBZ0IsQ0FBQyxDQUFDO1FBQ3pELHNDQUFzQztRQUN0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRWpDLHNDQUFzQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzdCLHNDQUFzQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBRTdCLGlDQUFpQztRQUNqQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzdCLHdCQUF3QjtRQUN4QixNQUFNLENBQUMsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4Qyx5QkFBeUI7UUFDekIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRWpCLGtCQUFrQjtRQUNsQixNQUFNLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztRQUN0QyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUVwQixvQ0FBb0M7UUFDcEMsNkNBQTZDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFcEMsb0NBQW9DO1FBQ3BDLHVEQUF1RDtRQUN2RCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsbUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsbUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlGLG9EQUFvRDtRQUNwRCxJQUFJLEVBQUUsR0FBRyx3QkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVFLHNEQUFzRDtRQUN0RCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwRSxvREFBb0Q7UUFDcEQsSUFBSSxFQUFFLEdBQUcsd0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM1RSxzQkFBc0I7UUFDdEIsTUFBTSxDQUFDLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUVoRCxnREFBZ0Q7UUFDaEQsc0VBQXNFO1FBQ3RFLE1BQU0sS0FBSyxHQUFHLGtCQUFLLENBQUMsaUNBQWdCLEVBQUUsTUFBTSxHQUFHLGlDQUFnQixDQUFDLENBQUM7UUFDakUsa0RBQWtEO1FBQ2xELE1BQU0sU0FBUyxHQUFHLEdBQUcsR0FBRyw4QkFBYSxDQUFDO1FBRXRDLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLGtCQUFrQjtRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixxRUFBcUU7UUFDckUsT0FBTyxJQUFJLEdBQUcsVUFBVSxJQUFJLGtCQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLFNBQVMsRUFBRTtZQUNqRSx3Q0FBd0M7WUFFeEMsTUFBTSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7WUFFdkIsa0NBQWtDO1lBQ2xDLGlEQUFpRDtZQUNqRCxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxrQkFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRiw2Q0FBNkM7WUFDN0MsRUFBRSxHQUFHLHdCQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDeEUsZ0RBQWdEO1lBQ2hELE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoRSw2Q0FBNkM7WUFDN0MsRUFBRSxHQUFHLHdCQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDeEUsc0JBQXNCO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFaEQsc0JBQXNCO1lBQ3RCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUVkLDJCQUEyQjtZQUMzQixNQUFNLEVBQUUsR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxFQUFFLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksRUFBRSxHQUFHLEtBQUssR0FBRyxNQUFNLEdBQUcsRUFBRSxFQUFFO2dCQUM1QixJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUU7b0JBQ2IsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7Z0JBRUQsTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO29CQUNoQixPQUFPLEtBQUssQ0FBQztpQkFDZDtnQkFFRCxVQUFVO2dCQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCO1lBRUQsNkNBQTZDO1lBQzdDLG1GQUFtRjtZQUNuRixrRkFBa0Y7WUFDbEYsbUNBQW1DO1lBQ25DLHdEQUF3RDtZQUN4RCxNQUFNLE1BQU0sR0FBb0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN2QiwrQkFBK0I7WUFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN2QixrQkFBa0I7WUFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkIsb0NBQW9DO1lBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ2YsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFFckIsUUFBUSxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUN6QixLQUFLLENBQUM7b0JBQ0osTUFBTTtnQkFFUixLQUFLLENBQUM7b0JBQ0osT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqQixNQUFNO2dCQUVSLEtBQUssQ0FBQztvQkFDSixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pCLE1BQU07Z0JBRVIsUUFBUTtnQkFDTiwwQkFBMEI7YUFDM0I7WUFFRCx5RUFBeUU7WUFDekUsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRTtnQkFDekIsVUFBVTtnQkFDVixPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsd0JBQXdCO1lBQ3hCLGlDQUFpQztZQUNqQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNCLG1FQUFtRTtZQUNuRSxFQUFFLElBQUksQ0FBQztTQUNSO1FBRUQsa0JBQWtCO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO1FBQ3BDLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBQzNCLFVBQVU7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNmO1FBRUQsdUNBQXVDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7Ozs7Ozs7O1lBaHhCRCxrREFBa0Q7WUFDbEQsOEJBQThCO1lBQzlCLGtCQUFBLE1BQWEsZUFBZTtnQkFBNUI7b0JBQ2tCLGFBQVEsR0FBYSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsZUFBVSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3JDLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLGFBQVEsR0FBVyxDQUFDLENBQUM7Z0JBb0U5QixDQUFDO2dCQWxFUSxJQUFJLENBQUMsS0FBZ0M7b0JBQzFDLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsUUFBUSxFQUFFO3dCQUN2QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMxQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7cUJBQ3BDO29CQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUMvQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sUUFBUSxDQUFDLEtBQWMsRUFBRSxLQUFhO29CQUMzQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVNLGlCQUFpQixDQUFDLFFBQWtCLEVBQUUsS0FBYSxFQUFFLE1BQWM7b0JBQ3hFLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO29CQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRU0sVUFBVSxDQUFDLENBQVM7b0JBQ3pCLElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxTQUFTLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDNUQsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzdDLE1BQU0sS0FBSyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzFELElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRTs0QkFDckIsU0FBUyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxTQUFTLEdBQUcsS0FBSyxDQUFDO3lCQUNuQjtxQkFDRjtvQkFFRCxPQUFPLFNBQVMsQ0FBQztnQkFDbkIsQ0FBQztnQkFFTSxnQkFBZ0IsQ0FBQyxDQUFTO29CQUMvQixJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7b0JBQzFCLElBQUksU0FBUyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUM3QyxNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMxRCxJQUFJLEtBQUssR0FBRyxTQUFTLEVBQUU7NEJBQ3JCLFNBQVMsR0FBRyxDQUFDLENBQUM7NEJBQ2QsU0FBUyxHQUFHLEtBQUssQ0FBQzt5QkFDbkI7cUJBQ0Y7b0JBRUQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO2dCQUVNLGNBQWM7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQztnQkFFTSxTQUFTLENBQUMsS0FBYTtvQkFDNUIsdURBQXVEO29CQUN2RCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7YUFDRixDQUFBOztZQUVELGlCQUFBLE1BQWEsY0FBYztnQkFBM0I7b0JBQ1MsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFDVCxXQUFNLEdBQTZCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztvQkFDL0MsV0FBTSxHQUE2QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBT2pFLENBQUM7Z0JBTFEsS0FBSztvQkFDVixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ2YsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsa0JBQUEsTUFBYSxlQUFlO2dCQUE1QjtvQkFDa0IsV0FBTSxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO29CQUNoRCxXQUFNLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQ2hELGVBQVUsR0FBZ0IsSUFBSSx3QkFBVyxFQUFFLENBQUM7b0JBQzVDLGVBQVUsR0FBZ0IsSUFBSSx3QkFBVyxFQUFFLENBQUM7b0JBQ3JELGFBQVEsR0FBWSxLQUFLLENBQUM7Z0JBVW5DLENBQUM7Z0JBUlEsS0FBSztvQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsbUJBQUEsTUFBYSxnQkFBZ0I7Z0JBQTdCO29CQUNrQixXQUFNLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7b0JBQzlCLFdBQU0sR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDdkMsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsZUFBVSxHQUFXLENBQUMsQ0FBQyxDQUFDLGtDQUFrQztnQkFTbkUsQ0FBQztnQkFQUSxLQUFLO29CQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDcEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsb0NBQW9DO1lBQ3BDLG1CQUFBLE1BQWEsZ0JBQWdCO2dCQUE3QjtvQkFDaUIsV0FBTSxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO29CQUNoRCxXQUFNLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQ2hELGVBQVUsR0FBZ0IsSUFBSSx3QkFBVyxFQUFFLENBQUM7b0JBQzVDLGVBQVUsR0FBZ0IsSUFBSSx3QkFBVyxFQUFFLENBQUM7b0JBQzVDLGlCQUFZLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7Z0JBQ3JELENBQUM7YUFBQSxDQUFBOztZQUVELGtDQUFrQztZQUNsQyxvQkFBQSxNQUFhLGlCQUFpQjtnQkFBOUI7b0JBQ2lCLFVBQUssR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDN0IsV0FBTSxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUN2QyxXQUFNLEdBQVcsR0FBRyxDQUFDO29CQUNyQixlQUFVLEdBQVcsQ0FBQyxDQUFDO2dCQUMvQixDQUFDO2FBQUEsQ0FBQTs7WUFFRCx5QkFBVyxXQUFXLEdBQVcsQ0FBQyxFQUFDO1lBQ25DLHlCQUFXLFdBQVcsR0FBVyxDQUFDLEVBQUM7WUFDbkMsNEJBQVcsY0FBYyxHQUFXLENBQUMsRUFBQztZQU90QyxrQkFBQSxNQUFhLGVBQWU7Z0JBQTVCO29CQUNrQixPQUFFLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUMsQ0FBQywwQkFBMEI7b0JBQ3JELE9BQUUsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQyxDQUFDLDBCQUEwQjtvQkFDckQsTUFBQyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDLENBQUMsVUFBVTtvQkFDN0MsTUFBQyxHQUFXLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztvQkFDMUQsV0FBTSxHQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVc7b0JBQy9CLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQVd4QyxDQUFDO2dCQVRRLElBQUksQ0FBQyxLQUFzQjtvQkFDaEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUssMEJBQTBCO29CQUN0RCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBSywwQkFBMEI7b0JBQ3RELElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFPLFVBQVU7b0JBQ3RDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFXLDJDQUEyQztvQkFDdkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVztvQkFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVztvQkFDdkMsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsWUFBQSxNQUFhLFNBQVM7Z0JBT3BCO29CQU5nQixTQUFJLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQzlDLFNBQUksR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztvQkFDOUMsU0FBSSxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO29CQUM5QyxlQUFVLEdBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pELFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBR3pCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pDLENBQUM7Z0JBRU0sU0FBUyxDQUFDLEtBQXFCLEVBQUUsTUFBdUIsRUFBRSxVQUF1QixFQUFFLE1BQXVCLEVBQUUsVUFBdUI7b0JBQ3hJLHlEQUF5RDtvQkFFekQsd0JBQXdCO29CQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQzNCLE1BQU0sUUFBUSxHQUFzQixJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDN0MsTUFBTSxDQUFDLEdBQW9CLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNuRCxNQUFNLE9BQU8sR0FBVyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbkQsd0JBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzdDLHdCQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDVDtvQkFFRCx3RUFBd0U7b0JBQ3hFLHFDQUFxQztvQkFDckMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRTt3QkFDcEIsTUFBTSxPQUFPLEdBQVcsS0FBSyxDQUFDLE1BQU0sQ0FBQzt3QkFDckMsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN6QyxJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sR0FBRywyQkFBVSxFQUFFOzRCQUM1RSxxQkFBcUI7NEJBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQjtxQkFDRjtvQkFFRCx1Q0FBdUM7b0JBQ3ZDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7d0JBQ3RCLE1BQU0sQ0FBQyxHQUFvQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNiLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNiLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLHdCQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUM3Qyx3QkFBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDN0MsbUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7cUJBQ2xCO2dCQUNILENBQUM7Z0JBRU0sVUFBVSxDQUFDLEtBQXFCO29CQUNyQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDaEMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUMzQixNQUFNLFFBQVEsR0FBc0IsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDcEQsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzdDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDckMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO3FCQUN0QztnQkFDSCxDQUFDO2dCQUVNLGtCQUFrQixDQUFDLEdBQVc7b0JBQ25DLFFBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDdEIsS0FBSyxDQUFDOzRCQUNKLE9BQU8sbUJBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRXZDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ0osTUFBTSxHQUFHLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ2hFLE1BQU0sR0FBRyxHQUFXLG1CQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQy9FLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtnQ0FDWCx5QkFBeUI7Z0NBQ3pCLE9BQU8sbUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzZCQUNuQztpQ0FBTTtnQ0FDTCwwQkFBMEI7Z0NBQzFCLE9BQU8sbUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzZCQUNuQzt5QkFDRjt3QkFFSDs0QkFDRSwwQkFBMEI7NEJBQzFCLE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO3FCQUN0QjtnQkFDSCxDQUFDO2dCQUVNLGVBQWUsQ0FBQyxHQUFXO29CQUNoQyxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQzs0QkFDSiwwQkFBMEI7NEJBQzFCLE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUV2QixLQUFLLENBQUM7NEJBQ0osT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRS9CLEtBQUssQ0FBQzs0QkFDSixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUUvRCxLQUFLLENBQUM7NEJBQ0osT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRXZCOzRCQUNFLDBCQUEwQjs0QkFDMUIsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQ3RCO2dCQUNILENBQUM7Z0JBRU0sZ0JBQWdCLENBQUMsRUFBVSxFQUFFLEVBQVU7b0JBQzVDLFFBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDdEIsS0FBSyxDQUFDOzRCQUNKLDBCQUEwQjs0QkFDMUIsTUFBTTt3QkFFUixLQUFLLENBQUM7NEJBQ0osRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUN0QixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3RCLE1BQU07d0JBRVIsS0FBSyxDQUFDOzRCQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbkUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUNuRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ25FLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbkUsTUFBTTt3QkFFUixLQUFLLENBQUM7NEJBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN6RyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3pHLE1BQU07d0JBRVI7NEJBQ0UsMEJBQTBCOzRCQUMxQixNQUFNO3FCQUNQO2dCQUNILENBQUM7Z0JBRU0sU0FBUztvQkFDZCxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQzs0QkFDSiwwQkFBMEI7NEJBQzFCLE9BQU8sQ0FBQyxDQUFDO3dCQUVYLEtBQUssQ0FBQzs0QkFDSixPQUFPLENBQUMsQ0FBQzt3QkFFWCxLQUFLLENBQUM7NEJBQ0osT0FBTyxtQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVyRCxLQUFLLENBQUM7NEJBQ0osT0FBTyxtQkFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLG1CQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFFbEk7NEJBQ0UsMEJBQTBCOzRCQUMxQixPQUFPLENBQUMsQ0FBQztxQkFDVjtnQkFDSCxDQUFDO2dCQUVNLE1BQU07b0JBQ1gsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvQixNQUFNLEdBQUcsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFMUQsWUFBWTtvQkFDWixNQUFNLEtBQUssR0FBVyxDQUFDLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTt3QkFDZCwrQkFBK0I7d0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ2pCLE9BQU87cUJBQ1I7b0JBRUQsWUFBWTtvQkFDWixNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTt3QkFDZCwrQkFBK0I7d0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDMUIsT0FBTztxQkFDUjtvQkFFRCx5QkFBeUI7b0JBQ3pCLE1BQU0sT0FBTyxHQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sTUFBTTtvQkFDWCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDL0IsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUUvQixTQUFTO29CQUNULDRCQUE0QjtvQkFDNUIsNEJBQTRCO29CQUM1QixTQUFTO29CQUNULE1BQU0sR0FBRyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxRCxNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxLQUFLLEdBQVcsS0FBSyxDQUFDO29CQUM1QixNQUFNLEtBQUssR0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRS9CLFNBQVM7b0JBQ1QsNEJBQTRCO29CQUM1Qiw0QkFBNEI7b0JBQzVCLFNBQVM7b0JBQ1QsTUFBTSxHQUFHLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFELE1BQU0sS0FBSyxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxLQUFLLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEtBQUssR0FBVyxLQUFLLENBQUM7b0JBQzVCLE1BQU0sS0FBSyxHQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFL0IsU0FBUztvQkFDVCw0QkFBNEI7b0JBQzVCLDRCQUE0QjtvQkFDNUIsU0FBUztvQkFDVCxNQUFNLEdBQUcsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxLQUFLLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEtBQUssR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFXLEtBQUssQ0FBQztvQkFDNUIsTUFBTSxLQUFLLEdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUUvQixjQUFjO29CQUNkLE1BQU0sSUFBSSxHQUFXLG1CQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcs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