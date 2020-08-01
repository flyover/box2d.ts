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

import * as box2d from "@box2d";
import * as testbed from "../testbed.js";

///
export class Rope extends testbed.Test {
  public readonly m_rope1: box2d.b2Rope = new box2d.b2Rope();
  public readonly m_rope2: box2d.b2Rope = new box2d.b2Rope();
  public readonly m_tuning1: box2d.b2RopeTuning = new box2d.b2RopeTuning();
  public readonly m_tuning2: box2d.b2RopeTuning = new box2d.b2RopeTuning();
  public m_iterations1: number = 0;
  public m_iterations2: number = 0;
  public readonly m_position1: box2d.b2Vec2 = new box2d.b2Vec2();
  public readonly m_position2: box2d.b2Vec2 = new box2d.b2Vec2();
  public m_speed: number = 0.0;

  constructor() {
    super();
    const N: number = 20;
    const L: number = 0.5;
    // b2Vec2 vertices[N];
    const vertices: box2d.b2Vec2[] = box2d.b2Vec2.MakeArray(N);
    // float masses[N];
    const masses: number[] = box2d.b2MakeNumberArray(N);

    for (let i = 0; i < N; ++i) {
      vertices[i].Set(0.0, L * (N - i));
      masses[i] = 1.0;
    }
    masses[0] = 0.0;
    masses[1] = 0.0;

    this.m_tuning1.bendHertz = 30.0;
    this.m_tuning1.bendDamping = 4.0;
    this.m_tuning1.bendStiffness = 1.0;
    this.m_tuning1.bendingModel = box2d.b2BendingModel.b2_xpbdAngleBendingModel;
    this.m_tuning1.isometric = true;

    this.m_tuning1.stretchHertz = 30.0;
    this.m_tuning1.stretchDamping = 4.0;
    this.m_tuning1.stretchStiffness = 1.0;
    this.m_tuning1.stretchingModel = box2d.b2StretchingModel.b2_xpbdStretchingModel;

    this.m_tuning2.bendHertz = 30.0;
    this.m_tuning2.bendDamping = 0.7;
    this.m_tuning2.bendStiffness = 1.0;
    this.m_tuning2.bendingModel = box2d.b2BendingModel.b2_pbdHeightBendingModel;
    this.m_tuning2.isometric = true;

    this.m_tuning2.stretchHertz = 30.0;
    this.m_tuning2.stretchDamping = 1.0;
    this.m_tuning2.stretchStiffness = 1.0;
    this.m_tuning2.stretchingModel = box2d.b2StretchingModel.b2_pbdStretchingModel;

    this.m_position1.Set(-5.0, 15.0);
    this.m_position2.Set(5.0, 15.0);

    const def: box2d.b2RopeDef = new box2d.b2RopeDef();
    // def.vertices = vertices;
    vertices.forEach((value: box2d.b2Vec2) => def.vertices.push(value));
    def.count = N;
    def.gravity.Set(0.0, -10.0);
    // def.masses = masses;
    masses.forEach((value: number) => def.masses.push(value));

    def.position.Copy(this.m_position1);
    def.tuning.Copy(this.m_tuning1);
    this.m_rope1.Create(def);

    def.position.Copy(this.m_position2);
    def.tuning.Copy(this.m_tuning2);
    this.m_rope2.Create(def);

    this.m_iterations1 = 8;
    this.m_iterations2 = 8;

    this.m_speed = 10.0;
  }

  // void UpdateUI() override
  // {
  // 	ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
  // 	ImGui::SetNextWindowSize(ImVec2(200.0, 700.0));
  // 	ImGui::Begin("Tuning", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

  // 	ImGui::Separator();

  //       ImGui::PushItemWidth(ImGui::GetWindowWidth() * 0.5f);

  // 	const ImGuiComboFlags comboFlags = 0;
  // 	const char* bendModels[] = { "Spring", "PBD Ang", "XPBD Ang", "PBD Dist", "PBD Height" };
  // 	const char* stretchModels[] = { "PBD", "XPBD" };

