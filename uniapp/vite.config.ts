import path from 'node:path'
import dayjs from 'dayjs'
import { defineConfig, loadEnv } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import Components from '@uni-helper/vite-plugin-uni-components'
import UnoCSS from 'unocss/vite'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import ViteRestart from 'vite-plugin-restart'
import { visualizer } from 'rollup-plugin-visualizer'

export default ({ command, mode }) => {
    console.log('command:', command, 'mode:', mode)
    const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))

    return defineConfig({
        envDir: './env',
        plugins: [
            UniPages({
                exclude: ['**/components/**/**.*', '**/hooks/**/**', '**/hook/**/**'],
                routeBlockLang: 'json5',
                homePage: 'pages/index/index',
                subPackages: ['src/pages-sub'],
            }),
            UniLayouts(),
            UniPlatform(),
            UniManifest(),
            Components(),
            Uni(),
            UnoCSS(),
            svgLoader(),
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                symbolId: 'icon-[dir]-[name]',
            }),
            vueSetupExtend(),
            AutoImport({
                imports: ['vue', 'uni-app'],
                dts: 'src/auto-import.d.ts',
                dirs: ['src/hooks', 'src/utils/tyToast'],
                eslintrc: { enabled: true },
            }),
            ViteRestart({
                restart: ['vite.config.js'],
            }),
            process.env.UNI_PLATFORM === 'h5' && {
                name: 'html-transform',
                transformIndexHtml(html) {
                    return html.replace('%BUILD_DATE%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
                },
            },
            mode === 'production' &&
                visualizer({
                    filename: './node_modules/.cache/visualizer/stats.html',
                    open: true,
                    gzipSize: true,
                    brotliSize: true,
                }),
        ],

        css: {
            postcss: {
                plugins: [],
            },
        },

        resolve: {
            alias: {
                '@': path.join(process.cwd(), './src'),
            },
        },
        server: {
            host: '0.0.0.0',
            hmr: true,
            port: Number.parseInt(env.VITE_APPPORT, 10),
        },
    })
}
