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
        >Crear Insumo</q-btn
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
            style="background-color: #008000; margin-bottom: 20px"
            class="row items-center"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Crear Insumo" : "Editar Insumo" }}
            </div>
            <q-space />
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
            v-model="idproveedor"
            label="Seleccione un Proveedor"
            :options="options"
            class="q-my-md q-mx-md"
            @filter="filterFn"
            hide-bottom-space
          />
          <q-input
            outlined
            v-model="nombre"
            label="Nombre del Insumo"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="relacion"
            label="Relación"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="cantidad"
            label="Cantidad"
            class="q-my-md q-mx-md"
            type="number"
          />
          <q-input
            outlined
            v-model="unidad"
            label="Unidad"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="responsable"
            label="Responsable"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="observaciones"
            label="Observaciones"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="total"
            label="Total"
            class="q-my-md q-mx-md"
            type="number"
          />
          <q-card-actions align="right">
            <q-btn @click="modify()" color="green" class="text-white">
              {{ accion == 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div style="display: flex; justify-content: center">
      <q-table
        title="Insumos"
        title-class="text-green text-weight-bolder text-h5"
        table-header-class="text-black"
        :rows="rows"
        :filter="filter"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 6%"
        :loading="useInsumos.loading"
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
    <q-btn @click="listarProveedores()">Prueba</q-btn>
  </div>
</template>
  
  <script setup>
import { onMounted, ref } from "vue";
import { Notify } from "quasar";
import { useInsumosStore } from "../store/insumos.js";
const useInsumos = useInsumosStore();
import { useProveedoresStore} from "../store/proveedores.js"

const useProveedor=useProveedoresStore();

const filter = ref("");

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
//////////////////////////////

let proveed = [];
let datos = {};
let options = ref(proveed);

//////////////////////////////
let id = ref("");
const idproveedor = ref("");
const nombre = ref("");
const relacion = ref("");
const cantidad = ref(0);
const unidad = ref("");
const responsable = ref("");
const observaciones = ref("");
const total = ref(0);

async function crear() {
  if (!validarCampos()) return;

  try {
    const r = await useInsumos.postInsumos({
      idproveedor:idproveedor.value.value,
      nombre: nombre.value,
      relacion: relacion.value,
      cantidad: cantidad.value,
      unidad: unidad.value,
      responsable: responsable.value,
      observaciones: observaciones.value,
      total: total.value,
    })
  } catch (error) {
    Notify.create({
      message: "¡Ocurrió un error al crear el insumo!",
      position: "center",
      color: "red",
    });
  } finally {
    listarTodo();
    limpiarCampos();
    cerrar();
  }
}

function traerDatos(insumo) {
  alert.value = true;
  accion.value = 2;
  id.value = insumo._id;
  idproveedor.value = {
    label: insumo.idproveedor.nombre,
    value: insumo.idproveedor._id,
  };
  nombre.value = insumo.nombre;
  relacion.value = insumo.relacion;
  cantidad.value = insumo.cantidad;
  unidad.value = insumo.unidad;
  responsable.value = insumo.responsable;
  observaciones.value = insumo.observaciones;
  total.value = insumo.total;
}

async function editar() {
  if (!validarCampos()) return;

  try {
    await useInsumos.putInsumo(id.value, {
      idproveedor: idproveedor.value.value,
      nombre: nombre.value,
      relacion: relacion.value,
      cantidad: cantidad.value,
      unidad: unidad.value,
      responsable: responsable.value,
      observaciones: observaciones.value,
      total: total.value,
    });

    Notify.create({
      message: "Insumo actualizado correctamente!",
      position: "center",
      color: "green",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message:
        error.response?.data?.errors?.[0]?.msg ||
        "Error al modificar el insumo",
    });
    console.error("Error al modificar el insumo", error);
  }
  listarTodo();
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
    listarTodo();
  } else if (listar.value == "Activos") {
    listarActivos();
  } else if (listar.value == "Inactivos") {
    listarInactivos();
  }
}

async function listarTodo() {
  const r = await useInsumos.listarInsumos();
  rows.value = r.data.insumos;
}

async function listarActivos() {
  const r = await useInsumos.getInsumosActivos();
  rows.value = r.data.insumo;
}

async function listarInactivos() {
  const r = await useInsumos.getInsumosInactivos();
  rows.value = r.data.insumo;
}


function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = proveed.filter( v=>v.label.toLowerCase().indexOF(needle)>-1);
  });
}

async function desactivar(insumo) {
  try {
    await useInsumos.putInsumosDesactivar(insumo._id);
    Notify.create({
      message: "Insumo desactivado correctamente!",
      position: "center",
      color: "orange",
    });
    listarTodo();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function activar(insumo) {
  try {
    await useInsumos.putInsumosActivar(insumo._id);
    Notify.create({
      message: "Insumo activado correctamente!",
      position: "center",
      color: "green",
    });
    listarTodo();
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
    field: (row) => row.idproveedor.nombre,
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
    name: "relacion",
    required: true,
    label: "Relación",
    align: "center",
    field: "relacion",
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
    name: "unidad",
    required: true,
    label: "Unidad",
    align: "center",
    field: "unidad",
    sortable: true,
  },
  {
    name: "responsable",
    required: true,
    label: "Responsable",
    align: "center",
    field: "responsable",
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
    label: "Opciones",
    align: "center",
  },
]);

function abrir() {
  limpiarCampos();
  accion.value = 1;
  alert.value = true;
}

function cerrar() {
  limpiarCampos();
  alert.value = false;
}

function limpiarCampos() {
  idproveedor.value="";
  nombre.value = "";
  relacion.value = "";
  cantidad.value = 0;
  unidad.value = "";
  responsable.value = "";
  observaciones.value = "";
  total.value = 0;
}

function validarCampos() {
  if (
    !nombre.value ||
    !relacion.value ||
    !cantidad.value ||
    !unidad.value ||
    !responsable.value ||
    !observaciones.value ||
    !total.value
  ) {
    Notify.create({
      message: "Todos los campos son obligatorios",
      position: "center",
      color: "red",
    });
    return false;
  }
  return true;
}

onMounted(() => {
    listarTodo();
        listarProveedores();
  
});
</script>

<style scoped>
.custom-select {
  max-width: 200px;
}
</style>