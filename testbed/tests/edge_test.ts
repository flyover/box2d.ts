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

export class EdgeTest extends testbed.Test {
  public readonly m_offset1: b2.Vec2 = new b2.Vec2();
  public readonly m_offset2: b2.Vec2 = new b2.Vec2();
  public m_body1: b2.Body | null = null;
  public m_body2: b2.Body | null = null;
  public m_boxes: boolean = false;

  constructor() {
    super();

    const vertices: b2.Vec2[] =
      [
        new b2.Vec2(10.0, -4.0),
        new b2.Vec2(10.0, 0.0),
        new b2.Vec2(6.0, 0.0),
        new b2.Vec2(4.0, 2.0),
        new b2.Vec2(2.0, 0.0),
        new b2.Vec2(-2.0, 0.0),
        new b2.Vec2(-6.0, 0.0),
        new b2.Vec2(-8.0, -3.0),
        new b2.Vec2(-10.0, 0.0),
        new b2.Vec2(-10.0, -4.0),
      ];

    this.m_offset1.Set(0.0, 8.0);
    this.m_offset2.Set(0.0, 16.0);

    {
      const v1: b2.Vec2 = vertices[0].Clone().SelfAdd(this.m_offset1);
      const v2: b2.Vec2 = vertices[1].Clone().SelfAdd(this.m_offset1);
      const v3: b2.Vec2 = vertices[2].Clone().SelfAdd(this.m_offset1);
      const v4: b2.Vec2 = vertices[3].Clone().SelfAdd(this.m_offset1);
      const v5: b2.Vec2 = vertices[4].Clone().SelfAdd(this.m_offset1);
      const v6: b2.Vec2 = vertices[5].Clone().SelfAdd(this.m_offset1);
      const v7: b2.Vec2 = vertices[6].Clone().SelfAdd(this.m_offset1);
      const v8: b2.Vec2 = vertices[7].Clone().SelfAdd(this.m_offset1);
      const v9: b2.Vec2 = vertices[8].Clone().SelfAdd(this.m_offset1);
      const v10: b2.Vec2 = vertices[9].Clone().SelfAdd(this.m_offset1);

      const bd: b2.BodyDef = new b2.BodyDef();
      const ground: b2.Body = this.m_world.CreateBody(bd);

      const shape: b2.EdgeShape = new b2.EdgeShape();

      shape.SetOneSided(v10, v1, v2, v3);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v1, v2, v3, v4);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v2, v3, v4, v5);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v3, v4, v5, v6);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v4, v5, v6, v7);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v5, v6, v7, v8);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v6, v7, v8, v9);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v7, v8, v9, v10);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v8, v9, v10, v1);
      ground.CreateFixture(shape, 0.0);

      shape.SetOneSided(v9, v10, v1, v2);
      ground.CreateFixture(shape, 0.0);
    }

    {
      const v1: b2.Vec2 = vertices[0].Clone().SelfAdd(this.m_offset2);
      const v2: b2.Vec2 = vertices[1].Clone().SelfAdd(this.m_offset2);
      const v3: b2.Vec2 = vertices[2].Clone().SelfAdd(this.m_offset2);
      const v4: b2.Vec2 = vertices[3].Clone().SelfAdd(this.m_offset2);
      const v5: b2.Vec2 = vertices[4].Clone().SelfAdd(this.m_offset2);
      const v6: b2.Vec2 = vertices[5].Clone().SelfAdd(this.m_offset2);
      const v7: b2.Vec2 = vertices[6].Clone().SelfAdd(this.m_offset2);
      const v8: b2.Vec2 = vertices[7].Clone().SelfAdd(this.m_offset2);
      const v9: b2.Vec2 = vertices[8].Clone().SelfAdd(this.m_offset2);
      const v10: b2.Vec2 = vertices[9].Clone().SelfAdd(this.m_offset2);

      const bd: b2.BodyDef = new b2.BodyDef();
      const ground: b2.Body = this.m_world.CreateBody(bd);

      const shape: b2.EdgeShape = new b2.EdgeShape();

      shape.SetTwoSided(v1, v2);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v2, v3);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v3, v4);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v4, v5);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v5, v6);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v6, v7);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v7, v8);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v8, v9);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v9, v10);
      ground.CreateFixture(shape, 0.0);

      shape.SetTwoSided(v10, v1);
      ground.CreateFixture(shape, 0.0);
    }

    this.m_body1 = null;
    this.m_body2 = null;
    this.CreateBoxes();
    this.m_boxes = true;
  }

  public CreateBoxes(): void {
    if (this.m_body1) {
      this.m_world.DestroyBody(this.m_body1);
      this.m_body1 = null;
    }

    if (this.m_body2) {
      this.m_world.DestroyBody(this.m_body2);
      this.m_body2 = null;
    }

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      // bd.position = b2Vec2(8.0, 2.6) + this.m_offset1;
      bd.position.x = 8.0 + this.m_offset1.x;
      bd.position.y = 2.6 + this.m_offset1.y;
      bd.allowSleep = false;
      this.m_body1 = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 1.0);

      this.m_body1.CreateFixture(shape, 1.0);
    }

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      // bd.position = b2Vec2(8.0, 2.6f) + this.m_offset2;
      bd.position.x = 8.0 + this.m_offset2.x;
      bd.position.y = 2.6 + this.m_offset2.y;
      bd.allowSleep = false;
      this.m_body2 = this.m_world.CreateBody(bd);

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 1.0);

      this.m_body2.CreateFixture(shape, 1.0);
    }
  }

  public CreateCircles(): void {
    if (this.m_body1) {
      this.m_world.DestroyBody(this.m_body1);
      this.m_body1 = null;
    }

    if (this.m_body2) {
      this.m_world.DestroyBody(this.m_body2);
      this.m_body2 = null;
    }

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset1;
      bd.position.x = -0.5 + this.m_offset1.x;
      bd.position.y = 0.6 + this.m_offset1.y;
      bd.allowSleep = false;
      this.m_body1 = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 0.5;

      this.m_body1.CreateFixture(shape, 1.0);
    }

    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset2;
      bd.position.x = -0.5 + this.m_offset2.x;
      bd.position.y = 0.6 + this.m_offset2.y;
      bd.allowSleep = false;
      this.m_body2 = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 0.5;

      this.m_body2.CreateFixture(shape, 1.0);
    }
  }

  public UpdateUI(): void {
    // ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
    // ImGui::SetNextWindowSize(ImVec2(200.0, 100.0));
    // ImGui::Begin("Custom Controls", null, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

    // if (ImGui::RadioButton("Boxes", m_boxes == true))
    // {
    //   CreateBoxes();
    //   m_boxes = true;
    // }

    // if (ImGui::RadioButton("Circles", m_boxes == false))
    // {
    //   CreateCircles();
    //   m_boxes = false;
    // }

    // ImGui::End();
  }

  public Step(settings: testbed.Settings): void {
    // if (glfwGetKey(g_mainWindow, GLFW_KEY_A) == GLFW_PRESS)
    // {
    //   this.m_body1.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
    //   this.m_body2.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
    // }

    // if (glfwGetKey(g_mainWindow, GLFW_KEY_D) == GLFW_PRESS)
    // {
    //   this.m_body1.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
    //   this.m_body2.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
    // }

    super.Step(settings);
  }

  public Keyboard(key: string): void {
    switch (key) {
      case "a":
        this.m_body1?.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
        this.m_body2?.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
        break;

      case "d":
        this.m_body1?.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
        this.m_body2?.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
        break;

      case "b":
        this.CreateBoxes();
        break;

      case "c":
        this.CreateCircles();
        break;
      }
  }

  public static Create(): testbed.Test {
    return new EdgeTest();
  }
}

export const testIndex: number = testbed.RegisterTest("Geometry", "Edge Test", EdgeTest.Create);
