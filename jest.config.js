module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setup/jest.setup.ts'],
  //testSequencer: '<rootDir>/src/setup/sequencer.ts',
};