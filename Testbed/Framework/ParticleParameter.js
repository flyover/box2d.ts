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
                constructor(...args) {
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
                    if (args[0] instanceof ParticleParameterValue) {
                        this.Copy(args[0]);
                    }
                    else {
                        this.value = args[0];
                        this.options = args[1];
                        this.name = args[2];
                    }
                }
                Copy(other) {
                    this.value = other.value;
                    this.options = other.options;
                    this.name = other.name;
                    return this;
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
            exports_1("ParticleParameter", ParticleParameter);
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVQYXJhbWV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQYXJ0aWNsZVBhcmFtZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7O1lBTUgsV0FBWSx3QkFBd0I7Z0JBQ2xDLHVHQUE2QixDQUFBO2dCQUM3QiwrRkFBeUIsQ0FBQTtnQkFDekIscUdBQTRCLENBQUE7Z0JBQzVCLCtGQUF5QixDQUFBO2dCQUN6Qiw4RkFBd0IsQ0FBQTtnQkFDeEIsOEdBQWdDLENBQUE7Z0JBQ2hDLGdIQUFpQyxDQUFBO2dCQUNqQyxpSEFBaUMsQ0FBQTtnQkFDakMsbUhBQWtDLENBQUE7Z0JBQ2xDLDZGQUF1QixDQUFBO2dCQUN2QixnR0FBeUIsQ0FBQTtnQkFDekIsb0dBQTJCLENBQUE7WUFDN0IsQ0FBQyxFQWJXLHdCQUF3QixLQUF4Qix3QkFBd0IsUUFhbkM7O1lBRUQseUJBQUEsTUFBYSxzQkFBc0I7Z0JBTWpDLFlBQVksR0FBRyxJQUFXO29CQVUxQjs7dUJBRUc7b0JBQ0ksVUFBSyxHQUFXLENBQUMsQ0FBQztvQkFFekI7Ozt1QkFHRztvQkFDSSxZQUFPLEdBQTZCLENBQUMsQ0FBQztvQkFFN0M7O3VCQUVHO29CQUNJLFNBQUksR0FBRyxFQUFFLENBQUM7b0JBdkJmLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLHNCQUFzQixFQUFFO3dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNwQjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNyQjtnQkFDSCxDQUFD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