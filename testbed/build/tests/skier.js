/*
Test case for collision/jerking issue.
*/
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Skier;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
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
                    const Slope1Incline = -Angle1Degrees * b2.pi / 180.0;
                    const Slope2Incline = Slope1Incline - Angle2Degrees * b2.pi / 180.0;
                    //
                    this.m_platform_width = PlatformWidth;
                    // Horizontal platform
                    const v1 = new b2.Vec2(-PlatformWidth, 0.0);
                    const v2 = new b2.Vec2(0.0, 0.0);
                    const v3 = new b2.Vec2(SlopeLength * Math.cos(Slope1Incline), -SlopeLength * Math.sin(Slope1Incline));
                    const v4 = new b2.Vec2(v3.x + SlopeLength * Math.cos(Slope2Incline), v3.y - SlopeLength * Math.sin(Slope2Incline));
                    const v5 = new b2.Vec2(v4.x, v4.y - 1.0);
                    const vertices = [v5, v4, v3, v2, v1];
                    const shape = new b2.ChainShape();
                    shape.CreateLoop(vertices);
                    const fd = new b2.FixtureDef();
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
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        const initial_y = BodyHeight / 2 + SkiThickness;
                        bd.position.Set(-this.m_platform_width / 2, initial_y);
                        const skier = this.m_world.CreateBody(bd);
                        const ski = new b2.PolygonShape();
                        const verts = [];
                        verts.push(new b2.Vec2(-SkiLength / 2 - SkiThickness, -BodyHeight / 2));
                        verts.push(new b2.Vec2(-SkiLength / 2, -BodyHeight / 2 - SkiThickness));
                        verts.push(new b2.Vec2(SkiLength / 2, -BodyHeight / 2 - SkiThickness));
                        verts.push(new b2.Vec2(SkiLength / 2 + SkiThickness, -BodyHeight / 2));
                        ski.Set(verts);
                        const fd = new b2.FixtureDef();
                        fd.density = 1.0;
                        fd.friction = SkiFriction;
                        fd.restitution = SkiRestitution;
                        fd.shape = ski;
                        skier.CreateFixture(fd);
                        skier.SetLinearVelocity(new b2.Vec2(0.5, 0.0));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9za2llci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsUUFBQSxNQUFhLEtBQU0sU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFLckM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFFekMsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDO29CQUUxQjs7Ozs7O3NCQU1FO29CQUNGLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBRTNCOztzQkFFRTtvQkFDRixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7b0JBRXhCLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztvQkFFNUIscUJBQXFCO29CQUNyQixNQUFNLGFBQWEsR0FBRyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztvQkFDckQsTUFBTSxhQUFhLEdBQUcsYUFBYSxHQUFHLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztvQkFDcEUsRUFBRTtvQkFFRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO29CQUV0QyxzQkFBc0I7b0JBQ3RCLE1BQU0sRUFBRSxHQUFZLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckQsTUFBTSxFQUFFLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUMsTUFBTSxFQUFFLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FB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