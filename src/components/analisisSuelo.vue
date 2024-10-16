<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Empleado</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-form ref="formulario" @submit.prevent="modify">
                <q-dialog v-model="alert" persistent>
                    <q-card style="width: 700px">
                        <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                            <div class="text-h6 text-white">
                                {{ accion == 1 ? "Crear Analisis" : "Editar Analisis" }}
                            </div>
                            <q-space />
                            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                        </q-card-section>
                        <q-select outlined v-model="idfinca" label="Seleccione una Finca" :options="options"
                            class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space
                            :rules="[(val) => !!val || 'Este campo es requerido']" />
                        <q-input outlined v-model="nombre" label="Nombre del Empleado" class="q-my-md q-mx-md"
                            type="text" :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="numdocumento" label="Numero de Documento" class="q-my-md q-mx-md"
                            type="text" :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 8 || 'Debe tener al menos 8 caracteres',
                                (val) => /^[0-9]*$/.test(val) || 'Solo se permiten numeros'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="correo" label="Correo" class="q-my-md q-mx-md" type="email" :rules="[
                            (val) => !!val || 'Este campo es requerido',
                            (val) => !!val.trim() || 'Este campo no puede estar vacío',
                            (val) => /.+@.+\..+/.test(val) || 'Formato de correo no válido'
                        ]" hide-bottom-space />

                        <q-input outlined v-model="direccion" label="Dirección" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 5 || 'Debe tener al menos 5 caracteres'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="telefono" label="Teléfono" class="q-my-md q-mx-md" type="number"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length === 10 || 'El número debe tener exactamente 10 caracteres',
                                (val) => /^[0-9]*$/.test(val) || 'Solo se permiten números'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="estudios" label="Estudios" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="descripcion" label="Descripción" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 10 || 'Debe tener al menos 10 caracteres'
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
            <q-table title="Analisis de Suelos" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useAnalisis.loading">
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
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();
import { useParcelaStore } from "../store/parcelas.js";
const useParcela = useParcelaStore();
import { useAnalisisStore } from '../store/analisisSuelo.js';
const useAnalisis = useAnalisisStore();


const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

const formulario = ref(null);
let parcelas = []
let empleados = []
let options = ref(parcelas)
let opciones = ref(empleados)

let id = ref("")
let idparcela = ref('');
let idempleado = ref('');
const nombre = ref("");
const numdocumento = ref("");
const correo = ref("");
const direccion = ref("");
const telefono = ref("");
const estudios = ref("");
const descripcion = ref("");



async function crear() {
    if (!validarCampos()) { return; }
    const res = await useEmpleado.postEmpleado({
        idfinca: idfinca.value.value,
        nombre: nombre.value,
        numdocumento: numdocumento.value,
        correo: correo.value,
        direccion: direccion.value,
        telefono: telefono.value,
        estudios: estudios.value,
        descripcion: descripcion.value
    });
    if (res == true) {
        Notify.create({
            message: 'Empleado creado exitosamente!',
            position: "center",
            color: "green"
        });
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}

function traerDatos(empleados) {
    alert.value = true;
    accion.value = 2;
    id.value = empleados._id;
    idfinca.value = {
        label: empleados.idfinca.nombre,
        value: empleados.idfinca._id
    }
    nombre.value = empleados.nombre;
    numdocumento.value = empleados.numdocumento;
    correo.value = empleados.correo;
    direccion.value = empleados.direccion;
    telefono.value = empleados.telefono;
    estudios.value = empleados.estudios;
    descripcion.value = empleados.descripcion;
}

async function editar() {
    if (!validarCampos()) return;
    const res = await useEmpleado.putEmpleado(id.value, {
        idfinca: idfinca.value.value,
        nombre: nombre.value,
        numdocumento: numdocumento.value,
        correo: correo.value,
        direccion: direccion.value,
        telefono: telefono.value,
        estudios: estudios.value,
        descripcion: descripcion.value
    });
    if (res == true) {
        Notify.create({
            message: 'Empleado actualizado correctamente!',
            position: "center",
            color: "green"
        });
        listarTodo();
        limpiarCampos();
        cerrar();
    }
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

async function listarTodo(){
    const r = await useAnalisis.listarAnalisis();
    rows.value = r.data;
}

async function listarActivos() {
    const r = await useAnalisis.getAnalisisActivos();
    console.log(r.data);
    rows.value = r.data;
}
async function listarInactivos() {
    const r = await useAnalisis.getAnalisisInactivos();
    console.log(r.data);
    rows.value = r.data;
}
const listarParcelas = async () => {
    const data = await useParcela.getParcelasActivos();
    parcelas.value = data.data.parcelaActiva.map(item => ({
        label: item.numero,
        value: item._id
    }));
    options.value = parcelas.value;
    console.log('Parcelas:', parcelas.value);
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
function filter1(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = parcelas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}

function filter2(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = empleados.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}

// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

//APARTADO DE TRAER LOS DATOS =============================


//ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(analisis) {

    const r = await useAnalisis.putAnalisisDesactivar(analisis._id)
        .then((response) => {
            Notify.create({
                message: 'Analisis Desactivado correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de Analisis:', error);
        })
}
async function activar(analisis) {
    const r = await useAnalisis.putAnalisisActivar(analisis._id)
        .then((response) => {
            Notify.create({
                message: 'Analisis activado correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de Analisis:', error);
        })

}
//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
    {
        name: 'numero',
        required: true,
        label: 'Parcela',
        align: 'center',
        field: (row) => row.idparcela.numero,
        sortable: true
    },
    {
        name: 'nombre',
        required: true,
        label: 'Empleado',
        align: 'center',
        field: (row) => row.idempleado.nombre,
        sortable: true
    },
    {
        name: 'muestra',
        required: true,
        label: 'Muestra',
        align: 'center',
        field: 'muestra',
        sortable: true
    },
    {
        name: 'cultivo',
        required: true,
        label: 'Cultivo',
        align: 'center',
        field: 'cultivo',
        sortable: true
    },
    {
        name: 'laboratorio',
        required: true,
        label: 'Laboratorio',
        align: 'center',
        field: 'laboratorio',
        sortable: true
    },
    {
        name: 'recomendaciones',
        required: true,
        label: 'Recomendaciones',
        align: 'center',
        field: 'recomendaciones',
        sortable: true
    },
    {
        name: 'fecha',
        required: true,
        label: 'fecha',
        align: 'center',
        field: 'createdAt',
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
    idfinca.value = "";
    nombre.value = '';
    numdocumento.value = '';
    correo.value = '';
    direccion.value = '';
    telefono.value = '';
    estudios.value = '';
    descripcion.value = '';
}

function validarCampos() {
    if (!idfinca.value || !nombre.value || !numdocumento.value || !correo.value ||
        !direccion.value || !telefono.value || !estudios.value || !descripcion.value) {
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
    listarEmpleados();
    listarParcelas();
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