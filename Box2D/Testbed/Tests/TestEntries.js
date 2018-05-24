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
System.register(["../Framework/Test", "./AddPair", "./ApplyForce", "./BodyTypes", "./Breakable", "./Bridge", "./BulletTest", "./Cantilever", "./Car", "./ContinuousTest", "./Chain", "./CharacterCollision", "./CompoundShapes", "./Confined", "./ConvexHull", "./ConveyorBelt", "./DistanceTest", "./Dominos", "./DynamicTreeTest", "./EdgeShapes", "./EdgeTest", "./Gears", "./Mobile", "./MobileBalanced", "./MotorJoint", "./MotorJoint2", "./OneSidedPlatform", "./PolyCollision", "./PolyShapes", "./Prismatic", "./Pulleys", "./Pyramid", "./RayCast", "./Revolute", "./Rope", "./RopeJoint", "./SensorTest", "./ShapeEditing", "./SphereStack", "./TimeOfImpact", "./Tumbler", "./VerticalStack", "./Web", "./BlobTest", "./BuoyancyTest", "./TestCCD", "./TestRagdoll", "./TestStack", "./ElasticParticles", "./Faucet", "./ParticlesSurfaceTension", "./Sparky"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Test_1, AddPair_1, ApplyForce_1, BodyTypes_1, Breakable_1, Bridge_1, BulletTest_1, Cantilever_1, Car_1, ContinuousTest_1, Chain_1, CharacterCollision_1, CompoundShapes_1, Confined_1, ConvexHull_1, ConveyorBelt_1, DistanceTest_1, Dominos_1, DynamicTreeTest_1, EdgeShapes_1, EdgeTest_1, Gears_1, Mobile_1, MobileBalanced_1, MotorJoint_1, MotorJoint2_1, OneSidedPlatform_1, PolyCollision_1, PolyShapes_1, Prismatic_1, Pulleys_1, Pyramid_1, RayCast_1, Revolute_1, Rope_1, RopeJoint_1, SensorTest_1, ShapeEditing_1, SphereStack_1, TimeOfImpact_1, Tumbler_1, VerticalStack_1, Web_1, BlobTest_1, BuoyancyTest_1, TestCCD_1, TestRagdoll_1, TestStack_1, ElasticParticles_1, Faucet_1, ParticlesSurfaceTension_1, Sparky_1, g_testEntries;
    return {
        setters: [
            function (Test_1_1) {
                Test_1 = Test_1_1;
            },
            function (AddPair_1_1) {
                AddPair_1 = AddPair_1_1;
            },
            function (ApplyForce_1_1) {
                ApplyForce_1 = ApplyForce_1_1;
            },
            function (BodyTypes_1_1) {
                BodyTypes_1 = BodyTypes_1_1;
            },
            function (Breakable_1_1) {
                Breakable_1 = Breakable_1_1;
            },
            function (Bridge_1_1) {
                Bridge_1 = Bridge_1_1;
            },
            function (BulletTest_1_1) {
                BulletTest_1 = BulletTest_1_1;
            },
            function (Cantilever_1_1) {
                Cantilever_1 = Cantilever_1_1;
            },
            function (Car_1_1) {
                Car_1 = Car_1_1;
            },
            function (ContinuousTest_1_1) {
                ContinuousTest_1 = ContinuousTest_1_1;
            },
            function (Chain_1_1) {
                Chain_1 = Chain_1_1;
            },
            function (CharacterCollision_1_1) {
                CharacterCollision_1 = CharacterCollision_1_1;
            },
            function (CompoundShapes_1_1) {
                CompoundShapes_1 = CompoundShapes_1_1;
            },
            function (Confined_1_1) {
                Confined_1 = Confined_1_1;
            },
            function (ConvexHull_1_1) {
                ConvexHull_1 = ConvexHull_1_1;
            },
            function (ConveyorBelt_1_1) {
                ConveyorBelt_1 = ConveyorBelt_1_1;
            },
            function (DistanceTest_1_1) {
                DistanceTest_1 = DistanceTest_1_1;
            },
            function (Dominos_1_1) {
                Dominos_1 = Dominos_1_1;
            },
            function (DynamicTreeTest_1_1) {
                DynamicTreeTest_1 = DynamicTreeTest_1_1;
            },
            function (EdgeShapes_1_1) {
                EdgeShapes_1 = EdgeShapes_1_1;
            },
            function (EdgeTest_1_1) {
                EdgeTest_1 = EdgeTest_1_1;
            },
            function (Gears_1_1) {
                Gears_1 = Gears_1_1;
            },
            function (Mobile_1_1) {
                Mobile_1 = Mobile_1_1;
            },
            function (MobileBalanced_1_1) {
                MobileBalanced_1 = MobileBalanced_1_1;
            },
            function (MotorJoint_1_1) {
                MotorJoint_1 = MotorJoint_1_1;
            },
            function (MotorJoint2_1_1) {
                MotorJoint2_1 = MotorJoint2_1_1;
            },
            function (OneSidedPlatform_1_1) {
                OneSidedPlatform_1 = OneSidedPlatform_1_1;
            },
            function (PolyCollision_1_1) {
                PolyCollision_1 = PolyCollision_1_1;
            },
            function (PolyShapes_1_1) {
                PolyShapes_1 = PolyShapes_1_1;
            },
            function (Prismatic_1_1) {
                Prismatic_1 = Prismatic_1_1;
            },
            function (Pulleys_1_1) {
                Pulleys_1 = Pulleys_1_1;
            },
            function (Pyramid_1_1) {
                Pyramid_1 = Pyramid_1_1;
            },
            function (RayCast_1_1) {
                RayCast_1 = RayCast_1_1;
            },
            function (Revolute_1_1) {
                Revolute_1 = Revolute_1_1;
            },
            function (Rope_1_1) {
                Rope_1 = Rope_1_1;
            },
            function (RopeJoint_1_1) {
                RopeJoint_1 = RopeJoint_1_1;
            },
            function (SensorTest_1_1) {
                SensorTest_1 = SensorTest_1_1;
            },
            function (ShapeEditing_1_1) {
                ShapeEditing_1 = ShapeEditing_1_1;
            },
            function (SphereStack_1_1) {
                SphereStack_1 = SphereStack_1_1;
            },
            function (TimeOfImpact_1_1) {
                TimeOfImpact_1 = TimeOfImpact_1_1;
            },
            function (Tumbler_1_1) {
                Tumbler_1 = Tumbler_1_1;
            },
            function (VerticalStack_1_1) {
                VerticalStack_1 = VerticalStack_1_1;
            },
            function (Web_1_1) {
                Web_1 = Web_1_1;
            },
            function (BlobTest_1_1) {
                BlobTest_1 = BlobTest_1_1;
            },
            function (BuoyancyTest_1_1) {
                BuoyancyTest_1 = BuoyancyTest_1_1;
            },
            function (TestCCD_1_1) {
                TestCCD_1 = TestCCD_1_1;
            },
            function (TestRagdoll_1_1) {
                TestRagdoll_1 = TestRagdoll_1_1;
            },
            function (TestStack_1_1) {
                TestStack_1 = TestStack_1_1;
            },
            function (ElasticParticles_1_1) {
                ElasticParticles_1 = ElasticParticles_1_1;
            },
            function (Faucet_1_1) {
                Faucet_1 = Faucet_1_1;
            },
            function (ParticlesSurfaceTension_1_1) {
                ParticlesSurfaceTension_1 = ParticlesSurfaceTension_1_1;
            },
            function (Sparky_1_1) {
                Sparky_1 = Sparky_1_1;
            }
        ],
        execute: function () {
            ///#endif
            exports_1("g_testEntries", g_testEntries = [
                ///#if B2_ENABLE_PARTICLE
                new Test_1.TestEntry("Faucet", Faucet_1.Faucet.Create),
                new Test_1.TestEntry("Surface Tension", ParticlesSurfaceTension_1.ParticlesSurfaceTension.Create),
                new Test_1.TestEntry("Elastic Particles", ElasticParticles_1.ElasticParticles.Create),
                new Test_1.TestEntry("Sparky", Sparky_1.Sparky.Create),
                ///#endif
                new Test_1.TestEntry("Continuous Test", ContinuousTest_1.ContinuousTest.Create),
                new Test_1.TestEntry("Time of Impact", TimeOfImpact_1.TimeOfImpact.Create),
                new Test_1.TestEntry("Motor Joint", MotorJoint_1.MotorJoint.Create),
                new Test_1.TestEntry("Motor Joint (Bug #487)", MotorJoint2_1.MotorJoint2.Create),
                new Test_1.TestEntry("Mobile", Mobile_1.Mobile.Create),
                new Test_1.TestEntry("MobileBalanced", MobileBalanced_1.MobileBalanced.Create),
                new Test_1.TestEntry("Ray-Cast", RayCast_1.RayCast.Create),
                new Test_1.TestEntry("Conveyor Belt", ConveyorBelt_1.ConveyorBelt.Create),
                new Test_1.TestEntry("Gears", Gears_1.Gears.Create),
                new Test_1.TestEntry("Convex Hull", ConvexHull_1.ConvexHull.Create),
                // new TestEntry("Varying Restitution", VaryingRestitution.Create),
                new Test_1.TestEntry("Tumbler", Tumbler_1.Tumbler.Create),
                // new TestEntry("Tiles", Tiles.Create),
                // new TestEntry("Dump Shell", DumpShell.Create),
                new Test_1.TestEntry("Cantilever", Cantilever_1.Cantilever.Create),
                new Test_1.TestEntry("Character Collision", CharacterCollision_1.CharacterCollision.Create),
                new Test_1.TestEntry("Edge Test", EdgeTest_1.EdgeTest.Create),
                new Test_1.TestEntry("Body Types", BodyTypes_1.BodyTypes.Create),
                new Test_1.TestEntry("Shape Editing", ShapeEditing_1.ShapeEditing.Create),
                new Test_1.TestEntry("Car", Car_1.Car.Create),
                new Test_1.TestEntry("Apply Force", ApplyForce_1.ApplyForce.Create),
                new Test_1.TestEntry("Prismatic", Prismatic_1.Prismatic.Create),
                new Test_1.TestEntry("Vertical Stack", VerticalStack_1.VerticalStack.Create),
                new Test_1.TestEntry("SphereStack", SphereStack_1.SphereStack.Create),
                new Test_1.TestEntry("Revolute", Revolute_1.Revolute.Create),
                new Test_1.TestEntry("Pulleys", Pulleys_1.Pulleys.Create),
                new Test_1.TestEntry("Polygon Shapes", PolyShapes_1.PolyShapes.Create),
                new Test_1.TestEntry("Rope", Rope_1.Rope.Create),
                new Test_1.TestEntry("Web", Web_1.Web.Create),
                new Test_1.TestEntry("RopeJoint", RopeJoint_1.RopeJoint.Create),
                new Test_1.TestEntry("One-Sided Platform", OneSidedPlatform_1.OneSidedPlatform.Create),
                // new TestEntry("Pinball", Pinball.Create),
                new Test_1.TestEntry("Bullet Test", BulletTest_1.BulletTest.Create),
                new Test_1.TestEntry("Confined", Confined_1.Confined.Create),
                new Test_1.TestEntry("Pyramid", Pyramid_1.Pyramid.Create),
                // new TestEntry("Theo Jansen's Walker", TheoJansen.Create),
                new Test_1.TestEntry("Edge Shapes", EdgeShapes_1.EdgeShapes.Create),
                new Test_1.TestEntry("PolyCollision", PolyCollision_1.PolyCollision.Create),
                new Test_1.TestEntry("Bridge", Bridge_1.Bridge.Create),
                new Test_1.TestEntry("Breakable", Breakable_1.Breakable.Create),
                new Test_1.TestEntry("Chain", Chain_1.Chain.Create),
                // new TestEntry("Collision Filtering", CollisionFiltering.Create),
                // new TestEntry("Collision Processing", CollisionProcessing.Create),
                new Test_1.TestEntry("Compound Shapes", CompoundShapes_1.CompoundShapes.Create),
                new Test_1.TestEntry("Distance Test", DistanceTest_1.DistanceTest.Create),
                new Test_1.TestEntry("Dominos", Dominos_1.Dominos.Create),
                new Test_1.TestEntry("Dynamic Tree", DynamicTreeTest_1.DynamicTreeTest.Create),
                new Test_1.TestEntry("Sensor Test", SensorTest_1.SensorTest.Create),
                // new TestEntry("Slider Crank", SliderCrank.Create),
                // new TestEntry("Varying Friction", VaryyingFriction.Create),
                new Test_1.TestEntry("Add Pair Stress Test", AddPair_1.AddPair.Create),
                new Test_1.TestEntry("Blob Test", BlobTest_1.BlobTest.Create),
                new Test_1.TestEntry("Buoyancy Test", BuoyancyTest_1.BuoyancyTest.Create),
                new Test_1.TestEntry("Continuous Collision", TestCCD_1.TestCCD.Create),
                new Test_1.TestEntry("Ragdolls", TestRagdoll_1.TestRagdoll.Create),
                new Test_1.TestEntry("Stacked Boxes", TestStack_1.TestStack.Create)
            ]);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdEVudHJpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUZXN0RW50cmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBb0VGLFNBQVM7WUFFVCwyQkFBYSxhQUFhLEdBQWdCO2dCQUN4Qyx5QkFBeUI7Z0JBQ3pCLElBQUksZ0JBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sQ0FBRTtnQkFDdkMsSUFBSSxnQkFBUyxDQUFDLGlCQUFpQixFQUFFLGlEQUF1QixDQUFDLE1BQU0sQ0FBQztnQkFDaEUsSUFBSSxnQkFBUyxDQUFDLG1CQUFtQixFQUFFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQztnQkFDM0QsSUFBSSxnQkFBUyxDQUFDLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN0QyxTQUFTO2dCQUNULElBQUksZ0JBQVMsQ0FBQyxpQkFBaUIsRUFBRSwrQkFBYyxDQUFDLE1BQU0sQ0FBQztnQkFDdkQsSUFBSSxnQkFBUyxDQUFDLGdCQUFnQixFQUFFLDJCQUFZLENBQUMsTUFBTSxDQUFDO2dCQUNwRCxJQUFJLGdCQUFTLENBQUMsYUFBYSxFQUFFLHVCQUFVLENBQUMsTUFBTSxDQUFDO2dCQUMvQyxJQUFJLGdCQUFTLENBQUMsd0JBQXdCLEVBQUUseUJBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQzNELElBQUksZ0JBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsSUFBSSxnQkFBUyxDQUFDLGdCQUFnQixFQUFFLCtCQUFjLENBQUMsTUFBTSxD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