  // 	ImGui::Text("Rope 1");
  // 	static int bendModel1 = this.m_tuning1.bendingModel;
  // 	if (ImGui::BeginCombo("Bend Model##1", bendModels[bendModel1], comboFlags))
  // 	{
  // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
  // 		{
  // 			bool isSelected = (bendModel1 == i);
  // 			if (ImGui::Selectable(bendModels[i], isSelected))
  // 			{
  // 				bendModel1 = i;
  // 				this.m_tuning1.bendingModel = b2BendingModel(i);
  // 			}

  // 			if (isSelected)
  // 			{
  // 				ImGui::SetItemDefaultFocus();
  // 			}
  // 		}
  // 		ImGui::EndCombo();
  // 	}

  // 	ImGui::SliderFloat("Damping##B1", &this.m_tuning1.bendDamping, 0.0, 4.0, "%.1f");
  // 	ImGui::SliderFloat("Hertz##B1", &this.m_tuning1.bendHertz, 0.0, 60.0, "%.0");
  // 	ImGui::SliderFloat("Stiffness##B1", &this.m_tuning1.bendStiffness, 0.0, 1.0, "%.1f");

  // 	ImGui::Checkbox("Isometric##1", &this.m_tuning1.isometric);
  // 	ImGui::Checkbox("Fixed Mass##1", &this.m_tuning1.fixedEffectiveMass);
  // 	ImGui::Checkbox("Warm Start##1", &this.m_tuning1.warmStart);

  // 	static int stretchModel1 = this.m_tuning1.stretchingModel;
  // 	if (ImGui::BeginCombo("Stretch Model##1", stretchModels[stretchModel1], comboFlags))
  // 	{
  // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
  // 		{
  // 			bool isSelected = (stretchModel1 == i);
  // 			if (ImGui::Selectable(stretchModels[i], isSelected))
  // 			{
  // 				stretchModel1 = i;
  // 				this.m_tuning1.stretchingModel = b2StretchingModel(i);
  // 			}

  // 			if (isSelected)
  // 			{
  // 				ImGui::SetItemDefaultFocus();
  // 			}
  // 		}
  // 		ImGui::EndCombo();
  // 	}

  // 	ImGui::SliderFloat("Damping##S1", &this.m_tuning1.stretchDamping, 0.0, 4.0, "%.1f");
  // 	ImGui::SliderFloat("Hertz##S1", &this.m_tuning1.stretchHertz, 0.0, 60.0, "%.0");
  // 	ImGui::SliderFloat("Stiffness##S1", &this.m_tuning1.stretchStiffness, 0.0, 1.0, "%.1f");

  // 	ImGui::SliderInt("Iterations##1", &this.m_iterations1, 1, 100, "%d");

  // 	ImGui::Separator();

  // 	ImGui::Text("Rope 2");
  // 	static int bendModel2 = this.m_tuning2.bendingModel;
  // 	if (ImGui::BeginCombo("Bend Model##2", bendModels[bendModel2], comboFlags))
  // 	{
  // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
  // 		{
  // 			bool isSelected = (bendModel2 == i);
  // 			if (ImGui::Selectable(bendModels[i], isSelected))
  // 			{
  // 				bendModel2 = i;
  // 				this.m_tuning2.bendingModel = b2BendingModel(i);
  // 			}

  // 			if (isSelected)
  // 			{
  // 				ImGui::SetItemDefaultFocus();
  // 			}
  // 		}
  // 		ImGui::EndCombo();
  // 	}

  // 	ImGui::SliderFloat("Damping##B2", &this.m_tuning2.bendDamping, 0.0, 4.0, "%.1f");
  // 	ImGui::SliderFloat("Hertz##B2", &this.m_tuning2.bendHertz, 0.0, 60.0, "%.0");
  // 	ImGui::SliderFloat("Stiffness##B2", &this.m_tuning2.bendStiffness, 0.0, 1.0, "%.1f");

  // 	ImGui::Checkbox("Isometric##2", &this.m_tuning2.isometric);
  // 	ImGui::Checkbox("Fixed Mass##2", &this.m_tuning2.fixedEffectiveMass);
  // 	ImGui::Checkbox("Warm Start##2", &this.m_tuning2.warmStart);

  // 	static int stretchModel2 = this.m_tuning2.stretchingModel;
  // 	if (ImGui::BeginCombo("Stretch Model##2", stretchModels[stretchModel2], comboFlags))
  // 	{
  // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
  // 		{
  // 			bool isSelected = (stretchModel2 == i);
  // 			if (ImGui::Selectable(stretchModels[i], isSelected))
  // 			{
  // 				stretchModel2 = i;
  // 				this.m_tuning2.stretchingModel = b2StretchingModel(i);
  // 			}

  // 			if (isSelected)
  // 			{
  // 				ImGui::SetItemDefaultFocus();
  // 			}
  // 		}
  // 		ImGui::EndCombo();
  // 	}

  // 	ImGui::SliderFloat("Damping##S2", &this.m_tuning2.stretchDamping, 0.0, 4.0, "%.1f");
  // 	ImGui::SliderFloat("Hertz##S2", &this.m_tuning2.stretchHertz, 0.0, 60.0, "%.0");
  // 	ImGui::SliderFloat("Stiffness##S2", &this.m_tuning2.stretchStiffness, 0.0, 1.0, "%.1f");

  // 	ImGui::SliderInt("Iterations##2", &this.m_iterations2, 1, 100, "%d");

  // 	ImGui::Separator();

  // 	ImGui::SliderFloat("Speed", &this.m_speed, 10.0, 100.0, "%.0");

  // 	if (ImGui::Button("Reset"))
  // 	{
  // 		this.m_position1.Set(-5.0, 15.0);
  // 		this.m_position2.Set(5.0, 15.0);
  // 		this.m_rope1.Reset(this.m_position1);
  // 		this.m_rope2.Reset(this.m_position2);
  // 	}

  //       ImGui::PopItemWidth();

  // 	ImGui::End();
  // }

  public m_move_x: number = 0.0;

  public Keyboard(key: string) {
    switch (key) {
      case ",":
        this.m_move_x = -1.0;
        break;

      case ".":
        this.m_move_x = 1.0;
        break;
    }
  }

