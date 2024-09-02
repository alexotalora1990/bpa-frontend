import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useRiegoStore = defineStore("riego", () =>{
    let loading = ref(false)
    let riegos = ref([]);
    const useAdministrador = useAdministradorStore()
    const listarRiegos = async () => {
        try {
            loading.value = true;
            const response = await axios.get("riego",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        riegos.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de riegos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const postRiegos = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("riego/agregar", data, {
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
    const putRiegos = async(id, data)=>{
        try {
            loading.value=true
            console.log(id);
            const r = await axios.put(`riego/actualizar/${id}`, data,{
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
    return {listarRiegos,riegos,postRiegos,putRiegos,loading}
    
},{persist:true})