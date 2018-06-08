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
    var b2Controller;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
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
                    //Add body to controller list
                    this.m_bodyList.add(body);
                    //Add body to body list
                    body.m_controllerList.add(this);
                }
                /**
                 * Removes a body from the controller list.
                 */
                RemoveBody(body) {
                    //Assert that the controller is not empty
                    if (this.m_bodyList.size <= 0) {
                        throw new Error();
                    }
                    //Remove body from controller list
                    const found = this.m_bodyList.delete(body);
                    //Assert that we are removing a body that is currently attached to the controller
                    if (!found) {
                        throw new Error();
                    }
                    //Remove body from body list
                    body.m_controllerList.delete(this);
                }
                /**
                 * Removes all bodies from the controller list.
                 */
                Clear() {
                    for (const body of this.m_bodyList) {
                        this.RemoveBody(body);
                    }
                }
            };
            exports_1("b2Controller", b2Controller);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7OztZQVFIOzs7ZUFHRztZQUNILGVBQUE7Z0JBQUE7b0JBQ0Usb0JBQW9CO29CQUNKLGVBQVUsR0FBZ0IsSUFBSSxHQUFHLEVBQVUsQ0FBQztnQkE4RDlELENBQUM7Z0JBbERDOzttQkFFRztnQkFDSCxlQUFlO2dCQUNmLHlCQUF5QjtnQkFDekIsSUFBSTtnQkFFSjs7bUJBRUc7Z0JBQ0ksV0FBVztvQkFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUN6QixDQUFDO2dCQUVEOzttQkFFRztnQkFDSSxPQUFPLENBQUMsSUFBWTtvQkFDekIsNkJBQTZCO29CQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFMUIsdUJBQXVCO29CQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO2dCQUVEOzttQkFFRztnQkFDSSxVQUFVLENBQUMsSUFBWTtvQkFDNUIseUNBQXlDO29CQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBRXJELGtDQUFrQztvQkFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRTNDLGlGQUFpRjtvQkFDakYsSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBRWxDLDRCQUE0QjtvQkFDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFRDs7bUJBRUc7Z0JBQ0ksS0FBSztvQkFDVixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3ZCO2dCQUNILENBQUM7YUFDRixDQUFBIn0=