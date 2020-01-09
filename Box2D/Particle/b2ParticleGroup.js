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
System.register(["../Common/b2Math.js", "../Common/b2Draw.js"], function (exports_1, context_1) {
    "use strict";
    var b2Math_js_1, b2Draw_js_1, b2ParticleGroupFlag, b2ParticleGroupDef, b2ParticleGroup;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Draw_js_1_1) {
                b2Draw_js_1 = b2Draw_js_1_1;
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
                    this.position = new b2Math_js_1.b2Vec2();
                    this.angle = 0.0;
                    this.linearVelocity = new b2Math_js_1.b2Vec2();
                    this.angularVelocity = 0.0;
                    this.color = new b2Draw_js_1.b2Color();
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
                    this.m_center = new b2Math_js_1.b2Vec2();
                    this.m_linearVelocity = new b2Math_js_1.b2Vec2();
                    this.m_angularVelocity = 0.0;
                    this.m_transform = new b2Math_js_1.b2Transform();
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
                    return b2Math_js_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_js_1.b2Vec2.SubVV(worldPoint, this.m_center, s_t0), out);
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
                    const p = new b2Math_js_1.b2Vec2();
                    const v = new b2Math_js_1.b2Vec2();
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
                            b2Math_js_1.b2Vec2.SubVV(this.m_system.m_positionBuffer.data[i], this.m_center, p);
                            ///b2Vec2 v = this.m_system.m_velocityBuffer.data[i] - this.m_linearVelocity;
                            b2Math_js_1.b2Vec2.SubVV(this.m_system.m_velocityBuffer.data[i], this.m_linearVelocity, v);
                            this.m_inertia += m * b2Math_js_1.b2Vec2.DotVV(p, p);
                            this.m_angularVelocity += m * b2Math_js_1.b2Vec2.CrossVV(p, v);
                        }
                        if (this.m_inertia > 0) {
                            this.m_angularVelocity *= 1 / this.m_inertia;
                        }
                        this.m_timestamp = this.m_system.m_timestamp;
                    }
                }
            };
            exports_1("b2ParticleGroup", b2ParticleGroup);
            b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0 = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZUdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJQYXJ0aWNsZUdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFXSCxXQUFZLG1CQUFtQjtnQkFDN0Isb0NBQW9DO2dCQUNwQywrRkFBOEIsQ0FBQTtnQkFDOUIsb0JBQW9CO2dCQUNwQiwrRkFBOEIsQ0FBQTtnQkFDOUIsd0NBQXdDO2dCQUN4Qyx5R0FBbUMsQ0FBQTtnQkFDbkMsOENBQThDO2dCQUM5QyxtSEFBd0MsQ0FBQTtnQkFDeEMsK0NBQStDO2dCQUMvQyxzSEFBeUMsQ0FBQTtnQkFFekMsOEdBQWlHLENBQUE7WUFDbkcsQ0FBQyxFQWJXLG1CQUFtQixLQUFuQixtQkFBbUIsUUFhOUI7O1lBc0JELHFCQUFBLE1BQWEsa0JBQWtCO2dCQUEvQjtvQkFDUyxVQUFLLEdBQW1CLENBQUMsQ0FBQztvQkFDMUIsZUFBVSxHQUF3QixDQUFDLENBQUM7b0JBQzNCLGFBQVEsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDekMsVUFBSyxHQUFXLEdBQUcsQ0FBQztvQkFDWCxtQkFBYyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMvQyxvQkFBZSxHQUFXLEdBQUcsQ0FBQztvQkFDckIsVUFBSyxHQUFZLElBQUksbUJBQU8sRUFBRSxDQUFDO29CQUN4QyxhQUFRLEdBQVcsR0FBRyxDQUFDO29CQUd2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO29CQUN2QixXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUNuQixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFFMUIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFRLElBQUksQ0FBQztvQkFDckIsVUFBSyxHQUEyQixJQUFJLENBQUM7Z0JBQzlDLENBQUM7YUFBQSxDQUFBOztZQUVELGtCQUFBLE1BQWEsZUFBZTtnQkFtQjFCLFlBQVks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