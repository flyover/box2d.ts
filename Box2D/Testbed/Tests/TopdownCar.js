/*
 * Author: Chris Campbell - www.iforce2d.net
 *
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
System.register(["../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testbed, TopdownCar;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            TopdownCar = class TopdownCar extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new TopdownCar();
                }
            };
            exports_1("TopdownCar", TopdownCar);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wZG93bkNhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRvcGRvd25DYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRzs7Ozs7Ozs7Ozs7O1lBS0gsYUFBQSxnQkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTTtvQkFDWCxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQzFCLENBQUM7YUFDRixDQUFBIn0=