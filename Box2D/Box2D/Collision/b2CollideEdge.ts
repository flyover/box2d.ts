import { ENABLE_ASSERTS, b2Assert } from "../Common/b2Settings";
import { b2_epsilon, b2_epsilon_sq, b2_maxFloat, b2_maxManifoldPoints } from "../Common/b2Settings";
import { b2_polygonRadius, b2_maxPolygonVertices, b2_angularSlop } from "../Common/b2Settings";
import { b2MakeNumberArray } from "../Common/b2Settings";
import { b2Vec2, b2Transform } from "../Common/b2Math";
import { b2Min, b2Max, b2Abs } from "../Common/b2Math";
import { b2NegV, b2DotVV, b2AddVV, b2SubVV, b2MidVV, b2ExtVV } from "../Common/b2Math";
import { b2CrossVV, b2CrossVOne } from "../Common/b2Math";
import { b2AddVMulSV, b2SubVMulSV } from "../Common/b2Math";
import { b2MulRV, b2MulTRV } from "../Common/b2Math";
import { b2MulXV, b2MulTXV } from "../Common/b2Math";
import { b2MulXX, b2MulTXX } from "../Common/b2Math";
import { b2ContactFeatureType, b2ContactFeature, b2ContactID } from "./b2Collision";
import { b2ManifoldType, b2ManifoldPoint, b2ClipVertex, b2ClipSegmentToLine } from "./b2Collision";

