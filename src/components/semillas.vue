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
          >Crear Semilla</q-btn
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
              style="background-color: #a1312d; margin-bottom: 20px"
            >
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Crear Semilla" : "Editar Semilla" }}
              </div>
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
              v-model="numFactura"
              label="Número de Factura"
              class="q-my-md q-mx-md"
              type="number"
              :rules="numFacturaRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="fechaCompra"
              label="Fecha de Compra"
              class="q-my-md q-mx-md"
              type="date"
              :rules="fechaCompraRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="fechaVencimiento"
              label="Fecha de Vencimiento"
              class="q-my-md q-mx-md"
              type="date"
              :rules="fechaVencimientoRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="especie"
              label="Especie"
              class="q-my-md q-mx-md"
              type="text"
              :rules="especieRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="NumLote"
              label="Número de Lote"
              class="q-my-md q-mx-md"
              type="number"
              :rules="NumLoteRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="origen"
              label="Origen"
              class="q-my-md q-mx-md"
              type="text"
              :rules="origenRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="poderGerminativo"
              label="Poder Germinativo"
              class="q-my-md q-mx-md"
              type="text"
              :rules="poderGerminativoRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="unidadtotal"
              label="Unidad Total"
              class="q-my-md q-mx-md"
              type="number"
              :rules="unidadtotalRules"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="total"
              label="Total"
              class="q-my-md q-mx-md"
              type="number"
              :rules="totalRules"
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
          title="Semillas"
          title-class="text-green text-weight-bolder text-h5"
          table-header-class="text-black"
          :rows="rows"
          :filter="filter"
          :columns="columns"
          row-key="name"
          style="width: 90%; margin-bottom: 6%"
          :loading="useSemilla.loading"
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
import { useSemillaStore } from "../store/semillas.js";
import { Notify } from "quasar";

const useProveedor = useProveedoresStore();
const useSemilla = useSemillaStore();

const filter = ref(""); 

let rows = ref([]);
let idproveedores = ref("");
let numFactura = ref("");
let fechaCompra = ref("");
let fechaVencimiento = ref("");
let especie = ref("");
let NumLote = ref("");
let origen = ref("");
let poderGerminativo = ref("");
let unidadtotal = ref("");
let total = ref("");
let id = ref("");

let alert = ref(false);
let accion = ref(1);

const isRequired = (msg) => (val) => !!val.trim().length || msg;
const minLength = (min, msg) => (val) => val.trim().length >= min || msg;

const numFacturaRules = [
  isRequired("El número de factura es requerido"),
  minLength(3, "El numero de factura debe tener al menos 3 caracteres"),
];
const fechaCompraRules = [
  isRequired("La fecha de compra es requerida"),
];
const fechaVencimientoRules = [
  isRequired("La fecha de vencimiento es requerida"),
];
const especieRules = [
  isRequired("La especie es requerida"),
  minLength(3, "La especie debe tener al menos 3 caracteres"),
];
    const NumLoteRules = [
    isRequired("El número de lote es requerido"),
    (val) => val > 0 || "El número de lote debe ser mayor a 0",
    ];
const origenRules = [
  isRequired("El origen es requerido"),
];
const poderGerminativoRules = [
  isRequired("El poder germinativo es requerido"),
];
const unidadtotalRules = [
  isRequired("La unidad total es requerida"),
  (val) => val > 0 || "La unidad total debe ser mayor a 0",
];
const totalRules = [
  isRequired("El total es requerido"),
  (val) => val > 0 || "El total debe ser mayor a 0",
];

async function crear() {
  if (!validarCampos()) {
    return;
  }
  try {
    const r = await useSemilla.postSemillas({
      idproveedores: idproveedores.value.value,
      numFactura: numFactura.value,
      fechaCompra: fechaCompra.value,
      fechaVencimiento: fechaVencimiento.value,
      especie: especie.value,
      NumLote: NumLote.value,
      origen: origen.value,
      poderGerminativo: poderGerminativo.value,
      unidadtotal: unidadtotal.value,
      total: total.value,
    });
    Notify.create({
      message: "Semilla creada correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      message: "Error al crear la semilla",
      position: "center",
      color: "red",
    });
  }
  listarSemillas();
  limpiarCampos();
  cerrar();
}


function traerDatos(semilla) {
  alert.value = true;
  accion.value = 2;
  idproveedores.value = {
    label: semilla.idproveedores.nombre,
    value: semilla.idproveedores._id,
  };
  numFactura.value = semilla.numFactura;
  fechaCompra.value = semilla.fechaCompra;
  fechaVencimiento.value = semilla.fechaVencimiento;
  especie.value = semilla.especie;
  NumLote.value = semilla.NumLote;
  origen.value = semilla.origen;
  poderGerminativo.value = semilla.poderGerminativo;
  unidadtotal.value = semilla.unidadtotal;
  total.value = semilla.total;
  id.value = semilla._id;
}


