import type { NextConfig } from "next";
import stylexOptions from "./stylex.config.cjs";
const stylexLoader = {
  loader: "babel-loader",
  options: {
    babelrc: false,
    configFile: false,
    plugins: [["@stylexjs/babel-plugin", stylexOptions]],
  },
};

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({ test: /\.stylex\.js$/, use: [stylexLoader] });
    return config;
  },
  experimental: {
    typedRoutes: true,
    turbo: {
      rules: { "*.stylex.js": { loaders: [stylexLoader], as: "*.js" } },
    },
  },
};

export default nextConfig;
