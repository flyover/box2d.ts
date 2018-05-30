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

// #if B2_ENABLE_PARTICLE

import * as box2d from "Box2D";

export enum ParticleParameterOptions {
  OptionStrictContacts = 1 << 0,
  OptionDrawShapes = 1 << 1,
  OptionDrawParticles = 1 << 2,
  OptionDrawJoints = 1 << 3,
  OptionDrawAABBs = 1 << 4,
  OptionDrawContactPoints = 1 << 5,
  OptionDrawContactNormals = 1 << 6,
  OptionDrawContactImpulse = 1 << 7,
  OptionDrawFrictionImpulse = 1 << 8,
  OptionDrawCOMs = 1 << 9,
  OptionDrawStats = 1 << 10,
  OptionDrawProfile = 1 << 11
}

export class ParticleParameterValue {
  /**
   * ParticleParameterValue of a particle parameter.
   */
  constructor(value: number, options: ParticleParameterOptions, name: string) {
    this.value = value;
    this.options = options;
    this.name = name;
  }

  /**
   * ParticleParameterValue associated with the parameter.
   */
  value: number = 0;

  /**
   * Any global (non particle-specific) options associated with
   * this parameter
   */
  options: ParticleParameterOptions = 0;

  /**
   * Name to display when this parameter is selected.
   */
  name = "";
}

export class ParticleParameterDefinition {
  /**
   * Particle parameter definition.
   */
  constructor(values: ParticleParameterValue[], numValues: number = values.length) {
    this.values = values;
    this.numValues = numValues;
  }

  values: ParticleParameterValue[] = null;
  numValues: number = 0;

  CalculateValueMask(): number {
    let mask = 0;
    for (let i = 0; i < this.numValues; i++) {
      mask |= this.values[i].value;
    }
    return mask;
  }
}

export class ParticleParameter {
  static k_DefaultOptions: ParticleParameterOptions = ParticleParameterOptions.OptionDrawShapes | ParticleParameterOptions.OptionDrawParticles;
  static k_particleTypes: ParticleParameterValue[] = [
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
    new ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | ParticleParameterOptions.OptionDrawAABBs, "water (bounding boxes)")
  ];
  static k_defaultDefinition: ParticleParameterDefinition[] = [
    new ParticleParameterDefinition(ParticleParameter.k_particleTypes)
  ];

  m_index = 0;
  m_changed = false;
  m_restartOnChange = false;
  m_value: ParticleParameterValue = null;
  m_definition: ParticleParameterDefinition[] = null;
  m_definitionCount = 0;
  m_valueCount = 0;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.m_restartOnChange = true;
    this.m_index = 0;
    this.SetDefinition(ParticleParameter.k_defaultDefinition);
    this.Set(0);
  }

  SetDefinition(definition: ParticleParameterDefinition[], definitionCount: number = definition.length): void {
    this.m_definition = definition;
    this.m_definitionCount = definitionCount;
    this.m_valueCount = 0;
    for (let i = 0; i < this.m_definitionCount; ++i) {
      this.m_valueCount += this.m_definition[i].numValues;
    }
    // Refresh the selected value.
    this.Set(this.Get());
  }

  Get(): number {
    return this.m_index;
  }

  Set(index: number): void {
    this.m_changed = this.m_index !== index;
    this.m_index = this.m_valueCount ? index % this.m_valueCount : index;
    this.m_value = this.FindParticleParameterValue();
    box2d.b2Assert(this.m_value !== null);
  }

  Increment(): void {
    let index = this.Get();
    this.Set(index >= this.m_valueCount ? 0 : index + 1);
  }

  Decrement(): void {
    let index = this.Get();
    this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
  }

  Changed(restart: boolean[]): boolean {
    let changed = this.m_changed;
    this.m_changed = false;
    if (restart) {
      restart[0] = changed && this.GetRestartOnChange();
    }
    return changed;
  }

  GetValue(): number {
    box2d.b2Assert(this.m_value !== null);
    return this.m_value.value;
  }

  GetName(): string {
    box2d.b2Assert(this.m_value !== null);
    return this.m_value.name;
  }

  GetOptions(): ParticleParameterOptions {
    box2d.b2Assert(this.m_value !== null);
    return this.m_value.options;
  }

  SetRestartOnChange(enable: boolean): void {
    this.m_restartOnChange = enable;
  }

  GetRestartOnChange(): boolean {
    return this.m_restartOnChange;
  }

  FindIndexByValue(value: number): number {
    let index = 0;
    for (let i = 0; i < this.m_definitionCount; ++i) {
      let definition = this.m_definition[i];
      let numValues = definition.numValues;
      for (let j = 0; j < numValues; ++j, ++index) {
        if (definition.values[j].value === value) return index;
      }
    }
    return -1;
  }

  FindParticleParameterValue(): ParticleParameterValue {
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
}

export namespace ParticleParameter {
  export const Options = ParticleParameterOptions;
  export class Value extends ParticleParameterValue {}
  export class Definition extends ParticleParameterDefinition {}
}

// #endif
