const packageJSON = require('./package.json');

module.exports = {
  errorOnDeprecated: true,
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d\.ts$'
  ],
  transform: {
    '.ts': 'ts-jest'
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/jest/coverage',
  coveragePathIgnorePatterns: [
    '/__tests__/'
  ],
  globals: {
    VERSION: packageJSON.version
  }
};
