import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useCompradorStore = defineStore("store", () =>{
    let loading = ref(false)
    let compradores = ref([]);
    

    const listarCompradores = async () => {
        try {
            loading.value = true;
            const response = await axios.get("comprador",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        compradores.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de compradores:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getCompradoresActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`comprador/obtener/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
        compradores.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de compradores activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getCompradoresInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`comprador/obtener/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
            compradores.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de compradores Inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postCompradores = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("comprador/agregar", data, {
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
    const putCompradores = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`comprador/actualizar/${id}`, data,{
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
    const putCompradoresActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`comprador/activar/${id}`,{},{
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
    const putCompradoresDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`comprador/desactivar/${id}`,{},{
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

    return {listarCompradores,getCompradoresActivos,getCompradoresInactivos,compradores,postCompradores, putCompradores, putCompradoresActivar, putCompradoresDesactivar, loading}
    
},{persist:true})