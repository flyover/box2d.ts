/*
 * Copyright (c) 2014 Google, Inc.
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
    var testbed, Ramp;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Ramp = class Ramp extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new Ramp();
                }
            };
            exports_1("Ramp", Ramp);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJhbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7OztZQU9ILE9BQUEsVUFBa0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDcEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTTtvQkFDWCxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7YUFDRixDQUFBIn0=