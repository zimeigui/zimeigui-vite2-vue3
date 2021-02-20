import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
// 工厂函数创建router实力

import Home from 'views/home.vue';

export const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    }
]

const router = createRouter({
    history: createWebHistory(), // createWebHistory ==> history模式  createWebHashHistory==> hash模式
    routes
})

export default router
