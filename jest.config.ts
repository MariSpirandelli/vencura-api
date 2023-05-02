import path from 'path';
const rootDirector = path.resolve(__dirname);

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: `<rootDir>/jest.environment.ts`,
  coverageThreshold: {
    global: {
      branches: 70,
      function: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: rootDirector,
  roots: [rootDirector],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/build',
    `${rootDirector}/__tests__/fixtures`,
    `${rootDirector}/__tests__/setup.ts`,
    `${rootDirector}/__tests__/mocks/*`,
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      { tsconfig: path.resolve(__dirname, 'tsconfig.json') },
    ],
  },
  testRegex: ['((/__tests__/.*)|(\\.|/)(test|spec))\\.tsx?$'],
};
