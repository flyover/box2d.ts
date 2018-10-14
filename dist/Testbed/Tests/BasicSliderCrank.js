/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
    var box2d, testbed, BasicSliderCrank;
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
            BasicSliderCrank = class BasicSliderCrank extends testbed.Test {
                constructor() {
                    super();
                    /*box2d.b2Body*/
                    let ground = null;
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(0.0, 17.0);
                        ground = this.m_world.CreateBody(bd);
                    }
                    {
                        /*box2d.b2Body*/
                        let prevBody = ground;
                        // Define crank.
                        {
                            /*box2d.b2PolygonShape*/
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(4.0, 1.0);
                            /*box2d.b2BodyDef*/
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(-8.0, 20.0);
                            /*box2d.b2Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*box2d.b2RevoluteJointDef*/
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(-12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define connecting rod
                        {
                            /*box2d.b2PolygonShape*/
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(8.0, 1.0);
                            /*box2d.b2BodyDef*/
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(4.0, 20.0);
                            /*box2d.b2Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*box2d.b2RevoluteJointDef*/
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(-4.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define piston
                        {
                            /*box2d.b2PolygonShape*/
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(3.0, 3.0);
                            /*box2d.b2BodyDef*/
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.fixedRotation = true;
                            bd.position.Set(12.0, 20.0);
                            /*box2d.b2Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*box2d.b2RevoluteJointDef*/
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            /*box2d.b2PrismaticJointDef*/
                            const pjd = new box2d.b2PrismaticJointDef();
                            pjd.Initialize(ground, body, new box2d.b2Vec2(12.0, 17.0), new box2d.b2Vec2(1.0, 0.0));
                            this.m_world.CreateJoint(pjd);
                        }
                    }
                }
                static Create() {
                    return new BasicSliderCrank();
                }
            };
            exports_1("BasicSliderCrank", BasicSliderCrank);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNTbGlkZXJDcmFuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvQmFzaWNTbGlkZXJDcmFuay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBS0gsbUJBQUEsTUFBYSxnQkFBaUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDaEQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsZ0JBQWdCO29CQUNoQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2xCO3dCQUNFLG1CQUFtQjt3QkFDbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN0QztvQkFFRDt3QkFDRSxnQkFBZ0I7d0JBQ2hCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQzt3QkFFdEIsZ0JBQWdCO3dCQUNoQjs0QkFDRSx3QkFBd0I7NEJBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFFekIsbUJBQW1COzRCQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzs0QkFDakMsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzs0QkFDMUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQzVCLGdCQUFnQjs0QkFDaEIsTUFB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