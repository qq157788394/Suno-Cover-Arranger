const { createConfig } = require('@umijs/test');

module.exports = async () => {
  const config = createConfig({
    target: 'browser',
    jsTransformer: 'ts-jest',
  });

  return {
    ...config,
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.jsx'],
    testEnvironmentOptions: {
      url: 'http://localhost:8000',
    },
    moduleNameMapper: {
      ...config.moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(.*\\.mjs$|@google/genai|tsyringe|reflect-metadata))',
    ],
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.json',
          babelConfig: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      ],
      '^.+\\.(js|jsx)$': [
        'babel-jest',
        {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
        },
      ],
      'node_modules/@google/genai/.+\\.mjs$': [
        'babel-jest',
        {
          presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        },
      ],
    },
  };
};
