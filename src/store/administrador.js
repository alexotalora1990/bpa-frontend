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

    const getAdminActivos= async()=>{
        try{
const r= await axios.get('administrador/activos');
return r;
        } catch(error){
            return error
        }
    };
    const getAdminDesactivados= async()=>{
        try{
const r= await axios.get('administrador/desactivados');
return r;
        } catch(error){
            return error
        }
    };
    const postAdmin = async(admin)=>{
        try {
            const r= await axios.post('administrador',admin)
            return r
        } catch (error) {
            return error
        }
    };

    const putAdmin = async(id, admin)=>{
        try {
            const r= await axios.put(`administrador/${id}`,admin)
            return r
        } catch (error) {
            return error
        }
    };
    const putAdminActivar = async(id)=>{
        try {
            const r= await axios.put(`administrador/activar/${id}`,null,)
            return r
        } catch (error) {
            return error
        }
    };
    const putAdminDesactivar = async(id)=>{
        console.log(id);
        try {
            const r= await axios.put(`administrador/desactivar/${id}`,null,)
            return r
        } catch (error) {
            return error
        }
    };
        const login = async (correo, contrasena) => {
        try {
                       const r = await axios.post("administrador/login/",{ correo, contrasena });
            token.value = r.data.token;
            admin.value = r.data.administrador;
            return r;
        } catch (error) {
            throw new Error('Error en el inicio de sesión');
        }
    };

    // const logout = () => {
    //     token.value = '';
    //     user.value = {};
    // };
 
   
      return { getAdmin, login, getAdminActivos, getAdminDesactivados, postAdmin,putAdmin,putAdminActivar,putAdminDesactivar};
}, {
    persist: true 
});
