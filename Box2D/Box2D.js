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
System.register(["./Common/b2Settings.js", "./Common/b2Math.js", "./Common/b2Draw.js", "./Common/b2Timer.js", "./Common/b2GrowableStack.js", "./Common/b2BlockAllocator.js", "./Common/b2StackAllocator.js", "./Collision/b2Collision.js", "./Collision/b2Distance.js", "./Collision/b2BroadPhase.js", "./Collision/b2DynamicTree.js", "./Collision/b2TimeOfImpact.js", "./Collision/b2CollideCircle.js", "./Collision/b2CollidePolygon.js", "./Collision/b2CollideEdge.js", "./Collision/Shapes/b2Shape.js", "./Collision/Shapes/b2CircleShape.js", "./Collision/Shapes/b2PolygonShape.js", "./Collision/Shapes/b2EdgeShape.js", "./Collision/Shapes/b2ChainShape.js", "./Dynamics/b2Fixture.js", "./Dynamics/b2Body.js", "./Dynamics/b2World.js", "./Dynamics/b2WorldCallbacks.js", "./Dynamics/b2Island.js", "./Dynamics/b2TimeStep.js", "./Dynamics/b2ContactManager.js", "./Dynamics/Contacts/b2Contact.js", "./Dynamics/Contacts/b2ContactFactory.js", "./Dynamics/Contacts/b2ContactSolver.js", "./Dynamics/Contacts/b2CircleContact.js", "./Dynamics/Contacts/b2PolygonContact.js", "./Dynamics/Contacts/b2PolygonAndCircleContact.js", "./Dynamics/Contacts/b2EdgeAndCircleContact.js", "./Dynamics/Contacts/b2EdgeAndPolygonContact.js", "./Dynamics/Contacts/b2ChainAndCircleContact.js", "./Dynamics/Contacts/b2ChainAndPolygonContact.js", "./Dynamics/Joints/b2Joint.js", "./Dynamics/Joints/b2AreaJoint.js", "./Dynamics/Joints/b2DistanceJoint.js", "./Dynamics/Joints/b2FrictionJoint.js", "./Dynamics/Joints/b2GearJoint.js", "./Dynamics/Joints/b2MotorJoint.js", "./Dynamics/Joints/b2MouseJoint.js", "./Dynamics/Joints/b2PrismaticJoint.js", "./Dynamics/Joints/b2PulleyJoint.js", "./Dynamics/Joints/b2RevoluteJoint.js", "./Dynamics/Joints/b2RopeJoint.js", "./Dynamics/Joints/b2WeldJoint.js", "./Dynamics/Joints/b2WheelJoint.js", "./Controllers/b2Controller.js", "./Controllers/b2BuoyancyController.js", "./Controllers/b2ConstantAccelController.js", "./Controllers/b2ConstantForceController.js", "./Controllers/b2GravityController.js", "./Controllers/b2TensorDampingController.js", "./Particle/b2Particle.js", "./Particle/b2ParticleGroup.js", "./Particle/b2ParticleSystem.js", "./Rope/b2Rope.js"], function (exports_1, context_1) {
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
            function (b2Settings_js_1_1) {
                exportStar_1(b2Settings_js_1_1);
            },
            function (b2Math_js_1_1) {
                exportStar_1(b2Math_js_1_1);
            },
            function (b2Draw_js_1_1) {
                exportStar_1(b2Draw_js_1_1);
            },
            function (b2Timer_js_1_1) {
                exportStar_1(b2Timer_js_1_1);
            },
            function (b2GrowableStack_js_1_1) {
                exportStar_1(b2GrowableStack_js_1_1);
            },
            function (b2BlockAllocator_js_1_1) {
                exportStar_1(b2BlockAllocator_js_1_1);
            },
            function (b2StackAllocator_js_1_1) {
                exportStar_1(b2StackAllocator_js_1_1);
            },
            function (b2Collision_js_1_1) {
                exportStar_1(b2Collision_js_1_1);
            },
            function (b2Distance_js_1_1) {
                exportStar_1(b2Distance_js_1_1);
            },
            function (b2BroadPhase_js_1_1) {
                exportStar_1(b2BroadPhase_js_1_1);
            },
            function (b2DynamicTree_js_1_1) {
                exportStar_1(b2DynamicTree_js_1_1);
            },
            function (b2TimeOfImpact_js_1_1) {
                exportStar_1(b2TimeOfImpact_js_1_1);
            },
            function (b2CollideCircle_js_1_1) {
                exportStar_1(b2CollideCircle_js_1_1);
            },
            function (b2CollidePolygon_js_1_1) {
                exportStar_1(b2CollidePolygon_js_1_1);
            },
            function (b2CollideEdge_js_1_1) {
                exportStar_1(b2CollideEdge_js_1_1);
            },
            function (b2Shape_js_1_1) {
                exportStar_1(b2Shape_js_1_1);
            },
            function (b2CircleShape_js_1_1) {
                exportStar_1(b2CircleShape_js_1_1);
            },
            function (b2PolygonShape_js_1_1) {
                exportStar_1(b2PolygonShape_js_1_1);
            },
            function (b2EdgeShape_js_1_1) {
                exportStar_1(b2EdgeShape_js_1_1);
            },
            function (b2ChainShape_js_1_1) {
                exportStar_1(b2ChainShape_js_1_1);
            },
            function (b2Fixture_js_1_1) {
                exportStar_1(b2Fixture_js_1_1);
            },
            function (b2Body_js_1_1) {
                exportStar_1(b2Body_js_1_1);
            },
            function (b2World_js_1_1) {
                exportStar_1(b2World_js_1_1);
            },
            function (b2WorldCallbacks_js_1_1) {
                exportStar_1(b2WorldCallbacks_js_1_1);
            },
            function (b2Island_js_1_1) {
                exportStar_1(b2Island_js_1_1);
            },
            function (b2TimeStep_js_1_1) {
                exportStar_1(b2TimeStep_js_1_1);
            },
            function (b2ContactManager_js_1_1) {
                exportStar_1(b2ContactManager_js_1_1);
            },
            function (b2Contact_js_1_1) {
                exportStar_1(b2Contact_js_1_1);
            },
            function (b2ContactFactory_js_1_1) {
                exportStar_1(b2ContactFactory_js_1_1);
            },
            function (b2ContactSolver_js_1_1) {
                exportStar_1(b2ContactSolver_js_1_1);
            },
            function (b2CircleContact_js_1_1) {
                exportStar_1(b2CircleContact_js_1_1);
            },
            function (b2PolygonContact_js_1_1) {
                exportStar_1(b2PolygonContact_js_1_1);
            },
            function (b2PolygonAndCircleContact_js_1_1) {
                exportStar_1(b2PolygonAndCircleContact_js_1_1);
            },
            function (b2EdgeAndCircleContact_js_1_1) {
                exportStar_1(b2EdgeAndCircleContact_js_1_1);
            },
            function (b2EdgeAndPolygonContact_js_1_1) {
                exportStar_1(b2EdgeAndPolygonContact_js_1_1);
            },
            function (b2ChainAndCircleContact_js_1_1) {
                exportStar_1(b2ChainAndCircleContact_js_1_1);
            },
            function (b2ChainAndPolygonContact_js_1_1) {
                exportStar_1(b2ChainAndPolygonContact_js_1_1);
            },
            function (b2Joint_js_1_1) {
                exportStar_1(b2Joint_js_1_1);
            },
            function (b2AreaJoint_js_1_1) {
                exportStar_1(b2AreaJoint_js_1_1);
            },
            function (b2DistanceJoint_js_1_1) {
                exportStar_1(b2DistanceJoint_js_1_1);
            },
            function (b2FrictionJoint_js_1_1) {
                exportStar_1(b2FrictionJoint_js_1_1);
            },
            function (b2GearJoint_js_1_1) {
                exportStar_1(b2GearJoint_js_1_1);
            },
            function (b2MotorJoint_js_1_1) {
                exportStar_1(b2MotorJoint_js_1_1);
            },
            function (b2MouseJoint_js_1_1) {
                exportStar_1(b2MouseJoint_js_1_1);
            },
            function (b2PrismaticJoint_js_1_1) {
                exportStar_1(b2PrismaticJoint_js_1_1);
            },
            function (b2PulleyJoint_js_1_1) {
                exportStar_1(b2PulleyJoint_js_1_1);
            },
            function (b2RevoluteJoint_js_1_1) {
                exportStar_1(b2RevoluteJoint_js_1_1);
            },
            function (b2RopeJoint_js_1_1) {
                exportStar_1(b2RopeJoint_js_1_1);
            },
            function (b2WeldJoint_js_1_1) {
                exportStar_1(b2WeldJoint_js_1_1);
            },
            function (b2WheelJoint_js_1_1) {
                exportStar_1(b2WheelJoint_js_1_1);
            },
            function (b2Controller_js_1_1) {
                exportStar_1(b2Controller_js_1_1);
            },
            function (b2BuoyancyController_js_1_1) {
                exportStar_1(b2BuoyancyController_js_1_1);
            },
            function (b2ConstantAccelController_js_1_1) {
                exportStar_1(b2ConstantAccelController_js_1_1);
            },
            function (b2ConstantForceController_js_1_1) {
                exportStar_1(b2ConstantForceController_js_1_1);
            },
            function (b2GravityController_js_1_1) {
                exportStar_1(b2GravityController_js_1_1);
            },
            function (b2TensorDampingController_js_1_1) {
                exportStar_1(b2TensorDampingController_js_1_1);
            },
            function (b2Particle_js_1_1) {
                exportStar_1(b2Particle_js_1_1);
            },
            function (b2ParticleGroup_js_1_1) {
                exportStar_1(b2ParticleGroup_js_1_1);
            },
            function (b2ParticleSystem_js_1_1) {
                exportStar_1(b2ParticleSystem_js_1_1);
            },
            function (b2Rope_js_1_1) {
                exportStar_1(b2Rope_js_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm94MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJCb3gyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRSJ9