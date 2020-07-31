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

/**
 * Handles drawing and selection of full screen UI.
 */
export class FullScreenUI {
  constructor() {
    this.Reset();
  }

  /**
   * Whether particle parameters are enabled.
   */
  public m_particleParameterSelectionEnabled: boolean = false;

  /**
   * Reset the UI to it's initial state.
   */
  public Reset(): void {
    this.m_particleParameterSelectionEnabled = false;
  }

  /**
   * Enable / disable particle parameter selection.
   */
  public SetParticleParameterSelectionEnabled(enable: boolean): void {
    this.m_particleParameterSelectionEnabled = enable;
  }

  /**
   * Get whether particle parameter selection is enabled.
   */
  public GetParticleParameterSelectionEnabled(): boolean {
    return this.m_particleParameterSelectionEnabled;
  }
}

// #endif
