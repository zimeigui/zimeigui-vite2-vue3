import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
// 工厂函数创建router实力

const router = createRouter({
    history: createWebHashHistory(), // createWebHistory ==> history模式  createWebHashHistory==> hash模式
    routes: [
        {
            path: '/',
            component: ()=>import('views/home.vue'),
        }
    ]
})

export default router