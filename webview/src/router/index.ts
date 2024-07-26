import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

const router = createRouter({
    history: createWebHistory(), // 添加这一行
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/home.vue')
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
