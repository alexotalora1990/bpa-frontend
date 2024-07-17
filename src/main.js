import { createApp } from 'vue';
import {createPinia} from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';



import App from './App.vue'
import router from "./routes/routes.js"
import axios from "axios"

import {Quasar, Notify, Loading} from 'quasar'
// Importa icon libraries
import '@quasar/extras/material-icons/material-icons.css';
// Importa Quasar css
import 'quasar/src/css/index.sass';



axios.defaults.baseURL="";

const pinia= createPinia();
 pinia.use(piniaPluginPersistedstate);

const app= createApp(App)



 app.use(Quasar,{
    plugins:{
        Notify,
        Loading
    }
 })
 app.use(router)
app.use(pinia)
app.mount('#app')
