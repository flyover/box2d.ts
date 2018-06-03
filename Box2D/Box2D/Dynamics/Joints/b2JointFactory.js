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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludEZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkpvaW50RmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWNBLGlCQUFBO2dCQUNTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZ0IsRUFBRSxTQUFjO29CQUNuRCxJQUFJLEtBQUssR0FBWSxJQUFJLENBQUM7b0JBRTFCLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRTt3QkFDbEIsS0FBSyxxQkFBVyxDQUFDLGVBQWU7NEJBQzlCLEtBQUssR0FBRyxJQUFJLGlDQUFlLENBQXVCLEdBQUcsQ0FBQyxDQUFDOzRCQUN2RCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxZQUFZOzRCQUMzQixLQUFLLEdBQUcsSUFBSSwyQkFBWSxDQUFvQixHQUFHLENBQUMsQ0FBQzs0QkFDakQsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsZ0JBQWdCOzRCQUMvQixLQUFLLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBd0IsR0FBRyxDQUFDLENBQUM7NEJBQ3pELE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLGVBQWU7NEJBQzlCLEtBQUssR0FBRyxJQUFJLGlDQUFlLENBQXVCLEdBQUcsQ0FBQyxDQUFDOzRCQUN2RCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxhQUFhOzRCQUM1QixLQUFLLEdBQUcsSUFBSSw2QkFBYSxDQUFxQixHQUFHLENBQUMsQ0FBQzs0QkFDbkQsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsV0FBVzs0QkFDMUIsS0FBSyxHQUFHLElBQUkseUJBQVcsQ0FBbUIsR0FBRyxDQUFDLENBQUM7NEJBQy9DLE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLFlBQVk7NEJBQzNCLEtBQUssR0FBRyxJQUFJLDJCQUFZLENBQW9CLEdBQUcsQ0FBQyxDQUFDOzRCQUNqRCxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxXQUFXOzRCQUMxQixLQUFLLEdBQUcsSUFBSSx5QkFBVyxDQUFtQixHQUFHLENBQUMsQ0FBQzs0QkFDL0MsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsZUFBZTs0QkFDOUIsS0FBSyxHQUFHLElBQUksaUNBQWUsQ0FBdUIsR0FBRyxDQUFDLENBQUM7NEJBQ3ZELE1BQU07d0JBRVIsS0FBSyxxQkFBVyxDQUFDLFdBQVc7NEJBQzFCLEtBQUssR0FBRyxJQUFJLHlCQUFXLENBQW1CLEdBQUcsQ0FBQyxDQUFDOzRCQUMvQyxNQUFNO3dCQUVSLEtBQUsscUJBQVcsQ0FBQyxZQUFZOzRCQUMzQixLQUFLLEdBQUcsSUFBSSwyQkFBWSxDQUFvQixHQUFHLENBQUMsQ0FBQzs0QkFDakQsTUFBTTt3QkFFUixLQUFLLHFCQUFXLENBQUMsV0FBVzs0QkFDMUIsS0FBSyxHQUFHLElBQUkseUJBQVcsQ0FBbUIsR0FBRyxDQUFDLENBQUM7NEJBQy9DLE1BQU07d0JBRVI7NEJBQ0UsbUJBQW1COzRCQUNuQixNQUFNO3FCQUNQO29CQUVELE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFjLEVBQUUsU0FBYztnQkFDcEQsQ0FBQzthQUNGLENBQUEifQ==