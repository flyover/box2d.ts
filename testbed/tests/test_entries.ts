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

// import { TestEntry } from "../test.js";

// import { AddPair } from "./add_pair.js";
// import { ApplyForce } from "./apply_force.js";
// import { BasicSliderCrank } from "./slider_crank_1.js";
// import { BodyTypes } from "./body_types.js";
// import { Breakable } from "./breakable.js";
// import { Bridge } from "./bridge.js";
// import { BulletTest } from "./bullet_test.js";
// import { Cantilever } from "./cantilever.js";
// import { Car } from "./car.js";
// import { ContinuousTest } from "./continuous_test.js";
// import { Chain } from "./chain.js";
// import { CharacterCollision } from "./character_collision.js";
// import { CollisionFiltering } from "./collision_filtering.js";
// import { CollisionProcessing } from "./collision_processing.js";
// import { CompoundShapes } from "./compound_shapes.js";
// import { Confined } from "./confined.js";
// import { ConvexHull } from "./convex_hull.js";
// import { ConveyorBelt } from "./conveyor_belt.js";
// import { DistanceTest } from "./distance_test.js";
// import { Dominos } from "./dominos.js";
// import { DumpShell } from "./dump_loader.js";
// import { DynamicTreeTest } from "./dynamic_tree.js";
// import { EdgeShapes } from "./edge_shapes.js";
// import { EdgeTest } from "./edge_test.js";
// import { Gears } from "./gear_joint.js";
// import { HeavyOnLight } from "./heavy1.js";
// import { HeavyOnLightTwo } from "./heavy2.js";
// import { Mobile } from "./mobile_unbalanced.js";
// import { MobileBalanced } from "./mobile_balanced.js";
// import { MotorJoint } from "./motor_joint.js";
// import { OneSidedPlatform } from "./platformer.js";
// import { Pinball } from "./pinball.js";
// import { PolyCollision } from "./polygon_collision.js";
// import { PolyShapes } from "./polygon_shapes.js";
// import { Prismatic } from "./prismatic_joint.js";
// import { Pulleys } from "./pulley_joint.js";
// import { Pyramid } from "./pyramid.js";
// import { RayCast } from "./ray_cast.js";
// import { Revolute } from "./revolute_joint.js";
// import { RopeJoint } from "./wrecking_ball.js";
// import { SensorTest } from "./sensor.js";
// import { ShapeCast } from "./shape_cast.js";
// import { ShapeEditing } from "./shape_editing.js";
// import { Skier } from "./skier.js";
// import { SliderCrank } from "./slider_crank_2.js";
// import { SphereStack } from "./circle_stack.js";
// import { TheoJansen } from "./theo_jansen.js";
// import { Tiles } from "./tiles.js";
// import { TimeOfImpact } from "./time_of_impact.js";
// import { Tumbler } from "./tumbler.js";
// import { VaryingFriction } from "./friction.js";
// import { VaryingRestitution } from "./restitution.js";
// import { VerticalStack } from "./box_stack.js";
// import { WheelJoint } from "./wheel_joint.js";
// import { Web } from "./web.js";

// import { Rope } from "./rope.js";

// import { BlobTest } from "./extras/blob_test.js";
// import { TestCCD } from "./extras/test_ccd.js";
// import { TestRagdoll } from "./extras/test_ragdoll.js";
// import { TestStack } from "./extras/test_stack.js";
// import { PyramidTopple } from "./extras/pyramid_topple.js";
// import { DominoTower } from "./extras/domino_tower.js";
// import { TopdownCar } from "./extras/top_down_car.js";

// // #if B2_ENABLE_CONTROLLER
// import { BuoyancyTest } from "./extras/buoyancy_test.js";
// // #endif

// // #if B2_ENABLE_PARTICLE
// import { Sandbox } from "./particles/sandbox.js";
// import { Sparky } from "./particles/sparky.js";
// import { DamBreak } from "./particles/dam_break.js";
// import { LiquidTimer } from "./particles/liquid_timer.js";
// import { WaveMachine } from "./particles/wave_machine.js";
// import { Particles } from "./particles/particles.js";
// import { Faucet } from "./particles/faucet.js";
// import { DrawingParticles } from "./particles/drawing_particles.js";
// import { Soup } from "./particles/soup.js";
// import { ParticlesSurfaceTension } from "./particles/particles_surface_tension.js";
// import { ElasticParticles } from "./particles/elastic_particles.js";
// import { RigidParticles } from "./particles/rigid_particles.js";
// import { MultipleParticleSystems } from "./particles/multiple_particle_systems.js";
// import { Impulse } from "./particles/impulse.js";
// import { SoupStirrer } from "./particles/soup_stirrer.js";
// import { Fracker } from "./particles/fracker.js";
// import { Maxwell } from "./particles/maxwell.js";
// import { Ramp } from "./particles/ramp.js";
// import { Pointy } from "./particles/pointy.js";
// import { AntiPointy } from "./particles/anti_pointy.js";
// import { CornerCase } from "./particles/corner_case.js";
// import { ParticleCollisionFilter } from "./particles/particle_collision_filter.js";
// import { EyeCandy } from "./particles/eye_candy.js";
// // #endif

// import { Segway } from "./extras/segway.js";

// export const g_testEntries: TestEntry[] = [
//   // #if B2_ENABLE_PARTICLE
//   new TestEntry("Sparky", Sparky.Create),
//   // #endif

