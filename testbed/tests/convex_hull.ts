// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class ConvexHull extends testbed.Test {
  public static readonly e_count = 10;

  public m_test_points: b2.Vec2[] = [];
  public m_count = 0;
  public m_auto = false;

  constructor() {
    super();

    this.Generate();
  }

  public Generate(): void {
    for (let i = 0; i < ConvexHull.e_count; ++i) {
      let x = b2.RandomRange(-10.0, 10.0);
      let y = b2.RandomRange(-10.0, 10.0);

      // Clamp onto a square to help create collinearities.
      // This will stress the convex hull algorithm.
      x = b2.Clamp(x, -8.0, 8.0);
      y = b2.Clamp(y, -8.0, 8.0);
      this.m_test_points[i] = new b2.Vec2(x, y);
    }

    this.m_count = ConvexHull.e_count;
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        this.m_auto = !this.m_auto;
        break;

      case "g":
        this.Generate();
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    const shape = new b2.PolygonShape();
    shape.Set(this.m_test_points, this.m_count);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press g to generate a new random convex hull");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    testbed.g_debugDraw.DrawPolygon(shape.m_vertices, shape.m_count, new b2.Color(0.9, 0.9, 0.9));

    for (let i = 0; i < this.m_count; ++i) {
      testbed.g_debugDraw.DrawPoint(this.m_test_points[i], 3.0, new b2.Color(0.3, 0.9, 0.3));
      testbed.g_debugDraw.DrawStringWorld(this.m_test_points[i].x + 0.05, this.m_test_points[i].y + 0.05, `${i}`);
    }

    if (!shape.Validate()) {
      this.m_textLine += 0;
    }

    if (this.m_auto) {
      this.Generate();
    }
  }

  public static Create(): testbed.Test {
    return new ConvexHull();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Convex Hull", ConvexHull.Create);
