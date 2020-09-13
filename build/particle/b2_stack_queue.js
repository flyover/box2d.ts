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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfc3RhY2tfcXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFydGljbGUvYjJfc3RhY2tfcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7O1lBRUgseUJBQXlCO1lBRXpCLDhEQUE4RDtZQUU5RCxlQUFBLE1BQWEsWUFBWTtnQkFLdkIsWUFBWSxRQUFnQjtvQkFKWixhQUFRLEdBQW9CLEVBQUUsQ0FBQztvQkFDeEMsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDcEIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFHeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFIRCxJQUFXLFVBQVUsS0FBYSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFJekQsSUFBSSxDQUFDLElBQU87b0JBQ2pCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwRDt3QkFDRCxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQjtvQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztnQkFDTSxHQUFHO29CQUNSLCtDQUErQztvQkFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQ00sS0FBSztvQkFDVixnREFBZ0Q7b0JBQ2hELE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN0QyxDQUFDO2dCQUNNLEtBQUs7b0JBQ1YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQSJ9