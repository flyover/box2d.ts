/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["./Common/b2Settings", "./Common/b2Math", "./Common/b2Draw", "./Common/b2Timer", "./Common/b2GrowableStack", "./Common/b2BlockAllocator", "./Common/b2StackAllocator", "./Collision/b2Collision", "./Collision/b2Distance", "./Collision/b2BroadPhase", "./Collision/b2DynamicTree", "./Collision/b2TimeOfImpact", "./Collision/b2CollideCircle", "./Collision/b2CollidePolygon", "./Collision/b2CollideEdge", "./Collision/Shapes/b2Shape", "./Collision/Shapes/b2CircleShape", "./Collision/Shapes/b2PolygonShape", "./Collision/Shapes/b2EdgeShape", "./Collision/Shapes/b2ChainShape", "./Dynamics/b2Fixture", "./Dynamics/b2Body", "./Dynamics/b2World", "./Dynamics/b2WorldCallbacks", "./Dynamics/b2Island", "./Dynamics/b2TimeStep", "./Dynamics/b2ContactManager", "./Dynamics/Contacts/b2Contact", "./Dynamics/Contacts/b2ContactFactory", "./Dynamics/Contacts/b2ContactSolver", "./Dynamics/Contacts/b2CircleContact", "./Dynamics/Contacts/b2PolygonContact", "./Dynamics/Contacts/b2PolygonAndCircleContact", "./Dynamics/Contacts/b2EdgeAndCircleContact", "./Dynamics/Contacts/b2EdgeAndPolygonContact", "./Dynamics/Contacts/b2ChainAndCircleContact", "./Dynamics/Contacts/b2ChainAndPolygonContact", "./Dynamics/Joints/b2Joint", "./Dynamics/Joints/b2AreaJoint", "./Dynamics/Joints/b2DistanceJoint", "./Dynamics/Joints/b2FrictionJoint", "./Dynamics/Joints/b2GearJoint", "./Dynamics/Joints/b2MotorJoint", "./Dynamics/Joints/b2MouseJoint", "./Dynamics/Joints/b2PrismaticJoint", "./Dynamics/Joints/b2PulleyJoint", "./Dynamics/Joints/b2RevoluteJoint", "./Dynamics/Joints/b2RopeJoint", "./Dynamics/Joints/b2WeldJoint", "./Dynamics/Joints/b2WheelJoint", "./Controllers/b2Controller", "./Controllers/b2BuoyancyController", "./Controllers/b2ConstantAccelController", "./Controllers/b2ConstantForceController", "./Controllers/b2GravityController", "./Controllers/b2TensorDampingController", "./Particle/b2Particle", "./Particle/b2ParticleGroup", "./Particle/b2ParticleSystem", "./Rope/b2Rope"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (b2Settings_1_1) {
                exportStar_1(b2Settings_1_1);
            },
            function (b2Math_1_1) {
                exportStar_1(b2Math_1_1);
            },
            function (b2Draw_1_1) {
                exportStar_1(b2Draw_1_1);
            },
            function (b2Timer_1_1) {
                exportStar_1(b2Timer_1_1);
            },
            function (b2GrowableStack_1_1) {
                exportStar_1(b2GrowableStack_1_1);
            },
            function (b2BlockAllocator_1_1) {
                exportStar_1(b2BlockAllocator_1_1);
            },
            function (b2StackAllocator_1_1) {
                exportStar_1(b2StackAllocator_1_1);
            },
            function (b2Collision_1_1) {
                exportStar_1(b2Collision_1_1);
            },
            function (b2Distance_1_1) {
                exportStar_1(b2Distance_1_1);
            },
            function (b2BroadPhase_1_1) {
                exportStar_1(b2BroadPhase_1_1);
            },
            function (b2DynamicTree_1_1) {
                exportStar_1(b2DynamicTree_1_1);
            },
            function (b2TimeOfImpact_1_1) {
                exportStar_1(b2TimeOfImpact_1_1);
            },
            function (b2CollideCircle_1_1) {
                exportStar_1(b2CollideCircle_1_1);
            },
            function (b2CollidePolygon_1_1) {
                exportStar_1(b2CollidePolygon_1_1);
            },
            function (b2CollideEdge_1_1) {
                exportStar_1(b2CollideEdge_1_1);
            },
            function (b2Shape_1_1) {
                exportStar_1(b2Shape_1_1);
            },
            function (b2CircleShape_1_1) {
                exportStar_1(b2CircleShape_1_1);
            },
            function (b2PolygonShape_1_1) {
                exportStar_1(b2PolygonShape_1_1);
            },
            function (b2EdgeShape_1_1) {
                exportStar_1(b2EdgeShape_1_1);
            },
            function (b2ChainShape_1_1) {
                exportStar_1(b2ChainShape_1_1);
            },
            function (b2Fixture_1_1) {
                exportStar_1(b2Fixture_1_1);
            },
            function (b2Body_1_1) {
                exportStar_1(b2Body_1_1);
            },
            function (b2World_1_1) {
                exportStar_1(b2World_1_1);
            },
            function (b2WorldCallbacks_1_1) {
                exportStar_1(b2WorldCallbacks_1_1);
            },
            function (b2Island_1_1) {
                exportStar_1(b2Island_1_1);
            },
            function (b2TimeStep_1_1) {
                exportStar_1(b2TimeStep_1_1);
            },
            function (b2ContactManager_1_1) {
                exportStar_1(b2ContactManager_1_1);
            },
            function (b2Contact_1_1) {
                exportStar_1(b2Contact_1_1);
            },
            function (b2ContactFactory_1_1) {
                exportStar_1(b2ContactFactory_1_1);
            },
            function (b2ContactSolver_1_1) {
                exportStar_1(b2ContactSolver_1_1);
            },
            function (b2CircleContact_1_1) {
                exportStar_1(b2CircleContact_1_1);
            },
            function (b2PolygonContact_1_1) {
                exportStar_1(b2PolygonContact_1_1);
            },
            function (b2PolygonAndCircleContact_1_1) {
                exportStar_1(b2PolygonAndCircleContact_1_1);
            },
            function (b2EdgeAndCircleContact_1_1) {
                exportStar_1(b2EdgeAndCircleContact_1_1);
            },
            function (b2EdgeAndPolygonContact_1_1) {
                exportStar_1(b2EdgeAndPolygonContact_1_1);
            },
            function (b2ChainAndCircleContact_1_1) {
                exportStar_1(b2ChainAndCircleContact_1_1);
            },
            function (b2ChainAndPolygonContact_1_1) {
                exportStar_1(b2ChainAndPolygonContact_1_1);
            },
            function (b2Joint_1_1) {
                exportStar_1(b2Joint_1_1);
            },
            function (b2AreaJoint_1_1) {
                exportStar_1(b2AreaJoint_1_1);
            },
            function (b2DistanceJoint_1_1) {
                exportStar_1(b2DistanceJoint_1_1);
            },
            function (b2FrictionJoint_1_1) {
                exportStar_1(b2FrictionJoint_1_1);
            },
            function (b2GearJoint_1_1) {
                exportStar_1(b2GearJoint_1_1);
            },
            function (b2MotorJoint_1_1) {
                exportStar_1(b2MotorJoint_1_1);
            },
            function (b2MouseJoint_1_1) {
                exportStar_1(b2MouseJoint_1_1);
            },
            function (b2PrismaticJoint_1_1) {
                exportStar_1(b2PrismaticJoint_1_1);
            },
            function (b2PulleyJoint_1_1) {
                exportStar_1(b2PulleyJoint_1_1);
            },
            function (b2RevoluteJoint_1_1) {
                exportStar_1(b2RevoluteJoint_1_1);
            },
            function (b2RopeJoint_1_1) {
                exportStar_1(b2RopeJoint_1_1);
            },
            function (b2WeldJoint_1_1) {
                exportStar_1(b2WeldJoint_1_1);
            },
            function (b2WheelJoint_1_1) {
                exportStar_1(b2WheelJoint_1_1);
            },
            function (b2Controller_1_1) {
                exportStar_1(b2Controller_1_1);
            },
            function (b2BuoyancyController_1_1) {
                exportStar_1(b2BuoyancyController_1_1);
            },
            function (b2ConstantAccelController_1_1) {
                exportStar_1(b2ConstantAccelController_1_1);
            },
            function (b2ConstantForceController_1_1) {
                exportStar_1(b2ConstantForceController_1_1);
            },
            function (b2GravityController_1_1) {
                exportStar_1(b2GravityController_1_1);
            },
            function (b2TensorDampingController_1_1) {
                exportStar_1(b2TensorDampingController_1_1);
            },
            function (b2Particle_1_1) {
                exportStar_1(b2Particle_1_1);
            },
            function (b2ParticleGroup_1_1) {
                exportStar_1(b2ParticleGroup_1_1);
            },
            function (b2ParticleSystem_1_1) {
                exportStar_1(b2ParticleSystem_1_1);
            },
            function (b2Rope_1_1) {
                exportStar_1(b2Rope_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm94MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJCb3gyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRSJ9