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
System.register(["../test.js", "./add_pair.js", "./apply_force.js", "./basic_slider_crank.js", "./body_types.js", "./breakable.js", "./bridge.js", "./bullet_test.js", "./cantilever.js", "./car.js", "./continuous_test.js", "./chain.js", "./character_collision.js", "./collision_filtering.js", "./collision_processing.js", "./compound_shapes.js", "./confined.js", "./convex_hull.js", "./conveyor_belt.js", "./distance_test.js", "./dominos.js", "./dump_shell.js", "./dynamic_tree_test.js", "./edge_shapes.js", "./edge_test.js", "./gears.js", "./heavy1.js", "./heavy2.js", "./mobile_unbalanced.js", "./mobile_balanced.js", "./motor_joint.js", "./one_sided_platform.js", "./pinball.js", "./poly_collision.js", "./poly_shapes.js", "./prismatic.js", "./pulleys.js", "./pyramid.js", "./ray_cast.js", "./revolute.js", "./rope_joint.js", "./sensor_test.js", "./shape_cast.js", "./shape_editing.js", "./skier.js", "./slider_crank.js", "./sphere_stack.js", "./theo_jansen.js", "./tiles.js", "./time_of_impact.js", "./tumbler.js", "./varying_friction.js", "./varying_restitution.js", "./vertical_stack.js", "./web.js", "./rope.js", "./motor_joint2.js", "./blob_test.js", "./test_ccd.js", "./test_ragdoll.js", "./test_stack.js", "./pyramid_topple.js", "./domino_tower.js", "./top_down_car.js", "./buoyancy_test.js", "./sandbox.js", "./sparky.js", "./dam_break.js", "./liquid_timer.js", "./wave_machine.js", "./particles.js", "./faucet.js", "./drawing_particles.js", "./soup.js", "./particles_surface_tension.js", "./elastic_particles.js", "./rigid_particles.js", "./multiple_particle_systems.js", "./impulse.js", "./soup_stirrer.js", "./fracker.js", "./maxwell.js", "./ramp.js", "./pointy.js", "./anti_pointy.js", "./corner_case.js", "./particle_collision_filter.js", "./eye_candy.js", "./segway.js"], function (exports_1, context_1) {
    "use strict";
    var test_js_1, add_pair_js_1, apply_force_js_1, basic_slider_crank_js_1, body_types_js_1, breakable_js_1, bridge_js_1, bullet_test_js_1, cantilever_js_1, car_js_1, continuous_test_js_1, chain_js_1, character_collision_js_1, collision_filtering_js_1, collision_processing_js_1, compound_shapes_js_1, confined_js_1, convex_hull_js_1, conveyor_belt_js_1, distance_test_js_1, dominos_js_1, dump_shell_js_1, dynamic_tree_test_js_1, edge_shapes_js_1, edge_test_js_1, gears_js_1, heavy1_js_1, heavy2_js_1, mobile_unbalanced_js_1, mobile_balanced_js_1, motor_joint_js_1, one_sided_platform_js_1, pinball_js_1, poly_collision_js_1, poly_shapes_js_1, prismatic_js_1, pulleys_js_1, pyramid_js_1, ray_cast_js_1, revolute_js_1, rope_joint_js_1, sensor_test_js_1, shape_cast_js_1, shape_editing_js_1, skier_js_1, slider_crank_js_1, sphere_stack_js_1, theo_jansen_js_1, tiles_js_1, time_of_impact_js_1, tumbler_js_1, varying_friction_js_1, varying_restitution_js_1, vertical_stack_js_1, web_js_1, rope_js_1, motor_joint2_js_1, blob_test_js_1, test_ccd_js_1, test_ragdoll_js_1, test_stack_js_1, pyramid_topple_js_1, domino_tower_js_1, top_down_car_js_1, buoyancy_test_js_1, sandbox_js_1, sparky_js_1, dam_break_js_1, liquid_timer_js_1, wave_machine_js_1, particles_js_1, faucet_js_1, drawing_particles_js_1, soup_js_1, particles_surface_tension_js_1, elastic_particles_js_1, rigid_particles_js_1, multiple_particle_systems_js_1, impulse_js_1, soup_stirrer_js_1, fracker_js_1, maxwell_js_1, ramp_js_1, pointy_js_1, anti_pointy_js_1, corner_case_js_1, particle_collision_filter_js_1, eye_candy_js_1, segway_js_1, g_testEntries;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (test_js_1_1) {
                test_js_1 = test_js_1_1;
            },
            function (add_pair_js_1_1) {
                add_pair_js_1 = add_pair_js_1_1;
            },
            function (apply_force_js_1_1) {
                apply_force_js_1 = apply_force_js_1_1;
            },
            function (basic_slider_crank_js_1_1) {
                basic_slider_crank_js_1 = basic_slider_crank_js_1_1;
            },
            function (body_types_js_1_1) {
                body_types_js_1 = body_types_js_1_1;
            },
            function (breakable_js_1_1) {
                breakable_js_1 = breakable_js_1_1;
            },
            function (bridge_js_1_1) {
                bridge_js_1 = bridge_js_1_1;
            },
            function (bullet_test_js_1_1) {
                bullet_test_js_1 = bullet_test_js_1_1;
            },
            function (cantilever_js_1_1) {
                cantilever_js_1 = cantilever_js_1_1;
            },
            function (car_js_1_1) {
                car_js_1 = car_js_1_1;
            },
            function (continuous_test_js_1_1) {
                continuous_test_js_1 = continuous_test_js_1_1;
            },
            function (chain_js_1_1) {
                chain_js_1 = chain_js_1_1;
            },
            function (character_collision_js_1_1) {
                character_collision_js_1 = character_collision_js_1_1;
            },
            function (collision_filtering_js_1_1) {
                collision_filtering_js_1 = collision_filtering_js_1_1;
            },
            function (collision_processing_js_1_1) {
                collision_processing_js_1 = collision_processing_js_1_1;
            },
            function (compound_shapes_js_1_1) {
                compound_shapes_js_1 = compound_shapes_js_1_1;
            },
            function (confined_js_1_1) {
                confined_js_1 = confined_js_1_1;
            },
            function (convex_hull_js_1_1) {
                convex_hull_js_1 = convex_hull_js_1_1;
            },
            function (conveyor_belt_js_1_1) {
                conveyor_belt_js_1 = conveyor_belt_js_1_1;
            },
            function (distance_test_js_1_1) {
                distance_test_js_1 = distance_test_js_1_1;
            },
            function (dominos_js_1_1) {
                dominos_js_1 = dominos_js_1_1;
            },
            function (dump_shell_js_1_1) {
                dump_shell_js_1 = dump_shell_js_1_1;
            },
            function (dynamic_tree_test_js_1_1) {
                dynamic_tree_test_js_1 = dynamic_tree_test_js_1_1;
            },
            function (edge_shapes_js_1_1) {
                edge_shapes_js_1 = edge_shapes_js_1_1;
            },
            function (edge_test_js_1_1) {
                edge_test_js_1 = edge_test_js_1_1;
            },
            function (gears_js_1_1) {
                gears_js_1 = gears_js_1_1;
            },
            function (heavy1_js_1_1) {
                heavy1_js_1 = heavy1_js_1_1;
            },
            function (heavy2_js_1_1) {
                heavy2_js_1 = heavy2_js_1_1;
            },
            function (mobile_unbalanced_js_1_1) {
                mobile_unbalanced_js_1 = mobile_unbalanced_js_1_1;
            },
            function (mobile_balanced_js_1_1) {
                mobile_balanced_js_1 = mobile_balanced_js_1_1;
            },
            function (motor_joint_js_1_1) {
                motor_joint_js_1 = motor_joint_js_1_1;
            },
            function (one_sided_platform_js_1_1) {
                one_sided_platform_js_1 = one_sided_platform_js_1_1;
            },
            function (pinball_js_1_1) {
                pinball_js_1 = pinball_js_1_1;
            },
            function (poly_collision_js_1_1) {
                poly_collision_js_1 = poly_collision_js_1_1;
            },
            function (poly_shapes_js_1_1) {
                poly_shapes_js_1 = poly_shapes_js_1_1;
            },
            function (prismatic_js_1_1) {
                prismatic_js_1 = prismatic_js_1_1;
            },
            function (pulleys_js_1_1) {
                pulleys_js_1 = pulleys_js_1_1;
            },
            function (pyramid_js_1_1) {
                pyramid_js_1 = pyramid_js_1_1;
            },
            function (ray_cast_js_1_1) {
                ray_cast_js_1 = ray_cast_js_1_1;
            },
            function (revolute_js_1_1) {
                revolute_js_1 = revolute_js_1_1;
            },
            function (rope_joint_js_1_1) {
                rope_joint_js_1 = rope_joint_js_1_1;
            },
            function (sensor_test_js_1_1) {
                sensor_test_js_1 = sensor_test_js_1_1;
            },
            function (shape_cast_js_1_1) {
                shape_cast_js_1 = shape_cast_js_1_1;
            },
            function (shape_editing_js_1_1) {
                shape_editing_js_1 = shape_editing_js_1_1;
            },
            function (skier_js_1_1) {
                skier_js_1 = skier_js_1_1;
            },
            function (slider_crank_js_1_1) {
                slider_crank_js_1 = slider_crank_js_1_1;
            },
            function (sphere_stack_js_1_1) {
                sphere_stack_js_1 = sphere_stack_js_1_1;
            },
            function (theo_jansen_js_1_1) {
                theo_jansen_js_1 = theo_jansen_js_1_1;
            },
            function (tiles_js_1_1) {
                tiles_js_1 = tiles_js_1_1;
            },
            function (time_of_impact_js_1_1) {
                time_of_impact_js_1 = time_of_impact_js_1_1;
            },
            function (tumbler_js_1_1) {
                tumbler_js_1 = tumbler_js_1_1;
            },
            function (varying_friction_js_1_1) {
                varying_friction_js_1 = varying_friction_js_1_1;
            },
            function (varying_restitution_js_1_1) {
                varying_restitution_js_1 = varying_restitution_js_1_1;
            },
            function (vertical_stack_js_1_1) {
                vertical_stack_js_1 = vertical_stack_js_1_1;
            },
            function (web_js_1_1) {
                web_js_1 = web_js_1_1;
            },
            function (rope_js_1_1) {
                rope_js_1 = rope_js_1_1;
            },
            function (motor_joint2_js_1_1) {
                motor_joint2_js_1 = motor_joint2_js_1_1;
            },
            function (blob_test_js_1_1) {
                blob_test_js_1 = blob_test_js_1_1;
            },
            function (test_ccd_js_1_1) {
                test_ccd_js_1 = test_ccd_js_1_1;
            },
            function (test_ragdoll_js_1_1) {
                test_ragdoll_js_1 = test_ragdoll_js_1_1;
            },
            function (test_stack_js_1_1) {
                test_stack_js_1 = test_stack_js_1_1;
            },
            function (pyramid_topple_js_1_1) {
                pyramid_topple_js_1 = pyramid_topple_js_1_1;
            },
            function (domino_tower_js_1_1) {
                domino_tower_js_1 = domino_tower_js_1_1;
            },
            function (top_down_car_js_1_1) {
                top_down_car_js_1 = top_down_car_js_1_1;
            },
            function (buoyancy_test_js_1_1) {
                buoyancy_test_js_1 = buoyancy_test_js_1_1;
            },
            function (sandbox_js_1_1) {
                sandbox_js_1 = sandbox_js_1_1;
            },
            function (sparky_js_1_1) {
                sparky_js_1 = sparky_js_1_1;
            },
            function (dam_break_js_1_1) {
                dam_break_js_1 = dam_break_js_1_1;
            },
            function (liquid_timer_js_1_1) {
                liquid_timer_js_1 = liquid_timer_js_1_1;
            },
            function (wave_machine_js_1_1) {
                wave_machine_js_1 = wave_machine_js_1_1;
            },
            function (particles_js_1_1) {
                particles_js_1 = particles_js_1_1;
            },
            function (faucet_js_1_1) {
                faucet_js_1 = faucet_js_1_1;
            },
            function (drawing_particles_js_1_1) {
                drawing_particles_js_1 = drawing_particles_js_1_1;
            },
            function (soup_js_1_1) {
                soup_js_1 = soup_js_1_1;
            },
            function (particles_surface_tension_js_1_1) {
                particles_surface_tension_js_1 = particles_surface_tension_js_1_1;
            },
            function (elastic_particles_js_1_1) {
                elastic_particles_js_1 = elastic_particles_js_1_1;
            },
            function (rigid_particles_js_1_1) {
                rigid_particles_js_1 = rigid_particles_js_1_1;
            },
            function (multiple_particle_systems_js_1_1) {
                multiple_particle_systems_js_1 = multiple_particle_systems_js_1_1;
            },
            function (impulse_js_1_1) {
                impulse_js_1 = impulse_js_1_1;
            },
            function (soup_stirrer_js_1_1) {
                soup_stirrer_js_1 = soup_stirrer_js_1_1;
            },
            function (fracker_js_1_1) {
                fracker_js_1 = fracker_js_1_1;
            },
            function (maxwell_js_1_1) {
                maxwell_js_1 = maxwell_js_1_1;
            },
            function (ramp_js_1_1) {
                ramp_js_1 = ramp_js_1_1;
            },
            function (pointy_js_1_1) {
                pointy_js_1 = pointy_js_1_1;
            },
            function (anti_pointy_js_1_1) {
                anti_pointy_js_1 = anti_pointy_js_1_1;
            },
            function (corner_case_js_1_1) {
                corner_case_js_1 = corner_case_js_1_1;
            },
            function (particle_collision_filter_js_1_1) {
                particle_collision_filter_js_1 = particle_collision_filter_js_1_1;
            },
            function (eye_candy_js_1_1) {
                eye_candy_js_1 = eye_candy_js_1_1;
            },
            function (segway_js_1_1) {
                segway_js_1 = segway_js_1_1;
            }
        ],
        execute: function () {
            exports_1("g_testEntries", g_testEntries = [
                // #if B2_ENABLE_PARTICLE
                new test_js_1.TestEntry("Sparky", sparky_js_1.Sparky.Create),
                // #endif
                new test_js_1.TestEntry("Shape Cast", shape_cast_js_1.ShapeCast.Create),
                new test_js_1.TestEntry("Time of Impact", time_of_impact_js_1.TimeOfImpact.Create),
                new test_js_1.TestEntry("Character Collision", character_collision_js_1.CharacterCollision.Create),
                new test_js_1.TestEntry("Tiles", tiles_js_1.Tiles.Create),
                new test_js_1.TestEntry("Heavy on Light", heavy1_js_1.HeavyOnLight.Create),
                new test_js_1.TestEntry("Heavy on Light Two", heavy2_js_1.HeavyOnLightTwo.Create),
                new test_js_1.TestEntry("Vertical Stack", vertical_stack_js_1.VerticalStack.Create),
                new test_js_1.TestEntry("Basic Slider Crank", basic_slider_crank_js_1.BasicSliderCrank.Create),
                new test_js_1.TestEntry("Slider Crank", slider_crank_js_1.SliderCrank.Create),
                new test_js_1.TestEntry("Sphere Stack", sphere_stack_js_1.SphereStack.Create),
                new test_js_1.TestEntry("Convex Hull", convex_hull_js_1.ConvexHull.Create),
                new test_js_1.TestEntry("Tumbler", tumbler_js_1.Tumbler.Create),
                new test_js_1.TestEntry("Ray-Cast", ray_cast_js_1.RayCast.Create),
                new test_js_1.TestEntry("Dump Shell", dump_shell_js_1.DumpShell.Create),
                new test_js_1.TestEntry("Apply Force", apply_force_js_1.ApplyForce.Create),
                new test_js_1.TestEntry("Continuous Test", continuous_test_js_1.ContinuousTest.Create),
                new test_js_1.TestEntry("Motor Joint", motor_joint_js_1.MotorJoint.Create),
                new test_js_1.TestEntry("One-Sided Platform", one_sided_platform_js_1.OneSidedPlatform.Create),
                new test_js_1.TestEntry("Mobile", mobile_unbalanced_js_1.Mobile.Create),
                new test_js_1.TestEntry("MobileBalanced", mobile_balanced_js_1.MobileBalanced.Create),
                new test_js_1.TestEntry("Conveyor Belt", conveyor_belt_js_1.ConveyorBelt.Create),
                new test_js_1.TestEntry("Gears", gears_js_1.Gears.Create),
                new test_js_1.TestEntry("Varying Restitution", varying_restitution_js_1.VaryingRestitution.Create),
                new test_js_1.TestEntry("Cantilever", cantilever_js_1.Cantilever.Create),
                new test_js_1.TestEntry("Edge Test", edge_test_js_1.EdgeTest.Create),
                new test_js_1.TestEntry("Body Types", body_types_js_1.BodyTypes.Create),
                new test_js_1.TestEntry("Shape Editing", shape_editing_js_1.ShapeEditing.Create),
                new test_js_1.TestEntry("Car", car_js_1.Car.Create),
                new test_js_1.TestEntry("Prismatic", prismatic_js_1.Prismatic.Create),
                new test_js_1.TestEntry("Revolute", revolute_js_1.Revolute.Create),
                new test_js_1.TestEntry("Pulleys", pulleys_js_1.Pulleys.Create),
                new test_js_1.TestEntry("Polygon Shapes", poly_shapes_js_1.PolyShapes.Create),
                new test_js_1.TestEntry("Web", web_js_1.Web.Create),
                new test_js_1.TestEntry("RopeJoint", rope_joint_js_1.RopeJoint.Create),
                new test_js_1.TestEntry("Pinball", pinball_js_1.Pinball.Create),
                new test_js_1.TestEntry("Bullet Test", bullet_test_js_1.BulletTest.Create),
                new test_js_1.TestEntry("Confined", confined_js_1.Confined.Create),
                new test_js_1.TestEntry("Pyramid", pyramid_js_1.Pyramid.Create),
                new test_js_1.TestEntry("Theo Jansen's Walker", theo_jansen_js_1.TheoJansen.Create),
                new test_js_1.TestEntry("Edge Shapes", edge_shapes_js_1.EdgeShapes.Create),
                new test_js_1.TestEntry("PolyCollision", poly_collision_js_1.PolyCollision.Create),
                new test_js_1.TestEntry("Bridge", bridge_js_1.Bridge.Create),
                new test_js_1.TestEntry("Breakable", breakable_js_1.Breakable.Create),
                new test_js_1.TestEntry("Chain", chain_js_1.Chain.Create),
                new test_js_1.TestEntry("Collision Filtering", collision_filtering_js_1.CollisionFiltering.Create),
                new test_js_1.TestEntry("Collision Processing", collision_processing_js_1.CollisionProcessing.Create),
                new test_js_1.TestEntry("Compound Shapes", compound_shapes_js_1.CompoundShapes.Create),
                new test_js_1.TestEntry("Distance Test", distance_test_js_1.DistanceTest.Create),
                new test_js_1.TestEntry("Dominos", dominos_js_1.Dominos.Create),
                new test_js_1.TestEntry("Dynamic Tree", dynamic_tree_test_js_1.DynamicTreeTest.Create),
                new test_js_1.TestEntry("Sensor Test", sensor_test_js_1.SensorTest.Create),
                new test_js_1.TestEntry("Varying Friction", varying_friction_js_1.VaryingFriction.Create),
                new test_js_1.TestEntry("Add Pair Stress Test", add_pair_js_1.AddPair.Create),
                new test_js_1.TestEntry("Skier", skier_js_1.Skier.Create),
                new test_js_1.TestEntry("Rope", rope_js_1.Rope.Create),
                new test_js_1.TestEntry("Motor Joint (Bug #487)", motor_joint2_js_1.MotorJoint2.Create),
                new test_js_1.TestEntry("Blob Test", blob_test_js_1.BlobTest.Create),
                new test_js_1.TestEntry("Continuous Collision", test_ccd_js_1.TestCCD.Create),
                new test_js_1.TestEntry("Ragdolls", test_ragdoll_js_1.TestRagdoll.Create),
                new test_js_1.TestEntry("Stacked Boxes", test_stack_js_1.TestStack.Create),
                new test_js_1.TestEntry("Pyramid Topple", pyramid_topple_js_1.PyramidTopple.Create),
                new test_js_1.TestEntry("Domino Tower", domino_tower_js_1.DominoTower.Create),
                new test_js_1.TestEntry("TopDown Car", top_down_car_js_1.TopdownCar.Create),
                // #if B2_ENABLE_CONTROLLER
                new test_js_1.TestEntry("Buoyancy Test", buoyancy_test_js_1.BuoyancyTest.Create),
                // #endif
                // #if B2_ENABLE_PARTICLE
                new test_js_1.TestEntry("Sandbox", sandbox_js_1.Sandbox.Create),
                // new TestEntry("Sparky", Sparky.Create),
                new test_js_1.TestEntry("DamBreak", dam_break_js_1.DamBreak.Create),
                new test_js_1.TestEntry("Liquid Timer", liquid_timer_js_1.LiquidTimer.Create),
                new test_js_1.TestEntry("Wave Machine", wave_machine_js_1.WaveMachine.Create),
                new test_js_1.TestEntry("Particles", particles_js_1.Particles.Create),
                new test_js_1.TestEntry("Faucet", faucet_js_1.Faucet.Create),
                new test_js_1.TestEntry("Particle Drawing", drawing_particles_js_1.DrawingParticles.Create),
                new test_js_1.TestEntry("Soup", soup_js_1.Soup.Create),
                new test_js_1.TestEntry("Surface Tension", particles_surface_tension_js_1.ParticlesSurfaceTension.Create),
                new test_js_1.TestEntry("Elastic Particles", elastic_particles_js_1.ElasticParticles.Create),
                new test_js_1.TestEntry("Rigid Particles", rigid_particles_js_1.RigidParticles.Create),
                new test_js_1.TestEntry("Multiple Systems", multiple_particle_systems_js_1.MultipleParticleSystems.Create),
                new test_js_1.TestEntry("Impulse", impulse_js_1.Impulse.Create),
                new test_js_1.TestEntry("Soup Stirrer", soup_stirrer_js_1.SoupStirrer.Create),
                new test_js_1.TestEntry("Fracker", fracker_js_1.Fracker.Create),
                new test_js_1.TestEntry("Maxwell", maxwell_js_1.Maxwell.Create),
                new test_js_1.TestEntry("Ramp", ramp_js_1.Ramp.Create),
                new test_js_1.TestEntry("Pointy", pointy_js_1.Pointy.Create),
                new test_js_1.TestEntry("AntiPointy", anti_pointy_js_1.AntiPointy.Create),
                new test_js_1.TestEntry("Corner Case", corner_case_js_1.CornerCase.Create),
                new test_js_1.TestEntry("Particle Collisions", particle_collision_filter_js_1.ParticleCollisionFilter.Create),
                new test_js_1.TestEntry("Eye Candy", eye_candy_js_1.EyeCandy.Create),
                // #endif
                new test_js_1.TestEntry("Segway", segway_js_1.Segway.Create),
            ]);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9lbnRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdF9lbnRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFzR0YsMkJBQWEsYUFBYSxHQUFnQjtnQkFDeEMseUJBQXlCO2dCQUN6QixJQUFJLG1CQUFTLENBQUMsUUFBUSxFQUFFLGtCQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN0QyxTQUFTO2dCQUVULElBQUksbUJBQVMsQ0FBQyxZQUFZLEVBQUUseUJBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQzdDLElBQUksbUJBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxnQ0FBWSxDQUFDLE1BQU0sQ0FBQztnQkFDcEQsSUFBSSxtQkFBUyxDQUFDLHFCQUFxQixFQUFFLDJDQUFrQixDQUFDLE1BQU0sQ0FBQztnQkFDL0QsSUFBSSxtQkFBUyxDQUFDLE9BQU8sRUFBRSxnQkFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDcEMsSUFBSSxtQkFBUyxDQUFDLGdCQUFnQixFQUFFLHdCQUFZLENBQUMsTUFBTSxDQUFDO2dCQUNwRCxJQUFJLG1CQUFTLENBQUMsb0JBQW9CLEVBQUUsMkJBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQzNELElBQUksbUJBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxpQ0FBYSxDQUFDLE1BQU0sQ0FBQztnQkFDckQsSUFBSSxtQkFBUyxDQUFDLG9CQUFvQixFQUFFLHdDQUFnQixDQUFDLE1BQU0sQ0FBQztnQkFDNUQsSUFBSSxtQkFBUyxDQUFDLGNBQWMsRUFBRSw2QkFBVyxDQUFDLE1BQU0sQ0FBQztnQkFDakQsSUFBSSxtQkFBUyxDQUFDLGNBQWMsRUFBRSw2QkFBVyxDQUFDLE1BQU0sQ0FBQztnQkFDakQsSUFBSSxtQkFBUyxDQUFDLGFBQWEsRUFBRSwyQkFBVSxDQUFDLE1BQU0sQ0FBQztnQkFDL0MsSUFBSSxtQkFBUyxDQUFDLFNBQVMsRUFBRSxvQkFBTyxDQUFDLE1BQU0sQ0FBQztnQkFDeEMsSUFBSSxtQkFBUyxDQUFDLFVBQVUsRUFBRSxxQkFBTyxDQUFDLE1BQU0sQ0FBQztnQkFDekMsSUFBSSxtQkFBUyxDQUFDLFlBQVksRUFBRSx5QkFBUyxDQUFDLE1BQU0sQ0FBQztnQkFDN0MsSUFBSSxtQkFBUyxDQUFDLGFBQWEsRUFBRSwyQkFBVSxDQUFDLE1BQU0sQ0FBQztnQkFDL0MsSUFBSSxtQkFBUyxDQUFDLGlCQUFpQixFQUFFLG1DQUFjLENBQUMsTUFBTSxDQUFDO2dCQUN2RCxJQUFJLG1CQUFTLENBQUMsYUFBYSxFQUFFLDJCQUFVLENBQUMsTUFBTSxDQUFDO2dCQUMvQyxJQUFJLG1CQUFTLENBQUMsb0JBQW9CLEVBQUUsd0NBQWdCLENBQUMsTUFBTSxDQUFDO2dCQUM1RCxJQUFJLG1CQUFTLENBQUMsUUFBUSxFQUFFLDZCQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN0QyxJQUFJLG1CQUFTLENBQUMsZ0JBQWdCLEVBQUUsbUNBQWMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RELElBQUksbUJBQVMsQ0FBQyxlQUFlLEVBQUUsK0JBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ25ELElBQUksbUJBQVMsQ0FBQyxPQUFPLEVBQUUsZ0JBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLElBQUksbUJBQVMsQ0FBQyxxQkFBcUIsRUFBRSwyQ0FBa0IsQ0FBQyxNQUFNLENBQUM7Z0JBQy9ELElBQUksbUJBQVMsQ0FBQyxZQUFZLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQzlDLElBQUksbUJBQVMsQ0FBQyxXQUFXLEVBQUUsdUJBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLElBQUksbUJBQVMsQ0FBQyxZQUFZLEVBQUUseUJBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQzdDLElBQUksbUJBQVMsQ0FBQyxlQUFlLEVBQUUsK0JBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ25ELElBQUksbUJBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsSUFBSSxtQkFBUyxDQUFDLFdBQVcsRUFBRSx3QkFBUyxDQUFDLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxtQkFBUyxDQUFDLFVBQVUsRUFBRSxzQkFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDMUMsSUFBSSxtQkFBUyxDQUFDLFNBQVMsRUFBRSxvQkFBTyxDQUFDLE1BQU0sQ0FBQztnQkFDeEMsSUFBSSxtQkFBUyxDQUFDLGdCQUFnQixFQUFFLDJCQUFVLENBQUMsTUFBTSxDQUFDO2dCQUNsRCxJQUFJLG1CQUFTLENBQUMsS0FBSyxFQUFFLFlBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hDLElBQUksbUJBQVMsQ0FBQyxXQUFXLEVBQUUseUJBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQzVDLElBQUksbUJBQVMsQ0FBQyxTQUFTLEVBQUUsb0JBQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ3hDLElBQUksbUJBQVMsQ0FBQyxhQUFhLEVBQUUsMkJBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQy9DLElBQUksbUJBQVMsQ0FBQyxVQUFVLEVBQUUsc0JBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLElBQUksbUJBQVMsQ0FBQyxTQUFTLEVBQUUsb0JBQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ3hDLElBQUksbUJBQVMsQ0FBQyxzQkFBc0IsRUFBRSwyQkFBVSxDQUFDLE1BQU0sQ0FBQztnQkFDeEQsSUFBSSxtQkFBUyxDQUFDLGFBQWEsRUFBRSwyQkFBVSxDQUFDLE1BQU0sQ0FBQztnQkFDL0MsSUFBSSxtQkFBUyxDQUFDLGVBQWUsRUFBRSxpQ0FBYSxDQUFDLE1BQU0sQ0FBQztnQkFDcEQsSUFBSSxtQkFBUyxDQUFDLFFBQVEsRUFBRSxrQkFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsSUFBSSxtQkFBUyxDQUFDLFdBQVcsRUFBRSx3QkFBUyxDQUFDLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxtQkFBUyxDQUFDLE9BQU8sRUFBRSxnQkFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDcEMsSUFBSSxtQkFBUyxDQUFDLHFCQUFxQixFQUFFLDJDQUFrQixDQUFDLE1BQU0sQ0FBQztnQkFDL0QsSUFBSSxtQkFBUyxDQUFDLHNCQUFzQixFQUFFLDZDQUFtQixDQUFDLE1BQU0sQ0FBQztnQkFDakUsSUFBSSxtQkFBUyxDQUFDLGlCQUFpQixFQUFFLG1DQUFjLENBQUMsTUFBTSxDQUFDO2dCQUN2RCxJQUFJLG1CQUFTLENBQUMsZUFBZSxFQUFFLCtCQUFZLENBQUMsTUFBTSxDQUFDO2dCQUNuRCxJQUFJLG1CQUFTLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLG1CQUFTLENBQUMsY0FBYyxFQUFFLHNDQUFlLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxJQUFJLG1CQUFTLENBQUMsYUFBYSxFQUFFLDJCQUFVLENBQUMsTUFBTSxDQUFDO2dCQUMvQyxJQUFJLG1CQUFTLENBQUMsa0JBQWtCLEVBQUUscUNBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3pELElBQUksbUJBQVMsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBTyxDQUFDLE1BQU0sQ0FBQztnQkFDckQsSUFBSSxtQkFBUyxDQUFDLE9BQU8sRUFBRSxnQkFBSyxDQUFDLE1BQU0sQ0FBQztnQkFFcEMsSUFBSSxtQkFBUyxDQUFDLE1BQU0sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDO2dCQUVsQyxJQUFJLG1CQUFTLENBQUMsd0JBQXdCLEVBQUUsNkJBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQzNELElBQUksbUJBQVMsQ0FBQyxXQUFXLEVBQUUsdUJBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLElBQUksbUJBQVMsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBTyxDQUFDLE1BQU0sQ0FBQztnQkFDckQsSUFBSSxtQkFBUyxDQUFDLFVBQVUsRUFBRSw2QkFBVyxDQUFDLE1BQU0sQ0FBQztnQkFDN0MsSUFBSSxtQkFBUyxDQUFDLGVBQWUsRUFBRSx5QkFBUyxDQUFDLE1BQU0sQ0FBQztnQkFDaEQsSUFBSSxtQkFBUyxDQUFDLGdCQUFnQixFQUFFLGlDQUFhLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxJQUFJLG1CQUFTLENBQUMsY0FBYyxFQUFFLDZCQUFXLENBQUMsTUFBTSxDQUFDO2dCQUNqRCxJQUFJLG1CQUFTLENBQUMsYUFBYSxFQUFFLDRCQUFVLENBQUMsTUFBTSxDQUFDO2dCQUUvQywyQkFBMkI7Z0JBQzNCLElBQUksbUJBQVMsQ0FBQyxlQUFlLEVBQUUsK0JBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ25ELFNBQVM7Z0JBRVQseUJBQXlCO2dCQUN6QixJQUFJLG1CQUFTLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QywwQ0FBMEM7Z0JBQzFDLElBQUksbUJBQVMsQ0FBQyxVQUFVLEVBQUUsdUJBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLElBQUksbUJBQVMsQ0FBQyxjQUFjLEVBQUUsNkJBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pELElBQUksbUJBQVMsQ0FBQyxjQUFjLEVBQUUsNkJBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pELElBQUksbUJBQVMsQ0FBQyxXQUFXLEVBQUUsd0JBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQzVDLElBQUksbUJBQVMsQ0FBQyxRQUFRLEVBQUUsa0JBQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksbUJBQVMsQ0FBQyxrQkFBa0IsRUFBRSx1Q0FBZ0IsQ0FBQyxNQUFNLENBQUM7Z0JBQzFELElBQUksbUJBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDbEMsSUFBSSxtQkFBUyxDQUFDLGlCQUFpQixFQUFFLHNEQUF1QixDQUFDLE1BQU0sQ0FBQztnQkFDaEUsSUFBSSxtQkFBUyxDQUFDLG1CQUFtQixFQUFFLHVDQUFnQixDQUFDLE1BQU0sQ0FBQztnQkFDM0QsSUFBSSxtQkFBUyxDQUFDLGlCQUFpQixFQUFFLG1DQUFjLENBQUMsTUFBTSxDQUFDO2dCQUN2RCxJQUFJLG1CQUFTLENBQUMsa0JBQWtCLEVBQUUsc0RBQXVCLENBQUMsTUFBTSxDQUFDO2dCQUNqRSxJQUFJLG1CQUFTLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLG1CQUFTLENBQUMsY0FBYyxFQUFFLDZCQUFXLENBQUMsTUFBTSxDQUFDO2dCQUNqRCxJQUFJLG1CQUFTLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLG1CQUFTLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLG1CQUFTLENBQUMsTUFBTSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2xDLElBQUksbUJBQVMsQ0FBQyxRQUFRLEVBQUUsa0JBQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksbUJBQVMsQ0FBQyxZQUFZLEVBQUUsMkJBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQzlDLElBQUksbUJBQVMsQ0FBQyxhQUFhLEVBQUUsMkJBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQy9DLElBQUksbUJBQVMsQ0FBQyxxQkFBcUIsRUFBRSxzREFBdUIsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BFLElBQUksbUJBQVMsQ0FBQyxXQUFXLEVBQUUsdUJBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLFNBQVM7Z0JBRVQsSUFBSSxtQkFBUyxDQUFDLFFBQVEsRUFBRSxrQkFBTSxDQUFDLE1BQU0sQ0FBQzthQUN2QyxFQUFDIn0=