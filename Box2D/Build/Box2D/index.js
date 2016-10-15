//const box2d = require('./box2d.js');

const path = require('path');
const vm = require("vm");
const fs = require("fs");

function loadexec(url, context) {
  const data = fs.readFileSync(url);
  vm.runInNewContext(data, context, url);
}

global.System = global.System || require('systemjs');

loadexec(path.resolve(__dirname, "box2d.js"), global);

System.import("Box2D").then(function(module) {
  console.log(module.b2_version.toString());
}).catch(function (error) {
  console.error(error);
});
