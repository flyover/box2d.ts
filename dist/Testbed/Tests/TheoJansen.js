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
    var box2d, testbed, TheoJansen;
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
            // Inspired by a contribution by roman_m
            // Dimensions scooped from APE (http://www.cove.org/ape/index.htm)
            TheoJansen = class TheoJansen extends testbed.Test {
                constructor() {
                    super();
                    this.m_offset = new box2d.b2Vec2();
                    this.m_motorOn = false;
                    this.m_motorSpeed = 0;
                    this.Construct();
                }
                CreateLeg(s, wheelAnchor) {
                    const p1 = new box2d.b2Vec2(5.4 * s, -6.1);
                    const p2 = new box2d.b2Vec2(7.2 * s, -1.2);
                    const p3 = new box2d.b2Vec2(4.3 * s, -1.9);
                    const p4 = new box2d.b2Vec2(3.1 * s, 0.8);
                    const p5 = new box2d.b2Vec2(6.0 * s, 1.5);
                    const p6 = new box2d.b2Vec2(2.5 * s, 3.7);
                    const fd1 = new box2d.b2FixtureDef();
                    const fd2 = new box2d.b2FixtureDef();
                    fd1.filter.groupIndex = -1;
                    fd2.filter.groupIndex = -1;
                    fd1.density = 1.0;
                    fd2.density = 1.0;
                    const poly1 = new box2d.b2PolygonShape();
                    const poly2 = new box2d.b2PolygonShape();
                    if (s > 0.0) {
                        const vertices = new Array();
                        vertices[0] = p1;
                        vertices[1] = p2;
                        vertices[2] = p3;
                        poly1.Set(vertices);
                        vertices[0] = box2d.b2Vec2_zero;
                        vertices[1] = box2d.b2Vec2.SubVV(p5, p4, new box2d.b2Vec2());
                        vertices[2] = box2d.b2Vec2.SubVV(p6, p4, new box2d.b2Vec2());
                        poly2.Set(vertices);
                    }
                    else {
                        const vertices = new Array();
                        vertices[0] = p1;
                        vertices[1] = p3;
                        vertices[2] = p2;
                        poly1.Set(vertices);
                        vertices[0] = box2d.b2Vec2_zero;
                        vertices[1] = box2d.b2Vec2.SubVV(p6, p4, new box2d.b2Vec2());
                        vertices[2] = box2d.b2Vec2.SubVV(p5, p4, new box2d.b2Vec2());
                        poly2.Set(vertices);
                    }
                    fd1.shape = poly1;
                    fd2.shape = poly2;
                    const bd1 = new box2d.b2BodyDef();
                    const bd2 = new box2d.b2BodyDef();
                    bd1.type = box2d.b2BodyType.b2_dynamicBody;
                    bd2.type = box2d.b2BodyType.b2_dynamicBody;
                    bd1.position.Copy(this.m_offset);
                    bd2.position.Copy(box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));
                    bd1.angularDamping = 10.0;
                    bd2.angularDamping = 10.0;
                    const body1 = this.m_world.CreateBody(bd1);
                    const body2 = this.m_world.CreateBody(bd2);
                    body1.CreateFixture(fd1);
                    body2.CreateFixture(fd2);
                    const djd = new box2d.b2DistanceJointDef();
                    // Using a soft distance constraint can reduce some jitter.
                    // It also makes the structure seem a bit more fluid by
                    // acting like a suspension system.
                    djd.dampingRatio = 0.5;
                    djd.frequencyHz = 10.0;
                    djd.Initialize(body1, body2, box2d.b2Vec2.AddVV(p2, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(p5, this.m_offset, new box2d.b2Vec2()));
                    this.m_world.CreateJoint(djd);
                    djd.Initialize(body1, body2, box2d.b2Vec2.AddVV(p3, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));
                    this.m_world.CreateJoint(djd);
                    djd.Initialize(body1, this.m_wheel, box2d.b2Vec2.AddVV(p3, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(wheelAnchor, this.m_offset, new box2d.b2Vec2()));
                    this.m_world.CreateJoint(djd);
                    djd.Initialize(body2, this.m_wheel, box2d.b2Vec2.AddVV(p6, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(wheelAnchor, this.m_offset, new box2d.b2Vec2()));
                    this.m_world.CreateJoint(djd);
                    const rjd = new box2d.b2RevoluteJointDef();
                    rjd.Initialize(body2, this.m_chassis, box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));
                    this.m_world.CreateJoint(rjd);
                }
                Construct() {
                    this.m_offset.Set(0.0, 8.0);
                    this.m_motorSpeed = 2.0;
                    this.m_motorOn = true;
                    const pivot = new box2d.b2Vec2(0.0, 0.8);
                    // Ground
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(50.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(-50.0, 10.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(50.0, 0.0), new box2d.b2Vec2(50.0, 10.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Balls
                    for (let i = 0; i < 40; ++i) {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 0.25;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(-40.0 + 2.0 * i, 0.5);
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 1.0);
                    }
                    // Chassis
                    {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(2.5, 1.0);
                        const sd = new box2d.b2FixtureDef();
                        sd.density = 1.0;
                        sd.shape = shape;
                        sd.filter.groupIndex = -1;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Copy(pivot).SelfAdd(this.m_offset);
                        this.m_chassis = this.m_world.CreateBody(bd);
                        this.m_chassis.CreateFixture(sd);
                    }
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 1.6;
                        const sd = new box2d.b2FixtureDef();
                        sd.density = 1.0;
                        sd.shape = shape;
                        sd.filter.groupIndex = -1;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Copy(pivot).SelfAdd(this.m_offset);
                        this.m_wheel = this.m_world.CreateBody(bd);
                        this.m_wheel.CreateFixture(sd);
                    }
                    {
                        const jd = new box2d.b2RevoluteJointDef();
                        jd.Initialize(this.m_wheel, this.m_chassis, box2d.b2Vec2.AddVV(pivot, this.m_offset, new box2d.b2Vec2()));
                        jd.collideConnected = false;
                        jd.motorSpeed = this.m_motorSpeed;
                        jd.maxMotorTorque = 400.0;
                        jd.enableMotor = this.m_motorOn;
                        this.m_motorJoint = this.m_world.CreateJoint(jd);
                    }
                    const wheelAnchor = box2d.b2Vec2.AddVV(pivot, new box2d.b2Vec2(0.0, -0.8), new box2d.b2Vec2());
                    this.CreateLeg(-1.0, wheelAnchor);
                    this.CreateLeg(1.0, wheelAnchor);
                    this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), 120.0 * box2d.b2_pi / 180.0);
                    this.CreateLeg(-1.0, wheelAnchor);
                    this.CreateLeg(1.0, wheelAnchor);
                    this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), -120.0 * box2d.b2_pi / 180.0);
                    this.CreateLeg(-1.0, wheelAnchor);
                    this.CreateLeg(1.0, wheelAnchor);
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_motorJoint.SetMotorSpeed(-this.m_motorSpeed);
                            break;
                        case "s":
                            this.m_motorJoint.SetMotorSpeed(0.0);
                            break;
                        case "d":
                            this.m_motorJoint.SetMotorSpeed(this.m_motorSpeed);
                            break;
                        case "m":
                            this.m_motorJoint.EnableMotor(!this.m_motorJoint.IsMotorEnabled());
                            break;
                    }
                }
                Step(settings) {
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, toggle motor = m");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    super.Step(settings);
                }
                static Create() {
                    return new TheoJansen();
                }
            };
            exports_1("TheoJansen", TheoJansen);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhlb0phbnNlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvVGhlb0phbnNlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Ysd0NBQXdDO1lBQ3hDLGtFQUFrRTtZQUVsRSxhQUFBLGdCQUF3QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVExQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFSSCxhQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBSTlCLGNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ2xCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUt0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sU0FBUyxDQUFDLENBQVMsRUFBRSxXQUF5QjtvQkFDbkQsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFN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USxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkosSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRTlCLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkosSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRTlCLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25LLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUU5QixHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxR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