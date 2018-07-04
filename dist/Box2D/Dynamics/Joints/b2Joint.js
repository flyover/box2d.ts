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
System.register(["../../Common/b2Settings", "../../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2JointType, b2LimitState, b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
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
                constructor(joint, other) {
                    this.prev = null; ///< the previous joint edge in the body's joint list
                    this.next = null; ///< the next joint edge in the body's joint list
                    this.joint = joint;
                    this.other = other;
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
                    this.m_index = 0;
                    this.m_islandFlag = false;
                    this.m_collideConnected = false;
                    this.m_userData = null;
                    this.m_type = def.type;
                    this.m_edgeA = new b2JointEdge(this, def.bodyB);
                    this.m_edgeB = new b2JointEdge(this, def.bodyA);
                    this.m_bodyA = def.bodyA;
                    this.m_bodyB = def.bodyB;
                    this.m_collideConnected = b2Settings_1.b2Maybe(def.collideConnected, false);
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
            };
            exports_1("b2Joint", b2Joint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0R5bmFtaWNzL0pvaW50cy9iMkpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFRRixXQUFZLFdBQVc7Z0JBQ3JCLGlFQUFrQixDQUFBO2dCQUNsQixtRUFBbUIsQ0FBQTtnQkFDbkIscUVBQW9CLENBQUE7Z0JBQ3BCLG1FQUFtQixDQUFBO2dCQUNuQiwrREFBaUIsQ0FBQTtnQkFDakIsNkRBQWdCLENBQUE7Z0JBQ2hCLDJEQUFlLENBQUE7Z0JBQ2YsNkRBQWdCLENBQUE7Z0JBQ2hCLDJEQUFlLENBQUE7Z0JBQ2YsbUVBQW1CLENBQUE7Z0JBQ25CLDREQUFnQixDQUFBO2dCQUNoQiw4REFBaUIsQ0FBQTtnQkFDakIsNERBQWdCLENBQUE7WUFDbEIsQ0FBQyxFQWRXLFdBQVcsS0FBWCxXQUFXLFFBY3RCOztZQUVELFdBQVksWUFBWTtnQkFDdEIscUVBQW1CLENBQUE7Z0JBQ25CLG1FQUFrQixDQUFBO2dCQUNsQixtRUFBa0IsQ0FBQTtnQkFDbEIsaUVBQWlCLENBQUE7WUFDbkIsQ0FBQyxFQUxXLFlBQVksS0FBWixZQUFZLFFBS3ZCOztZQUVELGFBQUE7Z0JBQUE7b0JBQ2tCLFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUN2QyxhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO2dCQWU5QixDQUFDO2dCQWJRLE9BQU87b0JBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLEdBQUcsQ0FBQyxDQUFLLEVBQUUs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