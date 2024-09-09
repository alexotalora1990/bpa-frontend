<!-- prueba -->

<template>
  <div style="height: 100vh; overflow-y: auto;">

    <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Admin</q-btn>
      <q-select outlined v-model="listar" label="Seleccione" :options="listados"
        class="q-my-md q-mx-md custom-select" />
      <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()" :loading="useAdmin.loading">Filtrar</q-btn>

    </div>

    <!-- formulario -->

    <div>
      <q-form ref="formulario" @submit.prevent="modify">
        <q-dialog v-model="alert" persistent>
          <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Crear Administrador" : "Editar Administrador" }}
              </div>
              <q-space />
              <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
            </q-card-section>

            <!-- Inputs con reglas -->
            <q-input outlined v-model="nombre" label="Nombre" class="q-my-md q-mx-md" :rules="[
              (val) => !!val || 'Este campo es requerido',
              (val) => !!val.trim() || 'Este campo no puede estar vacío',
              (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres',
              (val) => /^[a-zA-Z\s]*$/.test(val) || 'Solo se permiten letras'
            ]" hide-bottom-space />

            <q-input outlined v-model="direccion" label="Dirección" class="q-my-md q-mx-md" :rules="[
              (val) => !!val || 'Este campo es requerido',
              (val) => !!val.trim() || 'Este campo no puede estar vacío',
              (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
            ]" hide-bottom-space />

            <q-input outlined v-model="telefono" label="Teléfono" type="number" class="q-my-md q-mx-md" :rules="[
              (val) => !!val || 'Teléfono no puede estar vacío',
              (val) => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos',
              (val) => !/\s/.test(val) || 'Teléfono no puede contener espacios vacíos',
            ]" hide-bottom-space />

            <q-input outlined v-model="correo" label="Correo" type="email" class="q-my-md q-mx-md" :rules="[
              (val) => !!val || 'El email es requerido',
              (val) => /.+@.+\..+/.test(val) || 'El email debe ser válido'
            ]" hide-bottom-space />

            <q-input v-if="accion === 1" outlined v-model="contrasena" label="Contraseña" class="q-my-md q-mx-md"
              :rules="[
                (val) => !!val.trim() || 'Contraseña no puede estar vacía'
              ]" hide-bottom-space />

            <q-select outlined v-model="rol" label="Rol*" :options="rolOptions" class="q-my-md q-mx-md"
              :rules="[val => !!val || 'Debe seleccionar un rol']" hide-bottom-space />

            <q-input outlined v-model="municipio" label="Municipio" class="q-my-md q-mx-md" :rules="[
              (val) => !!val || 'Este campo es requerido',
              (val) => !!val.trim() || 'Este campo no puede estar vacío',
              (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
            ]" hide-bottom-space />

            <q-card-actions align="right">
              <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
              <q-btn :label="accion === 1 ? 'Agregar' : 'Editar'" type="submit" color="green" class="text-white" @click="modify" :loading="useAdmin.loading" />


            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-form>
    </div>



    <!-- Tabla -->
    <div style="display: flex; justify-content: center">

      <q-table title="Administrador" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
        :rows="rows" :filter="filter" :columns="columns" :loading="useAdmin.loading" row-key="name"
        style="width: 90%; margin-bottom: 6%;">
        <template v-slot:top-right>
          <q-input color="black" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>





        <template v-slot:body-cell-fechas="props">
          <q-td :props="props"></q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red;" v-else>Inactivo</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="traerDatos(props.row)">
              <q-tooltip>Editar</q-tooltip>✏️</q-btn>
            <q-btn @click="desactivar(props.row._id)" v-if="props.row.estado == 1" :loading="useAdmin.loading" >
              <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
            <q-btn @click="activar(props.row._id)" v-else  :loading="useAdmin.loading">
              <q-tooltip>Activar</q-tooltip>✅</q-btn>
          </q-td>
        </template>
      </q-table>


    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useAdministradorStore } from "../store/administrador.js";
import { useQuasar, Notify } from "quasar";

const useAdmin = useAdministradorStore();
const rows = ref([]);
const id = ref()
const nombre = ref();
const direccion = ref();
const correo = ref();
const telefono = ref();
const municipio = ref();
const contrasena = ref()
const rol = ref();
const filter = ref();
const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];
const rolOptions = ['Administrador', 'Auxiliar',];
const formulario = ref(null);


let alert = ref(false);
let accion = ref(1);

