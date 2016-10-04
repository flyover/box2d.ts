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

/// <reference path="../../../Box2D/Testbed/Framework/Test.ts"/>

// goog.require('box2d.Testbed.AddPair');
// goog.require('box2d.Testbed.ApplyForce');
// goog.require('box2d.Testbed.BodyTypes');
// goog.require('box2d.Testbed.Breakable');
// goog.require('box2d.Testbed.Bridge');
// goog.require('box2d.Testbed.BulletTest');
// goog.require('box2d.Testbed.Cantilever');
/// <reference path="../../../Box2D/Testbed/Tests/Car.ts"/>
// goog.require('box2d.Testbed.ContinuousTest');
// goog.require('box2d.Testbed.Chain');
// goog.require('box2d.Testbed.CharacterCollision');
// goog.require('box2d.Testbed.CollisionFiltering');
// goog.require('box2d.Testbed.CollisionProcessing');
// goog.require('box2d.Testbed.CompoundShapes');
// goog.require('box2d.Testbed.Confined');
// goog.require('box2d.Testbed.ConvexHull');
// goog.require('box2d.Testbed.ConveyorBelt');
// goog.require('box2d.Testbed.DistanceTest');
// goog.require('box2d.Testbed.Dominos');
// goog.require('box2d.Testbed.DumpShell');
// goog.require('box2d.Testbed.DynamicTreeTest');
// goog.require('box2d.Testbed.EdgeShapes');
// goog.require('box2d.Testbed.EdgeTest');
// goog.require('box2d.Testbed.Gears');
// goog.require('box2d.Testbed.Mobile');
// goog.require('box2d.Testbed.MobileBalanced');
// goog.require('box2d.Testbed.MotorJoint');
// goog.require('box2d.Testbed.OneSidedPlatform');
// goog.require('box2d.Testbed.Pinball');
// goog.require('box2d.Testbed.PolyCollision');
// goog.require('box2d.Testbed.PolyShapes');
// goog.require('box2d.Testbed.Prismatic');
// goog.require('box2d.Testbed.Pulleys');
// goog.require('box2d.Testbed.Pyramid');
// goog.require('box2d.Testbed.RayCast');
// goog.require('box2d.Testbed.Revolute');
// goog.require('box2d.Testbed.Rope');
// goog.require('box2d.Testbed.RopeJoint');
// goog.require('box2d.Testbed.SensorTest');
// goog.require('box2d.Testbed.ShapeEditing');
// goog.require('box2d.Testbed.SliderCrank');
/// <reference path="../../../Box2D/Testbed/Tests/SphereStack.ts"/>
// goog.require('box2d.Testbed.TheoJansen');
// goog.require('box2d.Testbed.Tiles');
// goog.require('box2d.Testbed.TimeOfImpact');
// goog.require('box2d.Testbed.Tumbler');
// goog.require('box2d.Testbed.constyingFriction');
// goog.require('box2d.Testbed.constyingRestitution');
// goog.require('box2d.Testbed.VerticalStack');
// goog.require('box2d.Testbed.Web');

// goog.require('box2d.Testbed.BlobTest');
// goog.require('box2d.Testbed.BuoyancyTest');

// goog.require('box2d.Testbed.TestCCD');
// goog.require('box2d.Testbed.TestRagdoll');
// goog.require('box2d.Testbed.TestStack');

