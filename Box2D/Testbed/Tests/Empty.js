System.register(["../Testbed"], function (exports_1, context_1) {
    "use strict";
    var testbed, Empty;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Empty = class Empty extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new Empty();
                }
            };
            exports_1("Empty", Empty);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJFbXB0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQUdBLFFBQUEsV0FBbUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDckM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxNQUFNLENBQUMsTUFBTTtvQkFDWCxPQUFPLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFBIn0=