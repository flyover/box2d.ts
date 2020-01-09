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
System.register(["../Framework/Test.js", "./AddPair.js", "./ApplyForce.js", "./BasicSliderCrank.js", "./BodyTypes.js", "./Breakable.js", "./Bridge.js", "./BulletTest.js", "./Cantilever.js", "./Car.js", "./ContinuousTest.js", "./Chain.js", "./CharacterCollision.js", "./CollisionFiltering.js", "./CollisionProcessing.js", "./CompoundShapes.js", "./Confined.js", "./ConvexHull.js", "./ConveyorBelt.js", "./DistanceTest.js", "./Dominos.js", "./DumpShell.js", "./DynamicTreeTest.js", "./EdgeShapes.js", "./EdgeTest.js", "./Gears.js", "./HeavyOnLight.js", "./HeavyOnLightTwo.js", "./Mobile.js", "./MobileBalanced.js", "./MotorJoint.js", "./OneSidedPlatform.js", "./Pinball.js", "./PolyCollision.js", "./PolyShapes.js", "./Prismatic.js", "./Pulleys.js", "./Pyramid.js", "./RayCast.js", "./Revolute.js", "./RopeJoint.js", "./SensorTest.js", "./ShapeCast.js", "./ShapeEditing.js", "./Skier.js", "./SliderCrank.js", "./SphereStack.js", "./TheoJansen.js", "./Tiles.js", "./TimeOfImpact.js", "./Tumbler.js", "./VaryingFriction.js", "./VaryingRestitution.js", "./VerticalStack.js", "./Web.js", "./Rope.js", "./MotorJoint2.js", "./BlobTest.js", "./TestCCD.js", "./TestRagdoll.js", "./TestStack.js", "./PyramidTopple.js", "./DominoTower.js", "./TopdownCar.js", "./BuoyancyTest.js", "./Sandbox.js", "./Sparky.js", "./DamBreak.js", "./LiquidTimer.js", "./WaveMachine.js", "./Particles.js", "./Faucet.js", "./DrawingParticles.js", "./Soup.js", "./ParticlesSurfaceTension.js", "./ElasticParticles.js", "./RigidParticles.js", "./MultipleParticleSystems.js", "./Impulse.js", "./SoupStirrer.js", "./Fracker.js", "./Maxwell.js", "./Ramp.js", "./Pointy.js", "./AntiPointy.js", "./CornerCase.js", "./ParticleCollisionFilter.js", "./EyeCandy.js", "./Segway.js"], function (exports_1, context_1) {
    "use strict";
    var Test_js_1, AddPair_js_1, ApplyForce_js_1, BasicSliderCrank_js_1, BodyTypes_js_1, Breakable_js_1, Bridge_js_1, BulletTest_js_1, Cantilever_js_1, Car_js_1, ContinuousTest_js_1, Chain_js_1, CharacterCollision_js_1, CollisionFiltering_js_1, CollisionProcessing_js_1, CompoundShapes_js_1, Confined_js_1, ConvexHull_js_1, ConveyorBelt_js_1, DistanceTest_js_1, Dominos_js_1, DumpShell_js_1, DynamicTreeTest_js_1, EdgeShapes_js_1, EdgeTest_js_1, Gears_js_1, HeavyOnLight_js_1, HeavyOnLightTwo_js_1, Mobile_js_1, MobileBalanced_js_1, MotorJoint_js_1, OneSidedPlatform_js_1, Pinball_js_1, PolyCollision_js_1, PolyShapes_js_1, Prismatic_js_1, Pulleys_js_1, Pyramid_js_1, RayCast_js_1, Revolute_js_1, RopeJoint_js_1, SensorTest_js_1, ShapeCast_js_1, ShapeEditing_js_1, Skier_js_1, SliderCrank_js_1, SphereStack_js_1, TheoJansen_js_1, Tiles_js_1, TimeOfImpact_js_1, Tumbler_js_1, VaryingFriction_js_1, VaryingRestitution_js_1, VerticalStack_js_1, Web_js_1, Rope_js_1, MotorJoint2_js_1, BlobTest_js_1, TestCCD_js_1, TestRagdoll_js_1, TestStack_js_1, PyramidTopple_js_1, DominoTower_js_1, TopdownCar_js_1, BuoyancyTest_js_1, Sandbox_js_1, Sparky_js_1, DamBreak_js_1, LiquidTimer_js_1, WaveMachine_js_1, Particles_js_1, Faucet_js_1, DrawingParticles_js_1, Soup_js_1, ParticlesSurfaceTension_js_1, ElasticParticles_js_1, RigidParticles_js_1, MultipleParticleSystems_js_1, Impulse_js_1, SoupStirrer_js_1, Fracker_js_1, Maxwell_js_1, Ramp_js_1, Pointy_js_1, AntiPointy_js_1, CornerCase_js_1, ParticleCollisionFilter_js_1, EyeCandy_js_1, Segway_js_1, g_testEntries;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Test_js_1_1) {
                Test_js_1 = Test_js_1_1;
            },
            function (AddPair_js_1_1) {
                AddPair_js_1 = AddPair_js_1_1;
            },
            function (ApplyForce_js_1_1) {
                ApplyForce_js_1 = ApplyForce_js_1_1;
            },
            function (BasicSliderCrank_js_1_1) {
                BasicSliderCrank_js_1 = BasicSliderCrank_js_1_1;
            },
            function (BodyTypes_js_1_1) {
                BodyTypes_js_1 = BodyTypes_js_1_1;
            },
            function (Breakable_js_1_1) {
                Breakable_js_1 = Breakable_js_1_1;
            },
            function (Bridge_js_1_1) {
                Bridge_js_1 = Bridge_js_1_1;
            },
            function (BulletTest_js_1_1) {
                BulletTest_js_1 = BulletTest_js_1_1;
            },
            function (Cantilever_js_1_1) {
                Cantilever_js_1 = Cantilever_js_1_1;
            },
            function (Car_js_1_1) {
                Car_js_1 = Car_js_1_1;
            },
            function (ContinuousTest_js_1_1) {
                ContinuousTest_js_1 = ContinuousTest_js_1_1;
            },
            function (Chain_js_1_1) {
                Chain_js_1 = Chain_js_1_1;
            },
            function (CharacterCollision_js_1_1) {
                CharacterCollision_js_1 = CharacterCollision_js_1_1;
            },
            function (CollisionFiltering_js_1_1) {
                CollisionFiltering_js_1 = CollisionFiltering_js_1_1;
            },
            function (CollisionProcessing_js_1_1) {
                CollisionProcessing_js_1 = CollisionProcessing_js_1_1;
            },
            function (CompoundShapes_js_1_1) {
                CompoundShapes_js_1 = CompoundShapes_js_1_1;
            },
            function (Confined_js_1_1) {
                Confined_js_1 = Confined_js_1_1;
            },
            function (ConvexHull_js_1_1) {
                ConvexHull_js_1 = ConvexHull_js_1_1;
            },
            function (ConveyorBelt_js_1_1) {
                ConveyorBelt_js_1 = ConveyorBelt_js_1_1;
            },
            function (DistanceTest_js_1_1) {
                DistanceTest_js_1 = DistanceTest_js_1_1;
            },
            function (Dominos_js_1_1) {
                Dominos_js_1 = Dominos_js_1_1;
            },
            function (DumpShell_js_1_1) {
                DumpShell_js_1 = DumpShell_js_1_1;
            },
            function (DynamicTreeTest_js_1_1) {
                DynamicTreeTest_js_1 = DynamicTreeTest_js_1_1;
            },
            function (EdgeShapes_js_1_1) {
                EdgeShapes_js_1 = EdgeShapes_js_1_1;
            },
            function (EdgeTest_js_1_1) {
                EdgeTest_js_1 = EdgeTest_js_1_1;
            },
            function (Gears_js_1_1) {
                Gears_js_1 = Gears_js_1_1;
            },
            function (HeavyOnLight_js_1_1) {
                HeavyOnLight_js_1 = HeavyOnLight_js_1_1;
            },
            function (HeavyOnLightTwo_js_1_1) {
                HeavyOnLightTwo_js_1 = HeavyOnLightTwo_js_1_1;
            },
            function (Mobile_js_1_1) {
                Mobile_js_1 = Mobile_js_1_1;
            },
            function (MobileBalanced_js_1_1) {
                MobileBalanced_js_1 = MobileBalanced_js_1_1;
            },
            function (MotorJoint_js_1_1) {
                MotorJoint_js_1 = MotorJoint_js_1_1;
            },
            function (OneSidedPlatform_js_1_1) {
                OneSidedPlatform_js_1 = OneSidedPlatform_js_1_1;
            },
            function (Pinball_js_1_1) {
                Pinball_js_1 = Pinball_js_1_1;
            },
            function (PolyCollision_js_1_1) {
                PolyCollision_js_1 = PolyCollision_js_1_1;
            },
            function (PolyShapes_js_1_1) {
                PolyShapes_js_1 = PolyShapes_js_1_1;
            },
            function (Prismatic_js_1_1) {
                Prismatic_js_1 = Prismatic_js_1_1;
            },
            function (Pulleys_js_1_1) {
                Pulleys_js_1 = Pulleys_js_1_1;
            },
            function (Pyramid_js_1_1) {
                Pyramid_js_1 = Pyramid_js_1_1;
            },
            function (RayCast_js_1_1) {
                RayCast_js_1 = RayCast_js_1_1;
            },
            function (Revolute_js_1_1) {
                Revolute_js_1 = Revolute_js_1_1;
            },
            function (RopeJoint_js_1_1) {
                RopeJoint_js_1 = RopeJoint_js_1_1;
            },
            function (SensorTest_js_1_1) {
                SensorTest_js_1 = SensorTest_js_1_1;
            },
            function (ShapeCast_js_1_1) {
                ShapeCast_js_1 = ShapeCast_js_1_1;
            },
            function (ShapeEditing_js_1_1) {
                ShapeEditing_js_1 = ShapeEditing_js_1_1;
            },
            function (Skier_js_1_1) {
                Skier_js_1 = Skier_js_1_1;
            },
            function (SliderCrank_js_1_1) {
                SliderCrank_js_1 = SliderCrank_js_1_1;
            },
            function (SphereStack_js_1_1) {
                SphereStack_js_1 = SphereStack_js_1_1;
            },
            function (TheoJansen_js_1_1) {
                TheoJansen_js_1 = TheoJansen_js_1_1;
            },
            function (Tiles_js_1_1) {
                Tiles_js_1 = Tiles_js_1_1;
            },
            function (TimeOfImpact_js_1_1) {
                TimeOfImpact_js_1 = TimeOfImpact_js_1_1;
            },
            function (Tumbler_js_1_1) {
                Tumbler_js_1 = Tumbler_js_1_1;
            },
            function (VaryingFriction_js_1_1) {
                VaryingFriction_js_1 = VaryingFriction_js_1_1;
            },
            function (VaryingRestitution_js_1_1) {
                VaryingRestitution_js_1 = VaryingRestitution_js_1_1;
            },
            function (VerticalStack_js_1_1) {
                VerticalStack_js_1 = VerticalStack_js_1_1;
            },
            function (Web_js_1_1) {
                Web_js_1 = Web_js_1_1;
            },
            function (Rope_js_1_1) {
                Rope_js_1 = Rope_js_1_1;
            },
            function (MotorJoint2_js_1_1) {
                MotorJoint2_js_1 = MotorJoint2_js_1_1;
            },
            function (BlobTest_js_1_1) {
                BlobTest_js_1 = BlobTest_js_1_1;
            },
            function (TestCCD_js_1_1) {
                TestCCD_js_1 = TestCCD_js_1_1;
            },
            function (TestRagdoll_js_1_1) {
                TestRagdoll_js_1 = TestRagdoll_js_1_1;
            },
            function (TestStack_js_1_1) {
                TestStack_js_1 = TestStack_js_1_1;
            },
            function (PyramidTopple_js_1_1) {
                PyramidTopple_js_1 = PyramidTopple_js_1_1;
            },
            function (DominoTower_js_1_1) {
                DominoTower_js_1 = DominoTower_js_1_1;
            },
            function (TopdownCar_js_1_1) {
                TopdownCar_js_1 = TopdownCar_js_1_1;
            },
            function (BuoyancyTest_js_1_1) {
                BuoyancyTest_js_1 = BuoyancyTest_js_1_1;
            },
            function (Sandbox_js_1_1) {
                Sandbox_js_1 = Sandbox_js_1_1;
            },
            function (Sparky_js_1_1) {
                Sparky_js_1 = Sparky_js_1_1;
            },
            function (DamBreak_js_1_1) {
                DamBreak_js_1 = DamBreak_js_1_1;
            },
            function (LiquidTimer_js_1_1) {
                LiquidTimer_js_1 = LiquidTimer_js_1_1;
            },
            function (WaveMachine_js_1_1) {
                WaveMachine_js_1 = WaveMachine_js_1_1;
            },
            function (Particles_js_1_1) {
                Particles_js_1 = Particles_js_1_1;
            },
            function (Faucet_js_1_1) {
                Faucet_js_1 = Faucet_js_1_1;
            },
            function (DrawingParticles_js_1_1) {
                DrawingParticles_js_1 = DrawingParticles_js_1_1;
            },
            function (Soup_js_1_1) {
                Soup_js_1 = Soup_js_1_1;
            },
            function (ParticlesSurfaceTension_js_1_1) {
                ParticlesSurfaceTension_js_1 = ParticlesSurfaceTension_js_1_1;
            },
            function (ElasticParticles_js_1_1) {
                ElasticParticles_js_1 = ElasticParticles_js_1_1;
            },
            function (RigidParticles_js_1_1) {
                RigidParticles_js_1 = RigidParticles_js_1_1;
            },
            function (MultipleParticleSystems_js_1_1) {
                MultipleParticleSystems_js_1 = MultipleParticleSystems_js_1_1;
            },
            function (Impulse_js_1_1) {
                Impulse_js_1 = Impulse_js_1_1;
            },
            function (SoupStirrer_js_1_1) {
                SoupStirrer_js_1 = SoupStirrer_js_1_1;
            },
            function (Fracker_js_1_1) {
                Fracker_js_1 = Fracker_js_1_1;
            },
            function (Maxwell_js_1_1) {
                Maxwell_js_1 = Maxwell_js_1_1;
            },
            function (Ramp_js_1_1) {
                Ramp_js_1 = Ramp_js_1_1;
            },
            function (Pointy_js_1_1) {
                Pointy_js_1 = Pointy_js_1_1;
            },
            function (AntiPointy_js_1_1) {
                AntiPointy_js_1 = AntiPointy_js_1_1;
            },
            function (CornerCase_js_1_1) {
                CornerCase_js_1 = CornerCase_js_1_1;
            },
            function (ParticleCollisionFilter_js_1_1) {
                ParticleCollisionFilter_js_1 = ParticleCollisionFilter_js_1_1;
            },
            function (EyeCandy_js_1_1) {
                EyeCandy_js_1 = EyeCandy_js_1_1;
            },
            function (Segway_js_1_1) {
                Segway_js_1 = Segway_js_1_1;
            }
        ],
        execute: function () {
            exports_1("g_testEntries", g_testEntries = [
                // #if B2_ENABLE_PARTICLE
                new Test_js_1.TestEntry("Sparky", Sparky_js_1.Sparky.Create),
                // #endif
                new Test_js_1.TestEntry("Shape Cast", ShapeCast_js_1.ShapeCast.Create),
                new Test_js_1.TestEntry("Time of Impact", TimeOfImpact_js_1.TimeOfImpact.Create),
                new Test_js_1.TestEntry("Character Collision", CharacterCollision_js_1.CharacterCollision.Create),
                new Test_js_1.TestEntry("Tiles", Tiles_js_1.Tiles.Create),
                new Test_js_1.TestEntry("Heavy on Light", HeavyOnLight_js_1.HeavyOnLight.Create),
                new Test_js_1.TestEntry("Heavy on Light Two", HeavyOnLightTwo_js_1.HeavyOnLightTwo.Create),
                new Test_js_1.TestEntry("Vertical Stack", VerticalStack_js_1.VerticalStack.Create),
                new Test_js_1.TestEntry("Basic Slider Crank", BasicSliderCrank_js_1.BasicSliderCrank.Create),
                new Test_js_1.TestEntry("Slider Crank", SliderCrank_js_1.SliderCrank.Create),
                new Test_js_1.TestEntry("Sphere Stack", SphereStack_js_1.SphereStack.Create),
                new Test_js_1.TestEntry("Convex Hull", ConvexHull_js_1.ConvexHull.Create),
                new Test_js_1.TestEntry("Tumbler", Tumbler_js_1.Tumbler.Create),
                new Test_js_1.TestEntry("Ray-Cast", RayCast_js_1.RayCast.Create),
                new Test_js_1.TestEntry("Dump Shell", DumpShell_js_1.DumpShell.Create),
                new Test_js_1.TestEntry("Apply Force", ApplyForce_js_1.ApplyForce.Create),
                new Test_js_1.TestEntry("Continuous Test", ContinuousTest_js_1.ContinuousTest.Create),
                new Test_js_1.TestEntry("Motor Joint", MotorJoint_js_1.MotorJoint.Create),
                new Test_js_1.TestEntry("One-Sided Platform", OneSidedPlatform_js_1.OneSidedPlatform.Create),
                new Test_js_1.TestEntry("Mobile", Mobile_js_1.Mobile.Create),
                new Test_js_1.TestEntry("MobileBalanced", MobileBalanced_js_1.MobileBalanced.Create),
                new Test_js_1.TestEntry("Conveyor Belt", ConveyorBelt_js_1.ConveyorBelt.Create),
                new Test_js_1.TestEntry("Gears", Gears_js_1.Gears.Create),
                new Test_js_1.TestEntry("Varying Restitution", VaryingRestitution_js_1.VaryingRestitution.Create),
                new Test_js_1.TestEntry("Cantilever", Cantilever_js_1.Cantilever.Create),
                new Test_js_1.TestEntry("Edge Test", EdgeTest_js_1.EdgeTest.Create),
                new Test_js_1.TestEntry("Body Types", BodyTypes_js_1.BodyTypes.Create),
                new Test_js_1.TestEntry("Shape Editing", ShapeEditing_js_1.ShapeEditing.Create),
                new Test_js_1.TestEntry("Car", Car_js_1.Car.Create),
                new Test_js_1.TestEntry("Prismatic", Prismatic_js_1.Prismatic.Create),
                new Test_js_1.TestEntry("Revolute", Revolute_js_1.Revolute.Create),
                new Test_js_1.TestEntry("Pulleys", Pulleys_js_1.Pulleys.Create),
                new Test_js_1.TestEntry("Polygon Shapes", PolyShapes_js_1.PolyShapes.Create),
                new Test_js_1.TestEntry("Web", Web_js_1.Web.Create),
                new Test_js_1.TestEntry("RopeJoint", RopeJoint_js_1.RopeJoint.Create),
                new Test_js_1.TestEntry("Pinball", Pinball_js_1.Pinball.Create),
                new Test_js_1.TestEntry("Bullet Test", BulletTest_js_1.BulletTest.Create),
                new Test_js_1.TestEntry("Confined", Confined_js_1.Confined.Create),
                new Test_js_1.TestEntry("Pyramid", Pyramid_js_1.Pyramid.Create),
                new Test_js_1.TestEntry("Theo Jansen's Walker", TheoJansen_js_1.TheoJansen.Create),
                new Test_js_1.TestEntry("Edge Shapes", EdgeShapes_js_1.EdgeShapes.Create),
                new Test_js_1.TestEntry("PolyCollision", PolyCollision_js_1.PolyCollision.Create),
                new Test_js_1.TestEntry("Bridge", Bridge_js_1.Bridge.Create),
                new Test_js_1.TestEntry("Breakable", Breakable_js_1.Breakable.Create),
                new Test_js_1.TestEntry("Chain", Chain_js_1.Chain.Create),
                new Test_js_1.TestEntry("Collision Filtering", CollisionFiltering_js_1.CollisionFiltering.Create),
                new Test_js_1.TestEntry("Collision Processing", CollisionProcessing_js_1.CollisionProcessing.Create),
                new Test_js_1.TestEntry("Compound Shapes", CompoundShapes_js_1.CompoundShapes.Create),
                new Test_js_1.TestEntry("Distance Test", DistanceTest_js_1.DistanceTest.Create),
                new Test_js_1.TestEntry("Dominos", Dominos_js_1.Dominos.Create),
                new Test_js_1.TestEntry("Dynamic Tree", DynamicTreeTest_js_1.DynamicTreeTest.Create),
                new Test_js_1.TestEntry("Sensor Test", SensorTest_js_1.SensorTest.Create),
                new Test_js_1.TestEntry("Varying Friction", VaryingFriction_js_1.VaryingFriction.Create),
                new Test_js_1.TestEntry("Add Pair Stress Test", AddPair_js_1.AddPair.Create),
                new Test_js_1.TestEntry("Skier", Skier_js_1.Skier.Create),
                new Test_js_1.TestEntry("Rope", Rope_js_1.Rope.Create),
                new Test_js_1.TestEntry("Motor Joint (Bug #487)", MotorJoint2_js_1.MotorJoint2.Create),
                new Test_js_1.TestEntry("Blob Test", BlobTest_js_1.BlobTest.Create),
                new Test_js_1.TestEntry("Continuous Collision", TestCCD_js_1.TestCCD.Create),
                new Test_js_1.TestEntry("Ragdolls", TestRagdoll_js_1.TestRagdoll.Create),
                new Test_js_1.TestEntry("Stacked Boxes", TestStack_js_1.TestStack.Create),
                new Test_js_1.TestEntry("Pyramid Topple", PyramidTopple_js_1.PyramidTopple.Create),
                new Test_js_1.TestEntry("Domino Tower", DominoTower_js_1.DominoTower.Create),
                new Test_js_1.TestEntry("TopDown Car", TopdownCar_js_1.TopdownCar.Create),
                // #if B2_ENABLE_CONTROLLER
                new Test_js_1.TestEntry("Buoyancy Test", BuoyancyTest_js_1.BuoyancyTest.Create),
                // #endif
                // #if B2_ENABLE_PARTICLE
                new Test_js_1.TestEntry("Sandbox", Sandbox_js_1.Sandbox.Create),
                // new TestEntry("Sparky", Sparky.Create),
                new Test_js_1.TestEntry("DamBreak", DamBreak_js_1.DamBreak.Create),
                new Test_js_1.TestEntry("Liquid Timer", LiquidTimer_js_1.LiquidTimer.Create),
                new Test_js_1.TestEntry("Wave Machine", WaveMachine_js_1.WaveMachine.Create),
                new Test_js_1.TestEntry("Particles", Particles_js_1.Particles.Create),
                new Test_js_1.TestEntry("Faucet", Faucet_js_1.Faucet.Create),
                new Test_js_1.TestEntry("Particle Drawing", DrawingParticles_js_1.DrawingParticles.Create),
                new Test_js_1.TestEntry("Soup", Soup_js_1.Soup.Create),
                new Test_js_1.TestEntry("Surface Tension", ParticlesSurfaceTension_js_1.ParticlesSurfaceTension.Create),
                new Test_js_1.TestEntry("Elastic Particles", ElasticParticles_js_1.ElasticParticles.Create),
                new Test_js_1.TestEntry("Rigid Particles", RigidParticles_js_1.RigidParticles.Create),
                new Test_js_1.TestEntry("Multiple Systems", MultipleParticleSystems_js_1.MultipleParticleSystems.Create),
                new Test_js_1.TestEntry("Impulse", Impulse_js_1.Impulse.Create),
                new Test_js_1.TestEntry("Soup Stirrer", SoupStirrer_js_1.SoupStirrer.Create),
                new Test_js_1.TestEntry("Fracker", Fracker_js_1.Fracker.Create),
                new Test_js_1.TestEntry("Maxwell", Maxwell_js_1.Maxwell.Create),
                new Test_js_1.TestEntry("Ramp", Ramp_js_1.Ramp.Create),
                new Test_js_1.TestEntry("Pointy", Pointy_js_1.Pointy.Create),
                new Test_js_1.TestEntry("AntiPointy", AntiPointy_js_1.AntiPointy.Create),
                new Test_js_1.TestEntry("Corner Case", CornerCase_js_1.CornerCase.Create),
                new Test_js_1.TestEntry("Particle Collisions", ParticleCollisionFilter_js_1.ParticleCollisionFilter.Create),
                new Test_js_1.TestEntry("Eye Candy", EyeCandy_js_1.EyeCandy.Create),
                // #endif
                new Test_js_1.TestEntry("Segway", Segway_js_1.Segway.Create),
            ]);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdEVudHJpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUZXN0RW50cmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBc0dGLDJCQUFhLGFBQWEsR0FBZ0I7Z0JBQ3hDLHlCQUF5QjtnQkFDekIsSUFBSSxtQkFBUyxDQUFDLFFBQVEsRUFBRSxrQkFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsU0FBUztnQkFFVCxJQUFJLG1CQUFTLENBQUMsWUFBWSxFQUFFLHdCQUFTLENBQUMsTUFBTSxDQUFDO2dCQUM3QyxJQUFJLG1CQUFTLENBQUMsZ0JBQWdCLEVBQUUsOEJBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ3BELElBQUksbUJBQVMsQ0FBQyxxQkFBcUIsRUFBRSwwQ0FBa0IsQ0FBQyxNQUFNLENBQUM7Z0JBQy9ELElBQUksbUJBQVMsQ0FBQyxPQUFPLEVBQUUsZ0JBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLElBQUksbUJBQVMsQ0FBQyxnQkFBZ0IsRUFBRSw4QkFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDcEQsSUFBSSxtQkFBUyxDQUFDLG9CQUFvQixFQUFFLG9DQUFlLENBQUMsTUFBTSxDQUFDO2dCQUMzRCxJQUFJLG1CQUFTLENBQUMsZ0JBQWdCLEVBQUUsZ0NBQWEsQ0FBQyxNQUFNLENBQUM7Z0JB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