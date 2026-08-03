import {
    defineConfig,
    globalIgnores,
} from "eslint/config"

import tsParser from "@typescript-eslint/parser"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import globals from "globals"
import js from "@eslint/js"

import {
    FlatCompat,
} from "@eslint/eslintrc"
import path from "path"
import { fileURLToPath } from "url"

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default defineConfig([{
    languageOptions: {
        parser: tsParser,

        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        "sourceType": "script",
        parserOptions: {},
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    "rules": {
        "indent": ["warn", 2, {
            "MemberExpression": 0,
            "SwitchCase": 1,

            "VariableDeclarator": {
                "var": 2,
                "let": 2,
                "const": 3,
            },

            "CallExpression": {
                "arguments": "first",
            },

            "ArrayExpression": 1,
            "ObjectExpression": 1,
            "ImportDeclaration": 1,
        }],

        "quotes": ["warn", "double"],
        "semi": ["warn", "never"],

        "key-spacing": ["warn", {
            "afterColon": true,
            "mode": "minimum",
        }],

        "strict": ["warn", "safe"],
        "no-new-require": ["warn"],
        "global-require": ["warn"],
        "no-template-curly-in-string": ["warn"],
        "no-unsafe-negation": ["warn"],
        "block-scoped-var": ["warn"],
        "func-call-spacing": ["warn", "never"],
        "no-extra-semi": ["warn"],
        "no-empty-function": ["warn"],
        "no-eval": ["warn"],
        "no-extend-native": ["warn"],
        "no-floating-decimal": ["warn"],
        "no-global-assign": ["warn"],
        "no-implied-eval": ["warn"],
        "no-lone-blocks": ["warn"],
        "no-loop-func": ["warn"],

        "no-param-reassign": ["warn", {
            "props": false,
        }],

        "no-return-assign": ["warn"],
        "no-self-compare": ["warn"],
        "no-sequences": ["warn"],
        "no-throw-literal": ["warn"],
        "no-useless-escape": ["warn"],
        "no-void": ["warn"],
        "no-with": ["warn"],
        "vars-on-top": ["warn"],
        "no-catch-shadow": ["warn"],
        "no-label-var": ["warn"],
        "no-shadow-restricted-names": ["warn"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["warn"],
        "no-undef-init": ["warn"],
        "no-undefined": ["warn"],

        "no-use-before-define": ["warn", {
            "functions": false,
            "classes": true,
        }],

        "comma-dangle": ["warn", "always-multiline"],
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            "vars": "all",
            "args": "after-used",
            "argsIgnorePattern": "^_",
        }],

        "no-console": ["warn", {
            "allow": ["warn", "error"],
        }],
    },

    "settings": {},
}, globalIgnores(["build/**/*", "node_modules/**/*", "flow-typed/**/*"])])
