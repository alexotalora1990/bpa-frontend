import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/login.vue"
import Home from "../components/home.vue"
import Administrador from "../components/administrador.vue"
import Finca from "../components/fincas.vue"
import Empleado from "../components/empleados.vue"


import Parcela from "../components/parcelas.vue"

import Cultivo from "../components/cultivos.vue"


const routes = [
    { path: "/", component: Login },
    {
        path: "/home", component: Home, children: [
            { path: "/administrador", component: Administrador },
            { path: "/finca", component: Finca },

            { path: "/empleado", component: Empleado }


            { path: "/parcela", component: Parcela }

            {path:"/cultivo", component: Cultivo}

    }
];

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;
