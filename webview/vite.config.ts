import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'

import Markdown from 'unplugin-vue-markdown/vite'
import Pages from 'vite-plugin-pages'
import MarkdownItAnchor from 'markdown-it-anchor'
import { dynamicJsonPlugin } from './plugins/vite-plugin-md-json'

import Inspector from 'vite-plugin-vue-inspector'

// 当前工作目录路径
const root: string = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 环境变量
    const env = loadEnv(mode, root, '')
    return {
        base: env.VITE_BASE_URL || '/',
        plugins: [
            vue({
                include: [/\.vue$/, /\.md$/]
            }),
            vueJsx(),
            mockDevServerPlugin(),
            // vant 组件自动按需引入
            Components({
                dts: 'src/typings/components.d.ts',
                resolvers: [VantResolver()]
            }),
            // svg icon
            createSvgIconsPlugin({
                // 指定图标文件夹
                iconDirs: [path.resolve(root, 'src/icons/svg')],
                // 指定 symbolId 格式
                symbolId: 'icon-[dir]-[name]'
            }),
            // 允许 setup 语法糖上添加组件名属性
            vueSetupExtend(),
            // 生产环境 gzip 压缩资源
            viteCompression(),
            // 注入模板数据
            createHtmlPlugin({
                inject: {
                    data: {
                        ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || 'false',
                        title: env.VITE_APP_TITLE
                    }
                }
            }),
            // 设置html标题
            // Markdown({
            //     wrapperClasses: 'tk-blog-markdown-body',
            //     markdownItSetup(md) {
            //         md.use(MarkdownItAnchor)
            //         // 存储标题信息的数组
            //     }
            // }) as any,
            // dynamicJsonPlugin({
            //     folderPath: path.resolve(__dirname, './src/views/blog/pages'),
            //     outputPath: path.resolve(__dirname, './src/views/blog/hooks'),
            //     outputFilename: 'blogList.json'
            // }),
            // dynamicJsonPlugin({
            //     folderPath: path.resolve(__dirname, './src/views/blog/cases'),
            //     outputPath: path.resolve(__dirname, './src/views/blog/hooks'),
            //     outputFilename: 'caseList.json'
            // }),
            // Pages({
            //     dirs: [
            //         {
            //             dir: './src/views/blog/pages',
            //             baseRoute: '/blogDetail'
            //         },
            //         {
            //             dir: './src/views/blog/cases',
            //             baseRoute: '/caseDetail'
            //         }
            //     ],
            //     extensions: ['vue', 'md']
            // }) as any,

            Inspector()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 81,
            host: true,
            // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
            // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
            proxy: {
                '/dev-api': {
                    target: 'http://192.168.80.35:9000/api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/dev-api/, '')
                }
            }
        },
        define: {
            __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
            __VUE_I18N_LEGACY_API__: JSON.stringify(false),
            __VUE_I18N_PROD_DEVTOOLS__: JSON.stringify(false)
        },
        build: {
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
                }
            }
        }
    }
})
