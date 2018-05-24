System.register(["../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testbed, PyramidTopple;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            PyramidTopple = class PyramidTopple extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new PyramidTopple();
                }
            };
            exports_1("PyramidTopple", PyramidTopple);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHlyYW1pZFRvcHBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlB5cmFtaWRUb3BwbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFHQSxnQkFBQSxtQkFBMkIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDN0M7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTTtvQkFDWCxPQUFPLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQzdCLENBQUM7YUFDRixDQUFBIn0=