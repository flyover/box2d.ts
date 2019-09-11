/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../Common/b2Settings", "../Common/b2Math", "./b2Distance"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Distance_1, b2ContactFeatureType, b2ContactFeature, b2ContactID, b2ManifoldPoint, b2ManifoldType, b2Manifold, b2WorldManifold, b2PointState, b2ClipVertex, b2RayCastInput, b2RayCastOutput, b2AABB, b2TestOverlapShape_s_input, b2TestOverlapShape_s_simplexCache, b2TestOverlapShape_s_output;
    var __moduleName = context_1 && context_1.id;
    /// Compute the point states given two manifolds. The states pertain to the transition from manifold1
    /// to manifold2. So state1 is either persist or remove while state2 is either add or persist.
    function b2GetPointStates(state1, state2, manifold1, manifold2) {
        // Detect persists and removes.
        let i;
        for (i = 0; i < manifold1.pointCount; ++i) {
            const id = manifold1.points[i].id;
            const key = id.key;
            state1[i] = b2PointState.b2_removeState;
            for (let j = 0, jct = manifold2.pointCount; j < jct; ++j) {
                if (manifold2.points[j].id.key === key) {
                    state1[i] = b2PointState.b2_persistState;
                    break;
                }
            }
        }
        for (; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
            state1[i] = b2PointState.b2_nullState;
        }
        // Detect persists and adds.
        for (i = 0; i < manifold2.pointCount; ++i) {
            const id = manifold2.points[i].id;
            const key = id.key;
            state2[i] = b2PointState.b2_addState;
            for (let j = 0, jct = manifold1.pointCount; j < jct; ++j) {
                if (manifold1.points[j].id.key === key) {
                    state2[i] = b2PointState.b2_persistState;
                    break;
                }
            }
        }
        for (; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
            state2[i] = b2PointState.b2_nullState;
        }
    }
    exports_1("b2GetPointStates", b2GetPointStates);
    function b2TestOverlapAABB(a, b) {
        if (a.upperBound.x < b.lowerBound.x) {
            return false;
        }
        if (a.upperBound.y < b.lowerBound.y) {
            return false;
        }
        if (b.upperBound.x < a.lowerBound.x) {
            return false;
        }
        if (b.upperBound.y < a.lowerBound.y) {
            return false;
        }
        return true;
    }
    exports_1("b2TestOverlapAABB", b2TestOverlapAABB);
    /// Clipping for contact manifolds.
    function b2ClipSegmentToLine(vOut, vIn, normal, offset, vertexIndexA) {
        // Start with no output points
        let numOut = 0;
        const vIn0 = vIn[0];
        const vIn1 = vIn[1];
        // Calculate the distance of end points to the line
        const distance0 = b2Math_1.b2Vec2.DotVV(normal, vIn0.v) - offset;
        const distance1 = b2Math_1.b2Vec2.DotVV(normal, vIn1.v) - offset;
        // If the points are behind the plane
        if (distance0 <= 0) {
            vOut[numOut++].Copy(vIn0);
        }
        if (distance1 <= 0) {
            vOut[numOut++].Copy(vIn1);
        }
        // If the points are on different sides of the plane
        if (distance0 * distance1 < 0) {
            // Find intersection point of edge and plane
            const interp = distance0 / (distance0 - distance1);
            const v = vOut[numOut].v;
            v.x = vIn0.v.x + interp * (vIn1.v.x - vIn0.v.x);
            v.y = vIn0.v.y + interp * (vIn1.v.y - vIn0.v.y);
            // VertexA is hitting edgeB.
            const id = vOut[numOut].id;
            id.cf.indexA = vertexIndexA;
            id.cf.indexB = vIn0.id.cf.indexB;
            id.cf.typeA = b2ContactFeatureType.e_vertex;
            id.cf.typeB = b2ContactFeatureType.e_face;
            ++numOut;
        }
        return numOut;
    }
    exports_1("b2ClipSegmentToLine", b2ClipSegmentToLine);
    function b2TestOverlapShape(shapeA, indexA, shapeB, indexB, xfA, xfB) {
        const input = b2TestOverlapShape_s_input.Reset();
        input.proxyA.SetShape(shapeA, indexA);
        input.proxyB.SetShape(shapeB, indexB);
        input.transformA.Copy(xfA);
        input.transformB.Copy(xfB);
        input.useRadii = true;
        const simplexCache = b2TestOverlapShape_s_simplexCache.Reset();
        simplexCache.count = 0;
        const output = b2TestOverlapShape_s_output.Reset();
        b2Distance_1.b2Distance(output, simplexCache, input);
        return output.distance < 10 * b2Settings_1.b2_epsilon;
    }
    exports_1("b2TestOverlapShape", b2TestOverlapShape);
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Distance_1_1) {
                b2Distance_1 = b2Distance_1_1;
            }
        ],
        execute: function () {
            /// @file
            /// Structures and functions used for computing contact points, distance
            /// queries, and TOI queries.
            (function (b2ContactFeatureType) {
                b2ContactFeatureType[b2ContactFeatureType["e_vertex"] = 0] = "e_vertex";
                b2ContactFeatureType[b2ContactFeatureType["e_face"] = 1] = "e_face";
            })(b2ContactFeatureType || (b2ContactFeatureType = {}));
            exports_1("b2ContactFeatureType", b2ContactFeatureType);
            /// The features that intersect to form the contact point
            /// This must be 4 bytes or less.
            b2ContactFeature = class b2ContactFeature {
                constructor() {
                    this._key = 0;
                    this._key_invalid = false;
                    this._indexA = 0;
                    this._indexB = 0;
                    this._typeA = 0;
                    this._typeB = 0;
                }
                get key() {
                    if (this._key_invalid) {
                        this._key_invalid = false;
                        this._key = this._indexA | (this._indexB << 8) | (this._typeA << 16) | (this._typeB << 24);
                    }
                    return this._key;
                }
                set key(value) {
                    this._key = value;
                    this._key_invalid = false;
                    this._indexA = this._key & 0xff;
                    this._indexB = (this._key >> 8) & 0xff;
                    this._typeA = (this._key >> 16) & 0xff;
                    this._typeB = (this._key >> 24) & 0xff;
                }
                get indexA() {
                    return this._indexA;
                }
                set indexA(value) {
                    this._indexA = value;
                    this._key_invalid = true;
                }
                get indexB() {
                    return this._indexB;
                }
                set indexB(value) {
                    this._indexB = value;
                    this._key_invalid = true;
                }
                get typeA() {
                    return this._typeA;
                }
                set typeA(value) {
                    this._typeA = value;
                    this._key_invalid = true;
                }
                get typeB() {
                    return this._typeB;
                }
                set typeB(value) {
                    this._typeB = value;
                    this._key_invalid = true;
                }
            };
            exports_1("b2ContactFeature", b2ContactFeature);
            /// Contact ids to facilitate warm starting.
            b2ContactID = class b2ContactID {
                constructor() {
                    this.cf = new b2ContactFeature();
                }
                Copy(o) {
                    this.key = o.key;
                    return this;
                }
                Clone() {
                    return new b2ContactID().Copy(this);
                }
                get key() {
                    return this.cf.key;
                }
                set key(value) {
                    this.cf.key = value;
                }
            };
            exports_1("b2ContactID", b2ContactID);
            /// A manifold point is a contact point belonging to a contact
            /// manifold. It holds details related to the geometry and dynamics
            /// of the contact points.
            /// The local point usage depends on the manifold type:
            /// -e_circles: the local center of circleB
            /// -e_faceA: the local center of cirlceB or the clip point of polygonB
            /// -e_faceB: the clip point of polygonA
            /// This structure is stored across time steps, so we keep it small.
            /// Note: the impulses are used for internal caching and may not
            /// provide reliable contact forces, especially for high speed collisions.
            b2ManifoldPoint = class b2ManifoldPoint {
                constructor() {
                    this.localPoint = new b2Math_1.b2Vec2(); ///< usage depends on manifold type
                    this.normalImpulse = 0; ///< the non-penetration impulse
                    this.tangentImpulse = 0; ///< the friction impulse
                    this.id = new b2ContactID(); ///< uniquely identifies a contact point between two shapes
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, (i) => new b2ManifoldPoint());
                }
                Reset() {
                    this.localPoint.SetZero();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.id.key = 0;
                }
                Copy(o) {
                    this.localPoint.Copy(o.localPoint);
                    this.normalImpulse = o.normalImpulse;
                    this.tangentImpulse = o.tangentImpulse;
                    this.id.Copy(o.id);
                    return this;
                }
            };
            exports_1("b2ManifoldPoint", b2ManifoldPoint);
            (function (b2ManifoldType) {
                b2ManifoldType[b2ManifoldType["e_unknown"] = -1] = "e_unknown";
                b2ManifoldType[b2ManifoldType["e_circles"] = 0] = "e_circles";
                b2ManifoldType[b2ManifoldType["e_faceA"] = 1] = "e_faceA";
                b2ManifoldType[b2ManifoldType["e_faceB"] = 2] = "e_faceB";
            })(b2ManifoldType || (b2ManifoldType = {}));
            exports_1("b2ManifoldType", b2ManifoldType);
            /// A manifold for two touching convex shapes.
            /// Box2D supports multiple types of contact:
            /// - clip point versus plane with radius
            /// - point versus point with radius (circles)
            /// The local point usage depends on the manifold type:
            /// -e_circles: the local center of circleA
            /// -e_faceA: the center of faceA
            /// -e_faceB: the center of faceB
            /// Similarly the local normal usage:
            /// -e_circles: not used
            /// -e_faceA: the normal on polygonA
            /// -e_faceB: the normal on polygonB
            /// We store contacts in this way so that position correction can
            /// account for movement, which is critical for continuous physics.
            /// All contact scenarios must be expressed in one of these types.
            /// This structure is stored across time steps, so we keep it small.
            b2Manifold = class b2Manifold {
                constructor() {
                    this.points = b2ManifoldPoint.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_1.b2Vec2();
                    this.localPoint = new b2Math_1.b2Vec2();
                    this.type = b2ManifoldType.e_unknown;
                    this.pointCount = 0;
                }
                Reset() {
                    for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
                        // DEBUG: b2Assert(this.points[i] instanceof b2ManifoldPoint);
                        this.points[i].Reset();
                    }
                    this.localNormal.SetZero();
                    this.localPoint.SetZero();
                    this.type = b2ManifoldType.e_unknown;
                    this.pointCount = 0;
                }
                Copy(o) {
                    this.pointCount = o.pointCount;
                    for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
                        // DEBUG: b2Assert(this.points[i] instanceof b2ManifoldPoint);
                        this.points[i].Copy(o.points[i]);
                    }
                    this.localNormal.Copy(o.localNormal);
                    this.localPoint.Copy(o.localPoint);
                    this.type = o.type;
                    return this;
                }
                Clone() {
                    return new b2Manifold().Copy(this);
                }
            };
            exports_1("b2Manifold", b2Manifold);
            b2WorldManifold = class b2WorldManifold {
                constructor() {
                    this.normal = new b2Math_1.b2Vec2();
                    this.points = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.separations = b2Settings_1.b2MakeNumberArray(b2Settings_1.b2_maxManifoldPoints);
                }
                Initialize(manifold, xfA, radiusA, xfB, radiusB) {
                    if (manifold.pointCount === 0) {
                        return;
                    }
                    switch (manifold.type) {
                        case b2ManifoldType.e_circles: {
                            this.normal.Set(1, 0);
                            const pointA = b2Math_1.b2Transform.MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_pointA);
                            const pointB = b2Math_1.b2Transform.MulXV(xfB, manifold.points[0].localPoint, b2WorldManifold.Initialize_s_pointB);
                            if (b2Math_1.b2Vec2.DistanceSquaredVV(pointA, pointB) > b2Settings_1.b2_epsilon_sq) {
                                b2Math_1.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                            }
                            const cA = b2Math_1.b2Vec2.AddVMulSV(pointA, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                            const cB = b2Math_1.b2Vec2.SubVMulSV(pointB, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                            b2Math_1.b2Vec2.MidVV(cA, cB, this.points[0]);
                            this.separations[0] = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cB, cA, b2Math_1.b2Vec2.s_t0), this.normal); // b2Dot(cB - cA, normal);
                            break;
                        }
                        case b2ManifoldType.e_faceA: {
                            b2Math_1.b2Rot.MulRV(xfA.q, manifold.localNormal, this.normal);
                            const planePoint = b2Math_1.b2Transform.MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                            for (let i = 0; i < manifold.pointCount; ++i) {
                                const clipPoint = b2Math_1.b2Transform.MulXV(xfB, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                                const s = radiusA - b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal);
                                const cA = b2Math_1.b2Vec2.AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cA);
                                const cB = b2Math_1.b2Vec2.SubVMulSV(clipPoint, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                                b2Math_1.b2Vec2.MidVV(cA, cB, this.points[i]);
                                this.separations[i] = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cB, cA, b2Math_1.b2Vec2.s_t0), this.normal); // b2Dot(cB - cA, normal);
                            }
                            break;
                        }
                        case b2ManifoldType.e_faceB: {
                            b2Math_1.b2Rot.MulRV(xfB.q, manifold.localNormal, this.normal);
                            const planePoint = b2Math_1.b2Transform.MulXV(xfB, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                            for (let i = 0; i < manifold.pointCount; ++i) {
                                const clipPoint = b2Math_1.b2Transform.MulXV(xfA, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                                const s = radiusB - b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal);
                                const cB = b2Math_1.b2Vec2.AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cB);
                                const cA = b2Math_1.b2Vec2.SubVMulSV(clipPoint, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                                b2Math_1.b2Vec2.MidVV(cA, cB, this.points[i]);
                                this.separations[i] = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(cA, cB, b2Math_1.b2Vec2.s_t0), this.normal); // b2Dot(cA - cB, normal);
                            }
                            // Ensure normal points from A to B.
                            this.normal.SelfNeg();
                            break;
                        }
                    }
                }
            };
            exports_1("b2WorldManifold", b2WorldManifold);
            b2WorldManifold.Initialize_s_pointA = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_pointB = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_cA = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_cB = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_planePoint = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_clipPoint = new b2Math_1.b2Vec2();
            /// This is used for determining the state of contact points.
            (function (b2PointState) {
                b2PointState[b2PointState["b2_nullState"] = 0] = "b2_nullState";
                b2PointState[b2PointState["b2_addState"] = 1] = "b2_addState";
                b2PointState[b2PointState["b2_persistState"] = 2] = "b2_persistState";
                b2PointState[b2PointState["b2_removeState"] = 3] = "b2_removeState";
            })(b2PointState || (b2PointState = {}));
            exports_1("b2PointState", b2PointState);
            /// Used for computing contact manifolds.
            b2ClipVertex = class b2ClipVertex {
                constructor() {
                    this.v = new b2Math_1.b2Vec2();
                    this.id = new b2ContactID();
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, (i) => new b2ClipVertex());
                }
                Copy(other) {
                    this.v.Copy(other.v);
                    this.id.Copy(other.id);
                    return this;
                }
            };
            exports_1("b2ClipVertex", b2ClipVertex);
            /// Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
            b2RayCastInput = class b2RayCastInput {
                constructor() {
                    this.p1 = new b2Math_1.b2Vec2();
                    this.p2 = new b2Math_1.b2Vec2();
                    this.maxFraction = 1;
                }
                Copy(o) {
                    this.p1.Copy(o.p1);
                    this.p2.Copy(o.p2);
                    this.maxFraction = o.maxFraction;
                    return this;
                }
            };
            exports_1("b2RayCastInput", b2RayCastInput);
            /// Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and p2
            /// come from b2RayCastInput.
            b2RayCastOutput = class b2RayCastOutput {
                constructor() {
                    this.normal = new b2Math_1.b2Vec2();
                    this.fraction = 0;
                }
                Copy(o) {
                    this.normal.Copy(o.normal);
                    this.fraction = o.fraction;
                    return this;
                }
            };
            exports_1("b2RayCastOutput", b2RayCastOutput);
            /// An axis aligned bounding box.
            b2AABB = class b2AABB {
                constructor() {
                    this.lowerBound = new b2Math_1.b2Vec2(); ///< the lower vertex
                    this.upperBound = new b2Math_1.b2Vec2(); ///< the upper vertex
                    this.m_cache_center = new b2Math_1.b2Vec2(); // access using GetCenter()
                    this.m_cache_extent = new b2Math_1.b2Vec2(); // access using GetExtents()
                }
                Copy(o) {
                    this.lowerBound.Copy(o.lowerBound);
                    this.upperBound.Copy(o.upperBound);
                    return this;
                }
                /// Verify that the bounds are sorted.
                IsValid() {
                    if (!this.lowerBound.IsValid()) {
                        return false;
                    }
                    if (!this.upperBound.IsValid()) {
                        return false;
                    }
                    if (this.upperBound.x < this.lowerBound.x) {
                        return false;
                    }
                    if (this.upperBound.y < this.lowerBound.y) {
                        return false;
                    }
                    return true;
                }
                /// Get the center of the AABB.
                GetCenter() {
                    return b2Math_1.b2Vec2.MidVV(this.lowerBound, this.upperBound, this.m_cache_center);
                }
                /// Get the extents of the AABB (half-widths).
                GetExtents() {
                    return b2Math_1.b2Vec2.ExtVV(this.lowerBound, this.upperBound, this.m_cache_extent);
                }
                /// Get the perimeter length
                GetPerimeter() {
                    const wx = this.upperBound.x - this.lowerBound.x;
                    const wy = this.upperBound.y - this.lowerBound.y;
                    return 2 * (wx + wy);
                }
                /// Combine an AABB into this one.
                Combine1(aabb) {
                    this.lowerBound.x = b2Math_1.b2Min(this.lowerBound.x, aabb.lowerBound.x);
                    this.lowerBound.y = b2Math_1.b2Min(this.lowerBound.y, aabb.lowerBound.y);
                    this.upperBound.x = b2Math_1.b2Max(this.upperBound.x, aabb.upperBound.x);
                    this.upperBound.y = b2Math_1.b2Max(this.upperBound.y, aabb.upperBound.y);
                    return this;
                }
                /// Combine two AABBs into this one.
                Combine2(aabb1, aabb2) {
                    this.lowerBound.x = b2Math_1.b2Min(aabb1.lowerBound.x, aabb2.lowerBound.x);
                    this.lowerBound.y = b2Math_1.b2Min(aabb1.lowerBound.y, aabb2.lowerBound.y);
                    this.upperBound.x = b2Math_1.b2Max(aabb1.upperBound.x, aabb2.upperBound.x);
                    this.upperBound.y = b2Math_1.b2Max(aabb1.upperBound.y, aabb2.upperBound.y);
                    return this;
                }
                static Combine(aabb1, aabb2, out) {
                    out.Combine2(aabb1, aabb2);
                    return out;
                }
                /// Does this aabb contain the provided AABB.
                Contains(aabb) {
                    if (this.lowerBound.x <= aabb.lowerBound.x) {
                        return false;
                    }
                    if (this.lowerBound.y <= aabb.lowerBound.y) {
                        return false;
                    }
                    if (aabb.upperBound.x <= this.upperBound.x) {
                        return false;
                    }
                    if (aabb.upperBound.y <= this.upperBound.y) {
                        return false;
                    }
                    return true;
                }
                // From Real-time Collision Detection, p179.
                RayCast(output, input) {
                    let tmin = (-b2Settings_1.b2_maxFloat);
                    let tmax = b2Settings_1.b2_maxFloat;
                    const p_x = input.p1.x;
                    const p_y = input.p1.y;
                    const d_x = input.p2.x - input.p1.x;
                    const d_y = input.p2.y - input.p1.y;
                    const absD_x = b2Math_1.b2Abs(d_x);
                    const absD_y = b2Math_1.b2Abs(d_y);
                    const normal = output.normal;
                    if (absD_x < b2Settings_1.b2_epsilon) {
                        // Parallel.
                        if (p_x < this.lowerBound.x || this.upperBound.x < p_x) {
                            return false;
                        }
                    }
                    else {
                        const inv_d = 1 / d_x;
                        let t1 = (this.lowerBound.x - p_x) * inv_d;
                        let t2 = (this.upperBound.x - p_x) * inv_d;
                        // Sign of the normal vector.
                        let s = (-1);
                        if (t1 > t2) {
                            const t3 = t1;
                            t1 = t2;
                            t2 = t3;
                            s = 1;
                        }
                        // Push the min up
                        if (t1 > tmin) {
                            normal.x = s;
                            normal.y = 0;
                            tmin = t1;
                        }
                        // Pull the max down
                        tmax = b2Math_1.b2Min(tmax, t2);
                        if (tmin > tmax) {
                            return false;
                        }
                    }
                    if (absD_y < b2Settings_1.b2_epsilon) {
                        // Parallel.
                        if (p_y < this.lowerBound.y || this.upperBound.y < p_y) {
                            return false;
                        }
                    }
                    else {
                        const inv_d = 1 / d_y;
                        let t1 = (this.lowerBound.y - p_y) * inv_d;
                        let t2 = (this.upperBound.y - p_y) * inv_d;
                        // Sign of the normal vector.
                        let s = (-1);
                        if (t1 > t2) {
                            const t3 = t1;
                            t1 = t2;
                            t2 = t3;
                            s = 1;
                        }
                        // Push the min up
                        if (t1 > tmin) {
                            normal.x = 0;
                            normal.y = s;
                            tmin = t1;
                        }
                        // Pull the max down
                        tmax = b2Math_1.b2Min(tmax, t2);
                        if (tmin > tmax) {
                            return false;
                        }
                    }
                    // Does the ray start inside the box?
                    // Does the ray intersect beyond the max fraction?
                    if (tmin < 0 || input.maxFraction < tmin) {
                        return false;
                    }
                    // Intersection.
                    output.fraction = tmin;
                    return true;
                }
                TestContain(point) {
                    if (point.x < this.lowerBound.x || this.upperBound.x < point.x) {
                        return false;
                    }
                    if (point.y < this.lowerBound.y || this.upperBound.y < point.y) {
                        return false;
                    }
                    return true;
                }
                TestOverlap(other) {
                    if (this.upperBound.x < other.lowerBound.x) {
                        return false;
                    }
                    if (this.upperBound.y < other.lowerBound.y) {
                        return false;
                    }
                    if (other.upperBound.x < this.lowerBound.x) {
                        return false;
                    }
                    if (other.upperBound.y < this.lowerBound.y) {
                        return false;
                    }
                    return true;
                }
            };
            exports_1("b2AABB", b2AABB);
            /// Determine if two generic shapes overlap.
            b2TestOverlapShape_s_input = new b2Distance_1.b2DistanceInput();
            b2TestOverlapShape_s_simplexCache = new b2Distance_1.b2SimplexCache();
            b2TestOverlapShape_s_output = new b2Distance_1.b2DistanceOutput();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaXNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkNvbGxpc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7SUFpUkYscUdBQXFHO0lBQ3JHLDhGQUE4RjtJQUM5RixTQUFnQixnQkFBZ0IsQ0FBQyxNQUFzQixFQUFFLE1BQXNCLEVBQUUsU0FBcUIsRUFBRSxTQUFxQjtRQUMzSCwrQkFBK0I7UUFDL0IsSUFBSSxDQUFTLENBQUM7UUFDZCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDekMsTUFBTSxFQUFFLEdBQWdCLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFFM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUM7WUFFeEMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFO29CQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztvQkFDekMsTUFBTTtpQkFDUDthQUNGO1NBQ0Y7UUFDRCxPQUFPLENBQUMsR0FBRyxpQ0FBb0IsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztTQUN2QztRQUVELDRCQUE0QjtRQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDekMsTUFBTSxFQUFFLEdBQWdCLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFFM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUM7WUFFckMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFO29CQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztvQkFDekMsTUFBTTtpQkFDUDthQUNGO1NBQ0Y7UUFDRCxPQUFPLENBQUMsR0FBRyxpQ0FBb0IsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztTQUN2QztJQUNILENBQUM7O0lBb09ELFNBQWdCLGlCQUFpQixDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3BELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQ3RELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQ3RELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQ3RELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7SUFFRCxtQ0FBbUM7SUFDbkMsU0FBZ0IsbUJBQW1CLENBQUMsSUFBb0IsRUFBRSxHQUFtQixFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsWUFBb0I7UUFDakksOEJBQThCO1FBQzlCLElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQztRQUV2QixNQUFNLElBQUksR0FBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sSUFBSSxHQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEMsbURBQW1EO1FBQ25ELE1BQU0sU0FBUyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDaEUsTUFBTSxTQUFTLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUVoRSxxQ0FBcUM7UUFDckMsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUU7UUFDbEQsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUU7UUFFbEQsb0RBQW9EO1FBQ3BELElBQUksU0FBUyxHQUFHLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDN0IsNENBQTRDO1lBQzVDLE1BQU0sTUFBTSxHQUFXLFNBQVMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEQsNEJBQTRCO1lBQzVCLE1BQU0sRUFBRSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztZQUM1QixFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDakMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsUUFBUSxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztZQUMxQyxFQUFFLE1BQU0sQ0FBQztTQUNWO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7SUFNRCxTQUFnQixrQkFBa0IsQ0FBQyxNQUFlLEVBQUUsTUFBYyxFQUFFLE1BQWUsRUFBRSxNQUFjLEVBQUUsR0FBZ0IsRUFBRSxHQUFnQjtRQUNySSxNQUFNLEtBQUssR0FBb0IsMEJBQTBCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV0QixNQUFNLFlBQVksR0FBbUIsaUNBQWlDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0UsWUFBWSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFdkIsTUFBTSxNQUFNLEdBQXFCLDJCQUEyQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJFLHVCQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QyxPQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLHVCQUFVLENBQUM7SUFDM0MsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O1lBcGxCRCxTQUFTO1lBQ1Qsd0VBQXdFO1lBQ3hFLDZCQUE2QjtZQUU3QixXQUFZLG9CQUFvQjtnQkFDOUIsdUVBQVksQ0FBQTtnQkFDWixtRUFBVSxDQUFBO1lBQ1osQ0FBQyxFQUhXLG9CQUFvQixLQUFwQixvQkFBb0IsUUFHL0I7O1lBRUQseURBQXlEO1lBQ3pELGlDQUFpQztZQUNqQyxtQkFBQSxNQUFhLGdCQUFnQjtnQkFBN0I7b0JBQ1UsU0FBSSxHQUFXLENBQUMsQ0FBQztvQkFDakIsaUJBQVksR0FBRyxLQUFLLENBQUM7b0JBQ3JCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFdBQU0sR0FBeUIsQ0FBQyxDQUFDO29CQUNqQyxXQUFNLEdBQXlCLENBQUMsQ0FBQztnQkFzRDNDLENBQUM7Z0JBcERDLElBQVcsR0FBRztvQkFDWixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO3dCQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7cUJBQzVGO29CQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxJQUFXLEdBQUcsQ0FBQyxLQUFhO29CQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRUQsSUFBVyxNQUFNO29CQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQztnQkFFRCxJQUFXLE1BQU0sQ0FBQyxLQUFhO29CQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUM7Z0JBRUQsSUFBVyxNQUFNO29CQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQztnQkFFRCxJQUFXLE1BQU0sQ0FBQyxLQUFhO29CQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUM7Z0JBRUQsSUFBVyxLQUFLO29CQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxJQUFXLEtBQUssQ0FBQyxLQUFhO29CQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUM7Z0JBRUQsSUFBVyxLQUFLO29CQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxJQUFXLEtBQUssQ0FBQyxLQUFhO29CQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUM7YUFDRixDQUFBOztZQUVELDRDQUE0QztZQUM1QyxjQUFBLE1BQWEsV0FBVztnQkFBeEI7b0JBQ2tCLE9BQUUsR0FBcUIsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO2dCQWtCaEUsQ0FBQztnQkFoQlEsSUFBSSxDQUFDLENBQWM7b0JBQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxLQUFLO29CQUNWLE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7Z0JBRUQsSUFBVyxHQUFHO29CQUNaLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQsSUFBVyxHQUFHLENBQUMsS0FBYTtvQkFDMUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCw4REFBOEQ7WUFDOUQsbUVBQW1FO1lBQ25FLDBCQUEwQjtZQUMxQix1REFBdUQ7WUFDdkQsMkNBQTJDO1lBQzNDLHVFQUF1RTtZQUN2RSx3Q0FBd0M7WUFDeEMsb0VBQW9FO1lBQ3BFLGdFQUFnRTtZQUNoRSwwRUFBMEU7WUFDMUUsa0JBQUEsTUFBYSxlQUFlO2dCQUE1QjtvQkFDa0IsZUFBVSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUMsQ0FBRSxtQ0FBbUM7b0JBQ2hGLGtCQUFhLEdBQVcsQ0FBQyxDQUFDLENBQU0sZ0NBQWdDO29CQUNoRSxtQkFBYyxHQUFXLENBQUMsQ0FBQyxDQUFNLHlCQUF5QjtvQkFDakQsT0FBRSxHQUFnQixJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUMsMkRBQTJEO2dCQW9CbEgsQ0FBQztnQkFsQlEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO29CQUNwQyxPQUFPLHdCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUyxFQUFtQixFQUFFLENBQUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUVNLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRU0sSUFBSSxDQUFDLENBQWtCO29CQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQztvQkFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDO29CQUN2QyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25CLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFBOztZQUVELFdBQVksY0FBYztnQkFDeEIsOERBQWMsQ0FBQTtnQkFDZCw2REFBYSxDQUFBO2dCQUNiLHlEQUFXLENBQUE7Z0JBQ1gseURBQVcsQ0FBQTtZQUNiLENBQUMsRUFMVyxjQUFjLEtBQWQsY0FBYyxRQUt6Qjs7WUFFRCw4Q0FBOEM7WUFDOUMsNkNBQTZDO1lBQzdDLHlDQUF5QztZQUN6Qyw4Q0FBOEM7WUFDOUMsdURBQXVEO1lBQ3ZELDJDQUEyQztZQUMzQyxpQ0FBaUM7WUFDakMsaUNBQWlDO1lBQ2pDLHFDQUFxQztZQUNyQyx3QkFBd0I7WUFDeEIsb0NBQW9DO1lBQ3BDLG9DQUFvQztZQUNwQyxpRUFBaUU7WUFDakUsbUVBQW1FO1lBQ25FLGtFQUFrRTtZQUNsRSxvRUFBb0U7WUFDcEUsYUFBQSxNQUFhLFVBQVU7Z0JBQXZCO29CQUNrQixXQUFNLEdBQXNCLGVBQWUsQ0FBQyxTQUFTLENBQUMsaUNBQW9CLENBQUMsQ0FBQztvQkFDNUUsZ0JBQVcsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNuQyxlQUFVLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDM0MsU0FBSSxHQUFtQixjQUFjLENBQUMsU0FBUyxDQUFDO29CQUNoRCxlQUFVLEdBQVcsQ0FBQyxDQUFDO2dCQTRCaEMsQ0FBQztnQkExQlEsS0FBSztvQkFDVixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsaUNBQW9CLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JELDhEQUE4RDt3QkFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDeEI7b0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDO29CQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDdEIsQ0FBQztnQkFFTSxJQUFJLENBQUMsQ0FBYTtvQkFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO29CQUMvQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsaUNBQW9CLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JELDhEQUE4RDt3QkFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNsQztvQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNuQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEtBQUs7b0JBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQzthQUNGLENBQUE7O1lBRUQsa0JBQUEsTUFBYSxlQUFlO2dCQUE1QjtvQkFDa0IsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzlCLFdBQU0sR0FBYSxlQUFNLENBQUMsU0FBUyxDQUFDLGlDQUFvQixDQUFDLENBQUM7b0JBQzFELGdCQUFXLEdBQWEsOEJBQWlCLENBQUMsaUNBQW9CLENBQUMsQ0FBQztnQkErRGxGLENBQUM7Z0JBdkRRLFVBQVUsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsT0FBZSxFQUFFLEdBQWdCLEVBQUUsT0FBZTtvQkFDMUcsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTt3QkFDN0IsT0FBTztxQkFDUjtvQkFFRCxRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUU7d0JBQ3ZCLEtBQUssY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3RCLE1BQU0sTUFBTSxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzRCQUN4RyxNQUFNLE1BQU0sR0FBVyxvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7NEJBQ2xILElBQUksZUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRywwQkFBYSxFQUFFO2dDQUM1RCxlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDOzZCQUMzRDs0QkFFRCxNQUFNLEVBQUUsR0FBVyxlQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7NEJBQ25HLE1BQU0sRUFBRSxHQUFXLGVBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDbkcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsMEJBQTBCOzRCQUM5RyxNQUFNO3lCQUNQO3dCQUVILEtBQUssY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN6QixjQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQ3RELE1BQU0sVUFBVSxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzRCQUVoSCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQ0FDcEQsTUFBTSxTQUFTLEdBQVcsb0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dDQUN4SCxNQUFNLENBQUMsR0FBVyxPQUFPLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDeEcsTUFBTSxFQUFFLEdBQVcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dDQUNoRyxNQUFNLEVBQUUsR0FBVyxlQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7Z0NBQ3RHLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDBCQUEwQjs2QkFDL0c7NEJBQ0QsTUFBTTt5QkFDUDt3QkFFSCxLQUFLLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFDekIsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN0RCxNQUFNLFVBQVUsR0FBVyxvQkFBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs0QkFFaEgsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0NBQ3BELE1BQU0sU0FBUyxHQUFXLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQ0FDeEgsTUFBTSxDQUFDLEdBQVcsT0FBTyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ3hHLE1BQU0sRUFBRSxHQUFXLGVBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQ0FDaEcsTUFBTSxFQUFFLEdBQVcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dDQUN0RyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywwQkFBMEI7NkJBQy9HOzRCQUVELG9DQUFvQzs0QkFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDdEIsTUFBTTt5QkFDUDtxQkFDRjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQTs7WUE3RGdCLG1DQUFtQixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDbkMsbUNBQW1CLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUNuQywrQkFBZSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDL0IsK0JBQWUsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQy9CLHVDQUF1QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDdkMsc0NBQXNCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQTBEdkQsNkRBQTZEO1lBQzdELFdBQVksWUFBWTtnQkFDdEIsK0RBQWdCLENBQUE7Z0JBQ2hCLDZEQUFlLENBQUE7Z0JBQ2YscUVBQW1CLENBQUE7Z0JBQ25CLG1FQUFrQixDQUFBO1lBQ3BCLENBQUMsRUFMVyxZQUFZLEtBQVosWUFBWSxRQUt2Qjs7WUEyQ0QseUNBQXlDO1lBQ3pDLGVBQUEsTUFBYSxZQUFZO2dCQUF6QjtvQkFDa0IsTUFBQyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3pCLE9BQUUsR0FBZ0IsSUFBSSxXQUFXLEVBQUUsQ0FBQztnQkFXdEQsQ0FBQztnQkFUUSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7b0JBQ3BDLE9BQU8sd0JBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFTLEVBQWdCLEVBQUUsQ0FBQyxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7Z0JBQzlFLENBQUM7Z0JBRU0sSUFBSSxDQUFDLEtBQW1CO29CQUM3QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDdkIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsaUZBQWlGO1lBQ2pGLGlCQUFBLE1BQWEsY0FBYztnQkFBM0I7b0JBQ2tCLE9BQUUsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMxQixPQUFFLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDbkMsZ0JBQVcsR0FBVyxDQUFDLENBQUM7Z0JBUWpDLENBQUM7Z0JBTlEsSUFBSSxDQUFDLENBQWlCO29CQUMzQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO29CQUNqQyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxvRkFBb0Y7WUFDcEYsNkJBQTZCO1lBQzdCLGtCQUFBLE1BQWEsZUFBZTtnQkFBNUI7b0JBQ2tCLFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUN2QyxhQUFRLEdBQVcsQ0FBQyxDQUFDO2dCQU85QixDQUFDO2dCQUxRLElBQUksQ0FBQyxDQUFrQjtvQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7b0JBQzNCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFBOztZQUVELGlDQUFpQztZQUNqQyxTQUFBLE1BQWEsTUFBTTtnQkFBbkI7b0JBQ2tCLGVBQVUsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDLENBQUMscUJBQXFCO29CQUN4RCxlQUFVLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQjtvQkFFdkQsbUJBQWMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDLENBQUMsMkJBQTJCO29CQUNsRSxtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUMsQ0FBQyw0QkFBNEI7Z0JBK0t0RixDQUFDO2dCQTdLUSxJQUFJLENBQUMsQ0FBUztvQkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ25DLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsc0NBQXNDO2dCQUMvQixPQUFPO29CQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFO3dCQUFFLE9BQU8sS0FBSyxDQUFDO3FCQUFFO29CQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDakQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDNUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDNUQsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCwrQkFBK0I7Z0JBQ3hCLFNBQVM7b0JBQ2QsT0FBTyxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzdFLENBQUM7Z0JBRUQsOENBQThDO2dCQUN2QyxVQUFVO29CQUNmLE9BQU8sZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDO2dCQUVELDRCQUE0QjtnQkFDckIsWUFBWTtvQkFDakIsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztnQkFFRCxrQ0FBa0M7Z0JBQzNCLFFBQVEsQ0FBQyxJQUFZO29CQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxjQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsY0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLGNBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxjQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxvQ0FBb0M7Z0JBQzdCLFFBQVEsQ0FBQyxLQUFhLEVBQUUsS0FBYTtvQkFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsY0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLGNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxjQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsY0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEdBQVc7b0JBQzdELEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMzQixPQUFPLEdBQUcsQ0FBQztnQkFDYixDQUFDO2dCQUVELDZDQUE2QztnQkFDdEMsUUFBUSxDQUFDLElBQVk7b0JBQzFCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7d0JBQUUsT0FBTyxLQUFLLENBQUM7cUJBQUU7b0JBQzdELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7d0JBQUUsT0FBTyxLQUFLLENBQUM7cUJBQUU7b0JBQzdELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7d0JBQUUsT0FBTyxLQUFLLENBQUM7cUJBQUU7b0JBQzdELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7d0JBQUUsT0FBTyxLQUFLLENBQUM7cUJBQUU7b0JBQzdELE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsNENBQTRDO2dCQUNyQyxPQUFPLENBQUMsTUFBdUIsRUFBRSxLQUFxQjtvQkFDM0QsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDLHdCQUFXLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxJQUFJLEdBQVcsd0JBQVcsQ0FBQztvQkFFL0IsTUFBTSxHQUFHLEdBQVcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE1BQU0sR0FBRyxHQUFXLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMvQixNQUFNLEdBQUcsR0FBVyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxHQUFHLEdBQVcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sTUFBTSxHQUFXLGNBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxNQUFNLEdBQVcsY0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUVsQyxNQUFNLE1BQU0sR0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDO29CQUVyQyxJQUFJLE1BQU0sR0FBRyx1QkFBVSxFQUFFO3dCQUN2QixZQUFZO3dCQUNaLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRTs0QkFDdEQsT0FBTyxLQUFLLENBQUM7eUJBQ2Q7cUJBQ0Y7eUJBQU07d0JBQ0wsTUFBTSxLQUFLLEdBQVcsQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDOUIsSUFBSSxFQUFFLEdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7d0JBQ25ELElBQUksRUFBRSxHQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO3dCQUVuRCw2QkFBNkI7d0JBQzdCLElBQUksQ0FBQyxHQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFckIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFOzRCQUNYLE1BQU0sRUFBRSxHQUFXLEVBQUUsQ0FBQzs0QkFDdEIsRUFBRSxHQUFHLEVBQUUsQ0FBQzs0QkFDUixFQUFFLEdBQUcsRUFBRSxDQUFDOzRCQUNSLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ1A7d0JBRUQsa0JBQWtCO3dCQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUU7NEJBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQzt5QkFDWDt3QkFFRCxvQkFBb0I7d0JBQ3BCLElBQUksR0FBRyxjQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUV2QixJQUFJLElBQUksR0FBRyxJQUFJLEVBQUU7NEJBQ2YsT0FBTyxLQUFLLENBQUM7eUJBQ2Q7cUJBQ0Y7b0JBRUQsSUFBSSxNQUFNLEdBQUcsdUJBQVUsRUFBRTt3QkFDdkIsWUFBWTt3QkFDWixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUU7NEJBQ3RELE9BQU8sS0FBSyxDQUFDO3lCQUNkO3FCQUNGO3lCQUFNO3dCQUNMLE1BQU0sS0FBSyxHQUFXLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQzlCLElBQUksRUFBRSxHQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO3dCQUNuRCxJQUFJLEVBQUUsR0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQzt3QkFFbkQsNkJBQTZCO3dCQUM3QixJQUFJLENBQUMsR0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRXJCLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTs0QkFDWCxNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUM7NEJBQ3RCLEVBQUUsR0FBRyxFQUFFLENBQUM7NEJBQ1IsRUFBRSxHQUFHLEVBQUUsQ0FBQzs0QkFDUixDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNQO3dCQUVELGtCQUFrQjt3QkFDbEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFOzRCQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLElBQUksR0FBRyxFQUFFLENBQUM7eUJBQ1g7d0JBRUQsb0JBQW9CO3dCQUNwQixJQUFJLEdBQUcsY0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFFdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFOzRCQUNmLE9BQU8sS0FBSyxDQUFDO3lCQUNkO3FCQUNGO29CQUVELHFDQUFxQztvQkFDckMsa0RBQWtEO29CQUNsRCxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLEVBQUU7d0JBQ3hDLE9BQU8sS0FBSyxDQUFDO3FCQUNkO29CQUVELGdCQUFnQjtvQkFDaEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBRXZCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sV0FBVyxDQUFDLEtBQVM7b0JBQzFCLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO3dCQUFFLE9BQU8sS0FBSyxDQUFDO3FCQUFFO29CQUNqRixJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDakYsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxXQUFXLENBQUMsS0FBYTtvQkFDOUIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDN0QsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDN0QsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDN0QsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFBRSxPQUFPLEtBQUssQ0FBQztxQkFBRTtvQkFDN0QsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBOENELDRDQUE0QztZQUN0QywwQkFBMEIsR0FBb0IsSUFBSSw0QkFBZSxFQUFFLENBQUM7WUFDcEUsaUNBQWlDLEdBQW1CLElBQUksMkJBQWMsRUFBRSxDQUFDO1lBQ3pFLDJCQUEyQixHQUFxQixJQUFJLDZCQUFnQixFQUFFLENBQUMifQ==