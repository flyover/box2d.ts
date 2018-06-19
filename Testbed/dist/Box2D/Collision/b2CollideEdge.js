System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2CollideEdgeAndCircle_s_Q, b2CollideEdgeAndCircle_s_e, b2CollideEdgeAndCircle_s_d, b2CollideEdgeAndCircle_s_e1, b2CollideEdgeAndCircle_s_e2, b2CollideEdgeAndCircle_s_P, b2CollideEdgeAndCircle_s_n, b2CollideEdgeAndCircle_s_id, b2EPAxis, b2TempPolygon, b2ReferenceFace, b2EPCollider, b2CollideEdgeAndPolygon_s_collider;
    var __moduleName = context_1 && context_1.id;
    function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle in frame of edge
        const Q = b2Math_1.b2Transform.MulTXV(xfA, b2Math_1.b2Transform.MulXV(xfB, circleB.m_p, b2Math_1.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        const A = edgeA.m_vertex1;
        const B = edgeA.m_vertex2;
        const e = b2Math_1.b2Vec2.SubVV(B, A, b2CollideEdgeAndCircle_s_e);
        // Barycentric coordinates
        const u = b2Math_1.b2Vec2.DotVV(e, b2Math_1.b2Vec2.SubVV(B, Q, b2Math_1.b2Vec2.s_t0));
        const v = b2Math_1.b2Vec2.DotVV(e, b2Math_1.b2Vec2.SubVV(Q, A, b2Math_1.b2Vec2.s_t0));
        const radius = edgeA.m_radius + circleB.m_radius;
        // const cf: b2ContactFeature = new b2ContactFeature();
        const id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = b2Collision_1.b2ContactFeatureType.e_vertex;
        // Region A
        if (v <= 0) {
            const P = A;
            const d = b2Math_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to A?
            if (edgeA.m_hasVertex0) {
                const A1 = edgeA.m_vertex0;
                const B1 = A;
                const e1 = b2Math_1.b2Vec2.SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
                const u1 = b2Math_1.b2Vec2.DotVV(e1, b2Math_1.b2Vec2.SubVV(B1, Q, b2Math_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the previous edge?
                if (u1 > 0) {
                    return;
                }
            }
            id.cf.indexA = 0;
            id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2Collision_2.b2ManifoldType.e_circles;
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
            const d = b2Math_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to B?
            if (edgeA.m_hasVertex3) {
                const B2 = edgeA.m_vertex3;
                const A2 = B;
                const e2 = b2Math_1.b2Vec2.SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
                const v2 = b2Math_1.b2Vec2.DotVV(e2, b2Math_1.b2Vec2.SubVV(Q, A2, b2Math_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the next edge?
                if (v2 > 0) {
                    return;
                }
            }
            id.cf.indexA = 1;
            id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2Collision_2.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region AB
        const den = b2Math_1.b2Vec2.DotVV(e, e);
        // DEBUG: b2Assert(den > 0);
        const P = b2CollideEdgeAndCircle_s_P;
        P.x = (1 / den) * (u * A.x + v * B.x);
        P.y = (1 / den) * (u * A.y + v * B.y);
        const d = b2Math_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
        const dd = b2Math_1.b2Vec2.DotVV(d, d);
        if (dd > radius * radius) {
            return;
        }
        const n = b2CollideEdgeAndCircle_s_n.Set(-e.y, e.x);
        if (b2Math_1.b2Vec2.DotVV(n, b2Math_1.b2Vec2.SubVV(Q, A, b2Math_1.b2Vec2.s_t0)) < 0) {
            n.Set(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_face;
        manifold.pointCount = 1;
        manifold.type = b2Collision_2.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(n);
        manifold.localPoint.Copy(A);
        manifold.points[0].id.Copy(id);
        // manifold.points[0].id.key = 0;
        // manifold.points[0].id.cf = cf;
        manifold.points[0].localPoint.Copy(circleB.m_p);
    }
    exports_1("b2CollideEdgeAndCircle", b2CollideEdgeAndCircle);
    function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
        const collider = b2CollideEdgeAndPolygon_s_collider;
        collider.Collide(manifold, edgeA, xfA, polygonB, xfB);
    }
    exports_1("b2CollideEdgeAndPolygon", b2CollideEdgeAndPolygon);
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
            b2CollideEdgeAndCircle_s_Q = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_d = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e1 = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e2 = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_P = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_n = new b2Math_1.b2Vec2();
            b2CollideEdgeAndCircle_s_id = new b2Collision_1.b2ContactID();
            b2EPAxis = class b2EPAxis {
                constructor() {
                    this.type = 0 /* e_unknown */;
                    this.index = 0;
                    this.separation = 0;
                }
            };
            b2TempPolygon = class b2TempPolygon {
                constructor() {
                    this.vertices = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxPolygonVertices);
                    this.normals = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxPolygonVertices);
                    this.count = 0;
                }
            };
            b2ReferenceFace = class b2ReferenceFace {
                constructor() {
                    this.i1 = 0;
                    this.i2 = 0;
                    this.v1 = new b2Math_1.b2Vec2();
                    this.v2 = new b2Math_1.b2Vec2();
                    this.normal = new b2Math_1.b2Vec2();
                    this.sideNormal1 = new b2Math_1.b2Vec2();
                    this.sideOffset1 = 0;
                    this.sideNormal2 = new b2Math_1.b2Vec2();
                    this.sideOffset2 = 0;
                }
            };
            b2EPCollider = class b2EPCollider {
                constructor() {
                    this.m_polygonB = new b2TempPolygon();
                    this.m_xf = new b2Math_1.b2Transform();
                    this.m_centroidB = new b2Math_1.b2Vec2();
                    this.m_v0 = new b2Math_1.b2Vec2();
                    this.m_v1 = new b2Math_1.b2Vec2();
                    this.m_v2 = new b2Math_1.b2Vec2();
                    this.m_v3 = new b2Math_1.b2Vec2();
                    this.m_normal0 = new b2Math_1.b2Vec2();
                    this.m_normal1 = new b2Math_1.b2Vec2();
                    this.m_normal2 = new b2Math_1.b2Vec2();
                    this.m_normal = new b2Math_1.b2Vec2();
                    this.m_type1 = 0 /* e_isolated */;
                    this.m_type2 = 0 /* e_isolated */;
                    this.m_lowerLimit = new b2Math_1.b2Vec2();
                    this.m_upperLimit = new b2Math_1.b2Vec2();
                    this.m_radius = 0;
                    this.m_front = false;
                }
                Collide(manifold, edgeA, xfA, polygonB, xfB) {
                    b2Math_1.b2Transform.MulTXX(xfA, xfB, this.m_xf);
                    b2Math_1.b2Transform.MulXV(this.m_xf, polygonB.m_centroid, this.m_centroidB);
                    this.m_v0.Copy(edgeA.m_vertex0);
                    this.m_v1.Copy(edgeA.m_vertex1);
                    this.m_v2.Copy(edgeA.m_vertex2);
                    this.m_v3.Copy(edgeA.m_vertex3);
                    const hasVertex0 = edgeA.m_hasVertex0;
                    const hasVertex3 = edgeA.m_hasVertex3;
                    const edge1 = b2Math_1.b2Vec2.SubVV(this.m_v2, this.m_v1, b2EPCollider.s_edge1);
                    edge1.Normalize();
                    this.m_normal1.Set(edge1.y, -edge1.x);
                    const offset1 = b2Math_1.b2Vec2.DotVV(this.m_normal1, b2Math_1.b2Vec2.SubVV(this.m_centroidB, this.m_v1, b2Math_1.b2Vec2.s_t0));
                    let offset0 = 0;
                    let offset2 = 0;
                    let convex1 = false;
                    let convex2 = false;
                    // Is there a preceding edge?
                    if (hasVertex0) {
                        const edge0 = b2Math_1.b2Vec2.SubVV(this.m_v1, this.m_v0, b2EPCollider.s_edge0);
                        edge0.Normalize();
                        this.m_normal0.Set(edge0.y, -edge0.x);
                        convex1 = b2Math_1.b2Vec2.CrossVV(edge0, edge1) >= 0;
                        offset0 = b2Math_1.b2Vec2.DotVV(this.m_normal0, b2Math_1.b2Vec2.SubVV(this.m_centroidB, this.m_v0, b2Math_1.b2Vec2.s_t0));
                    }
                    // Is there a following edge?
                    if (hasVertex3) {
                        const edge2 = b2Math_1.b2Vec2.SubVV(this.m_v3, this.m_v2, b2EPCollider.s_edge2);
                        edge2.Normalize();
                        this.m_normal2.Set(edge2.y, -edge2.x);
                        convex2 = b2Math_1.b2Vec2.CrossVV(edge1, edge2) > 0;
                        offset2 = b2Math_1.b2Vec2.DotVV(this.m_normal2, b2Math_1.b2Vec2.SubVV(this.m_centroidB, this.m_v2, b2Math_1.b2Vec2.s_t0));
                    }
                    // Determine front or back collision. Determine collision normal limits.
                    if (hasVertex0 && hasVertex3) {
                        if (convex1 && convex2) {
                            this.m_front = offset0 >= 0 || offset1 >= 0 || offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else if (convex1) {
                            this.m_front = offset0 >= 0 || (offset1 >= 0 && offset2 >= 0);
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else if (convex2) {
                            this.m_front = offset2 >= 0 || (offset0 >= 0 && offset1 >= 0);
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                        else {
                            this.m_front = offset0 >= 0 && offset1 >= 0 && offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                    }
                    else if (hasVertex0) {
                        if (convex1) {
                            this.m_front = offset0 >= 0 || offset1 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else {
                            this.m_front = offset0 >= 0 && offset1 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                    }
                    else if (hasVertex3) {
                        if (convex2) {
                            this.m_front = offset1 >= 0 || offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                        }
                        else {
                            this.m_front = offset1 >= 0 && offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                        }
                    }
                    else {
                        this.m_front = offset1 >= 0;
                        if (this.m_front) {
                            this.m_normal.Copy(this.m_normal1);
                            this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                            this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                        }
                        else {
                            this.m_normal.Copy(this.m_normal1).SelfNeg();
                            this.m_lowerLimit.Copy(this.m_normal1);
                            this.m_upperLimit.Copy(this.m_normal1);
                        }
                    }
                    // Get polygonB in frameA
                    this.m_polygonB.count = polygonB.m_count;
                    for (let i = 0; i < polygonB.m_count; ++i) {
                        b2Math_1.b2Transform.MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
                        b2Math_1.b2Rot.MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
                    }
                    this.m_radius = polygonB.m_radius + edgeA.m_radius;
                    manifold.pointCount = 0;
                    const edgeAxis = this.ComputeEdgeSeparation(b2EPCollider.s_edgeAxis);
                    // If no valid normal can be found than this edge should not collide.
                    if (edgeAxis.type === 0 /* e_unknown */) {
                        return;
                    }
                    if (edgeAxis.separation > this.m_radius) {
                        return;
                    }
                    const polygonAxis = this.ComputePolygonSeparation(b2EPCollider.s_polygonAxis);
                    if (polygonAxis.type !== 0 /* e_unknown */ && polygonAxis.separation > this.m_radius) {
                        return;
                    }
                    // Use hysteresis for jitter reduction.
                    const k_relativeTol = 0.98;
                    const k_absoluteTol = 0.001;
                    let primaryAxis;
                    if (polygonAxis.type === 0 /* e_unknown */) {
                        primaryAxis = edgeAxis;
                    }
                    else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
                        primaryAxis = polygonAxis;
                    }
                    else {
                        primaryAxis = edgeAxis;
                    }
                    const ie = b2EPCollider.s_ie;
                    const rf = b2EPCollider.s_rf;
                    if (primaryAxis.type === 1 /* e_edgeA */) {
                        manifold.type = b2Collision_2.b2ManifoldType.e_faceA;
                        // Search for the polygon normal that is most anti-parallel to the edge normal.
                        let bestIndex = 0;
                        let bestValue = b2Math_1.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[0]);
                        for (let i = 1; i < this.m_polygonB.count; ++i) {
                            const value = b2Math_1.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[i]);
                            if (value < bestValue) {
                                bestValue = value;
                                bestIndex = i;
                            }
                        }
                        const i1 = bestIndex;
                        const i2 = (i1 + 1) % this.m_polygonB.count;
                        const ie0 = ie[0];
                        ie0.v.Copy(this.m_polygonB.vertices[i1]);
                        ie0.id.cf.indexA = 0;
                        ie0.id.cf.indexB = i1;
                        ie0.id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_face;
                        ie0.id.cf.typeB = b2Collision_1.b2ContactFeatureType.e_vertex;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_polygonB.vertices[i2]);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = i2;
                        ie1.id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_face;
                        ie1.id.cf.typeB = b2Collision_1.b2ContactFeatureType.e_vertex;
                        if (this.m_front) {
                            rf.i1 = 0;
                            rf.i2 = 1;
                            rf.v1.Copy(this.m_v1);
                            rf.v2.Copy(this.m_v2);
                            rf.normal.Copy(this.m_normal1);
                        }
                        else {
                            rf.i1 = 1;
                            rf.i2 = 0;
                            rf.v1.Copy(this.m_v2);
                            rf.v2.Copy(this.m_v1);
                            rf.normal.Copy(this.m_normal1).SelfNeg();
                        }
                    }
                    else {
                        manifold.type = b2Collision_2.b2ManifoldType.e_faceB;
                        const ie0 = ie[0];
                        ie0.v.Copy(this.m_v1);
                        ie0.id.cf.indexA = 0;
                        ie0.id.cf.indexB = primaryAxis.index;
                        ie0.id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_vertex;
                        ie0.id.cf.typeB = b2Collision_1.b2ContactFeatureType.e_face;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_v2);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = primaryAxis.index;
                        ie1.id.cf.typeA = b2Collision_1.b2ContactFeatureType.e_vertex;
                        ie1.id.cf.typeB = b2Collision_1.b2ContactFeatureType.e_face;
                        rf.i1 = primaryAxis.index;
                        rf.i2 = (rf.i1 + 1) % this.m_polygonB.count;
                        rf.v1.Copy(this.m_polygonB.vertices[rf.i1]);
                        rf.v2.Copy(this.m_polygonB.vertices[rf.i2]);
                        rf.normal.Copy(this.m_polygonB.normals[rf.i1]);
                    }
                    rf.sideNormal1.Set(rf.normal.y, -rf.normal.x);
                    rf.sideNormal2.Copy(rf.sideNormal1).SelfNeg();
                    rf.sideOffset1 = b2Math_1.b2Vec2.DotVV(rf.sideNormal1, rf.v1);
                    rf.sideOffset2 = b2Math_1.b2Vec2.DotVV(rf.sideNormal2, rf.v2);
                    // Clip incident edge against extruded edge1 side edges.
                    const clipPoints1 = b2EPCollider.s_clipPoints1;
                    const clipPoints2 = b2EPCollider.s_clipPoints2;
                    let np = 0;
                    // Clip to box side 1
                    np = b2Collision_2.b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);
                    if (np < b2Settings_1.b2_maxManifoldPoints) {
                        return;
                    }
                    // Clip to negative box side 1
                    np = b2Collision_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);
                    if (np < b2Settings_1.b2_maxManifoldPoints) {
                        return;
                    }
                    // Now clipPoints2 contains the clipped points.
                    if (primaryAxis.type === 1 /* e_edgeA */) {
                        manifold.localNormal.Copy(rf.normal);
                        manifold.localPoint.Copy(rf.v1);
                    }
                    else {
                        manifold.localNormal.Copy(polygonB.m_normals[rf.i1]);
                        manifold.localPoint.Copy(polygonB.m_vertices[rf.i1]);
                    }
                    let pointCount = 0;
                    for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
                        let separation;
                        separation = b2Math_1.b2Vec2.DotVV(rf.normal, b2Math_1.b2Vec2.SubVV(clipPoints2[i].v, rf.v1, b2Math_1.b2Vec2.s_t0));
                        if (separation <= this.m_radius) {
                            const cp = manifold.points[pointCount];
                            if (primaryAxis.type === 1 /* e_edgeA */) {
                                b2Math_1.b2Transform.MulTXV(this.m_xf, clipPoints2[i].v, cp.localPoint);
                                cp.id = clipPoints2[i].id;
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
                ComputeEdgeSeparation(out) {
                    const axis = out;
                    axis.type = 1 /* e_edgeA */;
                    axis.index = this.m_front ? 0 : 1;
                    axis.separation = b2Settings_1.b2_maxFloat;
                    for (let i = 0; i < this.m_polygonB.count; ++i) {
                        const s = b2Math_1.b2Vec2.DotVV(this.m_normal, b2Math_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_1.b2Vec2.s_t0));
                        if (s < axis.separation) {
                            axis.separation = s;
                        }
                    }
                    return axis;
                }
                ComputePolygonSeparation(out) {
                    const axis = out;
                    axis.type = 0 /* e_unknown */;
                    axis.index = -1;
                    axis.separation = -b2Settings_1.b2_maxFloat;
                    const perp = b2EPCollider.s_perp.Set(-this.m_normal.y, this.m_normal.x);
                    for (let i = 0; i < this.m_polygonB.count; ++i) {
                        const n = b2Math_1.b2Vec2.NegV(this.m_polygonB.normals[i], b2EPCollider.s_n);
                        const s1 = b2Math_1.b2Vec2.DotVV(n, b2Math_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_1.b2Vec2.s_t0));
                        const s2 = b2Math_1.b2Vec2.DotVV(n, b2Math_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v2, b2Math_1.b2Vec2.s_t0));
                        const s = b2Math_1.b2Min(s1, s2);
                        if (s > this.m_radius) {
                            // No collision
                            axis.type = 2 /* e_edgeB */;
                            axis.index = i;
                            axis.separation = s;
                            return axis;
                        }
                        // Adjacency
                        if (b2Math_1.b2Vec2.DotVV(n, perp) >= 0) {
                            if (b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(n, this.m_upperLimit, b2Math_1.b2Vec2.s_t0), this.m_normal) < -b2Settings_1.b2_angularSlop) {
                                continue;
                            }
                        }
                        else {
                            if (b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(n, this.m_lowerLimit, b2Math_1.b2Vec2.s_t0), this.m_normal) < -b2Settings_1.b2_angularSlop) {
                                continue;
                            }
                        }
                        if (s > axis.separation) {
                            axis.type = 2 /* e_edgeB */;
                            axis.index = i;
                            axis.separation = s;
                        }
                    }
                    return axis;
                }
            };
            b2EPCollider.s_edge1 = new b2Math_1.b2Vec2();
            b2EPCollider.s_edge0 = new b2Math_1.b2Vec2();
            b2EPCollider.s_edge2 = new b2Math_1.b2Vec2();
            b2EPCollider.s_ie = b2Collision_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_rf = new b2ReferenceFace();
            b2EPCollider.s_clipPoints1 = b2Collision_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_clipPoints2 = b2Collision_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_edgeAxis = new b2EPAxis();
            b2EPCollider.s_polygonAxis = new b2EPAxis();
            b2EPCollider.s_n = new b2Math_1.b2Vec2();
            b2EPCollider.s_perp = new b2Math_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_collider = new b2EPCollider();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlRWRnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9iMkNvbGxpZGVFZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFpQkEsZ0NBQXVDLFFBQW9CLEVBQUUsS0FBa0IsRUFBRSxHQUFnQixFQUFFLE9BQXNCLEVBQUUsR0FBZ0I7UUFDekksUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFeEIsa0NBQWtDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFXLG9CQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUV4SCxNQUFNLENBQUMsR0FBVyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFakUsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRXpELHVEQUF1RDtRQUN2RCxNQUFNLEVB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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7eUJBQ0Y7cUJBQ0Y7eUJBQU0sSUFBSSxVQUFVLEVBQUU7d0JBQ3JCLElBQUksT0FBTyxFQUFFOzRCQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0NBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7NkJBQ2xEO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7NkJBQ2xEO3lCQUNGOzZCQUFNOzRCQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0NBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUN2QyxJQUFJLENBQUMs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QUFDO3dCQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsUUFBUSxDQUFDO3dCQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsTUFBTSxDQUFDO3dCQUU5QyxNQUFNLEdBQUcsR0FBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsUUFBUSxDQUFDO3dCQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsTUFBTSxDQUFDO3dCQUU5QyxFQUFFLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7d0JBQzFCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO3dCQUM1QyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFD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