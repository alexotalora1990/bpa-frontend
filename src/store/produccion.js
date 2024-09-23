import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useProduccionStore = defineStore("produccion", () =>{
    let loading = ref(false)
    let producciones = ref([]);
    

    const listarProducciones = async () => {
        try {
            loading.value = true;
            const response = await axios.get("produccion/",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        producciones.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de producciones KKKK:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getProduccionesActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`produccion/obtener/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          producciones.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de producciones activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getProduccionesInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`produccion/obtener/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          producciones.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de producciones Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postProducciones = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("produccion/agregar", data, {
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
    const putProducciones = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`produccion/actualizar/${id}`, data,{
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
    const putProduccionesActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`produccion/activar/${id}`,{},{
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
    const putProduccionesDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`produccion/desactivar/${id}`,{},{
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

    return {listarProducciones,getProduccionesActivos,getProduccionesInactivos,producciones,postProducciones, putProducciones, putProduccionesActivar, putProduccionesDesactivar, loading}
    
},{persist:true})