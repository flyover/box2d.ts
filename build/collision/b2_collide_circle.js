System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_collision_js_1, b2CollideCircles_s_pA, b2CollideCircles_s_pB, b2CollidePolygonAndCircle_s_c, b2CollidePolygonAndCircle_s_cLocal, b2CollidePolygonAndCircle_s_faceCenter;
    var __moduleName = context_1 && context_1.id;
    function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const pA = b2_math_js_1.b2Transform.MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
        const pB = b2_math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);
        const distSqr = b2_math_js_1.b2Vec2.DistanceSquaredVV(pA, pB);
        const radius = circleA.m_radius + circleB.m_radius;
        if (distSqr > radius * radius) {
            return;
        }
        manifold.type = b2_collision_js_1.b2ManifoldType.e_circles;
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
        const c = b2_math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
        const cLocal = b2_math_js_1.b2Transform.MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
        // Find the min separating edge.
        let normalIndex = 0;
        let separation = (-b2_settings_js_1.b2_maxFloat);
        const radius = polygonA.m_radius + circleB.m_radius;
        const vertexCount = polygonA.m_count;
        const vertices = polygonA.m_vertices;
        const normals = polygonA.m_normals;
        for (let i = 0; i < vertexCount; ++i) {
            const s = b2_math_js_1.b2Vec2.DotVV(normals[i], b2_math_js_1.b2Vec2.SubVV(cLocal, vertices[i], b2_math_js_1.b2Vec2.s_t0));
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
        if (separation < b2_settings_js_1.b2_epsilon) {
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[normalIndex]);
            b2_math_js_1.b2Vec2.MidVV(v1, v2, manifold.localPoint);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
            return;
        }
        // Compute barycentric coordinates
        const u1 = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, v1, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(v2, v1, b2_math_js_1.b2Vec2.s_t1));
        const u2 = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, v2, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(v1, v2, b2_math_js_1.b2Vec2.s_t1));
        if (u1 <= 0) {
            if (b2_math_js_1.b2Vec2.DistanceSquaredVV(cLocal, v1) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
            b2_math_js_1.b2Vec2.SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v1);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else if (u2 <= 0) {
            if (b2_math_js_1.b2Vec2.DistanceSquaredVV(cLocal, v2) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
            b2_math_js_1.b2Vec2.SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v2);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else {
            const faceCenter = b2_math_js_1.b2Vec2.MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
            const separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, faceCenter, b2_math_js_1.b2Vec2.s_t1), normals[vertIndex1]);
            if (separation > radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
            manifold.localPoint.Copy(faceCenter);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
    }
    exports_1("b2CollidePolygonAndCircle", b2CollidePolygonAndCircle);
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
            }
        ],
        execute: function () {
            b2CollideCircles_s_pA = new b2_math_js_1.b2Vec2();
            b2CollideCircles_s_pB = new b2_math_js_1.b2Vec2();
            b2CollidePolygonAndCircle_s_c = new b2_math_js_1.b2Vec2();
            b2CollidePolygonAndCircle_s_cLocal = new b2_math_js_1.b2Vec2();
            b2CollidePolygonAndCircle_s_faceCenter = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29sbGlkZV9jaXJjbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29sbGlzaW9uL2IyX2NvbGxpZGVfY2lyY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxTQUFnQixnQkFBZ0IsQ0FBQyxRQUFvQixFQUFFLE9BQXNCLEVBQUUsR0FBZ0IsRUFBRSxPQUFzQixFQUFFLEdBQWdCO1FBQ3ZJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLE1BQU0sRUFBRSxHQUFXLHdCQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDOUUsTUFBTSxFQUFFLEdBQVcsd0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUU5RSxNQUFNLE9BQU8sR0FBVyxtQkFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxNQUFNLE1BQU0sR0FBVyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDM0QsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRTtZQUM3QixPQUFPO1NBQ1I7UUFFRCxRQUFRLENBQUMsSUFBSSxHQUFHLGdDQUFjLENBQUMsU0FBUyxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsUUFBUSxDQUFD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