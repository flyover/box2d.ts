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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, OneSidedPlatform;
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
            OneSidedPlatform = class OneSidedPlatform extends testbed.Test {
                constructor() {
                    super();
                    this.m_radius = 0.0;
                    this.m_top = 0.0;
                    this.m_bottom = 0.0;
                    this.m_state = OneSidedPlatform.State.e_unknown;
                    // Ground
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Platform
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(3.0, 0.5);
                        this.m_platform = body.CreateFixture(shape, 0.0);
                        this.m_bottom = 10.0 - 0.5;
                        this.m_top = 10.0 + 0.5;
                    }
                    // Actor
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 12.0);
                        const body = this.m_world.CreateBody(bd);
                        this.m_radius = 0.5;
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = this.m_radius;
                        this.m_character = body.CreateFixture(shape, 20.0);
                        body.SetLinearVelocity(new box2d.b2Vec2(0.0, -50.0));
                        this.m_state = OneSidedPlatform.State.e_unknown;
                    }
                }
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA !== this.m_platform && fixtureA !== this.m_character) {
                        return;
                    }
                    if (fixtureB !== this.m_platform && fixtureB !== this.m_character) {
                        return;
                    }
                    const position = this.m_character.GetBody().GetPosition();
                    if (position.y < this.m_top + this.m_radius - 3.0 * box2d.b2_linearSlop) {
                        contact.SetEnabled(false);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new OneSidedPlatform();
                }
            };
            exports_1("OneSidedPlatform", OneSidedPlatform);
            (function (OneSidedPlatform) {
                let State;
                (function (State) {
                    State[State["e_unknown"] = 0] = "e_unknown";
                    State[State["e_above"] = 1] = "e_above";
                    State[State["e_below"] = 2] = "e_below";
                })(State = OneSidedPlatform.State || (OneSidedPlatform.State = {}));
            })(OneSidedPlatform || (OneSidedPlatform = {}));
            exports_1("OneSidedPlatform", OneSidedPlatform);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25lU2lkZWRQbGF0Zm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvT25lU2lkZWRQbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsbUJBQUEsc0JBQThCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUWhEO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQVJILGFBQVEsR0FBRyxHQUFHLENBQUM7b0JBQ2YsVUFBSyxHQUFHLEdBQUcsQ0FBQztvQkFDWixhQUFRLEdBQUcsR0FBRyxDQUFDO29CQUNmLFlBQU8sR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO29CQU9oRCxTQUFTO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVELFdBQVc7b0JBQ1g7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxJQUFJ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