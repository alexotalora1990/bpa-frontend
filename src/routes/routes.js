import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/login.vue"

const routes=[
    {path:"/", component:Login}
]

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;
