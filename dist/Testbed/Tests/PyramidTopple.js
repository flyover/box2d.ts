System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, PyramidTopple;
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
            PyramidTopple = class PyramidTopple extends testbed.Test {
                constructor() {
                    super();
                    const WIDTH = 4;
                    const HEIGHT = 30;
                    const add_domino = (world, pos, flipped) => {
                        const mass = 1;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Copy(pos);
                        const body = world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        if (flipped) {
                            shape.SetAsBox(0.5 * HEIGHT, 0.5 * WIDTH);
                        }
                        else {
                            shape.SetAsBox(0.5 * WIDTH, 0.5 * HEIGHT);
                        }
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = mass / (WIDTH * HEIGHT);
                        fd.friction = 0.6;
                        fd.restitution = 0.0;
                        body.CreateFixture(fd);
                    };
                    const world = this.m_world;
                    ///settings.positionIterations = 30; // cpSpaceSetIterations(space, 30);
                    ///world.SetGravity(new box2d.b2Vec2(0, -300)); // cpSpaceSetGravity(space, cpv(0, -300));
                    ///box2d.b2_timeToSleep = 0.5; // cpSpaceSetSleepTimeThreshold(space, 0.5f);
                    ///box2d.b2_linearSlop = 0.5; // cpSpaceSetCollisionSlop(space, 0.5f);
                    // Add a floor.
                    const bd = new box2d.b2BodyDef();
                    const body = world.CreateBody(bd);
                    const shape = new box2d.b2EdgeShape();
                    shape.Set(new box2d.b2Vec2(-600, -240), new box2d.b2Vec2(600, -240));
                    const fd = new box2d.b2FixtureDef();
                    fd.shape = shape;
                    fd.friction = 1.0;
                    fd.restitution = 1.0;
                    body.CreateFixture(fd);
                    // Add the dominoes.
                    const n = 12;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < (n - i); j++) {
                            const offset = new box2d.b2Vec2((j - (n - 1 - i) * 0.5) * 1.5 * HEIGHT, (i + 0.5) * (HEIGHT + 2 * WIDTH) - WIDTH - 240);
                            add_domino(world, offset, false);
                            add_domino(world, box2d.b2Vec2.AddVV(offset, new box2d.b2Vec2(0, (HEIGHT + WIDTH) / 2), new box2d.b2Vec2()), true);
                            if (j === 0) {
                                add_domino(world, box2d.b2Vec2.AddVV(offset, new box2d.b2Vec2(0.5 * (WIDTH - HEIGHT), HEIGHT + WIDTH), new box2d.b2Vec2()), false);
                            }
                            if (j !== n - i - 1) {
                                add_domino(world, box2d.b2Vec2.AddVV(offset, new box2d.b2Vec2(HEIGHT * 0.75, (HEIGHT + 3 * WIDTH) / 2), new box2d.b2Vec2()), true);
                            }
                            else {
                                add_domino(world, box2d.b2Vec2.AddVV(offset, new box2d.b2Vec2(0.5 * (HEIGHT - WIDTH), HEIGHT + WIDTH), new box2d.b2Vec2()), false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHlyYW1pZFRvcHBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvUHlyYW1pZFRvcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUdBLGdCQUFBLG1CQUEyQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUM3QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFFbEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFvQixFQUFFLEdBQWlCLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO3dCQUMvRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7d0JBRWYsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN0QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVsQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDekMsSUFBSSxPQUFPLEVBQUU7NEJBQ1gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsTUFBTSxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQzt5QkFDM0M7NkJBQU07NEJBQ0wsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQzt5QkFDM0M7d0JBRUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQixFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQzt3QkFDckMsRUFBRSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBQ2xCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO3dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QixDQUFDLENBQUM7b0JBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDM0Isd0VBQXdFO29CQUN4RSwwRkFBMEY7b0JBQzFGLDRFQUE0RTtvQkFDNUUsc0VBQXNFO29CQUV0RSxlQUFlO29CQUNmLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckUsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDbEIsRUFBRSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRXZCLG9CQUFvQjtvQkFDcEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7NEJBQ3hILFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUNqQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBRW5ILElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FDWCxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzZCQUNwSTs0QkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FDbkIsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7NkJBQ3BJO2lDQUFNO2dDQUNMLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7NkJBQ3BJO3lCQUNGO3FCQUNGO2dCQUNILENBQUM7Z0JBRU0sa0JBQWtCO29CQUN2QixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQzdCLENBQUM7YUFDRixDQUFBIn0=