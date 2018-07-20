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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Timer", "./b2Distance"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Timer_1, b2Distance_1, b2_toiTime, b2_toiMaxTime, b2_toiCalls, b2_toiIters, b2_toiMaxIters, b2_toiRootIters, b2_toiMaxRootIters, b2TimeOfImpact_s_xfA, b2TimeOfImpact_s_xfB, b2TimeOfImpact_s_pointA, b2TimeOfImpact_s_pointB, b2TimeOfImpact_s_normal, b2TimeOfImpact_s_axisA, b2TimeOfImpact_s_axisB, b2TOIInput, b2TOIOutputState, b2TOIOutput, b2SeparationFunctionType, b2SeparationFunction, b2TimeOfImpact_s_timer, b2TimeOfImpact_s_cache, b2TimeOfImpact_s_distanceInput, b2TimeOfImpact_s_distanceOutput, b2TimeOfImpact_s_fcn, b2TimeOfImpact_s_indexA, b2TimeOfImpact_s_indexB, b2TimeOfImpact_s_sweepA, b2TimeOfImpact_s_sweepB;
    var __moduleName = context_1 && context_1.id;
    function b2_toi_reset() {
        exports_1("b2_toiTime", b2_toiTime = 0);
        exports_1("b2_toiMaxTime", b2_toiMaxTime = 0);
        exports_1("b2_toiCalls", b2_toiCalls = 0);
        exports_1("b2_toiIters", b2_toiIters = 0);
        exports_1("b2_toiMaxIters", b2_toiMaxIters = 0);
        exports_1("b2_toiRootIters", b2_toiRootIters = 0);
        exports_1("b2_toiMaxRootIters", b2_toiMaxRootIters = 0);
    }
    exports_1("b2_toi_reset", b2_toi_reset);
    function b2TimeOfImpact(output, input) {
        const timer = b2TimeOfImpact_s_timer.Reset();
        exports_1("b2_toiCalls", ++b2_toiCalls);
        output.state = b2TOIOutputState.e_unknown;
        output.t = input.tMax;
        const proxyA = input.proxyA;
        const proxyB = input.proxyB;
        const maxVertices = b2Math_1.b2Max(b2Settings_1.b2_maxPolygonVertices, proxyA.m_count, proxyB.m_count);
        const sweepA = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
        const sweepB = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);
        // Large rotations can make the root finder fail, so we normalize the
        // sweep angles.
        sweepA.Normalize();
        sweepB.Normalize();
        const tMax = input.tMax;
        const totalRadius = proxyA.m_radius + proxyB.m_radius;
        const target = b2Math_1.b2Max(b2Settings_1.b2_linearSlop, totalRadius - 3 * b2Settings_1.b2_linearSlop);
        const tolerance = 0.25 * b2Settings_1.b2_linearSlop;
        // DEBUG: b2Assert(target > tolerance);
        let t1 = 0;
        const k_maxIterations = 20; // TODO_ERIN b2Settings
        let iter = 0;
        // Prepare input for distance query.
        const cache = b2TimeOfImpact_s_cache;
        cache.count = 0;
        const distanceInput = b2TimeOfImpact_s_distanceInput;
        distanceInput.proxyA.Copy(input.proxyA);
        distanceInput.proxyB.Copy(input.proxyB);
        distanceInput.useRadii = false;
        // The outer loop progressively attempts to compute new separating axes.
        // This loop terminates when an axis is repeated (no progress is made).
        for (;;) {
            const xfA = b2TimeOfImpact_s_xfA;
            const xfB = b2TimeOfImpact_s_xfB;
            sweepA.GetTransform(xfA, t1);
            sweepB.GetTransform(xfB, t1);
            // Get the distance between shapes. We can also use the results
            // to get a separating axis.
            distanceInput.transformA.Copy(xfA);
            distanceInput.transformB.Copy(xfB);
            const distanceOutput = b2TimeOfImpact_s_distanceOutput;
            b2Distance_1.b2Distance(distanceOutput, cache, distanceInput);
            // If the shapes are overlapped, we give up on continuous collision.
            if (distanceOutput.distance <= 0) {
                // Failure!
                output.state = b2TOIOutputState.e_overlapped;
                output.t = 0;
                break;
            }
            if (distanceOutput.distance < target + tolerance) {
                // Victory!
                output.state = b2TOIOutputState.e_touching;
                output.t = t1;
                break;
            }
            // Initialize the separating axis.
            const fcn = b2TimeOfImpact_s_fcn;
            fcn.Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);
            /*
            #if 0
                // Dump the curve seen by the root finder {
                  const int32 N = 100;
                  float32 dx = 1.0f / N;
                  float32 xs[N+1];
                  float32 fs[N+1];
            
                  float32 x = 0.0f;
            
                  for (int32 i = 0; i <= N; ++i) {
                    sweepA.GetTransform(&xfA, x);
                    sweepB.GetTransform(&xfB, x);
                    float32 f = fcn.Evaluate(xfA, xfB) - target;
            
                    printf("%g %g\n", x, f);
            
                    xs[i] = x;
                    fs[i] = f;
            
                    x += dx;
                  }
                }
            #endif
            */
            // Compute the TOI on the separating axis. We do this by successively
            // resolving the deepest point. This loop is bounded by the number of vertices.
            let done = false;
            let t2 = tMax;
            let pushBackIter = 0;
            for (;;) {
                // Find the deepest point at t2. Store the witness point indices.
                const indexA = b2TimeOfImpact_s_indexA;
                const indexB = b2TimeOfImpact_s_indexB;
                let s2 = fcn.FindMinSeparation(indexA, indexB, t2);
                // Is the final configuration separated?
                if (s2 > (target + tolerance)) {
                    // Victory!
                    output.state = b2TOIOutputState.e_separated;
                    output.t = tMax;
                    done = true;
                    break;
                }
                // Has the separation reached tolerance?
                if (s2 > (target - tolerance)) {
                    // Advance the sweeps
                    t1 = t2;
                    break;
                }
                // Compute the initial separation of the witness points.
                let s1 = fcn.Evaluate(indexA[0], indexB[0], t1);
                // Check for initial overlap. This might happen if the root finder
                // runs out of iterations.
                if (s1 < (target - tolerance)) {
                    output.state = b2TOIOutputState.e_failed;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Check for touching
                if (s1 <= (target + tolerance)) {
                    // Victory! t1 should hold the TOI (could be 0.0).
                    output.state = b2TOIOutputState.e_touching;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Compute 1D root of: f(x) - target = 0
                let rootIterCount = 0;
                let a1 = t1;
                let a2 = t2;
                for (;;) {
                    // Use a mix of the secant rule and bisection.
                    let t = 0;
                    if (rootIterCount & 1) {
                        // Secant rule to improve convergence.
                        t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                    }
                    else {
                        // Bisection to guarantee progress.
                        t = 0.5 * (a1 + a2);
                    }
                    ++rootIterCount;
                    exports_1("b2_toiRootIters", ++b2_toiRootIters);
                    const s = fcn.Evaluate(indexA[0], indexB[0], t);
                    if (b2Math_1.b2Abs(s - target) < tolerance) {
                        // t2 holds a tentative value for t1
                        t2 = t;
                        break;
                    }
                    // Ensure we continue to bracket the root.
                    if (s > target) {
                        a1 = t;
                        s1 = s;
                    }
                    else {
                        a2 = t;
                        s2 = s;
                    }
                    if (rootIterCount === 50) {
                        break;
                    }
                }
                exports_1("b2_toiMaxRootIters", b2_toiMaxRootIters = b2Math_1.b2Max(b2_toiMaxRootIters, rootIterCount));
                ++pushBackIter;
                if (pushBackIter === maxVertices) {
                    break;
                }
            }
            ++iter;
            exports_1("b2_toiIters", ++b2_toiIters);
            if (done) {
                break;
            }
            if (iter === k_maxIterations) {
                // Root finder got stuck. Semi-victory.
                output.state = b2TOIOutputState.e_failed;
                output.t = t1;
                break;
            }
        }
        exports_1("b2_toiMaxIters", b2_toiMaxIters = b2Math_1.b2Max(b2_toiMaxIters, iter));
        const time = timer.GetMilliseconds();
        exports_1("b2_toiMaxTime", b2_toiMaxTime = b2Math_1.b2Max(b2_toiMaxTime, time));
        exports_1("b2_toiTime", b2_toiTime += time);
    }
    exports_1("b2TimeOfImpact", b2TimeOfImpact);
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Timer_1_1) {
                b2Timer_1 = b2Timer_1_1;
            },
            function (b2Distance_1_1) {
                b2Distance_1 = b2Distance_1_1;
            }
        ],
        execute: function () {
            exports_1("b2_toiTime", b2_toiTime = 0);
            exports_1("b2_toiMaxTime", b2_toiMaxTime = 0);
            exports_1("b2_toiCalls", b2_toiCalls = 0);
            exports_1("b2_toiIters", b2_toiIters = 0);
            exports_1("b2_toiMaxIters", b2_toiMaxIters = 0);
            exports_1("b2_toiRootIters", b2_toiRootIters = 0);
            exports_1("b2_toiMaxRootIters", b2_toiMaxRootIters = 0);
            b2TimeOfImpact_s_xfA = new b2Math_1.b2Transform();
            b2TimeOfImpact_s_xfB = new b2Math_1.b2Transform();
            b2TimeOfImpact_s_pointA = new b2Math_1.b2Vec2();
            b2TimeOfImpact_s_pointB = new b2Math_1.b2Vec2();
            b2TimeOfImpact_s_normal = new b2Math_1.b2Vec2();
            b2TimeOfImpact_s_axisA = new b2Math_1.b2Vec2();
            b2TimeOfImpact_s_axisB = new b2Math_1.b2Vec2();
            /// Input parameters for b2TimeOfImpact
            b2TOIInput = class b2TOIInput {
                constructor() {
                    this.proxyA = new b2Distance_1.b2DistanceProxy();
                    this.proxyB = new b2Distance_1.b2DistanceProxy();
                    this.sweepA = new b2Math_1.b2Sweep();
                    this.sweepB = new b2Math_1.b2Sweep();
                    this.tMax = 0; // defines sweep interval [0, tMax]
                }
            };
            exports_1("b2TOIInput", b2TOIInput);
            /// Output parameters for b2TimeOfImpact.
            (function (b2TOIOutputState) {
                b2TOIOutputState[b2TOIOutputState["e_unknown"] = 0] = "e_unknown";
                b2TOIOutputState[b2TOIOutputState["e_failed"] = 1] = "e_failed";
                b2TOIOutputState[b2TOIOutputState["e_overlapped"] = 2] = "e_overlapped";
                b2TOIOutputState[b2TOIOutputState["e_touching"] = 3] = "e_touching";
                b2TOIOutputState[b2TOIOutputState["e_separated"] = 4] = "e_separated";
            })(b2TOIOutputState || (b2TOIOutputState = {}));
            exports_1("b2TOIOutputState", b2TOIOutputState);
            b2TOIOutput = class b2TOIOutput {
                constructor() {
                    this.state = b2TOIOutputState.e_unknown;
                    this.t = 0;
                }
            };
            exports_1("b2TOIOutput", b2TOIOutput);
            (function (b2SeparationFunctionType) {
                b2SeparationFunctionType[b2SeparationFunctionType["e_unknown"] = -1] = "e_unknown";
                b2SeparationFunctionType[b2SeparationFunctionType["e_points"] = 0] = "e_points";
                b2SeparationFunctionType[b2SeparationFunctionType["e_faceA"] = 1] = "e_faceA";
                b2SeparationFunctionType[b2SeparationFunctionType["e_faceB"] = 2] = "e_faceB";
            })(b2SeparationFunctionType || (b2SeparationFunctionType = {}));
            exports_1("b2SeparationFunctionType", b2SeparationFunctionType);
            b2SeparationFunction = class b2SeparationFunction {
                constructor() {
                    this.m_sweepA = new b2Math_1.b2Sweep();
                    this.m_sweepB = new b2Math_1.b2Sweep();
                    this.m_type = b2SeparationFunctionType.e_unknown;
                    this.m_localPoint = new b2Math_1.b2Vec2();
                    this.m_axis = new b2Math_1.b2Vec2();
                }
                Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1) {
                    this.m_proxyA = proxyA;
                    this.m_proxyB = proxyB;
                    const count = cache.count;
                    // DEBUG: b2Assert(0 < count && count < 3);
                    this.m_sweepA.Copy(sweepA);
                    this.m_sweepB.Copy(sweepB);
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t1);
                    this.m_sweepB.GetTransform(xfB, t1);
                    if (count === 1) {
                        this.m_type = b2SeparationFunctionType.e_points;
                        const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                        const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                        b2Math_1.b2Vec2.SubVV(pointB, pointA, this.m_axis);
                        const s = this.m_axis.Normalize();
                        // #if B2_ENABLE_PARTICLE
                        this.m_localPoint.SetZero();
                        // #endif
                        return s;
                    }
                    else if (cache.indexA[0] === cache.indexA[1]) {
                        // Two points on B and one on A.
                        this.m_type = b2SeparationFunctionType.e_faceB;
                        const localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
                        b2Math_1.b2Vec2.CrossVOne(b2Math_1.b2Vec2.SubVV(localPointB2, localPointB1, b2Math_1.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                        const normal = b2Math_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                        b2Math_1.b2Vec2.MidVV(localPointB1, localPointB2, this.m_localPoint);
                        const pointB = b2Math_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                        const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                        let s = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointA, pointB, b2Math_1.b2Vec2.s_t0), normal);
                        if (s < 0) {
                            this.m_axis.SelfNeg();
                            s = -s;
                        }
                        return s;
                    }
                    else {
                        // Two points on A and one or two points on B.
                        this.m_type = b2SeparationFunctionType.e_faceA;
                        const localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
                        b2Math_1.b2Vec2.CrossVOne(b2Math_1.b2Vec2.SubVV(localPointA2, localPointA1, b2Math_1.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                        const normal = b2Math_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                        b2Math_1.b2Vec2.MidVV(localPointA1, localPointA2, this.m_localPoint);
                        const pointA = b2Math_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                        const localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                        let s = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), normal);
                        if (s < 0) {
                            this.m_axis.SelfNeg();
                            s = -s;
                        }
                        return s;
                    }
                }
                FindMinSeparation(indexA, indexB, t) {
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t);
                    this.m_sweepB.GetTransform(xfB, t);
                    switch (this.m_type) {
                        case b2SeparationFunctionType.e_points: {
                            const axisA = b2Math_1.b2Rot.MulTRV(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
                            const axisB = b2Math_1.b2Rot.MulTRV(xfB.q, b2Math_1.b2Vec2.NegV(this.m_axis, b2Math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                            indexA[0] = this.m_proxyA.GetSupport(axisA);
                            indexB[0] = this.m_proxyB.GetSupport(axisB);
                            const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                            const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), this.m_axis);
                            return separation;
                        }
                        case b2SeparationFunctionType.e_faceA: {
                            const normal = b2Math_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                            const axisB = b2Math_1.b2Rot.MulTRV(xfB.q, b2Math_1.b2Vec2.NegV(normal, b2Math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                            indexA[0] = -1;
                            indexB[0] = this.m_proxyB.GetSupport(axisB);
                            const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        case b2SeparationFunctionType.e_faceB: {
                            const normal = b2Math_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                            const axisA = b2Math_1.b2Rot.MulTRV(xfA.q, b2Math_1.b2Vec2.NegV(normal, b2Math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisA);
                            indexB[0] = -1;
                            indexA[0] = this.m_proxyA.GetSupport(axisA);
                            const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointA, pointB, b2Math_1.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        default:
                            // DEBUG: b2Assert(false);
                            indexA[0] = -1;
                            indexB[0] = -1;
                            return 0;
                    }
                }
                Evaluate(indexA, indexB, t) {
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t);
                    this.m_sweepB.GetTransform(xfB, t);
                    switch (this.m_type) {
                        case b2SeparationFunctionType.e_points: {
                            const localPointA = this.m_proxyA.GetVertex(indexA);
                            const localPointB = this.m_proxyB.GetVertex(indexB);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), this.m_axis);
                            return separation;
                        }
                        case b2SeparationFunctionType.e_faceA: {
                            const normal = b2Math_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                            const localPointB = this.m_proxyB.GetVertex(indexB);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        case b2SeparationFunctionType.e_faceB: {
                            const normal = b2Math_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                            const localPointA = this.m_proxyA.GetVertex(indexA);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointA, pointB, b2Math_1.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        default:
                            // DEBUG: b2Assert(false);
                            return 0;
                    }
                }
            };
            exports_1("b2SeparationFunction", b2SeparationFunction);
            b2TimeOfImpact_s_timer = new b2Timer_1.b2Timer();
            b2TimeOfImpact_s_cache = new b2Distance_1.b2SimplexCache();
            b2TimeOfImpact_s_distanceInput = new b2Distance_1.b2DistanceInput();
            b2TimeOfImpact_s_distanceOutput = new b2Distance_1.b2DistanceOutput();
            b2TimeOfImpact_s_fcn = new b2SeparationFunction();
            b2TimeOfImpact_s_indexA = [0];
            b2TimeOfImpact_s_indexB = [0];
            b2TimeOfImpact_s_sweepA = new b2Math_1.b2Sweep();
            b2TimeOfImpact_s_sweepB = new b2Math_1.b2Sweep();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJUaW1lT2ZJbXBhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9Cb3gyRC9Db2xsaXNpb24vYjJUaW1lT2ZJbXBhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBZUY7UUFDRSx3QkFBQSxVQUFVLEdBQUcsQ0FBQyxFQUFDO1FBQ2YsMkJBQUEsYUFBYSxHQUFHLENBQUMsRUFBQztRQUNsQix5QkFBQSxXQUFXLEdBQUcsQ0FBQyxFQUFDO1FBQ2hCLHlCQUFBLFdBQVcsR0FBRyxDQUFDLEVBQUM7UUFDaEIsNEJBQUEsY0FBYyxHQUFHLENBQUMsRUFBQztRQUNuQiw2QkFBQSxlQUFlLEdBQUcsQ0FBQyxFQUFDO1FBQ3BCLGdDQUFBLGtCQUFrQixHQUFHLENBQUMsRUFBQztJQUN6QixDQUFDOztJQWdQRCx3QkFBK0IsTUFBbUIsRUFBRSxLQUFpQjtRQUNuRSxNQUFNLEtBQUssR0FBWSxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV0RCx5QkFBQSxFQUFFLFdBQVcsRUFBQztRQUVkLE1BQU0sQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUV0QixNQUFNLE1BQU0sR0FBb0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBb0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxNQUFNLFdBQVcsR0FBVyxjQUFLLENBQUMsa0NBQXFCLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekYsTUFBTSxNQUFNLEdBQVksdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxNQUFNLE1BQU0sR0FBWSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1B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