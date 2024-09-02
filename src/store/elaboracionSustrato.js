import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useAdministradorStore} from "./administrador"



export const useElaboracionStore = defineStore("elaboracionSustrato", () =>{
    let loading = ref(false)
    let elaboracion = ref([]);
    const useAdministrador = useAdministradorStore()
    const listarElaboracion = async () => {
        try {
            loading.value = true;
            const response = await axios.get("elaboracionSustrato",{
            // headers:{
            //     token:useAdministrador.token
            // }
        });
        elaboracion.value = response.data; 
        return response;
        } catch (error) {
          console.error("Error al obtener la lista de Elaboración de Sustratos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const postElaboracion = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("elaboracionSustrato/agregar", data, {
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
    const putElaboracion = async(id, data)=>{
        try {
            loading.value=true
            console.log(id);
            const r = await axios.put(`elaboracionSustrato/actualizar/${id}`, data,{
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
    return {listarElaboracion,elaboracion,postElaboracion,putElaboracion,loading}
    
},{persist:true})