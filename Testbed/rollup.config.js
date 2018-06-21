import typescript from "rollup-plugin-typescript2";

export default {
  input: "Testbed.ts",
  output: {
    file: "../dist/box2d-testbed.umd.js",
    name: "testbed",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015" } } }),
  ]
};
