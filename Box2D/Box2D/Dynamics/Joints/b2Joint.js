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
    var b2Math_1, b2JointType, b2LimitState, b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    var __moduleName = context_1 && context_1.id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIySm9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7OztZQU1GLFdBQVksV0FBVztnQkFDckIsaUVBQWtCLENBQUE7Z0JBQ2xCLG1FQUFtQixDQUFBO2dCQUNuQixxRUFBb0IsQ0FBQTtnQkFDcEIsbUVBQW1CLENBQUE7Z0JBQ25CLCtEQUFpQixDQUFBO2dCQUNqQiw2REFBZ0IsQ0FBQTtnQkFDaEIsMkRBQWUsQ0FBQTtnQkFDZiw2REFBZ0IsQ0FBQTtnQkFDaEIsMkRBQWUsQ0FBQTtnQkFDZixtRUFBbUIsQ0FBQTtnQkFDbkIsNERBQWdCLENBQUE7Z0JBQ2hCLDhEQUFpQixDQUFBO2dCQUNqQiw0REFBZ0IsQ0FBQTtZQUNsQixDQUFDLEVBZFcsV0FBVyxLQUFYLFdBQVcsUUFjdEI7O1lBRUQsV0FBWSxZQUFZO2dCQUN0QixxRUFBbUIsQ0FBQTtnQkFDbkIsbUVBQWtCLENBQUE7Z0JBQ2xCLG1FQUFrQixDQUFBO2dCQUNsQixpRUFBaUIsQ0FBQTtZQUNuQixDQUFDLEVBTFcsWUFBWSxLQUFaLFlBQVksUUFLdkI7O1lBRUQsYUFBQTtnQkFBQTtvQkFDUyxXQUFNLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDOUIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztnQkFlOUIsQ0FBQztnQkFiUSxPQUFPO29CQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQVUsRUFBRSxFQUFVO29CQUMxQyxJQUFJLENBQUMsTUFBTSxD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