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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "../../Collision/b2Collision", "../b2TimeStep"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2TimeStep_1, b2VelocityConstraintPoint, b2ContactVelocityConstraint, b2ContactPositionConstraint, b2ContactSolverDef, b2PositionSolverManifold, b2ContactSolver;
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
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            }
        ],
        execute: function () {
            b2VelocityConstraintPoint = class b2VelocityConstraintPoint {
                constructor() {
                    this.rA = new b2Math_1.b2Vec2();
                    this.rB = new b2Math_1.b2Vec2();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.normalMass = 0;
                    this.tangentMass = 0;
                    this.velocityBias = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2VelocityConstraintPoint(); });
                }
            };
            exports_1("b2VelocityConstraintPoint", b2VelocityConstraintPoint);
            b2ContactVelocityConstraint = class b2ContactVelocityConstraint {
                constructor() {
                    this.points = b2VelocityConstraintPoint.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.normal = new b2Math_1.b2Vec2();
                    this.tangent = new b2Math_1.b2Vec2();
                    this.normalMass = new b2Math_1.b2Mat22();
                    this.K = new b2Math_1.b2Mat22();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.invIA = 0;
                    this.invIB = 0;
                    this.friction = 0;
                    this.restitution = 0;
                    this.tangentSpeed = 0;
                    this.pointCount = 0;
                    this.contactIndex = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2ContactVelocityConstraint(); });
                }
            };
            exports_1("b2ContactVelocityConstraint", b2ContactVelocityConstraint);
            b2ContactPositionConstraint = class b2ContactPositionConstraint {
                constructor() {
                    this.localPoints = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_1.b2Vec2();
                    this.localPoint = new b2Math_1.b2Vec2();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.localCenterA = new b2Math_1.b2Vec2();
                    this.localCenterB = new b2Math_1.b2Vec2();
                    this.invIA = 0;
                    this.invIB = 0;
                    this.type = b2Collision_2.b2ManifoldType.e_unknown;
                    this.radiusA = 0;
                    this.radiusB = 0;
                    this.pointCount = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2ContactPositionConstraint(); });
                }
            };
            exports_1("b2ContactPositionConstraint", b2ContactPositionConstraint);
            b2ContactSolverDef = class b2ContactSolverDef {
                constructor() {
                    this.step = new b2TimeStep_1.b2TimeStep();
                    this.contacts = null;
                    this.count = 0;
                    this.positions = null;
                    this.velocities = null;
                    this.allocator = null;
                }
            };
            exports_1("b2ContactSolverDef", b2ContactSolverDef);
            b2PositionSolverManifold = class b2PositionSolverManifold {
                constructor() {
                    this.normal = new b2Math_1.b2Vec2();
                    this.point = new b2Math_1.b2Vec2();
                    this.separation = 0;
                }
                Initialize(pc, xfA, xfB, index) {
                    const pointA = b2PositionSolverManifold.Initialize_s_pointA;
                    const pointB = b2PositionSolverManifold.Initialize_s_pointB;
                    const planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
                    const clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
                    ///b2Assert(pc.pointCount > 0);
                    switch (pc.type) {
                        case b2Collision_2.b2ManifoldType.e_circles:
                            {
                                // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                                b2Math_1.b2Transform.MulXV(xfA, pc.localPoint, pointA);
                                // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                                b2Math_1.b2Transform.MulXV(xfB, pc.localPoints[0], pointB);
                                // normal = pointB - pointA;
                                // normal.Normalize();
                                b2Math_1.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                                // point = 0.5f * (pointA + pointB);
                                b2Math_1.b2Vec2.MidVV(pointA, pointB, this.point);
                                // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                                this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            }
                            break;
                        case b2Collision_2.b2ManifoldType.e_faceA:
                            {
                                // normal = b2Mul(xfA.q, pc->localNormal);
                                b2Math_1.b2Rot.MulRV(xfA.q, pc.localNormal, this.normal);
                                // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                                b2Math_1.b2Transform.MulXV(xfA, pc.localPoint, planePoint);
                                // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                                b2Math_1.b2Transform.MulXV(xfB, pc.localPoints[index], clipPoint);
                                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                                this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                                // point = clipPoint;
                                this.point.Copy(clipPoint);
                            }
                            break;
                        case b2Collision_2.b2ManifoldType.e_faceB:
                            {
                                // normal = b2Mul(xfB.q, pc->localNormal);
                                b2Math_1.b2Rot.MulRV(xfB.q, pc.localNormal, this.normal);
                                // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                                b2Math_1.b2Transform.MulXV(xfB, pc.localPoint, planePoint);
                                // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                                b2Math_1.b2Transform.MulXV(xfA, pc.localPoints[index], clipPoint);
                                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                                this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                                // point = clipPoint;
                                this.point.Copy(clipPoint);
                                // Ensure normal points from A to B
                                // normal = -normal;
                                this.normal.SelfNeg();
                            }
                            break;
                    }
                }
            };
            b2PositionSolverManifold.Initialize_s_pointA = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_pointB = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_planePoint = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_clipPoint = new b2Math_1.b2Vec2();
            exports_1("b2PositionSolverManifold", b2PositionSolverManifold);
            b2ContactSolver = class b2ContactSolver {
                constructor() {
                    this.m_step = new b2TimeStep_1.b2TimeStep();
                    this.m_positions = null;
                    this.m_velocities = null;
                    this.m_allocator = null;
                    this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_contacts = null;
                    this.m_count = 0;
                }
                Initialize(def) {
                    this.m_step.Copy(def.step);
                    this.m_allocator = def.allocator;
                    this.m_count = def.count;
                    // TODO:
                    if (this.m_positionConstraints.length < this.m_count) {
                        const new_length = b2Math_1.b2Max(this.m_positionConstraints.length * 2, this.m_count);
                        while (this.m_positionConstraints.length < new_length) {
                            this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
                        }
                    }
                    // TODO:
                    if (this.m_velocityConstraints.length < this.m_count) {
                        const new_length = b2Math_1.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
                        while (this.m_velocityConstraints.length < new_length) {
                            this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
                        }
                    }
                    this.m_positions = def.positions;
                    this.m_velocities = def.velocities;
                    this.m_contacts = def.contacts;
                    // Initialize position independent portions of the constraints.
                    for (let i = 0; i < this.m_count; ++i) {
                        const contact = this.m_contacts[i];
                        const fixtureA = contact.m_fixtureA;
                        const fixtureB = contact.m_fixtureB;
                        const shapeA = fixtureA.GetShape();
                        const shapeB = fixtureB.GetShape();
                        const radiusA = shapeA.m_radius;
                        const radiusB = shapeB.m_radius;
                        const bodyA = fixtureA.GetBody();
                        const bodyB = fixtureB.GetBody();
                        const manifold = contact.GetManifold();
                        const pointCount = manifold.pointCount;
                        ///b2Assert(pointCount > 0);
                        const vc = this.m_velocityConstraints[i];
                        vc.friction = contact.m_friction;
                        vc.restitution = contact.m_restitution;
                        vc.tangentSpeed = contact.m_tangentSpeed;
                        vc.indexA = bodyA.m_islandIndex;
                        vc.indexB = bodyB.m_islandIndex;
                        vc.invMassA = bodyA.m_invMass;
                        vc.invMassB = bodyB.m_invMass;
                        vc.invIA = bodyA.m_invI;
                        vc.invIB = bodyB.m_invI;
                        vc.contactIndex = i;
                        vc.pointCount = pointCount;
                        vc.K.SetZero();
                        vc.normalMass.SetZero();
                        const pc = this.m_positionConstraints[i];
                        pc.indexA = bodyA.m_islandIndex;
                        pc.indexB = bodyB.m_islandIndex;
                        pc.invMassA = bodyA.m_invMass;
                        pc.invMassB = bodyB.m_invMass;
                        pc.localCenterA.Copy(bodyA.m_sweep.localCenter);
                        pc.localCenterB.Copy(bodyB.m_sweep.localCenter);
                        pc.invIA = bodyA.m_invI;
                        pc.invIB = bodyB.m_invI;
                        pc.localNormal.Copy(manifold.localNormal);
                        pc.localPoint.Copy(manifold.localPoint);
                        pc.pointCount = pointCount;
                        pc.radiusA = radiusA;
                        pc.radiusB = radiusB;
                        pc.type = manifold.type;
                        for (let j = 0; j < pointCount; ++j) {
                            const cp = manifold.points[j];
                            const vcp = vc.points[j];
                            if (this.m_step.warmStarting) {
                                vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                                vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
                            }
                            else {
                                vcp.normalImpulse = 0;
                                vcp.tangentImpulse = 0;
                            }
                            vcp.rA.SetZero();
                            vcp.rB.SetZero();
                            vcp.normalMass = 0;
                            vcp.tangentMass = 0;
                            vcp.velocityBias = 0;
                            pc.localPoints[j].Copy(cp.localPoint);
                        }
                    }
                    return this;
                }
                InitializeVelocityConstraints() {
                    const xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
                    const xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
                    const worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
                    const k_maxConditionNumber = 1000;
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const pc = this.m_positionConstraints[i];
                        const radiusA = pc.radiusA;
                        const radiusB = pc.radiusB;
                        const manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const mB = vc.invMassB;
                        const iA = vc.invIA;
                        const iB = vc.invIB;
                        const localCenterA = pc.localCenterA;
                        const localCenterB = pc.localCenterB;
                        const cA = this.m_positions[indexA].c;
                        const aA = this.m_positions[indexA].a;
                        const vA = this.m_velocities[indexA].v;
                        const wA = this.m_velocities[indexA].w;
                        const cB = this.m_positions[indexB].c;
                        const aB = this.m_positions[indexB].a;
                        const vB = this.m_velocities[indexB].v;
                        const wB = this.m_velocities[indexB].w;
                        ///b2Assert(manifold.pointCount > 0);
                        xfA.q.SetAngle(aA);
                        xfB.q.SetAngle(aB);
                        b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                        b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                        worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
                        vc.normal.Copy(worldManifold.normal);
                        b2Math_1.b2Vec2.CrossVOne(vc.normal, vc.tangent); // compute from normal
                        const pointCount = vc.pointCount;
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // vcp->rA = worldManifold.points[j] - cA;
                            b2Math_1.b2Vec2.SubVV(worldManifold.points[j], cA, vcp.rA);
                            // vcp->rB = worldManifold.points[j] - cB;
                            b2Math_1.b2Vec2.SubVV(worldManifold.points[j], cB, vcp.rB);
                            const rnA = b2Math_1.b2Vec2.CrossVV(vcp.rA, vc.normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(vcp.rB, vc.normal);
                            const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                            // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                            const tangent = vc.tangent; // precomputed from normal
                            const rtA = b2Math_1.b2Vec2.CrossVV(vcp.rA, tangent);
                            const rtB = b2Math_1.b2Vec2.CrossVV(vcp.rB, tangent);
                            const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                            vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                            // Setup a velocity bias for restitution.
                            vcp.velocityBias = 0;
                            // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                            const vRel = b2Math_1.b2Vec2.DotVV(vc.normal, b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0));
                            if (vRel < (-b2Settings_1.b2_velocityThreshold)) {
                                vcp.velocityBias += (-vc.restitution * vRel);
                            }
                        }
                        // If we have two points, then prepare the block solver.
                        if (vc.pointCount === 2) {
                            const vcp1 = vc.points[0];
                            const vcp2 = vc.points[1];
                            const rn1A = b2Math_1.b2Vec2.CrossVV(vcp1.rA, vc.normal);
                            const rn1B = b2Math_1.b2Vec2.CrossVV(vcp1.rB, vc.normal);
                            const rn2A = b2Math_1.b2Vec2.CrossVV(vcp2.rA, vc.normal);
                            const rn2B = b2Math_1.b2Vec2.CrossVV(vcp2.rB, vc.normal);
                            const k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
                            const k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
                            const k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;
                            // Ensure a reasonable condition number.
                            // float32 k_maxConditionNumber = 1000.0f;
                            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
                                // K is safe to invert.
                                vc.K.ex.Set(k11, k12);
                                vc.K.ey.Set(k12, k22);
                                vc.K.GetInverse(vc.normalMass);
                            }
                            else {
                                // The constraints are redundant, just use one.
                                // TODO_ERIN use deepest?
                                vc.pointCount = 1;
                            }
                        }
                    }
                }
                WarmStart() {
                    const P = b2ContactSolver.WarmStart_s_P;
                    // Warm start.
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const iA = vc.invIA;
                        const mB = vc.invMassB;
                        const iB = vc.invIB;
                        const pointCount = vc.pointCount;
                        const vA = this.m_velocities[indexA].v;
                        let wA = this.m_velocities[indexA].w;
                        const vB = this.m_velocities[indexB].v;
                        let wB = this.m_velocities[indexB].w;
                        const normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        const tangent = vc.tangent; // precomputed from normal
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // b2Vec2 P = vcp->normalImpulse * normal + vcp->tangentImpulse * tangent;
                            b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.MulSV(vcp.normalImpulse, normal, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.MulSV(vcp.tangentImpulse, tangent, b2Math_1.b2Vec2.s_t1), P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                SolveVelocityConstraints() {
                    const dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
                    const dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
                    const dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
                    const P = b2ContactSolver.SolveVelocityConstraints_s_P;
                    const a = b2ContactSolver.SolveVelocityConstraints_s_a;
                    const b = b2ContactSolver.SolveVelocityConstraints_s_b;
                    const x = b2ContactSolver.SolveVelocityConstraints_s_x;
                    const d = b2ContactSolver.SolveVelocityConstraints_s_d;
                    const P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
                    const P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
                    const P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const iA = vc.invIA;
                        const mB = vc.invMassB;
                        const iB = vc.invIB;
                        const pointCount = vc.pointCount;
                        const vA = this.m_velocities[indexA].v;
                        let wA = this.m_velocities[indexA].w;
                        const vB = this.m_velocities[indexB].v;
                        let wB = this.m_velocities[indexB].w;
                        // b2Vec2 normal = vc->normal;
                        const normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        const tangent = vc.tangent; // precomputed from normal
                        const friction = vc.friction;
                        ///b2Assert(pointCount === 1 || pointCount === 2);
                        // Solve tangent constraints first because non-penetration is more important
                        // than friction.
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), dv);
                            // Compute tangent force
                            // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                            const vt = b2Math_1.b2Vec2.DotVV(dv, tangent) - vc.tangentSpeed;
                            let lambda = vcp.tangentMass * (-vt);
                            // b2Clamp the accumulated force
                            const maxFriction = friction * vcp.normalImpulse;
                            const newImpulse = b2Math_1.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                            lambda = newImpulse - vcp.tangentImpulse;
                            vcp.tangentImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * tangent;
                            b2Math_1.b2Vec2.MulSV(lambda, tangent, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        // Solve normal constraints
                        if (vc.pointCount === 1) {
                            const vcp = vc.points[0];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), dv);
                            // Compute normal impulse
                            // float32 vn = b2Dot(dv, normal);
                            const vn = b2Math_1.b2Vec2.DotVV(dv, normal);
                            let lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                            // b2Clamp the accumulated impulse
                            // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                            const newImpulse = b2Math_1.b2Max(vcp.normalImpulse + lambda, 0);
                            lambda = newImpulse - vcp.normalImpulse;
                            vcp.normalImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * normal;
                            b2Math_1.b2Vec2.MulSV(lambda, normal, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        else {
                            // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                            // Build the mini LCP for this contact patch
                            //
                            // vn = A * x + b, vn >= 0, , vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
                            //
                            // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
                            // b = vn0 - velocityBias
                            //
                            // The system is solved using the "Total enumeration method" (s. Murty). The complementary constraint vn_i * x_i
                            // implies that we must have in any solution either vn_i = 0 or x_i = 0. So for the 2D contact problem the cases
                            // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and vn1 = 0 need to be tested. The first valid
                            // solution that satisfies the problem is chosen.
                            //
                            // In order to account of the accumulated impulse 'a' (because of the iterative nature of the solver which only requires
                            // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse variable (x_i).
                            //
                            // Substitute:
                            //
                            // x = a + d
                            //
                            // a := old total impulse
                            // x := new total impulse
                            // d := incremental impulse
                            //
                            // For the current iteration we extend the formula for the incremental impulse
                            // to compute the new total impulse:
                            //
                            // vn = A * d + b
                            //    = A * (x - a) + b
                            //    = A * x + b - A * a
                            //    = A * x + b'
                            // b' = b - A * a;
                            const cp1 = vc.points[0];
                            const cp2 = vc.points[1];
                            // b2Vec2 a(cp1->normalImpulse, cp2->normalImpulse);
                            a.Set(cp1.normalImpulse, cp2.normalImpulse);
                            ///b2Assert(a.x >= 0 && a.y >= 0);
                            // Relative velocity at contact
                            // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, cp1.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, cp1.rA, b2Math_1.b2Vec2.s_t1), dv1);
                            // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, cp2.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, cp2.rA, b2Math_1.b2Vec2.s_t1), dv2);
                            // Compute normal velocity
                            // float32 vn1 = b2Dot(dv1, normal);
                            let vn1 = b2Math_1.b2Vec2.DotVV(dv1, normal);
                            // float32 vn2 = b2Dot(dv2, normal);
                            let vn2 = b2Math_1.b2Vec2.DotVV(dv2, normal);
                            // b2Vec2 b;
                            b.x = vn1 - cp1.velocityBias;
                            b.y = vn2 - cp2.velocityBias;
                            // Compute b'
                            // b -= b2Mul(vc->K, a);
                            b.SelfSub(b2Math_1.b2Mat22.MulMV(vc.K, a, b2Math_1.b2Vec2.s_t0));
                            /*
                            #if B2_DEBUG_SOLVER === 1
                            const k_errorTol: number = 0.001;
                            #endif
                            */
                            for (;;) {
                                //
                                // Case 1: vn = 0
                                //
                                // 0 = A * x + b'
                                //
                                // Solve for x:
                                //
                                // x = - inv(A) * b'
                                //
                                // b2Vec2 x = - b2Mul(vc->normalMass, b);
                                b2Math_1.b2Mat22.MulMV(vc.normalMass, b, x).SelfNeg();
                                if (x.x >= 0 && x.y >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                                    vn2 = b2Dot(dv2, normal);
                        
                                    ///b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                                    ///b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 2: vn1 = 0 and x2 = 0
                                //
                                //   0 = a11 * x1 + a12 * 0 + b1'
                                // vn2 = a21 * x1 + a22 * 0 + b2'
                                //
                                x.x = (-cp1.normalMass * b.x);
                                x.y = 0;
                                vn1 = 0;
                                vn2 = vc.K.ex.y * x.x + b.y;
                                if (x.x >= 0 && vn2 >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                        
                                    ///b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 3: vn2 = 0 and x1 = 0
                                //
                                // vn1 = a11 * 0 + a12 * x2 + b1'
                                //   0 = a21 * 0 + a22 * x2 + b2'
                                //
                                x.x = 0;
                                x.y = (-cp2.normalMass * b.y);
                                vn1 = vc.K.ey.x * x.y + b.x;
                                vn2 = 0;
                                if (x.y >= 0 && vn1 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn2 = b2Dot(dv2, normal);
                        
                                    ///b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 4: x1 = 0 and x2 = 0
                                //
                                // vn1 = b1
                                // vn2 = b2;
                                x.x = 0;
                                x.y = 0;
                                vn1 = b.x;
                                vn2 = b.y;
                                if (vn1 >= 0 && vn2 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    break;
                                }
                                // No solution, give up. This is hit sometimes, but it doesn't seem to matter.
                                break;
                            }
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                StoreImpulses() {
                    for (let i = 0; i < this.m_count; ++i) {
                        let vc = this.m_velocityConstraints[i];
                        let manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        for (let j = 0; j < vc.pointCount; ++j) {
                            manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                            manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
                        }
                    }
                }
                SolvePositionConstraints() {
                    const xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolvePositionConstraints_s_psm;
                    const rA = b2ContactSolver.SolvePositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolvePositionConstraints_s_rB;
                    const P = b2ContactSolver.SolvePositionConstraints_s_P;
                    let minSeparation = 0;
                    for (let i = 0; i < this.m_count; ++i) {
                        const pc = this.m_positionConstraints[i];
                        const indexA = pc.indexA;
                        const indexB = pc.indexB;
                        const localCenterA = pc.localCenterA;
                        const mA = pc.invMassA;
                        const iA = pc.invIA;
                        const localCenterB = pc.localCenterB;
                        const mB = pc.invMassB;
                        const iB = pc.invIB;
                        const pointCount = pc.pointCount;
                        const cA = this.m_positions[indexA].c;
                        let aA = this.m_positions[indexA].a;
                        const cB = this.m_positions[indexB].c;
                        let aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (let j = 0; j < pointCount; ++j) {
                            xfA.q.SetAngle(aA);
                            xfB.q.SetAngle(aB);
                            b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                            b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_1.b2Clamp(b2Settings_1.b2_baumgarte * (separation + b2Settings_1.b2_linearSlop), (-b2Settings_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation > (-3 * b2Settings_1.b2_linearSlop);
                }
                SolveTOIPositionConstraints(toiIndexA, toiIndexB) {
                    const xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
                    const rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
                    const P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
                    let minSeparation = 0;
                    for (let i = 0; i < this.m_count; ++i) {
                        const pc = this.m_positionConstraints[i];
                        const indexA = pc.indexA;
                        const indexB = pc.indexB;
                        const localCenterA = pc.localCenterA;
                        const localCenterB = pc.localCenterB;
                        const pointCount = pc.pointCount;
                        let mA = 0;
                        let iA = 0;
                        if (indexA === toiIndexA || indexA === toiIndexB) {
                            mA = pc.invMassA;
                            iA = pc.invIA;
                        }
                        let mB = 0;
                        let iB = 0;
                        if (indexB === toiIndexA || indexB === toiIndexB) {
                            mB = pc.invMassB;
                            iB = pc.invIB;
                        }
                        const cA = this.m_positions[indexA].c;
                        let aA = this.m_positions[indexA].a;
                        const cB = this.m_positions[indexB].c;
                        let aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (let j = 0; j < pointCount; ++j) {
                            xfA.q.SetAngle(aA);
                            xfB.q.SetAngle(aB);
                            b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                            b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_1.b2Clamp(b2Settings_1.b2_toiBaumgarte * (separation + b2Settings_1.b2_linearSlop), (-b2Settings_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation >= -1.5 * b2Settings_1.b2_linearSlop;
                }
            };
            b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2Collision_1.b2WorldManifold();
            b2ContactSolver.WarmStart_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_a = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_b = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_x = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_d = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolvePositionConstraints_s_rA = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_rB = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2Math_1.b2Vec2();
            exports_1("b2ContactSolver", b2ContactSolver);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0U29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250YWN0U29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBY0YsNEJBQUE7Z0JBQUE7b0JBQ1MsT0FBRSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzFCLE9BQUUsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMxQixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFLbEMsQ0FBQztnQkFIUSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7b0JBQ3BDLE9BQU8sd0JBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksT0FBTyxJQUFJLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsQ0FBQzthQUNGLENBQUE7O1lBRUQsOEJBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFnQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsaUNBQW9CLENBQUMsQ0FBQztvQkFDaEcsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzlCLFlBQU8sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMvQixlQUFVLEdBQVksSUFBSSxnQkFBTyxFQUFFLENBQUM7b0JBQ3BDLE1BQUMsR0FBWSxJQUFJLGdCQUFPLEVBQUUsQ0FBQztvQkFDM0IsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFDbEIsVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFDbEIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixlQUFVLEdBQVcsQ0FBQyxDQUFDO29CQUN2QixpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFLbEMsQ0FBQztnQkFIUSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7b0JBQ3BDLE9BQU8sd0JBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksT0FBTyxJQUFJLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztnQkFDMUYsQ0FBQzthQUNGLENBQUE7O1lBRUQsOEJBQUE7Z0JBQUE7b0JBQ1MsZ0JBQVcsR0FBYSxlQUFNLENBQUMsU0FBUyxDQUFDLGlDQUFvQixDQUFDLENBQUM7b0JBQy9ELGdCQUFXLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDbkMsZUFBVSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ2xDLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGlCQUFZLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDcEMsaUJBQVksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNwQyxVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUNsQixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUNsQixTQUFJLEdBQW1CLDRCQUFjLENBQUMsU0FBUyxDQUFDO29CQUNoRCxZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNwQixlQUFVLEdBQVcsQ0FBQyxDQUFDO2dCQUtoQyxDQUFDO2dCQUhRLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztvQkFDcEMsT0FBTyx3QkFBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxPQUFPLElBQUksMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUMxRixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxxQkFBQTtnQkFBQTtvQkFDUyxTQUFJLEdBQWUsSUFBSSx1QkFBVSxFQUFFLENBQUM7b0JBQ3BDLGFBQVEsR0FBZ0IsSUFBSSxDQUFDO29CQUM3QixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUNsQixjQUFTLEdBQWlCLElBQUksQ0FBQztvQkFDL0IsZUFBVSxHQUFpQixJQUFJLENBQUM7b0JBQ2hDLGNBQVMsR0FBUSxJQUFJLENBQUM7Z0JBQy9CLENBQUM7YUFBQSxDQUFBOztZQUVELDJCQUFBO2dCQUFBO29CQUNTLFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUM5QixVQUFLLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDN0IsZUFBVSxHQUFXLENBQUMsQ0FBQztnQkFpRWhDLENBQUM7Z0JBM0RRLFVBQVUsQ0FBQyxFQUErQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0IsRUFBRSxLQUFhO29CQUNsRyxNQUFNLE1BQU0sR0FBVyx3QkFBd0IsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDcEUsTUFBTSxNQUFNLEdBQVcsd0JBQXdCLENBQUMsbUJBQW1CLENBQUM7b0JBQ3BFLE1BQU0sVUFBVSxHQUFXLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDO29CQUM1RSxNQUFNLFNBQVMsR0FBVyx3QkFBd0IsQ0FBQyxzQkFBc0IsQ0FBQztvQkFFMUUsK0JBQStCO29CQUUvQixRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUU7d0JBQ2pCLEtBQUssNEJBQWMsQ0FBQyxTQUFTOzRCQUFFO2dDQUMzQiw4Q0FBOEM7Z0NBQzlDLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dDQUM5QyxrREFBa0Q7Z0NBQ2xELG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dDQUNsRCw0QkFBNEI7Z0NBQzVCLHNCQUFzQjtnQ0FDdEIsZUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQ0FDMUQsb0NBQW9DO2dDQUNwQyxlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUN6Qyw0REFBNEQ7Z0NBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7NkJBQ2xIOzRCQUNELE1BQU07d0JBRVIsS0FBSyw0QkFBYyxDQUFDLE9BQU87NEJBQUU7Z0NBQ3pCLDBDQUEwQztnQ0FDMUMsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUNoRCxrREFBa0Q7Z0NBQ2xELG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dDQUVsRCx5REFBeUQ7Z0NBQ3pELG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dDQUN6RCxtRUFBbUU7Z0NBQ25FLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0NBQ3hILHFCQUFxQjtnQ0FDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQzVCOzRCQUNELE1BQU07d0JBRVIsS0FBSyw0QkFBYyxDQUFDLE9BQU87NEJBQUU7Z0NBQ3pCLDBDQUEwQztnQ0FDMUMsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUNoRCxrREFBa0Q7Z0NBQ2xELG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dDQUVsRCx5REFBeUQ7Z0NBQ3pELG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dDQUN6RCxtRUFBbUU7Z0NBQ25FLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0NBQ3hILHFCQUFxQjtnQ0FDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBRTNCLG1DQUFtQztnQ0FDbkMsb0JBQW9CO2dDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzZCQUN2Qjs0QkFDRCxNQUFNO3FCQUNQO2dCQUNILENBQUM7YUFDRixDQUFBO1lBL0RnQiw0Q0FBbUIsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ25DLDRDQUFtQixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDbkMsZ0RBQXVCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUN2QywrQ0FBc0IsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDOztZQThEdkQsa0JBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFlLElBQUksdUJBQVUsRUFBRSxDQUFDO29CQUN0QyxnQkFBVyxHQUFpQixJQUFJLENBQUM7b0JBQ2pDLGlCQUFZLEdBQWlCLElBQUksQ0FBQztvQkFDbEMsZ0JBQVcsR0FBUSxJQUFJLENBQUM7b0JBQ3hCLDBCQUFxQixHQUFrQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBQ3ZILDBCQUFxQixHQUFrQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBQ3ZILGVBQVUsR0FBZ0IsSUFBSSxDQUFDO29CQUMvQixZQUFPLEdBQVcsQ0FBQyxDQUFDO2dCQTgyQjdCLENBQUM7Z0JBNTJCUSxVQUFVLENBQUMsR0FBdUI7b0JBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO29CQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ3pCLFFBQVE7b0JBQ1IsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ3BELE1BQU0sVUFBVSxHQUFXLGNBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3RGLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxVQUFVLEVBQUU7NEJBQ3JELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSwyQkFBMkIsRUFBRSxDQUFDO3lCQUNuRztxQkFDRjtvQkFDRCxRQUFRO29CQUNSLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNwRCxNQUFNLFVBQVUsR0FBVyxjQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN0RixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsVUFBVSxFQUFFOzRCQUNyRCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksMkJBQTJCLEVBQUUsQ0FBQzt5QkFDbkc7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO29CQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7b0JBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztvQkFFL0IsK0RBQStEO29CQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDN0MsTUFBTSxPQUFPLEdBQWMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFOUMsTUFBTSxRQUFRLEdBQWMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt3QkFDL0MsTUFBTSxRQUFRLEdBQWMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt3QkFDL0MsTUFBTSxNQUFNLEdBQVksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUM1QyxNQUFNLE1BQU0sR0FBWSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQzVDLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUM7d0JBQ3hDLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUM7d0JBQ3hDLE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDekMsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN6QyxNQUFNLFFBQVEsR0FBZSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBRW5ELE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQUM7d0JBQy9DLDRCQUE0Qjt3QkFFNUIsTUFBTSxFQUFFLEdBQWdDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEUsRUFBRSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUNqQyxFQUFFLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7d0JBQ3ZDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQzt3QkFDekMsRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO3dCQUNoQyxFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7d0JBQ2hDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDOUIsRUFBRSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO3dCQUM5QixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7d0JBQ3hCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzt3QkFDeEIsRUFBRSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7d0JBQ3BCLEVBQUUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO3dCQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNmLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRXhCLE1BQU0sRUFBRSxHQUFnQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzt3QkFDaEMsRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO3dCQUNoQyxFQUFFLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7d0JBQzlCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDOUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDaEQsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDaEQsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO3dCQUN4QixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7d0JBQ3hCLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN4QyxFQUFFLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzt3QkFDM0IsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7d0JBQ3JCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO3dCQUNyQixFQUFFLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBRXhCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQzNDLE1BQU0sRUFBRSxHQUFvQixRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvQyxNQUFNLEdBQUcsR0FBOEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtnQ0FDNUIsR0FBRyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO2dDQUMzRCxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7NkJBQzlEO2lDQUFNO2dDQUNMLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QixHQUFHLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQzs2QkFDeEI7NEJBRUQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDakIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDakIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7NEJBQ25CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDOzRCQUNwQixHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQzs0QkFFckIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3lCQUN2QztxQkFDRjtvQkFFRCxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUtNLDZCQUE2QjtvQkFDbEMsTUFBTSxHQUFHLEdBQWdCLGVBQWUsQ0FBQyxtQ0FBbUMsQ0FBQztvQkFDN0UsTUFBTSxHQUFHLEdBQWdCLGVBQWUsQ0FBQyxtQ0FBbUMsQ0FBQztvQkFDN0UsTUFBTSxhQUFhLEdBQW9CLGVBQWUsQ0FBQyw2Q0FBNkMsQ0FBQztvQkFFckcsTUFBTSxvQkFBb0IsR0FBVyxJQUFJLENBQUM7b0JBRTFDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUM3QyxNQUFNLEVBQUUsR0FBZ0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0RSxNQUFNLEVBQUUsR0FBZ0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0RSxNQUFNLE9BQU8sR0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDO3dCQUNuQyxNQUFNLE9BQU8sR0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDO3dCQUNuQyxNQUFNLFFBQVEsR0FBZSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFFNUUsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFFakMsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDNUIsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDNUIsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFDN0MsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFFN0MsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRS9DLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUMsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUUvQyxxQ0FBcUM7d0JBRXJDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQixHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbkIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2RSxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxjQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRXZFLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUUvRCxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3JDLGVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7d0JBRS9ELE1BQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQzNDLE1BQU0sR0FBRyxHQUE4QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUVwRCwwQ0FBMEM7NEJBQzFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRCwwQ0FBMEM7NEJBQzFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUVsRCxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN0RCxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUV0RCxNQUFNLE9BQU8sR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDOzRCQUVsRSxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFL0MsOENBQThDOzRCQUM5QyxNQUFNLE9BQU8sR0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsMEJBQTBCOzRCQUU5RCxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7NEJBQ3BELE1BQU0sR0FBRyxHQUFXLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs0QkFFcEQsTUFBTSxRQUFRLEdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQzs0QkFFbkUsR0FBRyxDQUFDLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRWxELHlDQUF5Qzs0QkFDekMsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7NEJBQ3JCLDJGQUEyRjs0QkFDM0YsTUFBTSxJQUFJLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FDL0IsRUFBRSxDQUFDLE1BQU0sRUFDVCxlQUFNLENBQUMsS0FBSyxDQUNWLGVBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDL0MsZUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUMvQyxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlDQUFvQixDQUFDLEVBQUU7Z0NBQ2xDLEdBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7NkJBQzlDO3lCQUNGO3dCQUVELHdEQUF3RDt3QkFDeEQsSUFBSSxFQUFFLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTs0QkFDdkIsTUFBTSxJQUFJLEdBQThCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JELE1BQU0sSUFBSSxHQUE4QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUVyRCxNQUFNLElBQUksR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN4RCxNQUFNLElBQUksR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN4RCxNQUFNLElBQUksR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN4RCxNQUFNLElBQUksR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUV4RCxNQUFNLEdBQUcsR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUNsRSxNQUFNLEdBQUcsR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUNsRSxNQUFNLEdBQUcsR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUVsRSx3Q0FBd0M7NEJBQ3hDLDBDQUEwQzs0QkFDMUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLG9CQUFvQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0NBQzlELHVCQUF1QjtnQ0FDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQ0FDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQ0FDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzZCQUNoQztpQ0FBTTtnQ0FDTCwrQ0FBK0M7Z0NBQy9DLHlCQUF5QjtnQ0FDekIsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7NkJBQ25CO3lCQUNGO3FCQUNGO2dCQUNILENBQUM7Z0JBR00sU0FBUztvQkFDZCxNQUFNLENBQUMsR0FBVyxlQUFlLENBQUMsYUFBYSxDQUFDO29CQUVoRCxjQUFjO29CQUNkLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUM3QyxNQUFNLEVBQUUsR0FBZ0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0RSxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQyxNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLFVBQVUsR0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO3dCQUV6QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFN0MsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakMsMENBQTBDO3dCQUMxQyxNQUFNLE9BQU8sR0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsMEJBQTBCO3dCQUU5RCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFOzRCQUMzQyxNQUFNLEdBQUcsR0FBOEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDcEQsMEVBQTBFOzRCQUMxRSxlQUFNLENBQUMsS0FBSyxDQUNWLGVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUNwRCxlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDdEQsQ0FBQyxDQUFDLENBQUM7NEJBQ0wsa0NBQWtDOzRCQUNsQyxFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsa0NBQWtDOzRCQUNsQyxFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDdEI7d0JBRUQsb0NBQW9DO3dCQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ2pDLG9DQUFvQzt3QkFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO3FCQUNsQztnQkFDSCxDQUFDO2dCQWFNLHdCQUF3QjtvQkFDN0IsTUFBTSxFQUFFLEdBQVcsZUFBZSxDQUFDLDZCQUE2QixDQUFDO29CQUNqRSxNQUFNLEdBQUcsR0FBVyxlQUFlLENBQUMsOEJBQThCLENBQUM7b0JBQ25FLE1BQU0sR0FBRyxHQUFXLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQztvQkFDbkUsTUFBTSxDQUFDLEdBQVcsZUFBZSxDQUFDLDRCQUE0QixDQUFDO29CQUMvRCxNQUFNLENBQUMsR0FBVyxlQUFlLENBQUMsNEJBQTRCLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxHQUFXLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQztvQkFDL0QsTUFBTSxDQUFDLEdBQVcsZUFBZSxDQUFDLDRCQUE0QixDQUFDO29CQUMvRCxNQUFNLENBQUMsR0FBVyxlQUFlLENBQUMsNEJBQTRCLENBQUM7b0JBQy9ELE1BQU0sRUFBRSxHQUFXLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQztvQkFDakUsTUFBTSxFQUFFLEdBQVcsZUFBZSxDQUFDLDZCQUE2QixDQUFDO29CQUNqRSxNQUFNLElBQUksR0FBVyxlQUFlLENBQUMsK0JBQStCLENBQUM7b0JBRXJFLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUM3QyxNQUFNLEVBQUUsR0FBZ0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0RSxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQyxNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLFVBQVUsR0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO3dCQUV6QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFN0MsOEJBQThCO3dCQUM5QixNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQywwQ0FBMEM7d0JBQzFDLE1BQU0sT0FBTyxHQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQywwQkFBMEI7d0JBQzlELE1BQU0sUUFBUSxHQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7d0JBRXJDLGtEQUFrRDt3QkFFbEQsNEVBQTRFO3dCQUM1RSxpQkFBaUI7d0JBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQzNDLE1BQU0sR0FBRyxHQUE4QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUVwRCwrQkFBK0I7NEJBQy9CLHFFQUFxRTs0QkFDckUsZUFBTSxDQUFDLEtBQUssQ0FDVixlQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQy9DLGVBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDL0MsRUFBRSxDQUFDLENBQUM7NEJBRU4sd0JBQXdCOzRCQUN4QixzREFBc0Q7NEJBQ3RELE1BQU0sRUFBRSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQy9ELElBQUksTUFBTSxHQUFXLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUU3QyxnQ0FBZ0M7NEJBQ2hDLE1BQU0sV0FBVyxHQUFXLFFBQVEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDOzRCQUN6RCxNQUFNLFVBQVUsR0FBVyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQzs0QkFDN0YsTUFBTSxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDOzRCQUN6QyxHQUFHLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQzs0QkFFaEMsd0JBQXdCOzRCQUN4QiwrQkFBK0I7NEJBQy9CLGVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFFakMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsa0NBQWtDOzRCQUNsQyxFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFFckMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsa0NBQWtDOzRCQUNsQyxFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDdEM7d0JBRUQsMkJBQTJCO3dCQUMzQixJQUFJLEVBQUUsQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFOzRCQUN2QixNQUFNLEdBQUcsR0FBOEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFcEQsK0JBQStCOzRCQUMvQixxRUFBcUU7NEJBQ3JFLGVBQU0sQ0FBQyxLQUFLLENBQ1YsZUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUMvQyxlQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQy9DLEVBQUUsQ0FBQyxDQUFDOzRCQUVOLHlCQUF5Qjs0QkFDekIsa0NBQWtDOzRCQUNsQyxNQUFNLEVBQUUsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDNUMsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBRWpFLGtDQUFrQzs0QkFDbEMsaUVBQWlFOzRCQUNqRSxNQUFNLFVBQVUsR0FBVyxjQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2hFLE1BQU0sR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQzs0QkFDeEMsR0FBRyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7NEJBRS9CLHdCQUF3Qjs0QkFDeEIsOEJBQThCOzRCQUM5QixlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2hDLGdCQUFnQjs0QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLGtDQUFrQzs0QkFDbEMsRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBRXJDLGdCQUFnQjs0QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLGtDQUFrQzs0QkFDbEMsRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3RDOzZCQUFNOzRCQUNMLDZGQUE2Rjs0QkFDN0YsNENBQTRDOzRCQUM1QyxFQUFFOzRCQUNGLDhFQUE4RTs0QkFDOUUsRUFBRTs0QkFDRixvREFBb0Q7NEJBQ3BELHlCQUF5Qjs0QkFDekIsRUFBRTs0QkFDRixnSEFBZ0g7NEJBQ2hILGdIQUFnSDs0QkFDaEgsb0hBQW9IOzRCQUNwSCxpREFBaUQ7NEJBQ2pELEVBQUU7NEJBQ0Ysd0hBQXdIOzRCQUN4SCxpSEFBaUg7NEJBQ2pILEVBQUU7NEJBQ0YsY0FBYzs0QkFDZCxFQUFFOzRCQUNGLFlBQVk7NEJBQ1osRUFBRTs0QkFDRix5QkFBeUI7NEJBQ3pCLHlCQUF5Qjs0QkFDekIsMkJBQTJCOzRCQUMzQixFQUFFOzRCQUNGLDhFQUE4RTs0QkFDOUUsb0NBQW9DOzRCQUNwQyxFQUFFOzRCQUNGLGlCQUFpQjs0QkFDakIsdUJBQXVCOzRCQUN2Qix5QkFBeUI7NEJBQ3pCLGtCQUFrQjs0QkFDbEIsa0JBQWtCOzRCQUVsQixNQUFNLEdBQUcsR0FBOEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDcEQsTUFBTSxHQUFHLEdBQThCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRXBELG9EQUFvRDs0QkFDcEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDNUMsa0NBQWtDOzRCQUVsQywrQkFBK0I7NEJBQy9CLHNFQUFzRTs0QkFDdEUsZUFBTSxDQUFDLEtBQUssQ0FDVixlQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQy9DLGVBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDL0MsR0FBRyxDQUFDLENBQUM7NEJBQ1Asc0VBQXNFOzRCQUN0RSxlQUFNLENBQUMsS0FBSyxDQUNWLGVBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDL0MsZUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUMvQyxHQUFHLENBQUMsQ0FBQzs0QkFFUCwwQkFBMEI7NEJBQzFCLG9DQUFvQzs0QkFDcEMsSUFBSSxHQUFHLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQzVDLG9DQUFvQzs0QkFDcEMsSUFBSSxHQUFHLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBRTVDLFlBQVk7NEJBQ1osQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQzs0QkFDN0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQzs0QkFFN0IsYUFBYTs0QkFDYix3QkFBd0I7NEJBQ3hCLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBRS9DOzs7OzhCQUlFOzRCQUVGLFNBQVc7Z0NBQ1QsRUFBRTtnQ0FDRixpQkFBaUI7Z0NBQ2pCLEVBQUU7Z0NBQ0YsaUJBQWlCO2dDQUNqQixFQUFFO2dDQUNGLGVBQWU7Z0NBQ2YsRUFBRTtnQ0FDRixvQkFBb0I7Z0NBQ3BCLEVBQUU7Z0NBQ0YseUNBQXlDO2dDQUN6QyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FFN0MsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQ0FDeEIsOEJBQThCO29DQUM5QixvQkFBb0I7b0NBQ3BCLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQ0FFdEIsNEJBQTRCO29DQUM1Qiw0QkFBNEI7b0NBQzVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7b0NBQzlCLDRCQUE0QjtvQ0FDNUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztvQ0FDOUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUMzQix3QkFBd0I7b0NBQ3hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUN4Qiw0REFBNEQ7b0NBQzVELEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0NBRXJFLHdCQUF3QjtvQ0FDeEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQ3hCLDREQUE0RDtvQ0FDNUQsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQ0FFckUsYUFBYTtvQ0FDYixHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3hCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FFeEI7Ozs7Ozs7Ozs7Ozs7c0NBYUU7b0NBQ0YsTUFBTTtpQ0FDUDtnQ0FFRCxFQUFFO2dDQUNGLDZCQUE2QjtnQ0FDN0IsRUFBRTtnQ0FDRixpQ0FBaUM7Z0NBQ2pDLGlDQUFpQztnQ0FDakMsRUFBRTtnQ0FDRixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDOUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztnQ0FDUixHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FFNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO29DQUN4Qiw4QkFBOEI7b0NBQzlCLG9CQUFvQjtvQ0FDcEIsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29DQUV0Qiw0QkFBNEI7b0NBQzVCLDRCQUE0QjtvQ0FDNUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztvQ0FDOUIsNEJBQTRCO29DQUM1QixlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUM5QixlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQzNCLHdCQUF3QjtvQ0FDeEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQ3hCLDREQUE0RDtvQ0FDNUQsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQ0FFckUsd0JBQXdCO29DQUN4QixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDeEIsNERBQTREO29DQUM1RCxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29DQUVyRSxhQUFhO29DQUNiLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDeEIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUV4Qjs7Ozs7Ozs7OztzQ0FVRTtvQ0FDRixNQUFNO2lDQUNQO2dDQUdELEVBQUU7Z0NBQ0YsNkJBQTZCO2dDQUM3QixFQUFFO2dDQUNGLGlDQUFpQztnQ0FDakMsaUNBQWlDO2dDQUNqQyxFQUFFO2dDQUNGLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNSLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM5QixHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDNUIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQ0FFUixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0NBQ3hCLDJDQUEyQztvQ0FDM0Msb0JBQW9CO29DQUNwQixlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0NBRXRCLDRCQUE0QjtvQ0FDNUIsNEJBQTRCO29DQUM1QixlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUM5Qiw0QkFBNEI7b0NBQzVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7b0NBQzlCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDM0Isd0JBQXdCO29DQUN4QixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDeEIsNERBQTREO29DQUM1RCxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29DQUVyRSx3QkFBd0I7b0NBQ3hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUN4Qiw0REFBNEQ7b0NBQzVELEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0NBRXJFLGFBQWE7b0NBQ2IsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN4QixHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBRXhCOzs7Ozs7Ozs7O3NDQVVFO29DQUNGLE1BQU07aUNBQ1A7Z0NBRUQsRUFBRTtnQ0FDRiw0QkFBNEI7Z0NBQzVCLEVBQUU7Z0NBQ0YsV0FBVztnQ0FDWCxZQUFZO2dDQUNaLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNSLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNSLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNWLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUVWLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO29DQUN4QiwyQ0FBMkM7b0NBQzNDLG9CQUFvQjtvQ0FDcEIsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29DQUV0Qiw0QkFBNEI7b0NBQzVCLDRCQUE0QjtvQ0FDNUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztvQ0FDOUIsNEJBQTRCO29DQUM1QixlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUM5QixlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQzNCLHdCQUF3QjtvQ0FDeEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQ3hCLDREQUE0RDtvQ0FDNUQsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQ0FFckUsd0JBQXdCO29DQUN4QixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDeEIsNERBQTREO29DQUM1RCxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29DQUVyRSxhQUFhO29DQUNiLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDeEIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUV4QixNQUFNO2lDQUNQO2dDQUVELDhFQUE4RTtnQ0FDOUUsTUFBTTs2QkFDUDt5QkFDRjt3QkFFRCxvQ0FBb0M7d0JBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDakMsb0NBQW9DO3dCQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ2xDO2dCQUNILENBQUM7Z0JBRU0sYUFBYTtvQkFDbEIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzdDLElBQUksRUFBRSxHQUFnQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BFLElBQUksUUFBUSxHQUFlLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUUxRSxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDOUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7NEJBQzlELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO3lCQUNqRTtxQkFDRjtnQkFDSCxDQUFDO2dCQVFNLHdCQUF3QjtvQkFDN0IsTUFBTSxHQUFHLEdBQWdCLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQztvQkFDeEUsTUFBTSxHQUFHLEdBQWdCLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQztvQkFDeEUsTUFBTSxHQUFHLEdBQTZCLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQztvQkFDckYsTUFBTSxFQUFFLEdBQVcsZUFBZSxDQUFDLDZCQUE2QixDQUFDO29CQUNqRSxNQUFNLEVBQUUsR0FBVyxlQUFlLENBQUMsNkJBQTZCLENBQUM7b0JBQ2pFLE1BQU0sQ0FBQyxHQUFXLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQztvQkFFL0QsSUFBSSxhQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUU5QixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDN0MsTUFBTSxFQUFFLEdBQWdDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFdEUsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakMsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFDN0MsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDNUIsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFDN0MsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDNUIsTUFBTSxVQUFVLEdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQzt3QkFFekMsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUU1QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUMsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRTVDLDJCQUEyQjt3QkFDM0IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDM0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ25CLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNuQixlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxjQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZFLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLGNBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFdkUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLE1BQU0sQ0FBQzs0QkFFbEMsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQzs0QkFDaEMsTUFBTSxVQUFVLEdBQVcsR0FBRyxDQUFDLFVBQVUsQ0FBQzs0QkFFMUMsMEJBQTBCOzRCQUMxQixlQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7NEJBQzVCLDBCQUEwQjs0QkFDMUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRCQUU1Qiw4QkFBOEI7NEJBQzlCLGFBQWEsR0FBRyxjQUFLLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzRCQUVqRCw0Q0FBNEM7NEJBQzVDLE1BQU0sQ0FBQyxHQUFXLGdCQUFPLENBQUMseUJBQVksR0FBRyxDQUFDLFVBQVUsR0FBRywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1DQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBRXJHLDhCQUE4Qjs0QkFDOUIscUNBQXFDOzRCQUNyQyxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDL0MscUNBQXFDOzRCQUNyQyxNQUFNLEdBQUcsR0FBVyxlQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDL0MseURBQXlEOzRCQUN6RCxNQUFNLENBQUMsR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDOzRCQUU1RCx5QkFBeUI7NEJBQ3pCLE1BQU0sT0FBTyxHQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUU1QywrQkFBK0I7NEJBQy9CLGVBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFFakMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsNkJBQTZCOzRCQUM3QixFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUVqQyxnQkFBZ0I7NEJBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUNyQiw2QkFBNkI7NEJBQzdCLEVBQUUsSUFBSSxFQUFFLEdBQUcsZUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ2xDO3dCQUVELG1DQUFtQzt3QkFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUVoQyxtQ0FBbUM7d0JBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztxQkFDakM7b0JBRUQsb0VBQW9FO29CQUNwRSw0Q0FBNEM7b0JBQzVDLE9BQU8sYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsMEJBQWEsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO2dCQVFNLDJCQUEyQixDQUFDLFNBQWlCLEVBQUUsU0FBaUI7b0JBQ3JFLE1BQU0sR0FBRyxHQUFnQixlQUFlLENBQUMsaUNBQWlDLENBQUM7b0JBQzNFLE1BQU0sR0FBRyxHQUFnQixlQUFlLENBQUMsaUNBQWlDLENBQUM7b0JBQzNFLE1BQU0sR0FBRyxHQUE2QixlQUFlLENBQUMsaUNBQWlDLENBQUM7b0JBQ3hGLE1BQU0sRUFBRSxHQUFXLGVBQWUsQ0FBQyxnQ0FBZ0MsQ0FBQztvQkFDcEUsTUFBTSxFQUFFLEdBQVcsZUFBZSxDQUFDLGdDQUFnQyxDQUFDO29CQUNwRSxNQUFNLENBQUMsR0FBVyxlQUFlLENBQUMsK0JBQStCLENBQUM7b0JBRWxFLElBQUksYUFBYSxHQUFXLENBQUMsQ0FBQztvQkFFOUIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzdDLE1BQU0sRUFBRSxHQUFnQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRXRFLE1BQU0sTUFBTSxHQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQ2pDLE1BQU0sWUFBWSxHQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUM7d0JBQzdDLE1BQU0sWUFBWSxHQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUM7d0JBQzdDLE1BQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBRXpDLElBQUksRUFBRSxHQUFXLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFDO3dCQUNuQixJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTs0QkFDaEQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBQ2pCLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO3lCQUNmO3dCQUVELElBQUksRUFBRSxHQUFXLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFDO3dCQUNuQixJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTs0QkFDaEQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBQ2pCLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO3lCQUNmO3dCQUVELE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFNUMsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUU1QywyQkFBMkI7d0JBQzNCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQzNDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNuQixHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDbkIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsY0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2RSxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxjQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRXZFLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2hDLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUM7NEJBRWxDLE1BQU0sS0FBSyxHQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUM7NEJBQ2hDLE1BQU0sVUFBVSxHQUFXLEdBQUcsQ0FBQyxVQUFVLENBQUM7NEJBRTFDLDBCQUEwQjs0QkFDMUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QiwwQkFBMEI7NEJBQzFCLGVBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFFNUIsOEJBQThCOzRCQUM5QixhQUFhLEdBQUcsY0FBSyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQzs0QkFFakQsNENBQTRDOzRCQUM1QyxNQUFNLENBQUMsR0FBVyxnQkFBTyxDQUFDLDRCQUFlLEdBQUcsQ0FBQyxVQUFVLEdBQUcsMEJBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUV4Ryw4QkFBOEI7NEJBQzlCLHFDQUFxQzs0QkFDckMsTUFBTSxHQUFHLEdBQVcsZUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQy9DLHFDQUFxQzs0QkFDckMsTUFBTSxHQUFHLEdBQVcsZUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQy9DLHlEQUF5RDs0QkFDekQsTUFBTSxDQUFDLEdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQzs0QkFFNUQseUJBQXlCOzRCQUN6QixNQUFNLE9BQU8sR0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFNUMsK0JBQStCOzRCQUMvQixlQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBRWpDLGdCQUFnQjs0QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLDZCQUE2Qjs0QkFDN0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFFakMsZ0JBQWdCOzRCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsNkJBQTZCOzRCQUM3QixFQUFFLElBQUksRUFBRSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRCxtQ0FBbUM7d0JBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFFaEMsbUNBQW1DO3dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ2pDO29CQUVELG9FQUFvRTtvQkFDcEUsNENBQTRDO29CQUM1QyxPQUFPLGFBQWEsSUFBSSxDQUFDLEdBQUcsR0FBRywwQkFBYSxDQUFDO2dCQUMvQyxDQUFDO2FBQ0YsQ0FBQTtZQTd3QmdCLG1EQUFtQyxHQUFHLElBQUksb0JBQVcsRUFBRSxDQUFDO1lBQ3hELG1EQUFtQyxHQUFHLElBQUksb0JBQVcsRUFBRSxDQUFDO1lBQ3hELDZEQUE2QyxHQUFHLElBQUksNkJBQWUsRUFBRSxDQUFDO1lBc0h0RSw2QkFBYSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFpRDdCLDZDQUE2QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDN0MsOENBQThCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUM5Qyw4Q0FBOEIsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzlDLDRDQUE0QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDNUMsNENBQTRCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUM1Qyw0Q0FBNEIsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzVDLDRDQUE0QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDNUMsNENBQTRCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUM1Qyw2Q0FBNkIsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzdDLDZDQUE2QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDN0MsK0NBQStCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQWlaL0MsOENBQThCLEdBQUcsSUFBSSxvQkFBVyxFQUFFLENBQUM7WUFDbkQsOENBQThCLEdBQUcsSUFBSSxvQkFBVyxFQUFFLENBQUM7WUFDbkQsOENBQThCLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO1lBQ2hFLDZDQUE2QixHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDN0MsNkNBQTZCLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUM3Qyw0Q0FBNEIsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBMkY1QyxpREFBaUMsR0FBRyxJQUFJLG9CQUFXLEVBQUUsQ0FBQztZQUN0RCxpREFBaUMsR0FBRyxJQUFJLG9CQUFXLEVBQUUsQ0FBQztZQUN0RCxpREFBaUMsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7WUFDbkUsZ0RBQWdDLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUNoRCxnREFBZ0MsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ2hELCtDQUErQixHQUFHLElBQUksZUFBTSxFQUFFLENBQUMifQ==