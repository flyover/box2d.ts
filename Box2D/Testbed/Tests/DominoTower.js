System.register(["../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testbed, DominoTower;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            DominoTower = class DominoTower extends testbed.Test {
                constructor() {
                    super();
                }
                static Create() {
                    return new DominoTower();
                }
            };
            exports_1("DominoTower", DominoTower);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9taW5vVG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJEb21pbm9Ub3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQUdBLGNBQUEsaUJBQXlCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQzNDO29CQUNFLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU07b0JBQ1gsT0FBTyxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUMzQixDQUFDO2FBQ0YsQ0FBQSJ9