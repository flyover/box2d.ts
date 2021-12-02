(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@box2d')) :
  typeof define === 'function' && define.amd ? define(['exports', '@box2d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.testbed = {}, global.b2));
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
  class Settings {
      constructor() {
          this.m_testIndex = 0;
          this.m_windowWidth = 1600;
          this.m_windowHeight = 900;
          this.m_hertz = 60;
          this.m_velocityIterations = 8;
          this.m_positionIterations = 3;
          // #if B2_ENABLE_PARTICLE
          // Particle iterations are needed for numerical stability in particle
          // simulations with small particles and relatively high gravity.
          // b2CalculateParticleIterations helps to determine the number.
          this.m_particleIterations = b2__namespace.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
          // #endif
          this.m_drawShapes = true;
          // #if B2_ENABLE_PARTICLE
          this.m_drawParticles = true;
          // #endif
          this.m_drawJoints = true;
          this.m_drawAABBs = false;
          this.m_drawContactPoints = false;
          this.m_drawContactNormals = false;
          this.m_drawContactImpulse = false;
          this.m_drawFrictionImpulse = false;
          this.m_drawCOMs = false;
          this.m_drawControllers = true;
          this.m_drawStats = false;
          this.m_drawProfile = false;
          this.m_enableWarmStarting = true;
          this.m_enableContinuous = true;
          this.m_enableSubStepping = false;
          this.m_enableSleep = true;
          this.m_pause = false;
          this.m_singleStep = false;
          // #if B2_ENABLE_PARTICLE
          this.m_strictContacts = false;
      }
      // #endif
      Reset() {
          this.m_testIndex = 0;
          this.m_windowWidth = 1600;
          this.m_windowHeight = 900;
          this.m_hertz = 60;
          this.m_velocityIterations = 8;
          this.m_positionIterations = 3;
          // #if B2_ENABLE_PARTICLE
          // Particle iterations are needed for numerical stability in particle
          // simulations with small particles and relatively high gravity.
          // b2CalculateParticleIterations helps to determine the number.
          this.m_particleIterations = b2__namespace.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
          // #endif
          this.m_drawShapes = true;
          // #if B2_ENABLE_PARTICLE
          this.m_drawParticles = true;
          // #endif
          this.m_drawJoints = true;
          this.m_drawAABBs = false;
          this.m_drawContactPoints = false;
          this.m_drawContactNormals = false;
          this.m_drawContactImpulse = false;
          this.m_drawFrictionImpulse = false;
          this.m_drawCOMs = false;
          // #if B2_ENABLE_CONTROLLER
          this.m_drawControllers = true;
          // #endif
          this.m_drawStats = false;
          this.m_drawProfile = false;
          this.m_enableWarmStarting = true;
          this.m_enableContinuous = true;
          this.m_enableSubStepping = false;
          this.m_enableSleep = true;
          this.m_pause = false;
          this.m_singleStep = false;
          // #if B2_ENABLE_PARTICLE
          this.m_strictContacts = false;
          // #endif
      }
      Save() { }
      Load() { }
  }

  // MIT License
  class Camera {
      constructor() {
          this.m_center = new b2__namespace.Vec2(0, 20);
          ///public readonly m_roll: b2.Rot = new b2.Rot(b2.DegToRad(0));
          this.m_extent = 25;
          this.m_zoom = 1;
          this.m_width = 1280;
          this.m_height = 800;
      }
      ConvertScreenToWorld(screenPoint, out) {
          return this.ConvertElementToWorld(screenPoint, out);
      }
      ConvertWorldToScreen(worldPoint, out) {
          return this.ConvertWorldToElement(worldPoint, out);
      }
      ConvertViewportToElement(viewport, out) {
          // 0,0 at center of canvas, x right and y up
          const element_x = viewport.x + (0.5 * this.m_width);
          const element_y = (0.5 * this.m_height) - viewport.y;
          return out.Set(element_x, element_y);
      }
      ConvertElementToViewport(element, out) {
          // 0,0 at center of canvas, x right and y up
          const viewport_x = element.x - (0.5 * this.m_width);
          const viewport_y = (0.5 * this.m_height) - element.y;
          return out.Set(viewport_x, viewport_y);
      }
      ConvertProjectionToViewport(projection, out) {
          const viewport = out.Copy(projection);
          b2__namespace.Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
          ///b2.Vec2.MulSV(this.m_extent, viewport, viewport);
          b2__namespace.Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
          return viewport;
      }
      ConvertViewportToProjection(viewport, out) {
          const projection = out.Copy(viewport);
          ///b2.Vec2.MulSV(1 / this.m_extent, projection, projection);
          b2__namespace.Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
          b2__namespace.Vec2.MulSV(this.m_zoom, projection, projection);
          return projection;
      }
      ConvertWorldToProjection(world, out) {
          const projection = out.Copy(world);
          b2__namespace.Vec2.SubVV(projection, this.m_center, projection);
          ///b2.Rot.MulTRV(this.m_roll, projection, projection);
          return projection;
      }
      ConvertProjectionToWorld(projection, out) {
          const world = out.Copy(projection);
          ///b2.Rot.MulRV(this.m_roll, world, world);
          b2__namespace.Vec2.AddVV(this.m_center, world, world);
          return world;
      }
      ConvertElementToWorld(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          const projection = this.ConvertViewportToProjection(viewport, out);
          return this.ConvertProjectionToWorld(projection, out);
      }
      ConvertWorldToElement(world, out) {
          const projection = this.ConvertWorldToProjection(world, out);
          const viewport = this.ConvertProjectionToViewport(projection, out);
          return this.ConvertViewportToElement(viewport, out);
      }
      ConvertElementToProjection(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          return this.ConvertViewportToProjection(viewport, out);
      }
  }
  // This class implements debug drawing callbacks that are invoked
  // inside b2World::Step.
  class DebugDraw extends b2__namespace.Draw {
      constructor() {
          super();
          this.m_ctx = null;
      }
      PushTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.translate(xf.p.x, xf.p.y);
              ctx.rotate(xf.q.GetAngle());
          }
      }
      PopTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.restore();
          }
      }
      DrawPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawCircle(center, radius, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidCircle(center, radius, axis, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              const cx = center.x;
              const cy = center.y;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, b2__namespace.pi * 2, true);
              ctx.moveTo(cx, cy);
              ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      // #if B2_ENABLE_PARTICLE
      DrawParticles(centers, radius, colors, count) {
          const ctx = this.m_ctx;
          if (ctx) {
              if (colors !== null) {
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      const color = colors[i];
                      ctx.fillStyle = color.MakeStyleString();
                      // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
                      ctx.fill();
                  }
              }
              else {
                  ctx.fillStyle = "rgba(255,255,255,0.5)";
                  // ctx.beginPath();
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
                      ctx.fill();
                  }
                  // ctx.fill();
              }
          }
      }
      // #endif
      DrawSegment(p1, p2, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              this.PushTransform(xf);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(1, 0);
              ctx.strokeStyle = b2__namespace.Color.RED.MakeStyleString(1);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, 1);
              ctx.strokeStyle = b2__namespace.Color.GREEN.MakeStyleString(1);
              ctx.stroke();
              this.PopTransform(xf);
          }
      }
      DrawPoint(p, size, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.fillStyle = color.MakeStyleString();
              size *= g_camera.m_zoom;
              size /= g_camera.m_extent;
              const hsize = size / 2;
              ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
          }
      }
      DrawString(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawString_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, x, y);
              ctx.restore();
          }
      }
      DrawStringWorld(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              const p = DebugDraw.DrawStringWorld_s_p.Set(x, y);
              // world -> viewport
              const vt = g_camera.m_center;
              b2__namespace.Vec2.SubVV(p, vt, p);
              ///const vr = g_camera.m_roll;
              ///b2.Rot.MulTRV(vr, p, p);
              const vs = g_camera.m_zoom;
              b2__namespace.Vec2.MulSV(1 / vs, p, p);
              // viewport -> canvas
              const cs = 0.5 * g_camera.m_height / g_camera.m_extent;
              b2__namespace.Vec2.MulSV(cs, p, p);
              p.y *= -1;
              const cc = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
              b2__namespace.Vec2.AddVV(p, cc, p);
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawStringWorld_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, p.x, p.y);
              ctx.restore();
          }
      }
      DrawAABB(aabb, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.strokeStyle = color.MakeStyleString();
              const x = aabb.lowerBound.x;
              const y = aabb.lowerBound.y;
              const w = aabb.upperBound.x - aabb.lowerBound.x;
              const h = aabb.upperBound.y - aabb.lowerBound.y;
              ctx.strokeRect(x, y, w, h);
          }
      }
  }
  DebugDraw.DrawString_s_color = new b2__namespace.Color(0.9, 0.6, 0.6);
  DebugDraw.DrawStringWorld_s_p = new b2__namespace.Vec2();
  DebugDraw.DrawStringWorld_s_cc = new b2__namespace.Vec2();
  DebugDraw.DrawStringWorld_s_color = new b2__namespace.Color(0.5, 0.9, 0.5);
  const g_debugDraw = new DebugDraw();
  const g_camera = new Camera();

  /*
   * Copyright (c) 2014 Google, Inc.
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
  // #if B2_ENABLE_PARTICLE
  /**
   * Handles drawing and selection of full screen UI.
   */
  class FullScreenUI {
      constructor() {
          /**
           * Whether particle parameters are enabled.
           */
          this.m_particleParameterSelectionEnabled = false;
          this.Reset();
      }
      /**
       * Reset the UI to it's initial state.
       */
      Reset() {
          this.m_particleParameterSelectionEnabled = false;
      }
      /**
       * Enable / disable particle parameter selection.
       */
      SetParticleParameterSelectionEnabled(enable) {
          this.m_particleParameterSelectionEnabled = enable;
      }
      /**
       * Get whether particle parameter selection is enabled.
       */
      GetParticleParameterSelectionEnabled() {
          return this.m_particleParameterSelectionEnabled;
      }
  }
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class EmittedParticleCallback {
      /**
       * Called for each created particle.
       */
      ParticleCreated(system, particleIndex) { }
  }
  /**
   * Emit particles from a circular region.
   */
  class RadialEmitter {
      constructor() {
          /**
           * Pointer to global world
           */
          this.m_particleSystem = null;
          /**
           * Called for each created particle.
           */
          this.m_callback = null;
          /**
           * Center of particle emitter
           */
          this.m_origin = new b2__namespace.Vec2();
          /**
           * Launch direction.
           */
          this.m_startingVelocity = new b2__namespace.Vec2();
          /**
           * Speed particles are emitted
           */
          this.m_speed = 0.0;
          /**
           * Half width / height of particle emitter
           */
          this.m_halfSize = new b2__namespace.Vec2();
          /**
           * Particles per second
           */
          this.m_emitRate = 1.0;
          /**
           * Initial color of particle emitted.
           */
          this.m_color = new b2__namespace.Color();
          /**
           * Number particles to emit on the next frame
           */
          this.m_emitRemainder = 0.0;
          /**
           * Flags for created particles, see b2ParticleFlag.
           */
          this.m_flags = b2__namespace.ParticleFlag.b2_waterParticle;
          /**
           * Group to put newly created particles in.
           */
          this.m_group = null;
      }
      /**
       * Calculate a random number 0.0..1.0.
       */
      static Random() {
          return Math.random();
      }
      __dtor__() {
          this.SetGroup(null);
      }
      /**
       * Set the center of the emitter.
       */
      SetPosition(origin) {
          this.m_origin.Copy(origin);
      }
      /**
       * Get the center of the emitter.
       */
      GetPosition(out) {
          return out.Copy(this.m_origin);
      }
      /**
       * Set the size of the circle which emits particles.
       */
      SetSize(size) {
          this.m_halfSize.Copy(size).SelfMul(0.5);
      }
      /**
       * Get the size of the circle which emits particles.
       */
      GetSize(out) {
          return out.Copy(this.m_halfSize).SelfMul(2.0);
      }
      /**
       * Set the starting velocity of emitted particles.
       */
      SetVelocity(velocity) {
          this.m_startingVelocity.Copy(velocity);
      }
      /**
       * Get the starting velocity.
       */
      GetVelocity(out) {
          return out.Copy(this.m_startingVelocity);
      }
      /**
       * Set the speed of particles along the direction from the
       * center of the emitter.
       */
      SetSpeed(speed) {
          this.m_speed = speed;
      }
      /**
       * Get the speed of particles along the direction from the
       * center of the emitter.
       */
      GetSpeed() {
          return this.m_speed;
      }
      /**
       * Set the flags for created particles.
       */
      SetParticleFlags(flags) {
          this.m_flags = flags;
      }
      /**
       * Get the flags for created particles.
       */
      GetParticleFlags() {
          return this.m_flags;
      }
      /**
       * Set the color of particles.
       */
      SetColor(color) {
          this.m_color.Copy(color);
      }
      /**
       * Get the color of particles emitter.
       */
      GetColor(out) {
          return out.Copy(this.m_color);
      }
      /**
       * Set the emit rate in particles per second.
       */
      SetEmitRate(emitRate) {
          this.m_emitRate = emitRate;
      }
      /**
       * Get the current emit rate.
       */
      GetEmitRate() {
          return this.m_emitRate;
      }
      /**
       * Set the particle system this emitter is adding particles to.
       */
      SetParticleSystem(particleSystem) {
          this.m_particleSystem = particleSystem;
      }
      /**
       * Get the particle system this emitter is adding particle to.
       */
      GetParticleSystem() {
          return this.m_particleSystem;
      }
      /**
       * Set the callback that is called on the creation of each
       * particle.
       */
      SetCallback(callback) {
          this.m_callback = callback;
      }
      /**
       * Get the callback that is called on the creation of each
       * particle.
       */
      GetCallback() {
          return this.m_callback;
      }
      /**
       * This class sets the group flags to b2_particleGroupCanBeEmpty
       * so that it isn't destroyed and clears the
       * b2_particleGroupCanBeEmpty on the group when the emitter no
       * longer references it so that the group can potentially be
       * cleaned up.
       */
      SetGroup(group) {
          if (this.m_group) {
              this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() & ~b2__namespace.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
          }
          this.m_group = group;
          if (this.m_group) {
              this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() | b2__namespace.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
          }
      }
      /**
       * Get the group particles should be created within.
       */
      GetGroup() {
          return this.m_group;
      }
      /**
       * dt is seconds that have passed, particleIndices is an
       * optional pointer to an array which tracks which particles
       * have been created and particleIndicesCount is the size of the
       * particleIndices array. This function returns the number of
       * particles created during this simulation step.
       */
      Step(dt, particleIndices, particleIndicesCount = particleIndices ? particleIndices.length : 0) {
          if (this.m_particleSystem === null) {
              throw new Error();
          }
          let numberOfParticlesCreated = 0;
          // How many (fractional) particles should we have emitted this frame?
          this.m_emitRemainder += this.m_emitRate * dt;
          const pd = new b2__namespace.ParticleDef();
          pd.color.Copy(this.m_color);
          pd.flags = this.m_flags;
          pd.group = this.m_group;
          // Keep emitting particles on this frame until we only have a
          // fractional particle left.
          while (this.m_emitRemainder > 1.0) {
              this.m_emitRemainder -= 1.0;
              // Randomly pick a position within the emitter's radius.
              const angle = RadialEmitter.Random() * 2.0 * b2__namespace.pi;
              // Distance from the center of the circle.
              const distance = RadialEmitter.Random();
              const positionOnUnitCircle = new b2__namespace.Vec2(Math.sin(angle), Math.cos(angle));
              // Initial position.
              pd.position.Set(this.m_origin.x + positionOnUnitCircle.x * distance * this.m_halfSize.x, this.m_origin.y + positionOnUnitCircle.y * distance * this.m_halfSize.y);
              // Send it flying
              pd.velocity.Copy(this.m_startingVelocity);
              if (this.m_speed !== 0.0) {
                  ///  pd.velocity += positionOnUnitCircle * m_speed;
                  pd.velocity.SelfMulAdd(this.m_speed, positionOnUnitCircle);
              }
              const particleIndex = this.m_particleSystem.CreateParticle(pd);
              if (this.m_callback) {
                  this.m_callback.ParticleCreated(this.m_particleSystem, particleIndex);
              }
              if (particleIndices && (numberOfParticlesCreated < particleIndicesCount)) {
                  particleIndices[numberOfParticlesCreated] = particleIndex;
              }
              ++numberOfParticlesCreated;
          }
          return numberOfParticlesCreated;
      }
  }
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  exports.ParticleParameterOptions = void 0;
  (function (ParticleParameterOptions) {
      ParticleParameterOptions[ParticleParameterOptions["OptionStrictContacts"] = 1] = "OptionStrictContacts";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawShapes"] = 2] = "OptionDrawShapes";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawParticles"] = 4] = "OptionDrawParticles";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawJoints"] = 8] = "OptionDrawJoints";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawAABBs"] = 16] = "OptionDrawAABBs";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactPoints"] = 32] = "OptionDrawContactPoints";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactNormals"] = 64] = "OptionDrawContactNormals";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactImpulse"] = 128] = "OptionDrawContactImpulse";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawFrictionImpulse"] = 256] = "OptionDrawFrictionImpulse";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawCOMs"] = 512] = "OptionDrawCOMs";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawStats"] = 1024] = "OptionDrawStats";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawProfile"] = 2048] = "OptionDrawProfile";
  })(exports.ParticleParameterOptions || (exports.ParticleParameterOptions = {}));
  class ParticleParameterValue {
      constructor(...args) {
          /**
           * ParticleParameterValue associated with the parameter.
           */
          this.value = 0;
          /**
           * Any global (non particle-specific) options associated with
           * this parameter
           */
          this.options = 0;
          /**
           * Name to display when this parameter is selected.
           */
          this.name = "";
          if (args[0] instanceof ParticleParameterValue) {
              this.Copy(args[0]);
          }
          else {
              this.value = args[0];
              this.options = args[1];
              this.name = args[2];
          }
      }
      Copy(other) {
          this.value = other.value;
          this.options = other.options;
          this.name = other.name;
          return this;
      }
  }
  class ParticleParameterDefinition {
      /**
       * Particle parameter definition.
       */
      constructor(values, numValues = values.length) {
          this.numValues = 0;
          this.values = values;
          this.numValues = numValues;
      }
      CalculateValueMask() {
          let mask = 0;
          for (let i = 0; i < this.numValues; i++) {
              mask |= this.values[i].value;
          }
          return mask;
      }
  }
  class ParticleParameter {
      constructor() {
          this.m_index = 0;
          this.m_changed = false;
          this.m_restartOnChange = false;
          this.m_value = null;
          this.m_definition = ParticleParameter.k_defaultDefinition;
          this.m_definitionCount = 0;
          this.m_valueCount = 0;
          this.Reset();
      }
      Reset() {
          this.m_restartOnChange = true;
          this.m_index = 0;
          this.SetDefinition(ParticleParameter.k_defaultDefinition);
          this.Set(0);
      }
      SetDefinition(definition, definitionCount = definition.length) {
          this.m_definition = definition;
          this.m_definitionCount = definitionCount;
          this.m_valueCount = 0;
          for (let i = 0; i < this.m_definitionCount; ++i) {
              this.m_valueCount += this.m_definition[i].numValues;
          }
          // Refresh the selected value.
          this.Set(this.Get());
      }
      Get() {
          return this.m_index;
      }
      Set(index) {
          this.m_changed = this.m_index !== index;
          this.m_index = this.m_valueCount ? index % this.m_valueCount : index;
          this.m_value = this.FindParticleParameterValue();
          // DEBUG: b2.Assert(this.m_value !== null);
      }
      Increment() {
          const index = this.Get();
          this.Set(index >= this.m_valueCount ? 0 : index + 1);
      }
      Decrement() {
          const index = this.Get();
          this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
      }
      Changed(restart) {
          const changed = this.m_changed;
          this.m_changed = false;
          if (restart) {
              restart[0] = changed && this.GetRestartOnChange();
          }
          return changed;
      }
      GetValue() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.value;
      }
      GetName() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.name;
      }
      GetOptions() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.options;
      }
      SetRestartOnChange(enable) {
          this.m_restartOnChange = enable;
      }
      GetRestartOnChange() {
          return this.m_restartOnChange;
      }
      FindIndexByValue(value) {
          let index = 0;
          for (let i = 0; i < this.m_definitionCount; ++i) {
              const definition = this.m_definition[i];
              const numValues = definition.numValues;
              for (let j = 0; j < numValues; ++j, ++index) {
                  if (definition.values[j].value === value) {
                      return index;
                  }
              }
          }
          return -1;
      }
      FindParticleParameterValue() {
          let start = 0;
          const index = this.Get();
          for (let i = 0; i < this.m_definitionCount; ++i) {
              const definition = this.m_definition[i];
              const end = start + definition.numValues;
              if (index >= start && index < end) {
                  return definition.values[index - start];
              }
              start = end;
          }
          return null;
      }
  }
  ParticleParameter.k_DefaultOptions = exports.ParticleParameterOptions.OptionDrawShapes | exports.ParticleParameterOptions.OptionDrawParticles;
  ParticleParameter.k_particleTypes = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions, "water"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_springParticle, ParticleParameter.k_DefaultOptions, "spring"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_elasticParticle, ParticleParameter.k_DefaultOptions, "elastic"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "viscous"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_colorMixingParticle, ParticleParameter.k_DefaultOptions, "color mixing"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "wall"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "barrier"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_staticPressureParticle, ParticleParameter.k_DefaultOptions, "static pressure"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionDrawAABBs, "water (bounding boxes)"),
  ];
  ParticleParameter.k_defaultDefinition = [
      new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
  ];
  // #endif

  // MIT License
  // #endif
  const DRAW_STRING_NEW_LINE = 16;
  function RandomFloat(lo = -1, hi = 1) {
      let r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
  }
  class TestEntry {
      constructor(category, name, createFcn) {
          this.category = "";
          this.name = "unknown";
          this.category = category;
          this.name = name;
          this.createFcn = createFcn;
      }
  }
  const g_testEntries = [];
  function RegisterTest(category, name, fcn) {
      return g_testEntries.push(new TestEntry(category, name, fcn));
  }
  class DestructionListener extends b2__namespace.DestructionListener {
      constructor(test) {
          super();
          this.test = test;
      }
      SayGoodbyeJoint(joint) {
          if (this.test.m_mouseJoint === joint) {
              this.test.m_mouseJoint = null;
          }
          else {
              this.test.JointDestroyed(joint);
          }
      }
      SayGoodbyeFixture(fixture) { }
      // #if B2_ENABLE_PARTICLE
      SayGoodbyeParticleGroup(group) {
          this.test.ParticleGroupDestroyed(group);
      }
  }
  class ContactPoint {
      constructor() {
          this.normal = new b2__namespace.Vec2();
          this.position = new b2__namespace.Vec2();
          this.state = b2__namespace.PointState.b2_nullState;
          this.normalImpulse = 0;
          this.tangentImpulse = 0;
          this.separation = 0;
      }
  }
  // #if B2_ENABLE_PARTICLE
  class QueryCallback2 extends b2__namespace.QueryCallback {
      constructor(particleSystem, shape, velocity) {
          super();
          this.m_particleSystem = particleSystem;
          this.m_shape = shape;
          this.m_velocity = velocity;
      }
      ReportFixture(fixture) {
          return false;
      }
      ReportParticle(particleSystem, index) {
          if (particleSystem !== this.m_particleSystem) {
              return false;
          }
          const xf = b2__namespace.Transform.IDENTITY;
          const p = this.m_particleSystem.GetPositionBuffer()[index];
          if (this.m_shape.TestPoint(xf, p)) {
              const v = this.m_particleSystem.GetVelocityBuffer()[index];
              v.Copy(this.m_velocity);
          }
          return true;
      }
  }
  // #endif
  class Test extends b2__namespace.ContactListener {
      // #endif
      constructor() {
          super();
          // #endif
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_points = b2__namespace.MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
          this.m_pointCount = 0;
          this.m_bombSpawnPoint = new b2__namespace.Vec2();
          this.m_bombSpawning = false;
          this.m_mouseWorld = new b2__namespace.Vec2();
          // #if B2_ENABLE_PARTICLE
          this.m_mouseTracing = false;
          this.m_mouseTracerPosition = new b2__namespace.Vec2();
          this.m_mouseTracerVelocity = new b2__namespace.Vec2();
          // #endif
          this.m_stepCount = 0;
          this.m_maxProfile = new b2__namespace.Profile();
          this.m_totalProfile = new b2__namespace.Profile();
          // #if B2_ENABLE_PARTICLE
          this.m_particleParameters = null;
          this.m_particleParameterDef = null;
          // #if B2_ENABLE_PARTICLE
          const particleSystemDef = new b2__namespace.ParticleSystemDef();
          // #endif
          const gravity = new b2__namespace.Vec2(0, -10);
          this.m_world = new b2__namespace.World(gravity);
          // #if B2_ENABLE_PARTICLE
          this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
          // #endif
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_destructionListener = new DestructionListener(this);
          this.m_world.SetDestructionListener(this.m_destructionListener);
          this.m_world.SetContactListener(this);
          this.m_world.SetDebugDraw(g_debugDraw);
          // #if B2_ENABLE_PARTICLE
          this.m_particleSystem.SetGravityScale(0.4);
          this.m_particleSystem.SetDensity(1.2);
          // #endif
          const bodyDef = new b2__namespace.BodyDef();
          this.m_groundBody = this.m_world.CreateBody(bodyDef);
      }
      JointDestroyed(joint) { }
      // #if B2_ENABLE_PARTICLE
      ParticleGroupDestroyed(group) { }
      // #endif
      BeginContact(contact) { }
      EndContact(contact) { }
      PreSolve(contact, oldManifold) {
          const manifold = contact.GetManifold();
          if (manifold.pointCount === 0) {
              return;
          }
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          const state1 = Test.PreSolve_s_state1;
          const state2 = Test.PreSolve_s_state2;
          b2__namespace.GetPointStates(state1, state2, oldManifold, manifold);
          const worldManifold = Test.PreSolve_s_worldManifold;
          contact.GetWorldManifold(worldManifold);
          for (let i = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
              const cp = this.m_points[this.m_pointCount];
              cp.fixtureA = fixtureA;
              cp.fixtureB = fixtureB;
              cp.position.Copy(worldManifold.points[i]);
              cp.normal.Copy(worldManifold.normal);
              cp.state = state2[i];
              cp.normalImpulse = manifold.points[i].normalImpulse;
              cp.tangentImpulse = manifold.points[i].tangentImpulse;
              cp.separation = worldManifold.separations[i];
              ++this.m_pointCount;
          }
      }
      PostSolve(contact, impulse) { }
      Keyboard(key) { }
      KeyboardUp(key) { }
      SetTextLine(line) {
          this.m_textLine = line;
      }
      DrawTitle(title) {
          g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
          this.m_textLine = 3 * DRAW_STRING_NEW_LINE;
      }
      MouseDown(p) {
          this.m_mouseWorld.Copy(p);
          // #if B2_ENABLE_PARTICLE
          this.m_mouseTracing = true;
          this.m_mouseTracerPosition.Copy(p);
          this.m_mouseTracerVelocity.SetZero();
          // #endif
          if (this.m_mouseJoint !== null) {
              this.m_world.DestroyJoint(this.m_mouseJoint);
              this.m_mouseJoint = null;
          }
          let hit_fixture = null; // HACK: tsc doesn't detect calling callbacks
          // Query the world for overlapping shapes.
          this.m_world.QueryPointAABB(p, (fixture) => {
              const body = fixture.GetBody();
              if (body.GetType() === b2__namespace.BodyType.b2_dynamicBody) {
                  const inside = fixture.TestPoint(p);
                  if (inside) {
                      hit_fixture = fixture;
                      return false; // We are done, terminate the query.
                  }
              }
              return true; // Continue the query.
          });
          if (hit_fixture) {
              const frequencyHz = 5.0;
              const dampingRatio = 0.7;
              const body = hit_fixture.GetBody();
              const jd = new b2__namespace.MouseJointDef();
              jd.bodyA = this.m_groundBody;
              jd.bodyB = body;
              jd.target.Copy(p);
              jd.maxForce = 1000 * body.GetMass();
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_mouseJoint = this.m_world.CreateJoint(jd);
              body.SetAwake(true);
          }
      }
      SpawnBomb(worldPt) {
          this.m_bombSpawnPoint.Copy(worldPt);
          this.m_bombSpawning = true;
      }
      CompleteBombSpawn(p) {
          if (!this.m_bombSpawning) {
              return;
          }
          const multiplier = 30;
          const vel = b2__namespace.Vec2.SubVV(this.m_bombSpawnPoint, p, new b2__namespace.Vec2());
          vel.SelfMul(multiplier);
          this.LaunchBombAt(this.m_bombSpawnPoint, vel);
          this.m_bombSpawning = false;
      }
      ShiftMouseDown(p) {
          this.m_mouseWorld.Copy(p);
          if (this.m_mouseJoint !== null) {
              return;
          }
          this.SpawnBomb(p);
      }
      MouseUp(p) {
          // #if B2_ENABLE_PARTICLE
          this.m_mouseTracing = false;
          // #endif
          if (this.m_mouseJoint) {
              this.m_world.DestroyJoint(this.m_mouseJoint);
              this.m_mouseJoint = null;
          }
          if (this.m_bombSpawning) {
              this.CompleteBombSpawn(p);
          }
      }
      MouseMove(p) {
          this.m_mouseWorld.Copy(p);
          if (this.m_mouseJoint) {
              this.m_mouseJoint.SetTarget(p);
          }
      }
      LaunchBomb() {
          const p = new b2__namespace.Vec2(b2__namespace.RandomRange(-15, 15), 30);
          const v = b2__namespace.Vec2.MulSV(-5, p, new b2__namespace.Vec2());
          this.LaunchBombAt(p, v);
      }
      LaunchBombAt(position, velocity) {
          if (this.m_bomb) {
              this.m_world.DestroyBody(this.m_bomb);
              this.m_bomb = null;
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Copy(position);
          bd.bullet = true;
          this.m_bomb = this.m_world.CreateBody(bd);
          this.m_bomb.SetLinearVelocity(velocity);
          const circle = new b2__namespace.CircleShape();
          circle.m_radius = 0.3;
          const fd = new b2__namespace.FixtureDef();
          fd.shape = circle;
          fd.density = 20;
          fd.restitution = 0;
          // b2.Vec2 minV = position - b2.Vec2(0.3f,0.3f);
          // b2.Vec2 maxV = position + b2.Vec2(0.3f,0.3f);
          // b2.AABB aabb;
          // aabb.lowerBound = minV;
          // aabb.upperBound = maxV;
          this.m_bomb.CreateFixture(fd);
      }
      Step(settings) {
          let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;
          if (settings.m_pause) {
              if (settings.m_singleStep) {
                  settings.m_singleStep = false;
              }
              else {
                  timeStep = 0;
              }
              g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          let flags = b2__namespace.DrawFlags.e_none;
          if (settings.m_drawShapes) {
              flags |= b2__namespace.DrawFlags.e_shapeBit;
          }
          // #if B2_ENABLE_PARTICLE
          if (settings.m_drawParticles) {
              flags |= b2__namespace.DrawFlags.e_particleBit;
          }
          // #endif
          if (settings.m_drawJoints) {
              flags |= b2__namespace.DrawFlags.e_jointBit;
          }
          if (settings.m_drawAABBs) {
              flags |= b2__namespace.DrawFlags.e_aabbBit;
          }
          if (settings.m_drawCOMs) {
              flags |= b2__namespace.DrawFlags.e_centerOfMassBit;
          }
          // #if B2_ENABLE_CONTROLLER
          if (settings.m_drawControllers) {
              flags |= b2__namespace.DrawFlags.e_controllerBit;
          }
          // #endif
          g_debugDraw.SetFlags(flags);
          this.m_world.SetAllowSleeping(settings.m_enableSleep);
          this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
          this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
          this.m_world.SetSubStepping(settings.m_enableSubStepping);
          // #if B2_ENABLE_PARTICLE
          this.m_particleSystem.SetStrictContactCheck(settings.m_strictContacts);
          // #endif
          this.m_pointCount = 0;
          // #if B2_ENABLE_PARTICLE
          this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations, settings.m_particleIterations);
          // #else
          // this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);
          // #endif
          this.m_world.DebugDraw();
          if (timeStep > 0) {
              ++this.m_stepCount;
          }
          if (settings.m_drawStats) {
              const bodyCount = this.m_world.GetBodyCount();
              const contactCount = this.m_world.GetContactCount();
              const jointCount = this.m_world.GetJointCount();
              g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // #if B2_ENABLE_PARTICLE
              const particleCount = this.m_particleSystem.GetParticleCount();
              const groupCount = this.m_particleSystem.GetParticleGroupCount();
              const pairCount = this.m_particleSystem.GetPairCount();
              const triadCount = this.m_particleSystem.GetTriadCount();
              g_debugDraw.DrawString(5, this.m_textLine, "particles/groups/pairs/triads = " + particleCount + "/" + groupCount + "/" + pairCount + "/" + triadCount);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // #endif
              const proxyCount = this.m_world.GetProxyCount();
              const height = this.m_world.GetTreeHeight();
              const balance = this.m_world.GetTreeBalance();
              const quality = this.m_world.GetTreeQuality();
              g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          // Track maximum profile times
          {
              const p = this.m_world.GetProfile();
              this.m_maxProfile.step = b2__namespace.Max(this.m_maxProfile.step, p.step);
              this.m_maxProfile.collide = b2__namespace.Max(this.m_maxProfile.collide, p.collide);
              this.m_maxProfile.solve = b2__namespace.Max(this.m_maxProfile.solve, p.solve);
              this.m_maxProfile.solveInit = b2__namespace.Max(this.m_maxProfile.solveInit, p.solveInit);
              this.m_maxProfile.solveVelocity = b2__namespace.Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
              this.m_maxProfile.solvePosition = b2__namespace.Max(this.m_maxProfile.solvePosition, p.solvePosition);
              this.m_maxProfile.solveTOI = b2__namespace.Max(this.m_maxProfile.solveTOI, p.solveTOI);
              this.m_maxProfile.broadphase = b2__namespace.Max(this.m_maxProfile.broadphase, p.broadphase);
              this.m_totalProfile.step += p.step;
              this.m_totalProfile.collide += p.collide;
              this.m_totalProfile.solve += p.solve;
              this.m_totalProfile.solveInit += p.solveInit;
              this.m_totalProfile.solveVelocity += p.solveVelocity;
              this.m_totalProfile.solvePosition += p.solvePosition;
              this.m_totalProfile.solveTOI += p.solveTOI;
              this.m_totalProfile.broadphase += p.broadphase;
          }
          if (settings.m_drawProfile) {
              const p = this.m_world.GetProfile();
              const aveProfile = new b2__namespace.Profile();
              if (this.m_stepCount > 0) {
                  const scale = 1 / this.m_stepCount;
                  aveProfile.step = scale * this.m_totalProfile.step;
                  aveProfile.collide = scale * this.m_totalProfile.collide;
                  aveProfile.solve = scale * this.m_totalProfile.solve;
                  aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
                  aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
                  aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
                  aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
                  aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
              }
              g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          // #if B2_ENABLE_PARTICLE
          if (this.m_mouseTracing && !this.m_mouseJoint) {
              const delay = 0.1;
              ///b2Vec2 acceleration = 2 / delay * (1 / delay * (m_mouseWorld - m_mouseTracerPosition) - m_mouseTracerVelocity);
              const acceleration = new b2__namespace.Vec2();
              acceleration.x = 2 / delay * (1 / delay * (this.m_mouseWorld.x - this.m_mouseTracerPosition.x) - this.m_mouseTracerVelocity.x);
              acceleration.y = 2 / delay * (1 / delay * (this.m_mouseWorld.y - this.m_mouseTracerPosition.y) - this.m_mouseTracerVelocity.y);
              ///m_mouseTracerVelocity += timeStep * acceleration;
              this.m_mouseTracerVelocity.SelfMulAdd(timeStep, acceleration);
              ///m_mouseTracerPosition += timeStep * m_mouseTracerVelocity;
              this.m_mouseTracerPosition.SelfMulAdd(timeStep, this.m_mouseTracerVelocity);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Copy(this.m_mouseTracerPosition);
              shape.m_radius = 2 * this.GetDefaultViewZoom();
              ///QueryCallback2 callback(m_particleSystem, &shape, m_mouseTracerVelocity);
              const callback = new QueryCallback2(this.m_particleSystem, shape, this.m_mouseTracerVelocity);
              const aabb = new b2__namespace.AABB();
              const xf = new b2__namespace.Transform();
              xf.SetIdentity();
              shape.ComputeAABB(aabb, xf, 0);
              this.m_world.QueryAABB(callback, aabb);
          }
          // #endif
          if (this.m_bombSpawning) {
              const c = new b2__namespace.Color(0, 0, 1);
              g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
              c.SetRGB(0.8, 0.8, 0.8);
              g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
          }
          if (settings.m_drawContactPoints) {
              const k_impulseScale = 0.1;
              const k_axisScale = 0.3;
              for (let i = 0; i < this.m_pointCount; ++i) {
                  const point = this.m_points[i];
                  if (point.state === b2__namespace.PointState.b2_addState) {
                      // Add
                      g_debugDraw.DrawPoint(point.position, 10, new b2__namespace.Color(0.3, 0.95, 0.3));
                  }
                  else if (point.state === b2__namespace.PointState.b2_persistState) {
                      // Persist
                      g_debugDraw.DrawPoint(point.position, 5, new b2__namespace.Color(0.3, 0.3, 0.95));
                  }
                  if (settings.m_drawContactNormals) {
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVV(p1, b2__namespace.Vec2.MulSV(k_axisScale, point.normal, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.9));
                  }
                  else if (settings.m_drawContactImpulse) {
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.3));
                  }
                  if (settings.m_drawFrictionImpulse) {
                      const tangent = b2__namespace.Vec2.CrossVOne(point.normal, new b2__namespace.Vec2());
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.3));
                  }
              }
          }
      }
      ShiftOrigin(newOrigin) {
          this.m_world.ShiftOrigin(newOrigin);
      }
      GetDefaultViewZoom() {
          return 1.0;
      }
      /**
       * Apply a preset range of colors to a particle group.
       *
       * A different color out of k_ParticleColors is applied to each
       * particlesPerColor particles in the specified group.
       *
       * If particlesPerColor is 0, the particles in the group are
       * divided into k_ParticleColorsCount equal sets of colored
       * particles.
       */
      ColorParticleGroup(group, particlesPerColor) {
          // DEBUG: b2.Assert(group !== null);
          const colorBuffer = this.m_particleSystem.GetColorBuffer();
          const particleCount = group.GetParticleCount();
          const groupStart = group.GetBufferIndex();
          const groupEnd = particleCount + groupStart;
          const colorCount = Test.k_ParticleColors.length;
          if (!particlesPerColor) {
              particlesPerColor = Math.floor(particleCount / colorCount);
              if (!particlesPerColor) {
                  particlesPerColor = 1;
              }
          }
          for (let i = groupStart; i < groupEnd; i++) {
              ///colorBuffer[i].Copy(box2d.Testbed.Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount]);
              colorBuffer[i] = Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount].Clone();
          }
      }
      /**
       * Remove particle parameters matching "filterMask" from the set
       * of particle parameters available for this test.
       */
      InitializeParticleParameters(filterMask) {
          const defaultNumValues = ParticleParameter.k_defaultDefinition[0].numValues;
          const defaultValues = ParticleParameter.k_defaultDefinition[0].values;
          ///  m_particleParameters = new ParticleParameter::Value[defaultNumValues];
          this.m_particleParameters = [];
          // Disable selection of wall and barrier particle types.
          let numValues = 0;
          for (let i = 0; i < defaultNumValues; i++) {
              if (defaultValues[i].value & filterMask) {
                  continue;
              }
              ///memcpy(&m_particleParameters[numValues], &defaultValues[i], sizeof(defaultValues[0]));
              this.m_particleParameters[numValues] = new ParticleParameterValue(defaultValues[i]);
              numValues++;
          }
          this.m_particleParameterDef = new ParticleParameterDefinition(this.m_particleParameters, numValues);
          ///m_particleParameterDef.values = m_particleParameters;
          ///m_particleParameterDef.numValues = numValues;
          Test.SetParticleParameters([this.m_particleParameterDef], 1);
      }
      /**
       * Restore default particle parameters.
       */
      RestoreParticleParameters() {
          if (this.m_particleParameters) {
              Test.SetParticleParameters(ParticleParameter.k_defaultDefinition, 1);
              ///  delete [] m_particleParameters;
              this.m_particleParameters = null;
          }
      }
      /**
       * Set whether to restart the test on particle parameter
       * changes. This parameter is re-enabled when the test changes.
       */
      static SetRestartOnParticleParameterChange(enable) {
          Test.particleParameter.SetRestartOnChange(enable);
      }
      /**
       * Set the currently selected particle parameter value.  This
       * value must match one of the values in
       * Main::k_particleTypes or one of the values referenced by
       * particleParameterDef passed to SetParticleParameters().
       */
      static SetParticleParameterValue(value) {
          const index = Test.particleParameter.FindIndexByValue(value);
          // If the particle type isn't found, so fallback to the first entry in the
          // parameter.
          Test.particleParameter.Set(index >= 0 ? index : 0);
          return Test.particleParameter.GetValue();
      }
      /**
       * Get the currently selected particle parameter value and
       * enable particle parameter selection arrows on Android.
       */
      static GetParticleParameterValue() {
          // Enable display of particle type selection arrows.
          Test.fullscreenUI.SetParticleParameterSelectionEnabled(true);
          return Test.particleParameter.GetValue();
      }
      /**
       * Override the default particle parameters for the test.
       */
      static SetParticleParameters(particleParameterDef, particleParameterDefCount = particleParameterDef.length) {
          Test.particleParameter.SetDefinition(particleParameterDef, particleParameterDefCount);
      }
  }
  // #if B2_ENABLE_PARTICLE
  Test.fullscreenUI = new FullScreenUI();
  Test.particleParameter = new ParticleParameter();
  // #endif
  Test.k_maxContactPoints = 2048;
  Test.PreSolve_s_state1 = [ /*b2.maxManifoldPoints*/];
  Test.PreSolve_s_state2 = [ /*b2.maxManifoldPoints*/];
  Test.PreSolve_s_worldManifold = new b2__namespace.WorldManifold();
  // #if B2_ENABLE_PARTICLE
  Test.k_ParticleColors = [
      new b2__namespace.Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff), // cyan
  ];
  Test.k_ParticleColorsCount = Test.k_ParticleColors.length;

  // MIT License
  class AddPair extends Test {
      constructor() {
          super();
          this.m_world.SetGravity(new b2__namespace.Vec2(0.0, 0.0));
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.SetZero();
              shape.m_radius = 0.1;
              const minX = -6.0;
              const maxX = 0.0;
              const minY = 4.0;
              const maxY = 6.0;
              for (let i = 0; i < 400; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(b2__namespace.RandomRange(minX, maxX), b2__namespace.RandomRange(minY, maxY));
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 0.01);
              }
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.5, 1.5);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-40.0, 5.0);
              bd.bullet = true;
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(shape, 1.0);
              body.SetLinearVelocity(new b2__namespace.Vec2(10.0, 0.0));
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new AddPair();
      }
  }
  RegisterTest("Benchmark", "Add Pair", AddPair.Create);

  // MIT License
  // This test shows how to apply forces and torques to a body.
  // It also shows how to use the friction joint that can be useful
  // for overhead games.
  class ApplyForce extends Test {
      constructor() {
          super();
          this.m_world.SetGravity(new b2__namespace.Vec2(0.0, 0.0));
          const k_restitution = 0.4;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0.0, 20.0);
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              const sd = new b2__namespace.FixtureDef();
              sd.shape = shape;
              sd.density = 0.0;
              sd.restitution = k_restitution;
              // Left vertical
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, -20.0), new b2__namespace.Vec2(-20.0, 20.0));
              ground.CreateFixture(sd);
              // Right vertical
              shape.SetTwoSided(new b2__namespace.Vec2(20.0, -20.0), new b2__namespace.Vec2(20.0, 20.0));
              ground.CreateFixture(sd);
              // Top horizontal
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 20.0), new b2__namespace.Vec2(20.0, 20.0));
              ground.CreateFixture(sd);
              // Bottom horizontal
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, -20.0), new b2__namespace.Vec2(20.0, -20.0));
              ground.CreateFixture(sd);
          }
          {
              const xf1 = new b2__namespace.Transform();
              xf1.q.SetAngle(0.3524 * b2__namespace.pi);
              xf1.p.Copy(b2__namespace.Rot.MulRV(xf1.q, new b2__namespace.Vec2(1.0, 0.0), new b2__namespace.Vec2()));
              const vertices = new Array();
              vertices[0] = b2__namespace.Transform.MulXV(xf1, new b2__namespace.Vec2(-1.0, 0.0), new b2__namespace.Vec2());
              vertices[1] = b2__namespace.Transform.MulXV(xf1, new b2__namespace.Vec2(1.0, 0.0), new b2__namespace.Vec2());
              vertices[2] = b2__namespace.Transform.MulXV(xf1, new b2__namespace.Vec2(0.0, 0.5), new b2__namespace.Vec2());
              const poly1 = new b2__namespace.PolygonShape();
              poly1.Set(vertices, 3);
              const sd1 = new b2__namespace.FixtureDef();
              sd1.shape = poly1;
              sd1.density = 2.0;
              const xf2 = new b2__namespace.Transform();
              xf2.q.SetAngle(-0.3524 * b2__namespace.pi);
              xf2.p.Copy(b2__namespace.Rot.MulRV(xf2.q, new b2__namespace.Vec2(-1.0, 0.0), new b2__namespace.Vec2()));
              vertices[0] = b2__namespace.Transform.MulXV(xf2, new b2__namespace.Vec2(-1.0, 0.0), new b2__namespace.Vec2());
              vertices[1] = b2__namespace.Transform.MulXV(xf2, new b2__namespace.Vec2(1.0, 0.0), new b2__namespace.Vec2());
              vertices[2] = b2__namespace.Transform.MulXV(xf2, new b2__namespace.Vec2(0.0, 0.5), new b2__namespace.Vec2());
              const poly2 = new b2__namespace.PolygonShape();
              poly2.Set(vertices, 3);
              const sd2 = new b2__namespace.FixtureDef();
              sd2.shape = poly2;
              sd2.density = 2.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 3.0);
              bd.angle = b2__namespace.pi;
              bd.allowSleep = false;
              this.m_body = this.m_world.CreateBody(bd);
              this.m_body.CreateFixture(sd1);
              this.m_body.CreateFixture(sd2);
              const gravity = 10.0;
              const I = this.m_body.GetInertia();
              const mass = this.m_body.GetMass();
              // Compute an effective radius that can be used to
              // set the max torque for a friction joint
              // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
              const radius = b2__namespace.Sqrt(2.0 * I / mass);
              const jd = new b2__namespace.FrictionJointDef();
              jd.bodyA = ground;
              jd.bodyB = this.m_body;
              jd.localAnchorA.SetZero();
              jd.localAnchorB.Copy(this.m_body.GetLocalCenter());
              jd.collideConnected = true;
              jd.maxForce = 0.5 * mass * gravity;
              jd.maxTorque = 0.2 * mass * radius * gravity;
              this.m_world.CreateJoint(jd);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              fd.friction = 0.3;
              for (let i = 0; i < 10; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.0, 7.0 + 1.54 * i);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const gravity = 10.0;
                  const I = body.GetInertia();
                  const mass = body.GetMass();
                  // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
                  const radius = b2__namespace.Sqrt(2.0 * I / mass);
                  const jd = new b2__namespace.FrictionJointDef();
                  jd.localAnchorA.SetZero();
                  jd.localAnchorB.SetZero();
                  jd.bodyA = ground;
                  jd.bodyB = body;
                  jd.collideConnected = true;
                  jd.maxForce = mass * gravity;
                  jd.maxTorque = 0.1 * mass * radius * gravity;
                  this.m_world.CreateJoint(jd);
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "w":
                  {
                      const f = this.m_body.GetWorldVector(new b2__namespace.Vec2(0.0, -50.0), new b2__namespace.Vec2());
                      const p = this.m_body.GetWorldPoint(new b2__namespace.Vec2(0.0, 3.0), new b2__namespace.Vec2());
                      this.m_body.ApplyForce(f, p, true);
                  }
                  break;
              case "a":
                  {
                      this.m_body.ApplyTorque(10.0, true);
                  }
                  break;
              case "d":
                  {
                      this.m_body.ApplyTorque(-10.0, true);
                  }
                  break;
          }
          super.Keyboard(key);
      }
      Step(settings) {
          g_debugDraw.DrawString(5, this.m_textLine, `Forward (W), Turn (A) and (D)`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          super.Step(settings);
      }
      static Create() {
          return new ApplyForce();
      }
  }
  RegisterTest("Forces", "Apply Force", ApplyForce.Create);

  // MIT License
  class BodyTypes extends Test {
      constructor() {
          super();
          this.m_speed = 0;
          const bd = new b2__namespace.BodyDef();
          const ground = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.EdgeShape();
          shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 0.0), new b2__namespace.Vec2(20.0, 0.0));
          const fd = new b2__namespace.FixtureDef();
          fd.shape = shape;
          ground.CreateFixture(fd);
          // Define attachment
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 3.0);
              this.m_attachment = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 2.0);
              this.m_attachment.CreateFixture(shape, 2.0);
          }
          // Define platform
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-4.0, 5.0);
              this.m_platform = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 4.0, new b2__namespace.Vec2(4.0, 0.0), 0.5 * b2__namespace.pi);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.friction = 0.6;
              fd.density = 2.0;
              this.m_platform.CreateFixture(fd);
              const rjd = new b2__namespace.RevoluteJointDef();
              rjd.Initialize(this.m_attachment, this.m_platform, new b2__namespace.Vec2(0.0, 5.0));
              rjd.maxMotorTorque = 50.0;
              rjd.enableMotor = true;
              this.m_world.CreateJoint(rjd);
              const pjd = new b2__namespace.PrismaticJointDef();
              pjd.Initialize(ground, this.m_platform, new b2__namespace.Vec2(0.0, 5.0), new b2__namespace.Vec2(1.0, 0.0));
              pjd.maxMotorForce = 1000.0;
              pjd.enableMotor = true;
              pjd.lowerTranslation = -10.0;
              pjd.upperTranslation = 10.0;
              pjd.enableLimit = true;
              this.m_world.CreateJoint(pjd);
              this.m_speed = 3.0;
          }
          // Create a payload
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 8.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.75, 0.75);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.friction = 0.6;
              fd.density = 2.0;
              body.CreateFixture(fd);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "d":
                  this.m_platform.SetType(b2__namespace.BodyType.b2_dynamicBody);
                  break;
              case "s":
                  this.m_platform.SetType(b2__namespace.BodyType.b2_staticBody);
                  break;
              case "k":
                  this.m_platform.SetType(b2__namespace.BodyType.b2_kinematicBody);
                  this.m_platform.SetLinearVelocity(new b2__namespace.Vec2(-this.m_speed, 0.0));
                  this.m_platform.SetAngularVelocity(0.0);
                  break;
          }
      }
      Step(settings) {
          // Drive the kinematic body.
          if (this.m_platform.GetType() === b2__namespace.BodyType.b2_kinematicBody) {
              const p = this.m_platform.GetTransform().p;
              const v = this.m_platform.GetLinearVelocity();
              if ((p.x < -10.0 && v.x < 0.0) ||
                  (p.x > 10.0 && v.x > 0.0)) {
                  this.m_platform.SetLinearVelocity(new b2__namespace.Vec2(-v.x, v.y));
              }
          }
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (d) dynamic, (s) static, (k) kinematic");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new BodyTypes();
      }
  }
  RegisterTest("Examples", "Body Types", BodyTypes.Create);

  // MIT License
  class BoxStack extends Test {
      constructor() {
          super();
          this.m_bullet = null;
          this.m_bodies = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
          this.m_indices = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(20.0, 0.0), new b2__namespace.Vec2(20.0, 20.0));
              ground.CreateFixture(shape, 0.0);
          }
          const xs = [0.0, -10.0, -5.0, 5.0, 10.0];
          for (let j = 0; j < BoxStack.e_columnCount; ++j) {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              fd.friction = 0.3;
              for (let i = 0; i < BoxStack.e_rowCount; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  const n = j * BoxStack.e_rowCount + i;
                  // DEBUG: b2.Assert(n < BoxStack.e_rowCount * BoxStack.e_columnCount);
                  this.m_indices[n] = n;
                  bd.userData = this.m_indices[n];
                  const x = 0.0;
                  //const x = b2.RandomRange(-0.02, 0.02);
                  //const x = i % 2 === 0 ? -0.01 : 0.01;
                  bd.position.Set(xs[j] + x, 0.55 + 1.1 * i);
                  const body = this.m_world.CreateBody(bd);
                  this.m_bodies[n] = body;
                  body.CreateFixture(fd);
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case ",":
                  if (this.m_bullet) {
                      this.m_world.DestroyBody(this.m_bullet);
                      this.m_bullet = null;
                  }
                  {
                      const shape = new b2__namespace.CircleShape();
                      shape.m_radius = 0.25;
                      const fd = new b2__namespace.FixtureDef();
                      fd.shape = shape;
                      fd.density = 20.0;
                      fd.restitution = 0.05;
                      const bd = new b2__namespace.BodyDef();
                      bd.type = b2__namespace.BodyType.b2_dynamicBody;
                      bd.bullet = true;
                      bd.position.Set(-31.0, 5.0);
                      this.m_bullet = this.m_world.CreateBody(bd);
                      this.m_bullet.CreateFixture(fd);
                      this.m_bullet.SetLinearVelocity(new b2__namespace.Vec2(400.0, 0.0));
                  }
                  break;
              case "b":
                  b2__namespace.set_g_blockSolve(!b2__namespace.get_g_blockSolve());
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(b2.blockSolve) ? (1) : (0)}`);
          //if (this.m_stepCount === 300)
          //{
          //  if (this.m_bullet !== null)
          //  {
          //    this.m_world.DestroyBody(this.m_bullet);
          //    this.m_bullet = null;
          //  }
          //  {
          //    const shape = new b2.CircleShape();
          //    shape.m_radius = 0.25;
          //    const fd = new b2.FixtureDef();
          //    fd.shape = shape;
          //    fd.density = 20.0;
          //    fd.restitution = 0.05;
          //    const bd = new b2.BodyDef();
          //    bd.type = b2.BodyType.b2_dynamicBody;
          //    bd.bullet = true;
          //    bd.position.Set(-31.0, 5.0);
          //    this.m_bullet = this.m_world.CreateBody(bd);
          //    this.m_bullet.CreateFixture(fd);
          //    this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
          //  }
          //}
      }
      static Create() {
          return new BoxStack();
      }
  }
  BoxStack.e_columnCount = 1;
  BoxStack.e_rowCount = 15;
  RegisterTest("Stacking", "Boxes", BoxStack.Create);

  // MIT License
  // This is used to test sensor shapes.
  class Breakable extends Test {
      constructor() {
          super();
          this.m_velocity = new b2__namespace.Vec2();
          this.m_angularVelocity = 0;
          this.m_shape1 = new b2__namespace.PolygonShape();
          this.m_shape2 = new b2__namespace.PolygonShape();
          this.m_piece1 = null;
          this.m_piece2 = null;
          this.m_broke = false;
          this.m_break = false;
          // Ground body
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Breakable dynamic body
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 40.0);
              bd.angle = 0.25 * b2__namespace.pi;
              this.m_body1 = this.m_world.CreateBody(bd);
              this.m_shape1 = new b2__namespace.PolygonShape();
              this.m_shape1.SetAsBox(0.5, 0.5, new b2__namespace.Vec2(-0.5, 0.0), 0.0);
              this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);
              this.m_shape2 = new b2__namespace.PolygonShape();
              this.m_shape2.SetAsBox(0.5, 0.5, new b2__namespace.Vec2(0.5, 0.0), 0.0);
              this.m_piece2 = this.m_body1.CreateFixture(this.m_shape2, 1.0);
          }
      }
      PostSolve(contact, impulse) {
          if (this.m_broke) {
              // The body already broke.
              return;
          }
          // Should the body break?
          const count = contact.GetManifold().pointCount;
          let maxImpulse = 0.0;
          for (let i = 0; i < count; ++i) {
              maxImpulse = b2__namespace.Max(maxImpulse, impulse.normalImpulses[i]);
          }
          if (maxImpulse > 40.0) {
              // Flag the body for breaking.
              this.m_break = true;
          }
      }
      Break() {
          if (this.m_piece1 === null) {
              return;
          }
          if (this.m_piece2 === null) {
              return;
          }
          // Create two bodies from one.
          const body1 = this.m_piece1.GetBody();
          const center = body1.GetWorldCenter();
          body1.DestroyFixture(this.m_piece2);
          this.m_piece2 = null;
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Copy(body1.GetPosition());
          bd.angle = body1.GetAngle();
          const body2 = this.m_world.CreateBody(bd);
          this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);
          // Compute consistent velocities for new bodies based on
          // cached velocity.
          const center1 = body1.GetWorldCenter();
          const center2 = body2.GetWorldCenter();
          const velocity1 = b2__namespace.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2__namespace.Vec2.SubVV(center1, center, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
          const velocity2 = b2__namespace.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2__namespace.Vec2.SubVV(center2, center, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
          body1.SetAngularVelocity(this.m_angularVelocity);
          body1.SetLinearVelocity(velocity1);
          body2.SetAngularVelocity(this.m_angularVelocity);
          body2.SetLinearVelocity(velocity2);
      }
      Step(settings) {
          if (this.m_break) {
              this.Break();
              this.m_broke = true;
              this.m_break = false;
          }
          // Cache velocities to improve movement on breakage.
          if (!this.m_broke) {
              this.m_velocity.Copy(this.m_body1.GetLinearVelocity());
              this.m_angularVelocity = this.m_body1.GetAngularVelocity();
          }
          super.Step(settings);
      }
      static Create() {
          return new Breakable();
      }
  }
  Breakable.e_count = 7;
  RegisterTest("Examples", "Breakable", Breakable.Create);

  // MIT License
  class Bridge extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              fd.friction = 0.2;
              const jd = new b2__namespace.RevoluteJointDef();
              let prevBody = ground;
              for (let i = 0; i < Bridge.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-14.5 + 1.0 * i, 5.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const anchor = new b2__namespace.Vec2(-15.0 + 1.0 * i, 5.0);
                  jd.Initialize(prevBody, body, anchor);
                  this.m_world.CreateJoint(jd);
                  if (i === (Bridge.e_count >> 1)) {
                      this.m_middle = body;
                  }
                  prevBody = body;
              }
              const anchor = new b2__namespace.Vec2(-15.0 + 1.0 * Bridge.e_count, 5.0);
              jd.Initialize(prevBody, ground, anchor);
              this.m_world.CreateJoint(jd);
          }
          for (let i = 0; i < 2; ++i) {
              const vertices = new Array();
              vertices[0] = new b2__namespace.Vec2(-0.5, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              const shape = new b2__namespace.PolygonShape();
              shape.Set(vertices);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-8.0 + 8.0 * i, 12.0);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(fd);
          }
          for (let i = 0; i < 3; ++i) {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-6.0 + 6.0 * i, 10.0);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(fd);
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Bridge();
      }
  }
  Bridge.e_count = 30;
  RegisterTest("Joints", "Bridge", Bridge.Create);

  // MIT License
  class BulletTest extends Test {
      constructor() {
          super();
          this.m_x = 0;
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0.0, 0.0);
              const body = this.m_world.CreateBody(bd);
              const edge = new b2__namespace.EdgeShape();
              edge.SetTwoSided(new b2__namespace.Vec2(-10.0, 0.0), new b2__namespace.Vec2(10.0, 0.0));
              body.CreateFixture(edge, 0.0);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.2, 1.0, new b2__namespace.Vec2(0.5, 1.0), 0.0);
              body.CreateFixture(shape, 0.0);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 4.0);
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(2.0, 0.1);
              this.m_body = this.m_world.CreateBody(bd);
              this.m_body.CreateFixture(box, 1.0);
              box.SetAsBox(0.25, 0.25);
              //this.m_x = b2.RandomRange(-1.0, 1.0);
              this.m_x = 0.20352793;
              bd.position.Set(this.m_x, 10.0);
              bd.bullet = true;
              this.m_bullet = this.m_world.CreateBody(bd);
              this.m_bullet.CreateFixture(box, 100.0);
              this.m_bullet.SetLinearVelocity(new b2__namespace.Vec2(0.0, -50.0));
          }
      }
      Launch() {
          this.m_body.SetTransformVec(new b2__namespace.Vec2(0.0, 4.0), 0.0);
          this.m_body.SetLinearVelocity(b2__namespace.Vec2_zero);
          this.m_body.SetAngularVelocity(0.0);
          this.m_x = b2__namespace.RandomRange(-1.0, 1.0);
          this.m_bullet.SetTransformVec(new b2__namespace.Vec2(this.m_x, 10.0), 0.0);
          this.m_bullet.SetLinearVelocity(new b2__namespace.Vec2(0.0, -50.0));
          this.m_bullet.SetAngularVelocity(0.0);
          //  extern int32 b2.gjkCalls, b2.gjkIters, b2.gjkMaxIters;
          //  extern int32 b2.toiCalls, b2.toiIters, b2.toiMaxIters;
          //  extern int32 b2.toiRootIters, b2.toiMaxRootIters;
          // b2.gjkCalls = 0;
          // b2.gjkIters = 0;
          // b2.gjkMaxIters = 0;
          b2__namespace.gjk_reset();
          // b2.toiCalls = 0;
          // b2.toiIters = 0;
          // b2.toiMaxIters = 0;
          // b2.toiRootIters = 0;
          // b2.toiMaxRootIters = 0;
          b2__namespace.toi_reset();
      }
      Step(settings) {
          super.Step(settings);
          if (b2__namespace.gjkCalls > 0) {
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
              g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${b2__namespace.gjkCalls.toFixed(0)}, ave gjk iters = ${(b2__namespace.gjkIters / b2__namespace.gjkCalls).toFixed(1)}, max gjk iters = ${b2__namespace.gjkMaxIters.toFixed(0)}`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          if (b2__namespace.toiCalls > 0) {
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi calls = %d, ave toi iters = %3.1f, max toi iters = %d",
              g_debugDraw.DrawString(5, this.m_textLine, `toi calls = ${b2__namespace.toiCalls}, ave toi iters = ${(b2__namespace.toiIters / b2__namespace.toiCalls).toFixed(1)}, max toi iters = ${b2__namespace.toiMaxRootIters}`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave toi root iters = %3.1f, max toi root iters = %d",
              g_debugDraw.DrawString(5, this.m_textLine, `ave toi root iters = ${(b2__namespace.toiRootIters / b2__namespace.toiCalls).toFixed(1)}, max toi root iters = ${b2__namespace.toiMaxRootIters}`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          if (this.m_stepCount % 60 === 0) {
              this.Launch();
          }
      }
      static Create() {
          return new BulletTest();
      }
  }
  RegisterTest("Continuous", "Bullet Test", BulletTest.Create);

  // MIT License
  // It is difficult to make a cantilever made of links completely rigid with weld joints.
  // You will have to use a high number of iterations to make them stiff.
  // So why not go ahead and use soft weld joints? They behave like a revolute
  // joint with a rotational spring.
  class Cantilever extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              const jd = new b2__namespace.WeldJointDef();
              let prevBody = ground;
              for (let i = 0; i < Cantilever.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-14.5 + 1.0 * i, 5.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const anchor = new b2__namespace.Vec2(-15.0 + 1.0 * i, 5.0);
                  jd.Initialize(prevBody, body, anchor);
                  this.m_world.CreateJoint(jd);
                  prevBody = body;
              }
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.0, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              const jd = new b2__namespace.WeldJointDef();
              const frequencyHz = 5.0;
              const dampingRatio = 0.7;
              let prevBody = ground;
              for (let i = 0; i < 3; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-14.0 + 2.0 * i, 15.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const anchor = new b2__namespace.Vec2(-15.0 + 2.0 * i, 15.0);
                  jd.Initialize(prevBody, body, anchor);
                  b2__namespace.AngularStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
                  this.m_world.CreateJoint(jd);
                  prevBody = body;
              }
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              const jd = new b2__namespace.WeldJointDef();
              let prevBody = ground;
              for (let i = 0; i < Cantilever.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-4.5 + 1.0 * i, 15.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  if (i > 0) {
                      const anchor = new b2__namespace.Vec2(-5.0 + 1.0 * i, 15.0);
                      jd.Initialize(prevBody, body, anchor);
                      this.m_world.CreateJoint(jd);
                  }
                  prevBody = body;
              }
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              const jd = new b2__namespace.WeldJointDef();
              const frequencyHz = 8.0;
              const dampingRatio = 0.7;
              let prevBody = ground;
              for (let i = 0; i < Cantilever.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(5.5 + 1.0 * i, 10.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  if (i > 0) {
                      const anchor = new b2__namespace.Vec2(5.0 + 1.0 * i, 10.0);
                      jd.Initialize(prevBody, body, anchor);
                      b2__namespace.AngularStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
                      this.m_world.CreateJoint(jd);
                  }
                  prevBody = body;
              }
          }
          for (let i = 0; i < 2; ++i) {
              const vertices = new Array();
              vertices[0] = new b2__namespace.Vec2(-0.5, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              const shape = new b2__namespace.PolygonShape();
              shape.Set(vertices);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-8.0 + 8.0 * i, 12.0);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(fd);
          }
          for (let i = 0; i < 2; ++i) {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-6.0 + 6.0 * i, 10.0);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(fd);
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Cantilever();
      }
  }
  Cantilever.e_count = 8;
  RegisterTest("Joints", "Cantilever", Cantilever.Create);

  // MIT License
  // This is a fun demo that shows off the wheel joint
  class Car extends Test {
      constructor() {
          super();
          this.m_speed = 0.0;
          this.m_speed = 50.0;
          let ground;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 0.0;
              fd.friction = 0.6;
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 0.0), new b2__namespace.Vec2(20.0, 0.0));
              ground.CreateFixture(fd);
              const hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0];
              let x = 20.0, y1 = 0.0;
              const dx = 5.0;
              for (let i = 0; i < 10; ++i) {
                  const y2 = hs[i];
                  shape.SetTwoSided(new b2__namespace.Vec2(x, y1), new b2__namespace.Vec2(x + dx, y2));
                  ground.CreateFixture(fd);
                  y1 = y2;
                  x += dx;
              }
              for (let i = 0; i < 10; ++i) {
                  const y2 = hs[i];
                  shape.SetTwoSided(new b2__namespace.Vec2(x, y1), new b2__namespace.Vec2(x + dx, y2));
                  ground.CreateFixture(fd);
                  y1 = y2;
                  x += dx;
              }
              shape.SetTwoSided(new b2__namespace.Vec2(x, 0.0), new b2__namespace.Vec2(x + 40.0, 0.0));
              ground.CreateFixture(fd);
              x += 80.0;
              shape.SetTwoSided(new b2__namespace.Vec2(x, 0.0), new b2__namespace.Vec2(x + 40.0, 0.0));
              ground.CreateFixture(fd);
              x += 40.0;
              shape.SetTwoSided(new b2__namespace.Vec2(x, 0.0), new b2__namespace.Vec2(x + 10.0, 5.0));
              ground.CreateFixture(fd);
              x += 20.0;
              shape.SetTwoSided(new b2__namespace.Vec2(x, 0.0), new b2__namespace.Vec2(x + 40.0, 0.0));
              ground.CreateFixture(fd);
              x += 40.0;
              shape.SetTwoSided(new b2__namespace.Vec2(x, 0.0), new b2__namespace.Vec2(x, 20.0));
              ground.CreateFixture(fd);
          }
          // Teeter
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(140.0, 1.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(10.0, 0.25);
              body.CreateFixture(box, 1.0);
              const jd = new b2__namespace.RevoluteJointDef();
              jd.Initialize(ground, body, body.GetPosition());
              jd.lowerAngle = -8.0 * b2__namespace.pi / 180.0;
              jd.upperAngle = 8.0 * b2__namespace.pi / 180.0;
              jd.enableLimit = true;
              this.m_world.CreateJoint(jd);
              body.ApplyAngularImpulse(100.0);
          }
          // Bridge
          {
              const N = 20;
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.0, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              fd.friction = 0.6;
              const jd = new b2__namespace.RevoluteJointDef();
              let prevBody = ground;
              for (let i = 0; i < N; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(161.0 + 2.0 * i, -0.125);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const anchor = new b2__namespace.Vec2(160.0 + 2.0 * i, -0.125);
                  jd.Initialize(prevBody, body, anchor);
                  this.m_world.CreateJoint(jd);
                  prevBody = body;
              }
              const anchor = new b2__namespace.Vec2(160.0 + 2.0 * N, -0.125);
              jd.Initialize(prevBody, ground, anchor);
              this.m_world.CreateJoint(jd);
          }
          // Boxes
          {
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(0.5, 0.5);
              let body;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(230.0, 0.5);
              body = this.m_world.CreateBody(bd);
              body.CreateFixture(box, 0.5);
              bd.position.Set(230.0, 1.5);
              body = this.m_world.CreateBody(bd);
              body.CreateFixture(box, 0.5);
              bd.position.Set(230.0, 2.5);
              body = this.m_world.CreateBody(bd);
              body.CreateFixture(box, 0.5);
              bd.position.Set(230.0, 3.5);
              body = this.m_world.CreateBody(bd);
              body.CreateFixture(box, 0.5);
              bd.position.Set(230.0, 4.5);
              body = this.m_world.CreateBody(bd);
              body.CreateFixture(box, 0.5);
          }
          // Car
          {
              const chassis = new b2__namespace.PolygonShape();
              const vertices = b2__namespace.Vec2.MakeArray(8);
              vertices[0].Set(-1.5, -0.5);
              vertices[1].Set(1.5, -0.5);
              vertices[2].Set(1.5, 0.0);
              vertices[3].Set(0.0, 0.9);
              vertices[4].Set(-1.15, 0.9);
              vertices[5].Set(-1.5, 0.2);
              chassis.Set(vertices, 6);
              const circle = new b2__namespace.CircleShape();
              circle.m_radius = 0.4;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 1.0);
              this.m_car = this.m_world.CreateBody(bd);
              this.m_car.CreateFixture(chassis, 1.0);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = circle;
              fd.density = 1.0;
              fd.friction = 0.9;
              bd.position.Set(-1.0, 0.35);
              this.m_wheel1 = this.m_world.CreateBody(bd);
              this.m_wheel1.CreateFixture(fd);
              bd.position.Set(1.0, 0.4);
              this.m_wheel2 = this.m_world.CreateBody(bd);
              this.m_wheel2.CreateFixture(fd);
              const jd = new b2__namespace.WheelJointDef();
              const axis = new b2__namespace.Vec2(0.0, 1.0);
              const mass1 = this.m_wheel1.GetMass();
              const mass2 = this.m_wheel2.GetMass();
              const hertz = 4.0;
              const dampingRatio = 0.7;
              const omega = 2.0 * b2__namespace.pi * hertz;
              jd.Initialize(this.m_car, this.m_wheel1, this.m_wheel1.GetPosition(), axis);
              jd.motorSpeed = 0.0;
              jd.maxMotorTorque = 20.0;
              jd.enableMotor = true;
              jd.stiffness = mass1 * omega * omega;
              jd.damping = 2.0 * mass1 * dampingRatio * omega;
              jd.lowerTranslation = -0.25;
              jd.upperTranslation = 0.25;
              jd.enableLimit = true;
              this.m_spring1 = this.m_world.CreateJoint(jd);
              jd.Initialize(this.m_car, this.m_wheel2, this.m_wheel2.GetPosition(), axis);
              jd.motorSpeed = 0.0;
              jd.maxMotorTorque = 10.0;
              jd.enableMotor = false;
              jd.stiffness = mass2 * omega * omega;
              jd.damping = 2.0 * mass2 * dampingRatio * omega;
              jd.lowerTranslation = -0.25;
              jd.upperTranslation = 0.25;
              jd.enableLimit = true;
              this.m_spring2 = this.m_world.CreateJoint(jd);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_spring1.SetMotorSpeed(this.m_speed);
                  break;
              case "s":
                  this.m_spring1.SetMotorSpeed(0.0);
                  break;
              case "d":
                  this.m_spring1.SetMotorSpeed(-this.m_speed);
                  break;
          }
      }
      Step(settings) {
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, hz down = q, hz up = e");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_camera.m_center.x = this.m_car.GetPosition().x;
          super.Step(settings);
      }
      static Create() {
          return new Car();
      }
  }
  RegisterTest("Examples", "Car", Car.Create);

  // MIT License
  class Chain extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.6, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              fd.friction = 0.2;
              const jd = new b2__namespace.RevoluteJointDef();
              jd.collideConnected = false;
              const y = 25.0;
              let prevBody = ground;
              for (let i = 0; i < Chain.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.5 + i, y);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
                  const anchor = new b2__namespace.Vec2(i, y);
                  jd.Initialize(prevBody, body, anchor);
                  this.m_world.CreateJoint(jd);
                  prevBody = body;
              }
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Chain();
      }
  }
  Chain.e_count = 30;
  RegisterTest("Joints", "Chain", Chain.Create);

  // MIT License
  /// This is a test of typical character collision scenarios. This does not
  /// show how you should implement a character in your application.
  /// Instead this is used to test smooth collision on edge chains.
  class CharacterCollision extends Test {
      constructor() {
          super();
          // Ground body
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 0.0), new b2__namespace.Vec2(20.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Collinear edges with no adjacency information.
          // This shows the problematic case where a box shape can hit
          // an internal vertex.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-8.0, 1.0), new b2__namespace.Vec2(-6.0, 1.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(-6.0, 1.0), new b2__namespace.Vec2(-4.0, 1.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(-4.0, 1.0), new b2__namespace.Vec2(-2.0, 1.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Chain shape
          {
              const bd = new b2__namespace.BodyDef();
              bd.angle = 0.25 * b2__namespace.pi;
              const ground = this.m_world.CreateBody(bd);
              const vs = b2__namespace.Vec2.MakeArray(4);
              vs[0].Set(5.0, 7.0);
              vs[1].Set(6.0, 8.0);
              vs[2].Set(7.0, 8.0);
              vs[3].Set(8.0, 7.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vs);
              ground.CreateFixture(shape, 0.0);
          }
          // Square tiles. This shows that adjacency shapes may
          // have non-smooth collision. There is no solution
          // to this problem.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.0, 1.0, new b2__namespace.Vec2(4.0, 3.0), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(1.0, 1.0, new b2__namespace.Vec2(6.0, 3.0), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(1.0, 1.0, new b2__namespace.Vec2(8.0, 3.0), 0.0);
              ground.CreateFixture(shape, 0.0);
          }
          // Square made from an edge loop. Collision should be smooth.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const vs = b2__namespace.Vec2.MakeArray(4);
              vs[0].Set(-1.0, 3.0);
              vs[1].Set(1.0, 3.0);
              vs[2].Set(1.0, 5.0);
              vs[3].Set(-1.0, 5.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vs);
              ground.CreateFixture(shape, 0.0);
          }
          // Edge loop. Collision should be smooth.
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-10.0, 4.0);
              const ground = this.m_world.CreateBody(bd);
              const vs = b2__namespace.Vec2.MakeArray(10);
              vs[0].Set(0.0, 0.0);
              vs[1].Set(6.0, 0.0);
              vs[2].Set(6.0, 2.0);
              vs[3].Set(4.0, 1.0);
              vs[4].Set(2.0, 2.0);
              vs[5].Set(0.0, 2.0);
              vs[6].Set(-2.0, 2.0);
              vs[7].Set(-4.0, 3.0);
              vs[8].Set(-6.0, 2.0);
              vs[9].Set(-6.0, 0.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vs);
              ground.CreateFixture(shape, 0.0);
          }
          // Square character 1
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-3.0, 8.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.fixedRotation = true;
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              body.CreateFixture(fd);
          }
          // Square character 2
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-5.0, 5.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.fixedRotation = true;
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.25, 0.25);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              body.CreateFixture(fd);
          }
          // Hexagon character
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-5.0, 8.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.fixedRotation = true;
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              let angle = 0.0;
              const delta = b2__namespace.pi / 3.0;
              const vertices = b2__namespace.Vec2.MakeArray(6);
              for (let i = 0; i < 6; ++i) {
                  vertices[i].Set(0.5 * b2__namespace.Cos(angle), 0.5 * b2__namespace.Sin(angle));
                  angle += delta;
              }
              const shape = new b2__namespace.PolygonShape();
              shape.Set(vertices, 6);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              body.CreateFixture(fd);
          }
          // Circle character
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(3.0, 5.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.fixedRotation = true;
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              body.CreateFixture(fd);
          }
          // Circle character
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-7.0, 6.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.allowSleep = false;
              this.m_character = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.25;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              fd.friction = 1.0;
              this.m_character.CreateFixture(fd);
          }
      }
      Step(settings) {
          const v = this.m_character.GetLinearVelocity().Clone();
          v.x = -5.0;
          this.m_character.SetLinearVelocity(v);
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "This tests various character collision shapes");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "Limitation: square and hexagon can snag on aligned boxes.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "Feature: edge chains have smooth collision inside and out.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new CharacterCollision();
      }
  }
  RegisterTest("Examples", "Character Collision", CharacterCollision.Create);

  // MIT License
  class CircleStack extends Test {
      constructor() {
          super();
          this.m_bodies = [];
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 1.0;
              for (let i = 0; i < CircleStack.e_count; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.0, 4.0 + 3.0 * i);
                  this.m_bodies[i] = this.m_world.CreateBody(bd);
                  this.m_bodies[i].CreateFixture(shape, 1.0);
                  this.m_bodies[i].SetLinearVelocity(new b2__namespace.Vec2(0.0, -50.0));
              }
          }
      }
      Step(settings) {
          super.Step(settings);
          // for (let i: number = 0; i < CircleStack.e_count; ++i)
          // {
          //   printf("%g ", this.m_bodies[i].GetWorldCenter().y);
          // }
          // for (let i: number = 0; i < CircleStack.e_count; ++i)
          // {
          //   printf("%g ", this.m_bodies[i].GetLinearVelocity().y);
          // }
          // printf("\n");
      }
      static Create() {
          return new CircleStack();
      }
  }
  CircleStack.e_count = 10;
  RegisterTest("Stacking", "Circles", CircleStack.Create);

  // MIT License
  // This is a test of collision filtering.
  // There is a triangle, a box, and a circle.
  // There are 6 shapes. 3 large and 3 small.
  // The 3 small ones always collide.
  // The 3 large ones never collide.
  // The boxes don't collide with triangles (except if both are small).
  class CollisionFiltering extends Test {
      constructor() {
          super();
          // Ground body
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              const sd = new b2__namespace.FixtureDef();
              sd.shape = shape;
              sd.friction = 0.3;
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(sd);
          }
          // Small triangle
          const vertices = new Array();
          vertices[0] = new b2__namespace.Vec2(-1.0, 0.0);
          vertices[1] = new b2__namespace.Vec2(1.0, 0.0);
          vertices[2] = new b2__namespace.Vec2(0.0, 2.0);
          const polygon = new b2__namespace.PolygonShape();
          polygon.Set(vertices, 3);
          const triangleShapeDef = new b2__namespace.FixtureDef();
          triangleShapeDef.shape = polygon;
          triangleShapeDef.density = 1.0;
          triangleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
          triangleShapeDef.filter.categoryBits = CollisionFiltering.k_triangleCategory;
          triangleShapeDef.filter.maskBits = CollisionFiltering.k_triangleMask;
          const triangleBodyDef = new b2__namespace.BodyDef();
          triangleBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          triangleBodyDef.position.Set(-5.0, 2.0);
          const body1 = this.m_world.CreateBody(triangleBodyDef);
          body1.CreateFixture(triangleShapeDef);
          // Large triangle (recycle definitions)
          vertices[0].SelfMul(2.0);
          vertices[1].SelfMul(2.0);
          vertices[2].SelfMul(2.0);
          polygon.Set(vertices, 3);
          triangleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
          triangleBodyDef.position.Set(-5.0, 6.0);
          triangleBodyDef.fixedRotation = true; // look at me!
          const body2 = this.m_world.CreateBody(triangleBodyDef);
          body2.CreateFixture(triangleShapeDef);
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-5.0, 10.0);
              const body = this.m_world.CreateBody(bd);
              const p = new b2__namespace.PolygonShape();
              p.SetAsBox(0.5, 1.0);
              body.CreateFixture(p, 1.0);
              const jd = new b2__namespace.PrismaticJointDef();
              jd.bodyA = body2;
              jd.bodyB = body;
              jd.enableLimit = true;
              jd.localAnchorA.Set(0.0, 4.0);
              jd.localAnchorB.SetZero();
              jd.localAxisA.Set(0.0, 1.0);
              jd.lowerTranslation = -1.0;
              jd.upperTranslation = 1.0;
              this.m_world.CreateJoint(jd);
          }
          // Small box
          polygon.SetAsBox(1.0, 0.5);
          const boxShapeDef = new b2__namespace.FixtureDef();
          boxShapeDef.shape = polygon;
          boxShapeDef.density = 1.0;
          boxShapeDef.restitution = 0.1;
          boxShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
          boxShapeDef.filter.categoryBits = CollisionFiltering.k_boxCategory;
          boxShapeDef.filter.maskBits = CollisionFiltering.k_boxMask;
          const boxBodyDef = new b2__namespace.BodyDef();
          boxBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          boxBodyDef.position.Set(0.0, 2.0);
          const body3 = this.m_world.CreateBody(boxBodyDef);
          body3.CreateFixture(boxShapeDef);
          // Large box (recycle definitions)
          polygon.SetAsBox(2.0, 1.0);
          boxShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
          boxBodyDef.position.Set(0.0, 6.0);
          const body4 = this.m_world.CreateBody(boxBodyDef);
          body4.CreateFixture(boxShapeDef);
          // Small circle
          const circle = new b2__namespace.CircleShape();
          circle.m_radius = 1.0;
          const circleShapeDef = new b2__namespace.FixtureDef();
          circleShapeDef.shape = circle;
          circleShapeDef.density = 1.0;
          circleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
          circleShapeDef.filter.categoryBits = CollisionFiltering.k_circleCategory;
          circleShapeDef.filter.maskBits = CollisionFiltering.k_circleMask;
          const circleBodyDef = new b2__namespace.BodyDef();
          circleBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          circleBodyDef.position.Set(5.0, 2.0);
          const body5 = this.m_world.CreateBody(circleBodyDef);
          body5.CreateFixture(circleShapeDef);
          // Large circle
          circle.m_radius *= 2.0;
          circleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
          circleBodyDef.position.Set(5.0, 6.0);
          const body6 = this.m_world.CreateBody(circleBodyDef);
          body6.CreateFixture(circleShapeDef);
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new CollisionFiltering();
      }
  }
  CollisionFiltering.k_smallGroup = 1;
  CollisionFiltering.k_largeGroup = -1;
  CollisionFiltering.k_triangleCategory = 0x0002;
  CollisionFiltering.k_boxCategory = 0x0004;
  CollisionFiltering.k_circleCategory = 0x0008;
  CollisionFiltering.k_triangleMask = 0xFFFF;
  CollisionFiltering.k_boxMask = 0xFFFF ^ CollisionFiltering.k_triangleCategory;
  CollisionFiltering.k_circleMask = 0xFFFF;
  RegisterTest("Examples", "Collision Filtering", CollisionFiltering.Create);

  // MIT License
  // This test shows collision processing and tests
  // deferred body destruction.
  class CollisionProcessing extends Test {
      constructor() {
          super();
          // Ground body
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              const sd = new b2__namespace.FixtureDef();
              sd.shape = shape;
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(sd);
          }
          const xLo = -5.0, xHi = 5.0;
          const yLo = 2.0, yHi = 35.0;
          // Small triangle
          const vertices = new Array(3);
          vertices[0] = new b2__namespace.Vec2(-1.0, 0.0);
          vertices[1] = new b2__namespace.Vec2(1.0, 0.0);
          vertices[2] = new b2__namespace.Vec2(0.0, 2.0);
          const polygon = new b2__namespace.PolygonShape();
          polygon.Set(vertices, 3);
          const triangleShapeDef = new b2__namespace.FixtureDef();
          triangleShapeDef.shape = polygon;
          triangleShapeDef.density = 1.0;
          const triangleBodyDef = new b2__namespace.BodyDef();
          triangleBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          triangleBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body1 = this.m_world.CreateBody(triangleBodyDef);
          body1.CreateFixture(triangleShapeDef);
          // Large triangle (recycle definitions)
          vertices[0].SelfMul(2.0);
          vertices[1].SelfMul(2.0);
          vertices[2].SelfMul(2.0);
          polygon.Set(vertices, 3);
          triangleBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body2 = this.m_world.CreateBody(triangleBodyDef);
          body2.CreateFixture(triangleShapeDef);
          // Small box
          polygon.SetAsBox(1.0, 0.5);
          const boxShapeDef = new b2__namespace.FixtureDef();
          boxShapeDef.shape = polygon;
          boxShapeDef.density = 1.0;
          const boxBodyDef = new b2__namespace.BodyDef();
          boxBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          boxBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body3 = this.m_world.CreateBody(boxBodyDef);
          body3.CreateFixture(boxShapeDef);
          // Large box (recycle definitions)
          polygon.SetAsBox(2.0, 1.0);
          boxBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body4 = this.m_world.CreateBody(boxBodyDef);
          body4.CreateFixture(boxShapeDef);
          // Small circle
          const circle = new b2__namespace.CircleShape();
          circle.m_radius = 1.0;
          const circleShapeDef = new b2__namespace.FixtureDef();
          circleShapeDef.shape = circle;
          circleShapeDef.density = 1.0;
          const circleBodyDef = new b2__namespace.BodyDef();
          circleBodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          circleBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body5 = this.m_world.CreateBody(circleBodyDef);
          body5.CreateFixture(circleShapeDef);
          // Large circle
          circle.m_radius *= 2.0;
          circleBodyDef.position.Set(b2__namespace.RandomRange(xLo, xHi), b2__namespace.RandomRange(yLo, yHi));
          const body6 = this.m_world.CreateBody(circleBodyDef);
          body6.CreateFixture(circleShapeDef);
      }
      Step(settings) {
          super.Step(settings);
          // We are going to destroy some bodies according to contact
          // points. We must buffer the bodies that should be destroyed
          // because they may belong to multiple contact points.
          const k_maxNuke = 6;
          const nuke = new Array(k_maxNuke);
          let nukeCount = 0;
          // Traverse the contact results. Destroy bodies that
          // are touching heavier bodies.
          for (let i = 0; i < this.m_pointCount; ++i) {
              const point = this.m_points[i];
              const body1 = point.fixtureA.GetBody();
              const body2 = point.fixtureB.GetBody();
              const mass1 = body1.GetMass();
              const mass2 = body2.GetMass();
              if (mass1 > 0.0 && mass2 > 0.0) {
                  if (mass2 > mass1) {
                      nuke[nukeCount++] = body1;
                  }
                  else {
                      nuke[nukeCount++] = body2;
                  }
                  if (nukeCount === k_maxNuke) {
                      break;
                  }
              }
          }
          // Sort the nuke array to group duplicates.
          nuke.sort((a, b) => {
              return a - b;
          });
          // Destroy the bodies, skipping duplicates.
          let i = 0;
          while (i < nukeCount) {
              const b = nuke[i++];
              while (i < nukeCount && nuke[i] === b) {
                  ++i;
              }
              if (b !== this.m_bomb) {
                  this.m_world.DestroyBody(b);
              }
          }
      }
      static Create() {
          return new CollisionProcessing();
      }
  }
  RegisterTest("Examples", "Collision Processing", CollisionProcessing.Create);

  // MIT License
  class CompoundShapes extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(50.0, 0.0), new b2__namespace.Vec2(-50.0, 0.0));
              body.CreateFixture(shape, 0.0);
          }
          // Table 1
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Set(-15.0, 1.0);
              this.m_table1 = this.m_world.CreateBody(bd);
              const top = new b2__namespace.PolygonShape();
              top.SetAsBox(3.0, 0.5, new b2__namespace.Vec2(0.0, 3.5), 0.0);
              const leftLeg = new b2__namespace.PolygonShape();
              leftLeg.SetAsBox(0.5, 1.5, new b2__namespace.Vec2(-2.5, 1.5), 0.0);
              const rightLeg = new b2__namespace.PolygonShape();
              rightLeg.SetAsBox(0.5, 1.5, new b2__namespace.Vec2(2.5, 1.5), 0.0);
              this.m_table1.CreateFixture(top, 2.0);
              this.m_table1.CreateFixture(leftLeg, 2.0);
              this.m_table1.CreateFixture(rightLeg, 2.0);
          }
          // Table 2
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Set(-5.0, 1.0);
              this.m_table2 = this.m_world.CreateBody(bd);
              const top = new b2__namespace.PolygonShape();
              top.SetAsBox(3.0, 0.5, new b2__namespace.Vec2(0.0, 3.5), 0.0);
              const leftLeg = new b2__namespace.PolygonShape();
              leftLeg.SetAsBox(0.5, 2.0, new b2__namespace.Vec2(-2.5, 2.0), 0.0);
              const rightLeg = new b2__namespace.PolygonShape();
              rightLeg.SetAsBox(0.5, 2.0, new b2__namespace.Vec2(2.5, 2.0), 0.0);
              this.m_table2.CreateFixture(top, 2.0);
              this.m_table2.CreateFixture(leftLeg, 2.0);
              this.m_table2.CreateFixture(rightLeg, 2.0);
          }
          // Spaceship 1
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Set(5.0, 1.0);
              this.m_ship1 = this.m_world.CreateBody(bd);
              const vertices = b2__namespace.Vec2.MakeArray(3);
              const left = new b2__namespace.PolygonShape();
              vertices[0].Set(-2.0, 0.0);
              vertices[1].Set(0.0, 4.0 / 3.0);
              vertices[2].Set(0.0, 4.0);
              left.Set(vertices, 3);
              const right = new b2__namespace.PolygonShape();
              vertices[0].Set(2.0, 0.0);
              vertices[1].Set(0.0, 4.0 / 3.0);
              vertices[2].Set(0.0, 4.0);
              right.Set(vertices, 3);
              this.m_ship1.CreateFixture(left, 2.0);
              this.m_ship1.CreateFixture(right, 2.0);
          }
          // Spaceship 2
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Set(15.0, 1.0);
              this.m_ship2 = this.m_world.CreateBody(bd);
              const vertices = b2__namespace.Vec2.MakeArray(3);
              const left = new b2__namespace.PolygonShape();
              vertices[0].Set(-2.0, 0.0);
              vertices[1].Set(1.0, 2.0);
              vertices[2].Set(0.0, 4.0);
              left.Set(vertices, 3);
              const right = new b2__namespace.PolygonShape();
              vertices[0].Set(2.0, 0.0);
              vertices[1].Set(-1.0, 2.0);
              vertices[2].Set(0.0, 4.0);
              right.Set(vertices, 3);
              this.m_ship2.CreateFixture(left, 2.0);
              this.m_ship2.CreateFixture(right, 2.0);
          }
      }
      Spawn() {
          // Table 1 obstruction
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Copy(this.m_table1.GetPosition());
              bd.angle = this.m_table1.GetAngle();
              const body = this.m_world.CreateBody(bd);
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(4.0, 0.1, new b2__namespace.Vec2(0.0, 3.0), 0.0);
              body.CreateFixture(box, 2.0);
          }
          // Table 2 obstruction
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Copy(this.m_table2.GetPosition());
              bd.angle = this.m_table2.GetAngle();
              const body = this.m_world.CreateBody(bd);
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(4.0, 0.1, new b2__namespace.Vec2(0.0, 3.0), 0.0);
              body.CreateFixture(box, 2.0);
          }
          // Ship 1 obstruction
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Copy(this.m_ship1.GetPosition());
              bd.angle = this.m_ship1.GetAngle();
              bd.gravityScale = 0.0;
              const body = this.m_world.CreateBody(bd);
              const circle = new b2__namespace.CircleShape();
              circle.m_radius = 0.5;
              circle.m_p.Set(0.0, 2.0);
              body.CreateFixture(circle, 2.0);
          }
          // Ship 2 obstruction
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Copy(this.m_ship2.GetPosition());
              bd.angle = this.m_ship2.GetAngle();
              bd.gravityScale = 0.0;
              const body = this.m_world.CreateBody(bd);
              const circle = new b2__namespace.CircleShape();
              circle.m_radius = 0.5;
              circle.m_p.Set(0.0, 2.0);
              body.CreateFixture(circle, 2.0);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "s":
                  this.Spawn();
                  break;
          }
          super.Keyboard(key);
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new CompoundShapes();
      }
  }
  RegisterTest("Examples", "Compound Shapes", CompoundShapes.Create);

  // MIT License
  class Confined extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              // Floor
              shape.SetTwoSided(new b2__namespace.Vec2(-10.0, 0.0), new b2__namespace.Vec2(10.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              // Left wall
              shape.SetTwoSided(new b2__namespace.Vec2(-10.0, 0.0), new b2__namespace.Vec2(-10.0, 20.0));
              ground.CreateFixture(shape, 0.0);
              // Right wall
              shape.SetTwoSided(new b2__namespace.Vec2(10.0, 0.0), new b2__namespace.Vec2(10.0, 20.0));
              ground.CreateFixture(shape, 0.0);
              // Roof
              shape.SetTwoSided(new b2__namespace.Vec2(-10.0, 20.0), new b2__namespace.Vec2(10.0, 20.0));
              ground.CreateFixture(shape, 0.0);
          }
          const radius = 0.5;
          const shape = new b2__namespace.CircleShape();
          shape.m_p.SetZero();
          shape.m_radius = radius;
          const fd = new b2__namespace.FixtureDef();
          fd.shape = shape;
          fd.density = 1.0;
          fd.friction = 0.1;
          for (let j = 0; j < Confined.e_columnCount; ++j) {
              for (let i = 0; i < Confined.e_rowCount; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-10.0 + (2.1 * j + 1.0 + 0.01 * i) * radius, (2.0 * i + 1.0) * radius);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
              }
          }
          this.m_world.SetGravity(new b2__namespace.Vec2(0.0, 0.0));
      }
      CreateCircle() {
          const radius = 2.0;
          const shape = new b2__namespace.CircleShape();
          shape.m_p.SetZero();
          shape.m_radius = radius;
          const fd = new b2__namespace.FixtureDef();
          fd.shape = shape;
          fd.density = 1.0;
          fd.friction = 0.0;
          const p = new b2__namespace.Vec2(b2__namespace.Random(), 3.0 + b2__namespace.Random());
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Copy(p);
          //bd.allowSleep = false;
          const body = this.m_world.CreateBody(bd);
          body.CreateFixture(fd);
      }
      Keyboard(key) {
          switch (key) {
              case "c":
                  this.CreateCircle();
                  break;
          }
      }
      Step(settings) {
          for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
              if (b.GetType() !== b2__namespace.BodyType.b2_dynamicBody) {
                  continue;
              }
              if (b.IsAwake()) ;
          }
          if (this.m_stepCount === 180) {
              this.m_stepCount += 0;
          }
          super.Step(settings);
          for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
              if (b.GetType() !== b2__namespace.BodyType.b2_dynamicBody) {
                  continue;
              }
              // const p = b.GetPosition();
              // if (p.x <= -10.0 || 10.0 <= p.x || p.y <= 0.0 || 20.0 <= p.y) {
              //   p.x += 0.0;
              // }
          }
          g_debugDraw.DrawString(5, this.m_textLine, "Press 'c' to create a circle.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Confined();
      }
  }
  Confined.e_columnCount = 0;
  Confined.e_rowCount = 0;
  RegisterTest("Solver", "Confined", Confined.Create);

  // MIT License
  class ContinuousTest extends Test {
      constructor() {
          super();
          this.m_angularVelocity = 0.0;
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0.0, 0.0);
              const body = this.m_world.CreateBody(bd);
              const edge = new b2__namespace.EdgeShape();
              edge.SetTwoSided(new b2__namespace.Vec2(-10.0, 0.0), new b2__namespace.Vec2(10.0, 0.0));
              body.CreateFixture(edge, 0.0);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.2, 1.0, new b2__namespace.Vec2(0.5, 1.0), 0.0);
              body.CreateFixture(shape, 0.0);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 20.0);
              //bd.angle = 0.1;
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(2.0, 0.1);
              this.m_body = this.m_world.CreateBody(bd);
              this.m_body.CreateFixture(shape, 1.0);
              this.m_angularVelocity = b2__namespace.RandomRange(-50.0, 50.0);
              //this.m_angularVelocity = 46.661274;
              this.m_body.SetLinearVelocity(new b2__namespace.Vec2(0.0, -100.0));
              this.m_body.SetAngularVelocity(this.m_angularVelocity);
          }
          /*
          else
          {
            const bd = new b2.BodyDef();
            bd.type = b2.BodyType.b2_dynamicBody;
            bd.position.Set(0.0, 2.0);
            const body = this.m_world.CreateBody(bd);
            const shape = new b2.CircleShape();
            shape.m_p.SetZero();
            shape.m_radius = 0.5;
            body.CreateFixture(shape, 1.0);
            bd.bullet = true;
            bd.position.Set(0.0, 10.0);
            body = this.m_world.CreateBody(bd);
            body.CreateFixture(shape, 1.0);
            body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
          }
          */
          // b2.gjkCalls = 0;
          // b2.gjkIters = 0;
          // b2.gjkMaxIters = 0;
          b2__namespace.gjk_reset();
          // b2.toiCalls = 0;
          // b2.toiIters = 0;
          // b2.toiRootIters = 0;
          // b2.toiMaxRootIters = 0;
          // b2.toiTime = 0.0;
          // b2.toiMaxTime = 0.0;
          b2__namespace.toi_reset();
      }
      Launch() {
          // b2.gjkCalls = 0;
          // b2.gjkIters = 0;
          // b2.gjkMaxIters = 0;
          b2__namespace.gjk_reset();
          // b2.toiCalls = 0;
          // b2.toiIters = 0;
          // b2.toiRootIters = 0;
          // b2.toiMaxRootIters = 0;
          // b2.toiTime = 0.0;
          // b2.toiMaxTime = 0.0;
          b2__namespace.toi_reset();
          this.m_body.SetTransformVec(new b2__namespace.Vec2(0.0, 20.0), 0.0);
          this.m_angularVelocity = b2__namespace.RandomRange(-50.0, 50.0);
          this.m_body.SetLinearVelocity(new b2__namespace.Vec2(0.0, -100.0));
          this.m_body.SetAngularVelocity(this.m_angularVelocity);
      }
      Step(settings) {
          super.Step(settings);
          if (b2__namespace.gjkCalls > 0) {
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
              g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${b2__namespace.gjkCalls.toFixed(0)}, ave gjk iters = ${(b2__namespace.gjkIters / b2__namespace.gjkCalls).toFixed(1)}, max gjk iters = ${b2__namespace.gjkMaxIters.toFixed(0)}`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          if (b2__namespace.toiCalls > 0) {
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi [max] calls = %d, ave toi iters = %3.1f [%d]",
              g_debugDraw.DrawString(5, this.m_textLine, `toi [max] calls = ${b2__namespace.toiCalls}, ave toi iters = ${(b2__namespace.toiIters / b2__namespace.toiCalls).toFixed(1)} [${b2__namespace.toiMaxRootIters}]`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi root iters = %3.1f [%d]",
              g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi root iters = ${(b2__namespace.toiRootIters / b2__namespace.toiCalls).toFixed(1)} [${b2__namespace.toiMaxRootIters.toFixed(0)}]`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi time = %.1f [%.1f] (microseconds)",
              g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi time = ${(1000.0 * b2__namespace.toiTime / b2__namespace.toiCalls).toFixed(1)} [${(1000.0 * b2__namespace.toiMaxTime).toFixed(1)}] (microseconds)`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          if (this.m_stepCount % 60 === 0) {
              this.Launch();
          }
      }
      static Create() {
          return new ContinuousTest();
      }
  }
  RegisterTest("Continuous", "Continuous Test", ContinuousTest.Create);

  // MIT License
  class ConvexHull extends Test {
      constructor() {
          super();
          this.m_test_points = [];
          this.m_count = 0;
          this.m_auto = false;
          this.Generate();
      }
      Generate() {
          for (let i = 0; i < ConvexHull.e_count; ++i) {
              let x = b2__namespace.RandomRange(-10.0, 10.0);
              let y = b2__namespace.RandomRange(-10.0, 10.0);
              // Clamp onto a square to help create collinearities.
              // This will stress the convex hull algorithm.
              x = b2__namespace.Clamp(x, -8.0, 8.0);
              y = b2__namespace.Clamp(y, -8.0, 8.0);
              this.m_test_points[i] = new b2__namespace.Vec2(x, y);
          }
          this.m_count = ConvexHull.e_count;
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_auto = !this.m_auto;
                  break;
              case "g":
                  this.Generate();
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          const shape = new b2__namespace.PolygonShape();
          shape.Set(this.m_test_points, this.m_count);
          g_debugDraw.DrawString(5, this.m_textLine, "Press g to generate a new random convex hull");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawPolygon(shape.m_vertices, shape.m_count, new b2__namespace.Color(0.9, 0.9, 0.9));
          for (let i = 0; i < this.m_count; ++i) {
              g_debugDraw.DrawPoint(this.m_test_points[i], 3.0, new b2__namespace.Color(0.3, 0.9, 0.3));
              g_debugDraw.DrawStringWorld(this.m_test_points[i].x + 0.05, this.m_test_points[i].y + 0.05, `${i}`);
          }
          if (!shape.Validate()) {
              this.m_textLine += 0;
          }
          if (this.m_auto) {
              this.Generate();
          }
      }
      static Create() {
          return new ConvexHull();
      }
  }
  ConvexHull.e_count = 10;
  RegisterTest("Geometry", "Convex Hull", ConvexHull.Create);

  // MIT License
  class ConveyorBelt extends Test {
      constructor() {
          super();
          // Ground
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 0.0), new b2__namespace.Vec2(20.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Platform
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-5.0, 5.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(10.0, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.friction = 0.8;
              this.m_platform = body.CreateFixture(fd);
          }
          // Boxes
          for (let i = 0; i < 5; ++i) {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-10.0 + 2.0 * i, 7.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              body.CreateFixture(shape, 20.0);
          }
      }
      PreSolve(contact, oldManifold) {
          super.PreSolve(contact, oldManifold);
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          if (fixtureA === this.m_platform) {
              contact.SetTangentSpeed(5.0);
          }
          if (fixtureB === this.m_platform) {
              contact.SetTangentSpeed(-5.0);
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new ConveyorBelt();
      }
  }
  RegisterTest("Examples", "Conveyor Belt", ConveyorBelt.Create);

  // MIT License
  // This tests distance joints, body destruction, and joint destruction.
  class DistanceJoint extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.angularDamping = 0.1;
              bd.position.Set(0.0, 5.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              body.CreateFixture(shape, 5.0);
              this.m_hertz = 1.0;
              this.m_dampingRatio = 0.7;
              const jd = new b2__namespace.DistanceJointDef();
              jd.Initialize(ground, body, new b2__namespace.Vec2(0.0, 15.0), bd.position);
              jd.collideConnected = true;
              this.m_length = jd.length;
              this.m_minLength = jd.minLength = jd.length - 3;
              this.m_maxLength = jd.maxLength = jd.length + 3;
              b2__namespace.LinearStiffness(jd, this.m_hertz, this.m_dampingRatio, jd.bodyA, jd.bodyB);
              this.m_joint = this.m_world.CreateJoint(jd);
          }
      }
      Keyboard(key) {
      }
      Step(settings) {
          super.Step(settings);
          // testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
          // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
          // const force = this.m_joint.GetMotorForce(settings.m_hertz);
          // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
          // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new DistanceJoint();
      }
  }
  RegisterTest("Joints", "DistanceJoint", DistanceJoint.Create);

  // MIT License
  class DistanceTest extends Test {
      constructor() {
          super();
          this.m_positionB = new b2__namespace.Vec2();
          this.m_angleB = 0;
          this.m_transformA = new b2__namespace.Transform();
          this.m_transformB = new b2__namespace.Transform();
          this.m_polygonA = new b2__namespace.PolygonShape();
          this.m_polygonB = new b2__namespace.PolygonShape();
          {
              this.m_transformA.SetIdentity();
              this.m_transformA.p.Set(0.0, -0.2);
              this.m_polygonA.SetAsBox(10.0, 0.2);
          }
          {
              this.m_positionB.Set(12.017401, 0.13678508);
              this.m_angleB = -0.0109265;
              this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
              this.m_polygonB.SetAsBox(2.0, 0.1);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_positionB.x -= 0.1;
                  break;
              case "d":
                  this.m_positionB.x += 0.1;
                  break;
              case "s":
                  this.m_positionB.y -= 0.1;
                  break;
              case "w":
                  this.m_positionB.y += 0.1;
                  break;
              case "q":
                  this.m_angleB += 0.1 * b2__namespace.pi;
                  break;
              case "e":
                  this.m_angleB -= 0.1 * b2__namespace.pi;
                  break;
          }
          this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
      }
      Step(settings) {
          super.Step(settings);
          const input = new b2__namespace.DistanceInput();
          input.proxyA.SetShape(this.m_polygonA, 0);
          input.proxyB.SetShape(this.m_polygonB, 0);
          input.transformA.Copy(this.m_transformA);
          input.transformB.Copy(this.m_transformB);
          input.useRadii = true;
          const cache = new b2__namespace.SimplexCache();
          cache.count = 0;
          const output = new b2__namespace.DistanceOutput();
          b2__namespace.Distance(output, cache, input);
          g_debugDraw.DrawString(5, this.m_textLine, `distance = ${output.distance.toFixed(2)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, `iterations = ${output.iterations}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          {
              const color = new b2__namespace.Color(0.9, 0.9, 0.9);
              const v = [];
              for (let i = 0; i < this.m_polygonA.m_count; ++i) {
                  v[i] = b2__namespace.Transform.MulXV(this.m_transformA, this.m_polygonA.m_vertices[i], new b2__namespace.Vec2());
              }
              g_debugDraw.DrawPolygon(v, this.m_polygonA.m_count, color);
              for (let i = 0; i < this.m_polygonB.m_count; ++i) {
                  v[i] = b2__namespace.Transform.MulXV(this.m_transformB, this.m_polygonB.m_vertices[i], new b2__namespace.Vec2());
              }
              g_debugDraw.DrawPolygon(v, this.m_polygonB.m_count, color);
          }
          const x1 = output.pointA;
          const x2 = output.pointB;
          const c1 = new b2__namespace.Color(1.0, 0.0, 0.0);
          g_debugDraw.DrawPoint(x1, 4.0, c1);
          const c2 = new b2__namespace.Color(1.0, 1.0, 0.0);
          g_debugDraw.DrawPoint(x2, 4.0, c2);
      }
      static Create() {
          return new DistanceTest();
      }
  }
  RegisterTest("Geometry", "Distance Test", DistanceTest.Create);

  // MIT License
  class Dominos extends Test {
      constructor() {
          super();
          let b1 = null;
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              const bd = new b2__namespace.BodyDef();
              b1 = this.m_world.CreateBody(bd);
              b1.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(6.0, 0.25);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-1.5, 10.0);
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.1, 1.0);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              fd.friction = 0.1;
              for (let i = 0; i < 10; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-6.0 + 1.0 * i, 11.25);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(fd);
              }
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(7.0, 0.25, b2__namespace.Vec2_zero, 0.3);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(1.0, 6.0);
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          let _b2 = null;
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.25, 1.5);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-7.0, 4.0);
              _b2 = this.m_world.CreateBody(bd);
              _b2.CreateFixture(shape, 0.0);
          }
          let b3 = null;
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(6.0, 0.125);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-0.9, 1.0);
              bd.angle = -0.15;
              b3 = this.m_world.CreateBody(bd);
              b3.CreateFixture(shape, 10.0);
          }
          const jd = new b2__namespace.RevoluteJointDef();
          const anchor = new b2__namespace.Vec2();
          anchor.Set(-2.0, 1.0);
          jd.Initialize(b1, b3, anchor);
          jd.collideConnected = true;
          this.m_world.CreateJoint(jd);
          let b4 = null;
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.25, 0.25);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-10.0, 15.0);
              b4 = this.m_world.CreateBody(bd);
              b4.CreateFixture(shape, 10.0);
          }
          anchor.Set(-7.0, 15.0);
          jd.Initialize(_b2, b4, anchor);
          this.m_world.CreateJoint(jd);
          let b5 = null;
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(6.5, 3.0);
              b5 = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 10.0;
              fd.friction = 0.1;
              shape.SetAsBox(1.0, 0.1, new b2__namespace.Vec2(0.0, -0.9), 0.0);
              b5.CreateFixture(fd);
              shape.SetAsBox(0.1, 1.0, new b2__namespace.Vec2(-0.9, 0.0), 0.0);
              b5.CreateFixture(fd);
              shape.SetAsBox(0.1, 1.0, new b2__namespace.Vec2(0.9, 0.0), 0.0);
              b5.CreateFixture(fd);
          }
          anchor.Set(6.0, 2.0);
          jd.Initialize(b1, b5, anchor);
          this.m_world.CreateJoint(jd);
          let b6 = null;
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.0, 0.1);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(6.5, 4.1);
              b6 = this.m_world.CreateBody(bd);
              b6.CreateFixture(shape, 30.0);
          }
          anchor.Set(7.5, 4.0);
          jd.Initialize(b5, b6, anchor);
          this.m_world.CreateJoint(jd);
          let b7 = null;
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.1, 1.0);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(7.4, 1.0);
              b7 = this.m_world.CreateBody(bd);
              b7.CreateFixture(shape, 10.0);
          }
          const djd = new b2__namespace.DistanceJointDef();
          djd.bodyA = b3;
          djd.bodyB = b7;
          djd.localAnchorA.Set(6.0, 0.0);
          djd.localAnchorB.Set(0.0, -1.0);
          const d = b2__namespace.Vec2.SubVV(djd.bodyB.GetWorldPoint(djd.localAnchorB, new b2__namespace.Vec2()), djd.bodyA.GetWorldPoint(djd.localAnchorA, new b2__namespace.Vec2()), new b2__namespace.Vec2());
          djd.length = d.Length();
          b2__namespace.LinearStiffness(djd, 1.0, 1.0, djd.bodyA, djd.bodyB);
          this.m_world.CreateJoint(djd);
          {
              const radius = 0.2;
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = radius;
              for (let i = 0; i < 4; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(5.9 + 2.0 * radius * i, 2.4);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 10.0);
              }
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Dominos();
      }
  }
  RegisterTest("Examples", "Dominos", Dominos.Create);

  // MIT License
  // This test holds worlds dumped using b2World::Dump.
  class DumpShell extends Test {
      constructor() {
          super();
          // dump begin
          const g = new b2__namespace.Vec2(0.000000000000000, 0.000000000000000);
          this.m_world.SetGravity(g);
          const bodies = new Array(4);
          const joints = new Array(2);
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_staticBody;
              bd.position.Set(0.000000000000000, 0.000000000000000);
              bd.angle = 0.000000000000000;
              bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
              bd.angularVelocity = 0.000000000000000;
              bd.linearDamping = 0.000000000000000;
              bd.angularDamping = 0.000000000000000;
              bd.allowSleep = true;
              bd.awake = true;
              bd.fixedRotation = false;
              bd.bullet = false;
              bd.enabled = true;
              bd.gravityScale = 1.000000000000000;
              bodies[0] = this.m_world.CreateBody(bd);
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 10.000000000000000;
                  fd.restitution = 0.000000000000000;
                  fd.density = 0.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.EdgeShape();
                  shape.m_radius = 0.009999999776483;
                  shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex1.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
                  shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
                  fd.shape = shape;
                  bodies[0].CreateFixture(fd);
              }
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 10.000000000000000;
                  fd.restitution = 0.000000000000000;
                  fd.density = 0.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.EdgeShape();
                  shape.m_radius = 0.009999999776483;
                  shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
                  shape.m_vertex2.Set(44.521739959716797, 16.695652008056641);
                  shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
                  fd.shape = shape;
                  bodies[0].CreateFixture(fd);
              }
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 10.000000000000000;
                  fd.restitution = 0.000000000000000;
                  fd.density = 0.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.EdgeShape();
                  shape.m_radius = 0.009999999776483;
                  shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
                  shape.m_vertex2.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
                  fd.shape = shape;
                  bodies[0].CreateFixture(fd);
              }
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 10.000000000000000;
                  fd.restitution = 0.000000000000000;
                  fd.density = 0.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.EdgeShape();
                  shape.m_radius = 0.009999999776483;
                  shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
                  shape.m_vertex1.Set(44.521739959716797, 16.695652008056641);
                  shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
                  shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
                  fd.shape = shape;
                  bodies[0].CreateFixture(fd);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.847826063632965, 2.500000000000000);
              bd.angle = 0.000000000000000;
              bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
              bd.angularVelocity = 0.000000000000000;
              bd.linearDamping = 0.500000000000000;
              bd.angularDamping = 0.500000000000000;
              bd.allowSleep = true;
              bd.awake = true;
              bd.fixedRotation = false;
              bd.bullet = false;
              bd.enabled = true;
              bd.gravityScale = 1.000000000000000;
              bodies[1] = this.m_world.CreateBody(bd);
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 1.000000000000000;
                  fd.restitution = 0.500000000000000;
                  fd.density = 10.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.PolygonShape();
                  const vs = b2__namespace.Vec2.MakeArray(8);
                  vs[0].Set(6.907599925994873, 0.327199995517731);
                  vs[1].Set(-0.322800010442734, 0.282599985599518);
                  vs[2].Set(-0.322800010442734, -0.295700013637543);
                  vs[3].Set(6.885900020599365, -0.364100009202957);
                  shape.Set(vs, 4);
                  fd.shape = shape;
                  bodies[1].CreateFixture(fd);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(13.043478012084959, 2.500000000000000);
              bd.angle = 0.000000000000000;
              bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
              bd.angularVelocity = 0.000000000000000;
              bd.linearDamping = 0.500000000000000;
              bd.angularDamping = 0.500000000000000;
              bd.allowSleep = true;
              bd.awake = true;
              bd.fixedRotation = false;
              bd.bullet = false;
              bd.enabled = true;
              bd.gravityScale = 1.000000000000000;
              bodies[2] = this.m_world.CreateBody(bd);
              {
                  const fd = new b2__namespace.FixtureDef();
                  fd.friction = 1.000000000000000;
                  fd.restitution = 0.500000000000000;
                  fd.density = 10.000000000000000;
                  fd.isSensor = false;
                  fd.filter.categoryBits = 1;
                  fd.filter.maskBits = 65535;
                  fd.filter.groupIndex = 0;
                  const shape = new b2__namespace.PolygonShape();
                  const vs = b2__namespace.Vec2.MakeArray(8);
                  vs[0].Set(0.200000002980232, -0.300000011920929);
                  vs[1].Set(0.200000002980232, 0.200000002980232);
                  vs[2].Set(-6.900000095367432, 0.200000002980232);
                  vs[3].Set(-6.900000095367432, -0.300000011920929);
                  shape.Set(vs, 4);
                  fd.shape = shape;
                  bodies[2].CreateFixture(fd);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_staticBody;
              bd.position.Set(0.000000000000000, 0.000000000000000);
              bd.angle = 0.000000000000000;
              bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
              bd.angularVelocity = 0.000000000000000;
              bd.linearDamping = 0.000000000000000;
              bd.angularDamping = 0.000000000000000;
              bd.allowSleep = true;
              bd.awake = true;
              bd.fixedRotation = false;
              bd.bullet = false;
              bd.enabled = true;
              bd.gravityScale = 1.000000000000000;
              bodies[3] = this.m_world.CreateBody(bd);
          }
          {
              const jd = new b2__namespace.RevoluteJointDef();
              jd.bodyA = bodies[1];
              jd.bodyB = bodies[0];
              jd.collideConnected = false;
              jd.localAnchorA.Set(0.000000000000000, 0.000000000000000);
              jd.localAnchorB.Set(0.847826063632965, 2.500000000000000);
              jd.referenceAngle = 0.000000000000000;
              jd.enableLimit = false;
              jd.lowerAngle = 0.000000000000000;
              jd.upperAngle = 0.000000000000000;
              jd.enableMotor = false;
              jd.motorSpeed = 0.000000000000000;
              jd.maxMotorTorque = 0.000000000000000;
              joints[0] = this.m_world.CreateJoint(jd);
          }
          {
              const jd = new b2__namespace.PrismaticJointDef();
              jd.bodyA = bodies[1];
              jd.bodyB = bodies[2];
              jd.collideConnected = false;
              jd.localAnchorA.Set(0.000000000000000, 0.000000000000000);
              jd.localAnchorB.Set(-12.195652008056641, 0.000000000000000);
              jd.localAxisA.Set(-1.000000000000000, 0.000000000000000);
              jd.referenceAngle = 0.000000000000000;
              jd.enableLimit = true;
              jd.lowerTranslation = -20.000000000000000;
              jd.upperTranslation = 0.000000000000000;
              jd.enableMotor = true;
              jd.motorSpeed = 0.000000000000000;
              jd.maxMotorForce = 10.000000000000000;
              joints[1] = this.m_world.CreateJoint(jd);
          }
          // dump end
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new DumpShell();
      }
  }
  RegisterTest("Bugs", "Dump Loader", DumpShell.Create);

  // MIT License
  class DynamicTreeTest extends Test {
      constructor() {
          super();
          this.m_worldExtent = 0.0;
          this.m_proxyExtent = 0.0;
          this.m_tree = new b2__namespace.DynamicTree();
          this.m_queryAABB = new b2__namespace.AABB();
          this.m_rayCastInput = new b2__namespace.RayCastInput();
          this.m_rayCastOutput = new b2__namespace.RayCastOutput();
          this.m_rayActor = null;
          this.m_actors = b2__namespace.MakeArray(DynamicTreeTest.e_actorCount, () => new DynamicTreeTest_Actor());
          this.m_stepCount = 0;
          this.m_automated = false;
          this.m_worldExtent = 15.0;
          this.m_proxyExtent = 0.5;
          //srand(888);
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              const actor = this.m_actors[i];
              this.GetRandomAABB(actor.aabb);
              actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
          }
          this.m_stepCount = 0;
          const h = this.m_worldExtent;
          this.m_queryAABB.lowerBound.Set(-3.0, -4.0 + h);
          this.m_queryAABB.upperBound.Set(5.0, 6.0 + h);
          this.m_rayCastInput.p1.Set(-5.0, 5.0 + h);
          this.m_rayCastInput.p2.Set(7.0, -4.0 + h);
          //this.m_rayCastInput.p1.Set(0.0, 2.0 + h);
          //this.m_rayCastInput.p2.Set(0.0, -2.0 + h);
          this.m_rayCastInput.maxFraction = 1.0;
          this.m_automated = false;
      }
      Step(settings) {
          super.Step(settings);
          this.Reset();
          if (this.m_automated) {
              const actionCount = b2__namespace.Max(1, DynamicTreeTest.e_actorCount >> 2);
              for (let i = 0; i < actionCount; ++i) {
                  this.Action();
              }
          }
          this.Query();
          this.RayCast();
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              const actor = this.m_actors[i];
              if (actor.proxyId === null) {
                  continue;
              }
              const c = new b2__namespace.Color(0.9, 0.9, 0.9);
              if (actor === this.m_rayActor && actor.overlap) {
                  c.SetRGB(0.9, 0.6, 0.6);
              }
              else if (actor === this.m_rayActor) {
                  c.SetRGB(0.6, 0.9, 0.6);
              }
              else if (actor.overlap) {
                  c.SetRGB(0.6, 0.6, 0.9);
              }
              g_debugDraw.DrawAABB(actor.aabb, c);
          }
          const c = new b2__namespace.Color(0.7, 0.7, 0.7);
          g_debugDraw.DrawAABB(this.m_queryAABB, c);
          g_debugDraw.DrawSegment(this.m_rayCastInput.p1, this.m_rayCastInput.p2, c);
          const c1 = new b2__namespace.Color(0.2, 0.9, 0.2);
          const c2 = new b2__namespace.Color(0.9, 0.2, 0.2);
          g_debugDraw.DrawPoint(this.m_rayCastInput.p1, 6.0, c1);
          g_debugDraw.DrawPoint(this.m_rayCastInput.p2, 6.0, c2);
          if (this.m_rayActor) {
              const cr = new b2__namespace.Color(0.2, 0.2, 0.9);
              //b2.Vec2 p = this.m_rayCastInput.p1 + this.m_rayActor.fraction * (this.m_rayCastInput.p2 - this.m_rayCastInput.p1);
              const p = b2__namespace.Vec2.AddVV(this.m_rayCastInput.p1, b2__namespace.Vec2.MulSV(this.m_rayActor.fraction, b2__namespace.Vec2.SubVV(this.m_rayCastInput.p2, this.m_rayCastInput.p1, new b2__namespace.Vec2()), new b2__namespace.Vec2()), new b2__namespace.Vec2());
              g_debugDraw.DrawPoint(p, 6.0, cr);
          }
          {
              const height = this.m_tree.GetHeight();
              g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}`);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          ++this.m_stepCount;
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_automated = !this.m_automated;
                  break;
              case "c":
                  this.CreateProxy();
                  break;
              case "d":
                  this.DestroyProxy();
                  break;
              case "m":
                  this.MoveProxy();
                  break;
          }
      }
      GetRandomAABB(aabb) {
          const w = new b2__namespace.Vec2();
          w.Set(2.0 * this.m_proxyExtent, 2.0 * this.m_proxyExtent);
          //aabb.lowerBound.x = -this.m_proxyExtent;
          //aabb.lowerBound.y = -this.m_proxyExtent + this.m_worldExtent;
          aabb.lowerBound.x = b2__namespace.RandomRange(-this.m_worldExtent, this.m_worldExtent);
          aabb.lowerBound.y = b2__namespace.RandomRange(0.0, 2.0 * this.m_worldExtent);
          aabb.upperBound.Copy(aabb.lowerBound);
          aabb.upperBound.SelfAdd(w);
      }
      MoveAABB(aabb) {
          const d = new b2__namespace.Vec2();
          d.x = b2__namespace.RandomRange(-0.5, 0.5);
          d.y = b2__namespace.RandomRange(-0.5, 0.5);
          //d.x = 2.0;
          //d.y = 0.0;
          aabb.lowerBound.SelfAdd(d);
          aabb.upperBound.SelfAdd(d);
          //b2.Vec2 c0 = 0.5 * (aabb.lowerBound + aabb.upperBound);
          const c0 = b2__namespace.Vec2.MulSV(0.5, b2__namespace.Vec2.AddVV(aabb.lowerBound, aabb.upperBound, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
          const min = new b2__namespace.Vec2(-this.m_worldExtent, 0.0);
          const max = new b2__namespace.Vec2(this.m_worldExtent, 2.0 * this.m_worldExtent);
          const c = b2__namespace.Vec2.ClampV(c0, min, max, new b2__namespace.Vec2());
          aabb.lowerBound.SelfAdd(b2__namespace.Vec2.SubVV(c, c0, new b2__namespace.Vec2()));
          aabb.upperBound.SelfAdd(b2__namespace.Vec2.SubVV(c, c0, new b2__namespace.Vec2()));
      }
      CreateProxy() {
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              const j = 0 | b2__namespace.RandomRange(0, DynamicTreeTest.e_actorCount);
              const actor = this.m_actors[j];
              if (actor.proxyId === null) {
                  this.GetRandomAABB(actor.aabb);
                  actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
                  return;
              }
          }
      }
      DestroyProxy() {
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              const j = 0 | b2__namespace.RandomRange(0, DynamicTreeTest.e_actorCount);
              const actor = this.m_actors[j];
              if (actor.proxyId !== null) {
                  this.m_tree.DestroyProxy(actor.proxyId);
                  actor.proxyId = null;
                  return;
              }
          }
      }
      MoveProxy() {
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              const j = 0 | b2__namespace.RandomRange(0, DynamicTreeTest.e_actorCount);
              const actor = this.m_actors[j];
              if (actor.proxyId === null) {
                  continue;
              }
              const aabb0 = new b2__namespace.AABB();
              aabb0.Copy(actor.aabb);
              this.MoveAABB(actor.aabb);
              const displacement = b2__namespace.Vec2.SubVV(actor.aabb.GetCenter(), aabb0.GetCenter(), new b2__namespace.Vec2());
              this.m_tree.MoveProxy(actor.proxyId, actor.aabb, displacement);
              return;
          }
      }
      Reset() {
          this.m_rayActor = null;
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              this.m_actors[i].fraction = 1.0;
              this.m_actors[i].overlap = false;
          }
      }
      Action() {
          const choice = 0 | b2__namespace.RandomRange(0, 20);
          switch (choice) {
              case 0:
                  this.CreateProxy();
                  break;
              case 1:
                  this.DestroyProxy();
                  break;
              default:
                  this.MoveProxy();
          }
      }
      Query() {
          this.m_tree.Query(this.m_queryAABB, (proxyId) => {
              const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
              actor.overlap = b2__namespace.TestOverlapAABB(this.m_queryAABB, actor.aabb);
              return true;
          });
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              if (this.m_actors[i].proxyId === null) {
                  continue;
              }
              // DEBUG: const overlap =
              b2__namespace.TestOverlapAABB(this.m_queryAABB, this.m_actors[i].aabb);
              // DEBUG: b2.Assert(overlap === this.m_actors[i].overlap);
          }
      }
      RayCast() {
          this.m_rayActor = null;
          const input = new b2__namespace.RayCastInput();
          input.Copy(this.m_rayCastInput);
          // Ray cast against the dynamic tree.
          this.m_tree.RayCast(input, (input, proxyId) => {
              const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
              const output = new b2__namespace.RayCastOutput();
              const hit = actor.aabb.RayCast(output, input);
              if (hit) {
                  this.m_rayCastOutput = output;
                  this.m_rayActor = actor;
                  this.m_rayActor.fraction = output.fraction;
                  return output.fraction;
              }
              return input.maxFraction;
          });
          const bruteOutput = new b2__namespace.RayCastOutput();
          for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
              if (this.m_actors[i].proxyId === null) {
                  continue;
              }
              const output = new b2__namespace.RayCastOutput();
              const hit = this.m_actors[i].aabb.RayCast(output, input);
              if (hit) {
                  this.m_actors[i];
                  bruteOutput.Copy(output);
                  input.maxFraction = output.fraction;
              }
          }
      }
      static Create() {
          return new DynamicTreeTest();
      }
  }
  DynamicTreeTest.e_actorCount = 128;
  class DynamicTreeTest_Actor {
      constructor() {
          this.aabb = new b2__namespace.AABB();
          this.fraction = 0.0;
          this.overlap = false;
          this.proxyId = null;
      }
  }
  RegisterTest("Collision", "Dynamic Tree", DynamicTreeTest.Create);

  // MIT License
  class EdgeShapesCallback extends b2__namespace.RayCastCallback {
      constructor() {
          super(...arguments);
          this.m_fixture = null;
          this.m_point = new b2__namespace.Vec2();
          this.m_normal = new b2__namespace.Vec2();
      }
      ReportFixture(fixture, point, normal, fraction) {
          this.m_fixture = fixture;
          this.m_point.Copy(point);
          this.m_normal.Copy(normal);
          return fraction;
      }
  }
  class EdgeShapes extends Test {
      constructor() {
          super();
          this.m_bodyIndex = 0;
          this.m_angle = 0.0;
          this.m_bodyIndex = 0;
          this.m_bodies = new Array(EdgeShapes.e_maxBodies);
          this.m_polygons = new Array(4);
          for (let i = 0; i < 4; ++i) {
              this.m_polygons[i] = new b2__namespace.PolygonShape();
          }
          this.m_circle = new b2__namespace.CircleShape();
          this.m_angle = 0.0;
          // Ground body
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              let x1 = -20.0;
              let y1 = 2.0 * b2__namespace.Cos(x1 / 10.0 * b2__namespace.pi);
              for (let i = 0; i < 80; ++i) {
                  const x2 = x1 + 0.5;
                  const y2 = 2.0 * b2__namespace.Cos(x2 / 10.0 * b2__namespace.pi);
                  const shape = new b2__namespace.EdgeShape();
                  shape.SetTwoSided(new b2__namespace.Vec2(x1, y1), new b2__namespace.Vec2(x2, y2));
                  ground.CreateFixture(shape, 0.0);
                  x1 = x2;
                  y1 = y2;
              }
          }
          {
              const vertices = new Array(3);
              vertices[0] = new b2__namespace.Vec2(-0.5, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[0].Set(vertices, 3);
          }
          {
              const vertices = new Array(3);
              vertices[0] = new b2__namespace.Vec2(-0.1, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.1, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[1].Set(vertices, 3);
          }
          {
              const w = 1.0;
              const b = w / (2.0 + b2__namespace.Sqrt(2.0));
              const s = b2__namespace.Sqrt(2.0) * b;
              const vertices = new Array(8);
              vertices[0] = new b2__namespace.Vec2(0.5 * s, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5 * w, b);
              vertices[2] = new b2__namespace.Vec2(0.5 * w, b + s);
              vertices[3] = new b2__namespace.Vec2(0.5 * s, w);
              vertices[4] = new b2__namespace.Vec2(-0.5 * s, w);
              vertices[5] = new b2__namespace.Vec2(-0.5 * w, b + s);
              vertices[6] = new b2__namespace.Vec2(-0.5 * w, b);
              vertices[7] = new b2__namespace.Vec2(-0.5 * s, 0.0);
              this.m_polygons[2].Set(vertices, 8);
          }
          {
              this.m_polygons[3].SetAsBox(0.5, 0.5);
          }
          {
              this.m_circle.m_radius = 0.5;
          }
          for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
              this.m_bodies[i] = null;
          }
      }
      CreateBody(index) {
          const old_body = this.m_bodies[this.m_bodyIndex];
          if (old_body !== null) {
              this.m_world.DestroyBody(old_body);
              this.m_bodies[this.m_bodyIndex] = null;
          }
          const bd = new b2__namespace.BodyDef();
          const x = b2__namespace.RandomRange(-10.0, 10.0);
          const y = b2__namespace.RandomRange(10.0, 20.0);
          bd.position.Set(x, y);
          bd.angle = b2__namespace.RandomRange(-b2__namespace.pi, b2__namespace.pi);
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          if (index === 4) {
              bd.angularDamping = 0.02;
          }
          const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
          if (index < 4) {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_polygons[index];
              fd.friction = 0.3;
              fd.density = 20.0;
              new_body.CreateFixture(fd);
          }
          else {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_circle;
              fd.friction = 0.3;
              fd.density = 20.0;
              new_body.CreateFixture(fd);
          }
          this.m_bodyIndex = (this.m_bodyIndex + 1) % EdgeShapes.e_maxBodies;
      }
      DestroyBody() {
          for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
              const body = this.m_bodies[i];
              if (body !== null) {
                  this.m_world.DestroyBody(body);
                  this.m_bodies[i] = null;
                  return;
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
                  this.CreateBody(key.charCodeAt(0) - "1".charCodeAt(0));
                  break;
              case "d":
                  this.DestroyBody();
                  break;
          }
      }
      Step(settings) {
          const advanceRay = !settings.m_pause || settings.m_singleStep;
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff, m to change the mode");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const L = 25.0;
          const point1 = new b2__namespace.Vec2(0.0, 10.0);
          const d = new b2__namespace.Vec2(L * b2__namespace.Cos(this.m_angle), -L * b2__namespace.Abs(b2__namespace.Sin(this.m_angle)));
          const point2 = b2__namespace.Vec2.AddVV(point1, d, new b2__namespace.Vec2());
          const callback = new EdgeShapesCallback();
          this.m_world.RayCast(callback, point1, point2);
          if (callback.m_fixture) {
              g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2__namespace.Color(0.4, 0.9, 0.4));
              g_debugDraw.DrawSegment(point1, callback.m_point, new b2__namespace.Color(0.8, 0.8, 0.8));
              const head = b2__namespace.Vec2.AddVV(callback.m_point, b2__namespace.Vec2.MulSV(0.5, callback.m_normal, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
              g_debugDraw.DrawSegment(callback.m_point, head, new b2__namespace.Color(0.9, 0.9, 0.4));
          }
          else {
              g_debugDraw.DrawSegment(point1, point2, new b2__namespace.Color(0.8, 0.8, 0.8));
          }
          if (advanceRay) {
              this.m_angle += 0.25 * b2__namespace.pi / 180.0;
          }
      }
      static Create() {
          return new EdgeShapes();
      }
  }
  EdgeShapes.e_maxBodies = 256;
  RegisterTest("Geometry", "Edge Shapes", EdgeShapes.Create);

  // MIT License
  class EdgeTest extends Test {
      constructor() {
          super();
          this.m_offset1 = new b2__namespace.Vec2();
          this.m_offset2 = new b2__namespace.Vec2();
          this.m_body1 = null;
          this.m_body2 = null;
          this.m_boxes = false;
          const vertices = [
              new b2__namespace.Vec2(10.0, -4.0),
              new b2__namespace.Vec2(10.0, 0.0),
              new b2__namespace.Vec2(6.0, 0.0),
              new b2__namespace.Vec2(4.0, 2.0),
              new b2__namespace.Vec2(2.0, 0.0),
              new b2__namespace.Vec2(-2.0, 0.0),
              new b2__namespace.Vec2(-6.0, 0.0),
              new b2__namespace.Vec2(-8.0, -3.0),
              new b2__namespace.Vec2(-10.0, 0.0),
              new b2__namespace.Vec2(-10.0, -4.0),
          ];
          this.m_offset1.Set(0.0, 8.0);
          this.m_offset2.Set(0.0, 16.0);
          {
              const v1 = vertices[0].Clone().SelfAdd(this.m_offset1);
              const v2 = vertices[1].Clone().SelfAdd(this.m_offset1);
              const v3 = vertices[2].Clone().SelfAdd(this.m_offset1);
              const v4 = vertices[3].Clone().SelfAdd(this.m_offset1);
              const v5 = vertices[4].Clone().SelfAdd(this.m_offset1);
              const v6 = vertices[5].Clone().SelfAdd(this.m_offset1);
              const v7 = vertices[6].Clone().SelfAdd(this.m_offset1);
              const v8 = vertices[7].Clone().SelfAdd(this.m_offset1);
              const v9 = vertices[8].Clone().SelfAdd(this.m_offset1);
              const v10 = vertices[9].Clone().SelfAdd(this.m_offset1);
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetOneSided(v10, v1, v2, v3);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v1, v2, v3, v4);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v2, v3, v4, v5);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v3, v4, v5, v6);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v4, v5, v6, v7);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v5, v6, v7, v8);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v6, v7, v8, v9);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v7, v8, v9, v10);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v8, v9, v10, v1);
              ground.CreateFixture(shape, 0.0);
              shape.SetOneSided(v9, v10, v1, v2);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const v1 = vertices[0].Clone().SelfAdd(this.m_offset2);
              const v2 = vertices[1].Clone().SelfAdd(this.m_offset2);
              const v3 = vertices[2].Clone().SelfAdd(this.m_offset2);
              const v4 = vertices[3].Clone().SelfAdd(this.m_offset2);
              const v5 = vertices[4].Clone().SelfAdd(this.m_offset2);
              const v6 = vertices[5].Clone().SelfAdd(this.m_offset2);
              const v7 = vertices[6].Clone().SelfAdd(this.m_offset2);
              const v8 = vertices[7].Clone().SelfAdd(this.m_offset2);
              const v9 = vertices[8].Clone().SelfAdd(this.m_offset2);
              const v10 = vertices[9].Clone().SelfAdd(this.m_offset2);
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(v1, v2);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v2, v3);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v3, v4);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v4, v5);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v5, v6);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v6, v7);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v7, v8);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v8, v9);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v9, v10);
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(v10, v1);
              ground.CreateFixture(shape, 0.0);
          }
          this.m_body1 = null;
          this.m_body2 = null;
          this.CreateBoxes();
          this.m_boxes = true;
      }
      CreateBoxes() {
          if (this.m_body1) {
              this.m_world.DestroyBody(this.m_body1);
              this.m_body1 = null;
          }
          if (this.m_body2) {
              this.m_world.DestroyBody(this.m_body2);
              this.m_body2 = null;
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              // bd.position = b2Vec2(8.0, 2.6) + this.m_offset1;
              bd.position.x = 8.0 + this.m_offset1.x;
              bd.position.y = 2.6 + this.m_offset1.y;
              bd.allowSleep = false;
              this.m_body1 = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 1.0);
              this.m_body1.CreateFixture(shape, 1.0);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              // bd.position = b2Vec2(8.0, 2.6f) + this.m_offset2;
              bd.position.x = 8.0 + this.m_offset2.x;
              bd.position.y = 2.6 + this.m_offset2.y;
              bd.allowSleep = false;
              this.m_body2 = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 1.0);
              this.m_body2.CreateFixture(shape, 1.0);
          }
      }
      CreateCircles() {
          if (this.m_body1) {
              this.m_world.DestroyBody(this.m_body1);
              this.m_body1 = null;
          }
          if (this.m_body2) {
              this.m_world.DestroyBody(this.m_body2);
              this.m_body2 = null;
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset1;
              bd.position.x = -0.5 + this.m_offset1.x;
              bd.position.y = 0.6 + this.m_offset1.y;
              bd.allowSleep = false;
              this.m_body1 = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              this.m_body1.CreateFixture(shape, 1.0);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset2;
              bd.position.x = -0.5 + this.m_offset2.x;
              bd.position.y = 0.6 + this.m_offset2.y;
              bd.allowSleep = false;
              this.m_body2 = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              this.m_body2.CreateFixture(shape, 1.0);
          }
      }
      UpdateUI() {
          // ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
          // ImGui::SetNextWindowSize(ImVec2(200.0, 100.0));
          // ImGui::Begin("Custom Controls", null, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
          // if (ImGui::RadioButton("Boxes", m_boxes == true))
          // {
          //   CreateBoxes();
          //   m_boxes = true;
          // }
          // if (ImGui::RadioButton("Circles", m_boxes == false))
          // {
          //   CreateCircles();
          //   m_boxes = false;
          // }
          // ImGui::End();
      }
      Step(settings) {
          // if (glfwGetKey(g_mainWindow, GLFW_KEY_A) == GLFW_PRESS)
          // {
          //   this.m_body1.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
          //   this.m_body2.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
          // }
          // if (glfwGetKey(g_mainWindow, GLFW_KEY_D) == GLFW_PRESS)
          // {
          //   this.m_body1.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
          //   this.m_body2.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
          // }
          super.Step(settings);
      }
      Keyboard(key) {
          var _a, _b, _c, _d;
          switch (key) {
              case "a":
                  (_a = this.m_body1) === null || _a === void 0 ? void 0 : _a.ApplyForceToCenter(new b2__namespace.Vec2(-10.0, 0.0), true);
                  (_b = this.m_body2) === null || _b === void 0 ? void 0 : _b.ApplyForceToCenter(new b2__namespace.Vec2(-10.0, 0.0), true);
                  break;
              case "d":
                  (_c = this.m_body1) === null || _c === void 0 ? void 0 : _c.ApplyForceToCenter(new b2__namespace.Vec2(10.0, 0.0), true);
                  (_d = this.m_body2) === null || _d === void 0 ? void 0 : _d.ApplyForceToCenter(new b2__namespace.Vec2(10.0, 0.0), true);
                  break;
              case "b":
                  this.CreateBoxes();
                  break;
              case "c":
                  this.CreateCircles();
                  break;
          }
      }
      static Create() {
          return new EdgeTest();
      }
  }
  RegisterTest("Geometry", "Edge Test", EdgeTest.Create);

  // MIT License
  class Friction extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(13.0, 0.25);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-4.0, 22.0);
              bd.angle = -0.25;
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.25, 1.0);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(10.5, 19.0);
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(13.0, 0.25);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(4.0, 14.0);
              bd.angle = 0.25;
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.25, 1.0);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-10.5, 11.0);
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(13.0, 0.25);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(-4.0, 6.0);
              bd.angle = -0.25;
              const ground = this.m_world.CreateBody(bd);
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 25.0;
              const friction = [0.75, 0.5, 0.35, 0.1, 0.0];
              for (let i = 0; i < 5; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-15.0 + 4.0 * i, 28.0);
                  const body = this.m_world.CreateBody(bd);
                  fd.friction = friction[i];
                  body.CreateFixture(fd);
              }
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Friction();
      }
  }
  RegisterTest("Forces", "Friction", Friction.Create);

  // MIT License
  class GearJoint extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-50.0, 0.0), new b2__namespace.Vec2(50.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const circle1 = new b2__namespace.CircleShape();
              circle1.m_radius = 1.0;
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(0.5, 5.0);
              const circle2 = new b2__namespace.CircleShape();
              circle2.m_radius = 2.0;
              const bd1 = new b2__namespace.BodyDef();
              bd1.type = b2__namespace.BodyType.b2_staticBody;
              bd1.position.Set(10.0, 9.0);
              const body1 = this.m_world.CreateBody(bd1);
              body1.CreateFixture(circle1, 5.0);
              const bd2 = new b2__namespace.BodyDef();
              bd2.type = b2__namespace.BodyType.b2_dynamicBody;
              bd2.position.Set(10.0, 8.0);
              const body2 = this.m_world.CreateBody(bd2);
              body2.CreateFixture(box, 5.0);
              const bd3 = new b2__namespace.BodyDef();
              bd3.type = b2__namespace.BodyType.b2_dynamicBody;
              bd3.position.Set(10.0, 6.0);
              const body3 = this.m_world.CreateBody(bd3);
              body3.CreateFixture(circle2, 5.0);
              const jd1 = new b2__namespace.RevoluteJointDef();
              jd1.Initialize(body1, body2, bd1.position);
              const joint1 = this.m_world.CreateJoint(jd1);
              const jd2 = new b2__namespace.RevoluteJointDef();
              jd2.Initialize(body2, body3, bd3.position);
              const joint2 = this.m_world.CreateJoint(jd2);
              const jd4 = new b2__namespace.GearJointDef();
              jd4.bodyA = body1;
              jd4.bodyB = body3;
              jd4.joint1 = joint1;
              jd4.joint2 = joint2;
              jd4.ratio = circle2.m_radius / circle1.m_radius;
              this.m_world.CreateJoint(jd4);
          }
          {
              const circle1 = new b2__namespace.CircleShape();
              circle1.m_radius = 1.0;
              const circle2 = new b2__namespace.CircleShape();
              circle2.m_radius = 2.0;
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(0.5, 5.0);
              const bd1 = new b2__namespace.BodyDef();
              bd1.type = b2__namespace.BodyType.b2_dynamicBody;
              bd1.position.Set(-3.0, 12.0);
              const body1 = this.m_world.CreateBody(bd1);
              body1.CreateFixture(circle1, 5.0);
              const jd1 = new b2__namespace.RevoluteJointDef();
              jd1.bodyA = ground;
              jd1.bodyB = body1;
              ground.GetLocalPoint(bd1.position, jd1.localAnchorA);
              body1.GetLocalPoint(bd1.position, jd1.localAnchorB);
              jd1.referenceAngle = body1.GetAngle() - ground.GetAngle();
              this.m_joint1 = this.m_world.CreateJoint(jd1);
              const bd2 = new b2__namespace.BodyDef();
              bd2.type = b2__namespace.BodyType.b2_dynamicBody;
              bd2.position.Set(0.0, 12.0);
              const body2 = this.m_world.CreateBody(bd2);
              body2.CreateFixture(circle2, 5.0);
              const jd2 = new b2__namespace.RevoluteJointDef();
              jd2.Initialize(ground, body2, bd2.position);
              this.m_joint2 = this.m_world.CreateJoint(jd2);
              const bd3 = new b2__namespace.BodyDef();
              bd3.type = b2__namespace.BodyType.b2_dynamicBody;
              bd3.position.Set(2.5, 12.0);
              const body3 = this.m_world.CreateBody(bd3);
              body3.CreateFixture(box, 5.0);
              const jd3 = new b2__namespace.PrismaticJointDef();
              jd3.Initialize(ground, body3, bd3.position, new b2__namespace.Vec2(0.0, 1.0));
              jd3.lowerTranslation = -5.0;
              jd3.upperTranslation = 5.0;
              jd3.enableLimit = true;
              this.m_joint3 = this.m_world.CreateJoint(jd3);
              const jd4 = new b2__namespace.GearJointDef();
              jd4.bodyA = body1;
              jd4.bodyB = body2;
              jd4.joint1 = this.m_joint1;
              jd4.joint2 = this.m_joint2;
              jd4.ratio = circle2.m_radius / circle1.m_radius;
              this.m_joint4 = this.m_world.CreateJoint(jd4);
              const jd5 = new b2__namespace.GearJointDef();
              jd5.bodyA = body2;
              jd5.bodyB = body3;
              jd5.joint1 = this.m_joint2;
              jd5.joint2 = this.m_joint3;
              jd5.ratio = -1.0 / circle2.m_radius;
              this.m_joint5 = this.m_world.CreateJoint(jd5);
          }
      }
      Step(settings) {
          super.Step(settings);
          // float ratio, value;
          let ratio;
          let value;
          ratio = this.m_joint4.GetRatio();
          value = this.m_joint1.GetJointAngle() + ratio * this.m_joint2.GetJointAngle();
          // g_debugDraw.DrawString(5, m_textLine, "theta1 + %4.2f * theta2 = %4.2f", (float) ratio, (float) value);
          g_debugDraw.DrawString(5, this.m_textLine, `theta1 + ${ratio.toFixed(2)} * theta2 = ${value.toFixed(2)}`);
          // m_textLine += m_textIncrement;
          this.m_textLine += DRAW_STRING_NEW_LINE;
          ratio = this.m_joint5.GetRatio();
          value = this.m_joint2.GetJointAngle() + ratio * this.m_joint3.GetJointTranslation();
          // g_debugDraw.DrawString(5, m_textLine, "theta2 + %4.2f * delta = %4.2f", (float) ratio, (float) value);
          g_debugDraw.DrawString(5, this.m_textLine, `theta2 + ${ratio.toFixed(2)} * delta = ${value.toFixed(2)}`);
          // m_textLine += m_textIncrement;
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new GearJoint();
      }
  }
  RegisterTest("Joints", "Gear", GearJoint.Create);

  // MIT License
  class Heavy1 extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Set(0.0, 0.5);
          let body = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.CircleShape();
          shape.m_radius = 0.5;
          body.CreateFixture(shape, 10.0);
          bd.position.Set(0.0, 6.0);
          body = this.m_world.CreateBody(bd);
          shape.m_radius = 5.0;
          body.CreateFixture(shape, 10.0);
      }
      static Create() {
          return new Heavy1();
      }
  }
  RegisterTest("Solver", "Heavy 1", Heavy1.Create);

  // MIT License
  class Heavy2 extends Test {
      constructor() {
          super();
          this.m_heavy = null;
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Set(0.0, 2.5);
          let body = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.CircleShape();
          shape.m_radius = 0.5;
          body.CreateFixture(shape, 10.0);
          bd.position.Set(0.0, 3.5);
          body = this.m_world.CreateBody(bd);
          body.CreateFixture(shape, 10.0);
      }
      ToggleHeavy() {
          if (this.m_heavy !== null) {
              this.m_world.DestroyBody(this.m_heavy);
              this.m_heavy = null;
          }
          else {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 9.0);
              this.m_heavy = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 5.0;
              this.m_heavy.CreateFixture(shape, 10.0);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "h":
                  this.ToggleHeavy();
                  break;
          }
      }
      static Create() {
          return new Heavy2();
      }
  }
  RegisterTest("Solver", "Heavy 2", Heavy2.Create);

  // MIT License
  class MobileBalanced extends Test {
      constructor() {
          super();
          // Create ground body.
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.position.Set(0.0, 20.0);
          const ground = this.m_world.CreateBody(bodyDef);
          const a = 0.5;
          const h = new b2__namespace.Vec2(0.0, a);
          const root = this.AddNode(ground, b2__namespace.Vec2_zero, 0, 3.0, a);
          const jointDef = new b2__namespace.RevoluteJointDef();
          jointDef.bodyA = ground;
          jointDef.bodyB = root;
          jointDef.localAnchorA.SetZero();
          jointDef.localAnchorB.Copy(h);
          this.m_world.CreateJoint(jointDef);
      }
      AddNode(parent, localAnchor, depth, offset, a) {
          const density = 20.0;
          const h = new b2__namespace.Vec2(0.0, a);
          //  b2Vec2 p = parent->GetPosition() + localAnchor - h;
          const p = parent.GetPosition().Clone().SelfAdd(localAnchor).SelfSub(h);
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          bodyDef.position.Copy(p);
          const body = this.m_world.CreateBody(bodyDef);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(0.25 * a, a);
          body.CreateFixture(shape, density);
          if (depth === MobileBalanced.e_depth) {
              return body;
          }
          shape.SetAsBox(offset, 0.25 * a, new b2__namespace.Vec2(0, -a), 0.0);
          body.CreateFixture(shape, density);
          const a1 = new b2__namespace.Vec2(offset, -a);
          const a2 = new b2__namespace.Vec2(-offset, -a);
          const body1 = this.AddNode(body, a1, depth + 1, 0.5 * offset, a);
          const body2 = this.AddNode(body, a2, depth + 1, 0.5 * offset, a);
          const jointDef = new b2__namespace.RevoluteJointDef();
          jointDef.bodyA = body;
          jointDef.localAnchorB.Copy(h);
          jointDef.localAnchorA.Copy(a1);
          jointDef.bodyB = body1;
          this.m_world.CreateJoint(jointDef);
          jointDef.localAnchorA.Copy(a2);
          jointDef.bodyB = body2;
          this.m_world.CreateJoint(jointDef);
          return body;
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new MobileBalanced();
      }
  }
  MobileBalanced.e_depth = 4;
  RegisterTest("Solver", "Mobile Balanced", MobileBalanced.Create);

  // MIT License
  class Mobile extends Test {
      constructor() {
          super();
          // Create ground body.
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.position.Set(0.0, 20.0);
          const ground = this.m_world.CreateBody(bodyDef);
          const a = 0.5;
          const h = new b2__namespace.Vec2(0.0, a);
          const root = this.AddNode(ground, b2__namespace.Vec2_zero, 0, 3.0, a);
          const jointDef = new b2__namespace.RevoluteJointDef();
          jointDef.bodyA = ground;
          jointDef.bodyB = root;
          jointDef.localAnchorA.SetZero();
          jointDef.localAnchorB.Copy(h);
          this.m_world.CreateJoint(jointDef);
      }
      AddNode(parent, localAnchor, depth, offset, a) {
          const density = 20.0;
          const h = new b2__namespace.Vec2(0.0, a);
          //  b2Vec2 p = parent->GetPosition() + localAnchor - h;
          const p = parent.GetPosition().Clone().SelfAdd(localAnchor).SelfSub(h);
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          bodyDef.position.Copy(p);
          const body = this.m_world.CreateBody(bodyDef);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(0.25 * a, a);
          body.CreateFixture(shape, density);
          if (depth === Mobile.e_depth) {
              return body;
          }
          const a1 = new b2__namespace.Vec2(offset, -a);
          const a2 = new b2__namespace.Vec2(-offset, -a);
          const body1 = this.AddNode(body, a1, depth + 1, 0.5 * offset, a);
          const body2 = this.AddNode(body, a2, depth + 1, 0.5 * offset, a);
          const jointDef = new b2__namespace.RevoluteJointDef();
          jointDef.bodyA = body;
          jointDef.localAnchorB.Copy(h);
          jointDef.localAnchorA.Copy(a1);
          jointDef.bodyB = body1;
          this.m_world.CreateJoint(jointDef);
          jointDef.localAnchorA.Copy(a2);
          jointDef.bodyB = body2;
          this.m_world.CreateJoint(jointDef);
          return body;
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Mobile();
      }
  }
  Mobile.e_depth = 4;
  RegisterTest("Solver", "Mobile Unbalanced", Mobile.Create);

  // MIT License
  /// This test shows how to use a motor joint. A motor joint
  /// can be used to animate a dynamic body. With finite motor forces
  /// the body can be blocked by collision with other bodies.
  class MotorJoint extends Test {
      constructor() {
          super();
          this.m_time = 0;
          this.m_go = false;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-20.0, 0.0), new b2__namespace.Vec2(20.0, 0.0));
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              ground.CreateFixture(fd);
          }
          // Define motorized body
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 8.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(2.0, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.friction = 0.6;
              fd.density = 2.0;
              body.CreateFixture(fd);
              const mjd = new b2__namespace.MotorJointDef();
              mjd.Initialize(ground, body);
              mjd.maxForce = 1000.0;
              mjd.maxTorque = 1000.0;
              this.m_joint = this.m_world.CreateJoint(mjd);
          }
          this.m_go = false;
          this.m_time = 0.0;
      }
      Keyboard(key) {
          switch (key) {
              case "s":
                  this.m_go = !this.m_go;
                  break;
          }
      }
      Step(settings) {
          if (this.m_go && settings.m_hertz > 0.0) {
              this.m_time += 1.0 / settings.m_hertz;
          }
          const linearOffset = new b2__namespace.Vec2();
          linearOffset.x = 6.0 * b2__namespace.Sin(2.0 * this.m_time);
          linearOffset.y = 8.0 + 4.0 * b2__namespace.Sin(1.0 * this.m_time);
          const angularOffset = 4.0 * this.m_time;
          this.m_joint.SetLinearOffset(linearOffset);
          this.m_joint.SetAngularOffset(angularOffset);
          g_debugDraw.DrawPoint(linearOffset, 4.0, new b2__namespace.Color(0.9, 0.9, 0.9));
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (s) pause");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new MotorJoint();
      }
  }
  RegisterTest("Joints", "Motor Joint", MotorJoint.Create);

  // MIT License
  /// This tests bullet collision and provides an example of a gameplay scenario.
  /// This also uses a loop shape.
  class Pinball extends Test {
      constructor() {
          super();
          this.m_button = false;
          // Ground body
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const vs = b2__namespace.Vec2.MakeArray(5);
              vs[0].Set(-8.0, 6.0);
              vs[1].Set(-8.0, 20.0);
              vs[2].Set(8.0, 20.0);
              vs[3].Set(8.0, 6.0);
              vs[4].Set(0.0, -2.0);
              const loop = new b2__namespace.ChainShape();
              loop.CreateLoop(vs);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = loop;
              fd.density = 0.0;
              ground.CreateFixture(fd);
          }
          // Flippers
          {
              const p1 = new b2__namespace.Vec2(-2.0, 0.0), p2 = new b2__namespace.Vec2(2.0, 0.0);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Copy(p1);
              const leftFlipper = this.m_world.CreateBody(bd);
              bd.position.Copy(p2);
              const rightFlipper = this.m_world.CreateBody(bd);
              const box = new b2__namespace.PolygonShape();
              box.SetAsBox(1.75, 0.1);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = box;
              fd.density = 1.0;
              leftFlipper.CreateFixture(fd);
              rightFlipper.CreateFixture(fd);
              const jd = new b2__namespace.RevoluteJointDef();
              jd.bodyA = ground;
              jd.localAnchorB.SetZero();
              jd.enableMotor = true;
              jd.maxMotorTorque = 1000.0;
              jd.enableLimit = true;
              jd.motorSpeed = 0.0;
              jd.localAnchorA.Copy(p1);
              jd.bodyB = leftFlipper;
              jd.lowerAngle = -30.0 * b2__namespace.pi / 180.0;
              jd.upperAngle = 5.0 * b2__namespace.pi / 180.0;
              this.m_leftJoint = this.m_world.CreateJoint(jd);
              jd.motorSpeed = 0.0;
              jd.localAnchorA.Copy(p2);
              jd.bodyB = rightFlipper;
              jd.lowerAngle = -5.0 * b2__namespace.pi / 180.0;
              jd.upperAngle = 30.0 * b2__namespace.pi / 180.0;
              this.m_rightJoint = this.m_world.CreateJoint(jd);
          }
          // Circle character
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(1.0, 15.0);
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.bullet = true;
              this.m_ball = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.2;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              this.m_ball.CreateFixture(fd);
          }
          this.m_button = false;
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_button = true;
                  break;
          }
      }
      KeyboardUp(key) {
          switch (key) {
              case "a":
                  this.m_button = false;
                  break;
          }
      }
      Step(settings) {
          if (this.m_button) {
              this.m_leftJoint.SetMotorSpeed(20.0);
              this.m_rightJoint.SetMotorSpeed(-20.0);
          }
          else {
              this.m_leftJoint.SetMotorSpeed(-10.0);
              this.m_rightJoint.SetMotorSpeed(10.0);
          }
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to control the flippers");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Pinball();
      }
  }
  RegisterTest("Examples", "Pinball", Pinball.Create);

  // MIT License
  class Platformer extends Test {
      constructor() {
          super();
          this.m_radius = 0.0;
          this.m_top = 0.0;
          this.m_bottom = 0.0;
          this.m_state = Platformer_State.e_unknown;
          // Ground
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Platform
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0.0, 10.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(3.0, 0.5);
              this.m_platform = body.CreateFixture(shape, 0.0);
              this.m_bottom = 10.0 - 0.5;
              this.m_top = 10.0 + 0.5;
          }
          // Actor
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 12.0);
              const body = this.m_world.CreateBody(bd);
              this.m_radius = 0.5;
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = this.m_radius;
              this.m_character = body.CreateFixture(shape, 20.0);
              body.SetLinearVelocity(new b2__namespace.Vec2(0.0, -50.0));
              this.m_state = Platformer_State.e_unknown;
          }
      }
      PreSolve(contact, oldManifold) {
          super.PreSolve(contact, oldManifold);
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          if (fixtureA !== this.m_platform && fixtureA !== this.m_character) {
              return;
          }
          if (fixtureB !== this.m_platform && fixtureB !== this.m_character) {
              return;
          }
          const position = this.m_character.GetBody().GetPosition();
          if (position.y < this.m_top + this.m_radius - 3.0 * b2__namespace.linearSlop) {
              contact.SetEnabled(false);
          }
      }
      Step(settings) {
          super.Step(settings);
          const v = this.m_character.GetBody().GetLinearVelocity();
          g_debugDraw.DrawString(5, this.m_textLine, `Character Linear Velocity: ${v.y}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Platformer();
      }
  }
  var Platformer_State;
  (function (Platformer_State) {
      Platformer_State[Platformer_State["e_unknown"] = 0] = "e_unknown";
      Platformer_State[Platformer_State["e_above"] = 1] = "e_above";
      Platformer_State[Platformer_State["e_below"] = 2] = "e_below";
  })(Platformer_State || (Platformer_State = {}));
  RegisterTest("Examples", "Platformer", Platformer.Create);

  // MIT License
  class PolygonCollision extends Test {
      constructor() {
          super();
          this.m_polygonA = new b2__namespace.PolygonShape();
          this.m_polygonB = new b2__namespace.PolygonShape();
          this.m_transformA = new b2__namespace.Transform();
          this.m_transformB = new b2__namespace.Transform();
          this.m_positionB = new b2__namespace.Vec2();
          this.m_angleB = 0;
          {
              this.m_polygonA.SetAsBox(0.2, 0.4);
              this.m_transformA.SetPositionAngle(new b2__namespace.Vec2(0.0, 0.0), 0.0);
          }
          {
              this.m_polygonB.SetAsBox(0.5, 0.5);
              this.m_positionB.Set(19.345284, 1.5632932);
              this.m_angleB = 1.9160721;
              this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_positionB.x -= 0.1;
                  break;
              case "d":
                  this.m_positionB.x += 0.1;
                  break;
              case "s":
                  this.m_positionB.y -= 0.1;
                  break;
              case "w":
                  this.m_positionB.y += 0.1;
                  break;
              case "q":
                  this.m_angleB += 0.1 * b2__namespace.pi;
                  break;
              case "e":
                  this.m_angleB -= 0.1 * b2__namespace.pi;
                  break;
          }
          this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
      }
      Step(settings) {
          const manifold = new b2__namespace.Manifold();
          b2__namespace.CollidePolygons(manifold, this.m_polygonA, this.m_transformA, this.m_polygonB, this.m_transformB);
          const worldManifold = new b2__namespace.WorldManifold();
          worldManifold.Initialize(manifold, this.m_transformA, this.m_polygonA.m_radius, this.m_transformB, this.m_polygonB.m_radius);
          g_debugDraw.DrawString(5, this.m_textLine, `point count = ${manifold.pointCount}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          {
              const color = new b2__namespace.Color(0.9, 0.9, 0.9);
              const v = [];
              for (let i = 0; i < this.m_polygonA.m_count; ++i) {
                  v[i] = b2__namespace.Transform.MulXV(this.m_transformA, this.m_polygonA.m_vertices[i], new b2__namespace.Vec2());
              }
              g_debugDraw.DrawPolygon(v, this.m_polygonA.m_count, color);
              for (let i = 0; i < this.m_polygonB.m_count; ++i) {
                  v[i] = b2__namespace.Transform.MulXV(this.m_transformB, this.m_polygonB.m_vertices[i], new b2__namespace.Vec2());
              }
              g_debugDraw.DrawPolygon(v, this.m_polygonB.m_count, color);
          }
          for (let i = 0; i < manifold.pointCount; ++i) {
              g_debugDraw.DrawPoint(worldManifold.points[i], 4.0, new b2__namespace.Color(0.9, 0.3, 0.3));
          }
          super.Step(settings);
      }
      static Create() {
          return new PolygonCollision();
      }
  }
  RegisterTest("Geometry", "Polygon Collision", PolygonCollision.Create);

  // MIT License
  /// This tests stacking. It also shows how to use b2World::Query
  /// and b2TestOverlap.
  /// This callback is called by b2World::QueryAABB. We find all the fixtures
  /// that overlap an AABB. Of those, we use b2TestOverlap to determine which fixtures
  /// overlap a circle. Up to 4 overlapped fixtures will be highlighted with a yellow border.
  class PolygonShapesCallback extends b2__namespace.QueryCallback {
      constructor() {
          super(...arguments);
          this.m_circle = new b2__namespace.CircleShape();
          this.m_transform = new b2__namespace.Transform();
          this.m_count = 0;
      }
      /// Called for each fixture found in the query AABB.
      /// @return false to terminate the query.
      ReportFixture(fixture) {
          if (this.m_count === PolygonShapesCallback.e_maxCount) {
              return false;
          }
          const body = fixture.GetBody();
          const shape = fixture.GetShape();
          const overlap = b2__namespace.TestOverlapShape(shape, 0, this.m_circle, 0, body.GetTransform(), this.m_transform);
          if (overlap) {
              const color = new b2__namespace.Color(0.95, 0.95, 0.6);
              const center = body.GetWorldCenter();
              g_debugDraw.DrawPoint(center, 5.0, color);
              ++this.m_count;
          }
          return true;
      }
  }
  PolygonShapesCallback.e_maxCount = 4;
  class PolygonShapes extends Test {
      constructor() {
          super();
          this.m_bodyIndex = 0;
          this.m_bodies = b2__namespace.MakeArray(PolygonShapes.e_maxBodies, () => null);
          this.m_polygons = b2__namespace.MakeArray(4, () => new b2__namespace.PolygonShape());
          this.m_circle = new b2__namespace.CircleShape();
          // Ground body
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const vertices = new Array(3);
              vertices[0] = new b2__namespace.Vec2(-0.5, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[0].Set(vertices, 3);
          }
          {
              const vertices = new Array(3);
              vertices[0] = new b2__namespace.Vec2(-0.1, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.1, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[1].Set(vertices, 3);
          }
          {
              const w = 1.0;
              const b = w / (2.0 + b2__namespace.Sqrt(2.0));
              const s = b2__namespace.Sqrt(2.0) * b;
              const vertices = new Array(8);
              vertices[0] = new b2__namespace.Vec2(0.5 * s, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5 * w, b);
              vertices[2] = new b2__namespace.Vec2(0.5 * w, b + s);
              vertices[3] = new b2__namespace.Vec2(0.5 * s, w);
              vertices[4] = new b2__namespace.Vec2(-0.5 * s, w);
              vertices[5] = new b2__namespace.Vec2(-0.5 * w, b + s);
              vertices[6] = new b2__namespace.Vec2(-0.5 * w, b);
              vertices[7] = new b2__namespace.Vec2(-0.5 * s, 0.0);
              this.m_polygons[2].Set(vertices, 8);
          }
          {
              this.m_polygons[3].SetAsBox(0.5, 0.5);
          }
          {
              this.m_circle.m_radius = 0.5;
          }
          for (let i = 0; i < PolygonShapes.e_maxBodies; ++i) {
              this.m_bodies[i] = null;
          }
      }
      CreateBody(index) {
          if (this.m_bodies[this.m_bodyIndex] !== null) {
              this.m_world.DestroyBody(this.m_bodies[this.m_bodyIndex]);
              this.m_bodies[this.m_bodyIndex] = null;
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          const x = b2__namespace.RandomRange(-2.0, 2.0);
          bd.position.Set(x, 10.0);
          bd.angle = b2__namespace.RandomRange(-b2__namespace.pi, b2__namespace.pi);
          if (index === 4) {
              bd.angularDamping = 0.02;
          }
          this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
          if (index < 4) {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_polygons[index];
              fd.density = 1.0;
              fd.friction = 0.3;
              this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
          }
          else {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_circle;
              fd.density = 1.0;
              fd.friction = 0.3;
              this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
          }
          this.m_bodyIndex = (this.m_bodyIndex + 1) % PolygonShapes.e_maxBodies;
      }
      DestroyBody() {
          for (let i = 0; i < PolygonShapes.e_maxBodies; ++i) {
              if (this.m_bodies[i] !== null) {
                  this.m_world.DestroyBody(this.m_bodies[i]);
                  this.m_bodies[i] = null;
                  return;
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
                  this.CreateBody(key.charCodeAt(0) - "1".charCodeAt(0));
                  break;
              case "a":
                  for (let i = 0; i < PolygonShapes.e_maxBodies; i += 2) {
                      if (this.m_bodies[i] !== null) {
                          const enabled = this.m_bodies[i].IsEnabled();
                          this.m_bodies[i].SetEnabled(!enabled);
                      }
                  }
                  break;
              case "d":
                  this.DestroyBody();
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          const callback = new PolygonShapesCallback();
          callback.m_circle.m_radius = 2.0;
          callback.m_circle.m_p.Set(0.0, 1.1);
          callback.m_transform.SetIdentity();
          const aabb = new b2__namespace.AABB();
          callback.m_circle.ComputeAABB(aabb, callback.m_transform, 0);
          this.m_world.QueryAABB(callback, aabb);
          const color = new b2__namespace.Color(0.4, 0.7, 0.8);
          g_debugDraw.DrawCircle(callback.m_circle.m_p, callback.m_circle.m_radius, color);
          g_debugDraw.DrawString(5, this.m_textLine, `Press 1-5 to drop stuff, maximum of ${PolygonShapesCallback.e_maxCount} overlaps detected`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to enable/disable some bodies");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "Press 'd' to destroy a body");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new PolygonShapes();
      }
  }
  PolygonShapes.e_maxBodies = 256;
  RegisterTest("Geometry", "Polygon Shapes", PolygonShapes.Create);

  // MIT License
  // Test the prismatic joint with limits and motor options.
  class Prismatic extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1.0, 1.0);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 10.0);
              bd.angle = 0.5 * b2__namespace.pi;
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(shape, 5.0);
              const pjd = new b2__namespace.PrismaticJointDef();
              // Horizontal
              pjd.Initialize(ground, body, bd.position, new b2__namespace.Vec2(1.0, 0.0));
              pjd.motorSpeed = 10.0;
              pjd.maxMotorForce = 10000.0;
              pjd.enableMotor = true;
              pjd.lowerTranslation = -10.0;
              pjd.upperTranslation = 10.0;
              pjd.enableLimit = true;
              this.m_joint = this.m_world.CreateJoint(pjd);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "l":
                  this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
                  break;
              case "m":
                  this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
                  break;
              case "s":
                  this.m_joint.SetMotorSpeed(-this.m_joint.GetMotorSpeed());
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const force = this.m_joint.GetMotorForce(settings.m_hertz);
          g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Prismatic();
      }
  }
  RegisterTest("Joints", "Prismatic", Prismatic.Create);

  // MIT License
  class PulleyJoint extends Test {
      constructor() {
          super();
          const y = 16.0;
          const L = 12.0;
          const a = 1.0;
          const b = 2.0;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const circle = new b2__namespace.CircleShape();
              circle.m_radius = 2.0;
              circle.m_p.Set(-10.0, y + b + L);
              ground.CreateFixture(circle, 0.0);
              circle.m_p.Set(10.0, y + b + L);
              ground.CreateFixture(circle, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(a, b);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              //bd.fixedRotation = true;
              bd.position.Set(-10.0, y);
              const body1 = this.m_world.CreateBody(bd);
              body1.CreateFixture(shape, 5.0);
              bd.position.Set(10.0, y);
              const body2 = this.m_world.CreateBody(bd);
              body2.CreateFixture(shape, 5.0);
              const pulleyDef = new b2__namespace.PulleyJointDef();
              const anchor1 = new b2__namespace.Vec2(-10.0, y + b);
              const anchor2 = new b2__namespace.Vec2(10.0, y + b);
              const groundAnchor1 = new b2__namespace.Vec2(-10.0, y + b + L);
              const groundAnchor2 = new b2__namespace.Vec2(10.0, y + b + L);
              pulleyDef.Initialize(body1, body2, groundAnchor1, groundAnchor2, anchor1, anchor2, 1.5);
              this.m_joint1 = this.m_world.CreateJoint(pulleyDef);
          }
      }
      Step(settings) {
          super.Step(settings);
          const ratio = this.m_joint1.GetRatio();
          const L = this.m_joint1.GetCurrentLengthA() + ratio * this.m_joint1.GetCurrentLengthB();
          g_debugDraw.DrawString(5, this.m_textLine, `L1 + ${ratio.toFixed(2)} * L2 = ${L.toFixed(2)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new PulleyJoint();
      }
  }
  RegisterTest("Joints", "Pulley", PulleyJoint.Create);

  // MIT License
  class Pyramid extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const a = 0.5;
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(a, a);
              const x = new b2__namespace.Vec2(-7.0, 0.75);
              const y = new b2__namespace.Vec2(0.0, 0.0);
              const deltaX = new b2__namespace.Vec2(0.5625, 1.25);
              const deltaY = new b2__namespace.Vec2(1.125, 0.0);
              for (let i = 0; i < Pyramid.e_count; ++i) {
                  y.Copy(x);
                  for (let j = i; j < Pyramid.e_count; ++j) {
                      const bd = new b2__namespace.BodyDef();
                      bd.type = b2__namespace.BodyType.b2_dynamicBody;
                      bd.position.Copy(y);
                      const body = this.m_world.CreateBody(bd);
                      body.CreateFixture(shape, 5.0);
                      y.SelfAdd(deltaY);
                  }
                  x.SelfAdd(deltaX);
              }
          }
      }
      Step(settings) {
          super.Step(settings);
          // b2.DynamicTree* tree = &m_world.m_contactManager.m_broadPhase.m_tree;
          // if (m_stepCount === 400) {
          //   tree.RebuildBottomUp();
          // }
      }
      static Create() {
          return new Pyramid();
      }
  }
  Pyramid.e_count = 20;
  RegisterTest("Stacking", "Pyramid", Pyramid.Create);

  // MIT License
  // This test demonstrates how to use the world ray-cast feature.
  // NOTE: we are intentionally filtering one of the polygons, therefore
  // the ray will always miss one type of polygon.
  // This callback finds the closest hit. Polygon 0 is filtered.
  class RayCastClosestCallback extends b2__namespace.RayCastCallback {
      constructor() {
          super();
          this.m_hit = false;
          this.m_point = new b2__namespace.Vec2();
          this.m_normal = new b2__namespace.Vec2();
      }
      ReportFixture(fixture, point, normal, fraction) {
          const body = fixture.GetBody();
          const userData = body.GetUserData();
          if (userData) {
              const index = userData.index;
              if (index === 0) {
                  // By returning -1, we instruct the calling code to ignore this fixture
                  // and continue the ray-cast to the next fixture.
                  return -1;
              }
          }
          this.m_hit = true;
          this.m_point.Copy(point);
          this.m_normal.Copy(normal);
          // By returning the current fraction, we instruct the calling code to clip the ray and
          // continue the ray-cast to the next fixture. WARNING: do not assume that fixtures
          // are reported in order. However, by clipping, we can always get the closest fixture.
          return fraction;
      }
  }
  // This callback finds any hit. Polygon 0 is filtered. For this type of query we are usually
  // just checking for obstruction, so the actual fixture and hit point are irrelevant. 
  class RayCastAnyCallback extends b2__namespace.RayCastCallback {
      constructor() {
          super();
          this.m_hit = false;
          this.m_point = new b2__namespace.Vec2();
          this.m_normal = new b2__namespace.Vec2();
      }
      ReportFixture(fixture, point, normal, fraction) {
          const body = fixture.GetBody();
          const userData = body.GetUserData();
          if (userData) {
              const index = userData.index;
              if (index === 0) {
                  // By returning -1, we instruct the calling code to ignore this fixture
                  // and continue the ray-cast to the next fixture.
                  return -1;
              }
          }
          this.m_hit = true;
          this.m_point.Copy(point);
          this.m_normal.Copy(normal);
          // At this point we have a hit, so we know the ray is obstructed.
          // By returning 0, we instruct the calling code to terminate the ray-cast.
          return 0;
      }
  }
  // This ray cast collects multiple hits along the ray. Polygon 0 is filtered.
  // The fixtures are not necessary reported in order, so we might not capture
  // the closest fixture.
  class RayCastMultipleCallback extends b2__namespace.RayCastCallback {
      constructor() {
          super();
          this.m_points = b2__namespace.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
          this.m_normals = b2__namespace.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
          this.m_count = 0;
      }
      ReportFixture(fixture, point, normal, fraction) {
          const body = fixture.GetBody();
          const userData = body.GetUserData();
          if (userData) {
              const index = userData.index;
              if (index === 0) {
                  // By returning -1, we instruct the calling code to ignore this fixture
                  // and continue the ray-cast to the next fixture.
                  return -1;
              }
          }
          // DEBUG: b2.Assert(this.m_count < RayCastMultipleCallback.e_maxCount);
          this.m_points[this.m_count].Copy(point);
          this.m_normals[this.m_count].Copy(normal);
          ++this.m_count;
          if (this.m_count === RayCastMultipleCallback.e_maxCount) {
              // At this point the buffer is full.
              // By returning 0, we instruct the calling code to terminate the ray-cast.
              return 0;
          }
          // By returning 1, we instruct the caller to continue without clipping the ray.
          return 1;
      }
  }
  RayCastMultipleCallback.e_maxCount = 3;
  var RayCastMode;
  (function (RayCastMode) {
      RayCastMode[RayCastMode["e_closest"] = 0] = "e_closest";
      RayCastMode[RayCastMode["e_any"] = 1] = "e_any";
      RayCastMode[RayCastMode["e_multiple"] = 2] = "e_multiple";
  })(RayCastMode || (RayCastMode = {}));
  class RayCast extends Test {
      constructor() {
          super();
          this.m_bodyIndex = 0;
          this.m_bodies = [];
          this.m_polygons = [];
          this.m_circle = new b2__namespace.CircleShape();
          this.m_edge = new b2__namespace.EdgeShape();
          this.m_angle = 0;
          this.m_mode = RayCastMode.e_closest;
          for (let i = 0; i < 4; ++i) {
              this.m_polygons[i] = new b2__namespace.PolygonShape();
          }
          // Ground body
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const vertices = [ /*3*/];
              vertices[0] = new b2__namespace.Vec2(-0.5, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[0].Set(vertices, 3);
          }
          {
              const vertices = [ /*3*/];
              vertices[0] = new b2__namespace.Vec2(-0.1, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.1, 0.0);
              vertices[2] = new b2__namespace.Vec2(0.0, 1.5);
              this.m_polygons[1].Set(vertices, 3);
          }
          {
              const w = 1.0;
              const b = w / (2.0 + b2__namespace.Sqrt(2.0));
              const s = b2__namespace.Sqrt(2.0) * b;
              const vertices = [ /*8*/];
              vertices[0] = new b2__namespace.Vec2(0.5 * s, 0.0);
              vertices[1] = new b2__namespace.Vec2(0.5 * w, b);
              vertices[2] = new b2__namespace.Vec2(0.5 * w, b + s);
              vertices[3] = new b2__namespace.Vec2(0.5 * s, w);
              vertices[4] = new b2__namespace.Vec2(-0.5 * s, w);
              vertices[5] = new b2__namespace.Vec2(-0.5 * w, b + s);
              vertices[6] = new b2__namespace.Vec2(-0.5 * w, b);
              vertices[7] = new b2__namespace.Vec2(-0.5 * s, 0.0);
              this.m_polygons[2].Set(vertices, 8);
          }
          {
              this.m_polygons[3].SetAsBox(0.5, 0.5);
          }
          {
              this.m_circle.m_radius = 0.5;
          }
          {
              this.m_edge.SetTwoSided(new b2__namespace.Vec2(-1, 0), new b2__namespace.Vec2(1, 0));
          }
          this.m_bodyIndex = 0;
          for (let i = 0; i < RayCast.e_maxBodies; ++i) {
              this.m_bodies[i] = null;
          }
          this.m_angle = 0;
          this.m_mode = RayCastMode.e_closest;
      }
      CreateBody(index) {
          const old_body = this.m_bodies[this.m_bodyIndex];
          if (old_body !== null) {
              this.m_world.DestroyBody(old_body);
              this.m_bodies[this.m_bodyIndex] = null;
          }
          const bd = new b2__namespace.BodyDef();
          const x = b2__namespace.RandomRange(-10.0, 10.0);
          const y = b2__namespace.RandomRange(0.0, 20.0);
          bd.position.Set(x, y);
          bd.angle = b2__namespace.RandomRange(-b2__namespace.pi, b2__namespace.pi);
          bd.userData = {};
          bd.userData.index = index;
          if (index === 4) {
              bd.angularDamping = 0.02;
          }
          const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
          if (index < 4) {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_polygons[index];
              fd.friction = 0.3;
              new_body.CreateFixture(fd);
          }
          else if (index < 5) {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_circle;
              fd.friction = 0.3;
              new_body.CreateFixture(fd);
          }
          else {
              const fd = new b2__namespace.FixtureDef();
              fd.shape = this.m_edge;
              fd.friction = 0.3;
              new_body.CreateFixture(fd);
          }
          this.m_bodyIndex = (this.m_bodyIndex + 1) % RayCast.e_maxBodies;
      }
      DestroyBody() {
          for (let i = 0; i < RayCast.e_maxBodies; ++i) {
              const body = this.m_bodies[i];
              if (body !== null) {
                  this.m_world.DestroyBody(body);
                  this.m_bodies[i] = null;
                  return;
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
                  this.CreateBody(parseInt(key, 10) - 1);
                  break;
              case "d":
                  this.DestroyBody();
                  break;
              case "m":
                  if (this.m_mode === RayCastMode.e_closest) {
                      this.m_mode = RayCastMode.e_any;
                  }
                  else if (this.m_mode === RayCastMode.e_any) {
                      this.m_mode = RayCastMode.e_multiple;
                  }
                  else if (this.m_mode === RayCastMode.e_multiple) {
                      this.m_mode = RayCastMode.e_closest;
                  }
          }
      }
      Step(settings) {
          const advanceRay = !settings.m_pause || settings.m_singleStep;
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press 1-6 to drop stuff, m to change the mode");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          switch (this.m_mode) {
              case RayCastMode.e_closest:
                  g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: closest - find closest fixture along the ray");
                  break;
              case RayCastMode.e_any:
                  g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: any - check for obstruction");
                  break;
              case RayCastMode.e_multiple:
                  g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: multiple - gather multiple fixtures");
                  break;
          }
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const L = 11.0;
          const point1 = new b2__namespace.Vec2(0.0, 10.0);
          const d = new b2__namespace.Vec2(L * b2__namespace.Cos(this.m_angle), L * b2__namespace.Sin(this.m_angle));
          const point2 = b2__namespace.Vec2.AddVV(point1, d, new b2__namespace.Vec2());
          if (this.m_mode === RayCastMode.e_closest) {
              const callback = new RayCastClosestCallback();
              this.m_world.RayCast(callback, point1, point2);
              if (callback.m_hit) {
                  g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2__namespace.Color(0.4, 0.9, 0.4));
                  g_debugDraw.DrawSegment(point1, callback.m_point, new b2__namespace.Color(0.8, 0.8, 0.8));
                  const head = b2__namespace.Vec2.AddVV(callback.m_point, b2__namespace.Vec2.MulSV(0.5, callback.m_normal, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
                  g_debugDraw.DrawSegment(callback.m_point, head, new b2__namespace.Color(0.9, 0.9, 0.4));
              }
              else {
                  g_debugDraw.DrawSegment(point1, point2, new b2__namespace.Color(0.8, 0.8, 0.8));
              }
          }
          else if (this.m_mode === RayCastMode.e_any) {
              const callback = new RayCastAnyCallback();
              this.m_world.RayCast(callback, point1, point2);
              if (callback.m_hit) {
                  g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2__namespace.Color(0.4, 0.9, 0.4));
                  g_debugDraw.DrawSegment(point1, callback.m_point, new b2__namespace.Color(0.8, 0.8, 0.8));
                  const head = b2__namespace.Vec2.AddVV(callback.m_point, b2__namespace.Vec2.MulSV(0.5, callback.m_normal, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
                  g_debugDraw.DrawSegment(callback.m_point, head, new b2__namespace.Color(0.9, 0.9, 0.4));
              }
              else {
                  g_debugDraw.DrawSegment(point1, point2, new b2__namespace.Color(0.8, 0.8, 0.8));
              }
          }
          else if (this.m_mode === RayCastMode.e_multiple) {
              const callback = new RayCastMultipleCallback();
              this.m_world.RayCast(callback, point1, point2);
              g_debugDraw.DrawSegment(point1, point2, new b2__namespace.Color(0.8, 0.8, 0.8));
              for (let i = 0; i < callback.m_count; ++i) {
                  const p = callback.m_points[i];
                  const n = callback.m_normals[i];
                  g_debugDraw.DrawPoint(p, 5.0, new b2__namespace.Color(0.4, 0.9, 0.4));
                  g_debugDraw.DrawSegment(point1, p, new b2__namespace.Color(0.8, 0.8, 0.8));
                  const head = b2__namespace.Vec2.AddVV(p, b2__namespace.Vec2.MulSV(0.5, n, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
                  g_debugDraw.DrawSegment(p, head, new b2__namespace.Color(0.9, 0.9, 0.4));
              }
          }
          if (advanceRay) {
              this.m_angle += 0.25 * b2__namespace.pi / 180.0;
          }
          /*
          #if 0
            // This case was failing.
            {
              b2Vec2 vertices[4];
              //vertices[0].Set(-22.875f, -3.0f);
              //vertices[1].Set(22.875f, -3.0f);
              //vertices[2].Set(22.875f, 3.0f);
              //vertices[3].Set(-22.875f, 3.0f);
      
              b2PolygonShape shape;
              //shape.Set(vertices, 4);
              shape.SetAsBox(22.875f, 3.0f);
      
              b2RayCastInput input;
              input.p1.Set(10.2725f,1.71372f);
              input.p2.Set(10.2353f,2.21807f);
              //input.maxFraction = 0.567623f;
              input.maxFraction = 0.56762173f;
      
              b2Transform xf;
              xf.SetIdentity();
              xf.p.Set(23.0f, 5.0f);
      
              b2RayCastOutput output;
              bool hit;
              hit = shape.RayCast(&output, input, xf);
              hit = false;
      
              b2Color color(1.0f, 1.0f, 1.0f);
              b2Vec2 vs[4];
              for (int32 i = 0; i < 4; ++i)
              {
                vs[i] = b2Mul(xf, shape.m_vertices[i]);
              }
      
              g_debugDraw.DrawPolygon(vs, 4, color);
              g_debugDraw.DrawSegment(input.p1, input.p2, color);
            }
          #endif
          */
      }
      static Create() {
          return new RayCast();
      }
  }
  RayCast.e_maxBodies = 256;
  RegisterTest("Collision", "Ray Cast", RayCast.Create);

  // MIT License
  // Note: even with a restitution of 1.0, there is some energy change
  // due to position correction.
  class Restitution extends Test {
      constructor() {
          super();
          const threshold = 10.0;
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.restitutionThreshold = threshold;
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 1.0;
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              const restitution = [0.0, 0.1, 0.3, 0.5, 0.75, 0.9, 1.0];
              for (let i = 0; i < 7; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-10.0 + 3.0 * i, 20.0);
                  const body = this.m_world.CreateBody(bd);
                  fd.restitution = restitution[i];
                  fd.restitutionThreshold = threshold;
                  body.CreateFixture(fd);
              }
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new Restitution();
      }
  }
  RegisterTest("Forces", "Restitution", Restitution.Create);

  // MIT License
  class Revolute extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              //fd.filter.categoryBits = 2;
              ground.CreateFixture(fd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.5;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const rjd = new b2__namespace.RevoluteJointDef();
              bd.position.Set(-10.0, 20.0);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(shape, 5.0);
              const w = 100.0;
              body.SetAngularVelocity(w);
              body.SetLinearVelocity(new b2__namespace.Vec2(-8.0 * w, 0.0));
              rjd.Initialize(ground, body, new b2__namespace.Vec2(-10.0, 12.0));
              rjd.motorSpeed = 1.0 * b2__namespace.pi;
              rjd.maxMotorTorque = 10000.0;
              rjd.enableMotor = false;
              rjd.lowerAngle = -0.25 * b2__namespace.pi;
              rjd.upperAngle = 0.5 * b2__namespace.pi;
              rjd.enableLimit = true;
              rjd.collideConnected = true;
              this.m_joint = this.m_world.CreateJoint(rjd);
          }
          {
              const circle_shape = new b2__namespace.CircleShape();
              circle_shape.m_radius = 3.0;
              const circle_bd = new b2__namespace.BodyDef();
              circle_bd.type = b2__namespace.BodyType.b2_dynamicBody;
              circle_bd.position.Set(5.0, 30.0);
              const fd = new b2__namespace.FixtureDef();
              fd.density = 5.0;
              fd.filter.maskBits = 1;
              fd.shape = circle_shape;
              this.m_ball = this.m_world.CreateBody(circle_bd);
              this.m_ball.CreateFixture(fd);
              const polygon_shape = new b2__namespace.PolygonShape();
              polygon_shape.SetAsBox(10.0, 0.2, new b2__namespace.Vec2(-10.0, 0.0), 0.0);
              const polygon_bd = new b2__namespace.BodyDef();
              polygon_bd.position.Set(20.0, 10.0);
              polygon_bd.type = b2__namespace.BodyType.b2_dynamicBody;
              polygon_bd.bullet = true;
              const polygon_body = this.m_world.CreateBody(polygon_bd);
              polygon_body.CreateFixture(polygon_shape, 2.0);
              const rjd = new b2__namespace.RevoluteJointDef();
              rjd.Initialize(ground, polygon_body, new b2__namespace.Vec2(20.0, 10.0));
              rjd.lowerAngle = -0.25 * b2__namespace.pi;
              rjd.upperAngle = 0.0 * b2__namespace.pi;
              rjd.enableLimit = true;
              this.m_world.CreateJoint(rjd);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "l":
                  this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
                  break;
              case "m":
                  this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motor");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          // if (this.m_stepCount === 360) {
          //   this.m_ball.SetTransformVec(new b2.Vec2(0.0, 0.5), 0.0);
          // }
          // const torque1 = this.m_joint.GetMotorTorque(settings.hz);
          // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque1.toFixed(0)}, ${torque2.toFixed(0)} : Motor Force = ${force3.toFixed(0)}`);
          // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Revolute();
      }
  }
  RegisterTest("Joints", "Revolute", Revolute.Create);

  // MIT License
  ///
  class Rope extends Test {
      constructor() {
          super();
          this.m_rope1 = new b2__namespace.Rope();
          this.m_rope2 = new b2__namespace.Rope();
          this.m_tuning1 = new b2__namespace.RopeTuning();
          this.m_tuning2 = new b2__namespace.RopeTuning();
          this.m_iterations1 = 0;
          this.m_iterations2 = 0;
          this.m_position1 = new b2__namespace.Vec2();
          this.m_position2 = new b2__namespace.Vec2();
          this.m_speed = 0.0;
          // void UpdateUI() override
          // {
          // 	ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
          // 	ImGui::SetNextWindowSize(ImVec2(200.0, 700.0));
          // 	ImGui::Begin("Tuning", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
          // 	ImGui::Separator();
          //       ImGui::PushItemWidth(ImGui::GetWindowWidth() * 0.5f);
          // 	const ImGuiComboFlags comboFlags = 0;
          // 	const char* bendModels[] = { "Spring", "PBD Ang", "XPBD Ang", "PBD Dist", "PBD Height", "PBD Triangle" };
          // 	const char* stretchModels[] = { "PBD", "XPBD" };
          // 	ImGui::Text("Rope 1");
          // 	static int bendModel1 = this.m_tuning1.bendingModel;
          // 	if (ImGui::BeginCombo("Bend Model##1", bendModels[bendModel1], comboFlags))
          // 	{
          // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
          // 		{
          // 			bool isSelected = (bendModel1 == i);
          // 			if (ImGui::Selectable(bendModels[i], isSelected))
          // 			{
          // 				bendModel1 = i;
          // 				this.m_tuning1.bendingModel = b2BendingModel(i);
          // 			}
          // 			if (isSelected)
          // 			{
          // 				ImGui::SetItemDefaultFocus();
          // 			}
          // 		}
          // 		ImGui::EndCombo();
          // 	}
          // 	ImGui::SliderFloat("Damping##B1", &this.m_tuning1.bendDamping, 0.0, 4.0, "%.1f");
          // 	ImGui::SliderFloat("Hertz##B1", &this.m_tuning1.bendHertz, 0.0, 60.0, "%.0");
          // 	ImGui::SliderFloat("Stiffness##B1", &this.m_tuning1.bendStiffness, 0.0, 1.0, "%.1f");
          // 	ImGui::Checkbox("Isometric##1", &this.m_tuning1.isometric);
          // 	ImGui::Checkbox("Fixed Mass##1", &this.m_tuning1.fixedEffectiveMass);
          // 	ImGui::Checkbox("Warm Start##1", &this.m_tuning1.warmStart);
          // 	static int stretchModel1 = this.m_tuning1.stretchingModel;
          // 	if (ImGui::BeginCombo("Stretch Model##1", stretchModels[stretchModel1], comboFlags))
          // 	{
          // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
          // 		{
          // 			bool isSelected = (stretchModel1 == i);
          // 			if (ImGui::Selectable(stretchModels[i], isSelected))
          // 			{
          // 				stretchModel1 = i;
          // 				this.m_tuning1.stretchingModel = b2StretchingModel(i);
          // 			}
          // 			if (isSelected)
          // 			{
          // 				ImGui::SetItemDefaultFocus();
          // 			}
          // 		}
          // 		ImGui::EndCombo();
          // 	}
          // 	ImGui::SliderFloat("Damping##S1", &this.m_tuning1.stretchDamping, 0.0, 4.0, "%.1f");
          // 	ImGui::SliderFloat("Hertz##S1", &this.m_tuning1.stretchHertz, 0.0, 60.0, "%.0");
          // 	ImGui::SliderFloat("Stiffness##S1", &this.m_tuning1.stretchStiffness, 0.0, 1.0, "%.1f");
          // 	ImGui::SliderInt("Iterations##1", &this.m_iterations1, 1, 100, "%d");
          // 	ImGui::Separator();
          // 	ImGui::Text("Rope 2");
          // 	static int bendModel2 = this.m_tuning2.bendingModel;
          // 	if (ImGui::BeginCombo("Bend Model##2", bendModels[bendModel2], comboFlags))
          // 	{
          // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
          // 		{
          // 			bool isSelected = (bendModel2 == i);
          // 			if (ImGui::Selectable(bendModels[i], isSelected))
          // 			{
          // 				bendModel2 = i;
          // 				this.m_tuning2.bendingModel = b2BendingModel(i);
          // 			}
          // 			if (isSelected)
          // 			{
          // 				ImGui::SetItemDefaultFocus();
          // 			}
          // 		}
          // 		ImGui::EndCombo();
          // 	}
          // 	ImGui::SliderFloat("Damping##B2", &this.m_tuning2.bendDamping, 0.0, 4.0, "%.1f");
          // 	ImGui::SliderFloat("Hertz##B2", &this.m_tuning2.bendHertz, 0.0, 60.0, "%.0");
          // 	ImGui::SliderFloat("Stiffness##B2", &this.m_tuning2.bendStiffness, 0.0, 1.0, "%.1f");
          // 	ImGui::Checkbox("Isometric##2", &this.m_tuning2.isometric);
          // 	ImGui::Checkbox("Fixed Mass##2", &this.m_tuning2.fixedEffectiveMass);
          // 	ImGui::Checkbox("Warm Start##2", &this.m_tuning2.warmStart);
          // 	static int stretchModel2 = this.m_tuning2.stretchingModel;
          // 	if (ImGui::BeginCombo("Stretch Model##2", stretchModels[stretchModel2], comboFlags))
          // 	{
          // 		for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
          // 		{
          // 			bool isSelected = (stretchModel2 == i);
          // 			if (ImGui::Selectable(stretchModels[i], isSelected))
          // 			{
          // 				stretchModel2 = i;
          // 				this.m_tuning2.stretchingModel = b2StretchingModel(i);
          // 			}
          // 			if (isSelected)
          // 			{
          // 				ImGui::SetItemDefaultFocus();
          // 			}
          // 		}
          // 		ImGui::EndCombo();
          // 	}
          // 	ImGui::SliderFloat("Damping##S2", &this.m_tuning2.stretchDamping, 0.0, 4.0, "%.1f");
          // 	ImGui::SliderFloat("Hertz##S2", &this.m_tuning2.stretchHertz, 0.0, 60.0, "%.0");
          // 	ImGui::SliderFloat("Stiffness##S2", &this.m_tuning2.stretchStiffness, 0.0, 1.0, "%.1f");
          // 	ImGui::SliderInt("Iterations##2", &this.m_iterations2, 1, 100, "%d");
          // 	ImGui::Separator();
          // 	ImGui::SliderFloat("Speed", &this.m_speed, 10.0, 100.0, "%.0");
          // 	if (ImGui::Button("Reset"))
          // 	{
          // 		this.m_position1.Set(-5.0, 15.0);
          // 		this.m_position2.Set(5.0, 15.0);
          // 		this.m_rope1.Reset(this.m_position1);
          // 		this.m_rope2.Reset(this.m_position2);
          // 	}
          //       ImGui::PopItemWidth();
          // 	ImGui::End();
          // }
          this.m_move_x = 0.0;
          const N = 20;
          const L = 0.5;
          // b2Vec2 vertices[N];
          const vertices = b2__namespace.Vec2.MakeArray(N);
          // float masses[N];
          const masses = b2__namespace.MakeNumberArray(N);
          for (let i = 0; i < N; ++i) {
              vertices[i].Set(0.0, L * (N - i));
              masses[i] = 1.0;
          }
          masses[0] = 0.0;
          masses[1] = 0.0;
          this.m_tuning1.bendHertz = 30.0;
          this.m_tuning1.bendDamping = 4.0;
          this.m_tuning1.bendStiffness = 1.0;
          this.m_tuning1.bendingModel = b2__namespace.pbdTriangleBendingModel;
          this.m_tuning1.isometric = true;
          this.m_tuning1.stretchHertz = 30.0;
          this.m_tuning1.stretchDamping = 4.0;
          this.m_tuning1.stretchStiffness = 1.0;
          this.m_tuning1.stretchingModel = b2__namespace.pbdStretchingModel;
          this.m_tuning2.bendHertz = 30.0;
          this.m_tuning2.bendDamping = 0.7;
          this.m_tuning2.bendStiffness = 1.0;
          this.m_tuning2.bendingModel = b2__namespace.pbdHeightBendingModel;
          this.m_tuning2.isometric = true;
          this.m_tuning2.stretchHertz = 30.0;
          this.m_tuning2.stretchDamping = 1.0;
          this.m_tuning2.stretchStiffness = 1.0;
          this.m_tuning2.stretchingModel = b2__namespace.pbdStretchingModel;
          this.m_position1.Set(-5.0, 15.0);
          this.m_position2.Set(5.0, 15.0);
          const def = new b2__namespace.RopeDef();
          // def.vertices = vertices;
          vertices.forEach((value) => def.vertices.push(value));
          def.count = N;
          def.gravity.Set(0.0, -10.0);
          // def.masses = masses;
          masses.forEach((value) => def.masses.push(value));
          def.position.Copy(this.m_position1);
          def.tuning.Copy(this.m_tuning1);
          this.m_rope1.Create(def);
          def.position.Copy(this.m_position2);
          def.tuning.Copy(this.m_tuning2);
          this.m_rope2.Create(def);
          this.m_iterations1 = 8;
          this.m_iterations2 = 8;
          this.m_speed = 10.0;
      }
      Keyboard(key) {
          switch (key) {
              case ",":
                  this.m_move_x = -1.0;
                  break;
              case ".":
                  this.m_move_x = 1.0;
                  break;
          }
      }
      KeyboardUp(key) {
          switch (key) {
              case ",":
              case ".":
                  this.m_move_x = 0.0;
                  break;
          }
      }
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause === true && settings.m_singleStep === false) {
              dt = 0.0;
          }
          // if (glfwGetKey(g_mainWindow, GLFW_KEY_COMMA) == GLFW_PRESS)
          // {
          // 	this.m_position1.x -= this.m_speed * dt;
          // 	this.m_position2.x -= this.m_speed * dt;
          // }
          // if (glfwGetKey(g_mainWindow, GLFW_KEY_PERIOD) == GLFW_PRESS)
          // {
          // 	this.m_position1.x += this.m_speed * dt;
          // 	this.m_position2.x += this.m_speed * dt;
          // }
          if (this.m_move_x) {
              this.m_position1.x += this.m_move_x * this.m_speed * dt;
              this.m_position2.x += this.m_move_x * this.m_speed * dt;
          }
          this.m_rope1.SetTuning(this.m_tuning1);
          this.m_rope2.SetTuning(this.m_tuning2);
          this.m_rope1.Step(dt, this.m_iterations1, this.m_position1);
          this.m_rope2.Step(dt, this.m_iterations2, this.m_position2);
          super.Step(settings);
          this.m_rope1.Draw(g_debugDraw);
          this.m_rope2.Draw(g_debugDraw);
          g_debugDraw.DrawString(5, this.m_textLine, "Press comma and period to move left and right");
          // this.m_textLine += this.m_textIncrement;
      }
      static Create() {
          return new Rope();
      }
  }
  RegisterTest("Rope", "Bending", Rope.Create);
  // class Rope : public Test
  // {
  // public:
  // 	Rope()
  // 	{
  // 		const int32 N = 20;
  // 		const float L = 0.5f;
  // 		b2Vec2 vertices[N];
  // 		float masses[N];
  // 		for (let i = 0; i < N; ++i)
  // 		{
  // 			vertices[i].Set(0.0, L * (N - i));
  // 			masses[i] = 1.0;
  // 		}
  // 		masses[0] = 0.0;
  // 		masses[1] = 0.0;
  // 		this.m_tuning1.bendHertz = 30.0;
  // 		this.m_tuning1.bendDamping = 4.0;
  // 		this.m_tuning1.bendStiffness = 1.0;
  // 		this.m_tuning1.bendingModel = b2_xpbdAngleBendingModel;
  // 		this.m_tuning1.isometric = true;
  // 		this.m_tuning1.stretchHertz = 30.0;
  // 		this.m_tuning1.stretchDamping = 4.0;
  // 		this.m_tuning1.stretchStiffness = 1.0;
  // 		this.m_tuning1.stretchingModel = b2_xpbdStretchingModel;
  // 		this.m_tuning2.bendHertz = 30.0;
  // 		this.m_tuning2.bendDamping = 0.7f;
  // 		this.m_tuning2.bendStiffness = 1.0;
  // 		this.m_tuning2.bendingModel = b2_pbdHeightBendingModel;
  // 		this.m_tuning2.isometric = true;
  // 		this.m_tuning2.stretchHertz = 30.0;
  // 		this.m_tuning2.stretchDamping = 1.0;
  // 		this.m_tuning2.stretchStiffness = 1.0;
  // 		this.m_tuning2.stretchingModel = b2_pbdStretchingModel;
  // 		this.m_position1.Set(-5.0, 15.0);
  // 		this.m_position2.Set(5.0, 15.0);
  // 		b2RopeDef def;
  // 		def.vertices = vertices;
  // 		def.count = N;
  // 		def.gravity.Set(0.0, -10.0);
  // 		def.masses = masses;
  // 		def.position = this.m_position1;
  // 		def.tuning = this.m_tuning1;
  // 		this.m_rope1.Create(def);
  // 		def.position = this.m_position2;
  // 		def.tuning = this.m_tuning2;
  // 		this.m_rope2.Create(def);
  // 		this.m_iterations1 = 8;
  // 		this.m_iterations2 = 8;
  // 		this.m_speed = 10.0;
  // 	}
  // 	void UpdateUI() override
  // 	{
  // 		ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
  // 		ImGui::SetNextWindowSize(ImVec2(200.0, 700.0));
  // 		ImGui::Begin("Tuning", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
  // 		ImGui::Separator();
  //         ImGui::PushItemWidth(ImGui::GetWindowWidth() * 0.5f);
  // 		const ImGuiComboFlags comboFlags = 0;
  // 		const char* bendModels[] = { "Spring", "PBD Ang", "XPBD Ang", "PBD Dist", "PBD Height" };
  // 		const char* stretchModels[] = { "PBD", "XPBD" };
  // 		ImGui::Text("Rope 1");
  // 		static int bendModel1 = this.m_tuning1.bendingModel;
  // 		if (ImGui::BeginCombo("Bend Model##1", bendModels[bendModel1], comboFlags))
  // 		{
  // 			for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
  // 			{
  // 				bool isSelected = (bendModel1 == i);
  // 				if (ImGui::Selectable(bendModels[i], isSelected))
  // 				{
  // 					bendModel1 = i;
  // 					this.m_tuning1.bendingModel = b2BendingModel(i);
  // 				}
  // 				if (isSelected)
  // 				{
  // 					ImGui::SetItemDefaultFocus();
  // 				}
  // 			}
  // 			ImGui::EndCombo();
  // 		}
  // 		ImGui::SliderFloat("Damping##B1", &this.m_tuning1.bendDamping, 0.0, 4.0, "%.1f");
  // 		ImGui::SliderFloat("Hertz##B1", &this.m_tuning1.bendHertz, 0.0, 60.0, "%.0");
  // 		ImGui::SliderFloat("Stiffness##B1", &this.m_tuning1.bendStiffness, 0.0, 1.0, "%.1f");
  // 		ImGui::Checkbox("Isometric##1", &this.m_tuning1.isometric);
  // 		ImGui::Checkbox("Fixed Mass##1", &this.m_tuning1.fixedEffectiveMass);
  // 		ImGui::Checkbox("Warm Start##1", &this.m_tuning1.warmStart);
  // 		static int stretchModel1 = this.m_tuning1.stretchingModel;
  // 		if (ImGui::BeginCombo("Stretch Model##1", stretchModels[stretchModel1], comboFlags))
  // 		{
  // 			for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
  // 			{
  // 				bool isSelected = (stretchModel1 == i);
  // 				if (ImGui::Selectable(stretchModels[i], isSelected))
  // 				{
  // 					stretchModel1 = i;
  // 					this.m_tuning1.stretchingModel = b2StretchingModel(i);
  // 				}
  // 				if (isSelected)
  // 				{
  // 					ImGui::SetItemDefaultFocus();
  // 				}
  // 			}
  // 			ImGui::EndCombo();
  // 		}
  // 		ImGui::SliderFloat("Damping##S1", &this.m_tuning1.stretchDamping, 0.0, 4.0, "%.1f");
  // 		ImGui::SliderFloat("Hertz##S1", &this.m_tuning1.stretchHertz, 0.0, 60.0, "%.0");
  // 		ImGui::SliderFloat("Stiffness##S1", &this.m_tuning1.stretchStiffness, 0.0, 1.0, "%.1f");
  // 		ImGui::SliderInt("Iterations##1", &this.m_iterations1, 1, 100, "%d");
  // 		ImGui::Separator();
  // 		ImGui::Text("Rope 2");
  // 		static int bendModel2 = this.m_tuning2.bendingModel;
  // 		if (ImGui::BeginCombo("Bend Model##2", bendModels[bendModel2], comboFlags))
  // 		{
  // 			for (int i = 0; i < Ithis.M_ARRAYSIZE(bendModels); ++i)
  // 			{
  // 				bool isSelected = (bendModel2 == i);
  // 				if (ImGui::Selectable(bendModels[i], isSelected))
  // 				{
  // 					bendModel2 = i;
  // 					this.m_tuning2.bendingModel = b2BendingModel(i);
  // 				}
  // 				if (isSelected)
  // 				{
  // 					ImGui::SetItemDefaultFocus();
  // 				}
  // 			}
  // 			ImGui::EndCombo();
  // 		}
  // 		ImGui::SliderFloat("Damping##B2", &this.m_tuning2.bendDamping, 0.0, 4.0, "%.1f");
  // 		ImGui::SliderFloat("Hertz##B2", &this.m_tuning2.bendHertz, 0.0, 60.0, "%.0");
  // 		ImGui::SliderFloat("Stiffness##B2", &this.m_tuning2.bendStiffness, 0.0, 1.0, "%.1f");
  // 		ImGui::Checkbox("Isometric##2", &this.m_tuning2.isometric);
  // 		ImGui::Checkbox("Fixed Mass##2", &this.m_tuning2.fixedEffectiveMass);
  // 		ImGui::Checkbox("Warm Start##2", &this.m_tuning2.warmStart);
  // 		static int stretchModel2 = this.m_tuning2.stretchingModel;
  // 		if (ImGui::BeginCombo("Stretch Model##2", stretchModels[stretchModel2], comboFlags))
  // 		{
  // 			for (int i = 0; i < Ithis.M_ARRAYSIZE(stretchModels); ++i)
  // 			{
  // 				bool isSelected = (stretchModel2 == i);
  // 				if (ImGui::Selectable(stretchModels[i], isSelected))
  // 				{
  // 					stretchModel2 = i;
  // 					this.m_tuning2.stretchingModel = b2StretchingModel(i);
  // 				}
  // 				if (isSelected)
  // 				{
  // 					ImGui::SetItemDefaultFocus();
  // 				}
  // 			}
  // 			ImGui::EndCombo();
  // 		}
  // 		ImGui::SliderFloat("Damping##S2", &this.m_tuning2.stretchDamping, 0.0, 4.0, "%.1f");
  // 		ImGui::SliderFloat("Hertz##S2", &this.m_tuning2.stretchHertz, 0.0, 60.0, "%.0");
  // 		ImGui::SliderFloat("Stiffness##S2", &this.m_tuning2.stretchStiffness, 0.0, 1.0, "%.1f");
  // 		ImGui::SliderInt("Iterations##2", &this.m_iterations2, 1, 100, "%d");
  // 		ImGui::Separator();
  // 		ImGui::SliderFloat("Speed", &this.m_speed, 10.0, 100.0, "%.0");
  // 		if (ImGui::Button("Reset"))
  // 		{
  // 			this.m_position1.Set(-5.0, 15.0);
  // 			this.m_position2.Set(5.0, 15.0);
  // 			this.m_rope1.Reset(this.m_position1);
  // 			this.m_rope2.Reset(this.m_position2);
  // 		}
  //         ImGui::PopItemWidth();
  // 		ImGui::End();
  // 	}
  // 	void Step(Settings& settings) override
  // 	{
  // 		float dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
  // 		if (settings.m_pause == 1 && settings.m_singleStep == 0)
  // 		{
  // 			dt = 0.0;
  // 		}
  // 		if (glfwGetKey(g_mainWindow, GLFW_KEY_COMMA) == GLFW_PRESS)
  // 		{
  // 			this.m_position1.x -= this.m_speed * dt;
  // 			this.m_position2.x -= this.m_speed * dt;
  // 		}
  // 		if (glfwGetKey(g_mainWindow, GLFW_KEY_PERIOD) == GLFW_PRESS)
  // 		{
  // 			this.m_position1.x += this.m_speed * dt;
  // 			this.m_position2.x += this.m_speed * dt;
  // 		}
  // 		this.m_rope1.SetTuning(this.m_tuning1);
  // 		this.m_rope2.SetTuning(this.m_tuning2);
  // 		this.m_rope1.Step(dt, this.m_iterations1, this.m_position1);
  // 		this.m_rope2.Step(dt, this.m_iterations2, this.m_position2);
  // 		Test::Step(settings);
  // 		this.m_rope1.Draw(&g_debugDraw);
  // 		this.m_rope2.Draw(&g_debugDraw);
  // 		g_debugDraw.DrawString(5, this.m_textLine, "Press comma and period to move left and right");
  // 		this.m_textLine += this.m_textIncrement;
  // 	}
  // 	static Test* Create()
  // 	{
  // 		return new Rope;
  // 	}
  // 	b2Rope this.m_rope1;
  // 	b2Rope this.m_rope2;
  // 	b2RopeTuning this.m_tuning1;
  // 	b2RopeTuning this.m_tuning2;
  // 	int32 this.m_iterations1;
  // 	int32 this.m_iterations2;
  // 	b2Vec2 this.m_position1;
  // 	b2Vec2 this.m_position2;
  // 	float this.m_speed;
  // };
  // static int testIndex = RegisterTest("Rope", "Bending", Rope::Create);
  // export class OldRope extends testbed.Test {
  //   // public this.m_rope = new b2.Rope();
  //   public m_angle = 0.0;
  //   constructor() {
  //     super();
  //     /*const int32*/
  //     const N = 40;
  //     /*b2.Vec2[]*/
  //     const vertices = b2.Vec2.MakeArray(N);
  //     /*float32[]*/
  //     const masses = b2.MakeNumberArray(N);
  //     for (let i = 0; i < N; ++i) {
  //       vertices[i].Set(0.0, 20.0 - 0.25 * i);
  //       masses[i] = 1.0;
  //     }
  //     masses[0] = 0.0;
  //     masses[1] = 0.0;
  //     /*b2.RopeDef*/
  //     // const def = new b2.RopeDef();
  //     // def.vertices = vertices;
  //     // def.count = N;
  //     // def.gravity.Set(0.0, -10.0);
  //     // def.masses = masses;
  //     // def.damping = 0.1;
  //     // def.k2 = 1.0;
  //     // def.k3 = 0.5;
  //     // this.m_rope.Initialize(def);
  //     this.m_angle = 0.0;
  //     // this.m_rope.SetAngle(this.m_angle);
  //   }
  //   public Keyboard(key: string) {
  //     switch (key) {
  //       case "q":
  //         this.m_angle = b2.Max(-b2.pi, this.m_angle - 0.05 * b2.pi);
  //         // this.m_rope.SetAngle(this.m_angle);
  //         break;
  //       case "e":
  //         this.m_angle = b2.Min(b2.pi, this.m_angle + 0.05 * b2.pi);
  //         // this.m_rope.SetAngle(this.m_angle);
  //         break;
  //     }
  //   }
  //   public Step(settings: testbed.Settings): void {
  //     // let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
  //     // if (settings.m_pause && !settings.m_singleStep) {
  //     //   dt = 0.0;
  //     // }
  //     // this.m_rope.Step(dt, 1);
  //     super.Step(settings);
  //     // this.m_rope.Draw(testbed.g_debugDraw);
  //     testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (q,e) to adjust target angle");
  //     this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  //     testbed.g_debugDraw.DrawString(5, this.m_textLine, `Target angle = ${(this.m_angle * 180.0 / b2.pi).toFixed(2)} degrees`);
  //     this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  //   }
  //   public static Create(): testbed.Test {
  //     return new OldRope();
  //   }
  // }

  // MIT License
  // This shows how to use sensor shapes. Sensors don't have collision, but report overlap events.
  class Sensors extends Test {
      constructor() {
          super();
          this.m_bodies = new Array(Sensors.e_count);
          this.m_touching = new Array(Sensors.e_count);
          for (let i = 0; i < Sensors.e_count; ++i) {
              this.m_touching[i] = new Array(1);
          }
          const bd = new b2__namespace.BodyDef();
          const ground = this.m_world.CreateBody(bd);
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          /*
          {
            const sd = new b2.FixtureDef();
            sd.SetAsBox(10.0, 2.0, new b2.Vec2(0.0, 20.0), 0.0);
            sd.isSensor = true;
            this.m_sensor = ground.CreateFixture(sd);
          }
          */
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 5.0;
              shape.m_p.Set(0.0, 10.0);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.isSensor = true;
              this.m_sensor = ground.CreateFixture(fd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 1.0;
              for (let i = 0; i < Sensors.e_count; ++i) {
                  //const bd = new b2.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-10.0 + 3.0 * i, 20.0);
                  bd.userData = this.m_touching[i];
                  this.m_touching[i][0] = false;
                  this.m_bodies[i] = this.m_world.CreateBody(bd);
                  this.m_bodies[i].CreateFixture(shape, 1.0);
              }
          }
      }
      BeginContact(contact) {
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          if (fixtureA === this.m_sensor) {
              const userData = fixtureB.GetBody().GetUserData();
              if (userData) {
                  const touching = userData;
                  touching[0] = true;
              }
          }
          if (fixtureB === this.m_sensor) {
              const userData = fixtureA.GetBody().GetUserData();
              if (userData) {
                  const touching = userData;
                  touching[0] = true;
              }
          }
      }
      EndContact(contact) {
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          if (fixtureA === this.m_sensor) {
              const userData = fixtureB.GetBody().GetUserData();
              if (userData) {
                  const touching = userData;
                  touching[0] = false;
              }
          }
          if (fixtureB === this.m_sensor) {
              const userData = fixtureA.GetBody().GetUserData();
              if (userData) {
                  const touching = userData;
                  touching[0] = false;
              }
          }
      }
      Step(settings) {
          super.Step(settings);
          // Traverse the contact results. Apply a force on shapes
          // that overlap the sensor.
          for (let i = 0; i < Sensors.e_count; ++i) {
              if (!this.m_touching[i][0]) {
                  continue;
              }
              const body = this.m_bodies[i];
              const ground = this.m_sensor.GetBody();
              const circle = this.m_sensor.GetShape();
              const center = ground.GetWorldPoint(circle.m_p, new b2__namespace.Vec2());
              const position = body.GetPosition();
              const d = b2__namespace.Vec2.SubVV(center, position, new b2__namespace.Vec2());
              if (d.LengthSquared() < b2__namespace.epsilon_sq) {
                  continue;
              }
              d.Normalize();
              const F = b2__namespace.Vec2.MulSV(100.0, d, new b2__namespace.Vec2());
              body.ApplyForce(F, position);
          }
      }
      static Create() {
          return new Sensors();
      }
  }
  Sensors.e_count = 7;
  RegisterTest("Collision", "Sensors", Sensors.Create);

  // MIT License
  class ShapeCast extends Test {
      constructor() {
          super();
          this.m_vAs = b2__namespace.Vec2.MakeArray(b2__namespace.maxPolygonVertices);
          this.m_countA = 0;
          this.m_radiusA = 0;
          this.m_vBs = b2__namespace.Vec2.MakeArray(b2__namespace.maxPolygonVertices);
          this.m_countB = 0;
          this.m_radiusB = 0;
          this.m_transformA = new b2__namespace.Transform();
          this.m_transformB = new b2__namespace.Transform();
          this.m_translationB = new b2__namespace.Vec2();
          // #if 1
          this.m_vAs[0].Set(-0.5, 1.0);
          this.m_vAs[1].Set(0.5, 1.0);
          this.m_vAs[2].Set(0.0, 0.0);
          this.m_countA = 3;
          this.m_radiusA = b2__namespace.polygonRadius;
          this.m_vBs[0].Set(-0.5, -0.5);
          this.m_vBs[1].Set(0.5, -0.5);
          this.m_vBs[2].Set(0.5, 0.5);
          this.m_vBs[3].Set(-0.5, 0.5);
          this.m_countB = 4;
          this.m_radiusB = b2__namespace.polygonRadius;
          this.m_transformA.p.Set(0.0, 0.25);
          this.m_transformA.q.SetIdentity();
          this.m_transformB.p.Set(-4.0, 0.0);
          this.m_transformB.q.SetIdentity();
          this.m_translationB.Set(8.0, 0.0);
          // #elif 0
          // this.m_vAs[0].Set(0.0, 0.0);
          // this.m_countA = 1;
          // this.m_radiusA = 0.5;
          // this.m_vBs[0].Set(0.0, 0.0);
          // this.m_countB = 1;
          // this.m_radiusB = 0.5;
          // this.m_transformA.p.Set(0.0, 0.25);
          // this.m_transformA.q.SetIdentity();
          // this.m_transformB.p.Set(-4.0, 0.0);
          // this.m_transformB.q.SetIdentity();
          // this.m_translationB.Set(8.0, 0.0);
          // #else
          // this.m_vAs[0].Set(0.0, 0.0);
          // this.m_vAs[1].Set(2.0, 0.0);
          // this.m_countA = 2;
          // this.m_radiusA = b2.polygonRadius;
          // this.m_vBs[0].Set(0.0, 0.0);
          // this.m_countB = 1;
          // this.m_radiusB = 0.25;
          // // Initial overlap
          // this.m_transformA.p.Set(0.0, 0.0);
          // this.m_transformA.q.SetIdentity();
          // this.m_transformB.p.Set(-0.244360745, 0.05999358);
          // this.m_transformB.q.SetIdentity();
          // this.m_translationB.Set(0.0, 0.0399999991);
          // #endif
      }
      Step(settings) {
          super.Step(settings);
          const input = new b2__namespace.ShapeCastInput();
          input.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
          input.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
          input.transformA.Copy(this.m_transformA);
          input.transformB.Copy(this.m_transformB);
          input.translationB.Copy(this.m_translationB);
          const output = new b2__namespace.ShapeCastOutput();
          const hit = b2__namespace.ShapeCast(output, input);
          const transformB2 = new b2__namespace.Transform();
          transformB2.q.Copy(this.m_transformB.q);
          // transformB2.p = transformB.p + output.lambda * input.translationB;
          transformB2.p.Copy(this.m_transformB.p).SelfMulAdd(output.lambda, input.translationB);
          const distanceInput = new b2__namespace.DistanceInput();
          distanceInput.proxyA.SetVerticesRadius(this.m_vAs, this.m_countA, this.m_radiusA);
          distanceInput.proxyB.SetVerticesRadius(this.m_vBs, this.m_countB, this.m_radiusB);
          distanceInput.transformA.Copy(this.m_transformA);
          distanceInput.transformB.Copy(transformB2);
          distanceInput.useRadii = false;
          const simplexCache = new b2__namespace.SimplexCache();
          simplexCache.count = 0;
          const distanceOutput = new b2__namespace.DistanceOutput();
          b2__namespace.Distance(distanceOutput, simplexCache, distanceInput);
          g_debugDraw.DrawString(5, this.m_textLine, `hit = ${hit ? "true" : "false"}, iters = ${output.iterations}, lambda = ${output.lambda}, distance = ${distanceOutput.distance.toFixed(5)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.PushTransform(this.m_transformA);
          if (this.m_countA === 1) {
              g_debugDraw.DrawCircle(this.m_vAs[0], this.m_radiusA, new b2__namespace.Color(0.9, 0.9, 0.9));
          }
          else {
              g_debugDraw.DrawPolygon(this.m_vAs, this.m_countA, new b2__namespace.Color(0.9, 0.9, 0.9));
          }
          g_debugDraw.PopTransform(this.m_transformA);
          g_debugDraw.PushTransform(this.m_transformB);
          if (this.m_countB === 1) {
              g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2__namespace.Color(0.5, 0.9, 0.5));
          }
          else {
              g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2__namespace.Color(0.5, 0.9, 0.5));
          }
          g_debugDraw.PopTransform(this.m_transformB);
          g_debugDraw.PushTransform(transformB2);
          if (this.m_countB === 1) {
              g_debugDraw.DrawCircle(this.m_vBs[0], this.m_radiusB, new b2__namespace.Color(0.5, 0.7, 0.9));
          }
          else {
              g_debugDraw.DrawPolygon(this.m_vBs, this.m_countB, new b2__namespace.Color(0.5, 0.7, 0.9));
          }
          g_debugDraw.PopTransform(transformB2);
          if (hit) {
              const p1 = output.point;
              g_debugDraw.DrawPoint(p1, 10.0, new b2__namespace.Color(0.9, 0.3, 0.3));
              // b2Vec2 p2 = p1 + output.normal;
              const p2 = b2__namespace.Vec2.AddVV(p1, output.normal, new b2__namespace.Vec2());
              g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.3, 0.3));
          }
      }
      static Create() {
          return new ShapeCast();
      }
  }
  ShapeCast.e_vertexCount = 8;
  RegisterTest("Collision", "Shape Cast", ShapeCast.Create);

  // MIT License
  class ShapeEditing extends Test {
      constructor() {
          super();
          this.m_fixture2 = null;
          this.m_sensor = false;
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Set(0.0, 10.0);
          this.m_body = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(4.0, 4.0, new b2__namespace.Vec2(0.0, 0.0), 0.0);
          this.m_fixture1 = this.m_body.CreateFixture(shape, 10.0);
      }
      Keyboard(key) {
          switch (key) {
              case "c":
                  if (this.m_fixture2 === null) {
                      const shape = new b2__namespace.CircleShape();
                      shape.m_radius = 3.0;
                      shape.m_p.Set(0.5, -4.0);
                      this.m_fixture2 = this.m_body.CreateFixture(shape, 10.0);
                      this.m_body.SetAwake(true);
                  }
                  break;
              case "d":
                  if (this.m_fixture2 !== null) {
                      this.m_body.DestroyFixture(this.m_fixture2);
                      this.m_fixture2 = null;
                      this.m_body.SetAwake(true);
                  }
                  break;
              case "s":
                  if (this.m_fixture2 !== null) {
                      this.m_sensor = !this.m_sensor;
                      this.m_fixture2.SetSensor(this.m_sensor);
                  }
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press: (c) create a shape, (d) destroy a shape.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, `sensor = ${(this.m_sensor) ? (1) : (0)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new ShapeEditing();
      }
  }
  RegisterTest("Examples", "Shape Editing", ShapeEditing.Create);

  /*
  Test case for collision/jerking issue.
  */
  class Skier extends Test {
      constructor() {
          super();
          const ground = this.m_world.CreateBody();
          const PlatformWidth = 8.0;
          /*
          First angle is from the horizontal and should be negative for a downward slope.
          Second angle is relative to the preceding slope, and should be positive, creating a kind of
          loose 'Z'-shape from the 3 edges.
          If A1 = -10, then A2 <= ~1.5 will result in the collision glitch.
          If A1 = -30, then A2 <= ~10.0 will result in the glitch.
          */
          const Angle1Degrees = -30.0;
          const Angle2Degrees = 10.0;
          /*
          The larger the value of SlopeLength, the less likely the glitch will show up.
          */
          const SlopeLength = 2.0;
          const SurfaceFriction = 0.2;
          // Convert to radians
          const Slope1Incline = -Angle1Degrees * b2__namespace.pi / 180.0;
          const Slope2Incline = Slope1Incline - Angle2Degrees * b2__namespace.pi / 180.0;
          //
          this.m_platform_width = PlatformWidth;
          // Horizontal platform
          const v1 = new b2__namespace.Vec2(-PlatformWidth, 0.0);
          const v2 = new b2__namespace.Vec2(0.0, 0.0);
          const v3 = new b2__namespace.Vec2(SlopeLength * Math.cos(Slope1Incline), -SlopeLength * Math.sin(Slope1Incline));
          const v4 = new b2__namespace.Vec2(v3.x + SlopeLength * Math.cos(Slope2Incline), v3.y - SlopeLength * Math.sin(Slope2Incline));
          const v5 = new b2__namespace.Vec2(v4.x, v4.y - 1.0);
          const vertices = [v5, v4, v3, v2, v1];
          const shape = new b2__namespace.ChainShape();
          shape.CreateLoop(vertices);
          const fd = new b2__namespace.FixtureDef();
          fd.shape = shape;
          fd.density = 0.0;
          fd.friction = SurfaceFriction;
          ground.CreateFixture(fd);
          {
              // const BodyWidth = 1.0;
              const BodyHeight = 2.5;
              const SkiLength = 3.0;
              /*
              Larger values for this seem to alleviate the issue to some extent.
              */
              const SkiThickness = 0.3;
              const SkiFriction = 0.0;
              const SkiRestitution = 0.15;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const initial_y = BodyHeight / 2 + SkiThickness;
              bd.position.Set(-this.m_platform_width / 2, initial_y);
              const skier = this.m_world.CreateBody(bd);
              const ski = new b2__namespace.PolygonShape();
              const verts = [];
              verts.push(new b2__namespace.Vec2(-SkiLength / 2 - SkiThickness, -BodyHeight / 2));
              verts.push(new b2__namespace.Vec2(-SkiLength / 2, -BodyHeight / 2 - SkiThickness));
              verts.push(new b2__namespace.Vec2(SkiLength / 2, -BodyHeight / 2 - SkiThickness));
              verts.push(new b2__namespace.Vec2(SkiLength / 2 + SkiThickness, -BodyHeight / 2));
              ski.Set(verts);
              const fd = new b2__namespace.FixtureDef();
              fd.density = 1.0;
              fd.friction = SkiFriction;
              fd.restitution = SkiRestitution;
              fd.shape = ski;
              skier.CreateFixture(fd);
              skier.SetLinearVelocity(new b2__namespace.Vec2(0.5, 0.0));
              this.m_skier = skier;
          }
          g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
          g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
          g_camera.m_zoom = 0.4;
          this.m_fixed_camera = true;
      }
      Keyboard(key) {
          switch (key) {
              case "c":
                  this.m_fixed_camera = !this.m_fixed_camera;
                  if (this.m_fixed_camera) {
                      g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
                  }
                  break;
          }
      }
      Step(settings) {
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: c = Camera fixed/tracking");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          if (!this.m_fixed_camera) {
              g_camera.m_center.Copy(this.m_skier.GetPosition());
          }
          super.Step(settings);
      }
      static Create() {
          return new Skier();
      }
  }
  RegisterTest("Bugs", "Skier", Skier.Create);

  // MIT License
  class SliderCrank1 extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0.0, 17.0);
              ground = this.m_world.CreateBody(bd);
          }
          {
              let prevBody = ground;
              // Define crank.
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(4.0, 1.0);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(-8.0, 20.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(-12.0, 20.0));
                  this.m_world.CreateJoint(rjd);
                  prevBody = body;
              }
              // Define connecting rod
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(8.0, 1.0);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(4.0, 20.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(-4.0, 20.0));
                  this.m_world.CreateJoint(rjd);
                  prevBody = body;
              }
              // Define piston
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(3.0, 3.0);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.fixedRotation = true;
                  bd.position.Set(12.0, 20.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(12.0, 20.0));
                  this.m_world.CreateJoint(rjd);
                  const pjd = new b2__namespace.PrismaticJointDef();
                  pjd.Initialize(ground, body, new b2__namespace.Vec2(12.0, 17.0), new b2__namespace.Vec2(1.0, 0.0));
                  this.m_world.CreateJoint(pjd);
              }
          }
      }
      static Create() {
          return new SliderCrank1();
      }
  }
  RegisterTest("Examples", "Slider Crank 1", SliderCrank1.Create);

  // MIT License
  // A motor driven slider crank with joint friction.
  class SliderCrank2 extends Test {
      constructor() {
          super();
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              let prevBody = ground;
              // Define crank.
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(0.5, 2.0);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.0, 7.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(0.0, 5.0));
                  rjd.motorSpeed = 1.0 * b2__namespace.pi;
                  rjd.maxMotorTorque = 10000.0;
                  rjd.enableMotor = true;
                  this.m_joint1 = this.m_world.CreateJoint(rjd);
                  prevBody = body;
              }
              // Define follower.
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(0.5, 4.0);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.0, 13.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(0.0, 9.0));
                  rjd.enableMotor = false;
                  this.m_world.CreateJoint(rjd);
                  prevBody = body;
              }
              // Define piston
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(1.5, 1.5);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.fixedRotation = true;
                  bd.position.Set(0.0, 17.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
                  const rjd = new b2__namespace.RevoluteJointDef();
                  rjd.Initialize(prevBody, body, new b2__namespace.Vec2(0.0, 17.0));
                  this.m_world.CreateJoint(rjd);
                  const pjd = new b2__namespace.PrismaticJointDef();
                  pjd.Initialize(ground, body, new b2__namespace.Vec2(0.0, 17.0), new b2__namespace.Vec2(0.0, 1.0));
                  pjd.maxMotorForce = 1000.0;
                  pjd.enableMotor = true;
                  this.m_joint2 = this.m_world.CreateJoint(pjd);
              }
              // Create a payload
              {
                  const shape = new b2__namespace.PolygonShape();
                  shape.SetAsBox(1.5, 1.5);
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.0, 23.0);
                  const body = this.m_world.CreateBody(bd);
                  body.CreateFixture(shape, 2.0);
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "f":
                  this.m_joint2.EnableMotor(!this.m_joint2.IsMotorEnabled());
                  this.m_joint2.GetBodyB().SetAwake(true);
                  break;
              case "m":
                  this.m_joint1.EnableMotor(!this.m_joint1.IsMotorEnabled());
                  this.m_joint1.GetBodyB().SetAwake(true);
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (f) toggle friction, (m) toggle motor");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const torque = this.m_joint1.GetMotorTorque(settings.m_hertz);
          g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new SliderCrank2();
      }
  }
  SliderCrank2.e_count = 30;
  RegisterTest("Examples", "Slider Crank 2", SliderCrank2.Create);

  // MIT License
  class TheoJansen extends Test {
      constructor() {
          super();
          this.m_offset = new b2__namespace.Vec2();
          this.m_motorOn = false;
          this.m_motorSpeed = 0;
          this.Construct();
      }
      CreateLeg(s, wheelAnchor) {
          const p1 = new b2__namespace.Vec2(5.4 * s, -6.1);
          const p2 = new b2__namespace.Vec2(7.2 * s, -1.2);
          const p3 = new b2__namespace.Vec2(4.3 * s, -1.9);
          const p4 = new b2__namespace.Vec2(3.1 * s, 0.8);
          const p5 = new b2__namespace.Vec2(6.0 * s, 1.5);
          const p6 = new b2__namespace.Vec2(2.5 * s, 3.7);
          const fd1 = new b2__namespace.FixtureDef();
          const fd2 = new b2__namespace.FixtureDef();
          fd1.filter.groupIndex = -1;
          fd2.filter.groupIndex = -1;
          fd1.density = 1.0;
          fd2.density = 1.0;
          const poly1 = new b2__namespace.PolygonShape();
          const poly2 = new b2__namespace.PolygonShape();
          if (s > 0.0) {
              const vertices = new Array();
              vertices[0] = p1;
              vertices[1] = p2;
              vertices[2] = p3;
              poly1.Set(vertices);
              vertices[0] = b2__namespace.Vec2_zero;
              vertices[1] = b2__namespace.Vec2.SubVV(p5, p4, new b2__namespace.Vec2());
              vertices[2] = b2__namespace.Vec2.SubVV(p6, p4, new b2__namespace.Vec2());
              poly2.Set(vertices);
          }
          else {
              const vertices = new Array();
              vertices[0] = p1;
              vertices[1] = p3;
              vertices[2] = p2;
              poly1.Set(vertices);
              vertices[0] = b2__namespace.Vec2_zero;
              vertices[1] = b2__namespace.Vec2.SubVV(p6, p4, new b2__namespace.Vec2());
              vertices[2] = b2__namespace.Vec2.SubVV(p5, p4, new b2__namespace.Vec2());
              poly2.Set(vertices);
          }
          fd1.shape = poly1;
          fd2.shape = poly2;
          const bd1 = new b2__namespace.BodyDef();
          const bd2 = new b2__namespace.BodyDef();
          bd1.type = b2__namespace.BodyType.b2_dynamicBody;
          bd2.type = b2__namespace.BodyType.b2_dynamicBody;
          bd1.position.Copy(this.m_offset);
          bd2.position.Copy(b2__namespace.Vec2.AddVV(p4, this.m_offset, new b2__namespace.Vec2()));
          bd1.angularDamping = 10.0;
          bd2.angularDamping = 10.0;
          const body1 = this.m_world.CreateBody(bd1);
          const body2 = this.m_world.CreateBody(bd2);
          body1.CreateFixture(fd1);
          body2.CreateFixture(fd2);
          {
              const jd = new b2__namespace.DistanceJointDef();
              // Using a soft distance constraint can reduce some jitter.
              // It also makes the structure seem a bit more fluid by
              // acting like a suspension system.
              const dampingRatio = 0.5;
              const frequencyHz = 10.0;
              jd.Initialize(body1, body2, b2__namespace.Vec2.AddVV(p2, this.m_offset, new b2__namespace.Vec2()), b2__namespace.Vec2.AddVV(p5, this.m_offset, new b2__namespace.Vec2()));
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_world.CreateJoint(jd);
              jd.Initialize(body1, body2, b2__namespace.Vec2.AddVV(p3, this.m_offset, new b2__namespace.Vec2()), b2__namespace.Vec2.AddVV(p4, this.m_offset, new b2__namespace.Vec2()));
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_world.CreateJoint(jd);
              jd.Initialize(body1, this.m_wheel, b2__namespace.Vec2.AddVV(p3, this.m_offset, new b2__namespace.Vec2()), b2__namespace.Vec2.AddVV(wheelAnchor, this.m_offset, new b2__namespace.Vec2()));
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_world.CreateJoint(jd);
              jd.Initialize(body2, this.m_wheel, b2__namespace.Vec2.AddVV(p6, this.m_offset, new b2__namespace.Vec2()), b2__namespace.Vec2.AddVV(wheelAnchor, this.m_offset, new b2__namespace.Vec2()));
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_world.CreateJoint(jd);
          }
          {
              const jd = new b2__namespace.RevoluteJointDef();
              jd.Initialize(body2, this.m_chassis, b2__namespace.Vec2.AddVV(p4, this.m_offset, new b2__namespace.Vec2()));
              this.m_world.CreateJoint(jd);
          }
      }
      Construct() {
          this.m_offset.Set(0.0, 8.0);
          this.m_motorSpeed = 2.0;
          this.m_motorOn = true;
          const pivot = new b2__namespace.Vec2(0.0, 0.8);
          // Ground
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-50.0, 0.0), new b2__namespace.Vec2(50.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(-50.0, 0.0), new b2__namespace.Vec2(-50.0, 10.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(50.0, 0.0), new b2__namespace.Vec2(50.0, 10.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Balls
          for (let i = 0; i < 40; ++i) {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 0.25;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-40.0 + 2.0 * i, 0.5);
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(shape, 1.0);
          }
          // Chassis
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(2.5, 1.0);
              const sd = new b2__namespace.FixtureDef();
              sd.density = 1.0;
              sd.shape = shape;
              sd.filter.groupIndex = -1;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Copy(pivot).SelfAdd(this.m_offset);
              this.m_chassis = this.m_world.CreateBody(bd);
              this.m_chassis.CreateFixture(sd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 1.6;
              const sd = new b2__namespace.FixtureDef();
              sd.density = 1.0;
              sd.shape = shape;
              sd.filter.groupIndex = -1;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Copy(pivot).SelfAdd(this.m_offset);
              this.m_wheel = this.m_world.CreateBody(bd);
              this.m_wheel.CreateFixture(sd);
          }
          {
              const jd = new b2__namespace.RevoluteJointDef();
              jd.Initialize(this.m_wheel, this.m_chassis, b2__namespace.Vec2.AddVV(pivot, this.m_offset, new b2__namespace.Vec2()));
              jd.collideConnected = false;
              jd.motorSpeed = this.m_motorSpeed;
              jd.maxMotorTorque = 400.0;
              jd.enableMotor = this.m_motorOn;
              this.m_motorJoint = this.m_world.CreateJoint(jd);
          }
          const wheelAnchor = b2__namespace.Vec2.AddVV(pivot, new b2__namespace.Vec2(0.0, -0.8), new b2__namespace.Vec2());
          this.CreateLeg(-1.0, wheelAnchor);
          this.CreateLeg(1.0, wheelAnchor);
          this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), 120.0 * b2__namespace.pi / 180.0);
          this.CreateLeg(-1.0, wheelAnchor);
          this.CreateLeg(1.0, wheelAnchor);
          this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), -120.0 * b2__namespace.pi / 180.0);
          this.CreateLeg(-1.0, wheelAnchor);
          this.CreateLeg(1.0, wheelAnchor);
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_motorJoint.SetMotorSpeed(-this.m_motorSpeed);
                  break;
              case "s":
                  this.m_motorJoint.SetMotorSpeed(0.0);
                  break;
              case "d":
                  this.m_motorJoint.SetMotorSpeed(this.m_motorSpeed);
                  break;
              case "m":
                  this.m_motorJoint.EnableMotor(!this.m_motorJoint.IsMotorEnabled());
                  break;
          }
      }
      Step(settings) {
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, toggle motor = m");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          super.Step(settings);
      }
      static Create() {
          return new TheoJansen();
      }
  }
  RegisterTest("Examples", "Theo Jansen", TheoJansen.Create);

  // MIT License
  /// This stress tests the dynamic tree broad-phase. This also shows that tile
  /// based collision is _not_ smooth due to Box2D not knowing about adjacency.
  class Tiles extends Test {
      constructor() {
          super();
          this.m_fixtureCount = 0;
          this.m_createTime = 0.0;
          this.m_fixtureCount = 0;
          const timer = new b2__namespace.Timer();
          {
              const a = 0.5;
              const bd = new b2__namespace.BodyDef();
              bd.position.y = -a;
              const ground = this.m_world.CreateBody(bd);
              {
                  const N = 200;
                  const M = 10;
                  const position = new b2__namespace.Vec2();
                  position.y = 0.0;
                  for (let j = 0; j < M; ++j) {
                      position.x = -N * a;
                      for (let i = 0; i < N; ++i) {
                          const shape = new b2__namespace.PolygonShape();
                          shape.SetAsBox(a, a, position, 0.0);
                          ground.CreateFixture(shape, 0.0);
                          ++this.m_fixtureCount;
                          position.x += 2.0 * a;
                      }
                      position.y -= 2.0 * a;
                  }
              }
              //    else
              //    {
              //     const N = 200;
              //     const M = 10;
              //      const position = new b2.Vec2();
              //      position.x = -N * a;
              //      for (let i = 0; i < N; ++i)
              //      {
              //        position.y = 0.0;
              //        for (let j = 0; j < M; ++j)
              //        {
              //          const shape = new b2.PolygonShape();
              //          shape.SetAsBox(a, a, position, 0.0);
              //          ground.CreateFixture(shape, 0.0);
              //          position.y -= 2.0 * a;
              //        }
              //        position.x += 2.0 * a;
              //      }
              //    }
          }
          {
              const a = 0.5;
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(a, a);
              const x = new b2__namespace.Vec2(-7.0, 0.75);
              const y = new b2__namespace.Vec2();
              const deltaX = new b2__namespace.Vec2(0.5625, 1.25);
              const deltaY = new b2__namespace.Vec2(1.125, 0.0);
              for (let i = 0; i < Tiles.e_count; ++i) {
                  y.Copy(x);
                  for (let j = i; j < Tiles.e_count; ++j) {
                      const bd = new b2__namespace.BodyDef();
                      bd.type = b2__namespace.BodyType.b2_dynamicBody;
                      bd.position.Copy(y);
                      //if (i === 0 && j === 0)
                      //{
                      //  bd.allowSleep = false;
                      //}
                      //else
                      //{
                      //  bd.allowSleep = true;
                      //}
                      const body = this.m_world.CreateBody(bd);
                      body.CreateFixture(shape, 5.0);
                      ++this.m_fixtureCount;
                      y.SelfAdd(deltaY);
                  }
                  x.SelfAdd(deltaX);
              }
          }
          this.m_createTime = timer.GetMilliseconds();
      }
      Step(settings) {
          const cm = this.m_world.GetContactManager();
          const height = cm.m_broadPhase.GetTreeHeight();
          const leafCount = cm.m_broadPhase.GetProxyCount();
          const minimumNodeCount = 2 * leafCount - 1;
          const minimumHeight = Math.ceil(Math.log(minimumNodeCount) / Math.log(2.0));
          g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}, min = ${minimumHeight}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, `create time = ${this.m_createTime.toFixed(2)} ms, fixture count = ${this.m_fixtureCount}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          //b2.DynamicTree* tree = this.m_world.this.m_contactManager.m_broadPhase.m_tree;
          //if (this.m_stepCount === 400)
          //{
          //  tree.RebuildBottomUp();
          //}
      }
      static Create() {
          return new Tiles();
      }
  }
  Tiles.e_count = 20;
  RegisterTest("Benchmark", "Tiles", Tiles.Create);

  // MIT License
  class TimeOfImpact extends Test {
      constructor() {
          super();
          this.m_shapeA = new b2__namespace.PolygonShape();
          this.m_shapeB = new b2__namespace.PolygonShape();
          this.m_shapeA.SetAsBox(25.0, 5.0);
          this.m_shapeB.SetAsBox(2.5, 2.5);
      }
      Step(settings) {
          super.Step(settings);
          const sweepA = new b2__namespace.Sweep();
          sweepA.c0.Set(0.0, 20.0 + 8.0 * Math.cos(Date.now() / 1000)); // (24.0, -60.0);
          sweepA.a0 = 2.95;
          sweepA.c.Copy(sweepA.c0);
          sweepA.a = sweepA.a0;
          sweepA.localCenter.SetZero();
          const sweepB = new b2__namespace.Sweep();
          sweepB.c0.Set(20.0, 40.0); // (53.474274, -50.252514);
          sweepB.a0 = 0.1; // 513.36676; // - 162.0 * b2.pi;
          sweepB.c.Set(-20.0, 0.0); // (54.595478, -51.083473);
          sweepB.a = 3.1; // 513.62781; //  - 162.0 * b2.pi;
          sweepB.localCenter.SetZero();
          //sweepB.a0 -= 300.0 * b2.pi;
          //sweepB.a -= 300.0 * b2.pi;
          const input = new b2__namespace.TOIInput();
          input.proxyA.SetShape(this.m_shapeA, 0);
          input.proxyB.SetShape(this.m_shapeB, 0);
          input.sweepA.Copy(sweepA);
          input.sweepB.Copy(sweepB);
          input.tMax = 1.0;
          const output = new b2__namespace.TOIOutput();
          b2__namespace.TimeOfImpact(output, input);
          g_debugDraw.DrawString(5, this.m_textLine, `toi = ${output.t.toFixed(3)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, `max toi iters = ${b2__namespace.toiMaxIters}, max root iters = ${b2__namespace.toiMaxRootIters}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const vertices = [];
          const transformA = new b2__namespace.Transform();
          sweepA.GetTransform(transformA, 0.0);
          for (let i = 0; i < this.m_shapeA.m_count; ++i) {
              vertices[i] = b2__namespace.Transform.MulXV(transformA, this.m_shapeA.m_vertices[i], new b2__namespace.Vec2());
          }
          g_debugDraw.DrawPolygon(vertices, this.m_shapeA.m_count, new b2__namespace.Color(0.9, 0.9, 0.9));
          const transformB = new b2__namespace.Transform();
          sweepB.GetTransform(transformB, 0.0);
          //b2.Vec2 localPoint(2.0f, -0.1f);
          for (let i = 0; i < this.m_shapeB.m_count; ++i) {
              vertices[i] = b2__namespace.Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new b2__namespace.Vec2());
          }
          g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new b2__namespace.Color(0.5, 0.9, 0.5));
          g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${(0.0).toFixed(1)}`);
          sweepB.GetTransform(transformB, output.t);
          for (let i = 0; i < this.m_shapeB.m_count; ++i) {
              vertices[i] = b2__namespace.Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new b2__namespace.Vec2());
          }
          g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new b2__namespace.Color(0.5, 0.7, 0.9));
          g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${output.t.toFixed(3)}`);
          sweepB.GetTransform(transformB, 1.0);
          for (let i = 0; i < this.m_shapeB.m_count; ++i) {
              vertices[i] = b2__namespace.Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new b2__namespace.Vec2());
          }
          g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new b2__namespace.Color(0.9, 0.5, 0.5));
          g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${(1.0).toFixed(1)}`);
          // #if 0
          for (let t = 0.0; t < 1.0; t += 0.1) {
              sweepB.GetTransform(transformB, t);
              for (let i = 0; i < this.m_shapeB.m_count; ++i) {
                  vertices[i] = b2__namespace.Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new b2__namespace.Vec2());
              }
              g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new b2__namespace.Color(0.5, 0.5, 0.5));
              g_debugDraw.DrawStringWorld(transformB.p.x, transformB.p.y, `${t.toFixed(1)}`);
          }
          // #endif
      }
      static Create() {
          return new TimeOfImpact();
      }
  }
  RegisterTest("Collision", "Time of Impact", TimeOfImpact.Create);

  // MIT License
  class Tumbler extends Test {
      constructor() {
          super();
          this.m_count = 0;
          const ground = this.m_world.CreateBody(new b2__namespace.BodyDef());
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.allowSleep = false;
              bd.position.Set(0.0, 10.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 10.0, new b2__namespace.Vec2(10.0, 0.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(0.5, 10.0, new b2__namespace.Vec2(-10.0, 0.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(10.0, 0.5, new b2__namespace.Vec2(0.0, 10.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(10.0, 0.5, new b2__namespace.Vec2(0.0, -10.0), 0.0);
              body.CreateFixture(shape, 5.0);
              const jd = new b2__namespace.RevoluteJointDef();
              jd.bodyA = ground;
              jd.bodyB = body;
              jd.localAnchorA.Set(0.0, 10.0);
              jd.localAnchorB.Set(0.0, 0.0);
              jd.referenceAngle = 0.0;
              jd.motorSpeed = 0.05 * b2__namespace.pi;
              jd.maxMotorTorque = 1e8;
              jd.enableMotor = true;
              this.m_joint = this.m_world.CreateJoint(jd);
          }
          this.m_count = 0;
      }
      Step(settings) {
          super.Step(settings);
          if (this.m_count < Tumbler.e_count) {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 10.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.125, 0.125);
              body.CreateFixture(shape, 1.0);
              ++this.m_count;
          }
      }
      static Create() {
          return new Tumbler();
      }
  }
  Tumbler.e_count = 800;
  RegisterTest("Benchmark", "Tumbler", Tumbler.Create);

  // MIT License
  // Test distance joints, body destruction, and joint destruction.
  class Web extends Test {
      constructor() {
          super();
          this.m_bodies = new Array(4);
          this.m_joints = new Array(8);
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(-5.0, 5.0);
              const body0 = this.m_bodies[0] = this.m_world.CreateBody(bd);
              body0.CreateFixture(shape, 5.0);
              bd.position.Set(5.0, 5.0);
              const body1 = this.m_bodies[1] = this.m_world.CreateBody(bd);
              body1.CreateFixture(shape, 5.0);
              bd.position.Set(5.0, 15.0);
              const body2 = this.m_bodies[2] = this.m_world.CreateBody(bd);
              body2.CreateFixture(shape, 5.0);
              bd.position.Set(-5.0, 15.0);
              const body3 = this.m_bodies[3] = this.m_world.CreateBody(bd);
              body3.CreateFixture(shape, 5.0);
              const jd = new b2__namespace.DistanceJointDef();
              let p1, p2, d;
              const frequencyHz = 2.0;
              const dampingRatio = 0.0;
              jd.bodyA = ground;
              jd.bodyB = body0;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(-10.0, 0.0);
              jd.localAnchorB.Set(-0.5, -0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[0] = this.m_world.CreateJoint(jd);
              jd.bodyA = ground;
              jd.bodyB = body1;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(10.0, 0.0);
              jd.localAnchorB.Set(0.5, -0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[1] = this.m_world.CreateJoint(jd);
              jd.bodyA = ground;
              jd.bodyB = body2;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(10.0, 20.0);
              jd.localAnchorB.Set(0.5, 0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[2] = this.m_world.CreateJoint(jd);
              jd.bodyA = ground;
              jd.bodyB = body3;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(-10.0, 20.0);
              jd.localAnchorB.Set(-0.5, 0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[3] = this.m_world.CreateJoint(jd);
              jd.bodyA = body0;
              jd.bodyB = body1;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(0.5, 0.0);
              jd.localAnchorB.Set(-0.5, 0.0);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[4] = this.m_world.CreateJoint(jd);
              jd.bodyA = body1;
              jd.bodyB = body2;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(0.0, 0.5);
              jd.localAnchorB.Set(0.0, -0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[5] = this.m_world.CreateJoint(jd);
              jd.bodyA = body2;
              jd.bodyB = body3;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(-0.5, 0.0);
              jd.localAnchorB.Set(0.5, 0.0);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[6] = this.m_world.CreateJoint(jd);
              jd.bodyA = body3;
              jd.bodyB = body0;
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              jd.localAnchorA.Set(0.0, -0.5);
              jd.localAnchorB.Set(0.0, 0.5);
              p1 = jd.bodyA.GetWorldPoint(jd.localAnchorA, new b2__namespace.Vec2());
              p2 = jd.bodyB.GetWorldPoint(jd.localAnchorB, new b2__namespace.Vec2());
              d = b2__namespace.Vec2.SubVV(p2, p1, new b2__namespace.Vec2());
              jd.length = d.Length();
              this.m_joints[7] = this.m_world.CreateJoint(jd);
          }
      }
      JointDestroyed(joint) {
          for (let i = 0; i < 8; ++i) {
              if (this.m_joints[i] === joint) {
                  this.m_joints[i] = null;
                  break;
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "b":
                  for (let i = 0; i < 4; ++i) {
                      const body = this.m_bodies[i];
                      if (body) {
                          this.m_world.DestroyBody(body);
                          this.m_bodies[i] = null;
                          break;
                      }
                  }
                  break;
              case "j":
                  for (let i = 0; i < 8; ++i) {
                      const joint = this.m_joints[i];
                      if (joint) {
                          this.m_world.DestroyJoint(joint);
                          this.m_joints[i] = null;
                          break;
                      }
                  }
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press: (b) to delete a body, (j) to delete a joint");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new Web();
      }
  }
  RegisterTest("Examples", "Web", Web.Create);

  // MIT License
  // Test the wheel joint with motor, spring, and limit options.
  class WheelJoint extends Test {
      constructor() {
          super();
          this.m_enableLimit = false;
          this.m_enableMotor = false;
          this.m_motorSpeed = 0.0;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          this.m_enableLimit = true;
          this.m_enableMotor = false;
          this.m_motorSpeed = 10.0;
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_radius = 2.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.dynamicBody;
              bd.position.Set(0.0, 10.0);
              bd.allowSleep = false;
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(shape, 5.0);
              const jd = new b2__namespace.WheelJointDef();
              // Horizontal
              jd.Initialize(ground, body, bd.position, new b2__namespace.Vec2(0.0, 1.0));
              jd.motorSpeed = this.m_motorSpeed;
              jd.maxMotorTorque = 10000.0;
              jd.enableMotor = this.m_enableMotor;
              jd.lowerTranslation = -3.0;
              jd.upperTranslation = 3.0;
              jd.enableLimit = this.m_enableLimit;
              const hertz = 1.0;
              const dampingRatio = 0.7;
              b2__namespace.LinearStiffness(jd, hertz, dampingRatio, ground, body);
              this.m_joint = this.m_world.CreateJoint(jd);
          }
      }
      Step(settings) {
          super.Step(settings);
          const torque = this.m_joint.GetMotorTorque(settings.m_hertz);
          // g_debugDraw.DrawString(5, m_textLine, "Motor Torque = %4.0f", torque);
          g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          const F = this.m_joint.GetReactionForce(settings.m_hertz, WheelJoint.Step_s_F);
          // g_debugDraw.DrawString(5, m_textLine, "Reaction Force = (%4.1f, %4.1f)", F.x, F.y);
          g_debugDraw.DrawString(5, this.m_textLine, `Reaction Force = (${F.x.toFixed(1)}, ${F.y.toFixed(1)})`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new WheelJoint();
      }
  }
  WheelJoint.Step_s_F = new b2__namespace.Vec2();
  RegisterTest("Joints", "Wheel", WheelJoint.Create);

  // MIT License
  /// This test shows how a distance joint can be used to stabilize a chain of
  /// bodies with a heavy payload. Notice that the distance joint just prevents
  /// excessive stretching and has no other effect.
  /// By disabling the distance joint you can see that the Box2D solver has trouble
  /// supporting heavy bodies with light bodies. Try playing around with the
  /// densities, time step, and iterations to see how they affect stability.
  /// This test also shows how to use contact filtering. Filtering is configured
  /// so that the payload does not collide with the chain.
  class WreckingBall extends Test {
      constructor() {
          super();
          this.m_distanceJointDef = new b2__namespace.DistanceJointDef();
          this.m_distanceJoint = null;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.125);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 20.0;
              fd.friction = 0.2;
              fd.filter.categoryBits = 0x0001;
              fd.filter.maskBits = 0xFFFF & ~0x0002;
              const jd = new b2__namespace.RevoluteJointDef();
              jd.collideConnected = false;
              const N = 10;
              const y = 15.0;
              this.m_distanceJointDef.localAnchorA.Set(0.0, y);
              let prevBody = ground;
              for (let i = 0; i < N; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  bd.position.Set(0.5 + 1.0 * i, y);
                  if (i === N - 1) {
                      bd.position.Set(1.0 * i, y);
                      bd.angularDamping = 0.4;
                  }
                  const body = this.m_world.CreateBody(bd);
                  if (i === N - 1) {
                      const circleShape = new b2__namespace.CircleShape();
                      circleShape.m_radius = 1.5;
                      const sfd = new b2__namespace.FixtureDef();
                      sfd.shape = circleShape;
                      sfd.density = 100.0;
                      sfd.filter.categoryBits = 0x0002;
                      body.CreateFixture(sfd);
                  }
                  else {
                      body.CreateFixture(fd);
                  }
                  const anchor = new b2__namespace.Vec2(i, y);
                  jd.Initialize(prevBody, body, anchor);
                  this.m_world.CreateJoint(jd);
                  prevBody = body;
              }
              this.m_distanceJointDef.localAnchorB.SetZero();
              const extraLength = 0.01;
              this.m_distanceJointDef.minLength = 0.0;
              this.m_distanceJointDef.maxLength = N - 1.0 + extraLength;
              this.m_distanceJointDef.bodyB = prevBody;
          }
          {
              this.m_distanceJointDef.bodyA = ground;
              this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
          }
      }
      Keyboard(key) {
          switch (key) {
              case "j":
                  if (this.m_distanceJoint) {
                      this.m_world.DestroyJoint(this.m_distanceJoint);
                      this.m_distanceJoint = null;
                  }
                  else {
                      this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
                  }
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press (j) to toggle the distance joint.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          if (this.m_distanceJoint) {
              g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint ON");
          }
          else {
              g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint OFF");
          }
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new WreckingBall();
      }
  }
  RegisterTest("Examples", "Wrecking Ball", WreckingBall.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class BlobTest extends Test {
      constructor() {
          super();
          const ground = this.m_world.CreateBody(new b2__namespace.BodyDef());
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(-40.0, 25.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(40.0, 0.0), new b2__namespace.Vec2(40.0, 25.0));
              ground.CreateFixture(shape, 0.0);
          }
          {
              const ajd = new b2__namespace.AreaJointDef();
              const cx = 0.0;
              const cy = 10.0;
              const rx = 5.0;
              const ry = 5.0;
              const nBodies = 20;
              const bodyRadius = 0.5;
              for (let i = 0; i < nBodies; ++i) {
                  const angle = (i * 2.0 * Math.PI) / nBodies;
                  const bd = new b2__namespace.BodyDef();
                  //bd.isBullet = true;
                  bd.fixedRotation = true;
                  const x = cx + rx * Math.cos(angle);
                  const y = cy + ry * Math.sin(angle);
                  bd.position.Set(x, y);
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  const body = this.m_world.CreateBody(bd);
                  const fd = new b2__namespace.FixtureDef();
                  fd.shape = new b2__namespace.CircleShape(bodyRadius);
                  fd.density = 1.0;
                  body.CreateFixture(fd);
                  ajd.AddBody(body);
              }
              const frequencyHz = 10.0;
              const dampingRatio = 1.0;
              b2__namespace.LinearStiffness(ajd, frequencyHz, dampingRatio, ajd.bodyA, ajd.bodyB);
              this.m_world.CreateJoint(ajd);
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new BlobTest();
      }
  }
  RegisterTest("Extras", "Blob Test", BlobTest.Create);

  class DominoTower extends Test {
      constructor() {
          super();
          const DOMINO_WIDTH = .2;
          const DOMINO_FRICTION = 0.1;
          const DOMINO_HEIGHT = 1.0;
          const BASE_COUNT = 25;
          /**
           * The density of the dominos under construction. Varies for
           * different parts of the tower.
           */
          let dominoDensity;
          function makeDomino(x, y, horizontal) {
              const sd = new b2__namespace.PolygonShape();
              sd.SetAsBox(0.5 * DOMINO_WIDTH, 0.5 * DOMINO_HEIGHT);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = sd;
              fd.density = dominoDensity;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              fd.friction = DOMINO_FRICTION;
              fd.restitution = 0.65;
              bd.position.Set(x, y);
              bd.angle = horizontal ? (Math.PI / 2.0) : 0;
              const myBody = world.CreateBody(bd);
              myBody.CreateFixture(fd);
          }
          const gravity = new b2__namespace.Vec2(0, -10);
          //world = new b2.World(gravity);
          const world = this.m_world;
          world.SetGravity(gravity);
          // Create the floor
          {
              const sd = new b2__namespace.PolygonShape();
              sd.SetAsBox(50, 10);
              const bd = new b2__namespace.BodyDef();
              bd.position.Set(0, -10);
              const body = world.CreateBody(bd);
              body.CreateFixture(sd, 0);
          }
          {
              dominoDensity = 10;
              // Make bullet
              const sd = new b2__namespace.PolygonShape();
              sd.SetAsBox(.7, .7);
              const fd = new b2__namespace.FixtureDef();
              fd.density = 35.0;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              fd.shape = sd;
              fd.friction = 0.0;
              fd.restitution = 0.85;
              bd.bullet = true;
              bd.position.Set(30.0, 5.00);
              let b = world.CreateBody(bd);
              b.CreateFixture(fd);
              b.SetLinearVelocity(new b2__namespace.Vec2(-25.0, -25.0));
              b.SetAngularVelocity(6.7);
              fd.density = 25.0;
              bd.position.Set(-30.0, 25.0);
              b = world.CreateBody(bd);
              b.CreateFixture(fd);
              b.SetLinearVelocity(new b2__namespace.Vec2(35.0, -10.0));
              b.SetAngularVelocity(-8.3);
          }
          {
              let currX;
              // Make base
              for (let i = 0; i < BASE_COUNT; ++i) {
                  currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT / 2);
                  makeDomino(currX, DOMINO_HEIGHT / 2.0, false);
                  makeDomino(currX, DOMINO_HEIGHT + DOMINO_WIDTH / 2.0, true);
              }
              currX = BASE_COUNT * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT / 2);
              // Make 'I's
              for (let j = 1; j < BASE_COUNT; ++j) {
                  if (j > 3) {
                      dominoDensity *= .8;
                  }
                  // The y at the center of the I structure.
                  const currY = DOMINO_HEIGHT * 0.5 + (DOMINO_HEIGHT + 2 * DOMINO_WIDTH) * .99 * j;
                  for (let i = 0; i < BASE_COUNT - j; ++i) {
                      currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * (BASE_COUNT - j) / 2);
                      dominoDensity *= 2.5;
                      if (i === 0) {
                          makeDomino(currX - (1.25 * DOMINO_HEIGHT) + .5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
                      }
                      if (i === BASE_COUNT - j - 1) {
                          makeDomino(currX + (1.25 * DOMINO_HEIGHT) - .5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
                      }
                      dominoDensity /= 2.5;
                      makeDomino(currX, currY, false);
                      makeDomino(currX, currY + .5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
                      makeDomino(currX, currY - .5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
                  }
              }
          }
      }
      static Create() {
          return new DominoTower();
      }
  }
  RegisterTest("Extras", "Domino Tower", DominoTower.Create);

  class PyramidTopple extends Test {
      constructor() {
          super();
          const WIDTH = 4;
          const HEIGHT = 30;
          const add_domino = (world, pos, flipped) => {
              const mass = 1;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Copy(pos);
              const body = world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              if (flipped) {
                  shape.SetAsBox(0.5 * HEIGHT, 0.5 * WIDTH);
              }
              else {
                  shape.SetAsBox(0.5 * WIDTH, 0.5 * HEIGHT);
              }
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = mass / (WIDTH * HEIGHT);
              fd.friction = 0.6;
              fd.restitution = 0.0;
              body.CreateFixture(fd);
          };
          const world = this.m_world;
          ///settings.positionIterations = 30; // cpSpaceSetIterations(space, 30);
          ///world.SetGravity(new b2.Vec2(0, -300)); // cpSpaceSetGravity(space, cpv(0, -300));
          ///b2.timeToSleep = 0.5; // cpSpaceSetSleepTimeThreshold(space, 0.5f);
          ///b2.linearSlop = 0.5; // cpSpaceSetCollisionSlop(space, 0.5f);
          // Add a floor.
          const bd = new b2__namespace.BodyDef();
          const body = world.CreateBody(bd);
          const shape = new b2__namespace.EdgeShape();
          shape.SetTwoSided(new b2__namespace.Vec2(-600, -240), new b2__namespace.Vec2(600, -240));
          const fd = new b2__namespace.FixtureDef();
          fd.shape = shape;
          fd.friction = 1.0;
          fd.restitution = 1.0;
          body.CreateFixture(fd);
          // Add the dominoes.
          const n = 12;
          for (let i = 0; i < n; i++) {
              for (let j = 0; j < (n - i); j++) {
                  const offset = new b2__namespace.Vec2((j - (n - 1 - i) * 0.5) * 1.5 * HEIGHT, (i + 0.5) * (HEIGHT + 2 * WIDTH) - WIDTH - 240);
                  add_domino(world, offset, false);
                  add_domino(world, b2__namespace.Vec2.AddVV(offset, new b2__namespace.Vec2(0, (HEIGHT + WIDTH) / 2), new b2__namespace.Vec2()), true);
                  if (j === 0) {
                      add_domino(world, b2__namespace.Vec2.AddVV(offset, new b2__namespace.Vec2(0.5 * (WIDTH - HEIGHT), HEIGHT + WIDTH), new b2__namespace.Vec2()), false);
                  }
                  if (j !== n - i - 1) {
                      add_domino(world, b2__namespace.Vec2.AddVV(offset, new b2__namespace.Vec2(HEIGHT * 0.75, (HEIGHT + 3 * WIDTH) / 2), new b2__namespace.Vec2()), true);
                  }
                  else {
                      add_domino(world, b2__namespace.Vec2.AddVV(offset, new b2__namespace.Vec2(0.5 * (HEIGHT - WIDTH), HEIGHT + WIDTH), new b2__namespace.Vec2()), false);
                  }
              }
          }
      }
      GetDefaultViewZoom() {
          return 10.0;
      }
      static Create() {
          return new PyramidTopple();
      }
  }
  RegisterTest("Extras", "Pyramid Topple", PyramidTopple.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class TestCCD extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const vertices = [];
              vertices[0] = new b2__namespace.Vec2(-30.0, 40.0);
              vertices[1] = new b2__namespace.Vec2(30.0, 40.0);
              vertices[2] = new b2__namespace.Vec2(30.0, 0.0);
              vertices[3] = new b2__namespace.Vec2(-30.0, 0.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vertices);
              ground.CreateFixture(shape, 0.0);
          }
          // Always on, even if default is off
          this.m_world.SetContinuousPhysics(true);
          const fd = new b2__namespace.FixtureDef();
          // These values are used for all the parts of the 'basket'
          fd.density = 4.0;
          fd.restitution = 1.4;
          // Create 'basket'
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.bullet = true;
              bd.position.Set(15.0, 5.0);
              const body = this.m_world.CreateBody(bd);
              const sd_bottom = new b2__namespace.PolygonShape();
              sd_bottom.SetAsBox(4.5, 0.45);
              fd.shape = sd_bottom;
              body.CreateFixture(fd);
              const sd_left = new b2__namespace.PolygonShape();
              sd_left.SetAsBox(0.45, 8.1, new b2__namespace.Vec2(-4.35, 7.05), 0.2);
              fd.shape = sd_left;
              body.CreateFixture(fd);
              const sd_right = new b2__namespace.PolygonShape();
              sd_right.SetAsBox(0.45, 8.1, new b2__namespace.Vec2(4.35, 7.05), -0.2);
              fd.shape = sd_right;
              body.CreateFixture(fd);
          }
          // add some small circles for effect
          for (let i = 0; i < 5; i++) {
              const cd = new b2__namespace.CircleShape((Math.random() * 1.0 + 0.5));
              fd.shape = cd;
              fd.friction = 0.3;
              fd.density = 1.0;
              fd.restitution = 1.1;
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.bullet = true;
              bd.position.Set((Math.random() * 30.0 - 25.0), (Math.random() * 32.0 + 2.0));
              const body = this.m_world.CreateBody(bd);
              body.CreateFixture(fd);
          }
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new TestCCD();
      }
  }
  RegisterTest("Extras", "Test CCD", TestCCD.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class TestRagdoll extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const vertices = [];
              vertices[0] = new b2__namespace.Vec2(-30.0, 40.0);
              vertices[1] = new b2__namespace.Vec2(30.0, 40.0);
              vertices[2] = new b2__namespace.Vec2(30.0, 0.0);
              vertices[3] = new b2__namespace.Vec2(-30.0, 0.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vertices);
              ground.CreateFixture(shape, 0.0);
          }
          const bd = new b2__namespace.BodyDef();
          const fd = new b2__namespace.FixtureDef();
          const jd = new b2__namespace.RevoluteJointDef();
          // Add 2 ragdolls along the top
          for (let i = 0; i < 2; ++i) {
              const startX = -20.0 + Math.random() * 2.0 + 40.0 * i;
              const startY = 30.0 + Math.random() * 5.0;
              // BODIES
              // Set these to dynamic bodies
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              // Head
              fd.shape = new b2__namespace.CircleShape(1.25);
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.3;
              bd.position.Set(startX, startY);
              const head = this.m_world.CreateBody(bd);
              head.CreateFixture(fd);
              //if (i === 0)
              //{
              head.ApplyLinearImpulse(new b2__namespace.Vec2(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0), head.GetWorldCenter());
              //}
              // Torso1
              const shape = new b2__namespace.PolygonShape();
              fd.shape = shape;
              shape.SetAsBox(1.5, 1.0);
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.1;
              bd.position.Set(startX, (startY - 2.8));
              const torso1 = this.m_world.CreateBody(bd);
              torso1.CreateFixture(fd);
              // Torso2
              shape.SetAsBox(1.5, 1.0);
              bd.position.Set(startX, (startY - 4.3));
              const torso2 = this.m_world.CreateBody(bd);
              torso2.CreateFixture(fd);
              // Torso3
              shape.SetAsBox(1.5, 1.0);
              bd.position.Set(startX, (startY - 5.8));
              const torso3 = this.m_world.CreateBody(bd);
              torso3.CreateFixture(fd);
              // UpperArm
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.1;
              // L
              shape.SetAsBox(1.8, 0.65);
              bd.position.Set((startX - 3.0), (startY - 2.0));
              const upperArmL = this.m_world.CreateBody(bd);
              upperArmL.CreateFixture(fd);
              // R
              shape.SetAsBox(1.8, 0.65);
              bd.position.Set((startX + 3.0), (startY - 2.0));
              const upperArmR = this.m_world.CreateBody(bd);
              upperArmR.CreateFixture(fd);
              // LowerArm
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.1;
              // L
              shape.SetAsBox(1.7, 0.6);
              bd.position.Set((startX - 5.7), (startY - 2.0));
              const lowerArmL = this.m_world.CreateBody(bd);
              lowerArmL.CreateFixture(fd);
              // R
              shape.SetAsBox(1.7, 0.6);
              bd.position.Set((startX + 5.7), (startY - 2.0));
              const lowerArmR = this.m_world.CreateBody(bd);
              lowerArmR.CreateFixture(fd);
              // UpperLeg
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.1;
              // L
              shape.SetAsBox(0.75, 2.2);
              bd.position.Set((startX - 0.8), (startY - 8.5));
              const upperLegL = this.m_world.CreateBody(bd);
              upperLegL.CreateFixture(fd);
              // R
              shape.SetAsBox(0.75, 2.2);
              bd.position.Set((startX + 0.8), (startY - 8.5));
              const upperLegR = this.m_world.CreateBody(bd);
              upperLegR.CreateFixture(fd);
              // LowerLeg
              fd.density = 1.0;
              fd.friction = 0.4;
              fd.restitution = 0.1;
              // L
              shape.SetAsBox(0.6, 2.0);
              bd.position.Set((startX - 0.8), (startY - 12.0));
              const lowerLegL = this.m_world.CreateBody(bd);
              lowerLegL.CreateFixture(fd);
              // R
              shape.SetAsBox(0.6, 2.0);
              bd.position.Set((startX + 0.8), (startY - 12.0));
              const lowerLegR = this.m_world.CreateBody(bd);
              lowerLegR.CreateFixture(fd);
              // JOINTS
              jd.enableLimit = true;
              // Head to shoulders
              jd.lowerAngle = b2__namespace.DegToRad(-40.0);
              jd.upperAngle = b2__namespace.DegToRad(40.0);
              jd.Initialize(torso1, head, new b2__namespace.Vec2(startX, (startY - 1.5)));
              this.m_world.CreateJoint(jd);
              // Upper arm to shoulders
              // L
              jd.lowerAngle = b2__namespace.DegToRad(-85.0);
              jd.upperAngle = b2__namespace.DegToRad(130.0);
              jd.Initialize(torso1, upperArmL, new b2__namespace.Vec2((startX - 1.8), (startY - 2.0)));
              this.m_world.CreateJoint(jd);
              // R
              jd.lowerAngle = b2__namespace.DegToRad(-130.0);
              jd.upperAngle = b2__namespace.DegToRad(85.0);
              jd.Initialize(torso1, upperArmR, new b2__namespace.Vec2((startX + 1.8), (startY - 2.0)));
              this.m_world.CreateJoint(jd);
              // Lower arm to upper arm
              // L
              jd.lowerAngle = b2__namespace.DegToRad(-130.0);
              jd.upperAngle = b2__namespace.DegToRad(10.0);
              jd.Initialize(upperArmL, lowerArmL, new b2__namespace.Vec2((startX - 4.5), (startY - 2.0)));
              this.m_world.CreateJoint(jd);
              // R
              jd.lowerAngle = b2__namespace.DegToRad(-10.0);
              jd.upperAngle = b2__namespace.DegToRad(130.0);
              jd.Initialize(upperArmR, lowerArmR, new b2__namespace.Vec2((startX + 4.5), (startY - 2.0)));
              this.m_world.CreateJoint(jd);
              // Shoulders/stomach
              jd.lowerAngle = b2__namespace.DegToRad(-15.0);
              jd.upperAngle = b2__namespace.DegToRad(15.0);
              jd.Initialize(torso1, torso2, new b2__namespace.Vec2(startX, (startY - 3.5)));
              this.m_world.CreateJoint(jd);
              // Stomach/hips
              jd.Initialize(torso2, torso3, new b2__namespace.Vec2(startX, (startY - 5.0)));
              this.m_world.CreateJoint(jd);
              // Torso to upper leg
              // L
              jd.lowerAngle = b2__namespace.DegToRad(-25.0);
              jd.upperAngle = b2__namespace.DegToRad(45.0);
              jd.Initialize(torso3, upperLegL, new b2__namespace.Vec2((startX - 0.8), (startY - 7.2)));
              this.m_world.CreateJoint(jd);
              // R
              jd.lowerAngle = b2__namespace.DegToRad(-45.0);
              jd.upperAngle = b2__namespace.DegToRad(25.0);
              jd.Initialize(torso3, upperLegR, new b2__namespace.Vec2((startX + 0.8), (startY - 7.2)));
              this.m_world.CreateJoint(jd);
              // Upper leg to lower leg
              // L
              jd.lowerAngle = b2__namespace.DegToRad(-25.0);
              jd.upperAngle = b2__namespace.DegToRad(115.0);
              jd.Initialize(upperLegL, lowerLegL, new b2__namespace.Vec2((startX - 0.8), (startY - 10.5)));
              this.m_world.CreateJoint(jd);
              // R
              jd.lowerAngle = b2__namespace.DegToRad(-115.0);
              jd.upperAngle = b2__namespace.DegToRad(25.0);
              jd.Initialize(upperLegR, lowerLegR, new b2__namespace.Vec2((startX + 0.8), (startY - 10.5)));
              this.m_world.CreateJoint(jd);
          }
          // these are static bodies so set the type accordingly
          bd.type = b2__namespace.BodyType.b2_staticBody;
          const shape = new b2__namespace.PolygonShape();
          fd.shape = shape;
          fd.density = 0.0;
          fd.friction = 0.4;
          fd.restitution = 0.3;
          // Add stairs on the left
          for (let j = 1; j <= 10; ++j) {
              shape.SetAsBox((1.0 * j), 1.0);
              bd.position.Set((1.0 * j - 30.0), (21.0 - 2.0 * j));
              this.m_world.CreateBody(bd).CreateFixture(fd);
          }
          // Add stairs on the right
          for (let k = 1; k <= 10; ++k) {
              shape.SetAsBox((1.0 * k), 1.0);
              bd.position.Set((30.0 - 1.0 * k), (21.0 - 2.0 * k));
              this.m_world.CreateBody(bd).CreateFixture(fd);
          }
          shape.SetAsBox(3.0, 4.0);
          bd.position.Set(0.0, 4.0);
          this.m_world.CreateBody(bd).CreateFixture(fd);
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new TestRagdoll();
      }
  }
  RegisterTest("Extras", "Ragdoll", TestRagdoll.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class TestStack extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const vertices = [];
              vertices[0] = new b2__namespace.Vec2(-30.0, 40.0);
              vertices[1] = new b2__namespace.Vec2(30.0, 40.0);
              vertices[2] = new b2__namespace.Vec2(30.0, 0.0);
              vertices[3] = new b2__namespace.Vec2(-30.0, 0.0);
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(vertices);
              ground.CreateFixture(shape, 0.0);
          }
          // Add bodies
          const bd = new b2__namespace.BodyDef();
          const fd = new b2__namespace.FixtureDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          //bd.isBullet = true;
          const polygon = new b2__namespace.PolygonShape();
          fd.shape = polygon;
          fd.density = 1.0;
          fd.friction = 0.5;
          fd.restitution = 0.1;
          polygon.SetAsBox(1.0, 1.0);
          // Create 3 stacks
          for (let i = 0; i < 10; ++i) {
              bd.position.Set((0.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
              this.m_world.CreateBody(bd).CreateFixture(fd);
          }
          for (let i = 0; i < 10; ++i) {
              bd.position.Set((10.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
              this.m_world.CreateBody(bd).CreateFixture(fd);
          }
          for (let i = 0; i < 10; ++i) {
              bd.position.Set((20.0 + Math.random() * 0.2 - 0.1), (30.0 - i * 2.5));
              this.m_world.CreateBody(bd).CreateFixture(fd);
          }
          // Create ramp
          bd.type = b2__namespace.BodyType.b2_staticBody;
          bd.position.Set(0.0, 0.0);
          const vxs = [
              new b2__namespace.Vec2(-30.0, 0.0),
              new b2__namespace.Vec2(-10.0, 0.0),
              new b2__namespace.Vec2(-30.0, 10.0),
          ];
          polygon.Set(vxs, vxs.length);
          fd.density = 0;
          this.m_world.CreateBody(bd).CreateFixture(fd);
          // Create ball
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Set(-25.0, 20.0);
          fd.shape = new b2__namespace.CircleShape(4.0);
          fd.density = 2;
          fd.restitution = 0.2;
          fd.friction = 0.5;
          this.m_world.CreateBody(bd).CreateFixture(fd);
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new TestStack();
      }
  }
  RegisterTest("Extras", "Test Stack", TestStack.Create);

  /*
   * Author: Chris Campbell - www.iforce2d.net
   *
   * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  const DEGTORAD = 0.0174532925199432957;
  // const RADTODEG = 57.295779513082320876;
  const TDC_LEFT = 0x1;
  const TDC_RIGHT = 0x2;
  const TDC_UP = 0x4;
  const TDC_DOWN = 0x8;
  /**
   * types of fixture user data
   */
  const FUD_CAR_TIRE = 0;
  const FUD_GROUND_AREA = 1;
  /**
   * a class to allow subclassing of different fixture user data
   */
  class FixtureUserData {
      constructor(type) {
          this.m_type = type;
      }
      getType() {
          return this.m_type;
      }
  }
  /**
   * class to allow marking a fixture as a car tire
   */
  class CarTireFUD extends FixtureUserData {
      constructor() {
          super(FUD_CAR_TIRE);
      }
  }
  // /**
  //  * class to allow marking a fixture as a ground area
  //  */
  class GroundAreaFUD extends FixtureUserData {
      constructor(fm, ooc) {
          super(FUD_GROUND_AREA);
          this.frictionModifier = fm;
          this.outOfCourse = ooc;
      }
  }
  class TDTire {
      constructor(world) {
          this.m_groundAreas = [];
          this.m_currentTraction = 1;
          this.m_maxForwardSpeed = 0;
          this.m_maxBackwardSpeed = 0;
          this.m_maxDriveForce = 0;
          this.m_maxLateralImpulse = 0;
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          this.m_body = world.CreateBody(bodyDef);
          const polygonShape = new b2__namespace.PolygonShape();
          polygonShape.SetAsBox(0.5, 1.25);
          const fixture = this.m_body.CreateFixture(polygonShape, 1); //shape, density
          fixture.SetUserData(new CarTireFUD());
          this.m_body.SetUserData(this);
      }
      setCharacteristics(maxForwardSpeed, maxBackwardSpeed, maxDriveForce, maxLateralImpulse) {
          this.m_maxForwardSpeed = maxForwardSpeed;
          this.m_maxBackwardSpeed = maxBackwardSpeed;
          this.m_maxDriveForce = maxDriveForce;
          this.m_maxLateralImpulse = maxLateralImpulse;
      }
      addGroundArea(ga) {
          this.m_groundAreas.push(ga);
          this.updateTraction();
      }
      removeGroundArea(ga) {
          this.m_groundAreas.splice(this.m_groundAreas.indexOf(ga));
          this.updateTraction();
      }
      updateTraction() {
          if (this.m_groundAreas.length === 0) {
              this.m_currentTraction = 1;
          }
          else {
              //find area with highest traction
              this.m_currentTraction = 0;
              this.m_groundAreas.forEach((ga) => {
                  if (ga.frictionModifier > this.m_currentTraction) {
                      this.m_currentTraction = ga.frictionModifier;
                  }
              });
          }
      }
      getLateralVelocity() {
          const currentRightNormal = this.m_body.GetWorldVector(new b2__namespace.Vec2(1, 0), new b2__namespace.Vec2());
          return currentRightNormal.SelfMul(b2__namespace.Vec2.DotVV(currentRightNormal, this.m_body.GetLinearVelocity()));
      }
      getForwardVelocity() {
          const currentForwardNormal = this.m_body.GetWorldVector(new b2__namespace.Vec2(0, 1), new b2__namespace.Vec2());
          return currentForwardNormal.SelfMul(b2__namespace.Vec2.DotVV(currentForwardNormal, this.m_body.GetLinearVelocity()));
      }
      updateFriction() {
          //lateral linear velocity
          const impulse = this.getLateralVelocity().SelfMul(-1.0 * this.m_body.GetMass());
          if (impulse.Length() > this.m_maxLateralImpulse) {
              impulse.SelfMul(this.m_maxLateralImpulse / impulse.Length());
          }
          this.m_body.ApplyLinearImpulse(impulse.SelfMul(this.m_currentTraction), this.m_body.GetWorldCenter());
          //angular velocity
          this.m_body.ApplyAngularImpulse(this.m_currentTraction * 0.1 * this.m_body.GetInertia() * -this.m_body.GetAngularVelocity());
          //forward linear velocity
          const currentForwardNormal = this.getForwardVelocity();
          const currentForwardSpeed = currentForwardNormal.Normalize();
          const dragForceMagnitude = -2 * currentForwardSpeed;
          this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * dragForceMagnitude), this.m_body.GetWorldCenter());
      }
      updateDrive(controlState) {
          //find desired speed
          let desiredSpeed = 0;
          switch (controlState & (TDC_UP | TDC_DOWN)) {
              case TDC_UP:
                  desiredSpeed = this.m_maxForwardSpeed;
                  break;
              case TDC_DOWN:
                  desiredSpeed = this.m_maxBackwardSpeed;
                  break;
              default:
                  return; //do nothing
          }
          //find current speed in forward direction
          const currentForwardNormal = this.m_body.GetWorldVector(new b2__namespace.Vec2(0, 1), new b2__namespace.Vec2());
          const currentSpeed = b2__namespace.Vec2.DotVV(this.getForwardVelocity(), currentForwardNormal);
          //apply necessary force
          let force = 0;
          if (desiredSpeed > currentSpeed) {
              force = this.m_maxDriveForce;
          }
          else if (desiredSpeed < currentSpeed) {
              force = -this.m_maxDriveForce;
          }
          else {
              return;
          }
          this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * force), this.m_body.GetWorldCenter());
      }
      updateTurn(controlState) {
          let desiredTorque = 0;
          switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
              case TDC_LEFT:
                  desiredTorque = 15;
                  break;
              case TDC_RIGHT:
                  desiredTorque = -15;
                  break;
              //nothing
          }
          this.m_body.ApplyTorque(desiredTorque);
      }
  }
  class TDCar {
      constructor(world) {
          this.m_tires = [];
          //create car body
          const bodyDef = new b2__namespace.BodyDef();
          bodyDef.type = b2__namespace.BodyType.b2_dynamicBody;
          this.m_body = world.CreateBody(bodyDef);
          this.m_body.SetAngularDamping(3);
          const vertices = [];
          vertices[0] = new b2__namespace.Vec2(1.5, 0);
          vertices[1] = new b2__namespace.Vec2(3, 2.5);
          vertices[2] = new b2__namespace.Vec2(2.8, 5.5);
          vertices[3] = new b2__namespace.Vec2(1, 10);
          vertices[4] = new b2__namespace.Vec2(-1, 10);
          vertices[5] = new b2__namespace.Vec2(-2.8, 5.5);
          vertices[6] = new b2__namespace.Vec2(-3, 2.5);
          vertices[7] = new b2__namespace.Vec2(-1.5, 0);
          const polygonShape = new b2__namespace.PolygonShape();
          polygonShape.Set(vertices, 8);
          this.m_body.CreateFixture(polygonShape, 0.1); //shape, density
          //prepare common joint parameters
          const jointDef = new b2__namespace.RevoluteJointDef();
          jointDef.bodyA = this.m_body;
          jointDef.enableLimit = true;
          jointDef.lowerAngle = 0;
          jointDef.upperAngle = 0;
          jointDef.localAnchorB.SetZero(); //center of tire
          const maxForwardSpeed = 250;
          const maxBackwardSpeed = -40;
          const backTireMaxDriveForce = 300;
          const frontTireMaxDriveForce = 500;
          const backTireMaxLateralImpulse = 8.5;
          const frontTireMaxLateralImpulse = 7.5;
          //back left tire
          let tire = new TDTire(world);
          tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
          jointDef.bodyB = tire.m_body;
          jointDef.localAnchorA.Set(-3, 0.75);
          world.CreateJoint(jointDef);
          this.m_tires.push(tire);
          //back right tire
          tire = new TDTire(world);
          tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
          jointDef.bodyB = tire.m_body;
          jointDef.localAnchorA.Set(3, 0.75);
          world.CreateJoint(jointDef);
          this.m_tires.push(tire);
          //front left tire
          tire = new TDTire(world);
          tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
          jointDef.bodyB = tire.m_body;
          jointDef.localAnchorA.Set(-3, 8.5);
          this.flJoint = world.CreateJoint(jointDef);
          this.m_tires.push(tire);
          //front right tire
          tire = new TDTire(world);
          tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
          jointDef.bodyB = tire.m_body;
          jointDef.localAnchorA.Set(3, 8.5);
          this.frJoint = world.CreateJoint(jointDef);
          this.m_tires.push(tire);
      }
      update(controlState) {
          this.m_tires.forEach((tire) => {
              tire.updateFriction();
          });
          this.m_tires.forEach((tire) => {
              tire.updateDrive(controlState);
          });
          //control steering
          const lockAngle = 35 * DEGTORAD;
          const turnSpeedPerSec = 160 * DEGTORAD; //from lock to lock in 0.5 sec
          const turnPerTimeStep = turnSpeedPerSec / 60.0;
          let desiredAngle = 0;
          switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
              case TDC_LEFT:
                  desiredAngle = lockAngle;
                  break;
              case TDC_RIGHT:
                  desiredAngle = -lockAngle;
                  break;
              //nothing
          }
          const angleNow = this.flJoint.GetJointAngle();
          let angleToTurn = desiredAngle - angleNow;
          angleToTurn = b2__namespace.Clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep);
          const newAngle = angleNow + angleToTurn;
          this.flJoint.SetLimits(newAngle, newAngle);
          this.frJoint.SetLimits(newAngle, newAngle);
      }
  }
  class TopdownCar extends Test {
      constructor() {
          super();
          //this.m_destructionListener = new MyDestructionListener(this);
          this.m_world.SetGravity(new b2__namespace.Vec2(0.0, 0.0));
          this.m_world.SetDestructionListener(this.m_destructionListener);
          //set up ground areas
          {
              const bodyDef = new b2__namespace.BodyDef();
              this.m_groundBody = this.m_world.CreateBody(bodyDef);
              const polygonShape = new b2__namespace.PolygonShape();
              const fixtureDef = new b2__namespace.FixtureDef();
              fixtureDef.shape = polygonShape;
              fixtureDef.isSensor = true;
              polygonShape.SetAsBox(9, 7, new b2__namespace.Vec2(-10, 15), 20 * DEGTORAD);
              let groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
              groundAreaFixture.SetUserData(new GroundAreaFUD(0.5, false));
              polygonShape.SetAsBox(9, 5, new b2__namespace.Vec2(5, 20), -40 * DEGTORAD);
              groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
              groundAreaFixture.SetUserData(new GroundAreaFUD(0.2, false));
          }
          //this.m_tire = new TDTire(this.m_world);
          //this.m_tire.setCharacteristics(100, -20, 150);
          this.m_car = new TDCar(this.m_world);
          this.m_controlState = 0;
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.m_controlState |= TDC_LEFT;
                  break;
              case "d":
                  this.m_controlState |= TDC_RIGHT;
                  break;
              case "w":
                  this.m_controlState |= TDC_UP;
                  break;
              case "s":
                  this.m_controlState |= TDC_DOWN;
                  break;
              default:
                  super.Keyboard(key);
          }
      }
      KeyboardUp(key) {
          switch (key) {
              case "a":
                  this.m_controlState &= ~TDC_LEFT;
                  break;
              case "d":
                  this.m_controlState &= ~TDC_RIGHT;
                  break;
              case "w":
                  this.m_controlState &= ~TDC_UP;
                  break;
              case "s":
                  this.m_controlState &= ~TDC_DOWN;
                  break;
              default:
                  super.KeyboardUp(key);
          }
      }
      static handleContact(contact, began) {
          const a = contact.GetFixtureA();
          const b = contact.GetFixtureB();
          const fudA = a.GetUserData();
          const fudB = b.GetUserData();
          if (!fudA || !fudB) {
              return;
          }
          if (fudA.getType() === FUD_CAR_TIRE || fudB.getType() === FUD_GROUND_AREA) {
              TopdownCar.tire_vs_groundArea(a, b, began);
          }
          else if (fudA.getType() === FUD_GROUND_AREA || fudB.getType() === FUD_CAR_TIRE) {
              TopdownCar.tire_vs_groundArea(b, a, began);
          }
      }
      BeginContact(contact) {
          TopdownCar.handleContact(contact, true);
      }
      EndContact(contact) {
          TopdownCar.handleContact(contact, false);
      }
      static tire_vs_groundArea(tireFixture, groundAreaFixture, began) {
          const tire = tireFixture.GetBody().GetUserData();
          const gaFud = groundAreaFixture.GetUserData();
          if (began) {
              tire.addGroundArea(gaFud);
          }
          else {
              tire.removeGroundArea(gaFud);
          }
      }
      Step(settings) {
          /*this.m_tire.updateFriction();
          this.m_tire.updateDrive(this.m_controlState);
          this.m_tire.updateTurn(this.m_controlState);*/
          this.m_car.update(this.m_controlState);
          super.Step(settings);
          //show some useful info
          g_debugDraw.DrawString(5, this.m_textLine, "Press w/a/s/d to control the car");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          //testbed.g_debugDraw.DrawString(5, this.m_textLine, "Tire traction: %.2f", this.m_tire.m_currentTraction);
          //this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
      }
      static Create() {
          return new TopdownCar();
      }
  }
  RegisterTest("Extras", "Topdown Car", TopdownCar.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class Segway extends Test {
      constructor() {
          super();
          this.targetPosition = 10;
          this.targetPositionInterval = 0;
          this.posAvg = 0;
          this.angleController = new PIDController();
          this.positionController = new PIDController();
          this.m_world.SetGravity({ x: 0, y: -30 });
          this.angleController.gainP = 1000;
          this.angleController.gainI = 0;
          this.angleController.gainD = 250;
          this.positionController.gainP = 0.5;
          this.positionController.gainI = 0;
          this.positionController.gainD = 1.5;
          const bd = new b2__namespace.BodyDef();
          const fd = new b2__namespace.FixtureDef();
          // pendulumBody = new p2.Body({
          //     mass: 1,
          //     position: [0, 2 + 0.5 * PENDULUM_LENGTH]
          // });
          // pendulumBody.addShape(new p2.Box({ width: 1, height: PENDULUM_LENGTH }));
          // world.addBody(pendulumBody);
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.x = 0;
          bd.position.y = 2 + 0.5 * Segway.PENDULUM_LENGTH;
          this.pendulumBody = this.m_world.CreateBody(bd);
          const pendulumShape = new b2__namespace.PolygonShape();
          pendulumShape.SetAsBox(0.5, 0.5 * Segway.PENDULUM_LENGTH);
          fd.shape = pendulumShape;
          fd.density = 1 / (1 * Segway.PENDULUM_LENGTH); // TODO: specify mass
          // fd.mass = 1;
          this.pendulumBody.CreateFixture(fd);
          // wheelBody = new p2.Body({
          //     mass: 1,
          //     position: [0,1]
          // });
          // wheelBody.addShape(new p2.Circle({ radius: 0.6 }));
          // world.addBody(wheelBody);
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.x = 0;
          bd.position.y = 1;
          this.wheelBody = this.m_world.CreateBody(bd);
          const wheelShape = new b2__namespace.CircleShape();
          wheelShape.m_radius = 0.6;
          fd.shape = wheelShape;
          fd.density = 1 / (Math.PI * 0.6 * 0.6); // TODO: specify mass
          // fd.mass = 1;
          fd.friction = 10;
          this.wheelBody.CreateFixture(fd);
          // var wheelJoint = new p2.RevoluteConstraint(wheelBody, pendulumBody, {
          //     localPivotA: [0, 0],
          //     localPivotB: [0, -0.5 * PENDULUM_LENGTH],
          //     collideConnected: false
          // });
          // world.addConstraint(wheelJoint);
          // wheelJoint.motorEnabled = true;
          // var m = 40;
          // wheelJoint.motorEquation.maxForce = m;
          // wheelJoint.motorEquation.minForce = -m;
          const jd = new b2__namespace.RevoluteJointDef();
          jd.Initialize(this.wheelBody, this.pendulumBody, { x: 0, y: 0 });
          jd.localAnchorA.Set(0, 0);
          jd.localAnchorB.Set(0, -0.5 * Segway.PENDULUM_LENGTH);
          jd.collideConnected = false;
          jd.enableMotor = true;
          jd.maxMotorTorque = 40;
          this.wheelJoint = this.m_world.CreateJoint(jd);
          // Create ground
          // var groundShape = new p2.Plane();
          // var groundBody = new p2.Body({
          //     position:[0,0],
          // });
          // groundBody.addShape(groundShape);
          // world.addBody(groundBody);
          bd.type = b2__namespace.BodyType.b2_staticBody;
          bd.position.x = 0;
          bd.position.y = 0;
          this.groundBody = this.m_world.CreateBody(bd);
          const groundShape = new b2__namespace.EdgeShape();
          groundShape.SetTwoSided({ x: -100, y: 0 }, { x: 100, y: 0 });
          fd.shape = groundShape;
          fd.friction = 10;
          this.groundBody.CreateFixture(fd);
      }
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          this.targetPositionInterval += dt;
          if (this.targetPositionInterval >= 8) {
              this.targetPositionInterval = 0;
              this.targetPosition = this.targetPosition === 10 ? -10 : 10;
          }
          let targetAngle = 0;
          {
              const alpha = 0.4;
              // posAvg = (1 - alpha) * posAvg + alpha * pendulumBody.position[0];
              this.posAvg = (1 - alpha) * this.posAvg + alpha * this.pendulumBody.GetPosition().x;
              this.positionController.currentError = this.targetPosition - this.posAvg;
              // positionController.step(world.lastTimeStep);
              this.positionController.step(dt);
              let targetLinAccel = this.positionController.output;
              // targetLinAccel = clamp(targetLinAccel, -10.0, 10.0);
              targetLinAccel = b2__namespace.Clamp(targetLinAccel, -10, 10);
              // targetAngle = targetLinAccel / world.gravity[1];
              targetAngle = targetLinAccel / this.m_world.GetGravity().y;
              // targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
              targetAngle = b2__namespace.Clamp(targetAngle, b2__namespace.DegToRad(-15), b2__namespace.DegToRad(15));
          }
          // var currentAngle = pendulumBody.angle;
          let currentAngle = this.pendulumBody.GetAngle();
          currentAngle = normalizeAngle(currentAngle);
          this.angleController.currentError = targetAngle - currentAngle;
          // angleController.step(world.lastTimeStep);
          this.angleController.step(dt);
          let targetSpeed = this.angleController.output;
          // give up if speed required is really high
          if (Math.abs(targetSpeed) > 1000) {
              targetSpeed = 0;
          }
          // this is the only output
          // var targetAngularVelocity = -targetSpeed / (2 * Math.PI * wheelBody.shapes[0].radius); // wheel circumference = 2*pi*r
          const targetAngularVelocity = targetSpeed / (2 * Math.PI * 0.6); // wheel circumference = 2*pi*r
          // wheelJoint.motorSpeed = targetAngularVelocity;
          this.wheelJoint.SetMotorSpeed(targetAngularVelocity);
      }
      static Create() {
          return new Segway();
      }
  }
  Segway.PENDULUM_LENGTH = 10;
  /*
    Simple PID controller for single float variable
    http://en.wikipedia.org/wiki/PID_controller#Pseudocode
  */
  class PIDController {
      constructor() {
          this.gainP = 1;
          this.gainI = 1;
          this.gainD = 1;
          this.currentError = 0;
          this.previousError = 0;
          this.integral = 0;
          this.output = 0;
      }
      step(dt) {
          this.integral = dt * (this.integral + this.currentError);
          const derivative = (1 / dt) * (this.currentError - this.previousError);
          this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
          this.previousError = this.currentError;
      }
  }
  // var DEGTORAD = 0.0174532925199432957;
  // var RADTODEG = 57.295779513082320876;
  // var PENDULUM_LENGTH = 10;
  // var targetPosition = 0;
  // var targetPositionInterval = setInterval(changeTargetPos, 8000);
  // function changeTargetPos(){
  //     targetPosition = targetPosition===0 ? 10 : 0;
  // }
  // changeTargetPos();
  // var posAvg = 0;
  // var angleController = new PIDController();
  // angleController.gainP = 1000;
  // angleController.gainI = 0;
  // angleController.gainD = 250;
  // var positionController = new PIDController();
  // positionController.gainP = 0.5;
  // positionController.gainI = 0;
  // positionController.gainD = 1.5;
  // // Create demo application
  // var app = new p2.WebGLRenderer(function(){
  //     var world = new p2.World({
  //         gravity : [0,-30]
  //     });
  //     this.setWorld(world);
  //     world.defaultContactMaterial.friction = 10;
  //     pendulumBody = new p2.Body({
  //         mass: 1,
  //         position: [0, 2 + 0.5 * PENDULUM_LENGTH]
  //     });
  //     pendulumBody.addShape(new p2.Box({ width: 1, height: PENDULUM_LENGTH }));
  //     world.addBody(pendulumBody);
  //     wheelBody = new p2.Body({
  //         mass: 1,
  //         position: [0,1]
  //     });
  //     wheelBody.addShape(new p2.Circle({ radius: 0.6 }));
  //     world.addBody(wheelBody);
  //     var wheelJoint = new p2.RevoluteConstraint(wheelBody, pendulumBody, {
  //         localPivotA: [0, 0],
  //         localPivotB: [0, -0.5 * PENDULUM_LENGTH],
  //         collideConnected: false
  //     });
  //     world.addConstraint(wheelJoint);
  //     wheelJoint.motorEnabled = true;
  //     var m = 40;
  //     wheelJoint.motorEquation.maxForce = m;
  //     wheelJoint.motorEquation.minForce = -m;
  //     // Create ground
  //     var groundShape = new p2.Plane();
  //     var groundBody = new p2.Body({
  //         position:[0,0],
  //     });
  //     groundBody.addShape(groundShape);
  //     world.addBody(groundBody);
  //     world.on('postStep', function(){
  //         var targetAngle = 0;
  //         if ( true ) {
  //             var alpha = 0.4;
  //             posAvg = (1 - alpha) * posAvg + alpha * pendulumBody.position[0];
  //             positionController.currentError = targetPosition - posAvg;
  //             positionController.step(world.lastTimeStep);
  //             var targetLinAccel = positionController.output;
  //             targetLinAccel = clamp(targetLinAccel, -10.0, 10.0);
  //             targetAngle = targetLinAccel / world.gravity[1];
  //             targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
  //         }
  //         var currentAngle = pendulumBody.angle;
  //         currentAngle = normalizeAngle(currentAngle);
  //         angleController.currentError = ( targetAngle - currentAngle );
  //         angleController.step(world.lastTimeStep);
  //         var targetSpeed = angleController.output;
  //         // give up if speed required is really high
  //         if ( Math.abs(targetSpeed) > 1000 )
  //             targetSpeed = 0;
  //         // this is the only output
  //         var targetAngularVelocity = -targetSpeed / (2 * Math.PI * wheelBody.shapes[0].radius); // wheel circumference = 2*pi*r
  //         wheelJoint.motorSpeed = targetAngularVelocity;
  //     });
  //     app.frame(3,5,16,16);
  // });
  // /*
  //     Simple PID controller for single float variable
  //     http://en.wikipedia.org/wiki/PID_controller#Pseudocode
  // */
  // function PIDController(){
  //     this.gainP = 1;
  //     this.gainI = 1;
  //     this.gainD = 1;
  //     this.currentError = 0;
  //     this.previousError = 0;
  //     this.integral = 0;
  //     this.output = 0;
  // }
  // PIDController.prototype.step = function(dt) {
  //     this.integral = dt * (this.integral + this.currentError);
  //     var derivative = (1 / dt) * (this.currentError - this.previousError);
  //     this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
  //     this.previousError = this.currentError;
  // };
  // function clamp(num, min, max) {
  //     return Math.min(Math.max(num, min), max);
  // };
  function normalizeAngle(angle) {
      while (angle > b2__namespace.DegToRad(180)) {
          angle -= b2__namespace.DegToRad(360);
      }
      while (angle < b2__namespace.DegToRad(-180)) {
          angle += b2__namespace.DegToRad(360);
      }
      return angle;
  }
  RegisterTest("Extras", "Segway", Segway.Create);

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class BuoyancyTest extends Test {
      constructor() {
          super();
          this.m_bodies = new Array();
          const bc = new b2__namespace.BuoyancyController();
          this.m_controller = bc;
          bc.normal.Set(0.0, 1.0);
          bc.offset = 20.0;
          bc.density = 2.0;
          bc.linearDrag = 5.0;
          bc.angularDrag = 2.0;
          const ground = this.m_world.CreateBody(new b2__namespace.BodyDef());
          {
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(-40.0, 25.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(40.0, 0.0), new b2__namespace.Vec2(40.0, 25.0));
              ground.CreateFixture(shape, 0.0);
          }
          // Spawn in a bunch of crap
          {
              for (let i = 0; i < 5; i++) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  //bd.isBullet = true;
                  bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                  bd.angle = Math.random() * Math.PI;
                  const body = this.m_world.CreateBody(bd);
                  const fd = new b2__namespace.FixtureDef();
                  fd.density = 1.0;
                  // Override the default friction.
                  fd.friction = 0.3;
                  fd.restitution = 0.1;
                  const polygon = new b2__namespace.PolygonShape();
                  fd.shape = polygon;
                  polygon.SetAsBox(Math.random() * 0.5 + 1.0, Math.random() * 0.5 + 1.0);
                  body.CreateFixture(fd);
                  this.m_bodies.push(body);
              }
          }
          {
              for (let i = 0; i < 5; i++) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  //bd.isBullet = true;
                  bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                  bd.angle = Math.random() * Math.PI;
                  const body = this.m_world.CreateBody(bd);
                  const fd = new b2__namespace.FixtureDef();
                  fd.density = 1.0;
                  // Override the default friction.
                  fd.friction = 0.3;
                  fd.restitution = 0.1;
                  fd.shape = new b2__namespace.CircleShape(Math.random() * 0.5 + 1.0);
                  body.CreateFixture(fd);
                  this.m_bodies.push(body);
              }
          }
          {
              for (let i = 0; i < 15; i++) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  //bd.isBullet = true;
                  bd.position.Set(Math.random() * 40.0 - 20.0, Math.random() * 15.0 + 5.0);
                  bd.angle = Math.random() * Math.PI;
                  const body = this.m_world.CreateBody(bd);
                  const fd = new b2__namespace.FixtureDef();
                  fd.density = 1.0;
                  fd.friction = 0.3;
                  fd.restitution = 0.1;
                  const polygon = new b2__namespace.PolygonShape();
                  fd.shape = polygon;
                  if (Math.random() > 0.66) {
                      polygon.Set([
                          new b2__namespace.Vec2(-1.0 - Math.random() * 1.0, 1.0 + Math.random() * 1.0),
                          new b2__namespace.Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                          new b2__namespace.Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                          new b2__namespace.Vec2(1.0 + Math.random() * 1.0, 1.0 + Math.random() * 1.0),
                      ]);
                  }
                  else if (Math.random() > 0.5) {
                      const array = [];
                      array[0] = new b2__namespace.Vec2(0.0, 1.0 + Math.random() * 1.0);
                      array[2] = new b2__namespace.Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0);
                      array[3] = new b2__namespace.Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0);
                      array[1] = new b2__namespace.Vec2((array[0].x + array[2].x), (array[0].y + array[2].y));
                      array[1].SelfMul(Math.random() / 2 + 0.8);
                      array[4] = new b2__namespace.Vec2((array[3].x + array[0].x), (array[3].y + array[0].y));
                      array[4].SelfMul(Math.random() / 2 + 0.8);
                      polygon.Set(array);
                  }
                  else {
                      polygon.Set([
                          new b2__namespace.Vec2(0.0, 1.0 + Math.random() * 1.0),
                          new b2__namespace.Vec2(-0.5 - Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                          new b2__namespace.Vec2(0.5 + Math.random() * 1.0, -1.0 - Math.random() * 1.0),
                      ]);
                  }
                  body.CreateFixture(fd);
                  this.m_bodies.push(body);
              }
          }
          //Add some exciting bath toys
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 40.0);
              bd.angle = 0;
              const body = this.m_world.CreateBody(bd);
              const fd = new b2__namespace.FixtureDef();
              fd.density = 3.0;
              const polygon = new b2__namespace.PolygonShape();
              fd.shape = polygon;
              polygon.SetAsBox(4.0, 1.0);
              body.CreateFixture(fd);
              this.m_bodies.push(body);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.position.Set(0.0, 30.0);
              const body = this.m_world.CreateBody(bd);
              const fd = new b2__namespace.FixtureDef();
              fd.density = 2.0;
              const circle = new b2__namespace.CircleShape(0.7);
              fd.shape = circle;
              circle.m_p.Set(3.0, 0.0);
              body.CreateFixture(fd);
              circle.m_p.Set(-3.0, 0.0);
              body.CreateFixture(fd);
              circle.m_p.Set(0.0, 3.0);
              body.CreateFixture(fd);
              circle.m_p.Set(0.0, -3.0);
              body.CreateFixture(fd);
              fd.density = 2.0;
              const polygon = new b2__namespace.PolygonShape();
              fd.shape = polygon;
              polygon.SetAsBox(3.0, 0.2);
              body.CreateFixture(fd);
              polygon.SetAsBox(0.2, 3.0);
              body.CreateFixture(fd);
              this.m_bodies.push(body);
          }
          // if (b2.DEBUG) {
          //   for (let body_i = 0; i < this.m_bodies.length; ++i)
          //     this.m_controller.AddBody(this.m_bodies[body_i]);
          //   for (let body_i = 0; i < this.m_bodies.length; ++i)
          //     this.m_controller.RemoveBody(this.m_bodies[body_i]);
          // }
          for (let body_i = 0; body_i < this.m_bodies.length; ++body_i) {
              this.m_controller.AddBody(this.m_bodies[body_i]);
          }
          // if (b2.DEBUG) {
          //   this.m_world.AddController(this.m_controller);
          //   this.m_world.RemoveController(this.m_controller);
          // }
          this.m_world.AddController(this.m_controller);
      }
      Step(settings) {
          super.Step(settings);
      }
      static Create() {
          return new BuoyancyTest();
      }
  }
  RegisterTest("Extras", "Buoyancy Test", BuoyancyTest.Create);

  /*
   * Copyright (c) 2014 Google, Inc.
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
  /**
   * Test the behavior of particles falling onto a concave
   * ambiguous Body contact fixture junction.
   */
  class AntiPointy extends Test {
      constructor() {
          super();
          this.m_particlesToCreate = 300;
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              // Construct a valley out of many polygons to ensure there's no
              // issue with particles falling directly on an ambiguous set of
              // fixture corners.
              const step = 1.0;
              for (let i = -10.0; i < 10.0; i += step) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(i, -10.0),
                      new b2__namespace.Vec2(i + step, -10.0),
                      new b2__namespace.Vec2(0.0, 15.0),
                  ];
                  shape.Set(vertices, 3);
                  ground.CreateFixture(shape, 0.0);
              }
              for (let i = -10.0; i < 35.0; i += step) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-10.0, i),
                      new b2__namespace.Vec2(-10.0, i + step),
                      new b2__namespace.Vec2(0.0, 15.0),
                  ];
                  shape.Set(vertices, 3);
                  ground.CreateFixture(shape, 0.0);
                  const vertices2 = [
                      new b2__namespace.Vec2(10.0, i),
                      new b2__namespace.Vec2(10.0, i + step),
                      new b2__namespace.Vec2(0.0, 15.0),
                  ];
                  shape.Set(vertices2, 3);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          // Cap the number of generated particles or we'll fill forever
          this.m_particlesToCreate = 300;
          this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
          const particleType = Test.GetParticleParameterValue();
          if (particleType === b2__namespace.ParticleFlag.b2_waterParticle) {
              this.m_particleSystem.SetDamping(0.2);
          }
      }
      Step(settings) {
          super.Step(settings);
          if (this.m_particlesToCreate <= 0) {
              return;
          }
          --this.m_particlesToCreate;
          const flags = Test.GetParticleParameterValue();
          const pd = new b2__namespace.ParticleDef();
          pd.position.Set(0.0, 40.0);
          pd.velocity.Set(0.0, -1.0);
          pd.flags = flags;
          if (flags & (b2__namespace.ParticleFlag.b2_springParticle | b2__namespace.ParticleFlag.b2_elasticParticle)) {
              const count = this.m_particleSystem.GetParticleCount();
              pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
              pd.flags |= b2__namespace.ParticleFlag.b2_reactiveParticle;
          }
          this.m_particleSystem.CreateParticle(pd);
      }
      static Create() {
          return new AntiPointy();
      }
  }
  RegisterTest("Particles", "AntiPointy", AntiPointy.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class CornerCase extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              // Construct a pathological corner intersection out of many
              // polygons to ensure there's no issue with particle oscillation
              // from many fixture contact impulses at the corner
              // left edge
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-20.0, 30.0),
                      new b2__namespace.Vec2(-20.0, 0.0),
                      new b2__namespace.Vec2(-25.0, 0.0),
                      new b2__namespace.Vec2(-25.0, 30.0),
                  ];
                  shape.Set(vertices);
                  ground.CreateFixture(shape, 0.0);
              }
              const yrange = 30.0, ystep = yrange / 10.0, xrange = 20.0, xstep = xrange / 2.0;
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-25.0, 0.0),
                      new b2__namespace.Vec2(20.0, 15.0),
                      new b2__namespace.Vec2(25.0, 0.0),
                  ];
                  shape.Set(vertices);
                  ground.CreateFixture(shape, 0.0);
              }
              for (let x = -xrange; x < xrange; x += xstep) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-25.0, 0.0),
                      new b2__namespace.Vec2(x, 15.0),
                      new b2__namespace.Vec2(x + xstep, 15.0),
                  ];
                  shape.Set(vertices);
                  ground.CreateFixture(shape, 0.0);
              }
              for (let y = 0.0; y < yrange; y += ystep) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(25.0, y),
                      new b2__namespace.Vec2(25.0, y + ystep),
                      new b2__namespace.Vec2(20.0, 15.0),
                  ];
                  shape.Set(vertices);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(1.0);
          const particleType = Test.GetParticleParameterValue();
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 35);
              shape.m_radius = 12;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = particleType;
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
      }
      static Create() {
          return new CornerCase();
      }
  }
  RegisterTest("Particles", "Corner Case", CornerCase.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class DamBreak extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.ChainShape();
              const vertices = [
                  new b2__namespace.Vec2(-2, 0),
                  new b2__namespace.Vec2(2, 0),
                  new b2__namespace.Vec2(2, 4),
                  new b2__namespace.Vec2(-2, 4),
              ];
              shape.CreateLoop(vertices);
              ground.CreateFixture(shape, 0.0);
          }
          this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
          this.m_particleSystem.SetDamping(0.2);
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.8, 1.0, new b2__namespace.Vec2(-1.2, 1.01), 0);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = Test.GetParticleParameterValue();
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new DamBreak();
      }
  }
  RegisterTest("Particles", "Dam Break", DamBreak.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class DrawingParticles extends Test {
      constructor() {
          super();
          this.m_drawing = true;
          this.m_particleFlags = 0;
          this.m_groupFlags = 0;
          this.m_colorIndex = 0;
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -2),
                      new b2__namespace.Vec2(4, -2),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -2),
                      new b2__namespace.Vec2(-2, -2),
                      new b2__namespace.Vec2(-2, 6),
                      new b2__namespace.Vec2(-4, 6),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -2),
                      new b2__namespace.Vec2(4, -2),
                      new b2__namespace.Vec2(4, 6),
                      new b2__namespace.Vec2(2, 6),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, 4),
                      new b2__namespace.Vec2(4, 4),
                      new b2__namespace.Vec2(4, 6),
                      new b2__namespace.Vec2(-4, 6),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_colorIndex = 0;
          this.m_particleSystem.SetRadius(0.05 * 2);
          this.m_lastGroup = null;
          this.m_drawing = true;
          // DEBUG: b2.Assert((DrawingParticles.k_paramDef[0].CalculateValueMask() & DrawingParticles.Parameters.e_parameterBegin) === 0);
          Test.SetParticleParameters(DrawingParticles.k_paramDef, DrawingParticles.k_paramDefCount);
          Test.SetRestartOnParticleParameterChange(false);
          this.m_particleFlags = Test.GetParticleParameterValue();
          this.m_groupFlags = 0;
      }
      // Determine the current particle parameter from the drawing state and
      // group flags.
      DetermineParticleParameter() {
          if (this.m_drawing) {
              if (this.m_groupFlags === (b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup)) {
                  return DrawingParticles.Parameters.e_parameterRigid;
              }
              if (this.m_groupFlags === b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup && this.m_particleFlags === b2__namespace.ParticleFlag.b2_barrierParticle) {
                  return DrawingParticles.Parameters.e_parameterRigidBarrier;
              }
              if (this.m_particleFlags === (b2__namespace.ParticleFlag.b2_elasticParticle | b2__namespace.ParticleFlag.b2_barrierParticle)) {
                  return DrawingParticles.Parameters.e_parameterElasticBarrier;
              }
              if (this.m_particleFlags === (b2__namespace.ParticleFlag.b2_springParticle | b2__namespace.ParticleFlag.b2_barrierParticle)) {
                  return DrawingParticles.Parameters.e_parameterSpringBarrier;
              }
              if (this.m_particleFlags === (b2__namespace.ParticleFlag.b2_wallParticle | b2__namespace.ParticleFlag.b2_repulsiveParticle)) {
                  return DrawingParticles.Parameters.e_parameterRepulsive;
              }
              return this.m_particleFlags;
          }
          return DrawingParticles.Parameters.e_parameterMove;
      }
      Keyboard(key) {
          this.m_drawing = key !== "x";
          this.m_particleFlags = 0;
          this.m_groupFlags = 0;
          switch (key) {
              case "e":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_elasticParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "p":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_powderParticle;
                  break;
              case "r":
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "s":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_springParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "t":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_tensileParticle;
                  break;
              case "v":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_viscousParticle;
                  break;
              case "w":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_wallParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "b":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_wallParticle;
                  break;
              case "h":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup;
                  break;
              case "n":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_elasticParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "m":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_springParticle;
                  this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                  break;
              case "f":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_wallParticle | b2__namespace.ParticleFlag.b2_repulsiveParticle;
                  break;
              case "c":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_colorMixingParticle;
                  break;
              case "z":
                  this.m_particleFlags = b2__namespace.ParticleFlag.b2_zombieParticle;
                  break;
          }
          Test.SetParticleParameterValue(this.DetermineParticleParameter());
      }
      MouseMove(p) {
          super.MouseMove(p);
          if (this.m_drawing) {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Copy(p);
              shape.m_radius = 0.2;
              ///  b2Transform xf;
              ///  xf.SetIdentity();
              const xf = b2__namespace.Transform.IDENTITY;
              this.m_particleSystem.DestroyParticlesInShape(shape, xf);
              const joinGroup = this.m_lastGroup && this.m_groupFlags === this.m_lastGroup.GetGroupFlags();
              if (!joinGroup) {
                  this.m_colorIndex = (this.m_colorIndex + 1) % Test.k_ParticleColorsCount;
              }
              const pd = new b2__namespace.ParticleGroupDef();
              pd.shape = shape;
              pd.flags = this.m_particleFlags;
              if ((this.m_particleFlags & (b2__namespace.ParticleFlag.b2_wallParticle | b2__namespace.ParticleFlag.b2_springParticle | b2__namespace.ParticleFlag.b2_elasticParticle)) ||
                  (this.m_particleFlags === (b2__namespace.ParticleFlag.b2_wallParticle | b2__namespace.ParticleFlag.b2_barrierParticle))) {
                  pd.flags |= b2__namespace.ParticleFlag.b2_reactiveParticle;
              }
              pd.groupFlags = this.m_groupFlags;
              pd.color.Copy(Test.k_ParticleColors[this.m_colorIndex]);
              pd.group = this.m_lastGroup;
              this.m_lastGroup = this.m_particleSystem.CreateParticleGroup(pd);
              this.m_mouseTracing = false;
          }
      }
      MouseUp(p) {
          super.MouseUp(p);
          this.m_lastGroup = null;
      }
      ParticleGroupDestroyed(group) {
          super.ParticleGroupDestroyed(group);
          if (group === this.m_lastGroup) {
              this.m_lastGroup = null;
          }
      }
      SplitParticleGroups() {
          for (let group = this.m_particleSystem.GetParticleGroupList(); group; group = group.GetNext()) {
              if (group !== this.m_lastGroup &&
                  (group.GetGroupFlags() & b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup) &&
                  (group.GetAllParticleFlags() & b2__namespace.ParticleFlag.b2_zombieParticle)) {
                  // Split a rigid particle group which may be disconnected
                  // by destroying particles.
                  this.m_particleSystem.SplitParticleGroup(group);
              }
          }
      }
      Step(settings) {
          const parameterValue = Test.GetParticleParameterValue();
          this.m_drawing = (parameterValue & DrawingParticles.Parameters.e_parameterMove) !== DrawingParticles.Parameters.e_parameterMove;
          if (this.m_drawing) {
              switch (parameterValue) {
                  case b2__namespace.ParticleFlag.b2_elasticParticle:
                  case b2__namespace.ParticleFlag.b2_springParticle:
                  case b2__namespace.ParticleFlag.b2_wallParticle:
                      this.m_particleFlags = parameterValue;
                      this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                      break;
                  case DrawingParticles.Parameters.e_parameterRigid:
                      // b2_waterParticle is the default particle type in
                      // LiquidFun.
                      this.m_particleFlags = b2__namespace.ParticleFlag.b2_waterParticle;
                      this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                      break;
                  case DrawingParticles.Parameters.e_parameterRigidBarrier:
                      this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle;
                      this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup;
                      break;
                  case DrawingParticles.Parameters.e_parameterElasticBarrier:
                      this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_elasticParticle;
                      this.m_groupFlags = 0;
                      break;
                  case DrawingParticles.Parameters.e_parameterSpringBarrier:
                      this.m_particleFlags = b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_springParticle;
                      this.m_groupFlags = 0;
                      break;
                  case DrawingParticles.Parameters.e_parameterRepulsive:
                      this.m_particleFlags = b2__namespace.ParticleFlag.b2_repulsiveParticle | b2__namespace.ParticleFlag.b2_wallParticle;
                      this.m_groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
                      break;
                  default:
                      this.m_particleFlags = parameterValue;
                      this.m_groupFlags = 0;
                      break;
              }
          }
          if (this.m_particleSystem.GetAllParticleFlags() & b2__namespace.ParticleFlag.b2_zombieParticle) {
              this.SplitParticleGroups();
          }
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (L) liquid, (E) elastic, (S) spring");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "(R) rigid, (W) wall, (V) viscous, (T) tensile");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "(F) repulsive wall, (B) wall barrier");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "(H) rigid barrier, (N) elastic barrier, (M) spring barrier");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "(C) color mixing, (Z) erase, (X) move");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new DrawingParticles();
      }
  }
  /**
   * Set bit 31 to distiguish these values from particle flags.
   */
  DrawingParticles.Parameters = {
      e_parameterBegin: (1 << 31),
      e_parameterMove: (1 << 31) | (1 << 0),
      e_parameterRigid: (1 << 31) | (1 << 1),
      e_parameterRigidBarrier: (1 << 31) | (1 << 2),
      e_parameterElasticBarrier: (1 << 31) | (1 << 3),
      e_parameterSpringBarrier: (1 << 31) | (1 << 4),
      e_parameterRepulsive: (1 << 31) | (1 << 5),
  };
  DrawingParticles.k_paramValues = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_zombieParticle, ParticleParameter.k_DefaultOptions, "erase"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterMove, ParticleParameter.k_DefaultOptions, "move"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterRigid, ParticleParameter.k_DefaultOptions, "rigid"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterRigidBarrier, ParticleParameter.k_DefaultOptions, "rigid barrier"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterElasticBarrier, ParticleParameter.k_DefaultOptions, "elastic barrier"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterSpringBarrier, ParticleParameter.k_DefaultOptions, "spring barrier"),
      new ParticleParameterValue(DrawingParticles.Parameters.e_parameterRepulsive, ParticleParameter.k_DefaultOptions, "repulsive wall"),
  ];
  DrawingParticles.k_paramDef = [
      new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
      new ParticleParameterDefinition(DrawingParticles.k_paramValues),
  ];
  DrawingParticles.k_paramDefCount = DrawingParticles.k_paramDef.length;
  RegisterTest("Particles", "Drawing Particles", DrawingParticles.Create);
  // #endif

  /*
   * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class ElasticParticles extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -1),
                      new b2__namespace.Vec2(4, -1),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -0.1),
                      new b2__namespace.Vec2(-2, -0.1),
                      new b2__namespace.Vec2(-2, 2),
                      new b2__namespace.Vec2(-4, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -0.1),
                      new b2__namespace.Vec2(4, -0.1),
                      new b2__namespace.Vec2(4, 2),
                      new b2__namespace.Vec2(2, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 3);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_springParticle;
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.shape = shape;
              pd.color.Set(1, 0, 0, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(-1, 3);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_elasticParticle;
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.shape = shape;
              pd.color.Set(0, 1, 0, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(1, 0.5);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_elasticParticle;
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.position.Set(1, 4);
              pd.angle = -0.5;
              pd.angularVelocity = 2.0;
              pd.shape = shape;
              pd.color.Set(0, 0, 1, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 8);
              shape.m_radius = 0.5;
              body.CreateFixture(shape, 0.5);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new ElasticParticles();
      }
  }
  RegisterTest("Particles", "Elastic Particles", ElasticParticles.Create);
  // #endif

  // #if B2_ENABLE_PARTICLE
  class EyeCandy extends Test {
      constructor() {
          super();
          this.m_particleSystem.SetDamping(0.2);
          this.m_particleSystem.SetRadius(0.3 * 2);
          this.m_particleSystem.SetGravityScale(0.4);
          this.m_particleSystem.SetDensity(1.2);
          const bdg = new b2__namespace.BodyDef();
          const ground = this.m_world.CreateBody(bdg);
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_staticBody; //b2.BodyType.b2_dynamicBody;
          bd.allowSleep = false;
          bd.position.Set(0.0, 0.0);
          const body = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(0.5, 10.0, new b2__namespace.Vec2(20.0, 0.0), 0.0);
          body.CreateFixture(shape, 5.0);
          shape.SetAsBox(0.5, 10.0, new b2__namespace.Vec2(-20.0, 0.0), 0.0);
          body.CreateFixture(shape, 5.0);
          shape.SetAsBox(0.5, 20.0, new b2__namespace.Vec2(0.0, 10.0), Math.PI / 2.0);
          body.CreateFixture(shape, 5.0);
          shape.SetAsBox(0.5, 20.0, new b2__namespace.Vec2(0.0, -10.0), Math.PI / 2.0);
          body.CreateFixture(shape, 5.0);
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Set(0.0, 0.0);
          this.m_mover = this.m_world.CreateBody(bd);
          shape.SetAsBox(1.0, 5.0, new b2__namespace.Vec2(0.0, 2.0), 0.0);
          this.m_mover.CreateFixture(shape, 5.0);
          const jd = new b2__namespace.RevoluteJointDef();
          jd.bodyA = ground;
          jd.bodyB = this.m_mover;
          jd.localAnchorA.Set(0.0, 0.0);
          jd.localAnchorB.Set(0.0, 5.0);
          jd.referenceAngle = 0.0;
          jd.motorSpeed = 0;
          jd.maxMotorTorque = 1e7;
          jd.enableMotor = true;
          this.m_joint = this.m_world.CreateJoint(jd);
          const pd = new b2__namespace.ParticleGroupDef();
          pd.flags = b2__namespace.ParticleFlag.b2_waterParticle;
          const shape2 = new b2__namespace.PolygonShape();
          shape2.SetAsBox(9.0, 9.0, new b2__namespace.Vec2(0.0, 0.0), 0.0);
          pd.shape = shape2;
          this.m_particleSystem.CreateParticleGroup(pd);
      }
      Step(settings) {
          const time = new Date().getTime();
          this.m_joint.SetMotorSpeed(0.7 * Math.cos(time / 1000));
          super.Step(settings);
      }
      static Create() {
          return new EyeCandy();
      }
  }
  RegisterTest("Particles", "Eye Candy", EyeCandy.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class ParticleLifetimeRandomizer extends EmittedParticleCallback {
      constructor(minLifetime, maxLifetime) {
          super();
          this.m_minLifetime = 0.0;
          this.m_maxLifetime = 0.0;
          this.m_minLifetime = minLifetime;
          this.m_maxLifetime = maxLifetime;
      }
      /**
       * Called for each created particle.
       */
      ParticleCreated(system, particleIndex) {
          system.SetParticleLifetime(particleIndex, Math.random() * (this.m_maxLifetime - this.m_minLifetime) + this.m_minLifetime);
      }
  }
  /**
   * Faucet test creates a container from boxes and continually
   * spawning particles with finite lifetimes that pour into the
   * box.
   */
  class Faucet extends Test {
      constructor() {
          super(); // base class constructor
          /**
           * Used to cycle through particle colors.
           */
          this.m_particleColorOffset = 0.0;
          this.m_emitter = new RadialEmitter();
          this.m_lifetimeRandomizer = new ParticleLifetimeRandomizer(Faucet.k_particleLifetimeMin, Faucet.k_particleLifetimeMax);
          // Configure particle system parameters.
          this.m_particleSystem.SetRadius(0.035);
          this.m_particleSystem.SetMaxParticleCount(Faucet.k_maxParticleCount);
          this.m_particleSystem.SetDestructionByAge(true);
          let ground;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
          }
          // Create the container / trough style sink.
          {
              const shape = new b2__namespace.PolygonShape();
              const height = Faucet.k_containerHeight + Faucet.k_containerThickness;
              shape.SetAsBox(Faucet.k_containerWidth - Faucet.k_containerThickness, Faucet.k_containerThickness, new b2__namespace.Vec2(0.0, 0.0), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(Faucet.k_containerThickness, height, new b2__namespace.Vec2(-Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(Faucet.k_containerThickness, height, new b2__namespace.Vec2(Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
              ground.CreateFixture(shape, 0.0);
          }
          // Create ground under the container to catch overflow.
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(Faucet.k_containerWidth * 5.0, Faucet.k_containerThickness, new b2__namespace.Vec2(0.0, Faucet.k_containerThickness * -2.0), 0.0);
              ground.CreateFixture(shape, 0.0);
          }
          // Create the faucet spout.
          {
              const shape = new b2__namespace.PolygonShape();
              const particleDiameter = this.m_particleSystem.GetRadius() * 2.0;
              const faucetLength = Faucet.k_faucetLength * particleDiameter;
              // Dimensions of the faucet in world units.
              const length = faucetLength * Faucet.k_spoutLength;
              const width = Faucet.k_containerWidth * Faucet.k_faucetWidth *
                  Faucet.k_spoutWidth;
              // Height from the bottom of the container.
              const height = (Faucet.k_containerHeight * Faucet.k_faucetHeight) +
                  (length * 0.5);
              shape.SetAsBox(particleDiameter, length, new b2__namespace.Vec2(-width, height), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(particleDiameter, length, new b2__namespace.Vec2(width, height), 0.0);
              ground.CreateFixture(shape, 0.0);
              shape.SetAsBox(width - particleDiameter, particleDiameter, new b2__namespace.Vec2(0.0, height + length -
                  particleDiameter), 0.0);
              ground.CreateFixture(shape, 0.0);
          }
          // Initialize the particle emitter.
          {
              const faucetLength = this.m_particleSystem.GetRadius() * 2.0 * Faucet.k_faucetLength;
              this.m_emitter.SetParticleSystem(this.m_particleSystem);
              this.m_emitter.SetCallback(this.m_lifetimeRandomizer);
              this.m_emitter.SetPosition(new b2__namespace.Vec2(Faucet.k_containerWidth * Faucet.k_faucetWidth, Faucet.k_containerHeight * Faucet.k_faucetHeight + (faucetLength * 0.5)));
              this.m_emitter.SetVelocity(new b2__namespace.Vec2(0.0, 0.0));
              this.m_emitter.SetSize(new b2__namespace.Vec2(0.0, faucetLength));
              this.m_emitter.SetColor(new b2__namespace.Color(1, 1, 1, 1));
              this.m_emitter.SetEmitRate(120.0);
              this.m_emitter.SetParticleFlags(Test.GetParticleParameterValue());
          }
          // Don't restart the test when changing particle types.
          Test.SetRestartOnParticleParameterChange(false);
          // Limit the set of particle types.
          Test.SetParticleParameters(Faucet.k_paramDef, Faucet.k_paramDefCount);
      }
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          this.m_particleColorOffset += dt;
          // Keep m_particleColorOffset in the range 0.0f..k_ParticleColorsCount.
          if (this.m_particleColorOffset >= Test.k_ParticleColorsCount) {
              this.m_particleColorOffset -= Test.k_ParticleColorsCount;
          }
          // Propagate the currently selected particle flags.
          this.m_emitter.SetParticleFlags(Test.GetParticleParameterValue());
          // If this is a color mixing particle, add some color.
          ///  b2Color color(1, 1, 1, 1);
          if (this.m_emitter.GetParticleFlags() & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
              // Each second, select a different color.
              this.m_emitter.SetColor(Test.k_ParticleColors[Math.floor(this.m_particleColorOffset) % Test.k_ParticleColorsCount]);
          }
          else {
              this.m_emitter.SetColor(new b2__namespace.Color(1, 1, 1, 1));
          }
          // Create the particles.
          this.m_emitter.Step(dt);
          const k_keys = [
              "Keys: (w) water, (q) powder",
              "      (t) tensile, (v) viscous",
              "      (c) color mixing, (s) static pressure",
              "      (+) increase flow, (-) decrease flow",
          ];
          for (let i = 0; i < k_keys.length; ++i) {
              g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
      }
      Keyboard(key) {
          let parameter = 0;
          switch (key) {
              case "w":
                  parameter = b2__namespace.ParticleFlag.b2_waterParticle;
                  break;
              case "q":
                  parameter = b2__namespace.ParticleFlag.b2_powderParticle;
                  break;
              case "t":
                  parameter = b2__namespace.ParticleFlag.b2_tensileParticle;
                  break;
              case "v":
                  parameter = b2__namespace.ParticleFlag.b2_viscousParticle;
                  break;
              case "c":
                  parameter = b2__namespace.ParticleFlag.b2_colorMixingParticle;
                  break;
              case "s":
                  parameter = b2__namespace.ParticleFlag.b2_staticPressureParticle;
                  break;
              case "=":
                  ///if (this.m_shift)
                  {
                      let emitRate = this.m_emitter.GetEmitRate();
                      emitRate *= Faucet.k_emitRateChangeFactor;
                      emitRate = b2__namespace.Max(emitRate, Faucet.k_emitRateMin);
                      this.m_emitter.SetEmitRate(emitRate);
                  }
                  break;
              case "-":
                  ///if (!this.shift)
                  {
                      let emitRate = this.m_emitter.GetEmitRate();
                      emitRate *= 1.0 / Faucet.k_emitRateChangeFactor;
                      emitRate = b2__namespace.Min(emitRate, Faucet.k_emitRateMax);
                      this.m_emitter.SetEmitRate(emitRate);
                  }
                  break;
              default:
                  // Nothing.
                  return;
          }
          Test.SetParticleParameterValue(parameter);
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      /**
       * Create the faucet test.
       */
      static Create() {
          return new Faucet();
      }
  }
  /**
   * Minimum lifetime of particles in seconds.
   */
  Faucet.k_particleLifetimeMin = 30.0;
  /**
   * Maximum lifetime of particles in seconds.
   */
  Faucet.k_particleLifetimeMax = 50.0;
  /**
   * Height of the container.
   */
  Faucet.k_containerHeight = 0.2;
  /**
   * Width of the container.
   */
  Faucet.k_containerWidth = 1.0;
  /**
   * Thickness of the container's walls and bottom.
   */
  Faucet.k_containerThickness = 0.05;
  /**
   * Width of the faucet relative to the container width.
   */
  Faucet.k_faucetWidth = 0.1;
  /**
   * Height of the faucet relative to the base as a fraction of
   * the container height.
   */
  Faucet.k_faucetHeight = 15.0;
  /**
   * Length of the faucet as a fraction of the particle diameter.
   */
  Faucet.k_faucetLength = 2.0;
  /**
   * Spout height as a fraction of the faucet length.  This should
   * be greater than 1.0f).
   */
  Faucet.k_spoutLength = 2.0;
  /**
   * Spout width as a fraction of the *faucet* width.  This should
   * be greater than 1.0).
   */
  Faucet.k_spoutWidth = 1.1;
  /**
   * Maximum number of particles in the system.
   */
  Faucet.k_maxParticleCount = 1000;
  /**
   * Factor that is used to increase / decrease the emit rate.
   * This should be greater than 1.0.
   */
  Faucet.k_emitRateChangeFactor = 1.05;
  /**
   * Minimum emit rate of the faucet in particles per second.
   */
  Faucet.k_emitRateMin = 1.0;
  /**
   * Maximum emit rate of the faucet in particles per second.
   */
  Faucet.k_emitRateMax = 240.0;
  /**
   * Selection of particle types for this test.
   */
  Faucet.k_paramValues = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions, "water"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "viscous"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_colorMixingParticle, ParticleParameter.k_DefaultOptions, "color mixing"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_staticPressureParticle, ParticleParameter.k_DefaultOptions, "static pressure"),
  ];
  Faucet.k_paramDef = [
      new ParticleParameterDefinition(Faucet.k_paramValues),
  ];
  Faucet.k_paramDefCount = Faucet.k_paramDef.length;
  RegisterTest("Particles", "Faucet", Faucet.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc
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
  /**
   * Tracks instances of RadialEmitter and destroys them after a
   * specified period of time.
   */
  class EmitterTracker {
      constructor() {
          this.m_emitterLifetime = [];
      }
      /**
       * Delete all emitters.
       */
      __dtor__() {
          ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
          for (let it = 0; it < this.m_emitterLifetime.length; ++it) {
              ///  delete it.first;
              this.m_emitterLifetime[it].emitter.__dtor__();
          }
      }
      /**
       * Add an emitter to the tracker.
       * This assumes emitter was allocated using "new" and ownership
       * of the object is handed to this class.
       */
      Add(emitter, lifetime) {
          ///  m_emitterLifetime[emitter] = lifetime;
          this.m_emitterLifetime.push({ emitter, lifetime });
      }
      /**
       * Update all emitters destroying those who are too old.
       */
      Step(dt) {
          ///  std.vector<RadialEmitter*> emittersToDestroy;
          const emittersToDestroy = [];
          ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
          for (let it = 0; it < this.m_emitterLifetime.length; ++it) {
              ///  RadialEmitter * const emitter = it.first;
              const emitter = this.m_emitterLifetime[it].emitter;
              ///  const float32 lifetime = it.second - dt;
              const lifetime = this.m_emitterLifetime[it].lifetime - dt;
              if (lifetime <= 0.0) {
                  emittersToDestroy.push(emitter);
              }
              ///  m_emitterLifetime[emitter] = lifetime;
              this.m_emitterLifetime[it].lifetime = lifetime;
              emitter.Step(dt);
          }
          ///  for (std.vector<RadialEmitter*>.const_iterator it = emittersToDestroy.begin(); it !== emittersToDestroy.end(); ++it)
          for (let it = 0; it < emittersToDestroy.length; ++it) {
              ///  RadialEmitter *emitter = *it;
              const emitter = emittersToDestroy[it];
              /// delete emitter;
              emitter.__dtor__();
              ///  m_emitterLifetime.erase(m_emitterLifetime.find(emitter));
              this.m_emitterLifetime = this.m_emitterLifetime.filter((value) => {
                  return value.emitter !== emitter;
              });
          }
      }
  }
  /**
   * Keep track of particle groups in a set, removing them when
   * they're destroyed.
   */
  class ParticleGroupTracker extends b2__namespace.DestructionListener {
      constructor() {
          super(...arguments);
          this.m_particleGroups = [];
      }
      /**
       * Called when any particle group is about to be destroyed.
       */
      SayGoodbyeParticleGroup(group) {
          this.RemoveParticleGroup(group);
      }
      /**
       * Add a particle group to the tracker.
       */
      AddParticleGroup(group) {
          this.m_particleGroups.push(group);
      }
      /**
       * Remove a particle group from the tracker.
       */
      RemoveParticleGroup(group) {
          this.m_particleGroups.splice(this.m_particleGroups.indexOf(group), 1);
      }
      GetParticleGroups() {
          return this.m_particleGroups;
      }
  }
  class FrackerSettings {
  }
  /**
   * Width and height of the world in tiles.
   */
  FrackerSettings.k_worldWidthTiles = 24;
  FrackerSettings.k_worldHeightTiles = 16;
  /**
   * Total number of tiles.
   */
  FrackerSettings.k_worldTiles = FrackerSettings.k_worldWidthTiles * FrackerSettings.k_worldHeightTiles;
  /**
   * Center of the world in world coordinates.
   */
  FrackerSettings.k_worldCenterX = 0.0;
  FrackerSettings.k_worldCenterY = 2.0;
  /**
   * Size of each tile in world units.
   */
  FrackerSettings.k_tileWidth = 0.2;
  FrackerSettings.k_tileHeight = 0.2;
  /**
   * Half width and height of tiles in world units.
   */
  FrackerSettings.k_tileHalfWidth = FrackerSettings.k_tileWidth * 0.5;
  FrackerSettings.k_tileHalfHeight = FrackerSettings.k_tileHeight * 0.5;
  /**
   * Half width and height of the world in world coordinates.
   */
  FrackerSettings.k_worldHalfWidth = (FrackerSettings.k_worldWidthTiles * FrackerSettings.k_tileWidth) * 0.5;
  FrackerSettings.k_worldHalfHeight = (FrackerSettings.k_worldHeightTiles * FrackerSettings.k_tileHeight) * 0.5;
  /**
   * Colors of tiles.
   */
  FrackerSettings.k_playerColor = new b2__namespace.Color(1.0, 1.0, 1.0);
  FrackerSettings.k_playerFrackColor = new b2__namespace.Color(1.0, 0.5, 0.5);
  FrackerSettings.k_wellColor = new b2__namespace.Color(0.5, 0.5, 0.5);
  FrackerSettings.k_oilColor = new b2__namespace.Color(1.0, 0.0, 0.0);
  FrackerSettings.k_waterColor = new b2__namespace.Color(0.0, 0.2, 1.0);
  FrackerSettings.k_frackingFluidColor = new b2__namespace.Color(0.8, 0.4, 0.0);
  /**
   * Default density of each body.
   */
  FrackerSettings.k_density = 0.1;
  /**
   * Radius of oil / water / fracking fluid particles.
   */
  FrackerSettings.k_particleRadius = ((FrackerSettings.k_tileWidth + FrackerSettings.k_tileHeight) * 0.5) * 0.2;
  /**
   * Probability (0..100%) of generating each tile (must sum to
   * 1.0).
   */
  FrackerSettings.k_dirtProbability = 80;
  FrackerSettings.k_emptyProbability = 10;
  FrackerSettings.k_oilProbability = 7;
  FrackerSettings.k_waterProbability = 3;
  /**
   * Lifetime of a fracking fluid emitter in seconds.
   */
  FrackerSettings.k_frackingFluidEmitterLifetime = 5.0;
  /**
   * Speed particles are sucked up the well.
   */
  FrackerSettings.k_wellSuckSpeedInside = FrackerSettings.k_tileHeight * 5.0;
  /**
   * Speed particle are sucket towards the well bottom.
   */
  FrackerSettings.k_wellSuckSpeedOutside = FrackerSettings.k_tileWidth * 1.0;
  /**
   * Time mouse button must be held before emitting fracking
   * fluid.
   */
  FrackerSettings.k_frackingFluidChargeTime = 1.0;
  /**
   * Scores.
   */
  FrackerSettings.k_scorePerOilParticle = 1;
  FrackerSettings.k_scorePerWaterParticle = -1;
  FrackerSettings.k_scorePerFrackingParticle = 0;
  FrackerSettings.k_scorePerFrackingDeployment = -10;
  /**
   * Oil Fracking simulator.
   *
   * Dig down to move the oil (red) to the well (gray). Try not to
   * contaminate the ground water (blue). To deploy fracking fluid
   * press 'space'.  Fracking fluid can be used to push other
   * fluids to the well head and ultimately score points.
   */
  class Fracker extends Test {
      constructor() {
          super();
          this.m_wellX = FrackerSettings.k_worldWidthTiles - (FrackerSettings.k_worldWidthTiles / 4);
          this.m_wellTop = FrackerSettings.k_worldHeightTiles - 1;
          this.m_wellBottom = FrackerSettings.k_worldHeightTiles / 8;
          this.m_tracker = new EmitterTracker();
          this.m_allowInput = false;
          this.m_frackingFluidChargeTime = -1.0;
          this.m_material = [];
          this.m_bodies = [];
          /**
           * Set of particle groups the well has influence over.
           */
          this.m_listener = new Fracker_DestructionListener(this.m_world);
          this.m_particleSystem.SetRadius(FrackerSettings.k_particleRadius);
          this.InitializeLayout();
          // Create the boundaries of the play area.
          this.CreateGround();
          // Create the well.
          this.CreateWell();
          // Create the geography / features (tiles of the world).
          this.CreateGeo();
          // Create the player.
          this.CreatePlayer();
      }
      __dtor__() {
          this.m_listener.__dtor__();
      }
      /**
       * Initialize the data structures used to track the material in
       * each tile and the bodies associated with each tile.
       */
      InitializeLayout() {
          for (let i = 0; i < FrackerSettings.k_worldTiles; ++i) {
              this.m_material[i] = Fracker_Material.EMPTY;
              this.m_bodies[i] = null;
          }
      }
      /**
       * Get the material of the tile at the specified tile position.
       */
      GetMaterial(x, y) {
          ///  return *const_cast<Fracker*>(this).GetMaterialStorage(x, y);
          return this.m_material[Fracker.TileToArrayOffset(x, y)];
      }
      /**
       * Set the material of the tile at the specified tile position.
       */
      SetMaterial(x, y, material) {
          ///  *GetMaterialStorage(x, y) = material;
          this.m_material[Fracker.TileToArrayOffset(x, y)] = material;
      }
      /**
       * Get the body associated with the specified tile position.
       */
      GetBody(x, y) {
          ///  return *const_cast<Fracker*>(this).GetBodyStorage(x, y);
          return this.m_bodies[Fracker.TileToArrayOffset(x, y)];
      }
      /**
       * Set the body associated with the specified tile position.
       */
      SetBody(x, y, body) {
          ///  b2Body** const currentBody = GetBodyStorage(x, y);
          const currentBody = this.m_bodies[Fracker.TileToArrayOffset(x, y)];
          if (currentBody) {
              this.m_world.DestroyBody(currentBody);
          }
          this.m_bodies[Fracker.TileToArrayOffset(x, y)] = body;
      }
      /**
       * Create the player.
       */
      CreatePlayer() {
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_kinematicBody;
          this.m_player = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, new b2__namespace.Vec2(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight), 0);
          this.m_player.CreateFixture(shape, FrackerSettings.k_density);
          this.m_player.SetTransformVec(Fracker.TileToWorld(FrackerSettings.k_worldWidthTiles / 2, FrackerSettings.k_worldHeightTiles / 2), 0);
      }
      /**
       * Create the geography / features of the world.
       */
      CreateGeo() {
          // DEBUG: b2.Assert(FrackerSettings.k_dirtProbability +
          // DEBUG:   FrackerSettings.k_emptyProbability +
          // DEBUG:   FrackerSettings.k_oilProbability +
          // DEBUG:   FrackerSettings.k_waterProbability === 100);
          for (let x = 0; x < FrackerSettings.k_worldWidthTiles; x++) {
              for (let y = 0; y < FrackerSettings.k_worldHeightTiles; y++) {
                  if (this.GetMaterial(x, y) !== Fracker_Material.EMPTY) {
                      continue;
                  }
                  // Choose a tile at random.
                  const chance = Math.random() * 100.0;
                  // Create dirt if this is the bottom row or chance dictates it.
                  if (chance < FrackerSettings.k_dirtProbability || y === 0) {
                      this.CreateDirtBlock(x, y);
                  }
                  else if (chance < FrackerSettings.k_dirtProbability +
                      FrackerSettings.k_emptyProbability) {
                      this.SetMaterial(x, y, Fracker_Material.EMPTY);
                  }
                  else if (chance < FrackerSettings.k_dirtProbability +
                      FrackerSettings.k_emptyProbability +
                      FrackerSettings.k_oilProbability) {
                      this.CreateReservoirBlock(x, y, Fracker_Material.OIL);
                  }
                  else {
                      this.CreateReservoirBlock(x, y, Fracker_Material.WATER);
                  }
              }
          }
      }
      /**
       * Create the boundary of the world.
       */
      CreateGround() {
          const bd = new b2__namespace.BodyDef();
          const ground = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.ChainShape();
          const bottomLeft = new b2__namespace.Vec2(), topRight = new b2__namespace.Vec2();
          Fracker.GetExtents(bottomLeft, topRight);
          const vertices = [
              new b2__namespace.Vec2(bottomLeft.x, bottomLeft.y),
              new b2__namespace.Vec2(topRight.x, bottomLeft.y),
              new b2__namespace.Vec2(topRight.x, topRight.y),
              new b2__namespace.Vec2(bottomLeft.x, topRight.y),
          ];
          shape.CreateLoop(vertices);
          ground.CreateFixture(shape, 0.0);
      }
      /**
       * Create a dirt block at the specified world position.
       */
      CreateDirtBlock(x, y) {
          const position = Fracker.TileToWorld(x, y);
          const bd = new b2__namespace.BodyDef();
          const body = this.m_world.CreateBody(bd);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
          body.CreateFixture(shape, FrackerSettings.k_density);
          this.SetBody(x, y, body);
          this.SetMaterial(x, y, Fracker_Material.DIRT);
      }
      /**
       * Create particles in a tile with resources.
       */
      CreateReservoirBlock(x, y, material) {
          const position = Fracker.TileToWorld(x, y);
          const shape = new b2__namespace.PolygonShape();
          this.SetMaterial(x, y, material);
          shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
          const pd = new b2__namespace.ParticleGroupDef();
          pd.flags = b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_viscousParticle | b2__namespace.ParticleFlag.b2_destructionListenerParticle;
          pd.shape = shape;
          pd.color.Copy(material === Fracker_Material.OIL ?
              FrackerSettings.k_oilColor : FrackerSettings.k_waterColor);
          const group = this.m_particleSystem.CreateParticleGroup(pd);
          this.m_listener.AddParticleGroup(group);
          // Tag each particle with its type.
          const particleCount = group.GetParticleCount();
          ///  void** const userDataBuffer = m_particleSystem.GetUserDataBuffer() + group.GetBufferIndex();;
          const userDataBuffer = this.m_particleSystem.GetUserDataBuffer();
          const index = group.GetBufferIndex();
          for (let i = 0; i < particleCount; ++i) {
              ///  userDataBuffer[i] = GetMaterialStorage(x, y);
              userDataBuffer[index + i] = this.m_material[Fracker.TileToArrayOffset(x, y)];
          }
          // Keep track of the total available oil.
          if (material === Fracker_Material.OIL) {
              this.m_listener.AddOil(particleCount);
          }
      }
      /**
       * Create a well and the region which applies negative pressure
       * to suck out fluid.
       */
      CreateWell() {
          for (let y = this.m_wellBottom; y <= this.m_wellTop; y++) {
              this.SetMaterial(this.m_wellX, y, Fracker_Material.WELL);
          }
      }
      /**
       * Create a fracking fluid emitter.
       */
      CreateFrackingFluidEmitter(position) {
          const groupDef = new b2__namespace.ParticleGroupDef();
          const group = this.m_particleSystem.CreateParticleGroup(groupDef);
          this.m_listener.AddParticleGroup(group);
          const emitter = new RadialEmitter();
          emitter.SetGroup(group);
          emitter.SetParticleSystem(this.m_particleSystem);
          emitter.SetPosition(Fracker.CenteredPosition(position));
          emitter.SetVelocity(new b2__namespace.Vec2(0.0, -FrackerSettings.k_tileHalfHeight));
          emitter.SetSpeed(FrackerSettings.k_tileHalfWidth * 0.1);
          emitter.SetSize(new b2__namespace.Vec2(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight));
          emitter.SetEmitRate(20.0);
          emitter.SetColor(FrackerSettings.k_frackingFluidColor);
          emitter.SetParticleFlags(b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_viscousParticle);
          this.m_tracker.Add(emitter, FrackerSettings.k_frackingFluidEmitterLifetime);
          this.m_listener.AddScore(FrackerSettings.k_scorePerFrackingDeployment);
      }
      /**
       * Update the player's position.
       */
      SetPlayerPosition(playerX, playerY) {
          const playerPosition = this.m_player.GetTransform().p;
          const currentPlayerX = [0];
          const currentPlayerY = [0];
          Fracker.WorldToTile(playerPosition, currentPlayerX, currentPlayerY);
          playerX = b2__namespace.Clamp(playerX, 0, FrackerSettings.k_worldWidthTiles - 1);
          playerY = b2__namespace.Clamp(playerY, 0, FrackerSettings.k_worldHeightTiles - 1);
          // Only update if the player has moved and isn't attempting to
          // move through the well.
          if (this.GetMaterial(playerX, playerY) !== Fracker_Material.WELL &&
              (currentPlayerX[0] !== playerX ||
                  currentPlayerY[0] !== playerY)) {
              // Try to deploy any fracking fluid that was charging.
              this.DeployFrackingFluid();
              // Move the player.
              this.m_player.SetTransformVec(Fracker.TileToWorld(playerX, playerY), 0);
          }
      }
      /**
       * Try to deploy fracking fluid at the player's position,
       * returning true if successful.
       */
      DeployFrackingFluid() {
          let deployed = false;
          const playerPosition = this.m_player.GetTransform().p;
          if (this.m_frackingFluidChargeTime > FrackerSettings.k_frackingFluidChargeTime) {
              this.CreateFrackingFluidEmitter(playerPosition);
              deployed = true;
          }
          this.m_frackingFluidChargeTime = -1.0;
          return deployed;
      }
      /**
       * Destroy all particles in the box specified by a set of tile
       * coordinates.
       */
      DestroyParticlesInTiles(startX, startY, endX, endY) {
          const shape = new b2__namespace.PolygonShape();
          const width = endX - startX + 1;
          const height = endY - startY + 1;
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          shape.SetAsBox(FrackerSettings.k_tileHalfWidth * width, FrackerSettings.k_tileHalfHeight * height);
          const killLocation = new b2__namespace.Transform();
          killLocation.SetPositionAngle(Fracker.CenteredPosition(Fracker.TileToWorld(centerX, centerY)), 0);
          this.m_particleSystem.DestroyParticlesInShape(shape, killLocation);
      }
      JointDestroyed(joint) {
          super.JointDestroyed(joint);
      }
      ParticleGroupDestroyed(group) {
          super.ParticleGroupDestroyed(group);
      }
      BeginContact(contact) {
          super.BeginContact(contact);
      }
      EndContact(contact) {
          super.EndContact(contact);
      }
      PreSolve(contact, oldManifold) {
          super.PreSolve(contact, oldManifold);
      }
      PostSolve(contact, impulse) {
          super.PostSolve(contact, impulse);
      }
      /**
       * a = left, d = right, a = up, s = down, e = deploy fracking
       * fluid.
       */
      Keyboard(key) {
          // Only allow 1 move per simulation step.
          if (!this.m_allowInput) {
              return;
          }
          const playerPosition = this.m_player.GetTransform().p;
          const playerX = [0];
          const playerY = [0];
          Fracker.WorldToTile(playerPosition, playerX, playerY);
          switch (key) {
              case "a":
                  playerX[0]--;
                  break;
              case "s":
                  playerY[0]--;
                  break;
              case "d":
                  playerX[0]++;
                  break;
              case "w":
                  playerY[0]++;
                  break;
              case "e":
                  // Start charging the fracking fluid.
                  if (this.m_frackingFluidChargeTime < 0.0) {
                      this.m_frackingFluidChargeTime = 0.0;
                  }
                  else {
                      // KeyboardUp() in freeglut (at least on OSX) is called
                      // repeatedly while a key is held.  This means there isn't
                      // a way for fracking fluid to be deployed when the user
                      // releases 'e'.  This works around the issue by attempting
                      // to deploy the fluid when 'e' is pressed again.
                      this.DeployFrackingFluid();
                  }
                  break;
              default:
                  super.Keyboard(key);
                  break;
          }
          this.SetPlayerPosition(playerX[0], playerY[0]);
          this.m_allowInput = false;
      }
      KeyboardUp(key) {
          super.KeyboardUp(key);
      }
      MouseDown(p) {
          super.MouseDown(p);
          this.m_frackingFluidChargeTime = 0.0;
      }
      /**
       * Try to deploy the fracking fluid or move the player.
       */
      MouseUp(p) {
          super.MouseUp(p);
          if (!this.m_allowInput) {
              return;
          }
          // If fracking fluid isn't being released, move the player.
          if (!this.DeployFrackingFluid()) {
              const playerPosition = this.m_player.GetTransform().p;
              const playerX = [0];
              const playerY = [0];
              Fracker.WorldToTile(playerPosition, playerX, playerY);
              // Move the player towards the mouse position, preferring to move
              // along the axis with the maximal distance from the cursor.
              const distance = b2__namespace.Vec2.SubVV(p, Fracker.CenteredPosition(playerPosition), new b2__namespace.Vec2());
              const absDistX = Math.abs(distance.x);
              const absDistY = Math.abs(distance.y);
              if (absDistX > absDistY &&
                  absDistX >= FrackerSettings.k_tileHalfWidth) {
                  playerX[0] += distance.x > 0.0 ? 1 : -1;
              }
              else if (absDistY >= FrackerSettings.k_tileHalfWidth) {
                  playerY[0] += distance.y > 0.0 ? 1 : -1;
              }
              this.SetPlayerPosition(playerX[0], playerY[0]);
          }
          this.m_allowInput = false;
      }
      MouseMove(p) {
          super.MouseMove(p);
      }
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          this.m_tracker.Step(dt);
          // Allow the user to move again.
          this.m_allowInput = true;
          // Charge up fracking fluid.
          if (this.m_frackingFluidChargeTime >= 0.0) {
              this.m_frackingFluidChargeTime += dt;
          }
          const playerPosition = this.m_player.GetTransform().p;
          const playerX = [0];
          const playerY = [0];
          Fracker.WorldToTile(playerPosition, playerX, playerY);
          // If the player is moved to a square with dirt, remove it.
          if (this.GetMaterial(playerX[0], playerY[0]) === Fracker_Material.DIRT) {
              this.SetMaterial(playerX[0], playerY[0], Fracker_Material.EMPTY);
              this.SetBody(playerX[0], playerY[0], null);
          }
          // Destroy particles at the top of the well.
          this.DestroyParticlesInTiles(this.m_wellX, this.m_wellTop, this.m_wellX, this.m_wellTop);
          // Only move particles in the groups being tracked.
          ///  const std.set<b2ParticleGroup*> &particleGroups = m_listener.GetParticleGroups();
          const particleGroups = this.m_listener.GetParticleGroups();
          ///  for (std.set<b2ParticleGroup*>.const_iterator it = particleGroups.begin(); it !== particleGroups.end(); ++it)
          for (let it = 0; it < particleGroups.length; ++it) {
              ///  b2ParticleGroup * const particleGroup = *it;
              const particleGroup = particleGroups[it];
              const index = particleGroup.GetBufferIndex();
              ///  const b2Vec2* const positionBuffer = m_particleSystem.GetPositionBuffer() + index;
              const positionBuffer = this.m_particleSystem.GetPositionBuffer();
              ///  b2Vec2* const velocityBuffer = m_particleSystem.GetVelocityBuffer() + index;
              const velocityBuffer = this.m_particleSystem.GetVelocityBuffer();
              const particleCount = particleGroup.GetParticleCount();
              for (let i = 0; i < particleCount; ++i) {
                  // Apply velocity to particles near the bottom or in the well
                  // sucking them up to the top.
                  const wellEnd = Fracker.CenteredPosition(Fracker.TileToWorld(this.m_wellX, this.m_wellBottom - 2));
                  const particlePosition = positionBuffer[index + i];
                  // Distance from the well's bottom.
                  ///  const b2Vec2 distance = particlePosition - wellEnd;
                  const distance = b2__namespace.Vec2.SubVV(particlePosition, wellEnd, new b2__namespace.Vec2());
                  // Distance from either well side wall.
                  const absDistX = Math.abs(distance.x);
                  if (absDistX < FrackerSettings.k_tileWidth &&
                      // If the particles are just below the well bottom.
                      distance.y > FrackerSettings.k_tileWidth * -2.0 &&
                      distance.y < 0.0) {
                      // Suck the particles towards the end of the well.
                      ///  b2Vec2 velocity = wellEnd - particlePosition;
                      const velocity = b2__namespace.Vec2.SubVV(wellEnd, particlePosition, new b2__namespace.Vec2());
                      velocity.Normalize();
                      ///  velocityBuffer[i] = velocity * FrackerSettings.k_wellSuckSpeedOutside;
                      velocityBuffer[index + i].Copy(velocity.SelfMul(FrackerSettings.k_wellSuckSpeedOutside));
                  }
                  else if (absDistX <= FrackerSettings.k_tileHalfWidth && distance.y > 0.0) {
                      // Suck the particles up the well with a random
                      // x component moving them side to side in the well.
                      const randomX = (Math.random() * FrackerSettings.k_tileHalfWidth) - distance.x;
                      const velocity = new b2__namespace.Vec2(randomX, FrackerSettings.k_tileHeight);
                      velocity.Normalize();
                      ///  velocityBuffer[i] = velocity * FrackerSettings.k_wellSuckSpeedInside;
                      velocityBuffer[index + i].Copy(velocity.SelfMul(FrackerSettings.k_wellSuckSpeedInside));
                  }
              }
          }
          // Draw everything.
          this.DrawPlayer();
          this.DrawWell();
          this.DrawScore();
      }
      /**
       * Render the well.
       */
      DrawWell() {
          for (let y = this.m_wellBottom; y <= this.m_wellTop; ++y) {
              this.DrawQuad(Fracker.TileToWorld(this.m_wellX, y), FrackerSettings.k_wellColor);
          }
      }
      /**
       * Render the player / fracker.
       */
      DrawPlayer() {
          this.DrawQuad(this.m_player.GetTransform().p, Fracker.LerpColor(FrackerSettings.k_playerColor, FrackerSettings.k_playerFrackColor, b2__namespace.Max(this.m_frackingFluidChargeTime /
              FrackerSettings.k_frackingFluidChargeTime, 0.0)), true);
      }
      /**
       * Render the score and the instructions / keys.
       */
      DrawScore() {
          ///  char score[512];
          ///  sprintf(score, "Score: %d, Remaining Oil %d",
          ///          m_listener.GetScore(), m_listener.GetOil());
          ///  const char *lines[] = { score,  "Move: a,s,d,w   Fracking Fluid: e" };
          ///  for (uint32 i = 0; i < B2_ARRAY_SIZE(lines); ++i)
          ///  {
          ///    m_debugDraw.DrawString(5, m_textLine, lines[i]);
          ///    m_textLine += DRAW_STRING_NEW_LINE;
          ///  }
          g_debugDraw.DrawString(5, this.m_textLine, `Score: ${this.m_listener.GetScore()}, Remaining Oil ${this.m_listener.GetOil()}`);
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "Move: a,s,d,w   Fracking Fluid: e");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      /**
       * Draw a quad at position of color that is either just an
       * outline (fill = false) or solid (fill = true).
       */
      DrawQuad(position, color, fill = false) {
          ///  b2Vec2 verts[4];
          const verts = b2__namespace.Vec2.MakeArray(4);
          const maxX = position.x + FrackerSettings.k_tileWidth;
          const maxY = position.y + FrackerSettings.k_tileHeight;
          verts[0].Set(position.x, maxY);
          verts[1].Set(position.x, position.y);
          verts[2].Set(maxX, position.y);
          verts[3].Set(maxX, maxY);
          if (fill) {
              g_debugDraw.DrawPolygon(verts, 4, color);
          }
          else {
              g_debugDraw.DrawSolidPolygon(verts, 4, color);
          }
      }
      ///  // Get a pointer to the material of the tile at the specified position.
      ///  Material* GetMaterialStorage(const int32 x, const int32 y)
      ///  {
      ///    return &m_material[Fracker.TileToArrayOffset(x, y)];
      ///  }
      ///  // A pointer to the body storage associated with the specified tile
      ///  // position.
      ///  b2Body** GetBodyStorage(const int32 x, const int32 y)
      ///  {
      ///    return &m_bodies[Fracker.TileToArrayOffset(x, y)];
      ///  }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new Fracker();
      }
      /**
       * Get the bottom left position of the world in world units.
       */
      static GetBottomLeft(bottomLeft) {
          bottomLeft.Set(FrackerSettings.k_worldCenterX -
              FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY -
              FrackerSettings.k_worldHalfHeight);
      }
      /**
       * Get the extents of the world in world units.
       */
      static GetExtents(bottomLeft, topRight) {
          Fracker.GetBottomLeft(bottomLeft);
          topRight.Set(FrackerSettings.k_worldCenterX +
              FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY +
              FrackerSettings.k_worldHalfHeight);
      }
      // Convert a point in world coordintes to a tile location
      static WorldToTile(position, x, y) {
          // Translate relative to the world center and scale based upon the
          // tile size.
          const bottomLeft = new b2__namespace.Vec2();
          Fracker.GetBottomLeft(bottomLeft);
          x[0] = Math.floor(((position.x - bottomLeft.x) /
              FrackerSettings.k_tileWidth) +
              FrackerSettings.k_tileHalfWidth);
          y[0] = Math.floor(((position.y - bottomLeft.y) /
              FrackerSettings.k_tileHeight) +
              FrackerSettings.k_tileHalfHeight);
      }
      /**
       * Convert a tile position to a point  in world coordinates.
       */
      static TileToWorld(x, y, out = new b2__namespace.Vec2()) {
          // Scale based upon the tile size and translate relative to the world
          // center.
          const bottomLeft = new b2__namespace.Vec2();
          Fracker.GetBottomLeft(bottomLeft);
          return out.Set((x * FrackerSettings.k_tileWidth) + bottomLeft.x, (y * FrackerSettings.k_tileHeight) + bottomLeft.y);
      }
      /**
       * Calculate the offset within an array of all world tiles using
       * the specified tile coordinates.
       */
      static TileToArrayOffset(x, y) {
          // DEBUG: b2.Assert(x >= 0);
          // DEBUG: b2.Assert(x < FrackerSettings.k_worldWidthTiles);
          // DEBUG: b2.Assert(y >= 0);
          // DEBUG: b2.Assert(y < FrackerSettings.k_worldHeightTiles);
          return x + (y * FrackerSettings.k_worldWidthTiles);
      }
      /**
       * Calculate the center of a tile position in world units.
       */
      static CenteredPosition(position, out = new b2__namespace.Vec2()) {
          return out.Set(position.x + FrackerSettings.k_tileHalfWidth, position.y + FrackerSettings.k_tileHalfHeight);
      }
      /**
       * Interpolate between color a and b using t.
       */
      static LerpColor(a, b, t) {
          return new b2__namespace.Color(Fracker.Lerp(a.r, b.r, t), Fracker.Lerp(a.g, b.g, t), Fracker.Lerp(a.b, b.b, t));
      }
      /**
       * Interpolate between a and b using t.
       */
      static Lerp(a, b, t) {
          return a * (1.0 - t) + b * t;
      }
  }
  /**
   * Type of material in a tile.
   */
  var Fracker_Material;
  (function (Fracker_Material) {
      Fracker_Material[Fracker_Material["EMPTY"] = 0] = "EMPTY";
      Fracker_Material[Fracker_Material["DIRT"] = 1] = "DIRT";
      Fracker_Material[Fracker_Material["ROCK"] = 2] = "ROCK";
      Fracker_Material[Fracker_Material["OIL"] = 3] = "OIL";
      Fracker_Material[Fracker_Material["WATER"] = 4] = "WATER";
      Fracker_Material[Fracker_Material["WELL"] = 5] = "WELL";
      Fracker_Material[Fracker_Material["PUMP"] = 6] = "PUMP";
  })(Fracker_Material || (Fracker_Material = {}));
  /**
   * Keep track of particle groups which are drawn up the well and
   * tracks the score of the game.
   */
  class Fracker_DestructionListener extends ParticleGroupTracker {
      /**
       * Initialize the particle system and world, setting this class
       * as a destruction listener for the world.
       */
      constructor(world) {
          super();
          this.m_score = 0;
          this.m_oil = 0;
          this.m_previousListener = null;
          // DEBUG: b2.Assert(world !== null);
          this.m_world = world;
          this.m_previousListener = world.m_destructionListener;
          this.m_world.SetDestructionListener(this);
      }
      /**
       * Initialize the score.
       */
      __ctor__() { }
      __dtor__() {
          if (this.m_world) {
              this.m_world.SetDestructionListener(this.m_previousListener);
          }
      }
      /**
       * Add to the current score.
       */
      AddScore(score) {
          this.m_score += score;
      }
      /**
       * Get the current score.
       */
      GetScore() {
          return this.m_score;
      }
      /**
       * Add to the remaining oil.
       */
      AddOil(oil) {
          this.m_oil += oil;
      }
      /**
       * Get the total oil.
       */
      GetOil() {
          return this.m_oil;
      }
      /**
       * Update the score when certain particles are destroyed.
       */
      SayGoodbyeParticle(particleSystem, index) {
          // DEBUG: b2.Assert(particleSystem !== null);
          ///  const void * const userData = particleSystem.GetUserDataBuffer()[index];
          const userData = particleSystem.GetUserDataBuffer()[index];
          if (userData) {
              ///  const Material material = *((Material*)userData);
              const material = userData;
              switch (material) {
                  case Fracker_Material.OIL:
                      this.AddScore(FrackerSettings.k_scorePerOilParticle);
                      this.AddOil(-1);
                      break;
                  case Fracker_Material.WATER:
                      this.AddScore(FrackerSettings.k_scorePerWaterParticle);
                      break;
              }
          }
      }
  }
  RegisterTest("Particles", "Fracker", Fracker.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class Impulse extends Test {
      constructor() {
          super();
          this.m_useLinearImpulse = false;
          // Create the containing box.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const box = [
                  new b2__namespace.Vec2(Impulse.kBoxLeft, Impulse.kBoxBottom),
                  new b2__namespace.Vec2(Impulse.kBoxRight, Impulse.kBoxBottom),
                  new b2__namespace.Vec2(Impulse.kBoxRight, Impulse.kBoxTop),
                  new b2__namespace.Vec2(Impulse.kBoxLeft, Impulse.kBoxTop),
              ];
              const shape = new b2__namespace.ChainShape();
              shape.CreateLoop(box);
              ground.CreateFixture(shape, 0.0);
          }
          this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
          this.m_particleSystem.SetDamping(0.2);
          // Create the particles.
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.8, 1.0, new b2__namespace.Vec2(0.0, 1.01), 0);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = Test.GetParticleParameterValue();
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
      }
      MouseUp(p) {
          super.MouseUp(p);
          // Apply an impulse to the particles.
          const isInsideBox = Impulse.kBoxLeft <= p.x && p.x <= Impulse.kBoxRight &&
              Impulse.kBoxBottom <= p.y && p.y <= Impulse.kBoxTop;
          if (isInsideBox) {
              const kBoxCenter = new b2__namespace.Vec2(0.5 * (Impulse.kBoxLeft + Impulse.kBoxRight), 0.5 * (Impulse.kBoxBottom + Impulse.kBoxTop));
              const direction = b2__namespace.Vec2.SubVV(p, kBoxCenter, new b2__namespace.Vec2());
              direction.Normalize();
              this.ApplyImpulseOrForce(direction);
          }
      }
      Keyboard(key) {
          super.Keyboard(key);
          switch (key) {
              case "l":
                  this.m_useLinearImpulse = true;
                  break;
              case "f":
                  this.m_useLinearImpulse = false;
                  break;
          }
      }
      ApplyImpulseOrForce(direction) {
          const particleSystem = this.m_world.GetParticleSystemList();
          if (!particleSystem) {
              throw new Error();
          }
          const particleGroup = particleSystem.GetParticleGroupList();
          if (!particleGroup) {
              throw new Error();
          }
          const numParticles = particleGroup.GetParticleCount();
          if (this.m_useLinearImpulse) {
              const kImpulseMagnitude = 0.005;
              ///  const b2Vec2 impulse = kImpulseMagnitude * direction * (float32)numParticles;
              const impulse = b2__namespace.Vec2.MulSV(kImpulseMagnitude * numParticles, direction, new b2__namespace.Vec2());
              particleGroup.ApplyLinearImpulse(impulse);
          }
          else {
              const kForceMagnitude = 1.0;
              ///  const b2Vec2 force = kForceMagnitude * direction * (float32)numParticles;
              const force = b2__namespace.Vec2.MulSV(kForceMagnitude * numParticles, direction, new b2__namespace.Vec2());
              particleGroup.ApplyForce(force);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new Impulse();
      }
  }
  Impulse.kBoxLeft = -2;
  Impulse.kBoxRight = 2;
  Impulse.kBoxBottom = 0;
  Impulse.kBoxTop = 4;
  RegisterTest("Particles", "Impulse", Impulse.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class LiquidTimer extends Test {
      constructor() {
          super();
          // Setup particle parameters.
          Test.SetParticleParameters(LiquidTimer.k_paramDef, LiquidTimer.k_paramDefCount);
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.ChainShape();
              const vertices = [
                  new b2__namespace.Vec2(-2, 0),
                  new b2__namespace.Vec2(2, 0),
                  new b2__namespace.Vec2(2, 4),
                  new b2__namespace.Vec2(-2, 4),
              ];
              shape.CreateLoop(vertices);
              ground.CreateFixture(shape, 0.0);
          }
          this.m_particleSystem.SetRadius(0.025);
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(2, 0.4, new b2__namespace.Vec2(0, 3.6), 0);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = Test.GetParticleParameterValue();
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-2, 3.2), new b2__namespace.Vec2(-1.2, 3.2));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-1.1, 3.2), new b2__namespace.Vec2(2, 3.2));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-1.2, 3.2), new b2__namespace.Vec2(-1.2, 2.8));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-1.1, 3.2), new b2__namespace.Vec2(-1.1, 2.8));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-1.6, 2.4), new b2__namespace.Vec2(0.8, 2));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(1.6, 1.6), new b2__namespace.Vec2(-0.8, 1.2));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-1.2, 0.8), new b2__namespace.Vec2(-1.2, 0));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-0.4, 0.8), new b2__namespace.Vec2(-0.4, 0));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(0.4, 0.8), new b2__namespace.Vec2(0.4, 0));
              body.CreateFixture(shape, 0.1);
          }
          {
              const bd = new b2__namespace.BodyDef();
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(1.2, 0.8), new b2__namespace.Vec2(1.2, 0));
              body.CreateFixture(shape, 0.1);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new LiquidTimer();
      }
  }
  LiquidTimer.k_paramValues = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "tensile + viscous"),
  ];
  LiquidTimer.k_paramDef = [
      new ParticleParameterDefinition(LiquidTimer.k_paramValues),
      new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
  ];
  LiquidTimer.k_paramDefCount = LiquidTimer.k_paramDef.length;
  RegisterTest("Particles", "Liquid Timer", LiquidTimer.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  /**
   * Game which adds some fun to Maxwell's demon.
   *
   * http://en.wikipedia.org/wiki/Maxwell's_demon
   *
   * The user's goal is to try to catch as many particles as
   * possible in the bottom half of the container by splitting the
   * container using a barrier with the 'a' key.
   *
   * See Maxwell::Keyboard() for other controls.
   */
  class Maxwell extends Test {
      constructor() {
          super();
          this.m_density = Maxwell.k_densityDefault;
          this.m_position = Maxwell.k_containerHalfHeight;
          this.m_temperature = Maxwell.k_temperatureDefault;
          this.m_barrierBody = null;
          this.m_particleGroup = null;
          this.m_world.SetGravity(new b2__namespace.Vec2(0, 0));
          // Create the container.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.ChainShape();
              const vertices = [
                  new b2__namespace.Vec2(-Maxwell.k_containerHalfWidth, 0),
                  new b2__namespace.Vec2(Maxwell.k_containerHalfWidth, 0),
                  new b2__namespace.Vec2(Maxwell.k_containerHalfWidth, Maxwell.k_containerHeight),
                  new b2__namespace.Vec2(-Maxwell.k_containerHalfWidth, Maxwell.k_containerHeight),
              ];
              shape.CreateLoop(vertices);
              const def = new b2__namespace.FixtureDef();
              def.shape = shape;
              def.density = 0;
              def.restitution = 1.0;
              ground.CreateFixture(def);
          }
          // Enable the barrier.
          this.EnableBarrier();
          // Create the particles.
          this.ResetParticles();
      }
      /**
       * Disable the barrier.
       */
      DisableBarrier() {
          if (this.m_barrierBody) {
              this.m_world.DestroyBody(this.m_barrierBody);
              this.m_barrierBody = null;
          }
      }
      /**
       * Enable the barrier.
       */
      EnableBarrier() {
          if (!this.m_barrierBody) {
              const bd = new b2__namespace.BodyDef();
              this.m_barrierBody = this.m_world.CreateBody(bd);
              const barrierShape = new b2__namespace.PolygonShape();
              barrierShape.SetAsBox(Maxwell.k_containerHalfWidth, Maxwell.k_barrierHeight, new b2__namespace.Vec2(0, this.m_position), 0);
              const def = new b2__namespace.FixtureDef();
              def.shape = barrierShape;
              def.density = 0;
              def.restitution = 1.0;
              this.m_barrierBody.CreateFixture(def);
          }
      }
      /**
       * Enable / disable the barrier.
       */
      ToggleBarrier() {
          if (this.m_barrierBody) {
              this.DisableBarrier();
          }
          else {
              this.EnableBarrier();
          }
      }
      /**
       * Destroy and recreate all particles.
       */
      ResetParticles() {
          if (this.m_particleGroup !== null) {
              this.m_particleGroup.DestroyParticles(false);
              this.m_particleGroup = null;
          }
          this.m_particleSystem.SetRadius(Maxwell.k_containerHalfWidth / 20.0);
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(this.m_density * Maxwell.k_containerHalfWidth, this.m_density * Maxwell.k_containerHalfHeight, new b2__namespace.Vec2(0, Maxwell.k_containerHalfHeight), 0);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_powderParticle;
              pd.shape = shape;
              this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);
              ///  b2Vec2* velocities =
              ///    this.m_particleSystem.GetVelocityBuffer() +
              ///    this.m_particleGroup.GetBufferIndex();
              const velocities = this.m_particleSystem.GetVelocityBuffer();
              const index = this.m_particleGroup.GetBufferIndex();
              for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
                  ///  b2Vec2& v = *(velocities + i);
                  const v = velocities[index + i];
                  v.Set(RandomFloat() + 1.0, RandomFloat() + 1.0);
                  v.Normalize();
                  ///  v *= this.m_temperature;
                  v.SelfMul(this.m_temperature);
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  // Enable / disable the barrier.
                  this.ToggleBarrier();
                  break;
              case "=":
                  // Increase the particle density.
                  this.m_density = b2__namespace.Min(this.m_density * Maxwell.k_densityStep, Maxwell.k_densityMax);
                  this.Reset();
                  break;
              case "-":
                  // Reduce the particle density.
                  this.m_density = b2__namespace.Max(this.m_density / Maxwell.k_densityStep, Maxwell.k_densityMin);
                  this.Reset();
                  break;
              case ".":
                  // Move the location of the divider up.
                  this.MoveDivider(this.m_position + Maxwell.k_barrierMovementIncrement);
                  break;
              case ",":
                  // Move the location of the divider down.
                  this.MoveDivider(this.m_position - Maxwell.k_barrierMovementIncrement);
                  break;
              case ";":
                  // Reduce the temperature (velocity of particles).
                  this.m_temperature = b2__namespace.Max(this.m_temperature - Maxwell.k_temperatureStep, Maxwell.k_temperatureMin);
                  this.Reset();
                  break;
              case "'":
                  // Increase the temperature (velocity of particles).
                  this.m_temperature = b2__namespace.Min(this.m_temperature + Maxwell.k_temperatureStep, Maxwell.k_temperatureMax);
                  this.Reset();
                  break;
              default:
                  super.Keyboard(key);
                  break;
          }
      }
      /**
       * Determine whether a point is in the container.
       */
      InContainer(p) {
          return p.x >= -Maxwell.k_containerHalfWidth && p.x <= Maxwell.k_containerHalfWidth &&
              p.y >= 0.0 && p.y <= Maxwell.k_containerHalfHeight * 2.0;
      }
      MouseDown(p) {
          if (!this.InContainer(p)) {
              super.MouseDown(p);
          }
      }
      MouseUp(p) {
          // If the pointer is in the container.
          if (this.InContainer(p)) {
              // Enable / disable the barrier.
              this.ToggleBarrier();
          }
          else {
              // Move the barrier to the touch position.
              this.MoveDivider(p.y);
              super.MouseUp(p);
          }
      }
      Step(settings) {
          super.Step(settings);
          // Number of particles above (top) and below (bottom) the barrier.
          let top = 0;
          let bottom = 0;
          if (this.m_particleGroup) {
              const index = this.m_particleGroup.GetBufferIndex();
              ///  b2Vec2* const velocities = this.m_particleSystem.GetVelocityBuffer() + index;
              const velocities = this.m_particleSystem.GetVelocityBuffer();
              ///  b2Vec2* const positions = this.m_particleSystem.GetPositionBuffer() + index;
              const positions = this.m_particleSystem.GetPositionBuffer();
              for (let i = 0; i < this.m_particleGroup.GetParticleCount(); i++) {
                  // Add energy to particles based upon the temperature.
                  ///  b2Vec2& v = velocities[i];
                  const v = velocities[index + i];
                  v.Normalize();
                  ///  v *= this.m_temperature;
                  v.SelfMul(this.m_temperature);
                  // Keep track of the number of particles above / below the
                  // divider / barrier position.
                  ///  b2Vec2& p = positions[i];
                  const p = positions[index + i];
                  if (p.y > this.m_position) {
                      top++;
                  }
                  else {
                      bottom++;
                  }
              }
          }
          // Calculate a score based upon the difference in pressure between the
          // upper and lower divisions of the container.
          const topPressure = top / (Maxwell.k_containerHeight - this.m_position);
          const botPressure = bottom / this.m_position;
          g_debugDraw.DrawString(10, 75, `Score: ${topPressure > 0.0 ? botPressure / topPressure - 1.0 : 0.0}`);
      }
      /**
       * Reset the particles and the barrier.
       */
      Reset() {
          this.DisableBarrier();
          this.ResetParticles();
          this.EnableBarrier();
      }
      /**
       * Move the divider / barrier.
       */
      MoveDivider(newPosition) {
          this.m_position = b2__namespace.Clamp(newPosition, Maxwell.k_barrierMovementIncrement, Maxwell.k_containerHeight - Maxwell.k_barrierMovementIncrement);
          this.Reset();
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new Maxwell();
      }
  }
  Maxwell.k_containerWidth = 2.0;
  Maxwell.k_containerHeight = 4.0;
  Maxwell.k_containerHalfWidth = Maxwell.k_containerWidth / 2.0;
  Maxwell.k_containerHalfHeight = Maxwell.k_containerHeight / 2.0;
  Maxwell.k_barrierHeight = Maxwell.k_containerHalfHeight / 100.0;
  Maxwell.k_barrierMovementIncrement = Maxwell.k_containerHalfHeight * 0.1;
  Maxwell.k_densityStep = 1.25;
  Maxwell.k_densityMin = 0.01;
  Maxwell.k_densityMax = 0.8;
  Maxwell.k_densityDefault = 0.25;
  Maxwell.k_temperatureStep = 0.2;
  Maxwell.k_temperatureMin = 0.4;
  Maxwell.k_temperatureMax = 10.0;
  Maxwell.k_temperatureDefault = 5.0;
  RegisterTest("Particles", "Maxwell", Maxwell.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class MultipleParticleSystems extends Test {
      constructor() {
          super();
          this.m_emitters = [
              new RadialEmitter(),
              new RadialEmitter(),
          ];
          // Configure the default particle system's parameters.
          this.m_particleSystem.SetRadius(0.05);
          this.m_particleSystem.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
          this.m_particleSystem.SetDestructionByAge(true);
          // Create a secondary particle system.
          const particleSystemDef = new b2__namespace.ParticleSystemDef();
          particleSystemDef.radius = this.m_particleSystem.GetRadius();
          particleSystemDef.destroyByAge = true;
          this.m_particleSystem2 = this.m_world.CreateParticleSystem(particleSystemDef);
          this.m_particleSystem2.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
          // Don't restart the test when changing particle types.
          Test.SetRestartOnParticleParameterChange(false);
          // Create the ground.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(5.0, 0.1);
              ground.CreateFixture(shape, 0.0);
          }
          // Create a dynamic body to push around.
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              const center = new b2__namespace.Vec2(0.0, 1.2);
              shape.SetAsBox(MultipleParticleSystems.k_dynamicBoxSize.x, MultipleParticleSystems.k_dynamicBoxSize.y, center, 0.0);
              body.CreateFixture(shape, 0.0);
              ///  b2MassData massData = { MultipleParticleSystems.k_boxMass, center, 0.0 };
              const massData = new b2__namespace.MassData();
              massData.mass = MultipleParticleSystems.k_boxMass;
              massData.center.Copy(center);
              massData.I = 0.0;
              body.SetMassData(massData);
          }
          // Initialize the emitters.
          for (let i = 0; i < this.m_emitters.length; ++i) {
              const mirrorAlongY = i & 1 ? -1.0 : 1.0;
              const emitter = this.m_emitters[i];
              emitter.SetPosition(new b2__namespace.Vec2(MultipleParticleSystems.k_emitterPosition.x * mirrorAlongY, MultipleParticleSystems.k_emitterPosition.y));
              emitter.SetSize(MultipleParticleSystems.k_emitterSize);
              emitter.SetVelocity(new b2__namespace.Vec2(MultipleParticleSystems.k_emitterVelocity.x * mirrorAlongY, MultipleParticleSystems.k_emitterVelocity.y));
              emitter.SetEmitRate(MultipleParticleSystems.k_emitRate);
              emitter.SetColor(i & 1 ? MultipleParticleSystems.k_rightEmitterColor : MultipleParticleSystems.k_leftEmitterColor);
              emitter.SetParticleSystem(i & 1 ? this.m_particleSystem2 : this.m_particleSystem);
          }
      }
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          for (let i = 0; i < this.m_emitters.length; ++i) {
              this.m_emitters[i].Step(dt);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new MultipleParticleSystems();
      }
  }
  /**
   * Maximum number of particles per system.
   */
  MultipleParticleSystems.k_maxParticleCount = 500;
  /**
   * Size of the box which is pushed around by particles.
   */
  MultipleParticleSystems.k_dynamicBoxSize = new b2__namespace.Vec2(0.5, 0.5);
  /**
   * Mass of the box.
   */
  MultipleParticleSystems.k_boxMass = 1.0;
  /**
   * Emit rate of the emitters in particles per second.
   */
  MultipleParticleSystems.k_emitRate = 100.0;
  /**
   * Location of the left emitter (the position of the right one
   * is mirrored along the y-axis).
   */
  MultipleParticleSystems.k_emitterPosition = new b2__namespace.Vec2(-5.0, 4.0);
  /**
   * Starting velocity of particles from the left emitter (the
   * velocity of particles from the right emitter are mirrored
   * along the y-axis).
   */
  MultipleParticleSystems.k_emitterVelocity = new b2__namespace.Vec2(7.0, -4.0);
  /**
   * Size of particle emitters.
   */
  MultipleParticleSystems.k_emitterSize = new b2__namespace.Vec2(1.0, 1.0);
  /**
   * Color of the left emitter's particles.
   */
  MultipleParticleSystems.k_leftEmitterColor = new b2__namespace.Color().SetByteRGBA(0x22, 0x33, 0xff, 0xff);
  /**
   * Color of the right emitter's particles.
   */
  MultipleParticleSystems.k_rightEmitterColor = new b2__namespace.Color().SetByteRGBA(0xff, 0x22, 0x11, 0xff);
  RegisterTest("Particles", "Multiple Systems", MultipleParticleSystems.Create);
  // #endif

  /*
  * Copyright (c) 2015 Google, Inc.
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
  // Optionally disables particle / fixture and particle / particle contacts.
  class ParticleContactDisabler extends b2__namespace.ContactFilter {
      constructor() {
          super(...arguments);
          this.m_enableFixtureParticleCollisions = true;
          this.m_enableParticleParticleCollisions = true;
      }
      // Blindly enable / disable collisions between fixtures and particles.
      ShouldCollideFixtureParticle() {
          return this.m_enableFixtureParticleCollisions;
      }
      // Blindly enable / disable collisions between particles.
      ShouldCollideParticleParticle() {
          return this.m_enableParticleParticleCollisions;
      }
  }
  class ParticleCollisionFilter extends Test {
      constructor() {
          super();
          this.m_contactDisabler = new ParticleContactDisabler();
          // must also set b2_particleContactFilterParticle and
          // b2_fixtureContactFilterParticle flags for particle group
          this.m_world.SetContactFilter(this.m_contactDisabler);
          this.m_world.SetGravity(new b2__namespace.Vec2(0, 0));
          // Create the container.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.ChainShape();
              const vertices = [
                  new b2__namespace.Vec2(-ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                  new b2__namespace.Vec2(ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                  new b2__namespace.Vec2(ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                  new b2__namespace.Vec2(-ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
              ];
              shape.CreateLoop(vertices);
              const def = new b2__namespace.FixtureDef();
              def.shape = shape;
              def.density = 0;
              def.density = 0;
              def.restitution = 1.0;
              ground.CreateFixture(def);
          }
          // create the particles
          this.m_particleSystem.SetRadius(0.5);
          {
              // b2PolygonShape shape;
              const shape = new b2__namespace.PolygonShape();
              // shape.SetAsBox(1.5f, 1.5f, b2Vec2(kBoxSizeHalf, kBoxSizeHalf + kOffset), 0.0f);
              shape.SetAsBox(1.5, 1.5, new b2__namespace.Vec2(ParticleCollisionFilter.kBoxSizeHalf, ParticleCollisionFilter.kBoxSizeHalf + ParticleCollisionFilter.kOffset), 0.0);
              // b2ParticleGroupDef pd;
              const pd = new b2__namespace.ParticleGroupDef();
              // pd.shape = &shape;
              pd.shape = shape;
              // pd.flags = b2_powderParticle
              // 		| b2_particleContactFilterParticle
              // 		| b2_fixtureContactFilterParticle;
              pd.flags = b2__namespace.ParticleFlag.b2_powderParticle
                  | b2__namespace.ParticleFlag.b2_particleContactFilterParticle
                  | b2__namespace.ParticleFlag.b2_fixtureContactFilterParticle;
              // m_particleGroup =
              // 	m_particleSystem.CreateParticleGroup(pd);
              this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);
              // b2Vec2* velocities =
              // 	m_particleSystem.GetVelocityBuffer() +
              // 	m_particleGroup.GetBufferIndex();
              const velocities = this.m_particleSystem.GetVelocityBuffer();
              const index = this.m_particleGroup.GetBufferIndex();
              // for (int i = 0; i < m_particleGroup.GetParticleCount(); ++i) {
              // 	b2Vec2& v = *(velocities + i);
              // 	v.Set(RandomFloat(), RandomFloat());
              // 	v.Normalize();
              // 	v *= kSpeedup;
              // }
              for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
                  const v = velocities[index + i];
                  v.Set(RandomFloat(), RandomFloat());
                  v.SelfNormalize();
                  v.SelfMul(ParticleCollisionFilter.kSpeedup);
              }
          }
      }
      Step(settings) {
          super.Step(settings);
          // const int32 index = m_particleGroup.GetBufferIndex();
          const index = this.m_particleGroup.GetBufferIndex();
          // b2Vec2* const velocities =
          // 	m_particleSystem.GetVelocityBuffer() + index;
          const velocities = this.m_particleSystem.GetVelocityBuffer();
          // for (int32 i = 0; i < m_particleGroup.GetParticleCount(); i++) {
          // 	// Add energy to particles based upon the temperature.
          // 	b2Vec2& v = velocities[i];
          // 	v.Normalize();
          // 	v *= kSpeedup;
          // }
          for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
              const v = velocities[index + i];
              v.SelfNormalize();
              v.SelfMul(ParticleCollisionFilter.kSpeedup);
          }
          // key help
          {
              const k_keys = [
                  "Keys: (a) toggle Fixture collisions",
                  "      (s) toggle particle collisions",
              ];
              for (let i = 0; i < k_keys.length; ++i) {
                  g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
                  this.m_textLine += DRAW_STRING_NEW_LINE;
              }
          }
      }
      Keyboard(key) {
          switch (key) {
              case "a":
                  this.ToggleFixtureCollisions();
                  break;
              case "s":
                  this.ToggleParticleCollisions();
                  break;
              default:
                  super.Keyboard(key);
                  break;
          }
      }
      ToggleFixtureCollisions() {
          this.m_contactDisabler.m_enableFixtureParticleCollisions = !this.m_contactDisabler.m_enableFixtureParticleCollisions;
      }
      ToggleParticleCollisions() {
          this.m_contactDisabler.m_enableParticleParticleCollisions = !this.m_contactDisabler.m_enableParticleParticleCollisions;
      }
      static Create() {
          return new ParticleCollisionFilter();
      }
  }
  ParticleCollisionFilter.kBoxSize = 10.0;
  ParticleCollisionFilter.kBoxSizeHalf = ParticleCollisionFilter.kBoxSize / 2;
  ParticleCollisionFilter.kOffset = 20.0;
  ParticleCollisionFilter.kParticlesContainerSize = ParticleCollisionFilter.kOffset + 0.5;
  ParticleCollisionFilter.kSpeedup = 8.0;
  RegisterTest("Particles", "Collision Filter", ParticleCollisionFilter.Create);
  // #endif

  /*
   * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class ParticlesSurfaceTension extends Test {
      constructor() {
          super(); // base class constructor
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -1),
                      new b2__namespace.Vec2(4, -1),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -0.1),
                      new b2__namespace.Vec2(-2, -0.1),
                      new b2__namespace.Vec2(-2, 2),
                      new b2__namespace.Vec2(-4, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -0.1),
                      new b2__namespace.Vec2(4, -0.1),
                      new b2__namespace.Vec2(4, 2),
                      new b2__namespace.Vec2(2, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 2);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_colorMixingParticle;
              pd.shape = shape;
              pd.color.Set(1, 0, 0, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(-1, 2);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_colorMixingParticle;
              pd.shape = shape;
              pd.color.Set(0, 1, 0, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              const vertices = [
                  new b2__namespace.Vec2(0, 3),
                  new b2__namespace.Vec2(2, 3),
                  new b2__namespace.Vec2(2, 3.5),
                  new b2__namespace.Vec2(0, 3.5),
              ];
              shape.Set(vertices, 4);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_colorMixingParticle;
              pd.shape = shape;
              pd.color.Set(0, 0, 1, 1);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 8);
              shape.m_radius = 0.5;
              body.CreateFixture(shape, 0.5);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new ParticlesSurfaceTension();
      }
  }
  RegisterTest("Particles", "Surface Tension", ParticlesSurfaceTension.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class Particles extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -1),
                      new b2__namespace.Vec2(4, -1),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -0.1),
                      new b2__namespace.Vec2(-2, -0.1),
                      new b2__namespace.Vec2(-2, 2),
                      new b2__namespace.Vec2(-4, 3),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -0.1),
                      new b2__namespace.Vec2(4, -0.1),
                      new b2__namespace.Vec2(4, 3),
                      new b2__namespace.Vec2(2, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
          const particleType = Test.GetParticleParameterValue();
          this.m_particleSystem.SetDamping(0.2);
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 3);
              shape.m_radius = 2;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = particleType;
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 8);
              shape.m_radius = 0.5;
              body.CreateFixture(shape, 0.5);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new Particles();
      }
  }
  RegisterTest("Particles", "Particles", Particles.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  /**
   * Test behavior when particles fall on a convex ambigious Body
   * contact fixture junction.
   */
  class Pointy extends Test {
      constructor() {
          super();
          this.m_killfieldShape = new b2__namespace.PolygonShape();
          this.m_killfieldTransform = new b2__namespace.Transform();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              // Construct a triangle out of many polygons to ensure there's no
              // issue with particles falling directly on an ambiguous corner
              const xstep = 1.0;
              for (let x = -10.0; x < 10.0; x += xstep) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(x, -10.0),
                      new b2__namespace.Vec2(x + xstep, -10.0),
                      new b2__namespace.Vec2(0.0, 25.0),
                  ];
                  shape.Set(vertices, 3);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
          const particleType = Test.GetParticleParameterValue();
          if (particleType === b2__namespace.ParticleFlag.b2_waterParticle) {
              this.m_particleSystem.SetDamping(0.2);
          }
          // Create killfield shape and transform
          this.m_killfieldShape = new b2__namespace.PolygonShape();
          this.m_killfieldShape.SetAsBox(50.0, 1.0);
          // Put this at the bottom of the world
          this.m_killfieldTransform = new b2__namespace.Transform();
          const loc = new b2__namespace.Vec2(-25, 1);
          this.m_killfieldTransform.SetPositionAngle(loc, 0);
      }
      Step(settings) {
          super.Step(settings);
          const flags = Test.GetParticleParameterValue();
          const pd = new b2__namespace.ParticleDef();
          pd.position.Set(0.0, 33.0);
          pd.velocity.Set(0.0, -1.0);
          pd.flags = flags;
          if (flags & (b2__namespace.ParticleFlag.b2_springParticle | b2__namespace.ParticleFlag.b2_elasticParticle)) {
              const count = this.m_particleSystem.GetParticleCount();
              pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
              pd.flags |= b2__namespace.ParticleFlag.b2_reactiveParticle;
          }
          this.m_particleSystem.CreateParticle(pd);
          // kill every particle near the bottom of the screen
          this.m_particleSystem.DestroyParticlesInShape(this.m_killfieldShape, this.m_killfieldTransform);
      }
      static Create() {
          return new Pointy();
      }
  }
  RegisterTest("Particles", "Pointy", Pointy.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class Ramp extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              // Construct a ramp out of many polygons to ensure there's no
              // issue with particles moving across vertices
              const xstep = 5.0, ystep = 5.0;
              for (let y = 30.0; y > 0.0; y -= ystep) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-25.0, y),
                      new b2__namespace.Vec2(-25.0, y - ystep),
                      new b2__namespace.Vec2(0.0, 15.0),
                  ];
                  shape.Set(vertices, 3);
                  ground.CreateFixture(shape, 0.0);
              }
              for (let x = -25.0; x < 25.0; x += xstep) {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(x, 0.0),
                      new b2__namespace.Vec2(x + xstep, 0.0),
                      new b2__namespace.Vec2(0.0, 15.0),
                  ];
                  shape.Set(vertices, 3);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.25);
          const particleType = Test.GetParticleParameterValue();
          if (particleType === b2__namespace.ParticleFlag.b2_waterParticle) {
              this.m_particleSystem.SetDamping(0.2);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(-20, 33);
              shape.m_radius = 3;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = particleType;
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
      }
      static Create() {
          return new Ramp();
      }
  }
  RegisterTest("Particles", "Ramp", Ramp.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class RigidParticles extends Test {
      constructor() {
          super();
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -1),
                      new b2__namespace.Vec2(4, -1),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -0.1),
                      new b2__namespace.Vec2(-2, -0.1),
                      new b2__namespace.Vec2(-2, 2),
                      new b2__namespace.Vec2(-4, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -0.1),
                      new b2__namespace.Vec2(4, -0.1),
                      new b2__namespace.Vec2(4, 2),
                      new b2__namespace.Vec2(2, 2),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 3);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.shape = shape;
              pd.color.SetByteRGBA(255, 0, 0, 255);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(-1, 3);
              shape.m_radius = 0.5;
              const pd = new b2__namespace.ParticleGroupDef();
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.shape = shape;
              pd.color.SetByteRGBA(0, 255, 0, 255);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const shape = new b2__namespace.PolygonShape();
              //const vertices = [
              //  new b2.Vec2(0, 3),
              //  new b2.Vec2(2, 3),
              //  new b2.Vec2(2, 3.5),
              //  new b2.Vec2(0, 3.5)
              //];
              //shape.Set(vertices, 4);
              shape.SetAsBox(1, 0.5);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.groupFlags = b2__namespace.ParticleGroupFlag.b2_rigidParticleGroup | b2__namespace.ParticleGroupFlag.b2_solidParticleGroup;
              pd.position.Set(1, 4);
              pd.angle = -0.5;
              pd.angularVelocity = 2.0;
              pd.shape = shape;
              pd.color.SetByteRGBA(0, 0, 255, 255);
              this.m_particleSystem.CreateParticleGroup(pd);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 8);
              shape.m_radius = 0.5;
              body.CreateFixture(shape, 0.5);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new RigidParticles();
      }
  }
  RegisterTest("Particles", "Rigid Particles", RigidParticles.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  // /**
  //  * The following parameters are not static const members of the
  //  * Sandbox class with values assigned inline as it can result in
  //  * link errors when using gcc.
  //  */
  // SandboxParams = {};
  class SandboxParams {
  }
  /**
   * Total possible pump squares
   */
  SandboxParams.k_maxPumps = 5;
  /**
   * Total possible emitters
   */
  SandboxParams.k_maxEmitters = 5;
  /**
   * Number of seconds to push one direction or the other on the
   * pumps
   */
  SandboxParams.k_flipTime = 6;
  /**
   * Radius of a tile
   */
  SandboxParams.k_tileRadius = 2;
  /**
   * Diameter of a tile
   */
  SandboxParams.k_tileDiameter = 4;
  /**
   * Pump radius; slightly smaller than a tile
   */
  SandboxParams.k_pumpRadius = 2.0 - 0.05;
  SandboxParams.k_playfieldLeftEdge = -20;
  SandboxParams.k_playfieldRightEdge = 20;
  SandboxParams.k_playfieldBottomEdge = 40;
  /**
   * The world size in the TILE
   */
  SandboxParams.k_tileWidth = 10;
  SandboxParams.k_tileHeight = 11;
  /**
   * Particles/second
   */
  SandboxParams.k_defaultEmitterRate = 30;
  /**
   * Fit cleanly inside one block
   */
  SandboxParams.k_defaultEmitterSize = 3;
  /**
   * How fast particles coming out of the particles should drop
   */
  SandboxParams.k_particleExitSpeedY = -9.8;
  /**
   * How hard the pumps can push
   */
  SandboxParams.k_pumpForce = 600;
  /**
   * Number of *special* particles.
   */
  SandboxParams.k_numberOfSpecialParticles = 256;
  /**
   * Class which tracks a set of particles and applies a special
   * effect to them.
   */
  class SpecialParticleTracker extends b2__namespace.DestructionListener {
      /**
       * Register this class as a destruction listener so that it's
       * possible to keep track of special particles.
       */
      constructor(world, system) {
          super();
          /**
           * Set of particle handles used to track special particles.
           */
          this.m_particles = [];
          /**
           * Current offset into this.m_colorOscillationPeriod.
           */
          this.m_colorOscillationTime = 0.0;
          /**
           * Color oscillation period in seconds.
           */
          this.m_colorOscillationPeriod = 2.0;
          // DEBUG: b2.Assert(world !== null);
          // DEBUG: b2.Assert(system !== null);
          this.m_world = world;
          this.m_particleSystem = system;
          this.m_world.SetDestructionListener(this);
      }
      __dtor__() {
          this.m_world.SetDestructionListener(null);
      }
      /**
       * Add as many of the specified particles to the set of special
       * particles.
       */
      Add(particleIndices, numberOfParticles) {
          // DEBUG: b2.Assert(this.m_particleSystem !== null);
          for (let i = 0; i < numberOfParticles && this.m_particles.length < SandboxParams.k_numberOfSpecialParticles; ++i) {
              const particleIndex = particleIndices[i];
              this.m_particleSystem.SetParticleFlags(particleIndex, this.m_particleSystem.GetFlagsBuffer()[particleIndex] | b2__namespace.ParticleFlag.b2_destructionListenerParticle);
              this.m_particles.push(this.m_particleSystem.GetParticleHandleFromIndex(particleIndex));
          }
      }
      /**
       * Apply effects to special particles.
       */
      Step(dt) {
          function fmod(a, b) {
              return (a - (Math.floor(a / b) * b));
          }
          // Oscillate the shade of color over this.m_colorOscillationPeriod seconds.
          this.m_colorOscillationTime = fmod(this.m_colorOscillationTime + dt, this.m_colorOscillationPeriod);
          const colorCoeff = 2.0 * Math.abs((this.m_colorOscillationTime / this.m_colorOscillationPeriod) - 0.5);
          const color = new b2__namespace.Color().SetByteRGBA(128 + (128.0 * (1.0 - colorCoeff)), 128 + (256.0 * Math.abs(0.5 - colorCoeff)), 128 + (128.0 * colorCoeff), 255);
          // Update the color of all special particles.
          for (let i = 0; i < this.m_particles.length; ++i) {
              this.m_particleSystem.GetColorBuffer()[this.m_particles[i].GetIndex()].Copy(color);
          }
      }
      SayGoodbyeJoint(joint) { }
      SayGoodbyeFixture(fixture) { }
      SayGoodbyeParticleGroup(group) { }
      /**
       * When a particle is about to be destroyed, remove it from the
       * list of special particles as the handle will become invalid.
       */
      SayGoodbyeParticle(particleSystem, index) {
          if (particleSystem !== this.m_particleSystem) {
              return;
          }
          // NOTE: user data could be used as an alternative method to look up
          // the local handle pointer from the index.
          // DEBUG: const length = this.m_particles.length;
          this.m_particles = this.m_particles.filter((value) => {
              return value.GetIndex() !== index;
          });
          // DEBUG: b2.Assert((length - this.m_particles.length) === 1);
      }
  }
  /**
   * Sandbox test creates a maze of faucets, pumps, ramps,
   * circles, and blocks based on a string constant.  Please
   * modify and play with this string to make new mazes, and also
   * add new maze elements!
   */
  class Sandbox extends Test {
      constructor() {
          super();
          /**
           * Count of faucets in the world
           */
          this.m_faucetEmitterIndex = 0;
          /**
           * Count of pumps in the world
           */
          this.m_pumpIndex = 0;
          /**
           * How long have we been pushing the pumps?
           */
          this.m_pumpTimer = 0.0;
          /**
           * Particle creation flags
           */
          this.m_particleFlags = 0;
          /**
           * Pump force
           */
          this.m_pumpForce = new b2__namespace.Vec2();
          /**
           * Pumps and emitters
           */
          this.m_pumps = [];
          this.m_emitters = [];
          // We need some ground for the pumps to slide against
          const bd = new b2__namespace.BodyDef();
          const ground = this.m_world.CreateBody(bd);
          // Reset our pointers
          for (let i = 0; i < SandboxParams.k_maxEmitters; i++) {
              this.m_emitters[i] = null;
          }
          for (let i = 0; i < SandboxParams.k_maxPumps; i++) {
              this.m_pumps[i] = null;
          }
          this.m_world.SetGravity(new b2__namespace.Vec2(0.0, -20));
          // Create physical box, no top
          {
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-40, -10),
                      new b2__namespace.Vec2(40, -10),
                      new b2__namespace.Vec2(40, 0),
                      new b2__namespace.Vec2(-40, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(SandboxParams.k_playfieldLeftEdge - 20, -1),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldLeftEdge, -1),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldLeftEdge, 50),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldLeftEdge - 20, 50),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(SandboxParams.k_playfieldRightEdge, -1),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldRightEdge + 20, -1),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldRightEdge + 20, 50),
                      new b2__namespace.Vec2(SandboxParams.k_playfieldRightEdge, 50),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.25);
          this.m_specialTracker = new SpecialParticleTracker(this.m_world, this.m_particleSystem);
          this.m_pumpTimer = 0;
          this.SetupMaze();
          // Create killfield shape and transform
          this.m_killFieldShape = new b2__namespace.PolygonShape();
          this.m_killFieldShape.SetAsBox(SandboxParams.k_playfieldRightEdge - SandboxParams.k_playfieldLeftEdge, 1);
          // Put this at the bottom of the world
          this.m_killFieldTransform = new b2__namespace.Transform();
          const loc = new b2__namespace.Vec2(-20, 1);
          this.m_killFieldTransform.SetPositionAngle(loc, 0);
          // Setup particle parameters.
          Test.SetParticleParameters(Sandbox.k_paramDef, Sandbox.k_paramDefCount);
          this.m_particleFlags = Test.GetParticleParameterValue();
          Test.SetRestartOnParticleParameterChange(false);
      }
      __dtor__() {
          // deallocate our emitters
          for (let i = 0; i < this.m_faucetEmitterIndex; i++) {
              ///  delete this.m_emitters[i];
              this.m_emitters[i] = null;
          }
      }
      // Create a maze of blocks, ramps, pumps, and faucets.
      // The maze is defined in a string; feel free to modify it.
      // Items in the maze include:
      //   # = a block
      //   / = a right-to-left ramp triangle
      //   A = a left-to-right ramp triangle (can't be \ or string formatting
      //       would be weird)
      //   r, g, b = colored faucets pointing down
      //   p = a pump block that rocks back and forth.  You can drag them
      //       yourself with your finger.
      //   C = a loose circle
      //   K = an ignored placeholder for a killfield to remove particles;
      //       entire bottom row is a killfield.
      SetupMaze() {
          const maze = "# r#g #r##" +
              "  /#  #  #" +
              " ###     p" +
              "A  #  /###" +
              "## # /#  C" +
              "  /# #   #" +
              " ### # / #" +
              " ## p /#  " +
              " #  ####  " +
              "A        /" +
              "#####KK###";
          // DEBUG: b2.Assert(maze.length === SandboxParams.k_tileWidth * SandboxParams.k_tileHeight);
          this.m_faucetEmitterIndex = 0;
          this.m_pumpIndex = 0;
          // Set up some standard shapes/vertices we'll use later.
          const boxShape = new b2__namespace.PolygonShape();
          boxShape.SetAsBox(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
          ///  b2Vec2 triangle[3];
          const triangle = b2__namespace.Vec2.MakeArray(3);
          triangle[0].Set(-SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
          triangle[1].Set(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
          triangle[2].Set(SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
          const rightTriangleShape = new b2__namespace.PolygonShape();
          rightTriangleShape.Set(triangle, 3);
          triangle[1].Set(-SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
          const leftTriangleShape = new b2__namespace.PolygonShape();
          leftTriangleShape.Set(triangle, 3);
          // Make these just a touch smaller than a tile
          const circleShape = new b2__namespace.CircleShape();
          circleShape.m_radius = SandboxParams.k_tileRadius * 0.7;
          const red = new b2__namespace.Color().SetByteRGBA(255, 128, 128, 255);
          const green = new b2__namespace.Color().SetByteRGBA(128, 255, 128, 255);
          const blue = new b2__namespace.Color().SetByteRGBA(128, 128, 255, 255);
          this.m_pumpForce.Set(SandboxParams.k_pumpForce, 0);
          for (let i = 0; i < SandboxParams.k_tileWidth; i++) {
              for (let j = 0; j < SandboxParams.k_tileHeight; j++) {
                  const item = maze[j * SandboxParams.k_tileWidth + i];
                  // Calculate center of this square
                  const center = new b2__namespace.Vec2(SandboxParams.k_playfieldLeftEdge + SandboxParams.k_tileRadius * 2 * i + SandboxParams.k_tileRadius, SandboxParams.k_playfieldBottomEdge - SandboxParams.k_tileRadius * 2 * j +
                      SandboxParams.k_tileRadius);
                  // Let's add some items
                  switch (item) {
                      case "#":
                          // Block
                          this.CreateBody(center, boxShape, b2__namespace.BodyType.b2_staticBody);
                          break;
                      case "A":
                          // Left-to-right ramp
                          this.CreateBody(center, leftTriangleShape, b2__namespace.BodyType.b2_staticBody);
                          break;
                      case "/":
                          // Right-to-left ramp
                          this.CreateBody(center, rightTriangleShape, b2__namespace.BodyType.b2_staticBody);
                          break;
                      case "C":
                          // A circle to play with
                          this.CreateBody(center, circleShape, b2__namespace.BodyType.b2_dynamicBody);
                          break;
                      case "p":
                          this.AddPump(center);
                          break;
                      case "b":
                          // Blue emitter
                          this.AddFaucetEmitter(center, blue);
                          break;
                      case "r":
                          // Red emitter
                          this.AddFaucetEmitter(center, red);
                          break;
                      case "g":
                          // Green emitter
                          this.AddFaucetEmitter(center, green);
                          break;
                  }
              }
          }
      }
      CreateBody(center, shape, type) {
          const def = new b2__namespace.BodyDef();
          def.position.Copy(center);
          def.type = type;
          const body = this.m_world.CreateBody(def);
          body.CreateFixture(shape, 10.0);
      }
      // Inititalizes a pump and its prismatic joint, and adds it to the world
      AddPump(center) {
          // Don't make too many pumps
          // DEBUG: b2.Assert(this.m_pumpIndex < SandboxParams.k_maxPumps);
          const shape = new b2__namespace.PolygonShape();
          shape.SetAsBox(SandboxParams.k_pumpRadius, SandboxParams.k_pumpRadius);
          const def = new b2__namespace.BodyDef();
          def.position.Copy(center);
          def.type = b2__namespace.BodyType.b2_dynamicBody;
          def.angle = 0;
          const body = this.m_world.CreateBody(def);
          body.CreateFixture(shape, 5.0);
          // Create a prismatic joint and connect to the ground, and have it
          // slide along the x axis.
          const prismaticJointDef = new b2__namespace.PrismaticJointDef();
          prismaticJointDef.bodyA = this.m_groundBody;
          prismaticJointDef.bodyB = body;
          prismaticJointDef.collideConnected = false;
          prismaticJointDef.localAxisA.Set(1, 0);
          prismaticJointDef.localAnchorA.Copy(center);
          this.m_world.CreateJoint(prismaticJointDef);
          this.m_pumps[this.m_pumpIndex] = body;
          this.m_pumpIndex++;
      }
      // Initializes and adds a faucet emitter
      AddFaucetEmitter(center, color) {
          // Don't make too many emitters
          // DEBUG: b2.Assert(this.m_faucetEmitterIndex < SandboxParams.k_maxPumps);
          const startingVelocity = new b2__namespace.Vec2(0, SandboxParams.k_particleExitSpeedY);
          const emitter = new RadialEmitter();
          emitter.SetParticleSystem(this.m_particleSystem);
          emitter.SetPosition(center);
          emitter.SetVelocity(startingVelocity);
          emitter.SetSize(new b2__namespace.Vec2(SandboxParams.k_defaultEmitterSize, 0.0));
          emitter.SetEmitRate(SandboxParams.k_defaultEmitterRate);
          emitter.SetColor(color);
          this.m_emitters[this.m_faucetEmitterIndex] = emitter;
          this.m_faucetEmitterIndex++;
      }
      JointDestroyed(joint) {
          super.JointDestroyed(joint);
      }
      ParticleGroupDestroyed(group) {
          super.ParticleGroupDestroyed(group);
      }
      BeginContact(contact) {
          super.BeginContact(contact);
      }
      EndContact(contact) {
          super.EndContact(contact);
      }
      PreSolve(contact, oldManifold) {
          super.PreSolve(contact, oldManifold);
      }
      PostSolve(contact, impulse) {
          super.PostSolve(contact, impulse);
      }
      /**
       * Allows you to set particle flags on devices with keyboards
       */
      Keyboard(key) {
          super.Keyboard(key);
          let toggle = 0;
          switch (key) {
              case "a":
                  this.m_particleFlags = 0;
                  break;
              case "q":
                  toggle = b2__namespace.ParticleFlag.b2_powderParticle;
                  break;
              case "t":
                  toggle = b2__namespace.ParticleFlag.b2_tensileParticle;
                  break;
              case "v":
                  toggle = b2__namespace.ParticleFlag.b2_viscousParticle;
                  break;
              case "w":
                  toggle = b2__namespace.ParticleFlag.b2_wallParticle;
                  break;
          }
          if (toggle) {
              if (this.m_particleFlags & toggle) {
                  this.m_particleFlags = this.m_particleFlags & ~toggle;
              }
              else {
                  this.m_particleFlags = this.m_particleFlags | toggle;
              }
          }
          Test.SetParticleParameterValue(this.m_particleFlags);
      }
      KeyboardUp(key) {
          super.KeyboardUp(key);
      }
      MouseDown(p) {
          super.MouseDown(p);
      }
      MouseUp(p) {
          super.MouseUp(p);
      }
      MouseMove(p) {
          super.MouseMove(p);
      }
      /**
       * Per-frame step updater overridden from Test
       */
      Step(settings) {
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          this.m_particleFlags = Test.GetParticleParameterValue();
          // Step all the emitters
          for (let i = 0; i < this.m_faucetEmitterIndex; i++) {
              const particleIndices = [];
              const emitter = this.m_emitters[i];
              if (emitter) {
                  emitter.SetParticleFlags(this.m_particleFlags);
                  const particlesCreated = emitter.Step(dt, particleIndices, SandboxParams.k_numberOfSpecialParticles);
                  this.m_specialTracker.Add(particleIndices, particlesCreated);
              }
          }
          // Step the special tracker.
          this.m_specialTracker.Step(dt);
          // Do killfield work--kill every particle near the bottom of the screen
          this.m_particleSystem.DestroyParticlesInShape(this.m_killFieldShape, this.m_killFieldTransform);
          // Move the pumps
          for (let i = 0; i < this.m_pumpIndex; i++) {
              const pump = this.m_pumps[i];
              if (pump) {
                  // Pumps can and will clog up if the pile of particles they're
                  // trying to push is too heavy. Increase k_pumpForce to make
                  // stronger pumps.
                  pump.ApplyForceToCenter(this.m_pumpForce, true);
              }
              this.m_pumpTimer += dt;
              // Reset pump to go back right again
              if (this.m_pumpTimer > SandboxParams.k_flipTime) {
                  this.m_pumpTimer -= SandboxParams.k_flipTime;
                  this.m_pumpForce.x *= -1;
              }
          }
          g_debugDraw.DrawString(5, this.m_textLine, "Keys: (a) zero out (water), (q) powder");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          g_debugDraw.DrawString(5, this.m_textLine, "      (t) tensile, (v) viscous");
          this.m_textLine += DRAW_STRING_NEW_LINE;
      }
      GetDefaultViewZoom() {
          return super.GetDefaultViewZoom();
      }
      static Create() {
          return new Sandbox();
      }
  }
  Sandbox.k_paramValues = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions, "water"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "viscous"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "tensile powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle | b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "viscous powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle | b2__namespace.ParticleFlag.b2_tensileParticle | b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "viscous tensile powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle | b2__namespace.ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile viscous water"),
  ];
  Sandbox.k_paramDef = [
      new ParticleParameterDefinition(Sandbox.k_paramValues),
  ];
  Sandbox.k_paramDefCount = Sandbox.k_paramDef.length;
  RegisterTest("Particles", "Sandbox", Sandbox.Create);
  // #endif

  /*
   * Copyright (c) 2013 Google, Inc.
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
  class Soup extends Test {
      constructor() {
          super();
          // Disable the selection of wall and barrier particles for this test.
          this.InitializeParticleParameters(b2__namespace.ParticleFlag.b2_wallParticle | b2__namespace.ParticleFlag.b2_barrierParticle);
          {
              const bd = new b2__namespace.BodyDef();
              this.m_ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -1),
                      new b2__namespace.Vec2(4, -1),
                      new b2__namespace.Vec2(4, 0),
                      new b2__namespace.Vec2(-4, 0),
                  ];
                  shape.Set(vertices, 4);
                  this.m_ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-4, -0.1),
                      new b2__namespace.Vec2(-2, -0.1),
                      new b2__namespace.Vec2(-2, 2),
                      new b2__namespace.Vec2(-4, 3),
                  ];
                  shape.Set(vertices, 4);
                  this.m_ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(2, -0.1),
                      new b2__namespace.Vec2(4, -0.1),
                      new b2__namespace.Vec2(4, 3),
                      new b2__namespace.Vec2(2, 2),
                  ];
                  shape.Set(vertices, 4);
                  this.m_ground.CreateFixture(shape, 0.0);
              }
          }
          this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
          {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(2, 1, new b2__namespace.Vec2(0, 1), 0);
              const pd = new b2__namespace.ParticleGroupDef();
              pd.shape = shape;
              pd.flags = Test.GetParticleParameterValue();
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(0, 0.5);
              shape.m_radius = 0.1;
              body.CreateFixture(shape, 0.1);
              this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.1, 0.1, new b2__namespace.Vec2(-1, 0.5), 0);
              body.CreateFixture(shape, 0.1);
              this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.1, 0.1, new b2__namespace.Vec2(1, 0.5), 0.5);
              body.CreateFixture(shape, 0.1);
              this.m_particleSystem.DestroyParticlesInShape(shape, body.GetTransform());
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(0, 2), new b2__namespace.Vec2(0.1, 2.1));
              body.CreateFixture(shape, 1);
              ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
              const massData = new b2__namespace.MassData();
              massData.mass = 0.1;
              massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
              massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
              massData.I = 0.0;
              body.SetMassData(massData);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(0.3, 2.0), new b2__namespace.Vec2(0.4, 2.1));
              body.CreateFixture(shape, 1);
              ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
              const massData = new b2__namespace.MassData();
              massData.mass = 0.1;
              massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
              massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
              massData.I = 0.0;
              body.SetMassData(massData);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-0.3, 2.1), new b2__namespace.Vec2(-0.2, 2.0));
              body.CreateFixture(shape, 1);
              ///  b2MassData massData = {0.1f, 0.5f * (shape.m_vertex1 + shape.m_vertex2), 0.0f};
              const massData = new b2__namespace.MassData();
              massData.mass = 0.1;
              massData.center.x = 0.5 * shape.m_vertex1.x + shape.m_vertex2.x;
              massData.center.y = 0.5 * shape.m_vertex1.y + shape.m_vertex2.y;
              massData.I = 0.0;
              body.SetMassData(massData);
          }
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new Soup();
      }
  }
  RegisterTest("Particles", "Soup", Soup.Create);
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class SoupStirrer extends Soup {
      constructor() {
          super();
          this.m_joint = null;
          this.m_oscillationOffset = 0.0;
          this.m_particleSystem.SetDamping(1.0);
          // Shape of the stirrer.
          const shape = new b2__namespace.CircleShape();
          shape.m_p.Set(0, 0.7);
          shape.m_radius = 0.4;
          // Create the stirrer.
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          this.m_stirrer = this.m_world.CreateBody(bd);
          this.m_stirrer.CreateFixture(shape, 1.0);
          // Destroy all particles under the stirrer.
          const xf = new b2__namespace.Transform();
          xf.SetIdentity();
          this.m_particleSystem.DestroyParticlesInShape(shape, xf);
          // By default attach the body to a joint to restrict movement.
          this.CreateJoint();
      }
      CreateJoint() {
          // DEBUG: b2.Assert(!this.m_joint);
          // Create a prismatic joint and connect to the ground, and have it
          // slide along the x axis.
          // Disconnect the body from this joint to have more fun.
          const prismaticJointDef = new b2__namespace.PrismaticJointDef();
          prismaticJointDef.bodyA = this.m_groundBody;
          prismaticJointDef.bodyB = this.m_stirrer;
          prismaticJointDef.collideConnected = true;
          prismaticJointDef.localAxisA.Set(1, 0);
          prismaticJointDef.localAnchorA.Copy(this.m_stirrer.GetPosition());
          this.m_joint = this.m_world.CreateJoint(prismaticJointDef);
      }
      /**
       * Enable the joint if it's disabled, disable it if it's
       * enabled.
       */
      ToggleJoint() {
          if (this.m_joint) {
              this.m_world.DestroyJoint(this.m_joint);
              this.m_joint = null;
          }
          else {
              this.CreateJoint();
          }
      }
      /**
       * Press "t" to enable / disable the joint restricting the
       * stirrer's movement.
       */
      Keyboard(key) {
          switch (key) {
              case "t":
                  this.ToggleJoint();
                  break;
              default:
                  super.Keyboard(key);
                  break;
          }
      }
      /**
       * Click the soup to toggle between enabling / disabling the
       * joint.
       */
      MouseUp(p) {
          super.MouseUp(p);
          if (this.InSoup(p)) {
              this.ToggleJoint();
          }
      }
      /**
       * Determine whether a point is in the soup.
       */
      InSoup(pos) {
          // The soup dimensions are from the container initialization in the
          // Soup test.
          return pos.y > -1.0 && pos.y < 2.0 && pos.x > -3.0 && pos.x < 3.0;
      }
      /**
       * Apply a force to the stirrer.
       */
      Step(settings) {
          // Magnitude of the force applied to the body.
          const k_forceMagnitude = 10.0;
          // How often the force vector rotates.
          const k_forceOscillationPerSecond = 0.2;
          const k_forceOscillationPeriod = 1.0 / k_forceOscillationPerSecond;
          // Maximum speed of the body.
          const k_maxSpeed = 2.0;
          this.m_oscillationOffset += (1.0 / settings.m_hertz);
          if (this.m_oscillationOffset > k_forceOscillationPeriod) {
              this.m_oscillationOffset -= k_forceOscillationPeriod;
          }
          // Calculate the force vector.
          const forceAngle = this.m_oscillationOffset * k_forceOscillationPerSecond * 2.0 * b2__namespace.pi;
          const forceVector = new b2__namespace.Vec2(Math.sin(forceAngle), Math.cos(forceAngle)).SelfMul(k_forceMagnitude);
          // Only apply force to the body when it's within the soup.
          if (this.InSoup(this.m_stirrer.GetPosition()) &&
              this.m_stirrer.GetLinearVelocity().Length() < k_maxSpeed) {
              this.m_stirrer.ApplyForceToCenter(forceVector, true);
          }
          super.Step(settings);
      }
      static Create() {
          return new SoupStirrer();
      }
  }
  RegisterTest("Particles", "Soup Stirrer", SoupStirrer.Create);
  // #endif

  /*
  * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class ParticleVFX {
      constructor(particleSystem, origin, size, speed, lifetime, particleFlags) {
          this.m_initialLifetime = 0.0;
          this.m_remainingLifetime = 0.0;
          this.m_halfLifetime = 0.0;
          this.m_origColor = new b2__namespace.Color();
          // Create a circle to house the particles of size size
          const shape = new b2__namespace.CircleShape();
          shape.m_p.Copy(origin);
          shape.m_radius = size;
          // Create particle def of random color.
          const pd = new b2__namespace.ParticleGroupDef();
          pd.flags = particleFlags;
          pd.shape = shape;
          // this.m_origColor.Set(
          //   Math.random(),
          //   Math.random(),
          //   Math.random(),
          //   1.0);
          function hue2rgb(p, q, t) {
              if (t < 0) {
                  t += 1;
              }
              if (t > 1) {
                  t -= 1;
              }
              if (t < 1 / 6) {
                  return p + (q - p) * 6 * t;
              }
              if (t < 1 / 2) {
                  return q;
              }
              if (t < 2 / 3) {
                  return p + (q - p) * (2 / 3 - t) * 6;
              }
              return p;
          }
          function hslToRgb(h, s, l, a = 1) {
              let r, g, b;
              if (s === 0) {
                  r = g = b = l; // achromatic
              }
              else {
                  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                  const p = 2 * l - q;
                  r = hue2rgb(p, q, h + 1 / 3);
                  g = hue2rgb(p, q, h);
                  b = hue2rgb(p, q, h - 1 / 3);
              }
              return { r, g, b, a };
          }
          this.m_origColor.Copy(hslToRgb(Math.random(), 1, 0.5));
          pd.color.Copy(this.m_origColor);
          this.m_particleSystem = particleSystem;
          // Create a circle full of particles
          this.m_pg = this.m_particleSystem.CreateParticleGroup(pd);
          this.m_initialLifetime = this.m_remainingLifetime = lifetime;
          this.m_halfLifetime = this.m_initialLifetime * 0.5;
          // Set particle initial velocity based on how far away it is from
          // origin, exploding outwards.
          const bufferIndex = this.m_pg.GetBufferIndex();
          const pos = this.m_particleSystem.GetPositionBuffer();
          const vel = this.m_particleSystem.GetVelocityBuffer();
          for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
              ///  vel[i] = pos[i] - origin;
              b2__namespace.Vec2.SubVV(pos[i], origin, vel[i]);
              ///  vel[i] *= speed;
              b2__namespace.Vec2.MulVS(vel[i], speed, vel[i]);
          }
      }
      Drop() {
          this.m_pg.DestroyParticles(false);
          // this.m_pg = null;
      }
      ColorCoeff() {
          if (this.m_remainingLifetime >= this.m_halfLifetime) {
              return 1.0;
          }
          return 1.0 - ((this.m_halfLifetime - this.m_remainingLifetime) / this.m_halfLifetime);
      }
      Step(dt) {
          if (dt > 0 && this.m_remainingLifetime > 0.0) {
              this.m_remainingLifetime = Math.max(this.m_remainingLifetime - dt, 0.0);
              const coeff = this.ColorCoeff();
              const colors = this.m_particleSystem.GetColorBuffer();
              const bufferIndex = this.m_pg.GetBufferIndex();
              // Set particle colors all at once.
              for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
                  const c = colors[i];
                  // c *= coeff;
                  // c.SelfMul(coeff);
                  // c.a = this.m_origColor.a;
                  c.a *= coeff;
              }
          }
      }
      IsDone() {
          return this.m_remainingLifetime <= 0.0;
      }
  }
  class Sparky extends Test {
      constructor() {
          super();
          this.m_VFXIndex = 0;
          this.m_VFX = [];
          this.m_contact = false;
          this.m_contactPoint = new b2__namespace.Vec2();
          // Set up array of sparks trackers.
          this.m_VFXIndex = 0;
          for (let i = 0; i < Sparky.c_maxVFX; i++) {
              this.m_VFX[i] = null;
          }
          this.CreateWalls();
          this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
          // Create a list of circles that will spark.
          for (let i = 0; i < Sparky.c_maxCircles; i++) {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Set(3.0 * RandomFloat(), Sparky.SHAPE_HEIGHT_OFFSET + Sparky.SHAPE_OFFSET * i);
              shape.m_radius = 2;
              const f = body.CreateFixture(shape, 0.5);
              // Tag this as a sparkable body.
              f.SetUserData({
                  spark: true,
              });
          }
          Test.SetRestartOnParticleParameterChange(false);
          Test.SetParticleParameterValue(b2__namespace.ParticleFlag.b2_powderParticle);
      }
      BeginContact(contact) {
          super.BeginContact(contact);
          // Check to see if these are two circles hitting one another.
          const userA = contact.GetFixtureA().GetUserData();
          const userB = contact.GetFixtureB().GetUserData();
          if ((userA && userA.spark) ||
              (userB && userB.spark)) {
              const worldManifold = new b2__namespace.WorldManifold();
              contact.GetWorldManifold(worldManifold);
              // Note that we overwrite any contact; if there are two collisions
              // on the same frame, only the last one showers sparks.
              // Two collisions are rare, and this also guarantees we will not
              // run out of places to store ParticleVFX explosions.
              this.m_contactPoint.Copy(worldManifold.points[0]);
              this.m_contact = true;
          }
      }
      Step(settings) {
          const particleFlags = Test.GetParticleParameterValue();
          let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
          if (settings.m_pause && !settings.m_singleStep) {
              dt = 0.0;
          }
          super.Step(settings);
          // If there was a contacts...
          if (this.m_contact) {
              // ...explode!
              this.AddVFX(this.m_contactPoint, particleFlags);
              this.m_contact = false;
          }
          // Step particle explosions.
          for (let i = 0; i < Sparky.c_maxVFX; i++) {
              const vfx = this.m_VFX[i];
              if (vfx === null) {
                  continue;
              }
              vfx.Step(dt);
              if (vfx.IsDone()) {
                  /// delete vfx;
                  vfx.Drop();
                  this.m_VFX[i] = null;
              }
          }
      }
      AddVFX(p, particleFlags) {
          const vfx = this.m_VFX[this.m_VFXIndex];
          if (vfx !== null) {
              /// delete vfx;
              vfx.Drop();
              this.m_VFX[this.m_VFXIndex] = null;
          }
          this.m_VFX[this.m_VFXIndex] = new ParticleVFX(this.m_particleSystem, p, RandomFloat(1.0, 2.0), RandomFloat(10.0, 20.0), RandomFloat(0.5, 1.0), particleFlags);
          if (++this.m_VFXIndex >= Sparky.c_maxVFX) {
              this.m_VFXIndex = 0;
          }
      }
      CreateWalls() {
          // Create the walls of the world.
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-40, -10),
                      new b2__namespace.Vec2(40, -10),
                      new b2__namespace.Vec2(40, 0),
                      new b2__namespace.Vec2(-40, 0),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-40, 40),
                      new b2__namespace.Vec2(40, 40),
                      new b2__namespace.Vec2(40, 50),
                      new b2__namespace.Vec2(-40, 50),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(-40, -10),
                      new b2__namespace.Vec2(-20, -10),
                      new b2__namespace.Vec2(-20, 50),
                      new b2__namespace.Vec2(-40, 50),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
              {
                  const shape = new b2__namespace.PolygonShape();
                  const vertices = [
                      new b2__namespace.Vec2(20, -10),
                      new b2__namespace.Vec2(40, -10),
                      new b2__namespace.Vec2(40, 50),
                      new b2__namespace.Vec2(20, 50),
                  ];
                  shape.Set(vertices, 4);
                  ground.CreateFixture(shape, 0.0);
              }
          }
      }
      static Create() {
          return new Sparky();
      }
  }
  Sparky.c_maxCircles = 3; ///6;
  Sparky.c_maxVFX = 20; ///50;
  Sparky.SHAPE_HEIGHT_OFFSET = 7;
  Sparky.SHAPE_OFFSET = 4.5;
  RegisterTest("Particles", "Sparky", Sparky.Create);
  // #endif

  /*
   * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
  class WaveMachine extends Test {
      constructor() {
          super();
          this.m_time = 0;
          let ground = null;
          {
              const bd = new b2__namespace.BodyDef();
              ground = this.m_world.CreateBody(bd);
          }
          {
              const bd = new b2__namespace.BodyDef();
              bd.type = b2__namespace.BodyType.b2_dynamicBody;
              bd.allowSleep = false;
              bd.position.Set(0.0, 1.0);
              const body = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.05, 1.0, new b2__namespace.Vec2(2.0, 0.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(0.05, 1.0, new b2__namespace.Vec2(-2.0, 0.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(2.0, 0.05, new b2__namespace.Vec2(0.0, 1.0), 0.0);
              body.CreateFixture(shape, 5.0);
              shape.SetAsBox(2.0, 0.05, new b2__namespace.Vec2(0.0, -1.0), 0.0);
              body.CreateFixture(shape, 5.0);
              const jd = new b2__namespace.RevoluteJointDef();
              jd.bodyA = ground;
              jd.bodyB = body;
              jd.localAnchorA.Set(0.0, 1.0);
              jd.localAnchorB.Set(0.0, 0.0);
              jd.referenceAngle = 0.0;
              jd.motorSpeed = 0.05 * b2__namespace.pi;
              jd.maxMotorTorque = 1e7;
              jd.enableMotor = true;
              this.m_joint = this.m_world.CreateJoint(jd);
          }
          this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
          const particleType = Test.GetParticleParameterValue();
          this.m_particleSystem.SetDamping(0.2);
          {
              const pd = new b2__namespace.ParticleGroupDef();
              pd.flags = particleType;
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.9, 0.9, new b2__namespace.Vec2(0.0, 1.0), 0.0);
              pd.shape = shape;
              const group = this.m_particleSystem.CreateParticleGroup(pd);
              if (pd.flags & b2__namespace.ParticleFlag.b2_colorMixingParticle) {
                  this.ColorParticleGroup(group, 0);
              }
          }
          this.m_time = 0;
      }
      Step(settings) {
          super.Step(settings);
          if (settings.m_hertz > 0) {
              this.m_time += 1 / settings.m_hertz;
          }
          this.m_joint.SetMotorSpeed(0.05 * Math.cos(this.m_time) * b2__namespace.pi);
      }
      GetDefaultViewZoom() {
          return 0.1;
      }
      static Create() {
          return new WaveMachine();
      }
  }
  RegisterTest("Particles", "Wave Machine", WaveMachine.Create);
  // #endif

  // MIT License
  class Main {
      constructor(time) {
          this.m_time_last = 0;
          this.m_fps_time = 0;
          this.m_fps_frames = 0;
          this.m_fps = 0;
          this.m_settings = new Settings();
          this.m_shift = false;
          this.m_ctrl = false;
          this.m_lMouseDown = false;
          this.m_rMouseDown = false;
          this.m_projection0 = new b2__namespace.Vec2();
          this.m_viewCenter0 = new b2__namespace.Vec2();
          this.m_demo_mode = false;
          this.m_demo_time = 0;
          this.m_max_demo_time = 1000 * 10;
          this.m_ctx = null;
          this.m_mouse = new b2__namespace.Vec2();
          const fps_div = this.m_fps_div = document.body.appendChild(document.createElement("div"));
          fps_div.style.position = "absolute";
          fps_div.style.left = "0px";
          fps_div.style.bottom = "0px";
          fps_div.style.backgroundColor = "rgba(0,0,255,0.75)";
          fps_div.style.color = "white";
          fps_div.style.font = "10pt Courier New";
          fps_div.style.zIndex = "256";
          fps_div.innerHTML = "FPS";
          const debug_div = this.m_debug_div = document.body.appendChild(document.createElement("div"));
          debug_div.style.position = "absolute";
          debug_div.style.left = "0px";
          debug_div.style.bottom = "0px";
          debug_div.style.backgroundColor = "rgba(0,0,255,0.75)";
          debug_div.style.color = "white";
          debug_div.style.font = "10pt Courier New";
          debug_div.style.zIndex = "256";
          debug_div.innerHTML = "";
          document.body.style.backgroundColor = "rgba(51, 51, 51, 1.0)";
          const main_div = document.body.appendChild(document.createElement("div"));
          main_div.style.position = "absolute"; // relative to document.body
          main_div.style.left = "0px";
          main_div.style.top = "0px";
          function resize_main_div() {
              // console.log(window.innerWidth + "x" + window.innerHeight);
              main_div.style.width = window.innerWidth + "px";
              main_div.style.height = window.innerHeight + "px";
          }
          window.addEventListener("resize", (e) => { resize_main_div(); });
          window.addEventListener("orientationchange", (e) => { resize_main_div(); });
          resize_main_div();
          const title_div = main_div.appendChild(document.createElement("div"));
          title_div.style.textAlign = "center";
          title_div.style.color = "grey";
          title_div.innerHTML = "Box2D Testbed version " + b2__namespace.version.toString();
          const view_div = main_div.appendChild(document.createElement("div"));
          const canvas_div = this.m_canvas_div = view_div.appendChild(document.createElement("div"));
          canvas_div.style.position = "absolute"; // relative to view_div
          canvas_div.style.left = "0px";
          canvas_div.style.right = "0px";
          canvas_div.style.top = "0px";
          canvas_div.style.bottom = "0px";
          const canvas_2d = this.m_canvas_2d = canvas_div.appendChild(document.createElement("canvas"));
          function resize_canvas() {
              ///console.log(canvas_div.clientWidth + "x" + canvas_div.clientHeight);
              if (canvas_2d.width !== canvas_div.clientWidth) {
                  g_camera.m_width = canvas_2d.width = canvas_div.clientWidth;
              }
              if (canvas_2d.height !== canvas_div.clientHeight) {
                  g_camera.m_height = canvas_2d.height = canvas_div.clientHeight;
              }
          }
          window.addEventListener("resize", (e) => { resize_canvas(); });
          window.addEventListener("orientationchange", (e) => { resize_canvas(); });
          resize_canvas();
          g_debugDraw.m_ctx = this.m_ctx = this.m_canvas_2d.getContext("2d");
          const controls_div = view_div.appendChild(document.createElement("div"));
          controls_div.style.position = "absolute"; // relative to view_div
          controls_div.style.backgroundColor = "rgba(255,255,255,0.5)";
          controls_div.style.padding = "8px";
          controls_div.style.right = "0px";
          controls_div.style.top = "0px";
          controls_div.style.bottom = "0px";
          controls_div.style.overflowY = "scroll";
          // tests select box
          controls_div.appendChild(document.createTextNode("Tests"));
          controls_div.appendChild(document.createElement("br"));
          const test_select = document.createElement("select");
          const test_options = [];
          for (let i = 0; i < g_testEntries.length; ++i) {
              const option = document.createElement("option");
              option.text = `${g_testEntries[i].category}:${g_testEntries[i].name}`;
              option.value = i.toString();
              test_options.push(option);
          }
          test_options.sort((a, b) => a.text.localeCompare(b.text));
          for (let i = 0; i < test_options.length; ++i) {
              const option = test_options[i];
              test_select.add(option);
          }
          test_select.selectedIndex = this.m_settings.m_testIndex = 77;
          test_select.addEventListener("change", (e) => {
              this.m_settings.m_testIndex = test_select.selectedIndex;
              this.LoadTest();
          });
          controls_div.appendChild(test_select);
          this.m_test_select = test_select;
          this.m_test_options = test_options;
          controls_div.appendChild(document.createElement("br"));
          controls_div.appendChild(document.createElement("hr"));
          // simulation number inputs
          function connect_number_input(parent, label, init, update, min, max, step) {
              const number_input_tr = parent.appendChild(document.createElement("tr"));
              const number_input_td0 = number_input_tr.appendChild(document.createElement("td"));
              number_input_td0.align = "right";
              number_input_td0.appendChild(document.createTextNode(label));
              const number_input_td1 = number_input_tr.appendChild(document.createElement("td"));
              const number_input = document.createElement("input");
              number_input.size = 8;
              number_input.min = min.toString();
              number_input.max = max.toString();
              number_input.step = step.toString();
              number_input.value = init.toString();
              number_input.addEventListener("change", (e) => {
                  update(parseInt(number_input.value, 10));
              });
              number_input_td1.appendChild(number_input);
              return number_input;
          }
          const number_input_table = controls_div.appendChild(document.createElement("table"));
          connect_number_input(number_input_table, "Vel Iters", this.m_settings.m_velocityIterations, (value) => { this.m_settings.m_velocityIterations = value; }, 1, 20, 1);
          connect_number_input(number_input_table, "Pos Iters", this.m_settings.m_positionIterations, (value) => { this.m_settings.m_positionIterations = value; }, 1, 20, 1);
          // #if B2_ENABLE_PARTICLE
          connect_number_input(number_input_table, "Pcl Iters", this.m_settings.m_particleIterations, (value) => { this.m_settings.m_particleIterations = value; }, 1, 100, 1);
          // #endif
          connect_number_input(number_input_table, "Hertz", this.m_settings.m_hertz, (value) => { this.m_settings.m_hertz = value; }, 10, 120, 1);
          // simulation checkbox inputs
          function connect_checkbox_input(parent, label, init, update) {
              const checkbox_input = document.createElement("input");
              checkbox_input.type = "checkbox";
              checkbox_input.checked = init;
              checkbox_input.addEventListener("click", (e) => {
                  update(checkbox_input.checked);
              });
              parent.appendChild(checkbox_input);
              parent.appendChild(document.createTextNode(label));
              parent.appendChild(document.createElement("br"));
              return checkbox_input;
          }
          connect_checkbox_input(controls_div, "Sleep", this.m_settings.m_enableSleep, (value) => { this.m_settings.m_enableSleep = value; });
          connect_checkbox_input(controls_div, "Warm Starting", this.m_settings.m_enableWarmStarting, (value) => { this.m_settings.m_enableWarmStarting = value; });
          connect_checkbox_input(controls_div, "Time of Impact", this.m_settings.m_enableContinuous, (value) => { this.m_settings.m_enableContinuous = value; });
          connect_checkbox_input(controls_div, "Sub-Stepping", this.m_settings.m_enableSubStepping, (value) => { this.m_settings.m_enableSubStepping = value; });
          // #if B2_ENABLE_PARTICLE
          connect_checkbox_input(controls_div, "Strict Particle/Body Contacts", this.m_settings.m_strictContacts, (value) => { this.m_settings.m_strictContacts = value; });
          // #endif
          // draw checkbox inputs
          const draw_fieldset = controls_div.appendChild(document.createElement("fieldset"));
          const draw_legend = draw_fieldset.appendChild(document.createElement("legend"));
          draw_legend.appendChild(document.createTextNode("Draw"));
          connect_checkbox_input(draw_fieldset, "Shapes", this.m_settings.m_drawShapes, (value) => { this.m_settings.m_drawShapes = value; });
          // #if B2_ENABLE_PARTICLE
          connect_checkbox_input(draw_fieldset, "Particles", this.m_settings.m_drawParticles, (value) => { this.m_settings.m_drawParticles = value; });
          // #endif
          connect_checkbox_input(draw_fieldset, "Joints", this.m_settings.m_drawJoints, (value) => { this.m_settings.m_drawJoints = value; });
          connect_checkbox_input(draw_fieldset, "AABBs", this.m_settings.m_drawAABBs, (value) => { this.m_settings.m_drawAABBs = value; });
          connect_checkbox_input(draw_fieldset, "Contact Points", this.m_settings.m_drawContactPoints, (value) => { this.m_settings.m_drawContactPoints = value; });
          connect_checkbox_input(draw_fieldset, "Contact Normals", this.m_settings.m_drawContactNormals, (value) => { this.m_settings.m_drawContactNormals = value; });
          connect_checkbox_input(draw_fieldset, "Contact Impulses", this.m_settings.m_drawContactImpulse, (value) => { this.m_settings.m_drawContactImpulse = value; });
          connect_checkbox_input(draw_fieldset, "Friction Impulses", this.m_settings.m_drawFrictionImpulse, (value) => { this.m_settings.m_drawFrictionImpulse = value; });
          connect_checkbox_input(draw_fieldset, "Center of Masses", this.m_settings.m_drawCOMs, (value) => { this.m_settings.m_drawCOMs = value; });
          connect_checkbox_input(draw_fieldset, "Statistics", this.m_settings.m_drawStats, (value) => { this.m_settings.m_drawStats = value; });
          connect_checkbox_input(draw_fieldset, "Profile", this.m_settings.m_drawProfile, (value) => { this.m_settings.m_drawProfile = value; });
          // simulation buttons
          function connect_button_input(parent, label, callback) {
              const button_input = document.createElement("input");
              button_input.type = "button";
              button_input.style.width = "120";
              button_input.value = label;
              button_input.addEventListener("click", callback);
              parent.appendChild(button_input);
              parent.appendChild(document.createElement("br"));
              return button_input;
          }
          const button_div = controls_div.appendChild(document.createElement("div"));
          button_div.align = "center";
          connect_button_input(button_div, "Pause (P)", (e) => { this.Pause(); });
          connect_button_input(button_div, "Single Step (O)", (e) => { this.SingleStep(); });
          connect_button_input(button_div, "Restart (R)", (e) => { this.LoadTest(); });
          this.m_demo_button = connect_button_input(button_div, "Demo", (e) => { this.ToggleDemo(); });
          // disable context menu to use right-click
          window.addEventListener("contextmenu", (e) => { e.preventDefault(); }, true);
          canvas_div.addEventListener("mousemove", (e) => { this.HandleMouseMove(e); });
          canvas_div.addEventListener("mousedown", (e) => { this.HandleMouseDown(e); });
          canvas_div.addEventListener("mouseup", (e) => { this.HandleMouseUp(e); });
          canvas_div.addEventListener("wheel", (e) => { this.HandleWheel(e); });
          canvas_div.addEventListener("touchmove", (e) => { this.HandleTouchMove(e); });
          canvas_div.addEventListener("touchstart", (e) => { this.HandleTouchStart(e); });
          canvas_div.addEventListener("touchend", (e) => { this.HandleTouchEnd(e); });
          window.addEventListener("keydown", (e) => { this.HandleKeyDown(e); });
          window.addEventListener("keyup", (e) => { this.HandleKeyUp(e); });
          this.LoadTest();
          this.m_time_last = time;
      }
      HomeCamera() {
          g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
          g_camera.m_center.Set(0, 20 * g_camera.m_zoom);
          ///g_camera.m_roll.SetAngle(b2.DegToRad(0));
      }
      MoveCamera(move) {
          const position = g_camera.m_center.Clone();
          ///move.SelfRotate(g_camera.m_roll.GetAngle());
          position.SelfAdd(move);
          g_camera.m_center.Copy(position);
      }
      ///public RollCamera(roll: number): void {
      ///  const angle: number = g_camera.m_roll.GetAngle();
      ///  g_camera.m_roll.SetAngle(angle + roll);
      ///}
      ZoomCamera(zoom) {
          g_camera.m_zoom *= zoom;
          g_camera.m_zoom = b2__namespace.Clamp(g_camera.m_zoom, 0.02, 20);
      }
      HandleMouseMove(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          this.m_mouse.Copy(element);
          if (this.m_lMouseDown) {
              if (this.m_test) {
                  this.m_test.MouseMove(world);
              }
          }
          if (this.m_rMouseDown) {
              // m_center = viewCenter0 - (projection - projection0);
              const projection = g_camera.ConvertElementToProjection(element, new b2__namespace.Vec2());
              const diff = b2__namespace.Vec2.SubVV(projection, this.m_projection0, new b2__namespace.Vec2());
              const center = b2__namespace.Vec2.SubVV(this.m_viewCenter0, diff, new b2__namespace.Vec2());
              g_camera.m_center.Copy(center);
          }
      }
      HandleMouseDown(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          switch (e.button) {
              case 0: // left mouse button
                  this.m_lMouseDown = true;
                  if (this.m_shift) {
                      if (this.m_test) {
                          this.m_test.ShiftMouseDown(world);
                      }
                  }
                  else {
                      if (this.m_test) {
                          this.m_test.MouseDown(world);
                      }
                  }
                  break;
              case 2: // right mouse button
                  this.m_rMouseDown = true;
                  const projection = g_camera.ConvertElementToProjection(element, new b2__namespace.Vec2());
                  this.m_projection0.Copy(projection);
                  this.m_viewCenter0.Copy(g_camera.m_center);
                  break;
          }
      }
      HandleMouseUp(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          switch (e.button) {
              case 0: // left mouse button
                  this.m_lMouseDown = false;
                  if (this.m_test) {
                      this.m_test.MouseUp(world);
                  }
                  break;
              case 2: // right mouse button
                  this.m_rMouseDown = false;
                  break;
          }
      }
      HandleTouchMove(e) {
          const element = new b2__namespace.Vec2(e.touches[0].clientX, e.touches[0].clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          if (this.m_test) {
              this.m_test.MouseMove(world);
          }
          e.preventDefault();
      }
      HandleTouchStart(e) {
          const element = new b2__namespace.Vec2(e.touches[0].clientX, e.touches[0].clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          if (this.m_test) {
              this.m_test.MouseDown(world);
          }
          e.preventDefault();
      }
      HandleTouchEnd(e) {
          if (this.m_test) {
              this.m_test.MouseUp(this.m_test.m_mouseWorld);
          }
          e.preventDefault();
      }
      HandleWheel(e) {
          if (e.deltaY > 0) {
              this.ZoomCamera(1 / 1.1);
          }
          else if (e.deltaY < 0) {
              this.ZoomCamera(1.1);
          }
          e.preventDefault();
      }
      HandleKeyDown(e) {
          switch (e.key) {
              case "Control":
                  this.m_ctrl = true;
                  break;
              case "Shift":
                  this.m_shift = true;
                  break;
              case "ArrowLeft":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(2, 0));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(-0.5, 0));
                  }
                  break;
              case "ArrowRight":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(-2, 0));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0.5, 0));
                  }
                  break;
              case "ArrowDown":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(0, 2));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0, -0.5));
                  }
                  break;
              case "ArrowUp":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(0, -2));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0, 0.5));
                  }
                  break;
              case "Home":
                  this.HomeCamera();
                  break;
              ///case "PageUp":
              ///  this.RollCamera(b2.DegToRad(-1));
              ///  break;
              ///case "PageDown":
              ///  this.RollCamera(b2.DegToRad(1));
              ///  break;
              case "z":
                  this.ZoomCamera(1.1);
                  break;
              case "x":
                  this.ZoomCamera(0.9);
                  break;
              case "r":
                  this.LoadTest();
                  break;
              case " ":
                  if (this.m_test) {
                      this.m_test.LaunchBomb();
                  }
                  break;
              case "o":
                  this.SingleStep();
                  break;
              case "p":
                  this.Pause();
                  break;
              case "[":
                  this.DecrementTest();
                  break;
              case "]":
                  this.IncrementTest();
                  break;
              // #if B2_ENABLE_PARTICLE
              case ",":
                  if (this.m_shift) {
                      // Press < to select the previous particle parameter setting.
                      Test.particleParameter.Decrement();
                  }
                  break;
              case ".":
                  if (this.m_shift) {
                      // Press > to select the next particle parameter setting.
                      Test.particleParameter.Increment();
                  }
                  break;
          }
          if (this.m_test) {
              this.m_test.Keyboard(e.key);
          }
      }
      HandleKeyUp(e) {
          switch (e.key) {
              case "Control":
                  this.m_ctrl = false;
                  break;
              case "Shift":
                  this.m_shift = false;
                  break;
          }
          if (this.m_test) {
              this.m_test.KeyboardUp(e.key);
          }
      }
      UpdateTest(time_elapsed) {
          if (this.m_demo_mode) {
              this.m_demo_time += time_elapsed;
              if (this.m_demo_time > this.m_max_demo_time) {
                  this.IncrementTest();
              }
              const str = ((500 + this.m_max_demo_time - this.m_demo_time) / 1000).toFixed(0).toString();
              this.m_demo_button.value = str;
          }
          else {
              this.m_demo_button.value = "Demo";
          }
      }
      DecrementTest() {
          if (this.m_settings.m_testIndex <= 0) {
              this.m_settings.m_testIndex = this.m_test_options.length;
          }
          this.m_settings.m_testIndex--;
          this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
          this.LoadTest();
      }
      IncrementTest() {
          this.m_settings.m_testIndex++;
          if (this.m_settings.m_testIndex >= this.m_test_options.length) {
              this.m_settings.m_testIndex = 0;
          }
          this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
          this.LoadTest();
      }
      LoadTest(restartTest = false) {
          // #if B2_ENABLE_PARTICLE
          Test.fullscreenUI.Reset();
          if (!restartTest) {
              Test.particleParameter.Reset();
          }
          // #endif
          this.m_demo_time = 0;
          // #if B2_ENABLE_PARTICLE
          if (this.m_test) {
              this.m_test.RestoreParticleParameters();
          }
          // #endif
          this.m_test = g_testEntries[parseInt(this.m_test_options[this.m_settings.m_testIndex].value)].createFcn();
          if (!restartTest) {
              this.HomeCamera();
          }
      }
      Pause() {
          this.m_settings.m_pause = !this.m_settings.m_pause;
      }
      SingleStep() {
          this.m_settings.m_pause = true;
          this.m_settings.m_singleStep = true;
      }
      ToggleDemo() {
          this.m_demo_mode = !this.m_demo_mode;
      }
      SimulationLoop(time) {
          this.m_time_last = this.m_time_last || time;
          let time_elapsed = time - this.m_time_last;
          this.m_time_last = time;
          if (time_elapsed > 1000) {
              time_elapsed = 1000;
          } // clamp
          this.m_fps_time += time_elapsed;
          this.m_fps_frames++;
          if (this.m_fps_time >= 500) {
              this.m_fps = (this.m_fps_frames * 1000) / this.m_fps_time;
              this.m_fps_frames = 0;
              this.m_fps_time = 0;
              this.m_fps_div.innerHTML = this.m_fps.toFixed(1).toString();
          }
          if (time_elapsed > 0) {
              const ctx = this.m_ctx;
              // #if B2_ENABLE_PARTICLE
              const restartTest = [false];
              // #endif
              if (ctx) {
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  // ctx.strokeStyle = "blue";
                  // ctx.strokeRect(this.m_mouse.x - 24, this.m_mouse.y - 24, 48, 48);
                  // const mouse_world: b2.Vec2 = g_camera.ConvertScreenToWorld(this.m_mouse, new b2.Vec2());
                  ctx.save();
                  // 0,0 at center of canvas, x right, y up
                  ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                  ctx.scale(1, -1);
                  ///ctx.scale(g_camera.m_extent, g_camera.m_extent);
                  ///ctx.lineWidth /= g_camera.m_extent;
                  const s = 0.5 * g_camera.m_height / g_camera.m_extent;
                  ctx.scale(s, s);
                  ctx.lineWidth /= s;
                  // apply camera
                  ctx.scale(1 / g_camera.m_zoom, 1 / g_camera.m_zoom);
                  ctx.lineWidth *= g_camera.m_zoom;
                  ///ctx.rotate(-g_camera.m_roll.GetAngle());
                  ctx.translate(-g_camera.m_center.x, -g_camera.m_center.y);
                  if (this.m_test) {
                      this.m_test.Step(this.m_settings);
                  }
                  // #if B2_ENABLE_PARTICLE
                  // Update the state of the particle parameter.
                  Test.particleParameter.Changed(restartTest);
                  // #endif
                  // #if B2_ENABLE_PARTICLE
                  let msg = this.m_test_options[this.m_settings.m_testIndex].text;
                  if (Test.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                      msg += " : ";
                      msg += Test.particleParameter.GetName();
                  }
                  if (this.m_test) {
                      this.m_test.DrawTitle(msg);
                  }
                  // #else
                  // if (this.m_test) { this.m_test.DrawTitle(this.m_test_options[this.m_settings.m_testIndex].text); }
                  // #endif
                  // ctx.strokeStyle = "yellow";
                  // ctx.strokeRect(mouse_world.x - 0.5, mouse_world.y - 0.5, 1.0, 1.0);
                  ctx.restore();
              }
              // #if B2_ENABLE_PARTICLE
              if (restartTest[0]) {
                  this.LoadTest(true);
              }
              // #endif
              this.UpdateTest(time_elapsed);
          }
      }
  }
  // #endif

  exports.Camera = Camera;
  exports.ContactPoint = ContactPoint;
  exports.DRAW_STRING_NEW_LINE = DRAW_STRING_NEW_LINE;
  exports.DebugDraw = DebugDraw;
  exports.DestructionListener = DestructionListener;
  exports.EmittedParticleCallback = EmittedParticleCallback;
  exports.FullScreenUI = FullScreenUI;
  exports.Main = Main;
  exports.ParticleParameter = ParticleParameter;
  exports.ParticleParameterDefinition = ParticleParameterDefinition;
  exports.ParticleParameterValue = ParticleParameterValue;
  exports.RadialEmitter = RadialEmitter;
  exports.RandomFloat = RandomFloat;
  exports.RegisterTest = RegisterTest;
  exports.Settings = Settings;
  exports.Test = Test;
  exports.TestEntry = TestEntry;
  exports.g_camera = g_camera;
  exports.g_debugDraw = g_debugDraw;
  exports.g_testEntries = g_testEntries;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=testbed.umd.js.map