//   new TestEntry("Shape Cast", ShapeCast.Create),
//   new TestEntry("Time of Impact", TimeOfImpact.Create),
//   new TestEntry("Character Collision", CharacterCollision.Create),
//   new TestEntry("Tiles", Tiles.Create),
//   new TestEntry("Heavy on Light", HeavyOnLight.Create),
//   new TestEntry("Heavy on Light Two", HeavyOnLightTwo.Create),
//   new TestEntry("Vertical Stack", VerticalStack.Create),
//   new TestEntry("Basic Slider Crank", BasicSliderCrank.Create),
//   new TestEntry("Slider Crank", SliderCrank.Create),
//   new TestEntry("Sphere Stack", SphereStack.Create),
//   new TestEntry("Convex Hull", ConvexHull.Create),
//   new TestEntry("Tumbler", Tumbler.Create),
//   new TestEntry("Ray-Cast", RayCast.Create),
//   new TestEntry("Dump Shell", DumpShell.Create),
//   new TestEntry("Apply Force", ApplyForce.Create),
//   new TestEntry("Continuous Test", ContinuousTest.Create),
//   new TestEntry("Motor Joint", MotorJoint.Create),
//   new TestEntry("One-Sided Platform", OneSidedPlatform.Create),
//   new TestEntry("Mobile", Mobile.Create),
//   new TestEntry("MobileBalanced", MobileBalanced.Create),
//   new TestEntry("Conveyor Belt", ConveyorBelt.Create),
//   new TestEntry("Gears", Gears.Create),
//   new TestEntry("Varying Restitution", VaryingRestitution.Create),
//   new TestEntry("Cantilever", Cantilever.Create),
//   new TestEntry("Edge Test", EdgeTest.Create),
//   new TestEntry("Body Types", BodyTypes.Create),
//   new TestEntry("Shape Editing", ShapeEditing.Create),
//   new TestEntry("Car", Car.Create),
//   new TestEntry("Prismatic", Prismatic.Create),
//   new TestEntry("Revolute", Revolute.Create),
//   new TestEntry("Pulleys", Pulleys.Create),
//   new TestEntry("Polygon Shapes", PolyShapes.Create),
//   new TestEntry("Web", Web.Create),
//   new TestEntry("RopeJoint", RopeJoint.Create),
//   new TestEntry("Pinball", Pinball.Create),
//   new TestEntry("Bullet Test", BulletTest.Create),
//   new TestEntry("Confined", Confined.Create),
//   new TestEntry("Pyramid", Pyramid.Create),
//   new TestEntry("Theo Jansen's Walker", TheoJansen.Create),
//   new TestEntry("Edge Shapes", EdgeShapes.Create),
//   new TestEntry("PolyCollision", PolyCollision.Create),
//   new TestEntry("Bridge", Bridge.Create),
//   new TestEntry("Breakable", Breakable.Create),
//   new TestEntry("Chain", Chain.Create),
//   new TestEntry("Collision Filtering", CollisionFiltering.Create),
//   new TestEntry("Collision Processing", CollisionProcessing.Create),
//   new TestEntry("Compound Shapes", CompoundShapes.Create),
//   new TestEntry("Distance Test", DistanceTest.Create),
//   new TestEntry("Dominos", Dominos.Create),
//   new TestEntry("Dynamic Tree", DynamicTreeTest.Create),
//   new TestEntry("Sensor Test", SensorTest.Create),
//   new TestEntry("Varying Friction", VaryingFriction.Create),
//   new TestEntry("Add Pair Stress Test", AddPair.Create),
//   new TestEntry("Skier", Skier.Create),

//   new TestEntry("Rope", Rope.Create),

//   new TestEntry("Motor Joint (Bug #487)", WheelJoint.Create),
//   new TestEntry("Blob Test", BlobTest.Create),
//   new TestEntry("Continuous Collision", TestCCD.Create),
//   new TestEntry("Ragdolls", TestRagdoll.Create),
//   new TestEntry("Stacked Boxes", TestStack.Create),
//   new TestEntry("Pyramid Topple", PyramidTopple.Create),
//   new TestEntry("Domino Tower", DominoTower.Create),
//   new TestEntry("TopDown Car", TopdownCar.Create),

//   // #if B2_ENABLE_CONTROLLER
//   new TestEntry("Buoyancy Test", BuoyancyTest.Create),
//   // #endif

//   // #if B2_ENABLE_PARTICLE
//   new TestEntry("Sandbox", Sandbox.Create),
//   // new TestEntry("Sparky", Sparky.Create),
//   new TestEntry("DamBreak", DamBreak.Create),
//   new TestEntry("Liquid Timer", LiquidTimer.Create),
//   new TestEntry("Wave Machine", WaveMachine.Create),
//   new TestEntry("Particles", Particles.Create),
//   new TestEntry("Faucet", Faucet.Create),
//   new TestEntry("Particle Drawing", DrawingParticles.Create),
//   new TestEntry("Soup", Soup.Create),
//   new TestEntry("Surface Tension", ParticlesSurfaceTension.Create),
//   new TestEntry("Elastic Particles", ElasticParticles.Create),
//   new TestEntry("Rigid Particles", RigidParticles.Create),
//   new TestEntry("Multiple Systems", MultipleParticleSystems.Create),
//   new TestEntry("Impulse", Impulse.Create),
//   new TestEntry("Soup Stirrer", SoupStirrer.Create),
//   new TestEntry("Fracker", Fracker.Create),
//   new TestEntry("Maxwell", Maxwell.Create),
//   new TestEntry("Ramp", Ramp.Create),
//   new TestEntry("Pointy", Pointy.Create),
//   new TestEntry("AntiPointy", AntiPointy.Create),
//   new TestEntry("Corner Case", CornerCase.Create),
//   new TestEntry("Particle Collisions", ParticleCollisionFilter.Create),
//   new TestEntry("Eye Candy", EyeCandy.Create),
//   // #endif

//   new TestEntry("Segway", Segway.Create),
// ];
