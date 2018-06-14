import typescript from "rollup-plugin-typescript2";

export default {
  input: "main.ts",
  output: {
    file: "dist/bundle.js",
    name: "box2d",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true }),
  ]
};
