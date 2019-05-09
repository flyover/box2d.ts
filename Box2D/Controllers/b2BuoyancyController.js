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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCdW95YW5jeUNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkJ1b3lhbmN5Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUg7OztlQUdHO1lBQ0gsdUJBQUEsTUFBYSxvQkFBcUIsU0FBUSwyQkFBWTtnQkFBdEQ7O29CQUNFOzt1QkFFRztvQkFDYSxXQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxQzs7dUJBRUc7b0JBQ0ksV0FBTSxHQUFHLENBQUMsQ0FBQztvQkFDbEI7O3VCQUVHO29CQUNJLFlBQU8sR0FBRyxDQUFDLENBQUM7b0JBQ25COzt1QkFFRztvQkFDYSxhQUFRLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM1Qzs7dUJBRUc7b0JBQ0ksZUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDdEI7O3VCQUVHO29CQUNJLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUN2Qjs7O3VCQUdHO29CQUNJLGVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxzQ0FBc0M7b0JBQ2pFOzt1QkFFRztvQkFDSSxvQkFBZSxHQUFHLElBQUksQ0FBQztvQkFDOUI7O3VCQUVHO29CQUNhLFlBQU8sR0FBRyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBeUU3QyxDQUFDO2dCQXZFUSxJQUFJLENBQUMsSUFBZ0I7b0JBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNwQixPQUFPO3FCQUNSO29CQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTt3QkFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFF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