<template>
    <div class="q-pa-md" id="reset-password">
    <div class="container">
      <div class="welcome-container">
        <h1 class="welcome-text">Body Champion</h1>
      </div>
      <div class="form-container">
        <img src="./imagenes/loginlogo.png" class="logo" />
        <h2 class="form-title">Recuperar Contraseña</h2>
        <div class="form-content">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input filled type="email" v-model="email" label="Email*" hint="Digite su email de cuenta" lazy-rules
              :rules="[val => val && val.length > 0 || 'Email no puede estar vacío, debe ser un email válido']" />
            <div class="q-mt-md">
              <q-btn label="Recuperar" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useUsuariosStore } from "../store/usuarios.js";
  import { useQuasar, Notify } from 'quasar';
  
  const email = ref('');
  const usuariosStore = useUsuariosStore();
  const $q = useQuasar();
  
  async function onSubmit() {
    try {
      let response = await usuariosStore.postRecuperarPassword(email.value);
      console.log(response);
      Notify.create({
        type: 'positive',
        message: 'Si el correo existe en nuestra base de datos, recibirá un enlace para recuperar su contraseña.',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error en la recuperación de contraseña:", error);
      Notify.create({
        type: 'negative',
        message: 'Error al intentar recuperar la contraseña.',
        icon: 'error',
        position: 'top',
        timeout: 3000,
      });
    }
  }
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
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 0 20px;
    background-image: url("./imagenes/fondo.jpg");
  }
  
  .welcome-container {
    flex: 1;
    text-align: left;
    padding: 20px;
    color: white;
  }
  
  .welcome-text {
    font-size: 6rem;
    font-weight: bold;
    color: #f5f5f5;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(247, 92, 2, 0.9);
  }
  
  .form-container {
    max-width: 400px;
    width: 100%;
    background-color: rgba(212, 212, 212, 0.89);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 2% 3%;
  }
  
  .logo {
    display: block;
    margin: 0 auto 20px auto;
    width: 150px;
  }
  
  .form-title {
    text-align: center;
    font-size: 2rem;
    color: #ffffff;
    background-color: #F2630D;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .form-content {
    padding: 20px;
    background-color: transparent;
  }
  
  .q-input,
  .q-btn {
    font-size: 1.2rem;
  }
  
  .q-btn {
    width: 100%;
    margin-top: 20px;
  }
  
  .q-icon {
    cursor: pointer;
  }
  </style>
  