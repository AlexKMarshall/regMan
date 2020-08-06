const path = require('path');

// used to configure Craco. It changes pathing to the root directory to '@/'
module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@app(.*)$': '<rootDir>/src$1',
      },
    },
  },
};
