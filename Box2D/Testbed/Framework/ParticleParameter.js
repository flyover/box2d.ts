/*
 * Copyright (c) 2014 Google, Inc.
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
System.register(["../../Box2D/Box2D"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var box2d, ParticleParameterOptions, ParticleParameterValue, ParticleParameterDefinition, ParticleParameter;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            }
        ],
        execute: function () {/*
             * Copyright (c) 2014 Google, Inc.
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
            (function (ParticleParameterOptions) {
                ParticleParameterOptions[ParticleParameterOptions["OptionStrictContacts"] = 1] = "OptionStrictContacts";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawShapes"] = 2] = "OptionDrawShapes";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawParticles"] = 4] = "OptionDrawParticles";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawJoints"] = 8] = "OptionDrawJoints";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawAABBs"] = 16] = "OptionDrawAABBs";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactPoints"] = 32] = "OptionDrawContactPoints";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactNormals"] = 64] = "OptionDrawContactNormals";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactImpulse"] = 128] = "OptionDrawContactImpulse";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawFrictionImpulse"] = 256] = "OptionDrawFrictionImpulse";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawCOMs"] = 512] = "OptionDrawCOMs";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawStats"] = 1024] = "OptionDrawStats";
                ParticleParameterOptions[ParticleParameterOptions["OptionDrawProfile"] = 2048] = "OptionDrawProfile";
            })(ParticleParameterOptions || (ParticleParameterOptions = {}));
            exports_1("ParticleParameterOptions", ParticleParameterOptions);
            ParticleParameterValue = class ParticleParameterValue {
                /**
                 * ParticleParameterValue of a particle parameter.
                 */
                constructor(value, options, name) {
                    /**
                     * ParticleParameterValue associated with the parameter.
                     */
                    this.value = 0;
                    /**
                     * Any global (non particle-specific) options associated with
                     * this parameter
                     */
                    this.options = 0;
                    /**
                     * Name to display when this parameter is selected.
                     */
                    this.name = "";
                    this.value = value;
                    this.options = options;
                    this.name = name;
                }
            };
            exports_1("ParticleParameterValue", ParticleParameterValue);
            ParticleParameterDefinition = class ParticleParameterDefinition {
                /**
                 * Particle parameter definition.
                 */
                constructor(values, numValues = values.length) {
                    this.values = null;
                    this.numValues = 0;
                    this.values = values;
                    this.numValues = numValues;
                }
                CalculateValueMask() {
                    let mask = 0;
                    for (let i = 0; i < this.numValues; i++) {
                        mask |= this.values[i].value;
                    }
                    return mask;
                }
            };
            exports_1("ParticleParameterDefinition", ParticleParameterDefinition);
            ParticleParameter = class ParticleParameter {
                constructor() {
                    this.m_index = 0;
                    this.m_changed = false;
                    this.m_restartOnChange = false;
                    this.m_value = null;
                    this.m_definition = null;
                    this.m_definitionCount = 0;
                    this.m_valueCount = 0;
                    this.Reset();
                }
                Reset() {
                    this.m_restartOnChange = true;
                    this.m_index = 0;
                    this.SetDefinition(ParticleParameter.k_defaultDefinition);
                    this.Set(0);
                }
                SetDefinition(definition, definitionCount = definition.length) {
                    this.m_definition = definition;
                    this.m_definitionCount = definitionCount;
                    this.m_valueCount = 0;
                    for (let i = 0; i < this.m_definitionCount; ++i) {
                        this.m_valueCount += this.m_definition[i].numValues;
                    }
                    // Refresh the selected value.
                    this.Set(this.Get());
                }
                Get() {
                    return this.m_index;
                }
                Set(index) {
                    this.m_changed = this.m_index !== index;
                    this.m_index = this.m_valueCount ? index % this.m_valueCount : index;
                    this.m_value = this.FindParticleParameterValue();
                    box2d.b2Assert(this.m_value !== null);
                }
                Increment() {
                    let index = this.Get();
                    this.Set(index >= this.m_valueCount ? 0 : index + 1);
                }
                Decrement() {
                    let index = this.Get();
                    this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
                }
                Changed(restart) {
                    let changed = this.m_changed;
                    this.m_changed = false;
                    if (restart) {
                        restart[0] = changed && this.GetRestartOnChange();
                    }
                    return changed;
                }
                GetValue() {
                    box2d.b2Assert(this.m_value !== null);
                    return this.m_value.value;
                }
                GetName() {
                    box2d.b2Assert(this.m_value !== null);
                    return this.m_value.name;
                }
                GetOptions() {
                    box2d.b2Assert(this.m_value !== null);
                    return this.m_value.options;
                }
                SetRestartOnChange(enable) {
                    this.m_restartOnChange = enable;
                }
                GetRestartOnChange() {
                    return this.m_restartOnChange;
                }
                FindIndexByValue(value) {
                    let index = 0;
                    for (let i = 0; i < this.m_definitionCount; ++i) {
                        let definition = this.m_definition[i];
                        let numValues = definition.numValues;
                        for (let j = 0; j < numValues; ++j, ++index) {
                            if (definition.values[j].value === value)
                                return index;
                        }
                    }
                    return -1;
                }
                FindParticleParameterValue() {
                    let start = 0;
                    let index = this.Get();
                    for (let i = 0; i < this.m_definitionCount; ++i) {
                        let definition = this.m_definition[i];
                        let end = start + definition.numValues;
                        if (index >= start && index < end) {
                            return definition.values[index - start];
                        }
                        start = end;
                    }
                    return null;
                }
            };
            ParticleParameter.k_DefaultOptions = ParticleParameterOptions.OptionDrawShapes | ParticleParameterOptions.OptionDrawParticles;
            ParticleParameter.k_particleTypes = [
                new ParticleParameterValue(0 /* b2_waterParticle */, ParticleParameter.k_DefaultOptions, "water"),
                new ParticleParameterValue(0 /* b2_waterParticle */, ParticleParameter.k_DefaultOptions | ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
                new ParticleParameterValue(8 /* b2_springParticle */, ParticleParameter.k_DefaultOptions, "spring"),
                new ParticleParameterValue(16 /* b2_elasticParticle */, ParticleParameter.k_DefaultOptions, "elastic"),
                new ParticleParameterValue(32 /* b2_viscousParticle */, ParticleParameter.k_DefaultOptions, "viscous"),
                new ParticleParameterValue(64 /* b2_powderParticle */, ParticleParameter.k_DefaultOptions, "powder"),
                new ParticleParameterValue(128 /* b2_tensileParticle */, ParticleParameter.k_DefaultOptions, "tensile"),
                new ParticleParameterValue(256 /* b2_colorMixingParticle */, ParticleParameter.k_DefaultOptions, "color mixing"),
                new ParticleParameterValue(4 /* b2_wallParticle */, ParticleParameter.k_DefaultOptions, "wall"),
                new ParticleParameterValue(1024 /* b2_barrierParticle */ | 4 /* b2_wallParticle */, ParticleParameter.k_DefaultOptions, "barrier"),
                new ParticleParameterValue(2048 /* b2_staticPressureParticle */, ParticleParameter.k_DefaultOptions, "static pressure"),
                new ParticleParameterValue(0 /* b2_waterParticle */, ParticleParameter.k_DefaultOptions | ParticleParameterOptions.OptionDrawAABBs, "water (bounding boxes)")
            ];
            ParticleParameter.k_defaultDefinition = [
                new ParticleParameterDefinition(ParticleParameter.k_particleTypes)
            ];
            exports_1("ParticleParameter", ParticleParameter);
            (function (ParticleParameter) {
                ParticleParameter.Options = ParticleParameterOptions;
                class Value extends ParticleParameterValue {
                }
                ParticleParameter.Value = Value;
                class Definition extends ParticleParameterDefinition {
                }
                ParticleParameter.Definition = Definition;
            })(ParticleParameter || (ParticleParameter = {}));
            exports_1("ParticleParameter", ParticleParameter);
            ///#endif
        }
    };
});
