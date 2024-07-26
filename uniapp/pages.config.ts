import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
    globalStyle: {
        navigationStyle: 'default',
        navigationBarTitleText: '',
        navigationBarBackgroundColor: '#f8f8f8',
        navigationBarTextStyle: 'black',
        backgroundColor: '#FFFFFF',
    },
    easycom: {
        autoscan: true,
        custom: {
            '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
            '^uv-(.*)': '@climblee/uv-ui/components/uv-$1/uv-$1.vue',
        },
    },
    tabBar: {
        color: '#A3ABBE',
        selectedColor: '#7559ff',
        backgroundColor: '#FFF',
        borderStyle: 'white',
        height: '48px',
        fontSize: '13px',
        iconWidth: '20px',
        spacing: '4px',
        list: [
            {
                pagePath: 'pages/index/index',
                text: '首页',
            },
            {
                pagePath: 'pages/index2/index',
                text: '我的',
            },
        ],
    },
})
