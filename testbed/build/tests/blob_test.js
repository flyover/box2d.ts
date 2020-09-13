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
    var box2d, testbed, BlobTest;
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
            BlobTest = class BlobTest extends testbed.Test {
                constructor() {
                    super();
                    const ground = this.m_world.CreateBody(new box2d.b2BodyDef());
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.SetTwoSided(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(-40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new box2d.b2Vec2(40.0, 0.0), new box2d.b2Vec2(40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const ajd = new box2d.b2AreaJointDef();
                        const cx = 0.0;
                        const cy = 10.0;
                        const rx = 5.0;
                        const ry = 5.0;
                        const nBodies = 20;
                        const bodyRadius = 0.5;
                        for (let i = 0; i < nBodies; ++i) {
                            const angle = (i * 2.0 * Math.PI) / nBodies;
                            const bd = new box2d.b2BodyDef();
                            //bd.isBullet = true;
                            bd.fixedRotation = true;
                            const x = cx + rx * Math.cos(angle);
                            const y = cy + ry * Math.sin(angle);
                            bd.position.Set(x, y);
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            const body = this.m_world.CreateBody(bd);
                            const fd = new box2d.b2FixtureDef();
                            fd.shape = new box2d.b2CircleShape(bodyRadius);
                            fd.density = 1.0;
                            body.CreateFixture(fd);
                            ajd.AddBody(body);
                        }
                        const frequencyHz = 10.0;
                        const dampingRatio = 1.0;
                        box2d.b2LinearStiffness(ajd, frequencyHz, dampingRatio, ajd.bodyA, ajd.bodyB);
                        this.m_world.CreateJoint(ajd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new BlobTest();
                }
            };
            exports_1("BlobTest", BlobTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvYl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvYmxvYl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLE1BQWEsUUFBUyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUN4QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO29CQUU5RDt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUM3RSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQy9FLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUM3RSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQ7d0JBQ0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBRXZDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQzt3QkFDZixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7d0JBQ2hCLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQzt3QkFDZixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7d0JBQ2YsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNuQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUM7d0JBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ2hDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDOzRCQUM1QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzs0QkFDakMscUJBQXFCOzRCQUNyQixFQUFFLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs0QkFFeEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUNwQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3BDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzs0QkFDMUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBRXpDLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs0QkFDL0MsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7NEJBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBRXZCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQ25CO3dCQUVELE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQzt3QkFDakMsTUFBTSxZQUFZLEdBQVcsR0FBRyxDQUFDO3dCQUNqQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMvQjtnQkFDSCxDQUFDO2dCQUVNLElBQUksQ0FBQyxRQUEwQjtvQkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUN4QixDQUFDO2FBQ0YsQ0FBQSJ9