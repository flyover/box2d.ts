/*
 * Copyright (c) 2013 Google, Inc.
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
    var testbed, DrawingParticles;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            DrawingParticles = class DrawingParticles extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new DrawingParticles();
                }
            };
            exports_1("DrawingParticles", DrawingParticles);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhd2luZ1BhcnRpY2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRyYXdpbmdQYXJ0aWNsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7OztZQU9ILG1CQUFBLHNCQUE4QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUNoRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztnQkFDVixDQUFDO2dCQUNELE1BQU0sQ0FBQyxNQUFNO29CQUNYLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNoQyxDQUFDO2FBQ0YsQ0FBQSJ9