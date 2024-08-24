// import { defineStore } from "pinia";
// import axios from "axios";
// import { Notify } from "quasar";
// import { ref } from "vue";


// export const useProcesoStore = defineStore("proceso", () =>{
//     let loading = ref(false)
//     let procesos = ref([]);

//     const listarProcesos = async () => {
//         try {
//             loading.value = true;
//             const response = await axios.get("proceso",{
//         });
//         procesos.value = response.data; 
//         return response;

//         } catch (error) {
//           console.error("Error al obtener la lista de Procesos:", error);
//           throw error;
//         } finally {
//           loading.value = false;
//         }
//     };
//     const getProcesosActivos = async () => {
//         try {
//             loading.value = true;
//             const response = await axios.get(`proceso/obtener/activos`, {
//         });
//           procesos.value = response.data;
//           return response;
//         } catch (error) {
//           console.error("Error al obtener la lista de procesos activos:", error);
//         } finally {
//           loading.value = false;
//         }
//     }
//     const getProcesosInactivos = async () => {
//         try {
//             loading.value = true; 
//             const response = await axios.get(`proceso/obtener/desactivados`, {
//         });
//           procesos.value = response.data;
//           return response;
//         } catch (error) {
//           console.error("Error al obtener la lista de Procesos inactivos:", error);
//         } finally {
//           loading.value = false;
//         }
//     }
//     const postProceso = async(data)=>{
//         try {
//             loading.value=true
//             const r = await axios.post("proceso/agregar", data, {
//             })
//             return r
//         } catch (error) {
//             loading.value=true
//             console.log(error);
//         }finally{
//             loading.value=false
//         }
//     }
//     const putProceso = async(id, data)=>{
//         try {
//             loading.value=true
//             const r = await axios.put(`proceso/actualizar/${id}`, data,{
//             })
//             return r
//         } catch (error) {
//             loading.value=true
//             console.log(error);
//         }finally{
//             loading.value=false
//         }
//     }
//     const putProcesosActivar = async(id)=>{
//         try {
//             loading.value=true
//             const r = await axios.put(`proceso/activar/${id}`,{},{
//             })
//             return r
//         } catch (error) {
//             loading.value=true
//             console.log(error);
//         }finally{
//             loading.value=false
//         }
//     }
//     const putProcesosDesactivar = async(id)=>{
//         try {
//             loading.value=true
//             const r = await axios.put(`proceso/desactivar/${id}`,{},{
//             })
//             return r
//         } catch (error) {
//             loading.value=true
//             console.log(error);
//         }finally{
//             loading.value=false
//         }
//     }

//     return {listarProcesos,getProcesosActivos,getProcesosInactivos,procesos,postProceso, putProceso, putProcesosActivar, putProcesosDesactivar, loading}
    
// },{persist:true})