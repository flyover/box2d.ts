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
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, TestRagdoll, testIndex;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            TestRagdoll = class TestRagdoll extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const vertices = [];
                        vertices[0] = new b2.Vec2(-30.0, 40.0);
                        vertices[1] = new b2.Vec2(30.0, 40.0);
                        vertices[2] = new b2.Vec2(30.0, 0.0);
                        vertices[3] = new b2.Vec2(-30.0, 0.0);
                        const shape = new b2.ChainShape();
                        shape.CreateLoop(vertices);
                        ground.CreateFixture(shape, 0.0);
                    }
                    const bd = new b2.BodyDef();
                    const fd = new b2.FixtureDef();
                    const jd = new b2.RevoluteJointDef();
                    // Add 2 ragdolls along the top
                    for (let i = 0; i < 2; ++i) {
                        const startX = -20.0 + Math.random() * 2.0 + 40.0 * i;
                        const startY = 30.0 + Math.random() * 5.0;
                        // BODIES
                        // Set these to dynamic bodies
                        bd.type = b2.BodyType.b2_dynamicBody;
                        // Head
                        fd.shape = new b2.CircleShape(1.25);
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.3;
                        bd.position.Set(startX, startY);
                        const head = this.m_world.CreateBody(bd);
                        head.CreateFixture(fd);
                        //if (i === 0)
                        //{
                        head.ApplyLinearImpulse(new b2.Vec2(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0), head.GetWorldCenter());
                        //}
                        // Torso1
                        const shape = new b2.PolygonShape();
                        fd.shape = shape;
                        shape.SetAsBox(1.5, 1.0);
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.1;
                        bd.position.Set(startX, (startY - 2.8));
                        const torso1 = this.m_world.CreateBody(bd);
                        torso1.CreateFixture(fd);
                        // Torso2
                        shape.SetAsBox(1.5, 1.0);
                        bd.position.Set(startX, (startY - 4.3));
                        const torso2 = this.m_world.CreateBody(bd);
                        torso2.CreateFixture(fd);
                        // Torso3
                        shape.SetAsBox(1.5, 1.0);
                        bd.position.Set(startX, (startY - 5.8));
                        const torso3 = this.m_world.CreateBody(bd);
                        torso3.CreateFixture(fd);
                        // UpperArm
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.1;
                        // L
                        shape.SetAsBox(1.8, 0.65);
                        bd.position.Set((startX - 3.0), (startY - 2.0));
                        const upperArmL = this.m_world.CreateBody(bd);
                        upperArmL.CreateFixture(fd);
                        // R
                        shape.SetAsBox(1.8, 0.65);
                        bd.position.Set((startX + 3.0), (startY - 2.0));
                        const upperArmR = this.m_world.CreateBody(bd);
                        upperArmR.CreateFixture(fd);
                        // LowerArm
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.1;
                        // L
                        shape.SetAsBox(1.7, 0.6);
                        bd.position.Set((startX - 5.7), (startY - 2.0));
                        const lowerArmL = this.m_world.CreateBody(bd);
                        lowerArmL.CreateFixture(fd);
                        // R
                        shape.SetAsBox(1.7, 0.6);
                        bd.position.Set((startX + 5.7), (startY - 2.0));
                        const lowerArmR = this.m_world.CreateBody(bd);
                        lowerArmR.CreateFixture(fd);
                        // UpperLeg
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.1;
                        // L
                        shape.SetAsBox(0.75, 2.2);
                        bd.position.Set((startX - 0.8), (startY - 8.5));
                        const upperLegL = this.m_world.CreateBody(bd);
                        upperLegL.CreateFixture(fd);
                        // R
                        shape.SetAsBox(0.75, 2.2);
                        bd.position.Set((startX + 0.8), (startY - 8.5));
                        const upperLegR = this.m_world.CreateBody(bd);
                        upperLegR.CreateFixture(fd);
                        // LowerLeg
                        fd.density = 1.0;
                        fd.friction = 0.4;
                        fd.restitution = 0.1;
                        // L
                        shape.SetAsBox(0.6, 2.0);
                        bd.position.Set((startX - 0.8), (startY - 12.0));
                        const lowerLegL = this.m_world.CreateBody(bd);
                        lowerLegL.CreateFixture(fd);
                        // R
                        shape.SetAsBox(0.6, 2.0);
                        bd.position.Set((startX + 0.8), (startY - 12.0));
                        const lowerLegR = this.m_world.CreateBody(bd);
                        lowerLegR.CreateFixture(fd);
                        // JOINTS
                        jd.enableLimit = true;
                        // Head to shoulders
                        jd.lowerAngle = b2.DegToRad(-40.0);
                        jd.upperAngle = b2.DegToRad(40.0);
                        jd.Initialize(torso1, head, new b2.Vec2(startX, (startY - 1.5)));
                        this.m_world.CreateJoint(jd);
                        // Upper arm to shoulders
                        // L
                        jd.lowerAngle = b2.DegToRad(-85.0);
                        jd.upperAngle = b2.DegToRad(130.0);
                        jd.Initialize(torso1, upperArmL, new b2.Vec2((startX - 1.8), (startY - 2.0)));
                        this.m_world.CreateJoint(jd);
                        // R
                        jd.lowerAngle = b2.DegToRad(-130.0);
                        jd.upperAngle = b2.DegToRad(85.0);
                        jd.Initialize(torso1, upperArmR, new b2.Vec2((startX + 1.8), (startY - 2.0)));
                        this.m_world.CreateJoint(jd);
                        // Lower arm to upper arm
                        // L
                        jd.lowerAngle = b2.DegToRad(-130.0);
                        jd.upperAngle = b2.DegToRad(10.0);
                        jd.Initialize(upperArmL, lowerArmL, new b2.Vec2((startX - 4.5), (startY - 2.0)));
                        this.m_world.CreateJoint(jd);
                        // R
                        jd.lowerAngle = b2.DegToRad(-10.0);
                        jd.upperAngle = b2.DegToRad(130.0);
                        jd.Initialize(upperArmR, lowerArmR, new b2.Vec2((startX + 4.5), (startY - 2.0)));
                        this.m_world.CreateJoint(jd);
                        // Shoulders/stomach
                        jd.lowerAngle = b2.DegToRad(-15.0);
                        jd.upperAngle = b2.DegToRad(15.0);
                        jd.Initialize(torso1, torso2, new b2.Vec2(startX, (startY - 3.5)));
                        this.m_world.CreateJoint(jd);
                        // Stomach/hips
                        jd.Initialize(torso2, torso3, new b2.Vec2(startX, (startY - 5.0)));
                        this.m_world.CreateJoint(jd);
                        // Torso to upper leg
                        // L
                        jd.lowerAngle = b2.DegToRad(-25.0);
                        jd.upperAngle = b2.DegToRad(45.0);
                        jd.Initialize(torso3, upperLegL, new b2.Vec2((startX - 0.8), (startY - 7.2)));
                        this.m_world.CreateJoint(jd);
                        // R
                        jd.lowerAngle = b2.DegToRad(-45.0);
                        jd.upperAngle = b2.DegToRad(25.0);
                        jd.Initialize(torso3, upperLegR, new b2.Vec2((startX + 0.8), (startY - 7.2)));
                        this.m_world.CreateJoint(jd);
                        // Upper leg to lower leg
                        // L
                        jd.lowerAngle = b2.DegToRad(-25.0);
                        jd.upperAngle = b2.DegToRad(115.0);
                        jd.Initialize(upperLegL, lowerLegL, new b2.Vec2((startX - 0.8), (startY - 10.5)));
                        this.m_world.CreateJoint(jd);
                        // R
                        jd.lowerAngle = b2.DegToRad(-115.0);
                        jd.upperAngle = b2.DegToRad(25.0);
                        jd.Initialize(upperLegR, lowerLegR, new b2.Vec2((startX + 0.8), (startY - 10.5)));
                        this.m_world.CreateJoint(jd);
                    }
                    // these are static bodies so set the type accordingly
                    bd.type = b2.BodyType.b2_staticBody;
                    const shape = new b2.PolygonShape();
                    fd.shape = shape;
                    fd.density = 0.0;
                    fd.friction = 0.4;
                    fd.restitution = 0.3;
                    // Add stairs on the left
                    for (let j = 1; j <= 10; ++j) {
                        shape.SetAsBox((1.0 * j), 1.0);
                        bd.position.Set((1.0 * j - 30.0), (21.0 - 2.0 * j));
                        this.m_world.CreateBody(bd).CreateFixture(fd);
                    }
                    // Add stairs on the right
                    for (let k = 1; k <= 10; ++k) {
                        shape.SetAsBox((1.0 * k), 1.0);
                        bd.position.Set((30.0 - 1.0 * k), (21.0 - 2.0 * k));
                        this.m_world.CreateBody(bd).CreateFixture(fd);
                    }
                    shape.SetAsBox(3.0, 4.0);
                    bd.position.Set(0.0, 4.0);
                    this.m_world.CreateBody(bd).CreateFixture(fd);
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new TestRagdoll();
                }
            };
            exports_1("TestRagdoll", TestRagdoll);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Extras", "Ragdoll", TestRagdoll.Create));
        }
    };
});
//# sourceMappingURL=test_ragdoll.js.map