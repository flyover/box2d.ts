System.register(["./settings.js", "./draw.js", "./fullscreen_ui.js", "./particle_emitter.js", "./particle_parameter.js", "./test.js", "./main.js"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (settings_js_1_1) {
                exportStar_1(settings_js_1_1);
            },
            function (draw_js_1_1) {
                exportStar_1(draw_js_1_1);
            },
            function (fullscreen_ui_js_1_1) {
                exportStar_1(fullscreen_ui_js_1_1);
            },
            function (particle_emitter_js_1_1) {
                exportStar_1(particle_emitter_js_1_1);
            },
            function (particle_parameter_js_1_1) {
                exportStar_1(particle_parameter_js_1_1);
            },
            function (test_js_1_1) {
                exportStar_1(test_js_1_1);
            },
            function (main_js_1_1) {
                exportStar_1(main_js_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=testbed.js.map