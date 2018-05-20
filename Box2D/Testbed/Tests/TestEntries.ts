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

import { TestEntry } from "../Framework/Test";

///import { AddPair } from "./AddPair";
///import { ApplyForce } from "./ApplyForce";
///import { BodyTypes } from "./BodyTypes";
///import { Breakable } from "./Breakable";
///import { Bridge } from "./Bridge";
///import { BulletTest } from "./BulletTest";
///import { Cantilever } from "./Cantilever";
import { Car } from "./Car";
///import { ContinuousTest } from "./ContinuousTest";
///import { Chain } from "./Chain";
///import { CharacterCollision } from "./CharacterCollision";
///import { CollisionFiltering } from "./CollisionFiltering";
///import { CollisionProcessing } from "./CollisionProcessing";
///import { CompoundShapes } from "./CompoundShapes";
///import { Confined } from "./Confined";
///import { ConvexHull } from "./ConvexHull";
///import { ConveyorBelt } from "./ConveyorBelt";
///import { DistanceTest } from "./DistanceTest";
///import { Dominos } from "./Dominos";
///import { DumpShell } from "./DumpShell";
///import { DynamicTreeTest } from "./DynamicTreeTest";
///import { EdgeShapes } from "./EdgeShapes";
///import { EdgeTest } from "./EdgeTest";
///import { Gears } from "./Gears";
///import { Mobile } from "./Mobile";
///import { MobileBalanced } from "./MobileBalanced";
///import { MotorJoint } from "./MotorJoint";
import { MotorJoint2 } from "./MotorJoint2";
///import { OneSidedPlatform } from "./OneSidedPlatform";
///import { Pinball } from "./Pinball";
///import { PolyCollision } from "./PolyCollision";
///import { PolyShapes } from "./PolyShapes";
///import { Prismatic } from "./Prismatic";
///import { Pulleys } from "./Pulleys";
///import { Pyramid } from "./Pyramid";
import { RayCast } from "./RayCast";
///import { Revolute } from "./Revolute";
///import { Rope } from "./Rope";
///import { RopeJoint } from "./RopeJoint";
///import { SensorTest } from "./SensorTest";
///import { ShapeEditing } from "./ShapeEditing";
///import { SliderCrank } from "./SliderCrank";
import { SphereStack } from "./SphereStack";
///import { TheoJansen } from "./TheoJansen";
///import { Tiles } from "./Tiles";
///import { TimeOfImpact } from "./TimeOfImpact";
///import { Tumbler } from "./Tumbler";
///import { VaryingFriction } from "./VaryingFriction";
///import { VaryingRestitution } from "./VaryingRestitution";
///import { VerticalStack } from "./VerticalStack";
///import { Web } from "./Web";

///import { BlobTest } from "./BlobTest";
///import { BuoyancyTest } from "./BuoyancyTest";

///import { TestCCD } from "./TestCCD";
///import { TestRagdoll } from "./TestRagdoll";
///import { TestStack } from "./TestStack";

///#if B2_ENABLE_PARTICLE
import { ElasticParticles } from "./ElasticParticles";
import { Faucet } from "./Faucet";
import { ParticlesSurfaceTension } from "./ParticlesSurfaceTension";
import { Sparky } from "./Sparky";
///#endif

export const g_testEntries: TestEntry[] = [
  ///#if B2_ENABLE_PARTICLE
  new TestEntry("Faucet", Faucet.Create ),
  new TestEntry("Surface Tension", ParticlesSurfaceTension.Create),
  new TestEntry("Elastic Particles", ElasticParticles.Create),
  new TestEntry("Sparky", Sparky.Create),
  ///#endif
  ///new TestEntry("Continuous Test", ContinuousTest.Create),
  ///new TestEntry("Time of Impact", TimeOfImpact.Create),
  ///new TestEntry("Motor Joint", MotorJoint.Create),
  new TestEntry("Motor Joint (Bug #487)", MotorJoint2.Create),
  ///new TestEntry("Mobile", Mobile.Create),
  ///new TestEntry("MobileBalanced", MobileBalanced.Create),
  ///new TestEntry("Ray-Cast", RayCast.Create),
  new TestEntry("Ray-Cast", RayCast.Create),
  ///new TestEntry("Conveyor Belt", ConveyorBelt.Create),
  ///new TestEntry("Gears", Gears.Create),
  ///new TestEntry("Convex Hull", ConvexHull.Create),
  ///new TestEntry("constying Restitution", constyingRestitution.Create),
  ///new TestEntry("Tumbler", Tumbler.Create),
  ///new TestEntry("Tiles", Tiles.Create),
  ///new TestEntry("Dump Shell", DumpShell.Create),
  ///new TestEntry("Cantilever", Cantilever.Create),
  ///new TestEntry("Character Collision", CharacterCollision.Create),
  ///new TestEntry("Edge Test", EdgeTest.Create),
  ///new TestEntry("Body Types", BodyTypes.Create),
  ///new TestEntry("Shape Editing", ShapeEditing.Create),
  new TestEntry("Car", Car.Create),
  ///new TestEntry("Apply Force", ApplyForce.Create),
  ///new TestEntry("Prismatic", Prismatic.Create),
  ///new TestEntry("Vertical Stack", VerticalStack.Create),
  new TestEntry("SphereStack", SphereStack.Create),
  ///new TestEntry("Revolute", Revolute.Create),
  ///new TestEntry("Pulleys", Pulleys.Create),
  ///new TestEntry("Polygon Shapes", PolyShapes.Create),
  ///new TestEntry("Rope", Rope.Create),
  ///new TestEntry("Web", Web.Create),
  ///new TestEntry("RopeJoint", RopeJoint.Create),
  ///new TestEntry("One-Sided Platform", OneSidedPlatform.Create),
  ///new TestEntry("Pinball", Pinball.Create),
  ///new TestEntry("Bullet Test", BulletTest.Create),
  ///new TestEntry("Confined", Confined.Create),
  ///new TestEntry("Pyramid", Pyramid.Create),
  ///new TestEntry("Theo Jansen's Walker", TheoJansen.Create),
  ///new TestEntry("Edge Shapes", EdgeShapes.Create),
  ///new TestEntry("PolyCollision", PolyCollision.Create),
  ///new TestEntry("Bridge", Bridge.Create),
  ///new TestEntry("Breakable", Breakable.Create),
  ///new TestEntry("Chain", Chain.Create),
  ///new TestEntry("Collision Filtering", CollisionFiltering.Create),
  ///new TestEntry("Collision Processing", CollisionProcessing.Create),
  ///new TestEntry("Compound Shapes", CompoundShapes.Create),
  ///new TestEntry("Distance Test", DistanceTest.Create),
  ///new TestEntry("Dominos", Dominos.Create),
  ///new TestEntry("Dynamic Tree", DynamicTreeTest.Create),
  ///new TestEntry("Sensor Test", SensorTest.Create),
  ///new TestEntry("Slider Crank", SliderCrank.Create),
  ///new TestEntry("constying Friction", constyingFriction.Create),
  ///new TestEntry("Add Pair Stress Test", AddPair.Create),

  ///new TestEntry("Blob Test", BlobTest.Create),
  ///new TestEntry("Buoyancy Test", BuoyancyTest.Create),

  ///new TestEntry("Continuous Collision", TestCCD.Create),
  ///new TestEntry("Ragdolls", TestRagdoll.Create),
  ///new TestEntry("Stacked Boxes", TestStack.Create)
];
