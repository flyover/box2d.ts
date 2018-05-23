System.register(["./b2Joint", "./b2AreaJoint", "./b2DistanceJoint", "./b2FrictionJoint", "./b2GearJoint", "./b2MotorJoint", "./b2MouseJoint", "./b2PrismaticJoint", "./b2PulleyJoint", "./b2RevoluteJoint", "./b2RopeJoint", "./b2WeldJoint", "./b2WheelJoint"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Joint_1, b2AreaJoint_1, b2DistanceJoint_1, b2FrictionJoint_1, b2GearJoint_1, b2MotorJoint_1, b2MouseJoint_1, b2PrismaticJoint_1, b2PulleyJoint_1, b2RevoluteJoint_1, b2RopeJoint_1, b2WeldJoint_1, b2WheelJoint_1, b2JointFactory;
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
                    let joint = null;
                    switch (def.type) {
                        case b2Joint_1.b2JointType.e_distanceJoint:
                            joint = new b2DistanceJoint_1.b2DistanceJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_mouseJoint:
                            joint = new b2MouseJoint_1.b2MouseJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_prismaticJoint:
                            joint = new b2PrismaticJoint_1.b2PrismaticJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_revoluteJoint:
                            joint = new b2RevoluteJoint_1.b2RevoluteJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_pulleyJoint:
                            joint = new b2PulleyJoint_1.b2PulleyJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_gearJoint:
                            joint = new b2GearJoint_1.b2GearJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_wheelJoint:
                            joint = new b2WheelJoint_1.b2WheelJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_weldJoint:
                            joint = new b2WeldJoint_1.b2WeldJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_frictionJoint:
                            joint = new b2FrictionJoint_1.b2FrictionJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_ropeJoint:
                            joint = new b2RopeJoint_1.b2RopeJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_motorJoint:
                            joint = new b2MotorJoint_1.b2MotorJoint(def);
                            break;
                        case b2Joint_1.b2JointType.e_areaJoint:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludEZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkpvaW50RmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWNBLGlCQUFBO2dCQUNTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZSxFQUFFLFNBQWM7b0JBQ2xELElBQUksS0FBSyxHQUFZLElBQUksQ0FBQztvQkFFMUIsUUFBUSxHQUFHLENBQUMsSUFBSSxFQUFFO3dCQUNsQixLQUFLLHFCQUFXLENBQUMsZUFBZTs0QkFDOUIsS0FBSyxHQUFHLElBQUksaUNBQWUsQ0FBc0IsR0FBRyxDQUFDLENBQUM7NEJBQ3RELE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLFlBQVk7NEJBQzNCLEtBQUssR0FBRyxJQUFJLDJCQUFZLENBQW1CLEdBQUcsQ0FBQyxDQUFDOzRCQUNoRCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxnQkFBZ0I7NEJBQy9CLEtBQUssR0FBRyxJQUFJLG1DQUFnQixDQUF1QixHQUFHLENBQUMsQ0FBQzs0QkFDeEQsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsZUFBZTs0QkFDOUIsS0FBSyxHQUFHLElBQUksaUNBQWUsQ0FBc0IsR0FBRyxDQUFDLENBQUM7NEJBQ3RELE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLGFBQWE7NEJBQzVCLEtBQUssR0FBRyxJQUFJLDZCQUFhLENBQW9CLEdBQUcsQ0FBQyxDQUFDOzRCQUNsRCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxXQUFXOzRCQUMxQixLQUFLLEdBQUcsSUFBSSx5QkFBVyxDQUFrQixHQUFHLENBQUMsQ0FBQzs0QkFDOUMsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsWUFBWTs0QkFDM0IsS0FBSyxHQUFHLElBQUksMkJBQVksQ0FBbUIsR0FBRyxDQUFDLENBQUM7NEJBQ2hELE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLFdBQVc7NEJBQzFCLEtBQUssR0FBRyxJQUFJLHlCQUFXLENBQWtCLEdBQUcsQ0FBQyxDQUFDOzRCQUM5QyxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxlQUFlOzRCQUM5QixLQUFLLEdBQUcsSUFBSSxpQ0FBZSxDQUFzQixHQUFHLENBQUMsQ0FBQzs0QkFDdEQsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsV0FBVzs0QkFDMUIsS0FBSyxHQUFHLElBQUkseUJBQVcsQ0FBa0IsR0FBRyxDQUFDLENBQUM7NEJBQzlDLE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLFlBQVk7NEJBQzNCLEtBQUssR0FBRyxJQUFJLDJCQUFZLENBQW1CLEdBQUcsQ0FBQyxDQUFDOzRCQUNoRCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxXQUFXOzRCQUMxQixLQUFLLEdBQUcsSUFBSSx5QkFBVyxDQUFrQixHQUFHLENBQUMsQ0FBQzs0QkFDOUMsTUFBTTt3QkFFUjs0QkFDRSxtQkFBbUI7NEJBQ25CLE1BQU07cUJBQ1A7b0JBRUQsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWMsRUFBRSxTQUFjO2dCQUNwRCxDQUFDO2FBQ0YsQ0FBQSJ9