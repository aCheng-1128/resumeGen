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
        // eslint-plugin-import 插件， @see https://www.npmjs.com/package/eslint-plugin-import
        'plugin:import/recommended',
        // eslint-config-airbnb-base 插件， tips: 本插件也可以替换成 eslint-config-standard
        'airbnb-base',
        // 1. 接入 prettier 的规则
        'prettier',
        'plugin:prettier/recommended',
        'vue-global-api',
        './.eslintrc-auto-import.json',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'vue',
        // 2. 加入 prettier 的 eslint 插件
        'prettier',
        // eslint-import-resolver-typescript 插件，@see https://www.npmjs.com/package/eslint-import-resolver-typescript
        'import',
    ],
    /* 
    "off"   或者 0  //关闭规则
    "warn"  或者 1  //把规则作为警告（不影响退出代码）
    "error" 或者 2  //把规则作为错误（退出代码触发时为1）
    */
    rules: {
        // 3. 注意要加上这一句，开启 prettier 自动修复的功能
        'prettier/prettier': 'error',
        // turn on errors for missing imports
        'import/no-unresolved': 'off',
        // 对后缀的检测，否则 import 一个ts文件也会报错，需要手动添加'.ts', 增加了下面的配置后就不用了
        'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
        // 只允许1个默认导出，关闭，否则不能随意export xxx
        'import/prefer-default-export': ['off'],
        'no-console': ['off'],
        // 'no-unused-vars': ['off'],
        // '@typescript-eslint/no-unused-vars': ['off'],
        // 解决vite.config.ts报错问题
        'import/no-extraneous-dependencies': 'off',
        'no-plusplus': 'off',
        'no-shadow': 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        // 允许不是驼峰
        camelcase: 'off',
        // 允许没有使用的变量
        'no-unused-vars': 2,
        '@typescript-eslint/no-unused-vars': 2,
        'valid-jsdoc': 0, // jsdoc规则
        '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore
        'selector-class-pattern': 0,
        'spaced-comment': 0, // 注释前后需要空格
        'no-return-assign': 0, // 允许return时赋值
        'no-param-reassign': 0, // 允许参数赋值
        'prefer-destructuring': 0, // 允许解构
        'no-useless-return': 0, // 允许无用的return
        'no-unused-expressions': 0, // 允许无用的表达式
        'consistent-return': 0, // 允许不同的返回值
        'vue/no-v-text-v-html-on-component': 0, // 允许v-text和v-html
        'no-else-return': 0, // 允许else return
        'object-shorthand': 0, // 允许对象简写
        'vue/no-deprecated-destroyed-lifecycle': 0, // 允许destroyed生命周期
        'prefer-template': 0, // 允许字符串拼接
        'import/no-cycle': 0, // 允许循环引用
    },
    // eslint-import-resolver-typescript 插件，@see https://www.npmjs.com/package/eslint-import-resolver-typescript
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
        uni: true,
        UniApp: true,
        wx: true,
        WechatMiniprogram: true,
        getCurrentPages: true,
        UniHelper: true,
        Page: true,
        App: true,
    },
}
