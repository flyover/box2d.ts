// MIT License
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Rope;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            ///
            Rope = class Rope extends testbed.Test {
                constructor() {
                    super();
                    this.m_rope1 = new b2.Rope();
                    this.m_rope2 = new b2.Rope();
                    this.m_tuning1 = new b2.RopeTuning();
                    this.m_tuning2 = new b2.RopeTuning();
                    this.m_iterations1 = 0;
                    this.m_iterations2 = 0;
                    this.m_position1 = new b2.Vec2();
                    this.m_position2 = new b2.Vec2();
                    this.m_speed = 0.0;
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
                    this.m_move_x = 0.0;
                    const N = 20;
                    const L = 0.5;
                    // b2Vec2 vertices[N];
                    const vertices = b2.Vec2.MakeArray(N);
                    // float masses[N];
                    const masses = b2.MakeNumberArray(N);
                    for (let i = 0; i < N; ++i) {
                        vertices[i].Set(0.0, L * (N - i));
                        masses[i] = 1.0;
                    }
                    masses[0] = 0.0;
                    masses[1] = 0.0;
                    this.m_tuning1.bendHertz = 30.0;
                    this.m_tuning1.bendDamping = 4.0;
                    this.m_tuning1.bendStiffness = 1.0;
                    this.m_tuning1.bendingModel = b2.BendingModel.b2_xpbdAngleBendingModel;
                    this.m_tuning1.isometric = true;
                    this.m_tuning1.stretchHertz = 30.0;
                    this.m_tuning1.stretchDamping = 4.0;
                    this.m_tuning1.stretchStiffness = 1.0;
                    this.m_tuning1.stretchingModel = b2.StretchingModel.b2_xpbdStretchingModel;
                    this.m_tuning2.bendHertz = 30.0;
                    this.m_tuning2.bendDamping = 0.7;
                    this.m_tuning2.bendStiffness = 1.0;
                    this.m_tuning2.bendingModel = b2.BendingModel.b2_pbdHeightBendingModel;
                    this.m_tuning2.isometric = true;
                    this.m_tuning2.stretchHertz = 30.0;
                    this.m_tuning2.stretchDamping = 1.0;
                    this.m_tuning2.stretchStiffness = 1.0;
                    this.m_tuning2.stretchingModel = b2.StretchingModel.b2_pbdStretchingModel;
                    this.m_position1.Set(-5.0, 15.0);
                    this.m_position2.Set(5.0, 15.0);
                    const def = new b2.RopeDef();
                    // def.vertices = vertices;
                    vertices.forEach((value) => def.vertices.push(value));
                    def.count = N;
                    def.gravity.Set(0.0, -10.0);
                    // def.masses = masses;
                    masses.forEach((value) => def.masses.push(value));
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
                Keyboard(key) {
                    switch (key) {
                        case ",":
                            this.m_move_x = -1.0;
                            break;
                        case ".":
                            this.m_move_x = 1.0;
                            break;
                    }
                }
                KeyboardUp(key) {
                    switch (key) {
                        case ",":
                        case ".":
                            this.m_move_x = 0.0;
                            break;
                    }
                }
                Step(settings) {
                    let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
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
                static Create() {
                    return new Rope();
                }
            };
            exports_1("Rope", Rope);
        }
    };
});
//# sourceMappingURL=rope.js.map