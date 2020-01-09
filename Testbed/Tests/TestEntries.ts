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

import { TestEntry } from "../Framework/Test.js";

import { AddPair } from "./AddPair.js";
import { ApplyForce } from "./ApplyForce.js";
import { BasicSliderCrank } from "./BasicSliderCrank.js";
import { BodyTypes } from "./BodyTypes.js";
import { Breakable } from "./Breakable.js";
import { Bridge } from "./Bridge.js";
import { BulletTest } from "./BulletTest.js";
import { Cantilever } from "./Cantilever.js";
import { Car } from "./Car.js";
import { ContinuousTest } from "./ContinuousTest.js";
import { Chain } from "./Chain.js";
import { CharacterCollision } from "./CharacterCollision.js";
import { CollisionFiltering } from "./CollisionFiltering.js";
import { CollisionProcessing } from "./CollisionProcessing.js";
import { CompoundShapes } from "./CompoundShapes.js";
import { Confined } from "./Confined.js";
import { ConvexHull } from "./ConvexHull.js";
import { ConveyorBelt } from "./ConveyorBelt.js";
import { DistanceTest } from "./DistanceTest.js";
import { Dominos } from "./Dominos.js";
import { DumpShell } from "./DumpShell.js";
import { DynamicTreeTest } from "./DynamicTreeTest.js";
import { EdgeShapes } from "./EdgeShapes.js";
import { EdgeTest } from "./EdgeTest.js";
import { Gears } from "./Gears.js";
import { HeavyOnLight } from "./HeavyOnLight.js";
import { HeavyOnLightTwo } from "./HeavyOnLightTwo.js";
import { Mobile } from "./Mobile.js";
import { MobileBalanced } from "./MobileBalanced.js";
import { MotorJoint } from "./MotorJoint.js";
import { OneSidedPlatform } from "./OneSidedPlatform.js";
import { Pinball } from "./Pinball.js";
import { PolyCollision } from "./PolyCollision.js";
import { PolyShapes } from "./PolyShapes.js";
import { Prismatic } from "./Prismatic.js";
import { Pulleys } from "./Pulleys.js";
import { Pyramid } from "./Pyramid.js";
import { RayCast } from "./RayCast.js";
import { Revolute } from "./Revolute.js";
import { RopeJoint } from "./RopeJoint.js";
import { SensorTest } from "./SensorTest.js";
import { ShapeCast } from "./ShapeCast.js";
import { ShapeEditing } from "./ShapeEditing.js";
import { Skier } from "./Skier.js";
import { SliderCrank } from "./SliderCrank.js";
import { SphereStack } from "./SphereStack.js";
import { TheoJansen } from "./TheoJansen.js";
import { Tiles } from "./Tiles.js";
import { TimeOfImpact } from "./TimeOfImpact.js";
import { Tumbler } from "./Tumbler.js";
import { VaryingFriction } from "./VaryingFriction.js";
import { VaryingRestitution } from "./VaryingRestitution.js";
import { VerticalStack } from "./VerticalStack.js";
import { Web } from "./Web.js";

import { Rope } from "./Rope.js";

import { MotorJoint2 } from "./MotorJoint2.js";
import { BlobTest } from "./BlobTest.js";
import { TestCCD } from "./TestCCD.js";
import { TestRagdoll } from "./TestRagdoll.js";
import { TestStack } from "./TestStack.js";
import { PyramidTopple } from "./PyramidTopple.js";
import { DominoTower } from "./DominoTower.js";
import { TopdownCar } from "./TopdownCar.js";

// #if B2_ENABLE_CONTROLLER
import { BuoyancyTest } from "./BuoyancyTest.js";
// #endif

// #if B2_ENABLE_PARTICLE
import { Sandbox } from "./Sandbox.js";
import { Sparky } from "./Sparky.js";
import { DamBreak } from "./DamBreak.js";
import { LiquidTimer } from "./LiquidTimer.js";
import { WaveMachine } from "./WaveMachine.js";
import { Particles } from "./Particles.js";
import { Faucet } from "./Faucet.js";
import { DrawingParticles } from "./DrawingParticles.js";
import { Soup } from "./Soup.js";
import { ParticlesSurfaceTension } from "./ParticlesSurfaceTension.js";
import { ElasticParticles } from "./ElasticParticles.js";
import { RigidParticles } from "./RigidParticles.js";
import { MultipleParticleSystems } from "./MultipleParticleSystems.js";
import { Impulse } from "./Impulse.js";
import { SoupStirrer } from "./SoupStirrer.js";
import { Fracker } from "./Fracker.js";
import { Maxwell } from "./Maxwell.js";
import { Ramp } from "./Ramp.js";
import { Pointy } from "./Pointy.js";
import { AntiPointy } from "./AntiPointy.js";
import { CornerCase } from "./CornerCase.js";
import { ParticleCollisionFilter } from "./ParticleCollisionFilter.js";
import { EyeCandy } from "./EyeCandy.js";
// #endif

import { Segway } from "./Segway.js";

