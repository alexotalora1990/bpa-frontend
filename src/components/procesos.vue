
<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Proceso</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>

        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Proceso" : "Editar Proceso" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>
      
                    <q-select outlined v-model="idcultivo" label="Seleccione un cultivo" :options="optionsCultivo"
                        class="q-my-md q-mx-md" @filter="filterCultivo" hide-bottom-space />
                    <q-select outlined v-model="idempleado" label="Seleccione un empleado" :options="optionsEmpleado"
                        class="q-my-md q-mx-md" @filter="filterEmpleado" hide-bottom-space />
                    <q-input outlined v-model="tipo" label="Tipo" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="descripcion" label="Descripcion" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="fechainicio" label="Fecha Inicial" type="date" class="q-my-md q-mx-md" />
                    <q-input outlined v-model="fechafinal" label="Fecha Final" type="date" class="q-my-md q-mx-md" />
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

            <q-table title="Procesos" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useProceso.loading">

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
  

import { useProcesoStore } from '../store/procesos.js';
const useProceso = useProcesoStore();
import { useCultivoStore } from '../store/cultivos.js';
const useCultivo = useCultivoStore();
import { useEmpleadoStore } from '../store/empleados.js';
const useEmpledo =useEmpleadoStore()
import { format } from 'date-fns';


const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let cultivos = []
let datosCultivo = {}
let optionsCultivo = ref(cultivos)

let empleados = []
let datosEmpleado = {}
let optionsEmpleado = ref(empleados)

let id = ref("")
let idcultivo = ref('');
let idempleado =ref('')
let numero = ref('');
let tipo = ref('');
let descripcion = ref('');
let fechainicio = ref('');
let fechafinal = ref('');



async function crear() {
    if (!validarCampos()) {return;}
    try {

        await useProceso.postProcesos({
            idcultivo: idcultivo.value.value,
            idempleado:idempleado.value.value,
            tipo: tipo.value,
            descripcion: descripcion.value,
            fechainicio: fechainicio.value,
            fechafinal: fechafinal.value
        
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear el cultivo!',

            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}

const formatDates = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0,10);
};

function traerDatos(proceso) {
    alert.value = true;
    accion.value = 2;
    id.value = proceso._id;
    idcultivo.value = {
    label: proceso.idcultivo.nombre,
    value: proceso.idcultivo._id
    };
    idempleado.value = {
    label: proceso.idempleado.nombre,
    value: proceso.idempleado._id
    };
    tipo.value = proceso.tipo;
    descripcion.value = proceso.descripcion;
    fechainicio.value = proceso.fechainicio.split('T')[0];
    fechafinal.value = formatDates(proceso.fechafinal);

}


async function editar() {
    if (!validarCampos()) return;

    try {
        await useProceso.putProcesos(id.value, {
            idcultivo: idcultivo.value.value,
            idempleado:idempleado.value.value,
            tipo: tipo.value,
            descripcion: descripcion.value,
            fechainicio: fechainicio.value,
            fechafinal: fechafinal.value
        });

        Notify.create({
            message: 'Proceso actualizado correctamente!',

            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',

            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el proceso',
        });
        console.error('Error al modificar el proceso', error);

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
    const r = await useProceso.listarProcesos();
    console.log(r.data);
    
    rows.value = r.data.procesos;
}
async function listarActivos() {
    const r = await useProceso.getProcesosActivos();
    console.log(r.data.procesoActivo);
    rows.value = r.data.procesoActivo;
}
async function listarInactivos() {
    const r = await useProceso.getProcesosInactivos();
    console.log(r.data.procesoDesactivado);
    rows.value = r.data.procesoDesactivado;
}
async function listarCultivos() {
    const data = await useCultivo.getCultivosActivos()
    cultivos.value=data.data.cultivosActivos.map(item => ({
       
            label: item.nombre,
            value: item._id
                   }));
    optionsCultivo.value=cultivos.value
    console.log('Cultivos', cultivos.value);
    
}
const listarEmpleados = async () => {
    const data = await useEmpledo.getEmpleadosActivos();
    empleados.value = data.data.empleados.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    optionsEmpleado.value = empleados.value;
    console.log('Empleados:', empleados.value);
};


function filterEmpleado(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsEmpleado.value = empleados.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
function filterCultivo(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsCultivo.value = cultivos.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}


async function desactivar(procesos) {
    const r = await useProceso.putProcesosDesactivar(procesos._id)
        .then((response) => {
            Notify.create({
                message: 'Proceso Desactivado correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de proceso:', error);
        })
}
async function activar(procesos) {
    const r = await useProceso.putProcesosActivar(procesos._id)
        .then((response) => {
            Notify.create({
                message: 'Proceso activado correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de Proceso:', error);
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
        name: 'idempleado',
        required: true,
        label: 'Empleado',
        align: 'center',
        field: (row) => row.idempleado.nombre,
        sortable: true
    },
    {
        name: 'tipo',
        required: true,

        label: 'Tipo',

        align: 'center',
        field: 'tipo',
        sortable: true
    },

        
    {
        name: 'descripcion',
        required: true,
        label: 'Descripcion',
        align: 'center',
        field: 'descripcion',
        sortable: true
    },
    {
        name: 'fechaInicio',
        required: true,
        label: 'Fecha Inicial',
        align: 'center',
        field: (row)=>format(new Date(row.fechaInicio),'dd/MM/yyyy'),
        sortable: true
    },
    {
        name: 'fechaFinal',
        required: true,
        label: 'Fecha Final',
        align: 'center',
        field: (row)=>format(new Date(row.fechaFinal),'dd/MM/yyyy'),
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

    idcultivo.value = '';
    idempleado.value = '';
    descripcion.value = '';
    fechainicio.value = '';
    fechafinal.value = '';
}


function validarCampos() {
    if (!idempleado.value || !idcultivo.value || !tipo.value || !descripcion.value || !fechafinal.value ||
        !fechafinal.value) {

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
    
    listarTodo();
    listarEmpleados()
    listarCultivos()

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