async function editar() {
  if (!validarCampos()) {
    return;
  }
  try {
    const r = await useSemilla.putSemillas(id.value, {
      idproveedores: idproveedores.value.value,
      numFactura: numFactura.value,
      fechaCompra: fechaCompra.value,
      fechaVencimiento: fechaVencimiento.value,
      especie: especie.value,
      NumLote: NumLote.value,
      origen: origen.value,
      poderGerminativo: poderGerminativo.value,
      unidadtotal: unidadtotal.value,
      total: total.value,
    });
    Notify.create({
      message: "Semilla actualizada correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      message: "Error al actualizar la semilla",
      position: "center",
      color: "red",
    });
  }
  listarSemillas();
  limpiarCampos();
  cerrar();
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


const listar = ref("");
const listados = ["Listar todos", "Activos", "Inactivos"];

function filtrar() {
  if (listar.value == "Listar todos") {
    listarSemillas();
  } else if (listar.value == "Activos") {
    listarSemillasActivas();
  } else if (listar.value == "Inactivos") {
    listarSemillasInactivas();
  }
}

async function listarSemillas() {
  const r = await useSemilla.listarSemillas()
  rows.value = r.data.semilla;
}

async function listarSemillasActivas() {
  const r = await useSemilla.getSemillasActivos();
  console.log(r.data);
  rows.value = r.data.semillaActiva;
}
async function listarSemillasInactivas() {
  const r = await useSemilla.getSemillasInactivos();
  console.log(r.data.maquinaria);
  rows.value = r.data.semillaDesactivada;
}

async function desactivar(semilla) {
  try {
    await useSemilla.putSemillasDesactivar(semilla._id);
    Notify.create({
      message: "Semilla desactivada correctamente!",
      position: "center",
      color: "orange",
    });
    listarSemillas();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function activar(semilla) {
  try {
    await useSemilla.putSemillasActivar(semilla._id);
    Notify.create({
      message: "semilla activada correctamente!",
      position: "center",
      color: "green",
    });
    listarSemillas();
  } catch (error) {
    console.log("Error:", error);
  }
}

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
    name: "numFactura",
    required: true,
    label: "Número de Factura",
    align: "center",
    field: "numFactura",
    sortable: true,
  },
  {
    name: "fechaCompra",
    required: true,
    label: "Fecha de Compra",
    align: "center",
    field: "fechaCompra",
    sortable: true,
  },
  {
    name: "fechaVencimiento",
    required: true,
    label: "Fecha de Vencimiento",
    align: "center",
    field: "fechaVencimiento",
    sortable: true,
  },
  {
    name: "especie",
    required: true,
    label: "Especie",
    align: "center",
    field: "especie",
    sortable: true,
  },
  {
    name: "NumLote",
    required: true,
    label: "Número de Lote",
    align: "center",
    field: "NumLote",
    sortable: true,
  },
  {
    name: "origen",
    required: true,
    label: "Origen",
    align: "center",
    field: "origen",
    sortable: true,
  },
  {
    name: "poderGerminativo",
    required: true,
    label: "Poder Germinativo",
    align: "center",
    field: "poderGerminativo",
    sortable: true,
  },
  {
    name: "unidadtotal",
    required: true,
    label: "Unidad Total",
    align: "center",
    field: "unidadtotal",
    sortable: true,
  },
  {
    name: "total",
    required: true,
    label: "Total",
    align: "center",
    field: "total",
    sortable: true,
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

function abrir() {
  alert.value = true;
  limpiarCampos();
  accion.value = 1;
}

function cerrar() {
  alert.value = false;
  limpiarCampos();
}

function limpiarCampos() {
  idproveedores.value = "";
  numFactura.value = "";
  fechaCompra.value = "";
  fechaVencimiento.value = "";
  especie.value = "";
  NumLote.value = "";
  origen.value = "";
  poderGerminativo.value = "";
  unidadtotal.value = "";
  total.value = "";
  accion.value = 1;
}

function validarCampos() {
  if (
    !idproveedores.value ||
    !numFactura.value ||
    !fechaCompra.value ||
    !fechaVencimiento.value ||
    !especie.value ||
    !NumLote.value ||
    !origen.value ||
    !poderGerminativo.value ||
    !unidadtotal.value ||
    !total.value
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

onMounted(async () => {
  listarSemillas();
  listarProveedores();
});

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