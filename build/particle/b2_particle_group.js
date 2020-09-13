/*
 * Copyright (c) 2013 Google, Inc.
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
System.register(["../common/b2_math.js", "../common/b2_draw.js"], function (exports_1, context_1) {
    "use strict";
    var b2_math_js_1, b2_draw_js_1, b2ParticleGroupFlag, b2ParticleGroupDef, b2ParticleGroup;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_draw_js_1_1) {
                b2_draw_js_1 = b2_draw_js_1_1;
            }
        ],
        execute: function () {
            (function (b2ParticleGroupFlag) {
                /// Prevents overlapping or leaking.
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_solidParticleGroup"] = 1] = "b2_solidParticleGroup";
                /// Keeps its shape.
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_rigidParticleGroup"] = 2] = "b2_rigidParticleGroup";
                /// Won't be destroyed if it gets empty.
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupCanBeEmpty"] = 4] = "b2_particleGroupCanBeEmpty";
                /// Will be destroyed on next simulation step.
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupWillBeDestroyed"] = 8] = "b2_particleGroupWillBeDestroyed";
                /// Updates depth data on next simulation step.
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupNeedsUpdateDepth"] = 16] = "b2_particleGroupNeedsUpdateDepth";
                b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupInternalMask"] = 24] = "b2_particleGroupInternalMask";
            })(b2ParticleGroupFlag || (b2ParticleGroupFlag = {}));
            exports_1("b2ParticleGroupFlag", b2ParticleGroupFlag);
            b2ParticleGroupDef = class b2ParticleGroupDef {
                constructor() {
                    this.flags = 0;
                    this.groupFlags = 0;
                    this.position = new b2_math_js_1.b2Vec2();
                    this.angle = 0.0;
                    this.linearVelocity = new b2_math_js_1.b2Vec2();
                    this.angularVelocity = 0.0;
                    this.color = new b2_draw_js_1.b2Color();
                    this.strength = 1.0;
                    this.shapeCount = 0;
                    this.stride = 0;
                    this.particleCount = 0;
                    this.lifetime = 0;
                    this.userData = null;
                    this.group = null;
                }
            };
            exports_1("b2ParticleGroupDef", b2ParticleGroupDef);
            b2ParticleGroup = class b2ParticleGroup {
                constructor(system) {
                    this.m_firstIndex = 0;
                    this.m_lastIndex = 0;
                    this.m_groupFlags = 0;
                    this.m_strength = 1.0;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_timestamp = -1;
                    this.m_mass = 0.0;
                    this.m_inertia = 0.0;
                    this.m_center = new b2_math_js_1.b2Vec2();
                    this.m_linearVelocity = new b2_math_js_1.b2Vec2();
                    this.m_angularVelocity = 0.0;
                    this.m_transform = new b2_math_js_1.b2Transform();
                    ///m_transform.SetIdentity();
                    this.m_userData = null;
                    this.m_system = system;
                }
                GetNext() {
                    return this.m_next;
                }
                GetParticleSystem() {
                    return this.m_system;
                }
                GetParticleCount() {
                    return this.m_lastIndex - this.m_firstIndex;
                }
                GetBufferIndex() {
                    return this.m_firstIndex;
                }
                ContainsParticle(index) {
                    return this.m_firstIndex <= index && index < this.m_lastIndex;
                }
                GetAllParticleFlags() {
                    if (!this.m_system.m_flagsBuffer.data) {
                        throw new Error();
                    }
                    let flags = 0;
                    for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                        flags |= this.m_system.m_flagsBuffer.data[i];
                    }
                    return flags;
                }
                GetGroupFlags() {
                    return this.m_groupFlags;
                }
                SetGroupFlags(flags) {
                    // DEBUG: b2Assert((flags & b2ParticleGroupFlag.b2_particleGroupInternalMask) === 0);
                    flags |= this.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupInternalMask;
                    this.m_system.SetGroupFlags(this, flags);
                }
                GetMass() {
                    this.UpdateStatistics();
                    return this.m_mass;
                }
                GetInertia() {
                    this.UpdateStatistics();
                    return this.m_inertia;
                }
                GetCenter() {
                    this.UpdateStatistics();
                    return this.m_center;
                }
                GetLinearVelocity() {
                    this.UpdateStatistics();
                    return this.m_linearVelocity;
                }
                GetAngularVelocity() {
                    this.UpdateStatistics();
                    return this.m_angularVelocity;
                }
                GetTransform() {
                    return this.m_transform;
                }
                GetPosition() {
                    return this.m_transform.p;
                }
                GetAngle() {
                    return this.m_transform.q.GetAngle();
                }
                GetLinearVelocityFromWorldPoint(worldPoint, out) {
                    const s_t0 = b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0;
                    this.UpdateStatistics();
                    ///  return m_linearVelocity + b2Cross(m_angularVelocity, worldPoint - m_center);
                    return b2_math_js_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2_math_js_1.b2Vec2.SubVV(worldPoint, this.m_center, s_t0), out);
                }
                GetUserData() {
                    return this.m_userData;
                }
                SetUserData(data) {
                    this.m_userData = data;
                }
                ApplyForce(force) {
                    this.m_system.ApplyForce(this.m_firstIndex, this.m_lastIndex, force);
                }
                ApplyLinearImpulse(impulse) {
                    this.m_system.ApplyLinearImpulse(this.m_firstIndex, this.m_lastIndex, impulse);
                }
                DestroyParticles(callDestructionListener) {
                    if (this.m_system.m_world.IsLocked()) {
                        throw new Error();
                    }
                    for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                        this.m_system.DestroyParticle(i, callDestructionListener);
                    }
                }
                UpdateStatistics() {
                    if (!this.m_system.m_positionBuffer.data) {
                        throw new Error();
                    }
                    if (!this.m_system.m_velocityBuffer.data) {
                        throw new Error();
                    }
                    const p = new b2_math_js_1.b2Vec2();
                    const v = new b2_math_js_1.b2Vec2();
                    if (this.m_timestamp !== this.m_system.m_timestamp) {
                        const m = this.m_system.GetParticleMass();
                        ///  this.m_mass = 0;
                        this.m_mass = m * (this.m_lastIndex - this.m_firstIndex);
                        this.m_center.SetZero();
                        this.m_linearVelocity.SetZero();
                        for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                            ///  this.m_mass += m;
                            ///  this.m_center += m * this.m_system.m_positionBuffer.data[i];
                            this.m_center.SelfMulAdd(m, this.m_system.m_positionBuffer.data[i]);
                            ///  this.m_linearVelocity += m * this.m_system.m_velocityBuffer.data[i];
                            this.m_linearVelocity.SelfMulAdd(m, this.m_system.m_velocityBuffer.data[i]);
                        }
                        if (this.m_mass > 0) {
                            const inv_mass = 1 / this.m_mass;
                            ///this.m_center *= 1 / this.m_mass;
                            this.m_center.SelfMul(inv_mass);
                            ///this.m_linearVelocity *= 1 / this.m_mass;
                            this.m_linearVelocity.SelfMul(inv_mass);
                        }
                        this.m_inertia = 0;
                        this.m_angularVelocity = 0;
                        for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                            ///b2Vec2 p = this.m_system.m_positionBuffer.data[i] - this.m_center;
                            b2_math_js_1.b2Vec2.SubVV(this.m_system.m_positionBuffer.data[i], this.m_center, p);
                            ///b2Vec2 v = this.m_system.m_velocityBuffer.data[i] - this.m_linearVelocity;
                            b2_math_js_1.b2Vec2.SubVV(this.m_system.m_velocityBuffer.data[i], this.m_linearVelocity, v);
                            this.m_inertia += m * b2_math_js_1.b2Vec2.DotVV(p, p);
                            this.m_angularVelocity += m * b2_math_js_1.b2Vec2.CrossVV(p, v);
                        }
                        if (this.m_inertia > 0) {
                            this.m_angularVelocity *= 1 / this.m_inertia;
                        }
                        this.m_timestamp = this.m_system.m_timestamp;
                    }
                }
            };
            exports_1("b2ParticleGroup", b2ParticleGroup);
            b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0 = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcGFydGljbGVfZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFydGljbGUvYjJfcGFydGljbGVfZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQVdILFdBQVksbUJBQW1CO2dCQUM3QixvQ0FBb0M7Z0JBQ3BDLCtGQUE4QixDQUFBO2dCQUM5QixvQkFBb0I7Z0JBQ3BCLCtGQUE4QixDQUFBO2dCQUM5Qix3Q0FBd0M7Z0JBQ3hDLHlHQUFtQyxDQUFBO2dCQUNuQyw4Q0FBOEM7Z0JBQzlDLG1IQUF3QyxDQUFBO2dCQUN4QywrQ0FBK0M7Z0JBQy9DLHNIQUF5QyxDQUFBO2dCQUV6Qyw4R0FBaUcsQ0FBQTtZQUNuRyxDQUFDLEVBYlcsbUJBQW1CLEtBQW5CLG1CQUFtQixRQWE5Qjs7WUFzQkQscUJBQUEsTUFBYSxrQkFBa0I7Z0JBQS9CO29CQUNTLFVBQUssR0FBbUIsQ0FBQyxDQUFDO29CQUMxQixlQUFVLEdBQXdCLENBQUMsQ0FBQztvQkFDM0IsYUFBUSxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUN6QyxVQUFLLEdBQVcsR0FBRyxDQUFDO29CQUNYLG1CQUFjLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7b0JBQy9DLG9CQUFlLEdBQVcsR0FBRyxDQUFDO29CQUNyQixVQUFLLEdBQVksSUFBSSxvQkFBTyxFQUFFLENBQUM7b0JBQ3hDLGFBQVEsR0FBVyxHQUFHLENBQUM7b0JBR3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUUxQixhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNyQixhQUFRLEdBQVEsSUFBSSxDQUFDO29CQUNyQixVQUFLLEdBQTJCLElBQUksQ0FBQztnQkFDOUMsQ0FBQzthQUFBLENBQUE7O1lBRUQsa0JBQUEs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