"use strict";
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Framework/Main"));
__export(require("./Framework/DebugDraw"));
///#if B2_ENABLE_PARTICLE
__export(require("./Framework/FullscreenUI"));
__export(require("./Framework/ParticleEmitter"));
__export(require("./Framework/ParticleParameter"));
///#endif
__export(require("./Framework/Test"));
__export(require("./Tests/TestEntries"));
//# sourceMappingURL=Testbed.js.map