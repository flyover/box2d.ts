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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29sbGlkZV9lZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfY29sbGlkZV9lZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFpQkEsU0FBZ0Isc0JBQXNCLENBQUMsUUFBb0IsRUFBRSxLQUFrQixFQUFFLEdBQWdCLEVBQUUsT0FBc0IsRUFBRSxHQUFnQjtRQUN6SSxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUV4QixrQ0FBa0M7UUFDbEMsTUFBTSxDQUFDLEdBQVcsd0JBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLHdCQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUV4SCxNQUFNLENBQUMsR0FBVyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQVcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRWpFLCtDQUErQztRQUMvQyx1QkFBdUI7UUFDdkIsK0RBQStEO1FBQy9ELE1BQU0sQ0FBQyxHQUFXLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELGtDQUFrQztRQUNsQyxNQUFNLE1BQU0sR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsbUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFeEUsTUFBTSxRQUFRLEdBQVksS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUMzQyxJQUFJLFFBQVEsSUFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO1lB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QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUMvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsc0NBQW9CLENBQUMsUUFBUSxDQUFDO1lBQzFELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxzQ0FBb0IsQ0FBQyxNQUFNLENBQUM7WUFFeEQsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUMvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsc0NBQW9CLENBQUMsUUFBUSxDQUFDO1lBQzFELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxzQ0FBb0IsQ0FBQyxNQUFNLENBQUM7WUFFeEQsR0FBRyxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFD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