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
System.register([], function (exports_1, context_1) {
    "use strict";
    var b2ControllerEdge, b2Controller;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /**
             * A controller edge is used to connect bodies and controllers
             * together in a bipartite graph.
             */
            b2ControllerEdge = class b2ControllerEdge {
                constructor(controller, body) {
                    this.prevBody = null; ///< the previous controller edge in the controllers's joint list
                    this.nextBody = null; ///< the next controller edge in the controllers's joint list
                    this.prevController = null; ///< the previous controller edge in the body's joint list
                    this.nextController = null; ///< the next controller edge in the body's joint list
                    this.controller = controller;
                    this.body = body;
                }
            };
            exports_1("b2ControllerEdge", b2ControllerEdge);
            /**
             * Base class for controllers. Controllers are a convience for
             * encapsulating common per-step functionality.
             */
            b2Controller = class b2Controller {
                constructor() {
                    // m_world: b2World;
                    this.m_bodyList = null;
                    this.m_bodyCount = 0;
                    this.m_prev = null;
                    this.m_next = null;
                }
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
                // GetWorld() {
                //   return this.m_world;
                // }
                /**
                 * Get the attached body list
                 */
                GetBodyList() {
                    return this.m_bodyList;
                }
                /**
                 * Adds a body to the controller list.
                 */
                AddBody(body) {
                    const edge = new b2ControllerEdge(this, body);
                    //Add edge to controller list
                    edge.nextBody = this.m_bodyList;
                    edge.prevBody = null;
                    if (this.m_bodyList) {
                        this.m_bodyList.prevBody = edge;
                    }
                    this.m_bodyList = edge;
                    ++this.m_bodyCount;
                    //Add edge to body list
                    edge.nextController = body.m_controllerList;
                    edge.prevController = null;
                    if (body.m_controllerList) {
                        body.m_controllerList.prevController = edge;
                    }
                    body.m_controllerList = edge;
                    ++body.m_controllerCount;
                }
                /**
                 * Removes a body from the controller list.
                 */
                RemoveBody(body) {
                    //Assert that the controller is not empty
                    if (this.m_bodyCount <= 0) {
                        throw new Error();
                    }
                    //Find the corresponding edge
                    /*b2ControllerEdge*/
                    let edge = this.m_bodyList;
                    while (edge && edge.body !== body) {
                        edge = edge.nextBody;
                    }
                    //Assert that we are removing a body that is currently attached to the controller
                    if (edge === null) {
                        throw new Error();
                    }
                    //Remove edge from controller list
                    if (edge.prevBody) {
                        edge.prevBody.nextBody = edge.nextBody;
                    }
                    if (edge.nextBody) {
                        edge.nextBody.prevBody = edge.prevBody;
                    }
                    if (this.m_bodyList === edge) {
                        this.m_bodyList = edge.nextBody;
                    }
                    --this.m_bodyCount;
                    //Remove edge from body list
                    if (edge.nextController) {
                        edge.nextController.prevController = edge.prevController;
                    }
                    if (edge.prevController) {
                        edge.prevController.nextController = edge.nextController;
                    }
                    if (body.m_controllerList === edge) {
                        body.m_controllerList = edge.nextController;
                    }
                    --body.m_controllerCount;
                }
                /**
                 * Removes all bodies from the controller list.
                 */
                Clear() {
                    while (this.m_bodyList) {
                        this.RemoveBody(this.m_bodyList.body);
                    }
                    this.m_bodyCount = 0;
                }
            };
            exports_1("b2Controller", b2Controller);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7OztZQVFIOzs7ZUFHRztZQUNILG1CQUFBLE1BQWEsZ0JBQWdCO2dCQU8zQixZQUFZLFVBQXdCLEVBQUUsSUFBWTtvQkFKM0MsYUFBUSxHQUE0QixJQUFJLENBQUMsQ0FBQyxpRUFBaUU7b0JBQzNHLGFBQVEsR0FBNEIsSUFBSSxDQUFDLENBQUMsNkRBQTZEO29CQUN2RyxtQkFBYyxHQUE0QixJQUFJLENBQUMsQ0FBQywwREFBMEQ7b0JBQzFHLG1CQUFjLEdBQTRCLElBQUksQ0FBQyxDQUFDLHNEQUFzRDtvQkFFM0csSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixDQUFDO2FBQ0YsQ0FBQTs7WUFFRDs7O2VBR0c7WUFDSCxlQUFBLE1BQXNCLFlBQVk7Z0JBQWxDO29CQUNFLG9CQUFvQjtvQkFDYixlQUFVLEdBQTRCLElBQUksQ0FBQztvQkFDM0MsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLFdBQU0sR0FBd0IsSUFBSSxDQUFDO29CQUNuQyxXQUFNLEdBQXdCLElBQUksQ0FBQztnQkFxSDVDLENBQUM7Z0JBekdDOzttQkFFRztnQkFDSSxPQUFPO29CQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0ksT0FBTztvQkFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNILGVBQWU7Z0JBQ2YseUJBQXlCO2dCQUN6QixJQUFJO2dCQUVKOzttQkFFRztnQkFDSSxXQUFXO29CQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRUQ7O21C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