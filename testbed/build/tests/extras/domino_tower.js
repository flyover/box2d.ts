System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, DominoTower, testIndex;
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
                        const sd = new b2.PolygonShape();
                        sd.SetAsBox(0.5 * DOMINO_WIDTH, 0.5 * DOMINO_HEIGHT);
                        const fd = new b2.FixtureDef();
                        fd.shape = sd;
                        fd.density = dominoDensity;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        fd.friction = DOMINO_FRICTION;
                        fd.restitution = 0.65;
                        bd.position.Set(x, y);
                        bd.angle = horizontal ? (Math.PI / 2.0) : 0;
                        const myBody = world.CreateBody(bd);
                        myBody.CreateFixture(fd);
                    }
                    const gravity = new b2.Vec2(0, -10);
                    //world = new b2.World(gravity);
                    const world = this.m_world;
                    world.SetGravity(gravity);
                    // Create the floor
                    {
                        const sd = new b2.PolygonShape();
                        sd.SetAsBox(50, 10);
                        const bd = new b2.BodyDef();
                        bd.position.Set(0, -10);
                        const body = world.CreateBody(bd);
                        body.CreateFixture(sd, 0);
                    }
                    {
                        dominoDensity = 10;
                        // Make bullet
                        const sd = new b2.PolygonShape();
                        sd.SetAsBox(.7, .7);
                        const fd = new b2.FixtureDef();
                        fd.density = 35.0;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        fd.shape = sd;
                        fd.friction = 0.0;
                        fd.restitution = 0.85;
                        bd.bullet = true;
                        bd.position.Set(30.0, 5.00);
                        let b = world.CreateBody(bd);
                        b.CreateFixture(fd);
                        b.SetLinearVelocity(new b2.Vec2(-25.0, -25.0));
                        b.SetAngularVelocity(6.7);
                        fd.density = 25.0;
                        bd.position.Set(-30.0, 25.0);
                        b = world.CreateBody(bd);
                        b.CreateFixture(fd);
                        b.SetLinearVelocity(new b2.Vec2(35.0, -10.0));
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
            exports_1("testIndex", testIndex = testbed.RegisterTest("Extras", "Domino Tower", DominoTower.Create));
        }
    };
});
//# sourceMappingURL=domino_tower.js.map