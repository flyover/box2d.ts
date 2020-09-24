System.register(["./hello_world.js"], function (exports_1, context_1) {
    "use strict";
    var hello_world;
    var __moduleName = context_1 && context_1.id;
    function main() {
        return hello_world.main();
    }
    exports_1("main", main);
    return {
        setters: [
            function (hello_world_1) {
                hello_world = hello_world_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=unit-test.js.map