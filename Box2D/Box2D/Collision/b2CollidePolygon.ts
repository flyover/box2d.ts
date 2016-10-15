import { ENABLE_ASSERTS, b2Assert } from "../Common/b2Settings";
import { b2_epsilon, b2_epsilon_sq, b2_maxFloat, b2_maxManifoldPoints } from "../Common/b2Settings";
import { b2MakeNumberArray } from "../Common/b2Settings";
import { b2Vec2 } from "../Common/b2Math";
import { b2Min, b2Max, b2Abs } from "../Common/b2Math";
import { b2NegV, b2DotVV, b2AddVV, b2SubVV, b2MidVV, b2ExtVV } from "../Common/b2Math";
import { b2CrossVV, b2CrossVOne } from "../Common/b2Math";
import { b2AddVMulSV, b2SubVMulSV } from "../Common/b2Math";
import { b2MulRV, b2MulTRV } from "../Common/b2Math";
import { b2MulXV, b2MulTXV } from "../Common/b2Math";
import { b2ContactFeatureType, b2ContactFeature } from "./b2Collision";
import { b2ManifoldType, b2ClipVertex, b2ClipSegmentToLine } from "./b2Collision";

const b2EdgeSeparation_s_normal1World: b2Vec2 = new b2Vec2();
const b2EdgeSeparation_s_normal1: b2Vec2 = new b2Vec2();
const b2EdgeSeparation_s_v1: b2Vec2 = new b2Vec2();
const b2EdgeSeparation_s_v2: b2Vec2 = new b2Vec2();
function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
  const count1 = poly1.m_count;
  const vertices1 = poly1.m_vertices;
  const normals1 = poly1.m_normals;

  const count2 = poly2.m_count;
  const vertices2 = poly2.m_vertices;

  if (ENABLE_ASSERTS) { b2Assert(0 <= edge1 && edge1 < count1); }

  // Convert normal from poly1's frame into poly2's frame.
  const normal1World: b2Vec2 = b2MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
  const normal1: b2Vec2 = b2MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);

  // Find support vertex on poly2 for -normal.
  let index: number = 0;
  let minDot = b2_maxFloat;

  for (let i: number = 0; i < count2; ++i) {
    const dot: number = b2DotVV(vertices2[i], normal1);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }

  const v1: b2Vec2 = b2MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
  const v2: b2Vec2 = b2MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
  const separation: number = b2DotVV(b2SubVV(v2, v1, b2Vec2.s_t0), normal1World);
  return separation;
}

const b2FindMaxSeparation_s_d: b2Vec2 = new b2Vec2();
const b2FindMaxSeparation_s_dLocal1: b2Vec2 = new b2Vec2();
function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
  const count1 = poly1.m_count;
  const normals1 = poly1.m_normals;

  // Vector pointing from the centroid of poly1 to the centroid of poly2.
  const d: b2Vec2 = b2SubVV(b2MulXV(xf2, poly2.m_centroid, b2Vec2.s_t0), b2MulXV(xf1, poly1.m_centroid, b2Vec2.s_t1), b2FindMaxSeparation_s_d);
  const dLocal1: b2Vec2 = b2MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);

  // Find edge normal on poly1 that has the largest projection onto d.
  let edge: number = 0;
  let maxDot = (-b2_maxFloat);
  for (let i: number = 0; i < count1; ++i) {
    const dot: number = b2DotVV(normals1[i], dLocal1);
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
  let bestEdge: number = 0;
  let bestSeparation: number = 0;
  let increment: number = 0;
  if (sPrev > s && sPrev > sNext) {
    increment = -1;
    bestEdge = prevEdge;
    bestSeparation = sPrev;
  } else if (sNext > s) {
    increment = 1;
    bestEdge = nextEdge;
    bestSeparation = sNext;
  } else {
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
    } else {
      break;
    }
  }

  edgeIndex[0] = bestEdge;
  return bestSeparation;
}

