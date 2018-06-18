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
System.register(["Box2D"], function (exports_1, context_1) {
    "use strict";
    var box2d, ParticleParameterOptions, ParticleParameterValue, ParticleParameterDefinition, ParticleParameter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            }
        ],
        execute: function () {
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
                    this.m_definition = ParticleParameter.k_defaultDefinition;
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
                    // DEBUG: box2d.b2Assert(this.m_value !== null);
                }
                Increment() {
                    const index = this.Get();
                    this.Set(index >= this.m_valueCount ? 0 : index + 1);
                }
                Decrement() {
                    const index = this.Get();
                    this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
                }
                Changed(restart) {
                    const changed = this.m_changed;
                    this.m_changed = false;
                    if (restart) {
                        restart[0] = changed && this.GetRestartOnChange();
                    }
                    return changed;
                }
                GetValue() {
                    if (this.m_value === null) {
                        throw new Error();
                    }
                    return this.m_value.value;
                }
                GetName() {
                    if (this.m_value === null) {
                        throw new Error();
                    }
                    return this.m_value.name;
                }
                GetOptions() {
                    if (this.m_value === null) {
                        throw new Error();
                    }
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
                        const definition = this.m_definition[i];
                        const numValues = definition.numValues;
                        for (let j = 0; j < numValues; ++j, ++index) {
                            if (definition.values[j].value === value) {
                                return index;
                            }
                        }
                    }
                    return -1;
                }
                FindParticleParameterValue() {
                    let start = 0;
                    const index = this.Get();
                    for (let i = 0; i < this.m_definitionCount; ++i) {
                        const definition = this.m_definition[i];
                        const end = start + definition.numValues;
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
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions, "water"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_springParticle, ParticleParameter.k_DefaultOptions, "spring"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_elasticParticle, ParticleParameter.k_DefaultOptions, "elastic"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "viscous"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "powder"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_colorMixingParticle, ParticleParameter.k_DefaultOptions, "color mixing"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "wall"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "barrier"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_staticPressureParticle, ParticleParameter.k_DefaultOptions, "static pressure"),
                new ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | ParticleParameterOptions.OptionDrawAABBs, "water (bounding boxes)"),
            ];
            ParticleParameter.k_defaultDefinition = [
                new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVQYXJhbWV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9GcmFtZXdvcmsvUGFydGljbGVQYXJhbWV0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7OztZQU1ILFdBQVksd0JBQXdCO2dCQUNsQyx1R0FBNkIsQ0FBQTtnQkFDN0IsK0ZBQXlCLENBQUE7Z0JBQ3pCLHFHQUE0QixDQUFBO2dCQUM1QiwrRkFBeUIsQ0FBQTtnQkFDekIsOEZBQXdCLENBQUE7Z0JBQ3hCLDhHQUFnQyxDQUFBO2dCQUNoQyxnSEFBaUMsQ0FBQTtnQkFDakMsaUhBQWlDLENBQUE7Z0JBQ2pDLG1IQUFrQyxDQUFBO2dCQUNsQyw2RkFBdUIsQ0FBQTtnQkFDdkIsZ0dBQXlCLENBQUE7Z0JBQ3pCLG9HQUEyQixDQUFBO1lBQzdCLENBQUMsRUFiVyx3QkFBd0IsS0FBeEIsd0JBQXdCLFFBYW5DOztZQUVELHlCQUFBO2dCQUNFOzttQkFFRztnQkFDSCxZQUFZLEtBQWEsRUFBRSxPQUFpQyxFQUFFLElBQVk7b0JBTTFFOzt1QkFFRztvQkFDSSxVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUV6Qjs7O3VCQUdHO29CQUNJLFlBQU8sR0FBNkIsQ0FBQyxDQUFDO29CQUU3Qzs7dUJBRUc7b0JBQ0ksU0FBSSxHQUFHLEVBQUUsQ0FBQztvQkFuQmYsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDbkIsQ0FBQzthQWlCRixDQUFBOztZQUVELDhCQUFBO2dCQUNFOzttQkFFRztnQkFDSCxZQUFZLE1BQWdDLEVBQUUsWUFBb0IsTUFBTSxDQUFDLE1BQU07b0JBTXhFLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBTDNCLElBQUksQ0FBQyxNQUFNLEdBQUcs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