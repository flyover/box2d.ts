import { b2Joint, b2IJointDef, b2JointType } from "./b2Joint";
import { b2AreaJoint, b2IAreaJointDef } from "./b2AreaJoint";
import { b2DistanceJoint, b2IDistanceJointDef } from "./b2DistanceJoint";
import { b2FrictionJoint, b2IFrictionJointDef } from "./b2FrictionJoint";
import { b2GearJoint, b2IGearJointDef } from "./b2GearJoint";
import { b2MotorJoint, b2IMotorJointDef } from "./b2MotorJoint";
import { b2MouseJoint, b2IMouseJointDef } from "./b2MouseJoint";
import { b2PrismaticJoint, b2IPrismaticJointDef } from "./b2PrismaticJoint";
import { b2PulleyJoint, b2IPulleyJointDef } from "./b2PulleyJoint";
import { b2RevoluteJoint, b2IRevoluteJointDef } from "./b2RevoluteJoint";
import { b2RopeJoint, b2IRopeJointDef } from "./b2RopeJoint";
import { b2WeldJoint, b2IWeldJointDef } from "./b2WeldJoint";
import { b2WheelJoint, b2IWheelJointDef } from "./b2WheelJoint";

export class b2JointFactory {
  public static Create(def: b2IJointDef, allocator: any): b2Joint {
    switch (def.type) {
    case b2JointType.e_distanceJoint: return new b2DistanceJoint(def as b2IDistanceJointDef);
    case b2JointType.e_mouseJoint: return new b2MouseJoint(def as b2IMouseJointDef);
    case b2JointType.e_prismaticJoint: return new b2PrismaticJoint(def as b2IPrismaticJointDef);
    case b2JointType.e_revoluteJoint: return new b2RevoluteJoint(def as b2IRevoluteJointDef);
    case b2JointType.e_pulleyJoint: return new b2PulleyJoint(def as b2IPulleyJointDef);
    case b2JointType.e_gearJoint: return new b2GearJoint(def as b2IGearJointDef);
    case b2JointType.e_wheelJoint: return new b2WheelJoint(def as b2IWheelJointDef);
    case b2JointType.e_weldJoint: return new b2WeldJoint(def as b2IWeldJointDef);
    case b2JointType.e_frictionJoint: return new b2FrictionJoint(def as b2IFrictionJointDef);
    case b2JointType.e_ropeJoint: return new b2RopeJoint(def as b2IRopeJointDef);
    case b2JointType.e_motorJoint: return new b2MotorJoint(def as b2IMotorJointDef);
    case b2JointType.e_areaJoint: return new b2AreaJoint(def as b2IAreaJointDef);
    }
      throw new Error();
    }

  public static Destroy(joint: b2Joint, allocator: any): void {
  }
}
