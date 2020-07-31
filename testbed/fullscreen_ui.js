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
System.register([], function (exports_1, context_1) {
    "use strict";
    var FullScreenUI;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // #if B2_ENABLE_PARTICLE
            /**
             * Handles drawing and selection of full screen UI.
             */
            FullScreenUI = class FullScreenUI {
                constructor() {
                    /**
                     * Whether particle parameters are enabled.
                     */
                    this.m_particleParameterSelectionEnabled = false;
                    this.Reset();
                }
                /**
                 * Reset the UI to it's initial state.
                 */
                Reset() {
                    this.m_particleParameterSelectionEnabled = false;
                }
                /**
                 * Enable / disable particle parameter selection.
                 */
                SetParticleParameterSelectionEnabled(enable) {
                    this.m_particleParameterSelectionEnabled = enable;
                }
                /**
                 * Get whether particle parameter selection is enabled.
                 */
                GetParticleParameterSelectionEnabled() {
                    return this.m_particleParameterSelectionEnabled;
                }
            };
            exports_1("FullScreenUI", FullScreenUI);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHNjcmVlbl91aS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bGxzY3JlZW5fdWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7O1lBRUgseUJBQXlCO1lBRXpCOztlQUVHO1lBQ0gsZUFBQSxNQUFhLFlBQVk7Z0JBQ3ZCO29CQUlBOzt1QkFFRztvQkFDSSx3Q0FBbUMsR0FBWSxLQUFLLENBQUM7b0JBTjFELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixDQUFDO2dCQU9EOzttQkFFRztnQkFDSSxLQUFLO29CQUNWLElBQUksQ0FBQyxtQ0FBbUMsR0FBRyxLQUFLLENBQUM7Z0JBQ25ELENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLG9DQUFvQyxDQUFDLE1BQWU7b0JBQ3pELElBQUksQ0FBQyxtQ0FBbUMsR0FBRyxNQUFNLENBQUM7Z0JBQ3BELENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLG9DQUFvQztvQkFDekMsT0FBTyxJQUFJLENBQUMsbUNBQW1DLENBQUM7Z0JBQ2xELENBQUM7YUFDRixDQUFBIn0=