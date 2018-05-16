/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, Soccer;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {/*
            * Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
            Soccer = class Soccer extends testbed.Test {
                constructor() {
                    super();
                    this.heightShift = 15;
                    this.m_world.m_gravity = new box2d.b2Vec2();
                    // Maybe needs to change the accessibility of this variable.
                    // But we can't modify that in the original Box2D.
                    // box2d.b2_velocityThreshold = 0;
                    let width = 40.00, height = 24.00, heightShift = this.heightShift;
                    let PLAYER_R = 1.4;
                    let BALL_R = 0.92;
                    let walls = [
                        new box2d.b2Vec2(-width * .5 + 0.2, -height * .5 + heightShift),
                        new box2d.b2Vec2(-width * .5, -height * .5 + 0.2 + heightShift),
                        new box2d.b2Vec2(-width * .5, -height * .2 + heightShift),
                        new box2d.b2Vec2(-width * .6, -height * .2 + heightShift),
                        new box2d.b2Vec2(-width * .6, +height * .2 + heightShift),
                        new box2d.b2Vec2(-width * .5, +height * .2 + heightShift),
                        new box2d.b2Vec2(-width * .5, +height * .5 - .2 + heightShift),
                        new box2d.b2Vec2(-width * .5 + .2, +height * .5 + heightShift),
                        new box2d.b2Vec2(+width * .5 - .2, +height * .5 + heightShift),
                        new box2d.b2Vec2(+width * .5, +height * .5 - .2 + heightShift),
                        new box2d.b2Vec2(+width * .5, +height * .2 + heightShift),
                        new box2d.b2Vec2(+width * .6, +height * .2 + heightShift),
                        new box2d.b2Vec2(+width * .6, -height * .2 + heightShift),
                        new box2d.b2Vec2(+width * .5, -height * .2 + heightShift),
                        new box2d.b2Vec2(+width * .5, -height * .5 + .2 + heightShift),
                        new box2d.b2Vec2(+width * .5 - .2, -height * .5 + heightShift)
                    ];
                    let balls = [
                        new box2d.b2Vec2(-width * .45, 0 + heightShift),
                        new box2d.b2Vec2(-width * .3, -height * 0.2 + heightShift),
                        new box2d.b2Vec2(-width * .3, +height * 0.2 + heightShift),
                        new box2d.b2Vec2(-width * .1, -height * 0.1 + heightShift),
                        new box2d.b2Vec2(-width * .1, +height * 0.1 + heightShift)
                    ];
                    var goal = [
                        new box2d.b2Vec2(0, -height * 0.2 + heightShift),
                        new box2d.b2Vec2(0, +height * 0.2 + heightShift)
                    ];
                    this.wallFixDef = new box2d.b2FixtureDef();
                    this.wallFixDef.friction = 0;
                    this.wallFixDef.restitution = 0;
                    this.wallFixDef.userData = 'wall';
                    this.goalFixDef = new box2d.b2FixtureDef();
                    this.goalFixDef.friction = 0;
                    this.goalFixDef.restitution = 1;
                    this.goalFixDef.userData = 'goal';
                    this.ballFixDef = new box2d.b2FixtureDef();
                    this.ballFixDef.friction = .2;
                    this.ballFixDef.restitution = .99;
                    this.ballFixDef.density = .5;
                    this.ballFixDef.userData = 'ball';
                    let ballBodyDef = new box2d.b2BodyDef();
                    ballBodyDef.bullet = true;
                    ballBodyDef.linearDamping = 3.5;
                    ballBodyDef.angularDamping = 1.6;
                    ballBodyDef.type = 2 /* b2_dynamicBody */;
                    let playerFixDef = new box2d.b2FixtureDef();
                    playerFixDef.friction = .1;
                    playerFixDef.restitution = .99;
                    playerFixDef.density = .8;
                    playerFixDef.userData = 'player';
                    let playerBodyDef = new box2d.b2BodyDef();
                    playerBodyDef.bullet = true;
                    playerBodyDef.linearDamping = 4;
                    playerBodyDef.angularDamping = 1.6;
                    playerBodyDef.type = 2 /* b2_dynamicBody */;
                    this.m_world.CreateBody(new box2d.b2BodyDef()).CreateFixture((new box2d.b2ChainShape).CreateLoop(walls), this.wallFixDef.density);
                    let goalBodyDef1 = new box2d.b2BodyDef();
                    goalBodyDef1.position.Set(-width * 0.5 - BALL_R, 0);
                    this.m_world.CreateBody(goalBodyDef1).CreateFixture((new box2d.b2ChainShape).CreateLoop(goal), this.goalFixDef.density);
                    let goalBodyDef2 = new box2d.b2BodyDef();
                    goalBodyDef2.position.Set(+width * 0.5 + BALL_R, 0);
                    this.m_world.CreateBody(goalBodyDef2).CreateFixture((new box2d.b2ChainShape).CreateLoop(goal), this.goalFixDef.density);
                    var ball = this.m_world.CreateBody(ballBodyDef);
                    ball.CreateFixture(new box2d.b2CircleShape(BALL_R), this.ballFixDef.density);
                    ball.SetPosition(new box2d.b2Vec2(0, heightShift));
                    balls.forEach((p) => {
                        var player = this.m_world.CreateBody(playerBodyDef);
                        player.SetPosition(p);
                        player.CreateFixture(new box2d.b2CircleShape(PLAYER_R), playerFixDef.density);
                    });
                    balls.map(this.scale(-1, 1)).forEach((p) => {
                        var player = this.m_world.CreateBody(playerBodyDef);
                        player.SetPosition(p);
                        player.SetAngle(Math.PI);
                        player.CreateFixture(new box2d.b2CircleShape(PLAYER_R), playerFixDef.density);
                    });
                }
                scale(x, y) {
                    return function (v) {
                        return new box2d.b2Vec2(v.x * x, v.y * y);
                    };
                }
                static Create() {
                    return new Soccer();
                }
            };
            exports_1("Soccer", Soccer);
            ;
        }
    };
});
