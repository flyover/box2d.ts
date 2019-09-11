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
    var box2d, testbed, Chain;
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
            Chain = class Chain extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.6, 0.125);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 20.0;
                        fd.friction = 0.2;
                        const jd = new box2d.b2RevoluteJointDef();
                        jd.collideConnected = false;
                        const y = 25.0;
                        let prevBody = ground;
                        for (let i = 0; i < Chain.e_count; ++i) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.5 + i, y);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            const anchor = new box2d.b2Vec2(i, y);
                            jd.Initialize(prevBody, body, anchor);
                            this.m_world.CreateJoint(jd);
                            prevBody = body;
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new Chain();
                }
            };
            exports_1("Chain", Chain);
            Chain.e_count = 30;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDaGFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsUUFBQSxNQUFhLEtBQU0sU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFHckM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUVsQjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVyQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQ7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUUzQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzt3QkFFNUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUNmLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQzt3QkFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ3RDLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUNqQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzRCQUMxQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFN0IsUUFBUSxHQUFHLElBQUksQ0FBQzt5QkFDakI7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDckIsQ0FBQzthQUNGLENBQUE7O1lBckR3QixhQUFPLEdBQUcsRUFBRSxDQUFDIn0=