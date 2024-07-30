import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/login.vue"
import Home from "../components/home.vue"
import Administrador from "../components/administrador.vue"
import Finca from "../components/fincas.vue"

const routes=[
    {path:"/", component:Login},
    {path:"/home", component:Home},
    {path:"/administrador", component:Administrador},
    {path:"/finca", component:Finca}
]

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;
