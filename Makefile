#
# Copyright (c) Flyover Games, LLC
#

SHELL := /usr/bin/env bash

ANSI_NONE    = "\e[1;0m"
ANSI_BLACK   = "\e[1;30m"
ANSI_RED     = "\e[1;31m"
ANSI_GREEN   = "\e[1;32m"
ANSI_YELLOW  = "\e[1;33m"
ANSI_BLUE    = "\e[1;34m"
ANSI_MAGENTA = "\e[1;35m"
ANSI_CYAN    = "\e[1;36m"
ANSI_WHITE   = "\e[1;37m"

PATH := $(shell npm bin):$(PATH)

DONE = @printf "done: "$(ANSI_GREEN)"%s"$(ANSI_NONE)"\n" $@

all: help

help:
	@echo $(PATH)
	@printf "usage:\n"
	@printf "$$ make <"$(ANSI_YELLOW)"target"$(ANSI_NONE)">\n"
	@printf "target:\n"
	@printf " "$(ANSI_YELLOW)"clean"$(ANSI_NONE)" : clean project\n"
	@printf " "$(ANSI_YELLOW)"build"$(ANSI_NONE)" : build project\n"

# box2d

BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Box2D.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2Settings.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2Math.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2Draw.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2Timer.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2GrowableStack.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2BlockAllocator.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Common/b2StackAllocator.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2Collision.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2Distance.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2BroadPhase.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2DynamicTree.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2TimeOfImpact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2CollideCircle.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2CollidePolygon.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/b2CollideEdge.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/Shapes/b2Shape.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/Shapes/b2CircleShape.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Collision/Shapes/b2ChainShape.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2Fixture.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2Body.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2World.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2WorldCallbacks.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2Island.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2TimeStep.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/b2ContactManager.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2Contact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2ContactFactory.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2CircleContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2PolygonContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2Joint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2AreaJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2DistanceJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2FrictionJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2GearJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2MotorJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2MouseJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2RopeJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2WeldJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Dynamics/Joints/b2WheelJoint.ts
BOX2D_SOURCE_TS_FILES += Box2D/Box2D/Rope/b2Rope.ts

BOX2D_OUTPUT_JS_FILE     = Box2D/Build/Box2D/box2d.js
BOX2D_OUTPUT_D_TS_FILE   = Box2D/Build/Box2D/box2d.d.ts
BOX2D_OUTPUT_JS_MAP_FILE = Box2D/Build/Box2D/box2d.js.map

clean: clean-box2d
clean: clean-box2d-helloworld
clean: clean-box2d-testbed

build: build-box2d
build: build-box2d-helloworld
build: build-box2d-testbed

clean-box2d:
	@rm -f $(BOX2D_OUTPUT_JS_FILE)
	@rm -f $(BOX2D_OUTPUT_D_TS_FILE)
	@rm -f $(BOX2D_OUTPUT_JS_MAP_FILE)
	$(DONE)

build-box2d: $(BOX2D_OUTPUT_JS_FILE)
#	@$$(npm bin)/tsc -p Box2D/HelloWorld
#	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module commonjs --outDir build/Box2D $(BOX2D_SOURCE_TS_FILES)
	$(DONE)

$(BOX2D_OUTPUT_JS_FILE): $(BOX2D_SOURCE_TS_FILES)
	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module system --outFile $@ $<
	$(DONE)

# box2d-helloworld

BOX2D_HELLOWORLD_SOURCE_TS_FILES += Box2D/HelloWorld/HelloWorld.ts

BOX2D_HELLOWORLD_OUTPUT_JS_FILE     = Box2D/Build/HelloWorld/box2d-helloworld.js
BOX2D_HELLOWORLD_OUTPUT_D_TS_FILE   = Box2D/Build/HelloWorld/box2d-helloworld.d.ts
BOX2D_HELLOWORLD_OUTPUT_JS_MAP_FILE = Box2D/Build/HelloWorld/box2d-helloworld.js.map

clean-box2d-helloworld:
	@rm -f $(BOX2D_HELLOWORLD_OUTPUT_JS_FILE)
	@rm -f $(BOX2D_HELLOWORLD_OUTPUT_D_TS_FILE)
	@rm -f $(BOX2D_HELLOWORLD_OUTPUT_JS_MAP_FILE)
	$(DONE)

build-box2d-helloworld: $(BOX2D_HELLOWORLD_OUTPUT_JS_FILE)
#	@$$(npm bin)/tsc -p Box2D/HelloWorld
#	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module commonjs --outDir build/HelloWorld $(BOX2D_HELLOWORLD_SOURCE_TS_FILES)
	$(DONE)

$(BOX2D_HELLOWORLD_OUTPUT_JS_FILE): $(BOX2D_HELLOWORLD_SOURCE_TS_FILES)
	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module system --outFile $@ $<
	$(DONE)

# box2d-testbed

BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Testbed.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Framework/Main.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Framework/DebugDraw.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Framework/Test.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TestEntries.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/AddPair.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/ApplyForce.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/BlobTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/BodyTypes.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Breakable.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Bridge.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/BulletTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/BuoyancyTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Cantilever.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Car.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Chain.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/CharacterCollision.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/CollisionFiltering.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/CollisionProcessing.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/CompoundShapes.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Confined.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/ContinuousTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/ConvexHull.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/ConveyorBelt.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/DistanceTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Dominos.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/DumpShell.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/DynamicTreeTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/EdgeShapes.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/EdgeTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Gears.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Mobile.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/MobileBalanced.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/MotorJoint.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/MotorJoint2.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/OneSidedPlatform.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Pinball.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/PolyCollision.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/PolyShapes.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Prismatic.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Pulleys.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Pyramid.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/RayCast.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Revolute.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Rope.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/RopeJoint.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/SensorTest.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/ShapeEditing.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/SliderCrank.ts
BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/SphereStack.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TestCCD.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TestRagdoll.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TestStack.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TheoJansen.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Tiles.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/TimeOfImpact.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Tumbler.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/VaryingFriction.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/VaryingRestitution.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/VerticalStack.ts
#BOX2D_TESTBED_SOURCE_TS_FILES += Box2D/Testbed/Tests/Web.ts

BOX2D_TESTBED_OUTPUT_JS_FILE     = Box2D/Build/Testbed/box2d-testbed.js
BOX2D_TESTBED_OUTPUT_D_TS_FILE   = Box2D/Build/Testbed/box2d-testbed.d.ts
BOX2D_TESTBED_OUTPUT_JS_MAP_FILE = Box2D/Build/Testbed/box2d-testbed.js.map

clean-box2d-testbed:
	@rm -f $(BOX2D_TESTBED_OUTPUT_JS_FILE)
	@rm -f $(BOX2D_TESTBED_OUTPUT_D_TS_FILE)
	@rm -f $(BOX2D_TESTBED_OUTPUT_JS_MAP_FILE)
	$(DONE)

build-box2d-testbed: $(BOX2D_TESTBED_OUTPUT_JS_FILE)
#	@$$(npm bin)/tsc -p Box2D/Testbed
#	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module commonjs --outDir build/Testbed $(BOX2D_TESTBED_SOURCE_TS_FILES)
	$(DONE)

$(BOX2D_TESTBED_OUTPUT_JS_FILE): $(BOX2D_TESTBED_SOURCE_TS_FILES)
	@$$(npm bin)/tsc --declaration --sourcemap --target ES2016 --module system --outFile $@ $<
	$(DONE)
