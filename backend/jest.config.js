/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
    "^.+\\.js$": "babel-jest", 
  },
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.(ts|tsx|js)",
    "<rootDir>/tests/integration/**/*.test.(ts|tsx|js)",
    "<rootDir>/tests/e2e/**/*.test.(ts|tsx|js)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
