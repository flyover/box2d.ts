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

export class CompoundShapes extends testbed.Test {
  public m_table1: b2.Body;
  public m_table2: b2.Body;
  public m_ship1: b2.Body;
  public m_ship2: b2.Body;

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const body = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(50.0, 0.0), new b2.Vec2(-50.0, 0.0));

      body.CreateFixture(shape, 0.0);
    }

    // Table 1
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Set(-15.0, 1.0);
      this.m_table1 = this.m_world.CreateBody(bd);

      const top = new b2.PolygonShape();
      top.SetAsBox(3.0, 0.5, new b2.Vec2(0.0, 3.5), 0.0);

      const leftLeg = new b2.PolygonShape();
      leftLeg.SetAsBox(0.5, 1.5, new b2.Vec2(-2.5, 1.5), 0.0);

      const rightLeg = new b2.PolygonShape();
      rightLeg.SetAsBox(0.5, 1.5, new b2.Vec2(2.5, 1.5), 0.0);

      this.m_table1.CreateFixture(top, 2.0);
      this.m_table1.CreateFixture(leftLeg, 2.0);
      this.m_table1.CreateFixture(rightLeg, 2.0);
    }

    // Table 2
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Set(-5.0, 1.0);
      this.m_table2 = this.m_world.CreateBody(bd);

      const top = new b2.PolygonShape();
      top.SetAsBox(3.0, 0.5, new b2.Vec2(0.0, 3.5), 0.0);

      const leftLeg = new b2.PolygonShape();
      leftLeg.SetAsBox(0.5, 2.0, new b2.Vec2(-2.5, 2.0), 0.0);

      const rightLeg = new b2.PolygonShape();
      rightLeg.SetAsBox(0.5, 2.0, new b2.Vec2(2.5, 2.0), 0.0);

      this.m_table2.CreateFixture(top, 2.0);
      this.m_table2.CreateFixture(leftLeg, 2.0);
      this.m_table2.CreateFixture(rightLeg, 2.0);
    }

    // Spaceship 1
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Set(5.0, 1.0);
      this.m_ship1 = this.m_world.CreateBody(bd);

      const vertices = b2.Vec2.MakeArray(3);

      const left = new b2.PolygonShape();
      vertices[0].Set(-2.0, 0.0);
      vertices[1].Set(0.0, 4.0 / 3.0);
      vertices[2].Set(0.0, 4.0);
      left.Set(vertices, 3);

      const right = new b2.PolygonShape();
      vertices[0].Set(2.0, 0.0);
      vertices[1].Set(0.0, 4.0 / 3.0);
      vertices[2].Set(0.0, 4.0);
      right.Set(vertices, 3);

      this.m_ship1.CreateFixture(left, 2.0);
      this.m_ship1.CreateFixture(right, 2.0);
    }

    // Spaceship 2
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Set(15.0, 1.0);
      this.m_ship2 = this.m_world.CreateBody(bd);

      const vertices = b2.Vec2.MakeArray(3);

      const left = new b2.PolygonShape();
      vertices[0].Set(-2.0, 0.0);
      vertices[1].Set(1.0, 2.0);
      vertices[2].Set(0.0, 4.0);
      left.Set(vertices, 3);

      const right = new b2.PolygonShape();
      vertices[0].Set(2.0, 0.0);
      vertices[1].Set(-1.0, 2.0);
      vertices[2].Set(0.0, 4.0);
      right.Set(vertices, 3);

      this.m_ship2.CreateFixture(left, 2.0);
      this.m_ship2.CreateFixture(right, 2.0);
    }
  }

  public Spawn(): void {
    // Table 1 obstruction
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Copy(this.m_table1.GetPosition());
      bd.angle = this.m_table1.GetAngle();

      const body = this.m_world.CreateBody(bd);

      const box = new b2.PolygonShape();
      box.SetAsBox(4.0, 0.1, new b2.Vec2(0.0, 3.0), 0.0);

      body.CreateFixture(box, 2.0);
    }

    // Table 2 obstruction
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Copy(this.m_table2.GetPosition());
      bd.angle = this.m_table2.GetAngle();

      const body = this.m_world.CreateBody(bd);

      const box = new b2.PolygonShape();
      box.SetAsBox(4.0, 0.1, new b2.Vec2(0.0, 3.0), 0.0);

      body.CreateFixture(box, 2.0);
    }

    // Ship 1 obstruction
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Copy(this.m_ship1.GetPosition());
      bd.angle = this.m_ship1.GetAngle();
      bd.gravityScale = 0.0;

      const body = this.m_world.CreateBody(bd);

      const circle = new b2.CircleShape();
      circle.m_radius = 0.5;
      circle.m_p.Set(0.0, 2.0);

      body.CreateFixture(circle, 2.0);
    }

    // Ship 2 obstruction
    {
      const bd = new b2.BodyDef();
      bd.type = b2.dynamicBody;
      bd.position.Copy(this.m_ship2.GetPosition());
      bd.angle = this.m_ship2.GetAngle();
      bd.gravityScale = 0.0;

      const body = this.m_world.CreateBody(bd);

      const circle = new b2.CircleShape();
      circle.m_radius = 0.5;
      circle.m_p.Set(0.0, 2.0);

      body.CreateFixture(circle, 2.0);
    }
  }

  public Keyboard(key: string): void {
    switch (key) {
      case "s": this.Spawn(); break;
    }
    super.Keyboard(key);
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new CompoundShapes();
  }
}

export const testIndex: number = testbed.RegisterTest("Examples", "Compound Shapes", CompoundShapes.Create);
