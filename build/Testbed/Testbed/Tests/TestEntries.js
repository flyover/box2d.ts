"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const Test_1 = require("../Framework/Test");
const Soccer_1 = require("./Soccer");
///import { AddPair } from "./AddPair";
///import { ApplyForce } from "./ApplyForce";
///import { BodyTypes } from "./BodyTypes";
///import { Breakable } from "./Breakable";
///import { Bridge } from "./Bridge";
///import { BulletTest } from "./BulletTest";
///import { Cantilever } from "./Cantilever";
const Car_1 = require("./Car");
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
const MotorJoint2_1 = require("./MotorJoint2");
///import { OneSidedPlatform } from "./OneSidedPlatform";
///import { Pinball } from "./Pinball";
///import { PolyCollision } from "./PolyCollision";
///import { PolyShapes } from "./PolyShapes";
///import { Prismatic } from "./Prismatic";
///import { Pulleys } from "./Pulleys";
///import { Pyramid } from "./Pyramid";
const RayCast_1 = require("./RayCast");
///import { Revolute } from "./Revolute";
///import { Rope } from "./Rope";
///import { RopeJoint } from "./RopeJoint";
///import { SensorTest } from "./SensorTest";
///import { ShapeEditing } from "./ShapeEditing";
///import { SliderCrank } from "./SliderCrank";
const SphereStack_1 = require("./SphereStack");
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
const ElasticParticles_1 = require("./ElasticParticles");
const Faucet_1 = require("./Faucet");
const ParticlesSurfaceTension_1 = require("./ParticlesSurfaceTension");
const Sparky_1 = require("./Sparky");
///#endif
exports.g_testEntries = [
    ///#if B2_ENABLE_PARTICLE
    new Test_1.TestEntry("Faucet", Faucet_1.Faucet.Create),
    new Test_1.TestEntry("Surface Tension", ParticlesSurfaceTension_1.ParticlesSurfaceTension.Create),
    new Test_1.TestEntry("Elastic Particles", ElasticParticles_1.ElasticParticles.Create),
    new Test_1.TestEntry("Sparky", Sparky_1.Sparky.Create),
    ///#endif
    ///new TestEntry("Continuous Test", ContinuousTest.Create),
    ///new TestEntry("Time of Impact", TimeOfImpact.Create),
    ///new TestEntry("Motor Joint", MotorJoint.Create),
    new Test_1.TestEntry("Motor Joint (Bug #487)", MotorJoint2_1.MotorJoint2.Create),
    ///new TestEntry("Mobile", Mobile.Create),
    ///new TestEntry("MobileBalanced", MobileBalanced.Create),
    ///new TestEntry("Ray-Cast", RayCast.Create),
    new Test_1.TestEntry("Ray-Cast", RayCast_1.RayCast.Create),
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
    new Test_1.TestEntry("Car", Car_1.Car.Create),
    new Test_1.TestEntry("Soccer", Soccer_1.Soccer.Create),
    ///new TestEntry("Apply Force", ApplyForce.Create),
    ///new TestEntry("Prismatic", Prismatic.Create),
    ///new TestEntry("Vertical Stack", VerticalStack.Create),
    new Test_1.TestEntry("SphereStack", SphereStack_1.SphereStack.Create),
];
//# sourceMappingURL=TestEntries.js.map