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
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()"
        >Crear Maquinaria</q-btn
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
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #008000; margin-bottom: 20px" class="row items-center"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Crear Maquinaria" : "Editar Maquinaria" }}
            </div>
            <q-space/>
            <q-btn
              flat
              dense
              icon="close"
              @click="cerrar()"
              class="text-white"
            />
          </q-card-section>
          <q-select
            outlined
            v-model="idproveedores"
            label="Seleccione un Proveedor"
            :options="options"
            class="q-my-md q-mx-md"
            @filter="filterFn"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="nombre"
            label="Nombre de la Maquinaria"
            class="q-my-md q-mx-md"
            type="text"
            :rules="[(val) => !!val.trim() || 'Nombre no puede estar vacio']"
            hide-bottom-space @input="removeSpaces('nombre')"
          />
          <q-input
            outlined
            v-model="tipo"
            label="Tipo de Maquinaria"
            class="q-my-md q-mx-md"
            type="text"
            :rules="[(val) => !!val.trim() || 'Tipo de maquinaria no puede estar vacio']"
            hide-bottom-space
            @input="removeSpaces('tipo')"
          />
          <q-input
            outlined
            v-model="observaciones"
            label="Observaciones"
            class="q-my-md q-mx-md"
            type="text"
            hide-bottom-space 
          />
          <q-input
            outlined
            v-model="cantidad"
            label="Cantidad"
            class="q-my-md q-mx-md"
            type="number"
            :rules="[(val) => !!val.trim() || 'Cantidad no puede estar vacio']"
            hide-bottom-space
            @input="removeSpaces('cantidad')"
          />
          <q-input
            outlined
            v-model="Total"
            label="Total"
            class="q-my-md q-mx-md"
            type="number"
            :rules="[(val) => !!val.trim() || 'Total no puede estar vacio']"
            hide-bottom-space
            @input="removeSpaces('total')"
          />
          <q-input
            outlined
            v-model="fechaCompra"
            label="Fecha de Compra"
            class="q-my-md q-mx-md"
            type="date"
            :rules="[(val) => !!val.trim() || 'Fecha no puede estar vacio']"
            hide-bottom-space
          />

          <q-card-actions align="right">
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
            <q-btn :loading="isLoading" @click="modify()" color="green" class="text-white">
      {{ accion == 1 ? "Agregar" : "Editar" }}
    </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div style="display: flex; justify-content: center">
      <q-table
        title="Maquinarias"
        title-class="text-green text-weight-bolder text-h5"
        table-header-class="text-black"
        :rows="rows"
        :filter="filter"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 6%"
        :loading="useMaquinaria.loading"
      >
        <template v-slot:top-right>
          <q-input color="black" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <template v-slot:loading>
              <q-spinner
                color="primary"
                size="100px"
                style="align-self: center; margin-bottom: 10px"
              />
            </template>
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
import { useProveedoresStore } from "../store/proveedores.js";
import { useMaquinariaStore } from "../store/maquinaria.js";
import { Notify } from "quasar";

const useProveedor = useProveedoresStore();
const useMaquinaria = useMaquinariaStore();

const filter = ref(""); // ESTO ES PARA EL BUSCADOR DE LA TABLA

const isLoading = ref(false); // Estado de carga

let rows = ref([]);
const idproveedores = ref("");
const nombre = ref("");
const tipo = ref("");
const observaciones = ref("");
const cantidad = ref("");
const Total = ref(0);
const fechaCompra = ref("");
let id = ref("");

let alert = ref(false);
let accion = ref(1);

// REGLAS PARA LOS INPUTS =========================================================================================================
// const isRequired = (msg) => (val) => !!val.trim().length || msg;
// const minLength = (min, msg) => (val) => val.trim().length >= min || msg;
// const nombreRules = [
//   isRequired("El nombre es requerido"),
//   minLength(3, "El nombre debe tener al menos 3 caracteres"),
// ];
// const tipoRules = [
//   isRequired("El tipo es requerido"),
//   minLength(3, "El tipo debe tener al menos 3 caracteres"),
// ];
// const cantidadRules = [
//   isRequired("La cantidad es requerida"),
//   (val) => val > 0 || "La cantidad debe ser mayor a 0",
// ];
// const totalRules = [
//   isRequired("El total es requerido"),
//   (val) => val > 0 || "El total debe ser mayor a 0",
// ];
// const fechaCompraRules = [isRequired("La fecha de compra es requerida")];

// REGLAS PARA LOS INPUTS =========================================================================================================


// FILTROS



async function crear() {
  if (!validarCampos()) {
    return;
  }
  try {
    isLoading.value = true;
    const r = await useMaquinaria.postMaquinarias({
      idproveedores: idproveedores.value.value,
      nombre: nombre.value,
      tipo: tipo.value,
      observaciones: observaciones.value,
      cantidad: cantidad.value,
      Total: Total.value,
      fechaCompra: fechaCompra.value,
    });
    Notify.create({
      message: "Maquinaria creada correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      message: "Error al crear la maquinaria",
      position: "center",
      color: "red",
    });
  }finally{
    isLoading.value = false;
    listarMaquinaria();
  limpiarCampos();
  cerrar();
  }

}

function traerDatos(maquinaria) {
  alert.value = true;
  accion.value = 2;
  idproveedores.value = {
    label: maquinaria.idproveedores.nombre,
    value: maquinaria.idproveedores._id,
  };
  id.value = maquinaria._id;
  nombre.value = maquinaria.nombre;
  tipo.value = maquinaria.tipo;
  observaciones.value = maquinaria.observaciones;
  cantidad.value = maquinaria.cantidad;
  Total.value = maquinaria.Total;
  fechaCompra.value = maquinaria.fechaCompra.split('T')[0];
}

