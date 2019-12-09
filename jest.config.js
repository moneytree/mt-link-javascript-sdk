const packageJSON = require('./package.json');

module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  testPathIgnorePatterns: ['/node_modules/', '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/jest/coverage',
  coveragePathIgnorePatterns: ['/__tests__/'],
  errorOnDeprecated: true,
  globals: {
    VERSION: packageJSON.version
  }
};
