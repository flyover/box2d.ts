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
    var __moduleName = context_1 && context_1.id;
    /// Compute the point states given two manifolds. The states pertain to the transition from manifold1
    /// to manifold2. So state1 is either persist or remove while state2 is either add or persist.
    function b2GetPointStates(state1, state2, manifold1, manifold2) {
        // Detect persists and removes.
        let i;
        for (i = 0; i < manifold1.pointCount; ++i) {
            const id = manifold1.points[i].id;
            const key = id.key;
            state1[i] = 3 /* b2_removeState */;
            for (let j = 0, jct = manifold2.pointCount; j < jct; ++j) {
                if (manifold2.points[j].id.key === key) {
                    state1[i] = 2 /* b2_persistState */;
                    break;
                }
            }
        }
        for (; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
            state1[i] = 0 /* b2_nullState */;
        }
        // Detect persists and adds.
        for (i = 0; i < manifold2.pointCount; ++i) {
            const id = manifold2.points[i].id;
            const key = id.key;
            state2[i] = 1 /* b2_addState */;
            for (let j = 0, jct = manifold1.pointCount; j < jct; ++j) {
                if (manifold1.points[j].id.key === key) {
                    state2[i] = 2 /* b2_persistState */;
                    break;
                }
            }
        }
        for (; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
            state2[i] = 0 /* b2_nullState */;
        }
    }
    exports_1("b2GetPointStates", b2GetPointStates);
    function b2TestOverlapAABB(a, b) {
        const d1_x = b.lowerBound.x - a.upperBound.x;
        const d1_y = b.lowerBound.y - a.upperBound.y;
        const d2_x = a.lowerBound.x - b.upperBound.x;
        const d2_y = a.lowerBound.y - b.upperBound.y;
        if (d1_x > 0 || d1_y > 0)
            return false;
        if (d2_x > 0 || d2_y > 0)
            return false;
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
        if (distance0 <= 0)
            vOut[numOut++].Copy(vIn0);
        if (distance1 <= 0)
            vOut[numOut++].Copy(vIn1);
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
            id.cf.typeA = 0 /* e_vertex */;
            id.cf.typeB = 1 /* e_face */;
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
    var b2Settings_1, b2Math_1, b2Distance_1, b2ContactFeature, b2ContactID, b2ManifoldPoint, b2Manifold, b2WorldManifold, b2ClipVertex, b2RayCastInput, b2RayCastOutput, b2AABB, b2TestOverlapShape_s_input, b2TestOverlapShape_s_simplexCache, b2TestOverlapShape_s_output;
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
        execute: function () {/*
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
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2ManifoldPoint(); });
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
                    this.type = -1 /* e_unknown */;
                    this.pointCount = 0;
                }
                Reset() {
                    for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
                        ///b2Assert(this.points[i] instanceof b2ManifoldPoint);
                        this.points[i].Reset();
                    }
                    this.localNormal.SetZero();
                    this.localPoint.SetZero();
                    this.type = -1 /* e_unknown */;
                    this.pointCount = 0;
                }
                Copy(o) {
                    this.pointCount = o.pointCount;
                    for (let i = 0; i < b2Settings_1.b2_maxManifoldPoints; ++i) {
                        ///b2Assert(this.points[i] instanceof b2ManifoldPoint);
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
                        case 0 /* e_circles */:
                            {
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
                            }
                            break;
                        case 1 /* e_faceA */:
                            {
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
                            }
                            break;
                        case 2 /* e_faceB */:
                            {
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
                            }
                            break;
                    }
                }
            };
            b2WorldManifold.Initialize_s_pointA = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_pointB = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_cA = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_cB = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_planePoint = new b2Math_1.b2Vec2();
            b2WorldManifold.Initialize_s_clipPoint = new b2Math_1.b2Vec2();
            exports_1("b2WorldManifold", b2WorldManifold);
            /// Used for computing contact manifolds.
            b2ClipVertex = class b2ClipVertex {
                constructor() {
                    this.v = new b2Math_1.b2Vec2();
                    this.id = new b2ContactID();
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2ClipVertex(); });
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
                    const d_x = this.upperBound.x - this.lowerBound.x;
                    const d_y = this.upperBound.y - this.lowerBound.y;
                    let valid = d_x >= 0 && d_y >= 0;
                    valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
                    return valid;
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
                    let result = true;
                    result = result && this.lowerBound.x <= aabb.lowerBound.x;
                    result = result && this.lowerBound.y <= aabb.lowerBound.y;
                    result = result && aabb.upperBound.x <= this.upperBound.x;
                    result = result && aabb.upperBound.y <= this.upperBound.y;
                    return result;
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
                TestOverlap(other) {
                    const d1_x = other.lowerBound.x - this.upperBound.x;
                    const d1_y = other.lowerBound.y - this.upperBound.y;
                    const d2_x = this.lowerBound.x - other.upperBound.x;
                    const d2_y = this.lowerBound.y - other.upperBound.y;
                    if (d1_x > 0 || d1_y > 0)
                        return false;
                    if (d2_x > 0 || d2_y > 0)
                        return false;
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
