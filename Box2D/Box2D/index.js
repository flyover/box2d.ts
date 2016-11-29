process.chdir(__dirname);

global.System = global.System || require('systemjs');
global.ts = global.ts || require('typescript');

function boot(args) {
  if (!false) {
    System.config({
      transpiler: "typescript",
      typescriptOptions: {},
      packages: {
        '.': { defaultExtension: 'ts' }
      }
    });
  } else {
    System.config({
      packages: {
        '.': { defaultExtension: 'js' }
      }
    });
  }
  System.import("Box2D").then(function(box2d) {
    console.log(box2d.b2_version);
  }).catch(function(error) {
    console.error(error);
  });
}

if (require.main === module) {
  var args = process.argv.slice(2); // args from command line
  console.log(args);
  boot(args);
} else {
  module.exports = boot;
}
