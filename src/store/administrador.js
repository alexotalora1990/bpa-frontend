import { defineStore } from 'pinia';
import axios from 'axios';
import { TrackOpTypes, ref } from 'vue';

export const useAdministradorStore = defineStore('administrador', () => {
    const token = ref('');
    const admin = ref({});
    let loading = ref(false);
    const getAdmin = async () => {
        try {
            loading.value = true;
            const r = await axios.get("administrador");
            return r;
        } catch (error) {
            return error;
        } finally {
            loading.value = false;
        }
    };

    const getAdminActivos = async () => {
        try {
            loading.value = true;
            const r = await axios.get('administrador/activos');
            return r;
        } catch (error) {
            return error
        } finally {
            loading.value = false;
        }
    };
    const getAdminDesactivados = async () => {
        try {
            loading.value = true;
            const r = await axios.get('administrador/desactivados');
            return r;
        } catch (error) {
            return error
        }  finally {
            loading.value = false;
        }
    };
    const postAdmin = async (admin) => {
        console.log(admin);
        
        try {
            loading.value = true;
            const r = await axios.post('administrador/agregar', admin)
            return r
        } catch (error) {
            return error
        } finally {
            loading.value = false;
        }
    };

    const putAdmin = async (id, admin) => {
        try {
            loading.value = true;
            const r = await axios.put(`administrador/actualizar/${id}`, admin)
            return r
        } catch (error) {
            return error
        } finally {
            loading.value = false;
        }
    };
    const putAdminActivar = async (id) => {
        try {
            loading.value = true;
            const r = await axios.put(`administrador/activar/${id}`, null,)
            return r
        } catch (error) {
            return error
        } finally {
            loading.value = false;
        }
    };
    const putAdminDesactivar = async (id) => {
        console.log(id);
        try {
            loading.value = true;
            const r = await axios.put(`administrador/desactivar/${id}`, null,)
            return r
        } catch (error) {
            return error
        } finally {
            loading.value = false;
        }
    };
    const login = async (correo, contrasena) => {
        try {
            loading.value = true;
            const r = await axios.post("administrador/login/", { correo, contrasena });
            token.value = r.data.token;
            admin.value = r.data.administrador;
            return r;
        } catch (error) {
            throw new Error('Error en el inicio de sesión');
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = '';
        admin.value = {};
    };


    return { getAdmin, login, getAdminActivos, getAdminDesactivados, postAdmin, putAdmin, putAdminActivar, putAdminDesactivar, loading,logout };
}, {
    persist: true
});
