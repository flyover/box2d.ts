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
System.register(["../../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Math_1, b2JointType, b2LimitState, b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    return {
        setters: [
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
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
            (function (b2LimitState) {
                b2LimitState[b2LimitState["e_inactiveLimit"] = 0] = "e_inactiveLimit";
                b2LimitState[b2LimitState["e_atLowerLimit"] = 1] = "e_atLowerLimit";
                b2LimitState[b2LimitState["e_atUpperLimit"] = 2] = "e_atUpperLimit";
                b2LimitState[b2LimitState["e_equalLimits"] = 3] = "e_equalLimits";
            })(b2LimitState || (b2LimitState = {}));
            exports_1("b2LimitState", b2LimitState);
            b2Jacobian = class b2Jacobian {
                constructor() {
                    this.linear = new b2Math_1.b2Vec2();
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
                constructor() {
                    this.other = null; ///< provides quick access to the other body attached.
                    this.joint = null; ///< the joint
                    this.prev = null; ///< the previous joint edge in the body's joint list
                    this.next = null; ///< the next joint edge in the body's joint list
                }
            };
            exports_1("b2JointEdge", b2JointEdge);
            /// Joint definitions are used to construct joints.
            b2JointDef = class b2JointDef {
                constructor(type) {
                    /// The joint type is set automatically for concrete joint types.
                    this.type = 0 /* e_unknownJoint */;
                    /// Use this to attach application specific data to your joints.
                    this.userData = null;
                    /// The first attached body.
                    this.bodyA = null;
                    /// The second attached body.
                    this.bodyB = null;
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
                    ///b2Assert(def.bodyA !== def.bodyB);
                    this.m_type = 0 /* e_unknownJoint */;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_edgeA = new b2JointEdge();
                    this.m_edgeB = new b2JointEdge();
                    this.m_bodyA = null;
                    this.m_bodyB = null;
                    this.m_index = 0;
                    this.m_islandFlag = false;
                    this.m_collideConnected = false;
                    this.m_userData = null;
                    this.m_type = def.type;
                    this.m_bodyA = def.bodyA;
                    this.m_bodyB = def.bodyB;
                    this.m_collideConnected = def.collideConnected;
                    this.m_userData = def.userData;
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
                /// Get the anchor point on bodyA in world coordinates.
                GetAnchorA(out) {
                    return out.SetZero();
                }
                /// Get the anchor point on bodyB in world coordinates.
                GetAnchorB(out) {
                    return out.SetZero();
                }
                /// Get the reaction force on bodyB at the joint anchor in Newtons.
                GetReactionForce(inv_dt, out) {
                    return out.SetZero();
                }
                /// Get the reaction torque on bodyB in N*m.
                GetReactionTorque(inv_dt) {
                    return 0;
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
                IsActive() {
                    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
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
                ShiftOrigin(newOrigin) {
                }
                InitVelocityConstraints(data) {
                }
                SolveVelocityConstraints(data) {
                }
                // This returns true if the position errors are within tolerance.
                SolvePositionConstraints(data) {
                    return false;
                }
            };
            exports_1("b2Joint", b2Joint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIySm9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7OztZQU1GLFdBQWtCLFdBQVc7Z0JBQzNCLGlFQUFrQixDQUFBO2dCQUNsQixtRUFBbUIsQ0FBQTtnQkFDbkIscUVBQW9CLENBQUE7Z0JBQ3BCLG1FQUFtQixDQUFBO2dCQUNuQiwrREFBaUIsQ0FBQTtnQkFDakIsNkRBQWdCLENBQUE7Z0JBQ2hCLDJEQUFlLENBQUE7Z0JBQ2YsNkRBQWdCLENBQUE7Z0JBQ2hCLDJEQUFlLENBQUE7Z0JBQ2YsbUVBQW1CLENBQUE7Z0JBQ25CLDREQUFnQixDQUFBO2dCQUNoQiw4REFBaUIsQ0FBQTtnQkFDakIsNERBQWdCLENBQUE7WUFDbEIsQ0FBQyxFQWRpQixXQUFXLEtBQVgsV0FBVyxRQWM1Qjs7WUFFRCxXQUFrQixZQUFZO2dCQUM1QixxRUFBbUIsQ0FBQTtnQkFDbkIsbUVBQWtCLENBQUE7Z0JBQ2xCLG1FQUFrQixDQUFBO2dCQUNsQixpRUFBaUIsQ0FBQTtZQUNuQixDQUFDLEVBTGlCLFlBQVksS0FBWixZQUFZLFFBSzdCOztZQUVELGFBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzlCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGFBQVEsR0FBVyxDQUFDLENBQUM7Z0JBZTlCLENBQUM7Z0JBYlEsT0FBTztvQkFDWixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFVLEVBQUUsRUFBVTtvQkFDMUMsSUFBSSxDQUFDLE1B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