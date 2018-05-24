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

import { b2Assert, b2TimeStep, b2Draw, b2Body, b2World } from "../../../Box2D/Box2D/Box2D";

/**
 * A controller edge is used to connect bodies and controllers
 * together in a bipartite graph.
 */
export class b2ControllerEdge {
  controller: b2Controller = null; ///< provides quick access to other end of this edge.
  body: b2Body = null; ///< the body
  prevBody: b2ControllerEdge = null; ///< the previous controller edge in the controllers's joint list
  nextBody: b2ControllerEdge = null; ///< the next controller edge in the controllers's joint list
  prevController: b2ControllerEdge = null; ///< the previous controller edge in the body's joint list
  nextController: b2ControllerEdge = null; ///< the next controller edge in the body's joint list
}


/**
 * Base class for controllers. Controllers are a convience for
 * encapsulating common per-step functionality.
 */
export abstract class b2Controller {
  m_world: b2World = null;
  m_bodyList: b2ControllerEdge = null;
  m_bodyCount: number = 0;
  m_prev: b2Controller | null = null;
  m_next: b2Controller | null = null;

  /**
   * Controllers override this to implement per-step functionality.
   */
  abstract Step(step: b2TimeStep): void;

  /**
   * Controllers override this to provide debug drawing.
   */
  abstract Draw(debugDraw: b2Draw): void;

  /**
   * Get the next controller in the world's body list.
   */
  GetNext() {
    return this.m_next;
  }

  /**
   * Get the previous controller in the world's body list.
   */
  GetPrev() {
    return this.m_prev;
  }

  /**
   * Get the parent world of this body.
   */
  GetWorld() {
    return this.m_world;
  }

  /**
   * Get the attached body list
   */
  GetBodyList() {
    return this.m_bodyList;
  }

  /**
   * Adds a body to the controller list.
   */
  AddBody(body: b2Body) {
    const edge = new b2ControllerEdge();

    edge.body = body;
    edge.controller = this;

    //Add edge to controller list
    edge.nextBody = this.m_bodyList;
    edge.prevBody = null;
    if (this.m_bodyList)
      this.m_bodyList.prevBody = edge;
    this.m_bodyList = edge;
    ++this.m_bodyCount;

    //Add edge to body list
    edge.nextController = body.m_controllerList;
    edge.prevController = null;
    if (body.m_controllerList)
      body.m_controllerList.prevController = edge;
    body.m_controllerList = edge;
    ++body.m_controllerCount;
  }

  /**
   * Removes a body from the controller list.
   */
  RemoveBody(body: b2Body) {
    //Assert that the controller is not empty
    b2Assert(this.m_bodyCount > 0);

    //Find the corresponding edge
    /*b2ControllerEdge*/
    let edge = this.m_bodyList;
    while (edge && edge.body !== body)
      edge = edge.nextBody;

    //Assert that we are removing a body that is currently attached to the controller
    b2Assert(edge !== null);

    //Remove edge from controller list
    if (edge.prevBody)
      edge.prevBody.nextBody = edge.nextBody;
    if (edge.nextBody)
      edge.nextBody.prevBody = edge.prevBody;
    if (this.m_bodyList === edge)
      this.m_bodyList = edge.nextBody;
    --this.m_bodyCount;

    //Remove edge from body list
    if (edge.nextController)
      edge.nextController.prevController = edge.prevController;
    if (edge.prevController)
      edge.prevController.nextController = edge.nextController;
    if (body.m_controllerList === edge)
      body.m_controllerList = edge.nextController;
    --body.m_controllerCount;
  }

  /**
   * Removes all bodies from the controller list.
   */
  Clear(): void {
    while (this.m_bodyList) {
      this.RemoveBody(this.m_bodyList.body);
    }

    this.m_bodyCount = 0;
  }
}

// #endif
