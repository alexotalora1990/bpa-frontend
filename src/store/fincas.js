import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useFincaStore = defineStore("store", () =>{
    let loading = ref(false)
    let fincas = ref([]);
    const useAdministrador = useAdministradorStore()

    const listarFincas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("finca",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        fincas.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de fincas:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getFincasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`finca/obtener/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          fincas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de fincas activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getFincasInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`finca/obtener/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          fincas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de fincas Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postFincas = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("finca/agregar", data, {
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
    const putFincas = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`finca/actualizar/${id}`, data,{
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
    const putFincasActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`finca/activar/${id}`,{},{
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
    const putFincasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`finca/desactivar/${id}`,{},{
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

    return {listarFincas,getFincasActivos,getFincasInactivos,fincas,postFincas, putFincas, putFincasActivar, putFincasDesactivar, loading}
    
},{persist:true})