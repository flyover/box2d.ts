/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "../common/b2_draw.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_draw_js_1, b2JointType, b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    var __moduleName = context_1 && context_1.id;
    /// Utility to compute linear stiffness values from frequency and damping ratio
    // void b2LinearStiffness(float& stiffness, float& damping,
    // 	float frequencyHertz, float dampingRatio,
    // 	const b2Body* bodyA, const b2Body* bodyB);
    function b2LinearStiffness(def, frequencyHertz, dampingRatio, bodyA, bodyB) {
        const massA = bodyA.GetMass();
        const massB = bodyB.GetMass();
        let mass;
        if (massA > 0.0 && massB > 0.0) {
            mass = massA * massB / (massA + massB);
        }
        else if (massA > 0.0) {
            mass = massA;
        }
        else {
            mass = massB;
        }
        const omega = 2.0 * b2_settings_js_1.b2_pi * frequencyHertz;
        def.stiffness = mass * omega * omega;
        def.damping = 2.0 * mass * dampingRatio * omega;
    }
    exports_1("b2LinearStiffness", b2LinearStiffness);
    /// Utility to compute rotational stiffness values frequency and damping ratio
    // void b2AngularStiffness(float& stiffness, float& damping,
    // 	float frequencyHertz, float dampingRatio,
    // 	const b2Body* bodyA, const b2Body* bodyB);
    function b2AngularStiffness(def, frequencyHertz, dampingRatio, bodyA, bodyB) {
        const IA = bodyA.GetInertia();
        const IB = bodyB.GetInertia();
        let I;
        if (IA > 0.0 && IB > 0.0) {
            I = IA * IB / (IA + IB);
        }
        else if (IA > 0.0) {
            I = IA;
        }
        else {
            I = IB;
        }
        const omega = 2.0 * b2_settings_js_1.b2_pi * frequencyHertz;
        def.stiffness = I * omega * omega;
        def.damping = 2.0 * I * dampingRatio * omega;
    }
    exports_1("b2AngularStiffness", b2AngularStiffness);
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_draw_js_1_1) {
                b2_draw_js_1 = b2_draw_js_1_1;
            }
        ],
        execute: function () {
            (function (b2JointType) {
                b2JointType[b2JointType["e_unknownJoint"] = 0] = "e_unknownJoint";
                b2JointType[b2JointType["e_revoluteJoint"] = 1] = "e_revoluteJoint";
                b2JointType[b2JointType["e_prismaticJoint"] = 2] = "e_prismaticJoint";
                b2JointType[b2JointType["e_distanceJoint"] = 3] = "e_distanceJoint";
                b2JointType[b2JointType["e_pulleyJoint"] = 4] = "e_pulleyJoint";
                b2JointType[b2JointType["e_mouseJoint"] = 5] = "e_mouseJoint";
                b2JointType[b2JointType["e_gearJoint"] = 6] = "e_gearJoint";
                b2JointType[b2JointType["e_wheelJoint"] = 7] = "e_wheelJoint";
                b2JointType[b2JointType["e_weldJoint"] = 8] = "e_weldJoint";
                b2JointType[b2JointType["e_frictionJoint"] = 9] = "e_frictionJoint";
                b2JointType[b2JointType["e_ropeJoint"] = 10] = "e_ropeJoint";
                b2JointType[b2JointType["e_motorJoint"] = 11] = "e_motorJoint";
                b2JointType[b2JointType["e_areaJoint"] = 12] = "e_areaJoint";
            })(b2JointType || (b2JointType = {}));
            exports_1("b2JointType", b2JointType);
            b2Jacobian = class b2Jacobian {
                constructor() {
                    this.linear = new b2_math_js_1.b2Vec2();
                    this.angularA = 0;
                    this.angularB = 0;
                }
                SetZero() {
                    this.linear.SetZero();
                    this.angularA = 0;
                    this.angularB = 0;
                    return this;
                }
                Set(x, a1, a2) {
                    this.linear.Copy(x);
                    this.angularA = a1;
                    this.angularB = a2;
                    return this;
                }
            };
            exports_1("b2Jacobian", b2Jacobian);
            /// A joint edge is used to connect bodies and joints together
            /// in a joint graph where each body is a node and each joint
            /// is an edge. A joint edge belongs to a doubly linked list
            /// maintained in each attached body. Each joint has two joint
            /// nodes, one for each attached body.
            b2JointEdge = class b2JointEdge {
                constructor(joint) {
                    this._other = null; ///< provides quick access to the other body attached.
                    this.prev = null; ///< the previous joint edge in the body's joint list
                    this.next = null; ///< the next joint edge in the body's joint list
                    this.joint = joint;
                }
                get other() {
                    if (this._other === null) {
                        throw new Error();
                    }
                    return this._other;
                }
                set other(value) {
                    if (this._other !== null) {
                        throw new Error();
                    }
                    this._other = value;
                }
                Reset() {
                    this._other = null;
                    this.prev = null;
                    this.next = null;
                }
            };
            exports_1("b2JointEdge", b2JointEdge);
            /// Joint definitions are used to construct joints.
            b2JointDef = class b2JointDef {
                constructor(type) {
                    /// The joint type is set automatically for concrete joint types.
                    this.type = b2JointType.e_unknownJoint;
                    /// Use this to attach application specific data to your joints.
                    this.userData = null;
                    /// Set this flag to true if the attached bodies should collide.
                    this.collideConnected = false;
                    this.type = type;
                }
            };
            exports_1("b2JointDef", b2JointDef);
            /// The base joint class. Joints are used to constraint two bodies together in
            /// various fashions. Some joints also feature limits and motors.
            b2Joint = class b2Joint {
                constructor(def) {
                    // DEBUG: b2Assert(def.bodyA !== def.bodyB);
                    this.m_type = b2JointType.e_unknownJoint;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_edgeA = new b2JointEdge(this);
                    this.m_edgeB = new b2JointEdge(this);
                    this.m_index = 0;
                    this.m_islandFlag = false;
                    this.m_collideConnected = false;
                    this.m_userData = null;
                    this.m_type = def.type;
                    this.m_edgeA.other = def.bodyB;
                    this.m_edgeB.other = def.bodyA;
                    this.m_bodyA = def.bodyA;
                    this.m_bodyB = def.bodyB;
                    this.m_collideConnected = b2_settings_js_1.b2Maybe(def.collideConnected, false);
                    this.m_userData = b2_settings_js_1.b2Maybe(def.userData, null);
                }
                /// Get the type of the concrete joint.
                GetType() {
                    return this.m_type;
                }
                /// Get the first body attached to this joint.
                GetBodyA() {
                    return this.m_bodyA;
                }
                /// Get the second body attached to this joint.
                GetBodyB() {
                    return this.m_bodyB;
                }
                /// Get the next joint the world joint list.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data pointer.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data pointer.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Short-cut function to determine if either body is inactive.
                IsEnabled() {
                    return this.m_bodyA.IsEnabled() && this.m_bodyB.IsEnabled();
                }
                /// Get collide connected.
                /// Note: modifying the collide connect flag won't work correctly because
                /// the flag is only checked when fixture AABBs begin to overlap.
                GetCollideConnected() {
                    return this.m_collideConnected;
                }
                /// Dump this joint to the log file.
                Dump(log) {
                    log("// Dump is not supported for this joint type.\n");
                }
                /// Shift the origin for any points stored in world coordinates.
                ShiftOrigin(newOrigin) { }
                Draw(draw) {
                    const xf1 = this.m_bodyA.GetTransform();
                    const xf2 = this.m_bodyB.GetTransform();
                    const x1 = xf1.p;
                    const x2 = xf2.p;
                    const p1 = this.GetAnchorA(b2Joint.Draw_s_p1);
                    const p2 = this.GetAnchorB(b2Joint.Draw_s_p2);
                    const color = b2Joint.Draw_s_color.SetRGB(0.5, 0.8, 0.8);
                    switch (this.m_type) {
                        case b2JointType.e_distanceJoint:
                            draw.DrawSegment(p1, p2, color);
                            break;
                        case b2JointType.e_pulleyJoint:
                            {
                                const pulley = this;
                                const s1 = pulley.GetGroundAnchorA();
                                const s2 = pulley.GetGroundAnchorB();
                                draw.DrawSegment(s1, p1, color);
                                draw.DrawSegment(s2, p2, color);
                                draw.DrawSegment(s1, s2, color);
                            }
                            break;
                        case b2JointType.e_mouseJoint:
                            {
                                const c = b2Joint.Draw_s_c;
                                c.Set(0.0, 1.0, 0.0);
                                draw.DrawPoint(p1, 4.0, c);
                                draw.DrawPoint(p2, 4.0, c);
                                c.Set(0.8, 0.8, 0.8);
                                draw.DrawSegment(p1, p2, c);
                            }
                            break;
                        default:
                            draw.DrawSegment(x1, p1, color);
                            draw.DrawSegment(p1, p2, color);
                            draw.DrawSegment(x2, p2, color);
                    }
                }
            };
            exports_1("b2Joint", b2Joint);
            /// Debug draw this joint
            b2Joint.Draw_s_p1 = new b2_math_js_1.b2Vec2();
            b2Joint.Draw_s_p2 = new b2_math_js_1.b2Vec2();
            b2Joint.Draw_s_color = new b2_draw_js_1.b2Color(0.5, 0.8, 0.8);
            b2Joint.Draw_s_c = new b2_draw_js_1.b2Color();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBa0hGLCtFQUErRTtJQUMvRSwyREFBMkQ7SUFDM0QsNkNBQTZDO0lBQzdDLDhDQUE4QztJQUM5QyxTQUFnQixpQkFBaUIsQ0FBQyxHQUEyQyxFQUFFLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxLQUFhLEVBQUUsS0FBYTtRQUN2SixNQUFNLEtBQUssR0FBVyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsTUFBTSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1lBQzlCLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO2FBQU0sSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLElBQUksR0FBRyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxLQUFLLEdBQVcsR0FBRyxHQUFHLHNCQUFLLEdBQUcsY0FBYyxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDbEQsQ0FBQzs7SUFFRCw4RUFBOEU7SUFDOUUsNERBQTREO0lBQzVELDZDQUE2QztJQUM3Qyw4Q0FBOEM7SUFDOUMsU0FBZ0Isa0JBQWtCLENBQUMsR0FBMkMsRUFBRSxjQUFzQixFQUFFLFlBQW9CLEVBQUUsS0FB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