// listar tabla
const columns = ref([
  {
    name: "nombre",
    label: "Nombre",
    field: "nombre",
    align: "center"
  },
  {
    name: "direccion",
    label: "Dirección",
    field: "direccion",
    align: "center",
  },
  {
    name: "correo",
    label: "Correo",
    field: "correo",
    align: "center"
  },
  {
    name: "telefono",
    label: "Telefono",
    field: "telefono",
    align: "center"
  },
  {
    name: "municipio",
    label: "Municipio",
    field: "municipio",
    align: "center",
  },
  {
    name: "rol",
    label: "Categoria",
    field: "rol",
    align: "center"
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center"
  },
  {
    name: "opciones",
    label: "Opciones",
    field: "opciones",
    align: "center"
  },
]);

// Funciones Listar
async function listarAdmin() {
  try {
    const r = await useAdmin.getAdmin();
    rows.value = r.data.administrador;
    console.log(r.data.administrador);
  } catch (error) {
    console.error("Error al listar Administradores:", error);
  }
}

function filtrar() {
  if (listar.value == 'Listar todos') {
    listarAdmin();
  } else if (listar.value == 'Activos') {
    listarAdminActivos();
  } else if (listar.value == 'Inactivos') {
    listarAdminInactivos();
  }
}

async function listarAdminActivos() {
  const r = await useAdmin.getAdminActivos();
  console.log(r.data.Administradores);
  rows.value = r.data.Administradores;
}

async function listarAdminInactivos() {
  const r = await useAdmin.getAdminDesactivados();
  console.log(r.data.Administradores);
  rows.value = r.data.Administradores;
}

// .................................................



async function traerDatos(admin) {
  accion.value = 2
  alert.value = true
  id.value = admin._id;
  nombre.value = admin.nombre,
    direccion.value = admin.direccion,
    correo.value = admin.correo,
    contrasena.value = admin.contrasena,
    telefono.value = admin.telefono,
    municipio.value = admin.municipio,
    rol.value = admin.rol

  console.log("Admin ID:", admin._id);

}


async function crear() {

  try {
    accion.value = 1;
    const r = await useAdmin.postAdmin({
      nombre: nombre.value,
      direccion: direccion.value,
      correo: correo.value,
      contrasena: contrasena.value,
      telefono: telefono.value,
      municipio: municipio.value,
      rol: rol.value
    });

    Notify.create({
      type: "positive",
      message: "Administrador creado exitosamente",
      icon: "check_circle",
      position: "top",
    });

    listarAdmin();
    limpiarCampos();
    cerrar();

    return r;
  } catch (error) {
    console.error("Error al agregar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al agregar administrador",
      icon: "error",
    });
  }
}

async function editar() {


  try {

    const r = await useAdmin.putAdmin(id.value, {
      nombre: nombre.value,
      direccion: direccion.value,
      correo: correo.value,
      contrasena: contrasena.value,
      telefono: telefono.value,
      municipio: municipio.value,
      rol: rol.value
    });

    console.log("Administrador editado con éxito:", r);
    listarAdmin();
    limpiarCampos();
    cerrar();
  } catch (error) {
    console.error("Error al editar administrador:", error);
  }
}


async function modify() {
  try {
    const valid = await formulario.value.validate(); // Accede directamente a la referencia

    if (!valid) {
      Notify.create({
        type: "negative",
        message: "Por favor, complete correctamente todos los campos",
        icon: "error",
      });
      return;
    }

    if (accion.value === 1) {
      await crear();
    } else {
      await editar();
    }

    Notify.create({
      type: "positive",
      message: "Operación realizada con éxito",
      icon: "check",
    });

  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error en la operación",
      icon: "error",
    });
    console.error("Error en modify:", error);
  }
}
async function activar(id) {
  try {
    await useAdmin.putAdminActivar(id);
    console.log(id);
    listarAdmin();
    Notify.create({
      color: "green",
      message: "Administrador activado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al activar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al activar administrador",
      icon: "error",
    });
  } finally {
  }}


async function desactivar(id) {
  try {
    await useAdmin.putAdminDesactivar(id);
    console.log(id);
    listarAdmin();
    Notify.create({
      color: "orange",
      message: "Administrador desactivado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al desactivar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al desactivar administrador",
      icon: "error",
    });
  } finally {
  }
}
// ......................................................
// OTRAS FUNCIONES 
onMounted(() => {
  listarAdmin();
});


function abrir() {
  alert.value = true;
  limpiarCampos();
  accion.value = 1;
}

function cerrar() {
  alert.value = false;
}
function limpiarCampos() {
  nombre.value = '',
    direccion.value = '',
    correo.value = '',
    telefono.value = '',
    municipio.value = '',
    rol.value = '',
    contrasena.value = ''

}

</script>

<style>
.custom-select {
  font-size: 14px;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: white;
  color: #333;
  min-width: 200px;
}
</style>