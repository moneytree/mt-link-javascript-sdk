const packageJSON = require('./package.json');

module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  setupFilesAfterEnv: ['./scripts/jest/setup.ts'],
  modulePathIgnorePatterns: [
    // https://github.com/facebook/jest/issues/2070#issuecomment-431706685
    '<rootDir>/.*/__mocks__'
  ],
  globals: {
    __VERSION__: packageJSON.version
  }
};
