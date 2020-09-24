import typescript from "rollup-plugin-typescript2";

export default {
  external: [ "@box2d" ],
  input: "unit-test.ts",
  output: {
    globals: { "@box2d": "b2" },
    file: "./dist/unit-test.umd.js",
    name: "unit_test",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015", declaration: false } } }),
  ]
};
