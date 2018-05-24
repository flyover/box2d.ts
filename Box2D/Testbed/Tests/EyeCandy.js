// #if B2_ENABLE_PARTICLE
System.register(["../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testbed, EyeCandy;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            EyeCandy = class EyeCandy extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new EyeCandy();
                }
            };
            exports_1("EyeCandy", EyeCandy);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXllQ2FuZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJFeWVDYW5keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUI7Ozs7Ozs7Ozs7OztZQUt6QixXQUFBLGNBQXNCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3hDO29CQUNFLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU07b0JBQ1gsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUN4QixDQUFDO2FBQ0YsQ0FBQSJ9