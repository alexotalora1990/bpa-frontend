<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Comprador</q-btn>
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
                                {{ accion == 1 ? "Crear Compra" : "Editar Compra" }}
                            </div>
                            <q-space />
                            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                        </q-card-section>
                        <q-select outlined v-model="idproduccion" label="Seleccione una Producción" :options="options"
                            class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space
                            :rules="[(val) => !!val || 'Este campo es requerido']" />

                        <q-input outlined v-model="nombre" label="Nombre del Comprador" class="q-my-md q-mx-md"
                            type="text" :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="telefono" label="Teléfono" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números',
                                (val) => val.length === 10 || 'Debe tener exactamente 10 dígitos'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="number"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => val >= 0 || 'La cantidad no puede ser negativa'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="numguiaTransporte" label="#Guía de Transporte"
                            class="q-my-md q-mx-md" type="text" :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="numloteComercial" label="#Lote Comercial" class="q-my-md q-mx-md"
                            type="text" :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío'
                            ]" hide-bottom-space />

                        <q-input outlined v-model="valor" label="Valor" class="q-my-md q-mx-md" type="number" :rules="[
                            (val) => !!val || 'Este campo es requerido',
                            (val) => val > 0 || 'Debe ser un valor positivo'
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
            <q-table title="Compradores" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useComprador.loading">
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
                        <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1"
                            :loading="useComprador.loading">
                            <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
                        <q-btn @click="activar(props.row)" v-else :loading="useComprador.loading">
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
import { useCompradorStore } from "../store/comprador.js";
const useComprador = useCompradorStore();
import { useProduccionStore } from "../store/produccion.js";
const useProduccion = useProduccionStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
const formulario = ref(null);

let producciones = []
let datos = {}
let options = ref(producciones)

let id = ref("")
let idproduccion = ref('');
let nombre = ref('');
let telefono = ref('');
let cantidad = ref('');
let numguiaTransporte = ref('');
let numloteComercial = ref('');
let valor = ref('');

async function crear() {
    if (!validarCampos()) { return; }
    const res = await useComprador.postCompradores({
        idproduccion: idproduccion.value.value,
        nombre: nombre.value,
        telefono: telefono.value,
        cantidad: cantidad.value,
        numguiaTransporte: numguiaTransporte.value,
        numloteComercial: numloteComercial.value,
        valor: valor.value,
    });
    if (res == true) {
        Notify.create({
            message: 'Comprador creado exitosamente!',
            position: "center",
            color: "green"
        });
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}

function traerDatos(comprador) {
    alert.value = true;
    accion.value = 2;
    id.value = comprador._id;
    idproduccion.value = {
        label: comprador.idproduccion.especie,
        value: comprador.idproduccion._id
    }
    nombre.value = comprador.nombre;
    telefono.value = comprador.telefono;
    cantidad.value = comprador.cantidad;
    numguiaTransporte.value = comprador.numguiaTransporte;
    numloteComercial.value = comprador.numloteComercial;
    valor.value = comprador.valor;
}

async function editar() {
    if (!validarCampos()) return;
    const res = await useComprador.putCompradores(id.value, {
        idproduccion: idproduccion.value.value,
        nombre: nombre.value,
        telefono: telefono.value,
        cantidad: cantidad.value,
        numguiaTransporte: numguiaTransporte.value,
        numloteComercial: numloteComercial.value,
        valor: valor.value
    });
    if (res == true) {
        Notify.create({
            message: 'Comprador actualizado correctamente!',
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
    const r = await useComprador.listarCompradores();
    rows.value = r.data.compradores;
}
async function listarActivos() {
    const r = await useComprador.getCompradoresActivos();
    console.log(r.data.compradores);
    rows.value = r.data.compradores;
}
async function listarInactivos() {
    const r = await useComprador.getCompradoresInactivos();
    console.log(r.data.compradores);
    rows.value = r.data.compradores;
}
async function listarProducciones() {
    const data = await useProduccion.getProduccionesActivos()
    data.data.produccionActiva.forEach(item => {
        datos = {
            label: item.especie,
            value: item._id
        }
        producciones.push(datos)
    })
    console.log(producciones);
}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = producciones.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

async function desactivar(producciones) {
    const r = await useComprador.putCompradoresDesactivar(producciones._id)
        .then((response) => {
            Notify.create({
                message: 'Comprador Desactivado correctamente!',
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
    const r = await useComprador.putCompradoresActivar(producciones._id)
        .then((response) => {
            Notify.create({
                message: 'Comprador activado correctamente!',
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
        name: 'idproduccion',
        required: true,
        label: 'Especie',
        align: 'center',
        field: (row) => row.idproduccion.especie,
        sortable: true
    },
    {
        name: 'Nombre',
        required: true,
        label: 'Comprador',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'Telefono',
        required: true,
        label: 'Telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'Cantidad',
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
        sortable: true
    },
    {
        name: 'numguiaTransporte',
        required: true,
        label: '# Guia transporte',
        align: 'center',
        field: 'numguiaTransporte',
        sortable: true
    },
    {
        name: 'Lote Comercial',
        required: true,
        label: 'Lote Comercial',
        align: 'center',
        field: 'numloteComercial',
        sortable: true
    },
    {
        name: 'Valor',
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
    idproduccion.value = '';
    nombre.value = '';
    telefono.value = '';
    cantidad.value = '';
    numguiaTransporte.value = '';
    numloteComercial.value = '';
    valor.value = '';
}

function validarCampos() {
    if (!idproduccion.value || !nombre.value || !telefono.value || !cantidad.value ||
        !numguiaTransporte.value || !numloteComercial.value || !valor.value) {
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
    listarProducciones()
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