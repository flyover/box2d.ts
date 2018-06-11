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
System.register(["./b2Controller", "../Common/b2Math", "../Common/b2Settings", "../Common/b2Draw"], function (exports_1, context_1) {
    "use strict";
    var b2Controller_1, b2Math_1, b2Settings_1, b2Draw_1, b2BuoyancyController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Controller_1_1) {
                b2Controller_1 = b2Controller_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            }
        ],
        execute: function () {
            /**
             * Calculates buoyancy forces for fluids in the form of a half
             * plane.
             */
            b2BuoyancyController = class b2BuoyancyController extends b2Controller_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * The outer surface normal
                     */
                    this.normal = new b2Math_1.b2Vec2(0, 1);
                    /**
                     * The height of the fluid surface along the normal
                     */
                    this.offset = 0;
                    /**
                     * The fluid density
                     */
                    this.density = 0;
                    /**
                     * Fluid velocity, for drag calculations
                     */
                    this.velocity = new b2Math_1.b2Vec2(0, 0);
                    /**
                     * Linear drag co-efficient
                     */
                    this.linearDrag = 0;
                    /**
                     * Angular drag co-efficient
                     */
                    this.angularDrag = 0;
                    /**
                     * If false, bodies are assumed to be uniformly dense, otherwise
                     * use the shapes densities
                     */
                    this.useDensity = false; //False by default to prevent a gotcha
                    /**
                     * If true, gravity is taken from the world instead of the
                     */
                    this.useWorldGravity = true;
                    /**
                     * Gravity vector, if the world's gravity is not used
                     */
                    this.gravity = new b2Math_1.b2Vec2(0, 0);
                }
                Step(step) {
                    if (this.m_bodyList.size === 0) {
                        return;
                    }
                    for (const i of this.m_bodyList) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            //Buoyancy force is just a function of position,
                            //so unlike most forces, it is safe to ignore sleeping bodes
                            continue;
                        }
                        const areac = new b2Math_1.b2Vec2();
                        const massc = new b2Math_1.b2Vec2();
                        let area = 0;
                        let mass = 0;
                        for (const fixture of body.GetFixtureList()) {
                            const sc = new b2Math_1.b2Vec2();
                            const sarea = fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
                            area += sarea;
                            areac.x += sarea * sc.x;
                            areac.y += sarea * sc.y;
                            let shapeDensity = 0;
                            if (this.useDensity) {
                                //TODO: Expose density publicly
                                shapeDensity = fixture.GetDensity();
                            }
                            else {
                                shapeDensity = 1;
                            }
                            mass += sarea * shapeDensity;
                            massc.x += sarea * sc.x * shapeDensity;
                            massc.y += sarea * sc.y * shapeDensity;
                        }
                        areac.x /= area;
                        areac.y /= area;
                        //    b2Vec2 localCentroid = b2MulT(body->GetXForm(),areac);
                        massc.x /= mass;
                        massc.y /= mass;
                        if (area < b2Settings_1.b2_epsilon) {
                            continue;
                        }
                        //Buoyancy
                        const buoyancyForce = (this.useWorldGravity ? body.GetWorld().GetGravity() : this.gravity).Clone().SelfNeg();
                        buoyancyForce.SelfMul(this.density * area);
                        body.ApplyForce(buoyancyForce, massc);
                        //Linear drag
                        const dragForce = body.GetLinearVelocityFromWorldPoint(areac, new b2Math_1.b2Vec2());
                        dragForce.SelfSub(this.velocity);
                        dragForce.SelfMul((-this.linearDrag * area));
                        body.ApplyForce(dragForce, areac);
                        //Angular drag
                        //TODO: Something that makes more physical sense?
                        body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
                    }
                }
                Draw(debugDraw) {
                    const r = 100;
                    const p1 = new b2Math_1.b2Vec2();
                    const p2 = new b2Math_1.b2Vec2();
                    p1.x = this.normal.x * this.offset + this.normal.y * r;
                    p1.y = this.normal.y * this.offset - this.normal.x * r;
                    p2.x = this.normal.x * this.offset - this.normal.y * r;
                    p2.y = this.normal.y * this.offset + this.normal.x * r;
                    const color = new b2Draw_1.b2Color(0, 0, 0.8);
                    debugDraw.DrawSegment(p1, p2, color);
                }
            };
            exports_1("b2BuoyancyController", b2BuoyancyController);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCdW95YW5jeUNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkJ1b3lhbmN5Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUg7OztlQUdHO1lBQ0gsdUJBQUEsMEJBQWtDLFNBQVEsMkJBQVk7Z0JBQXREOztvQkFDRTs7dUJBRUc7b0JBQ2EsV0FBTSxHQUFHLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUM7O3VCQUVHO29CQUNJLFdBQU0sR0FBRyxDQUFDLENBQUM7b0JBQ2xCOzt1QkFFRztvQkFDSSxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNuQjs7dUJBRUc7b0JBQ2EsYUFBUSxHQUFHLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDNUM7O3VCQUVHO29CQUNJLGVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ3RCOzt1QkFFRztvQkFDSSxnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFDdkI7Ozt1QkFHRztvQkFDSSxlQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsc0NBQXNDO29CQUNqRTs7dUJBRUc7b0JBQ0ksb0JBQWUsR0FBRyxJQUFJLENBQUM7b0JBQzlCOzt1QkFFRztvQkFDYSxZQUFPLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQXNFN0MsQ0FBQztnQkFwRVEsSUFBSSxDQUFDLElBQWdCO29CQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTt3QkFDOUIsT0FBTztxQkFDUjtvQkFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQy9CLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxJQUFJLENB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