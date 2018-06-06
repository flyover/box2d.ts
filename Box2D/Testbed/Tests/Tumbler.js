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
    var box2d, testbed, Tumbler;
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
            Tumbler = class Tumbler extends testbed.Test {
                constructor() {
                    super();
                    this.m_count = 0;
                    const ground = this.m_world.CreateBody(new box2d.b2BodyDef());
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.allowSleep = false;
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(10.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(-10.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(10.0, 0.5, new box2d.b2Vec2(0.0, 10.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(10.0, 0.5, new box2d.b2Vec2(0.0, -10.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        const jd = new box2d.b2RevoluteJointDef();
                        jd.bodyA = ground;
                        jd.bodyB = body;
                        jd.localAnchorA.Set(0.0, 10.0);
                        jd.localAnchorB.Set(0.0, 0.0);
                        jd.referenceAngle = 0.0;
                        jd.motorSpeed = 0.05 * box2d.b2_pi;
                        jd.maxMotorTorque = 1e8;
                        jd.enableMotor = true;
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                    this.m_count = 0;
                }
                Step(settings) {
                    super.Step(settings);
                    if (this.m_count < Tumbler.e_count) {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.125, 0.125);
                        body.CreateFixture(shape, 1.0);
                        ++this.m_count;
                    }
                }
                static Create() {
                    return new Tumbler();
                }
            };
            Tumbler.e_count = 800;
            exports_1("Tumbler", Tumbler);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVtYmxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1bWJsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFVBQUEsYUFBcUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFNdkM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsWUFBTyxHQUFHLENBQUMsQ0FBQztvQkFLakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztvQkFFOUQ7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO3dCQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzNCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUV6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDekMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMvQixLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDL0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMvQixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7d0JBQ2xCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO3dCQUNoQixFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQy9CLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDOUIsRUFBRSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7d0JBQ3hCLEVBQUUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ25DLEVBQUUsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO3dCQUN4QixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDN0M7b0JBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sSUFBSSxDQUFDLFFBQTBCO29CQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUVyQixJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRTt3QkFDbEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRS9CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFDaEI7Z0JBQ0gsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN2QixDQUFDO2FBQ0YsQ0FBQTtZQTlEd0IsZUFBTyxHQUFHLEdBQUcsQ0FBQyJ9