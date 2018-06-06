/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class BasicSliderCrank extends testbed.Test {
  constructor() {
    super();

    /*box2d.b2Body*/
    let ground = null;
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.position.Set(0.0, 17.0);
      ground = this.m_world.CreateBody(bd);
    }

    {
      /*box2d.b2Body*/
      let prevBody = ground;

      // Define crank.
      {
        /*box2d.b2PolygonShape*/
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(4.0, 1.0);

        /*box2d.b2BodyDef*/
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(-8.0, 20.0);
        /*box2d.b2Body*/
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        /*box2d.b2RevoluteJointDef*/
        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(-12.0, 20.0));
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define connecting rod
      {
        /*box2d.b2PolygonShape*/
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(8.0, 1.0);

        /*box2d.b2BodyDef*/
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(4.0, 20.0);
        /*box2d.b2Body*/
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        /*box2d.b2RevoluteJointDef*/
        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(-4.0, 20.0));
        this.m_world.CreateJoint(rjd);

        prevBody = body;
      }

      // Define piston
      {
        /*box2d.b2PolygonShape*/
        const shape = new box2d.b2PolygonShape();
        shape.SetAsBox(3.0, 3.0);

        /*box2d.b2BodyDef*/
        const bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.fixedRotation = true;
        bd.position.Set(12.0, 20.0);
        /*box2d.b2Body*/
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(shape, 2.0);

        /*box2d.b2RevoluteJointDef*/
        const rjd = new box2d.b2RevoluteJointDef();
        rjd.Initialize(prevBody, body, new box2d.b2Vec2(12.0, 20.0));
        this.m_world.CreateJoint(rjd);

        /*box2d.b2PrismaticJointDef*/
        const pjd = new box2d.b2PrismaticJointDef();
        pjd.Initialize(ground, body, new box2d.b2Vec2(12.0, 17.0), new box2d.b2Vec2(1.0, 0.0));
        this.m_world.CreateJoint(pjd);
      }
    }
  }

  public static Create() {
    return new BasicSliderCrank();
  }
}
