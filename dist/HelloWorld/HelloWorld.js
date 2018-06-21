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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG9Xb3JsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL0hlbGxvV29ybGQvSGVsbG9Xb3JsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7SUFJRixnRUFBZ0U7SUFDaEUscUVBQXFFO0lBQ3JFLE9BQU87SUFDUCxvRUFBb0U7SUFDcEUsa0RBQWtEO0lBQ2xEO1FBQ0UsNkJBQTZCO1FBQzdCLE1BQU0sT0FBTyxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdkQsMkVBQTJFO1FBQzNFLE1BQU0sS0FBSyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEQsMEJBQTBCO1FBQzFCLE1BQU0sYUFBYSxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3RCxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuQyxtRUFBbUU7UUFDbkUsbUVBQW1FO1FBQ25FLHVDQUF1QztRQUN2QyxNQUFNLFVBQVUsR0FBaUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRSwrQkFBK0I7UUFDL0IsTUFBTSxTQUFTLEdBQXlCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5FLDhDQUE4QztRQUM5QyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQiw2Q0FBNkM7UUFDN0MsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkMsMEVBQTBFO1FBQzFFLE1BQU0sT0FBTyxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2RCxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQy9DLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLElBQUksR0FBaUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyRCxpREFBaUQ7UUFDakQsTUFBTSxVQUFVLEdBQXlCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFCLG1DQUFtQztRQUNuQyxNQUFNLFVBQVUsR0FBdUIsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEUsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7UUFFOUIsNkRBQTZEO1FBQzdELFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLGlDQUFpQztRQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUUxQiw2QkFBNkI7UUFDN0IsTUFBTSxPQUFPLEdBQW9CLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsb0VBQW9FO1FBQ3BFLDJFQUEyRTtRQUMzRSwwQkFBMEI7UUFDMUIsTUFBTSxRQUFRLEdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQyxNQUFNLGtCQUFrQixHQUFXLENBQUMsQ0FBQztRQUNyQyxNQUFNLGtCQUFrQixHQUFXLENBQUMsQ0FBQztRQUVyQyxnQ0FBZ0M7UUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNuQyw2REFBNkQ7WUFDN0QsbUVBQW1FO1lBQ25FLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFN0QsZ0RBQWdEO1lBQ2hELE1BQU0sUUFBUSxHQUFpQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdFO1FBRUQsaUZBQWlGO1FBQ2pGLHVFQUF1RTtRQUV2RSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTdCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDIn0=