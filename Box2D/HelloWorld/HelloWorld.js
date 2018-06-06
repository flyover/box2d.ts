/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
System.register(["../Box2D/Common/b2Math", "../Box2D/Dynamics/b2World", "../Box2D/Dynamics/b2Body", "../Box2D/Dynamics/b2Fixture", "../Box2D/Collision/Shapes/b2PolygonShape"], function (exports_1, context_1) {
    "use strict";
    var b2Math_1, b2World_1, b2Body_1, b2Fixture_1, b2PolygonShape_1;
    var __moduleName = context_1 && context_1.id;
    // This is a simple example of building and running a simulation
    // using Box2D. Here we create a large ground box and a small dynamic
    // box.
    // There are no graphics for this example. Box2D is meant to be used
    // with your rendering engine in your game engine.
    function main() {
        // Define the gravity vector.
        const gravity = new b2Math_1.b2Vec2(0, -10);
        // Construct a world object, which will hold and simulate the rigid bodies.
        const world = new b2World_1.b2World(gravity);
        // Define the ground body.
        const groundBodyDef = new b2Body_1.b2BodyDef();
        groundBodyDef.position.Set(0, -10);
        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        const groundBody = world.CreateBody(groundBodyDef);
        // Define the ground box shape.
        const groundBox = new b2PolygonShape_1.b2PolygonShape();
        // The extents are the half-widths of the box.
        groundBox.SetAsBox(50, 10);
        // Add the ground fixture to the ground body.
        groundBody.CreateFixture(groundBox, 0);
        // Define the dynamic body. We set its position and call the body factory.
        const bodyDef = new b2Body_1.b2BodyDef();
        bodyDef.type = b2Body_1.b2BodyType.b2_dynamicBody;
        bodyDef.position.Set(0, 4);
        const body = world.CreateBody(bodyDef);
        // Define another box shape for our dynamic body.
        const dynamicBox = new b2PolygonShape_1.b2PolygonShape();
        dynamicBox.SetAsBox(1, 1);
        // Define the dynamic body fixture.
        const fixtureDef = new b2Fixture_1.b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        // Set the box density to be non-zero, so it will be dynamic.
        fixtureDef.density = 1;
        // Override the default friction.
        fixtureDef.friction = 0.3;
        // Add the shape to the body.
        const fixture = body.CreateFixture(fixtureDef);
        // Prepare for simulation. Typically we use a time step of 1/60 of a
        // second (60Hz) and 10 iterations. This provides a high quality simulation
        // in most game scenarios.
        const timeStep = 1 / 60;
        const velocityIterations = 6;
        const positionIterations = 2;
        // This is our little game loop.
        for (let i = 0; i < 60; ++i) {
            // Instruct the world to perform a single step of simulation.
            // It is generally best to keep the time step and iterations fixed.
            world.Step(timeStep, velocityIterations, positionIterations);
            // Now print the position and angle of the body.
            const position = body.GetPosition();
            const angle = body.GetAngle();
            console.log(position.x.toFixed(2), position.y.toFixed(2), angle.toFixed(2));
        }
        // When the world destructor is called, all bodies and joints are freed. This can
        // create orphaned pointers, so be careful about your world management.
        body.DestroyFixture(fixture);
        world.DestroyBody(body);
        return 0;
    }
    exports_1("main", main);
    return {
        setters: [
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2World_1_1) {
                b2World_1 = b2World_1_1;
            },
            function (b2Body_1_1) {
                b2Body_1 = b2Body_1_1;
            },
            function (b2Fixture_1_1) {
                b2Fixture_1 = b2Fixture_1_1;
            },
            function (b2PolygonShape_1_1) {
                b2PolygonShape_1 = b2PolygonShape_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG9Xb3JsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlbGxvV29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBVUYsZ0VBQWdFO0lBQ2hFLHFFQUFxRTtJQUNyRSxPQUFPO0lBQ1Asb0VBQW9FO0lBQ3BFLGtEQUFrRDtJQUNsRDtRQUNFLDZCQUE2QjtRQUM3QixNQUFNLE9BQU8sR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUzQywyRUFBMkU7UUFDM0UsTUFBTSxLQUFLLEdBQVksSUFBSSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVDLDBCQUEwQjtRQUMxQixNQUFNLGFBQWEsR0FBYyxJQUFJLGtCQUFTLEVBQUUsQ0FBQztRQUNqRCxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuQyxtRUFBbUU7UUFDbkUsbUVBQW1FO1FBQ25FLHVDQUF1QztRQUN2QyxNQUFNLFVBQVUsR0FBVyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELCtCQUErQjtRQUMvQixNQUFNLFNBQVMsR0FBbUIsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFFdkQsOENBQThDO1FBQzlDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNCLDZDQUE2QztRQUM3QyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV2QywwRUFBMEU7UUFDMUUsTUFBTSxPQUFPLEdBQWMsSUFBSSxrQkFBUyxFQUFFLENBQUM7UUFDM0MsT0FBTyxDQUFDLElBQUksR0FBRyxtQkFBVSxDQUFDLGNBQWMsQ0FBQztRQUN6QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxJQUFJLEdBQVcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQyxpREFBaUQ7UUFDakQsTUFBTSxVQUFVLEdBQW1CLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3hELFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFCLG1DQUFtQztRQUNuQyxNQUFNLFVBQVUsR0FBaUIsSUFBSSx3QkFBWSxFQUFFLENBQUM7UUFDcEQsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7UUFFOUIsNkRBQTZEO1FBQzdELFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLGlDQUFpQztRQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUUxQiw2QkFBNkI7UUFDN0IsTUFBTSxPQUFPLEdBQWMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxRCxvRUFBb0U7UUFDcEUsMkVBQTJFO1FBQzNFLDBCQUEwQjtRQUMxQixNQUFNLFFBQVEsR0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sa0JBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sa0JBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBRXJDLGdDQUFnQztRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLDZEQUE2RDtZQUM3RCxtRUFBbUU7WUFDbkUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUU3RCxnREFBZ0Q7WUFDaEQsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzVDLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RTtRQUVELGlGQUFpRjtRQUNqRix1RUFBdUU7UUFFdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQyJ9