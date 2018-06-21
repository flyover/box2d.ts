/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, MobileBalanced;
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
            MobileBalanced = class MobileBalanced extends testbed.Test {
                constructor() {
                    super();
                    // Create ground body.
                    const /*b2BodyDef*/ bodyDef = new box2d.b2BodyDef();
                    bodyDef.position.Set(0.0, 20.0);
                    const ground = this.m_world.CreateBody(bodyDef);
                    const /*float32*/ a = 0.5;
                    const /*b2Vec2*/ h = new box2d.b2Vec2(0.0, a);
                    const /*b2Body*/ root = this.AddNode(ground, box2d.b2Vec2_zero, 0, 3.0, a);
                    const /*b2RevoluteJointDef*/ jointDef = new box2d.b2RevoluteJointDef();
                    jointDef.bodyA = ground;
                    jointDef.bodyB = root;
                    jointDef.localAnchorA.SetZero();
                    jointDef.localAnchorB.Copy(h);
                    this.m_world.CreateJoint(jointDef);
                }
                AddNode(parent, localAnchor, depth, offset, a) {
                    const /*float32*/ density = 20.0;
                    const /*b2Vec2*/ h = new box2d.b2Vec2(0.0, a);
                    //  b2Vec2 p = parent->GetPosition() + localAnchor - h;
                    const /*b2Vec2*/ p = parent.GetPosition().Clone().SelfAdd(localAnchor).SelfSub(h);
                    const /*b2BodyDef*/ bodyDef = new box2d.b2BodyDef();
                    bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    bodyDef.position.Copy(p);
                    const /*b2Body*/ body = this.m_world.CreateBody(bodyDef);
                    const /*b2PolygonShape*/ shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(0.25 * a, a);
                    body.CreateFixture(shape, density);
                    if (depth === MobileBalanced.e_depth) {
                        return body;
                    }
                    shape.SetAsBox(offset, 0.25 * a, new box2d.b2Vec2(0, -a), 0.0);
                    body.CreateFixture(shape, density);
                    const /*b2Vec2*/ a1 = new box2d.b2Vec2(offset, -a);
                    const /*b2Vec2*/ a2 = new box2d.b2Vec2(-offset, -a);
                    const /*b2Body*/ body1 = this.AddNode(body, a1, depth + 1, 0.5 * offset, a);
                    const /*b2Body*/ body2 = this.AddNode(body, a2, depth + 1, 0.5 * offset, a);
                    const /*b2RevoluteJointDef*/ jointDef = new box2d.b2RevoluteJointDef();
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
            MobileBalanced.e_depth = 4;
            exports_1("MobileBalanced", MobileBalanced);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9iaWxlQmFsYW5jZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL01vYmlsZUJhbGFuY2VkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixpQkFBQSxvQkFBNEIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFHOUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsc0JBQXNCO29CQUN0QixNQUFNLGFBQWEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3BELE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWhELE1BQU0sV0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQzFCLE1BQU0sVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUU5QyxNQUFNLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUUzRSxNQUFNLHNCQUFzQixDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUN2RSxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztvQkFDeEIsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ3RCLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2hDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxD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