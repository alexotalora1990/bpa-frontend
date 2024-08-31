
<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Sustrato</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Sustrato" : "Editar Sustrato" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>

                    <q-select outlined v-model="idproceso" label="Seleccione un Proceso" :options="optionsProceso"  @filter="filterProceso" class="q-my-md q-mx-md" />
                    <q-select outlined v-model="idempleado" label="Seleccione Responsable" :options="optionsEmpleado" @filter="filterEmpleado" class="q-my-md q-mx-md" />
                    <q-select outlined v-model="idempleado" label="Seleccione operario" :options="optionsEmpleado" @filter="filterEmpleado" class="q-my-md q-mx-md" />
                    <q-input outlined v-model="fecha" label="Fecha de Elaboración" class="q-my-md q-mx-md" type="date" />
                    <q-input outlined v-model="productocomercial" label="Producto Comercial" class="q-my-md q-mx-md" type="string" />
                    <q-input outlined v-model="ingredienteActivo" label="Ingrediente Activo" class="q-my-md q-mx-md" type="string" />
                    <q-input outlined v-model="dosisUtilizada" label="Dosis Utilizada" class="q-my-md q-mx-md" type="string" />
                    <q-input outlined v-model="metodoAplicaion" label="Metodo de Aplicación" class="q-my-md q-mx-md" type="string" />
                   

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
            <q-table title="Elaboración de Sustrato" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;"
                :loading="useRiego.loading">
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
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Notify } from "quasar"

import { useElaboracionStore } from '../store/elaboracionSustrato.js';
const useElaboracion =useElaboracionStore()
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();
import {useCultivoStore} from "../store/cultivos.js"
const useCultivo=useCultivoStore();


const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let cultivos = []
let empleados = []
let optionsCultivo = ref(cultivos)
let optionsEmpleado = ref(empleados)


let id = ref("")
let idcultivo = ref('');
let idempleado = ref("");
let fechaRiego = ref("");
let horaInicio = ref("");
let horaFin = ref("");
let diasTransplante = ref("");
let dosis= ref("");
let cantidadAgua= ref("");
let fenologico=ref("")


async function crear() {
    if (!validarCampos()) {return;}
    try {
        await useRiego.postRiegos({
            idcultivo: idcultivo.value.value,
            idempleado: idempleado.value.value,
            fechaRiego: fechaRiego.value,
            horaInicio: horaInicio.value,
            horaFin: horaFin.value,
            diasTransplante: diasTransplante.value,
            dosis: dosis.value,
            cantidadAgua:cantidadAgua.value,
            fenologico:fenologico.value
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear el riego!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}
function traerDatos(riego) {
    alert.value = true;
    accion.value = 2;
    id.value = riego._id;
    idcultivo.value = {
    label: riego.idcultivo.nombre,
    value: riego.idcultivo._id
    }
    idempleado.value = {
    label: clima.idempleado.nombre,
    value: clima.idempleado._id
    }
    fechaRiego.value = riego.fechaRiego;
    horaInicio.value = clima.horaInicio;
    horaFin.value = riego.horaFin;
    diasTransplante.value = riego.diasTransplante;
    dosis.value = riego.dosis;
    cantidadAgua.value=riego.cantidadAgua;
    fenologico.value=riego.fenologico
}


async function editar() {
    if (!validarCampos()) return;

    try {

        await useRiego.putRiegos(id.value, {
            idcultivo: idcultivo.value.value,
            idempleado: idempleado.value.value,
            fechaRiego: fechaRiego.value,
            horaInicio: horaInicio.value,
            horaFin: horaFin.value,
            diasTransplante: diasTransplante.value,
            dosis: dosis.value,
            cantidadAgua: cantidadAgua.value,
            fenologico:fenologico.value
        });

        Notify.create({
            message: 'Riego actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el Riego',
        });
        console.error('Error al modificar el riego', error);
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



//APARTADO DE TRAER LOS DATOS =============================
function filterCultivo(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsCultivo.value = cultivos.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}

function filterEmpleado(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsEmpleado.value = empleados.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}



async function listarTodo() {
    const r = await useRiego.listarRiegos();
    rows.value = r.data.riegos;
    console.log(r.data.riegos);
    
}
const listarCultivos = async () => {
    const data = await useCultivo.getCultivosActivos();
    cultivos.value = data.data.cultivosActivos.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    optionsCultivo.value = cultivos.value;
    console.log('Cultivos:', cultivos.value);
};
const listarEmpleados = async () => {
    const data = await useEmpleado.getEmpleadosActivos();
    empleados.value = data.data.empleados.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    optionsEmpleado.value = empleados.value;
    console.log('Empleados:', empleados.value);
};


// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

//APARTADO DE TRAER LOS DATOS =============================



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
        name: 'fechaRiego',
        required: true,
        label: 'Fecha Riego',
        align: 'center',
        field: 'fechaRiego',
        sortable: true
    },
    {
        name: 'horaInicio',
        required: true,
        label: 'Inicio',
        align: 'center',
        field: 'horaInicio',
        sortable: true
    },
    {
        name: 'horaFin',
        required: true,
        label: 'Termino',
        align: 'center',
        field: 'horaFin',
        sortable: true
    },
    {
        name: 'dosis',
        required: true,
        label: 'Dosis',
        align: 'center',
        field: 'dosis',
        sortable: true
    },
    {
        name: 'cantidadAgua',
        required: true,
        label: 'Cantidad Agua',
        align: 'center',
        field: 'cantidadAgua',
        sortable: true
    },
    {
        name: 'diasTranplante',
        required: true,
        label: 'Dias Transplante',
        align: 'center',
        field: 'diasTransplante',
        sortable: true
    },
    {
        name: 'fenologico',
        required: true,
        label: 'Fenologico',
        align: 'center',
        field: 'fenologico',
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
    fechaRiego.value = '';
    horaInicio.value = '';
    horaFin.value = '';
    fenologico.value = '';
    diasTransplante.value = '';
    cantidadAgua.value='';
    dosis.value='';
}

function validarCampos() {
    if (!idcultivo.value || !idempleado.value || !dosis.value || !horaInicio.value || 
        !horaFin.value || !fenologico.value || !cantidadAgua.value ||  fechaRiego.value || diasTransplante.value) {
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
    listarCultivos();
    listarEmpleados();
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