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
            SphereStack.e_count = 10;
            exports_1("SphereStack", SphereStack);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BoZXJlU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1NwaGVyZVN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixjQUFBLGlCQUF5QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUszQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFISCxhQUFRLEdBQW1CLEVBQUUsQ0FBQztvQkFLbkM7d0JBQ0UsTUFBTSxFQUFFLEdBQW9CLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNsRCxNQUFNLE1BQU0sR0FBaUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpELE1BQU0sS0FBSyxHQUFzQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDekQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQ7d0JBQ0UsTUFBTSxLQUFLLEdBQXdCLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUM3RCxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFckIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ3BELE1BQU0sRUFBRSxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzs0QkFDbEQsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzs0QkFDMUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBRXBDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBRS9DLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFFM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt5QkFDbEU7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXJCLHdEQUF3RDtvQkFDeEQsSUFBSTtvQkFDSix3REFBd0Q7b0JBQ3hELElBQUk7b0JBRUosd0RBQXdEO29CQUN4RCxJQUFJO29CQUNKLDJEQUEyRDtvQkFDM0QsSUFBSTtvQkFFSixnQkFBZ0I7Z0JBQ2xCLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQzthQUNGLENBQUE7WUFyRHdCLG1CQUFPLEdBQVcsRUFBRSxDQUFDIn0=