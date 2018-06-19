/*
Test case for collision/jerking issue.
*/

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class Skier extends testbed.Test {
  public m_platform_width: number;
  public m_skier: box2d.b2Body;
  public m_fixed_camera: boolean;

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

    const verts: box2d.b2Vec2[] = [];

    // Horizontal platform
    verts.push(new box2d.b2Vec2(-PlatformWidth, 0.0));
    verts.push(new box2d.b2Vec2(0.0, 0.0));

    // Slope
    verts.push(new box2d.b2Vec2(
      verts[verts.length - 1].x + SlopeLength * Math.cos(Slope1Incline),
      verts[verts.length - 1].y - SlopeLength * Math.sin(Slope1Incline),
    ));

    verts.push(new box2d.b2Vec2(
      verts[verts.length - 1].x + SlopeLength * Math.cos(Slope2Incline),
      verts[verts.length - 1].y - SlopeLength * Math.sin(Slope2Incline),
    ));

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
      const verts: box2d.b2Vec2[] = [];
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

  public Keyboard(key: string): void {
    switch (key) {
    case "c":
      this.m_fixed_camera = !this.m_fixed_camera;
      if (this.m_fixed_camera) {
        testbed.g_camera.m_center.Set(this.m_platform_width / 2.0, 0.0);
      }
      break;
    }
  }

  public Step(settings: testbed.Settings): void {
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: c = Camera fixed/tracking");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    if (!this.m_fixed_camera) {
      testbed.g_camera.m_center.Copy(this.m_skier.GetPosition());
    }
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new Skier();
  }
}
