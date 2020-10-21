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

export class ShapeEditing extends testbed.Test {
  public m_body: b2.Body;
  public m_fixture1: b2.Fixture;
  public m_fixture2: b2.Fixture | null = null;
  public m_sensor = false;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
      ground.CreateFixture(shape, 0.0);
    }

    const bd = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;
    bd.position.Set(0.0, 10.0);
    this.m_body = this.m_world.CreateBody(bd);

    const shape = new b2.PolygonShape();
    shape.SetAsBox(4.0, 4.0, new b2.Vec2(0.0, 0.0), 0.0);
    this.m_fixture1 = this.m_body.CreateFixture(shape, 10.0);
  }

  public Keyboard(key: string) {
    switch (key) {
      case "c":
        if (this.m_fixture2 === null) {
          const shape = new b2.CircleShape();
          shape.m_radius = 3.0;
          shape.m_p.Set(0.5, -4.0);
          this.m_fixture2 = this.m_body.CreateFixture(shape, 10.0);
          this.m_body.SetAwake(true);
        }
        break;

      case "d":
        if (this.m_fixture2 !== null) {
          this.m_body.DestroyFixture(this.m_fixture2);
          this.m_fixture2 = null;
          this.m_body.SetAwake(true);
        }
        break;

      case "s":
        if (this.m_fixture2 !== null) {
          this.m_sensor = !this.m_sensor;
          this.m_fixture2.SetSensor(this.m_sensor);
        }
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (c) create a shape, (d) destroy a shape.");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `sensor = ${(this.m_sensor) ? (1) : (0)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new ShapeEditing();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Shape Editing", ShapeEditing.Create);
