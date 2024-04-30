/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/__testutils__/'],
  testMatch: ['**/?(*.)+(test).ts?(x)'],
  testTimeout: 100000,
};
