import './assets/style/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// normalize.css
import 'normalize.css/normalize.css'
import './assets/style/tailwind.css'
// svg icon
import 'virtual:svg-icons-register'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'

// 判断是否为微信浏览器
// isWechatBrowser()

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')