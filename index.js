global["System"] = require("systemjs").System;
const args = process.argv.slice(2);
console.log(args);
System.import("./build/index.js").then(function (b2) {
  console.log(b2.version);
}).catch(console.error);
System.import("./build/box2d.js").then(function (box2d) {
  console.log(box2d.b2_version);
}).catch(console.error);
