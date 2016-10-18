import * as b2Settings from "../Common/b2Settings";
import * as b2Math from "../Common/b2Math";
import { b2ContactFeatureType, b2ContactFeature, b2ContactID } from "./b2Collision";
import { b2ManifoldType, b2ManifoldPoint, b2ClipVertex, b2ClipSegmentToLine } from "./b2Collision";

const b2CollideCircles_s_pA: b2Math.b2Vec2 = new b2Math.b2Vec2();
const b2CollideCircles_s_pB: b2Math.b2Vec2 = new b2Math.b2Vec2();
export function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  const pA: b2Math.b2Vec2 = b2Math.b2MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
  const pB: b2Math.b2Vec2 = b2Math.b2MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);

  const distSqr = b2Math.b2DistanceSquaredVV(pA, pB);
  const radius = circleA.m_radius + circleB.m_radius;
  if (distSqr > radius * radius) {
    return;
  }

  manifold.type = b2ManifoldType.e_circles;
  manifold.localPoint.Copy(circleA.m_p);
  manifold.localNormal.SetZero();
  manifold.pointCount = 1;

  manifold.points[0].localPoint.Copy(circleB.m_p);
  manifold.points[0].id.key = 0;
}

const b2CollidePolygonAndCircle_s_c: b2Math.b2Vec2 = new b2Math.b2Vec2();
const b2CollidePolygonAndCircle_s_cLocal: b2Math.b2Vec2 = new b2Math.b2Vec2();
const b2CollidePolygonAndCircle_s_faceCenter: b2Math.b2Vec2 = new b2Math.b2Vec2();
export function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle position in the frame of the polygon.
  const c: b2Math.b2Vec2 = b2Math.b2MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
  const cLocal: b2Math.b2Vec2 = b2Math.b2MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);

  // Find the min separating edge.
  let normalIndex: number = 0;
  let separation = (-b2Settings.b2_maxFloat);
  const radius = polygonA.m_radius + circleB.m_radius;
  const vertexCount = polygonA.m_count;
  const vertices = polygonA.m_vertices;
  const normals = polygonA.m_normals;

  for (let i: number = 0; i < vertexCount; ++i) {
    const s: number = b2Math.b2DotVV(normals[i], b2Math.b2SubVV(cLocal, vertices[i], b2Math.b2Vec2.s_t0));

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
  if (separation < b2Settings.b2_epsilon) {
    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_faceA;
    manifold.localNormal.Copy(normals[normalIndex]);
    b2Math.b2MidVV(v1, v2, manifold.localPoint);
    manifold.points[0].localPoint.Copy(circleB.m_p);
    manifold.points[0].id.key = 0;
    return;
  }

  // Compute barycentric coordinates
  const u1: number = b2Math.b2DotVV(b2Math.b2SubVV(cLocal, v1, b2Math.b2Vec2.s_t0), b2Math.b2SubVV(v2, v1, b2Math.b2Vec2.s_t1));
  const u2: number = b2Math.b2DotVV(b2Math.b2SubVV(cLocal, v2, b2Math.b2Vec2.s_t0), b2Math.b2SubVV(v1, v2, b2Math.b2Vec2.s_t1));
  if (u1 <= 0) {
    if (b2Math.b2DistanceSquaredVV(cLocal, v1) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_faceA;
    b2Math.b2SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
    manifold.localPoint.Copy(v1);
    manifold.points[0].localPoint.Copy(circleB.m_p);
    manifold.points[0].id.key = 0;
  } else if (u2 <= 0) {
    if (b2Math.b2DistanceSquaredVV(cLocal, v2) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_faceA;
    b2Math.b2SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
    manifold.localPoint.Copy(v2);
    manifold.points[0].localPoint.Copy(circleB.m_p);
    manifold.points[0].id.key = 0;
  } else {
    const faceCenter: b2Math.b2Vec2 = b2Math.b2MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
    separation = b2Math.b2DotVV(b2Math.b2SubVV(cLocal, faceCenter, b2Math.b2Vec2.s_t1), normals[vertIndex1]);
    if (separation > radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_faceA;
    manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
    manifold.localPoint.Copy(faceCenter);
    manifold.points[0].localPoint.Copy(circleB.m_p);
    manifold.points[0].id.key = 0;
  }
}