  public KeyboardUp(key: string): void {
    switch (key) {
      case ",":
      case ".":
        this.m_move_x = 0.0;
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    let dt: number = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;

    if (settings.m_pause === true && settings.m_singleStep === false) {
      dt = 0.0;
    }

    // if (glfwGetKey(g_mainWindow, GLFW_KEY_COMMA) == GLFW_PRESS)
    // {
    // 	this.m_position1.x -= this.m_speed * dt;
    // 	this.m_position2.x -= this.m_speed * dt;
    // }

    // if (glfwGetKey(g_mainWindow, GLFW_KEY_PERIOD) == GLFW_PRESS)
    // {
    // 	this.m_position1.x += this.m_speed * dt;
    // 	this.m_position2.x += this.m_speed * dt;
    // }

    if (this.m_move_x) {
      this.m_position1.x += this.m_move_x * this.m_speed * dt;
      this.m_position2.x += this.m_move_x * this.m_speed * dt;
    }

    this.m_rope1.SetTuning(this.m_tuning1);
    this.m_rope2.SetTuning(this.m_tuning2);
    this.m_rope1.Step(dt, this.m_iterations1, this.m_position1);
    this.m_rope2.Step(dt, this.m_iterations2, this.m_position2);

    super.Step(settings);

    this.m_rope1.Draw(testbed.g_debugDraw);
    this.m_rope2.Draw(testbed.g_debugDraw);

    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press comma and period to move left and right");
    // this.m_textLine += this.m_textIncrement;
  }

  public static Create(): testbed.Test {
    return new Rope();
  }
}
// class Rope : public Test
// {
// public:
// 	Rope()
// 	{
// 		const int32 N = 20;
// 		const float L = 0.5f;
// 		b2Vec2 vertices[N];
// 		float masses[N];

// 		for (let i = 0; i < N; ++i)
// 		{
// 			vertices[i].Set(0.0, L * (N - i));
// 			masses[i] = 1.0;
// 		}
// 		masses[0] = 0.0;
// 		masses[1] = 0.0;

// 		this.m_tuning1.bendHertz = 30.0;
// 		this.m_tuning1.bendDamping = 4.0;
// 		this.m_tuning1.bendStiffness = 1.0;
// 		this.m_tuning1.bendingModel = b2_xpbdAngleBendingModel;
// 		this.m_tuning1.isometric = true;

// 		this.m_tuning1.stretchHertz = 30.0;
// 		this.m_tuning1.stretchDamping = 4.0;
// 		this.m_tuning1.stretchStiffness = 1.0;
// 		this.m_tuning1.stretchingModel = b2_xpbdStretchingModel;

// 		this.m_tuning2.bendHertz = 30.0;
// 		this.m_tuning2.bendDamping = 0.7f;
// 		this.m_tuning2.bendStiffness = 1.0;
// 		this.m_tuning2.bendingModel = b2_pbdHeightBendingModel;
// 		this.m_tuning2.isometric = true;

// 		this.m_tuning2.stretchHertz = 30.0;
// 		this.m_tuning2.stretchDamping = 1.0;
// 		this.m_tuning2.stretchStiffness = 1.0;
// 		this.m_tuning2.stretchingModel = b2_pbdStretchingModel;

// 		this.m_position1.Set(-5.0, 15.0);
// 		this.m_position2.Set(5.0, 15.0);

// 		b2RopeDef def;
// 		def.vertices = vertices;
// 		def.count = N;
// 		def.gravity.Set(0.0, -10.0);
// 		def.masses = masses;

// 		def.position = this.m_position1;
// 		def.tuning = this.m_tuning1;
// 		this.m_rope1.Create(def);

// 		def.position = this.m_position2;
// 		def.tuning = this.m_tuning2;
// 		this.m_rope2.Create(def);

// 		this.m_iterations1 = 8;
// 		this.m_iterations2 = 8;

// 		this.m_speed = 10.0;
// 	}

// 	void UpdateUI() override
// 	{
// 		ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
// 		ImGui::SetNextWindowSize(ImVec2(200.0, 700.0));
// 		ImGui::Begin("Tuning", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

// 		ImGui::Separator();

//         ImGui::PushItemWidth(ImGui::GetWindowWidth() * 0.5f);

// 		const ImGuiComboFlags comboFlags = 0;
// 		const char* bendModels[] = { "Spring", "PBD Ang", "XPBD Ang", "PBD Dist", "PBD Height" };
// 		const char* stretchModels[] = { "PBD", "XPBD" };

// 		ImGui::Text("Rope 1");
// 		static int bendModel1 = this.m_tuning1.bendingModel;
// 		if (ImGui::BeginCombo("Bend Model##1", bendModels[bendModel1], comboFlags))
// 		{
// 			for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
// 			{
// 				bool isSelected = (bendModel1 == i);
// 				if (ImGui::Selectable(bendModels[i], isSelected))
// 				{
// 					bendModel1 = i;
// 					this.m_tuning1.bendingModel = b2BendingModel(i);
// 				}

// 				if (isSelected)
// 				{
// 					ImGui::SetItemDefaultFocus();
// 				}
// 			}
// 			ImGui::EndCombo();
// 		}

// 		ImGui::SliderFloat("Damping##B1", &this.m_tuning1.bendDamping, 0.0, 4.0, "%.1f");
// 		ImGui::SliderFloat("Hertz##B1", &this.m_tuning1.bendHertz, 0.0, 60.0, "%.0");
// 		ImGui::SliderFloat("Stiffness##B1", &this.m_tuning1.bendStiffness, 0.0, 1.0, "%.1f");

// 		ImGui::Checkbox("Isometric##1", &this.m_tuning1.isometric);
// 		ImGui::Checkbox("Fixed Mass##1", &this.m_tuning1.fixedEffectiveMass);
// 		ImGui::Checkbox("Warm Start##1", &this.m_tuning1.warmStart);

// 		static int stretchModel1 = this.m_tuning1.stretchingModel;
// 		if (ImGui::BeginCombo("Stretch Model##1", stretchModels[stretchModel1], comboFlags))
// 		{
// 			for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
// 			{
// 				bool isSelected = (stretchModel1 == i);
// 				if (ImGui::Selectable(stretchModels[i], isSelected))
// 				{
// 					stretchModel1 = i;
// 					this.m_tuning1.stretchingModel = b2StretchingModel(i);
// 				}

// 				if (isSelected)
// 				{
// 					ImGui::SetItemDefaultFocus();
// 				}
// 			}
// 			ImGui::EndCombo();
// 		}

// 		ImGui::SliderFloat("Damping##S1", &this.m_tuning1.stretchDamping, 0.0, 4.0, "%.1f");
// 		ImGui::SliderFloat("Hertz##S1", &this.m_tuning1.stretchHertz, 0.0, 60.0, "%.0");
// 		ImGui::SliderFloat("Stiffness##S1", &this.m_tuning1.stretchStiffness, 0.0, 1.0, "%.1f");

// 		ImGui::SliderInt("Iterations##1", &this.m_iterations1, 1, 100, "%d");

// 		ImGui::Separator();

// 		ImGui::Text("Rope 2");
// 		static int bendModel2 = this.m_tuning2.bendingModel;
// 		if (ImGui::BeginCombo("Bend Model##2", bendModels[bendModel2], comboFlags))
// 		{
// 			for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
// 			{
// 				bool isSelected = (bendModel2 == i);
// 				if (ImGui::Selectable(bendModels[i], isSelected))
// 				{
// 					bendModel2 = i;
// 					this.m_tuning2.bendingModel = b2BendingModel(i);
// 				}

// 				if (isSelected)
// 				{
// 					ImGui::SetItemDefaultFocus();
// 				}
// 			}
// 			ImGui::EndCombo();
// 		}

// 		ImGui::SliderFloat("Damping##B2", &this.m_tuning2.bendDamping, 0.0, 4.0, "%.1f");
// 		ImGui::SliderFloat("Hertz##B2", &this.m_tuning2.bendHertz, 0.0, 60.0, "%.0");
// 		ImGui::SliderFloat("Stiffness##B2", &this.m_tuning2.bendStiffness, 0.0, 1.0, "%.1f");

// 		ImGui::Checkbox("Isometric##2", &this.m_tuning2.isometric);
// 		ImGui::Checkbox("Fixed Mass##2", &this.m_tuning2.fixedEffectiveMass);
// 		ImGui::Checkbox("Warm Start##2", &this.m_tuning2.warmStart);

// 		static int stretchModel2 = this.m_tuning2.stretchingModel;
// 		if (ImGui::BeginCombo("Stretch Model##2", stretchModels[stretchModel2], comboFlags))
// 		{
// 			for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
// 			{
// 				bool isSelected = (stretchModel2 == i);
// 				if (ImGui::Selectable(stretchModels[i], isSelected))
// 				{
// 					stretchModel2 = i;
// 					this.m_tuning2.stretchingModel = b2StretchingModel(i);
// 				}

// 				if (isSelected)
// 				{
// 					ImGui::SetItemDefaultFocus();
// 				}
// 			}
// 			ImGui::EndCombo();
// 		}

// 		ImGui::SliderFloat("Damping##S2", &this.m_tuning2.stretchDamping, 0.0, 4.0, "%.1f");
// 		ImGui::SliderFloat("Hertz##S2", &this.m_tuning2.stretchHertz, 0.0, 60.0, "%.0");
// 		ImGui::SliderFloat("Stiffness##S2", &this.m_tuning2.stretchStiffness, 0.0, 1.0, "%.1f");

// 		ImGui::SliderInt("Iterations##2", &this.m_iterations2, 1, 100, "%d");

// 		ImGui::Separator();

// 		ImGui::SliderFloat("Speed", &this.m_speed, 10.0, 100.0, "%.0");

// 		if (ImGui::Button("Reset"))
// 		{
// 			this.m_position1.Set(-5.0, 15.0);
// 			this.m_position2.Set(5.0, 15.0);
// 			this.m_rope1.Reset(this.m_position1);
// 			this.m_rope2.Reset(this.m_position2);
// 		}

//         ImGui::PopItemWidth();

// 		ImGui::End();
// 	}

// 	void Step(Settings& settings) override
// 	{
// 		float dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;

// 		if (settings.m_pause == 1 && settings.m_singleStep == 0)
// 		{
// 			dt = 0.0;
// 		}

// 		if (glfwGetKey(g_mainWindow, GLFW_KEY_COMMA) == GLFW_PRESS)
// 		{
// 			this.m_position1.x -= this.m_speed * dt;
// 			this.m_position2.x -= this.m_speed * dt;
// 		}

// 		if (glfwGetKey(g_mainWindow, GLFW_KEY_PERIOD) == GLFW_PRESS)
// 		{
// 			this.m_position1.x += this.m_speed * dt;
// 			this.m_position2.x += this.m_speed * dt;
// 		}

// 		this.m_rope1.SetTuning(this.m_tuning1);
// 		this.m_rope2.SetTuning(this.m_tuning2);
// 		this.m_rope1.Step(dt, this.m_iterations1, this.m_position1);
// 		this.m_rope2.Step(dt, this.m_iterations2, this.m_position2);

// 		Test::Step(settings);

// 		this.m_rope1.Draw(&g_debugDraw);
// 		this.m_rope2.Draw(&g_debugDraw);

// 		g_debugDraw.DrawString(5, this.m_textLine, "Press comma and period to move left and right");
// 		this.m_textLine += this.m_textIncrement;
// 	}

// 	static Test* Create()
// 	{
// 		return new Rope;
// 	}

// 	b2Rope this.m_rope1;
// 	b2Rope this.m_rope2;
// 	b2RopeTuning this.m_tuning1;
// 	b2RopeTuning this.m_tuning2;
// 	int32 this.m_iterations1;
// 	int32 this.m_iterations2;
// 	b2Vec2 this.m_position1;
// 	b2Vec2 this.m_position2;
// 	float this.m_speed;
// };

// static int testIndex = RegisterTest("Rope", "Bending", Rope::Create);






// export class OldRope extends testbed.Test {
//   // public this.m_rope = new box2d.b2Rope();
//   public m_angle = 0.0;

//   constructor() {
//     super();

//     /*const int32*/
//     const N = 40;
//     /*box2d.b2Vec2[]*/
//     const vertices = box2d.b2Vec2.MakeArray(N);
//     /*float32[]*/
//     const masses = box2d.b2MakeNumberArray(N);

//     for (let i = 0; i < N; ++i) {
//       vertices[i].Set(0.0, 20.0 - 0.25 * i);
//       masses[i] = 1.0;
//     }
//     masses[0] = 0.0;
//     masses[1] = 0.0;

//     /*box2d.b2RopeDef*/
//     // const def = new box2d.b2RopeDef();
//     // def.vertices = vertices;
//     // def.count = N;
//     // def.gravity.Set(0.0, -10.0);
//     // def.masses = masses;
//     // def.damping = 0.1;
//     // def.k2 = 1.0;
//     // def.k3 = 0.5;

//     // this.m_rope.Initialize(def);

//     this.m_angle = 0.0;
//     // this.m_rope.SetAngle(this.m_angle);
//   }

//   public Keyboard(key: string) {
//     switch (key) {
//       case "q":
//         this.m_angle = box2d.b2Max(-box2d.b2_pi, this.m_angle - 0.05 * box2d.b2_pi);
//         // this.m_rope.SetAngle(this.m_angle);
//         break;

//       case "e":
//         this.m_angle = box2d.b2Min(box2d.b2_pi, this.m_angle + 0.05 * box2d.b2_pi);
//         // this.m_rope.SetAngle(this.m_angle);
//         break;
//     }
//   }

//   public Step(settings: testbed.Settings): void {
//     // let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
//     // if (settings.m_pause && !settings.m_singleStep) {
//     //   dt = 0.0;
//     // }

//     // this.m_rope.Step(dt, 1);

//     super.Step(settings);

//     // this.m_rope.Draw(testbed.g_debugDraw);

//     testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (q,e) to adjust target angle");
//     this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
//     testbed.g_debugDraw.DrawString(5, this.m_textLine, `Target angle = ${(this.m_angle * 180.0 / box2d.b2_pi).toFixed(2)} degrees`);
//     this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
//   }

//   public static Create(): testbed.Test {
//     return new OldRope();
//   }
// }
