System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taW5vX3Rvd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9taW5vX3Rvd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1lBR0EsY0FBQSxNQUFhLFdBQVksU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDM0M7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQUN4QixNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7b0JBQzVCLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUV0Qjs7O3VCQUdHO29CQUNILElBQUksYUFBcUIsQ0FBQztvQkFFMUIsU0FBUyxVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxVQUFtQjt3QkFDM0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQ3RDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLFlBQVksRUFBRSxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7d0JBQ3JELE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzt3QkFDZCxFQUFFLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzt3QkFDM0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO3dCQUM5QixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDdEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN0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