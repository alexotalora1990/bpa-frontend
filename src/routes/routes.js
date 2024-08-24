import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/login.vue"
import Home from "../components/home.vue"
import Administrador from "../components/administrador.vue"
import Finca from "../components/fincas.vue"
import Cultivo from "../components/cultivos.vue"
import Parcela from "../components/parcelas.vue";
import Empleados from '../components/empleados.vue';
import Proveedores from '../components/proveedores.vue';
import Insumos from '../components/insumos.vue'

const routes = [
    { path: "/", component: Login },
    {
        path: "/home", component: Home, children: [
            { path: "/administrador", component: Administrador },
            { path: "/finca", component: Finca },
            { path:"/cultivo", component: Cultivo},
            { path:"/empleado", component: Empleados},
            { path:"/proveedor", component: Proveedores},
            {path:"/insumo",component: Insumos},
            { path:"/parcela", component: Parcela}
        ]
    }
];

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;