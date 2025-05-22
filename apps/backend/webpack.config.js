const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const isDevelopModeEnabled = !!(process.env['DEVELOPMODE']);

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: isDevelopModeEnabled ? './tsconfig.dev.json' : './tsconfig.app.json',
      generatePackageJson: true,
      sourceMap: isDevelopModeEnabled,
      outputHashing: !isDevelopModeEnabled ? 'all' : 'none',
      optimization: !isDevelopModeEnabled
    }),
  ],
};
