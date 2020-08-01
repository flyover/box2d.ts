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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMl9qb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7SUFrSEYsK0VBQStFO0lBQy9FLDJEQUEyRDtJQUMzRCw2Q0FBNkM7SUFDN0MsOENBQThDO0lBQzlDLFNBQWdCLGlCQUFpQixDQUFDLEdBQTJDLEVBQUUsY0FBc0IsRUFBRSxZQUFvQixFQUFFLEtBQWEsRUFBRSxLQUFhO1FBQ3ZKLE1BQU0sS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QyxNQUFNLEtBQUssR0FBVyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsSUFBSSxJQUFZLENBQUM7UUFDakIsSUFBSSxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7WUFDOUIsSUFBSSxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDeEM7YUFBTSxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLEtBQUssR0FBVyxHQUFHLEdBQUcsc0JBQUssR0FBRyxjQUFjLENBQUM7UUFDbkQsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQyxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUNsRCxDQUFDOztJQUVELDhFQUE4RTtJQUM5RSw0REFBNEQ7SUFDNUQsNkNBQTZDO0lBQzdDLDhDQUE4QztJQUM5QyxTQUFnQixrQkFBa0IsQ0FBQyxHQUEyQyxFQUFFLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxLQUFhLEVBQUUsS0FBYTtRQUN4SixN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