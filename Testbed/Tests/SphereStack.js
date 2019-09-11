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
    var box2d, testbed, SphereStack;
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
            SphereStack = class SphereStack extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodies = [];
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 1.0;
                        for (let i = 0; i < SphereStack.e_count; ++i) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 4.0 + 3.0 * i);
                            this.m_bodies[i] = this.m_world.CreateBody(bd);
                            this.m_bodies[i].CreateFixture(shape, 1.0);
                            this.m_bodies[i].SetLinearVelocity(new box2d.b2Vec2(0.0, -50.0));
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // for (let i: number = 0; i < SphereStack.e_count; ++i)
                    // {
                    //   printf("%g ", this.m_bodies[i].GetWorldCenter().y);
                    // }
                    // for (let i: number = 0; i < SphereStack.e_count; ++i)
                    // {
                    //   printf("%g ", this.m_bodies[i].GetLinearVelocity().y);
                    // }
                    // printf("\n");
                }
                static Create() {
                    return new SphereStack();
                }
            };
            exports_1("SphereStack", SphereStack);
            SphereStack.e_count = 10;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BoZXJlU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTcGhlcmVTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsY0FBQSxNQUFhLFdBQVksU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFLM0M7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsYUFBUSxHQUFtQixFQUFFLENBQUM7b0JBS25DO3dCQUNFLE1BQU0sRUFBRSxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDbEQsTUFBTSxNQUFNLEdBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUV6RCxNQUFNLEtBQUssR0FBc0IsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3pELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVEO3dCQUNFLE1BQU0sS0FBSyxHQUF3QixJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFDN0QsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRXJCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFOzRCQUNwRCxNQUFNLEVBQUUsR0FBb0IsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ2xELEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7NEJBQzFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUVwQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUUvQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBRTNDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7eUJBQ2xFO3FCQUNGO2dCQUNILENBQUM7Z0JBRU0sSUFBSSxDQUFDLFFBQTBCO29CQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUVyQix3REFBd0Q7b0JBQ3hELElBQUk7b0JBQ0osd0RBQXdEO29CQUN4RCxJQUFJO29CQUVKLHdEQUF3RDtvQkFDeEQsSUFBSTtvQkFDSiwyREFBMkQ7b0JBQzNELElBQUk7b0JBRUosZ0JBQWdCO2dCQUNsQixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQzNCLENBQUM7YUFDRixDQUFBOztZQXJEd0IsbUJBQU8sR0FBVyxFQUFFLENBQUMifQ==