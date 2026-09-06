import stylexOptions from "./stylex.config.cjs";

// The port retains the baseline compiled vendor-prefixed declarations.
// Next still optimizes the emitted CSS in production; no new browser support target is introduced.
const config = {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["src/**/*.stylex.js"],
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [["@stylexjs/babel-plugin", stylexOptions]],
      },
      useCSSLayers: false,
    },
  },
};

export default config;
