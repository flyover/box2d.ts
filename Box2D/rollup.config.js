import typescript from "rollup-plugin-typescript2";

export default {
  input: "Box2D.ts",
  output: {
    file: "../Build/Box2D/box2d.umd.js",
    name: "box2d",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015" } } }),
  ]
};
