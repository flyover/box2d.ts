System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_collision_js_1, b2_collision_js_2, b2CollideEdgeAndCircle_s_Q, b2CollideEdgeAndCircle_s_e, b2CollideEdgeAndCircle_s_d, b2CollideEdgeAndCircle_s_e1, b2CollideEdgeAndCircle_s_e2, b2CollideEdgeAndCircle_s_P, b2CollideEdgeAndCircle_s_n, b2CollideEdgeAndCircle_s_id, b2EPAxisType, b2EPAxis, b2TempPolygon, b2ReferenceFace, b2ComputeEdgeSeparation_s_axis, b2ComputeEdgeSeparation_s_axes, b2ComputePolygonSeparation_s_axis, b2ComputePolygonSeparation_s_n, b2CollideEdgeAndPolygon_s_xf, b2CollideEdgeAndPolygon_s_centroidB, b2CollideEdgeAndPolygon_s_edge1, b2CollideEdgeAndPolygon_s_normal1, b2CollideEdgeAndPolygon_s_edge0, b2CollideEdgeAndPolygon_s_normal0, b2CollideEdgeAndPolygon_s_edge2, b2CollideEdgeAndPolygon_s_normal2, b2CollideEdgeAndPolygon_s_tempPolygonB, b2CollideEdgeAndPolygon_s_ref, b2CollideEdgeAndPolygon_s_clipPoints, b2CollideEdgeAndPolygon_s_clipPoints1, b2CollideEdgeAndPolygon_s_clipPoints2;
    var __moduleName = context_1 && context_1.id;
    function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle in frame of edge
        const Q = b2_math_js_1.b2Transform.MulTXV(xfA, b2_math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2_math_js_1.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        const A = edgeA.m_vertex1;
        const B = edgeA.m_vertex2;
        const e = b2_math_js_1.b2Vec2.SubVV(B, A, b2CollideEdgeAndCircle_s_e);
        // Normal points to the right for a CCW winding
        // b2Vec2 n(e.y, -e.x);
        // const n: b2Vec2 = b2CollideEdgeAndCircle_s_n.Set(-e.y, e.x);
        const n = b2CollideEdgeAndCircle_s_n.Set(e.y, -e.x);
        // float offset = b2Dot(n, Q - A);
        const offset = b2_math_js_1.b2Vec2.DotVV(n, b2_math_js_1.b2Vec2.SubVV(Q, A, b2_math_js_1.b2Vec2.s_t0));
        const oneSided = edgeA.m_oneSided;
        if (oneSided && offset < 0.0) {
            return;
        }
        // Barycentric coordinates
        const u = b2_math_js_1.b2Vec2.DotVV(e, b2_math_js_1.b2Vec2.SubVV(B, Q, b2_math_js_1.b2Vec2.s_t0));
        const v = b2_math_js_1.b2Vec2.DotVV(e, b2_math_js_1.b2Vec2.SubVV(Q, A, b2_math_js_1.b2Vec2.s_t0));
        const radius = edgeA.m_radius + circleB.m_radius;
        // const cf: b2ContactFeature = new b2ContactFeature();
        const id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = b2_collision_js_1.b2ContactFeatureType.e_vertex;
        // Region A
        if (v <= 0) {
            const P = A;
            const d = b2_math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2_math_js_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to A?
            if (edgeA.m_oneSided) {
                const A1 = edgeA.m_vertex0;
                const B1 = A;
                const e1 = b2_math_js_1.b2Vec2.SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
                const u1 = b2_math_js_1.b2Vec2.DotVV(e1, b2_math_js_1.b2Vec2.SubVV(B1, Q, b2_math_js_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the previous edge?
                if (u1 > 0) {
                    return;
                }
            }
            id.cf.indexA = 0;
            id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_2.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region B
        if (u <= 0) {
            const P = B;
            const d = b2_math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2_math_js_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to B?
            if (edgeA.m_oneSided) {
                const B2 = edgeA.m_vertex3;
                const A2 = B;
                const e2 = b2_math_js_1.b2Vec2.SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
                const v2 = b2_math_js_1.b2Vec2.DotVV(e2, b2_math_js_1.b2Vec2.SubVV(Q, A2, b2_math_js_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the next edge?
                if (v2 > 0) {
                    return;
                }
            }
            id.cf.indexA = 1;
            id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_2.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region AB
        const den = b2_math_js_1.b2Vec2.DotVV(e, e);
        // DEBUG: b2Assert(den > 0);
        const P = b2CollideEdgeAndCircle_s_P;
        P.x = (1 / den) * (u * A.x + v * B.x);
        P.y = (1 / den) * (u * A.y + v * B.y);
        const d = b2_math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
        const dd = b2_math_js_1.b2Vec2.DotVV(d, d);
        if (dd > radius * radius) {
            return;
        }
        if (offset < 0) {
            n.Set(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_face;
        manifold.pointCount = 1;
        manifold.type = b2_collision_js_2.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(n);
        manifold.localPoint.Copy(A);
        manifold.points[0].id.Copy(id);
        // manifold.points[0].id.key = 0;
        // manifold.points[0].id.cf = cf;
        manifold.points[0].localPoint.Copy(circleB.m_p);
    }
    exports_1("b2CollideEdgeAndCircle", b2CollideEdgeAndCircle);
    function b2ComputeEdgeSeparation(polygonB, v1, normal1) {
        // b2EPAxis axis;
        const axis = b2ComputeEdgeSeparation_s_axis;
        axis.type = b2EPAxisType.e_edgeA;
        axis.index = -1;
        axis.separation = -Number.MAX_VALUE; // -FLT_MAX;
        axis.normal.SetZero();
        // b2Vec2 axes[2] = { normal1, -normal1 };
        const axes = b2ComputeEdgeSeparation_s_axes;
        axes[0].Copy(normal1);
        axes[1].Copy(normal1).SelfNeg();
        // Find axis with least overlap (min-max problem)
        for (let j = 0; j < 2; ++j) {
            let sj = Number.MAX_VALUE; // FLT_MAX;
            // Find deepest polygon vertex along axis j
            for (let i = 0; i < polygonB.count; ++i) {
                // float si = b2Dot(axes[j], polygonB.vertices[i] - v1);
                const si = b2_math_js_1.b2Vec2.DotVV(axes[j], b2_math_js_1.b2Vec2.SubVV(polygonB.vertices[i], v1, b2_math_js_1.b2Vec2.s_t0));
                if (si < sj) {
                    sj = si;
                }
            }
            if (sj > axis.separation) {
                axis.index = j;
                axis.separation = sj;
                axis.normal.Copy(axes[j]);
            }
        }
        return axis;
    }
    function b2ComputePolygonSeparation(polygonB, v1, v2) {
        const axis = b2ComputePolygonSeparation_s_axis;
        axis.type = b2EPAxisType.e_unknown;
        axis.index = -1;
        axis.separation = -Number.MAX_VALUE; // -FLT_MAX;
        axis.normal.SetZero();
        for (let i = 0; i < polygonB.count; ++i) {
            // b2Vec2 n = -polygonB.normals[i];
            const n = b2_math_js_1.b2Vec2.NegV(polygonB.normals[i], b2ComputePolygonSeparation_s_n);
            // float s1 = b2Dot(n, polygonB.vertices[i] - v1);
            const s1 = b2_math_js_1.b2Vec2.DotVV(n, b2_math_js_1.b2Vec2.SubVV(polygonB.vertices[i], v1, b2_math_js_1.b2Vec2.s_t0));
            // float s2 = b2Dot(n, polygonB.vertices[i] - v2);
            const s2 = b2_math_js_1.b2Vec2.DotVV(n, b2_math_js_1.b2Vec2.SubVV(polygonB.vertices[i], v2, b2_math_js_1.b2Vec2.s_t0));
            // float s = b2Min(s1, s2);
            const s = b2_math_js_1.b2Min(s1, s2);
            if (s > axis.separation) {
                axis.type = b2EPAxisType.e_edgeB;
                axis.index = i;
                axis.separation = s;
                axis.normal.Copy(n);
            }
        }
        return axis;
    }
    function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
        manifold.pointCount = 0;
        // b2Transform xf = b2MulT(xfA, xfB);
        const xf = b2_math_js_1.b2Transform.MulTXX(xfA, xfB, b2CollideEdgeAndPolygon_s_xf);
        // b2Vec2 centroidB = b2Mul(xf, polygonB.m_centroid);
        const centroidB = b2_math_js_1.b2Transform.MulXV(xf, polygonB.m_centroid, b2CollideEdgeAndPolygon_s_centroidB);
        // b2Vec2 v1 = edgeA.m_vertex1;
        const v1 = edgeA.m_vertex1;
        // b2Vec2 v2 = edgeA.m_vertex2;
        const v2 = edgeA.m_vertex2;
        // b2Vec2 edge1 = v2 - v1;
        const edge1 = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2CollideEdgeAndPolygon_s_edge1);
        edge1.Normalize();
        // Normal points to the right for a CCW winding
        // b2Vec2 normal1(edge1.y, -edge1.x);
        const normal1 = b2CollideEdgeAndPolygon_s_normal1.Set(edge1.y, -edge1.x);
        // float offset1 = b2Dot(normal1, centroidB - v1);
        const offset1 = b2_math_js_1.b2Vec2.DotVV(normal1, b2_math_js_1.b2Vec2.SubVV(centroidB, v1, b2_math_js_1.b2Vec2.s_t0));
        const oneSided = edgeA.m_oneSided;
        if (oneSided && offset1 < 0.0) {
            return;
        }
        // Get polygonB in frameA
        // b2TempPolygon tempPolygonB;
        const tempPolygonB = b2CollideEdgeAndPolygon_s_tempPolygonB;
        tempPolygonB.count = polygonB.m_count;
        for (let i = 0; i < polygonB.m_count; ++i) {
            if (tempPolygonB.vertices.length <= i) {
                tempPolygonB.vertices.push(new b2_math_js_1.b2Vec2());
            }
            if (tempPolygonB.normals.length <= i) {
                tempPolygonB.normals.push(new b2_math_js_1.b2Vec2());
            }
            // tempPolygonB.vertices[i] = b2Mul(xf, polygonB.m_vertices[i]);
            b2_math_js_1.b2Transform.MulXV(xf, polygonB.m_vertices[i], tempPolygonB.vertices[i]);
            // tempPolygonB.normals[i] = b2Mul(xf.q, polygonB.m_normals[i]);
            b2_math_js_1.b2Rot.MulRV(xf.q, polygonB.m_normals[i], tempPolygonB.normals[i]);
        }
        const radius = polygonB.m_radius + edgeA.m_radius;
        // b2EPAxis edgeAxis = b2ComputeEdgeSeparation(tempPolygonB, v1, normal1);
        const edgeAxis = b2ComputeEdgeSeparation(tempPolygonB, v1, normal1);
        if (edgeAxis.separation > radius) {
            return;
        }
        // b2EPAxis polygonAxis = b2ComputePolygonSeparation(tedge0.y, -edge0.xempPolygonB, v1, v2);
        const polygonAxis = b2ComputePolygonSeparation(tempPolygonB, v1, v2);
        if (polygonAxis.separation > radius) {
            return;
        }
        // Use hysteresis for jitter reduction.
        const k_relativeTol = 0.98;
        const k_absoluteTol = 0.001;
        // b2EPAxis primaryAxis;
        let primaryAxis;
        if (polygonAxis.separation - radius > k_relativeTol * (edgeAxis.separation - radius) + k_absoluteTol) {
            primaryAxis = polygonAxis;
        }
        else {
            primaryAxis = edgeAxis;
        }
        if (oneSided) {
            // Smooth collision
            // See https://box2d.org/posts/2020/06/ghost-collisions/
            // b2Vec2 edge0 = v1 - edgeA.m_vertex0;
            const edge0 = b2_math_js_1.b2Vec2.SubVV(v1, edgeA.m_vertex0, b2CollideEdgeAndPolygon_s_edge0);
            edge0.Normalize();
            // b2Vec2 normal0(edge0.y, -edge0.x);
            const normal0 = b2CollideEdgeAndPolygon_s_normal0.Set(edge0.y, -edge0.x);
            const convex1 = b2_math_js_1.b2Vec2.CrossVV(edge0, edge1) >= 0.0;
            // b2Vec2 edge2 = edgeA.m_vertex3 - v2;
            const edge2 = b2_math_js_1.b2Vec2.SubVV(edgeA.m_vertex3, v2, b2CollideEdgeAndPolygon_s_edge2);
            edge2.Normalize();
            // b2Vec2 normal2(edge2.y, -edge2.x);
            const normal2 = b2CollideEdgeAndPolygon_s_normal2.Set(edge2.y, -edge2.x);
            const convex2 = b2_math_js_1.b2Vec2.CrossVV(edge1, edge2) >= 0.0;
            const sinTol = 0.1;
            const side1 = b2_math_js_1.b2Vec2.DotVV(primaryAxis.normal, edge1) <= 0.0;
            // Check Gauss Map
            if (side1) {
                if (convex1) {
                    if (b2_math_js_1.b2Vec2.CrossVV(primaryAxis.normal, normal0) > sinTol) {
                        // Skip region
                        return;
                    }
                    // Admit region
                }
                else {
                    // Snap region
                    primaryAxis = edgeAxis;
                }
            }
            else {
                if (convex2) {
                    if (b2_math_js_1.b2Vec2.CrossVV(normal2, primaryAxis.normal) > sinTol) {
                        // Skip region
                        return;
                    }
                    // Admit region
                }
                else {
                    // Snap region
                    primaryAxis = edgeAxis;
                }
            }
        }
        // b2ClipVertex clipPoints[2];
        const clipPoints = b2CollideEdgeAndPolygon_s_clipPoints;
        // b2ReferenceFace ref;
        const ref = b2CollideEdgeAndPolygon_s_ref;
        if (primaryAxis.type === b2EPAxisType.e_edgeA) {
            manifold.type = b2_collision_js_2.b2ManifoldType.e_faceA;
            // Search for the polygon normal that is most anti-parallel to the edge normal.
            let bestIndex = 0;
            let bestValue = b2_math_js_1.b2Vec2.DotVV(primaryAxis.normal, tempPolygonB.normals[0]);
            for (let i = 1; i < tempPolygonB.count; ++i) {
                const value = b2_math_js_1.b2Vec2.DotVV(primaryAxis.normal, tempPolygonB.normals[i]);
                if (value < bestValue) {
                    bestValue = value;
                    bestIndex = i;
                }
            }
            const i1 = bestIndex;
            const i2 = i1 + 1 < tempPolygonB.count ? i1 + 1 : 0;
            clipPoints[0].v.Copy(tempPolygonB.vertices[i1]);
            clipPoints[0].id.cf.indexA = 0;
            clipPoints[0].id.cf.indexB = i1;
            clipPoints[0].id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_face;
            clipPoints[0].id.cf.typeB = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            clipPoints[1].v.Copy(tempPolygonB.vertices[i2]);
            clipPoints[1].id.cf.indexA = 0;
            clipPoints[1].id.cf.indexB = i2;
            clipPoints[1].id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_face;
            clipPoints[1].id.cf.typeB = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            ref.i1 = 0;
            ref.i2 = 1;
            ref.v1.Copy(v1);
            ref.v2.Copy(v2);
            ref.normal.Copy(primaryAxis.normal);
            ref.sideNormal1.Copy(edge1).SelfNeg(); // ref.sideNormal1 = -edge1;
            ref.sideNormal2.Copy(edge1);
        }
        else {
            manifold.type = b2_collision_js_2.b2ManifoldType.e_faceB;
            clipPoints[0].v.Copy(v2);
            clipPoints[0].id.cf.indexA = 1;
            clipPoints[0].id.cf.indexB = primaryAxis.index;
            clipPoints[0].id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            clipPoints[0].id.cf.typeB = b2_collision_js_1.b2ContactFeatureType.e_face;
            clipPoints[1].v.Copy(v1);
            clipPoints[1].id.cf.indexA = 0;
            clipPoints[1].id.cf.indexB = primaryAxis.index;
            clipPoints[1].id.cf.typeA = b2_collision_js_1.b2ContactFeatureType.e_vertex;
            clipPoints[1].id.cf.typeB = b2_collision_js_1.b2ContactFeatureType.e_face;
            ref.i1 = primaryAxis.index;
            ref.i2 = ref.i1 + 1 < tempPolygonB.count ? ref.i1 + 1 : 0;
            ref.v1.Copy(tempPolygonB.vertices[ref.i1]);
            ref.v2.Copy(tempPolygonB.vertices[ref.i2]);
            ref.normal.Copy(tempPolygonB.normals[ref.i1]);
            // CCW winding
            ref.sideNormal1.Set(ref.normal.y, -ref.normal.x);
            ref.sideNormal2.Copy(ref.sideNormal1).SelfNeg(); // ref.sideNormal2 = -ref.sideNormal1;
        }
        ref.sideOffset1 = b2_math_js_1.b2Vec2.DotVV(ref.sideNormal1, ref.v1);
        ref.sideOffset2 = b2_math_js_1.b2Vec2.DotVV(ref.sideNormal2, ref.v2);
        // Clip incident edge against reference face side planes
        // b2ClipVertex clipPoints1[2];
        const clipPoints1 = b2CollideEdgeAndPolygon_s_clipPoints1; // [new b2ClipVertex(), new b2ClipVertex()];
        // b2ClipVertex clipPoints2[2];
        const clipPoints2 = b2CollideEdgeAndPolygon_s_clipPoints2; // [new b2ClipVertex(), new b2ClipVertex()];
        // int32 np;
        let np;
        // Clip to side 1
        np = b2_collision_js_2.b2ClipSegmentToLine(clipPoints1, clipPoints, ref.sideNormal1, ref.sideOffset1, ref.i1);
        if (np < b2_settings_js_1.b2_maxManifoldPoints) {
            return;
        }
        // Clip to side 2
        np = b2_collision_js_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, ref.sideNormal2, ref.sideOffset2, ref.i2);
        if (np < b2_settings_js_1.b2_maxManifoldPoints) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        if (primaryAxis.type === b2EPAxisType.e_edgeA) {
            manifold.localNormal.Copy(ref.normal);
            manifold.localPoint.Copy(ref.v1);
        }
        else {
            manifold.localNormal.Copy(polygonB.m_normals[ref.i1]);
            manifold.localPoint.Copy(polygonB.m_vertices[ref.i1]);
        }
        let pointCount = 0;
        for (let i = 0; i < b2_settings_js_1.b2_maxManifoldPoints; ++i) {
            const separation = b2_math_js_1.b2Vec2.DotVV(ref.normal, b2_math_js_1.b2Vec2.SubVV(clipPoints2[i].v, ref.v1, b2_math_js_1.b2Vec2.s_t0));
            if (separation <= radius) {
                const cp = manifold.points[pointCount];
                if (primaryAxis.type === b2EPAxisType.e_edgeA) {
                    b2_math_js_1.b2Transform.MulTXV(xf, clipPoints2[i].v, cp.localPoint); // cp.localPoint = b2MulT(xf, clipPoints2[i].v);
                    cp.id.Copy(clipPoints2[i].id);
                }
                else {
                    cp.localPoint.Copy(clipPoints2[i].v);
                    cp.id.cf.typeA = clipPoints2[i].id.cf.typeB;
                    cp.id.cf.typeB = clipPoints2[i].id.cf.typeA;
                    cp.id.cf.indexA = clipPoints2[i].id.cf.indexB;
                    cp.id.cf.indexB = clipPoints2[i].id.cf.indexA;
                }
                ++pointCount;
            }
        }
        manifold.pointCount = pointCount;
    }
    exports_1("b2CollideEdgeAndPolygon", b2CollideEdgeAndPolygon);
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_collision_js_1_1) {
                b2_collision_js_1 = b2_collision_js_1_1;
                b2_collision_js_2 = b2_collision_js_1_1;
            }
        ],
        execute: function () {
            b2CollideEdgeAndCircle_s_Q = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_d = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e1 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e2 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_P = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_n = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_id = new b2_collision_js_1.b2ContactID();
            (function (b2EPAxisType) {
                b2EPAxisType[b2EPAxisType["e_unknown"] = 0] = "e_unknown";
                b2EPAxisType[b2EPAxisType["e_edgeA"] = 1] = "e_edgeA";
                b2EPAxisType[b2EPAxisType["e_edgeB"] = 2] = "e_edgeB";
            })(b2EPAxisType || (b2EPAxisType = {}));
            b2EPAxis = class b2EPAxis {
                constructor() {
                    this.normal = new b2_math_js_1.b2Vec2();
                    this.type = b2EPAxisType.e_unknown;
                    this.index = 0;
                    this.separation = 0;
                }
            };
            b2TempPolygon = class b2TempPolygon {
                constructor() {
                    this.vertices = [];
                    this.normals = [];
                    this.count = 0;
                }
            };
            b2ReferenceFace = class b2ReferenceFace {
                constructor() {
                    this.i1 = 0;
                    this.i2 = 0;
                    this.v1 = new b2_math_js_1.b2Vec2();
                    this.v2 = new b2_math_js_1.b2Vec2();
                    this.normal = new b2_math_js_1.b2Vec2();
                    this.sideNormal1 = new b2_math_js_1.b2Vec2();
                    this.sideOffset1 = 0;
                    this.sideNormal2 = new b2_math_js_1.b2Vec2();
                    this.sideOffset2 = 0;
                }
            };
            // static b2EPAxis b2ComputeEdgeSeparation(const b2TempPolygon& polygonB, const b2Vec2& v1, const b2Vec2& normal1)
            b2ComputeEdgeSeparation_s_axis = new b2EPAxis();
            b2ComputeEdgeSeparation_s_axes = [new b2_math_js_1.b2Vec2(), new b2_math_js_1.b2Vec2()];
            // static b2EPAxis b2ComputePolygonSeparation(const b2TempPolygon& polygonB, const b2Vec2& v1, const b2Vec2& v2)
            b2ComputePolygonSeparation_s_axis = new b2EPAxis();
            b2ComputePolygonSeparation_s_n = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_xf = new b2_math_js_1.b2Transform();
            b2CollideEdgeAndPolygon_s_centroidB = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_edge1 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_normal1 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_edge0 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_normal0 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_edge2 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_normal2 = new b2_math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_tempPolygonB = new b2TempPolygon();
            b2CollideEdgeAndPolygon_s_ref = new b2ReferenceFace();
            b2CollideEdgeAndPolygon_s_clipPoints = [new b2_collision_js_2.b2ClipVertex(), new b2_collision_js_2.b2ClipVertex()];
            b2CollideEdgeAndPolygon_s_clipPoints1 = [new b2_collision_js_2.b2ClipVertex(), new b2_collision_js_2.b2ClipVertex()];
            b2CollideEdgeAndPolygon_s_clipPoints2 = [new b2_collision_js_2.b2ClipVertex(), new b2_collision_js_2.b2ClipVertex()];
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29sbGlkZV9lZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbGxpc2lvbi9iMl9jb2xsaWRlX2VkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWlCQSxTQUFnQixzQkFBc0IsQ0FBQyxRQUFvQixFQUFFLEtBQWtCLEVBQUUsR0FBZ0IsRUFBRSxPQUFzQixFQUFFLEdBQWdCO1FBQ3pJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBVyx3QkFBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsd0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsbUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRXhILE1BQU0sQ0FBQyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFakUsK0NBQStDO1FBQy9DLHVCQUF1QjtRQUN2QiwrREFBK0Q7UUFDL0QsTUFBTSxDQUFDLEdBQVcsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsa0NBQWtDO1FBQ2xDLE1BQU0sTUFBTSxHQUFXLG1CQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxtQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV4RSxNQUFNLFFBQVEsR0FBWSxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzNDLElBQUksUUFBUSxJQUFJLE1B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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxzQ0FBb0IsQ0FBQyxRQUFRLENBQUM7WUFDMUQsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHNDQUFvQixDQUFDLE1BQU0sQ0FBQztZQUV4RCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxzQ0FBb0IsQ0FBQyxRQUFRLENBQUM7WUFDMUQsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHNDQUFvQixDQUFDLE1BQU0sQ0FBQztZQUV4RCxHQUFHLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDM0IsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFH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