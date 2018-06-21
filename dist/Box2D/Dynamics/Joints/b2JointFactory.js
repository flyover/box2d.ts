System.register(["./b2Joint", "./b2AreaJoint", "./b2DistanceJoint", "./b2FrictionJoint", "./b2GearJoint", "./b2MotorJoint", "./b2MouseJoint", "./b2PrismaticJoint", "./b2PulleyJoint", "./b2RevoluteJoint", "./b2RopeJoint", "./b2WeldJoint", "./b2WheelJoint"], function (exports_1, context_1) {
    "use strict";
    var b2Joint_1, b2AreaJoint_1, b2DistanceJoint_1, b2FrictionJoint_1, b2GearJoint_1, b2MotorJoint_1, b2MouseJoint_1, b2PrismaticJoint_1, b2PulleyJoint_1, b2RevoluteJoint_1, b2RopeJoint_1, b2WeldJoint_1, b2WheelJoint_1, b2JointFactory;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Joint_1_1) {
                b2Joint_1 = b2Joint_1_1;
            },
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
                    switch (def.type) {
                        case b2Joint_1.b2JointType.e_distanceJoint: return new b2DistanceJoint_1.b2DistanceJoint(def);
                        case b2Joint_1.b2JointType.e_mouseJoint: return new b2MouseJoint_1.b2MouseJoint(def);
                        case b2Joint_1.b2JointType.e_prismaticJoint: return new b2PrismaticJoint_1.b2PrismaticJoint(def);
                        case b2Joint_1.b2JointType.e_revoluteJoint: return new b2RevoluteJoint_1.b2RevoluteJoint(def);
                        case b2Joint_1.b2JointType.e_pulleyJoint: return new b2PulleyJoint_1.b2PulleyJoint(def);
                        case b2Joint_1.b2JointType.e_gearJoint: return new b2GearJoint_1.b2GearJoint(def);
                        case b2Joint_1.b2JointType.e_wheelJoint: return new b2WheelJoint_1.b2WheelJoint(def);
                        case b2Joint_1.b2JointType.e_weldJoint: return new b2WeldJoint_1.b2WeldJoint(def);
                        case b2Joint_1.b2JointType.e_frictionJoint: return new b2FrictionJoint_1.b2FrictionJoint(def);
                        case b2Joint_1.b2JointType.e_ropeJoint: return new b2RopeJoint_1.b2RopeJoint(def);
                        case b2Joint_1.b2JointType.e_motorJoint: return new b2MotorJoint_1.b2MotorJoint(def);
                        case b2Joint_1.b2JointType.e_areaJoint: return new b2AreaJoint_1.b2AreaJoint(def);
                    }
                    throw new Error();
                }
                static Destroy(joint, allocator) {
                }
            };
            exports_1("b2JointFactory", b2JointFactory);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludEZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9EeW5hbWljcy9Kb2ludHMvYjJKb2ludEZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFjQSxpQkFBQTtnQkFDUyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWdCLEVBQUUsU0FBYztvQkFDbkQsUUFBUSxHQUFHLENBQUMsSUFBSSxFQUFFO3dCQUNsQixLQUFLLHFCQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxJQUFJLGlDQUFlLENBQUMsR0FBMEIsQ0FBQyxDQUFDO3dCQUN6RixLQUFLLHFCQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxJQUFJLDJCQUFZLENBQUMsR0FBdUIsQ0FBQyxDQUFDO3dCQUNoRixLQUFLLHFCQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLElBQUksbUNBQWdCLENBQUMsR0FBMkIsQ0FBQyxDQUFDO3dCQUM1RixLQUFLLHFCQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxJQUFJLGlDQUFlLENBQUMsR0FBMEIsQ0FBQyxDQUFDO3dCQUN6RixLQUFLLHFCQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxJQUFJLDZCQUFhLENBQUMsR0FBd0IsQ0FBQyxDQUFDO3dCQUNuRixLQUFLLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLHlCQUFXLENBQUMsR0FBc0IsQ0FBQyxDQUFDO3dCQUM3RSxLQUFLLHFCQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxJQUFJLDJCQUFZLENBQUMsR0FBdUIsQ0FBQyxDQUFDO3dCQUNoRixLQUFLLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLHlCQUFXLENBQUMsR0FBc0IsQ0FBQyxDQUFDO3dCQUM3RSxLQUFLLHFCQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxJQUFJLGlDQUFlLENBQUMsR0FBMEIsQ0FBQyxDQUFDO3dCQUN6RixLQUFLLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLHlCQUFXLENBQUMsR0FBc0IsQ0FBQyxDQUFDO3dCQUM3RSxLQUFLLHFCQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxJQUFJLDJCQUFZLENBQUMsR0FBdUIsQ0FBQyxDQUFDO3dCQUNoRixLQUFLLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLHlCQUFXLENBQUMsR0FBc0IsQ0FBQyxDQUFDO3FCQUM1RTtvQkFDQyxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFjLEVBQUUsU0FBYztnQkFDcEQsQ0FBQzthQUNGLENBQUEifQ==