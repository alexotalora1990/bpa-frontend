import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useFertilizacionStore = defineStore("fertilizacion", () =>{
    let loading = ref(false)
    let fertilizaciones = ref([]);

    const listarFertilizacion = async () => {
        try {
            loading.value = true;
            const response = await axios.get("fertilizacion",{
        });
        fertilizaciones.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de las Fertilizaciones:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getFertilizacionActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`fertilizacion/obtener/activos`, {
        });
        fertilizaciones.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de las Fertilizaciones activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getFertilizacionInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`fertilizacion/obtener/desactivados`, {
        });
        fertilizaciones.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de las Fertilizaciones inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postFertilizacion = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("fertilizacion/agregar", data, {
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
    const putFertilizacion = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`fertilizacion/actualizar/${id}`, data,{
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
    const putFertilizacionActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`fertilizacion/activar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putFertilizacionDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`fertilizacion/desactivar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }


    return {listarFertilizacion,getFertilizacionActivos,getFertilizacionInactivos,fertilizaciones,postFertilizacion, putFertilizacion, putFertilizacionActivar, putFertilizacionDesactivar, loading}

    
},{persist:true})