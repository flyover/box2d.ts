/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

// #if B2_ENABLE_CONTROLLER

import { b2List } from "../Common/b2Settings";
import { b2Body } from "../Dynamics/b2Body";
import { b2TimeStep } from "../Dynamics/b2TimeStep";
import { b2Draw } from "../Common/b2Draw";

/**
 * Base class for controllers. Controllers are a convience for
 * encapsulating common per-step functionality.
 */
export abstract class b2Controller {
  // m_world: b2World;
  public readonly m_bodyList: b2List<b2Body> = new b2List<b2Body>();

  /**
   * Controllers override this to implement per-step functionality.
   */
  public abstract Step(step: b2TimeStep): void;

  /**
   * Controllers override this to provide debug drawing.
   */
  public abstract Draw(debugDraw: b2Draw): void;

  /**
   * Get the parent world of this body.
   */
  // GetWorld() {
  //   return this.m_world;
  // }

  /**
   * Get the attached body list
   */
  public GetBodyList(): b2List<b2Body> {
    return this.m_bodyList;
  }

  /**
   * Adds a body to the controller list.
   */
  public AddBody(body: b2Body): void {
    //Add body to controller list
    this.m_bodyList.add(body);

    //Add body to body list
    body.m_controllerList.add(this);
  }

  /**
   * Removes a body from the controller list.
   */
  public RemoveBody(body: b2Body): void {
    //Assert that the controller is not empty
    if (this.m_bodyList.size <= 0) { throw new Error(); }

    //Remove body from controller list
    const found = this.m_bodyList.delete(body);

    //Assert that we are removing a body that is currently attached to the controller
    if (!found) { throw new Error(); }

    //Remove body from body list
    body.m_controllerList.delete(this);
  }

  /**
   * Removes all bodies from the controller list.
   */
  public Clear(): void {
    for (const body of this.m_bodyList) {
      this.RemoveBody(body);
    }
  }
}

// #endif
