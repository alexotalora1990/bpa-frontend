import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";




export const useSemillaStore = defineStore("semilla", () => {
    let loading = ref(false)
    let semillas = ref([]);


    const listarSemillas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("semillas", {
            });
            semillas.value = response.data;
            return response;

        } catch (error) {
            console.error("Error al obtener la lista de Semillas:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }
    const getSemillasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`semillas/obtener/activos`, {
            });
            semillas.value = response.data;
            console.log(response.data)
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de semillas activos:", error);
        } finally {
            loading.value = false;
        }
    }
    const getSemillasInactivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`semillas/obtener/desactivados`, {
            });
            semillas.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de semillas inactivas:", error);
        } finally {
            loading.value = false;
        }
    }
    const postSemillas = async (data) => {
        try {
            loading.value = true
            const r = await axios.post("semillas/agregar", data, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putSemillas = async (id, data) => {
        try {
            loading.value = true
            const r = await axios.put(`semillas/actualizar/${id}`, data, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putSemillasActivar = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`semillas/activar/${id}`, {}, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putSemillasDesactivar = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`semillas/desactivar/${id}`, {}, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }

    return { listarSemillas, getSemillasActivos, getSemillasInactivos, semillas, postSemillas, putSemillas, putSemillasActivar, putSemillasDesactivar, loading }

}, { persist: true })