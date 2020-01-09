System.register(["../Common/b2Settings.js", "../Common/b2Math.js", "./b2Collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Collision_js_1, b2Collision_js_2, b2EdgeSeparation_s_normal1World, b2EdgeSeparation_s_normal1, b2EdgeSeparation_s_v1, b2EdgeSeparation_s_v2, b2FindMaxSeparation_s_d, b2FindMaxSeparation_s_dLocal1, b2FindIncidentEdge_s_normal1, b2CollidePolygons_s_incidentEdge, b2CollidePolygons_s_clipPoints1, b2CollidePolygons_s_clipPoints2, b2CollidePolygons_s_edgeA, b2CollidePolygons_s_edgeB, b2CollidePolygons_s_localTangent, b2CollidePolygons_s_localNormal, b2CollidePolygons_s_planePoint, b2CollidePolygons_s_normal, b2CollidePolygons_s_tangent, b2CollidePolygons_s_ntangent, b2CollidePolygons_s_v11, b2CollidePolygons_s_v12;
    var __moduleName = context_1 && context_1.id;
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        // DEBUG: const count1: number = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
        // Convert normal from poly1's frame into poly2's frame.
        const normal1World = b2Math_js_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
        const normal1 = b2Math_js_1.b2Rot.MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
        // Find support vertex on poly2 for -normal.
        let index = 0;
        let minDot = b2Settings_js_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_js_1.b2Vec2.DotVV(vertices2[i], normal1);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        const v1 = b2Math_js_1.b2Transform.MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
        const v2 = b2Math_js_1.b2Transform.MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
        const separation = b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(v2, v1, b2Math_js_1.b2Vec2.s_t0), normal1World);
        return separation;
    }
    function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        const count1 = poly1.m_count;
        const normals1 = poly1.m_normals;
        // Vector pointing from the centroid of poly1 to the centroid of poly2.
        const d = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Transform.MulXV(xf2, poly2.m_centroid, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Transform.MulXV(xf1, poly1.m_centroid, b2Math_js_1.b2Vec2.s_t1), b2FindMaxSeparation_s_d);
        const dLocal1 = b2Math_js_1.b2Rot.MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
        // Find edge normal on poly1 that has the largest projection onto d.
        let edge = 0;
        let maxDot = (-b2Settings_js_1.b2_maxFloat);
        for (let i = 0; i < count1; ++i) {
            const dot = b2Math_js_1.b2Vec2.DotVV(normals1[i], dLocal1);
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
            if (increment === -1) {
                edge = (bestEdge + count1 - 1) % count1;
            }
            else {
                edge = (bestEdge + 1) % count1;
            }
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
        // DEBUG: const count1: number = poly1.m_count;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        const normals2 = poly2.m_normals;
        // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
        // Get the normal of the reference edge in poly2's frame.
        const normal1 = b2Math_js_1.b2Rot.MulTRV(xf2.q, b2Math_js_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2Math_js_1.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        // Find the incident edge on poly2.
        let index = 0;
        let minDot = b2Settings_js_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_js_1.b2Vec2.DotVV(normal1, normals2[i]);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        // Build the clip vertices for the incident edge.
        const i1 = index;
        const i2 = (i1 + 1) % count2;
        const c0 = c[0];
        b2Math_js_1.b2Transform.MulXV(xf2, vertices2[i1], c0.v);
        const cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = b2Collision_js_1.b2ContactFeatureType.e_face;
        cf0.typeB = b2Collision_js_1.b2ContactFeatureType.e_vertex;
        const c1 = c[1];
        b2Math_js_1.b2Transform.MulXV(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = b2Collision_js_1.b2ContactFeatureType.e_face;
        cf1.typeB = b2Collision_js_1.b2ContactFeatureType.e_vertex;
    }
    function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
        manifold.pointCount = 0;
        const totalRadius = polyA.m_radius + polyB.m_radius;
        const edgeA = b2CollidePolygons_s_edgeA;
        edgeA[0] = 0;
        const separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
        if (separationA > totalRadius) {
            return;
        }
        const edgeB = b2CollidePolygons_s_edgeB;
        edgeB[0] = 0;
        const separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
        if (separationB > totalRadius) {
            return;
        }
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
            manifold.type = b2Collision_js_2.b2ManifoldType.e_faceB;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = b2Collision_js_2.b2ManifoldType.e_faceA;
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
        const localTangent = b2Math_js_1.b2Vec2.SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        const localNormal = b2Math_js_1.b2Vec2.CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
        const planePoint = b2Math_js_1.b2Vec2.MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
        const tangent = b2Math_js_1.b2Rot.MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        const normal = b2Math_js_1.b2Vec2.CrossVOne(tangent, b2CollidePolygons_s_normal);
        const v11 = b2Math_js_1.b2Transform.MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
        const v12 = b2Math_js_1.b2Transform.MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
        // Face offset.
        const frontOffset = b2Math_js_1.b2Vec2.DotVV(normal, v11);
        // Side offsets, extended by polytope skin thickness.
        const sideOffset1 = -b2Math_js_1.b2Vec2.DotVV(tangent, v11) + totalRadius;
        const sideOffset2 = b2Math_js_1.b2Vec2.DotVV(tangent, v12) + totalRadius;
        // Clip incident edge against extruded edge1 side edges.
        const clipPoints1 = b2CollidePolygons_s_clipPoints1;
        const clipPoints2 = b2CollidePolygons_s_clipPoints2;
        let np;
        // Clip to box side 1
        const ntangent = b2Math_js_1.b2Vec2.NegV(tangent, b2CollidePolygons_s_ntangent);
        np = b2Collision_js_2.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2) {
            return;
        }
        // Clip to negative box side 1
        np = b2Collision_js_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        let pointCount = 0;
        for (let i = 0; i < b2Settings_js_1.b2_maxManifoldPoints; ++i) {
            const cv = clipPoints2[i];
            const separation = b2Math_js_1.b2Vec2.DotVV(normal, cv.v) - frontOffset;
            if (separation <= totalRadius) {
                const cp = manifold.points[pointCount];
                b2Math_js_1.b2Transform.MulTXV(xf2, cv.v, cp.localPoint);
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
    return {
        setters: [
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Collision_js_1_1) {
                b2Collision_js_1 = b2Collision_js_1_1;
                b2Collision_js_2 = b2Collision_js_1_1;
            }
        ],
        execute: function () {
            b2EdgeSeparation_s_normal1World = new b2Math_js_1.b2Vec2();
            b2EdgeSeparation_s_normal1 = new b2Math_js_1.b2Vec2();
            b2EdgeSeparation_s_v1 = new b2Math_js_1.b2Vec2();
            b2EdgeSeparation_s_v2 = new b2Math_js_1.b2Vec2();
            b2FindMaxSeparation_s_d = new b2Math_js_1.b2Vec2();
            b2FindMaxSeparation_s_dLocal1 = new b2Math_js_1.b2Vec2();
            b2FindIncidentEdge_s_normal1 = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_incidentEdge = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints1 = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints2 = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_edgeA = [0];
            b2CollidePolygons_s_edgeB = [0];
            b2CollidePolygons_s_localTangent = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_localNormal = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_planePoint = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_normal = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_tangent = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_ntangent = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_v11 = new b2Math_js_1.b2Vec2();
            b2CollidePolygons_s_v12 = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlUG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29sbGlkZVBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVdBLFNBQVMsZ0JBQWdCLENBQUMsS0FBcUIsRUFBRSxHQUFnQixFQUFFLEtBQWEsRUFBRSxLQUFxQixFQUFFLEdBQWdCO1FBQ3ZILCtDQUErQztRQUMvQyxNQUFNLFNBQVMsR0FBYSxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFhLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFM0MsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNyQyxNQUFNLFNBQVMsR0FBYSxLQUFLLENBQUMsVUFBVSxDQUFDO1FBRTdDLGlEQUFpRDtRQUVqRCx3REFBd0Q7UUFDeEQsTUFBTSxZQUFZLEdBQVcsaUJBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUNsRyxNQUFNLE9BQU8sR0FBVyxpQkFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRXRGLDRDQUE0QztRQUM1QyxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7UUFDdEIsSUFBSSxNQUFNLEdBQVcsMkJBQVcsQ0FBQztRQUVqQyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sR0FBRyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4RCxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUU7Z0JBQ2hCLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2IsS0FBSyxHQUFHLENBQUMsQ0FBQzth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