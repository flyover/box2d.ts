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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludEZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkpvaW50RmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWNBLGlCQUFBO2dCQUNTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZ0IsRUFBRSxTQUFjO29CQUNuRCxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQ2xCLEtBQUsscUJBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLElBQUksaUNBQWUsQ0FBQyxHQUEwQixDQUFDLENBQUM7d0JBQ3pGLEtBQUsscUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLElBQUksMkJBQVksQ0FBQyxHQUF1QixDQUFDLENBQUM7d0JBQ2hGLEtBQUsscUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sSUFBSSxtQ0FBZ0IsQ0FBQyxHQUEyQixDQUFDLENBQUM7d0JBQzVGLEtBQUsscUJBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLElBQUksaUNBQWUsQ0FBQyxHQUEwQixDQUFDLENBQUM7d0JBQ3pGLEtBQUsscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLElBQUksNkJBQWEsQ0FBQyxHQUF3QixDQUFDLENBQUM7d0JBQ25GLEtBQUsscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQVcsQ0FBQyxHQUFzQixDQUFDLENBQUM7d0JBQzdFLEtBQUsscUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLElBQUksMkJBQVksQ0FBQyxHQUF1QixDQUFDLENBQUM7d0JBQ2hGLEtBQUsscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQVcsQ0FBQyxHQUFzQixDQUFDLENBQUM7d0JBQzdFLEtBQUsscUJBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLElBQUksaUNBQWUsQ0FBQyxHQUEwQixDQUFDLENBQUM7d0JBQ3pGLEtBQUsscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQVcsQ0FBQyxHQUFzQixDQUFDLENBQUM7d0JBQzdFLEtBQUsscUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLElBQUksMkJBQVksQ0FBQyxHQUF1QixDQUFDLENBQUM7d0JBQ2hGLEtBQUsscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQVcsQ0FBQyxHQUFzQixDQUFDLENBQUM7cUJBQzVFO29CQUNDLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQztnQkFFSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWMsRUFBRSxTQUFjO2dCQUNwRCxDQUFDO2FBQ0YsQ0FBQSJ9