const b2FindIncidentEdge_s_normal1: b2Vec2 = new b2Vec2();
function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
  const count1 = poly1.m_count;
  const normals1 = poly1.m_normals;

  const count2 = poly2.m_count;
  const vertices2 = poly2.m_vertices;
  const normals2 = poly2.m_normals;

  if (ENABLE_ASSERTS) { b2Assert(0 <= edge1 && edge1 < count1); }

  // Get the normal of the reference edge in poly2's frame.
  const normal1: b2Vec2 = b2MulTRV(xf2.q, b2MulRV(xf1.q, normals1[edge1], b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);

  // Find the incident edge on poly2.
  let index: number = 0;
  let minDot = b2_maxFloat;
  for (let i: number = 0; i < count2; ++i) {
    const dot: number = b2DotVV(normal1, normals2[i]);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }

  // Build the clip vertices for the incident edge.
  const i1 = index;
  const i2 = (i1 + 1) % count2;

  const c0 = c[0];
  b2MulXV(xf2, vertices2[i1], c0.v);
  const cf0 = c0.id.cf;
  cf0.indexA = edge1;
  cf0.indexB = i1;
  cf0.typeA = b2ContactFeatureType.e_face;
  cf0.typeB = b2ContactFeatureType.e_vertex;

  const c1 = c[1];
  b2MulXV(xf2, vertices2[i2], c1.v);
  const cf1 = c1.id.cf;
  cf1.indexA = edge1;
  cf1.indexB = i2;
  cf1.typeA = b2ContactFeatureType.e_face;
  cf1.typeB = b2ContactFeatureType.e_vertex;
}

const b2CollidePolygons_s_incidentEdge = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_clipPoints1 = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_clipPoints2 = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_edgeA = b2MakeNumberArray(1);
const b2CollidePolygons_s_edgeB = b2MakeNumberArray(1);
const b2CollidePolygons_s_localTangent: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_localNormal: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_planePoint: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_normal: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_tangent: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_ntangent: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_v11: b2Vec2 = new b2Vec2();
const b2CollidePolygons_s_v12: b2Vec2 = new b2Vec2();
export function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
  manifold.pointCount = 0;
  const totalRadius = polyA.m_radius + polyB.m_radius;

  const edgeA = b2CollidePolygons_s_edgeA; edgeA[0] = 0;
  const separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
  if (separationA > totalRadius)
    return;

  const edgeB = b2CollidePolygons_s_edgeB; edgeB[0] = 0;
  const separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
  if (separationB > totalRadius)
    return;

  let poly1; // reference polygon
  let poly2; // incident polygon
  let xf1, xf2;
  let edge1: number = 0; // reference edge
  let flip: number = 0;
  const k_relativeTol: number = 0.98;
  const k_absoluteTol: number = 0.001;

  if (separationB > k_relativeTol * separationA + k_absoluteTol) {
    poly1 = polyB;
    poly2 = polyA;
    xf1 = xfB;
    xf2 = xfA;
    edge1 = edgeB[0];
    manifold.type = b2ManifoldType.e_faceB;
    flip = 1;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    xf1 = xfA;
    xf2 = xfB;
    edge1 = edgeA[0];
    manifold.type = b2ManifoldType.e_faceA;
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

  const localTangent: b2Vec2 = b2SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
  localTangent.Normalize();

  const localNormal: b2Vec2 = b2CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
  const planePoint: b2Vec2 = b2MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);

  const tangent: b2Vec2 = b2MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
  const normal: b2Vec2 = b2CrossVOne(tangent, b2CollidePolygons_s_normal);

  const v11: b2Vec2 = b2MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
  const v12: b2Vec2 = b2MulXV(xf1, local_v12, b2CollidePolygons_s_v12);

  // Face offset.
  const frontOffset: number = b2DotVV(normal, v11);

  // Side offsets, extended by polytope skin thickness.
  const sideOffset1: number = -b2DotVV(tangent, v11) + totalRadius;
  const sideOffset2: number = b2DotVV(tangent, v12) + totalRadius;

  // Clip incident edge against extruded edge1 side edges.
  const clipPoints1 = b2CollidePolygons_s_clipPoints1;
  const clipPoints2 = b2CollidePolygons_s_clipPoints2;
  let np;

  // Clip to box side 1
  const ntangent = b2NegV(tangent, b2CollidePolygons_s_ntangent);
  np = b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);

  if (np < 2)
    return;

  // Clip to negative box side 1
  np = b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);

  if (np < 2) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  manifold.localNormal.Copy(localNormal);
  manifold.localPoint.Copy(planePoint);

  let pointCount: number = 0;
  for (let i: number = 0; i < b2_maxManifoldPoints; ++i) {
    const cv = clipPoints2[i];
    const separation: number = b2DotVV(normal, cv.v) - frontOffset;

    if (separation <= totalRadius) {
      const cp = manifold.points[pointCount];
      b2MulTXV(xf2, cv.v, cp.localPoint);
      cp.id.Copy(cv.id);
      if (flip) {
        // Swap features
        const cf: b2ContactFeature = cp.id.cf;
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
