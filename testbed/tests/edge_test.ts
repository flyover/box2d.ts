/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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

import * as b2 from "@box2d";
import * as testbed from "../testbed.js";

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

    // {
    // 	b2BodyDef bd;
    // 	bd.type = b2_dynamicBody;
    // 	bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset1;
    // 	bd.allowSleep = false;
    // 	this.m_body1 = this.m_world.CreateBody(bd);

    // 	b2CircleShape shape;
    // 	shape.this.m_radius = 0.5f;

    // 	this.m_body1.CreateFixture(shape, 1.0);
    // }

    // {
    // 	b2BodyDef bd;
    // 	bd.type = b2_dynamicBody;
    // 	bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset2;
    // 	bd.allowSleep = false;
    // 	this.m_body2 = this.m_world.CreateBody(bd);

    // 	b2CircleShape shape;
    // 	shape.this.m_radius = 0.5f;

    // 	this.m_body2.CreateFixture(shape, 1.0);
    // }
  }

  public UpdateUI(): void {
    // 	ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
    // 	ImGui::SetNextWindowSize(ImVec2(200.0, 100.0));
    // 	ImGui::Begin("Custom Controls", null, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

    // 	if (ImGui::RadioButton("Boxes", m_boxes == true))
    // 	{
    // 		CreateBoxes();
    // 		m_boxes = true;
    // 	}

    // 	if (ImGui::RadioButton("Circles", m_boxes == false))
    // 	{
    // 		CreateCircles();
    // 		m_boxes = false;
    // 	}

    // 	ImGui::End();
  }

  public Step(settings: testbed.Settings): void {
    // if (glfwGetKey(g_mainWindow, GLFW_KEY_A) == GLFW_PRESS)
    // {
    // 	this.m_body1.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
    // 	this.m_body2.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
    // }

    // if (glfwGetKey(g_mainWindow, GLFW_KEY_D) == GLFW_PRESS)
    // {
    // 	this.m_body1.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
    // 	this.m_body2.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
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
    }
  }

  public static Create(): testbed.Test {
    return new EdgeTest();
  }
}
