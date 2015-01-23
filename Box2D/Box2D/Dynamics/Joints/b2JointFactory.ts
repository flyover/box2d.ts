//<reference path='../../../../Box2D/Box2D/Common/b2Math.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2DistanceJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2WheelJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2MouseJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2GearJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2WeldJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2FrictionJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2RopeJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2MotorJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2AreaJoint.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2Body.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2World.ts' />
//<reference path='../../../../Box2D/Box2D/Common/b2BlockAllocator.ts' />

module box2d {

export class b2JointFactory
{
	public static Create(def: b2JointDef, allocator: any): b2Joint
	{
		var joint: b2Joint = null;

		switch (def.type)
		{
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
			if (ENABLE_ASSERTS) { b2Assert(false); }
			break;
		}

		return joint;
	}

	public static Destroy(joint: b2Joint, allocator: any): void
	{
	}
}

} // module box2d

