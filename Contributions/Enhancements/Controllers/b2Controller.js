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
System.register(["../../../Box2D/Box2D/Box2D"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Box2D_1, b2ControllerEdge, b2Controller;
    return {
        setters: [
            function (Box2D_1_1) {
                Box2D_1 = Box2D_1_1;
            }
        ],
        execute: function () {
            /**
             * A controller edge is used to connect bodies and controllers
             * together in a bipartite graph.
             */
            b2ControllerEdge = class b2ControllerEdge {
                constructor() {
                    this.controller = null; ///< provides quick access to other end of this edge.
                    this.body = null; ///< the body
                    this.prevBody = null; ///< the previous controller edge in the controllers's joint list
                    this.nextBody = null; ///< the next controller edge in the controllers's joint list
                    this.prevController = null; ///< the previous controller edge in the body's joint list
                    this.nextController = null; ///< the next controller edge in the body's joint list
                }
            };
            exports_1("b2ControllerEdge", b2ControllerEdge);
            /**
             * Base class for controllers. Controllers are a convience for
             * encapsulating common per-step functionality.
             * @export
             * @constructor
             */
            b2Controller = class b2Controller {
                constructor() {
                    this.m_world = null;
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
                AddBody(body) {
                    var edge = new b2ControllerEdge();
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
                RemoveBody(body) {
                    //Assert that the controller is not empty
                    Box2D_1.b2Assert(this.m_bodyCount > 0);
                    //Find the corresponding edge
                    /*b2ControllerEdge*/
                    var edge = this.m_bodyList;
                    while (edge && edge.body !== body)
                        edge = edge.nextBody;
                    //Assert that we are removing a body that is currently attached to the controller
                    Box2D_1.b2Assert(edge !== null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFNSDs7O2VBR0c7WUFDSCxtQkFBQTtnQkFBQTtvQkFDRSxlQUFVLEdBQWlCLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtvQkFDdEYsU0FBSSxHQUFXLElBQUksQ0FBQyxDQUFDLGFBQWE7b0JBQ2xDLGFBQVEsR0FBcUIsSUFBSSxDQUFDLENBQUMsaUVBQWlFO29CQUNwRyxhQUFRLEdBQXFCLElBQUksQ0FBQyxDQUFDLDZEQUE2RDtvQkFDaEcsbUJBQWMsR0FBcUIsSUFBSSxDQUFDLENBQUMsMERBQTBEO29CQUNuRyxtQkFBYyxHQUFxQixJQUFJLENBQUMsQ0FBQyxzREFBc0Q7Z0JBQ2pHLENBQUM7YUFBQSxDQUFBOztZQUdEOzs7OztlQUtHO1lBQ0gsZUFBQTtnQkFBQTtvQkFDRSxZQUFPLEdBQVksSUFBSSxDQUFDO29CQUN4QixlQUFVLEdBQXFCLElBQUksQ0FBQztvQkFDcEMsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLFdBQU0sR0FBd0IsSUFBSSxDQUFDO29CQUNuQyxXQUFNLEdBQXdCLElBQUksQ0FBQztnQkErR3JDLENBQUM7Z0JBbkdDOzttQkFFRztnQkFDSCxPQUFPO29CQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0gsT0FBTztvQkFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNILFFBQVE7b0JBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUN0QixDQUFDO2dCQUVEOzttQkFFRztnQkFDSCxXQUFXO29CQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDekIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JB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