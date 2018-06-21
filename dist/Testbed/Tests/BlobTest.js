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
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(-40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(40.0, 0.0), new box2d.b2Vec2(40.0, 25.0));
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
                        ajd.frequencyHz = 10.0;
                        ajd.dampingRatio = 1.0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvYlRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0Jsb2JUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLGNBQXNCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3hDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBRTlEO3dCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDdkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRDt3QkFDRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFFdkMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO3dCQUNmLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO3dCQUNmLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQzt3QkFDZixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7d0JBQ25CLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQzt3QkFDdkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDaEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7NEJBQzVDLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUNqQyxxQkFBcUI7NEJBQ3JCLEVBQUUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDOzRCQUV4QixNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDcEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzRCQUMxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFekMsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7NEJBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzRCQUMvQyxFQUFFLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQzs0QkFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFdkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDbkI7d0JBRUQsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3ZCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO3dCQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDL0I7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDeEIsQ0FBQzthQUNGLENBQUEifQ==