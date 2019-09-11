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
            exports_1("Tumbler", Tumbler);
            Tumbler.e_count = 800;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVtYmxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1bWJsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFVBQUEsTUFBYSxPQUFRLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBTXZDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUhILFlBQU8sR0FBRyxDQUFDLENBQUM7b0JBS2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBRTlEO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO3dCQUMxQyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzt3QkFDdEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDL0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFB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