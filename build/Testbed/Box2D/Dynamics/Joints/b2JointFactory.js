"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const b2AreaJoint_1 = require("./b2AreaJoint");
const b2DistanceJoint_1 = require("./b2DistanceJoint");
const b2FrictionJoint_1 = require("./b2FrictionJoint");
const b2GearJoint_1 = require("./b2GearJoint");
const b2MotorJoint_1 = require("./b2MotorJoint");
const b2MouseJoint_1 = require("./b2MouseJoint");
const b2PrismaticJoint_1 = require("./b2PrismaticJoint");
const b2PulleyJoint_1 = require("./b2PulleyJoint");
const b2RevoluteJoint_1 = require("./b2RevoluteJoint");
const b2RopeJoint_1 = require("./b2RopeJoint");
const b2WeldJoint_1 = require("./b2WeldJoint");
const b2WheelJoint_1 = require("./b2WheelJoint");
class b2JointFactory {
    static Create(def, allocator) {
        let joint = null;
        switch (def.type) {
            case 3 /* e_distanceJoint */:
                joint = new b2DistanceJoint_1.b2DistanceJoint(def);
                break;
            case 5 /* e_mouseJoint */:
                joint = new b2MouseJoint_1.b2MouseJoint(def);
                break;
            case 2 /* e_prismaticJoint */:
                joint = new b2PrismaticJoint_1.b2PrismaticJoint(def);
                break;
            case 1 /* e_revoluteJoint */:
                joint = new b2RevoluteJoint_1.b2RevoluteJoint(def);
                break;
            case 4 /* e_pulleyJoint */:
                joint = new b2PulleyJoint_1.b2PulleyJoint(def);
                break;
            case 6 /* e_gearJoint */:
                joint = new b2GearJoint_1.b2GearJoint(def);
                break;
            case 7 /* e_wheelJoint */:
                joint = new b2WheelJoint_1.b2WheelJoint(def);
                break;
            case 8 /* e_weldJoint */:
                joint = new b2WeldJoint_1.b2WeldJoint(def);
                break;
            case 9 /* e_frictionJoint */:
                joint = new b2FrictionJoint_1.b2FrictionJoint(def);
                break;
            case 10 /* e_ropeJoint */:
                joint = new b2RopeJoint_1.b2RopeJoint(def);
                break;
            case 11 /* e_motorJoint */:
                joint = new b2MotorJoint_1.b2MotorJoint(def);
                break;
            case 12 /* e_areaJoint */:
                joint = new b2AreaJoint_1.b2AreaJoint(def);
                break;
            default:
                ///b2Assert(false);
                break;
        }
        return joint;
    }
    static Destroy(joint, allocator) {
    }
}
exports.b2JointFactory = b2JointFactory;
//# sourceMappingURL=b2JointFactory.js.map