const b2CollideEdgeAndCircle_s_Q: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_e: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_d: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_e1: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_e2: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_P: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_n: b2Vec2 = new b2Vec2();
const b2CollideEdgeAndCircle_s_id: b2ContactID = new b2ContactID();
export function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle in frame of edge
  const Q: b2Vec2 = b2MulTXV(xfA, b2MulXV(xfB, circleB.m_p, b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);

  const A: b2Vec2 = edgeA.m_vertex1;
  const B: b2Vec2 = edgeA.m_vertex2;
  const e: b2Vec2 = b2SubVV(B, A, b2CollideEdgeAndCircle_s_e);

  // Barycentric coordinates
  const u: number = b2DotVV(e, b2SubVV(B, Q, b2Vec2.s_t0));
  const v: number = b2DotVV(e, b2SubVV(Q, A, b2Vec2.s_t0));

  const radius: number = edgeA.m_radius + circleB.m_radius;

  // const cf: b2ContactFeature = new b2ContactFeature();
  const id: b2ContactID = b2CollideEdgeAndCircle_s_id;
  id.cf.indexB = 0;
  id.cf.typeB = b2ContactFeatureType.e_vertex;

  // Region A
  if (v <= 0) {
    const P: b2Vec2 = A;
    const d: b2Vec2 = b2SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
    const dd: number = b2DotVV(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to A?
    if (edgeA.m_hasVertex0) {
      const A1: b2Vec2 = edgeA.m_vertex0;
      const B1: b2Vec2 = A;
      const e1: b2Vec2 = b2SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
      const u1: number = b2DotVV(e1, b2SubVV(B1, Q, b2Vec2.s_t0));

      // Is the circle in Region AB of the previous edge?
      if (u1 > 0) {
        return;
      }
    }

    id.cf.indexA = 0;
    id.cf.typeA = b2ContactFeatureType.e_vertex;
    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_circles;
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
    const P: b2Vec2 = B;
    const d: b2Vec2 = b2SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
    const dd: number = b2DotVV(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to B?
    if (edgeA.m_hasVertex3) {
      const B2: b2Vec2 = edgeA.m_vertex3;
      const A2: b2Vec2 = B;
      const e2: b2Vec2 = b2SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
      const v2: number = b2DotVV(e2, b2SubVV(Q, A2, b2Vec2.s_t0));

      // Is the circle in Region AB of the next edge?
      if (v2 > 0) {
        return;
      }
    }

    id.cf.indexA = 1;
    id.cf.typeA = b2ContactFeatureType.e_vertex;
    manifold.pointCount = 1;
    manifold.type = b2ManifoldType.e_circles;
    manifold.localNormal.SetZero();
    manifold.localPoint.Copy(P);
    manifold.points[0].id.Copy(id);
    // manifold.points[0].id.key = 0;
    // manifold.points[0].id.cf = cf;
    manifold.points[0].localPoint.Copy(circleB.m_p);
    return;
  }

  // Region AB
  const den: number = b2DotVV(e, e);
  if (ENABLE_ASSERTS) { b2Assert(den > 0); }
  const P: b2Vec2 = b2CollideEdgeAndCircle_s_P;
  P.x = (1 / den) * (u * A.x + v * B.x);
  P.y = (1 / den) * (u * A.y + v * B.y);
  const d: b2Vec2 = b2SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
  const dd: number = b2DotVV(d, d);
  if (dd > radius * radius) {
    return;
  }

  const n: b2Vec2 = b2CollideEdgeAndCircle_s_n.SetXY(-e.y, e.x);
  if (b2DotVV(n, b2SubVV(Q, A, b2Vec2.s_t0)) < 0) {
    n.SetXY(-n.x, -n.y);
  }
  n.Normalize();

  id.cf.indexA = 0;
  id.cf.typeA = b2ContactFeatureType.e_face;
  manifold.pointCount = 1;
  manifold.type = b2ManifoldType.e_faceA;
  manifold.localNormal.Copy(n);
  manifold.localPoint.Copy(A);
  manifold.points[0].id.Copy(id);
  // manifold.points[0].id.key = 0;
  // manifold.points[0].id.cf = cf;
  manifold.points[0].localPoint.Copy(circleB.m_p);
}

const enum b2EPAxisType {
  e_unknown = 0,
  e_edgeA = 1,
  e_edgeB = 2
}

class b2EPAxis {
  public type = b2EPAxisType.e_unknown;
  public index: number = 0;
  public separation: number = 0;
}

class b2TempPolygon {
  public vertices = b2Vec2.MakeArray(b2_maxPolygonVertices);
  public normals = b2Vec2.MakeArray(b2_maxPolygonVertices);
  public count: number = 0;
}

class b2ReferenceFace {
  public i1: number = 0;
  public i2: number = 0;
  public v1: b2Vec2 = new b2Vec2();
  public v2: b2Vec2 = new b2Vec2();
  public normal: b2Vec2 = new b2Vec2();
  public sideNormal1: b2Vec2 = new b2Vec2();
  public sideOffset1: number = 0;
  public sideNormal2: b2Vec2 = new b2Vec2();
  public sideOffset2: number = 0;
}

const enum b2EPColliderVertexType {
  e_isolated = 0,
  e_concave = 1,
  e_convex = 2
}

class b2EPCollider {
  public m_polygonB: b2TempPolygon = new b2TempPolygon();
  public m_xf: b2Transform = new b2Transform();
  public m_centroidB: b2Vec2 = new b2Vec2();
  public m_v0: b2Vec2 = new b2Vec2();
  public m_v1: b2Vec2 = new b2Vec2();
  public m_v2: b2Vec2 = new b2Vec2();
  public m_v3: b2Vec2 = new b2Vec2();
  public m_normal0: b2Vec2 = new b2Vec2();
  public m_normal1: b2Vec2 = new b2Vec2();
  public m_normal2: b2Vec2 = new b2Vec2();
  public m_normal: b2Vec2 = new b2Vec2();
  public m_type1 = b2EPColliderVertexType.e_isolated;
  public m_type2 = b2EPColliderVertexType.e_isolated;
  public m_lowerLimit: b2Vec2 = new b2Vec2();
  public m_upperLimit: b2Vec2 = new b2Vec2();
  public m_radius: number = 0;
  public m_front = false;

  private static s_edge1 = new b2Vec2();
  private static s_edge0 = new b2Vec2();
  private static s_edge2 = new b2Vec2();
  private static s_ie = b2ClipVertex.MakeArray(2);
  private static s_rf = new b2ReferenceFace();
  private static s_clipPoints1 = b2ClipVertex.MakeArray(2);
  private static s_clipPoints2 = b2ClipVertex.MakeArray(2);
  private static s_edgeAxis = new b2EPAxis();
  private static s_polygonAxis = new b2EPAxis();
  public Collide(manifold, edgeA, xfA, polygonB, xfB) {
    b2MulTXX(xfA, xfB, this.m_xf);

    b2MulXV(this.m_xf, polygonB.m_centroid, this.m_centroidB);

    this.m_v0.Copy(edgeA.m_vertex0);
    this.m_v1.Copy(edgeA.m_vertex1);
    this.m_v2.Copy(edgeA.m_vertex2);
    this.m_v3.Copy(edgeA.m_vertex3);

    const hasVertex0: boolean = edgeA.m_hasVertex0;
    const hasVertex3: boolean = edgeA.m_hasVertex3;

    const edge1: b2Vec2 = b2SubVV(this.m_v2, this.m_v1, b2EPCollider.s_edge1);
    edge1.Normalize();
    this.m_normal1.SetXY(edge1.y, -edge1.x);
    const offset1: number = b2DotVV(this.m_normal1, b2SubVV(this.m_centroidB, this.m_v1, b2Vec2.s_t0));
    let offset0: number = 0;
    let offset2: number = 0;
    let convex1: boolean = false;
    let convex2: boolean = false;

    // Is there a preceding edge?
    if (hasVertex0) {
      const edge0: b2Vec2 = b2SubVV(this.m_v1, this.m_v0, b2EPCollider.s_edge0);
      edge0.Normalize();
      this.m_normal0.SetXY(edge0.y, -edge0.x);
      convex1 = b2CrossVV(edge0, edge1) >= 0;
      offset0 = b2DotVV(this.m_normal0, b2SubVV(this.m_centroidB, this.m_v0, b2Vec2.s_t0));
    }

    // Is there a following edge?
    if (hasVertex3) {
      const edge2: b2Vec2 = b2SubVV(this.m_v3, this.m_v2, b2EPCollider.s_edge2);
      edge2.Normalize();
      this.m_normal2.SetXY(edge2.y, -edge2.x);
      convex2 = b2CrossVV(edge1, edge2) > 0;
      offset2 = b2DotVV(this.m_normal2, b2SubVV(this.m_centroidB, this.m_v2, b2Vec2.s_t0));
    }

    // Determine front or back collision. Determine collision normal limits.
    if (hasVertex0 && hasVertex3) {
      if (convex1 && convex2) {
        this.m_front = offset0 >= 0 || offset1 >= 0 || offset2 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal0);
          this.m_upperLimit.Copy(this.m_normal2);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
        }
      } else if (convex1) {
        this.m_front = offset0 >= 0 || (offset1 >= 0 && offset2 >= 0);
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal0);
          this.m_upperLimit.Copy(this.m_normal1);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
        }
      } else if (convex2) {
        this.m_front = offset2 >= 0 || (offset0 >= 0 && offset1 >= 0);
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal1);
          this.m_upperLimit.Copy(this.m_normal2);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
        }
      } else {
        this.m_front = offset0 >= 0 && offset1 >= 0 && offset2 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal1);
          this.m_upperLimit.Copy(this.m_normal1);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
        }
      }
    } else if (hasVertex0) {
      if (convex1) {
        this.m_front = offset0 >= 0 || offset1 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal0);
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal1);
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
        }
      } else {
        this.m_front = offset0 >= 0 && offset1 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal1);
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal1);
          this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
        }
      }
    } else if (hasVertex3) {
      if (convex2) {
        this.m_front = offset1 >= 0 || offset2 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal2);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal1);
        }
      } else {
        this.m_front = offset1 >= 0 && offset2 >= 0;
        if (this.m_front) {
          this.m_normal.Copy(this.m_normal1);
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal1);
        } else {
          this.m_normal.Copy(this.m_normal1).SelfNeg();
          this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
          this.m_upperLimit.Copy(this.m_normal1);
        }
      }
    } else {
      this.m_front = offset1 >= 0;
      if (this.m_front) {
        this.m_normal.Copy(this.m_normal1);
        this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
        this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
      } else {
        this.m_normal.Copy(this.m_normal1).SelfNeg();
        this.m_lowerLimit.Copy(this.m_normal1);
        this.m_upperLimit.Copy(this.m_normal1);
      }
    }

    // Get polygonB in frameA
    this.m_polygonB.count = polygonB.m_count;
    for (let i: number = 0, ict: number = polygonB.m_count; i < ict; ++i) {
      b2MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
      b2MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
    }

    this.m_radius = 2 * b2_polygonRadius;

    manifold.pointCount = 0;

    const edgeAxis: b2EPAxis = this.ComputeEdgeSeparation(b2EPCollider.s_edgeAxis);

    // If no valid normal can be found than this edge should not collide.
    if (edgeAxis.type === b2EPAxisType.e_unknown) {
      return;
    }

    if (edgeAxis.separation > this.m_radius) {
      return;
    }

    const polygonAxis: b2EPAxis = this.ComputePolygonSeparation(b2EPCollider.s_polygonAxis);
    if (polygonAxis.type !== b2EPAxisType.e_unknown && polygonAxis.separation > this.m_radius) {
      return;
    }

    // Use hysteresis for jitter reduction.
    const k_relativeTol: number = 0.98;
    const k_absoluteTol: number = 0.001;

    let primaryAxis: b2EPAxis;
    if (polygonAxis.type === b2EPAxisType.e_unknown) {
      primaryAxis = edgeAxis;
    } else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
      primaryAxis = polygonAxis;
    } else {
      primaryAxis = edgeAxis;
    }

    const ie: b2ClipVertex[] = b2EPCollider.s_ie;
    const rf: b2ReferenceFace = b2EPCollider.s_rf;
    if (primaryAxis.type === b2EPAxisType.e_edgeA) {
      manifold.type = b2ManifoldType.e_faceA;

      // Search for the polygon normal that is most anti-parallel to the edge normal.
      let bestIndex: number = 0;
      let bestValue: number = b2DotVV(this.m_normal, this.m_polygonB.normals[0]);
      for (let i: number = 1, ict: number = this.m_polygonB.count; i < ict; ++i) {
        const value: number = b2DotVV(this.m_normal, this.m_polygonB.normals[i]);
        if (value < bestValue) {
          bestValue = value;
          bestIndex = i;
        }
      }

      const i1: number = bestIndex;
      const i2: number = (i1 + 1) % this.m_polygonB.count;

      const ie0 = ie[0];
      ie0.v.Copy(this.m_polygonB.vertices[i1]);
      ie0.id.cf.indexA = 0;
      ie0.id.cf.indexB = i1;
      ie0.id.cf.typeA = b2ContactFeatureType.e_face;
      ie0.id.cf.typeB = b2ContactFeatureType.e_vertex;

      const ie1 = ie[1];
      ie1.v.Copy(this.m_polygonB.vertices[i2]);
      ie1.id.cf.indexA = 0;
      ie1.id.cf.indexB = i2;
      ie1.id.cf.typeA = b2ContactFeatureType.e_face;
      ie1.id.cf.typeB = b2ContactFeatureType.e_vertex;

      if (this.m_front) {
        rf.i1 = 0;
        rf.i2 = 1;
        rf.v1.Copy(this.m_v1);
        rf.v2.Copy(this.m_v2);
        rf.normal.Copy(this.m_normal1);
      } else {
        rf.i1 = 1;
        rf.i2 = 0;
        rf.v1.Copy(this.m_v2);
        rf.v2.Copy(this.m_v1);
        rf.normal.Copy(this.m_normal1).SelfNeg();
      }
    } else {
      manifold.type = b2ManifoldType.e_faceB;

      const ie0 = ie[0];
      ie0.v.Copy(this.m_v1);
      ie0.id.cf.indexA = 0;
      ie0.id.cf.indexB = primaryAxis.index;
      ie0.id.cf.typeA = b2ContactFeatureType.e_vertex;
      ie0.id.cf.typeB = b2ContactFeatureType.e_face;

      const ie1 = ie[1];
      ie1.v.Copy(this.m_v2);
      ie1.id.cf.indexA = 0;
      ie1.id.cf.indexB = primaryAxis.index;
      ie1.id.cf.typeA = b2ContactFeatureType.e_vertex;
      ie1.id.cf.typeB = b2ContactFeatureType.e_face;

      rf.i1 = primaryAxis.index;
      rf.i2 = (rf.i1 + 1) % this.m_polygonB.count;
      rf.v1.Copy(this.m_polygonB.vertices[rf.i1]);
      rf.v2.Copy(this.m_polygonB.vertices[rf.i2]);
      rf.normal.Copy(this.m_polygonB.normals[rf.i1]);
    }

    rf.sideNormal1.SetXY(rf.normal.y, -rf.normal.x);
    rf.sideNormal2.Copy(rf.sideNormal1).SelfNeg();
    rf.sideOffset1 = b2DotVV(rf.sideNormal1, rf.v1);
    rf.sideOffset2 = b2DotVV(rf.sideNormal2, rf.v2);

    // Clip incident edge against extruded edge1 side edges.
    const clipPoints1: b2ClipVertex[] = b2EPCollider.s_clipPoints1;
    const clipPoints2: b2ClipVertex[] = b2EPCollider.s_clipPoints2;
    let np: number = 0;

    // Clip to box side 1
    np = b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);

    if (np < b2_maxManifoldPoints) {
      return;
    }

    // Clip to negative box side 1
    np = b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);

    if (np < b2_maxManifoldPoints) {
      return;
    }

    // Now clipPoints2 contains the clipped points.
    if (primaryAxis.type === b2EPAxisType.e_edgeA) {
      manifold.localNormal.Copy(rf.normal);
      manifold.localPoint.Copy(rf.v1);
    } else {
      manifold.localNormal.Copy(polygonB.m_normals[rf.i1]);
      manifold.localPoint.Copy(polygonB.m_vertices[rf.i1]);
    }

    let pointCount: number = 0;
    for (let i: number = 0, ict: number = b2_maxManifoldPoints; i < ict; ++i) {
      let separation: number;

      separation = b2DotVV(rf.normal, b2SubVV(clipPoints2[i].v, rf.v1, b2Vec2.s_t0));

      if (separation <= this.m_radius) {
        const cp: b2ManifoldPoint = manifold.points[pointCount];

        if (primaryAxis.type === b2EPAxisType.e_edgeA) {
          b2MulTXV(this.m_xf, clipPoints2[i].v, cp.localPoint);
          cp.id = clipPoints2[i].id;
        } else {
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

  public ComputeEdgeSeparation(out) {
    const axis: b2EPAxis = out;
    axis.type = b2EPAxisType.e_edgeA;
    axis.index = this.m_front ? 0 : 1;
    axis.separation = b2_maxFloat;

    for (let i: number = 0, ict = this.m_polygonB.count; i < ict; ++i) {
      const s: number = b2DotVV(this.m_normal, b2SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Vec2.s_t0));
      if (s < axis.separation) {
        axis.separation = s;
      }
    }

    return axis;
  }

  private static s_n = new b2Vec2();
  private static s_perp = new b2Vec2();
  public ComputePolygonSeparation(out) {
    const axis: b2EPAxis = out;
    axis.type = b2EPAxisType.e_unknown;
    axis.index = -1;
    axis.separation = -b2_maxFloat;

    const perp: b2Vec2 = b2EPCollider.s_perp.SetXY(-this.m_normal.y, this.m_normal.x);

    for (let i: number = 0, ict = this.m_polygonB.count; i < ict; ++i) {
      const n: b2Vec2 = b2NegV(this.m_polygonB.normals[i], b2EPCollider.s_n);

      const s1: number = b2DotVV(n, b2SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Vec2.s_t0));
      const s2: number = b2DotVV(n, b2SubVV(this.m_polygonB.vertices[i], this.m_v2, b2Vec2.s_t0));
      const s: number = b2Min(s1, s2);

      if (s > this.m_radius) {
        // No collision
        axis.type = b2EPAxisType.e_edgeB;
        axis.index = i;
        axis.separation = s;
        return axis;
      }

      // Adjacency
      if (b2DotVV(n, perp) >= 0) {
        if (b2DotVV(b2SubVV(n, this.m_upperLimit, b2Vec2.s_t0), this.m_normal) < -b2_angularSlop) {
          continue;
        }
      } else {
        if (b2DotVV(b2SubVV(n, this.m_lowerLimit, b2Vec2.s_t0), this.m_normal) < -b2_angularSlop) {
          continue;
        }
      }

      if (s > axis.separation) {
        axis.type = b2EPAxisType.e_edgeB;
        axis.index = i;
        axis.separation = s;
      }
    }

    return axis;
  }
}

const b2CollideEdgeAndPolygon_s_collider: b2EPCollider = new b2EPCollider();
export function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
  const collider: b2EPCollider = b2CollideEdgeAndPolygon_s_collider;
  collider.Collide(manifold, edgeA, xfA, polygonB, xfB);
}
