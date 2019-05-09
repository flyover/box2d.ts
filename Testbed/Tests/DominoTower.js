System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, DominoTower;
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
            DominoTower = class DominoTower extends testbed.Test {
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
            };
            exports_1("DominoTower", DominoTower);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9taW5vVG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJEb21pbm9Ub3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUdBLGNBQUEsTUFBYSxXQUFZLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQzNDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDeEIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO29CQUM1QixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBQzFCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFFdEI7Ozt1QkFHRztvQkFDSCxJQUFJLGFBQXFCLENBQUM7b0JBRTFCLFNBQVMsVUFBVSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsVUFBbUI7d0JBQzNELE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN0QyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxZQUFZLEVBQUUsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDO3dCQUNyRCxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7d0JBQ2QsRUFBRSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7d0JBQzNCLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO3dCQUMxQyxFQUFFLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQzt3QkFDOUIsRUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3RCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDdEIs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