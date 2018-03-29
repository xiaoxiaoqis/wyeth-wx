module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy', '.vue']
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'no-undef': 0,
    'key-spacing': 0,
    'keyword-spacing': 0,
    'indent': 0,
    'space-infix-ops': 0,
    'padded-blocks': 0,
    'space-before-blocks': 0,
    'eqeqeq': 0,
    'comma-spacing': 0,
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0
  }
}
