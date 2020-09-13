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
    var b2, testbed, EdgeTest;
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
            EdgeTest = class EdgeTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_offset1 = new b2.Vec2();
                    this.m_offset2 = new b2.Vec2();
                    this.m_body1 = null;
                    this.m_body2 = null;
                    this.m_boxes = false;
                    const vertices = [
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
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
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
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
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
                Keyboard(key) {
                    var _a, _b, _c, _d;
                    switch (key) {
                        case "a":
                            (_a = this.m_body1) === null || _a === void 0 ? void 0 : _a.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                            (_b = this.m_body2) === null || _b === void 0 ? void 0 : _b.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                            break;
                        case "d":
                            (_c = this.m_body1) === null || _c === void 0 ? void 0 : _c.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
                            (_d = this.m_body2) === null || _d === void 0 ? void 0 : _d.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZV90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvZWRnZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLE1BQWEsUUFBUyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQU94QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFQTSxjQUFTLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ25DLGNBQVMsR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUMsWUFBTyxHQUFtQixJQUFJLENBQUM7b0JBQy9CLFlBQU8sR0FBbUIsSUFBSSxDQUFDO29CQUMvQixZQUFPLEdBQVksS0FBSyxDQUFDO29CQUs5QixNQUFNLFFBQVEsR0FDWjt3QkFDRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDO3dCQUN2QixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzt3QkFDdEIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQ3JCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO3dCQUNyQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDckIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDdEIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDdEIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDO3dCQUN2QixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJ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Q0FBQyxDQUFDO3dCQUNoRSxNQUFNLEVBQUUsR0FBWSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDaEUsTUFBTSxFQUFFLEdBQVksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2hFLE1BQU0sRUFBRSxHQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNoRSxNQUFNLEVBQUUsR0FBWSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDaEUsTUFBTSxFQUFFLEdBQVksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2hFLE1BQU0sRUFBRSxHQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNoRSxNQUFNLEVBQUUsR0FBWSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDaEUsTUFBTSxFQUFFLEdBQVksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2hFLE1BQU0sR0FBRyxHQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUVqRSxNQUFNLEVBQUUsR0FBZSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDeEMsTUFBTSxNQUFNLEdBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXBELE1BQU0sS0FBSyxHQUFpQixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFFL0MsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzFCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMxQixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzFCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMxQixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzFCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRU0sV0FBVztvQkFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3FCQUNyQjtvQkFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7cUJBQ3JCO29CQUVEO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUNyQyxtREFBbUQ7d0JBQ25ELEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDdkMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ3hDO29CQUVEO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUNyQyxvREFBb0Q7d0JBQ3BELEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDdkMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ3hDO2dCQUNILENBQUM7Z0JBRU0sYUFBYTtvQkFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3FCQUNyQjtvQkFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7cUJBQ3JCO29CQUVELElBQUk7b0JBQ0osaUJBQWlCO29CQUNqQiw2QkFBNkI7b0JBQzdCLHVEQUF1RDtvQkFDdkQsMEJBQTBCO29CQUMxQiwrQ0FBK0M7b0JBRS9DLHdCQUF3QjtvQkFDeEIsK0JBQStCO29CQUUvQiwyQ0FBMkM7b0JBQzNDLElBQUk7b0JBRUosSUFBSTtvQkFDSixpQkFBaUI7b0JBQ2pCLDZCQUE2QjtvQkFDN0IsdURBQXVEO29CQUN2RCwwQkFBMEI7b0JBQzFCLCtDQUErQztvQkFFL0Msd0JBQXdCO29CQUN4QiwrQkFBK0I7b0JBRS9CLDJDQUEyQztvQkFDM0MsSUFBSTtnQkFDTixDQUFDO2dCQUVNLFFBQVE7b0JBQ2IsaURBQWlEO29CQUNqRCxtREFBbUQ7b0JBQ25ELCtGQUErRjtvQkFFL0YscURBQXFEO29CQUNyRCxLQUFLO29CQUNMLG1CQUFtQjtvQkFDbkIsb0JBQW9CO29CQUNwQixLQUFLO29CQUVMLHdEQUF3RDtvQkFDeEQsS0FBSztvQkFDTCxxQkFBcUI7b0JBQ3JCLHFCQUFxQjtvQkFDckIsS0FBSztvQkFFTCxpQkFBaUI7Z0JBQ25CLENBQUM7Z0JBRU0sSUFBSSxDQUFDLFFBQTBCO29CQUNwQywwREFBMEQ7b0JBQzFELElBQUk7b0JBQ0osbUVBQW1FO29CQUNuRSxtRUFBbUU7b0JBQ25FLElBQUk7b0JBRUosMERBQTBEO29CQUMxRCxJQUFJO29CQUNKLGtFQUFrRTtvQkFDbEUsa0VBQWtFO29CQUNsRSxJQUFJO29CQUVKLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRU0sUUFBUSxDQUFDLEdBQVc7O29CQUN6QixRQUFRLEdBQUcsRUFBRTt3QkFDWCxLQUFLLEdBQUc7NEJBQ04sTUFBQSxJQUFJLENBQUMsT0FBTywwQ0FBRSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFOzRCQUNoRSxNQUFBLElBQUksQ0FBQyxPQUFPLDBDQUFFLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUU7NEJBQ2hFLE1BQU07d0JBRVIsS0FBSyxHQUFHOzRCQUNOLE1BQUEsSUFBSSxDQUFDLE9BQU8sMENBQUUsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUU7NEJBQy9ELE1BQUEsSUFBSSxDQUFDLE9BQU8sMENBQUUsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUU7NEJBQy9ELE1BQU07cUJBQ1Q7Z0JBQ0gsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUN4QixDQUFDO2FBQ0YsQ0FBQSJ9