import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useParcelaStore = defineStore("store", () =>{
    let loading = ref(false)
    let parcelas = ref([]);
    const useAdministrador = useAdministradorStore()

    const listarParcelas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("parcela/",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        parcelas.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de parcelas:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getParcelasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`parcela/obt/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          parcelas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de parcelas activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getParcelasInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`parcela/obt/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          parcelas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de parcelas Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postParcelas = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("parcela/agregar", data, {
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
    const putParcelas = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`parcela/actualizar/${id}`, data,{
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
    const putParcelasActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`parcela/activar/${id}`,{},{
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
    const putParcelasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`parcela/desactivar/${id}`,{},{
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

    return {listarParcelas,getParcelasActivos,getParcelasInactivos,parcelas,postParcelas, putParcelas, putParcelasActivar, putParcelasDesactivar, loading}
    
},{persist:true})