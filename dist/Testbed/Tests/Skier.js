/*
Test case for collision/jerking issue.
*/
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Skier;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Skier = class Skier extends testbed.Test {
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
                    const Slope1Incline = -Angle1Degrees * box2d.b2_pi / 180.0;
                    const Slope2Incline = Slope1Incline - Angle2Degrees * box2d.b2_pi / 180.0;
                    //
                    this.m_platform_width = PlatformWidth;
                    const verts = [];
                    // Horizontal platform
                    verts.push(new box2d.b2Vec2(-PlatformWidth, 0.0));
                    verts.push(new box2d.b2Vec2(0.0, 0.0));
                    // Slope
                    verts.push(new box2d.b2Vec2(verts[verts.length - 1].x + SlopeLength * Math.cos(Slope1Incline), verts[verts.length - 1].y - SlopeLength * Math.sin(Slope1Incline)));
                    verts.push(new box2d.b2Vec2(verts[verts.length - 1].x + SlopeLength * Math.cos(Slope2Incline), verts[verts.length - 1].y - SlopeLength * Math.sin(Slope2Incline)));
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(verts[0], verts[1]);
                        shape.m_hasVertex3 = true;
                        shape.m_vertex3.Copy(verts[2]);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 0.0;
                        fd.friction = SurfaceFriction;
                        ground.CreateFixture(fd);
                    }
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(verts[1], verts[2]);
                        shape.m_hasVertex0 = true;
                        shape.m_hasVertex3 = true;
                        shape.m_vertex0.Copy(verts[0]);
                        shape.m_vertex3.Copy(verts[3]);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 0.0;
                        fd.friction = SurfaceFriction;
                        ground.CreateFixture(fd);
                    }
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(verts[2], verts[3]);
                        shape.m_hasVertex0 = true;
                        shape.m_vertex0.Copy(verts[1]);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 0.0;
                        fd.friction = SurfaceFriction;
                        ground.CreateFixture(fd);
                    }
                    {
                        const EnableCircularSkiTips = false;
                        const BodyWidth = 1.0;
                        const BodyHeight = 2.5;
                        const SkiLength = 3.0;
                        /*
                        Larger values for this seem to alleviate the issue to some extent.
                        */
                        const SkiThickness = 0.3;
                        const SkiFriction = 0.0;
                        const SkiRestitution = 0.15;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        let initial_y = BodyHeight / 2 + SkiThickness;
                        if (EnableCircularSkiTips) {
                            initial_y += SkiThickness / 6;
                        }
                        bd.position.Set(-this.m_platform_width / 2, initial_y);
                        const skier = this.m_world.CreateBody(bd);
                        const body = new box2d.b2PolygonShape();
                        body.SetAsBox(BodyWidth / 2, BodyHeight / 2);
                        const ski = new box2d.b2PolygonShape();
                        const verts = [];
                        verts.push(new box2d.b2Vec2(-SkiLength / 2 - SkiThickness, -BodyHeight / 2));
                        verts.push(new box2d.b2Vec2(-SkiLength / 2, -BodyHeight / 2 - SkiThickness));
                        verts.push(new box2d.b2Vec2(SkiLength / 2, -BodyHeight / 2 - SkiThickness));
                        verts.push(new box2d.b2Vec2(SkiLength / 2 + SkiThickness, -BodyHeight / 2));
                        ski.Set(verts);
                        const ski_back_shape = new box2d.b2CircleShape();
                        ski_back_shape.m_p.Set(-SkiLength / 2.0, -BodyHeight / 2 - SkiThickness * (2.0 / 3));
                        ski_back_shape.m_radius = SkiThickness / 2;
                        const ski_front_shape = new box2d.b2CircleShape();
                        ski_front_shape.m_p.Set(SkiLength / 2, -BodyHeight / 2 - SkiThickness * (2.0 / 3));
                        ski_front_shape.m_radius = SkiThickness / 2;
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = body;
                        fd.density = 1.0;
                        skier.CreateFixture(fd);
                        fd.friction = SkiFriction;
                        fd.restitution = SkiRestitution;
                        fd.shape = ski;
                        skier.CreateFixture(fd);
                        if (EnableCircularSkiTips) {
                            fd.shape = ski_back_shape;
                            skier.CreateFixture(fd);
                            fd.shape = ski_front_shape;
                            skier.CreateFixture(fd);
                        }
                        skier.SetLinearVelocity(new box2d.b2Vec2(0.5, 0.0));
                        this.m_skier = skier;
                    }
                    testbed.g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
                    testbed.g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
                    testbed.g_camera.m_zoom = 0.4;
                    this.m_fixed_camera = true;
                }
                Keyboard(key) {
                    switch (key) {
                        case "c":
                            this.m_fixed_camera = !this.m_fixed_camera;
                            if (this.m_fixed_camera) {
                                testbed.g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
                            }
                            break;
                    }
                }
                Step(settings) {
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: c = Camera fixed/tracking");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    if (!this.m_fixed_camera) {
                        testbed.g_camera.m_center.Copy(this.m_skier.GetPosition());
                    }
                    super.Step(settings);
                }
                static Create() {
                    return new Skier();
                }
            };
            exports_1("Skier", Skier);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1NraWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixRQUFBLE1BQWEsS0FBTSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUtyQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUV6QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBRTFCOzs7Ozs7c0JBTUU7b0JBQ0YsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztvQkFFM0I7O3NCQUVFO29CQUNGLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQztvQkFFeEIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO29CQUU1QixxQkFBcUI7b0JBQ3JCLE1BQU0sYUFBYSxHQUFHLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUMzRCxNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUMxRSxFQUFFO29CQUVGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7b0JBRXRDLE1BQU0sS0FBSyxHQUFtQixFQUFFLENBQUM7b0JBRWpDLHNCQUFzQjtvQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRXZDLFFBQVE7b0JBQ1IsS0FB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R0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUU3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdkMsTUFBTSxLQUFLLEdBQW1CLEVBQUUsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3RSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQzdFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQzVFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBRWYsTUFBTSxjQUFjLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ2pELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JGLGNBQWMsQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxlQUFlLEdBQUcsSUFB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