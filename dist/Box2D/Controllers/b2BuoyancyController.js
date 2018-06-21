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
                    if (!this.m_bodyList) {
                        return;
                    }
                    if (this.useWorldGravity) {
                        this.gravity.Copy(this.m_bodyList.body.GetWorld().GetGravity());
                    }
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
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
                        for (let fixture = body.GetFixtureList(); fixture; fixture = fixture.m_next) {
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
                        const buoyancyForce = this.gravity.Clone().SelfNeg();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCdW95YW5jeUNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9Cb3gyRC9Db250cm9sbGVycy9iMkJ1b3lhbmN5Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUg7OztlQUdHO1lBQ0gsdUJBQUEsMEJBQWtDLFNBQVEsMkJBQVk7Z0JBQXREOztvQkFDRTs7dUJBRUc7b0JBQ2EsV0FBTSxHQUFHLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUM7O3VCQUVHO29CQUNJLFdBQU0sR0FBRyxDQUFDLENBQUM7b0JBQ2xCOzt1QkFFRztvQkFDSSxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNuQjs7dUJBRUc7b0JBQ2EsYUFBUSxHQUFHLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDNUM7O3VCQUVHO29CQUNJLGVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ3RCOzt1QkFFRztvQkFDSSxnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFDdkI7Ozt1QkFHRztvQkFDSSxlQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsc0NBQXNDO29CQUNqRTs7dUJBRUc7b0JBQ0ksb0JBQWUsR0FBRyxJQUFJLENBQUM7b0JBQzlCOzt1QkFFRztvQkFDYSxZQUFPLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQXlFN0MsQ0FBQztnQkF2RVEsSUFBSSxDQUFDLElBQWdCO29CQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDcEIsT0FBTztxQkFDUjtvQkFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7d0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFB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