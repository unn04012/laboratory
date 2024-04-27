module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['src'],
  //   moduleNameMapper: {
  //     '^axios$': require.resolve('axios'),
  //   },
  testTimeout: 10000,
};
