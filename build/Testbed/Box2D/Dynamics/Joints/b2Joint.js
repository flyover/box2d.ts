"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const b2Math_1 = require("../../Common/b2Math");
class b2Jacobian {
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
}
exports.b2Jacobian = b2Jacobian;
/// A joint edge is used to connect bodies and joints together
/// in a joint graph where each body is a node and each joint
/// is an edge. A joint edge belongs to a doubly linked list
/// maintained in each attached body. Each joint has two joint
/// nodes, one for each attached body.
class b2JointEdge {
    constructor() {
        this.other = null; ///< provides quick access to the other body attached.
        this.joint = null; ///< the joint
        this.prev = null; ///< the previous joint edge in the body's joint list
        this.next = null; ///< the next joint edge in the body's joint list
    }
}
exports.b2JointEdge = b2JointEdge;
/// Joint definitions are used to construct joints.
class b2JointDef {
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
}
exports.b2JointDef = b2JointDef;
/// The base joint class. Joints are used to constraint two bodies together in
/// various fashions. Some joints also feature limits and motors.
class b2Joint {
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
}
exports.b2Joint = b2Joint;
//# sourceMappingURL=b2Joint.js.map