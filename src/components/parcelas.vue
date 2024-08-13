<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Crear Finca</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Finca" : "Editar Finca" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="numero" label="Numero de la Finca" class="q-my-md q-mx-md" type="text"
                        hide-bottom-space />
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
            <q-table title="Parcelas" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useParcela.loading">
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
                        <template v-slot:loading>
                            <q-spinner color="primary" size="100px" style="align-self: center; margin-bottom: 10px;" />
                        </template>
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
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
import { onMounted, ref } from 'vue';
import { Notify } from "quasar"

import { useParcelaStore } from '../store/parcelas.js';
const useParcela = useParcelaStore();
import { useFincaStore } from '../store/fincas.js';
const useFinca = useFincaStore();


const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let alert = ref(false);
let accion = ref(1);
let rows = ref([]);

let fincas = []
let datos = {}
let options = ref(fincas)

let nombre = ref('');
let idfincas = ref('');

function modify() {
    if (accion.value === 1) {
        crear()
    } else {
        editar()
    }
}

async function crear() {
    listarParcelas();
    limpiarCampos();
    cerrar()
}

//APARTADO DE TRAER LOS DATOS =============================
const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];

function filtrar() {
    if (listar.value == 'Listar todos') {
        listarParcelas();
    } else if (listar.value == 'Activos') {
        listarParcelasActivos();
    } else if (listar.value == 'Inactivos') {
        listarParcelasInactivos();
    }
}

async function listarParcelas() {
    const r = await useParcela.listarParcelas();
    rows.value = r.data.parcelas;
}
async function listarParcelasActivos() {
    const r = await useParcela.getParcelasActivos();
    console.log(r.data.parcelaActiva);
    rows.value = r.data.parcelaActiva;
}
async function listarParcelasInactivos() {
    const r = await useParcela.getParcelasInactivos();
    console.log(r.data.parcelaDesactivada);
    rows.value = r.data.parcelaDesactivada;
}

async function listarFincas() {
    const data = await useFinca.getFincasActivos();
    data.data.fincaActiva.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        fincas.push(datos)
    })
    console.log(fincas);
}

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
//APARTADO DE TRAER LOS DATOS =============================




const columns = ref([
    {
        name: 'Finca',
        required: true,
        label: 'Finca',
        align: 'center',
        field: (row) => row.idfincas.nombre,
        sortable: true
    },
    {
        name: 'Numero',
        required: true,
        label: 'Numero',
        align: 'center',
        field: 'numero',
        sortable: true
    },
    {
        name: 'latitud',
        required: true,
        label: 'Latitud',
        align: 'center',
        field: (row) => row.ubicacion?.latitud || '',
        sortable: true
    },
    {
        name: 'longitud',
        required: true,
        label: 'Longitud',
        align: 'center',
        field: (row) => row.ubicacion?.longitud || '',
        sortable: true
    },
]);

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
    idadmin.value = "",nombre.value = '';
    rut.value = '';direccion.value = '';
    ubicacion.value = '';area.value = '';
    departamento.value = '';ciudad.value = '';
    latitud.value = '';longitud.value = '';
    limites.value = {
        norte: '',
        sur: '',
        este: '',
        oeste: ''
    };
}


onMounted(() => {
    listarParcelas();
    listarFincas();
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
