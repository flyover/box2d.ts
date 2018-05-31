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
    var Box2D_1, b2ControllerEdge, b2Controller;
    var __moduleName = context_1 && context_1.id;
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
                RemoveBody(body) {
                    //Assert that the controller is not empty
                    Box2D_1.b2Assert(this.m_bodyCount > 0);
                    //Find the corresponding edge
                    /*b2ControllerEdge*/
                    let edge = this.m_bodyList;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFNSDs7O2VBR0c7WUFDSCxtQkFBQTtnQkFBQTtvQkFDRSxlQUFVLEdBQWlCLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtvQkFDdEYsU0FBSSxHQUFXLElBQUksQ0FBQyxDQUFDLGFBQWE7b0JBQ2xDLGFBQVEsR0FBcUIsSUFBSSxDQUFDLENBQUMsaUVBQWlFO29CQUNwRyxhQUFRLEdBQXFCLElBQUksQ0FBQyxDQUFDLDZEQUE2RDtvQkFDaEcsbUJBQWMsR0FBcUIsSUFBSSxDQUFDLENBQUMsMERBQTBEO29CQUNuRyxtQkFBYyxHQUFxQixJQUFJLENBQUMsQ0FBQyxzREFBc0Q7Z0JBQ2pHLENBQUM7YUFBQSxDQUFBOztZQUdEOzs7ZUFHRztZQUNILGVBQUE7Z0JBQUE7b0JBQ0UsWUFBTyxHQUFZLElBQUksQ0FBQztvQkFDeEIsZUFBVSxHQUFxQixJQUFJLENBQUM7b0JBQ3BDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixXQUFNLEdBQXdCLElBQUksQ0FBQztvQkFDbkMsV0FBTSxHQUF3QixJQUFJLENBQUM7Z0JBK0dyQyxDQUFDO2dCQW5HQzs7bUJBRUc7Z0JBQ0gsT0FBTztvQkFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNILE9BQU87b0JBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVEOzttQkFFRztnQkFDSCxRQUFRO29CQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0gsV0FBVztvQkFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNI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