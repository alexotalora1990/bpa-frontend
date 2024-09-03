import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/login.vue"
import Home from "../components/home.vue"
import Administrador from "../components/administrador.vue"
import Finca from "../components/fincas.vue"
import Parcela from "../components/parcelas.vue";
import Empleado from "../components/empleados.vue"
import Clima from "../components/clima.vue"
import Cultivo from "../components/cultivos.vue";
import Proveedores from '../components/proveedores.vue';
import Insumos from '../components/insumos.vue'
import Maquinaria from "../components/maquinaria.vue"
import Semillas from "../components/semillas.vue"
import Proceso from "../components/procesos.vue"
import Produccion from "../components/produccion.vue"
import Nomina from "../components/nomina.vue"
import Riego from "../components/riego.vue"
import Comprador from "../components/comprador.vue"
import Sustrato from '../components/elaboracionSustrato.vue';


const routes = [
    { path: "/", component: Login },
    {
        path: "/home", component: Home, children: [
            { path: "/administrador", component: Administrador },
            { path: "/finca", component: Finca },
            { path: "/cultivo", component: Cultivo},
            { path: "/parcela", component: Parcela},
            { path: "/empleados", component: Empleado},
            { path: "/clima", component: Clima},     
            { path: "/nomina", component: Nomina},
            { path:"/cultivo", component: Cultivo},
            { path:"/parcela", component: Parcela},
            { path:"/cultivo", component: Cultivo},
            {path:"/proveedores",component:Proveedores},
            {path:"/insumo",component:Insumos},
            {path:"/maquinaria",component:Maquinaria},
            {path:"/semilla",component:Semillas},             
            {path:"/procesos",component:Proceso},
            {path:"/produccion",component:Produccion},
            {path:"/riegos",component:Riego},
            {path:"/comprador",component:Comprador},
            {path: "/elaboracionSustrato",component:Sustrato}



        ]
    }
];

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;