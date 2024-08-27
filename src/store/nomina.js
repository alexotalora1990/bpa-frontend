import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useNominaStore = defineStore("nomina", () =>{
    let loading = ref(false)
    let nominas = ref([]);
    const useAdministrador = useAdministradorStore()

    const listarNominas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("nomina/",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        nominas.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de nominas:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getNominasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`nomina/obt/activos`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          nominas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de nominas activas:", error);
        } finally {
          loading.value = false;
        }
    }
    const getNominasInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`nomina/obt/desactivados`, {
            // headers: {
            //   token:useAdministrador.token,
            // },
        });
          nominas.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de nominas Inactivas:", error);
        } finally {
          loading.value = false;
        }
    }
    const postNominas = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("nomina/agregar", data, {
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
    const putNominas = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`nomina/actualizar/${id}`, data,{
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
    const putNominasActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`nomina/activar/${id}`,{},{
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
    const putNominasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`nomina/desactivar/${id}`,{},{
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

    return {listarNominas,getNominasActivos,getNominasInactivos,nominas,postNominas, putNominas, putNominasActivar, putNominasDesactivar, loading}
    
},{persist:true})