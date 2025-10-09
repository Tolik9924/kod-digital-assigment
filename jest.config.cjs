const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.app.json",
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transformIgnorePatterns: ["node_modules/(?!some-esm-lib)"],
  moduleNameMapper: {
    "\\.module\\.scss$": "identity-obj-proxy",
    "\\.scss$": "<rootDir>/__mocks__/styleMock.js",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
