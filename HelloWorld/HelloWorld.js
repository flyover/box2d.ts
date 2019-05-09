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
System.register(["Box2D"], function (exports_1, context_1) {
    "use strict";
    var box2d;
    var __moduleName = context_1 && context_1.id;
    // This is a simple example of building and running a simulation
    // using Box2D. Here we create a large ground box and a small dynamic
    // box.
    // There are no graphics for this example. Box2D is meant to be used
    // with your rendering engine in your game engine.
    function main() {
        // Define the gravity vector.
        const gravity = new box2d.b2Vec2(0, -10);
        // Construct a world object, which will hold and simulate the rigid bodies.
        const world = new box2d.b2World(gravity);
        // Define the ground body.
        const groundBodyDef = new box2d.b2BodyDef();
        groundBodyDef.position.Set(0, -10);
        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        const groundBody = world.CreateBody(groundBodyDef);
        // Define the ground box shape.
        const groundBox = new box2d.b2PolygonShape();
        // The extents are the half-widths of the box.
        groundBox.SetAsBox(50, 10);
        // Add the ground fixture to the ground body.
        groundBody.CreateFixture(groundBox, 0);
        // Define the dynamic body. We set its position and call the body factory.
        const bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
        bodyDef.position.Set(0, 4);
        const body = world.CreateBody(bodyDef);
        // Define another box shape for our dynamic body.
        const dynamicBox = new box2d.b2PolygonShape();
        dynamicBox.SetAsBox(1, 1);
        // Define the dynamic body fixture.
        const fixtureDef = new box2d.b2FixtureDef();
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
            function (box2d_1) {
                box2d = box2d_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG9Xb3JsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlbGxvV29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBSUYsZ0VBQWdFO0lBQ2hFLHFFQUFxRTtJQUNyRSxPQUFPO0lBQ1Asb0VBQW9FO0lBQ3BFLGtEQUFrRDtJQUNsRCxTQUFnQixJQUFJO1FBQ2xCLDZCQUE2QjtRQUM3QixNQUFNLE9BQU8sR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXZELDJFQUEyRTtRQUMzRSxNQUFNLEtBQUssR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELDBCQUEwQjtRQUMxQixNQUFNLGFBQWEsR0FBb0IsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0QsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkMsbUVBQW1FO1FBQ25FLG1FQUFtRTtRQUNuRSx1Q0FBdUM7UUFDdkMsTUFBTSxVQUFVLEdBQWlCLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakUsK0JBQStCO1FBQy9CLE1BQU0sU0FBUyxHQUF5QixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuRSw4Q0FBOEM7UUFDOUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0IsNkNBQTZDO1FBQzdDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXZDLDBFQUEwRTtRQUMxRSxNQUFNLE9BQU8sR0FBb0IsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkQsT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUMvQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxJQUFJLEdBQWlCLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckQsaURBQWlEO1FBQ2pELE1BQU0sVUFBVSxHQUF5QixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQixtQ0FBbUM7UUFDbkMsTUFBTSxVQUFVLEdBQXVCLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBRTlCLDZEQUE2RDtRQUM3RCxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUV2QixpQ0FBaUM7UUFDakMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFFMUIsNkJBQTZCO1FBQzdCLE1BQU0sT0FBTyxHQUFvQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhFLG9FQUFvRTtRQUNwRSwyRUFBMkU7UUFDM0UsMEJBQTBCO1FBQzFCLE1BQU0sUUFBUSxHQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEMsTUFBTSxrQkFBa0IsR0FBVyxDQUFDLENBQUM7UUFDckMsTUFBTSxrQkFBa0IsR0FBVyxDQUFDLENBQUM7UUFFckMsZ0NBQWdDO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDbkMsNkRBQTZEO1lBQzdELG1FQUFtRTtZQUNuRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRTdELGdEQUFnRDtZQUNoRCxNQUFNLFFBQVEsR0FBaUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xELE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RTtRQUVELGlGQUFpRjtRQUNqRix1RUFBdUU7UUFFdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQyJ9