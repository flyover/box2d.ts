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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, MotorJoint2;
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
            // Adapted from MotorJoint.h
            MotorJoint2 = class MotorJoint2 extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        ground.CreateFixture(fd);
                    }
                    // b2Body * body1 = NULL;
                    let body1 = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 4.0);
                        body1 = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 1.0;
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        body1.CreateFixture(fd);
                    }
                    // b2Body * body2 = NULL;
                    let body2 = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(4.0, 8.0);
                        body2 = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 1.0;
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        body2.CreateFixture(fd);
                    }
                    {
                        const mjd = new box2d.b2MotorJointDef();
                        mjd.Initialize(body1, body2);
                        mjd.maxForce = 1000.0;
                        mjd.maxTorque = 1000.0;
                        this.m_joint = this.m_world.CreateJoint(mjd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new MotorJoint2();
                }
            };
            exports_1("MotorJoint2", MotorJoint2);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW90b3JKb2ludDIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNb3RvckpvaW50Mi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsNEJBQTRCO1lBRTVCLGNBQUEsaUJBQXlCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQzNDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksTUFBTSxHQUFpQixJQUFJLENBQUM7b0JBQ2hDO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBRXJFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFFakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDMUI7b0JBRUQseUJBQXlCO29CQUN6QixJQUFJLEtBQUssR0FBaUIsSUFBSSxDQUFDO29CQUMvQjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXBDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUN4QyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFckIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFDbEIsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7d0JBQ2pCLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3pCO29CQUVELHlCQUF5QjtvQkFDekIsSUFBSSxLQUFLLEdBQWlCLElBQUksQ0FBQztvQkFDL0I7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVwQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFDeEMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRXJCLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsRUFBRSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBQ2xCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO3dCQUNqQixLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN6QjtvQkFFRDt3QkFDRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3QkFDeEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzdCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO3dCQUN0QixHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQzt3QkFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQXVCLENBQUM7cUJBQ3BFO2dCQUNILENBQUM7Z0JBS00sSUFBSSxDQUFDLFFBQTBCO29CQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQzNCLENBQUM7YUFDRixDQUFBIn0=