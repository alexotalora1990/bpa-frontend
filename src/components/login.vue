<template>
  <div class="back window-height window-width row justify-center items-center">
    <div class="q-pa-md">
      <div class="login-container">
        <div class="title">
          <h3>Iniciar Sesión</h3>
        </div>
        
        <q-input type="email" v-model="correo" label="Correo electrónico" lazy-rules
          :rules="[val => val && val.length > 0 || 'Email no puede estar vacío, debe ser un email válido']">
        </q-input>

        <q-input v-model="contrasena" :type="passwordFieldType" label="Contraseña" lazy-rules
          :rules="[val => val && val.length > 0 || 'Contraseña no puede estar vacía']">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" @click="togglePasswordVisibility" />
          </template>
        </q-input>

        <q-btn class="submit" @click="login()" color="primary">Ingresar</q-btn>
        <div class="forgot-password">
          <router-link to="/recuperar-password">¿Olvidaste tu contraseña?</router-link>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdministradorStore } from '../store/administrador.js';
import { useRouter } from 'vue-router';
import { useQuasar, Notify } from 'quasar';

const router = useRouter();
const useAdmin = useAdministradorStore();
let correo = ref("chechoc749@gmail.com");
let contrasena = ref("12345");
const showPassword = ref(false);

const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'));

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function login() {
  try {
    const response = await useAdmin.login(correo.value, contrasena.value);
    router.push("/home");
   console.log(response)
    Notify.create({
      type: 'positive',
      message: 'Ingreso exitoso',
      icon: 'check_circle',
      position: 'center',
      timeout: 3000,
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Usuario o Contraseña invalidos',
      icon: 'error',
      position: 'center',
      timeout: 3000,
    });
  }
}


</script>

<style>
body,
h1,
h2,
h3 {
  margin: 0;
}

.back {
  height: 100vh;
  background-image: url(../assets/fotologin.png);
  background-position: center;
  background-size: cover;
}

.login-container {
  width: 400px;
  height: 360px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: solid black 2px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

.title {
  width: 100%;
  padding: 20px;
  border-radius: 8px;
}

.submit {
  margin-top: 30px;
  width: 80%;
}

.q-input {
  margin-top: 20px;
}
</style>