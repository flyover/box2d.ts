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
System.register(["../Common/b2Settings", "../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
        let distanceSqr1 = b2Settings_1.b2_maxFloat;
        let distanceSqr2 = distanceSqr1;
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
                    ///b2Assert(false);
                    break;
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count === 3) {
                break;
            }
            // Compute closest point.
            const p = simplex.GetClosestPoint(b2Distance_s_p);
            distanceSqr2 = p.LengthSquared();
            // Ensure progress
            /*
            TODO: to fix compile warning
            if (distanceSqr2 > distanceSqr1) {
              //break;
            }
            */
            distanceSqr1 = distanceSqr2;
            // Get search direction.
            const d = simplex.GetSearchDirection(b2Distance_s_d);
            // Ensure the search direction is numerically fit.
            if (d.LengthSquared() < b2Settings_1.b2_epsilon_sq) {
                // The origin is probably contained by a line segment
                // or triangle. Thus the shapes are overlapped.
                // We can't return zero here even though there may be overlap.
                // In case the simplex is a point, segment, or triangle it is difficult
                // to determine if the origin is contained in the CSO or very close to it.
                break;
            }
            // Compute a tentative new simplex vertex using support points.
            const vertex = vertices[simplex.m_count];
            vertex.indexA = proxyA.GetSupport(b2Math_1.b2Rot.MulTRV(transformA.q, b2Math_1.b2Vec2.NegV(d, b2Math_1.b2Vec2.s_t0), b2Distance_s_supportA));
            b2Math_1.b2Transform.MulXV(transformA, proxyA.GetVertex(vertex.indexA), vertex.wA);
            vertex.indexB = proxyB.GetSupport(b2Math_1.b2Rot.MulTRV(transformB.q, d, b2Distance_s_supportB));
            b2Math_1.b2Transform.MulXV(transformB, proxyB.GetVertex(vertex.indexB), vertex.wB);
            b2Math_1.b2Vec2.SubVV(vertex.wB, vertex.wA, vertex.w);
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
        exports_1("b2_gjkMaxIters", b2_gjkMaxIters = b2Math_1.b2Max(b2_gjkMaxIters, iter));
        // Prepare output.
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = b2Math_1.b2Vec2.DistanceVV(output.pointA, output.pointB);
        output.iterations = iter;
        // Cache the simplex.
        simplex.WriteCache(cache);
        // Apply radii if requested.
        if (input.useRadii) {
            const rA = proxyA.m_radius;
            const rB = proxyB.m_radius;
            if (output.distance > (rA + rB) && output.distance > b2Settings_1.b2_epsilon) {
                // Shapes are still no overlapped.
                // Move the witness points to the outer surface.
                output.distance -= rA + rB;
                const normal = b2Math_1.b2Vec2.SubVV(output.pointB, output.pointA, b2Distance_s_normal);
                normal.Normalize();
                output.pointA.SelfMulAdd(rA, normal);
                output.pointB.SelfMulSub(rB, normal);
            }
            else {
                // Shapes are overlapped when radii are considered.
                // Move the witness points to the middle.
                const p = b2Math_1.b2Vec2.MidVV(output.pointA, output.pointB, b2Distance_s_p);
                output.pointA.Copy(p);
                output.pointB.Copy(p);
                output.distance = 0;
            }
        }
    }
    exports_1("b2Distance", b2Distance);
    var b2Settings_1, b2Math_1, b2DistanceProxy, b2SimplexCache, b2DistanceInput, b2DistanceOutput, b2_gjkCalls, b2_gjkIters, b2_gjkMaxIters, b2SimplexVertex, b2Simplex, b2Distance_s_simplex, b2Distance_s_saveA, b2Distance_s_saveB, b2Distance_s_p, b2Distance_s_d, b2Distance_s_normal, b2Distance_s_supportA, b2Distance_s_supportB;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            }
        ],
        execute: function () {
            /// A distance proxy is used by the GJK algorithm.
            /// It encapsulates any shape.
            b2DistanceProxy = class b2DistanceProxy {
                constructor() {
                    this.m_buffer = b2Math_1.b2Vec2.MakeArray(2);
                    this.m_vertices = this.m_buffer;
                    this.m_count = 0;
                    this.m_radius = 0;
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
                GetSupport(d) {
                    let bestIndex = 0;
                    let bestValue = b2Math_1.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2Math_1.b2Vec2.DotVV(this.m_vertices[i], d);
                        if (value > bestValue) {
                            bestIndex = i;
                            bestValue = value;
                        }
                    }
                    return bestIndex;
                }
                GetSupportVertex(d) {
                    let bestIndex = 0;
                    let bestValue = b2Math_1.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2Math_1.b2Vec2.DotVV(this.m_vertices[i], d);
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
                    ///b2Assert(0 <= index && index < this.m_count);
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
                    this.transformA = new b2Math_1.b2Transform();
                    this.transformB = new b2Math_1.b2Transform();
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
                    this.pointA = new b2Math_1.b2Vec2();
                    this.pointB = new b2Math_1.b2Vec2();
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
            exports_1("b2_gjkCalls", b2_gjkCalls = 0);
            exports_1("b2_gjkIters", b2_gjkIters = 0);
            exports_1("b2_gjkMaxIters", b2_gjkMaxIters = 0);
            b2SimplexVertex = class b2SimplexVertex {
                constructor() {
                    this.wA = new b2Math_1.b2Vec2(); // support point in proxyA
                    this.wB = new b2Math_1.b2Vec2(); // support point in proxyB
                    this.w = new b2Math_1.b2Vec2(); // wB - wA
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
                    ///b2Assert(0 <= cache.count && cache.count <= 3);
                    // Copy data from cache.
                    this.m_count = cache.count;
                    const vertices = this.m_vertices;
                    for (let i = 0; i < this.m_count; ++i) {
                        const v = vertices[i];
                        v.indexA = cache.indexA[i];
                        v.indexB = cache.indexB[i];
                        const wALocal = proxyA.GetVertex(v.indexA);
                        const wBLocal = proxyB.GetVertex(v.indexB);
                        b2Math_1.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2Math_1.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2Math_1.b2Vec2.SubVV(v.wB, v.wA, v.w);
                        v.a = 0;
                    }
                    // Compute the new simplex metric, if it is substantially different than
                    // old metric then flush the simplex.
                    if (this.m_count > 1) {
                        const metric1 = cache.metric;
                        const metric2 = this.GetMetric();
                        if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < b2Settings_1.b2_epsilon) {
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
                        b2Math_1.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2Math_1.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2Math_1.b2Vec2.SubVV(v.wB, v.wA, v.w);
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
                            return b2Math_1.b2Vec2.NegV(this.m_v1.w, out);
                        case 2: {
                            const e12 = b2Math_1.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, out);
                            const sgn = b2Math_1.b2Vec2.CrossVV(e12, b2Math_1.b2Vec2.NegV(this.m_v1.w, b2Math_1.b2Vec2.s_t0));
                            if (sgn > 0) {
                                // Origin is left of e12.
                                return b2Math_1.b2Vec2.CrossOneV(e12, out);
                            }
                            else {
                                // Origin is right of e12.
                                return b2Math_1.b2Vec2.CrossVOne(e12, out);
                            }
                        }
                        default:
                            ///b2Assert(false);
                            return out.SetZero();
                    }
                }
                GetClosestPoint(out) {
                    switch (this.m_count) {
                        case 0:
                            ///b2Assert(false);
                            return out.SetZero();
                        case 1:
                            return out.Copy(this.m_v1.w);
                        case 2:
                            return out.Set(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
                        case 3:
                            return out.SetZero();
                        default:
                            ///b2Assert(false);
                            return out.SetZero();
                    }
                }
                GetWitnessPoints(pA, pB) {
                    switch (this.m_count) {
                        case 0:
                            ///b2Assert(false);
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
                            ///b2Assert(false);
                            break;
                    }
                }
                GetMetric() {
                    switch (this.m_count) {
                        case 0:
                            ///b2Assert(false);
                            return 0;
                        case 1:
                            return 0;
                        case 2:
                            return b2Math_1.b2Vec2.DistanceVV(this.m_v1.w, this.m_v2.w);
                        case 3:
                            return b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(this.m_v3.w, this.m_v1.w, b2Math_1.b2Vec2.s_t1));
                        default:
                            ///b2Assert(false);
                            return 0;
                    }
                }
                Solve2() {
                    const w1 = this.m_v1.w;
                    const w2 = this.m_v2.w;
                    const e12 = b2Math_1.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    // w1 region
                    const d12_2 = (-b2Math_1.b2Vec2.DotVV(w1, e12));
                    if (d12_2 <= 0) {
                        // a2 <= 0, so we clamp it to 0
                        this.m_v1.a = 1;
                        this.m_count = 1;
                        return;
                    }
                    // w2 region
                    const d12_1 = b2Math_1.b2Vec2.DotVV(w2, e12);
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
                    const e12 = b2Math_1.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    const w1e12 = b2Math_1.b2Vec2.DotVV(w1, e12);
                    const w2e12 = b2Math_1.b2Vec2.DotVV(w2, e12);
                    const d12_1 = w2e12;
                    const d12_2 = (-w1e12);
                    // Edge13
                    // [1      1     ][a1] = [1]
                    // [w1.e13 w3.e13][a3] = [0]
                    // a2 = 0
                    const e13 = b2Math_1.b2Vec2.SubVV(w3, w1, b2Simplex.s_e13);
                    const w1e13 = b2Math_1.b2Vec2.DotVV(w1, e13);
                    const w3e13 = b2Math_1.b2Vec2.DotVV(w3, e13);
                    const d13_1 = w3e13;
                    const d13_2 = (-w1e13);
                    // Edge23
                    // [1      1     ][a2] = [1]
                    // [w2.e23 w3.e23][a3] = [0]
                    // a1 = 0
                    const e23 = b2Math_1.b2Vec2.SubVV(w3, w2, b2Simplex.s_e23);
                    const w2e23 = b2Math_1.b2Vec2.DotVV(w2, e23);
                    const w3e23 = b2Math_1.b2Vec2.DotVV(w3, e23);
                    const d23_1 = w3e23;
                    const d23_2 = (-w2e23);
                    // Triangle123
                    const n123 = b2Math_1.b2Vec2.CrossVV(e12, e13);
                    const d123_1 = n123 * b2Math_1.b2Vec2.CrossVV(w2, w3);
                    const d123_2 = n123 * b2Math_1.b2Vec2.CrossVV(w3, w1);
                    const d123_3 = n123 * b2Math_1.b2Vec2.CrossVV(w1, w2);
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
            b2Simplex.s_e12 = new b2Math_1.b2Vec2();
            b2Simplex.s_e13 = new b2Math_1.b2Vec2();
            b2Simplex.s_e23 = new b2Math_1.b2Vec2();
            exports_1("b2Simplex", b2Simplex);
            b2Distance_s_simplex = new b2Simplex();
            b2Distance_s_saveA = [0, 0, 0];
            b2Distance_s_saveB = [0, 0, 0];
            b2Distance_s_p = new b2Math_1.b2Vec2();
            b2Distance_s_d = new b2Math_1.b2Vec2();
            b2Distance_s_normal = new b2Math_1.b2Vec2();
            b2Distance_s_supportA = new b2Math_1.b2Vec2();
            b2Distance_s_supportB = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEaXN0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyRGlzdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7SUF3YkYsb0JBQTJCLE1BQXdCLEVBQUUsS0FBcUIsRUFBRSxLQUFzQjtRQUNoRyx5QkFBQSxFQUFFLFdBQVcsRUFBQztRQUVkLE1BQU0sTUFBTSxHQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDO1FBRTdDLE1BQU0sVUFBVSxHQUFnQixLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ2pELE1BQU0sVUFBVSxHQUFnQixLQUFLLENBQUMsVUFBVSxDQUFDO1FBRWpELDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBYyxvQkFBb0IsQ0FBQztRQUNoRCxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqRSxvQ0FBb0M7UUFDcEMsTUFBTSxRQUFRLEdBQXNCLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDdkQsTUFBTSxVQUFVLEdBQVcsRUFBRSxDQUFDO1FBRTlCLDBEQUEwRDtRQUMxRCxnREFBZ0Q7UUFDaEQsTUFBTSxLQUFLLEdBQWEsa0JBQWtCLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQWEsa0JBQWtCLENBQUM7UUFDM0MsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLElBQUksWUFBWSxHQUFXLHdCQUFXLENBQUM7UUFDdkMsSUFBSSxZQUFZLEdBQVcsWUFBWSxDQUFDO1FBRXhDLHVCQUF1QjtRQUN2QixJQUFJLElBQUksR0FBVyxDQUFDLENBQUM7UUFDckIsT0FBTyxJQUFJLEdBQUcsVUFBVSxFQUFFO1lBQ3hCLDhDQUE4QztZQUM5QyxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUM1QixLQUFL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QUFJLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3RCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDdEIsTUFBTTt3QkFFUixLQUFLLENBQUM7NEJBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUNuRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ25FLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbkUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUNuRSxNQUFNO3dCQUVSLEtBQUssQ0FBQzs0QkFDSixFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUks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