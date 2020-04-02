module.exports = {
  sourceMaps: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          android: '4',
          ios: '9'
        },
        corejs: '3',
        useBuiltIns: 'usage',
        debug: true
      }
    ],
    ['@babel/preset-react']
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  ignore: ['node_modules']
}
