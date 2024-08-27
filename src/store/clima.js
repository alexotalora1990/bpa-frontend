import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useClimaStore = defineStore("clima", () =>{
    let loading = ref(false)
    let climas = ref([]);
    const useAdministrador = useAdministradorStore()
    const listarClimas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("clima/buscar",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        climas.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de climas:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const postClimas = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("clima/agregar", data, {
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
    const putClimas = async(id, data)=>{
        try {
            loading.value=true
            console.log(id);
            const r = await axios.put(`clima/actualizar/${id}`, data,{
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
    return {listarClimas,climas,postClimas,putClimas,loading}
    
},{persist:true})