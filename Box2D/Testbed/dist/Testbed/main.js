System.register(["Testbed"], function (exports_1, context_1) {
    "use strict";
    var testbed, app, init, loop;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            init = (time) => {
                app = new testbed.Main(time);
                window.requestAnimationFrame(loop);
            };
            loop = (time) => {
                window.requestAnimationFrame(loop);
                app.SimulationLoop(time);
            };
            window.requestAnimationFrame(init);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFHTSxJQUFJLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtnQkFDNUIsR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQztZQUNJLElBQUksR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO2dCQUM1QixNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDIn0=