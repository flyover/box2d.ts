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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvQ29udHJvbGxlcnMvYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7OztZQVFIOzs7ZUFHRztZQUNILG1CQUFBO2dCQU9FLFlBQVksVUFBd0IsRUFBRSxJQUFZO29CQUozQyxhQUFRLEdBQTRCLElBQUksQ0FBQyxDQUFDLGlFQUFpRTtvQkFDM0csYUFBUSxHQUE0QixJQUFJLENBQUMsQ0FBQyw2REFBNkQ7b0JBQ3ZHLG1CQUFjLEdBQTRCLElBQUksQ0FBQyxDQUFDLDBEQUEwRDtvQkFDMUcsbUJBQWMsR0FBNEIsSUFBSSxDQUFDLENBQUMsc0RBQXNEO29CQUUzRyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7YUFDRixDQUFBOztZQUVEOzs7ZUFHRztZQUNILGVBQUE7Z0JBQUE7b0JBQ0Usb0JBQW9CO29CQUNiLGVBQVUsR0FBNEIsSUFBSSxDQUFDO29CQUMzQyxnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsV0FBTSxHQUF3QixJQUFJLENBQUM7b0JBQ25DLFdBQU0sR0FBd0IsSUFBSSxDQUFDO2dCQXFINUMsQ0FBQztnQkF6R0M7O21CQUVHO2dCQUNJLE9BQU87b0JBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVEOzttQkFFRztnQkFDSSxPQUFPO29CQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0gsZUFBZTtnQkFDZix5QkFBeUI7Z0JBQ3pCLElBQUk7Z0JBRUo7O21CQUVHO2dCQUNJLFdBQVc7b0JBQ2hCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDekIsQ0FBQztnQkFFRDs7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