module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-essential',
        'plugin:import/recommended',
        'airbnb-base',
        'plugin:prettier/recommended',
        'vue-global-api',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'vue', 'prettier', 'import'],
    rules: {
        'prettier/prettier': 'error',
        'import/no-unresolved': 'off',
        'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
        'import/prefer-default-export': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-plusplus': 'off',
        'no-shadow': 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        camelcase: 'off',
        'no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/ban-ts-comment': 'off',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },
    globals: {
        $t: true,
        uni: true, // uni-app 全局变量
        UniApp: true,
        wx: true, // 微信小程序全局变量
        WechatMiniprogram: true,
        getCurrentPages: true,
        UniHelper: true,
        Page: true,
        App: true,
    },
}
