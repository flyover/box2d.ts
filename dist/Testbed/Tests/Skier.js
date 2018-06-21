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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1NraWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixRQUFBLFdBQW1CLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBS3JDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBRXpDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQztvQkFFMUI7Ozs7OztzQkFNRTtvQkFDRixNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDNUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUUzQjs7c0JBRUU7b0JBQ0YsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO29CQUV4QixNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7b0JBRTVCLHFCQUFxQjtvQkFDckIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQzNELE1BQU0sYUFBYSxHQUFHLGFBQWEsR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQzFFLEVBQUU7b0JBRUYsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztvQkFFdEMsTUFBTSxLQUFLLEdBQW1CLEVBQUUsQ0FBQztvQkFFakMsc0JBQXNCO29CQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFdkMsUUFBUTtvQkFDUixLQUFLLENB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