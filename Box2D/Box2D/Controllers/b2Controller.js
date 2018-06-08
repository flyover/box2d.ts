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
                    this.m_bodyList = new Set();
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
                    this.m_bodyList.add(edge);
                    //Add edge to body list
                    body.m_controllerList.add(edge);
                }
                /**
                 * Removes a body from the controller list.
                 */
                RemoveBody(body) {
                    //Assert that the controller is not empty
                    if (this.m_bodyList.size <= 0) {
                        throw new Error();
                    }
                    //Find the corresponding edge
                    /*b2ControllerEdge*/
                    let edge = null;
                    for (const e of this.m_bodyList) {
                        if (e.body === body) {
                            edge = e;
                        }
                    }
                    //Assert that we are removing a body that is currently attached to the controller
                    if (edge === null) {
                        throw new Error();
                    }
                    //Remove edge from controller list
                    this.m_bodyList.delete(edge);
                    //Remove edge from body list
                    body.m_controllerList.delete(edge);
                }
                /**
                 * Removes all bodies from the controller list.
                 */
                Clear() {
                    for (const edge of this.m_bodyList) {
                        this.RemoveBody(edge.body);
                    }
                }
            };
            exports_1("b2Controller", b2Controller);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7OztZQVFIOzs7ZUFHRztZQUNILG1CQUFBO2dCQUdFLFlBQVksVUFBd0IsRUFBRSxJQUFZO29CQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7YUFDRixDQUFBOztZQUVEOzs7ZUFHRztZQUNILGVBQUE7Z0JBQUE7b0JBQ0Usb0JBQW9CO29CQUNKLGVBQVUsR0FBMEIsSUFBSSxHQUFHLEVBQW9CLENBQUM7Z0JBeUVsRixDQUFDO2dCQTdEQzs7bUJBRUc7Z0JBQ0gsZUFBZTtnQkFDZix5QkFBeUI7Z0JBQ3pCLElBQUk7Z0JBRUo7O21CQUVHO2dCQUNJLFdBQVc7b0JBQ2hCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDekIsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0ksT0FBTyxDQUFDLElBQVk7b0JBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUU5Qyw2QkFBNkI7b0JBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUUxQix1QkFBdUI7b0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLFVBQVUsQ0FBQyxJQUFZO29CQUM1Qix5Q0FBeUM7b0JBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFckQsNkJBQTZCO29CQUM3QixvQkFBb0I7b0JBQ3BCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDaEIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFOzRCQUNuQixJQUFJLEdBQUcsQ0FBQyxDQUFDO3lCQUNWO3FCQUNGO29CQUVELGlGQUFpRjtvQkFDakYsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFekMsa0NBQWtDO29CQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFN0IsNEJBQTRCO29CQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUVEOzttQkFFRztnQkFDSSxLQUFLO29CQUNWLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzVCO2dCQUNILENBQUM7YUFDRixDQUFBIn0=