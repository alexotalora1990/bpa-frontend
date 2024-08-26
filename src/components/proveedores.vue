<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Proveedor</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Proveedor" : "Editar Proveedor" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>
                    <q-input outlined v-model="nombre" label="Nombre del Proveedor" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="correo" label="Correo" class="q-my-md q-mx-md" type="email" />
                    <q-input outlined v-model="direccion" label="Dirección" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="telefono" label="Teléfono" class="q-my-md q-mx-md" type="text" />
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
            <q-table title="Proveedores" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useProveedor.loading">
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
import { useProveedoresStore } from "../store/proveedores.js";
const useProveedor = useProveedoresStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let id = ref("")
const nombre = ref("");
const correo = ref("");
const direccion = ref("");
const telefono = ref("");

async function crear() {
    if (!validarCampos()) return;

    try {
        const proveedorData = {
            nombre: nombre.value,
            correo: correo.value,
            direccion: direccion.value,
            telefono: telefono.value
        };

        await useProveedor.postProveedor(proveedorData);
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear el proveedor!',
            position: "center",
            color: "red"
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}

function traerDatos(proveedores) {
    alert.value = true;
    accion.value = 2;
    id.value = proveedores._id;
    nombre.value = proveedores.nombre;
    correo.value = proveedores.correo;
    direccion.value = proveedores.direccion;
    telefono.value = proveedores.telefono;
}

async function editar() {
    if (!validarCampos()) return;
    try {
        await useProveedor.putProveedor(id.value, {
            nombre: nombre.value,
            correo: correo.value,
            direccion: direccion.value,
            telefono: telefono.value
        });

        Notify.create({
            message: 'Proveedor actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el proveedor',
        });
        console.error('Error al modificar el proveedor', error);
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
    const r = await useProveedor.listarProveedores();
    rows.value = r.data.proveedores;
}
async function listarActivos() {
    const r = await useProveedor.getProveedoresActivos();
    rows.value = r.data.proveedores;
}
async function listarInactivos() {
    const r = await useProveedor.getProveedoresInactivos();
    rows.value = r.data.proveedores;
}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

//APARTADO DE TRAER LOS DATOS =============================


//ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(proveedores) {
    const r = await useProveedor.putProveedoresDesactivar(proveedores._id)
        .then(() => {
            Notify.create({
                message: 'Proveedor desactivado correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error:', error);
        });
}

async function activar(proveedores) {
    const r = await useProveedor.putProveedoresActivar(proveedores._id)
        .then(() => {
            Notify.create({
                message: 'Proveedor activado correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error:', error);
        });
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
        label: 'Teléfono',
        align: 'center',
        field: 'telefono',
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
    correo.value = '';
    direccion.value = '';
    telefono.value = '';
}

function validarCampos() {
    if (!nombre.value || !correo.value || !direccion.value || !telefono.value) {
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