/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx'],
    theme: {
        extend: {
            colors: {
                'ty-main': 'var(--main-color)',
                'ty-white': 'var(--white-color)',
                'ty-black': 'var(--black-color)',

                // 简历字色
                'rs-fc': 'var(--resume-fontColor)'
            },
            lineHeight: {
                // 简历行距
                'rs-ls': 'var(--resume-lineSpacing)'
            },
            fontFamily: {
                // 简历字体
                'rs-ff': 'var(--resume-fontFamily)'
            },
            fontSize: {
                // 简历字号
                'rs-fs': 'var(--resume-fontSize)'
            },
            spacing: {
                // 简历模块间距
                'rs-ms': 'var(--resume-moduleSpacing)',
                // 简历页边距
                'rs-pm': 'var(--resume-pageMargin)',
                // 简历行距
                'rs-ls': 'var(--resume-lineSpacing) '
            }
        }
    },
    plugins: []
}
