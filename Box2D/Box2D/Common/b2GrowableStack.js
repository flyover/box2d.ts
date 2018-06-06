/*
* Copyright (c) 2010 Erin Catto http://www.box2d.org
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
    var b2GrowableStack;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // DEBUG: import { b2Assert } from "./b2Settings";
            /// This is a growable LIFO stack with an initial capacity of N.
            /// If the stack size exceeds the initial capacity, the heap is used
            /// to increase the size of the stack.
            b2GrowableStack = class b2GrowableStack {
                constructor(N) {
                    this.m_stack = [];
                    this.m_count = 0;
                    this.m_stack = [ /*N*/];
                    this.m_count = 0;
                }
                Reset() {
                    this.m_count = 0;
                    return this;
                }
                Push(element) {
                    this.m_stack[this.m_count] = element;
                    this.m_count++;
                }
                Pop() {
                    // DEBUG: b2Assert(this.m_count > 0);
                    this.m_count--;
                    const element = this.m_stack[this.m_count];
                    this.m_stack[this.m_count] = null;
                    return element;
                }
                GetCount() {
                    return this.m_count;
                }
            };
            exports_1("b2GrowableStack", b2GrowableStack);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJHcm93YWJsZVN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJHcm93YWJsZVN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7OztZQUVGLGtEQUFrRDtZQUVsRCxnRUFBZ0U7WUFDaEUsb0VBQW9FO1lBQ3BFLHNDQUFzQztZQUV0QyxrQkFBQTtnQkFJRSxZQUFZLENBQVM7b0JBSGQsWUFBTyxHQUFvQixFQUFFLENBQUM7b0JBQzlCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBR3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sS0FBSztvQkFDVixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxJQUFJLENBQUMsT0FBaUI7b0JBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDckMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVNLEdBQUc7b0JBQ1IscUNBQXFDO29CQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2YsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbEMsT0FBTyxPQUFPLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRU0sUUFBUTtvQkFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUM7YUFDRixDQUFBIn0=