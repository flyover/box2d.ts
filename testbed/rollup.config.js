import typescript from "rollup-plugin-typescript2";

export default {
  input: "testbed.ts",
  output: {
    file: "../build/testbed/testbed.umd.js",
    name: "testbed",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015" } } }),
  ]
};
