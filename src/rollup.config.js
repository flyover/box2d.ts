import typescript from "rollup-plugin-typescript2";

export default {
  input: "box2d.ts",
  output: {
    file: "../build/box2d/box2d.umd.js",
    name: "box2d",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015" } } }),
  ]
};
