import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useInsumosStore = defineStore("insumo", () =>{
    let loading = ref(false)
    let insumos = ref([]);


    const listarInsumos = async () => {
        try {
            loading.value = true;
            const response = await axios.get("insumos",{
        });
        insumos.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de insumos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getInsumosActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`insumos/obt/activos`, {
        });
          insumos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de insumos activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getInsumosInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`insumos/obt/desactivados`, {
        }); 
          insumos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de insumos inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postInsumos = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("insumos/agregar", data, {
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putInsumo = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`insumos/actualizar/${id}`, data,{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putInsumosActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`insumos/activar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putInsumosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`insumos/desactivar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    return {listarInsumos,getInsumosActivos,getInsumosInactivos,insumos,postInsumos,putInsumo, putInsumosActivar, putInsumosDesactivar, loading}
    
},{persist:true})