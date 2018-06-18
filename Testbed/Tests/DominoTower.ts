import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class DominoTower extends testbed.Test {
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
    let dominoDensity: number;

    function makeDomino(x: number, y: number, horizontal: boolean) {
      const sd = new box2d.b2PolygonShape();
      sd.SetAsBox(0.5 * DOMINO_WIDTH, 0.5 * DOMINO_HEIGHT);
      const fd = new box2d.b2FixtureDef();
      fd.shape = sd;
      fd.density = dominoDensity;
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      fd.friction = DOMINO_FRICTION;
      fd.restitution = 0.65;
      bd.position.Set(x, y);
      bd.angle = horizontal ? (Math.PI / 2.0) : 0;
      const myBody = world.CreateBody(bd);
      myBody.CreateFixture(fd);
    }

    const gravity = new box2d.b2Vec2(0, -10);
    //world = new box2d.b2World(gravity);
    const world = this.m_world;
    world.SetGravity(gravity);

    // Create the floor
    {
      const sd = new box2d.b2PolygonShape();
      sd.SetAsBox(50, 10);

      const bd = new box2d.b2BodyDef();
      bd.position.Set(0, -10);
      const body = world.CreateBody(bd);
      body.CreateFixture(sd, 0);
    }

    {
      dominoDensity = 10;
      // Make bullet
      const sd = new box2d.b2PolygonShape();
      sd.SetAsBox(.7, .7);
      const fd = new box2d.b2FixtureDef();
      fd.density = 35.0;
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      fd.shape = sd;
      fd.friction = 0.0;
      fd.restitution = 0.85;
      bd.bullet = true;
      bd.position.Set(30.0, 5.00);
      let b = world.CreateBody(bd);
      b.CreateFixture(fd);
      b.SetLinearVelocity(new box2d.b2Vec2(-25.0, -25.0));
      b.SetAngularVelocity(6.7);

      fd.density = 25.0;
      bd.position.Set(-30.0, 25.0);
      b = world.CreateBody(bd);
      b.CreateFixture(fd);
      b.SetLinearVelocity(new box2d.b2Vec2(35.0, -10.0));
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
        if (j > 3) { dominoDensity *= .8; }

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

  public static Create() {
    return new DominoTower();
  }
}
