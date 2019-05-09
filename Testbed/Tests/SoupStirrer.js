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
System.register(["Box2D", "./Soup"], function (exports_1, context_1) {
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
                    this.m_joint = null;
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
                    // DEBUG: box2d.b2Assert(!this.m_joint);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cFN0aXJyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTb3VwU3RpcnJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBUUgsY0FBQSxNQUFhLFdBQVksU0FBUSxXQUFJO2dCQUtuQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKSCxZQUFPLEdBQXlCLElBQUksQ0FBQztvQkFDckMsd0JBQW1CLEdBQUcsR0FBRyxDQUFDO29CQUsvQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUV0Qyx3QkFBd0I7b0JBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUN4QyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO29CQUVyQixzQkFBc0I7b0JBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO29CQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRXpDLDJDQUEyQztvQkFDM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25DLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztv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