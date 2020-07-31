System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_collision_js_1, b2_collision_js_2, b2EdgeSeparation_s_normal1World, b2EdgeSeparation_s_normal1, b2EdgeSeparation_s_v1, b2EdgeSeparation_s_v2, b2FindMaxSeparation_s_d, b2FindMaxSeparation_s_dLocal1, b2FindIncidentEdge_s_normal1, b2CollidePolygons_s_incidentEdge, b2CollidePolygons_s_clipPoints1, b2CollidePolygons_s_clipPoints2, b2CollidePolygons_s_edgeA, b2CollidePolygons_s_edgeB, b2CollidePolygons_s_localTangent, b2CollidePolygons_s_localNormal, b2CollidePolygons_s_planePoint, b2CollidePolygons_s_normal, b2CollidePolygons_s_tangent, b2CollidePolygons_s_ntangent, b2CollidePolygons_s_v11, b2CollidePolygons_s_v12;
    var __moduleName = context_1 && context_1.id;
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        // DEBUG: const count1: number = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
        // Convert normal from poly1's frame into poly2's frame.
        const normal1World = b2_math_js_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
        const normal1 = b2_math_js_1.b2Rot.MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
        // Find support vertex on poly2 for -normal.
        let index = 0;
        let minDot = b2_settings_js_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2_math_js_1.b2Vec2.DotVV(vertices2[i], normal1);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        const v1 = b2_math_js_1.b2Transform.MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
        const v2 = b2_math_js_1.b2Transform.MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
        const separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(v2, v1, b2_math_js_1.b2Vec2.s_t0), normal1World);
        return separation;
    }
    function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        const count1 = poly1.m_count;
        const normals1 = poly1.m_normals;
        // Vector pointing from the centroid of poly1 to the centroid of poly2.
        const d = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Transform.MulXV(xf2, poly2.m_centroid, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Transform.MulXV(xf1, poly1.m_centroid, b2_math_js_1.b2Vec2.s_t1), b2FindMaxSeparation_s_d);
        const dLocal1 = b2_math_js_1.b2Rot.MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
        // Find edge normal on poly1 that has the largest projection onto d.
        let edge = 0;
        let maxDot = (-b2_settings_js_1.b2_maxFloat);
        for (let i = 0; i < count1; ++i) {
            const dot = b2_math_js_1.b2Vec2.DotVV(normals1[i], dLocal1);
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
        const normal1 = b2_math_js_1.b2Rot.MulTRV(xf2.q, b2_math_js_1.b2Rot.MulRV(xf1.q, normals1[edge1], b2_math_js_1.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        // Find the incident edge on poly2.
        let index = 0;
        let minDot = b2_settings_js_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2_math_js_1.b2Vec2.DotVV(normal1, normals2[i]);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        // Build the clip vertices for the incident edge.
        const i1 = index;
        const i2 = (i1 + 1) % count2;
        const c0 = c[0];
        b2_math_js_1.b2Transform.MulXV(xf2, vertices2[i1], c0.v);
        const cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = b2_collision_js_1.b2ContactFeatureType.e_face;
        cf0.typeB = b2_collision_js_1.b2ContactFeatureType.e_vertex;
        const c1 = c[1];
        b2_math_js_1.b2Transform.MulXV(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = b2_collision_js_1.b2ContactFeatureType.e_face;
        cf1.typeB = b2_collision_js_1.b2ContactFeatureType.e_vertex;
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
            manifold.type = b2_collision_js_2.b2ManifoldType.e_faceB;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = b2_collision_js_2.b2ManifoldType.e_faceA;
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
        const localTangent = b2_math_js_1.b2Vec2.SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        const localNormal = b2_math_js_1.b2Vec2.CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
        const planePoint = b2_math_js_1.b2Vec2.MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
        const tangent = b2_math_js_1.b2Rot.MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        const normal = b2_math_js_1.b2Vec2.CrossVOne(tangent, b2CollidePolygons_s_normal);
        const v11 = b2_math_js_1.b2Transform.MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
        const v12 = b2_math_js_1.b2Transform.MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
        // Face offset.
        const frontOffset = b2_math_js_1.b2Vec2.DotVV(normal, v11);
        // Side offsets, extended by polytope skin thickness.
        const sideOffset1 = -b2_math_js_1.b2Vec2.DotVV(tangent, v11) + totalRadius;
        const sideOffset2 = b2_math_js_1.b2Vec2.DotVV(tangent, v12) + totalRadius;
        // Clip incident edge against extruded edge1 side edges.
        const clipPoints1 = b2CollidePolygons_s_clipPoints1;
        const clipPoints2 = b2CollidePolygons_s_clipPoints2;
        let np;
        // Clip to box side 1
        const ntangent = b2_math_js_1.b2Vec2.NegV(tangent, b2CollidePolygons_s_ntangent);
        np = b2_collision_js_2.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2) {
            return;
        }
        // Clip to negative box side 1
        np = b2_collision_js_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        let pointCount = 0;
        for (let i = 0; i < b2_settings_js_1.b2_maxManifoldPoints; ++i) {
            const cv = clipPoints2[i];
            const separation = b2_math_js_1.b2Vec2.DotVV(normal, cv.v) - frontOffset;
            if (separation <= totalRadius) {
                const cp = manifold.points[pointCount];
                b2_math_js_1.b2Transform.MulTXV(xf2, cv.v, cp.localPoint);
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
            b2EdgeSeparation_s_normal1World = new b2_math_js_1.b2Vec2();
            b2EdgeSeparation_s_normal1 = new b2_math_js_1.b2Vec2();
            b2EdgeSeparation_s_v1 = new b2_math_js_1.b2Vec2();
            b2EdgeSeparation_s_v2 = new b2_math_js_1.b2Vec2();
            b2FindMaxSeparation_s_d = new b2_math_js_1.b2Vec2();
            b2FindMaxSeparation_s_dLocal1 = new b2_math_js_1.b2Vec2();
            b2FindIncidentEdge_s_normal1 = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_incidentEdge = b2_collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints1 = b2_collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints2 = b2_collision_js_2.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_edgeA = [0];
            b2CollidePolygons_s_edgeB = [0];
            b2CollidePolygons_s_localTangent = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_localNormal = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_planePoint = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_normal = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_tangent = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_ntangent = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_v11 = new b2_math_js_1.b2Vec2();
            b2CollidePolygons_s_v12 = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29sbGlkZV9wb2x5Z29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfY29sbGlkZV9wb2x5Z29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFXQSxTQUFTLGdCQUFnQixDQUFDLEtBQXFCLEVBQUUsR0FBZ0IsRUFBRSxLQUFhLEVBQUUsS0FBcUIsRUFBRSxHQUFnQjtRQUN2SCwrQ0FBK0M7UUFDL0MsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBYSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUU3QyxpREFBaUQ7UUFFakQsd0RBQXdEO1FBQ3hELE1BQU0sWUFBWSxHQUFXLGtCQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFDbEcsTUFBTSxPQUFPLEdBQVcsa0JBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUV0Riw0Q0FBNEM7UUFDNUMsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksTUFBTSxHQUFXLDRCQUFXLENBQUM7UUFFakMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN2QyxNQUFNLEdBQUcsR0FBVyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFO2dCQUNoQixNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNiLEtBQUssR0FBRyxDQUFDLENB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