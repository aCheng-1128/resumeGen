import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

const router = createRouter({
    history: createWebHistory(), // 添加这一行
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/index/index.vue')
        },
        {
            path: '/resume',
            name: 'resume',
            component: () => import('@/views/resume/index.vue')
        },
        {
            path: '/cozeChat',
            name: 'cozeChat',
            component: () => import('@/views/cozeChat/index.vue')
        }
    ]
})

export interface toRouteType extends RouteLocationNormalized {
    meta: {
        title?: string
        noCache?: boolean
    }
}

export default router
