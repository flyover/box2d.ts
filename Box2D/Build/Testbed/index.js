//const box2d = require('./box2d-testbed.js');

const path = require('path');
const vm = require("vm");
const fs = require("fs");

function loadexec(url, context) {
  const data = fs.readFileSync(url);
  vm.runInNewContext(data, context, url);
}

global.System = global.System || require('systemjs');

loadexec(path.resolve(__dirname, "box2d-testbed.js"), global);

System.import("Testbed/Testbed").then(function(module) {
  console.log(module.Main);
}).catch(function (error) {
  console.error(error);
});
