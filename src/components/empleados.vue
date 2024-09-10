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
                                {{ accion == 1 ? "Crear Empleado" : "Editar Empleado" }}
                            </div>
                            <q-space />
                            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                        </q-card-section>
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
            <q-table title="Empleados" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useEmpleado.loading">
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
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
const formulario = ref(null);

let id = ref("")
const nombre = ref("");
const numdocumento = ref("");
const correo = ref("");
const direccion = ref("");
const telefono = ref("");
const estudios = ref("");
const descripcion = ref("");


async function crear() {
    if (!validarCampos()) return;
    try {
        const empleadoData = {
            nombre: nombre.value,
            numdocumento: numdocumento.value,
            correo: correo.value,
            direccion: direccion.value,
            telefono: telefono.value,
            estudios: estudios.value,
            descripcion: descripcion.value
        };

        await useEmpleado.postEmpleado(empleadoData);
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear el empleado!',
            position: "center",
            color: "red"
        });
    } finally {
        Notify.create({
            message: '¡Empleado creado existosamente!',
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
    try {
        await useEmpleado.putEmpleado(id.value, {
            nombre: nombre.value,
            numdocumento: numdocumento.value,
            correo: correo.value,
            direccion: direccion.value,
            telefono: telefono.value,
            estudios: estudios.value,
            descripcion: descripcion.value
        });

        Notify.create({
            message: 'Empleado actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el empleado',
        });
        console.error('Error al modificar el empleado', error);
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
    const r = await useEmpleado.listarEmpleados();
    rows.value = r.data.empleados;
}
async function listarActivos() {
    const r = await useEmpleado.getEmpleadosActivos();
    console.log(r.data.empleados);
    rows.value = r.data.empleados;
}
async function listarInactivos() {
    const r = await useEmpleado.getEmpleadosInactivos();
    console.log(r.data.empleados);
    rows.value = r.data.empleados;

}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

//APARTADO DE TRAER LOS DATOS =============================


//ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(empleados) {

    const r = await useEmpleado.putEmpleadosDesactivar(empleados._id)
        .then((response) => {
            Notify.create({
                message: 'Empleado Desactivado correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(empleados) {
    const r = await useEmpleado.putEmpleadosActivar(empleados._id)
        .then((response) => {
            Notify.create({
                message: 'Empleado activado correctamente!',
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
        name: 'nombre',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'correo',
        required: true,
        label: 'Correo',
        align: 'center',
        field: 'correo',
        sortable: true
    },
    {
        name: 'numdocumento',
        required: true,
        label: 'Documento',
        align: 'center',
        field: 'numdocumento',
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
        name: 'telefono',
        required: true,
        label: 'Telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'estudios',
        required: true,
        label: 'Estudios',
        align: 'center',
        field: 'estudios',
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
    nombre.value = '';
    numdocumento.value = '';
    correo.value = '';
    direccion.value = '';
    telefono.value = '';
    estudios.value = '';
    descripcion.value = '';
}

function validarCampos() {
    if (!nombre.value || !numdocumento.value || !correo.value ||
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