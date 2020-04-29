module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/__stories__/**/*.ts',
    '!src/**/__stories__/**/*.tsx',
    '!src/**/__tests__/**/*.ts',
    '!src/**/__tests__/**/*.tsx',
  ],

  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  setupFiles: [
    '../../setup-jest.js',
  ],
};
