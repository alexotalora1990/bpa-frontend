import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useEmpleadoStore = defineStore("empleado", () =>{
    let loading = ref(false)
    let empleados = ref([]);

    const listarEmpleados = async () => {
        try {
            loading.value = true;
            const response = await axios.get("empleado",{
        });
        empleados.value = response.data; 
        return response;

        } catch (error) {
          console.error("Error al obtener la lista de Empleados:", error);
          throw error;
        } finally {
          loading.value = false;
        }
    };
    const getEmpleadosActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`empleado/obtener/activos`, {
        });
          empleados.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de empleados activos:", error);
        } finally {
          loading.value = false;
        }
    }
    const getEmpleadosInactivos = async () => {
        try {
            loading.value = true; 
            const response = await axios.get(`empleado/obtener/desactivados`, {
        });
          empleados.value = response.data;
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de Empleados inactivos:", error);
        } finally {
          loading.value = false;
        }
    }
    const postEmpleado = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("empleado/agregar", data, {
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putEmpleado = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`empleado/actualizar/${id}`, data,{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putEmpleadosActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`empleado/activar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putEmpleadosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`empleado/desactivar/${id}`,{},{
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }


    return {listarEmpleados,getEmpleadosActivos,getEmpleadosInactivos,empleados,postEmpleado, putEmpleado, putEmpleadosActivar, putEmpleadosDesactivar, loading}

    
},{persist:true})