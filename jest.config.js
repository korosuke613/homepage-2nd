/** @type {import('jest').Config} */

const config = {
  reporters: [
    'default',
    ['jest-junit', { outputFile: 'test-results/unit.xml' }],
  ],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['src/tests/unit'],
  collectCoverage: true,
  coverageReporters: ['text', 'cobertura'],
  transformIgnorePatterns: [
    '/node_modules/(?!(strip-ansi|ansi-regex)/)', // strip-ansi and ansi-regex are to be transpiled.
  ],
};

module.exports = config;
