System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        ///const count1: number = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        ///b2Assert(0 <= edge1 && edge1 < count1);
        // Convert normal from poly1's frame into poly2's frame.
        const normal1World = b2Math_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
        const normal1 = b2Math_1.b2Rot.MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
        // Find support vertex on poly2 for -normal.
        let index = 0;
        let minDot = b2Settings_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_1.b2Vec2.DotVV(vertices2[i], normal1);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        const v1 = b2Math_1.b2Transform.MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
        const v2 = b2Math_1.b2Transform.MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
        const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(v2, v1, b2Math_1.b2Vec2.s_t0), normal1World);
        return separation;
    }
    function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        const count1 = poly1.m_count;
        const normals1 = poly1.m_normals;
        // Vector pointing from the centroid of poly1 to the centroid of poly2.
        const d = b2Math_1.b2Vec2.SubVV(b2Math_1.b2Transform.MulXV(xf2, poly2.m_centroid, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Transform.MulXV(xf1, poly1.m_centroid, b2Math_1.b2Vec2.s_t1), b2FindMaxSeparation_s_d);
        const dLocal1 = b2Math_1.b2Rot.MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
        // Find edge normal on poly1 that has the largest projection onto d.
        let edge = 0;
        let maxDot = (-b2Settings_1.b2_maxFloat);
        for (let i = 0; i < count1; ++i) {
            const dot = b2Math_1.b2Vec2.DotVV(normals1[i], dLocal1);
            if (dot > maxDot) {
                maxDot = dot;
                edge = i;
            }
        }
        // Get the separation for the edge normal.
        let s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
        // Check the separation for the previous edge normal.
        const prevEdge = (edge + count1 - 1) % count1;
        const sPrev = b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
        // Check the separation for the next edge normal.
        const nextEdge = (edge + 1) % count1;
        const sNext = b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
        // Find the best edge and the search direction.
        let bestEdge = 0;
        let bestSeparation = 0;
        let increment = 0;
        if (sPrev > s && sPrev > sNext) {
            increment = -1;
            bestEdge = prevEdge;
            bestSeparation = sPrev;
        }
        else if (sNext > s) {
            increment = 1;
            bestEdge = nextEdge;
            bestSeparation = sNext;
        }
        else {
            edgeIndex[0] = edge;
            return s;
        }
        // Perform a local search for the best edge normal.
        while (true) {
            if (increment === -1)
                edge = (bestEdge + count1 - 1) % count1;
            else
                edge = (bestEdge + 1) % count1;
            s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
            if (s > bestSeparation) {
                bestEdge = edge;
                bestSeparation = s;
            }
            else {
                break;
            }
        }
        edgeIndex[0] = bestEdge;
        return bestSeparation;
    }
    function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
        ///const count1: number = poly1.m_count;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        const normals2 = poly2.m_normals;
        ///b2Assert(0 <= edge1 && edge1 < count1);
        // Get the normal of the reference edge in poly2's frame.
        const normal1 = b2Math_1.b2Rot.MulTRV(xf2.q, b2Math_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2Math_1.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        // Find the incident edge on poly2.
        let index = 0;
        let minDot = b2Settings_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_1.b2Vec2.DotVV(normal1, normals2[i]);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        // Build the clip vertices for the incident edge.
        const i1 = index;
        const i2 = (i1 + 1) % count2;
        const c0 = c[0];
        b2Math_1.b2Transform.MulXV(xf2, vertices2[i1], c0.v);
        const cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = 1 /* e_face */;
        cf0.typeB = 0 /* e_vertex */;
        const c1 = c[1];
        b2Math_1.b2Transform.MulXV(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = 1 /* e_face */;
        cf1.typeB = 0 /* e_vertex */;
    }
    function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
        manifold.pointCount = 0;
        const totalRadius = polyA.m_radius + polyB.m_radius;
        const edgeA = b2CollidePolygons_s_edgeA;
        edgeA[0] = 0;
        const separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
        if (separationA > totalRadius)
            return;
        const edgeB = b2CollidePolygons_s_edgeB;
        edgeB[0] = 0;
        const separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
        if (separationB > totalRadius)
            return;
        let poly1; // reference polygon
        let poly2; // incident polygon
        let xf1, xf2;
        let edge1 = 0; // reference edge
        let flip = 0;
        const k_relativeTol = 0.98;
        const k_absoluteTol = 0.001;
        if (separationB > k_relativeTol * separationA + k_absoluteTol) {
            poly1 = polyB;
            poly2 = polyA;
            xf1 = xfB;
            xf2 = xfA;
            edge1 = edgeB[0];
            manifold.type = 2 /* e_faceB */;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = 1 /* e_faceA */;
            flip = 0;
        }
        const incidentEdge = b2CollidePolygons_s_incidentEdge;
        b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
        const count1 = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const iv1 = edge1;
        const iv2 = (edge1 + 1) % count1;
        const local_v11 = vertices1[iv1];
        const local_v12 = vertices1[iv2];
        const localTangent = b2Math_1.b2Vec2.SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        const localNormal = b2Math_1.b2Vec2.CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
        const planePoint = b2Math_1.b2Vec2.MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
        const tangent = b2Math_1.b2Rot.MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        const normal = b2Math_1.b2Vec2.CrossVOne(tangent, b2CollidePolygons_s_normal);
        const v11 = b2Math_1.b2Transform.MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
        const v12 = b2Math_1.b2Transform.MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
        // Face offset.
        const frontOffset = b2Math_1.b2Vec2.DotVV(normal, v11);
        // Side offsets, extended by polytope skin thickness.
        const sideOffset1 = -b2Math_1.b2Vec2.DotVV(tangent, v11) + totalRadius;
        const sideOffset2 = b2Math_1.b2Vec2.DotVV(tangent, v12) + totalRadius;
        // Clip incident edge against extruded edge1 side edges.
        const clipPoints1 = b2CollidePolygons_s_clipPoints1;
        const clipPoints2 = b2CollidePolygons_s_clipPoints2;
        let np;
        // Clip to box side 1
        const ntangent = b2Math_1.b2Vec2.NegV(tangent, b2CollidePolygons_s_ntangent);
        np = b2Collision_1.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2)
            return;
        // Clip to negative box side 1
        np = b2Collision_1.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        let pointCount = 0;
        for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
            const cv = clipPoints2[i];
            const separation = b2Math_1.b2Vec2.DotVV(normal, cv.v) - frontOffset;
            if (separation <= totalRadius) {
                const cp = manifold.points[pointCount];
                b2Math_1.b2Transform.MulTXV(xf2, cv.v, cp.localPoint);
                cp.id.Copy(cv.id);
                if (flip) {
                    // Swap features
                    const cf = cp.id.cf;
                    cp.id.cf.indexA = cf.indexB;
                    cp.id.cf.indexB = cf.indexA;
                    cp.id.cf.typeA = cf.typeB;
                    cp.id.cf.typeB = cf.typeA;
                }
                ++pointCount;
            }
        }
        manifold.pointCount = pointCount;
    }
    exports_1("b2CollidePolygons", b2CollidePolygons);
    var b2Settings_1, b2Math_1, b2Collision_1, b2EdgeSeparation_s_normal1World, b2EdgeSeparation_s_normal1, b2EdgeSeparation_s_v1, b2EdgeSeparation_s_v2, b2FindMaxSeparation_s_d, b2FindMaxSeparation_s_dLocal1, b2FindIncidentEdge_s_normal1, b2CollidePolygons_s_incidentEdge, b2CollidePolygons_s_clipPoints1, b2CollidePolygons_s_clipPoints2, b2CollidePolygons_s_edgeA, b2CollidePolygons_s_edgeB, b2CollidePolygons_s_localTangent, b2CollidePolygons_s_localNormal, b2CollidePolygons_s_planePoint, b2CollidePolygons_s_normal, b2CollidePolygons_s_tangent, b2CollidePolygons_s_ntangent, b2CollidePolygons_s_v11, b2CollidePolygons_s_v12;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            }
        ],
        execute: function () {
            b2EdgeSeparation_s_normal1World = new b2Math_1.b2Vec2();
            b2EdgeSeparation_s_normal1 = new b2Math_1.b2Vec2();
            b2EdgeSeparation_s_v1 = new b2Math_1.b2Vec2();
            b2EdgeSeparation_s_v2 = new b2Math_1.b2Vec2();
            b2FindMaxSeparation_s_d = new b2Math_1.b2Vec2();
            b2FindMaxSeparation_s_dLocal1 = new b2Math_1.b2Vec2();
            b2FindIncidentEdge_s_normal1 = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_incidentEdge = b2Collision_1.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints1 = b2Collision_1.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints2 = b2Collision_1.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_edgeA = [0];
            b2CollidePolygons_s_edgeB = [0];
            b2CollidePolygons_s_localTangent = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_localNormal = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_planePoint = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_normal = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_tangent = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_ntangent = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_v11 = new b2Math_1.b2Vec2();
            b2CollidePolygons_s_v12 = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlUG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29sbGlkZVBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBVUEsMEJBQTBCLEtBQXFCLEVBQUUsR0FBZ0IsRUFBRSxLQUFhLEVBQUUsS0FBcUIsRUFBRSxHQUFnQjtRQUN2SCx3Q0FBd0M7UUFDeEMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBYSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUU3QywwQ0FBMEM7UUFFMUMsd0RBQXdEO1FBQ3hELE1BQU0sWUFBWSxHQUFXLGNBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUNsRyxNQUFNLE9BQU8sR0FBVyxjQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFdEYsNENBQTRDO1FBQzVDLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztRQUN0QixJQUFJLE1BQU0sR0FBVyx3QkFBVyxDQUFDO1FBRWpDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxHQUFHLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFO2dCQUNoQixNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNiLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtTQUNGO1FBRUQs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