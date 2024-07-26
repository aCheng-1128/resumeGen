import { createSSRApp } from 'vue'
import uvUI from '@climblee/uv-ui'
import App from './App.vue'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'

export function createApp() {
    const app = createSSRApp(App)
    app.use(uvUI)
    console.log('platform', uni.getSystemInfoSync())
    return {
        app,
    }
}
