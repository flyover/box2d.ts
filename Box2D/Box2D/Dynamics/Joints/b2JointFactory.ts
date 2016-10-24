import { b2Joint, b2JointDef, b2JointType } from "./b2Joint";
import { b2AreaJoint, b2AreaJointDef } from "./b2AreaJoint";
import { b2DistanceJoint, b2DistanceJointDef } from "./b2DistanceJoint";
import { b2FrictionJoint, b2FrictionJointDef } from "./b2FrictionJoint";
import { b2GearJoint, b2GearJointDef } from "./b2GearJoint";
import { b2MotorJoint, b2MotorJointDef } from "./b2MotorJoint";
import { b2MouseJoint, b2MouseJointDef } from "./b2MouseJoint";
import { b2PrismaticJoint, b2PrismaticJointDef } from "./b2PrismaticJoint";
import { b2PulleyJoint, b2PulleyJointDef } from "./b2PulleyJoint";
import { b2RevoluteJoint, b2RevoluteJointDef } from "./b2RevoluteJoint";
import { b2RopeJoint, b2RopeJointDef } from "./b2RopeJoint";
import { b2WeldJoint, b2WeldJointDef } from "./b2WeldJoint";
import { b2WheelJoint, b2WheelJointDef } from "./b2WheelJoint";

export class b2JointFactory {
  public static Create(def: b2JointDef, allocator: any): b2Joint {
    let joint: b2Joint = null;

    switch (def.type) {
    case b2JointType.e_distanceJoint:
      joint = new b2DistanceJoint(<b2DistanceJointDef> def);
      break;

    case b2JointType.e_mouseJoint:
      joint = new b2MouseJoint(<b2MouseJointDef> def);
      break;

    case b2JointType.e_prismaticJoint:
      joint = new b2PrismaticJoint(<b2PrismaticJointDef> def);
      break;

    case b2JointType.e_revoluteJoint:
      joint = new b2RevoluteJoint(<b2RevoluteJointDef> def);
      break;

    case b2JointType.e_pulleyJoint:
      joint = new b2PulleyJoint(<b2PulleyJointDef> def);
      break;

    case b2JointType.e_gearJoint:
      joint = new b2GearJoint(<b2GearJointDef> def);
      break;

    case b2JointType.e_wheelJoint:
      joint = new b2WheelJoint(<b2WheelJointDef> def);
      break;

    case b2JointType.e_weldJoint:
      joint = new b2WeldJoint(<b2WeldJointDef> def);
      break;

    case b2JointType.e_frictionJoint:
      joint = new b2FrictionJoint(<b2FrictionJointDef> def);
      break;

    case b2JointType.e_ropeJoint:
      joint = new b2RopeJoint(<b2RopeJointDef> def);
      break;

    case b2JointType.e_motorJoint:
      joint = new b2MotorJoint(<b2MotorJointDef> def);
      break;

    case b2JointType.e_areaJoint:
      joint = new b2AreaJoint(<b2AreaJointDef> def);
      break;

    default:
      ///b2Assert(false);
      break;
    }

    return joint;
  }

  public static Destroy(joint: b2Joint, allocator: any): void {
  }
}
