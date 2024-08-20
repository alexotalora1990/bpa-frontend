<template>
  <div style="height: 100vh; overflow-y: auto">
    <div
      style="
        margin-left: 5%;
        margin-right: 5%;
        display: flex;
        align-items: center;
      "
    >
      <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()"
        >Crear Empleado</q-btn
      >
      <q-select
        outlined
        v-model="listar"
        label="Seleccione"
        :options="listados"
        class="q-my-md q-mx-md custom-select"
      />
      <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()"
        >Filtrar</q-btn
      >
    </div>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Crear Empleado" : "Editar Empleado" }}
            </div>
          </q-card-section>

          <q-input
            outlined
            v-model="nombre"
            label="Nombre"
            class="q-my-md q-mx-md"
            type="text"
            :rules="nombreRules"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="correo"
            label="Correo"
            class="q-my-md q-mx-md"
            type="email"
            :rules="correoRules"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="direccion"
            label="Dirección"
            class="q-my-md q-mx-md"
            type="text"
            :rules="direccionRules"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="telefono"
            label="Teléfono"
            class="q-my-md q-mx-md"
            type="text"
            :rules="telefonoRules"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="estudios"
            label="Estudios"
            class="q-my-md q-mx-md"
            type="text"
            :rules="estudiosRules"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="descripcion"
            label="Descripción"
            class="q-my-md q-mx-md"
            type="textarea"
            :rules="descripcionRules"
            hide-bottom-space
          />

          <q-card-actions align="right">
            <q-btn @click="modify()" color="red" class="text-white">
              {{ accion == 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div style="display: flex; justify-content: center">
      <q-table
        title="Empleados"
        title-class="text-green text-weight-bolder text-h5"
        table-header-class="text-black"
        :rows="rows"
        :filter="filter"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 6%"
      >
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
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="traerDatos(props.row)">
              <q-tooltip>Editar</q-tooltip>✏️</q-btn
            >
            <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1">
              <q-tooltip>Desactivar</q-tooltip>❌</q-btn
            >
            <q-btn @click="activar(props.row)" v-else>
              <q-tooltip>Activar</q-tooltip>✅</q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEmpleadoStore } from "../store/empleados.js";
import { Notify } from "quasar";


const useEmpleado = useEmpleadoStore();
let alert = ref(false);
let accion = ref(1);

const filter = ref(""); // ESTO ES PARA EL BUSCADOR DE LA TABLA

let datos = {};


let rows = ref([]);

const nombre = ref('');
const correo = ref('');
const direccion = ref('');
const telefono = ref('');
const estudios = ref('');
const descripcion = ref('');




// Ahhhhhhhhhhhhhhhhhhhh
const columns = [
  { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: row => row.nombre },
  { name: 'correo', label: 'Correo', align: 'left', field: row => row.correo },
  { name: 'direccion', label: 'Dirección', align: 'left', field: row => row.direccion },
  { name: 'telefono', label: 'Teléfono', align: 'left', field: row => row.telefono },
  { name: 'estudios', label: 'Estudios', align: 'left', field: row => row.estudios },
  { name: 'estado', label: 'Estado', align: 'center', field: row => row.estado },
  { name: 'opciones', label: 'Opciones', align: 'center' }
];

//ENVIO DE LOS DATOS DE LA FINCA===================================

//FILTROS

//FILTROS

function modify() {
  if (accion.value === 1) {
    crear();
  } else {
    editar();
  }
}

async function crear() {
  try {
    const r = await useFinca.postFincas({
      idadministrador: idadmin.value.value,
      nombre: nombre.value,
      rut: rut.value,
      direccion: direccion.value,
      ubicacion: ubicacion.value,
      area: area.value,
      departamento: departamento.value,
      ciudad: ciudad.value,
      limites: {
        norte: limites.value.norte,
        sur: limites.value.sur,
        este: limites.value.este,
        oeste: limites.value.oeste,
      },
    });
  } catch (error) {
    Notify.create({
      message: "Esta mal!",
      position: "center",
      color: "red",
    });
  }
  listarFincas();
  limpiarCampos();
  cerrar();
}

//ENVIO DE LOS DATOS DE LA FINCA =====================================================

//EDITAR LA FINCA =====================================================
function traerDatos(fincas) {
  alert.value = true;
  accion.value = 2;
  idadmin.value = {
    label: fincas.idadministrador.nombre,
    value: fincas.idadministrador._id,
  };
  id.value = fincas._id;
  nombre.value = fincas.nombre;
  rut.value = fincas.rut;
  direccion.value = fincas.direccion;
  latitud.value = fincas.ubicacion?.latitud || "";
  longitud.value = fincas.ubicacion?.longitud || "";
  area.value = fincas.area;
  departamento.value = fincas.departamento;
  ciudad.value = fincas.ciudad;
  limites.value.norte = fincas.limites?.norte || "";
  limites.value.sur = fincas.limites?.sur || "";
  limites.value.este = fincas.limites?.este || "";
  limites.value.oeste = fincas.limites?.oeste || "";
}
async function editar() {
  try {
    await useFinca.putFincas(id.value, {
      nombre: nombre.value,
      rut: rut.value,
      direccion: direccion.value,
      ubicacion: {
        latitud: latitud.value,
        longitud: longitud.value,
      },
      area: area.value,
      departamento: departamento.value,
      ciudad: ciudad.value,
      limites: {
        norte: limites.value.norte,
        sur: limites.value.sur,
        este: limites.value.este,
        oeste: limites.value.oeste,
      },
    });
    Notify.create({
      message: "Finca actualizada correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message:
        error.response?.data?.errors?.[0]?.msg || "Error al modificar la finca",
    });
    console.log("Error al modificar la finca", error);
  }
  listarFincas();
  limpiarCampos();
  cerrar();
}

//EDITAR LA FINCA =====================================================

//APARTADO DE TRAER LOS DATOS =============================
const listar = ref("");
const listados = ["Listar todos", "Activos", "Inactivos"];

function filtrar() {
  if (listar.value == "Listar todos") {
    listarFincas();
  } else if (listar.value == "Activos") {
    listarFincasActivos();
  } else if (listar.value == "Inactivos") {
    listarFincasInactivos();
  }
}

async function listarFincas() {
  const r = await useFinca.listarFincas();
  rows.value = r.data.fincas;
}
async function listarFincasActivos() {
  const r = await useFinca.getFincasActivos();
  console.log(r.data.fincaActiva);
  rows.value = r.data.fincaActiva;
}
async function listarFincasInactivos() {
  const r = await useFinca.getFincasInactivos();
  console.log(r.data.fincaDesactivada);
  rows.value = r.data.fincaDesactivada;
}

//APARTADO DE TRAER LOS DATOS =============================

//ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(fincas) {
  const r = await useFinca
    .putFincasDesactivar(fincas._id)
    .then((response) => {
      Notify.create({
        message: "Finca Desactivada correctamente!",
        position: "center",
        color: "orange",
      });
      listarFincas();
    })
    .catch((error) => {
      console.log("Error de sede:", error);
    });
}
async function activar(fincas) {
  const r = await useFinca
    .putFincasActivar(fincas._id)
    .then((response) => {
      Notify.create({
        message: "Finca activada correctamente!",
        position: "center",
        color: "green",
      });
      listarFincas();
    })
    .catch((error) => {
      console.log("Error de sede:", error);
    });
}

// Funciones no tan importantes ======================================
function abrir() {
  alert.value = true;
  limpiarCampos();
  accion.value = 1;
}

function cerrar() {
  alert.value = false;
}

function limpiarCampos() {
  idadmin.value = "";
  nombre.value = "";
  rut.value = "";
  direccion.value = "";
  ubicacion.value = "";
  area.value = "";
  departamento.value = "";
  ciudad.value = "";
  latitud.value = "";
  longitud.value = "";
  limites.value = {
    norte: "",
    sur: "",
    este: "",
    oeste: "",
  };
}

onMounted(() => {
  listarFincas();
  listarAdmin();
});
// Funciones no tan importantes ======================================
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
