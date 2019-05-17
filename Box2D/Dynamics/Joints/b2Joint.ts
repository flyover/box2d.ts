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

// DEBUG: import { b2Assert } from "../../Common/b2Settings";
import { b2Maybe } from "../../Common/b2Settings";
import { b2Vec2, XY } from "../../Common/b2Math";
import { b2Body } from "../b2Body";
import { b2SolverData } from "../b2TimeStep";

export enum b2JointType {
  e_unknownJoint = 0,
  e_revoluteJoint = 1,
  e_prismaticJoint = 2,
  e_distanceJoint = 3,
  e_pulleyJoint = 4,
  e_mouseJoint = 5,
  e_gearJoint = 6,
  e_wheelJoint = 7,
  e_weldJoint = 8,
  e_frictionJoint = 9,
  e_ropeJoint = 10,
  e_motorJoint = 11,
  e_areaJoint = 12,
}

export enum b2LimitState {
  e_inactiveLimit = 0,
  e_atLowerLimit = 1,
  e_atUpperLimit = 2,
  e_equalLimits = 3,
}

export class b2Jacobian {
  public readonly linear: b2Vec2 = new b2Vec2();
  public angularA: number = 0;
  public angularB: number = 0;

  public SetZero(): b2Jacobian {
    this.linear.SetZero();
    this.angularA = 0;
    this.angularB = 0;
    return this;
  }

  public Set(x: XY, a1: number, a2: number): b2Jacobian {
    this.linear.Copy(x);
    this.angularA = a1;
    this.angularB = a2;
    return this;
  }
}

/// A joint edge is used to connect bodies and joints together
/// in a joint graph where each body is a node and each joint
/// is an edge. A joint edge belongs to a doubly linked list
/// maintained in each attached body. Each joint has two joint
/// nodes, one for each attached body.
export class b2JointEdge {
  private _other: b2Body | null = null; ///< provides quick access to the other body attached.
  public get other(): b2Body {
    if (this._other === null) { throw new Error(); }
    return this._other;
  }
  public set other(value: b2Body) {
    if (this._other !== null) { throw new Error(); }
    this._other = value;
  }
  public readonly joint: b2Joint;    ///< the joint
  public prev: b2JointEdge | null = null;  ///< the previous joint edge in the body's joint list
  public next: b2JointEdge | null = null;  ///< the next joint edge in the body's joint list
  constructor(joint: b2Joint) {
    this.joint = joint;
  }
  public Reset(): void {
    this._other = null;
    this.prev = null;
    this.next = null;
  }
}

/// Joint definitions are used to construct joints.
export interface b2IJointDef {
  /// The joint type is set automatically for concrete joint types.
  type: b2JointType;

  /// Use this to attach application specific data to your joints.
  userData?: any;

  /// The first attached body.
  bodyA: b2Body;

  /// The second attached body.
  bodyB: b2Body;

  /// Set this flag to true if the attached bodies should collide.
  collideConnected?: boolean;
}

/// Joint definitions are used to construct joints.
export abstract class b2JointDef implements b2IJointDef {
  /// The joint type is set automatically for concrete joint types.
  public readonly type: b2JointType = b2JointType.e_unknownJoint;

  /// Use this to attach application specific data to your joints.
  public userData: any = null;

  /// The first attached body.
  public bodyA!: b2Body;

  /// The second attached body.
  public bodyB!: b2Body;

  /// Set this flag to true if the attached bodies should collide.
  public collideConnected: boolean = false;

  constructor(type: b2JointType) {
    this.type = type;
  }
}

/// The base joint class. Joints are used to constraint two bodies together in
/// various fashions. Some joints also feature limits and motors.
export abstract class b2Joint {
  public readonly m_type: b2JointType = b2JointType.e_unknownJoint;
  public m_prev: b2Joint | null = null;
  public m_next: b2Joint | null = null;
  public readonly m_edgeA: b2JointEdge = new b2JointEdge(this);
  public readonly m_edgeB: b2JointEdge = new b2JointEdge(this);
  public m_bodyA: b2Body;
  public m_bodyB: b2Body;

  public m_index: number = 0;

  public m_islandFlag: boolean = false;
  public m_collideConnected: boolean = false;

  public m_userData: any = null;

  constructor(def: b2IJointDef) {
    // DEBUG: b2Assert(def.bodyA !== def.bodyB);

    this.m_type = def.type;
    this.m_edgeA.other = def.bodyB;
    this.m_edgeB.other = def.bodyA;
    this.m_bodyA = def.bodyA;
    this.m_bodyB = def.bodyB;

    this.m_collideConnected = b2Maybe(def.collideConnected, false);

    this.m_userData = b2Maybe(def.userData, null);
  }

  /// Get the type of the concrete joint.
  public GetType(): b2JointType {
    return this.m_type;
  }

  /// Get the first body attached to this joint.
  public GetBodyA(): b2Body {
    return this.m_bodyA;
  }

  /// Get the second body attached to this joint.
  public GetBodyB(): b2Body {
    return this.m_bodyB;
  }

  /// Get the anchor point on bodyA in world coordinates.
  public abstract GetAnchorA<T extends XY>(out: T): T;

  /// Get the anchor point on bodyB in world coordinates.
  public abstract GetAnchorB<T extends XY>(out: T): T;

  /// Get the reaction force on bodyB at the joint anchor in Newtons.
  public abstract GetReactionForce<T extends XY>(inv_dt: number, out: T): T;

  /// Get the reaction torque on bodyB in N*m.
  public abstract GetReactionTorque(inv_dt: number): number;

  /// Get the next joint the world joint list.
  public GetNext(): b2Joint | null {
    return this.m_next;
  }

  /// Get the user data pointer.
  public GetUserData(): any {
    return this.m_userData;
  }

  /// Set the user data pointer.
  public SetUserData(data: any): void {
    this.m_userData = data;
  }

  /// Short-cut function to determine if either body is inactive.
  public IsActive(): boolean {
    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
  }

  /// Get collide connected.
  /// Note: modifying the collide connect flag won't work correctly because
  /// the flag is only checked when fixture AABBs begin to overlap.
  public GetCollideConnected(): boolean {
    return this.m_collideConnected;
  }

  /// Dump this joint to the log file.
  public Dump(log: (format: string, ...args: any[]) => void): void {
    log("// Dump is not supported for this joint type.\n");
  }

  /// Shift the origin for any points stored in world coordinates.
  public ShiftOrigin(newOrigin: XY): void {
  }

  public abstract InitVelocityConstraints(data: b2SolverData): void;

  public abstract SolveVelocityConstraints(data: b2SolverData): void;

  // This returns true if the position errors are within tolerance.
  public abstract SolvePositionConstraints(data: b2SolverData): boolean;
}
