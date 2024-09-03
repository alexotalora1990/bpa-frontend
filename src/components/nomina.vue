<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Nomina</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Nomina" : "Editar Nomina" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>
                    <q-select outlined v-model="idempleados" label="Seleccione un Empleado" :options="options"
                        class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space />
                    <q-input outlined v-model="fecha" label="Fecha" class="q-my-md q-mx-md" type="date" />
                    <q-input outlined v-model="tipo" label="Tipo" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="valor" label="Valor" class="q-my-md q-mx-md" type="text" />
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
            <q-table title="Nominas" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useNomina.loading">
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
import { useNominaStore } from "../store/nomina.js";
const useNomina = useNominaStore();
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let empleados = []
let datos = {}
let options = ref(empleados)

let id = ref("")
let idempleados = ref('');
let fecha = ref('');
let tipo = ref('');
let valor = ref('');

async function crear() {
    if (!validarCampos()) {return;}
    try {
        await useNomina.postNominas({
            fecha : fecha.value,
            idempleados: idempleados.value.value,
            tipo: tipo.value,
            valor : valor.value,
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear la Nomina!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}


function traerDatos(nominas) {
    alert.value = true;
    accion.value = 2;
    id.value = nominas._id;
    idempleados.value = {
    label: nominas.idempleados.nombre,
    value: nominas.idempleados._id
    }
    fecha.value = nominas.fecha.split('T')[0];
    valor.value = nominas.valor;
    tipo.value = nominas.tipo;
}


async function editar() {
    if (!validarCampos()) return;
    try {
        await useNomina.putNominas(id.value, {
            idempleados: idempleados.value.value,
            fecha: fecha.value,
            tipo: tipo.value,
            valor: valor.value,
        });

        Notify.create({
            message: 'Nomina actualizada correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar la Nomina',
        });
        console.error('Error al modificar la parcela', error);
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
    const r = await useNomina.listarNominas();
    rows.value = r.data.nominas;
}
async function listarActivos() {
    const r = await useNomina.getNominasActivos();
    console.log(r.data.nominas);
    rows.value = r.data.nominas;
}
async function listarInactivos() {
    const r = await useNomina.getNominasInactivos();
    console.log(r.data.nominas);
    rows.value = r.data.nominas;
}
async function listarEmpleados() {
    const data = await useEmpleado.getEmpleadosActivos()
    data.data.empleados.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        empleados.push(datos)
    })
    console.log(empleados);
}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = empleados.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

async function desactivar(nominas) {
    const r = await useNomina.putNominasDesactivar(nominas._id)
        .then((response) => {
            Notify.create({
                message: 'Nomina Desactivada correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(nominas) {
    const r = await useNomina.putNominasActivar(nominas._id)
        .then((response) => {
            Notify.create({
                message: 'Nomina activada correctamente!',
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
        name: 'idempleados',
        required: true,
        label: 'Empleado',
        align: 'center',
        field: (row) => row.idempleados.nombre,
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
        name: 'tipo',
        required: true,
        label: 'Tipo nomina',
        align: 'center',
        field: 'tipo',
        sortable: true
    },
    {
        name: 'valor',
        required: true,
        label: 'Valor',
        align: 'center',
        field: 'valor',
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
    idempleados.value = '';
    tipo.value = '';
    fecha.value = '';
    valor.value = '';
}


function validarCampos() {
    if (!idempleados.value || !tipo.value || !fecha.value || !valor.value) {
        Notify.create({
            message: 'Por favor, completa todos los campos requeridos.',
            color: 'negative',
            position: 'top',
        });
        return false;
    }
    return true;
}


onMounted(() => {
    listarEmpleados()
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