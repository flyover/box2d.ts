function boot(args) {
  process.chdir(__dirname);
  global.System = global.System || require('systemjs');
  global.ts = global.ts || require('typescript');
  if (!false && global.ts) {
    System.config({
      transpiler: "typescript",
      typescriptOptions: {},
      packages: {
        '.': { defaultExtension: 'ts' },
        '../Box2D': { defaultExtension: 'ts' }
      }
    });
  } else {
    System.config({
      packages: {
        '.': { defaultExtension: 'js' },
        '../Box2D': { defaultExtension: 'js' }
      }
    });
  }
  System.import("Testbed").then(function(Testbed) {
    console.log(Testbed.Main);
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
