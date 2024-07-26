/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier/skip-formatting'],
    overrides: [
        {
            files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
            extends: ['plugin:cypress/recommended']
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    /* 
    "off"   或者 0  //关闭规则
    "warn"  或者 1  //把规则作为警告（不影响退出代码）
    "error" 或者 2  //把规则作为错误（退出代码触发时为1）
    */
    rules: {
        indent: [1, 4], //缩进风格
        '@typescript-eslint/no-explicit-any': 'off', // 允许使用any
        '@typescript-eslint/no-unused-vars': 2, //变量声明了但未使用
        // "semi": [1, "always"], // 分号
        // quotes: [1, 'single'], // 引号类型 "double" 'single' `backtick`
        'semi-spacing': [1, { before: false, after: true }], //分号前后空格
        'use-isnan': 2, //禁止比较时使用NaN，只能用isNaN()
        'valid-jsdoc': 0, //jsdoc规则
        'max-depth': [0, 4], //嵌套块深度
        '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore
        'vue/multi-word-component-names': [2, { ignores: ['index'] }], //组件名字使用两个单词，忽略index
        'vue/no-setup-props-destructure': 0, // 允许使用props解构
        '@typescript-eslint/no-this-alias': 0, // 更改this别名
        'no-extra-semi': 0, // 不必要的分号
        'vue/prefer-import-from-vue': 0 // 可以从这里面引入
    }
}
