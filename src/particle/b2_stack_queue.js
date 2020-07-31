/*
 * Copyright (c) 2013 Google, Inc.
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
    var b2StackQueue;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // #if B2_ENABLE_PARTICLE
            // DEBUG: import { b2Assert } from "../common/b2_settings.js";
            b2StackQueue = class b2StackQueue {
                constructor(capacity) {
                    this.m_buffer = [];
                    this.m_front = 0;
                    this.m_back = 0;
                    this.m_buffer.fill(null, 0, capacity);
                }
                get m_capacity() { return this.m_buffer.length; }
                Push(item) {
                    if (this.m_back >= this.m_capacity) {
                        for (let i = this.m_front; i < this.m_back; i++) {
                            this.m_buffer[i - this.m_front] = this.m_buffer[i];
                        }
                        this.m_back -= this.m_front;
                        this.m_front = 0;
                    }
                    this.m_buffer[this.m_back] = item;
                    this.m_back++;
                }
                Pop() {
                    // DEBUG: b2Assert(this.m_front < this.m_back);
                    this.m_buffer[this.m_front] = null;
                    this.m_front++;
                }
                Empty() {
                    // DEBUG: b2Assert(this.m_front <= this.m_back);
                    return this.m_front === this.m_back;
                }
                Front() {
                    const item = this.m_buffer[this.m_front];
                    if (!item) {
                        throw new Error();
                    }
                    return item;
                }
            };
            exports_1("b2StackQueue", b2StackQueue);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfc3RhY2tfcXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMl9zdGFja19xdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7WUFFSCx5QkFBeUI7WUFFekIsOERBQThEO1lBRTlELGVBQUEsTUFBYSxZQUFZO2dCQUt2QixZQUFZLFFBQWdCO29CQUpaLGFBQVEsR0FBb0IsRUFBRSxDQUFDO29CQUN4QyxZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNwQixXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUd4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUhELElBQVcsVUFBVSxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUl6RCxJQUFJLENBQUMsSUFBTztvQkFDakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BEO3dCQUNELElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7cUJBQ2xCO29CQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixDQUFDO2dCQUNNLEdBQUc7b0JBQ1IsK0NBQStDO29CQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFDTSxLQUFLO29CQUNWLGdEQUFnRDtvQkFDaEQsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLENBQUM7Z0JBQ00sS0FBSztvQkFDVixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQ2pDLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFBIn0=