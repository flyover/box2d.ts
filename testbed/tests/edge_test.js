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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, EdgeTest;
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
            EdgeTest = class EdgeTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_offset1 = new box2d.b2Vec2();
                    this.m_offset2 = new box2d.b2Vec2();
                    this.m_body1 = null;
                    this.m_body2 = null;
                    this.m_boxes = false;
                    const vertices = [
                        new box2d.b2Vec2(10.0, -4.0),
                        new box2d.b2Vec2(10.0, 0.0),
                        new box2d.b2Vec2(6.0, 0.0),
                        new box2d.b2Vec2(4.0, 2.0),
                        new box2d.b2Vec2(2.0, 0.0),
                        new box2d.b2Vec2(-2.0, 0.0),
                        new box2d.b2Vec2(-6.0, 0.0),
                        new box2d.b2Vec2(-8.0, -3.0),
                        new box2d.b2Vec2(-10.0, 0.0),
                        new box2d.b2Vec2(-10.0, -4.0),
                    ];
                    this.m_offset1.Set(0.0, 8.0);
                    this.m_offset2.Set(0.0, 16.0);
                    {
                        const v1 = vertices[0].Clone().SelfAdd(this.m_offset1);
                        const v2 = vertices[1].Clone().SelfAdd(this.m_offset1);
                        const v3 = vertices[2].Clone().SelfAdd(this.m_offset1);
                        const v4 = vertices[3].Clone().SelfAdd(this.m_offset1);
                        const v5 = vertices[4].Clone().SelfAdd(this.m_offset1);
                        const v6 = vertices[5].Clone().SelfAdd(this.m_offset1);
                        const v7 = vertices[6].Clone().SelfAdd(this.m_offset1);
                        const v8 = vertices[7].Clone().SelfAdd(this.m_offset1);
                        const v9 = vertices[8].Clone().SelfAdd(this.m_offset1);
                        const v10 = vertices[9].Clone().SelfAdd(this.m_offset1);
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
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
                        const v1 = vertices[0].Clone().SelfAdd(this.m_offset2);
                        const v2 = vertices[1].Clone().SelfAdd(this.m_offset2);
                        const v3 = vertices[2].Clone().SelfAdd(this.m_offset2);
                        const v4 = vertices[3].Clone().SelfAdd(this.m_offset2);
                        const v5 = vertices[4].Clone().SelfAdd(this.m_offset2);
                        const v6 = vertices[5].Clone().SelfAdd(this.m_offset2);
                        const v7 = vertices[6].Clone().SelfAdd(this.m_offset2);
                        const v8 = vertices[7].Clone().SelfAdd(this.m_offset2);
                        const v9 = vertices[8].Clone().SelfAdd(this.m_offset2);
                        const v10 = vertices[9].Clone().SelfAdd(this.m_offset2);
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
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
                CreateBoxes() {
                    if (this.m_body1) {
                        this.m_world.DestroyBody(this.m_body1);
                        this.m_body1 = null;
                    }
                    if (this.m_body2) {
                        this.m_world.DestroyBody(this.m_body2);
                        this.m_body2 = null;
                    }
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(8.0, 2.6) + this.m_offset1;
                        bd.position.x = 8.0 + this.m_offset1.x;
                        bd.position.y = 2.6 + this.m_offset1.y;
                        bd.allowSleep = false;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 1.0);
                        this.m_body1.CreateFixture(shape, 1.0);
                    }
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(8.0, 2.6f) + this.m_offset2;
                        bd.position.x = 8.0 + this.m_offset2.x;
                        bd.position.y = 2.6 + this.m_offset2.y;
                        bd.allowSleep = false;
                        this.m_body2 = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 1.0);
                        this.m_body2.CreateFixture(shape, 1.0);
                    }
                }
                CreateCircles() {
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
                UpdateUI() {
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
                Step(settings) {
                    // if (glfwGetKey(g_mainWindow, GLFW_KEY_A) == GLFW_PRESS)
                    // {
                    // 	this.m_body1.ApplyForceToCenter(new box2d.b2Vec2(-10.0, 0.0), true);
                    // 	this.m_body2.ApplyForceToCenter(new box2d.b2Vec2(-10.0, 0.0), true);
                    // }
                    // if (glfwGetKey(g_mainWindow, GLFW_KEY_D) == GLFW_PRESS)
                    // {
                    // 	this.m_body1.ApplyForceToCenter(new box2d.b2Vec2(10.0, 0.0), true);
                    // 	this.m_body2.ApplyForceToCenter(new box2d.b2Vec2(10.0, 0.0), true);
                    // }
                    super.Step(settings);
                }
                Keyboard(key) {
                    var _a, _b, _c, _d;
                    switch (key) {
                        case "a":
                            (_a = this.m_body1) === null || _a === void 0 ? void 0 : _a.ApplyForceToCenter(new box2d.b2Vec2(-10.0, 0.0), true);
                            (_b = this.m_body2) === null || _b === void 0 ? void 0 : _b.ApplyForceToCenter(new box2d.b2Vec2(-10.0, 0.0), true);
                            break;
                        case "d":
                            (_c = this.m_body1) === null || _c === void 0 ? void 0 : _c.ApplyForceToCenter(new box2d.b2Vec2(10.0, 0.0), true);
                            (_d = this.m_body2) === null || _d === void 0 ? void 0 : _d.ApplyForceToCenter(new box2d.b2Vec2(10.0, 0.0), true);
                            break;
                    }
                }
                static Create() {
                    return new EdgeTest();
                }
            };
            exports_1("EdgeTest", EdgeTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZV90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWRnZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLE1BQWEsUUFBUyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQU94QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFQTSxjQUFTLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM3QyxjQUFTLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUN0RCxZQUFPLEdBQXdCLElBQUksQ0FBQztvQkFDcEMsWUFBTyxHQUF3QixJQUFJLENBQUM7b0JBQ3BDLFlBQU8sR0FBWSxLQUFLLENBQUM7b0JBSzlCLE1BQU0sUUFBUSxHQUNaO3dCQUNFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQzVCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO3dCQUMzQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQzFCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO3dCQUMxQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO3dCQUMzQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO3dCQUMzQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQzVCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFH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QVMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLEVBQUUsR0FBaUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sRUFBRSxHQUFpQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxFQUFFLEdBQWlCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLEVBQUUsR0FBaUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sRUFBRSxHQUFpQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxFQUFFLEdBQWlCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLEVBQUUsR0FBaUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sRUFBRSxHQUFpQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxHQUFHLEdBQWlCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUV0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