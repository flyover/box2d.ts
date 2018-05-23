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
System.register(["../Common/b2Math", "../Common/b2Draw"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Math_1, b2Draw_1, b2ParticleGroupFlag, b2ParticleGroupDef, b2ParticleGroup;
    return {
        setters: [
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
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
                    this.position = new b2Math_1.b2Vec2();
                    this.angle = 0.0;
                    this.linearVelocity = new b2Math_1.b2Vec2();
                    this.angularVelocity = 0.0;
                    this.color = new b2Draw_1.b2Color();
                    this.strength = 1.0;
                    this.shape = null;
                    this.shapes = null;
                    this.shapeCount = 0;
                    this.stride = 0;
                    this.particleCount = 0;
                    this.positionData = null;
                    this.lifetime = 0;
                    this.userData = null;
                    this.group = null;
                }
            };
            exports_1("b2ParticleGroupDef", b2ParticleGroupDef);
            b2ParticleGroup = class b2ParticleGroup {
                constructor() {
                    this.m_system = null;
                    this.m_firstIndex = 0;
                    this.m_lastIndex = 0;
                    this.m_groupFlags = 0;
                    this.m_strength = 1.0;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_timestamp = -1;
                    this.m_mass = 0.0;
                    this.m_inertia = 0.0;
                    this.m_center = new b2Math_1.b2Vec2();
                    this.m_linearVelocity = new b2Math_1.b2Vec2();
                    this.m_angularVelocity = 0.0;
                    this.m_transform = new b2Math_1.b2Transform();
                    ///m_transform.SetIdentity();
                    this.m_userData = null;
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
                    ///b2Assert((flags & b2ParticleGroupFlag.b2_particleGroupInternalMask) === 0);
                    flags |= this.m_groupFlags & 24 /* b2_particleGroupInternalMask */;
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
                    return b2Math_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_1.b2Vec2.SubVV(worldPoint, this.m_center, s_t0), out);
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
                    ///b2Assert(this.m_system.m_world.IsLocked() === false);
                    if (this.m_system.m_world.IsLocked()) {
                        return;
                    }
                    for (let i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                        this.m_system.DestroyParticle(i, callDestructionListener);
                    }
                }
                UpdateStatistics() {
                    const p = new b2Math_1.b2Vec2();
                    const v = new b2Math_1.b2Vec2();
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
                            b2Math_1.b2Vec2.SubVV(this.m_system.m_positionBuffer.data[i], this.m_center, p);
                            ///b2Vec2 v = this.m_system.m_velocityBuffer.data[i] - this.m_linearVelocity;
                            b2Math_1.b2Vec2.SubVV(this.m_system.m_velocityBuffer.data[i], this.m_linearVelocity, v);
                            this.m_inertia += m * b2Math_1.b2Vec2.DotVV(p, p);
                            this.m_angularVelocity += m * b2Math_1.b2Vec2.CrossVV(p, v);
                        }
                        if (this.m_inertia > 0) {
                            this.m_angularVelocity *= 1 / this.m_inertia;
                        }
                        this.m_timestamp = this.m_system.m_timestamp;
                    }
                }
            };
            b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0 = new b2Math_1.b2Vec2();
            exports_1("b2ParticleGroup", b2ParticleGroup);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZUdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJQYXJ0aWNsZUdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFVSCxXQUFrQixtQkFBbUI7Z0JBQ25DLG9DQUFvQztnQkFDcEMsK0ZBQThCLENBQUE7Z0JBQzlCLG9CQUFvQjtnQkFDcEIsK0ZBQThCLENBQUE7Z0JBQzlCLHdDQUF3QztnQkFDeEMseUdBQW1DLENBQUE7Z0JBQ25DLDhDQUE4QztnQkFDOUMsbUhBQXdDLENBQUE7Z0JBQ3hDLCtDQUErQztnQkFDL0Msc0hBQXlDLENBQUE7Z0JBRXpDLDhHQUFpRyxDQUFBO1lBQ25HLENBQUMsRUFiaUIsbUJBQW1CLEtBQW5CLG1CQUFtQixRQWFwQzs7WUFFRCxxQkFBQTtnQkFBQTtvQkFDRSxVQUFLLEdBQW1CLENBQUMsQ0FBQztvQkFDMUIsZUFBVSxHQUF3QixDQUFDLENBQUM7b0JBQ3BDLGFBQVEsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNoQyxVQUFLLEdBQVcsR0FBRyxDQUFDO29CQUNwQixtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3RDLG9CQUFlLEdBQVcsR0FBRyxDQUFDO29CQUM5QixVQUFLLEdBQVksSUFBSSxnQkFBTyxFQUFFLENBQUM7b0JBQy9CLGFBQVEsR0FBVyxHQUFHLENBQUM7b0JBQ3ZCLFVBQUssR0FBWSxJQUFJLENBQUM7b0JBQ3RCLFdBQU0sR0FBYyxJQUFJLENBQUM7b0JBQ3pCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixpQkFBWSxHQUFhLElBQUksQ0FBQztvQkFDOUIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFDckIsVUFBSyxHQUFv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