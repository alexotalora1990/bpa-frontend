import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";




export const useProveedoresStore = defineStore("store", () => {
    let loading = ref(false)
    let proveedores = ref([]);


    const listarProveedores = async () => {
        try {
            loading.value = true;
            const response = await axios.get("proveedor", {
            });
            proveedores.value = response.data;
            return response;

        } catch (error) {
            console.error("Error al obtener la lista de Proveedores:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }
    const getProveedoresActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`proveedor/obt/activos`, {
            });
            proveedores.value = response.data;
            console.log(response.data)
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de proveedores activos:", error);
        } finally {
            loading.value = false;
        }
    }
    const getProveedoresInactivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get(`proveedor/obt/desactivados`, {
            });
            proveedores.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de proveedores inactivos:", error);
        } finally {
            loading.value = false;
        }
    }
    const postProveedor = async (data) => {
        try {
            loading.value = true
            const r = await axios.post("proveedor/agregar", data, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putProveedor = async (id, data) => {
        try {
            loading.value = true
            const r = await axios.put(`proveedor/actualizar/${id}`, data, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putProveedoresActivar = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`proveedor/activar/${id}`, {}, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putProveedoresDesactivar = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`proveedor/desactivar/${id}`, {}, {
            })
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }

    return { listarProveedores, getProveedoresActivos, getProveedoresInactivos, proveedores, postProveedor, putProveedor, putProveedoresActivar, putProveedoresDesactivar, loading }

}, { persist: true })