async function editar() {
  try {
    isLoading.value = true;
    await useMaquinaria.putMaquinarias(id.value, {
      idproveedores: idproveedores.value.value,
      nombre: nombre.value,
      tipo: tipo.value,
      observaciones: observaciones.value,
      cantidad: cantidad.value,
      Total: Total.value,
      fechaCompra: fechaCompra.value,
    });
    Notify.create({
      message: "Maquinaria actualizada correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message:
        error.response?.data?.errors?.[0]?.msg ||
        "Error al modificar la maquinaria",
    });
    console.log("Error al modificar la maquinaria", error);
  }finally{
    isLoading.value = false;
    listarMaquinaria();
  limpiarCampos();
  cerrar();
  }
}

function modify() {
  if (accion.value === 1) {
    crear();
  } else {
    editar();
  }
}

let proveed = [];
let datos = {};
let options = ref(proveed);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = proveed.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}

async function listarProveedores() {
  const data = await useProveedor.getProveedoresActivos();
  data.data.proveedores.forEach((item) => {
    datos = {
      label: item.nombre,
      value: item._id,
    };
    proveed.push(datos);
  });
  console.log(proveed);
}

// APARTADO DE TRAER LOS DATOS =============================
const listar = ref("");
const listados = ["Listar todos", "Activos", "Inactivos"];

function filtrar() {
  if (listar.value == "Listar todos") {
    listarMaquinaria();
  } else if (listar.value == "Activos") {
    listarMaquinariaActivos();
  } else if (listar.value == "Inactivos") {
    listarMaquinariaInactivos();
  }
}

async function listarMaquinaria() {
  const r = await useMaquinaria.listarMaquinarias();
  rows.value = r.data.maquinarias;
}

async function listarMaquinariaActivos() {
  const r = await useMaquinaria.getMaquinariasActivos();
  console.log(r.data);
  rows.value = r.data.maquinarias;
}
async function listarMaquinariaInactivos() {
  const r = await useMaquinaria.getMaquinariasInactivos();
  console.log(r.data.maquinaria);
  rows.value = r.data.maquinarias;
}
// APARTADO DE TRAER LOS DATOS =============================

// ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(maquinaria) {
  try {
    await useMaquinaria.putMaquinariasDesactivar(maquinaria._id);
    Notify.create({
      message: "Maquinaria desactivada correctamente!",
      position: "center",
      color: "orange",
    });
    listarMaquinaria();
  } catch (error) {
    console.log("Error:", error);
  }
}


async function activar(maquinaria) {
  try {
    await useMaquinaria.putMaquinariaActivar(maquinaria._id);
    Notify.create({
      message: "Maquinaria activada correctamente!",
      position: "center",
      color: "green",
    });
    listarMaquinaria();
  } catch (error) {
    console.log("Error:", error);
  }
}
// ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
  {
    name: "Proveedor",
    required: true,
    label: "Proveedor",
    align: "center",
    field: (row) => row.idproveedores.nombre,
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "tipo",
    required: true,
    label: "Tipo",
    align: "center",
    field: "tipo",
    sortable: true,
  },
  {
    name: "cantidad",
    required: true,
    label: "Cantidad",
    align: "center",
    field: "cantidad",
    sortable: true,
  },
  {
    name: "total",
    required: true,
    label: "Total",
    align: "center",
    field: "Total",
    sortable: true,
  },
  {
    name: "fechaCompra",
    required: true,
    label: "Fecha de Compra",
    align: "center",
    field: "fechaCompra",
    sortable: true,
    format: (val) => {
        return val.split('T')[0].split('-').reverse().join('/');
        }
  },
  {
    name: "estado",
    required: true,
    label: "Estado",
    align: "center",
    field: "estado",
    sortable: true,
  },
  {
    name: "opciones",
    required: true,
    label: "Opciones",
    align: "center",
    field: "opciones",
    sortable: true,
  },
]);

// Funciones no tan importantes ======================================
function abrir() {
  alert.value = true;
  limpiarCampos();
  accion.value = 1;
}

function cerrar() {
    limpiarCampos();
  alert.value = false;
}

function limpiarCampos() {
  idproveedores.value = "";
  nombre.value = "";
  tipo.value = "";
  observaciones.value = "";
  cantidad.value = "";
  Total.value = "";
  fechaCompra.value = "";
}

const removeSpaces = (campo) => {
    if (campo === 'nombre') {
        nombre.value = nombre.value.replace(/\s/g, '');
    } else if (campo === 'correo') {
        correo.value = correo.value.replace(/\s/g, '');
    } else if (campo === 'direccion') {
        direccion.value = direccion.value.replace(/\s/g, '');
    } else if (campo === 'telefono') {
        telefono.value = telefono.value.replace(/\s/g, '');
    }
};


function validarCampos() {
  if (
    !idproveedores.value.trim() ||
    !nombre.value.trim() ||
    !tipo.value.trim() ||
    !cantidad.value.trim() ||
    !Total.value.trim() ||
    !fechaCompra.value.trim()
  ) {
    Notify.create({
      message: "Por favor, completa todos los campos requeridos.",
      color: "negative",
      position: "top",
    });
    return false;
  }
  return true;
}

onMounted(() => {
  listarMaquinaria();
  listarProveedores();
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