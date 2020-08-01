// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as box2d from "@box2d";

export class Settings {
  public m_testIndex: number = 0;
  public m_windowWidth: number = 1600;
  public m_windowHeight: number = 900;
  public m_hertz: number = 60;
  public m_velocityIterations: number = 8;
  public m_positionIterations: number = 3;
  // #if B2_ENABLE_PARTICLE
  // Particle iterations are needed for numerical stability in particle
  // simulations with small particles and relatively high gravity.
  // b2CalculateParticleIterations helps to determine the number.
  public m_particleIterations: number = box2d.b2CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
  // #endif
  public m_drawShapes: boolean = true;
  // #if B2_ENABLE_PARTICLE
  public m_drawParticles: boolean = true;
  // #endif
  public m_drawJoints: boolean = false;
  public m_drawAABBs: boolean = false;
  public m_drawContactPoints: boolean = false;
  public m_drawContactNormals: boolean = false;
  public m_drawContactImpulse: boolean = false;
  public m_drawFrictionImpulse: boolean = false;
  public m_drawCOMs: boolean = false;
  public m_drawControllers: boolean = true;
  public m_drawStats: boolean = false;
  public m_drawProfile: boolean = false;
  public m_enableWarmStarting: boolean = true;
  public m_enableContinuous: boolean = true;
  public m_enableSubStepping: boolean = false;
  public m_enableSleep: boolean = true;
  public m_pause: boolean = false;
  public m_singleStep: boolean = false;
  // #if B2_ENABLE_PARTICLE
  public m_strictContacts: boolean = false;
  // #endif

  public Reset(): void {
    this.m_testIndex = 0;
    this.m_windowWidth = 1600;
    this.m_windowHeight = 900;
    this.m_hertz = 60;
    this.m_velocityIterations = 8;
    this.m_positionIterations = 3;
    // #if B2_ENABLE_PARTICLE
    // Particle iterations are needed for numerical stability in particle
    // simulations with small particles and relatively high gravity.
    // b2CalculateParticleIterations helps to determine the number.
    this.m_particleIterations = box2d.b2CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
    // #endif
    this.m_drawShapes = true;
    // #if B2_ENABLE_PARTICLE
    this.m_drawParticles = true;
    // #endif
    this.m_drawJoints = false;
    this.m_drawAABBs = false;
    this.m_drawContactPoints = false;
    this.m_drawContactNormals = false;
    this.m_drawContactImpulse = false;
    this.m_drawFrictionImpulse = false;
    this.m_drawCOMs = false;
    // #if B2_ENABLE_CONTROLLER
    this.m_drawControllers = true;
    // #endif
    this.m_drawStats = false;
    this.m_drawProfile = false;
    this.m_enableWarmStarting = true;
    this.m_enableContinuous = true;
    this.m_enableSubStepping = false;
    this.m_enableSleep = true;
    this.m_pause = false;
    this.m_singleStep = false;
    // #if B2_ENABLE_PARTICLE
    this.m_strictContacts = false;
    // #endif
  }

  public Save(): void { }
  public Load(): void { }
}
