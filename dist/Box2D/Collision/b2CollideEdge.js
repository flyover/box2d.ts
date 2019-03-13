System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2CollideEdgeAndCircle_s_Q, b2CollideEdgeAndCircle_s_e, b2CollideEdgeAndCircle_s_d, b2CollideEdgeAndCircle_s_e1, b2CollideEdgeAndCircle_s_e2, b2CollideEdgeAndCircle_s_P, b2CollideEdgeAndCircle_s_n, b2CollideEdgeAndCircle_s_id, b2EPAxisType, b2EPAxis, b2TempPolygon, b2ReferenceFace, b2EPColliderVertexType, b2EPCollider, b2CollideEdgeAndPolygon_s_collider;
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
            (function (b2EPAxisType) {
                b2EPAxisType[b2EPAxisType["e_unknown"] = 0] = "e_unknown";
                b2EPAxisType[b2EPAxisType["e_edgeA"] = 1] = "e_edgeA";
                b2EPAxisType[b2EPAxisType["e_edgeB"] = 2] = "e_edgeB";
            })(b2EPAxisType || (b2EPAxisType = {}));
            b2EPAxis = class b2EPAxis {
                constructor() {
                    this.type = b2EPAxisType.e_unknown;
                    this.index = 0;
                    this.separation = 0;
                }
            };
            b2TempPolygon = class b2TempPolygon {
                constructor() {
                    this.vertices = [];
                    this.normals = [];
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
            (function (b2EPColliderVertexType) {
                b2EPColliderVertexType[b2EPColliderVertexType["e_isolated"] = 0] = "e_isolated";
                b2EPColliderVertexType[b2EPColliderVertexType["e_concave"] = 1] = "e_concave";
                b2EPColliderVertexType[b2EPColliderVertexType["e_convex"] = 2] = "e_convex";
            })(b2EPColliderVertexType || (b2EPColliderVertexType = {}));
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
                    this.m_type1 = b2EPColliderVertexType.e_isolated;
                    this.m_type2 = b2EPColliderVertexType.e_isolated;
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
                        if (this.m_polygonB.vertices.length <= i) {
                            this.m_polygonB.vertices.push(new b2Math_1.b2Vec2());
                        }
                        if (this.m_polygonB.normals.length <= i) {
                            this.m_polygonB.normals.push(new b2Math_1.b2Vec2());
                        }
                        b2Math_1.b2Transform.MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
                        b2Math_1.b2Rot.MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
                    }
                    this.m_radius = polygonB.m_radius + edgeA.m_radius;
                    manifold.pointCount = 0;
                    const edgeAxis = this.ComputeEdgeSeparation(b2EPCollider.s_edgeAxis);
                    // If no valid normal can be found than this edge should not collide.
                    if (edgeAxis.type === b2EPAxisType.e_unknown) {
                        return;
                    }
                    if (edgeAxis.separation > this.m_radius) {
                        return;
                    }
                    const polygonAxis = this.ComputePolygonSeparation(b2EPCollider.s_polygonAxis);
                    if (polygonAxis.type !== b2EPAxisType.e_unknown && polygonAxis.separation > this.m_radius) {
                        return;
                    }
                    // Use hysteresis for jitter reduction.
                    const k_relativeTol = 0.98;
                    const k_absoluteTol = 0.001;
                    let primaryAxis;
                    if (polygonAxis.type === b2EPAxisType.e_unknown) {
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
                    if (primaryAxis.type === b2EPAxisType.e_edgeA) {
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
                    if (primaryAxis.type === b2EPAxisType.e_edgeA) {
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
                            if (primaryAxis.type === b2EPAxisType.e_edgeA) {
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
                    axis.type = b2EPAxisType.e_edgeA;
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
                    axis.type = b2EPAxisType.e_unknown;
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
                            axis.type = b2EPAxisType.e_edgeB;
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
                            axis.type = b2EPAxisType.e_edgeB;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlRWRnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9iMkNvbGxpZGVFZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFpQkEsU0FBZ0Isc0JBQXNCLENBQUMsUUFBb0IsRUFBRSxLQUFrQixFQUFFLEdBQWdCLEVBQUUsT0FBc0IsRUFBRSxHQUFnQjtRQUN6SSxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUV4QixrQ0FBa0M7UUFDbEMsTUFBTSxDQUFDLEdBQVcsb0JBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRXhILE1BQU0sQ0FBQyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUVqRSwwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVuRSxNQUFNLE1BQU0sR0FBVyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFFekQsdURBQXVEO1FBQ3ZE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R0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzt3QkFFcEQsTUFBTSxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDckIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzt3QkFDdEIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLGtDQUFvQixDQUFDLE1BQU0sQ0FBQzt3QkFDOUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLGtDQUFvQixDQUFDLFFBQVEsQ0FBQzt3QkFFaEQsTUFBTSxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDckIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzt3QkFDdEIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLGtDQUFvQixDQUFDLE1BQU0sQ0FBQzt3QkFDOUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLGtDQUFvQixDQUFDLFFBQVEsQ0FBQzt3QkFFaEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOzRCQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDVixFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDVixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3RCLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUNoQzs2QkFBTTs0QkFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDVixFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDVixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3RCLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3lCQUMxQztxQkFDRjt5QkFBTTt3QkFDTCxRQUFRLENBQUMsSUFBSSxHQUFHLDRCQUFjLENBQUMsT0FBTyxDQUFDO3dCQUV2QyxNQUFNLEdBQUcsR0FBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsUUFBUSxDQUFDO3dCQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsTUFBTSxDQUFDO3dCQUU5QyxNQUFNLEdBQUcsR0FBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsUUFBUSxDQUFDO3dCQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0NBQW9CLENBQUMsTUFBTSxDQUFDO3dCQUU5QyxFQUFFLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7d0JBQzFCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO3dCQUM1QyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNoRDtvQkFFRCxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFB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