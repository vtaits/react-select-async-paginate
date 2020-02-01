module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    '!src/**/__stories__/**/*.js',
    '!src/**/__stories__/**/*.jsx',
    '!src/**/__tests__/**/*.js',
    '!src/**/__tests__/**/*.jsx',
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
