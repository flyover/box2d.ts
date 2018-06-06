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
    let joint: b2Joint;

    switch (def.type) {
    case b2JointType.e_distanceJoint:
      joint = new b2DistanceJoint(def as b2IDistanceJointDef);
      break;

    case b2JointType.e_mouseJoint:
      joint = new b2MouseJoint(def as b2IMouseJointDef);
      break;

    case b2JointType.e_prismaticJoint:
      joint = new b2PrismaticJoint(def as b2IPrismaticJointDef);
      break;

    case b2JointType.e_revoluteJoint:
      joint = new b2RevoluteJoint(def as b2IRevoluteJointDef);
      break;

    case b2JointType.e_pulleyJoint:
      joint = new b2PulleyJoint(def as b2IPulleyJointDef);
      break;

    case b2JointType.e_gearJoint:
      joint = new b2GearJoint(def as b2IGearJointDef);
      break;

    case b2JointType.e_wheelJoint:
      joint = new b2WheelJoint(def as b2IWheelJointDef);
      break;

    case b2JointType.e_weldJoint:
      joint = new b2WeldJoint(def as b2IWeldJointDef);
      break;

    case b2JointType.e_frictionJoint:
      joint = new b2FrictionJoint(def as b2IFrictionJointDef);
      break;

    case b2JointType.e_ropeJoint:
      joint = new b2RopeJoint(def as b2IRopeJointDef);
      break;

    case b2JointType.e_motorJoint:
      joint = new b2MotorJoint(def as b2IMotorJointDef);
      break;

    case b2JointType.e_areaJoint:
      joint = new b2AreaJoint(def as b2IAreaJointDef);
      break;

    default:
      throw new Error();
    }

    return joint;
  }

  public static Destroy(joint: b2Joint, allocator: any): void {
  }
}
