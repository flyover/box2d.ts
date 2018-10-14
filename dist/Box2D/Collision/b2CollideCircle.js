System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2CollideCircles_s_pA, b2CollideCircles_s_pB, b2CollidePolygonAndCircle_s_c, b2CollidePolygonAndCircle_s_cLocal, b2CollidePolygonAndCircle_s_faceCenter;
    var __moduleName = context_1 && context_1.id;
    function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const pA = b2Math_1.b2Transform.MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
        const pB = b2Math_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);
        const distSqr = b2Math_1.b2Vec2.DistanceSquaredVV(pA, pB);
        const radius = circleA.m_radius + circleB.m_radius;
        if (distSqr > radius * radius) {
            return;
        }
        manifold.type = b2Collision_1.b2ManifoldType.e_circles;
        manifold.localPoint.Copy(circleA.m_p);
        manifold.localNormal.SetZero();
        manifold.pointCount = 1;
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
    exports_1("b2CollideCircles", b2CollideCircles);
    function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle position in the frame of the polygon.
        const c = b2Math_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
        const cLocal = b2Math_1.b2Transform.MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
        // Find the min separating edge.
        let normalIndex = 0;
        let separation = (-b2Settings_1.b2_maxFloat);
        const radius = polygonA.m_radius + circleB.m_radius;
        const vertexCount = polygonA.m_count;
        const vertices = polygonA.m_vertices;
        const normals = polygonA.m_normals;
        for (let i = 0; i < vertexCount; ++i) {
            const s = b2Math_1.b2Vec2.DotVV(normals[i], b2Math_1.b2Vec2.SubVV(cLocal, vertices[i], b2Math_1.b2Vec2.s_t0));
            if (s > radius) {
                // Early out.
                return;
            }
            if (s > separation) {
                separation = s;
                normalIndex = i;
            }
        }
        // Vertices that subtend the incident face.
        const vertIndex1 = normalIndex;
        const vertIndex2 = (vertIndex1 + 1) % vertexCount;
        const v1 = vertices[vertIndex1];
        const v2 = vertices[vertIndex2];
        // If the center is inside the polygon ...
        if (separation < b2Settings_1.b2_epsilon) {
            manifold.pointCount = 1;
            manifold.type = b2Collision_1.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[normalIndex]);
            b2Math_1.b2Vec2.MidVV(v1, v2, manifold.localPoint);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
            return;
        }
        // Compute barycentric coordinates
        const u1 = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cLocal, v1, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(v2, v1, b2Math_1.b2Vec2.s_t1));
        const u2 = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cLocal, v2, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(v1, v2, b2Math_1.b2Vec2.s_t1));
        if (u1 <= 0) {
            if (b2Math_1.b2Vec2.DistanceSquaredVV(cLocal, v1) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2Collision_1.b2ManifoldType.e_faceA;
            b2Math_1.b2Vec2.SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v1);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else if (u2 <= 0) {
            if (b2Math_1.b2Vec2.DistanceSquaredVV(cLocal, v2) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2Collision_1.b2ManifoldType.e_faceA;
            b2Math_1.b2Vec2.SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v2);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else {
            const faceCenter = b2Math_1.b2Vec2.MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
            const separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cLocal, faceCenter, b2Math_1.b2Vec2.s_t1), normals[vertIndex1]);
            if (separation > radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2Collision_1.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
            manifold.localPoint.Copy(faceCenter);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
    }
    exports_1("b2CollidePolygonAndCircle", b2CollidePolygonAndCircle);
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
            b2CollideCircles_s_pA = new b2Math_1.b2Vec2();
            b2CollideCircles_s_pB = new b2Math_1.b2Vec2();
            b2CollidePolygonAndCircle_s_c = new b2Math_1.b2Vec2();
            b2CollidePolygonAndCircle_s_cLocal = new b2Math_1.b2Vec2();
            b2CollidePolygonAndCircle_s_faceCenter = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlQ2lyY2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvQ29sbGlzaW9uL2IyQ29sbGlkZUNpcmNsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBZ0IsZ0JBQWdCLENBQUMsUUFBb0IsRUFBRSxPQUFzQixFQUFFLEdBQWdCLEVBQUUsT0FBc0IsRUFBRSxHQUFnQjtRQUN2SSxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsR0FBVyxvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sRUFBRSxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFFOUUsTUFBTSxPQUFPLEdBQVcsZUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxNQUFNLE1BQU0sR0FBVyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDM0QsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRTtZQUM3QixPQUFPO1NBQ1I7UUFFRCxRQUFRLENBQUMsSUFBSSxHQUFHLDRCQUFjLENBQUMsU0FBUyxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsUUFBUSxDQUFD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