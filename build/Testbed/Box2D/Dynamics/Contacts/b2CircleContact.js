"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const b2CollideCircle_1 = require("../../Collision/b2CollideCircle");
const b2Contact_1 = require("./b2Contact");
class b2CircleContact extends b2Contact_1.b2Contact {
    constructor() {
        super();
    }
    static Create(allocator) {
        return new b2CircleContact();
    }
    static Destroy(contact, allocator) {
    }
    Reset(fixtureA, indexA, fixtureB, indexB) {
        super.Reset(fixtureA, indexA, fixtureB, indexB);
    }
    Evaluate(manifold, xfA, xfB) {
        const shapeA = this.m_fixtureA.GetShape();
        const shapeB = this.m_fixtureB.GetShape();
        ///b2Assert(shapeA instanceof b2CircleShape);
        ///b2Assert(shapeB instanceof b2CircleShape);
        b2CollideCircle_1.b2CollideCircles(manifold, shapeA, xfA, shapeB, xfB);
    }
}
exports.b2CircleContact = b2CircleContact;
//# sourceMappingURL=b2CircleContact.js.map