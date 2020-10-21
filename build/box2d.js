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
System.register(["./common/b2_settings.js", "./common/b2_math.js", "./common/b2_draw.js", "./common/b2_timer.js", "./common/b2_growable_stack.js", "./common/b2_block_allocator.js", "./common/b2_stack_allocator.js", "./collision/b2_collision.js", "./collision/b2_distance.js", "./collision/b2_broad_phase.js", "./collision/b2_dynamic_tree.js", "./collision/b2_time_of_impact.js", "./collision/b2_collide_circle.js", "./collision/b2_collide_polygon.js", "./collision/b2_collide_edge.js", "./collision/b2_shape.js", "./collision/b2_circle_shape.js", "./collision/b2_polygon_shape.js", "./collision/b2_edge_shape.js", "./collision/b2_chain_shape.js", "./dynamics/b2_fixture.js", "./dynamics/b2_body.js", "./dynamics/b2_world.js", "./dynamics/b2_world_callbacks.js", "./dynamics/b2_island.js", "./dynamics/b2_time_step.js", "./dynamics/b2_contact_manager.js", "./dynamics/b2_contact.js", "./dynamics/b2_contact_factory.js", "./dynamics/b2_contact_solver.js", "./dynamics/b2_circle_contact.js", "./dynamics/b2_polygon_contact.js", "./dynamics/b2_polygon_circle_contact.js", "./dynamics/b2_edge_circle_contact.js", "./dynamics/b2_edge_polygon_contact.js", "./dynamics/b2_chain_circle_contact.js", "./dynamics/b2_chain_polygon_contact.js", "./dynamics/b2_joint.js", "./dynamics/b2_area_joint.js", "./dynamics/b2_distance_joint.js", "./dynamics/b2_friction_joint.js", "./dynamics/b2_gear_joint.js", "./dynamics/b2_motor_joint.js", "./dynamics/b2_mouse_joint.js", "./dynamics/b2_prismatic_joint.js", "./dynamics/b2_pulley_joint.js", "./dynamics/b2_revolute_joint.js", "./dynamics/b2_weld_joint.js", "./dynamics/b2_wheel_joint.js", "./controllers/b2_controller.js", "./controllers/b2_buoyancy_controller.js", "./controllers/b2_constant_accel_controller.js", "./controllers/b2_constant_force_controller.js", "./controllers/b2_gravity_controller.js", "./controllers/b2_tensor_damping_controller.js", "./particle/b2_particle.js", "./particle/b2_particle_group.js", "./particle/b2_particle_system.js", "./rope/b2_rope.js"], function (exports_1, context_1) {
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
            function (b2_settings_js_1_1) {
                exportStar_1(b2_settings_js_1_1);
            },
            function (b2_math_js_1_1) {
                exportStar_1(b2_math_js_1_1);
            },
            function (b2_draw_js_1_1) {
                exportStar_1(b2_draw_js_1_1);
            },
            function (b2_timer_js_1_1) {
                exportStar_1(b2_timer_js_1_1);
            },
            function (b2_growable_stack_js_1_1) {
                exportStar_1(b2_growable_stack_js_1_1);
            },
            function (b2_block_allocator_js_1_1) {
                exportStar_1(b2_block_allocator_js_1_1);
            },
            function (b2_stack_allocator_js_1_1) {
                exportStar_1(b2_stack_allocator_js_1_1);
            },
            function (b2_collision_js_1_1) {
                exportStar_1(b2_collision_js_1_1);
            },
            function (b2_distance_js_1_1) {
                exportStar_1(b2_distance_js_1_1);
            },
            function (b2_broad_phase_js_1_1) {
                exportStar_1(b2_broad_phase_js_1_1);
            },
            function (b2_dynamic_tree_js_1_1) {
                exportStar_1(b2_dynamic_tree_js_1_1);
            },
            function (b2_time_of_impact_js_1_1) {
                exportStar_1(b2_time_of_impact_js_1_1);
            },
            function (b2_collide_circle_js_1_1) {
                exportStar_1(b2_collide_circle_js_1_1);
            },
            function (b2_collide_polygon_js_1_1) {
                exportStar_1(b2_collide_polygon_js_1_1);
            },
            function (b2_collide_edge_js_1_1) {
                exportStar_1(b2_collide_edge_js_1_1);
            },
            function (b2_shape_js_1_1) {
                exportStar_1(b2_shape_js_1_1);
            },
            function (b2_circle_shape_js_1_1) {
                exportStar_1(b2_circle_shape_js_1_1);
            },
            function (b2_polygon_shape_js_1_1) {
                exportStar_1(b2_polygon_shape_js_1_1);
            },
            function (b2_edge_shape_js_1_1) {
                exportStar_1(b2_edge_shape_js_1_1);
            },
            function (b2_chain_shape_js_1_1) {
                exportStar_1(b2_chain_shape_js_1_1);
            },
            function (b2_fixture_js_1_1) {
                exportStar_1(b2_fixture_js_1_1);
            },
            function (b2_body_js_1_1) {
                exportStar_1(b2_body_js_1_1);
            },
            function (b2_world_js_1_1) {
                exportStar_1(b2_world_js_1_1);
            },
            function (b2_world_callbacks_js_1_1) {
                exportStar_1(b2_world_callbacks_js_1_1);
            },
            function (b2_island_js_1_1) {
                exportStar_1(b2_island_js_1_1);
            },
            function (b2_time_step_js_1_1) {
                exportStar_1(b2_time_step_js_1_1);
            },
            function (b2_contact_manager_js_1_1) {
                exportStar_1(b2_contact_manager_js_1_1);
            },
            function (b2_contact_js_1_1) {
                exportStar_1(b2_contact_js_1_1);
            },
            function (b2_contact_factory_js_1_1) {
                exportStar_1(b2_contact_factory_js_1_1);
            },
            function (b2_contact_solver_js_1_1) {
                exportStar_1(b2_contact_solver_js_1_1);
            },
            function (b2_circle_contact_js_1_1) {
                exportStar_1(b2_circle_contact_js_1_1);
            },
            function (b2_polygon_contact_js_1_1) {
                exportStar_1(b2_polygon_contact_js_1_1);
            },
            function (b2_polygon_circle_contact_js_1_1) {
                exportStar_1(b2_polygon_circle_contact_js_1_1);
            },
            function (b2_edge_circle_contact_js_1_1) {
                exportStar_1(b2_edge_circle_contact_js_1_1);
            },
            function (b2_edge_polygon_contact_js_1_1) {
                exportStar_1(b2_edge_polygon_contact_js_1_1);
            },
            function (b2_chain_circle_contact_js_1_1) {
                exportStar_1(b2_chain_circle_contact_js_1_1);
            },
            function (b2_chain_polygon_contact_js_1_1) {
                exportStar_1(b2_chain_polygon_contact_js_1_1);
            },
            function (b2_joint_js_1_1) {
                exportStar_1(b2_joint_js_1_1);
            },
            function (b2_area_joint_js_1_1) {
                exportStar_1(b2_area_joint_js_1_1);
            },
            function (b2_distance_joint_js_1_1) {
                exportStar_1(b2_distance_joint_js_1_1);
            },
            function (b2_friction_joint_js_1_1) {
                exportStar_1(b2_friction_joint_js_1_1);
            },
            function (b2_gear_joint_js_1_1) {
                exportStar_1(b2_gear_joint_js_1_1);
            },
            function (b2_motor_joint_js_1_1) {
                exportStar_1(b2_motor_joint_js_1_1);
            },
            function (b2_mouse_joint_js_1_1) {
                exportStar_1(b2_mouse_joint_js_1_1);
            },
            function (b2_prismatic_joint_js_1_1) {
                exportStar_1(b2_prismatic_joint_js_1_1);
            },
            function (b2_pulley_joint_js_1_1) {
                exportStar_1(b2_pulley_joint_js_1_1);
            },
            function (b2_revolute_joint_js_1_1) {
                exportStar_1(b2_revolute_joint_js_1_1);
            },
            function (b2_weld_joint_js_1_1) {
                exportStar_1(b2_weld_joint_js_1_1);
            },
            function (b2_wheel_joint_js_1_1) {
                exportStar_1(b2_wheel_joint_js_1_1);
            },
            function (b2_controller_js_1_1) {
                exportStar_1(b2_controller_js_1_1);
            },
            function (b2_buoyancy_controller_js_1_1) {
                exportStar_1(b2_buoyancy_controller_js_1_1);
            },
            function (b2_constant_accel_controller_js_1_1) {
                exportStar_1(b2_constant_accel_controller_js_1_1);
            },
            function (b2_constant_force_controller_js_1_1) {
                exportStar_1(b2_constant_force_controller_js_1_1);
            },
            function (b2_gravity_controller_js_1_1) {
                exportStar_1(b2_gravity_controller_js_1_1);
            },
            function (b2_tensor_damping_controller_js_1_1) {
                exportStar_1(b2_tensor_damping_controller_js_1_1);
            },
            function (b2_particle_js_1_1) {
                exportStar_1(b2_particle_js_1_1);
            },
            function (b2_particle_group_js_1_1) {
                exportStar_1(b2_particle_group_js_1_1);
            },
            function (b2_particle_system_js_1_1) {
                exportStar_1(b2_particle_system_js_1_1);
            },
            function (b2_rope_js_1_1) {
                exportStar_1(b2_rope_js_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=box2d.js.map