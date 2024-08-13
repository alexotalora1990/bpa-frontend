import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAnalisisSueloStore} from "./analisisSuelo"



export const useAnalisisSueloaStore = defineStore("store", () =>{
    let loading = ref(false)
    let fincas = ref([]);
    const useAdministrador = useAnalisisSuelorStore()

    const listarAnalisisSuelo = async () => {
        try {
            loading.value = true;
            const response = await axios.get("analisisSuelo",{
            // headers:{
            //     token:useAnalisisSuelo.token
            // }
        });
        analisisSuelo.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de analisisSuelo:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getAnalisisSueloActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`analisisSuelo/obtener/activos`, {
            // headers: {
            //   token:useAnalisisSuelo.token,
            // },
        });
          analisisSuelo.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de analisisSuelo activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getAnalisisSueloInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`analisisSuelo/obtener/desactivados`, {
            // headers: {
            //   token:useAnalisisSuelo.token,
            // },
        });
          analisisSuelo.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de analisisSuelo Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postAnalisisSuelo = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("analisisSuelo/agregar", data, {
                // headers:{
                //     token:useAnalisisSuelo.token
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
    const putAnalisisSuelo = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/actualizar/${id}`, data,{
                // headers:{
                //     token:useAnalisisSuelo.token
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
    const putAnalisisSueloActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/activar/${id}`,{},{
                // headers:{
                //     token:useAnalisisSuelo.token
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
    const putAnalisisSueloDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/desactivar/${id}`,{},{
                // headers:{
                //     token:useAnalisisSuelo.token
                // hollss
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

    return {listarAnalisisSuelo,getAnalisisSueloActivos,getAnalisisSueloInactivos,postAnalisisSuelo, putAnalisisSuelo, putAnalisisSueloActivar, putAnalisisSueloDesactivar, loading}
    
},{persist:true})