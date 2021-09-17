module.exports = {
  "parser":   "@typescript-eslint/parser",
  "plugins":  [
    "@typescript-eslint",
  ],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "parserOptions": {
    "sourceType": "script",
  },
  "rules": {
    // Incorrect for TS
    // eslint-disable-next-line
    "indent": "off",
    "@typescript-eslint/indent": [
      "warn",
      2,
      {
        "MemberExpression":   0,
        "SwitchCase":         1,
        "VariableDeclarator": { "var": 2, "let": 2, "const": 3 },
        "CallExpression":     {"arguments": "first"},
        "ArrayExpression":    1,
        "ObjectExpression":   1,
        "ImportDeclaration":  1,
      },
    ],

    "quotes": [
      "warn",
      "double",
    ],
    "semi": [
      "warn",
      "never",
    ],
    "key-spacing": [
      "warn",
      {
        "afterColon": true,
        "mode": "minimum",
      },
    ],
    "strict": [
      "warn",
      "safe",
    ],
    "no-new-require": [
      "warn",
    ],
    "global-require": [
      "warn",
    ],
    "no-template-curly-in-string": [
      "warn",
    ],
    "no-unsafe-negation": [
      "warn",
    ],
    "block-scoped-var": [
      "warn",
    ],
    "func-call-spacing": [
      "warn",
      "never",
    ],
    "no-extra-semi": [
      "warn",
    ],
    "no-empty-function": [
      "warn",
    ],
    "no-eval": [
      "warn",
    ],
    "no-extend-native": [
      "warn",
    ],
    "no-floating-decimal": [
      "warn",
    ],
    "no-global-assign": [
      "warn",
    ],
    "no-implied-eval": [
      "warn",
    ],
    "no-lone-blocks": [
      "warn",
    ],
    "no-loop-func": [
      "warn",
    ],
    "no-param-reassign": [
      "warn",
      {
        "props": false,
      },
    ],
    "no-return-assign": [
      "warn",
    ],
    "no-self-compare": [
      "warn",
    ],
    "no-sequences": [
      "warn",
    ],
    "no-throw-literal": [
      "warn",
    ],
    "no-useless-escape": [
      "warn",
    ],
    "no-void": [
      "warn",
    ],
    "no-with": [
      "warn",
    ],
    "vars-on-top": [
      "warn",
    ],
    "no-catch-shadow": [
      "warn",
    ],
    "no-label-var": [
      "warn",
    ],
    "no-shadow-restricted-names": [
      "warn",
    ],

    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["warn"],

    "no-undef-init": [
      "warn",
    ],
    "no-undefined": [
      "warn",
    ],
    "no-use-before-define": [
      "warn",
      {
        "functions": false,
        "classes": true,
      },
    ],
    "comma-dangle": [
      "warn",
      "always-multiline",
    ],

    // Incompatible with TypeScript
    // eslint-disable-next-line
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "vars":               "all",
        "args":               "after-used",
        "argsIgnorePattern":  "^_",
      },
    ],

    "no-console": [
      "warn",
      {
        "allow": ["warn", "error"],
      },
    ],
  },
  "settings": {
  },
}
