(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@box2d')) :
  typeof define === 'function' && define.amd ? define(['exports', '@box2d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.unit_test = {}, global.b2));
})(this, (function (exports, b2) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var b2__namespace = /*#__PURE__*/_interopNamespace(b2);

  // MIT License
  // Copyright (c) 2019 Erin Catto
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.
  function CHECK(c, msg) { if (!c) {
      throw new Error(msg);
  } }
  // This is a simple example of building and running a simulation
  // using Box2D. Here we create a large ground box and a small dynamic
  // box.
  // There are no graphics for this example. Box2D is meant to be used
  // with your rendering engine in your game engine.
  function main$1() {
      // Define the gravity vector.
      const gravity = new b2__namespace.Vec2(0, -10);
      // Construct a world object, which will hold and simulate the rigid bodies.
      const world = new b2__namespace.World(gravity);
      // Define the ground body.
      const groundBodyDef = new b2__namespace.BodyDef();
      groundBodyDef.position.Set(0, -10);
      // Call the body factory which allocates memory for the ground body
      // from a pool and creates the ground box shape (also from a pool).
      // The body is also added to the world.
      const groundBody = world.CreateBody(groundBodyDef);
      // Define the ground box shape.
      const groundBox = new b2__namespace.PolygonShape();
      // The extents are the half-widths of the box.
      groundBox.SetAsBox(50, 10);
      // Add the ground fixture to the ground body.
      groundBody.CreateFixture(groundBox, 0);
      // Define the dynamic body. We set its position and call the body factory.
      const bodyDef = new b2__namespace.BodyDef();
      bodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
      bodyDef.position.Set(0, 4);
      const body = world.CreateBody(bodyDef);
      // Define another box shape for our dynamic body.
      const dynamicBox = new b2__namespace.PolygonShape();
      dynamicBox.SetAsBox(1, 1);
      // Define the dynamic body fixture.
      const fixtureDef = new b2__namespace.FixtureDef();
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
      let position = body.GetPosition();
      let angle = body.GetAngle();
      // This is our little game loop.
      for (let i = 0; i < 60; ++i) {
          // Instruct the world to perform a single step of simulation.
          // It is generally best to keep the time step and iterations fixed.
          world.Step(timeStep, velocityIterations, positionIterations);
          // Now print the position and angle of the body.
          position = body.GetPosition();
          angle = body.GetAngle();
          console.log(position.x.toFixed(2), position.y.toFixed(2), angle.toFixed(2));
      }
      // When the world destructor is called, all bodies and joints are freed. This can
      // create orphaned pointers, so be careful about your world management.
      body.DestroyFixture(fixture);
      world.DestroyBody(body);
      CHECK(b2__namespace.Abs(position.x) < 0.01);
      CHECK(b2__namespace.Abs(position.y - 1.01) < 0.01);
      CHECK(b2__namespace.Abs(angle) < 0.01);
      return 0;
  }

  function main() {
      return main$1();
  }

  exports.main = main;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=unit-test.umd.js.map
