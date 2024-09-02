import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";

export const useMaquinariaStore = defineStore("maquinariastore", () =>{
    let loading = ref(false)
    let maquinarias = ref([]);

    const listarMaquinarias = async () => {
        try {
            loading.value = true;
            const response = await axios.get("maquinaria",{
            
        });
        maquinarias.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de maquinarias:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getMaquinariasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`maquinaria/obt/activos`, {
        });
          maquinarias.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de maquinarias activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getMaquinariasInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`maquinaria/obt/desactivados`, {
        });
          maquinarias.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de maquinarias Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postMaquinarias = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("maquinaria/agregar", data, {
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putMaquinarias = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`maquinaria/actualizar/${id}`, data,{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putMaquinariaActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`maquinaria/activar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putMaquinariasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`maquinaria/desactivar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    return {listarMaquinarias,getMaquinariasActivos,getMaquinariasInactivos,maquinarias,postMaquinarias, putMaquinarias, putMaquinariaActivar, putMaquinariasDesactivar, loading}
    
},{persist:true})