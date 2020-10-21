// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, MobileBalanced, testIndex;
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
            MobileBalanced = class MobileBalanced extends testbed.Test {
                constructor() {
                    super();
                    // Create ground body.
                    const bodyDef = new b2.BodyDef();
                    bodyDef.position.Set(0.0, 20.0);
                    const ground = this.m_world.CreateBody(bodyDef);
                    const a = 0.5;
                    const h = new b2.Vec2(0.0, a);
                    const root = this.AddNode(ground, b2.Vec2_zero, 0, 3.0, a);
                    const jointDef = new b2.RevoluteJointDef();
                    jointDef.bodyA = ground;
                    jointDef.bodyB = root;
                    jointDef.localAnchorA.SetZero();
                    jointDef.localAnchorB.Copy(h);
                    this.m_world.CreateJoint(jointDef);
                }
                AddNode(parent, localAnchor, depth, offset, a) {
                    const density = 20.0;
                    const h = new b2.Vec2(0.0, a);
                    //  b2Vec2 p = parent->GetPosition() + localAnchor - h;
                    const p = parent.GetPosition().Clone().SelfAdd(localAnchor).SelfSub(h);
                    const bodyDef = new b2.BodyDef();
                    bodyDef.type = b2.BodyType.b2_dynamicBody;
                    bodyDef.position.Copy(p);
                    const body = this.m_world.CreateBody(bodyDef);
                    const shape = new b2.PolygonShape();
                    shape.SetAsBox(0.25 * a, a);
                    body.CreateFixture(shape, density);
                    if (depth === MobileBalanced.e_depth) {
                        return body;
                    }
                    shape.SetAsBox(offset, 0.25 * a, new b2.Vec2(0, -a), 0.0);
                    body.CreateFixture(shape, density);
                    const a1 = new b2.Vec2(offset, -a);
                    const a2 = new b2.Vec2(-offset, -a);
                    const body1 = this.AddNode(body, a1, depth + 1, 0.5 * offset, a);
                    const body2 = this.AddNode(body, a2, depth + 1, 0.5 * offset, a);
                    const jointDef = new b2.RevoluteJointDef();
                    jointDef.bodyA = body;
                    jointDef.localAnchorB.Copy(h);
                    jointDef.localAnchorA.Copy(a1);
                    jointDef.bodyB = body1;
                    this.m_world.CreateJoint(jointDef);
                    jointDef.localAnchorA.Copy(a2);
                    jointDef.bodyB = body2;
                    this.m_world.CreateJoint(jointDef);
                    return body;
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new MobileBalanced();
                }
            };
            exports_1("MobileBalanced", MobileBalanced);
            MobileBalanced.e_depth = 4;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Solver", "Mobile Balanced", MobileBalanced.Create));
        }
    };
});
//# sourceMappingURL=mobile_balanced.js.map