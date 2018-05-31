/*
 * Copyright (c) 2014 Google, Inc.
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
System.register(["../../Box2D/Box2D", "./Soup"], function (exports_1, context_1) {
    "use strict";
    var box2d, Soup_1, SoupStirrer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (Soup_1_1) {
                Soup_1 = Soup_1_1;
            }
        ],
        execute: function () {
            SoupStirrer = class SoupStirrer extends Soup_1.Soup {
                constructor() {
                    super();
                    this.m_oscillationOffset = 0.0;
                    this.m_particleSystem.SetDamping(1.0);
                    // Shape of the stirrer.
                    const shape = new box2d.b2CircleShape();
                    shape.m_p.Set(0, 0.7);
                    shape.m_radius = 0.4;
                    // Create the stirrer.
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    this.m_stirrer = this.m_world.CreateBody(bd);
                    this.m_stirrer.CreateFixture(shape, 1.0);
                    // Destroy all particles under the stirrer.
                    const xf = new box2d.b2Transform();
                    xf.SetIdentity();
                    this.m_particleSystem.DestroyParticlesInShape(shape, xf);
                    // By default attach the body to a joint to restrict movement.
                    this.CreateJoint();
                }
                CreateJoint() {
                    box2d.b2Assert(!this.m_joint);
                    // Create a prismatic joint and connect to the ground, and have it
                    // slide along the x axis.
                    // Disconnect the body from this joint to have more fun.
                    const prismaticJointDef = new box2d.b2PrismaticJointDef();
                    prismaticJointDef.bodyA = this.m_groundBody;
                    prismaticJointDef.bodyB = this.m_stirrer;
                    prismaticJointDef.collideConnected = true;
                    prismaticJointDef.localAxisA.Set(1, 0);
                    prismaticJointDef.localAnchorA.Copy(this.m_stirrer.GetPosition());
                    this.m_joint = this.m_world.CreateJoint(prismaticJointDef);
                }
                /**
                 * Enable the joint if it's disabled, disable it if it's
                 * enabled.
                 */
                ToggleJoint() {
                    if (this.m_joint) {
                        this.m_world.DestroyJoint(this.m_joint);
                        this.m_joint = null;
                    }
                    else {
                        this.CreateJoint();
                    }
                }
                /**
                 * Press "t" to enable / disable the joint restricting the
                 * stirrer's movement.
                 */
                Keyboard(key) {
                    switch (key) {
                        case "t":
                            this.ToggleJoint();
                            break;
                        default:
                            super.Keyboard(key);
                            break;
                    }
                }
                /**
                 * Click the soup to toggle between enabling / disabling the
                 * joint.
                 */
                MouseUp(p) {
                    super.MouseUp(p);
                    if (this.InSoup(p)) {
                        this.ToggleJoint();
                    }
                }
                /**
                 * Determine whether a point is in the soup.
                 */
                InSoup(pos) {
                    // The soup dimensions are from the container initialization in the
                    // Soup test.
                    return pos.y > -1.0 && pos.y < 2.0 && pos.x > -3.0 && pos.x < 3.0;
                }
                /**
                 * Apply a force to the stirrer.
                 */
                Step(settings) {
                    // Magnitude of the force applied to the body.
                    const k_forceMagnitude = 10.0;
                    // How often the force vector rotates.
                    const k_forceOscillationPerSecond = 0.2;
                    const k_forceOscillationPeriod = 1.0 / k_forceOscillationPerSecond;
                    // Maximum speed of the body.
                    const k_maxSpeed = 2.0;
                    this.m_oscillationOffset += (1.0 / settings.hz);
                    if (this.m_oscillationOffset > k_forceOscillationPeriod) {
                        this.m_oscillationOffset -= k_forceOscillationPeriod;
                    }
                    // Calculate the force vector.
                    const forceAngle = this.m_oscillationOffset * k_forceOscillationPerSecond * 2.0 * box2d.b2_pi;
                    const forceVector = new box2d.b2Vec2(Math.sin(forceAngle), Math.cos(forceAngle)).SelfMul(k_forceMagnitude);
                    // Only apply force to the body when it's within the soup.
                    if (this.InSoup(this.m_stirrer.GetPosition()) &&
                        this.m_stirrer.GetLinearVelocity().Length() < k_maxSpeed) {
                        this.m_stirrer.ApplyForceToCenter(forceVector, true);
                    }
                    super.Step(settings);
                }
                static Create() {
                    return new SoupStirrer();
                }
            };
            exports_1("SoupStirrer", SoupStirrer);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cFN0aXJyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTb3VwU3RpcnJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBUUgsY0FBQSxpQkFBeUIsU0FBUSxXQUFJO2dCQUtuQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFIVix3QkFBbUIsR0FBRyxHQUFHLENBQUM7b0JBS3hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXRDLHdCQUF3QjtvQkFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7b0JBRXJCLHNCQUFzQjtvQkFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7b0JBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFekMsMkNBQTJDO29CQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbkMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUV6RCw4REFBOEQ7b0JBQzlELElBQUksQ0FBQyxX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