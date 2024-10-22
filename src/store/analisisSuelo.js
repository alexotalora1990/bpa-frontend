import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useAnalisisStore = defineStore("analisis", () =>{
    let loading = ref(false)
    let analisis = ref([]);

    const listarAnalisis = async () => {
        try {
            loading.value = true;
            const response = await axios.get("analisisSuelo/",{
        });
        analisis.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de Analisis:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getAnalisisActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`analisisSuelo/obtener/activos`, {
        });
        analisis.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de analisis activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getAnalisisInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`analisisSuelo/obtener/desactivados`, {
        });
        analisis.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de analisis inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postAnalisis = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("analisisSuelo/agregar", data, {
            })
            return true
        } catch (error) {
            loading.value=true
            Notify.create({
                type: 'negative',
                message: error.response.data.errors[0]?.msg
            });
            return false
        }finally{
            loading.value=false
        }
    }
    const putAnalisis = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/actualizar/${id}`, data,{
            })
            return true
        } catch (error) {
            loading.value=true
            Notify.create({
                type: 'negative',
                message: error.response.data.errors[0]?.msg
            });
            return false
        }finally{
            loading.value=false
        }
    }
    const putAnalisisActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/activar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putAnalisisDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`analisisSuelo/desactivar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }


    return {listarAnalisis,getAnalisisActivos,getAnalisisInactivos,analisis,postAnalisis, putAnalisis, putAnalisisActivar, putAnalisisDesactivar, loading}

    
},{persist:true})