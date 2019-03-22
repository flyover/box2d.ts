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
  OptionDrawProfile = 1 << 11,
}

export class ParticleParameterValue {
  /**
   * ParticleParameterValue of a particle parameter.
   */
  constructor(value: ParticleParameterValue);
  constructor(value: number, options: ParticleParameterOptions, name: string);
  constructor(...args: any[]) {
    if (args[0] instanceof ParticleParameterValue) {
      this.Copy(args[0]);
    } else {
      this.value = args[0];
      this.options = args[1];
      this.name = args[2];
    }
  }

  /**
   * ParticleParameterValue associated with the parameter.
   */
  public value: number = 0;

  /**
   * Any global (non particle-specific) options associated with
   * this parameter
   */
  public options: ParticleParameterOptions = 0;

  /**
   * Name to display when this parameter is selected.
   */
  public name = "";

  public Copy(other: ParticleParameterValue): this {
    this.value = other.value;
    this.options = other.options;
    this.name = other.name;
    return this;
  }
}

export class ParticleParameterDefinition {
  /**
   * Particle parameter definition.
   */
  constructor(values: ParticleParameterValue[], numValues: number = values.length) {
    this.values = values;
    this.numValues = numValues;
  }

  public values: ParticleParameterValue[];
  public numValues: number = 0;

  public CalculateValueMask(): number {
    let mask = 0;
    for (let i = 0; i < this.numValues; i++) {
      mask |= this.values[i].value;
    }
    return mask;
  }
}

export class ParticleParameter {
  public static readonly k_DefaultOptions: ParticleParameterOptions = ParticleParameterOptions.OptionDrawShapes | ParticleParameterOptions.OptionDrawParticles;
  public static readonly k_particleTypes: ParticleParameterValue[] = [
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
  public static readonly k_defaultDefinition: ParticleParameterDefinition[] = [
    new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
  ];

  public m_index = 0;
  public m_changed = false;
  public m_restartOnChange = false;
  public m_value: ParticleParameterValue | null = null;
  public m_definition: ParticleParameterDefinition[] = ParticleParameter.k_defaultDefinition;
  public m_definitionCount = 0;
  public m_valueCount = 0;

  constructor() {
    this.Reset();
  }

  public Reset() {
    this.m_restartOnChange = true;
    this.m_index = 0;
    this.SetDefinition(ParticleParameter.k_defaultDefinition);
    this.Set(0);
  }

  public SetDefinition(definition: ParticleParameterDefinition[], definitionCount: number = definition.length): void {
    this.m_definition = definition;
    this.m_definitionCount = definitionCount;
    this.m_valueCount = 0;
    for (let i = 0; i < this.m_definitionCount; ++i) {
      this.m_valueCount += this.m_definition[i].numValues;
    }
    // Refresh the selected value.
    this.Set(this.Get());
  }

  public Get(): number {
    return this.m_index;
  }

  public Set(index: number): void {
    this.m_changed = this.m_index !== index;
    this.m_index = this.m_valueCount ? index % this.m_valueCount : index;
    this.m_value = this.FindParticleParameterValue();
    // DEBUG: box2d.b2Assert(this.m_value !== null);
  }

  public Increment(): void {
    const index = this.Get();
    this.Set(index >= this.m_valueCount ? 0 : index + 1);
  }

  public Decrement(): void {
    const index = this.Get();
    this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
  }

  public Changed(restart: boolean[]): boolean {
    const changed = this.m_changed;
    this.m_changed = false;
    if (restart) {
      restart[0] = changed && this.GetRestartOnChange();
    }
    return changed;
  }

  public GetValue(): number {
    if (this.m_value === null) { throw new Error(); }
    return this.m_value.value;
  }

  public GetName(): string {
    if (this.m_value === null) { throw new Error(); }
    return this.m_value.name;
  }

  public GetOptions(): ParticleParameterOptions {
    if (this.m_value === null) { throw new Error(); }
    return this.m_value.options;
  }

  public SetRestartOnChange(enable: boolean): void {
    this.m_restartOnChange = enable;
  }

  public GetRestartOnChange(): boolean {
    return this.m_restartOnChange;
  }

  public FindIndexByValue(value: number): number {
    let index = 0;
    for (let i = 0; i < this.m_definitionCount; ++i) {
      const definition = this.m_definition[i];
      const numValues = definition.numValues;
      for (let j = 0; j < numValues; ++j, ++index) {
        if (definition.values[j].value === value) { return index; }
      }
    }
    return -1;
  }

  public FindParticleParameterValue(): ParticleParameterValue | null {
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
}

// #endif
