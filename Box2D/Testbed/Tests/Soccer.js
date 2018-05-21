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
    "use strict";
    var box2d, testbed, Soccer;
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
            Soccer = class Soccer extends testbed.Test {
                constructor() {
                    super();
                    this.heightShift = 15;
                    this.m_world.SetGravity(new box2d.b2Vec2());
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
                    ballBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    let playerFixDef = new box2d.b2FixtureDef();
                    playerFixDef.friction = .1;
                    playerFixDef.restitution = .99;
                    playerFixDef.density = .8;
                    playerFixDef.userData = 'player';
                    let playerBodyDef = new box2d.b2BodyDef();
                    playerBodyDef.bullet = true;
                    playerBodyDef.linearDamping = 4;
                    playerBodyDef.angularDamping = 1.6;
                    playerBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29jY2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU29jY2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixTQUFBLFlBQW9CLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBT3RDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUhGLGdCQUFXLEdBQUcsRUFBRSxDQUFDO29CQUt2QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO29CQUU1Qyw0REFBNEQ7b0JBQzVELGtEQUFrRDtvQkFDbEQsa0NBQWtDO29CQUVsQyxJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDbEUsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO29CQUNuQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBRWxCLElBQUksS0FBSyxHQUFHO3dCQUNWLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxXQUFXLENBQUM7d0JBQzlELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFFLEdBQUcsR0FBRyxXQUFXLENBQUM7d0JBQzlELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDekQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDO3dCQUN6RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxXQUFXLENBQUM7d0JBQ3pELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDekQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUUsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDN0QsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDN0QsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDN0QsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUUsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDN0QsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDO3dCQUN6RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxXQUFXLENBQUM7d0JBQ3pELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQzt3QkFDekQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDO3dCQUN6RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRSxFQUFFLEdBQUcsV0FBVyxDQUFDO3dCQUM3RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDO3FCQUM5RCxDQUFDO29CQUVGLElBQUksS0FBSyxHQUFHO3dCQUNWLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQzt3QkFDL0MsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO3dCQUMxRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUM7d0JBQzFELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQzt3QkFDMUQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO3FCQUMzRCxDQUFDO29CQUdGLElBQUksSUFBSSxHQUFHO3dCQUNULElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQzt3QkFDaEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FB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