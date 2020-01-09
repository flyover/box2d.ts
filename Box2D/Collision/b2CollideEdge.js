System.register(["../Common/b2Settings.js", "../Common/b2Math.js", "./b2Collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Collision_js_1, b2Collision_js_2, b2CollideEdgeAndCircle_s_Q, b2CollideEdgeAndCircle_s_e, b2CollideEdgeAndCircle_s_d, b2CollideEdgeAndCircle_s_e1, b2CollideEdgeAndCircle_s_e2, b2CollideEdgeAndCircle_s_P, b2CollideEdgeAndCircle_s_n, b2CollideEdgeAndCircle_s_id, b2EPAxisType, b2EPAxis, b2TempPolygon, b2ReferenceFace, b2EPColliderVertexType, b2EPCollider, b2CollideEdgeAndPolygon_s_collider;
    var __moduleName = context_1 && context_1.id;
    function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle in frame of edge
        const Q = b2Math_js_1.b2Transform.MulTXV(xfA, b2Math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2Math_js_1.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        const A = edgeA.m_vertex1;
        const B = edgeA.m_vertex2;
        const e = b2Math_js_1.b2Vec2.SubVV(B, A, b2CollideEdgeAndCircle_s_e);
        // Barycentric coordinates
        const u = b2Math_js_1.b2Vec2.DotVV(e, b2Math_js_1.b2Vec2.SubVV(B, Q, b2Math_js_1.b2Vec2.s_t0));
        const v = b2Math_js_1.b2Vec2.DotVV(e, b2Math_js_1.b2Vec2.SubVV(Q, A, b2Math_js_1.b2Vec2.s_t0));
        const radius = edgeA.m_radius + circleB.m_radius;
        // const cf: b2ContactFeature = new b2ContactFeature();
        const id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = b2Collision_js_1.b2ContactFeatureType.e_vertex;
        // Region A
        if (v <= 0) {
            const P = A;
            const d = b2Math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_js_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to A?
            if (edgeA.m_hasVertex0) {
                const A1 = edgeA.m_vertex0;
                const B1 = A;
                const e1 = b2Math_js_1.b2Vec2.SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
                const u1 = b2Math_js_1.b2Vec2.DotVV(e1, b2Math_js_1.b2Vec2.SubVV(B1, Q, b2Math_js_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the previous edge?
                if (u1 > 0) {
                    return;
                }
            }
            id.cf.indexA = 0;
            id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2Collision_js_2.b2ManifoldType.e_circles;
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
            const d = b2Math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_js_1.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to B?
            if (edgeA.m_hasVertex3) {
                const B2 = edgeA.m_vertex3;
                const A2 = B;
                const e2 = b2Math_js_1.b2Vec2.SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
                const v2 = b2Math_js_1.b2Vec2.DotVV(e2, b2Math_js_1.b2Vec2.SubVV(Q, A2, b2Math_js_1.b2Vec2.s_t0));
                // Is the circle in Region AB of the next edge?
                if (v2 > 0) {
                    return;
                }
            }
            id.cf.indexA = 1;
            id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = b2Collision_js_2.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region AB
        const den = b2Math_js_1.b2Vec2.DotVV(e, e);
        // DEBUG: b2Assert(den > 0);
        const P = b2CollideEdgeAndCircle_s_P;
        P.x = (1 / den) * (u * A.x + v * B.x);
        P.y = (1 / den) * (u * A.y + v * B.y);
        const d = b2Math_js_1.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
        const dd = b2Math_js_1.b2Vec2.DotVV(d, d);
        if (dd > radius * radius) {
            return;
        }
        const n = b2CollideEdgeAndCircle_s_n.Set(-e.y, e.x);
        if (b2Math_js_1.b2Vec2.DotVV(n, b2Math_js_1.b2Vec2.SubVV(Q, A, b2Math_js_1.b2Vec2.s_t0)) < 0) {
            n.Set(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_face;
        manifold.pointCount = 1;
        manifold.type = b2Collision_js_2.b2ManifoldType.e_faceA;
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
            b2CollideEdgeAndCircle_s_Q = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_d = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e1 = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_e2 = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_P = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_n = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndCircle_s_id = new b2Collision_js_1.b2ContactID();
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
                    this.v1 = new b2Math_js_1.b2Vec2();
                    this.v2 = new b2Math_js_1.b2Vec2();
                    this.normal = new b2Math_js_1.b2Vec2();
                    this.sideNormal1 = new b2Math_js_1.b2Vec2();
                    this.sideOffset1 = 0;
                    this.sideNormal2 = new b2Math_js_1.b2Vec2();
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
                    this.m_xf = new b2Math_js_1.b2Transform();
                    this.m_centroidB = new b2Math_js_1.b2Vec2();
                    this.m_v0 = new b2Math_js_1.b2Vec2();
                    this.m_v1 = new b2Math_js_1.b2Vec2();
                    this.m_v2 = new b2Math_js_1.b2Vec2();
                    this.m_v3 = new b2Math_js_1.b2Vec2();
                    this.m_normal0 = new b2Math_js_1.b2Vec2();
                    this.m_normal1 = new b2Math_js_1.b2Vec2();
                    this.m_normal2 = new b2Math_js_1.b2Vec2();
                    this.m_normal = new b2Math_js_1.b2Vec2();
                    this.m_type1 = b2EPColliderVertexType.e_isolated;
                    this.m_type2 = b2EPColliderVertexType.e_isolated;
                    this.m_lowerLimit = new b2Math_js_1.b2Vec2();
                    this.m_upperLimit = new b2Math_js_1.b2Vec2();
                    this.m_radius = 0;
                    this.m_front = false;
                }
                Collide(manifold, edgeA, xfA, polygonB, xfB) {
                    b2Math_js_1.b2Transform.MulTXX(xfA, xfB, this.m_xf);
                    b2Math_js_1.b2Transform.MulXV(this.m_xf, polygonB.m_centroid, this.m_centroidB);
                    this.m_v0.Copy(edgeA.m_vertex0);
                    this.m_v1.Copy(edgeA.m_vertex1);
                    this.m_v2.Copy(edgeA.m_vertex2);
                    this.m_v3.Copy(edgeA.m_vertex3);
                    const hasVertex0 = edgeA.m_hasVertex0;
                    const hasVertex3 = edgeA.m_hasVertex3;
                    const edge1 = b2Math_js_1.b2Vec2.SubVV(this.m_v2, this.m_v1, b2EPCollider.s_edge1);
                    edge1.Normalize();
                    this.m_normal1.Set(edge1.y, -edge1.x);
                    const offset1 = b2Math_js_1.b2Vec2.DotVV(this.m_normal1, b2Math_js_1.b2Vec2.SubVV(this.m_centroidB, this.m_v1, b2Math_js_1.b2Vec2.s_t0));
                    let offset0 = 0;
                    let offset2 = 0;
                    let convex1 = false;
                    let convex2 = false;
                    // Is there a preceding edge?
                    if (hasVertex0) {
                        const edge0 = b2Math_js_1.b2Vec2.SubVV(this.m_v1, this.m_v0, b2EPCollider.s_edge0);
                        edge0.Normalize();
                        this.m_normal0.Set(edge0.y, -edge0.x);
                        convex1 = b2Math_js_1.b2Vec2.CrossVV(edge0, edge1) >= 0;
                        offset0 = b2Math_js_1.b2Vec2.DotVV(this.m_normal0, b2Math_js_1.b2Vec2.SubVV(this.m_centroidB, this.m_v0, b2Math_js_1.b2Vec2.s_t0));
                    }
                    // Is there a following edge?
                    if (hasVertex3) {
                        const edge2 = b2Math_js_1.b2Vec2.SubVV(this.m_v3, this.m_v2, b2EPCollider.s_edge2);
                        edge2.Normalize();
                        this.m_normal2.Set(edge2.y, -edge2.x);
                        convex2 = b2Math_js_1.b2Vec2.CrossVV(edge1, edge2) > 0;
                        offset2 = b2Math_js_1.b2Vec2.DotVV(this.m_normal2, b2Math_js_1.b2Vec2.SubVV(this.m_centroidB, this.m_v2, b2Math_js_1.b2Vec2.s_t0));
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
                            this.m_polygonB.vertices.push(new b2Math_js_1.b2Vec2());
                        }
                        if (this.m_polygonB.normals.length <= i) {
                            this.m_polygonB.normals.push(new b2Math_js_1.b2Vec2());
                        }
                        b2Math_js_1.b2Transform.MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
                        b2Math_js_1.b2Rot.MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
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
                        manifold.type = b2Collision_js_2.b2ManifoldType.e_faceA;
                        // Search for the polygon normal that is most anti-parallel to the edge normal.
                        let bestIndex = 0;
                        let bestValue = b2Math_js_1.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[0]);
                        for (let i = 1; i < this.m_polygonB.count; ++i) {
                            const value = b2Math_js_1.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[i]);
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
                        ie0.id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_face;
                        ie0.id.cf.typeB = b2Collision_js_1.b2ContactFeatureType.e_vertex;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_polygonB.vertices[i2]);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = i2;
                        ie1.id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_face;
                        ie1.id.cf.typeB = b2Collision_js_1.b2ContactFeatureType.e_vertex;
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
                        manifold.type = b2Collision_js_2.b2ManifoldType.e_faceB;
                        const ie0 = ie[0];
                        ie0.v.Copy(this.m_v1);
                        ie0.id.cf.indexA = 0;
                        ie0.id.cf.indexB = primaryAxis.index;
                        ie0.id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_vertex;
                        ie0.id.cf.typeB = b2Collision_js_1.b2ContactFeatureType.e_face;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_v2);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = primaryAxis.index;
                        ie1.id.cf.typeA = b2Collision_js_1.b2ContactFeatureType.e_vertex;
                        ie1.id.cf.typeB = b2Collision_js_1.b2ContactFeatureType.e_face;
                        rf.i1 = primaryAxis.index;
                        rf.i2 = (rf.i1 + 1) % this.m_polygonB.count;
                        rf.v1.Copy(this.m_polygonB.vertices[rf.i1]);
                        rf.v2.Copy(this.m_polygonB.vertices[rf.i2]);
                        rf.normal.Copy(this.m_polygonB.normals[rf.i1]);
                    }
                    rf.sideNormal1.Set(rf.normal.y, -rf.normal.x);
                    rf.sideNormal2.Copy(rf.sideNormal1).SelfNeg();
                    rf.sideOffset1 = b2Math_js_1.b2Vec2.DotVV(rf.sideNormal1, rf.v1);
                    rf.sideOffset2 = b2Math_js_1.b2Vec2.DotVV(rf.sideNormal2, rf.v2);
                    // Clip incident edge against extruded edge1 side edges.
                    const clipPoints1 = b2EPCollider.s_clipPoints1;
                    const clipPoints2 = b2EPCollider.s_clipPoints2;
                    let np = 0;
                    // Clip to box side 1
                    np = b2Collision_js_2.b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);
                    if (np < b2Settings_js_1.b2_maxManifoldPoints) {
                        return;
                    }
                    // Clip to negative box side 1
                    np = b2Collision_js_2.b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);
                    if (np < b2Settings_js_1.b2_maxManifoldPoints) {
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
                    for (let i = 0; i < b2Settings_js_1.b2_maxManifoldPoints; ++i) {
                        let separation;
                        separation = b2Math_js_1.b2Vec2.DotVV(rf.normal, b2Math_js_1.b2Vec2.SubVV(clipPoints2[i].v, rf.v1, b2Math_js_1.b2Vec2.s_t0));
                        if (separation <= this.m_radius) {
                            const cp = manifold.points[pointCount];
                            if (primaryAxis.type === b2EPAxisType.e_edgeA) {
                                b2Math_js_1.b2Transform.MulTXV(this.m_xf, clipPoints2[i].v, cp.localPoint);
                                cp.id.Copy(clipPoints2[i].id);
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
                    axis.separation = b2Settings_js_1.b2_maxFloat;
                    for (let i = 0; i < this.m_polygonB.count; ++i) {
                        const s = b2Math_js_1.b2Vec2.DotVV(this.m_normal, b2Math_js_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_js_1.b2Vec2.s_t0));
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
                    axis.separation = -b2Settings_js_1.b2_maxFloat;
                    const perp = b2EPCollider.s_perp.Set(-this.m_normal.y, this.m_normal.x);
                    for (let i = 0; i < this.m_polygonB.count; ++i) {
                        const n = b2Math_js_1.b2Vec2.NegV(this.m_polygonB.normals[i], b2EPCollider.s_n);
                        const s1 = b2Math_js_1.b2Vec2.DotVV(n, b2Math_js_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_js_1.b2Vec2.s_t0));
                        const s2 = b2Math_js_1.b2Vec2.DotVV(n, b2Math_js_1.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v2, b2Math_js_1.b2Vec2.s_t0));
                        const s = b2Math_js_1.b2Min(s1, s2);
                        if (s > this.m_radius) {
                            // No collision
                            axis.type = b2EPAxisType.e_edgeB;
                            axis.index = i;
                            axis.separation = s;
                            return axis;
                        }
                        // Adjacency
                        if (b2Math_js_1.b2Vec2.DotVV(n, perp) >= 0) {
                            if (b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(n, this.m_upperLimit, b2Math_js_1.b2Vec2.s_t0), this.m_normal) < -b2Settings_js_1.b2_angularSlop) {
                                continue;
                            }
                        }
                        else {
                            if (b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(n, this.m_lowerLimit, b2Math_js_1.b2Vec2.s_t0), this.m_normal) < -b2Settings_js_1.b2_angularSlop) {
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
            b2EPCollider.s_edge1 = new b2Math_js_1.b2Vec2();
            b2EPCollider.s_edge0 = new b2Math_js_1.b2Vec2();
            b2EPCollider.s_edge2 = new b2Math_js_1.b2Vec2();
            b2EPCollider.s_ie = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_rf = new b2ReferenceFace();
            b2EPCollider.s_clipPoints1 = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_clipPoints2 = b2Collision_js_2.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_edgeAxis = new b2EPAxis();
            b2EPCollider.s_polygonAxis = new b2EPAxis();
            b2EPCollider.s_n = new b2Math_js_1.b2Vec2();
            b2EPCollider.s_perp = new b2Math_js_1.b2Vec2();
            b2CollideEdgeAndPolygon_s_collider = new b2EPCollider();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlRWRnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29sbGlkZUVkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWlCQSxTQUFnQixzQkFBc0IsQ0FBQyxRQUFvQixFQUFFLEtBQWtCLEVBQUUsR0FBZ0IsRUFBRSxPQUFzQixFQUFFLEdBQWdCO1FBQ3pJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBVyx1QkFBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsdUJBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRXhILE1BQU0sQ0FBQyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFakUsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsa0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRXpELHVEQUF1RDtRQUN2RCxNQUFNLEVBQUUsR0FBZ0IsMkJBQTJCLENBQUM7UUFDcEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLFFBQVEsQ0FBQztRQUU1QyxXQUFXO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLEdBQVcsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUNqRSxNQUFNLEVBQUUsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRTtnQkFDeEIsT0FBTzthQUNSO1lBRUQsbUNBQW1DO1lBQ25DLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtnQkFDdEIsTUFBTSxFQUFFLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDbkMsTUFBTSxFQUFFLEdBQVcsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLEVBQUUsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sRUFBRSxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFdEUsbURBQW1EO2dCQUNuRCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ1YsT0FBTztpQkFDUjthQUNGO1lBRUQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLFFBQVEsQ0FBQztZQUM1QyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLCtCQUFjLENBQUMsU0FBUyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLGlDQUFpQztZQUNqQyxpQ0FBaUM7WUFDakMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRCxPQUFPO1NBQ1I7UUFFRCxXQUFXO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLEdBQVcsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUNqRSxNQUFNLEVBQUUsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRTtnQkFDeEIsT0FBTzthQUNSO1lBRUQsbUNBQW1DO1lBQ25DLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtnQkFDdEIsTUFBTSxFQUFFLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDbkMsTUFBTSxFQUFFLEdBQVcsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLEVBQUUsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sRUFBRSxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFdEUsK0NBQStDO2dCQUMvQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ1YsT0FBTztpQkFDUjthQUNGO1lBRUQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLFFBQVEsQ0FBQztZQUM1QyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLCtCQUFjLENBQUMsU0FBUyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLGlDQUFpQztZQUNqQyxpQ0FBaUM7WUFDakMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRCxPQUFPO1NBQ1I7UUFFRCxZQUFZO1FBQ1osTUFBTSxHQUFHLEdBQVcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLDRCQUE0QjtRQUM1QixNQUFNLENBQUMsR0FBVywwQkFBMEIsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDakUsTUFBTSxFQUFFLEdBQVcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksRUFBRSxHQUFHLE1BQU0sR0FBRyxNQUFNLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsTUFBTSxDQUFDLEdBQVcsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsa0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLE1BQU0sQ0FBQztRQUMxQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLCtCQUFjLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsaUNBQWlDO1FBQ2pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7SUFrY0QsU0FBZ0IsdUJBQXVCLENBQUMsUUFBb0IsRUFBRSxLQUFrQixFQUFFLEdBQWdCLEVBQUUsUUFBd0IsRUFBRSxHQUFnQjtRQUM1SSxNQUFNLFFBQVEsR0FBaUIsa0NBQWtDLENBQUM7UUFDbEUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztZQXBrQkssMEJBQTBCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbEQsMEJBQTBCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbEQsMEJBQTBCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbEQsMkJBQTJCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbkQsMkJBQTJCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbkQsMEJBQTBCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbEQsMEJBQTBCLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUFDbEQsMkJBQTJCLEdBQWdCLElBQUksNEJBQVcsRUFBRSxDQUFDO1lBMEhuRSxXQUFLLFlBQVk7Z0JBQ2YseURBQWEsQ0FBQTtnQkFDYixxREFBVyxDQUFBO2dCQUNYLHFEQUFXLENBQUE7WUFDYixDQUFDLEVBSkksWUFBWSxLQUFaLFlBQVksUUFJaEI7WUFFRCxXQUFBLE1BQU0sUUFBUTtnQkFBZDtvQkFDUyxTQUFJLEdBQWlCLFlBQVksQ0FBQyxTQUFTLENBQUM7b0JBQzVDLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBQ2xCLGVBQVUsR0FBVyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7YUFBQSxDQUFBO1lBRUQsZ0JBQUEsTUFBTSxhQUFhO2dCQUFuQjtvQkFDUyxhQUFRLEdBQWEsRUFBRSxDQUFDO29CQUN4QixZQUFPLEdBQWEsRUFBRSxDQUFDO29CQUN2QixVQUFLLEdBQVcsQ0FBQyxDQUFDO2dCQUMzQixDQUFDO2FBQUEsQ0FBQTtZQUVELGtCQUFBLE1BQU0sZUFBZTtnQkFBckI7b0JBQ1MsT0FBRSxHQUFXLENBQUMsQ0FBQztvQkFDZixPQUFFLEdBQVcsQ0FBQyxDQUFDO29CQUNOLE9BQUUsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDMUIsT0FBRSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMxQixXQUFNLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzlCLGdCQUFXLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzVDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUNmLGdCQUFXLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzVDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2FBQUEsQ0FBQTtZQUVELFdBQUssc0JBQXNCO2dCQUN6QiwrRUFBYyxDQUFBO2dCQUNkLDZFQUFhLENBQUE7Z0JBQ2IsMkVBQVksQ0FBQTtZQUNkLENBQUMsRUFKSSxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBSTFCO1lBRUQsZUFBQSxNQUFNLFlBQVk7Z0JBQWxCO29CQUNrQixlQUFVLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7b0JBQ2hELFNBQUksR0FBZ0IsSUFBSSx1QkFBVyxFQUFFLENBQUM7b0JBQ3RDLGdCQUFXLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQ25DLFNBQUksR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDNUIsU0FBSSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUM1QixTQUFJLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzVCLFNBQUksR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDNUIsY0FBUyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUNqQyxjQUFTLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQ2pDLGNBQVMsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDakMsYUFBUSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUN6QyxZQUFPLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxDQUFDO29CQUM1QyxZQUFPLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxDQUFDO29CQUNuQyxpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUNwQyxpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUM3QyxhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNyQixZQUFPLEdBQVksS0FBSyxDQUFDO2dCQXdZbEMsQ0FBQztnQkE3WFEsT0FBTyxDQUFDLFFBQW9CLEVBQUUsS0FBa0IsRUFBRSxHQUFnQixFQUFFLFFBQXdCLEVBQUUsR0FBZ0I7b0JBQ25ILHVCQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV4Qyx1QkFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRWhDLE1BQU0sVUFBVSxHQUFZLEtBQUssQ0FBQyxZQUFZLENBQUM7b0JBQy9DLE1BQU0sVUFBVSxHQUFZLEtBQUssQ0FBQyxZQUFZLENBQUM7b0JBRS9DLE1BQU0sS0FBSyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQy9FLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxPQUFPLEdBQVcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUM3RyxJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3hCLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxPQUFPLEdBQVksS0FBSyxDQUFDO29CQUM3QixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7b0JBRTdCLDZCQUE2QjtvQkFDN0IsSUFBSSxVQUFVLEVBQUU7d0JBQ2QsTUFBTSxLQUFLLEdBQVcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDL0UsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxPQUFPLEdBQUcsa0JBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDNUMsT0FBTyxHQUFHLGtCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDaEc7b0JBRUQsNkJBQTZCO29CQUM3QixJQUFJLFVBQVUsRUFBRTt3QkFDZCxNQUFNLEtBQUssR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUMvRSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLE9BQU8sR0FBRyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQyxPQUFPLEdBQUcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUNoRztvQkFFRCx3RUFBd0U7b0JBQ3hFLElBQUksVUFBVSxJQUFJLFVBQVUsRUFBRTt3QkFDNUIsSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFOzRCQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUM1RCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0NBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7NkJBQ2xEO3lCQUNGOzZCQUFNLElBQUksT0FBTyxFQUFFOzRCQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDOUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzZCQUN4QztpQ0FBTTtnQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0NBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOzZCQUNsRDt5QkFDRjs2QkFBTSxJQUFJLE9BQU8sRUFBRTs0QkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQzlELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQ0FDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs2QkFDeEM7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0NBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7eUJBQ0Y7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQzs0QkFDNUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzZCQUN4QztpQ0FBTTtnQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0NBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOzZCQUNsRDt5QkFDRjtxQkFDRjt5QkFBTSxJQUFJLFVBQVUsRUFBRTt3QkFDckIsSUFBSSxPQUFPLEVBQUU7NEJBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUM7NEJBQzVDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQ0FDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7eUJBQ0Y7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUM7NEJBQzVDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQ0FDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDbEQ7eUJBQ0Y7cUJBQ0Y7eUJBQU0sSUFBSSxVQUFVLEVBQUU7d0JBQ3JCLElBQUksT0FBTyxFQUFFOzRCQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0NBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDO3lCQUNGOzZCQUFNOzRCQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0NBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDO3lCQUNGO3FCQUNGO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOzRCQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3lCQUNsRDs2QkFBTTs0QkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUN4QztxQkFDRjtvQkFFRCx5QkFBeUI7b0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNqRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7NEJBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQU0sRUFBRSxDQUFDLENBQUM7eUJBQUU7d0JBQzFGLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTs0QkFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBTSxFQUFFLENBQUMsQ0FBQzt5QkFBRTt3QkFDeEYsdUJBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xGLGlCQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDN0U7b0JBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7b0JBRW5ELFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUV4QixNQUFNLFFBQVEsR0FBYSxJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUUvRSxxRUFBcUU7b0JBQ3JFLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsU0FBUyxFQUFFO3dCQUM1QyxPQUFPO3FCQUNSO29CQUVELElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUN2QyxPQUFPO3FCQUNSO29CQUVELE1BQU0sV0FBVyxHQUFhLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3hGLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsU0FBUyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDekYsT0FBTztxQkFDUjtvQkFFRCx1Q0FBdUM7b0JBQ3ZDLE1BQU0sYUFBYSxHQUFXLElBQUksQ0FBQztvQkFDbkMsTUFBTSxhQUFhLEdBQVcsS0FBSyxDQUFDO29CQUVwQyxJQUFJLFdBQXFCLENBQUM7b0JBQzFCLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsU0FBUyxFQUFFO3dCQUMvQyxXQUFXLEdBQUcsUUFBUSxDQUFDO3FCQUN4Qjt5QkFBTSxJQUFJLFdBQVcsQ0FBQyxVQUFVLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxFQUFFO3dCQUN2RixXQUFXLEdBQUcsV0FBVyxDQUFDO3FCQUMzQjt5QkFBTTt3QkFDTCxXQUFXLEdBQUcsUUFBUSxDQUFDO3FCQUN4QjtvQkFFRCxNQUFNLEVBQUUsR0FBbUIsWUFBWSxDQUFDLElBQUksQ0FBQztvQkFDN0MsTUFBTSxFQUFFLEdBQW9CLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQzlDLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsT0FBTyxFQUFFO3dCQUM3QyxRQUFRLENBQUMsSUFBSSxHQUFHLCtCQUFjLENBQUMsT0FBTyxDQUFDO3dCQUV2QywrRUFBK0U7d0JBQy9FLElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxTQUFTLEdBQVcsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoRixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ3RELE1BQU0sS0FBSyxHQUFXLGtCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUUsSUFBSSxLQUFLLEdBQUcsU0FBUyxFQUFFO2dDQUNyQixTQUFTLEdBQUcsS0FBSyxDQUFDO2dDQUNsQixTQUFTLEdBQUcsQ0FBQyxDQUFDOzZCQUNmO3lCQUNGO3dCQUVELE1BQU0sRUFBRSxHQUFXLFNBQVMsQ0FBQzt3QkFDN0IsTUFBTSxFQUFFLEdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7d0JBRXBELE1BQU0sR0FBRyxHQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxxQ0FBb0IsQ0FBQyxNQUFNLENBQUM7d0JBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxxQ0FBb0IsQ0FBQyxRQUFRLENBQUM7d0JBRWhELE1BQU0sR0FBRyxHQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxxQ0FBb0IsQ0FBQyxNQUFNLENBQUM7d0JBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxxQ0FBb0IsQ0FBQyxRQUFRLENBQUM7d0JBRWhELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs0QkFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1YsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUN0QixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3RCLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDaEM7NkJBQU07NEJBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1YsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUN0QixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3RCLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt5QkFDMUM7cUJBQ0Y7eUJBQU07d0JBQ0wsUUFBUSxDQUFDLElBQUksR0FBRywrQkFBYyxDQUFDLE9BQU8sQ0FBQzt3QkFFdkMsTUFBTSxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNyQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQzt3QkFDckMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLFFBQVEsQ0FBQzt3QkFDaEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLE1BQU0sQ0FBQzt3QkFFOUMsTUFBTSxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNyQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQzt3QkFDckMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLFFBQVEsQ0FBQzt3QkFDaEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLHFDQUFvQixDQUFDLE1BQU0sQ0FBQzt3QkFFOUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3dCQUMxQixFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzt3QkFDNUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDaEQ7b0JBRUQs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