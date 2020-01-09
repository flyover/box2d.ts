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
System.register(["../../Common/b2Settings.js", "../../Common/b2Math.js", "../../Collision/b2Collision.js", "../b2TimeStep.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Collision_js_1, b2Collision_js_2, b2TimeStep_js_1, g_blockSolve, b2VelocityConstraintPoint, b2ContactVelocityConstraint, b2ContactPositionConstraint, b2ContactSolverDef, b2PositionSolverManifold, b2ContactSolver;
    var __moduleName = context_1 && context_1.id;
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
            },
            function (b2TimeStep_js_1_1) {
                b2TimeStep_js_1 = b2TimeStep_js_1_1;
            }
        ],
        execute: function () {
            // Solver debugging is normally disabled because the block solver sometimes has to deal with a poorly conditioned effective mass matrix.
            // #define B2_DEBUG_SOLVER 0
            exports_1("g_blockSolve", g_blockSolve = false);
            b2VelocityConstraintPoint = class b2VelocityConstraintPoint {
                constructor() {
                    this.rA = new b2Math_js_1.b2Vec2();
                    this.rB = new b2Math_js_1.b2Vec2();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.normalMass = 0;
                    this.tangentMass = 0;
                    this.velocityBias = 0;
                }
                static MakeArray(length) {
                    return b2Settings_js_1.b2MakeArray(length, (i) => new b2VelocityConstraintPoint());
                }
            };
            exports_1("b2VelocityConstraintPoint", b2VelocityConstraintPoint);
            b2ContactVelocityConstraint = class b2ContactVelocityConstraint {
                constructor() {
                    this.points = b2VelocityConstraintPoint.MakeArray(b2Settings_js_1.b2_maxManifoldPoints);
                    this.normal = new b2Math_js_1.b2Vec2();
                    this.tangent = new b2Math_js_1.b2Vec2();
                    this.normalMass = new b2Math_js_1.b2Mat22();
                    this.K = new b2Math_js_1.b2Mat22();
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
                    return b2Settings_js_1.b2MakeArray(length, (i) => new b2ContactVelocityConstraint());
                }
            };
            exports_1("b2ContactVelocityConstraint", b2ContactVelocityConstraint);
            b2ContactPositionConstraint = class b2ContactPositionConstraint {
                constructor() {
                    this.localPoints = b2Math_js_1.b2Vec2.MakeArray(b2Settings_js_1.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_js_1.b2Vec2();
                    this.localPoint = new b2Math_js_1.b2Vec2();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.localCenterA = new b2Math_js_1.b2Vec2();
                    this.localCenterB = new b2Math_js_1.b2Vec2();
                    this.invIA = 0;
                    this.invIB = 0;
                    this.type = b2Collision_js_2.b2ManifoldType.e_unknown;
                    this.radiusA = 0;
                    this.radiusB = 0;
                    this.pointCount = 0;
                }
                static MakeArray(length) {
                    return b2Settings_js_1.b2MakeArray(length, (i) => new b2ContactPositionConstraint());
                }
            };
            exports_1("b2ContactPositionConstraint", b2ContactPositionConstraint);
            b2ContactSolverDef = class b2ContactSolverDef {
                constructor() {
                    this.step = new b2TimeStep_js_1.b2TimeStep();
                    this.count = 0;
                }
            };
            exports_1("b2ContactSolverDef", b2ContactSolverDef);
            b2PositionSolverManifold = class b2PositionSolverManifold {
                constructor() {
                    this.normal = new b2Math_js_1.b2Vec2();
                    this.point = new b2Math_js_1.b2Vec2();
                    this.separation = 0;
                }
                Initialize(pc, xfA, xfB, index) {
                    const pointA = b2PositionSolverManifold.Initialize_s_pointA;
                    const pointB = b2PositionSolverManifold.Initialize_s_pointB;
                    const planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
                    const clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
                    // DEBUG: b2Assert(pc.pointCount > 0);
                    switch (pc.type) {
                        case b2Collision_js_2.b2ManifoldType.e_circles: {
                            // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                            b2Math_js_1.b2Transform.MulXV(xfA, pc.localPoint, pointA);
                            // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                            b2Math_js_1.b2Transform.MulXV(xfB, pc.localPoints[0], pointB);
                            // normal = pointB - pointA;
                            // normal.Normalize();
                            b2Math_js_1.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                            // point = 0.5f * (pointA + pointB);
                            b2Math_js_1.b2Vec2.MidVV(pointA, pointB, this.point);
                            // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                            this.separation = b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(pointB, pointA, b2Math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            break;
                        }
                        case b2Collision_js_2.b2ManifoldType.e_faceA: {
                            // normal = b2Mul(xfA.q, pc->localNormal);
                            b2Math_js_1.b2Rot.MulRV(xfA.q, pc.localNormal, this.normal);
                            // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                            b2Math_js_1.b2Transform.MulXV(xfA, pc.localPoint, planePoint);
                            // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                            b2Math_js_1.b2Transform.MulXV(xfB, pc.localPoints[index], clipPoint);
                            // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                            this.separation = b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            // point = clipPoint;
                            this.point.Copy(clipPoint);
                            break;
                        }
                        case b2Collision_js_2.b2ManifoldType.e_faceB: {
                            // normal = b2Mul(xfB.q, pc->localNormal);
                            b2Math_js_1.b2Rot.MulRV(xfB.q, pc.localNormal, this.normal);
                            // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                            b2Math_js_1.b2Transform.MulXV(xfB, pc.localPoint, planePoint);
                            // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                            b2Math_js_1.b2Transform.MulXV(xfA, pc.localPoints[index], clipPoint);
                            // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                            this.separation = b2Math_js_1.b2Vec2.DotVV(b2Math_js_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            // point = clipPoint;
                            this.point.Copy(clipPoint);
                            // Ensure normal points from A to B
                            // normal = -normal;
                            this.normal.SelfNeg();
                            break;
                        }
                    }
                }
            };
            exports_1("b2PositionSolverManifold", b2PositionSolverManifold);
            b2PositionSolverManifold.Initialize_s_pointA = new b2Math_js_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_pointB = new b2Math_js_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_planePoint = new b2Math_js_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_clipPoint = new b2Math_js_1.b2Vec2();
            b2ContactSolver = class b2ContactSolver {
                constructor() {
                    this.m_step = new b2TimeStep_js_1.b2TimeStep();
                    this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_count = 0;
                }
                Initialize(def) {
                    this.m_step.Copy(def.step);
                    this.m_count = def.count;
                    // TODO:
                    if (this.m_positionConstraints.length < this.m_count) {
                        const new_length = b2Math_js_1.b2Max(this.m_positionConstraints.length * 2, this.m_count);
                        while (this.m_positionConstraints.length < new_length) {
                            this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
                        }
                    }
                    // TODO:
                    if (this.m_velocityConstraints.length < this.m_count) {
                        const new_length = b2Math_js_1.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
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
                        // DEBUG: b2Assert(pointCount > 0);
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
                        // DEBUG: b2Assert(manifold.pointCount > 0);
                        xfA.q.SetAngle(aA);
                        xfB.q.SetAngle(aB);
                        b2Math_js_1.b2Vec2.SubVV(cA, b2Math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_js_1.b2Vec2.s_t0), xfA.p);
                        b2Math_js_1.b2Vec2.SubVV(cB, b2Math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_js_1.b2Vec2.s_t0), xfB.p);
                        worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
                        vc.normal.Copy(worldManifold.normal);
                        b2Math_js_1.b2Vec2.CrossVOne(vc.normal, vc.tangent); // compute from normal
                        const pointCount = vc.pointCount;
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // vcp->rA = worldManifold.points[j] - cA;
                            b2Math_js_1.b2Vec2.SubVV(worldManifold.points[j], cA, vcp.rA);
                            // vcp->rB = worldManifold.points[j] - cB;
                            b2Math_js_1.b2Vec2.SubVV(worldManifold.points[j], cB, vcp.rB);
                            const rnA = b2Math_js_1.b2Vec2.CrossVV(vcp.rA, vc.normal);
                            const rnB = b2Math_js_1.b2Vec2.CrossVV(vcp.rB, vc.normal);
                            const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                            // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                            const tangent = vc.tangent; // precomputed from normal
                            const rtA = b2Math_js_1.b2Vec2.CrossVV(vcp.rA, tangent);
                            const rtB = b2Math_js_1.b2Vec2.CrossVV(vcp.rB, tangent);
                            const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                            vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                            // Setup a velocity bias for restitution.
                            vcp.velocityBias = 0;
                            // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                            const vRel = b2Math_js_1.b2Vec2.DotVV(vc.normal, b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_js_1.b2Vec2.s_t1), b2Math_js_1.b2Vec2.s_t0));
                            if (vRel < (-b2Settings_js_1.b2_velocityThreshold)) {
                                vcp.velocityBias += (-vc.restitution * vRel);
                            }
                        }
                        // If we have two points, then prepare the block solver.
                        if (vc.pointCount === 2 && g_blockSolve) {
                            const vcp1 = vc.points[0];
                            const vcp2 = vc.points[1];
                            const rn1A = b2Math_js_1.b2Vec2.CrossVV(vcp1.rA, vc.normal);
                            const rn1B = b2Math_js_1.b2Vec2.CrossVV(vcp1.rB, vc.normal);
                            const rn2A = b2Math_js_1.b2Vec2.CrossVV(vcp2.rA, vc.normal);
                            const rn2B = b2Math_js_1.b2Vec2.CrossVV(vcp2.rB, vc.normal);
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
                            b2Math_js_1.b2Vec2.AddVV(b2Math_js_1.b2Vec2.MulSV(vcp.normalImpulse, normal, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.MulSV(vcp.tangentImpulse, tangent, b2Math_js_1.b2Vec2.s_t1), P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_js_1.b2Vec2.CrossVV(vcp.rB, P);
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
                        // DEBUG: b2Assert(pointCount === 1 || pointCount === 2);
                        // Solve tangent constraints first because non-penetration is more important
                        // than friction.
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_js_1.b2Vec2.s_t1), dv);
                            // Compute tangent force
                            // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                            const vt = b2Math_js_1.b2Vec2.DotVV(dv, tangent) - vc.tangentSpeed;
                            let lambda = vcp.tangentMass * (-vt);
                            // b2Clamp the accumulated force
                            const maxFriction = friction * vcp.normalImpulse;
                            const newImpulse = b2Math_js_1.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                            lambda = newImpulse - vcp.tangentImpulse;
                            vcp.tangentImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * tangent;
                            b2Math_js_1.b2Vec2.MulSV(lambda, tangent, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_js_1.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        // Solve normal constraints
                        if (vc.pointCount === 1 || g_blockSolve === false) {
                            for (let j = 0; j < pointCount; ++j) {
                                const vcp = vc.points[j];
                                // Relative velocity at contact
                                // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                                b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_js_1.b2Vec2.s_t1), dv);
                                // Compute normal impulse
                                // float32 vn = b2Dot(dv, normal);
                                const vn = b2Math_js_1.b2Vec2.DotVV(dv, normal);
                                let lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                                // b2Clamp the accumulated impulse
                                // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                                const newImpulse = b2Math_js_1.b2Max(vcp.normalImpulse + lambda, 0);
                                lambda = newImpulse - vcp.normalImpulse;
                                vcp.normalImpulse = newImpulse;
                                // Apply contact impulse
                                // b2Vec2 P = lambda * normal;
                                b2Math_js_1.b2Vec2.MulSV(lambda, normal, P);
                                // vA -= mA * P;
                                vA.SelfMulSub(mA, P);
                                // wA -= iA * b2Cross(vcp->rA, P);
                                wA -= iA * b2Math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                                // vB += mB * P;
                                vB.SelfMulAdd(mB, P);
                                // wB += iB * b2Cross(vcp->rB, P);
                                wB += iB * b2Math_js_1.b2Vec2.CrossVV(vcp.rB, P);
                            }
                        }
                        else {
                            // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                            // Build the mini LCP for this contact patch
                            //
                            // vn = A * x + b, vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
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
                            // DEBUG: b2Assert(a.x >= 0 && a.y >= 0);
                            // Relative velocity at contact
                            // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                            b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, cp1.rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, cp1.rA, b2Math_js_1.b2Vec2.s_t1), dv1);
                            // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                            b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, cp2.rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, cp2.rA, b2Math_js_1.b2Vec2.s_t1), dv2);
                            // Compute normal velocity
                            // float32 vn1 = b2Dot(dv1, normal);
                            let vn1 = b2Math_js_1.b2Vec2.DotVV(dv1, normal);
                            // float32 vn2 = b2Dot(dv2, normal);
                            let vn2 = b2Math_js_1.b2Vec2.DotVV(dv2, normal);
                            // b2Vec2 b;
                            b.x = vn1 - cp1.velocityBias;
                            b.y = vn2 - cp2.velocityBias;
                            // Compute b'
                            // b -= b2Mul(vc->K, a);
                            b.SelfSub(b2Math_js_1.b2Mat22.MulMV(vc.K, a, b2Math_js_1.b2Vec2.s_t0));
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
                                b2Math_js_1.b2Mat22.MulMV(vc.normalMass, b, x).SelfNeg();
                                if (x.x >= 0 && x.y >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_js_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
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
                        
                                    b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                                    b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
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
                                    b2Math_js_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                        
                                    b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
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
                                    b2Math_js_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn2 = b2Dot(dv2, normal);
                        
                                    b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
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
                                    b2Math_js_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
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
                        const vc = this.m_velocityConstraints[i];
                        const manifold = this.m_contacts[vc.contactIndex].GetManifold();
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
                            b2Math_js_1.b2Vec2.SubVV(cA, b2Math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_js_1.b2Vec2.s_t0), xfA.p);
                            b2Math_js_1.b2Vec2.SubVV(cB, b2Math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_js_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_js_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_js_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_js_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_js_1.b2Clamp(b2Settings_js_1.b2_baumgarte * (separation + b2Settings_js_1.b2_linearSlop), (-b2Settings_js_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_js_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_js_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_js_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_js_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_js_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation > (-3 * b2Settings_js_1.b2_linearSlop);
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
                            b2Math_js_1.b2Vec2.SubVV(cA, b2Math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_js_1.b2Vec2.s_t0), xfA.p);
                            b2Math_js_1.b2Vec2.SubVV(cB, b2Math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_js_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_js_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_js_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_js_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_js_1.b2Clamp(b2Settings_js_1.b2_toiBaumgarte * (separation + b2Settings_js_1.b2_linearSlop), (-b2Settings_js_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_js_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_js_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_js_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_js_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_js_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation >= -1.5 * b2Settings_js_1.b2_linearSlop;
                }
            };
            exports_1("b2ContactSolver", b2ContactSolver);
            b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2Math_js_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2Math_js_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2Collision_js_1.b2WorldManifold();
            b2ContactSolver.WarmStart_s_P = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_a = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_b = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_x = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_d = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_xfA = new b2Math_js_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_xfB = new b2Math_js_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolvePositionConstraints_s_rA = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_rB = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_P = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2Math_js_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2Math_js_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2Math_js_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0U29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250YWN0U29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBZUYsd0lBQXdJO1lBQ3hJLDRCQUE0QjtZQUU1QiwwQkFBVyxZQUFZLEdBQVksS0FBSyxFQUFDO1lBRXpDLDRCQUFBLE1BQWEseUJBQXlCO2dCQUF0QztvQkFDa0IsT0FBRSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMxQixPQUFFLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQ25DLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFDM0IsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFDdkIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO2dCQUtsQyxDQUFDO2dCQUhRLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztvQkFDcEMsT0FBTywyQkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSx5QkFBeUIsRUFBRSxDQUFDLENBQUM7Z0JBQzdFLENBQUM7YUFDRixDQUFBOztZQUVELDhCQUFBLE1BQWEsMkJBQTJCO2dCQUF4QztvQkFDa0IsV0FBTSxHQUFnQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsb0NBQW9CLENBQUMsQ0FBQztvQkFDaEcsV0FBTSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUM5QixZQUFPLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQy9CLGVBQVUsR0FBWSxJQUFJLG1CQUFPLEVBQUUsQ0FBQztvQkFDcEMsTUFBQyxHQUFZLElBQUksbUJBQU8sRUFBRSxDQUFDO29CQUNwQyxXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUNuQixXQUFNLEdBQVcsQ0FB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LENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRXRFLE1BQU0sT0FBTyxHQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ25DLE1BQU0sT0FBTyxHQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ25DLE1BQU0sUUFBUSxHQUFlLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUU1RSxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUVqQyxNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUMvQixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLEVBQUUsR0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUM1QixNQUFNLFlBQVksR0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUM3QyxNQUFNLFlBQVksR0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUU3QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUMsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFL0MsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMs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