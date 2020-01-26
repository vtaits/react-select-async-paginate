module.exports = {
  collectCoverageFrom: [
    'packages/react-select-async-paginate/src/**/*.js',
    'packages/react-select-async-paginate/src/**/*.jsx',
    '!packages/react-select-async-paginate/src/**/__stories__/**/*.js',
    '!packages/react-select-async-paginate/src/**/__stories__/**/*.jsx',
    '!packages/react-select-async-paginate/src/**/__tests__/**/*.js',
    '!packages/react-select-async-paginate/src/**/__tests__/**/*.jsx',
  ],

  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
  ],

  setupFiles: [
    './setup-jest.js',
  ],
};
