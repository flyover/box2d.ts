import typescript from "rollup-plugin-typescript2";

export default {
  input: "HelloWorld.ts",
  output: {
    file: "../Build/HelloWorld/helloworld.umd.js",
    name: "helloworld",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015" } } }),
  ]
};
