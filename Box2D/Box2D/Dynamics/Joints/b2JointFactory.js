System.register(["./b2AreaJoint", "./b2DistanceJoint", "./b2FrictionJoint", "./b2GearJoint", "./b2MotorJoint", "./b2MouseJoint", "./b2PrismaticJoint", "./b2PulleyJoint", "./b2RevoluteJoint", "./b2RopeJoint", "./b2WeldJoint", "./b2WheelJoint"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var b2AreaJoint_1, b2DistanceJoint_1, b2FrictionJoint_1, b2GearJoint_1, b2MotorJoint_1, b2MouseJoint_1, b2PrismaticJoint_1, b2PulleyJoint_1, b2RevoluteJoint_1, b2RopeJoint_1, b2WeldJoint_1, b2WheelJoint_1, b2JointFactory;
    return {
        setters: [
            function (b2AreaJoint_1_1) {
                b2AreaJoint_1 = b2AreaJoint_1_1;
            },
            function (b2DistanceJoint_1_1) {
                b2DistanceJoint_1 = b2DistanceJoint_1_1;
            },
            function (b2FrictionJoint_1_1) {
                b2FrictionJoint_1 = b2FrictionJoint_1_1;
            },
            function (b2GearJoint_1_1) {
                b2GearJoint_1 = b2GearJoint_1_1;
            },
            function (b2MotorJoint_1_1) {
                b2MotorJoint_1 = b2MotorJoint_1_1;
            },
            function (b2MouseJoint_1_1) {
                b2MouseJoint_1 = b2MouseJoint_1_1;
            },
            function (b2PrismaticJoint_1_1) {
                b2PrismaticJoint_1 = b2PrismaticJoint_1_1;
            },
            function (b2PulleyJoint_1_1) {
                b2PulleyJoint_1 = b2PulleyJoint_1_1;
            },
            function (b2RevoluteJoint_1_1) {
                b2RevoluteJoint_1 = b2RevoluteJoint_1_1;
            },
            function (b2RopeJoint_1_1) {
                b2RopeJoint_1 = b2RopeJoint_1_1;
            },
            function (b2WeldJoint_1_1) {
                b2WeldJoint_1 = b2WeldJoint_1_1;
            },
            function (b2WheelJoint_1_1) {
                b2WheelJoint_1 = b2WheelJoint_1_1;
            }
        ],
        execute: function () {
            b2JointFactory = class b2JointFactory {
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
            };
            exports_1("b2JointFactory", b2JointFactory);
        }
    };
});
