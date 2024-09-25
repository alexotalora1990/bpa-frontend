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
import Fertilizacion from "../components/fertilizacin.vue"

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
            { path: "/finca", component: Finca, beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] } },
            { path: "/cultivo", component: Cultivo,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            { path: "/parcela", component: Parcela,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            { path: "/empleados", component: Empleado,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            { path: "/clima", component: Clima,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},     
            { path: "/nomina", component: Nomina,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/proveedores",component:Proveedores,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/insumo",component:Insumos,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/maquinaria",component:Maquinaria,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/semilla",component:Semillas,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},             
            {path:"/procesos",component:Proceso,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/produccion",component:Produccion,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/riegos",component:Riego,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/comprador",component:Comprador,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path:"/fertilizacion",component:Fertilizacion,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }},
            {path: "/elaboracionSustrato",component:Sustrato,beforeEnter: auth, meta: { rol: ['Administrador', 'Auxiliar'] }}

        ]
    }
];


export const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export { routes};

export default router;