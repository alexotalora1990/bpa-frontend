import { createRouter, createWebHashHistory } from 'vue-router';
import { useAdministradorStore } from '../store/administrador';


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

import Semilla from '../components/semillas.vue'

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
            {path: "/elaboracionSustrato",component:Sustrato},
            {path: "/semilla",component:Semilla}


  const auth = (to, from, next) => {
    if (checkAuth()) {
        const userAdmin = useAdministradorStore();
        const rol = userAdmin.admin.rol;
        console.log(to.meta);
        if (to.meta && to.meta.rol && !to.meta.rol.includes(rol)) {
            return next({ name: 'login' });
        }
        next();
    } else {
        return next({ name: 'login' });
    }
};

const checkAuth = () => {
    const userAdmin = useAdministradorStore();
    const token = userAdmin.token;
    console.log(token);
    if (!token) return false;
    return true;
};


  
const routes = [
     { path: '/', name: 'login', component: Login },

   
    {
        path: "/home", component: Home,
         children: [
            { path: "/administrador", component: Administrador , beforeEnter: auth, meta: { rol: ['Administrador'] }},
            { path: "/finca", component: Finca, beforeEnter: auth, meta: { rol: ['Administrador'] } },
            { path: "/cultivo", component: Cultivo,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            { path: "/parcela", component: Parcela,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            { path: "/empleados", component: Empleado,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            { path: "/clima", component: Clima,beforeEnter: auth, meta: { rol: ['Administrador'] }},     
            { path: "/nomina", component: Nomina,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/proveedores",component:Proveedores,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/insumo",component:Insumos,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/maquinaria",component:Maquinaria,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/semilla",component:Semillas,beforeEnter: auth, meta: { rol: ['Administrador'] }},             
            {path:"/procesos",component:Proceso,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/produccion",component:Produccion,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/riegos",component:Riego,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path:"/comprador",component:Comprador,beforeEnter: auth, meta: { rol: ['Administrador'] }},
            {path: "/elaboracionSustrato",component:Sustrato,beforeEnter: auth, meta: { rol: ['Administrador'] }}

        ]
    }
];

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;