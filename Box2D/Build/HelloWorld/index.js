//const box2d = require('./box2d-helloworld.js');

const path = require('path');
const vm = require("vm");
const fs = require("fs");

function loadexec(url, context) {
  const data = fs.readFileSync(url);
  vm.runInNewContext(data, context, url);
}

global.System = global.System || require('systemjs');

loadexec(path.resolve(__dirname, "box2d-helloworld.js"), global);

System.import("HelloWorld/HelloWorld").then(function(module) {
  module.main();
}).catch(function (error) {
  console.error(error);
});
