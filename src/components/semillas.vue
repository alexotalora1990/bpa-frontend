<template>
  <div style="height: 100vh; overflow-y: auto">
    <div style="
          margin-left: 5%;
          margin-right: 5%;
          display: flex;
          align-items: center;
        ">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Semilla</q-btn>
      <q-select outlined v-model="listar" label="Seleccione" :options="listados"
        class="q-my-md q-mx-md custom-select" />
      <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Crear Semilla" : "Editar Semilla" }}
            </div>
            <q-space />
            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
          </q-card-section>
          <q-select outlined v-model="idfinca" label="Seleccione una Finca" :options="options"
            class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space />
          <q-input outlined v-model="nombre" label="Nombre" class="q-my-md q-mx-md" type="text" 
            hide-bottom-space />
          <q-input outlined v-model="registroica" label="Registro Ica" class="q-my-md q-mx-md" type="text"
            hide-bottom-space />
          <q-input outlined v-model="registroinvima" label="Registro Invima" class="q-my-md q-mx-md" type="text"
            hide-bottom-space />
          <q-input outlined v-model="fechaVencimiento" label="Fecha de Vencimiento" class="q-my-md q-mx-md" type="date"
            hide-bottom-space />
          <q-input outlined v-model="especie" label="Especie" class="q-my-md q-mx-md" type="text" 
            hide-bottom-space />
          <q-input outlined v-model="NumLote" label="Número de Lote" class="q-my-md q-mx-md" type="number"
            hide-bottom-space />
          <q-input outlined v-model="origen" label="Origen" class="q-my-md q-mx-md" type="text" 
            hide-bottom-space />
          <q-input outlined v-model="poderGerminativo" label="Poder Germinativo" class="q-my-md q-mx-md" type="text"
            hide-bottom-space />
          <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="number"
            hide-bottom-space />
          <q-input outlined v-model="observaciones" label="Observaciones" class="q-my-md q-mx-md" type="textarea"
            hide-bottom-space />

          <q-card-actions align="right">
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
            <q-btn @click="modify()" color="green
              " class="text-white">
              {{ accion == 1 ? "Agregar" : "Editar" }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div style="display: flex; justify-content: center">
      <q-table title="Semillas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
        :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%"
        :loading="useSemilla.loading">
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
              <q-spinner color="primary" size="100px" style="align-self: center; margin-bottom: 10px" />
            </template>
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="traerDatos(props.row)">
              <q-tooltip>Editar</q-tooltip>✏️</q-btn>
            <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1">
              <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
            <q-btn @click="activar(props.row)" v-else>
              <q-tooltip>Activar</q-tooltip>✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useFincaStore } from "../store/fincas.js";
import { useSemillaStore } from "../store/semillas.js";
import { Notify } from "quasar";

const useFinca = useFincaStore();
const useSemilla = useSemillaStore();

const filter = ref("");

let rows = ref([]);
let idfinca = ref("");
let nombre = ref("");
let registroica = ref("");
let registroinvima = ref("");
let fechaVencimiento = ref("");
let especie = ref("");
let NumLote = ref("");
let origen = ref("");
let poderGerminativo = ref("");
let cantidad = ref("")
let observaciones = ref("")

let id = ref("");

let alert = ref(false);
let accion = ref(1);



async function crear() {
  if (!validarCampos()) {
    return;
  }
  try {
    const r = await useSemilla.postSemillas({
      idfinca: idfinca.value.value,
      registroica: registroica.value,
      registroinvima: registroinvima.value,
      fechaVencimiento: fechaVencimiento.value,
      especie: especie.value,
      NumLote: NumLote.value,
      origen: origen.value,
      poderGerminativo: poderGerminativo.value,
      cantidad: cantidad.value,
      observaciones: observaciones.value
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
  idfinca.value = {
    label: semilla.idfinca.nombre,
    value: semilla.idfinca._id,
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
      idfinca: idfinca.value.value,
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

let fincas = [];
let datos = {};
let options = ref(fincas);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}


async function listarFincas() {
  const data = await useFinca.getFincasActivos();
  data.data.fincaActiva.forEach((item) => {
    datos = {
      label: item.nombre,
      value: item._id,
    };
    fincas.push(datos);
  });
  console.log(fincas);
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
  console.log(rows.value)
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
    name: "nombre",
    required: true,
    label: "Semilla",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "ICA",
    required: true,
    label: "ICA",
    align: "center",
    field: "registroica",
    sortable: true,
  },
  {
    name: "INVIMA",
    required: true,
    label: "INVIMA",
    align: "center",
    field: "registroinvima",
    sortable: true,
  },
  {
    name: "fechaVencimiento",
    required: true,
    label: "Fecha de Vencimiento",
    align: "center",
    field: "fechaVencimiento",
    sortable: true,
    format: (val) => {
      return val.split('T')[0].split('-').reverse().join('/');
    }
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
    name: "Cantidad",
    required: true,
    label: "Cantidad",
    align: "center",
    field: "cantidad",
    sortable: true,
  },
  {
    name: "observaciones",
    required: true,
    label: "Observaciones",
    align: "center",
    field: "observaciones",
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
  idfinca.value = "";
  fechaVencimiento.value = "";
  especie.value = "";
  NumLote.value = "";
  origen.value = "";
  poderGerminativo.value = "";
  accion.value = 1;
}

function validarCampos() {
  if (
    !idfinca.value ||
    !fechaVencimiento.value ||
    !especie.value ||
    !NumLote.value ||
    !origen.value ||
    !poderGerminativo.value 
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
  listarFincas();
  listarSemillas();
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