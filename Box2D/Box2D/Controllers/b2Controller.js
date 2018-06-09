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
System.register(["../Common/b2Settings"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Controller;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            }
        ],
        execute: function () {
            /**
             * Base class for controllers. Controllers are a convience for
             * encapsulating common per-step functionality.
             */
            b2Controller = class b2Controller {
                constructor() {
                    // m_world: b2World;
                    this.m_bodyList = new b2Settings_1.b2List();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFTSDs7O2VBR0c7WUFDSCxlQUFBO2dCQUFBO29CQUNFLG9CQUFvQjtvQkFDSixlQUFVLEdBQW1CLElBQUksbUJBQU0sRUFBVSxDQUFDO2dCQThEcEUsQ0FBQztnQkFsREM7O21CQUVHO2dCQUNILGVBQWU7Z0JBQ2YseUJBQXlCO2dCQUN6QixJQUFJO2dCQUVKOzttQkFFRztnQkFDSSxXQUFXO29CQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLE9BQU8sQ0FBQyxJQUFZO29CQUN6Qiw2QkFBNkI7b0JBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUUxQix1QkFBdUI7b0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLFVBQVUsQ0FBQyxJQUFZO29CQUM1Qix5Q0FBeUM7b0JBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFckQsa0NBQWtDO29CQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFM0MsaUZBQWlGO29CQUNqRixJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFFbEMsNEJBQTRCO29CQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUVEOzttQkFFRztnQkFDSSxLQUFLO29CQUNWLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdkI7Z0JBQ0gsQ0FBQzthQUNGLENBQUEifQ==