export const g_testEntries: TestEntry[] = [
  // #if B2_ENABLE_PARTICLE
  new TestEntry("Sparky", Sparky.Create),
  // #endif

  new TestEntry("Shape Cast", ShapeCast.Create),
  new TestEntry("Time of Impact", TimeOfImpact.Create),
  new TestEntry("Character Collision", CharacterCollision.Create),
  new TestEntry("Tiles", Tiles.Create),
  new TestEntry("Heavy on Light", HeavyOnLight.Create),
  new TestEntry("Heavy on Light Two", HeavyOnLightTwo.Create),
  new TestEntry("Vertical Stack", VerticalStack.Create),
  new TestEntry("Basic Slider Crank", BasicSliderCrank.Create),
  new TestEntry("Slider Crank", SliderCrank.Create),
  new TestEntry("Sphere Stack", SphereStack.Create),
  new TestEntry("Convex Hull", ConvexHull.Create),
  new TestEntry("Tumbler", Tumbler.Create),
  new TestEntry("Ray-Cast", RayCast.Create),
  new TestEntry("Dump Shell", DumpShell.Create),
  new TestEntry("Apply Force", ApplyForce.Create),
  new TestEntry("Continuous Test", ContinuousTest.Create),
  new TestEntry("Motor Joint", MotorJoint.Create),
  new TestEntry("One-Sided Platform", OneSidedPlatform.Create),
  new TestEntry("Mobile", Mobile.Create),
  new TestEntry("MobileBalanced", MobileBalanced.Create),
  new TestEntry("Conveyor Belt", ConveyorBelt.Create),
  new TestEntry("Gears", Gears.Create),
  new TestEntry("Varying Restitution", VaryingRestitution.Create),
  new TestEntry("Cantilever", Cantilever.Create),
  new TestEntry("Edge Test", EdgeTest.Create),
  new TestEntry("Body Types", BodyTypes.Create),
  new TestEntry("Shape Editing", ShapeEditing.Create),
  new TestEntry("Car", Car.Create),
  new TestEntry("Prismatic", Prismatic.Create),
  new TestEntry("Revolute", Revolute.Create),
  new TestEntry("Pulleys", Pulleys.Create),
  new TestEntry("Polygon Shapes", PolyShapes.Create),
  new TestEntry("Web", Web.Create),
  new TestEntry("RopeJoint", RopeJoint.Create),
  new TestEntry("Pinball", Pinball.Create),
  new TestEntry("Bullet Test", BulletTest.Create),
  new TestEntry("Confined", Confined.Create),
  new TestEntry("Pyramid", Pyramid.Create),
  new TestEntry("Theo Jansen's Walker", TheoJansen.Create),
  new TestEntry("Edge Shapes", EdgeShapes.Create),
  new TestEntry("PolyCollision", PolyCollision.Create),
  new TestEntry("Bridge", Bridge.Create),
  new TestEntry("Breakable", Breakable.Create),
  new TestEntry("Chain", Chain.Create),
  new TestEntry("Collision Filtering", CollisionFiltering.Create),
  new TestEntry("Collision Processing", CollisionProcessing.Create),
  new TestEntry("Compound Shapes", CompoundShapes.Create),
  new TestEntry("Distance Test", DistanceTest.Create),
  new TestEntry("Dominos", Dominos.Create),
  new TestEntry("Dynamic Tree", DynamicTreeTest.Create),
  new TestEntry("Sensor Test", SensorTest.Create),
  new TestEntry("Varying Friction", VaryingFriction.Create),
  new TestEntry("Add Pair Stress Test", AddPair.Create),
  new TestEntry("Skier", Skier.Create),

  new TestEntry("Rope", Rope.Create),

  new TestEntry("Motor Joint (Bug #487)", MotorJoint2.Create),
  new TestEntry("Blob Test", BlobTest.Create),
  new TestEntry("Continuous Collision", TestCCD.Create),
  new TestEntry("Ragdolls", TestRagdoll.Create),
  new TestEntry("Stacked Boxes", TestStack.Create),
  new TestEntry("Pyramid Topple", PyramidTopple.Create),
  new TestEntry("Domino Tower", DominoTower.Create),
  new TestEntry("TopDown Car", TopdownCar.Create),

  // #if B2_ENABLE_CONTROLLER
  new TestEntry("Buoyancy Test", BuoyancyTest.Create),
  // #endif

  // #if B2_ENABLE_PARTICLE
  new TestEntry("Sandbox", Sandbox.Create),
  // new TestEntry("Sparky", Sparky.Create),
  new TestEntry("DamBreak", DamBreak.Create),
  new TestEntry("Liquid Timer", LiquidTimer.Create),
  new TestEntry("Wave Machine", WaveMachine.Create),
  new TestEntry("Particles", Particles.Create),
  new TestEntry("Faucet", Faucet.Create),
  new TestEntry("Particle Drawing", DrawingParticles.Create),
  new TestEntry("Soup", Soup.Create),
  new TestEntry("Surface Tension", ParticlesSurfaceTension.Create),
  new TestEntry("Elastic Particles", ElasticParticles.Create),
  new TestEntry("Rigid Particles", RigidParticles.Create),
  new TestEntry("Multiple Systems", MultipleParticleSystems.Create),
  new TestEntry("Impulse", Impulse.Create),
  new TestEntry("Soup Stirrer", SoupStirrer.Create),
  new TestEntry("Fracker", Fracker.Create),
  new TestEntry("Maxwell", Maxwell.Create),
  new TestEntry("Ramp", Ramp.Create),
  new TestEntry("Pointy", Pointy.Create),
  new TestEntry("AntiPointy", AntiPointy.Create),
  new TestEntry("Corner Case", CornerCase.Create),
  new TestEntry("Particle Collisions", ParticleCollisionFilter.Create),
  new TestEntry("Eye Candy", EyeCandy.Create),
  // #endif

  new TestEntry("Segway", Segway.Create),
];
