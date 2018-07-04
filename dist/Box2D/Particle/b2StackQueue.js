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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTdGFja1F1ZXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvUGFydGljbGUvYjJTdGFja1F1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFPSCxlQUFBO2dCQUtFLFlBQVksUUFBZ0I7b0JBSHJCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsd0JBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2RCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztnQkFDN0IsQ0FBQztnQkFDTSxJQUFJLENBQUMsSUFBTztvQkFDakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BEO3dCQUNELElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ2pCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOzRCQUNsQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO2dDQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyx3QkFBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ3BFLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDOzZCQUN0QjtpQ0FBTTtnQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyx3QkFBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDdEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7NkJBQ3JCOzRCQUNELDZFQUE2RTt5QkFDOUU7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ00sR0FBRztvQkFDUiwrQ0FBK0M7b0JBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUNNLEtBQUs7b0JBQ1YsZ0RBQWdEO29CQUNoRCxPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsQ0FBQztnQkFDTSxLQUFLO29CQUNWLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFDakMsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUEifQ==