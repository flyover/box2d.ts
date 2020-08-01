// MIT License
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Rope;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
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
                    this.m_rope1 = new box2d.b2Rope();
                    this.m_rope2 = new box2d.b2Rope();
                    this.m_tuning1 = new box2d.b2RopeTuning();
                    this.m_tuning2 = new box2d.b2RopeTuning();
                    this.m_iterations1 = 0;
                    this.m_iterations2 = 0;
                    this.m_position1 = new box2d.b2Vec2();
                    this.m_position2 = new box2d.b2Vec2();
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
                    const vertices = box2d.b2Vec2.MakeArray(N);
                    // float masses[N];
                    const masses = box2d.b2MakeNumberArray(N);
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
                    const def = new box2d.b2RopeDef();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYzs7Ozs7Ozs7Ozs7Ozs7O1lBeUJkLEdBQUc7WUFDSCxPQUFBLE1BQWEsSUFBSyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVdwQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFYTSxZQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxZQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxjQUFTLEdBQXVCLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUN6RCxjQUFTLEdBQXVCLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNsRSxrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFXLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMvQyxnQkFBVyxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDeEQsWUFBTyxHQUFXLEdBQUcsQ0FBQztvQkFpRTdCLDJCQUEyQjtvQkFDM0IsSUFBSTtvQkFDSixpREFBaUQ7b0JBQ2pELG1EQUFtRDtvQkFDbkQseUZBQXlGO29CQUV6Rix1QkFBdUI7b0JBRXZCLDhEQUE4RDtvQkFFOUQseUNBQXlDO29CQUN6Qyw2RkFBNkY7b0JBQzdGLG9EQUFvRDtvQkFFcEQsMEJBQTBCO29CQUMxQix3REFBd0Q7b0JBQ3hELCtFQUErRTtvQkFDL0UsS0FBSztvQkFDTCw0REFBNEQ7b0JBQzVELE1BQU07b0JBQ04sMENBQTBDO29CQUMxQyx1REFBdUQ7b0JBQ3ZELE9BQU87b0JBQ1Asc0JBQXNCO29CQUN0Qix1REFBdUQ7b0JBQ3ZELE9BQU87b0JBRVAscUJBQXFCO29CQUNyQixPQUFPO29CQUNQLG9DQUFvQztv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