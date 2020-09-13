import typescript from "rollup-plugin-typescript2";

export default {
  external: [ "@box2d" ],
  input: "testbed.ts",
  output: {
    globals: { "@box2d": "b2" },
    file: "./dist/testbed.umd.js",
    name: "testbed",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015", declaration: false, declarationMap: false } } }),
  ]
};
