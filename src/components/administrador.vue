<!-- prueba -->

<template>
  <div style="height: 100vh; overflow-y: auto;">

    <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
      <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Crear Admin</q-btn>
      <q-select outlined v-model="listar" label="Seleccione" :options="listados"
        class="q-my-md q-mx-md custom-select" />
      <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>

    </div>

    <!-- formulario -->

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Crear Admin" : "Editar Admin" }}
            </div>
          </q-card-section>
          <q-input outlined v-model="nombre" label="Nombre" class="q-my-md q-mx-md" :rules="[
            (val) => !!val.trim() || 'Nombre no puede estar vacio']" hide-bottom-space />

          <q-input outlined v-model="direccion" label="Dirección" class="q-my-md q-mx-md" :rules="[
            (val) => !!val.trim() || 'Dirección no puede estar vacio ']" hide-bottom-space />

          <q-input outlined v-model="telefono" label="Teléfono" type="number" class="q-my-md q-mx-md" :rules="[
            (val) => !!val || 'Teléfono no puede estar vacío',
            (val) => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos',
            (val) => !/\s/.test(val) || 'Telefono no puede contener espacios vacíos',
          ]" hide-bottom-space />

          <q-input outlined v-model="correo" label="Correo" type="email" class="q-my-md q-mx-md" :rules="[
            (val) => !!val || 'Email no debe estar vacío'
          ]" hide-bottom-space />
          
          <q-input outlined v-model="contrasena" label="Contrasenia" class="q-my-md q-mx-md" :rules="[
            (val) => !!val.trim() || 'Contrasenia no puede estar vacio']" hide-bottom-space />

          <q-select outlined v-model="rol" label="Rol*" :options="rolOptions" class="q-my-md q-mx-md"
            :rules="[val => !!val.trim() || 'Debe seleccionar un rol']" hide-bottom-space />


          <q-input outlined v-model="municipio" label="Municipio" class="q-my-md q-mx-md" :rules="[
            (val) => !!val.trim() || 'Municipio no puede estar vacio '
          ]" hide-bottom-space />


          <q-card-actions align="right">
            <q-btn @click=modify() color="red" class="text-white">
              {{ accion == 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>


    <!-- Tabla -->
    <div style="display: flex; justify-content: center">

      <q-table title="Administrador" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
        :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;">
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
            <q-btn @click="desactivar(props.row._id)" v-if="props.row.estado == 1">
              <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
            <q-btn @click="activar(props.row._id)" v-else>
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
const id=ref()
const nombre = ref();
const direccion = ref();
const correo = ref();
const telefono = ref();
const municipio = ref();
const contrasena =ref()
const rol = ref();
const filter = ref();
const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];
const rolOptions = ['Administrador', 'Auxiliar',];

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
    console.error("Error al listar todos los usuarios:", error);
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


// AGREGAR EDITAR 

async function crear() {
  // Validación de campos
  if (!nombre.value || !direccion.value || !correo.value || !contrasena.value || !telefono.value || !municipio.value || !rol.value) {
    Notify.create({
      type: "negative",
      message: "Todos los campos son obligatorios",
      icon: "error",
      
    });
    return; // No proceder si los campos están vacíos
  }

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

    // Notificación de éxito
    Notify.create({
      type: "positive",
      message: "Administrador creado exitosamente",
      icon: "check_circle",
      position:"top",
    });

    // Limpia el formulario y cierra el modal
    listarAdmin();
    limpiarCampos();
    cerrar();

    return r; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error("Error al agregar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al agregar administrador",
      icon: "error",
    });
  }
}



async function traerDatos(admin) {
accion.value=2
alert.value=true
id.value=admin._id;
       nombre.value= admin.nombre,
       direccion.value= admin.direccion,
       correo.value= admin.correo,
       contrasena.value=admin.contrasena,
       telefono.value=admin.telefono,
       municipio.value=admin.municipio,
       rol.value=admin.rol

       console.log("Admin ID:", admin._id);
   
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
    listarAdmin();  // Refresca la lista de administradores
    limpiarCampos(); // Limpia el formulario
    cerrar(); // Cierra el modal/formulario
  } catch (error) {
    console.error("Error al editar administrador:", error);
  }
}
async function modify() {
  if (accion.value === 1) {
    await crear();
  } else {
    await editar();
  }
}



// FUNCIONES ACTIVAR-DESACTIVAR

async function activar(id) {
  try {
    await useAdmin.putAdminActivar(id);
    listarAdmin();
    Notify.create({
      type: "positive",
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
  }
}


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
    contrasena.value=''

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