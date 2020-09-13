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
    var box2d, testbed, ApplyForce;
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
            ApplyForce = class ApplyForce extends testbed.Test {
                constructor() {
                    super();
                    this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));
                    /*float32*/
                    const k_restitution = 0.4;
                    /*box2d.b2Body*/
                    let ground = null;
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(0.0, 20.0);
                        ground = this.m_world.CreateBody(bd);
                        /*box2d.b2EdgeShape*/
                        const shape = new box2d.b2EdgeShape();
                        /*box2d.b2FixtureDef*/
                        const sd = new box2d.b2FixtureDef();
                        sd.shape = shape;
                        sd.density = 0.0;
                        sd.restitution = k_restitution;
                        // Left vertical
                        shape.SetTwoSided(new box2d.b2Vec2(-20.0, -20.0), new box2d.b2Vec2(-20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Right vertical
                        shape.SetTwoSided(new box2d.b2Vec2(20.0, -20.0), new box2d.b2Vec2(20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Top horizontal
                        shape.SetTwoSided(new box2d.b2Vec2(-20.0, 20.0), new box2d.b2Vec2(20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Bottom horizontal
                        shape.SetTwoSided(new box2d.b2Vec2(-20.0, -20.0), new box2d.b2Vec2(20.0, -20.0));
                        ground.CreateFixture(sd);
                    }
                    {
                        /*box2d.b2Transform*/
                        const xf1 = new box2d.b2Transform();
                        xf1.q.SetAngle(0.3524 * box2d.b2_pi);
                        xf1.p.Copy(box2d.b2Rot.MulRV(xf1.q, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2()));
                        /*box2d.b2Vec2[]*/
                        const vertices = new Array();
                        vertices[0] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2());
                        vertices[1] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2());
                        vertices[2] = box2d.b2Transform.MulXV(xf1, new box2d.b2Vec2(0.0, 0.5), new box2d.b2Vec2());
                        /*box2d.b2PolygonShape*/
                        const poly1 = new box2d.b2PolygonShape();
                        poly1.Set(vertices, 3);
                        /*box2d.b2FixtureDef*/
                        const sd1 = new box2d.b2FixtureDef();
                        sd1.shape = poly1;
                        sd1.density = 2.0;
                        /*box2d.b2Transform*/
                        const xf2 = new box2d.b2Transform();
                        xf2.q.SetAngle(-0.3524 * box2d.b2_pi);
                        xf2.p.Copy(box2d.b2Rot.MulRV(xf2.q, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2()));
                        vertices[0] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(-1.0, 0.0), new box2d.b2Vec2());
                        vertices[1] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(1.0, 0.0), new box2d.b2Vec2());
                        vertices[2] = box2d.b2Transform.MulXV(xf2, new box2d.b2Vec2(0.0, 0.5), new box2d.b2Vec2());
                        /*box2d.b2PolygonShape*/
                        const poly2 = new box2d.b2PolygonShape();
                        poly2.Set(vertices, 3);
                        /*box2d.b2FixtureDef*/
                        const sd2 = new box2d.b2FixtureDef();
                        sd2.shape = poly2;
                        sd2.density = 2.0;
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 3.0);
                        bd.angle = box2d.b2_pi;
                        bd.allowSleep = false;
                        this.m_body = this.m_world.CreateBody(bd);
                        this.m_body.CreateFixture(sd1);
                        this.m_body.CreateFixture(sd2);
                        const gravity = 10.0;
                        const I = this.m_body.GetInertia();
                        const mass = this.m_body.GetMass();
                        // Compute an effective radius that can be used to
                        // set the max torque for a friction joint
                        // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
                        const radius = box2d.b2Sqrt(2.0 * I / mass);
                        // b2FrictionJointDef jd;
                        const jd = new box2d.b2FrictionJointDef();
                        jd.bodyA = ground;
                        jd.bodyB = this.m_body;
                        jd.localAnchorA.SetZero();
                        jd.localAnchorB.Copy(this.m_body.GetLocalCenter());
                        jd.collideConnected = true;
                        jd.maxForce = 0.5 * mass * gravity;
                        jd.maxTorque = 0.2 * mass * radius * gravity;
                        this.m_world.CreateJoint(jd);
                    }
                    {
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        for ( /*int*/let i = 0; i < 10; ++i) {
                            /*box2d.b2BodyDef*/
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 7.0 + 1.54 * i);
                            /*box2d.b2Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            /*float32*/
                            const gravity = 10.0;
                            /*float32*/
                            const I = body.GetInertia();
                            /*float32*/
                            const mass = body.GetMass();
                            // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
                            /*float32*/
                            const radius = box2d.b2Sqrt(2.0 * I / mass);
                            /*box2d.b2FrictionJointDef*/
                            const jd = new box2d.b2FrictionJointDef();
                            jd.localAnchorA.SetZero();
                            jd.localAnchorB.SetZero();
                            jd.bodyA = ground;
                            jd.bodyB = body;
                            jd.collideConnected = true;
                            jd.maxForce = mass * gravity;
                            jd.maxTorque = 0.1 * mass * radius * gravity;
                            this.m_world.CreateJoint(jd);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "w":
                            {
                                /*box2d.b2Vec2*/
                                const f = this.m_body.GetWorldVector(new box2d.b2Vec2(0.0, -50.0), new box2d.b2Vec2());
                                /*box2d.b2Vec2*/
                                const p = this.m_body.GetWorldPoint(new box2d.b2Vec2(0.0, 3.0), new box2d.b2Vec2());
                                this.m_body.ApplyForce(f, p);
                            }
                            break;
                        case "a":
                            {
                                this.m_body.ApplyTorque(10.0);
                            }
                            break;
                        case "d":
                            {
                                this.m_body.ApplyTorque(-10.0);
                            }
                            break;
                    }
                    super.Keyboard(key);
                }
                Step(settings) {
                    // g_debugDraw.DrawString(5, m_textLine, "Forward (W), Turn (A) and (D)");
                    // m_textLine += m_textIncrement;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Forward (W), Turn (A) and (D)`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    super.Step(settings);
                }
                static Create() {
                    return new ApplyForce();
                }
            };
            exports_1("ApplyForce", ApplyForce);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfZm9yY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9hcHBseV9mb3JjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsYUFBQSxNQUFhLFVBQVcsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFHMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUVwRCxXQUFXO29CQUNYLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsZ0JBQWdCO29CQUNoQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2xCO3dCQUNFLG1CQUFtQjt3QkFDbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVyQyxxQkFBcUI7d0JBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUV0QyxzQkFBc0I7d0JBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO3dCQUUvQixnQkFBZ0I7d0JBQ2hCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMs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LEdBQUcsS0FBSyxDQUFDO3dCQUNsQixHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQzt3QkFFbEIscUJBQXFCO3dCQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDcEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRXRGLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7d0JBQzVGLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFFM0Ysd0JBQXdCO3dCQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUss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