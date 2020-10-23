System.register(["./common/b2_block_allocator.js", "./common/b2_draw.js", "./common/b2_growable_stack.js", "./common/b2_math.js", "./common/b2_settings.js", "./common/b2_stack_allocator.js", "./common/b2_timer.js", "./collision/b2_broad_phase.js", "./collision/b2_chain_shape.js", "./collision/b2_circle_shape.js", "./collision/b2_collide_circle.js", "./collision/b2_collide_edge.js", "./collision/b2_collide_polygon.js", "./collision/b2_collision.js", "./collision/b2_distance.js", "./collision/b2_dynamic_tree.js", "./collision/b2_edge_shape.js", "./collision/b2_polygon_shape.js", "./collision/b2_shape.js", "./collision/b2_time_of_impact.js", "./dynamics/b2_area_joint.js", "./dynamics/b2_body.js", "./dynamics/b2_chain_circle_contact.js", "./dynamics/b2_chain_polygon_contact.js", "./dynamics/b2_circle_contact.js", "./dynamics/b2_contact_factory.js", "./dynamics/b2_contact_manager.js", "./dynamics/b2_contact_solver.js", "./dynamics/b2_contact.js", "./dynamics/b2_distance_joint.js", "./dynamics/b2_edge_circle_contact.js", "./dynamics/b2_edge_polygon_contact.js", "./dynamics/b2_fixture.js", "./dynamics/b2_friction_joint.js", "./dynamics/b2_gear_joint.js", "./dynamics/b2_island.js", "./dynamics/b2_joint.js", "./dynamics/b2_motor_joint.js", "./dynamics/b2_mouse_joint.js", "./dynamics/b2_polygon_circle_contact.js", "./dynamics/b2_polygon_contact.js", "./dynamics/b2_prismatic_joint.js", "./dynamics/b2_pulley_joint.js", "./dynamics/b2_revolute_joint.js", "./dynamics/b2_time_step.js", "./dynamics/b2_weld_joint.js", "./dynamics/b2_wheel_joint.js", "./dynamics/b2_world_callbacks.js", "./dynamics/b2_world.js", "./rope/b2_rope.js", "./controllers/b2_buoyancy_controller.js", "./controllers/b2_constant_accel_controller.js", "./controllers/b2_constant_force_controller.js", "./controllers/b2_controller.js", "./controllers/b2_gravity_controller.js", "./controllers/b2_tensor_damping_controller.js", "./particle/b2_particle_group.js", "./particle/b2_particle_system.js", "./particle/b2_particle.js", "./particle/b2_stack_queue.js", "./particle/b2_voronoi_diagram.js"], function (exports_1, context_1) {
    "use strict";
    var b2_body_js_1, staticBody, kinematicBody, dynamicBody, b2_rope_js_1, springAngleBendingModel, pbdAngleBendingModel, xpbdAngleBendingModel, pbdDistanceBendingModel, pbdHeightBendingModel, pbdTriangleBendingModel, b2_rope_js_2, pbdStretchingModel, xpbdStretchingModel;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_block_allocator_js_1_1) {
                exports_1({
                    "BlockAllocator": b2_block_allocator_js_1_1["b2BlockAllocator"]
                });
            },
            function (b2_draw_js_1_1) {
                exports_1({
                    "Draw": b2_draw_js_1_1["b2Draw"]
                });
                exports_1({
                    "Color": b2_draw_js_1_1["b2Color"]
                });
                exports_1({
                    "DrawFlags": b2_draw_js_1_1["b2DrawFlags"]
                });
            },
            function (b2_growable_stack_js_1_1) {
                exports_1({
                    "GrowableStack": b2_growable_stack_js_1_1["b2GrowableStack"]
                });
            },
            function (b2_math_js_1_1) {
                exports_1({
                    "Mat22": b2_math_js_1_1["b2Mat22"]
                });
                exports_1({
                    "Mat33": b2_math_js_1_1["b2Mat33"]
                });
                exports_1({
                    "Rot": b2_math_js_1_1["b2Rot"]
                });
                exports_1({
                    "Sweep": b2_math_js_1_1["b2Sweep"]
                });
                exports_1({
                    "Transform": b2_math_js_1_1["b2Transform"]
                });
                exports_1({
                    "Vec2": b2_math_js_1_1["b2Vec2"]
                });
                exports_1({
                    "Vec3": b2_math_js_1_1["b2Vec3"]
                });
                exports_1({
                    "_pi_over_180": b2_math_js_1_1["b2_pi_over_180"]
                });
                exports_1({
                    "_180_over_pi": b2_math_js_1_1["b2_180_over_pi"]
                });
                exports_1({
                    "two_pi": b2_math_js_1_1["b2_two_pi"]
                });
                exports_1({
                    "Abs": b2_math_js_1_1["b2Abs"]
                });
                exports_1({
                    "Acos": b2_math_js_1_1["b2Acos"]
                });
                exports_1({
                    "Asin": b2_math_js_1_1["b2Asin"]
                });
                exports_1({
                    "Atan2": b2_math_js_1_1["b2Atan2"]
                });
                exports_1({
                    "Cos": b2_math_js_1_1["b2Cos"]
                });
                exports_1({
                    "IsValid": b2_math_js_1_1["b2IsValid"]
                });
                exports_1({
                    "Pow": b2_math_js_1_1["b2Pow"]
                });
                exports_1({
                    "Sin": b2_math_js_1_1["b2Sin"]
                });
                exports_1({
                    "Sqrt": b2_math_js_1_1["b2Sqrt"]
                });
                exports_1({
                    "Vec2_zero": b2_math_js_1_1["b2Vec2_zero"]
                });
                exports_1({
                    "Clamp": b2_math_js_1_1["b2Clamp"]
                });
                exports_1({
                    "DegToRad": b2_math_js_1_1["b2DegToRad"]
                });
                exports_1({
                    "InvSqrt": b2_math_js_1_1["b2InvSqrt"]
                });
                exports_1({
                    "IsPowerOfTwo": b2_math_js_1_1["b2IsPowerOfTwo"]
                });
                exports_1({
                    "Max": b2_math_js_1_1["b2Max"]
                });
                exports_1({
                    "Min": b2_math_js_1_1["b2Min"]
                });
                exports_1({
                    "NextPowerOfTwo": b2_math_js_1_1["b2NextPowerOfTwo"]
                });
                exports_1({
                    "RadToDeg": b2_math_js_1_1["b2RadToDeg"]
                });
                exports_1({
                    "Random": b2_math_js_1_1["b2Random"]
                });
                exports_1({
                    "RandomRange": b2_math_js_1_1["b2RandomRange"]
                });
                exports_1({
                    "Sq": b2_math_js_1_1["b2Sq"]
                });
                exports_1({
                    "Swap": b2_math_js_1_1["b2Swap"]
                });
            },
            function (b2_settings_js_1_1) {
                exports_1({
                    "Version": b2_settings_js_1_1["b2Version"]
                });
                exports_1({
                    "aabbExtension": b2_settings_js_1_1["b2_aabbExtension"]
                });
                exports_1({
                    "aabbMultiplier": b2_settings_js_1_1["b2_aabbMultiplier"]
                });
                exports_1({
                    "angularSleepTolerance": b2_settings_js_1_1["b2_angularSleepTolerance"]
                });
                exports_1({
                    "angularSlop": b2_settings_js_1_1["b2_angularSlop"]
                });
                exports_1({
                    "barrierCollisionTime": b2_settings_js_1_1["b2_barrierCollisionTime"]
                });
                exports_1({
                    "baumgarte": b2_settings_js_1_1["b2_baumgarte"]
                });
                exports_1({
                    "branch": b2_settings_js_1_1["b2_branch"]
                });
                exports_1({
                    "commit": b2_settings_js_1_1["b2_commit"]
                });
                exports_1({
                    "epsilon": b2_settings_js_1_1["b2_epsilon"]
                });
                exports_1({
                    "epsilon_sq": b2_settings_js_1_1["b2_epsilon_sq"]
                });
                exports_1({
                    "invalidParticleIndex": b2_settings_js_1_1["b2_invalidParticleIndex"]
                });
                exports_1({
                    "lengthUnitsPerMeter": b2_settings_js_1_1["b2_lengthUnitsPerMeter"]
                });
                exports_1({
                    "linearSleepTolerance": b2_settings_js_1_1["b2_linearSleepTolerance"]
                });
                exports_1({
                    "linearSlop": b2_settings_js_1_1["b2_linearSlop"]
                });
                exports_1({
                    "maxAngularCorrection": b2_settings_js_1_1["b2_maxAngularCorrection"]
                });
                exports_1({
                    "maxFloat": b2_settings_js_1_1["b2_maxFloat"]
                });
                exports_1({
                    "maxLinearCorrection": b2_settings_js_1_1["b2_maxLinearCorrection"]
                });
                exports_1({
                    "maxManifoldPoints": b2_settings_js_1_1["b2_maxManifoldPoints"]
                });
                exports_1({
                    "maxParticleForce": b2_settings_js_1_1["b2_maxParticleForce"]
                });
                exports_1({
                    "maxParticleIndex": b2_settings_js_1_1["b2_maxParticleIndex"]
                });
                exports_1({
                    "maxParticlePressure": b2_settings_js_1_1["b2_maxParticlePressure"]
                });
                exports_1({
                    "maxPolygonVertices": b2_settings_js_1_1["b2_maxPolygonVertices"]
                });
                exports_1({
                    "maxRotation": b2_settings_js_1_1["b2_maxRotation"]
                });
                exports_1({
                    "maxRotationSquared": b2_settings_js_1_1["b2_maxRotationSquared"]
                });
                exports_1({
                    "maxSubSteps": b2_settings_js_1_1["b2_maxSubSteps"]
                });
                exports_1({
                    "maxTOIContacts": b2_settings_js_1_1["b2_maxTOIContacts"]
                });
                exports_1({
                    "maxTranslation": b2_settings_js_1_1["b2_maxTranslation"]
                });
                exports_1({
                    "maxTranslationSquared": b2_settings_js_1_1["b2_maxTranslationSquared"]
                });
                exports_1({
                    "maxTriadDistance": b2_settings_js_1_1["b2_maxTriadDistance"]
                });
                exports_1({
                    "maxTriadDistanceSquared": b2_settings_js_1_1["b2_maxTriadDistanceSquared"]
                });
                exports_1({
                    "minParticleSystemBufferCapacity": b2_settings_js_1_1["b2_minParticleSystemBufferCapacity"]
                });
                exports_1({
                    "minParticleWeight": b2_settings_js_1_1["b2_minParticleWeight"]
                });
                exports_1({
                    "particleStride": b2_settings_js_1_1["b2_particleStride"]
                });
                exports_1({
                    "pi": b2_settings_js_1_1["b2_pi"]
                });
                exports_1({
                    "polygonRadius": b2_settings_js_1_1["b2_polygonRadius"]
                });
                exports_1({
                    "timeToSleep": b2_settings_js_1_1["b2_timeToSleep"]
                });
                exports_1({
                    "toiBaumgarte": b2_settings_js_1_1["b2_toiBaumgarte"]
                });
                exports_1({
                    "version": b2_settings_js_1_1["b2_version"]
                });
                exports_1({
                    "Alloc": b2_settings_js_1_1["b2Alloc"]
                });
                exports_1({
                    "Assert": b2_settings_js_1_1["b2Assert"]
                });
                exports_1({
                    "Free": b2_settings_js_1_1["b2Free"]
                });
                exports_1({
                    "Log": b2_settings_js_1_1["b2Log"]
                });
                exports_1({
                    "MakeArray": b2_settings_js_1_1["b2MakeArray"]
                });
                exports_1({
                    "MakeNullArray": b2_settings_js_1_1["b2MakeNullArray"]
                });
                exports_1({
                    "MakeNumberArray": b2_settings_js_1_1["b2MakeNumberArray"]
                });
                exports_1({
                    "Maybe": b2_settings_js_1_1["b2Maybe"]
                });
                exports_1({
                    "ParseInt": b2_settings_js_1_1["b2ParseInt"]
                });
                exports_1({
                    "ParseUInt": b2_settings_js_1_1["b2ParseUInt"]
                });
            },
            function (b2_stack_allocator_js_1_1) {
                exports_1({
                    "StackAllocator": b2_stack_allocator_js_1_1["b2StackAllocator"]
                });
            },
            function (b2_timer_js_1_1) {
                exports_1({
                    "Counter": b2_timer_js_1_1["b2Counter"]
                });
                exports_1({
                    "Timer": b2_timer_js_1_1["b2Timer"]
                });
            },
            function (b2_broad_phase_js_1_1) {
                exports_1({
                    "BroadPhase": b2_broad_phase_js_1_1["b2BroadPhase"]
                });
                exports_1({
                    "Pair": b2_broad_phase_js_1_1["b2Pair"]
                });
            },
            function (b2_chain_shape_js_1_1) {
                exports_1({
                    "ChainShape": b2_chain_shape_js_1_1["b2ChainShape"]
                });
            },
            function (b2_circle_shape_js_1_1) {
                exports_1({
                    "CircleShape": b2_circle_shape_js_1_1["b2CircleShape"]
                });
            },
            function (b2_collide_circle_js_1_1) {
                exports_1({
                    "CollideCircles": b2_collide_circle_js_1_1["b2CollideCircles"]
                });
                exports_1({
                    "CollidePolygonAndCircle": b2_collide_circle_js_1_1["b2CollidePolygonAndCircle"]
                });
            },
            function (b2_collide_edge_js_1_1) {
                exports_1({
                    "CollideEdgeAndCircle": b2_collide_edge_js_1_1["b2CollideEdgeAndCircle"]
                });
                exports_1({
                    "CollideEdgeAndPolygon": b2_collide_edge_js_1_1["b2CollideEdgeAndPolygon"]
                });
            },
            function (b2_collide_polygon_js_1_1) {
                exports_1({
                    "CollidePolygons": b2_collide_polygon_js_1_1["b2CollidePolygons"]
                });
            },
            function (b2_collision_js_1_1) {
                exports_1({
                    "AABB": b2_collision_js_1_1["b2AABB"]
                });
                exports_1({
                    "ClipVertex": b2_collision_js_1_1["b2ClipVertex"]
                });
                exports_1({
                    "ContactFeature": b2_collision_js_1_1["b2ContactFeature"]
                });
                exports_1({
                    "ContactID": b2_collision_js_1_1["b2ContactID"]
                });
                exports_1({
                    "Manifold": b2_collision_js_1_1["b2Manifold"]
                });
                exports_1({
                    "ManifoldPoint": b2_collision_js_1_1["b2ManifoldPoint"]
                });
                exports_1({
                    "RayCastInput": b2_collision_js_1_1["b2RayCastInput"]
                });
                exports_1({
                    "RayCastOutput": b2_collision_js_1_1["b2RayCastOutput"]
                });
                exports_1({
                    "WorldManifold": b2_collision_js_1_1["b2WorldManifold"]
                });
                exports_1({
                    "ContactFeatureType": b2_collision_js_1_1["b2ContactFeatureType"]
                });
                exports_1({
                    "ManifoldType": b2_collision_js_1_1["b2ManifoldType"]
                });
                exports_1({
                    "PointState": b2_collision_js_1_1["b2PointState"]
                });
                exports_1({
                    "ClipSegmentToLine": b2_collision_js_1_1["b2ClipSegmentToLine"]
                });
                exports_1({
                    "GetPointStates": b2_collision_js_1_1["b2GetPointStates"]
                });
                exports_1({
                    "TestOverlapAABB": b2_collision_js_1_1["b2TestOverlapAABB"]
                });
                exports_1({
                    "TestOverlapShape": b2_collision_js_1_1["b2TestOverlapShape"]
                });
            },
            function (b2_distance_js_1_1) {
                exports_1({
                    "DistanceInput": b2_distance_js_1_1["b2DistanceInput"]
                });
                exports_1({
                    "DistanceOutput": b2_distance_js_1_1["b2DistanceOutput"]
                });
                exports_1({
                    "DistanceProxy": b2_distance_js_1_1["b2DistanceProxy"]
                });
                exports_1({
                    "ShapeCastInput": b2_distance_js_1_1["b2ShapeCastInput"]
                });
                exports_1({
                    "ShapeCastOutput": b2_distance_js_1_1["b2ShapeCastOutput"]
                });
                exports_1({
                    "Simplex": b2_distance_js_1_1["b2Simplex"]
                });
                exports_1({
                    "SimplexCache": b2_distance_js_1_1["b2SimplexCache"]
                });
                exports_1({
                    "SimplexVertex": b2_distance_js_1_1["b2SimplexVertex"]
                });
                exports_1({
                    "Distance": b2_distance_js_1_1["b2Distance"]
                });
                exports_1({
                    "gjk_reset": b2_distance_js_1_1["b2_gjk_reset"]
                });
                exports_1({
                    "ShapeCast": b2_distance_js_1_1["b2ShapeCast"]
                });
                exports_1({
                    "gjkCalls": b2_distance_js_1_1["b2_gjkCalls"]
                });
                exports_1({
                    "gjkIters": b2_distance_js_1_1["b2_gjkIters"]
                });
                exports_1({
                    "gjkMaxIters": b2_distance_js_1_1["b2_gjkMaxIters"]
                });
            },
            function (b2_dynamic_tree_js_1_1) {
                exports_1({
                    "DynamicTree": b2_dynamic_tree_js_1_1["b2DynamicTree"]
                });
                exports_1({
                    "TreeNode": b2_dynamic_tree_js_1_1["b2TreeNode"]
                });
            },
            function (b2_edge_shape_js_1_1) {
                exports_1({
                    "EdgeShape": b2_edge_shape_js_1_1["b2EdgeShape"]
                });
            },
            function (b2_polygon_shape_js_1_1) {
                exports_1({
                    "PolygonShape": b2_polygon_shape_js_1_1["b2PolygonShape"]
                });
            },
            function (b2_shape_js_1_1) {
                exports_1({
                    "Shape": b2_shape_js_1_1["b2Shape"]
                });
                exports_1({
                    "MassData": b2_shape_js_1_1["b2MassData"]
                });
                exports_1({
                    "ShapeType": b2_shape_js_1_1["b2ShapeType"]
                });
            },
            function (b2_time_of_impact_js_1_1) {
                exports_1({
                    "SeparationFunction": b2_time_of_impact_js_1_1["b2SeparationFunction"]
                });
                exports_1({
                    "TOIInput": b2_time_of_impact_js_1_1["b2TOIInput"]
                });
                exports_1({
                    "TOIOutput": b2_time_of_impact_js_1_1["b2TOIOutput"]
                });
                exports_1({
                    "SeparationFunctionType": b2_time_of_impact_js_1_1["b2SeparationFunctionType"]
                });
                exports_1({
                    "TOIOutputState": b2_time_of_impact_js_1_1["b2TOIOutputState"]
                });
                exports_1({
                    "TimeOfImpact": b2_time_of_impact_js_1_1["b2TimeOfImpact"]
                });
                exports_1({
                    "toi_reset": b2_time_of_impact_js_1_1["b2_toi_reset"]
                });
                exports_1({
                    "toiCalls": b2_time_of_impact_js_1_1["b2_toiCalls"]
                });
                exports_1({
                    "toiIters": b2_time_of_impact_js_1_1["b2_toiIters"]
                });
                exports_1({
                    "toiMaxIters": b2_time_of_impact_js_1_1["b2_toiMaxIters"]
                });
                exports_1({
                    "toiMaxRootIters": b2_time_of_impact_js_1_1["b2_toiMaxRootIters"]
                });
                exports_1({
                    "toiMaxTime": b2_time_of_impact_js_1_1["b2_toiMaxTime"]
                });
                exports_1({
                    "toiRootIters": b2_time_of_impact_js_1_1["b2_toiRootIters"]
                });
                exports_1({
                    "toiTime": b2_time_of_impact_js_1_1["b2_toiTime"]
                });
            },
            function (b2_area_joint_js_1_1) {
                exports_1({
                    "AreaJointDef": b2_area_joint_js_1_1["b2AreaJointDef"]
                });
                exports_1({
                    "AreaJoint": b2_area_joint_js_1_1["b2AreaJoint"]
                });
            },
            function (b2_body_js_2_1) {
                exports_1({
                    "Body": b2_body_js_2_1["b2Body"]
                });
                exports_1({
                    "BodyDef": b2_body_js_2_1["b2BodyDef"]
                });
                exports_1({
                    "BodyType": b2_body_js_2_1["b2BodyType"]
                });
                b2_body_js_1 = b2_body_js_2_1;
            },
            function (b2_chain_circle_contact_js_1_1) {
                exports_1({
                    "ChainAndCircleContact": b2_chain_circle_contact_js_1_1["b2ChainAndCircleContact"]
                });
            },
            function (b2_chain_polygon_contact_js_1_1) {
                exports_1({
                    "ChainAndPolygonContact": b2_chain_polygon_contact_js_1_1["b2ChainAndPolygonContact"]
                });
            },
            function (b2_circle_contact_js_1_1) {
                exports_1({
                    "CircleContact": b2_circle_contact_js_1_1["b2CircleContact"]
                });
            },
            function (b2_contact_factory_js_1_1) {
                exports_1({
                    "ContactFactory": b2_contact_factory_js_1_1["b2ContactFactory"]
                });
                exports_1({
                    "ContactRegister": b2_contact_factory_js_1_1["b2ContactRegister"]
                });
            },
            function (b2_contact_manager_js_1_1) {
                exports_1({
                    "ContactManager": b2_contact_manager_js_1_1["b2ContactManager"]
                });
            },
            function (b2_contact_solver_js_1_1) {
                exports_1({
                    "ContactPositionConstraint": b2_contact_solver_js_1_1["b2ContactPositionConstraint"]
                });
                exports_1({
                    "ContactSolver": b2_contact_solver_js_1_1["b2ContactSolver"]
                });
                exports_1({
                    "ContactSolverDef": b2_contact_solver_js_1_1["b2ContactSolverDef"]
                });
                exports_1({
                    "ContactVelocityConstraint": b2_contact_solver_js_1_1["b2ContactVelocityConstraint"]
                });
                exports_1({
                    "PositionSolverManifold": b2_contact_solver_js_1_1["b2PositionSolverManifold"]
                });
                exports_1({
                    "VelocityConstraintPoint": b2_contact_solver_js_1_1["b2VelocityConstraintPoint"]
                });
                exports_1({
                    "blockSolve": b2_contact_solver_js_1_1["g_blockSolve"]
                });
                exports_1({
                    "get_g_blockSolve": b2_contact_solver_js_1_1["get_g_blockSolve"]
                });
                exports_1({
                    "set_g_blockSolve": b2_contact_solver_js_1_1["set_g_blockSolve"]
                });
            },
            function (b2_contact_js_1_1) {
                exports_1({
                    "Contact": b2_contact_js_1_1["b2Contact"]
                });
                exports_1({
                    "ContactEdge": b2_contact_js_1_1["b2ContactEdge"]
                });
                exports_1({
                    "MixFriction": b2_contact_js_1_1["b2MixFriction"]
                });
                exports_1({
                    "MixRestitution": b2_contact_js_1_1["b2MixRestitution"]
                });
                exports_1({
                    "MixRestitutionThreshold": b2_contact_js_1_1["b2MixRestitutionThreshold"]
                });
            },
            function (b2_distance_joint_js_1_1) {
                exports_1({
                    "DistanceJointDef": b2_distance_joint_js_1_1["b2DistanceJointDef"]
                });
                exports_1({
                    "DistanceJoint": b2_distance_joint_js_1_1["b2DistanceJoint"]
                });
            },
            function (b2_edge_circle_contact_js_1_1) {
                exports_1({
                    "EdgeAndCircleContact": b2_edge_circle_contact_js_1_1["b2EdgeAndCircleContact"]
                });
            },
            function (b2_edge_polygon_contact_js_1_1) {
                exports_1({
                    "EdgeAndPolygonContact": b2_edge_polygon_contact_js_1_1["b2EdgeAndPolygonContact"]
                });
            },
            function (b2_fixture_js_1_1) {
                exports_1({
                    "Filter": b2_fixture_js_1_1["b2Filter"]
                });
                exports_1({
                    "Fixture": b2_fixture_js_1_1["b2Fixture"]
                });
                exports_1({
                    "FixtureDef": b2_fixture_js_1_1["b2FixtureDef"]
                });
                exports_1({
                    "FixtureProxy": b2_fixture_js_1_1["b2FixtureProxy"]
                });
            },
            function (b2_friction_joint_js_1_1) {
                exports_1({
                    "FrictionJointDef": b2_friction_joint_js_1_1["b2FrictionJointDef"]
                });
                exports_1({
                    "FrictionJoint": b2_friction_joint_js_1_1["b2FrictionJoint"]
                });
            },
            function (b2_gear_joint_js_1_1) {
                exports_1({
                    "GearJointDef": b2_gear_joint_js_1_1["b2GearJointDef"]
                });
                exports_1({
                    "GearJoint": b2_gear_joint_js_1_1["b2GearJoint"]
                });
            },
            function (b2_island_js_1_1) {
                exports_1({
                    "Island": b2_island_js_1_1["b2Island"]
                });
            },
            function (b2_joint_js_1_1) {
                exports_1({
                    "JointDef": b2_joint_js_1_1["b2JointDef"]
                });
                exports_1({
                    "Joint": b2_joint_js_1_1["b2Joint"]
                });
                exports_1({
                    "Jacobian": b2_joint_js_1_1["b2Jacobian"]
                });
                exports_1({
                    "JointEdge": b2_joint_js_1_1["b2JointEdge"]
                });
                exports_1({
                    "JointType": b2_joint_js_1_1["b2JointType"]
                });
                exports_1({
                    "AngularStiffness": b2_joint_js_1_1["b2AngularStiffness"]
                });
                exports_1({
                    "LinearStiffness": b2_joint_js_1_1["b2LinearStiffness"]
                });
            },
            function (b2_motor_joint_js_1_1) {
                exports_1({
                    "MotorJointDef": b2_motor_joint_js_1_1["b2MotorJointDef"]
                });
                exports_1({
                    "MotorJoint": b2_motor_joint_js_1_1["b2MotorJoint"]
                });
            },
            function (b2_mouse_joint_js_1_1) {
                exports_1({
                    "MouseJointDef": b2_mouse_joint_js_1_1["b2MouseJointDef"]
                });
                exports_1({
                    "MouseJoint": b2_mouse_joint_js_1_1["b2MouseJoint"]
                });
            },
            function (b2_polygon_circle_contact_js_1_1) {
                exports_1({
                    "PolygonAndCircleContact": b2_polygon_circle_contact_js_1_1["b2PolygonAndCircleContact"]
                });
            },
            function (b2_polygon_contact_js_1_1) {
                exports_1({
                    "PolygonContact": b2_polygon_contact_js_1_1["b2PolygonContact"]
                });
            },
            function (b2_prismatic_joint_js_1_1) {
                exports_1({
                    "PrismaticJointDef": b2_prismatic_joint_js_1_1["b2PrismaticJointDef"]
                });
                exports_1({
                    "PrismaticJoint": b2_prismatic_joint_js_1_1["b2PrismaticJoint"]
                });
            },
            function (b2_pulley_joint_js_1_1) {
                exports_1({
                    "PulleyJointDef": b2_pulley_joint_js_1_1["b2PulleyJointDef"]
                });
                exports_1({
                    "PulleyJoint": b2_pulley_joint_js_1_1["b2PulleyJoint"]
                });
                exports_1({
                    "minPulleyLength": b2_pulley_joint_js_1_1["b2_minPulleyLength"]
                });
            },
            function (b2_revolute_joint_js_1_1) {
                exports_1({
                    "RevoluteJointDef": b2_revolute_joint_js_1_1["b2RevoluteJointDef"]
                });
                exports_1({
                    "RevoluteJoint": b2_revolute_joint_js_1_1["b2RevoluteJoint"]
                });
            },
            function (b2_time_step_js_1_1) {
                exports_1({
                    "Position": b2_time_step_js_1_1["b2Position"]
                });
                exports_1({
                    "Profile": b2_time_step_js_1_1["b2Profile"]
                });
                exports_1({
                    "SolverData": b2_time_step_js_1_1["b2SolverData"]
                });
                exports_1({
                    "TimeStep": b2_time_step_js_1_1["b2TimeStep"]
                });
                exports_1({
                    "Velocity": b2_time_step_js_1_1["b2Velocity"]
                });
            },
            function (b2_weld_joint_js_1_1) {
                exports_1({
                    "WeldJointDef": b2_weld_joint_js_1_1["b2WeldJointDef"]
                });
                exports_1({
                    "WeldJoint": b2_weld_joint_js_1_1["b2WeldJoint"]
                });
            },
            function (b2_wheel_joint_js_1_1) {
                exports_1({
                    "WheelJointDef": b2_wheel_joint_js_1_1["b2WheelJointDef"]
                });
                exports_1({
                    "WheelJoint": b2_wheel_joint_js_1_1["b2WheelJoint"]
                });
            },
            function (b2_world_callbacks_js_1_1) {
                exports_1({
                    "ContactFilter": b2_world_callbacks_js_1_1["b2ContactFilter"]
                });
                exports_1({
                    "ContactImpulse": b2_world_callbacks_js_1_1["b2ContactImpulse"]
                });
                exports_1({
                    "ContactListener": b2_world_callbacks_js_1_1["b2ContactListener"]
                });
                exports_1({
                    "DestructionListener": b2_world_callbacks_js_1_1["b2DestructionListener"]
                });
                exports_1({
                    "QueryCallback": b2_world_callbacks_js_1_1["b2QueryCallback"]
                });
                exports_1({
                    "RayCastCallback": b2_world_callbacks_js_1_1["b2RayCastCallback"]
                });
            },
            function (b2_world_js_1_1) {
                exports_1({
                    "World": b2_world_js_1_1["b2World"]
                });
            },
            function (b2_rope_js_3_1) {
                exports_1({
                    "RopeDef": b2_rope_js_3_1["b2RopeDef"]
                });
                exports_1({
                    "Rope": b2_rope_js_3_1["b2Rope"]
                });
                exports_1({
                    "RopeTuning": b2_rope_js_3_1["b2RopeTuning"]
                });
                exports_1({
                    "BendingModel": b2_rope_js_3_1["b2BendingModel"]
                });
                b2_rope_js_1 = b2_rope_js_3_1;
                exports_1({
                    "StretchingModel": b2_rope_js_3_1["b2StretchingModel"]
                });
                b2_rope_js_2 = b2_rope_js_3_1;
            },
            function (b2_buoyancy_controller_js_1_1) {
                exports_1({
                    "BuoyancyController": b2_buoyancy_controller_js_1_1["b2BuoyancyController"]
                });
            },
            function (b2_constant_accel_controller_js_1_1) {
                exports_1({
                    "ConstantAccelController": b2_constant_accel_controller_js_1_1["b2ConstantAccelController"]
                });
            },
            function (b2_constant_force_controller_js_1_1) {
                exports_1({
                    "ConstantForceController": b2_constant_force_controller_js_1_1["b2ConstantForceController"]
                });
            },
            function (b2_controller_js_1_1) {
                exports_1({
                    "Controller": b2_controller_js_1_1["b2Controller"]
                });
                exports_1({
                    "ControllerEdge": b2_controller_js_1_1["b2ControllerEdge"]
                });
            },
            function (b2_gravity_controller_js_1_1) {
                exports_1({
                    "GravityController": b2_gravity_controller_js_1_1["b2GravityController"]
                });
            },
            function (b2_tensor_damping_controller_js_1_1) {
                exports_1({
                    "TensorDampingController": b2_tensor_damping_controller_js_1_1["b2TensorDampingController"]
                });
            },
            function (b2_particle_group_js_1_1) {
                exports_1({
                    "ParticleGroup": b2_particle_group_js_1_1["b2ParticleGroup"]
                });
                exports_1({
                    "ParticleGroupDef": b2_particle_group_js_1_1["b2ParticleGroupDef"]
                });
                exports_1({
                    "ParticleGroupFlag": b2_particle_group_js_1_1["b2ParticleGroupFlag"]
                });
            },
            function (b2_particle_system_js_1_1) {
                exports_1({
                    "FixtureParticleQueryCallback": b2_particle_system_js_1_1["b2FixtureParticleQueryCallback"]
                });
                exports_1({
                    "GrowableBuffer": b2_particle_system_js_1_1["b2GrowableBuffer"]
                });
                exports_1({
                    "ParticleBodyContact": b2_particle_system_js_1_1["b2ParticleBodyContact"]
                });
                exports_1({
                    "ParticleContact": b2_particle_system_js_1_1["b2ParticleContact"]
                });
                exports_1({
                    "ParticlePair": b2_particle_system_js_1_1["b2ParticlePair"]
                });
                exports_1({
                    "ParticlePairSet": b2_particle_system_js_1_1["b2ParticlePairSet"]
                });
                exports_1({
                    "ParticleSystem": b2_particle_system_js_1_1["b2ParticleSystem"]
                });
                exports_1({
                    "ParticleSystem_CompositeShape": b2_particle_system_js_1_1["b2ParticleSystem_CompositeShape"]
                });
                exports_1({
                    "ParticleSystem_ConnectionFilter": b2_particle_system_js_1_1["b2ParticleSystem_ConnectionFilter"]
                });
                exports_1({
                    "ParticleSystemDef": b2_particle_system_js_1_1["b2ParticleSystemDef"]
                });
                exports_1({
                    "ParticleSystem_DestroyParticlesInShapeCallback": b2_particle_system_js_1_1["b2ParticleSystem_DestroyParticlesInShapeCallback"]
                });
                exports_1({
                    "ParticleSystem_FixedSetAllocator": b2_particle_system_js_1_1["b2ParticleSystem_FixedSetAllocator"]
                });
                exports_1({
                    "ParticleSystem_FixtureParticle": b2_particle_system_js_1_1["b2ParticleSystem_FixtureParticle"]
                });
                exports_1({
                    "ParticleSystem_FixtureParticleSet": b2_particle_system_js_1_1["b2ParticleSystem_FixtureParticleSet"]
                });
                exports_1({
                    "ParticleSystem_InsideBoundsEnumerator": b2_particle_system_js_1_1["b2ParticleSystem_InsideBoundsEnumerator"]
                });
                exports_1({
                    "ParticleSystem_JoinParticleGroupsFilter": b2_particle_system_js_1_1["b2ParticleSystem_JoinParticleGroupsFilter"]
                });
                exports_1({
                    "ParticleSystem_ParticleListNode": b2_particle_system_js_1_1["b2ParticleSystem_ParticleListNode"]
                });
                exports_1({
                    "ParticleSystem_ParticlePair": b2_particle_system_js_1_1["b2ParticleSystem_ParticlePair"]
                });
                exports_1({
                    "ParticleSystem_Proxy": b2_particle_system_js_1_1["b2ParticleSystem_Proxy"]
                });
                exports_1({
                    "ParticleSystem_ReactiveFilter": b2_particle_system_js_1_1["b2ParticleSystem_ReactiveFilter"]
                });
                exports_1({
                    "ParticleSystem_SolveCollisionCallback": b2_particle_system_js_1_1["b2ParticleSystem_SolveCollisionCallback"]
                });
                exports_1({
                    "ParticleSystem_UpdateBodyContactsCallback": b2_particle_system_js_1_1["b2ParticleSystem_UpdateBodyContactsCallback"]
                });
                exports_1({
                    "ParticleSystem_UserOverridableBuffer": b2_particle_system_js_1_1["b2ParticleSystem_UserOverridableBuffer"]
                });
                exports_1({
                    "ParticleTriad": b2_particle_system_js_1_1["b2ParticleTriad"]
                });
            },
            function (b2_particle_js_1_1) {
                exports_1({
                    "ParticleDef": b2_particle_js_1_1["b2ParticleDef"]
                });
                exports_1({
                    "ParticleHandle": b2_particle_js_1_1["b2ParticleHandle"]
                });
                exports_1({
                    "ParticleFlag": b2_particle_js_1_1["b2ParticleFlag"]
                });
                exports_1({
                    "CalculateParticleIterations": b2_particle_js_1_1["b2CalculateParticleIterations"]
                });
            },
            function (b2_stack_queue_js_1_1) {
                exports_1({
                    "StackQueue": b2_stack_queue_js_1_1["b2StackQueue"]
                });
            },
            function (b2_voronoi_diagram_js_1_1) {
                exports_1({
                    "VoronoiDiagram": b2_voronoi_diagram_js_1_1["b2VoronoiDiagram"]
                });
                exports_1({
                    "VoronoiDiagram_Generator": b2_voronoi_diagram_js_1_1["b2VoronoiDiagram_Generator"]
                });
                exports_1({
                    "VoronoiDiagram_Task": b2_voronoi_diagram_js_1_1["b2VoronoiDiagram_Task"]
                });
            }
        ],
        execute: function () {
            exports_1("staticBody", staticBody = b2_body_js_1.b2BodyType.b2_staticBody);
            exports_1("kinematicBody", kinematicBody = b2_body_js_1.b2BodyType.b2_kinematicBody);
            exports_1("dynamicBody", dynamicBody = b2_body_js_1.b2BodyType.b2_dynamicBody);
            exports_1("springAngleBendingModel", springAngleBendingModel = b2_rope_js_1.b2BendingModel.b2_springAngleBendingModel);
            exports_1("pbdAngleBendingModel", pbdAngleBendingModel = b2_rope_js_1.b2BendingModel.b2_pbdAngleBendingModel);
            exports_1("xpbdAngleBendingModel", xpbdAngleBendingModel = b2_rope_js_1.b2BendingModel.b2_xpbdAngleBendingModel);
            exports_1("pbdDistanceBendingModel", pbdDistanceBendingModel = b2_rope_js_1.b2BendingModel.b2_pbdDistanceBendingModel);
            exports_1("pbdHeightBendingModel", pbdHeightBendingModel = b2_rope_js_1.b2BendingModel.b2_pbdHeightBendingModel);
            exports_1("pbdTriangleBendingModel", pbdTriangleBendingModel = b2_rope_js_1.b2BendingModel.b2_pbdTriangleBendingModel);
            exports_1("pbdStretchingModel", pbdStretchingModel = b2_rope_js_2.b2StretchingModel.b2_pbdStretchingModel);
            exports_1("xpbdStretchingModel", xpbdStretchingModel = b2_rope_js_2.b2StretchingModel.b2_xpbdStretchingModel);
        }
    };
});
//# sourceMappingURL=index.js.map