// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoAlias = require('craco-alias');

exports.plugins = [
  {
    plugin: CracoAlias,
    options: {
      source: 'tsconfig',
      baseUrl: './src',
      tsConfigPath: 'tsconfig.paths.json',
    },
  },
];
