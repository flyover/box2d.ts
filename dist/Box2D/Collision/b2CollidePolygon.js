System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2EdgeSeparation_s_normal1World, b2EdgeSeparation_s_normal1, b2EdgeSeparation_s_v1, b2EdgeSeparation_s_v2, b2FindMaxSeparation_s_d, b2FindMaxSeparation_s_dLocal1, b2FindIncidentEdge_s_normal1, b2CollidePolygons_s_incidentEdge, b2CollidePolygons_s_clipPoints1, b2CollidePolygons_s_clipPoints2, b2CollidePolygons_s_edgeA, b2CollidePolygons_s_edgeB, b2CollidePolygons_s_localTangent, b2CollidePolygons_s_localNormal, b2CollidePolygons_s_planePoint, b2CollidePolygons_s_normal, b2CollidePolygons_s_tangent, b2CollidePolygons_s_ntangent, b2CollidePolygons_s_v11, b2CollidePolygons_s_v12;
    var __moduleName = context_1 && context_1.id;
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        // DEBUG: const count1: number = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
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
        cf0.typeA = b2Collision_1.b2ContactFeatureType.e_face;
        cf0.typeB = b2Collision_1.b2ContactFeatureType.e_vertex;
        const c1 = c[1];
        b2Math_1.b2Transform.MulXV(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = b2Collision_1.b2ContactFeatureType.e_face;
        cf1.typeB = b2Collision_1.b2ContactFeatureType.e_vertex;
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
            manifold.type = b2Collision_2.b2ManifoldType.e_faceB;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = b2Collision_2.b2ManifoldType.e_faceA;
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
        np = b2Collision_2.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2) {
            return;
        }
        // Clip to negative box side 1
        np = b2Collision_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
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
                b2Collision_2 = b2Collision_1_1;
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
            b2CollidePolygons_s_incidentEdge = b2Collision_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints1 = b2Collision_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints2 = b2Collision_2.b2ClipVertex.MakeArray(2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlUG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9iMkNvbGxpZGVQb2x5Z29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFXQSxTQUFTLGdCQUFnQixDQUFDLEtBQXFCLEVBQUUsR0FBZ0IsRUFBRSxLQUFhLEVBQUUsS0FBcUIsRUFBRSxHQUFnQjtRQUN2SCwrQ0FBK0M7UUFDL0MsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBYSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUU3QyxpREFBaUQ7UUFFakQsd0RBQXdEO1FBQ3hELE1BQU0sWUFBWSxHQUFXLGNBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUNsRyxNQUFNLE9BQU8sR0FBVyxjQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFdEYsNENBQTRDO1FBQzVDLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztRQUN0QixJQUFJLE1BQU0sR0FBVyx3QkFBVyxDQUFDO1FBRWpDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxHQUFHLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFO2dCQUNoQixNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNiLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtTQUNGO1FBRUQsTUFBTSxFQUFFLEdBQVcsb0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sRUFBRSxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUNuRixNQUFNLFVBQVUsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDekYsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUlELFNBQVMsbUJBQW1CLENBQUMsU0FBbUIsRUFBRSxLQUFxQixFQUFFLEdBQWdCLEVBQUUsS0FBcUIsRUFBRSxHQUFnQjtRQUNoSSxNQUFNLE1BQU0sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFhLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFM0MsdUVBQXVFO1FBQ3ZFLE1BQU0sQ0FBQyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsb0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RLLE1BQU0sT0FBTyxHQUFXLGNBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztRQUU5RSxvRUFBb0U7UUFDcEUsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQyx3QkFBVyxDQUFDLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN2QyxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RCxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUU7Z0JBQ2hCLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNWO1NBQ0Y7UUFFRCwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLEdBQVcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9ELHFEQUFxRDtRQUNyRCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVqRSxpREFBaUQ7UUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVqRSwrQ0FBK0M7UUFDL0MsSUFBSSxRQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQztRQUMvQixJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUU7WUFDOUIsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2YsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUNwQixjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO2FBQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDZCxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLGNBQWMsR0FBRyxLQUFLLENBQUM7U0FDeEI7YUFBTTtZQUNMLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDcEIsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUVELG1EQUFtRDtRQUNuRCxPQUFPLElBQUksRUFBRTtZQUNYLElBQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNwQixJQUFJLEdBQUcsQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2FBQ2hDO1lBRUQsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsR0FBRyxjQUFjLEVBQUU7Z0JBQ3RCLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLGNBQWMsR0FBRyxDQUFDLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsTUFBTTthQUNQO1NBQ0Y7UUFFRCxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ3hCLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFHRCxTQUFTLGtCQUFrQixDQUFDLENBQWlCLEVBQUUsS0FBcUIsRUFBRSxHQUFnQixFQUFFLEtBQWEsRUFBRSxLQUFxQixFQUFFLEdBQWdCO1FBQzVJLCtDQUErQztRQUMvQyxNQUFNLFFBQVEsR0FBYSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBYSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTNDLGlEQUFpRDtRQUVqRCx5REFBeUQ7UUFDekQsTUFBTSxPQUFPLEdBQVcsY0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLGNBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFFNUgsbUNBQW1DO1FBQ25DLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztRQUN0QixJQUFJLE1BQU0sR0FBVyx3QkFBVyxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxHQUFHLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFO2dCQUNoQixNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNiLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtTQUNGO1FBRUQsaURBQWlEO1FBQ2pELE1BQU0sRUFBRSxHQUFXLEtBQUssQ0FBQztRQUN6QixNQUFNLEVBQUUsR0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFFckMsTUFBTSxFQUFFLEdBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLEdBQUcsR0FBcUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLEtBQUssR0FBRyxrQ0FBb0IsQ0FBQyxNQUFNLENBQUM7UUFDeEMsR0FBRyxDQUFDLEtBQUssR0FBRyxrQ0FBb0IsQ0FBQyxRQUFRLENBQUM7UUFFMUMsTUFBTSxFQUFFLEdBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLEdBQUcsR0FBcUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLEtBQUssR0FBRyxrQ0FBb0IsQ0FBQyxNQUFNLENBQUM7UUFDeEMsR0FBRyxDQUFDLEtBQUssR0FBRyxrQ0FBb0IsQ0FBQyxRQUFRLENBQUM7SUFDNUMsQ0FBQztJQWVELFNBQWdCLGlCQUFpQixDQUFDLFFBQW9CLEVBQUUsS0FBcUIsRUFBRSxHQUFnQixFQUFFLEtBQXFCLEVBQUUsR0FBZ0I7UUFDdEksUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDeEIsTUFBTSxXQUFXLEdBQVcsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRTVELE1BQU0sS0FBSyxHQUFhLHlCQUF5QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRSxNQUFNLFdBQVcsR0FBVyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0UsSUFBSSxXQUFXLEdBQUcsV0FBVyxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELE1BQU0sS0FBSyxHQUFhLHlCQUF5QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRSxNQUFNLFdBQVcsR0FBVyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0UsSUFBSSxXQUFXLEdBQUcsV0FBVyxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksS0FBcUIsQ0FBQyxDQUFDLG9CQUFvQjtRQUMvQyxJQUFJLEtBQXFCLENBQUMsQ0FBQyxtQkFBbUI7UUFDOUMsSUFBSSxHQUFnQixFQUFFLEdBQWdCLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBQ3hDLElBQUksSUFBSSxHQUFXLENBQUMsQ0FBQztRQUNyQixNQUFNLGFBQWEsR0FBVyxJQUFJLENBQUM7UUFDbkMsTUFBTSxhQUFhLEdBQVcsS0FBSyxDQUFDO1FBRXBDLElBQUksV0FBVyxHQUFHLGFBQWEsR0FBRyxXQUFXLEdBQUcsYUFBYSxFQUFFO1lBQzdELEtBQUssR0FBRyxLQUFLLENBQUM7WUFDZCxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2QsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNWLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDVixLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsNEJBQWMsQ0FBQyxPQUFPLENBQUM7WUFDdkMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNWO2FBQU07WUFDTCxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2QsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNkLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDVixHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ1YsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixRQUFRLENBQUMsSUFBSSxHQUFHLDRCQUFjLENBQUMsT0FBTyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDVjtRQUVELE1BQU0sWUFBWSxHQUFtQixnQ0FBZ0MsQ0FBQztRQUN0RSxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUU3QyxNQUFNLEdBQUcsR0FBVyxLQUFLLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBRXpDLE1BQU0sU0FBUyxHQUFXLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxNQUFNLFNBQVMsR0FBVyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFekMsTUFBTSxZQUFZLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFDbEcsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXpCLE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFDNUYsTUFBTSxVQUFVLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLDhCQUE4QixDQUFDLENBQUM7UUFFOUYsTUFBTSxPQUFPLEdBQVcsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sTUFBTSxHQUFXLGVBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFN0UsTUFBTSxHQUFHLEdBQVcsb0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sR0FBRyxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUUvRSxlQUFlO1FBQ2YsTUFBTSxXQUFXLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFdEQscURBQXFEO1FBQ3JELE1BQU0sV0FBVyxHQUFXLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3RFLE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUVyRSx3REFBd0Q7UUFDeEQsTUFBTSxXQUFXLEdBQW1CLCtCQUErQixDQUFDO1FBQ3BFLE1BQU0sV0FBVyxHQUFtQiwrQkFBK0IsQ0FBQztRQUNwRSxJQUFJLEVBQVUsQ0FBQztRQUVmLHFCQUFxQjtRQUNyQixNQUFNLFFBQVEsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBQzVFLEVBQUUsR0FBRyxpQ0FBbUIsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFaEYsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsT0FBTztTQUNSO1FBRUQsOEJBQThCO1FBQzlCLEVBQUUsR0FBRyxpQ0FBbUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFOUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsT0FBTztTQUNSO1FBRUQsK0NBQStDO1FBQy9DLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXJDLElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztRQUMzQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsaUNBQW9CLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckQsTUFBTSxFQUFFLEdBQWlCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLFVBQVUsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBRXBFLElBQUksVUFBVSxJQUFJLFdBQVcsRUFBRTtnQkFDN0IsTUFBTSxFQUFFLEdBQW9CLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3hELG9CQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLElBQUksRUFBRTtvQkFDUixnQkFBZ0I7b0JBQ2hCLE1BQU0sRUFBRSxHQUFxQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDdEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7b0JBQzVCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUM1QixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDMUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQzNCO2dCQUNELEVBQUUsVUFBVSxDQUFDO2FBQ2Q7U0FDRjtRQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ25DLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7WUE3UkssK0JBQStCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUN2RCwwQkFBMEIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ2xELHFCQUFxQixHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7WUFDN0MscUJBQXFCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQWlDN0MsdUJBQXVCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMvQyw2QkFBNkIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBc0VyRCw0QkFBNEIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBOENwRCxnQ0FBZ0MsR0FBRywwQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCwrQkFBK0IsR0FBRywwQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCwrQkFBK0IsR0FBRywwQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCx5QkFBeUIsR0FBRyxDQUFFLENBQUMsQ0FBRSxDQUFDO1lBQ2xDLHlCQUF5QixHQUFHLENBQUUsQ0FBQyxDQUFFLENBQUM7WUFDbEMsZ0NBQWdDLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUN4RCwrQkFBK0IsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ3ZELDhCQUE4QixHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7WUFDdEQsMEJBQTBCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUNsRCwyQkFBMkIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ25ELDRCQUE0QixHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7WUFDcEQsdUJBQXVCLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMvQyx1QkFBdUIsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDIn0=