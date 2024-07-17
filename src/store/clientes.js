import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useClientesStore = defineStore("clientes", ()=>{
    let loading = ref(false)
    
    const getCliente = async()=>{
        try {
            loading.value=true
            const r = await axios.get("clientes")
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };


    const getClientesActivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("clientes/activos",{
              
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const getClientesInactivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("clientes/inactivos",{
               
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

    const postClientes = async(cliente)=>{
        try {
            loading.value=true
            const r = await axios.post("clientes", cliente)
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

    const postSeguimiento = async(id, seguimiento)=>{
        try {
            loading.value=true
            const r = await axios.post(`clientes/segumiento/${id}`, seguimiento)
            return r.data.seguimiento
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

    const putClientes =async (id, cliente)=>{
        try {
            loading.value=true
            const r = await axios.put(`clientes/${id}`,cliente)
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const putClientesActivar=async(id)=>{
        loading.value=true
        try {
            const r = await axios.put(`clientes/activar/${id}`)
            return r

        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const putClientesDesactivar=async(id)=>{
        loading.value=true
        try {
            const r = await axios.put(`clientes/desactivar/${id}`)
            return r

        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

   

    return{ getCliente, postClientes, postSeguimiento,putClientes,putClientesActivar,putClientesDesactivar, getClientesActivos, getClientesInactivos, loading}

})