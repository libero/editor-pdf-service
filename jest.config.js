
const tsPreset = require('ts-jest/jest-preset');

module.exports = {
  ...tsPreset,
  "collectCoverage": true,
  "coverageDirectory": "./test/report",
  "coverageThreshold": {
      "global": {
          "branches": 80,
          "functions": 80,
          "lines": 80,
          "statements": 0
      }
  },
  "transform": {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/src/.*|(\\.|/)(test|spec))\\.[jt]s?$",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}