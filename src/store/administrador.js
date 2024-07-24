import { defineStore } from 'pinia';
import axios from 'axios';
import { TrackOpTypes, ref } from 'vue';

export const useAdministradorStore = defineStore('administrador', () => {
    const token = ref('');
    const admin = ref({});     

    const getAdmin = async () => {
        try {
            
            const r = await axios.get("administrador");
            return r;
        } catch (error) {
            return error;
        }
    };
    const login = async (correo, contrasena) => {
        try {
                       const response = await axios.post("administrador/login",{ correo, contrasena });
            token.value = response.data.token;
            admin.value = response.data.administrador;
            return response;
        } catch (error) {
            throw new Error('Error en el inicio de sesión');
        }
    };

    // const logout = () => {
    //     token.value = '';
    //     user.value = {};
    // };
 
   
      return { getAdmin, login};
}, {
    persist: true 
});
