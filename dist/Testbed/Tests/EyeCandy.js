// #if B2_ENABLE_PARTICLE
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, EyeCandy;
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
            EyeCandy = class EyeCandy extends testbed.Test {
                constructor() {
                    super();
                    this.m_particleSystem.SetDamping(0.2);
                    this.m_particleSystem.SetRadius(0.3 * 2);
                    this.m_particleSystem.SetGravityScale(0.4);
                    this.m_particleSystem.SetDensity(1.2);
                    const bdg = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bdg);
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_staticBody; //box2d.b2BodyType.b2_dynamicBody;
                    bd.allowSleep = false;
                    bd.position.Set(0.0, 0.0);
                    const body = this.m_world.CreateBody(bd);
                    const shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(20.0, 0.0), 0.0);
                    body.CreateFixture(shape, 5.0);
                    shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(-20.0, 0.0), 0.0);
                    body.CreateFixture(shape, 5.0);
                    shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, 10.0), Math.PI / 2.0);
                    body.CreateFixture(shape, 5.0);
                    shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, -10.0), Math.PI / 2.0);
                    body.CreateFixture(shape, 5.0);
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    bd.position.Set(0.0, 0.0);
                    this.m_mover = this.m_world.CreateBody(bd);
                    shape.SetAsBox(1.0, 5.0, new box2d.b2Vec2(0.0, 2.0), 0.0);
                    this.m_mover.CreateFixture(shape, 5.0);
                    const jd = new box2d.b2RevoluteJointDef();
                    jd.bodyA = ground;
                    jd.bodyB = this.m_mover;
                    jd.localAnchorA.Set(0.0, 0.0);
                    jd.localAnchorB.Set(0.0, 5.0);
                    jd.referenceAngle = 0.0;
                    jd.motorSpeed = 0;
                    jd.maxMotorTorque = 1e7;
                    jd.enableMotor = true;
                    this.m_joint = this.m_world.CreateJoint(jd);
                    const pd = new box2d.b2ParticleGroupDef();
                    pd.flags = box2d.b2ParticleFlag.b2_waterParticle;
                    const shape2 = new box2d.b2PolygonShape();
                    shape2.SetAsBox(9.0, 9.0, new box2d.b2Vec2(0.0, 0.0), 0.0);
                    pd.shape = shape2;
                    this.m_particleSystem.CreateParticleGroup(pd);
                }
                Step(settings) {
                    const time = new Date().getTime();
                    this.m_joint.SetMotorSpeed(0.7 * Math.cos(time / 1000));
                    super.Step(settings);
                }
                static Create() {
                    return new EyeCandy();
                }
            };
            exports_1("EyeCandy", EyeCandy);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXllQ2FuZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0V5ZUNhbmR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7O1lBS3pCLFdBQUEsY0FBc0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJeEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXRDLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFNUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxrQ0FBa0M7b0JBQzVFLEVBQUUsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFD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