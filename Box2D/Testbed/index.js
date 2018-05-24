process.chdir(__dirname);

global.System = global.System || require('systemjs');
global.ts = global.ts || require('typescript');

function boot(args) {
  if (!false) {
    System.config({
      transpiler: "typescript",
      typescriptOptions: {},
      packages: {
        '.': { defaultExtension: 'ts' },
        '..': { defaultExtension: 'ts' }
      }
    });
  } else {
    System.config({
      packages: {
        '.': { defaultExtension: 'js' },
        '..': { defaultExtension: 'js' }
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
