<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Producción</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Producción" : "Editar Producción" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>
                    <q-select outlined v-model="idcultivo" label="Seleccione un Cultivo" :options="options"
                        class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space />
                    <q-input outlined v-model="Numlote" label="Número del Lote" class="q-my-md q-mx-md" type="number" />
                    <q-input outlined v-model="especie" label="Especie" class="q-my-md q-mx-md" />
                    <q-input outlined v-model="observaciones" label="Observaciones" class="q-my-md q-mx-md"
                        type="textarea" />
                    <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="number" />
                    <q-input outlined v-model="cantidadTrabajadores" label="Cantidad de Trabajadores"
                        class="q-my-md q-mx-md" type="number" />
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
            <q-table title="Producción" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useProduccion.loading">
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
import { useProduccionStore } from "../store/produccion.js";
const useProduccion = useProduccionStore();
import { useCultivoStore } from "../store/cultivos.js";
const useCultivo = useCultivoStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let cultivos = []
let datos = {}
let options = ref(cultivos)

let id = ref("")
let idcultivo = ref('');
let Numlote = ref('');
let especie = ref('');
let observaciones = ref('');
let cantidad = ref('');
let cantidadTrabajadores = ref('');

async function crear() {
    if (!validarCampos()) { return; }
    try {
        await useProduccion.postProducciones({
            idcultivo: idcultivo.value.value,
            Numlote: Numlote.value,
            especie: especie.value,
            observaciones: observaciones.value,
            cantidad: cantidad.value,
            cantidadTrabajadores: cantidadTrabajadores.value
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear la producción!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}

function traerDatos(produccion) {
    alert.value = true;
    accion.value = 2;
    id.value = produccion._id;
    idcultivo.value = {
        label: produccion.idcultivo.nombre,
        value: produccion.idcultivo._id
    }
    Numlote.value = produccion.Numlote;
    especie.value = produccion.especie;
    observaciones.value = produccion.observaciones;
    cantidad.value = produccion.cantidad;
    cantidadTrabajadores.value = produccion.cantidadTrabajadores;
}



async function editar() {
    if (!validarCampos()) return;
    try {
        await useProduccion.putProducciones(id.value, {
            idcultivo: idcultivo.value.value,
            Numlote: Numlote.value,
            especie: especie.value,
            observaciones: observaciones.value,
            cantidad: cantidad.value,
            cantidadTrabajadores: cantidadTrabajadores.value
        });

        Notify.create({
            message: 'Producción actualizada correctamente!',
            position: "center",
            color: "green"
        });
        
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar la producción',
        });
        console.error('Error al modificar la producción', error);
    }
    listarTodo();
    limpiarCampos();
    cerrar();
}




function modify() {
    if (accion.value === 1) {
        crear()
    } else {
        editar()
    }
}


const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];

function filtrar() {
    if (listar.value == 'Listar todos') {
        listarTodo();
    } else if (listar.value == 'Activos') {
        listarActivos();
    } else if (listar.value == 'Inactivos') {
        listarInactivos();
    }
}

async function listarTodo() {
    const r = await useProduccion.listarProducciones();
    rows.value = r.data.produccion;
}
async function listarActivos() {
    const r = await useProduccion.getProduccionesActivos();
    console.log(r.data.produccionActiva);
    rows.value = r.data.produccionActiva;
}
async function listarInactivos() {
    const r = await useProduccion.getProduccionesInactivos();
    console.log(r.data.produccionDesactivada);
    rows.value = r.data.produccionDesactivada;
}
async function listarCultivos() {
    const data = await useCultivo.getCultivosActivos()
    data.data.cultivosActivos.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        cultivos.push(datos)
    })
    console.log(cultivos);
}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = cultivos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

async function desactivar(producciones) {
    const r = await useProduccion.putProduccionesDesactivar(producciones._id)
        .then((response) => {
            Notify.create({
                message: 'Producción Desactivada correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(producciones) {
    const r = await useProduccion.putProduccionesActivar(producciones._id)
        .then((response) => {
            Notify.create({
                message: 'Producción activada correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de Empleado:', error);
        })
}
//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
    {
        name: 'idcultivo',
        required: true,
        label: 'Cultivo',
        align: 'center',
        field: (row) => row.idcultivo.nombre,
        sortable: true
    },
    {
        name: 'Numlote',
        required: true,
        label: 'Numero del Lote',
        align: 'center',
        field: 'Numlote',
        sortable: true
    },
    {
        name: 'especie',
        required: true,
        label: 'Especie',
        align: 'center',
        field: 'especie',
        sortable: true
    },
    {
        name: 'cantidad',
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
        sortable: true
    },
    {
        name: 'cantidadTrabajadores',
        required: true,
        label: '# Trabajadores',
        align: 'center',
        field: 'cantidadTrabajadores',
        sortable: true
    },
    {
        name: 'observaciones',
        required: true,
        label: 'Observaciones',
        align: 'center',
        field: 'observaciones',
        sortable: true
    },
    {
        name: 'fecha',
        required: true,
        label: 'Fecha',
        align: 'center',
        field: 'fecha',
        sortable: true,
        format: (val) => {
            return val.split('T')[0].split('-').reverse().join('/');
        }
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
    Numlote.value = '';
    especie.value = '';
    observaciones.value = '';
    cantidad.value = '';
    cantidadTrabajadores.value = '';
}


function validarCampos() {
    if (!Numlote.value || !especie.value.trim() || !observaciones.value.trim() ||
        !cantidad.value || !cantidadTrabajadores.value) {
        Notify.create({
            message: 'Por favor, completa todos los campos requeridos.',
            color: 'negative',
            position: 'top',
        });
        return false;
    }

    // Verificar que los campos numéricos sean números positivos
    if (isNaN(Number(Numlote.value)) || Number(Numlote.value) <= 0 ||
        isNaN(Number(cantidad.value)) || Number(cantidad.value) <= 0 ||
        isNaN(Number(cantidadTrabajadores.value)) || Number(cantidadTrabajadores.value) <= 0) {
        Notify.create({
            message: 'Los campos Numlote, Cantidad y Cantidad de Trabajadores deben ser números positivos.',
            color: 'negative',
            position: 'top',
        });
        return false;
    }

    return true;
}





onMounted(() => {
    listarCultivos()
    listarTodo();
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