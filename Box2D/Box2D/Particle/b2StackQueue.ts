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

///#if B2_ENABLE_PARTICLE

import { b2MakeArray } from "../Common/b2Settings";

function b2Assert(condition: boolean) {}

export class b2StackQueue<T> {
  m_buffer: T[];
  m_front: number = 0;
  m_back: number = 0;
  m_capacity: number = 0;
  constructor(capacity: number) {
    this.m_buffer = b2MakeArray(capacity, (index) => null);
    ///this.m_end = capacity; // TODO: this was wrong!
    this.m_capacity = capacity;
  }
  Push(item: T): void {
    if (this.m_back >= this.m_capacity) {
      for (let i = this.m_front; i < this.m_back; i++) {
        this.m_buffer[i - this.m_front] = this.m_buffer[i];
      }
      this.m_back -= this.m_front;
      this.m_front = 0;
      if (this.m_back >= this.m_capacity) {
        if (this.m_capacity > 0) {
          this.m_buffer.concat(b2MakeArray(this.m_capacity, (index) => null));
          this.m_capacity *= 2;
        } else {
          this.m_buffer.concat(b2MakeArray(1, (index) => null));
          this.m_capacity = 1;
        }
        ///m_buffer = (T*) m_allocator->Reallocate(m_buffer, sizeof(T) * m_capacity);
      }
    }
    this.m_buffer[this.m_back] = item;
    this.m_back++;
  }
  Pop(): void {
    b2Assert(this.m_front < this.m_back);
    delete this.m_buffer[this.m_front];
    this.m_front++;
  }
  Empty(): boolean {
    b2Assert(this.m_front <= this.m_back);
    return this.m_front === this.m_back;
  }
  Front(): T {
    return this.m_buffer[this.m_front];
  }
}

///#endif
