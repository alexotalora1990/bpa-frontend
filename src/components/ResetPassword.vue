<template>
    <div class="q-pa-md" id="reset-password">
      <div class="q-gutter-y-md column" id="cont" style="
        width: 400px;
        padding: 30px;
        border-radius: 10px;
        background-color: rgba(243, 243, 243, 0.8); 
        box-shadow: 2px 10px 10px rgba(0, 0, 0, 0.1);
      ">
        <h3 style="margin-bottom: 20px; text-align: center">Restablecer Contraseña</h3>
        <q-input class="input" v-model="newPassword" :type="showPassword ? 'text' : 'password'" label="Nueva Contraseña"
          placeholder="Introduce tu nueva contraseña" dense outlined>
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" @click="togglePasswordVisibility" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
        <q-input class="input" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" label="Confirmar Contraseña"
          placeholder="Confirma tu nueva contraseña" dense outlined>
          <template v-slot:append>
            <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" @click="toggleConfirmPasswordVisibility" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
        <q-btn style="width: 80%" @click="resetPassword" color="primary" label="Restablecer" dense />
        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Notify, useQuasar } from 'quasar';
  import { useUsuariosStore } from '../store/usuarios.js';
  
  const newPassword = ref('');
  const confirmPassword = ref('');
  const message = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const useReset = useUsuariosStore();
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  const resetPassword = async () => {
    if (newPassword.value === '' || confirmPassword.value === '') {
      Notify.create('Por favor ingresa y confirma tu nueva contraseña');
      return;
    }
  
    if (newPassword.value !== confirmPassword.value) {
      Notify.create('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const token = route.query.reset;
      const response = await useReset.postResetPassword(newPassword.value, token);
      const message = response?.data?.msg || 'Contraseña actualizada con éxito';
      $q.notify({
        message: message,
        color: 'green',
        icon: 'check',
        position: 'top',
        timeout: 3000
      });
      newPassword.value = '';
      confirmPassword.value = '';
      if (message === 'Contraseña actualizada con éxito') {
        setTimeout(() => {
          router.push('/');
        }, 3000); 
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      const errorMessage = error?.response?.data?.msg || 'Error al restablecer la contraseña.';
      $q.notify({
        message: errorMessage,
        color: 'negative',
        icon: 'warning',
        position: 'top',
        timeout: 3000
      });
    }
  };
  </script>
  
  <style scoped>
  #reset-password {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("./imagenes/fondo.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
  
  #reset-password h3 {
    font-size: 2.1rem;
    font-family: "Roboto", sans-serif;
    font-weight: 900;
  }
  
  .input {
    width: 100%;
    margin-bottom: 25px;
  }
  
  #cont {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    height: 500px;
  }
  
  .message {
    margin-top: 20px;
    text-align: center;
    color: #d9534f;
    font-weight: bold;
  }
  </style>
  