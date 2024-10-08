import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useParcelaStore } from "./parcelas";
import { useAdministradorStore} from "./administrador"



export const useCultivoStore = defineStore("cultivo", () =>{
    let loading = ref(false)
    let cultivos= ref([]);
    
const useParcelas =useParcelaStore()
const useAdministrador =useAdministradorStore()
    const listarCultivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get("cultivo",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        cultivos.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de cultivos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getCultivosActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`cultivo/obtener/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          cultivos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de cultivos activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getCultivosInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`cultivo/obtener/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          cultivos.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de cultios Inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postCultivos = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("cultivo/agregar", data, {
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
    const putCultivos = async(id, data)=>{
        console.log(data);
        
        try {
            loading.value=true
            const r = await axios.put(`cultivo/actualizar/${id}`, data,{
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
    const putCultivosActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`cultivo/activar/${id}`,{},{
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
    const putCultivosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`cultivo/desactivar/${id}`,{},{
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

    return {listarCultivos,getCultivosActivos,getCultivosInactivos,cultivos,postCultivos, putCultivos, putCultivosActivar, putCultivosDesactivar, loading}
    
},{persist:true})