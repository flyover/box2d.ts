System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, PyramidTopple;
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
            PyramidTopple = class PyramidTopple extends testbed.Test {
                constructor() {
                    super();
                    const WIDTH = 4;
                    const HEIGHT = 30;
                    const add_domino = (world, pos, flipped) => {
                        const mass = 1;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Copy(pos);
                        const body = world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        if (flipped) {
                            shape.SetAsBox(0.5 * HEIGHT, 0.5 * WIDTH);
                        }
                        else {
                            shape.SetAsBox(0.5 * WIDTH, 0.5 * HEIGHT);
                        }
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = mass / (WIDTH * HEIGHT);
                        fd.friction = 0.6;
                        fd.restitution = 0.0;
                        body.CreateFixture(fd);
                    };
                    const world = this.m_world;
                    ///settings.positionIterations = 30; // cpSpaceSetIterations(space, 30);
                    ///world.SetGravity(new b2.Vec2(0, -300)); // cpSpaceSetGravity(space, cpv(0, -300));
                    ///b2.timeToSleep = 0.5; // cpSpaceSetSleepTimeThreshold(space, 0.5f);
                    ///b2.linearSlop = 0.5; // cpSpaceSetCollisionSlop(space, 0.5f);
                    // Add a floor.
                    const bd = new b2.BodyDef();
                    const body = world.CreateBody(bd);
                    const shape = new b2.EdgeShape();
                    shape.SetTwoSided(new b2.Vec2(-600, -240), new b2.Vec2(600, -240));
                    const fd = new b2.FixtureDef();
                    fd.shape = shape;
                    fd.friction = 1.0;
                    fd.restitution = 1.0;
                    body.CreateFixture(fd);
                    // Add the dominoes.
                    const n = 12;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < (n - i); j++) {
                            const offset = new b2.Vec2((j - (n - 1 - i) * 0.5) * 1.5 * HEIGHT, (i + 0.5) * (HEIGHT + 2 * WIDTH) - WIDTH - 240);
                            add_domino(world, offset, false);
                            add_domino(world, b2.Vec2.AddVV(offset, new b2.Vec2(0, (HEIGHT + WIDTH) / 2), new b2.Vec2()), true);
                            if (j === 0) {
                                add_domino(world, b2.Vec2.AddVV(offset, new b2.Vec2(0.5 * (WIDTH - HEIGHT), HEIGHT + WIDTH), new b2.Vec2()), false);
                            }
                            if (j !== n - i - 1) {
                                add_domino(world, b2.Vec2.AddVV(offset, new b2.Vec2(HEIGHT * 0.75, (HEIGHT + 3 * WIDTH) / 2), new b2.Vec2()), true);
                            }
                            else {
                                add_domino(world, b2.Vec2.AddVV(offset, new b2.Vec2(0.5 * (HEIGHT - WIDTH), HEIGHT + WIDTH), new b2.Vec2()), false);
                            }
                        }
                    }
                }
                GetDefaultViewZoom() {
                    return 10.0;
                }
                static Create() {
                    return new PyramidTopple();
                }
            };
            exports_1("PyramidTopple", PyramidTopple);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHlyYW1pZF90b3BwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9weXJhbWlkX3RvcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUdBLGdCQUFBLE1BQWEsYUFBYyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUM3QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFFbEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFlLEVBQUUsR0FBWSxFQUFFLE9BQWdCLEVBQUUsRUFBRTt3QkFDckUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO3dCQUVmLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO3dCQUNyQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLElBQUksT0FBTyxFQUFFOzRCQUNYLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7eUJBQzNDOzZCQUFNOzRCQUNMLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7eUJBQzNDO3dCQUVELE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUMvQixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUM7d0JBQ3JDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUNsQixFQUFFLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQzt3QkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDekIsQ0FBQyxDQUFDO29CQUVGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQzNCLHdFQUF3RTtvQkFDeEUscUZBQXFGO29CQUNyRixzRUFBc0U7b0JBQ3RFLGdFQUFnRTtvQkFFaEUsZUFBZTtvQkFDZixNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDNUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25FLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUMvQixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDakIsRUFBRSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7b0JBQ2xCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO29CQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV2QixvQkFBb0I7b0JBQ3BCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDOzRCQUNuSCxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDakMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUVwRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ1gsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs2QkFDckg7NEJBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ25CLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOzZCQUNySDtpQ0FBTTtnQ0FDTCxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzZCQUNySDt5QkFDRjtxQkFDRjtnQkFDSCxDQUFDO2dCQUVNLGtCQUFrQjtvQkFDdkIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQSJ9