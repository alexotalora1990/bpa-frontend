<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Clima</q-btn>
        </div>
        <div>
            <q-form ref="formulario" @submit.prevent="modify">
                <q-dialog v-model="alert" persistent>
                    <q-card style="width: 700px">
                        <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                            <div class="text-h6 text-white">
                                {{ accion == 1 ? "Crear Clima" : "Editar Clima" }}
                            </div>
                            <q-space />
                            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                        </q-card-section>

                        <q-select outlined v-model="idfincas" label="Seleccione una Finca" :options="options"
                            @filter="filter1" class="q-my-md q-mx-md" hide-bottom-space
                            :rules="[(val) => !!val || 'Este campo es requerido']" />
                        <q-select outlined v-model="idempleado" label="Seleccione un Empleado" :options="opciones"
                            @filter="filter2" class="q-my-md q-mx-md" hide-bottom-space
                            :rules="[(val) => !!val || 'Este campo es requerido']" />
                        <q-input outlined v-model="tipo" label="Tipo de Clima" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="horaInicio" label="Hora de Inicio" class="q-my-md q-mx-md"
                            type="time" :rules="[
                                (val) => !!val || 'La hora de inicio es requerida',
                                (val) => /^([0-9]{2}):([0-9]{2})$/.test(val) || 'Formato de hora inválido'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="horaFinal" label="Hora Final" class="q-my-md q-mx-md" type="time"
                            :rules="[
                                (val) => !!val || 'La hora final es requerida',
                                (val) => /^([0-9]{2}):([0-9]{2})$/.test(val) || 'Formato de hora inválido'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="tempMin" label="Temperatura Mínima" class="q-my-md q-mx-md"
                            type="number" :rules="[
                                (val) => !!val || 'La temperatura mínima es requerida',
                                (val) => parseFloat(val) <= parseFloat(tempMax) || 'La temperatura mínima no puede ser mayor que la máxima'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="tempMax" label="Temperatura Máxima" class="q-my-md q-mx-md"
                            type="number" :rules="[
                                (val) => !!val || 'La temperatura máxima es requerida',
                                (val) => parseFloat(val) >= parseFloat(tempMin) || 'La temperatura máxima no puede ser menor que la mínima'
                            ]" hide-bottom-space />
                        <q-card-actions align="right">
                            <q-btn @click="modify()" color="green" class="text-white">
                                {{ accion == 1 ? "Agregar" : "Editar" }}
                            </q-btn>
                            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-form>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Climas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;"
                :loading="useClima.loading">
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
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();
import { useFincaStore } from "../store/fincas.js";
const useFinca = useFincaStore();
import { useClimaStore } from "../store/clima.js";
const useClima = useClimaStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let fincas = []
let empleados = []
let options = ref(fincas)
let opciones = ref(empleados)
const formulario = ref(null);

let id = ref("")
let idfincas = ref('');
let idempleado = ref("");
let tipo = ref("");
let horaInicio = ref("");
let horaFinal = ref("");
let tempMin = ref("");
let tempMax = ref("");


async function crear() {
    if (!validarCampos()) { return; }
    try {
        await useClima.postClimas({
            idfincas: idfincas.value.value,
            idempleado: idempleado.value.value,
            tipo: tipo.value,
            horaInicio: horaInicio.value,
            horaFinal: horaFinal.value,
            tempMin: tempMin.value,
            tempMax: tempMax.value,
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear la parcela!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}
function traerDatos(clima) {
    alert.value = true;
    accion.value = 2;
    id.value = clima._id;
    idfincas.value = {
        label: clima.idfincas.nombre,
        value: clima.idfincas._id
    }
    idempleado.value = {
        label: clima.idempleado.nombre,
        value: clima.idempleado._id
    }
    tipo.value = clima.tipo;
    horaInicio.value = clima.horaInicio;
    horaFinal.value = clima.horaFinal;
    tempMin.value = clima.tempMin;
    tempMax.value = clima.tempMax;
}


async function editar() {
    if (!validarCampos()) return;

    try {

        await useClima.putClimas(id.value, {
            idfincas: idfincas.value.value,
            idempleado: idempleado.value.value,
            tipo: tipo.value,
            horaInicio: horaInicio.value,
            horaFinal: horaFinal.value,
            tempMin: tempMin.value,
            tempMax: tempMax.value
        });

        Notify.create({
            message: 'Clima actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el clima',
        });
        console.error('Error al modificar el clima', error);
    }
    listarTodo();
    limpiarCampos();
    cerrar();
}


async function modify() {
    try {
        const valid = await formulario.value.validate();
        if (!valid) {
            Notify.create({
                type: "negative",
                message: "Por favor, complete correctamente todos los campos Correctamente",
                icon: "error",
            });
            return;
        }
        if (accion.value === 1) {
            await crear();
        } else {
            await editar();
        }
    } catch (error) {
        Notify.create({
            type: "negative",
            message: "Error en la operación",
            icon: "error",
        });
        console.error("Error en modify:", error);
    }
}



//APARTADO DE TRAER LOS DATOS =============================
function filter1(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = fincas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}

function filter2(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = empleados.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}



async function listarTodo() {
    const r = await useClima.listarClimas();
    rows.value = r.data.clima;
}
const listarFincas = async () => {
    const data = await useFinca.getFincasActivos();
    fincas.value = data.data.fincaActiva.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    options.value = fincas.value;
    console.log('Fincas:', fincas.value);
};
const listarEmpleados = async () => {
    const data = await useEmpleado.getEmpleadosActivos();
    empleados.value = data.data.empleados.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    opciones.value = empleados.value;
    console.log('Empleados:', empleados.value);
};


// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

//APARTADO DE TRAER LOS DATOS =============================



const columns = ref([
    {
        name: 'idfincas',
        required: true,
        label: 'Finca',
        align: 'center',
        field: (row) => row.idfincas.nombre,
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
        label: 'Clima',
        align: 'center',
        field: 'tipo',
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
        name: 'horaFinal',
        required: true,
        label: 'Termino',
        align: 'center',
        field: 'horaFinal',
        sortable: true
    },
    {
        name: 'tempMin',
        required: true,
        label: 'Temperatura Minima',
        align: 'center',
        field: 'tempMin',
        sortable: true
    },
    {
        name: 'tempMax',
        required: true,
        label: 'Temperatura Maxima',
        align: 'center',
        field: 'tempMax',
        sortable: true
    },
    {
        name: 'createAt',
        required: true,
        label: 'Fecha del Clima',
        align: 'center',
        field: 'createAt',
        sortable: true,
        format: (val) => {
            return val.split('T')[0].split('-').reverse().join('/');
        }
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
    idfincas.value = '';
    idempleado.value = '';
    tipo.value = '';
    horaInicio.value = '';
    horaFinal.value = '';
    tempMin.value = '';
    tempMax.value = '';
}

function validarCampos() {
    if (!idfincas.value || !idempleado.value || !tipo.value || !horaInicio.value ||
        !horaFinal.value || !tempMin.value || !tempMax.value) {
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
    listarFincas();
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