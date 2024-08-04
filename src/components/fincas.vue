<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Crear Finca</q-btn>
            <q-select outlined v-model="listados1" label="Seleccione" :options="listados"
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
                    <q-input outlined v-model="nombre" label="Nombre de la Finca" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="rut" label="RUT de la Finca" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="direccion" label="Dirección de la Finca" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="ubicacion" label="Ubicación de la Finca" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="area" label="Área de la Finca" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="departamento" label="Departamento" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="ciudad" label="Ciudad" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="limites.norte" label="Límite Norte" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="limites.sur" label="Límite Sur" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="limites.este" label="Límite Este" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="limites.oeste" label="Límite Oeste" class="q-my-md q-mx-md"
                        type="text" />

                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>

        <div style="display: flex; justify-content: center">
            <q-table title="Fincas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
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
                        <q-btn @click="traerFinca(props.row)">
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
import { useFincaStore } from '../store/fincas.js';
const useFinca=useFincaStore()

const filter = ref("");//este filter es para el buscador de la tabla

let rows = ref([]);
let nombre = ref('');
let rut = ref('');
let direccion = ref('');
let ubicacion = ref('');
let area = ref('');
let departamento = ref('');
let ciudad = ref('');
let limites = ref({
    norte: '',
    sur: '',
    este: '',
    oeste: ''
});
const listados1 = ref("")
const listados = ['Listar todos', 'Activos', 'Inactivos'];

let alert = ref(false);
let accion = ref(1);

let datos = {};

function filtrar() {
    // Implement filtering logic
}

//LISTAR EN LA TABLA


async function listar() {
    const r = await useFinca.listarFincas()
    console.log(r.data.fincas);
    rows.value = r.data.fincas
}


const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'rut',
        required: true,
        label: 'RUT',
        align: 'center',
        field: 'rut',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Dirección',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'ubicacion',
        required: true,
        label: 'Ubicación',
        align: 'center',
        field: 'ubicacion',
        sortable: true
    },
    {
        name: 'area',
        required: true,
        label: 'Área',
        align: 'center',
        field: 'area',
        sortable: true
    },
    {
        name: 'departamento',
        required: true,
        label: 'Departamento',
        align: 'center',
        field: 'departamento',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'limiteNorte',
        required: true,
        label: 'Límite Norte',
        align: 'center',
        field: (row) => row.limites?.norte || '',
        sortable: true
    },
    {
        name: 'limiteSur',
        required: true,
        label: 'Límite Sur',
        align: 'center',
        field: (row) => row.limites?.sur || '',
        sortable: true
    },
    {
        name: 'limiteEste',
        required: true,
        label: 'Límite Este',
        align: 'center',
        field: (row) => row.limites?.este || '',
        sortable: true
    },
    {
        name: 'limiteOeste',
        required: true,
        label: 'Límite Oeste',
        align: 'center',
        field: (row) => row.limites?.oeste || '',
        sortable: true
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
        sortable: true
    },
    {
        name: 'opciones',
        required: true,
        label: 'Opciones',
        align: 'center',
        field: 'opciones',
        sortable: true
    }
]);

// Funciones no tan importantes  ======================================
function abrir() {
    alert.value = true;
    limpiarCampos();
    accion.value = 1;
}

function cerrar() {
    alert.value = false;
}

function limpiarCampos() {
    nombre.value = '';
    rut.value = '';
    direccion.value = '';
    ubicacion.value = '';
    area.value = '';
    departamento.value = '';
    ciudad.value = '';
    limites.value = {
        norte: '',
        sur: '',
        este: '',
        oeste: ''
    };
}

// El onMounted
onMounted(() => {
    listar();
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
