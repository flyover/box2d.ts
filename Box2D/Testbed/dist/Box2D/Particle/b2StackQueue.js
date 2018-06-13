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
System.register(["../Common/b2Settings"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2StackQueue;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            }
        ],
        execute: function () {
            b2StackQueue = class b2StackQueue {
                constructor(capacity) {
                    this.m_front = 0;
                    this.m_back = 0;
                    this.m_capacity = 0;
                    this.m_buffer = b2Settings_1.b2MakeArray(capacity, (index) => null);
                    ///this.m_end = capacity; // TODO: this was wrong!
                    this.m_capacity = capacity;
                }
                Push(item) {
                    if (this.m_back >= this.m_capacity) {
                        for (let i = this.m_front; i < this.m_back; i++) {
                            this.m_buffer[i - this.m_front] = this.m_buffer[i];
                        }
                        this.m_back -= this.m_front;
                        this.m_front = 0;
                        if (this.m_back >= this.m_capacity) {
                            if (this.m_capacity > 0) {
                                this.m_buffer.concat(b2Settings_1.b2MakeArray(this.m_capacity, (index) => null));
                                this.m_capacity *= 2;
                            }
                            else {
                                this.m_buffer.concat(b2Settings_1.b2MakeArray(1, (index) => null));
                                this.m_capacity = 1;
                            }
                            ///m_buffer = (T*) m_allocator->Reallocate(m_buffer, sizeof(T) * m_capacity);
                        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTdGFja1F1ZXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvUGFydGljbGUvYjJTdGFja1F1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFPSCxlQUFBO2dCQUtFLFlBQVksUUFBZ0I7b0JBSHJCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsd0JBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2RCxrREFBa0Q7b0JBQ2xELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO2dCQUM3QixDQUFDO2dCQUNNLElBQUksQ0FBQyxJQUFPO29CQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDcEQ7d0JBQ0QsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ2xDLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0NBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLHdCQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDcEUsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7NkJBQ3RCO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLHdCQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs2QkFDckI7NEJBQ0QsNkVBQTZFO3lCQUM5RTtxQkFDRjtvQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztnQkFDTSxHQUFHO29CQUNSLCtDQUErQztvQkFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQ00sS0FBSztvQkFDVixnREFBZ0Q7b0JBQ2hELE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN0QyxDQUFDO2dCQUNNLEtBQUs7b0JBQ1YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQSJ9