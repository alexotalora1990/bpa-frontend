
import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useControlPlagasStore = defineStore("controlPlagas", () =>{
    let loading = ref(false)
    let controlPlagas= ref([]);
    

    const listarcontrolPlagas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("controlPlagas",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        controlPlagas.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de procesos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getProcesosActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`procesos/obtener/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          procesos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de procesos activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getProcesosInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`procesos/obtener/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          procesos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de procesos Inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postProcesos = async(data)=>{
        console.log(data);
        
        try {
            loading.value=true
            const r = await axios.post("procesos/agregar", data, {
                // headers:{
                //     token:useAdministrador.token
                // }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putProcesos = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`procesos/actualizar/${id}`, data,{
                // headers:{
                //     token:useAdministrador.token
                // }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putProcesosActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`procesos/activar/${id}`,{},{
                // headers:{
                //     token:useAdministrador.token
                // }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putProcesosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`procesos/desactivar/${id}`,{},{
                // headers:{
                //     token:useAdministrador.token
                // }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    return {listarProcesos,getProcesosActivos,getProcesosInactivos,procesos,postProcesos, putProcesos, putProcesosActivar, putProcesosDesactivar, loading}
    
},{persist:true})

