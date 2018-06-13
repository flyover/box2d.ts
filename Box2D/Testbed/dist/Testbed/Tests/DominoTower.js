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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9taW5vVG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0cy9Eb21pbm9Ub3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUdBLGNBQUEsaUJBQXlCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQzNDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDeEIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO29CQUM1QixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBQzFCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFFdEI7Ozt1QkFHRztvQkFDSCxJQUFJLGFBQXFCLENBQUM7b0JBRTFCLG9CQUFvQixDQUFTLEVBQUUsQ0FBUyxFQUFFLFVBQW1CO3dCQUMzRCxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsWUFBWSxFQUFFLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQzt3QkFDckQsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO3dCQUNkLEVBQUUsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO3dCQUMzQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7d0JBQzlCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JB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