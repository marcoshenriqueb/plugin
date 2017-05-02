// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.config.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // 'global-require': 0,
    // 'no-param-reassign': 0,
    // 'import/no-unresolved': 0,
    // 'import/imports-first': 0,
    "linebreak-style": [
        "error"
    ],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}