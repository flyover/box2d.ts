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
    var testbed, Pointy;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Pointy = class Pointy extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new Pointy();
                }
            };
            exports_1("Pointy", Pointy);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9pbnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUG9pbnR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFPSCxTQUFBLFlBQW9CLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3RDO29CQUNFLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU07b0JBQ1gsT0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUN0QixDQUFDO2FBQ0YsQ0FBQSJ9