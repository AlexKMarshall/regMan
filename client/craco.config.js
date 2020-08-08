const path = require('path');

// used to configure Craco. It changes pathing to the root directory to '@app/'
module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
      '@test': path.resolve(__dirname, 'test/'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@app(.*)$': '<rootDir>/src$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
      },
    },
  },
};
