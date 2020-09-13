import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/box2d.ts",
  output: {
    file: "./dist/box2d.umd.js",
    name: "box2d",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015", declaration: false } } }),
  ]
};