namespace box2d.Testbed {

export function GetTestEntries(entries: TestEntry[]): TestEntry[] {
//  entries.push(new box2d.Testbed.TestEntry("Continuous Test", box2d.Testbed.ContinuousTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Time of Impact", box2d.Testbed.TimeOfImpact.Create));
//  entries.push(new box2d.Testbed.TestEntry("Motor Joint", box2d.Testbed.MotorJoint.Create));
//  entries.push(new box2d.Testbed.TestEntry("Mobile", box2d.Testbed.Mobile.Create));
//  entries.push(new box2d.Testbed.TestEntry("MobileBalanced", box2d.Testbed.MobileBalanced.Create));
//  entries.push(new box2d.Testbed.TestEntry("Ray-Cast", box2d.Testbed.RayCast.Create));
//  entries.push(new box2d.Testbed.TestEntry("Conveyor Belt", box2d.Testbed.ConveyorBelt.Create));
//  entries.push(new box2d.Testbed.TestEntry("Gears", box2d.Testbed.Gears.Create));
//  entries.push(new box2d.Testbed.TestEntry("Convex Hull", box2d.Testbed.ConvexHull.Create));
//  entries.push(new box2d.Testbed.TestEntry("constying Restitution", box2d.Testbed.constyingRestitution.Create));
//  entries.push(new box2d.Testbed.TestEntry("Tumbler", box2d.Testbed.Tumbler.Create));
//  entries.push(new box2d.Testbed.TestEntry("Tiles", box2d.Testbed.Tiles.Create));
//  entries.push(new box2d.Testbed.TestEntry("Dump Shell", box2d.Testbed.DumpShell.Create));
//  entries.push(new box2d.Testbed.TestEntry("Cantilever", box2d.Testbed.Cantilever.Create));
//  entries.push(new box2d.Testbed.TestEntry("Character Collision", box2d.Testbed.CharacterCollision.Create));
//  entries.push(new box2d.Testbed.TestEntry("Edge Test", box2d.Testbed.EdgeTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Body Types", box2d.Testbed.BodyTypes.Create));
//  entries.push(new box2d.Testbed.TestEntry("Shape Editing", box2d.Testbed.ShapeEditing.Create));
  entries.push(new box2d.Testbed.TestEntry("Car", box2d.Testbed.Car.Create));
//  entries.push(new box2d.Testbed.TestEntry("Apply Force", box2d.Testbed.ApplyForce.Create));
//  entries.push(new box2d.Testbed.TestEntry("Prismatic", box2d.Testbed.Prismatic.Create));
//  entries.push(new box2d.Testbed.TestEntry("Vertical Stack", box2d.Testbed.VerticalStack.Create));
  entries.push(new box2d.Testbed.TestEntry("SphereStack", box2d.Testbed.SphereStack.Create));
//  entries.push(new box2d.Testbed.TestEntry("Revolute", box2d.Testbed.Revolute.Create));
//  entries.push(new box2d.Testbed.TestEntry("Pulleys", box2d.Testbed.Pulleys.Create));
//  entries.push(new box2d.Testbed.TestEntry("Polygon Shapes", box2d.Testbed.PolyShapes.Create));
//  entries.push(new box2d.Testbed.TestEntry("Rope", box2d.Testbed.Rope.Create));
//  entries.push(new box2d.Testbed.TestEntry("Web", box2d.Testbed.Web.Create));
//  entries.push(new box2d.Testbed.TestEntry("RopeJoint", box2d.Testbed.RopeJoint.Create));
//  entries.push(new box2d.Testbed.TestEntry("One-Sided Platform", box2d.Testbed.OneSidedPlatform.Create));
//  entries.push(new box2d.Testbed.TestEntry("Pinball", box2d.Testbed.Pinball.Create));
//  entries.push(new box2d.Testbed.TestEntry("Bullet Test", box2d.Testbed.BulletTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Confined", box2d.Testbed.Confined.Create));
//  entries.push(new box2d.Testbed.TestEntry("Pyramid", box2d.Testbed.Pyramid.Create));
//  entries.push(new box2d.Testbed.TestEntry("Theo Jansen's Walker", box2d.Testbed.TheoJansen.Create));
//  entries.push(new box2d.Testbed.TestEntry("Edge Shapes", box2d.Testbed.EdgeShapes.Create));
//  entries.push(new box2d.Testbed.TestEntry("PolyCollision", box2d.Testbed.PolyCollision.Create));
//  entries.push(new box2d.Testbed.TestEntry("Bridge", box2d.Testbed.Bridge.Create));
//  entries.push(new box2d.Testbed.TestEntry("Breakable", box2d.Testbed.Breakable.Create));
//  entries.push(new box2d.Testbed.TestEntry("Chain", box2d.Testbed.Chain.Create));
//  entries.push(new box2d.Testbed.TestEntry("Collision Filtering", box2d.Testbed.CollisionFiltering.Create));
//  entries.push(new box2d.Testbed.TestEntry("Collision Processing", box2d.Testbed.CollisionProcessing.Create));
//  entries.push(new box2d.Testbed.TestEntry("Compound Shapes", box2d.Testbed.CompoundShapes.Create));
//  entries.push(new box2d.Testbed.TestEntry("Distance Test", box2d.Testbed.DistanceTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Dominos", box2d.Testbed.Dominos.Create));
//  entries.push(new box2d.Testbed.TestEntry("Dynamic Tree", box2d.Testbed.DynamicTreeTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Sensor Test", box2d.Testbed.SensorTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Slider Crank", box2d.Testbed.SliderCrank.Create));
//  entries.push(new box2d.Testbed.TestEntry("constying Friction", box2d.Testbed.constyingFriction.Create));
//  entries.push(new box2d.Testbed.TestEntry("Add Pair Stress Test", box2d.Testbed.AddPair.Create));

//  entries.push(new box2d.Testbed.TestEntry("Blob Test", box2d.Testbed.BlobTest.Create));
//  entries.push(new box2d.Testbed.TestEntry("Buoyancy Test", box2d.Testbed.BuoyancyTest.Create));

//  entries.push(new box2d.Testbed.TestEntry("Continuous Collision", box2d.Testbed.TestCCD.Create));
//  entries.push(new box2d.Testbed.TestEntry("Ragdolls", box2d.Testbed.TestRagdoll.Create));
//  entries.push(new box2d.Testbed.TestEntry("Stacked Boxes", box2d.Testbed.TestStack.Create));

  return entries;
}

} // namespace box2d.Testbed
