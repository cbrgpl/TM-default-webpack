module.exports = {
  sourceType: 'unambiguous',
  ignore : [
    /[/\\]core-js/,
    /@babel[/\\]runtime/,
  ],
  presets: [
    [ '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs:  { version: 3, proposals: true },
      }
    ],
  ],
  plugins: [ '@babel/plugin-transform-runtime' ]
}
